// Modules
const { readFileSync, readdirSync, existsSync, lstatSync } = require('fs')
const { Client } = require('discord.js')

const client = new Client({ partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'USER', 'REACTION'] }) // Construction du client

// Propriétés customs
client.colors = { default: '#C6E6C1' }

/**
 * | Handler des prototypes
 * Methodes custom sur divers classes.
 */
readdirSync('./methods').forEach((file) => require('./methods/' + file))

/**
 * | Handler de commandes
*/
client.commands = readdirSync('./commands').filter((file) => lstatSync('./commands/' + file).isFile() && file.endsWith('.js')).map((file) => {
	const expt = require('./commands/' + file)
	if (expt.options.modules) {
		const dir = file.split('.')[0]
		expt.options.modules = readdirSync('./commands/' + dir).filter((mdl) => lstatSync('./commands/' + dir + '/' + mdl).isFile() && mdl.endsWith('.js')).map((mdl) => {
			const sub = require('./commands/' + dir + '/' + mdl)
			sub.options.parent = expt.options.name
			return sub
		})
	}
	return expt
})

console.log('[SYSTEM]: ' + client.commands.length + ' commandes chargées.')

/**
 * | Handler d'évent
 * Regarde les dossiers du dossier events et charge tout les index.js ou modules de l'évent.
 */
readdirSync('./events').forEach((event) => {
	if (existsSync('./events/' + event + '/index.js')) {
		client.on(event, (...params) => require('./events/' + event + '/index.js')({ client, params }))
		console.log('[SYSTEM]: Évent "' + event + '" correctement chargé.')
	} else {
		const mdls = readdirSync('./events/' + event).map((file) => ({ name: file.split('.')[0], expt: require('./events/' + event + '/' + file) }))
		client.on(event, (...params) => mdls.forEach(({ expt }) => expt({ client, params })))
		console.log('[SYSTEM]: Modules [' + mdls.map(({ name }) => name).join(', ') + '] de l\'évent "' + event + '" correctement chargés.')
	}
})

// Connexion du client à l'api
client.login(readFileSync('./token.txt').toString())
