// import { Client, VoiceChannel, Intents } from 'discord.js';
// import {
//     joinVoiceChannel,
//     createAudioPlayer,
//     createAudioResource,
//     entersState,
//     StreamType,
//     AudioPlayerStatus,
//     VoiceConnectionStatus,
// } from '@discordjs/voice';
// import { createDiscordJSAdapter } from './adapter';
// import { client } from '..';

// const player = createAudioPlayer();

// function playSong() {
//     const resource = createAudioResource('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
//         inputType: StreamType.Arbitrary,
//     });

//     player.play(resource);

//     return entersState(player, AudioPlayerStatus.Playing, 5000);
// }

// async function connectToChannel(channel) {
//     const connection = joinVoiceChannel({
//         channelId: channel.id,
//         guildId: channel.guild.id,
//         adapterCreator: createDiscordJSAdapter(channel),
//     });

//     try {
//         await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
//         return connection;
//     } catch (error) {
//         connection.destroy();
//         throw error;
//     }
// }


// client.on('ready', async () => {
//     console.log('Discord.js client is ready!');

//     try {
//         await playSong();
//         console.log('Song is ready to play!');
//     } catch (error) {
//         console.error(error);
//     }
// });

// client.on('message', async (message) => {
//     if (!message.guild) return;

//     if (message.content === '-join') {
//         const channel = message.member?.voice.channel;

//         if (channel) {
//             try {
//                 const connection = await connectToChannel(channel);
//                 connection.subscribe(player);
//                 message.reply('Playing now!');
//             } catch (error) {
//                 console.error(error);
//             }
//         } else {
//             message.reply('Join a voice channel then try again!');
//         }
//     }
// });