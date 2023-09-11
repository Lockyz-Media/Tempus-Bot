const { EmbedBuilder, Permissions, SlashCommandBuilder } = require('discord.js');
const { givexp, takexp, ranNum, commandMetrics } = require("../functions.js")
const ms = require("ms");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Rock Paper Scissors')
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
            .setDescription('Who would you like to verse?')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
            .setRequired(true)
        )

        .addIntegerOption((option) =>
            option.setName('Your Choice')
            .setDescription("Rock Paper or Scissors?")
            .setRequired(true)
            .addChoices(
                { name: 'Rock', value: 1 },
                { name: 'Paper', value: 2 },
                { name: 'Scissors', value: 3 },
            )
        ),
	async execute(interaction) {
	    commandMetrics(interaction.client, "wtp", interaction.guild.id, interaction.user.id)
        await interaction.deferReply();
        const client = interaction.client
        const member = interaction.member
        //var lan = 'en'
        //client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        //let userset = client.getUsSett.get(interaction.user.id)

        //if(userset) {
            //if(userset.language) {
                //lan = userset.language;
            //}
        //}
        //const locale = require('../locale/'+lan+'.json');
        const roundCount = interaction.options.getInteger('rounds');
        //const betPoints = interaction.options.getInteger('bet');
        const choice = interaction.options.getInteger('choice');
        const playerTwo = interaction.options.getUser('user');
        const playerOne = interaction.user

        var rCount = 1;
        var pot = 5;

        var weaknesses = [
            [ "rock", "paper" ],
            [ "paper", "scissors" ],
            [ "scissors", "rock" ],
        ]

        var p1Choice = weaknesses[choice];

        /*if(betPoints) {
            pot = pot+betPoints;
            if(takexp(client, betPoints, interaction.user.id, interaction.guild.id) === "notEnough") {
                interaction.editReply({ content: "You're broke, you don't have enough points for this.\n\nQuick everyone, point and laugh." })
                return;
            }
        }*/
        var isGame = true;

        interaction.reply({ content: "Game Starts Now", ephemeral: true }).then(() => {
            const collectorFilter = response => {
                if(response.author.bot === false) {
                    if(response.author.id === playerTwo.id) {
                        if(response.content.includes("!choose")) {
                            if(response.content.toLowerCase() === "!choose "+p1Choice[1]) {
                                return true;
                            } else {
                                interaction.channel.send({ content: "<@"+playerOne.id+"> has won!" })
                                isGame = false;
                                response.react("❌")
                            }
                        }
                    }
                }
            }

        interaction.channel.awaitMessages({ filter: collectorFilter, time: timer, max: 1, errors: ['time']})
            .then(messages => {
                if(isGame) {
                    interaction.channel.send({ content: "<@"+playerTwo.id+"> has won!" })
                } else {
                    return;
                }
            })
            .catch(() => {
                if(isGame === false) return;
                interaction.channel.send({ content: "<@"+playerTwo.id+"> has taken too long!" })
            })
    })
        //interaction.channel.send({ content: "<@"+playerTwo.id+">, you have been challenged to a RPS game, please enter your choice below. *Player 1 has already chosen*"})

        // Bot should
    }
};

