const { EmbedBuilder } = require('discord.js');
const { embedColours, ownerID } = require('../config');

module.exports = {
	name: 'roleCreate',
	execute(role) {
		const client = role.client
		var tempusID = '516551738249969675'
		var logsID = '635300240819486732'

		if(role.guild.id !== tempusID) {
			return;
		}

		const embed = new EmbedBuilder()
			.setDescription("A role named "+role.name+" was created. <@&"+role.id+">")
			if(role.color) {
				embed.setColor(role.color)
			} else {
				embed.setColor(embedColours.positive)
			}
			embed.setFooter({ text: 'Role ID '+ role.id})
			embed.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}
