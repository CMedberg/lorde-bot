import { Queue } from '../Player.js'
import { getVideoInfo } from '../helpers.js'

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

    if(Queue.length <= 0){
      await interaction.reply('```And nobody came...```')
    }

    const queue = await Promise.all(
      Queue.map(async video => await getVideoInfo(video))
    )

    const message = `
      \`\`\`bash\n${queue.map((video, index) => `${index + 1}. ${video}\n`).join('')}\`\`\`
    `

    await interaction.reply(message)
  } catch (error) {
    console.log(error)
    interaction.reply({
      content:
        'There was an error trying to execute that command: ' + error.message,
    })
  }
}

export default {
  name: 'list',
  description: 'View the queue',
  execute,
}
