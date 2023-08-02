const { SlashCommandBuilder, AttachmentBuilder } = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js')
const locale = require('../locale/en.json')
const { commandMetrics } = require('../functions.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Get a job and make money.')
        .addStringOption((option) => 
			option
				.setName('job')
				.setDescription('Which job would you like to do?')
				.setRequired(true)
                .addChoices(
                    { name: 'Fishing', value: 'fish' },
                    { name: 'Barber', value: 'barber' },
                    { name: 'Criminal', value: 'crime' },
                    { name: 'Architect', value: 'architect' },
                )),
	async execute(interaction) {
        commandMetrics(interaction.client, "work", interaction.guild.id, interaction.user.id)
        const client = interaction.client
        const job = interaction.options.getString('job');
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }

        interaction.reply({ content: 'This command is currently unfinished, sorry.'})
        const locale = require('../locale/'+lan+'.json')
	}
};
