const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, ButtonStyle } = require('discord.js');
const { embedColours, ownerID } = require('../config');

module.exports = {
	name: 'messageUpdate',
	execute(oldMessage, newMessage) {
		const client = newMessage.client
		const user = newMessage.user
		var tempusID = '516551738249969675'
		var logsID = '635300240819486732'

		if(newMessage.guild.id != tempusID) {
			return;
		}
		
    	if(newMessage.content == oldMessage.content) return;
    	if(!oldMessage.content) return;
    	if(!newMessage.content) return;
		if(newMessage.channel.parent.id === '516557928220590096') {
			return;
		}

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Jump To Message')
					.setStyle(ButtonStyle.Link)
					.setURL(newMessage.url)
			)
		const embed0 = new EmbedBuilder()
			.setColor(embedColours.neutral)
			.setDescription("A message by <@"+oldMessage.author.id+"> in <#"+newMessage.channel.id+"> was edited.")
			if(newMessage.cleanContent.length > 1024) {
				embed0.addFields({ name: 'Content', value: 'Content is over 1024 lines, it\'s in a new embed'})
			} else if(newMessage.cleanContent.length > 1) {
				embed0.addFields({ name: 'Content', value: newMessage.cleanContent })
			} else {
				embed0.addFields({ name: 'Content', value: 'Message content was not cached so it cannot be displayed'})
			}
			embed0.setTimestamp();
		client.channels.cache.get(logsID).send({ embeds: [embed0], components: [row] })
		if(newMessage.cleanContent.length > 1024) {
			const embed2 = new EmbedBuilder()
				.setTitle("Message Content")
				.setColor(embedColor)
				.setDescription(newMessage.cleanContent)
			client.channels.cache.get(logsID).send({ embeds: [embed2] })
		}
		return;
	}
}
