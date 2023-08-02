const { EmbedBuilder } = require('discord.js');
const { embedColours, ownerID } = require('../config');

module.exports = {
	name: 'guildMemberRemove',
	execute(member) {
		const client = member.client
		const user = member.user
		var tempusID = '516551738249969675'
		var logsID = '635300240819486732'

		if(member.guild.id != tempusID) {
			return;
		}

		const embed = new EmbedBuilder()
			.setColor(embedColours.negative)
			.setDescription("A user named <@"+user.id+"> left the server.")
			.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}
