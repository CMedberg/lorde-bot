import { VoiceConnectionStatus, joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

const execute = async interaction => {
  const channel = interaction.member.voice.channel;

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  connection.on(VoiceConnectionStatus.Ready, () => {
    console.log('The connection has entered the Ready state - ready to play audio!');
  });


  // // Subscribe the connection to the audio player (will play audio on the voice connection)
  // const subscription = connection.subscribe(audioPlayer);

  // // subscription could be undefined if the connection is destroyed!
  // if (subscription) {
  //   // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
  //   setTimeout(() => subscription.unsubscribe(), 5_000);
  // }

}


export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song in your channel!')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('Songsongsong')
        .setRequired(true)),
  execute,
}