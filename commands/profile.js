const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, InviteGuild, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle  } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Change your Profile')
        .addSubcommand((subcommand =>
            subcommand
                .setName('messages')
                .setDescription('Edit the various messages in your profile.')
            ))
        .addSubcommand(subcommand =>
            subcommand
                .setName('toggles')
                .setDescription('Toggle what you want displayed in your profile.')
                .addStringOption((option) =>
                    option
                        .setName('username')
                        .setDescription('Would you like to display your username?')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Yes', value: 'true' },
                            { name: 'No', value: 'false' },
                        ))
                .addStringOption((option) =>
                    option
                        .setName('nickname')
                        .setDescription('Would you like to display your nickname?')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Yes', value: 'true' },
                            { name: 'No', value: 'false' },
                        ))
                .addStringOption((option) =>
                    option
                        .setName('guildscore')
                        .setDescription('Would you like to display your guild score?')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Yes', value: 'true' },
                            { name: 'No', value: 'false' },
                        ))
                .addStringOption((option) =>
                    option
                        .setName('roles')
                        .setDescription('Would you like to display your roles?')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Yes', value: 'true' },
                            { name: 'No', value: 'false' },
                        ))),
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
            const showUsername = interaction.options.getString('username')
            const showNickname = interaction.options.getString('nickname')
            const showPresence = interaction.options.getString('presence')
            const showGuildScore = interaction.options.getString('guildScore')
            const showGlobalScore = interaction.options.getString('globalScore')
            const showRoles = interaction.options.getString('roles')

            client.getUsProf = sql.prepare("SELECT * FROM profile WHERE userID = ?");
            client.setUsProf = sql.prepare("INSERT OR REPLACE INTO profile (userID, showUsername, showNickname, showPresence, showGuildScore, showGlobalScore, showRoles, description, pronouns, country, customProfile) VALUES (@userID, @showUsername, @showNickname, @showPresence, @showGuildScore, @showGlobalScore, @showRoles, @description, @pronouns, @country, @customProfile);");
            let userprof = client.getUsProf.get(interaction.user.id)

            if(!userprof) {
                userprof = { userID: interaction.user.id, showUsername: showUsername, showNickname: showNickname, showPresence: showPresence, showGuildScore: showGuildScore, showGlobalScore: showGlobalScore, showRoles: showRoles, description: 'none', pronouns: 'none', country: 'none', customProfile: 'true' };
                client.setUsProf.run(userprof);
                interaction.reply({ content: "Done, you can view your profile with the /userinfo command", ephemeral: true })
            } else {
                userprof = { userID: interaction.user.id, showUsername: showUsername, showNickname: showNickname, showPresence: showPresence, showGuildScore: showGuildScore, showGlobalScore: showGlobalScore, showRoles: showRoles, description: userprof.description, pronouns: userprof.pronouns, country: userprof.country, customProfile: 'true' };
                client.setUsProf.run(userprof);
                interaction.reply({ content: "Done, you can view your profile with the /userinfo command", ephemeral: true })
            }
        }
    }
};
