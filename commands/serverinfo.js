const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Get advanced information about the guild you\'re in.'),
	async execute(interaction) {
        commandMetrics(interaction.client, "serverinfo", interaction.guild.id, interaction.user.id)
        const client = interaction.client
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')
        const guild = interaction.guild
        
        const embed = new EmbedBuilder()
            .setTitle('Server Info')
            .setThumbnail(guild.iconURL())
            if(guild.description != null) {
                embed.setDescription(guild.description)
            }
            //Basic Guild Information
            embed.addFields([
                { name: 'Name', value: guild.name.toString(), inline: true },
                { name: 'ID', value: guild.id.toString(), inline: true },
                { name: 'Owner', value: '<@'+guild.ownerID+'>', inline: true },
                { name: 'Verification Level', value: guild.verificationLevel.toString(), inline: true },
                { name: 'Creation Date', value: '<t:'+Math.floor(new Date(guild.createdAt).getTime() / 1000)+'>', inline: true },
                { name: 'Is partnered?', value: guild.partnered.toString(), inline: true },
                { name: 'Is Verified?', value: guild.verified.toString(), inline: true },
            ])
            if(guild.rulesChannelId != null) {
                embed.addFields({ name: 'Rules Channel', value: '<#'+guild.rulesChannelId.toString()+'>', inline: true })
            }
            //Counts
            embed.addFields([
                { name: 'Boost Tier | Count', value: '${guild.premiumTier} | ${guild.premiumSubscriptionCount}', inline: true },
                { name: 'Total Users', value: guild.memberCount.toString(), inline: true },
                { name: 'Total Channels', value: guild.channels.cache.size.toString(), inline: true },
                { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
            ])
            embed.setTimestamp();
            if(guild.bannerURL != null) {
                embed.setImage(guild.bannerURL())
            }
        interaction.reply({ embeds: [embed] })
	}
};