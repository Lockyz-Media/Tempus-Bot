const { EmbedBuilder, Events } = require('discord.js');
const { embed_colours, owner_id, channel_ids } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: Events.InviteDelete,
	execute(invite) {
        const client = invite.client

		var logsID = channel_ids.logs

		const embed = new EmbedBuilder()
			.setColor(embed_colours.negative)
			.setDescription("An invite was deleted.\nhttps://discord.gg/"+invite.code)
			.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] });
		return;
	},
};
