import { Queue, playSong } from '../Player.js'
import { getVideoInfo, validateInteraction } from '../helpers.js'

const next = async (interaction) => {
  const nextSong = Queue.shift()

  if (nextSong) {
    playSong(interaction, nextSong)
  } else {
    return interaction.reply({ content: `🛑 | End of the line` })
  }
}

const execute = async interaction => {
  try {
    validateInteraction(interaction, () => next(interaction))
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
