const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js')
const { commandMetrics, logFunction } = require('../functions.js')
const locale = require('../locale/en.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('punish')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Slam down the hammer.')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName('ban')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
	        })*/
            .setDescription('Ban a user.')
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
				.setDescription('The user you wanna ban.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
				.setRequired(true)
		    )

		    .addStringOption((option) => 
			    option.setName('reason')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
				.setDescription('The reason you wanna ban the user for.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
				.setRequired(false)
                .addChoices(
                    { name: 'Spam', value: 'Spam' },
                    { name: 'Discord TOS', value: 'Broke Discord TOS' },
                    { name: 'Pedophilia', value: 'Pedophilia' },
                    { name: 'Unsolicited Nudes', value: 'Unsolicited Nudes' },
                    { name: 'Racism', value: 'Racism' },
                    { name: 'Bot', value: 'Bot' },
                    { name: 'Compromised Account', value: 'Compromised Account' },
                    { name: 'Harassment', value: 'Harassment' },
                    { name: 'Doxing', value: 'Doxing' },
                    { name: 'Bullying', value: 'Bullying' },
                    { name: 'Mysogyny', value: 'Mysogyny' },
                    { name: 'Homophobia', value: 'Homophobia' },
                    { name: 'Gore Content', value: 'Gore Content' },
                    { name: 'Phishing', value: 'Phishing' },
                    { name: 'Scamming', value: 'Scamming' },
                    { name: 'Other', value: 'Other' },
                )
		    )

            .addStringOption((option) => 
                option.setName('custom_reason')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('If your reason isn\'t listed you can use a custom one here.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(false)
            )

            .addBooleanOption((option) =>
                option.setName('send_reason')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Do you want to send your custom reason to our developers?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand =>
            subcommand.setName('kick')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
            .setDescription('Kick a user.')
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
                .setDescription('The user you wanna kick.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
            )

            .addStringOption((option) => 
                option.setName('reason')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('The reason you wanna kick the user for.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(false)
                .addChoices(
                    { name: 'Spam', value: 'Spam' },
                    { name: 'Discord TOS', value: 'Broke Discord TOS' },
                    { name: 'Pedophilia', value: 'Pedophilia' },
                    { name: 'Unsolicited Nudes', value: 'Unsolicited Nudes' },
                    { name: 'Racism', value: 'Racism' },
                    { name: 'Bot', value: 'Bot' },
                    { name: 'Compromised Account', value: 'Compromised Account' },
                    { name: 'Harassment', value: 'Harassment' },
                    { name: 'Doxing', value: 'Doxing' },
                    { name: 'Bullying', value: 'Bullying' },
                    { name: 'Mysogyny', value: 'Mysogyny' },
                    { name: 'Homophobia', value: 'Homophobia' },
                    { name: 'Gore Content', value: 'Gore Content' },
                    { name: 'Phishing', value: 'Phishing' },
                    { name: 'Scamming', value: 'Scamming' },
                    { name: 'Other', value: 'Other' },
                )
            )

            .addStringOption((option) => 
                option.setName('custom_reason')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('If your reason isn\'t listed you can use a custom one here.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(false)
            )

            .addBooleanOption((option) =>
                option.setName('send_reason')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Do you want to send your custom reason to our developers?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand =>
            subcommand.setName('warn')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
            .setDescription('Warn a User')
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
                .setDescription('The user you wanna warn.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
            )

            .addStringOption((option) => 
                option.setName('reason')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('The reason you wanna warn the user for.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(false)
                .addChoices(
                    { name: 'Spam', value: 'Spam' },
                    { name: 'Discord TOS', value: 'Broke Discord TOS' },
                    { name: 'Pedophilia', value: 'Pedophilia' },
                    { name: 'Unsolicited Nudes', value: 'Unsolicited Nudes' },
                    { name: 'Racism', value: 'Racism' },
                    { name: 'Bot', value: 'Bot' },
                    { name: 'Compromised Account', value: 'Compromised Account' },
                    { name: 'Harassment', value: 'Harassment' },
                    { name: 'Doxing', value: 'Doxing' },
                    { name: 'Bullying', value: 'Bullying' },
                    { name: 'Mysogyny', value: 'Mysogyny' },
                    { name: 'Homophobia', value: 'Homophobia' },
                    { name: 'Gore Content', value: 'Gore Content' },
                    { name: 'Phishing', value: 'Phishing' },
                    { name: 'Scamming', value: 'Scamming' },
                    { name: 'Other', value: 'Other' },
                )
            )

            .addStringOption((option) => 
                option.setName('custom_reason')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('If your reason isn\'t listed you can use a custom one here.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(false)
            )

            .addBooleanOption((option) =>
                option.setName('send_reason')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Do you want to send your custom reason to our developers?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(false)
            )
        )

        /*.addSubcommand(subcommand =>
            subcommand.setName('mute')
            .setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })
            .setDescription('Mute a User')
            .setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })
            .addUserOption((option) => 
                option.setName('user')
                .setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })
                .setDescription('The user you wanna mute.')
                .setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })
                .setRequired(true)
            )

            .addStringOption((option) => 
                option.setName('reason')
                .setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })
                .setDescription('The reason you wanna mute the user for.')
                .setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })
                .setRequired(false)
                .addChoices(
                    { name: 'Spam', value: 'Spam' },
                    { name: 'Discord TOS', value: 'Broke Discord TOS' },
                    { name: 'Pedophilia', value: 'Pedophilia' },
                    { name: 'Unsolicited Nudes', value: 'Unsolicited Nudes' },
                    { name: 'Racism', value: 'Racism' },
                    { name: 'Bot', value: 'Bot' },
                    { name: 'Compromised Account', value: 'Compromised Account' },
                    { name: 'Harassment', value: 'Harassment' },
                    { name: 'Doxing', value: 'Doxing' },
                    { name: 'Bullying', value: 'Bullying' },
                    { name: 'Mysogyny', value: 'Mysogyny' },
                    { name: 'Homophobia', value: 'Homophobia' },
                    { name: 'Gore Content', value: 'Gore Content' },
                    { name: 'Phishing', value: 'Phishing' },
                    { name: 'Scamming', value: 'Scamming' },
                    { name: 'Other', value: 'Other' },
                )
            )

            .addStringOption((option) => 
                option.setName('custom_reason')
                .setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })
                .setDescription('If your reason isn\'t listed you can use a custom one here.')
                .setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })
                .setRequired(false)
            )

            .addBooleanOption((option) =>
                option.setName('send_reason')
                .setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })
                .setDescription('Do you want to send your custom reason to our developers?')
                .setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })
                .setRequired(false)
            )
        )*/

        .addSubcommand(subcommand =>
            subcommand.setName('query')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
		    })*/
            .setDescription('Query a users punishments.')
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
                .setDescription('The user you wanna query.')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
            )
        ),
	async execute(interaction) {
        commandMetrics(interaction.client, "punish", interaction.guild.id, interaction.user.id)
        const client = interaction.client
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)
        client.getSpecificPunish = sql.prepare("SELECT * FROM punishments WHERE userid = ? AND punishmentid = ?");
        client.getLastPunish = sql.prepare("SELECT * FROM punishments ORDER BY punishmentid DESC LIMIT 3;").all();
        client.setUserPunish = sql.prepare("INSERT OR REPLACE INTO punishments (id, userid, punishmentid, punishment, reason, timestamp) VALUES (@id, @userid, @punishmentid, @punishment, @reason, @timestamp);");

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        let lastPunish = client.getLastPunish[0];
        if(!lastPunish) {
            lastPunish = 0000;
        } else {
            lastPunish = client.getLastPunish[0].punishmentid;
        }

        let punID = lastPunish+1;
        const now = Date.now()

        if(interaction.options.getSubcommand() === 'ban') {
            if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild) || interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                logFunction(client, interaction.channel.id, interaction.user.id, "{userID} has used the Punish Ban command", 1, true, false);
                const reason = interaction.options.getString('reason')
                const customReason = interaction.options.getString('custom_reason')
                const sendCustomReason = interaction.options.getBoolean('send_reason')
                const user = interaction.options.getUser('user')
                const member = interaction.guild.members.cache.get(user.id)
                var reason1 = "Banned by "+interaction.user.username

                if(customReason) {
                    if(sendCustomReason === true) {
                        client.channels.cache.get('906706193924386846').send({ content: "Someone used a custom reason. The reason is `"+customReason+"`" })
                    }
                    reason1 = locale.banReasonAdded.replace('{user}', interaction.user.username).replace('{reason}', customReason)
                } else {
                    if(!reason) {
                        reason1 = locale.banReasonDefault.replace('{user}', interaction.user.username)
                    } else {
                        reason1 = locale.banReasonAdded.replace('{user}', interaction.user.username).replace('{reason}', reason)
                    }
                }
                if(!member.bannable) {
                    interaction.reply({ content: locale.banUnbannable })
                } else {
                    let punishment

                    punishment = { id: `${user.id}-${punID}`, userid: user.id, punishmentid: punID, punishment: 'Ban', reason: reason, timestamp: now.toString() }
                    client.setUserPunish.run(punishment);

                    member.ban({ deleteMessageSeconds: 7*25*60*60, reason: reason1 })
                    interaction.reply({ content: locale.banReasonAddedResponse.replace('{user}', member.username).replace('{reason}', reason1) })
                }
            } else {
                interaction.reply({ content: locale.noPermission })
            }
        }

        if(interaction.options.getSubcommand() === 'kick') {
            if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild) || interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) || interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                logFunction(client, interaction.channel.id, interaction.user.id, "{userID} has used the Punish Kick command", 1, true, false);
                const user = interaction.options.getUser('user')
                const reason = interaction.options.getString('reason')
                const customReason = interaction.options.getString('custom_reason')
                const sendCustomReason = interaction.options.getBoolean('send_reason')
                const member = interaction.guild.members.cache.get(user.id)
                var reason1 = "Kicked by "+interaction.user.username;

                if(customReason) {
                    if(sendCustomReason === true) {
                        client.channels.cache.get('906706193924386846').send({ content: "Someone used a custom reason. The reason is `"+customReason+"`" })
                    }
                    reason1 = locale.kickReasonAdded.replace('{user}', interaction.user.username).replace('{reason}', customReason)
                } else {
                    if(!reason) {
                        reason1 = locale.kickReasonDefault.replace('{user}', interaction.user.username)
                    } else {
                        reason1 = locale.kickReasonAdded.replace('{user}', interaction.user.username).replace('{reason}', reason)
                    }
                }
                if(!member.kickable) {
                    interaction.reply({ content: locale.kickUnkickable })
                } else {
                    let punishment

                    punishment = { id: `${user.id}-${punID}`, userid: user.id, punishmentid: punID, punishment: 'Kick', reason: reason, timestamp: now.toString() }
                    client.setUserPunish.run(punishment);

                    member.kick({ reason: reason1 })
                    interaction.reply({ content: locale.kickReasonAddedResponse.replace('{user}', member.username).replace('{reason}', reason1) })
                }
            } else {
                interaction.reply({ content: locale.noPermission })
            }
        }

        if(interaction.options.getSubcommand() === 'warn') {
            if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild) || interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) || interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                logFunction(client, interaction.channel.id, interaction.user.id, "{userID} has used the Punish Warn command", 1, true, false);
                const user = interaction.options.getUser('user')
                const reason = interaction.options.getString('reason')
                const customReason = interaction.options.getString('custom_reason')
                const sendCustomReason = interaction.options.getBoolean('send_reason')
                const member = interaction.guild.members.cache.get(user.id)
                var reason1 = "Warned by "+interaction.user.username

                if(customReason) {
                    if(sendCustomReason === true) {
                        client.channels.cache.get('906706193924386846').send({ content: "Someone used a custom reason. The reason is `"+customReason+"`" })
                    }
                    reason1 = locale.banReasonAdded.replace('{user}', interaction.user.username).replace('{reason}', customReason)
                } else {
                    if(!reason) {
                        reason1 = reason1.replace('{user}', interaction.user.username)
                    } else {
                        reason1 = reason
                    }
                }
                let punishment

                punishment = { id: `${user.id}-${punID}`, userid: user.id, punishmentid: punID, punishment: 'Warn', reason: reason, timestamp: now.toString() }
                client.setUserPunish.run(punishment);

                user.send({ content: '<@'+user.id+'> you have been warned in '+interaction.guild.name+' for '+reason })
                interaction.reply({ content: 'User '+user.username+' has been warned for '+reason })
            } else {
                interaction.reply({ content: locale.noPermission })
            }
        }

        /*if(interaction.options.getSubcommand() === 'mute') {
            if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild) || interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) || interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            } else {
                interaction.reply({ content: locale.noPermission })
            }
        }*/

        if(interaction.options.getSubcommand() === 'query') {
            if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild) || interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) || interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                logFunction(client, interaction.channel.id, interaction.user.id, "{userID} has used the Punish Query command", 1, true, false);
                const user = interaction.options.getUser('user')
                const member = interaction.guild.members.cache.get(user.id)

                const getAllUserPunish = sql.prepare("SELECT * FROM punishments WHERE userid = ?  ORDER BY punishmentid DESC;").all(user.id);

                if(!getAllUserPunish) {
                    interaction.reply({ content: 'This user has never been punished before' })
                }

                const embed = new EmbedBuilder()
                    .setTitle(user.username+'s Punishments')
                    .setThumbnail(user.avatarURL())

                for(const data of getAllUserPunish) {
                    embed.addFields({ name: '#'+data.punishmentid+' '+data.punishment, value: data.reason })
                }

                return interaction.reply({ embeds: [embed] });
            } else {
                interaction.reply({ content: locale.noPermission })
            }
        }
	}
};