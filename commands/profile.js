const { PermissionsBitField, EmbedBuilder, InviteGuild, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Change your Profile')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName('messages')
            /*.setNameLocalizations({
			    pl: 'pies',
    			de: 'hund',
		    })*/
            .setDescription('Edit the various messages in your profile.')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
        )
        .addSubcommand(subcommand =>
            subcommand.setName('toggles')
            /*.setNameLocalizations({
			    pl: 'pies',
			    de: 'hund',
	        })*/
            .setDescription('Toggle what you want displayed in your profile.')
            /*.setDescriptionLocalizations({
			    pl: 'Rasa psa',
			    de: 'Hunderasse',
		    })*/
            .addBooleanOption((option) =>
                option.setName('username')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Would you like to display your username?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
            )

            .addBooleanOption((option) =>
                option.setName('nickname')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Would you like to display your nickname?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
            )

            .addBooleanOption((option) =>
                option.setName('guildscore')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Would you like to display your guild score?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
            )

            .addBooleanOption((option) =>
                option.setName('roles')
                /*.setNameLocalizations({
			        pl: 'pies',
			        de: 'hund',
		        })*/
                .setDescription('Would you like to display your roles?')
                /*.setDescriptionLocalizations({
			        pl: 'Rasa psa',
			        de: 'Hunderasse',
		        })*/
                .setRequired(true)
            )
        ),
	async execute(interaction) {
        commandMetrics(interaction.client, "profile", interaction.guild.id, interaction.user.id)
        const client = interaction.client

        if(interaction.options.getSubcommand() === 'messages') {
            const modal = new ModalBuilder()
                .setCustomId('userProfile')
                .setTitle('Profile Settings')

            const description = new TextInputBuilder()
                .setCustomId('description')
                .setLabel("Description")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Please don\'t put any private information into your description. Put none if you want to hide this.')
                .setRequired(true)
        
            const pronouns = new TextInputBuilder()
                .setCustomId('pronouns')
                .setLabel("Pronouns")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('If you don\'t want your pronouns to appear put "none" here.')
                .setRequired(true)

            const country = new TextInputBuilder()
                .setCustomId('country')
                .setLabel("Country")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('If you don\'t want your country displayed put "none" here.')
                .setRequired(true)

            const firstActionRow = new ActionRowBuilder().addComponents(description);
            const secondActionRow = new ActionRowBuilder().addComponents(pronouns);
            const thirdActionRow = new ActionRowBuilder().addComponents(country);

            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

            await interaction.showModal(modal);
        }
        if(interaction.options.getSubcommand() === 'toggles') {
            const showUsername = interaction.options.getBoolean('username')
            const showNickname = interaction.options.getBoolean('nickname')
            const showPresence = interaction.options.getBoolean('presence')
            const showGuildScore = interaction.options.getBoolean('guildScore')
            const showGlobalScore = interaction.options.getBoolean('globalScore')
            const showRoles = interaction.options.getBoolean('roles')

            client.getUsProf = sql.prepare("SELECT * FROM profile WHERE userID = ?");
            client.setUsProf = sql.prepare("INSERT OR REPLACE INTO profile (userID, showUsername, showNickname, showPresence, showGuildScore, showGlobalScore, showRoles, description, pronouns, country, customProfile) VALUES (@userID, @showUsername, @showNickname, @showPresence, @showGuildScore, @showGlobalScore, @showRoles, @description, @pronouns, @country, @customProfile);");
            let userprof = client.getUsProf.get(interaction.user.id)

            if(!userprof) {
                userprof = { userID: interaction.user.id, showUsername: showUsername.toString(), showNickname: showNickname.toString(), showPresence: showPresence.toString(), showGuildScore: showGuildScore.toString(), showGlobalScore: showGlobalScore.toString(), showRoles: showRoles.toString(), description: 'none', pronouns: 'none', country: 'none', customProfile: 'true' };
                client.setUsProf.run(userprof);
                interaction.reply({ content: "Done, you can view your profile with the /userinfo command", ephemeral: true })
            } else {
                userprof = { userID: interaction.user.id, showUsername: showUsername.toString(), showNickname: showNickname.toString(), showPresence: showPresence.toString(), showGuildScore: showGuildScore.toString(), showGlobalScore: showGlobalScore.toString(), showRoles: showRoles.toString(), description: userprof.description, pronouns: userprof.pronouns, country: userprof.country, customProfile: 'true' };
                client.setUsProf.run(userprof);
                interaction.reply({ content: "Done, you can view your profile with the /userinfo command", ephemeral: true })
            }
        }
    }
};
