import { Player, Queue } from '../Player.js'
import { createAudioResource } from '@discordjs/voice'
import { getVideoInfo, validateInteraction } from '../helpers.js'
import ytdl from 'ytdl-core'
import config from '../../config.js'

const execute = async interaction => {
  try {
    validateInteraction(interaction, async () => {
      if (Queue.length > 0) {
        const audioStream = ytdl(config.yt_generic + Queue[0].id.videoId, {
          filter: 'audioonly',
          opusEncoded: false,
          fmt: 'mp3',
          encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
        })

        Player.play(createAudioResource(audioStream))
        return interaction.reply({
          content: `⏩ | Next track ${await getVideoInfo(Queue[0])}`,
        })
      } else {
        return interaction.reply({ content: `🛑 | End of the line` })
      }
    })
  } catch (error) {
    console.log(error)
    interaction.reply({
      content:
        'There was an error trying to execute that command: ' + error.message,
    })
  }
}

export default {
  name: 'next',
  description: 'Skips to the next song',
  execute,
}
