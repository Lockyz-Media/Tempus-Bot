const { EmbedBuilder, Events } = require('discord.js');
const { owner_id, guild_id, role_menu_ids } = require('../config');
const SQLite = require("better-sqlite3");
const messageUpdate = require('../logging/messageUpdate');
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const client = interaction.client
		const tempusID = guild_id
        const command = interaction.client.commands.get(interaction.commandName);

        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        client.setUsSett = sql.prepare("INSERT OR REPLACE INTO userSettings (userID, userAccess, levelNotifications, language) VALUES (@userID, @userAccess, @levelNotifications, @language);");
        let userset = client.getUsSett.get(interaction.user.id)

        client.getUsProf = sql.prepare("SELECT * FROM profile WHERE userID = ?");
        client.setUsProf = sql.prepare("INSERT OR REPLACE INTO profile (userID, showUsername, showNickname, showPresence, showGuildScore, showGlobalScore, showRoles, description, pronouns, country, customProfile) VALUES (@userID, @showUsername, @showNickname, @showPresence, @showGuildScore, @showGlobalScore, @showRoles, @description, @pronouns, @country, @customProfile);");
        let userprof = client.getUsProf.get(interaction.user.id)

        if(!userset) {
            userset = { userID: interaction.user.id, userAccess: 'false', levelNotifications: 'true', language: 'en' };
            client.setUsSett.run(userset);
        }
		
		if(interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if(!command) {
				console.error("Command named "+interaction.commandName+" was not found");
				interaction.reply({ content: "Command named "+interaction.commandName+" was not found"});
				return;
			}

			try {
				if(!interaction.guild) {
					interaction.reply({ content: "Commands can only be used in a guild" })
					return;
				} else {
					await command.execute(interaction);
				}
			} catch (error) {
				console.error(error);
				if(interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: "An unknown error has occured", ephemeral: true });
				} else {
					await interaction.reply({ content: "An unknown error has occured", ephemeral: true });
				}
			}
		} else if(interaction.isAtocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if(!command) {
				console.error("Command named "+interaction.commandName+" was not found");
				interaction.reply({ content: "Command named "+interaction.commandName+" was not found" });
				return;
			}

			try {
				await command.autocomplete(interaction);
			} catch(error) {
				console.error(error);
			}
		} else if(interaction.isSelectMenu()) {
			if(interaction.customId === 'role_menu') {
                let userid = interaction.user.id;
                let member = interaction.guild.members.cache.get(interaction.user.id)

                if(interaction.values.includes('follow')) {
                    if(member.roles.cache.has(role_menu_ids.follower)) {
                        member.roles.remove(role_menu_ids.follower)
                        interaction.reply({ content: "You no longer have the Follower role", ephemeral: true })
                    } else {
                        member.roles.add(role_menu_ids.follower)
                        interaction.reply({ content: "You now have the Follower role", ephemeral: true })
                    }
                }

            	if(interaction.values.includes('vote')) {
                    if(member.roles.cache.has(role_menu_ids.vote_notif)) {
                        member.roles.remove(role_menu_ids.vote_notif)
                        interaction.reply({ content: "You no longer have the Vote role", ephemeral: true })
                    } else {
                        member.roles.add(role_menu_ids.vote_notif)
                        interaction.reply({ content: "You now have the Vote role", ephemeral: true })
                    }
                }

                if(interaction.values.includes('sneak_peek')) {
                	if(member.roles.cache.has(role_menu_ids.sneak_peak)) {
                        member.roles.remove(role_menu_ids.sneak_peak)
                        interaction.reply({ content: "You no longer have the Sneak Peak role", ephemeral: true })
                    } else {
                        member.roles.add(role_menu_ids.sneak_peak)
                        interaction.reply({ content: "You now have the Sneak Peak role", ephemeral: true })
                    }
                }

                if(interaction.values.includes('vj_health')) {
                    if(member.roles.cache.has(role_menu_ids.vj_health)) {
                        member.roles.remove(role_menu_ids.vj_health)
                        interaction.reply({ content: "You no longer have the Health role", ephemeral: true })
                    } else {
                        member.roles.add(role_menu_ids.vj_health)
                        interaction.reply({ content: "You now have the Health role", ephemeral: true })
                    }
                }
				
            	if(interaction.values.includes('tourney')) {
                    if(member.roles.cache.has(role_menu_ids.tourney_notif)) {
                        member.roles.remove(role_menu_ids.tourney_notif)
                        interaction.reply({ content: "You no longer have the Tournament role", ephemeral: true })
                	} else {
                        member.roles.add(role_menu_ids.tourney_notif)
                        interaction.reply({ content: "You now have the Tournament role", ephemeral: true })
                    }
                }
				
            	if(interaction.values.includes('hereForYou')) {
                    if(member.roles.cache.has(role_menu_ids.here_for_you)) {
                        member.roles.remove(role_menu_ids.here_for_you)
                        interaction.reply({ content: "You no longer have the Here for you role", ephemeral: true })
                    } else {
                        member.roles.add(role_menu_ids.here_for_you)
                        interaction.reply({ content: "You now have the Here for you role", ephemeral: true })
                    }
                }
			}
		} else if(interaction.isModalSubmit()) {
            if(interaction.customId === "userProfile") {
                const profDescription = interaction.fields.getTextInputValue('description');
                const profPronouns = interaction.fields.getTextInputValue('pronouns');
                const profCountry = interaction.fields.getTextInputValue('country');

                if(!userprof) {
                    userprof = { userID: interaction.user.id, showUsername: 'true', showNickname: 'true', showPresence: 'false', showGuildScore: 'false', showGlobalScore: 'true', showRoles: 'false', description: profDescription, pronouns: profPronouns, country: profCountry, customProfile: 'true'}
                    client.setUsProf.run(userprof);
                    interaction.reply({ content: "Done, you can view your profile with the /userinfo command", ephemeral: true })
                } else {
                    userprof = { userID: interaction.user.id, showUsername: userprof.showUsername, showNickname: userprof.showNickname, showPresence: userprof.showPresence, showGuildScore: userprof.showGuildScore, showGlobalScore: userprof.showGlobalScore, showRoles: userprof.showRoles, description: profDescription, pronouns: profPronouns, country: profCountry, customProfile: 'true'}
                    client.setUsProf.run(userprof);
                    interaction.reply({ content: "Done, you can view your profile with the /userinfo command", ephemeral: true })
                }
            }
			
            if(interaction.customId === 'userSettings') {
                const levelNotifs = interaction.fields.getTextInputValue('levelNotifs');
                const languageUser = interaction.fields.getTextInputValue('languageUser');
    
                userset = { userID: interaction.user.id, userAccess: 'false', levelNotifications: levelNotifs, language: languageUser }
                client.setUsSett.run(userset);
                interaction.reply({ content: 'Your settings have been set.', ephemeral: true })
        	}
		}
	}
};
