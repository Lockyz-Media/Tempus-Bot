const { SlashCommandBuilder, AttachmentBuilder } = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js')
const locale = require('../locale/en.json')
const { commandMetrics } = require('../features/miscFunctions.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slots')
		.setDescription('Gamble all your money away.')
        .addIntegerOption((option) => 
			option
				.setName('amount')
				.setDescription('How much are you willing to gamble?')
				.setRequired(true)
        ),
	async execute(interaction) {
        commandMetrics(interaction.client, "slots", interaction.guild.id, interaction.user.id)
        const client = interaction.client
        const amount = interaction.options.getInteger('amount');
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        interaction.reply({ content: 'This command is currently unfinished, sorry.'})
	}
};
