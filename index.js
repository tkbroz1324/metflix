const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const Ytdl = require('ytdl-core');
const {TOKEN, GOOGLE_KEY} = require('./config.js');
const youtube = new Youtube(GOOGLE_KEY);

const prefixoComando = process.env.prefix;
const filaDeMusicas = [];
let estouPronto = false;

const client = new Discord.Client();

client.on('guildMemberAdd', member => {
    let embed = new Discord.RichEmbed()
    .setTitle("Bem-vindo(a) ao 🎥𝗠𝗘𝗧𝗙𝗟𝗜𝗫")
    .setColor("RANDOM")
    .setThumbnail(member.user.avatarURL)
    .setDescription('Olá ' + member + ', Seja Bem-Vindo(a)! \nHá `'+ member.guild.memberCount + '` pessoas no cinema')
    .setFooter('𝗠𝗘𝗧𝗙𝗟𝗜𝗫')

    let canalEntrada = client.channels.get("654552104714633250")
      .send(embed);

    let role = member.guild.roles.get("654557168967876659")
    member.addRole(role.id);
});

client.on('ready', () => {
    console.log('bot logado!.');
});
//  bot de musica
client.on('message', async (msg) => {
    // sair
    if (msg.content === `${prefixoComando}disconnect`){
        if (msg.member.voiceChannel){
            msg.member.voiceChannel.leave();
            estouPronto = false;
        }
        else {    
            msg.channel.send('Você precisa esta conectado a memsmo canal de voz do bot!').then(msg => msg.delete(5000));
        }
    }
    // play
    else if (msg.content.startsWith(`${prefixoComando}play `)){
        if (msg.member.voiceChannel){
            msg.member.voiceChannel.join();
            estouPronto = true;
        }
        if (estouPronto){
            let oQueTocar = msg.content.replace(`${prefixoComando}tocar `,'');
            try {
                let video = await youtube.getVideo(oQueTocar);
                msg.channel.send({embed: {
                    color: 347004,
                    description: '🔊 TOCANDO 🔊\n' + video.title
                }});
                filaDeMusicas.push(oQueTocar);
                if (filaDeMusicas.length === 1) {
                    tocarMusica(msg);
                }
            } catch (error) {
                try {
                    let videosPesquisados = await youtube.searchVideos(oQueTocar, 1);
                    let videoEncontrado = await youtube.getVideoByID(videosPesquisados[0].id);
                    msg.channel.send({embed: {
                        color: 3447003,
                        description: '🔊 TOCANDO 🔊\n' + videoEncontrado.title
                    }});
                    filaDeMusicas.push(`https://www.youtube.com/watch?v=${videoEncontrado.id}`)
                    if (filaDeMusicas.length === 1){
                        tocarMusica(msg);
                    }
                } catch (error) {
                    msg.channel.send('Nenhuma música foi encontrada!').then(msg => msg.delete(5000));
                }
            }
        }
    }
    //pause = parar
    if (msg.content === `${prefixoComando}stop`){
        if (msg.member.voiceChannel){
            if (msg.member.voiceChannel.connection.dispatcher){
                if (!msg.member.voiceChannel.connection.dispatcher.paused){
                    msg.member.voiceChannel.connection.dispatcher.pause();
                } 
                else {
                    msg.channel.send('Eu já estou pausado!').then(msg => msg.delete(5000));
                }
            }
            else {
                msg.channel.send('Eu nem estou tocando nada...').then(msg => msg.delete(5000));
            }
        }
        else {    
            msg.channel.send('Você precisa esta conectado ao um canal de voz!').then(msg => msg.delete(5000));
        }
    }
    // resume = bot retoma a musica
    if (msg.content === `${prefixoComando}play`){
        if (msg.member.voiceChannel){
            if (msg.member.voiceChannel.connection.dispatcher){
                if (msg.member.voiceChannel.connection.dispatcher.paused){
                    msg.member.voiceChannel.connection.dispatcher.resume();
                } 
                else {
                    msg.channel.send('Eu não estou pausado!').then(msg => msg.delete(5000));
                }
            }
            else {
                msg.channel.send('Eu nem estou tocando nada...').then(msg => msg.delete(5000));
            }
        }
        else {    
            msg.channel.send('Você precisa esta conectado ao um canal de voz!').then(msg =msg.delete(5000));
        }
    }
    // end = bot para a musica e limpa a fila
    if (msg.content === `${prefixoComando}clear`){
        if (msg.member.voiceChannel){
            if (msg.member.voiceChannel.connection.dispatcher){
                msg.member.voiceChannel.connection.dispatcher.end();
                while (filaDeMusicas.length > 0){
                    filaDeMusicas.shift();

                }
            }
            else {
                msg.channel.send('Não estou tocando nada!').then(msg => msg.delete(5000));
            }
        }
        else {    
            msg.channel.send('Você precisa esta conectado ao um canal de voz!').then(msg => msg.delete(5000));
        }
    }
    // skip = bot toca a proxima musica
    if (msg.content === `${prefixoComando}skip`){
        if (msg.member.voiceChannel){
            if (msg.member.voiceChannel.connection.dispatcher) {
                if (filaDeMusicas.length > 1){
                    msg.member.voiceChannel.connection.dispatcher.end();
                }
                else {
                    msg.channel.send('Não existem mais músicas a serem tocadas!').then(msg => msg.delete(5000));
                }
            }
            else {
                msg.channel.send('não estou tocando nada!').then(msg => msg.delete(5000));
            }
        }
        else {    
            msg.channel.send('Você precisa esta conectado ao um canal de voz!').then(msg => msg.delete(5000));
        }

    }
});
// comandos do bot
client.on("message", async message => {
    if (message.content.indexOf(prefixoComando) !== 0) return;
    const args = message.content.slice(prefixoComando.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    try {
      
      let commands = require(`./commands/${command}.js`);
      commands.run(client, message, args);
      
    } catch (e) {
      console.log(e);
    } finally {}
});
function tocarMusica(msg){
    msg.member.voiceChannel.connection.playStream(Ytdl(filaDeMusicas[0]))
        .on('end', () => {
            filaDeMusicas.shift();
            if (filaDeMusicas.length >= 1){
                tocarMusica(msg);
            }
        });
}

client.login(process.env.TOKEN);