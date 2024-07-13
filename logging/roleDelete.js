const { EmbedBuilder, Events } = require('discord.js');
const { owner_id, channel_ids, guild_id, embed_colours } = require('../config');

module.exports = {
	name: Events.GuildRoleDelete,
	execute(role) {
		const client = role.client
		var tempusID = guild_id
		var logsID = channel_ids.logs

		if(role.guild.id !== tempusID) {
			return;
		}

		const embed = new EmbedBuilder()
			.setDescription("A role named "+role.name+" was deleted.")
			if(role.color) {
				embed.setColor(role.color)
			} else {
				embed.setColor(embed_colours.negative)
			}
			embed.setFooter({ text: 'Role ID '+ role.id })
			embed.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}
