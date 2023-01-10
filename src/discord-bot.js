// Import the required modules and classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { CommandsManager } = require('./utils/commands-manager.js');

// The class that creates the OpenAI Discord bot which handles user messages
// and chat commands by creating a new Discord client
class DiscordBot {
    constructor() {
        // Create a new Discord client with specified gateway intents
        this.client = new Client({
            intents: [
                // These intents allow the client to access specified information
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent
            ],
        });

        // When the client is ready, log a message to the console
        this.client.once(Events.ClientReady, c => {
        	console.log(`Ready! Logged in as ${c.user.tag}`);
        });

        // Initialize and deploy client commands
        this.client.commands = new CommandsManager();
        this.client.commands.deploy();

        // Event listener for when a message is created in a guild
        this.client.on(Events.MessageCreate, async interaction => {
            // If the message was sent by a bot, return early
            if (interaction.author.bot) return;
            console.log('---');
            // Process the message
            this.messageResponse(interaction);
        });

        // Event listener for when a chat command is sent in a guild
        this.client.on(Events.InteractionCreate, async interaction => {
            // If the interaction is not a chat command, return early
            if (!interaction.isChatInputCommand()) return;
            console.log('///');
            // Process the chat command
            this.commandResponse(interaction);
        });

        // Log the client in using the DISCORD_TOKEN environment variable
        this.client.login(process.env.DISCORD_TOKEN);
    }

    // Function to handle user messages
    async messageResponse(interaction) {
        const commandName = 'chat';
        // Get the command object from the Commands class
        const command = this.client.commands.get(commandName);
        
        if (!command) {
            console.error(`No command matching ${commandName} was found.`);
            return;
        }

        try {
            await command.reply(interaction);
        } catch (err) {
            console.error(err.message);
        }
    }

    // Function to handle chat commands
    async commandResponse(interaction) {
        // Get the command name from the interaction
        const commandName = interaction.commandName;
        // Get the command object from the Commands class
        const command = this.client.commands.get(commandName);

        if (!command) {
            console.error(`No command matching ${commandName} was found.`);
            return;
        }
        
        try {
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
}

// Export class
module.exports = { DiscordBot };