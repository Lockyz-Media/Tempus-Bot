const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Client, Collection, Intents } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { embedColor, ownerID } = require('../config');
const locale = require('../locale/en.json');
const { group } = require('console');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');
const Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dev')
		.setDescription('Execute Bot Developer Commands.')
        .setDMPermission(false)
		.addSubcommandGroup((group) => 
		    group.setName("manage-bot")
		    .setDescription("Manage Bot Features")
		    .addSubcommand(subcommand =>
		        subcommand.setName('commands')
		        .setDescription('Manage Commands')
		        .addStringOption((option) =>
		            option.setName('function')
		            .setDescription('Which function to run?')
		            .setRequired(true)
		            .addChoices(
                    	{ name: 'Restart', value: 'restart' },
                    	{ name: 'Reload Commands', value: 'reload-commands' },
                    	{ name: 'List Commands', value: 'list-commands' },
                    	{ name: 'Disable Commands', value: 'disable-commands' },
                        { name: 'Bot Management Dashboard', value: 'bot-dashboard' },
                	)
		        )

			    .addStringOption((option) =>
					option.setName('command')
					.setDescription('The command to manage.')
					.setRequired(true)
				)
		    )
		)

        .addSubcommandGroup((group) =>
            group.setName('xp_system')
            .setDescription('Alter settings for the XP System.')
            .addSubcommand((subcommand) =>
                subcommand.setName('manage_user_points')
                .setDescription('Increase or Decrease the points of a user')
                .addUserOption((option) =>
                    option.setName('user')
                    .setDescription('The user in which you wanna reset the points of.')
                    .setRequired(true)
                )
            )

            .addSubcommand((subcommand) =>
                subcommand.setName('disable_user_points')
                .setDescription('Disable a users ability to gain points')
                .addUserOption((option) =>
                    option.setName('user')
                    .setDescription('The user in which you wanna reset the points of.')
                    .setRequired(true)
                )
            )

            .addSubcommand((subcommand) =>
                subcommand.setName('reset_user_points')
                .setDescription('Reset the points of a specific user')
                .addUserOption((option) =>
                    option.setName('user')
                    .setDescription('The user in which you wanna reset the points of.')
                    .setRequired(true)
                )
            )
        )

		.addSubcommandGroup((group) =>
			group.setName('test')
			.setDescription('Run a test')
			.addSubcommand((subcommand) =>
				subcommand.setName('command-test')
				.setDescription("Run Command Tests")
				.addStringOption((option) =>
					option.setName('commandname')
					.setDescription("The name of the command to run a test for")
					.addChoices(
						{ name: 'WTP', value: 'wtp' },
						{ name: 'test', value: 'test' }
					)
				)
			)
		)

        .addSubcommandGroup((group) =>
            group.setName('manage')
            .setDescription('Manage either the bot or the server.')
            .addSubcommand((subcommand) =>
                subcommand.setName('bot')
                .setDescription('Manage the Bot')
                .addStringOption((option) =>
                    option.setName('option')
                    .setDescription('Which developer function did you want to run?')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Restart', value: 'restart'},
                        { name: 'Reload Commands', value: 'reload-cmds'},
                        { name: 'List Commands', value: 'list-cmds'},
                        { name: 'Delete Commands', value: 'delete-cmds'},
                        { name: 'Create Role Select', value: 'role-select'},
                    )
                )
            )
        ),
	async execute(interaction) {
        const client = interaction.client
        const option = interaction.options.getString('option')

        if(interaction.user.id === '835394949612175380') {
			if(interaction.options.getSubcommand("command-test")) {
				const commandName = interaction.options.getString("commandname")

				if(commandName === "wtp") {
					P.getPokemonSpeciesByName(325)
            			.then(function(response) {
							var pokeName = response.name;
							var pokeRegEx = new RegExp(pokeName, "ig")
                    		var pokedex = response.flavor_text_entries[0].flavor_text.toString().replaceAll("\n", " ").replaceAll("\u000c", " ").replaceAll(pokeRegEx, "REDACTED");

							interaction.editReply({ content: pokedex })
						})
				}
			}
            if(interaction.options.getSubcommand("commands")) {
              const feature = interaction.options.getString("function");
              
              if(feature === "reload-commands") {
				const commandName = interaction.options.getString('command', true).toLowerCase();
				const command = interaction.client.commands.get(commandName);

				if(!command) {
					return interaction.reply(`There is no command with the name \`${commandName}\`!`);
				}

				delete require.cache[require.resolve(`./${command.data.name}.js`)];

				try {
					interaction.client.commands.delete(command.data.name);
					const newCommand = require(`./${command.data.name}.js`);
					interaction.client.commands.set(newCommand.data.name, newCommand);
					await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
				} catch (error) {
					console.error(error);
					await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
				}
            } else if(feature === "disable-commands") {
				const commandName = interaction.options.getString('command', true).toLowerCase();
				const command = interaction.client.commands.get(commandName);

				if(!command) {
					return interaction.reply(`There is no command with the name \`${commandName}\`!`);
				}

				delete require.cache[require.resolve(`./${command.data.name}.js`)];
				interaction.client.application.commands.delete(command)

				interaction.reply({ content: `Command \`${command.data.name}\` has been disabled`})
			} else if(feature === "bot-dashboard") {
                const confirm = new ButtonBuilder()
			        .setCustomId('confirm')
			        .setLabel('Confirm Ban')
			        .setStyle(ButtonStyle.Danger);

		        const cancel = new ButtonBuilder()
			        .setCustomId('cancel')
			        .setLabel('Cancel')
			        .setStyle(ButtonStyle.Secondary);

		        const row = new ActionRowBuilder()
			        .addComponents(cancel, confirm);

		        await interaction.reply({
			        content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
			        components: [row],
		        });
            } else {
                interaction.reply({ content: "Function "+feature+' is currently unavailable'})
            }
            }
            if(option === 'role-select') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('role_menu')
                            .setPlaceholder('Role Select')
                            .addOptions(
                                {
                                    label: 'Follow',
                                    description: 'Get mentioned on updates.',
                                    value: 'follow',
                                },

                                {
                                    label: 'Vote',
                                    description: 'Get mentioned when a new poll is created.',
                                    value: 'vote',
                                },

                                {
                                    label: 'Sneak Peek',
                                    description: 'Get notified when a new sneak peek is out.',
                                    value: 'sneak_peek',
                                },

                                {
                                    label: 'VJ Health',
                                    description: 'Get notified when VJ makes an update on his health.',
                                    value: 'vj_health',
                                },
                                {
                                    label: 'Tournament Notifications',
                                    description: 'Get notified during a Tournament Announcement.',
                                    value: 'tourney',
                                },
                                {
                                    label: 'Here for you',
                                    description: 'Get notified when someone mentions the here for you role in the mental health support channel.',
                                    value: 'hereForYou',
                                },
                            )
                    )
                
                interaction.channel.send({ content: 'Role Select', components: [row] });
                interaction.reply({ content: "Created the Role Select Menu", ephemeral: true })
            }
        } else {
            interaction.reply({ content: 'You do not have permission to use this command, shame on you. :('})
        }
	}
}
