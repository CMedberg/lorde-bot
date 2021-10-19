import { Player, isPlaying, isPaused } from '../Player.js'
import { validateInteraction } from '../helpers.js'

const execute = async interaction => {
  try {
    validateInteraction(interaction, async () => {
      if (isPlaying && !isPaused) {
        Player.pause()
        return await interaction.reply({
          content: '⏸ | Paused',
        })
      }

      if (isPaused) {
        Player.unpause()
        return await interaction.reply({
          content: '▶ | Unpaused',
        })
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
  name: 'pause',
  description: 'Pause or unpause current song',
  execute,
}
