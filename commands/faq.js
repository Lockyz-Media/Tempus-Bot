const { SlashCommandBuilder, EmbedBuilder, PermissionsBitFieldBitField } = require('discord.js')
const locale = require('../locale/en.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('faq')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Get answers to some of our most asked questions.')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false)
        .addStringOption((option) => 
			option.setName('question')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
			.setDescription('What question did you want to ask?')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
            .addChoices(
                { name: 'When will Pixelmon Tempus Release?', value: 'release_date' },
                { name: 'What pixelmon version will Pixelmon Tempus use?', value: 'pixelmon_version' },
                { name: 'When will the beta test begin?', value: 'beta_timeframe'},
                { name: 'I\'d like to make a suggestion', value: 'suggestion'},
                { name: 'My question is not listed.', value: 'unknown_question'},
            )
			.setRequired(true)
		),
	async execute(interaction) {
        const client = interaction.client
        const question = interaction.options.getString('question');

        if(question === 'release_date') {
            const embed = new EmbedBuilder()
                .setTitle('When will Pixelmon Tempus Release?')
                .setDescription('Pixelmon tempus is expected to release sometime in 2022, and a Beta Test will begin in the near future. No other information is confirmed.')
            interaction.reply({ embeds: [embed] })
        }

        if(question === 'pixelmon_version') {
            const embed = new EmbedBuilder()
                .setTitle('What pixelmon version will Pixelmon Tempus use?')
                .setDescription('Pixelmon Tempus will use Pixelmon for 1.12.2')
            interaction.reply({ embeds: [embed] })
        }

        if(question === 'beta_timeframe') {
            const embed = new EmbedBuilder()
                .setTitle('When will the beta test begin?')
                .setDescription('The next Beta Test is scheduled for sometime in the near future, you can apply to join it here: https://docs.google.com/forms/d/e/1FAIpQLScW3zuO1WwEwMqHruG0Dm4uEmb7YDgS9NBmRoxQapa87hf5ow/viewform?usp=sf_link')
            interaction.reply({ embeds: [embed] })
        }

        if(question === 'suggestion') {
            const embed = new EmbedBuilder()
                .setTitle('I\'d like to make a suggestion')
                .setDescription('Feel free to send a message to the "Ideas for Tempus" channel <#725370178287697922>')
            interaction.reply({ embeds: [embed] })
        }

        if(question === 'unknown_question') {
            const embed = new EmbedBuilder()
                .setTitle('My question is not listed.')
                .setDescription('Feel free to ask, our staff don\'t bite')
            interaction.reply({ embeds: [embed] })
        }
	}
};