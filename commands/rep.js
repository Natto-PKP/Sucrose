const { Client, Message } = require('discord.js')

const _tickets = require('../documents/tickets.json')

module.exports = {
	/** 
     * @param { object } param0  
     * @param { Client } [param0.client]  
     * @param { Message } [param0.message]  
     * @param { string } [param0.command]  
     */
	exec: ({ client, message, command }) => {
		const ticket = _tickets.find(({ channel }) => channel === message.channel.id)
		if (!ticket) return

		const member = message.guild.members.cache.get(ticket.user)
		if (member) {
			const err = () => message.channel.send({ embed: { color: client.colors.default, description: "L'utilisateur n'a pas pu recevoir (ce message)[https://discord.com/channels/713172382042423352/" + message.channel.id + '/' + message.id + ']' } })
			const content = message.content.slice(message.content.indexOf(command) + command.length).trimStart()
			if (content.length) member.send({ embed: { color: client.colors.default, description: content } }).then(() => message.react('✉'), err)
			if (message.attachments.size) member.send(message.attachments.array()).then(() => message.react('✉'), err)
		} else message.channel.send({ embed: { color: client.colors.default, description: "Le membre n'est plus sur notre serveur." } })
	},
	options: { name: 'rep', local: true }
}
