const { EmbedBuilder } = require('discord.js');
const { embedColor, ownerID } = require('../config');

module.exports = {
	name: 'guildBanAdd',
	execute(ban) {
		const client = ban.client
		var tempusID = '516551738249969675'
		var logsID = "635300240819486732"

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
			.setColor(embedColor)
			.setDescription("A user named "+ban.user.username+" was banned"+banReason)
			embed.setTimestamp()
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}