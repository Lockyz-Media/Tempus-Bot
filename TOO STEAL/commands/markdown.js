const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    message.delete(1000);
    message.channel.send('```\n*italics* or _italics_\n__*underline italics*__\n**bold**\n__**underline bold**__\n***bold italics***\n__***underline bold italics***__\n__underline__\n~~Strikethrough~~\n`One line Code Block`\n> single line quote\n>>> Multiple Line Quote\n||Spoiler||\n```')
    message.channel.send('``` on either side = code block *See above message for example*')
};

exports.help = {
    name: 'markdown',
    aliases: [],
    description: 'View Discord Markdown Key.',
    usage: 'markdown',
    premium: 'false',
    metrics: 'true',
    category: 'info'
};