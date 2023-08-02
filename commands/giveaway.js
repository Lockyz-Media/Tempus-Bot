const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { commandMetrics } = require('../features/miscFunctions.js')
const ms = require("ms");
const locale = require('../locale/en.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('Giveaway Manager, create, edit, end, etc giveaways.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create Giveaways')
                .addStringOption((option) => 
			        option
				        .setName('duration')
				        .setDescription('How long you\'d like the giveaway to run for (ex. 7D for 7 days).')
				        .setRequired(true)
		        )
                .addIntegerOption((option) =>
                    option
                        .setName('winners')
                        .setDescription('The number of winners you want')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('prize')
                        .setDescription('The thing you want to give away')
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .setName('channel')
                        .setDescription('The channel you want to start the giveaway in')
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName('isdrop')
                        .setDescription('Is this a drop? i.e is the first person to react the winner?')
                )
                .addStringOption((option) => 
                    option
                    .setName('reaction')
                    .setDescription('The reaction you\'d like to use for the giveaway')
                    .addChoices(
                        { name: '🎉', value: '🎉' },
                        { name: '🎁', value: '🎁' },
                        { name: '✅', value: '✅' },
                        { name: '🎟️', value: '🎟️' },
                    )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edit Giveaways')
                .addStringOption((option) =>
                    option
                        .setName('message_id')
                        .setDescription('The giveaways message ID')
                        .setRequired(true)
                )
                .addStringOption((option) => 
			        option
				        .setName('addtime')
				        .setDescription('How much time to add (ex. 7D for 7 days).')
				        .setRequired(false)
		        )
                .addIntegerOption((option) =>
                    option
                        .setName('newwinnercount')
                        .setDescription('The number of winners you want')
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('newprize')
                        .setDescription('The thing you want to give away')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('End a currently running giveaway.')
                .addStringOption((option) =>
                    option
                        .setName('message_id')
                        .setDescription('The giveaways message ID')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('cancel')
                .setDescription('Cancel a currently running giveaway and deletes the message.')
                .addStringOption((option) =>
                    option
                        .setName('message_id')
                        .setDescription('The giveaways message ID')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pause')
                .setDescription('Pause a currently running giveaway.')
                .addStringOption((option) =>
                    option
                        .setName('message_id')
                        .setDescription('The giveaways message ID')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unpause')
                .setDescription('Unpause a currently paused giveaway.')
                .addStringOption((option) =>
                    option
                        .setName('message_id')
                        .setDescription('The giveaways message ID')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('builder')
                .setDescription('Giveaway Builder, uses a modal.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('Reroll an ended giveaway.')
                .addStringOption((option) =>
                    option
                        .setName('message_id')
                        .setDescription('The giveaways message ID')
                        .setRequired(true)
                )
        ),
	async execute(interaction) {
        commandMetrics(interaction.client, "flip", interaction.guild.id, interaction.user.id)
        const client = interaction.client
        const member = interaction.member
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        if(member.roles.cache.some(role => role.name === 'Giveaway Manager') || member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            if(interaction.options.getSubcommand() === 'builder') {
                const modal = new Modal()
                    .setCustomId('giveawayBuilder')
                    .setTitle('Giveaway Builder')

                const duration = new TextInputComponent()
                    .setCustomId('duration')
                    .setLabel("Duration")
                    .setStyle('SHORT')
                    .setPlaceholder('How long you\'d like the giveaway to run for (ex. 7D for 7 days).')
                    .setRequired(true)

                const winnerCount = new TextInputComponent()
                    .setCustomId('winnerCount')
                    .setLabel("winnerCount")
                    .setStyle('SHORT')
                    .setPlaceholder('The number of winners you want, only insert a number here.')
                    .setRequired(true)

                const prize = new TextInputComponent()
                    .setCustomId('prize')
                    .setLabel("prize")
                    .setStyle('SHORT')
                    .setPlaceholder('The prize to give away')
                    .setRequired(true)

                const firstActionRow = new MessageActionRow().addComponents(duration);
                const secondActionRow = new MessageActionRow().addComponents(winnerCount);
                const thirdActionRow = new MessageActionRow().addComponents(prize);

                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

                await interaction.showModal(modal);
            } else if(interaction.options.getSubcommand() === 'edit') {
                const addTime = interaction.options.getString('addtime');
                const winnerCount = interaction.options.getInteger('newwinnercount');
                const prize = interaction.options.getString('newprize');
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                if(!giveaway) {
                    interaction.reply({ content: locale.giveawayNotFoun, ephemeral: trued })
                    return;
                }

                var origWinCount = giveaway.data.winnerCount;
                var origPrize = giveaway.data.prize;
                var noowWinnerCount;
                var noowPrize;
                var eedTime

                if(prize) {
                    noowPrize = prize;
                } else {
                    noowPrize = origPrize;
                }

                if(winnerCount) {
                    noowWinnerCount = winnerCount;
                } else {
                    noowWinnerCount = origWinCount;
                }

                if(addTime) {
                    eedTime = ms(addTime)
                } else {
                    eedTime = 0;
                }

                client.giveawaysManager.edit(messageId, {
                    addTime: eedTime,
                    newWinnerCount: noowWinnerCount,
                    newPrize: noowPrize,
                }).then((gData) => {
                    interaction.reply({ content: 'Success! Giveaway updated!', ephemeral: true })
                })
                .catch((err) => {
                    interaction.reply({ content: `An error has occurred, please check and try again.\n\`${err}\``, ephemeral: true });
                });
            } else if(interaction.options.getSubcommand() === 'create') {
                const duration = interaction.options.getString('duration');
                const winnerCount = interaction.options.getInteger('winners');
                const prize = interaction.options.getString('prize');
                const gChannel = interaction.options.getChannel('channel');
                const isDrape = interaction.options.getBoolean('isdrop');
                const reactian = interaction.options.getString('reaction');
                var isDroop = false;
                var giveChannel;
                var reactoon;

                if(isDrape) {
                    isDroop = isDrape;
                } else {
                    isDroop = false;
                }

                if(gChannel) {
                    giveChannel = gChannel;
                } else {
                    giveChannel = interaction.channel;
                }

                if(reactian) {
                    reactoon = reactian;
                } else {
                    reactoon = '🎁';
                }

                client.giveawaysManager.start(giveChannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    botsCanWin: false,
                    isDrop: isDroop,
                    reaction: reactoon,
                    lastChance: {
                        enabled: true,
                        content: locale.giveawayLastChance,
                        threshold: 5000,
                        embedColor: '#FF0000'
                    },
	                messages: {
		                inviteToParticipate: 'React with '+reactoon+' to participate!',
		                dropMessage: 'Be the first to react with '+reactoon+'!'
	                }
                }).then((gData) => {
                    interaction.reply({ content: locale.giveawayStarted, ephemeral: true })
                })
            } else if (interaction.options.getSubcommand() === 'cancel') {
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: locale.giveawayNotFoun, ephemeral: trued })
                    return;
                }

                client.giveawaysManager.delete(messageId).then(() => {
                    interaction.reply({ content: 'Success! Giveaway Deleted!', ephemeral: true });
                }).catch((err) => {
                    interaction.reply({ content: locale.errorDefault.replace('{error}', err), ephemeral: true })
                })
            } else if (interaction.options.getSubcommand() === 'end') {
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: locale.giveawayNotFound })
                    return;
                }

                client.giveawaysManager.end(messageId).then(() => {
                    interaction.reply({ content: locale.giveawayEndCommand });
                }).catch((err) => {
                    interaction.reply({ content: locale.errorDefault.replace('{error}', err)})
                })
            } else if(interaction.options.getSubcommand() === 'pause') {
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: locale.giveawayNotFound })
                    return;
                }

                client.giveawaysManager.pause(messageId).then(() => {
                    interaction.reply({ content: locale.giveawayPauseCommand });
                }).catch((err) => {
                    interaction.reply({ content: locale.errorDefault.replace('{error}', err)})
                })
            } else if(interaction.options.getSubcommand() === 'unpause') {
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: locale.giveawayNotFound})
                    return;
                }

                client.giveawaysManager.unpause(messageId).then(() => {
                    interaction.reply({ content: locale.giveawayUnpauseCommand });
                }).catch((err) => {
                    interaction.reply({ content: locale.errorDefault.replace('{error}', err)})
                })
            } else if(interaction.options.getSubcommand() === 'reroll') {
                const messageId = interaction.options.getString('message_id')

                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: locale.giveawayNotFound})
                    return;
                }

                client.giveawaysManager.reroll(messageId).then(() => {
                    interaction.reply({ content: locale.giveawayRerollCommand });
                }).catch((err) => {
                    interaction.reply({ content: locale.errorDefault.replace('{error}', err)})
                })
            }
        } else {
            interaction.reply({ content: locale.noPermission })
        }
	}
};
