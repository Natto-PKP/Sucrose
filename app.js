const { readFileSync } = require('fs')
const client = new (require('discord.js')).Client({ partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'USER', 'REACTION'] })

client.on('ready', () => console.log(0))

client.login(readFileSync('./token.txt').toString())
