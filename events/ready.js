const { ActivityType } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setPresence({
			activities: [{
				type: ActivityType.Custom,
				name: "Custom Status?",
				state: "Custom Status?"
			}]
		})
		var logsID = "635300240819486732"
		console.log('🟢 Tempus Bot partially Online! Logged in as '+ client.user.tag)
	},
};
