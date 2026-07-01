import fs from 'fs-extra';
import path from 'path';
import { Logger } from './logger.js';

/**
 * Dynamic Plugin Loader
 * Automatically loads all plugins from the plugins folder
 */
export class PluginLoader {
  constructor(pluginFolder = './plugins') {
    this.pluginFolder = pluginFolder;
    this.plugins = new Map();
    this.categories = new Set();
  }

  async loadPlugins() {
    try {
      // Ensure plugin folder exists
      fs.ensureDirSync(this.pluginFolder);

      const folders = fs.readdirSync(this.pluginFolder);
      let totalLoaded = 0;

      for (const folder of folders) {
        const folderPath = path.join(this.pluginFolder, folder);
        const stats = fs.statSync(folderPath);

        if (!stats.isDirectory()) continue;

        const files = fs.readdirSync(folderPath);

        for (const file of files) {
          if (!file.endsWith('.js')) continue;

          try {
            const filePath = path.join(folderPath, file);
            const plugin = await import(`file://${filePath}`);
            const pluginData = plugin.default || plugin;

            // Validate plugin structure
            if (!pluginData.name || !pluginData.execute) {
              Logger.warn(`Plugin ${file} missing required fields`);
              continue;
            }

            // Register plugin
            const key = pluginData.name.toLowerCase();
            this.plugins.set(key, pluginData);
            this.categories.add(pluginData.category || 'uncategorized');
            totalLoaded++;
          } catch (error) {
            Logger.error(`Failed to load plugin ${file}: ${error.message}`);
          }
        }
      }

      Logger.success(`Loaded ${totalLoaded} plugins`);
      return totalLoaded;
    } catch (error) {
      Logger.error(`Plugin loader error: ${error.message}`);
      return 0;
    }
  }

  getPlugin(name) {
    return this.plugins.get(name.toLowerCase());
  }

  getPluginsByCategory(category) {
    return Array.from(this.plugins.values()).filter(
      plugin => plugin.category === category
    );
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  getCategories() {
    return Array.from(this.categories);
  }

  getPluginCount() {
    return this.plugins.size;
  }
}

export default PluginLoader;
