// Module-owned data managers
export { createRSSDataManager, type RSSDataManager } from './lib/rss-data-manager';

// Legacy exports (temporary, until everything is fully dynamic)
export * from './context/RSSContext';
export * from './pages/RSSPage';

import { definePlugin } from '@citadel-app/sdk';
import React, { lazy } from 'react';
import { RSSProvider } from './context/RSSContext';
import { RssModuleBindings } from './lib/module-bindings';
import pkg from '../../package.json';

export const RssModule = definePlugin({
    id: pkg.name,
    version: pkg.version,

    renderer: {
        providers: [
            { entry: { id: 'rss-provider', scope: 'global', priority: 100 }, component: RSSProvider }
        ],

        routes: [
            { path: '/rss', component: lazy(() => import('./pages/RSSPage').then(m => ({ default: m.RSSPage }))) }
        ],

        navigation: [
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
                handleLinkCompleted: async (targets: any, sourceLink: { type: string; id: string; }, extraData: { feedId: string; }) => {
                    if (sourceLink.type === 'rss-item' && extraData?.feedId && RssModuleBindings.linkResolver) {
                        for (const target of targets) {
                             RssModuleBindings.linkResolver(extraData.feedId, sourceLink.id, target);
                        }
                    }
                }
            }
        ],

        settingsConfig: {
            title: 'Feeds (RSS)',
            fields: [
                {
                    id: 'rssRefreshInterval',
                    label: 'RSS Refresh Interval',
                    type: 'select',
                    defaultValue: 21600000,
                    options: [
                        { label: 'Manual Only', value: 0 },
                        { label: 'Every Hour', value: 3600000 },
                        { label: 'Every 2 Hours', value: 7200000 },
                        { label: 'Every 6 Hours (Default)', value: 21600000 },
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
        }
    }
});

