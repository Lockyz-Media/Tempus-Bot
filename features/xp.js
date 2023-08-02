const SQLite = require("better-sqlite3");
const sql = new SQLite('../bot.sqlite');
const sql1 = new SQLite('.../globalDBs/commandMetrics.sqlite');

module.exports = {
  givexp: function(client, xp, userid, guildid) {
        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
        //var response = new Object();

        let score;
        score = client.getScore.get(userid, guildid);

        if (!score) {
            score = { id: `${guildid}-${userid}`, user: userid, guild: guildid, points: 1, level: 0};
        }
        var oldS = score.points;
        //response['oldScore'] = score.points;

        score.points += xp;
        //response['newScore'] = score.points;

        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
        var oldL = score.level;
        var newL = curLevel;

        var levelup = false;
        
        if(score.level < curLevel) {
            score.level = curLevel;
            client.setScore.run(score);
            //response['levelUp'] = 'true'
            levelup = true
        } else {
            client.setScore.run(score);
            //response['levelUp'] = 'false';
            levelup = false
        }
        //return response;
        return {
          'oldScore': oldS,
          'newScore': score.points,
          'oldLevel': oldL,
          'newLevel': newL,
          'isLevelUp': levelup
        }
    },

  getxp: function(client, userid, guildid) {
    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    let score;
    score = client.getScore.get(userid, guildid);

    if (!score) {
        score = { id: `${guildid}-${userid}`, user: userid, guild: guildid, points: 1, level: 0};
    }
    return {
      score: score.points,
      level: score.level,
      userid: score.user,
      guildid: score.guild
    }
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
    }
}
