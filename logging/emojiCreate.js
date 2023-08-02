const { EmbedBuilder } = require('discord.js');
const { embedColours, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'emojiCreate',
	execute(emoji) {
        const client = emoji.client

		var logsID = "635300240819486732"

		const embed = new EmbedBuilder()
			.setColor(embedColours.positive)
			.setDescription("An emoji named "+emoji.name+" was created <:"+emoji.name+":"+emoji.id+">")
			.setFooter({ text: 'Emoji ID '+emoji.id })
			.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] });
		return;
	},
};
