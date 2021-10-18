import {
  createAudioPlayer,
  NoSubscriberBehavior,
  AudioPlayerStatus,
  createAudioResource,
} from '@discordjs/voice'
import ytdl from 'ytdl-core'
import config from '../config.js'

export let isPlaying = false
export let isPaused = false
export let Player = {}
export let Queue = []

export const init = () => {
  Player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  })
  Player.on(AudioPlayerStatus.Playing, () => {
    console.log('Player began to Play', Queue)

    if (Queue.length > 0 && !isPaused) {
      Queue.shift()
    }

    isPlaying = true
    isPaused = false
  })
  Player.on(AudioPlayerStatus.Idle, () => {
    console.log('Player went Idle', Queue)
    if (Queue.length > 0) {
      const audioStream = ytdl(config.yt_generic + Queue[0].id.videoId, {
        filter: 'audioonly',
        opusEncoded: false,
        fmt: 'mp3',
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
      })
      Player.play(createAudioResource(audioStream))
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
    player.play(getNextResource())
  })
}
