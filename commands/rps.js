const { EmbedBuilder, Permissions, SlashCommandBuilder } = require('discord.js');
const { givexp, takexp, ranNum } = require("../functions.js")
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
            option.setName('choice')
            .setDescription("Rock Paper or Scissors?")
            .setRequired(true)
            .addChoices(
                { name: 'Rock', value: 1 },
                { name: 'Paper', value: 2 },
                { name: 'Scissors', value: 3 },
            )
        )
        .addIntegerOption((option) =>
            option.setName('timer')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
            .setDescription("How long would you like the timer to go for?")
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
            .setRequired(false)
            .addChoices(
                { name: '10 Seconds', value: 10000 },
                { name: '20 Seconds', value: 20000 },
                { name: '30 Seconds', value: 30000 },
                { name: '40 Seconds', value: 40000 },
                { name: '50 Seconds', value: 50000 },
                { name: '1 Minute', value: 60000 },
                { name: '1 Minute 30 Seconds', value: 90000 },
                { name: '2 Minutes', value: 120000 },
                { name: '2 Minutes 30 seconds', value: 150000 },
                { name: '3 Minutes', value: 180000 },
            )
        ),
	async execute(interaction) {
        //await interaction.deferReply();
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
        const timerInt = interaction.options.getInteger('timer');
        const playerOne = interaction.user
        var timer = 30000;
        const channel = interaction.channel.id

        var rCount = 1;
        var pot = 5;

        var weaknesses = [
            [ "rock", "paper" ],
            [ "paper", "scissors" ],
            [ "scissors", "rock" ],
        ]

        if(timerInt) {
            timer = timerInt; 
         }

        var p1Choice = weaknesses[choice-1];

        /*if(betPoints) {
            pot = pot+betPoints;
            if(takexp(client, betPoints, interaction.user.id, interaction.guild.id) === "notEnough") {
                interaction.editReply({ content: "You're broke, you don't have enough points for this.\n\nQuick everyone, point and laugh." })
                return;
            }
        }*/
        var isGame = true;
        var isWin = false;

        //interaction.channel.send({ content: "<@"+playerTwo.id+">, you have been challenged to a RPS game, please enter your choice below in the format of `!choose {choice}`. *Player 1 has already chosen*"})
        interaction.reply({ content: "Game Starts Now", ephemeral: true }).then(() => {
            //interaction.channel.send({ content: "<@"+playerTwo.id+">, you have been challenged to a RPS game, please enter your choice below in the format of `!choose {choice}`. *Player 1 has already chosen*"})
            client.channels.cache.get(channel).send({ content: "<@"+playerTwo.id+">, you have been challenged to a RPS game, please enter your choice below in the format of `!choose {choice}`. *Player 1 has already chosen*"})
            //console.log(p1Choice[1]);
            const collectorFilter = response => {
                if(response.author.bot === false) {
                    if(response.author.id === playerTwo.id) {
                        //console.log(response.content)
                        if(response.content.includes("!choose")) {
                            if(response.content.toLowerCase() === "!choose "+p1Choice[1]) {
                                isWin = true;
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
                if(isWin) {
                    interaction.channel.send({ content: "<@"+playerTwo.id+"> has won!" })
                    response.react("✅")
                    isGame = false;
                } else {
                    return;
                }
            })
            .catch(() => {
                if(isGame === false) return;
                interaction.channel.send({ content: "<@"+playerTwo.id+"> has taken too long!" })
            })
        })
    }
};

