export default {
  name: 'ping',
  description: 'Play some ping-pong!',
  options: [
    {
      name: 'query',
      type: 3,
      description: 'It doesnt matter what you put here',
      required: true,
    },
  ],
  async execute(interaction) {
    try {
      const query = interaction.options.get('query').value || 'Default query'

      await interaction.reply({ content: `Ping! ${query}`, ephemeral: true })
    } catch (error) {
      console.log(error)
      interaction.reply({
        content:
          'There was an error trying to execute that command: ' + error.message,
      })
    }
  },
}
