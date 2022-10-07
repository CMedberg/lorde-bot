import { Client, Intents, Collection } from 'discord.js'
import { init as InitPlayer, Player } from './src/Player.js'
import commands from './src/commands/index.js'
import config from './config.js'
const { token } = config

// https://discord.com/oauth2/authorize?client_id=898629597745258497&permissions=105229920256&scope=bot%20applications.commands

export const client = await new Client({
  intents: [
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
  ],
})

export let Channel = {}

client.commands = new Collection()
commands.forEach((command) => {
  client.commands.set(command.name, command)
})

InitPlayer()

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return
  if (!client.application?.owner) await client.application?.fetch()
  if (message.content === '!deploy') {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        Channel = message.channel
        message.reply('Deployed!')
      })
      .catch((err) => {
        message.reply(
          'Could not deploy commands! Make sure the bot has the application.commands permission!'
        )
        console.error(err)
      })
  }
})

client.on('interactionCreate', async (interaction) => {
  const command = client.commands.get(interaction.commandName.toLowerCase())
  
  try {
    Channel = interaction.channel
    command.execute(interaction, client)
  } catch (error) {
    console.error(error)
    interaction.reply({
      content: 'There was an error trying to execute that command!',
    })
  }
})

await client.login(token)
client.user.setActivity({ name: config.activity, type: config.activityType })
console.log('Bot ID ' + client.user.id)
