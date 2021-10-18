import { isPlaying, Queue } from '../Player.js'
import { searchVideo, getVideoInfo } from '../helpers.js'

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

    if (isPlaying) {
      const video = await searchVideo(interaction)
      Queue.push(video)
      const queueMessage = `🎶 | **${
        interaction.member.displayName
      }** is queueing: **${await getVideoInfo(video)}**`
      console.log('Queueing', Queue)

      interaction.reply({
        content: queueMessage,
      })
    } else {
      interaction.reply({
        content: 'The player is NOT playing',
        ephemeral: true,
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
  name: 'queue',
  description: 'View the queue of current songs!',
  options: [
    {
      name: 'query',
      type: 3, // 'STRING' Type
      description: 'The song you want to queue',
      required: true,
    },
  ],
  execute,
}
