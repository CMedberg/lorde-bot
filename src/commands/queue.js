import { isPlaying, Queue, playSong } from '../Player.js'
import { searchVideo, validateInteraction, getSongs } from '../helpers.js'

const queue = async interaction => {
  const songs = await getSongs(interaction)
  await Promise.all(
    songs.map(async song => Queue.push(await searchVideo(song)))
  )

  if (!isPlaying) {
    playSong(interaction, Queue.shift())
  } else {
    interaction.reply({
      content: `🎶 | **${interaction.member.displayName}** is queueing: **${songs.length}** songs`,
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
