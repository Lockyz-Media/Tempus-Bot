const { SlashCommandBuilder } = require('@discordjs/builders');
const { commandMetrics } = require('../functions.js')
const locale = require('../locale/en.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('impostor')
		.setDescription('Find the impostor amogus')
		.addUserOption((option) => 
			option
				.setName('user')
				.setDescription('The user you think is the impostor.')
				.setRequired(false)
		)
		.addStringOption((option) => 
			option
				.setName('help')
				.setDescription('Find out what this command is')
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
