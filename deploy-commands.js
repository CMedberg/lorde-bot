import { REST, Routes } from 'discord.js'

import commands from './src/commands/index.js'

import config from './config/default.js'
const { clientId, guildId, token } = config

const rest = new REST().setToken(token);

const run = async () => {

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		console.log('Using token', token);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands.map(({ data }) => data.toJSON()) },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}

run()