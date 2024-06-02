#!/usr/bin/env node

const {
    createServer
} = require('./client.js')
const fs = require('fs')
const ini = require('ini')

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

createServer({
    'port': config.general.port,
    'name': config.general.name,
    'motd': config.general.motd,
    'max-players': config.general.maxPlayers,
    'public': config.general.public,
    'online-mode': config.general.online,
    'disable-op-command': config.disableOp,
    'ops': config.general.ops,
    'plugins': {
        cosmetics: {}
    },
    'webhook': config.IRC.webhook,
    irc: {
        'token': config.IRC.token,
        'channels': config.IRC.channels,
        'password': config.IRC.password,
        'server': config.IRC.server,
        'nick': config.IRC.nick,
        'enabled': config.IRC.enabled,
    },
    'irc-token': config.IRC.token,
    'irc-channels': config.IRC.channels,
    // 'irc-channel': config.IRC.channel,
    'irc-password': config.IRC.password,
    'irc-server': config.IRC.server,
    'irc-nick': config.IRC.nick,
})