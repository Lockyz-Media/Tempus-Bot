const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { commandMetrics } = require('../functions.js')
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
const dismondb = require('dismondb')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokemon')
		.setDescription('Get information from the pokemon games')
        .addSubcommand(subcommand =>
            subcommand
                .setName('pokedex')
                .setDescription('Get information on a specific pokemon')
                .addStringOption((option) => 
			        option
				        .setName('pokemon')
				        .setDescription('The pokemon you want information on.')
				        .setRequired(true)
		        )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('typedex')
                .setDescription('Get type information')
                .addStringOption((option) => 
			        option
				        .setName('type')
				        .setDescription('The type you wanted information for')
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
            subcommand
                .setName('itemdex')
                .setDescription('Get item information')
                .addStringOption((option) => 
			        option
				        .setName('item')
				        .setDescription('The item you wanted information for')
				        .setRequired(true)
		        )
        ),
	async execute(interaction) {
        commandMetrics(interaction.client, "pokemon", interaction.guild.id, interaction.user.id)
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
            //const version = interaction.options.getString('version')
		const teep = dismondb.typedex(type, 4)

		const embed1 = new MessageEmbed()
			.setTitle('Typedex | Information | '+teep.name.en
			.setThumbnail(teep.images.icon)
			.addFields([
				{ name: "Gen Added", value: teep.genAdded, inline: true },
				{ name: "Estimated Pokemon Count", value: teep.counters.pokemon.total, inline: true },
			])
		interaction.reply({ embeds [embed1] })
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
