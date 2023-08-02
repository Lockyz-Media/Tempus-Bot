const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const { commandMetrics } = require('../features/miscFunctions.js')
const locale = require('../locale/en.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get advanced information about the bot.'),
	async execute(interaction) {
        commandMetrics(interaction.client, "info", interaction.guild.id, interaction.user.id)
        const client = interaction.client
        
        var d = new Date();
        var n = d.getFullYear();
        const embed = new EmbedBuilder()
            .setTitle('Tempus Bot')
            .setDescription('**Tempus Bot** is a multipurpose Discord Bot created for the Pixelmon Tempus Discord Server.')
            .addFields([
                { name: "Support", value: "https://discord.gg/NgpN3YYbMM", inline: true },
                { name: "Developer", value: "Robin Painter", inline: true },
                { name: "Guilds", value: guildSize, inline: true },
                { name: "Users", value: userSize, inline: true },
                { name: "Uptime", value: botUptime, inline: true },
                { name: "Memory", value: Math.round(memUsage)+"MB", inline: true },
                { name: "Discord.js Version", value: "v"+discordVersion, inline: true },
                { name: "Node Version", value: "v"+process.version, inline: true },
                { name: "Version", value: "v30092022", inline: true },
                { name: "Bug Tracker", value: "https://tracker.lockyzdev.net/set_project.php?project_id=10", inline: true }
            ])
            .setFooter({ text: "©2018-"+n+" Lockyz Dev"});
        interaction.reply({ embeds: [embed] })
	}
};
