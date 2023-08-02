module.exports = {
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
}
}
