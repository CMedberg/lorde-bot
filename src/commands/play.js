import { joinVoiceChannel } from '@discordjs/voice'
import { Player, playSong } from '../Player.js'
import { searchVideo, getVideoInfo, validateInteraction } from '../helpers.js'

const play = async interaction => {
  const video = await searchVideo(interaction)
  console.log('videoId', video.id.videoId)

  const voiceChannel = interaction.member.voice.channel
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  })

  playSong(video)
  connection.subscribe(Player)

  const playMessage = `▶ | Started playing: **${await getVideoInfo(
    video
  )}** in **${voiceChannel.name}**!`
  await interaction.reply(playMessage)
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
