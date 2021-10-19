import { joinVoiceChannel, createAudioResource } from '@discordjs/voice'
import ytdl from 'ytdl-core'
import { Player } from '../Player.js'
import { searchVideo, getVideoInfo, validateInteraction } from '../helpers.js'
import config from '../../config.js'

const playSong = async interaction => {
  const video = await searchVideo(interaction)
  console.log('videoId', video.id.videoId)

  const voiceChannel = interaction.member.voice.channel
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  })

  const audioStream = ytdl(config.yt_generic + video.id.videoId, {
    filter: 'audioonly',
    opusEncoded: false,
    fmt: 'mp3',
    encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
  })

  Player.play(createAudioResource(audioStream))
  connection.subscribe(Player)

  const playMessage = `▶ | Started playing: **${await getVideoInfo(
    video
  )}** in **${voiceChannel.name}**!`
  await interaction.reply(playMessage)
}

const execute = async interaction => {
  try {
    validateInteraction(interaction, () => playSong(interaction))
  } catch (error) {
    console.log(error)
    interaction.reply({
      content:
        'There was an error trying to execute that command: ' + error.message,
    })
  }
}

export default {
  name: 'play',
  description: 'Play a song in your channel!',
  options: [
    {
      name: 'query',
      type: 3, // 'STRING' Type
      description: 'The song you want to play',
      required: true,
    },
  ],
  execute,
}
