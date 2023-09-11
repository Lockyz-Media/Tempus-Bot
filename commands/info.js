const { EmbedBuilder, PermissionsBitField, version: discordVersion, SlashCommandBuilder } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const moment = require('moment');
require('moment-duration-format');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Get advanced information about the bot.')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false),
	async execute(interaction) {
        commandMetrics(interaction.client, "info", interaction.guild.id, interaction.user.id)
        const client = interaction.client
        
        var d = new Date();
        var n = d.getFullYear();
        const botUptime = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
        const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const guildSize = client.guilds.cache.size.toString();
        const userSize = client.users.cache.size.toString();

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
                { name: "Bug Tracker", value: "https://lockyzdev.mantishub.io/set_project.php?project_id=3", inline: true }
            ])
            .setFooter({ text: "©2018-"+n+" Lockyz Dev"});
        interaction.reply({ embeds: [embed] })
	}
};
