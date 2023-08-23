const { MessageEmbed, ActionRowBuilder, ButtonBuilder, Message, ButtonStyle, SlashCommandBuilder } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const { embedColor, ownerID } = require('../config');
const owospeak = require("owospeak");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('owoify')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('UwU wats dis? You want t-to owoify a message? Oh Senpai-san-.- p-pwease u-use me.')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName('message')
            /*.setNameLocalizations({
			    pl: 'pies',
    			de: 'hund',
	        })*/
            .setDescription('What message wouwd you w-wike to o-owoify senpai-san?')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
            .setRequired(true)
        ),
	async execute(interaction) {
        commandMetrics(interaction.client, "owoify", interaction.guild.id, interaction.user.id)
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
        const message = interaction.options.getString('message');

        interaction.reply({ content: owospeak.convert(locale.owoWait, { stutter: true, tilde: true }) })

        setTimeout(function(){
            interaction.channel.messages.fetch(message)
            .then(message => interaction.editReply({ content: owospeak.convert(message.cleanContent, { stutter: true, tilde: true })}))
            .catch(console.error);
        }, 5000)
	}
};
