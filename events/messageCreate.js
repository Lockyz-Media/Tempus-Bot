const { EmbedBuilder } = require('discord.js');
const { embedColours, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const humanizeDuration = require('humanize-duration');
const sql = new SQLite('./bot.sqlite');
const { nFormatter, givexp } = require("../functions.js");

module.exports = {
    name: 'messageCreate',
    execute(message) {
        const client = message.client
        const user = message.author.user
        const member = message.author
        const guild = message.guild
        var logsID = '635300240819486732'
        var tempusID = '516551738249969675'

        if(message.channel.id === '875652753924448306') {
            if(message.author.id === '835394949612175380') {
                const embed = new EmbedBuilder()
                    .setColor(embedColours.lockyzdev)
                    .setDescription(message.cleanContent)
                client.channels.cache.get(logsID).send({ content: "# New message from Lockyz Dev", embeds: [embed] })
            }
        }

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
        
        const row0 = ['http://', 'https://', 'http', 'www.']
        const row1 = ['free', 'get', 'click', 'take', 'gift', '@everyone']
        const row2 = ['nitro', 'diiscord', 'niitro', 'nitr', 'disc', 'diskord', 'disckord', 'taplink', 'discords', 'tinyurl', 'bit.ly']
        const row3 = ['airdrop', 'steam', 'referral', 'epic', 'promotion', 'twitch', 'running out', 'first', '@everyone']
        const row4 = ['https://discord.gift/', 'https://discord.com/billing/promotions/', 'https://promos.discord.gg/']

        if(row0.some(word => message.content.toLowerCase().includes(word))) {
            if(row1.some(word => message.content.toLowerCase().includes(word))) {
                if(row2.some(word => message.content.toLowerCase().includes(word))) {
                    if(row3.some(word => message.content.toLowerCase().includes(word))) {
                        if(row4.some(word => message.content.toLowerCase().includes(word))) {
                                    return;
                        }
                        const logEmbed = new EmbedBuilder()
                            .setColor(embedColours.negative)
                            if(message.member.kickable) {
                                logEmbed.setDescription('A message by <@'+message.user.id+"> has content matching the Nitro Scam filter. The message has been deleted and the user timed out.")
                            } else {
                                logEmbed.setDescription('A message by <@'+message.user.id+"> has content matching the Nitro Scam filter. The message has been deleted however the user cannot be timed out.")
                            }
                            logEmbed.addFields({ name: 'Message Content', value: message.cleanContent})
                            logEmbed.setTimestamp()
                        client.channels.cache.get(logsID).send({ embeds: [logEmbed]})
                        if(message.member.kickable) {
                            message.member.timeout(60 * 60 * 1000, 'Automatic nitro scam detection')
                        }
                        message.delete()
                        message.channel.send({ content: 'Message was detected as a `Nitro Scam` if this was done in error please contact a moderator.\n\nIf you have clicked a link within this message contact Discord Support RIGHT AWAY to avoid having your account stolen: <https://support.discord.com/hc/en-us/requests/new>' })
                    }
                }
            }
        }
        

        if(message.author.bot) {
            return;
        }

        if(message.guild.id === tempusID)
        {
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
