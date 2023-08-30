const { SlashCommandBuilder } = require('discord.js');
const { commandMetrics } = require('../functions.js')
const locale = require('../locale/en.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('impostor')
		/*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Find the impostor amogus')
		/*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
		.setDMPermission(false)
		.addUserOption((option) => 
			option.setName('user')
			/*.setNameLocalizations({
				pl: 'pies',
				de: 'hund',
			})*/
			.setDescription('The user you think is the impostor.')
			/*.setDescriptionLocalizations({
				pl: 'Rasa psa',
				de: 'Hunderasse',
			})*/
			.setRequired(false)
		)
		
		.addStringOption((option) => 
			option.setName('help')
			/*.setNameLocalizations({
				pl: 'pies',
				de: 'hund',
			})*/
			.setDescription('Find out what this command is')
			/*.setDescriptionLocalizations({
				pl: 'Rasa psa',
				de: 'Hunderasse',
			})*/
			.setRequired(false)
			.addChoices(
				{ name: 'Yes', value: 'true' },
				{ name: 'No', value: 'false' },
			)
		),
	async execute(interaction) {
		commandMetrics(interaction.client, "impostor", interaction.guild.id, interaction.user.id)
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
            const user = interaction.options.getUser('user')
            const help = interaction.options.getString('help')
			var user1 = interaction.user.username;

            if(help === "true") {
                interaction.reply({content: locale.impostorInfo})
            } else {
				if(user) {
					user1 = user.username;
				}
				
				var randomAnswer = (Math.random() * 100 <= 1 ? locale.impostorTextImpost.replace('{user}', user1) : locale.impostorTextNot.replace('{user}', user1))
                interaction.reply({content: ".      　。　　　　•　    　ﾟ　　。\n　　.　　　.　　　  　　.　　　　　。　　   。　.\n　.　　      。　        ඞ   。　    .    •\n•      "+randomAnswer+"　 　　。　　 　　　　ﾟ　　　.　      　　　.\n,　　　　.　 ."})
			}
		}
};
