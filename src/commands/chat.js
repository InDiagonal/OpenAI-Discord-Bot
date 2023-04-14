const { SlashCommandBuilder } = require('discord.js');
const { ChatManager } = require('../utils/models-managers.js');
const { DatabaseManager } = require('../utils/database-manager.js');


const chat = new ChatManager();
let db;
(async () => {
    // Initialize database
    db = await new DatabaseManager().init();
})();

// export an object with the data and execute properties
module.exports = {
    data: new SlashCommandBuilder()
	    .setName('chat')
	    .setDescription('Manage chat with OpenAI GPT')
	    .addSubcommand(subcommand =>
		    subcommand
			    .setName('open')
			    .setDescription('Open/Continue chat session')
	    )
	    .addSubcommand(subcommand =>
		    subcommand
			    .setName('close')
			    .setDescription('Close chat session (conversation will be saved)')
	    )
	    .addSubcommand(subcommand =>
		    subcommand
			    .setName('delete')
			    .setDescription('Delete conversation PERMANENTLY')
			    .addStringOption(option =>
				    option.setName('confirm')
					    .setDescription('This action is IRREVERSIBLE. Are you sure?')
					    .setRequired(true)
					    .addChoices(
						    { name: 'No', value: 'no' },
						    { name: 'Yes', value: 'yes' }
					    )),
	    ),

    async execute(interaction) {
        // defer reply until the command finishes executing
        await interaction.deferReply();
        // get subcommand from interaction object
        const input = interaction.options.getSubcommand();
        // get user id from interaction object
        const user_id = interaction.user.id;
        // insert user in database if not already in
        if (! await db.is_user_inserted(user_id)) {
            await db.insert_new_user(user_id);
            await db.init_user_chat(user_id, chat.defaultPrompt);
        }
        if (input === 'open') {
            if (! await db.get_user_chat_status(user_id)) {
                // set user chat status to true
                await db.set_user_chat_status(user_id, true);
                await interaction.editReply('`Chat session open!\nSend a message and OpenAI will reply.`');
            } else {
                await interaction.editReply('`Chat session already open!`'); 
            }
        } else if (input === 'close') {
            if (await db.get_user_chat_status(user_id)) {
                // set user chat status to false
                await db.set_user_chat_status(user_id, false);
                await interaction.editReply('`Chat session closed!`');
            } else {
                await interaction.editReply('`Chat session already closed!`');
            }
        } else if (input === 'delete') {
            // get confirmation from the user
            const confirmation = interaction.options.getString('confirm');
            if (confirmation === 'yes') {
                // permanently delete chat history of the user from database
                await db.init_user_chat(user_id, chat.defaultPrompt);
                await interaction.editReply('`Chat DELETED!`');
                console.log(`Chat DELETED from database for user ${user_id}.`);
            } else {
                await interaction.editReply('`Action canceled. Phew!`');
            }
        }
    },

    async reply(interaction) {
        // get user id from interaction object
        const user_id = interaction.author.id;
        // if user not in database return
        if (! await db.is_user_inserted(user_id)) {
            return;
        }
        // if user chat status is false return
        if (! await db.get_user_chat_status(user_id)) {
            return;
        }
        // get user chat from database
        const chat_text = await db.get_user_chat(user_id);
        // generate a reply from the user message
        const response = await chat.generate_reply(chat_text, interaction.content);
        if (!response) {
            interaction.reply("Error generating reply");
            return;
        }

        const chat_updated = response[0];
        const reply = response[1];
        // update user chat in database
        await db.update_user_chat(user_id, JSON.stringify(chat_updated));
        // send generated reply
        await interaction.reply(reply.content);
        console.log('Reply sent!');
    },
};

