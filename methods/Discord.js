const Discord = require('discord.js')

/**
 * @param { string } content 
 * @returns 
 */
Discord.Message.prototype.sendError = function (content, { remove } = {}) {
	const message = this.channel.send(`${this.author} **\` | ❌ ${content}\`**`)
	if (remove) message.then((_) => _.delete({ timeout: 6000 }).catch(() => null), () => null)
	return message
}
