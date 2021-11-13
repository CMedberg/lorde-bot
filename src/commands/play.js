import { playSong, Queue } from '../Player.js'
import { searchVideo, validateInteraction, getSongs } from '../helpers.js'

export const play = async interaction => {
  const songs = await getSongs(interaction)
  await Promise.all(
    songs.map(async song => Queue.push(await searchVideo(song)))
  )
  playSong(interaction, Queue.shift())
}

const execute = async interaction => {
  try {
    validateInteraction(interaction, () => play(interaction))
  } catch (error) {
    console.log(error)
    interaction.reply({
      content:
        'There was an error trying to execute that command: ' + error.message,
    })
  }
}

export default {
  name: 'play',
  description: 'Play a song in your channel!',
  options: [
    {
      name: 'query',
      type: 3, // 'STRING' Type
      description: 'The song you want to play',
      required: true,
    },
  ],
  execute,
}
