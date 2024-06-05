import path from 'path';
import { __dirname } from "../../dirname.js"
import { pathToFileURL } from 'url';
/**
 * Converts an absolute file path to a file URI.
 * @param {string} filePath - The absolute file path to convert.
 * @returns {string} The file URI.
 */
function convertPathToFileURI(filePath) {
  // Convert the file path to a file URI
  const fileURI = pathToFileURL(filePath).href;
  return fileURI;
}


export let server = (server, settings) => {
    server.plugins = {}
    server.pluginCount = 0
    server.externalPluginsLoaded = false

    server.addPlugin = (name, plugin, set) => {
        if (!name || !plugin) throw new Error('You need a name and object for your plugin!')
        server.plugins[name] = {
            id: server.pluginCount,
            name: name,
            player: plugin.player,
            server: plugin.server,
            settings: set,
            enabled: true
        }
        server.pluginCount++
        if (server.externalPluginsLoaded && plugin.server) server.plugins[name].server(server, settings)
    }

    const loadPlugin = async (p) => {
        if (settings.plugins[p].disabled) return
        let pluginPath;
        try {
            pluginPath = path.resolve(__dirname, 'plugins', `${p/*5*/}.js`)
        } catch (err) {
            try {
                pluginPath = path.resolve(__dirname, `plugins/${p}`)
            } catch (err) {
                throw new Error(`Cannot find plugin "${p}"`)
            }
        }
        try {
            const pluginModule = await import(convertPathToFileURI(pluginPath))
            server.addPlugin(p, pluginModule, settings.plugins[p])
        } catch (err) {
            throw new Error(`Error loading plugin "${p}": ${err.message}`)
        }
    }

    Object.keys(settings.plugins).forEach(p => loadPlugin(p))

    Object.keys(server.plugins).forEach((p) => {
        if (server.plugins[p].server) server.plugins[p].server(server.plugins[p], server, settings)
    });

    server.on('asap', () => {
        Object.keys(server.plugins).map((p) => {
            server.log.info(`Plugin "${server.plugins[p].name}" loaded!`)
        })
    })

    server.externalPluginsLoaded = true
}

export let player = (player, server) => {
    Object.keys(server.plugins).forEach((p) => {
        const plugin = server.plugins[p]
        if (plugin.player) plugin.player(plugin, player, server)
    })
}