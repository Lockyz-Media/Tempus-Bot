const { EmbedBuilder } = require('discord.js');
const { embedColours, ownerID, tempusIDs } = require('../config');

module.exports = {
	name: 'roleUpdate',
	execute(oldRole, newRole) {
		const client = newRole.client
		var tempusID = tempusIDs.guild
		var logsID = tempusIDs.logs
		var ncolor = newRole.color
		var ocolor = oldRole.color
		var nhoist = newRole.hoist
		var ohoist = oldRole.hoist
		var nmentionable = newRole.mentionable
		var omentionable = oldRole.mentionable
		//var npermissions = newRole.PermissionsBitField.FLAGS
		//var opermissions = oldRole.PermissionsBitField.FLAGS
		var nemoji = newRole.unicodeEmoji
		var oemoji = oldRole.unicodeEmoji
		var nname = newRole.name
		var oname = oldRole.name

		if(newRole.guild.id !== tempusID) {
			return;
		}

			if(ncolor !== ocolor || nhoist !== ohoist || nmentionable !== omentionable || nname !== oname || nemoji !== oemoji) {
				const embed = new EmbedBuilder()
					.setDescription("A role named "+oname+" has been updated")
					if(nname !== oname) {
						embed.addFields(
							{ name: 'New Name', value: nname, inline: true },
						)
					}
					if(ncolor !== ocolor) {
						if(ncolor) {
							embed.setColor(ncolor)
						} else {
							embed.setColor(embedColours.neutral)
						}
					} else {
						embed.setColor(embedColours.neutral)
					}
					if(nhoist !== ohoist) {
						if(!nhoist) {
							embed.addFields({ name: 'Hoisted?', value: "No", inline: true })
						} else {
							embed.addFields({ name: 'Hoisted?', value: "Yes", inline: true })
						}
					}
					if(nmentionable !== omentionable) {
						if(!nmentionable) {
							embed.addFields({ name: 'Mentionable?', value: "No", inline: true })
						} else {
							embed.addFields({ name: 'Mentionable?', value: "Yes", inline: true })
						}
						embed.addFields({ name: '\u200B', value: '\u200B', inline: true })
					} else {
						if(!nmentionable) {
							embed.addFields({ name: 'Is Mentionable?', value: "No", inline: true })
						} else {
							embed.addFields({ name: 'Is Mentionable?', value: "Yes", inline: true })
						}
						embed.addFields({ name: '\u200B', value: '\u200B', inline: true })
					}
					if(nemoji !== oemoji) {
						if(oemoji) {
							if(nemoji) {
								embed.addFields({ name: 'Emoji', value: nemoji, inline: true })
							} else {
								embed.addFields({ name: 'Emoji', value: 'None', inline: true })
							}
						} else if (nemoji) {
							embed.addFields({ name: 'Emoji', value: nemoji, inline: true })
						}
					}
					embed.setFooter({ text: 'Role ID '+ newRole.id })
					embed.setTimestamp();
				client.channels.cache.get(logsID).send({ embeds: [embed] })
				return;
		}
	}
}
