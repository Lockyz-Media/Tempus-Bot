module.exports = {
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
  }
