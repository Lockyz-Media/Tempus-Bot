const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');
const { EmbedBuilder } = require('discord.js');
const config = require("./config");

module.exports = {
    logFunction: function(client, channelID, userID, logDescription, logType, sendToConsole, sendToLogChannel){
        const logTypes = [
            "positive",
            "negative",
            "neutral"
        ]

        if(Number.isInteger(logType)) {
        } else {
            return "The resulting log cannot be found";
        }

        const loogType = logTypes[logType];

        var logText = logDescription.replace("{userID}", "<@"+userID+">").replace("{channelID}", "<#"+channelID+">")

        var embedColour = config.embed_colours.neutral

        if(loogType === "positive") {
            embedColour = config.embed_colours.positive
        } else if(loogType === "negative") {
            embedColour = config.embed_colours.negative
        } else {
            embedColour = config.embed_colours.neutral
        }

        const embed = new EmbedBuilder()
            .setDescription(logText)
            .setColor(embedColour)
            .setTimestamp();

        if(sendToLogChannel === true) {
            client.channels.cache.get(config.channel_ids.logs).send({ embeds: [embed] })
        }

        if(sendToConsole === true) {
            console.log(logDescription.replace("{userID}", client.users.cache.get(userID).displayName).replace("{channelID}", client.channels.cache.get(channelID).name))
        }
    },
    
    givexp: function(client, xp, userid, guild_id) {
        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

        let score;
        score = client.getScore.get(userid, guild_id);

        if (!score) {
            score = { id: `${guild_id}-${userid}`, user: userid, guild: guild_id, points: 1, level: 0};
        }

        score.points += xp;

        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
        
        if(score.level < curLevel) {
            score.level = curLevel;
            client.setScore.run(score);
            return "levelUp";
        } else {
            client.setScore.run(score);
            return true;
        }
    },

    ranNum: function( min, max ) {
        if(Number.isInteger(min) === false) {
            return "minNotInt";
        } else if(Number.isInteger(max === false)) {
            return "maxNotInt";
        } else {
            var result = Math.floor(Math.random() * max) + min;
            return result;
        }
    },

    nFormatter: function(num, digits) {
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
    },

    takexp: function(client, xp, userid, guild_id) {
        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

        let score;
        score = client.getScore.get(userid, guild_id);

        if (!score) {
            score = { id: `${guild_id}-${userid}`, user: userid, guild: guild_id, points: 1, level: 0};
        }

        if(score.points < xp) {
            return "notEnough"
        }

        score.points -= xp;

        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
        score.level = curLevel;

        client.setScore.run(score);
        return true;
    },

    resetxp: function(client, userid, guild_id) {
        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

        let score;
        score = client.getScore.get(userid, guild_id);

        score.points = 0;

        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
        score.level = curLevel;

        client.setScore.run(score);
        return true;
    }
};
