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
			status: "online"
		})
		var logsID = "635300240819486732"
		console.log("Custom Status Set")
		console.log("🟢 Bit Core: 4.0.0m Online! Logged in as "+client.user.tag)
		console.log('==== Have a good day! ====');
	},
};
