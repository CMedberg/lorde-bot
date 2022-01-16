import { isPlaying, Queue, playSong } from '../Player.js'
import { searchVideo, validateInteraction, getSongs, getVideoInfo } from '../helpers.js'

const queue = async interaction => {
  const tracks = await getSongs(interaction)

  for (const track of tracks) {
    Queue.push(await searchVideo(track))
  }

  if (!isPlaying) {
    playSong(interaction, Queue.shift())
  } else {
    const isList = Queue.length > 1
    console.log('tracks', Queue)
    const msg = isList ? `**${Queue.length}** songs` : await getVideoInfo(Queue[0])

    interaction.reply({
      content: `🎶 | **${interaction.member.displayName}** is queueing: ${msg}`,
    })
  }
}

const execute = async interaction => {
  try {
    validateInteraction(interaction, () => queue(interaction))
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
