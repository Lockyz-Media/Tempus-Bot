const { EmbedBuilder, Events } = require('discord.js');
const { embed_colours, owner_id, channel_ids, guild_id } = require('../config');

module.exports = {
	name: Events.MessageDelete,
	execute(message) {
		const client = message.client
		const user = message.user
		var logsID = channel_ids.logs
		var tempusID = guild_id

		if(message.guild.id != tempusID) {
			return;
		}

		if(message.channel.parent.id === channel_ids.staff_category) {
			return;
		}

		const embed0 = new EmbedBuilder()
			.setColor(embed_colours.negative)
			.setDescription("A message by <@"+message.author.id+"> in <#"+message.channel.id+"> was deleted")
			if(message.cleanContent.length > 1024) {
				embed0.addFields({name: 'Content', value: 'Message Content is over 1024 lines, it\'s in a new embed', inline: false })
			} else if(message.cleanContent.length > 1) {
				embed0.addFields({ name: 'Content', value: message.cleanContent, inline: false })
			} else {
				embed0.addFields({ name: 'Content', value: 'Message Content was not cached so it cannot be displayed', inline: false })
			}
			embed0.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed0] })
		if(message.cleanContent.length > 1024) {
			const embed1 = new EmbedBuilder()
				.setTitle("Message Deleted | Message Content")
				.setColor(embed_colours.negative)
				.setDescription(message.cleanContent)
			client.channels.cache.get(logsID).send({ embeds: [embed1] })
		}
		return;
	}
}
