import { Queue, playSong } from '../Player.js'
import { getVideoInfo, validateInteraction } from '../helpers.js'

const execute = async interaction => {
  try {
    validateInteraction(interaction, async () => {
      const nextSong = Queue.shift()

      if (nextSong) {
        playSong(nextSong)

        return interaction.reply({
          content: `⏩ | Next track ${await getVideoInfo(nextSong)}`,
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
