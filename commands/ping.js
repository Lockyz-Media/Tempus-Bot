const { SlashCommandBuilder } = require('discord.js');
const locale = require('../locale/en.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Replies with Pong!')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false),
	async execute(interaction) {
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
        await interaction.reply('Ping?');
        interaction.editReply(`Pong! Latency is \`${interaction.createdTimestamp - new Date()}ms\`. API Latency is \`${Math.round(interaction.client.ws.ping)}ms\`.`);
	},
};
