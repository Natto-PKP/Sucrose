const { Client, Message } = require('discord.js')
const { writeFileSync } = require('fs')

const _tickets = require('../documents/tickets.json')

module.exports = {
	/** 
     * @param { object } param0  
     * @param { Client } [param0.client]  
     * @param { Message } [param0.message]  
     */
	exec: ({ client, message }) => {
		const ticket = _tickets.find(({ channel }) => channel === message.channel.id)
		if (!ticket) return

		message.channel.send({ embed: { color: client.colors.default, description: 'Cliquez sur ⛔ pour annulé la fermeture.' } }).then(async (msg) => {
			await msg.react('⛔')
			msg.awaitReactions((reaction, user) => reaction.emoji.name === '⛔' && user.id === message.author.id, { time: 1e4, max: 1 }).then((collected) => {
				if (collected.size) msg.edit({ embed: { color: client.colors.default, description: 'La fermeture est annulée.' } }).then(() => msg.reactions.removeAll())
				else {
					message.guild.members.cache.get(ticket.user)?.send({ embed: { color:client.colors.default, description: 'Votre ticket sur **' + message.guild.name + '** vient de se fermé.' } }).catch(() => null)
					message.channel.delete().catch(() => null)
					_tickets.splice(_tickets.findIndex(({ channel }) => channel === message.channel.id), 1)
					writeFileSync('./documents/tickets.json', JSON.stringify(_tickets))
				}
			}, () => null)
		})
	},
	options: { name: 'close', local: true }
}
