const { EmbedBuilder } = require('discord.js');
const { embedColor, ownerID, tempusIDs, embedColours } = require('../config');

module.exports = {
	name: 'roleDelete',
	execute(role) {
		const client = role.client
		var tempusID = tempusIDs.guild
		var logsID = tempusIDs.logs

		if(role.guild.id !== tempusID) {
			return;
		}

		const embed = new EmbedBuilder()
			.setDescription("A role named "+role.name+" was deleted.")
			if(role.color) {
				embed.setColor(role.color)
			} else {
				embed.setColor(embedColours.negative)
			}
			embed.setFooter({ text: 'Role ID '+ role.id })
			embed.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}
