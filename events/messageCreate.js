const { EmbedBuilder, Events } = require('discord.js');
const { embedColours, ownerID, tempusIDs } = require('../config');
const SQLite = require("better-sqlite3");
const humanizeDuration = require('humanize-duration');
const sql = new SQLite('./bot.sqlite');
const { nFormatter, givexp } = require("../functions.js");

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        const client = message.client
        const user = message.author.user
        const member = message.member
        const guild = message.guild
        var logsID = tempusIDs.logs
        var tempusID = tempusIDs.guild

        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        client.setUsSett = sql.prepare("INSERT OR REPLACE INTO userSettings (userID, userAccess, levelNotifications, language) VALUES (@userID, @userAccess, @levelNotifications, @language);");
        let userset = client.getUsSett.get(message.author.id)

        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

        let score;
        score = client.getScore.get(message.author.id, message.guild.id);

        if(!userset) {
            userset = { userID: message.author.id, userAccess: 'false', levelNotifications: 'true', language: 'en' };
            client.setUsSett.run(userset);
        }

        if(!score) {
            score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 0 };
        }
        
        if(message.type === 7) {
            if(message.guild.id === tempusID) {
                if(message.author.pending) {
                    return;
                } else {
                    message.member.roles.add('836632808490401842', 'User Verified')
                    const embed = new EmbedBuilder()
                        .setDescription("A user named <@"+message.author.id+"> has gone through the user verification system.")
                        //.setTitle('Member Verified | '+message.member.username)
                        .setColor(embedColours.positive)
                        .setFooter({ text: 'User ID '+ message.author.id })
                        .setTimestamp();
                    client.channels.cache.get(logsID).send({ embeds: [embed] })
                }
            }
        }
        

        if(message.author.bot) {
            return;
        }

        if(message.guild.id === tempusID)
        {
            // Make sure to go through, clean this up sometime in the future and comment TF outta it
            if(message.member.roles.cache.some(role => role.id === '850774044512354335') || message.member.roles.cache.some(role => role.id === '516554905142558730') || message.member.roles.cache.some(role => role.id === '1039698571689209857') || message.member.roles.cache.some(role => role.id === '516553151936069659') || message.member.roles.cache.some(role => role.id === '516552949246328838') || message.member.roles.cache.some(role => role.id === '640063699624656937')) {

            } else {
                if(message.member.kickable) {
                    if(message.content.toLowerCase().includes("https://discord.gg/")) {
                        if(message.content.toLowerCase().includes("only")) {
                            if(message.content.toLowerCase().includes("fan")) {
                                if(message.content.toLowerCase().includes("teen")) {
                                    if(message.content.toLowerCase().includes("leak")) {
                                        message.guild.members.ban(message.author);
                                        const embed = new EmbedBuilder()
                                            .setDescription("A user named <@"+message.author.id+"> has been detected as a spam bot, their message deleted and the user banned. They have passed 5/5 checks for a spam bot!")
                        	                .addFields({ name: 'Content', value: message.cleanContent, inline: false })
                                            .setColor(embedColours.negative)
                                            .setFooter({ text: 'User ID '+ message.author.id })
                                            .setTimestamp();
                                        client.channels.cache.get(logsID).send({ embeds: [embed] })
                                        message.delete();
                                    } else {
                                        member.timeout(48*60*60*1000, 'Discord Invite Detected!');
                                        const embed = new EmbedBuilder()
                                            .setDescription("A user named <@"+message.author.id+"> has sent a Discord Invite or could be a spam bot, their message has been deleted and the user has been muted. They have passed 4/5 checks for a spam bot!")
                                            .addFields({ name: 'Content', value: message.cleanContent, inline: false })
                                            .setColor(embedColours.negative)
                                            .setFooter({ text: 'User ID '+ message.author.id })
                                            .setTimestamp();
                                        client.channels.cache.get(logsID).send({ embeds: [embed] })
                                        message.delete();
                                    }
                                } else {
                                    member.timeout(48*60*60*1000, 'Discord Invite Detected!');
                                    const embed = new EmbedBuilder()
                                        .setDescription("A user named <@"+message.author.id+"> has sent a Discord Invite or could be a spam bot, their message has been deleted and the user has been muted. They have passed 3/5 checks for a spam bot!")
                        	            .addFields({ name: 'Content', value: message.cleanContent, inline: false })
                                        .setColor(embedColours.negative)
                                        .setFooter({ text: 'User ID '+ message.author.id })
                                        .setTimestamp();
                                    client.channels.cache.get(logsID).send({ embeds: [embed] })
                                    message.delete();
                                }
                            } else {
                                member.timeout(48*60*60*1000, 'Discord Invite Detected!');
                                const embed = new EmbedBuilder()
                                    .setDescription("A user named <@"+message.author.id+"> has sent a Discord Invite or could be a spam bot, their message has been deleted and the user has been muted. They have passed 2/5 checks for a spam bot!")
                        	        .addFields({ name: 'Content', value: message.cleanContent, inline: false })
                                    .setColor(embedColours.negative)
                                    .setFooter({ text: 'User ID '+ message.author.id })
                                    .setTimestamp();
                                client.channels.cache.get(logsID).send({ embeds: [embed] })
                                message.delete();
                            }
                        } else {
                            member.timeout(48*60*60*1000, 'Discord Invite Detected!');
                            const embed = new EmbedBuilder()
                                .setDescription("A user named <@"+message.author.id+"> has sent a Discord Invite, their message has been deleted and the user has been muted.")
                        	    .addFields({ name: 'Content', value: message.cleanContent, inline: false })
                                .setColor(embedColours.negative)
                                .setFooter({ text: 'User ID '+ message.author.id })
                                .setTimestamp();
                            client.channels.cache.get(logsID).send({ embeds: [embed] })
                            message.delete();
                        }
                    }
                }
            }

            const cooldowns = new Map();
            const cooldown = cooldowns.get(message.author.id);
            if(cooldown) {
                const remaining = humanizeDuration(cooldown - Date.now());
                return;
            }

            cooldowns.set(message.author.id, Date.now() + 7000);
            setTimeout(() => cooldowns.delete(message.author.id, tempusID), 7000);

            //Points given can be anything from 1-10
            const oldLevel = score.level
            const pointsToAdd = Math.floor(Math.random() * 10) + 1;
            //score.points += pointsToAdd;

            givexp(client, pointsToAdd, message.author.id, tempusID);

            //Calculate the current level through MATH... Please help
            //0.1 times(the square root of score.points) rounded down to the nearest whole finds the current level.
            const curLevel = Math.floor(0.1 * Math.sqrt(pointsToAdd));

            //Check if the user has leveled up, and let them know if they have
            if(oldLevel < curLevel) {
                if(userset.levelNotifications === 'true') {
                    const embed = new EmbedBuilder()
                    //.setTitle('🎉 LEVEL UP 🎉')
                    .setDescription('🎉🎉 Congratulations **'+message.member.username+'**, you\'ve earnt a total of **'+nFormatter(score.points, 2)+'**, which is enough for **Level '+nFormatter(curLevel, 0)+'** 🎉🎉')
                    .setColor(embedColours.positive)
                    //.setFooter({ text: 'This message can be turned off with the `/usersettings` command' })
                    .setTimestamp()
                message.channel.send({ embeds: [embed] });
                }
            }

            client.setScore.run(score);
            return;
        }
    }
}
