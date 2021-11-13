import { Queue } from '../Player.js'
import { getVideoInfo, validateInteraction } from '../helpers.js'

const execute = async interaction => {
  try {
    validateInteraction(interaction, async () => {
      if (Queue.length < 1) {
        await interaction.reply('```And nobody came...```')
        return
      }

      let queue = []
      await Promise.all(
        Queue.map(async video => queue.push(await getVideoInfo(video)))
      )

      const message = `
        \`\`\`bash\n${queue
          .map((video, index) => `${index + 1}. ${video}\n`)
          .join('')}\`\`\`
        `

      await interaction.reply(message)
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
  name: 'list',
  description: 'View the queue',
  execute,
}
