require('dotenv').config();
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { CommandsManager } = require('./utils/commands-manager.js');


// Env variables
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const discordToken = process.env.DISCORD_TOKEN;

// Create a new Discord client with specified intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
});

// Client ready event
client.once(Events.ClientReady, client => {
    console.log('CLIENT: Logged in as ->', client.user.tag );
});

// Initialize and deploy client commands to the guild
client.commands = new CommandsManager();
client.commands.deploy(clientId, guildId);

// User messages event
client.on(Events.MessageCreate, async interaction => {
    if (interaction.author.bot) return;
    console.log('CLIENT: MessageCreate');
    // Process the message
    messageResponse(interaction);
});

// Slash command event
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log('CLIENT: InteractionCreate');
    // Process the chat command
    commandResponse(interaction);
});

// Error events
client.on(Events.Error, err => {
    console.error('CLIENT: Error ->', err);
}) 

// Function to handle channel messages
async function messageResponse(interaction) {
    const commandName = 'chat';
    const command = client.commands.get(commandName);
    
    if (!command) {
        console.error(`No command matching ${commandName} was found.`);
        return;
    }

    try {
        await command.reply(interaction);
    } catch (err) {
        console.error(err);
    }
}

// Function to handle slash commands
async function commandResponse(interaction) {
    const commandName = interaction.commandName;
    const command = client.commands.get(commandName);

    if (!command) {
        console.error(`No command matching ${commandName} was found.`);
        return;
    }
    
    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
    }
}

// Log the client in using the DISCORD_TOKEN environment variable
client.login(discordToken);