const { Client, GuildMember } = require('discord.js')

/** 
 * Envoies des messages quand un utilisateur rejoint le serveur
 * @param { object } param0 
 * @param { Client } [param0.client] 
 * @param { GuildMember } [param0.member] 
 */
module.exports = ({ client, params: [{ user, guild }] }) => {
	if (guild.id !== '713172382042423352' || user.bot) return

	try {
		guild.channels.cache.get('713309212855238707').send({
			embed: {
				color: client.colors.default,
				description: ["**`| `** Bienvenue sur notre serveur d'entraide " + user.toString() + ' !\n', "• Redirigez vous vers nos salons d'aides si vous avez besoins."].join('\n'),
				thumbnail: { url: user.displayAvatarURL({ dynamic: true }) }
			}
		})

		user.send({
			embed: {
				color: client.colors.default,
				author: { name: "Bienvenue sur notre serveur d'entraide !", icon_url: guild.iconURL({ dynamic: true }) },
				description: "**`| ` Enchantée, je suis Sucrose, celle qui s'occupe du bon fonctionnement de ce serveur.**",
				fields: [
					"**•** Vous avez de **multiples aides** disponibles dans de nombreux salons de notre serveur, n'hésitez pas à expliquer votre problème dans les **salons helps**. Pensez également à regarder **nos salons 'tutoriaux'**, ils répondront peut-être directement à vos questions.",
					'**•** Vous possédez déjà un **bot Discord** ? Vous pouvez demander à le faire **tester** par notre équipe de testeurs, vous serez en contact avec eux pendant toute la durée du test. Vous recevrez leurs critiques **3-4 jours après la demande**.',
					"**•** Si vous avez un **bot Discord** et un **serveur support** qui lui est destiné : nous vous proposons d'entrer dans notre **projet d'entraide**. Il vise à rassembler **divers serveurs** de bots afin de s'entraider ensemble. Si vous voulez plus d'informations, demandez-moi."
				].map((value) => ({ name: '\u200B', value })),
				image: { url: 'https://i.imgur.com/H9oiogz.png' },
				footer: { text: 'Contactez-moi ici en cas de problème, je vous mettrais en contact avec le staff.' }
			}
		})
	} catch (err) {}
}
