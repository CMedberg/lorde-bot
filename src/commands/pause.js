import { Player, isPlaying, isPaused } from '../Player.js'

const execute = async interaction => {
  try {
    if (!interaction.member || !interaction.member.voice.channel) {
      return await interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      })
    }
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    ) {
      return await interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })
    }

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
