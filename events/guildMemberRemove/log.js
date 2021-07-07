const { GuildMember } = require('discord.js')

/** 
 * @param { object } param0  
 * @param { GuildMember } [param0.member] 
 */
module.exports = ({ params: [{ user, guild }] }) => {
	if (guild.id === '713172382042423352' && !user.bot) guild.channels.cache.get('713309212855238707').send('**`| ` ' + user.tag + ' est parti(e).**')
}
