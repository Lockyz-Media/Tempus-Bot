const { EmbedBuilder, Events } = require('discord.js');
const { embed_colours, owner_id, channel_ids, guild_id } = require('../config');

module.exports = {
	name: Events.GuildMemberRemove,
	execute(member) {
		const client = member.client
		const user = member.user
		var tempusID = guild_id
		var logsID = channel_ids.logs

		if(member.guild.id != tempusID) {
			return;
		}

		const embed = new EmbedBuilder()
			.setColor(embed_colours.negative)
			.setDescription("A user named <@"+user.id+"> left the server.")
			.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed] })
		return;
	}
}
