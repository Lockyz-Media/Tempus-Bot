const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const paginationEmbed = require('discordjs-button-pagination');
const ms = require("ms");
const Pokedex = require('pokedex-promise-v2');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');
var P = new Pokedex();
const types = require('../assets/js/types.js');
//const types1 = require('../assets/js/types1.js');
//const types2 = require('../assets/js/types2.js');
const types3 = require('../assets/js/types.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokemon')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Get information from the pokemon games')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName('pokedex')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
            .setDescription('Get information on a specific pokemon')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
            .addStringOption((option) => 
			    option.setName('pokemon')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
				.setDescription('The pokemon you want information on.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
	            })*/
				.setRequired(true)
		    )
        )

        .addSubcommand(subcommand =>
            subcommand.setName('typedex')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
            .setDescription('Get type information')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
	        })*/
            .addStringOption((option) => 
			    option.setName('type')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
				.setDescription('The type you wanted information for')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
	            })*/
				.setRequired(true)
                .addChoices(
                    { name: 'Normal', value: 'normal' },
                    { name: 'Fire', value: 'fire' },
                    { name: 'Water', value: 'water' },
                    { name: 'Grass', value: 'grass' },
                    { name: 'Electric', value: 'electric' },
                    { name: 'Ice', value: 'ice' },
                    { name: 'Fighting', value: 'fighting' },
                    { name: 'Poison', value: 'poison' },
                    { name: 'Ground', value: 'ground' },
                    { name: 'Flying', value: 'flying' },
                    { name: 'Psychic', value: 'psychic' },
                    { name: 'Bug', value: 'bug' },
                    { name: 'Rock', value: 'rock' },
                    { name: 'Ghost', value: 'ghost' },
                    { name: 'Dark', value: 'dark' },
                    { name: 'Dragon', value: 'dragon' },
                    { name: 'Steel', value: 'steel' },
                    { name: 'Fairy', value: 'fairy' },
                )
		    )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('itemdex')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
            .setDescription('Get item information')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
	        })*/
            .addStringOption((option) => 
			    option.setName('item')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
				.setDescription('The item you wanted information for')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
	            })*/
				.setRequired(true)
		    )
        ),
	async execute(interaction) {
        const client = interaction.client
        const member = interaction.member
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        if(interaction.options.getSubcommand() === 'pokedex') {
            const peekamon = interaction.options.getString('pokemon')
            var form = 'false';
            var gen = 1;

            let pkmon = peekamon.toLowerCase();
            const embed1 = new MessageEmbed()

            const embed2 = new MessageEmbed()
            embed2.setTitle('Stats')
            
            const embed3 = new MessageEmbed()
            embed3.setTitle('Tags')

            const embed4 = new MessageEmbed()
            embed4.setTitle('Advanced')

            const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Previous')
                .setStyle('DANGER');

            const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Next')
                .setStyle('SUCCESS');

                P.getPokemonSpeciesByName(pkmon)
                .then(function(response) {
                    //Tags
                    embed3.addFields([
                        { name: "Legendary?", value: response.is_legendary.toString().replace("false", "No").replace("true", "Yes"), inline: true },
                        { name: "Mythical?", value: response.is_mythical.toString().replace("false", "No").replace("true", "Yes"), inline: true },
                    ])
                    //Advanced
                    embed4.addFields([
                        { name: "Genus", value: response.genera[7].genus.toString(), inline: true },
                        { name: "Habitat", value: response.habitat.name.toString(), inline: true },
                        { name: "Growth Rate", value: response.growth_rate.name.toString(), inline: true },
                        { name: "Shape", value: response.shape.name.toString(), inline: true },
                        { name: "Colour", value: response.color.name.toString(), inline: true }
                    ])
                    embed1.addFields([
                        { name: "Generation", value: response.generation.name.toString().replaceAll("-", " "), inline: true }
                    ])
                    //Normal
                    embed1.setDescription(response.flavor_text_entries[gen-1].flavor_text.toString().replaceAll("\n", " ").replaceAll("\u000c", " "))
                P.getPokemonByName(pkmon)
                    .then(function(response) {
                        //Normal
                        embed1.setTitle('Pokedex | N° '+response.id+ " " +response.name)
                        embed1.setThumbnail(response.sprites.front_default)
                        embed2.setThumbnail(response.sprites.front_default)
                        embed3.setThumbnail(response.sprites.front_default)
                        if(response.types[1] === undefined) {
                            embed1.addFields([
                                { name: "Types", value: response.types[0].type.name, inline: true }
                            ])
                        } else {
                            embed1.addFields([
                                { name: "Types", value: response.types[0].type.name+ ", "+ response.types[1].type.name, inline: true }
                            ])
                        }

                        //Stats
                        embed2.addFields([
                            { name: 'Height', value: response.height+'m', inline: true },
                            { name: 'Weight', value: response.weight+'kg', inline: true },
                            { name: 'Base Experience', value: response.base_experience.toString(), inline: true },
                            { name: 'Base Stats', value: '\u200b' },
                            { name: 'HP', value: response.stats[0].base_stat.toString(), inline: true },
                            { name: 'ATK', value: response.stats[1].base_stat.toString(), inline: true },
                            { name: 'DEF', value: response.stats[2].base_stat.toString(), inline: true },
                            { name: 'S. ATK', value: response.stats[3].base_stat.toString(), inline: true },
                            { name: 'S. DEF', value: response.stats[4].base_stat.toString(), inline: true },
                            { name: '\u200b', value: '\u200b' },
                        ])

                        //Normal
                        embed1.addFields([
                            { name: "Ability Information", value: '\u200b' },
                            { name: "Ability 1", value: response.abilities[0].ability.name, inline: true },
                        ])
                        if(response.abilities[1].is_hidden === true) {
                            embed1.addFields([
                                { name: "Hidden Ability", value: response.abilities[1].ability.name, inline: true },
                            ])
                        } else {
                            embed1.addFields([
                                { name: "Ability 2", value: response.abilities[1].ability.name, inline: true },
                                { name: "Hidden Ability", value: response.abilities[2].ability.name, inline: true },
                            ])
                        }

                        pages = [
                            embed1,
                            embed2,
                            embed3,
                            embed4
                        ];

                        buttonList = [
                            button1,
                            button2
                        ]

                        paginationEmbed(interaction, pages, buttonList);
                        
                        //interaction.reply({ embeds: [pokeEmbed] })
                        return;
                })
            });
        }
        if(interaction.options.getSubcommand() === 'typedex') {
            const type = interaction.options.getString('type').toLowerCase();
            const version = interaction.options.getString('version')

                for(var i=0;i<types3.length;i++){
                    if(type == types3[i].name.toLowerCase()){
                        const link = type

                        const embed1 = new MessageEmbed()
                            .setTitle(`Typedex V3 | Information | `+types3[i].name)
                            .setThumbnail("https://dbbackup.lockyzdev.net/botcommands/typedex/"+link+".png")
                            .addFields([
                                { name: "Name", value: types3[i].name, inline: true },
                                { name: "Gen Added", value: types3[i].genAdded, inline: true },
                                { name: "Estimated Pokemon Count", value: types3[i].pokemonCount, inline: true },
                                { name: "Table of Contents", value: "Page Two: Current Typemap\nPage Three: Gen One Typemap\nPage Four: Gen Two-Five Typemap\nPage Five: Average Stats" }
                            ])

                        const embed2 = new MessageEmbed()
                            .setTitle(`Typedex V3 | Current Typemap | `+types3[i].name)
                            .setThumbnail("https://dbbackup.lockyzdev.net/botcommands/typedex/"+link+".png")
                            if(types3[i].attackTypemap.noEffect === "None")
                            {
                                embed2.addFields({ name: "**No Effect Against**", value: "Nothing", inline: true })
                            } else {
                                embed2.addFields({ name: "**No Effect Towards**", value: types3[i].attackTypemap.noEffect, inline: true })
                            }
                            if(types3[i].attackTypemap.notVeryEffective === "None") {
                                embed2.addFields({ name: "**Not Very Effect Against**", value: "Nothing", inline: true })
                            } else {
                                embed2.addFields({ name: "**Not Very Effect Towards**", value: types3[i].attackTypemap.notVeryEffective, inline: true })
                            }
                            if(types3[i].attackTypemap.superEffective === "None") {
                                embed2.addFields({ name: "**Super Effect Against**", value: "Nothing", inline: true })
                            } else {
                                embed2.addFields({ name: "**Super Effect Towards**", value: types3[i].attackTypemap.superEffective, inline: true })
                            }
                            if(types3[i].defenceTypemap.noEffect === "None")
                            {
                                embed2.addFields({ name: "**No Effect From**", value: "Nothing", inline: true })
                            } else {
                                embed2.addFields({ name: "**No Effect From**", value: types3[i].defenceTypemap.noEffect, inline: true })
                            }
                            if(types3[i].defenceTypemap.notVeryEffective === "None") {
                                embed2.addFields({ name: "**Not Very Effective From**", value: "Nothing", inline: true })
                            } else {
                                embed2.addFields({ name: "**Not Very Effective From**", value: types3[i].defenceTypemap.notVeryEffective, inline: true })
                            }
                            if(types3[i].defenceTypemap.superEffective === "None") {
                                embed2.addFields({ name: "**Super Effective From**", value: "Nothing", inline: true })
                            } else {
                                embed2.addFields({ name: "**Super Effective From**", value: types3[i].defenceTypemap.superEffective, inline: true })
                            }

                        const embed3 = new MessageEmbed()
                            .setTitle(`Typedex V3 | Gen 1 Typemap | `+types3[i].name)
                            .setThumbnail("https://dbbackup.lockyzdev.net/botcommands/typedex/"+link+".png")
                            if(types3[i].genOneAttackTypemap.noEffect === "None")
                            {
                                embed3.addField(`**No Effect Towards**`, 'Nothing', true)
                            } else {
                                embed3.addField(`**No Effect Towards**`, types3[i].genOneAttackTypemap.noEffect, true)
                            }
                            if(types3[i].genOneAttackTypemap.notVeryEffective === "None") {
                                embed3.addField(`**Not Very Effective Against**`, 'Nothing', true)
                            } else {
                                embed3.addField(`**Not Very Effective Against**`, types3[i].genOneAttackTypemap.notVeryEffective, true)
                            }
                            if(types3[i].genOneAttackTypemap.superEffective === "None") {
                                embed3.addField(`**Super Effective Against**`, 'Nothing', true)
                            } else {
                                embed3.addField(`**Super Effective Against**`, types3[i].genOneAttackTypemap.superEffective, true)
                            }
                            if(types3[i].genOneDefenseTypemap.noEffect === "None")
                            {
                                embed3.addField(`**No Effect From**`, 'Nothing', true)
                            } else {
                                embed3.addField(`**No Effect From**`, types3[i].genOneDefenseTypemap.noEffect, true)
                            }
                            if(types3[i].genOneDefenseTypemap.notVeryEffective === "None") {
                                embed3.addField(`**Not Very Effective From**`, 'Nothing', true)
                            } else {
                                embed3.addField(`**Not Very Effective From**`, types3[i].genOneDefenseTypemap.notVeryEffective, true)
                            }
                            if(types3[i].genOneDefenseTypemap.superEffective === "None") {
                                embed3.addField(`**Super Effective From**`, 'Nothing', true)
                            } else {
                                embed3.addField(`**Super Effective From**`, types3[i].genOneDefenseTypemap.superEffective, true)
                            }

                        const embed4 = new MessageEmbed()
                            .setTitle(`Typedex V3 | Gen 2-5 Typemap | `+types3[i].name)
                            .setThumbnail("https://dbbackup.lockyzdev.net/botcommands/typedex/"+link+".png")
                            if(types3[i].genTwoFiveAttackTypemap.noEffect === "None")
                            {
                                embed4.addFields({ name: `**No Effect Towards**`, value: 'Nothing', inline: true })
                            } else {
                                embed4.addFields({ name: `**No Effect Towards**`, value: types3[i].genTwoFiveAttackTypemap.noEffect, inline: true })
                            }
                            if(types3[i].genTwoFiveAttackTypemap.notVeryEffective === "None") {
                                embed4.addFields({ name: `**Not Very Effective Against**`, value: 'Nothing', inline: true })
                            } else {
                                embed4.addFields({ name: `**Not Very Effective Against**`, value: types3[i].genTwoFiveAttackTypemap.notVeryEffective, inline: true })
                            }
                            if(types3[i].genTwoFiveAttackTypemap.superEffective === "None") {
                                embed4.addFields({ name: `**Super Effective Against**`, value: 'Nothing', inline: true })
                            } else {
                                embed4.addFields({ name: `**Super Effective Against**`, value: types3[i].genTwoFiveAttackTypemap.superEffective, inline: true })
                            }
                            if(types3[i].genTwoFiveDefenseTypemap.noEffect === "None")
                            {
                                embed4.addFields({ name: `**No Effect From**`, value: 'Nothing', inline: true })
                            } else {
                                embed4.addFields({ name: `**No Effect From**`, value: types3[i].genTwoFiveDefenseTypemap.noEffect, inline: true })
                            }
                            if(types3[i].genTwoFiveDefenseTypemap.notVeryEffective === "None") {
                                embed4.addFields({ name: `**Not Very Effective From**`, value: 'Nothing', inline: true })
                            } else {
                                embed4.addFields({ name: `**Not Very Effective From**`, value: types3[i].genTwoFiveDefenseTypemap.notVeryEffective, inline: true })
                            }
                            if(types3[i].genTwoFiveDefenseTypemap.superEffective === "None") {
                                embed4.addFields({ name: `**Super Effective From**`, value: 'Nothing', inline: true })
                            } else {
                                embed4.addFields({ name: `**Super Effective From**`, value: types3[i].genTwoFiveDefenseTypemap.superEffective, inline: true })
                            }
                        const embed5 = new MessageEmbed()
                            .setTitle(`Typedex V3 | Average Stats | `+types3[i].name)
                            .setThumbnail("https://dbbackup.lockyzdev.net/botcommands/typedex/"+link+".png")
                            .addFields([
                                { name: "HP", value: types3[i].statAverages.hp, inline: true },
                                { name: "Attack", value: types3[i].statAverages.attack, inline: true },
                                { name: "Defense", value: types3[i].statAverages.defense, inline: true },
                                { name: "SP. Attack", value: types3[i].statAverages.spAttack, inline: true },
                                { name: "SP Defense", value: types3[i].statAverages.spDefense, inline: true },
                                { name: "Speed", value: types3[i].statAverages.speed, inline: true },
                            ])

                        const button1 = new MessageButton()
                            .setCustomId('previousbtn')
                            .setLabel('Previous')
                            .setStyle('DANGER');
    
                        const button2 = new MessageButton()
                            .setCustomId('nextbtn')
                            .setLabel('Next')
                            .setStyle('SUCCESS');

                        pages = [
                            embed1,
                            embed2,
                            embed3,
                            embed4,
                            embed5,
                        ];
                            
                        //create an array of buttons
                            
                        buttonList = [
                            button1,
                            button2
                        ]
        
                        return paginationEmbed(interaction, pages, buttonList);
                    }
                }
        }
        if(interaction.options.getSubcommand() === 'itemdex') {
            const item = interaction.options.getString('item').toLowerCase();
            P.getItemByName(item)
                .then(function(response) {
                const pokeEmbed = new EmbedBuilder()
                    .setTitle('Itemdex | '+response.name)
                    .setThumbnail(response.sprites.default)
                    if(response.cost = 0) {
                        pokeEmbed.addFields({ name: 'Cost in Mart', value: 'Not Purchaseable' })
                    } else {
                        pokeEmbed.addFields({ name: 'Cost in Mart', value: response.cost.toString() })
                    }
                    pokeEmbed.addFields([
                        { name: 'Effect', value: response.effect_entries[0].short_effect },
                        { name: 'Item Category', value: response.category.name }
                    ])
                    pokeEmbed.setDescription(response.flavor_text_entries[0].text.toString())
                interaction.reply({ content: ' ', embeds: [pokeEmbed], components: [row] })
                return;
            });
        }
    }
};
