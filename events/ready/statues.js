const { Client } = require('discord.js')

const _counts = require('../../documents/counts.json')

/** 
 * @param { object } param0 
 * @param { Client } [param0.client]  
 */
module.exports = ({ client }) => {
	const refresh = () => {
		const presences = [{ activity: { name: 'ses messages privés', type: 'WATCHING' } }, { activity: { name: _counts.tickets + ' tickets', type: 'WATCHING' } }]
		client.user.setPresence({ status: 'online', ...presences.random() })
		setTimeout(() => refresh(), 6e4)
	}

	refresh()
}
