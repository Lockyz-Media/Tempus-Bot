const { embedColor } = require('../info.js');
const { EmbedBuilder } = require('discord.js');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_MESSAGES')) return noBotPerms(message, 'MANAGE_MESSAGES');

	if(message.member.roles.cache.has("516554905142558730") || message.member.roles.cache.has("516552949246328838") ||  message.member.roles.cache.has("640063699624656937") ||  message.member.roles.cache.has("516553151936069659")) {
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.channel.send("Please provide a number between 2 and 100 for the number of messages to delete");
    const fetched = await message.channel.messages.fetch({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.channel.send(`Couldn't delete messages because of: ${error}`));

    const statsEmbed = new EmbedBuilder()
        .setAuthor(`Purge | ${message.member.username}`)
        .setColor(embedColor)
        .addField(`Channel:`, `<#${message.channel.id}>`, true)
        .addField(`Amount:`, fetched, true)
        .setTimestamp();
    client.channels.cache.get(`718430726789267486`).send(statsEmbed);
    }
    else {
      message.channel.send(`you don't have the permission to use this command`)
      .then(msg => {
        msg.delete(20000)
    })
      return;
    }
};

exports.help = {
    name: 'purge',
    aliases: ['clean'],
    description: 'Remove a specific amount of messages from a channel',
    usage: 'purge {amount}',
    premium: 'false',
    metrics: 'true',
    category: 'moderation'
};