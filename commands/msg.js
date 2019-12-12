const Discord = require('discord.js');

exports.run = async (message, args) => {
    let botmessage = args.join(" ");
    message.delete().catch();
    message.channel.send(botmessage);
};