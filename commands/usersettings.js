const { PermissionsBitField, EmbedBuilder, InviteGuild, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder } = require('discord.js')
const { commandMetrics } = require('../functions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('usersettings')
        /*.setNameLocalizations({
			pl: 'pies',
			de: 'hund',
		})*/
		.setDescription('Change User settings')
        /*.setDescriptionLocalizations({
			pl: 'Rasa psa',
			de: 'Hunderasse',
		})*/
        .setDMPermission(false),

	async execute(interaction) {
        commandMetrics(interaction.client, "usersettings", interaction.guild.id, interaction.user.id)
        const client = interaction.client

        const modal = new ModalBuilder()
            .setCustomId('userSettings')
            .setTitle('User Settings')

        const levelNotifs = new TextInputBuilder()
            .setCustomId('levelNotifs')
            .setLabel("Would you like to show level notifications?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Type true or false')
            .setRequired(true)

        const languageUser = new TextInputBuilder()
            .setCustomId('languageUser')
            .setLabel("What language do you use?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Currently only \'en\', \'en-UWU\', \'de\' and \'fr\'')
            .setRequired(true)

        const secondActionRow = new ActionRowBuilder().addComponents(levelNotifs);
        const fifthActionRow = new ActionRowBuilder().addComponents(languageUser);

        modal.addComponents(secondActionRow, fifthActionRow);

        await interaction.showModal(modal);
    }
};
