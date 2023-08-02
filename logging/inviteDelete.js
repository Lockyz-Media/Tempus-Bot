const { EmbedBuilder } = require('discord.js');
const { embedColours, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'inviteDelete',
	execute(invite) {
        const client = invite.client

		var logsID = "635300240819486732"

		const embed = new EmbedBuilder()
			.setColor(embedColours.negative)
			.setDescription("An invite was deleted.\nhttps://discord.gg/"+invite.code)
			.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] });
		return;
	},
};
