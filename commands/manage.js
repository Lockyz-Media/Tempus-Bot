const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js')
const { logFunction } = require('../functions.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');
const { givexp, takexp, resetxp } = require("../functions.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('manage')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Bot Management command.')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName('points')
            /*.setNameLocalizations({
			    pl: 'pies',
    			de: 'hund',
		    })*/
            .setDescription('Manage points on a guild level.')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
            .addStringOption((option) => 
			    option.setName('function')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
				.setDescription('Which function would you like to run?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .addChoices(
                    { name: 'Give XP', value: 'give' },
                    { name: 'Take XP', value: 'take' },
                    { name: 'Reset XP', value: 'reset' },
                )
				.setRequired(true)
		    )

            .addUserOption((option) => 
			    option.setName('user')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
				.setDescription('The user you wanna kick.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
				.setRequired(true)
		    )

            .addIntegerOption((option) =>
                option.setName('amount')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('The amount of points to give/take')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand =>
            subcommand.setName('exclude')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
            .setDescription('Exclude a user from any automated features.')
            /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
            .addUserOption((option) =>
                option.setName('user')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('The user you want to exclude')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
            )

            .addStringOption((option) =>
                option.setName('autonitroscam')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Exclude the user from the nitro scam system?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .addChoices(
                    { name: 'Yes', value: 'true' },
                    { name: 'No', value: 'false' },
                )
                .setRequired(true)
            )

            .addStringOption((option) =>
                option.setName('pointssystem')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Exclude the user from the points system?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .addChoices(
                    { name: 'Yes', value: 'true' },
                    { name: 'No', value: 'false' },
                )
                .setRequired(true)
            )

            .addStringOption((option) =>
                option.setName('autologs')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Exclude the user from the logging system?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .addChoices(
                    { name: 'Yes', value: 'true' },
                    { name: 'No', value: 'false' },
                )
                .setRequired(true)
            )
        )

        .addSubcommand((subcommand) =>
            subcommand.setName('botstatus')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
            .setDescription('Change the bots status.')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
            .addStringOption((option) =>
                option.setName('enable')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Whether to enable the status or not')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
                .addChoices(
                    { name: 'True', value: 'true' },
                    { name: 'False', value: 'false' },
                )
            )

            .addStringOption((option) =>
                option.setName('statustype')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('The type of status you wanna use')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
                .addChoices(
                    { name: 'Online', value: 'online' },
                    { name: 'Offline', value: 'invisible' },
                    { name: 'DND', value: 'dnd' },
                    { name: 'Idle', value: 'idle' },
                )
            )

            .addStringOption((option) =>
                option.setName('activitytype')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('The type of activity you wanna use')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
                .addChoices(
                    { name: 'Playing', value: 'PLAYING' },
                    { name: 'Listening', value: 'LISTENING' },
                    { name: 'Watching', value: 'WATCHING' },
                )
            )

            .addStringOption((option) =>
                option.setName('activitytext')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('The text the activity should have')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
            )
        ),
	async execute(interaction) {
        const client = interaction.client

        if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            client.getBotSet = sql.prepare("SELECT * FROM botsettings WHERE botID = ?");
		    client.setBotSet = sql.prepare("INSERT OR REPLACE INTO botsettings (botID, hasStatus, statusType, activityText, activityType, embedColor) VALUES (@botID, @hasStatus, @statusType, @activityText, @activityType, @embedColor);");

            client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
            client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

            client.getUserExclude = sql.prepare("SELECT * FROM excludesusers WHERE userID = ?");
            client.setUserExclude = sql.prepare("INSERT OR REPLACE INTO excludesusers (userID, nitroscam, pointssystem, autologs) VALUES (@userID, @nitroscam, @pointssystem, @autologs);");

            if(interaction.options.getSubcommand() === 'exclude') {
                logFunction(client, interaction.channel.id, interaction.user.id, "{userID} has used the Manage Exclude command", 1, true, true);
                const user = interaction.options.getUser('user');
                const autonitroscam = interaction.options.getString('autonitroscam');
                const pointssystem = interaction.options.getString('pointssystem');
                const autologs = interaction.options.getString('autologs');

                let userExclude = client.getUserExclude.get(user.id);
                
                userExclude = { userID: user.id, nitroscam: autonitroscam, pointssystem: pointssystem, autologs: autologs }

                const embed = new EmbedBuilder()
                    .setTitle(':warning: WARNING :warning:')
                    .setDescription('This is a VERY dangerous command, you have 10 seconds to confirm.\n\nPlease be sure to have notified the rest of staff of this action.\n\nReact with :thumbsup: to confirm.')
                    .addFields([
                        { name: 'User', value: '<@'+user.id+'>'},
                        { name: 'Exempt from nitro scam detection?', value: autonitroscam},
                        { name: 'Exempt from points system?', value: pointssystem},
                        { name: 'Exempt from logging system?', value: autologs},
                    ])

                const reply = await interaction.reply({ content: 'DANGER DANGER', embeds: [embed], fetchReply: true })

                //const filter = m => m.content.toLowerCase() === 'confirm' && m.author.id === interaction.user.id;
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '👍' && user.id === interaction.user.id;
                }

                const collector = reply.createReactionCollector({ filter, time: 10000});

                collector.on('collect', (reaction, user) => {
                    client.setUserExclude.run(userExclude);
                    interaction.followUp({ content: 'Done' })
                })

                collector.on('end', collected => {
                    interaction.followUp({ content: 'It\'s been 10 seconds without confirmation. The action has been cancelled *wipes brow*' })
                })
            }

            if(interaction.options.getSubcommand() === 'botstatus') {
                logFunction(client, interaction.channel.id, interaction.user.id, "{userID} has used the Manage Bot Status command", 1, true, true);
                const enable = interaction.options.getString('enable')
                const statusTy = interaction.options.getString('statustype')
                const activityTy = interaction.options.getString('activitytype')
                const activityTe = interaction.options.getString('activitytext')
                let botset = client.getBotSet.get(client.user.id)

                if(interaction.user.id === '835394949612175380' || interaction.user.id === '282874553716441088') {

                } else { 
                    return interaction.reply({ content: 'You\'re not Robin or VJ, you cannot use this command smh.' });
                }

                let embedCol = botset.embedColor

                botset = { botID: client.user.id, hasStatus: enable, statusType: statusTy, activityText: activityTe, activityType: activityTy, embedColor: embedCol}
                client.setBotSet.run(botset);

                client.user.setPresence({
                    activities: [{
                        name: activityTe,
                        type: activityTy
                    }],
                    status: statusTy
                })
            }

            if(interaction.options.getSubcommand() === 'points') {
                logFunction(client, interaction.channel.id, interaction.user.id, "{userID} has used the Manage Points command", 1, true, true);
                const user = interaction.options.getUser('user');
                const amount = interaction.options.getInteger('amount');
                const giveTake = interaction.options.getString('function');

                if(giveTake === 'take') {
                    if(!amount) {
                        return interaction.reply({ content: "You need to specify an amount" })
                    } else {
                        takexp(client, amount, user.id, interaction.guild.id);
                        interaction.reply({ content: 'Taken '+amount+' points from the user.' })
                        return;
                    }
                } else if (giveTake === 'give') {
                    if(!amount) {
                        return interaction.reply({ content: "You need to specify an amount" })
                    } else {
                        givexp(client, amount, user.id, interaction.guild.id);
                        interaction.reply({ content: 'Given the user '+amount+' points.' })
                        return;
                    }
                } else if(giveTake === "reset") {
                    resetxp(client, user.id, guild.id);
                    interaction.reply({ content: "And done, users XP has been reset" })
                } else {
                    interaction.reply({ content: 'You can only give or take points from a user.'})
                    return;
                }
            }
        } else {
            interaction.reply({ content: 'No permission :(' })
        }
	}
};