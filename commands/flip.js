const { commandMetrics } = require('../functions.js')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const locale = require('../locale/en.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Flip a basic coin.')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false),
	async execute(interaction) {
        commandMetrics(interaction.client, "flip", interaction.guild.id, interaction.user.id)
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

            var sides = [
                "heads",
                "tails",
                "heads1",
                "tails1",
                "heads2",
                "tails2",
                "heads3",
                "tails3",
                "heads4",
                "tails4",
                "heads5",
                "tails5",
            ]

            var answer = 'Nothing';
            var coinName = "Nothing";

            var answer1 = sides[Math.floor(Math.random() * sides.length)];
            if(answer1 === "heads" || answer1 === "heads1" || answer1 === "heads2" || answer1 === "heads3" || answer1 === "heads4" || answer1 === "heads5") {
                answer = locale.flipHeads
            } else if(answer1 === "tails" || answer1 === "tails1" || answer1 === "tails2" || answer1 === "tails3" || answer1 === "tails4" || answer1 === "tails5"){
                 answer = locale.flipTails
            }
            if(answer1 === "heads") {
                coinName = locale.flipHeads0
            } else if(answer1 === "tails") {
                coinName = locale.flipTails0
            } else if(answer1 === "heads1") {
                coinName = locale.flipHeads1
            } else if(answer1 === "tails1") {
                coinName = locale.flipTails1
            } else if(answer1 === "heads2") {
                coinName = locale.flipHeads2
            } else if(answer1 === "tails2") {
                coinName = locale.flipTails2
            } else if(answer1 === "heads3") {
                coinName = locale.flipHeads3
            } else if(answer1 === "tails3") {
                coinName = locale.flipTails3
            } else if(answer1 === "heads4") {
                coinName = locale.flipHeads4
            } else if(answer1 === "tails4") {
                coinName = locale.flipTails4
            } else if(answer1 === "heads5") {
                coinName = locale.flipHeads5
            } else if(answer1 === "tails5") {
                coinName = locale.flipTails5
            }
            const embed = new EmbedBuilder()
                .setTitle(locale.flipEmbedTitle)
                .setDescription(locale.flipDescription.replace('{answer}', answer))
                .setImage("https://cdn.lockyzdev.net/botcommands/flip/"+answer1+".jpg")
                .setFooter({ text: coinName })
                .setTimestamp();
            interaction.reply({ embeds: [embed] })
		}
};
