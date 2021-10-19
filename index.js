import { Client, Intents, Collection } from 'discord.js'
import { init as InitPlayer, Player } from './src/Player.js'
import commands from './src/commands/index.js'
import config from './config.js'
const { token } = config

const client = await new Client({
  intents: [
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
  ],
})

client.commands = new Collection()
commands.forEach(command => {
  client.commands.set(command.name, command)
})
console.log(client.commands)

InitPlayer()

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  if (!client.application?.owner) await client.application?.fetch()
  if (
    message.content === '!deploy' &&
    message.author.id === client.application?.owner?.id
  ) {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        message.reply('Deployed!')
      })
      .catch(err => {
        message.reply(
          'Could not deploy commands! Make sure the bot has the application.commands permission!'
        )
        console.error(err)
      })
  }
})

client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName.toLowerCase())

  try {
    command.execute(interaction, client)
    // if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
    //   command.execute(interaction, client)
    // } else {
    //   command.execute(interaction, player)
    // }
  } catch (error) {
    console.error(error)
    interaction.reply({
      content: 'There was an error trying to execute that command!',
    })
  }
})

await client.login(token)
client.user.setActivity({ name: config.activity, type: config.activityType })
