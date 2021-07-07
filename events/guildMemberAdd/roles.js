const { GuildMember } = require('discord.js')

/** 
 * Envoies des messages quand un utilisateur rejoint le serveur
 * @param { object } param0  
 * @param { GuildMember } [param0.member] 
 */
module.exports = ({ params: [member] }) => {
	if (member.guild.id === '713172382042423352') member.roles.add(member.user.bot ? '713172824776376404' : '713176443818868738')
}
