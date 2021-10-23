import { isPlaying, Queue } from '../Player.js'
import { play } from './play.js'
import { searchVideo, getVideoInfo, validateInteraction } from '../helpers.js'

const execute = async interaction => {
  try {
    validateInteraction(interaction, async () => {
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
        play(interaction)
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
