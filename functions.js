const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');
const sql1 = new SQLite('../globalDBs/commandMetrics.sqlite');
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

        var embedColour = config.embedColours.neutral

        if(loogType === "positive") {
            embedColour = config.embedColours.positive
        } else if(loogType === "negative") {
            embedColour = config.embedColours.negative
        } else {
            embedColour = config.embedColours.neutral
        }

        const embed = new EmbedBuilder()
            .setDescription(logText)
            .setColor(embedColour)
            .setTimestamp();

        if(sendToLogChannel) {
            if(sendToLogChannel === true) {
                client.channels.cache.get(config.tempusIDs.logs).send({ embeds: [embed] })
            }
        } else if(sendToLogChannel === false) { } else {
            client.channels.cache.get(config.tempusIDs.logs).send({ embeds: [embed] })
        }

        if(sendToConsole) {
            if(sendToConsole === true) {
                console.log(logDescription.replace("{userID}", client.users.cache.get(userID).displayName).replace("{channelID}", client.channels.cache.get(channelID).name))
            }
        } else if(sendToConsole === false) { } else {
            console.log(logDescription.replace("{userID}", client.users.cache.get(userID).displayName).replace("{channelID}", client.channels.cache.get(channelID).name))
        }
    },
    
    disableFeature: function(featureName, allowAdmin) {
        //Add logic to disable a feature using a "features" table
    },
    
    disableCommand: function(commandName, allowAdmin, unpush) {
        //Add logic to disable a command using a "commands" table
    },
    
    enableFeature: function(featureName) {
        //Add logic to enable a feature using a "features" table
    },
    
    enableCommand: function(commandName, push) {
        //Add logic to enable a command using a "commands" table
    },
    
    queryFeature: function(featureName) {
        //Add logic to check whether a feature is enabled/disabled
    },
    
    queryCommand: function(commandName) {
        //Add logic to check whether a command is enabled/disabled
    },
    
    givexp: function(client, xp, userid, guildid) {
        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

        let score;
        score = client.getScore.get(userid, guildid);

        if (!score) {
            score = { id: `${guildid}-${userid}`, user: userid, guild: guildid, points: 1, level: 0};
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

    takexp: function(client, xp, userid, guildid) {
        console.log("Taking points uwu")
        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

        let score;
        score = client.getScore.get(userid, guildid);

        if (!score) {
            score = { id: `${guildid}-${userid}`, user: userid, guild: guildid, points: 1, level: 0};
        }

        if(score.points < xp) {
            return "notEnough"
        }

        score.points -= xp;

        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
        score.level = curLevel;

        client.setScore.run(score);
        console.log("points taken")
        return true;
    },

    resetxp: function(client, userid, guildid) {
        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

        let score;
        score = client.getScore.get(userid, guildid);

        score.points = 0;

        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
        score.level = curLevel;

        client.setScore.run(score);
        return true;
    },

    commandMetrics: function(client, commandName, serverID, userID) {
        client.getGlobal = sql1.prepare("SELECT * FROM global WHERE name = ?");
        client.setGlobal = sql1.prepare("INSERT OR REPLACE INTO global (name, uses, users, servers) VALUES (@name, @uses, @users, @servers);");

        client.getGuild = sql1.prepare("SELECT * FROM perGuild WHERE name = ? AND serverid = ?")
        client.setGuild = sql1.prepare("INSERT OR REPLACE INTO perGuild (id, name, serverid, uses) VALUES (@id, @name, @serverid, @uses);");

        client.getUser = sql1.prepare("SELECT * FROM perUser WHERE name = ? AND user = ?")
        client.setUser = sql1.prepare("INSERT OR REPLACE INTO peruser (id, name, user, uses) VALUES (@id, @name, @user, @uses);");

        let global;
        global = client.getGlobal.get(commandName)

        let users;
        users = client.getUser.get(commandName, userID)

        let guilds;
        guilds = client.getGuild.get(commandName, serverID)

        if(!global) {
            global = { name: commandName, uses: 1, servers: 0, users: 0 }
        } else {
            global.uses += 1;
        }

        if(!guilds) {
            guilds = { id: `${serverID}-${commandName}`, name: commandName, serverid: serverID, uses: 1 }
            global.servers += 1;
            client.setGuild.run(guilds);
        } else {
            guilds.uses += 1;
            client.setGuild.run(guilds);
        }

        if(!users) {
            users = { id: `${userID}-${commandName}`, name: commandName, user: userID, uses: 1 }
            global.users += 1;
            client.setUser.run(users);
        } else {
            users.uses += 1;
            client.setUser.run(users);
        }

        client.setGlobal.run(global);
    }
};
