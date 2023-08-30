const { EmbedBuilder } = require('discord.js');
const { embedColours, ownerID, tempusIDs } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'emojiDelete',
	execute(emoji) {
        const client = emoji.client
		var logsID = tempusIDs.logs

		const embed = new EmbedBuilder()
			.setColor(embedColours.negative)
			.setDescription("An Emoji named "+emoji.name+" was deleted.")
			.setFooter({ text: 'Emoji ID '+emoji.id })
			.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] });
		return;
	},
};
