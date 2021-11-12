import { isPlaying, Queue, playSong } from '../Player.js'
import { play } from './play.js'
import {
  searchVideo,
  getVideoInfo,
  validateInteraction,
  getSpotifyPlaylist,
} from '../helpers.js'

const execute = async interaction => {
  try {
    validateInteraction(interaction, async () => {
      const query = interaction.options.get('query').value || 'Default query'
      const spotifyList = await getSpotifyPlaylist(query)

      if (!isPlaying && !spotifyList) play(interaction)

      if (!isPlaying && spotifyList) {
        const video = await searchVideo(spotifyList.shift())
        const voiceChannel = interaction.member.voice.channel
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        })

        playSong(video)
        connection.subscribe(Player)

        spotifyList.map(async track => {
          const video = await searchVideo(track)
          Queue.push(video)
        })
        interaction.reply({
          content: `🎶 | **${interaction.member.displayName}** is queueing: **${
            spotifyList.length + 1
          }** songs`,
        })
      }

      if (isPlaying && spotifyList) {
        spotifyList.map(async track => {
          const video = await searchVideo(track)
          Queue.push(video)
        })
        interaction.reply({
          content: `🎶 | **${interaction.member.displayName}** is queueing: **${
            spotifyList.length + 1
          }** songs`,
        })
      }

      if (isPlaying && !spotifyList) {
        const video = await searchVideo(query)
        Queue.push(video)
        interaction.reply({
          content: `🎶 | **${
            interaction.member.displayName
          }** is queueing: **${await getVideoInfo(video)}**`,
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
