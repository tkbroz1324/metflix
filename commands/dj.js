const Discord = require('discord.js');

exports.run = (client, message, args) => {

  let embed = new Discord.RichEmbed()
    .setColor([113, 149, 68])
    .setDescription("**BOT DE MÚSICA**\n\n **Comandos:**\n\n**'tocar** (link) | Comando para o bot tocar a música desejada;\n**'pausar** | Comando para o bot parar de tocar música;\n**'continuar** | Comando para o bot continuar tocando a música;\n**'pular** | Comando para o bot pular para a próxima música da lista;\n**'limpar** | Comando para o bot limpar a lista de música;\n**'sair** | Comando para o bot sair do canal de voz onde vc está.")
    .setFooter("𝗠𝗘𝗧𝗙𝗟𝗜𝗫", client.user.avatarURL)
    .setTimestamp();

  message.channel.send(embed);

}