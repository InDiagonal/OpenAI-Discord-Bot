require('dotenv').config();
const { Collection, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');


const discordToken = process.env.DISCORD_TOKEN;

// Instructions here: https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands

// Custom subclass for storing and managing commands
class CommandsManager extends Collection {
	constructor() {
		super();
		const commandsPath = path.join(process.cwd(), 'src/commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
	        const filePath = path.join(commandsPath, file);
	        const command = require(filePath);

	        if ('data' in command && 'execute' in command) {
	        	super.set(command.data.name, command);
	        } else {
	        	console.log(`The command at ${filePath} is missing 'data' or 'execute' property.`);
	        }
        }
	}

	// Deploy bot commands (clientId) to a Discord guild (guildId)
	async deploy(clientId, guildId) {
		const rest = new REST({ version: '10' }).setToken(discordToken);
		const commands_data = [];

		for (const command of super.values()) {
			commands_data.push(command.data.toJSON());
		}
		try {
			console.log(`Started refreshing ${commands_data.length} application (/) commands.`);
			const data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands_data },
			);
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	}
}


module.exports = { CommandsManager };
