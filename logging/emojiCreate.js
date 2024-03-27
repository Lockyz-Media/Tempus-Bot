const { EmbedBuilder, Events } = require('discord.js');
const { embedColours, ownerID, tempusIDs } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: Events.GuildEmojiCreate,
	execute(emoji) {
        const client = emoji.client

		var logsID = tempusIDs.logs

		const embed = new EmbedBuilder()
			.setColor(embedColours.positive)
			.setDescription("An emoji named "+emoji.name+" was created <:"+emoji.name+":"+emoji.id+">")
			.setFooter({ text: 'Emoji ID '+emoji.id })
			.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] });
		return;
	},
};
