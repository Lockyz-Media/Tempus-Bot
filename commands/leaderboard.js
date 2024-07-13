const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, ButtonStyle, SlashCommandBuilder } = require('discord.js')
const { embed_colours, owner_id } = require('../config');
const SQLite = require("better-sqlite3");
const messageCreate = require('../events/messageCreate');
const sql = new SQLite('./bot.sqlite');
const locale = require('../locale/en.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		/*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Show the current top XP users.')
		/*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
		.setDMPermission(false),
	async execute(interaction) {
        const client = interaction.client

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

			const top25 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 25;").all(interaction.guild.id);
			let i = 1;

			const embed = new EmbedBuilder()
				.setColor(embed_colours.main)
				.setTitle("Leaderboard")
				.setDescription("Discord.js changed the way embeds are made, we have not worked out how to make this command work with that feature just yet.\nIf you would like to view your points use /userinfo instead for now.")

			
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

	  		return interaction.reply({ embeds: [embed] });
        }
	}
};
