const { Client } = require('discord.js')

/**
 * @param { object } param0 
 * @param { Client } [param0.client] 
 */
module.exports = ({ client }) => console.log(['____________________\n', '[' + client.user.username + ']: Je suis présente et prête ! o7'].join('\n'))
