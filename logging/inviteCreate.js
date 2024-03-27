const { EmbedBuilder, Events } = require('discord.js');
const { embedColours, ownerID, tempusIDs } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: Events.InviteCreate,
	execute(invite) {
        const client = invite.client

		var logsID = tempusIDs.logs
		var currentDate = Date.now()
		currentDate = currentDate/1000
		var inviteEnd

		if(invite.maxAge === 0) {
		} else {
			inviteEnd = Math.floor(currentDate+invite.maxAge)
		}
		var inviter
		var useString

		if(invite.maxUses === 0){
			useString = " and has infinite uses."
		} else {
			useString = " and has "+invite.maxUses+" max uses."
		}
		
		if(invite.inviter.username) {
		    inviter = invite.inviter.username
		} else {
		    inviter = ""
		}

		const embed = new EmbedBuilder()
			.setColor(embedColours.positive)
			if(invite.maxAge === 0) {
				embed.setDescription("An infinite invite was created by "+inviter+useString+"\nhttps://discord.gg/"+invite.code);
			} else {
				embed.setDescription("An invite was created by "+inviter+", it will end <t:"+inviteEnd+":R>"+useString+"\nhttps://discord.gg/"+invite.code);
			}
			embed.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] });
		return;
	},
};
