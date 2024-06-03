import Discord from "discord.js";
// Types
import { Message, GatewayIntentBits, Events, Client } from "discord.js";


export let server = function (server, settings) {
    console.log("yes s")
    /**
     * @type {Client}
    */
    server.settings = settings
    if(!settings.irc.enabled) return
    this.bot = new Discord.Client({ intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    ] });
    this.token = settings.irc.token

    /**
     * handle messages
     * @param {Message} message discord.js message
     */
    function handleMessage(message) {
        if(!message.content) return;
        if(message.author.bot) return;
        console.log('Message registered!');
        if(settings.irc.channels?.includes(String(message.channel.id))) {
            console.log(`message in ${message.channel.id}: ${message}`)
            server.broadcast('[irc] ' + message.author.username + ': ' + message.content)
        }
    }
    this.bot.on('ready', () => {
        console.log('Bot Online! Woohoo!');
    });

    this.bot.on(Events.MessageCreate, handleMessage);
    this.bot.login(this.token);
    server.irc = {
        bot: null
    }
    server.irc.bot = this.bot
}

export let player = function (player, server) {
    if(!server.settings.irc.enabled) return
    console.log(server.irc.bot.guilds.fetch, 'guilds')
    // console.log(settings.irc.channels, settings.irc.channels.forEach)
    const ircSay = async (message) => {
        console.log(server.settings.irc.channels)
        let channels = String(server.settings.irc.channels).split(";").filter(a => a)
        for (let i = 0; i < channels.length; i++) {
            const id = channels[i];
            // console.log(id, server.irc.bot.channels.fetch(id), message)
            console.log(id)
            let channel = await server.irc.bot.channels.fetch(id)
            channel?.send(message)
        }
    }
    player.on('chat', ({
        message
    }) => {
        console.log("chat")
        console.log(message)
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