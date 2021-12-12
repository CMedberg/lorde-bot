import {
  createAudioPlayer,
  NoSubscriberBehavior,
  AudioPlayerStatus,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice'
import ytdl from 'ytdl-core'
import { getVideoInfo } from './helpers.js'
import config from '../config.js'

export let isPlaying = false
export let isPaused = false
export let Player = {}
export let Queue = []

export const playSong = async (interaction, track) => {
  console.log('playSong', track)

  if (interaction) {
    // Creating channel connection
    const voiceChannel = interaction.member.voice.channel
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    })
    connection.subscribe(Player)
    // Creating channel connection

    const playMessage = `▶ | Started playing: **${await getVideoInfo(
      track
    )}** in **${voiceChannel.name}**!`
    await interaction.reply(playMessage)
  }

  const audioStream = ytdl(
    config.yt_generic + track.id.videoId,
    config.audiostreamConfig
  )

  Player.play(createAudioResource(audioStream))

  const funcao = audioStream.listeners('error')[0]
  audioStream.removeListener('error', funcao)
  audioStream.on('error', err => {
    try {
      throw new Error()
    } catch {
      audioStream.destroy()
      console.log(err)
    }
  })
}

export const init = () => {
  Player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  })
  Player.on(AudioPlayerStatus.Playing, () => {
    console.log('Player began to Play', Queue)
    isPlaying = true
    isPaused = false
  })
  Player.on(AudioPlayerStatus.Idle, () => {
    console.log('Player went Idle', Queue)
    if (Queue.length > 0) {
      playSong(null, Queue.shift())
    }
    isPlaying = false
    isPaused = false
  })
  Player.on(AudioPlayerStatus.Paused, () => {
    console.log('Player was Paused', Queue)
    isPlaying = false
    isPaused = true
  })
  Player.on(AudioPlayerStatus.AutoPaused, () => {
    console.log('Player was AutoPaused', Queue)
    isPlaying = false
    isPaused = true
  })
  Player.on(AudioPlayerStatus.Buffering, () => {
    console.log('Player is Buffering', Queue)
    isPlaying = false
  })
  Player.on('error', error => {
    console.error(error.message)
    if (Queue[0]) {
      playSong(null, Queue.shift())
    }
  })
}
