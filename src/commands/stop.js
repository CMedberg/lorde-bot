import { Player, Queue } from '../Player.js'
import { validateInteraction } from '../helpers.js'

const execute = async interaction => {
  try {
    if (Queue.length > 0) {
      Queue.length = 0
    }

    validateInteraction(interaction, () => Player.stop())

    return interaction.reply({ content: '🛑 | Stopped the player' })
  } catch (error) {
    console.log(error)
    interaction.reply({
      content:
        'There was an error trying to execute that command: ' + error.message,
    })
  }
}

export default {
  name: 'stop',
  description: 'Stop all songs in the queue!',
  execute,
}
