import mcp from 'minecraft-classic-protocol'
const createServerMCP = mcp.createServer
import {
    protocol
} from 'minecraft-classic-protocol-extension'
import {
    join,
} from 'path'
import { __dirname } from "./dirname.js"

import { EventEmitter } from 'events'
import requireIndex from './lib/ri.js'

export let createServer = async (options = {}) => {
    options.customPackets = protocol

    const server = new MCServer()
    await server.connect(options)

    return server
}

class MCServer extends EventEmitter {
    constructor() {
        super()
        this._server = null
    }

    connect(options) {
        this._server = createServerMCP(options)
        console.debug(join(__dirname, 'src', 'modules'), join(__dirname, '', 'plugins'))

        const modules = requireIndex(join(__dirname, 'src', 'modules'))

        Object.keys(modules)
            .filter(moduleName => modules[moduleName].server !== undefined)
            .forEach(moduleName => modules[moduleName].server(this, options))

        const plugins = requireIndex(join(__dirname, '', 'plugins'))

        Object.keys(plugins)
            .filter(pluginName => plugins[pluginName].server !== undefined)
            .forEach(pluginName => plugins[pluginName].server(this, options))


        this._server.on('error', error => this.emit('error', error))
        this._server.on('clientError', error => this.emit('error', error))
        this._server.on('listening', () => this.emit('listening', this._server.socketServer.address().port))
        this.emit('asap')
    }
}