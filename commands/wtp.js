const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Permissions } = require('discord.js');
const { givexp, takexp, ranNum, commandMetrics } = require("../functions.js")
const ms = require("ms");
//const SQLite = require("better-sqlite3");
//const sql = new SQLite('./databases/user.sqlite');
const Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wtp')
		.setDescription('WHO\'S THAT POKEMON?')
        .addIntegerOption((option) =>
            option
                .setName('gen-start')
                .setDescription('Test')
                .setRequired(false)
                .addChoices(
                    { name: 'One', value: 1 },
                    { name: 'Two', value: 152 },
                    { name: 'Three', value: 252 },
                    { name: 'Four', value: 387 },
                    { name: 'Five', value: 494 },
                    { name: 'Six', value: 650 },
                    { name: 'Seven', value: 722 },
                    { name: 'Eight', value: 810 },
                    { name: 'Nine', value: 906 },
                )
        )
        .addIntegerOption((option) =>
            option
                .setName('gen-end')
                .setDescription('Test')
                .setRequired(false)
                .addChoices(
                    { name: 'One', value: 151 },
                    { name: 'Two', value: 251 },
                    { name: 'Three', value: 386 },
                    { name: 'Four', value: 493 },
                    { name: 'Five', value: 649 },
                    { name: 'Six', value: 721 },
                    { name: 'Seven', value: 809 },
                    { name: 'Eight', value: 905 },
                    //{ name: 'Nine', value: 1010 },
                )
        )
        .addStringOption((option) =>
            option
                .setName('difficulty')
                .setDescription("What difficulty would you like?")
                .setRequired(false)
                .addChoices(
                    { name: "Easy", value: "easy" },
                    { name: "Normal", value: "normal" },
                    { name: "Hard", value: "hard" },
                    { name: "Help", value: "help" },
                )
        )
        .addIntegerOption((option) =>
            option
                .setName('bet')
                .setDescription('Are you a gambling person? Why not risk some points?')
                .setRequired(false)
        )
        .addIntegerOption((option) =>
            option
                .setName('timer')
                .setDescription("How long would you like the timer to go for?")
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
        const roundCount = interaction.options.getInteger('round-count');
        const roundLength = interaction.options.getInteger('round-length');
        const genStart = interaction.options.getInteger('gen-start');
        const genEnd = interaction.options.getInteger('gen-end');
        const timerInt = interaction.options.getInteger('timer');
        const betPoints = interaction.options.getInteger('bet');
        const difficulty = interaction.options.getString('difficulty');
        if(difficulty === "help") {
            const embed = new EmbedBuilder()
                embed.setDescription("# Difficulty Help\n## Easy\nWill show just the picture of the pokemon to guess, the form will not be required.\n\n## Normal\nThe default option, will show the picture of the pokemon to guess, the form however will be required in the guess.\n\n## Hard\nWill show the pokemons pokedex description. The form will not be required.")

            interaction.editReply({ embeds: [embed] })
            return;
        }

        var rCount = 1;
        var rLength = 3;
        var pokeCountStart = 1;
        var pokeCountEnd = 809;
        var timer = 30000;
        var forms = false;
        var pot = 5;
        var isLegend = false;
        var pokedex = "NOTHING TO SEE HERE";
        var diff = "normal"

        if(betPoints) {
            pot = pot+betPoints;
            if(takexp(client, betPoints, interaction.user.id, interaction.guild.id) === "notEnough") {
                interaction.editReply({ content: "You're broke, you don't have enough points for this.\n\nQuick everyone, point and laugh." })
                return;
            }
        }

        if(difficulty === "normal") {
            forms = true;
        } else {
            diff = difficulty;
            forms = false;
        }

        if(timerInt) {
           timer = timerInt; 
        }

        if(genStart) {
            pokeCountStart = genStart;
        }

        if(genEnd) {
            pokeCountEnd = genEnd;
        }
        var pokemon;
        //var randPoke = Math.floor(Math.random() * pokeCountEnd) + pokeCountStart;
        var randPoke = ranNum(pokeCountStart, pokeCountEnd);
        //var randPoke = 386;
        var pokeNum = randPoke;
        var imgNum = pokeNum;
        var pokeName = "spoink";
        if(imgNum < 10) {
            imgNum = "00"+imgNum;
        } else if(imgNum < 100 && imgNum > 10) {
            imgNum = "0"+imgNum;
        }

        P.getPokemonSpeciesByName(pokeNum)
            .then(function(response) {
                if(forms === true) {
                    var formCount = response.varieties.length;
                    var formsList = response.varieties;
                    var thisFormNumber = Math.floor(Math.random()*formCount)
                    var thisForm = formsList[thisFormNumber];
                    var mainPoke = response.name;
                    if(thisFormNumber === 0) {
                        pokeName = response.name;
                    } else {
                        pokeName = thisForm.pokemon.name;
                        var formImgNumber = thisFormNumber+1
                        imgNum = imgNum+"_f"+formImgNumber;
                    }
                } else if(diff === "hard") {
                    var pokeRegEx = response.name.toUpperCase();
                    //pokedex = response.flavor_text_entries[0].flavor_text
                    var pokedexes = response.flavor_text_entries
                    /*pokedex = pokedexes.filter(obj => {
                        return obj.language.name === "en"
                    })*/

                    for(var i=0, iLen=pokedexes.length; i<iLen; i++) {
                        if(pokedexes[i].language.name === "en") {
                            pokedex = pokedexes[i].flavor_text.toString().replaceAll("\n", " ").replaceAll("\u000c", " ").replaceAll(pokeRegEx, "REDACTED");
                            console.log(pokeRegEx);
                            console.log(response.name.toUpperCase());
                            console.log(pokedex);
                            return;
                        }
                    }

                    //console.log(pokedex)
                    //return;
                }
                if(response.is_legendary === true || response.is_mythical === true) {
                    isLegend = true;
                } else {
                    isLegend = false;
                }
            })

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(2000);

        P.getPokemonByName(pokeNum)
            .then(function(response) {
                pokemon = response;
                if(forms === false) {
                    pokeName = pokemon.species.name;
                }

                P.getPokemonSpeciesByName(pokeNum)
                    .then(function(response) {
                        pokemon = response;
                        if(pokemon.is_legendary === true || pokemon.is_mythical === true) {
                            isLegend = true;
                        } else {
                            isLegend = false;
                        }
                    })

                const embed = new EmbedBuilder()
                    if(diff === "hard") {
                        embed.setDescription("# WHO'S THAT POKEMON\n!guess {pokemon} to guess\n\n"+pokedex)

                        if(isLegend === true) {
                            embed.setColor('Gold')
                        } else {
                            embed.setColor('DarkButNotBlack')
                        }
                    } else {
                        embed.setTitle("Who's that Pokemon?")
                        embed.setImage("https://assets.pokemon.com/assets/cms2/img/pokedex/full/"+imgNum+".png")
                        if(forms === true) {
                            embed.setDescription("# WHO'S THAT POKEMON?\n!guess {pokemon}-{form} to guess")
                        } else {
                            embed.setDescription("# WHO'S THAT POKEMON\n!guess {pokemon} to guess")
                        }

                        if(isLegend === true) {
                            embed.setColor('Gold')
                        } else {
                            if(forms === true) {
                                embed.setColor('Blue')
                            } else {
                                embed.setColor('DarkButNotBlack')
                            }
                        }
                    }

                console.log("https://assets.pokemon.com/assets/cms2/img/pokedex/full/"+imgNum+".png")
                console.log(pokeName);
                var isGame = true;
                interaction.editReply({ embeds: [embed] }).then(() => {
                    const collectorFilter = response => {
                        if(response.author.bot === false) {
                            if(response.content.includes("!guess")) {
                                if(response.content.toLowerCase() === "!guess "+pokeName) {
                                    return true;
                                } else {
                                    response.react("❌")
                                }
                            }
                        }
                    }

                interaction.channel.awaitMessages({ filter: collectorFilter, time: timer, max: 1, errors: ['time']})
                    .then(messages => {
                        isGame = false;
                        const embed = new EmbedBuilder()
                            embed.setColor('Green')
                            embed.setDescription("# CORRECT, "+messages.first().member.username+"\nThe answer was "+pokeName)
                            //embed.setDescription("🎉🎉 Correct, <@"+messages.first().author.id+">, the answer was "+pokeName+" 🎉🎉")
                            embed.setImage("https://assets.pokemon.com/assets/cms2/img/pokedex/full/"+imgNum+".png")
                        interaction.editReply({ embeds: [embed] })
                        messages.first().reply({ content: "🎉🎉 Congratulations "+messages.first().member.username+" you got it right! 🎉🎉\n\nThe answer was "+pokeName })
                        if(forms === true || isLegend === true) {
                            givexp(client, pot+5, messages.first().author.id, interaction.guild.id)
                        } else {
                            givexp(client, pot, messages.first().author.id, interaction.guild.id)
                        }
                    })
                    .catch(() => {
                        if(isGame === false) return;
                        const embed = new EmbedBuilder()
                            embed.setColor('Red')
                            //embed.setDescription("You took too long, the answer was "+pokeName)
                            embed.setDescription("# TIMED OUT\nThe answer was "+pokeName)
                            embed.setImage("https://assets.pokemon.com/assets/cms2/img/pokedex/full/"+imgNum+".png")
                        interaction.editReply({ embeds: [embed] })
                        interaction.followUp({ content: 'The answer was '+pokeName+" you're all wrong" });
                    })
            })
        })
    }
};
