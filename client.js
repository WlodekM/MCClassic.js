import { createServer as createServerMCP } from 'minecraft-classic-protocol';
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

    async connect(options) {
        this._server = createServerMCP(options)
        this.settings = options

        const modules = await requireIndex(join(__dirname, 'src', 'modules'))
        this.modules = modules

        let sortedModules = Object.keys(modules)
            .filter(moduleName => modules[moduleName].server !== undefined)
            .sort((a, b) => {(a?.settings?.priority ?? 1) - (b?.settings?.priority ?? 1)});
        
        for (let i = 0; i < sortedModules.length; i++) {
            const moduleName = sortedModules[i]
            modules[moduleName].server(this, options)
        }

        const plugins = await requireIndex(join(__dirname, '', 'plugins'))
        this.plugins = plugins

        this._server.on('error', error => this.emit('error', error))
        this._server.on('clientError', error => this.emit('error', error))
        this._server.on('listening', () => this.emit('listening', this._server.socketServer.address().port))
        this.emit('asap')
    }
}