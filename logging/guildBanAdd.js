const { EmbedBuilder } = require('discord.js');
const { embedColours, ownerID, tempusIDs } = require('../config');

module.exports = {
	name: 'guildBanAdd',
	execute(ban) {
		const client = ban.client
		var tempusID = tempusIDs.guild
		var logsID = tempusIDs.logs

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
			.setColor(embedColours.positive)
			.setDescription("A user named "+ban.user.username+" was banned"+banReason)
			embed.setTimestamp()
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}
