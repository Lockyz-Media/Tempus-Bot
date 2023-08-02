const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, ButtonStyle } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const locale = require('../locale/en.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('privacy')
		.setDescription('Get privacy and data collection information.')
		.setDefaultPermission(true),
	async execute(interaction) {
	    commandMetrics(interaction.client, "privacy", interaction.guild.id, interaction.user.id)
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
        interaction.reply({ content: locale.priacyResponse })
	}
};
