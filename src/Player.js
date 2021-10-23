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

export const playSong = track => {
  const audioStream = ytdl(config.yt_generic + track.id.videoId, {
    quality: 'highestaudio',
    filter: 'audioonly',
    opusEncoded: true,
    fmt: 'mp3',
    encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
    dlChunkSize: 0,
  })

  Player.play(createAudioResource(audioStream))

  // This is removing the listener and creating our own. Potentially a fix for the bot stopping
  // Se: https://github.com/fent/node-ytdl-core/issues/932

  // Getting this after fix
  //   Error: aborted
  //      0|randy    |     at connResetException (node:internal/errors:691:14)
  //      0|randy    |     at TLSSocket.socketCloseListener (node:_http_client:407:19)
  //      0|randy    |     at TLSSocket.emit (node:events:402:35)
  //      0|randy    |     at node:net:687:12
  //      0|randy    |     at TCP.done (node:_tls_wrap:580:7) {
  //      0|randy    |   code: 'ECONNRESET'
  //      0|randy    | }

  // or this??? https://github.com/fent/node-ytdl-core/issues/902

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
      playSong(Queue[0])
      Queue.shift()
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
      playSong(Queue.shift())
    }
  })
}
