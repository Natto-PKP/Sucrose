const { Client, Message } = require('discord.js')
const { writeFileSync } = require('fs')

const _tickets = require('../../documents/tickets.json')
const _counts = require('../../documents/counts.json')

const cooldowns = {}
const _prefix = 's!'
const emojis = ['📎', '🤖', '👔', '🧧', '❌']
const support = ['713188099949199411', '713188927049170965', '713184246201581678', '746744125444849756']

/** 
 * @param { object } param0 
 * @param { Client } [param0.client]
 * @param { [Message] } [param0.params]
 */
module.exports = async ({ client, params: [message] }) => {
	if (message.author.bot) return 

	const content = message.content.toLowerCase()
	if (message.guild) { 
		const reg = content.match(`^(<@!?${client.user.id}> (?= *)|${client.user.username.toLowerCase()} (?= *)|${_prefix}(?=[A-Za-z-]))`)
		if (!reg) return 

		const [prefix, command, ...args] = [reg[0], ...content.slice(reg[0].length).trimStart().split(/\s+/g)] 
		let expt = client.commands.find(({ options: { name, aliases } }) => [name, ...(aliases || [])].includes(command)) 
		if (expt) { 
			expt = expt.options.modules?.find(({ options: { name, aliases } }) => args.length && [name, ...(aliases || [])].includes(args[0])) || expt
			if (expt.options.local && message.guild.id !== '713172382042423352') return
			const cooldown = expt.options.cooldown || 1
			const key = (expt.options.parent || '') + expt.options.name + message.author.id
			if (cooldowns[key] && cooldowns[key] - Date.now() > 0) return message.channel.send(`${message.member} **\` |\`** ⏳ Vous devez attendre encore **${Math.ceil(cooldowns[key] - Date.now() / 1000)}** seconde(s).`)

			expt.exec({ client, message, prefix, command, args })
			cooldowns[key] = Date.now() + cooldown * 1e3
		}
	} else {
		const guild = client.guilds.cache.get('713172382042423352')
		if (!guild.members.cache.has(message.author.id)) return
		const color = client.colors.default

		const ticket = _tickets.find(({ user }) => user === message.author.id)
		if (ticket) {
			const channel = guild.channels.cache.get(ticket.channel)
			if (message.content.length) channel.send({ embed: { color, author: { name: '📨 Réponse de ' + message.author.username, icon_url: message.author.avatarURL({ dynamic: true }) }, description: message.content } })
			if (message.attachments.size) channel.send(message.attachments.array())
			message.react('✉')
		} else {
			if (content.length < 10) return message.channel.send('**`❌ |`** Votre demande doit faire plus de 10 caractères.')

			const reject = (_, reason) => {
				if (reason === 'idle') return message.channel.send({ embed: { color, description: "Votre demande a été annulée pour cause d'inactivité." } })
				if (reason === 'cancel') return message.channel.send({ embed: { color, description: 'Votre demande a bien été annulée.' } })
			}

			const menu = await message.channel.send({
				embed: {
					color,
					author: { icon_url: guild.iconURL({ dynamic: true }), name: 'Communication avec ' + guild.name },
					description: ['**`| `** Bienvenue dans notre **assistance**, sélectionnez votre catégorie.', '**•** La raison de votre demande doit être **claire** et **précise**. Elle doit contenir le sujet que vous souhaitez abordé avec notre staff.'].join('\n\n'),
					fields: [{ name: '\u200B', value: ['📎 **`| `** Demande de partenariat', '🤖 **`| `** Faire tester votre robot', '👔 **`| `** Recrutement', '🧧 **`| `** Autre demande'].join('\n\n') }],
					footer: { text: 'Cliquez sur ❌ pour annulé' }
				}
			})
			for (const e of emojis) await menu.react(e)
			const selector = menu.createReactionCollector((reaction, user) => !user.bot && emojis.includes(reaction.emoji.name), { idle: 3e5, max: 1 })

			selector.on('collect', async (reaction) => {
				const e = reaction.emoji.name
				if (e === '❌') return selector.stop('cancel')
				const icon_url = guild.iconURL({ dynamic: true })
				const link = {
					'👔': 'https://docs.google.com/forms/d/e/1FAIpQLScQEJFYVhAfuhuFYTs-gCHwae4sV2xtYwUhN-KIgSYgm_QEBw/viewform?usp=pp_url',
					'📎': 'https://docs.google.com/forms/d/e/1FAIpQLSc4kqooLIS5hF0qILcll0V9uF-fW0y0V5cySjLsKWA_x9bpLw/viewform?usp=pp_url',
					'🤖': 'https://docs.google.com/forms/d/e/1FAIpQLSf-IimCxvF7Cxa84T16Y2PmVOdb1V1GJxhwKcVLO5m6iAPH7A/viewform?usp=pp_url'
				}[e]
				const embed = { color, author: { icon_url, name: 'Confirmez votre demande.' }, fields: [{ name: '📨 La raison de votre ticket:', value: message.content }] }
				if (link) embed.fields.push({ name: '\u200B', value: '**•** Merci de remplir **obligatoirement** ce formulaire: [Google Form](' + link + ')' })
				const confirm = await message.channel.send({ embed })
				for (const e of ['⭕', '❌']) await confirm.react(e)
				const validator = confirm.createReactionCollector(({ emoji }, user) => !user.bot && ['⭕', '❌'].includes(emoji.name), { idle: 6e5, max: 1 })
				validator
					.on('collect', async ({ emoji }) => {
						if (emoji.name === '❌') return validator.stop('cancel')
						message.channel.send({
							embed: {
								color,
								author: { name: 'Votre demande a été envoyée.', icon_url },
								footer: { text: 'Le staff vous répondra dès que possible.' },
								image: { url: 'https://i.imgur.com/hE9d6Iw.png' },
								fields: [
									"**•** Vous allez être en contact avec le staff du serveur. Écrivez des phrases **complètes** et **claires** pour que notre staff comprenne facilement vos demandes. Privilégiez une **longue phrase** que plusieurs bout de phrases sur plusieurs messages. Évitez également d'utiliser des émotes personnalités, elles ne seront pas correctement transmise.",
									'**•** Les **attachements** peuvent aussi être envoyé. Vous pouvez donc envoyé des images, fichiers ou encore des dossiers compressés.'
								].map((value) => ({ name: '\u200B', value }))
							}
						})
						const channel = await guild.channels.create(message.author.username, {
							parent: '783069157780488192',
							topic: ++_counts.tickets + ' ' + message.author.id,
							permissionOverwrites: [{ id: guild.roles.everyone, deny: ['VIEW_CHANNEL'] }, ...support.map((id) => ({ id, allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES'] }))]
						})
						channel.send({ embed: { color, author: { iconURL: guild.iconURL({ dynamic: true }), name: 'Un utilisateur a ouvert un ticket.' }, description: message.content, fields: [guild.member(message.author).toString(), '**`Ici depuis:`** ' + guild.member(message.author).joinedAt.duration()].map((value) => ({ name: '\u200B', value, inline: true })) } })
						
						_tickets.push( { user: message.author.id, date: Date.now(), reason: message.content, channel: channel.id })
						writeFileSync('./documents/tickets.json', JSON.stringify(_tickets))
						writeFileSync('./documents/counts.json', JSON.stringify(_counts))
					})
					.on('end', reject)
			})

			selector.on('end', reject)
		}
	}
}
