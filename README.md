# Citadel RSS Plugin

The official RSS & YouTube Feed plugin for the Citadel application framework.
This plugin enables fetching, parsing, and persisting of RSS feeds directly within Citadel workspaces.

## Features
- **RSS Parser**: Automatically fetches and extracts feed items using `rss-parser`.
- **YouTube Feed**: Deep integration with YouTube atom feeds to automatically generate entry cards.
- **Background Synchronization**: Integrates heavily with `@citadel-app/core`'s data pipeline for automated background updates.
- **Schema-Driven UI**: Injects a dynamically rendered `settingsConfig` directly into Citadel's native Plugin Manager to expose configuration controls like feed endpoints.
- **Isolated Node API**: Employs an exact manifest of strictly-owned IPC hooks to ensure secure, namespaced interactions with the host's backend filesystem.

## Architecture
Designed for `@citadel-app/core` v1.x+. 
This module leverages Citadel's decoupled plugin framework. It builds using Vite and relies strictly on externally verified peer dependencies executed dynamically by Citadel's frontend proxy boundary (`ScopedAPI`).

## Installation / Usage
This package is bundled as a runtime add-on. To install it into a Citadel workspace:
1. Open Citadel Settings > Plugins
2. Search and click **Install** using the registry identifier `@citadel-app/rss`.

## Development

Since this plugin operates independently from the monolithic source, it is decoupled from Citadel's primary development scripts and leverages the `citadel-plugin-sdk`.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the plugin for distribution:
   ```bash
   npm run build
   ```
   *Note: This generates separated `dist/main.js` and `dist/renderer.js` entry points optimized by Vite and Rollup.*
3. To manually debug changes, bundle the `/dist` artifacts and drop them locally inside your Citadel vault at `.codex/plugins/rss`.

## License
MIT
