// Module-owned data managers
export { createRSSDataManager, type RSSDataManager } from './lib/rss-data-manager';

// Legacy exports (temporary, until everything is fully dynamic)
export * from './context/RSSContext';
export * from './pages/RSSPage';

import { IModule, RendererRegistrar, ScopedAPI } from '@citadel-app/core';
import React, { lazy } from 'react';
import { RSSProvider } from './context/RSSContext';
import { RssModuleBindings } from './lib/module-bindings';
import pkg from '../../package.json';

export const RssModule: IModule = {
    id: pkg.name,
    version: pkg.version,
    ipcs: [],
    permissions: {
        ipc: [
            '@citadel-app/base:fs.readFile',
            '@citadel-app/base:fs.writeFile',
            '@citadel-app/base:fs.exists',
            '@citadel-app/base:fs.createDirectory',
            '@citadel-app/base:app.updateSetting',
            '@citadel-app/base:net.fetch',
            '@citadel-app/base:db.getFeedItems',
            '@citadel-app/base:db.saveFeedItems',
            '@citadel-app/base:db.getFeedStatus',
            '@citadel-app/base:db.updateFeedStatus'
        ]
    },

    settingsConfig: {
        title: "RSS Feed Tracker",
        fields: [
            {
                id: "refreshInterval",
                label: "Background Refresh Interval",
                description: "How often should Citadel poll external RSS endpoints in minutes.",
                type: "number",
                defaultValue: 15
            },
            {
                id: "maxItemsPerFeed",
                label: "Max Saved Items per Feed",
                description: "The rolling threshold above which older unread feed items are discarded.",
                type: "number",
                defaultValue: 200
            }
        ]
    },

    providers: [
        { entry: { id: 'rss-provider', scope: 'global', priority: 100 }, component: RSSProvider }
    ],

    globalComponents: [],

    routes: [
        { path: '/rss', component: lazy(() => import('./pages/RSSPage').then(m => ({ default: m.RSSPage }))) }
    ],

    navigationItems: [
        {
            id: 'nav-rss',
            label: 'RSS Feeds',
            path: '/rss',
            icon: 'Rss',
            activeClass: 'text-primary bg-primary/10',
            inactiveClass: 'text-orange-500 hover:bg-orange-500/10',
            priority: 10
        }
    ],

    linkSearchProviders: [
        {
            id: 'rss-search',
            label: 'RSS Feeds',
            search: async (query: string) => {
                if (!RssModuleBindings.search) return [];
                return RssModuleBindings.search(query);
            }
        }
    ],

    crossLinkHandlers: [
        {
            id: 'rss-cross-link',
            handleLinkCompleted: async (targets, sourceLink, extraData) => {
                // If a user links "from" an RSS Feed Item "to" an Entry
                if (sourceLink.type === 'rss-item' && extraData?.feedId && RssModuleBindings.linkResolver) {
                    // For each target entry that was linked, bind the item back to the entry
                    for (const target of targets) {
                         RssModuleBindings.linkResolver(extraData.feedId, sourceLink.id, target);
                    }
                }
            }
        }
    ],

    onRendererActivate: async (registrar: RendererRegistrar, _api: ScopedAPI) => {
        registrar.registerPluginSettingsConfig({
            title: 'Feeds (RSS)',
            fields: [
                {
                    id: 'rssRefreshInterval',
                    label: 'RSS Refresh Interval',
                    type: 'select',
                    defaultValue: 7200000,
                    options: [
                        { label: 'Manual Only', value: 0 },
                        { label: 'Every Hour', value: 3600000 },
                        { label: 'Every 2 Hours (Default)', value: 7200000 },
                        { label: 'Every 6 Hours', value: 21600000 },
                        { label: 'Every 12 Hours', value: 43200000 },
                        { label: 'Every 24 Hours', value: 86400000 }
                    ]
                },
                {
                    id: 'feedRefreshBatchSize',
                    label: 'Update Batch Size',
                    description: 'Controls how many feeds are processed before the UI updates.',
                    type: 'number',
                    defaultValue: 5
                }
            ]
        });
    }
};
