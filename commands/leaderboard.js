const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, ButtonStyle } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const { embedColours, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const messageCreate = require('../events/messageCreate');
const sql = new SQLite('./bot.sqlite');
const locale = require('../locale/en.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the current top XP users.')
		.addStringOption((option) =>
            option
                .setName('leaderboard')
                .setDescription('Which leaderboard did you wanna use?')
                .setRequired(true)
                .addChoices(
                    { name: 'Top 5', value: 'top5'},
                    { name: 'Top 10', value: 'top10'},
                    { name: 'Top 15', value: 'top15'},
                    { name: 'Top 20', value: 'top20'},
					{ name: 'Top 25', value: 'top25'},
                )
        ),
	async execute(interaction) {
		commandMetrics(interaction.client, "leaderboard", interaction.guild.id, interaction.user.id)
        const client = interaction.client
		const leaderboard = interaction.options.getString('leaderboard')

        const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
	    if (!table['count(*)']) {
	        sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
	        sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
	        sql.pragma("synchronous = 1");
	        sql.pragma("journal_mode = wal");
	    }
	    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

        let score;

        if(interaction.guild) {
            
            score = client.getScore.get(interaction.user.id, interaction.guild.id);

            if(!score) {
                score = { id: `${interaction.guild.id}-${interaction.user.id}`, user: interaction.user.id, guild: interaction.guild.id, points: 0, level: 0 };
            }

            const top5 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 5;").all(interaction.guild.id);
			const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(interaction.guild.id);
			const top15 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 15;").all(interaction.guild.id);
			const top20 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 20;").all(interaction.guild.id);
			const top25 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 25;").all(interaction.guild.id);
			let i = 1;

			const embed = new EmbedBuilder()
				.setColor(embedColours.main)
				.setTitle("Leaderboard")
				.setDescription("Discord.js changed the way embeds are made, we have not worked out how to make this command work with that feature just yet.\nIf you would like to view your points use /userinfo instead for now.")

			if(leaderboard === 'top5') {
				embed.setTitle("Top Five")
				embed.setDescription("Our top 5 points leaders!")

				for(const data of top5) {
					let user = interaction.guild.members.cache.get(data.user)
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
					if(!user) {
						embed.addFields({ name: i.toString()+')', type: '**<@'+data.user+'>** with over **'+nFormatter(data.points, 2)+' XP** and at **Level '+nFormatter(data.level, 0)+'**'})
					} else {
						embed.addFields({ name: i.toString()+')', type: '**<@'+data.user+'>** with over **'+nFormatter(data.points, 2)+' XP** and at **Level '+nFormatter(data.level, 0)+'**'})
					}
					i++
				  }
			}

			if(leaderboard === 'top10') {
				embed.setTitle("Top Ten")
				embed.setDescription("Our top 10 points leaders!")

				for(const data of top10) {
					let user = interaction.guild.members.cache.get(data.user)
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
	
					if(i <= 6) {
						if(!user) {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** with over **'+nFormatter(data.points, 2)+' XP** and at **Level '+nFormatter(data.level, 0)+'**'});
						} else {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** with over **'+nFormatter(data.points, 2)+' XP** and at **Level '+nFormatter(data.level, 0)+'**'});
						}
					} else {
						if(!user) {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** at **Level '+nFormatter(data.level, 0)+'**'});
						} else {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** at **Level '+nFormatter(data.level, 0)+'**'});
						}
					}
					i++
				  }
			}

			if(leaderboard === 'top15') {
				embed.setTitle("Top Fifteen")
				embed.setDescription("Our top 15 points leaders!")

				for(const data of top15) {
					let user = interaction.guild.members.cache.get(data.user)
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
	
					if(i <= 6) {
						if(!user) {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** with over **'+nFormatter(data.points, 2)+' XP** and at **Level '+nFormatter(data.level, 0)+'**'});
						} else {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** with over **'+nFormatter(data.points, 2)+' XP** and at **Level '+nFormatter(data.level, 0)+'**'});
						}
					} else {
						if(!user) {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** at **Level '+nFormatter(data.level, 0)+'**'});
						} else {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** at **Level '+nFormatter(data.level, 0)+'**'});
						}
					}
					i++
				  }
			}

			if(leaderboard === 'top20') {
				embed.setTitle("Top Twenty")
				embed.setDescription("Our top 20 points leaders!")

				for(const data of top20) {
					let user = interaction.guild.members.cache.get(data.user)
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
	
					if(i <= 6) {
						if(!user) {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** with over **'+nFormatter(data.points, 2)+' XP** and at **Level '+nFormatter(data.level, 0)+'**'});
						} else {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** with over **'+nFormatter(data.points, 2)+' XP** and at **Level '+nFormatter(data.level, 0)+'**'});
						}
					} else {
						if(!user) {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** at **Level '+nFormatter(data.level, 0)+'**'});
						} else {
							embed.addFields({ name: '\u200b', value: i.toString()+') **<@'+data.user+'>** at **Level '+nFormatter(data.level, 0)+'**'});
						}
					}
					i++
				  }
			}

			if(leaderboard === 'top25') {
				embed.setTitle("Top Twenty-Five")
				embed.setDescription("Our top 25 points leaders!")

				for(const data of top25) {
					let user = interaction.guild.members.cache.get(data.user)
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
	
					if(i <= 6) {
						if(!user) {
							embed.addField('\u200b', i.toString()+') **<@'+data.user+'>** with over **'+nFormatter(data.points, 2)+' XP** and at **Level '+nFormatter(data.level, 0)+'**');
						} else {
							embed.addField('\u200b', i.toString()+') **<@'+data.user+'>** with over **'+nFormatter(data.points, 2)+' XP** and at **Level '+nFormatter(data.level, 0)+'**');
						}
					} else {
						if(!user) {
							embed.addField('\u200b', i.toString()+') **<@'+data.user+'>** at **Level '+nFormatter(data.level, 0)+'**');
						} else {
							embed.addField('\u200b', i.toString()+') **<@'+data.user+'>** at **Level '+nFormatter(data.level, 0)+'**');
						}
					}
					i++
				  }
			}

	  		return interaction.reply({ embeds: [embed] });
        }
	}
};
