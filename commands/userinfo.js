const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, ButtonStyle } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Get user information.')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want information on (Optional)')
                .setRequired(false)
        ),
	async execute(interaction) {
        commandMetrics(interaction.client, "userprofile", interaction.guild.id, interaction.user.id)
        const client = interaction.client
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')
        const membera = interaction.user
        const usra = interaction.options.getUser('user');
        var user
        var usAcc

        if(!usra) {
            user = membera
            usAcc = "true"
        } else {
            user = usra
            client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
            let userset = client.getUsSett.get(user.id)

            if(userset) {
                usAcc = "false"
            } else if(userset.userAccess === "false") {
                usAcc = "false"
            } else {
                usAcc = "true"
            }
        }
        let usearset = client.getUsSett.get(user.id)
        const member = interaction.guild.members.cache.get(user.id);

        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        let score = client.getScore.get(user.id, interaction.guild.id);

        client.getUsProf = sql.prepare("SELECT * FROM profile WHERE userID = ?");
        let userprof = client.getUsProf.get(interaction.user.id)

        function nFormatter(num, digits) {
            const lookup = [
                { value: 1, symbol: "" },
                { value: 1e3, symbol: "k" },
                { value: 1e6, symbol: "M" },
                { value: 1e9, symbol: "G" },
                { value: 1e12, symbol: "T" },
                { value: 1e15, symbol: "P" },
                { value: 1e18, symbol: "E" }
            ];

            const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
              var item = lookup.slice().reverse().find(function(item) {
                return num >= item.value;
              });
              return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
        }

        if(userprof) {
            const embed = new EmbedBuilder()
                .setTitle(user.username+' | User Profile | BETA')
                .setThumbnail(user.avatarURL())
                if(userprof.description === 'false') {
                } else {
                    embed.setDescription(userprof.description);
                }
                if(userprof.showUsername === 'true') {
                    embed.addFields({ name: 'Username', value: user.username, inline: true })
                }

                if(userprof.showNickname === 'true') {
                    if(member.nickname != null) {
                        embed.addFields({ name: 'Nickname', value: member.nickname, inline: true })
                    }
                }

                embed.addFields({ name: 'Joined', value: '<t:'+Math.floor(new Date(member.joinedAt).getTime() / 1000)+'>', inline: true })

                if(usearset) {
                    embed.addFields({ name: 'Language', value: usearset.language, inline: true })
                }

                if(userprof.pronouns === "false") {
                } else {
                    embed.addFields({ name: 'Pronouns', value: userprof.pronouns, inline: true })
                }

                if(userprof.country === "false") {
                } else {
                    embed.addFields({ name: 'Country', value: userprof.country, inline: true })
                }

                embed.addFields({ name: '\u200b', value: '\u200b', inline: true })

                if(userprof.showGuildScore === 'true') {
                    if(score) {
                        var pointsNeed = Math.floor(Math.pow(((score.level+1)/0.1), 2));
                        var nextLevel = Math.floor(score.level+1)
                        embed.addFields([
                            { name: 'Score', value: nFormatter(score.points, 2), inline: true },
                            { name: 'Level', value: 'Level: '+nFormatter(score.level, 0)+' | Next Level: '+nFormatter(nextLevel, 0), inline: true },
                            { name: "Points needed for Level "+nFormatter(nextLevel, 0), value: nFormatter(pointsNeed, 2)+' points', inline: true },
                        ])
                    }
                }
                if(userprof.showRoles === 'true') {
                    embed.addFields({ name: 'Roles', value: member.roles.cache.map(r => r.toString()).join(' | ') })
                }
                embed.setFooter({ text: 'ID: '+user.id+ ' | User Created: ' })
                embed.setTimestamp(user.createdTimestamp)
            interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setTitle('User Info')
                .setThumbnail(user.avatarURL())
                .addFields({ name: 'Username', value: user.username, inline:  true })
                if(member.nickname != null) {
                    embed.addFields({ name: 'Nickname', value: member.nickname, inline: true})
                }

                embed.addFields({ name: '\u200b', value: '\u200b', inline: true})
                if(score) {
                    var pointsNeed = Math.floor(Math.pow(((score.level+1)/0.1), 2));
                    var nextLevel = Math.floor(score.level+1)
                    embed.addFields([
                        { name: 'Score', value: nFormatter(score.points, 2), inline: true },
                        { name: 'Level', value: 'Level: '+nFormatter(score.level, 0)+' | Next Level: '+nFormatter(nextLevel, 0), inline: true },
                        { name: "Points needed for Level "+nFormatter(nextLevel, 0), value: nFormatter(pointsNeed, 2)+' points', inline: true },
                    ])
                }

                embed.addFields({ name: 'Roles', value: member.roles.cache.map(r => r.toString()).join(' | ')})
                embed.setFooter({ text: 'Information requiring user access has been removed.' })
                embed.setTimestamp()
            interaction.reply({ embeds: [embed] });
        }
	}
};
