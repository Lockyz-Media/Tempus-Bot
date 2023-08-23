const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Roll a dice.')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false)
        .addIntegerOption((option) => 
			option.setName('sides')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
	        })*/
			.setDescription('The amount of sides on the dice you want to roll (Up to 1000).')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
			.setRequired(false)
            .setMaxValue(1000)
            .setMinValue(3)
		)

        .addIntegerOption((option) =>
            option.setName('number')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
            .setDescription('The amount of dice you want to roll')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
            .setRequired(true)
            .setMaxValue(20)
            .setMinValue(1)
        ),
	async execute(interaction) {
        commandMetrics(interaction.client, "roll", interaction.guild.id, interaction.user.id)
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
        var soods = 6;
        const sides = interaction.options.getInteger('sides')
        const count = interaction.options.getInteger('number')

        if(!sides) {
            soods = 6;
        } else {
            soods = sides;
        }

        if(count === 1) {
            const embed = new MessageEmbed()
                .setTitle(locale.diceEmbedName)
                .setDescription(locale.diceEmbedDescriptionSingle.replace('{sides}', soods.toString()).replace('{number}', Math.round(Math.random() * (soods - 1) + 1).toString()))
                .setTimestamp()
            return interaction.reply({ embeds: [embed] });
        } else if(count >= 2) {
            const embed = new MessageEmbed()
                .setTitle(locale.diceEmbedName)
                .setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .setTimestamp()
            var times = count;
            var uwu = 0;

            function embedFunction() {
                uwu++;
                embed.addFields({ name: locale.diceWord+uwu, value: Math.round(Math.random() * (soods - 1)+ 1).toString(), inline: true })
            }

            for(let i = 0; i < times; i++) {
                embedFunction();
            }

            return interaction.reply({ embeds: [embed] });
        }
	}
};
