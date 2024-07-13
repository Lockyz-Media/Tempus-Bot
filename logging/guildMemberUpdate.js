const { EmbedBuilder, Events } = require('discord.js');
const { embed_colours, owner_id, channel_ids, guild_id } = require('../config');

module.exports = {
	name: Events.GuildMemberUpdate,
	execute(oldMember, newMember) {
        var tempusID = guild_id
		var logsID = channel_ids.logs
        const client = oldMember.client

        if(oldMember.guild.id !== tempusID) {
			return;
		}

        // Removed Role logs
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if(removedRoles.size > 0) {
            const embed = new EmbedBuilder()
			    .setColor(embed_colours.negative)
                .setDescription(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayname}.`)
			    .setTimestamp();
		    client.channels.cache.get(logsID).send({ embeds: [embed] });
        }

        // Added Role Log
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if(addedRoles.size > 0) {
            const embed = new EmbedBuilder()
			    .setColor(embed_colours.positive)
                .setDescription(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayname}.`)
			    .setTimestamp();
		    client.channels.cache.get(logsID).send({ embeds: [embed] });
        }
	}
}
