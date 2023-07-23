const { EmbedBuilder } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'inviteCreate',
	execute(invite) {
        const client = invite.client

		var logsID = "635300240819486732"
		var currentDate = Date.now()
		currentDate = currentDate/1000
		var inviteEnd

		if(invite.maxAge === 0) {
		} else {
			inviteEnd = Math.floor(currentDate+invite.maxAge)
		}

		const embed = new EmbedBuilder()
			.setColor(embedColor)
			if(invite.maxAge === 0) {
				embed.setDescription("An infinite invite was created by "+invite.inviter.username+", and has "+invite.maxUses+" max uses\nhttps://discord.gg/"+invite.code);
			} else {
				embed.setDescription("An invite was created by "+invite.inviter.username+", it will end <t:"+inviteEnd+":R> and has "+invite.maxUses+" max uses\nhttps://discord.gg/"+invite.code);
			}
			embed.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] });
		return;
	},
};