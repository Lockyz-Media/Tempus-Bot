const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, ButtonStyle } = require('discord.js')
const { commandMetrics } = require('../functions.js')
const { embedColor, ownerID } = require('../config');
const locale = require('../locale/en.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('store')
		.setDescription('The Tempus Bot store, use your Tempus Coin to buy stuff.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('purchase')
                .setDescription('Buy an item from the store.')
                .addStringOption((option) =>
                    option
                        .setName('item')
                        .setDescription('The item you wanna buy')
                        .setRequired(true)
                        .addChoices(
                            { name: 'List', value: '0000' },
                            { name: 'Dead Dog (png)', value: '0001' },
                            { name: 'Dead Dog (png)', value: '0002' },
                            { name: 'Dead Dog (png)', value: '0003' }
                        )
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('item')
                .setDescription('Get information on the Items contained within the store')
                .addStringOption((option) =>
                    option
                        .setName('item_id')
                        .setDescription('The ID of the item you want information for. Leave out for an item list.')
                        .addChoices(
                            { name: 'List', value: '0000' },
                            { name: 'Dead Dog (png)', value: '0001' },
                            { name: 'Dead Dog (png)', value: '0002' },
                            { name: 'Dead Dog (png)', value: '0003' }
                        )
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('inventory')
                .setDescription('View everything you\'ve bought with Tempus Coin')
        ),
	async execute(interaction) {
        commandMetrics(interaction.client, "store", interaction.guild.id, interaction.user.id)
        const client = interaction.client

        switch (interaction.options.getSubcommand()) {
            case 'inventory':
                interaction.reply({ content: 'This test has been paused'})
            break;
            case 'item':
                const itemID = interaction.options.getString('item_id');

                switch (itemID) {
                    case '0000':
                        const embed0 = new EmbedBuilder()
                            .setTitle('Item List')
                            .addField('Item 0001: Dead Dog png', '~~2000 Tempus Coin~~\n**Out of Stock**', true)
                            .addField('Item 0002: Dead Dog png', '~~2000 Tempus Coin~~\n**Out of Stock**', true)
                            .addField('Item 0003: Dead Dog png', '~~2000 Tempus Coin~~\n**Out of Stock**', true)
                            .setFooter({ text: 'This command is a concept and subject to change' })
                        interaction.reply({ embeds: [embed0], ephemeral: true })
                    break;
                    case '0001':
                        const embed1 = new EmbedBuilder()
                            .setTitle('Item 0001: Dead Dog png')
                            .setDescription('It\'s a dead dog in a box but as a png\nDon\'t question it, we don\'t know either.\n\nThis item has no use at this current time.')
                            .addField('Price', '~~2000 Tempus Coin~~\n**Out of Stock**', true)
                            .addField('Stock', '**Out of Stock**', true)
                            .addField('Purchase', '~~`/store purchase 0001 {amount}`~~\n**Out of Stock**', true)
                            .setFooter({ text: 'This command is a concept and subject to change' })
                        interaction.reply({ embeds: [embed1], ephemeral: true })
                    break;
                    case '0002':
                        const embed2 = new EmbedBuilder()
                            .setTitle('Item 0002: Dead Dog png')
                            .setDescription('It\'s a dead dog in a box but as a png\nDon\'t question it, we don\'t know either.\n\nThis item has no use at this current time.')
                            .addField('Price', '~~2000 Tempus Coin~~\n**Out of Stock**', true)
                            .addField('Stock', '**Out of Stock**', true)
                            .addField('Purchase', '~~`/store purchase 0002 {amount}`~~\n**Out of Stock**', true)
                            .setFooter({ text: 'This command is a concept and subject to change' })
                        interaction.reply({ embeds: [embed2], ephemeral: true })
                    break;
                    case '0003':
                        const embed3 = new EmbedBuilder()
                            .setTitle('Item 0003: Dead Dog png')
                            .setDescription('It\'s a dead dog in a box but as a png\nDon\'t question it, we don\'t know either.\n\nThis item has no use at this current time.')
                            .addField('Price', '~~2000 Tempus Coin~~\n**Out of Stock**', true)
                            .addField('Stock', '**Out of Stock**', true)
                            .addField('Purchase', '~~`/store purchase 0003 {amount}`~~\n**Out of Stock**', true)
                            .setFooter({ text: 'This command is a concept and subject to change' })
                        interaction.reply({ embeds: [embed3], ephemeral: true })
                    break;
                    default:
                        interaction.reply({ content: 'This command is currently only available as a concept at this current time and is subject to change in the near future.', ephemeral: true })
                }
            break;
            case 'purchase':
                interaction.reply({ content: 'This command is currently only available as a concept at this current time and is subject to change in the near future.', ephemeral: true })
            break;
            default:
                interaction.reply({ content: 'This command is currently only available as a concept at this current time and is subject to change in the near future.', ephemeral: true})
        }
	}
};
