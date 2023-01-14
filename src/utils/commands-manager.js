// Import required modules and classes
const { Collection, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');


// Create a custom Collection subclass for storing and managing commands
class CommandsManager extends Collection {
	// Constructor for the Commands class
	constructor() {
		// Call the parent Collection class constructor
		super();
		// Set the path to the directory containing the command files
		const commandsPath = path.join(process.cwd(), 'src/commands');
		// Read the contents of the commands directory and filter the list to include only .js files
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        // Iterate through the list of command files
        for (const file of commandFiles) {
	        // Set the path from the current command file
	        const filePath = path.join(commandsPath, file);
	        // Import the command file
	        const command = require(filePath);

	        // Check that the command file exports a 'data' object and an 'execute' function
	        if ('data' in command && 'execute' in command) {
	        	// Add the command to the collection
	        	// command name as the key and the command module as the value
	        	super.set(command.data.name, command);
	        } else {
	        	// Log an error message
	        	console.log(`The command at ${filePath} is missing 'data' or 'execute' property.`);
	        }
        }
	}

	// Deploy the commands of the bot (clientId) to a Discord server (guildId)
	// or globally if guildId parameter not provided
	async deploy(clientId, guildId=null) {
		// Construct and prepare an instance of the REST class
		const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
		// Create an array to hold the data for each command
		const commands_data = [];

		// Iterate through the commands in the collection
		for (const command of super.values()) {
			// Push the data for each command to the commands_data array
			commands_data.push(command.data.toJSON());
		}

		// Set the route for the request to the application guild commands endpoint
		const reqRoutes = (guildId === null) ? Routes.applicationCommands(clientId) : Routes.applicationGuildCommands(clientId, guildId);

		// Deploy the commands to the Discord guild (server)
		try {
			// Log a message indicating that the refresh process has started
			console.log(`Started refreshing ${commands_data.length} application (/) commands.`);
			// Use the REST module's put method to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				reqRoutes,
				// Set the body of the request to the array of command data
				{ body: commands_data },
			);
			// Log a message indicating that the refresh process has completed successfully
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		// Catch any errors that occur during the refresh process
		} catch (error) {
			// Log the error message
			console.error(error);
		}
	}
}

// Export the Commands class
module.exports = { CommandsManager };
