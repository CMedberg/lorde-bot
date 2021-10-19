import { client } from '../../index.js'

const execute = async interaction => {
  const deleteCount = interaction.options.get('num').value

  if (deleteCount === 1337) {
    console.log('1337', client.user.id)
    interaction.channel.messages
      .fetch({ limit: 100 })
      .then(messages => {
        const filtered = messages.filter(message => message.author.id === client.user.id)
        filtered.map(message => interaction.channel.messages.delete(message))
        interaction.reply({
          content: `Succesfully deleted messages`,
          ephemeral: true,
        })
      })
      .catch(error => {
        interaction.reply({
          content: `Couldn't delete messages because of: ${error}`,
          ephemeral: true,
        })
      })
    return
  }

  if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
    return interaction.reply({
      content: `Please provide a number between 2 and 100 for the number of messages to delete`,
      ephemeral: true,
    })
  }

  interaction.channel.messages
    .fetch({ limit: deleteCount })
    .then(messages => {
      messages.map(message => interaction.channel.messages.delete(message))
      return interaction.reply({
        content: `Succesfully deleted messages`,
        ephemeral: true,
      })
    })
    .catch(error => {
      interaction.reply({
        content: `Couldn't delete messages because of: ${error}`,
        ephemeral: true,
      })
    })
}

export default {
  name: 'purge',
  description: 'Delete the last messages in all chats.',
  options: [
    {
      name: 'num',
      type: 4, //'INTEGER' Type
      description: 'The number of messages you want to delete. (max 100)',
      required: true,
    },
  ],
  execute,
}
