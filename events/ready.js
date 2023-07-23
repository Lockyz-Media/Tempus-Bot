module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		var logsID = "635300240819486732"
		/*client.channels.cache.get(logsID).send({ content: '🟢 Tempus Bot Base Online' })
		console.log('🟢 Tempus Bot Base Online')
		client.channels.cache.get(logsID).send({ content: '🟢 Tempus Bot Slash Commands System Online' })
		console.log('🟢 Tempus Bot commands system Online')
		client.channels.cache.get(logsID).send({ content: '🟢 Tempus Bot Logging System v2.0 Online' })
		console.log('🟢 Tempus Bot logging system v2.0 Online')
		client.channels.cache.get(logsID).send({ content: '🟢 Lockyz Dev Nitro Scam Detection and Elimination System Online' })
		console.log('🟢 Lockyz Dev Nitro Scam Detection and Elimination System Online')
		client.channels.cache.get(logsID).send({ content: '🟢 Tempus Bot Levelling System Online' })
		console.log('🟢 Tempus Bot Levelling System Online')
		client.channels.cache.get(logsID).send({ content: '🔴 Tempus Bot Auto-moderation System Offline' })
		console.log('🔴 Tempus Bot auto-moderation System Offline')
		client.channels.cache.get(logsID).send({ content: '🟢 Tempus Bot Welcome System Online' })
		console.log('🟢 Tempus Bot Welcome System Online')
		client.channels.cache.get(logsID).send({ content: '🟢 Tempus Bot partially Online! Logged in as '+ client.user.tag })*/
		console.log('🟢 Tempus Bot partially Online! Logged in as '+ client.user.tag)
	},
};
