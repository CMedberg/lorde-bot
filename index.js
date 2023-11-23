// import { init as InitPlayer } from './src/Player.js'
import commands from './src/commands/index.js'

import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'
import config from './config/default.js'
const { token } = config

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages],
})

// @ts-ignore
client.commands = new Collection()

commands.forEach(command => {
  const missingProperty = !('data' in command) || !('execute' in command)
  if (missingProperty) {
    // @ts-ignore
    console.log(`${command.data.name} is missing a required property.`)
    return
  }

  // @ts-ignore
  client.commands.set(command.data.name, command)
})

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.login(token)

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  // @ts-ignore
  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  }
})