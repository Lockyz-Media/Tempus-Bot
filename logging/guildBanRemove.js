const { EmbedBuilder, Events } = require('discord.js');
const { embed_colours, owner_id, channel_ids } = require('../config');

module.exports = {
	name: Events.GuildBanRemove,
	execute(ban) {
		const client = ban.client
		var tempusID = guild_id
		var logsID = channel_ids.logs
		
		if(ban.guild.id !== tempusID) {
			return;
		}

		var banReason

		if(ban.reason) {
			banReason = " banned for "+banReason
		} else {
			banReason = "."
		}

		const embed = new EmbedBuilder()
			.setColor(embed_colours.negative)
			.setDescription("A user named "+ban.user.username+" was unbanned"+banReason)
			embed.setTimestamp()
			embed.setFooter({ text: 'Ban ID '+'Currently Unavailable' })
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}
