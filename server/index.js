// Import the required modules and classes
const http = require('node:http');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { CommandsManager } = require('./utils/commands-manager.js');

// Create a new Discord client with specified gateway intents
const client = new Client({
	intents: [
		// These intents allow the client to access specified information
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent
	],
});

// When the client is ready, log a message to the console
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Initialize and deploy client commands
client.commands = new CommandsManager();
client.commands.deploy();

// Event listener for when a message is created in a guild
client.on(Events.MessageCreate, async interaction => {
	// If the message was sent by a bot, return early
	if (interaction.author.bot) return;
	console.log('---');
	// Process the message as a chat command
	messageResponse(interaction);
});

// Event listener for when a chat command is sent in a guild
client.on(Events.InteractionCreate, async interaction => {
	// If the interaction is not a chat command, return early
	if (!interaction.isChatInputCommand()) return;
	console.log('///');
	// Process the chat command
	commandResponse(interaction);
});

// Function to handle chat commands
async function messageResponse(interaction) {
	// Set the command name to 'chat'
	const commandName = 'chat';
	// Get the command object from the Commands class
	const command = client.commands.get(commandName);
	
	if (!command) {
		console.error(`No command matching ${commandName} was found.`);
		return;
	}
	// // Get the channel object for the interaction
	// const channel = client.channels.cache.get(interaction.channelId);
	try {
		// Execute the command's reply function
		await command.reply(interaction);
	} catch (err) {
		console.error(err.message);
	}
}

// Function to handle chat commands
async function commandResponse(interaction) {
	// Get the command name from the interaction
	const commandName = interaction.commandName;
	// Get the command object from the Commands class
	const command = client.commands.get(commandName);

	if (!command) {
		console.error(`No command matching ${commandName} was found.`);
		return;
	}
	// // Get the channel object for the interaction
	// const channel = client.channels.cache.get(interaction.channelId);
	try {
		// Execute the command's execute function
		await command.execute(interaction);

	} catch (err) {
		console.error(err.message);
		// If an error occurs, send an error message to the user
		try {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		} catch (error) {
			console.error(error.message);
		}
	}
}

// Log the client in using the DISCORD_TOKEN environment variable
client.login(process.env.DISCORD_TOKEN);

// Creates server on port 8080
http.createServer((req, res) => {
	res.writeHead(200);
	// Send a response based on bot status bool
	if (client.presence.status === 'online') {
		res.end('OpenAI bot is online!');
	} else {
		res.end('OpenAI bot is offline!');
	}
}).listen(8080);