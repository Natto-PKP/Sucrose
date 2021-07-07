const { Client } = require('discord.js')

const _counts = require('../../documents/counts.json')

/** 
 * @param { object } param0 
 * @param { Client } [param0.client]  
 */
module.exports = ({ client }) => {
	const guild = client.guilds.cache.get('713172382042423352')
	const helpersCh = guild.channels.cache.get('718547064539316347')
	const membersCh = guild.channels.cache.get('713308837288869898')

	const refresh = () => {
		helpersCh.setName(guild.roles.cache.get('713184246201581678').members.filter((member) => member.user.presence.status !== 'offline').size + ' helper(s) en ligne')
		membersCh.setName('[' + guild.members.cache.filter((member) => !member.user.bot).size + ' membres]')
		setTimeout(() => refresh(), 6e4)
	}

	refresh()
}
