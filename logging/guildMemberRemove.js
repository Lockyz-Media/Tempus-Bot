const { EmbedBuilder } = require('discord.js');
const { embedColours, ownerID, tempusIDs } = require('../config');

module.exports = {
	name: 'guildMemberRemove',
	execute(member) {
		const client = member.client
		const user = member.user
		var tempusID = tempusIDs.guild
		var logsID = tempusIDs.logs

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
