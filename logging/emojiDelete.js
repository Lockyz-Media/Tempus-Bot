const { EmbedBuilder, Events } = require('discord.js');
const { embed_colours, owner_id, channel_ids } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: Events.GuildEmojiDelete,
	execute(emoji) {
        const client = emoji.client
		var logsID = channel_ids.logs

		const embed = new EmbedBuilder()
			.setColor(embed_colours.negative)
			.setDescription("An Emoji named "+emoji.name+" was deleted.")
			.setFooter({ text: 'Emoji ID '+emoji.id })
			.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] });
		return;
	},
};
