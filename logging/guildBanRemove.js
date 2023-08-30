const { EmbedBuilder } = require('discord.js');
const { embedColours, ownerID, tempusIDs } = require('../config');

module.exports = {
	name: 'guildBanRemove',
	execute(ban) {
		const client = ban.client
		var tempusID = tempusIDs.guild
		var logsID = tempusIDs.logs
		
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
			.setColor(embedColours.negative)
			.setDescription("A user named "+ban.user.username+" was unbanned"+banReason)
			embed.setTimestamp()
			embed.setFooter({ text: 'Ban ID '+'Currently Unavailable' })
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}
