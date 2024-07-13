const { EmbedBuilder, Events } = require('discord.js');
const { embed_colours, owner_id, channel_ids, guild_id } = require('../config');

module.exports = {
	name: Events.ChannelUpdate,
	execute(oldChannel, newChannel) {
		const client = newChannel.client
		var tempusID = guild_id
		var logsID = channel_ids.logs
		var nname = newChannel.name
		var oname = oldChannel.name
		var nparent
		if(newChannel.parent.name) {
			nparent = newChannel.parent.name
		}
		var oparent
		if(oldChannel.parent.name) {
			oparent = oldChannel.parent.name
		}
		var ntype = newChannel.type.toString()
		var otype = oldChannel.type.toString()

		const lookup = [
			{ value: 0, name: "Guild Text" },
			{ value: 1, name: "DM" },
			{ value: 2, name: "Voice" },
			{ value: 3, name: "Group DM" },
			{ value: 4, name: "Category" },
			{ value: 5, name: "Announcement" },
			{ value: 6, name: "Unknown" },
			{ value: 7, name: "Unknown" },
			{ value: 8, name: "Unknown" },
			{ value: 9, name: "Unknown" },
			{ value: 10, name: "Announcement" },
			{ value: 11, name: "Public Thread" },
			{ value: 12, name: "Private Thread" },
			{ value: 13, name: "Stage" },
			{ value: 14, name: "Directory" },
			{ value: 15, name: "Forum" },
			{ value: 16, name: "Unknown"},
			{ value: 17, name: "Unknown"},
			{ value: 18, name: "Unknown"},
			{ value: 19, name: "Unknown"},
			{ value: 20, name: "Unknown"},
			{ value: 21, name: "Unknown"},
			{ value: 22, name: "Unknown"},
			{ value: 23, name: "Unknown"},
			{ value: 24, name: "Unknown"},
			{ value: 25, name: "Unknown"},
			{ value: 26, name: "Unknown"},
			{ value: 27, name: "Unknown"},
			{ value: 28, name: "Unknown"},
			{ value: 29, name: "Unknown"},
			{ value: 30, name: "Unknown"},
		];

		if(newChannel.guild.id !== tempusID) {
			return;
		}

		var isThread = false;

		if(newChannel.type === 11 || newChannel.type === 12 || newChannel.type === 13)
		{
			isThread = true;
		}

		var categoryText

		if(newChannel.parent) {
			categoryText = " in "+newChannel.parent.name+' was edited.'
		} else {
			categoryText = " was edited."
		}

		if( nname !== oname || nparent !== oparent || ntype !== otype ) {
			const embed = new EmbedBuilder()
				.setColor(embed_colours.neutral)
				.setDescription('A channel '+oldChannel.name+' of type '+oldChannel.type+categoryText)

			if(newChannel.name) {
				embed.addFields(
					{ name: 'New Name', value: nname, inline: true },
				)
			}
			if(newChannel.parent.name) {
				embed.addFields(
					{ name: 'New Category', value: nparent, inline: true },
				)
			}
			if(newChannel.type) {
				embed.addFields(
					{ name: 'New Type', value: lookup[ntype].name, inline: true },
				)
			}
			embed.setFooter({ text: 'Channel ID '+newChannel.id})
			embed.setTimestamp();
			client.channels.cache.get(logsID).send({ embeds: [embed] });
			return;
		}
	}
}
