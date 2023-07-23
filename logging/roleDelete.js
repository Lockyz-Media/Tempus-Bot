const { EmbedBuilder } = require('discord.js');
const { embedColor, ownerID } = require('../config');

module.exports = {
	name: 'roleDelete',
	execute(role) {
		const client = role.client
		var tempusID = '516551738249969675'
		var logsID = '635300240819486732'

		if(role.guild.id !== tempusID) {
			return;
		}

		const embed = new EmbedBuilder()
			.setDescription("A role named "+role.name+" was deleted.")
			if(role.color) {
				embed.setColor(role.color)
			}
			embed.setFooter({ text: 'Role ID '+ role.id })
			embed.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}