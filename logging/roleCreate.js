const { EmbedBuilder, Events } = require('discord.js');
const { embed_colours, owner_id, channel_ids, guild_id } = require('../config');

module.exports = {
	name: Events.GuildRoleCreate,
	execute(role) {
		const client = role.client
		var tempusID = guild_id
		var logsID = channel_ids.logs

		if(role.guild.id !== tempusID) {
			return;
		}

		const embed = new EmbedBuilder()
			.setDescription("A role named "+role.name+" was created. <@&"+role.id+">")
			if(role.color) {
				embed.setColor(role.color)
			} else {
				embed.setColor(embed_colours.positive)
			}
			embed.setFooter({ text: 'Role ID '+ role.id})
			embed.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}
