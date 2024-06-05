import Discord from "discord.js";
// Types
import { Message, GatewayIntentBits, Events, Client } from "discord.js";


export let server = function (server, settings) {
    server.modules.IRC = {}
    if(!settings.irc.token) return
    /**
     * @type {Client}
    */
    if(!settings.irc.enabled) return
    server.modules.IRC.bot = new Discord.Client({ intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    ] });
    server.modules.IRC.token = settings.irc.token

    /**
     * handle messages
     * @param {Message} message discord.js message
     */
    function handleMessage(message) {
        if(!message.content) return;
        if(message.author.bot) return;
        if(settings.irc.channels?.includes(String(message.channel.id))) {
            server.broadcast('[irc] ' + message.author.username + ': ' + message.content)
        }
    }
    server.modules.IRC.bot.on('ready', () => {
        console.log('Bot Online! Woohoo!');
    });

    server.modules.IRC.bot.on(Events.MessageCreate, handleMessage);
    server.modules.IRC.bot.login(server.modules.IRC.token);
    server.irc = {
        bot: null
    }
    server.irc.bot = server.modules.IRC.bot
}

export let player = function (player, server) {
    if(!server.settings.irc.enabled) return
    const ircSay = async (message) => {
        let channels = String(server.settings.irc.channels).split(";").filter(a => a)
        for (let i = 0; i < channels.length; i++) {
            const id = channels[i];
            let channel = await server.irc.bot.channels.fetch(id)
            channel?.send(message)
        }
    }
    player.on('chat', ({
        message
    }) => {
        ircSay(player.username + ': ' + message)
    })
    player.on('connected', () => ircSay(player.username + ' connected'))
    player.on('disconnected', () => ircSay(player.username + ' disconnected'))
}
/*const irc from 'irc'

export let server = function(server, settings) {
    this.irc = new irc.Client(this.settings['server'], this.settings.irc.nick, {
        channels: ['#' + this.settings.irc.channel],
        password: this.settings.irc.password,
        secure: true
    })
    this.irc.nick = this.settings.irc.nick
    this.irc._updateMaxLineLength()
    this.irc.addListener('message', (from, to, message) => server.broadcast('[irc] ' + from + ': ' + message))
    //if (this.settings.startingMessage) this.irc.say(this.settings.chan, this.settings.startingMessage)
    this.irc.addListener('error', message => console.log('error: ', message))
}

export let player = function(player, server) {
    const ircSay = (message) => this.irc.say(this.settings.irc.channel, '[mc] ' + message)
    player.on('chat', ({
        message
    }) => ircSay(player.username + ': ' + message))
    player.on('connected', () => ircSay(player.username + ' connected'))
    player.on('disconnected', () => ircSay(player.username + ' disconnected'))
}*/