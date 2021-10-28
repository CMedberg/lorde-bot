import { isPlaying, Queue } from '../Player.js'
import { play } from './play.js'
import {
  searchVideo,
  getVideoInfo,
  validateInteraction,
  getSpotifyList,
} from '../helpers.js'

const execute = async interaction => {
  try {
    validateInteraction(interaction, async () => {
      const query = interaction.options.get('query').value || 'Default query'
      const spotifyList = getSpotifyList(query)

      if (isPlaying) {
        if (spotifyList) {
          spotifyList.map(async track => {
            const video = await searchVideo(track)
            Queue.push(video)
          })
          interaction.reply({
            content: `🎶 | **${interaction.member.displayName}** is queueing: **${spotifyList.length}** songs`,
          })
        } else {
          const video = await searchVideo(query)
          Queue.push(video)
          interaction.reply({
            content: `🎶 | **${
              interaction.member.displayName
            }** is queueing: **${await getVideoInfo(video)}**`,
          })
        }
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
