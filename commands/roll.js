const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll a dice.')
        .addIntegerOption((option) => 
			option
				.setName('sides')
				.setDescription('The amount of sides on the dice you want to roll (Up to 1000).')
				.setRequired(false)
		)
        .addIntegerOption((option) =>
            option
                .setName('number')
                .setDescription('The amount of dice you want to roll')
                .setRequired(false)
                .addChoices(
                    { name: 'One', value: 1 },
                    { name: 'Two', value: 2 },
                    { name: 'Three', value: 3 },
                    { name: 'Four', value: 4 },
                    { name: 'Five', value: 5 },
                    { name: 'Six', value: 6 },
                    { name: 'Seven', value: 7 },
                    { name: 'Eight', value: 8 },
                    { name: 'Nine', value: 9 },
                    { name: 'Ten', value: 10 },
                    { name: 'Eleven', value: 11 },
                    { name: 'Twelve', value: 12 },
                    { name: 'Thirteen', value: 13 },
                    { name: 'Fourteen', value: 14 },
                    { name: 'Fifteen', value: 15 },
                    { name: 'Sixteen', value: 16 },
                    { name: 'Seventeen', value: 17 },
                    { name: 'Eighteen', value: 18 },
                    { name: 'Nineteen', value: 19 },
                    { name: 'Twenty', value: 20 },
                )
        )
        ,
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
        } else if(sides > 1000 ) {
            interaction.reply(locale.diceFailedTooHigh)
            return;
        } else if(sides < 3) {
            interaction.reply(locale.diceFailedTooLow)
        } else if (sides < 1000) {
            soods = sides;
        }

        if(!count) {
            const embed = new MessageEmbed()
                .setTitle(locale.diceEmbedName)
                .setDescription(locale.diceEmbedDescriptionSingle.replace('{sides}', soods.toString()).replace('{number}', Math.round(Math.random() * (soods - 1) + 1).toString()))
                .setTimestamp()
            return interaction.reply({ embeds: [embed] });
        }  else if(count === 1) {
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
