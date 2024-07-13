const { EmbedBuilder, Events } = require('discord.js');
const { embed_colours, owner_id, channel_ids, guild_id } = require('../config');

module.exports = {
	name: Events.GuildBanAdd,
	execute(ban) {
		const client = ban.client
		var tempusID = guild_id
		var logsID = channel_ids.logs

		if(ban.guild.id !== tempusID) {
			return;
		}

		var banReason

		if(ban.reason) {
			banReason = ".\nFor "+banReason
		} else {
			banReason = "."
		}

		const embed = new EmbedBuilder()
			.setColor(embed_colours.positive)
			.setDescription("A user named "+ban.user.username+" was banned"+banReason)
			embed.setTimestamp()
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}
