// Import two classes from the openai module, Configuration and OpenAIApi
const { Configuration, OpenAIApi } = require('openai');
// Import three custom error classes from the CustomErrors.js file
const { maxMessageLength, TextExceedsMaxLength } = require('./custom-errors.js');
// Import the maxMessageLength and aiModels constants from the ai-config.js file
const { aiModels } = require('../config/ai-models.js');


const openai_config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });


// The AskAI class extends the OpenAIApi class and is used to generate answers to user prompts
class AskManager extends OpenAIApi {
    constructor() {
        // Call the super constructor of the OpenAIApi class
        // and pass it a new Configuration object with the API key
        super(openai_config);
        // Set the name, body and defaultPrompt properties based on the specified AI model
        this.name = 'ask';
        this.body = aiModels[this.name].body;
        this.defaultPrompt = this.body.prompt;
    }

    // This method generates an answer to a user question (prompt)
    async generate_answer(prompt) {
        console.log(`User prompt: ${prompt}`);
        console.log(`Generating answer...`);
        // Concatenate the first stop, the prompt, and the second stop to format the question
        const question = `${this.body.stop[0]} ${prompt}\n${this.body.stop[1]} `;
        // Concatenate the user prompt with the model default prompt
        this.body.prompt = this.defaultPrompt + question;

        try {
            // Call the createCompletion method of the OpenAIApi class with the modified body object
            const response = await super.createCompletion(this.body);
            console.log('Status:', response.status, response.statusText);
            // Extract the response text and trim leading and trailing whitespace
            const answer = response.data.choices[0].text.trim();

            // If the answer is empty or too long, throw an error
            if (answer.length > maxMessageLength) {
                throw new TextExceedsMaxLength("Generated answer exceeds max discord message length");
            }
                
            // Return the answer
            return answer;

        } catch (err) {
            // Console error and return
            console.error(err.message);
            return;
        }
    }
}


// The ChatAI class extends the OpenAIApi class and is used to hold a conversation with a user
class ChatManager extends OpenAIApi {
    constructor() {
        // Call the super constructor of the OpenAIApi class
        // and pass it a new Configuration object with the API key
        super(openai_config);

        // Set the name and body properties of the ChatAI object,
        // as well as the convo and defaultPrompt properties
        this.name = 'chat';
        this.body = aiModels[this.name].body;
        this.defaultPrompt = this.body.prompt;
    }

    // This method generates an answer to a user message (prompt)
    async generate_reply(chat, prompt) {
        console.log(`User prompt: ${prompt}`);
        console.log(`Generating reply...`);
        // Concatenate the first stop, the prompt, and the second stop to format the message
        const message = `${this.body.stop[0]} ${prompt}\n${this.body.stop[1]} `;
        // Concatenate the conversation and message to create the body's prompt
        this.body.prompt = chat+message;

        try {
            // Use the superclass's createCompletion method to generate a response
            const response = await super.createCompletion(this.body);
            console.log('Status:', response.status, response.statusText);
            // Extract the response text and trim leading and trailing whitespace
            const reply = response.data.choices[0].text.trim();

            // If the reply is too long or empty, throw an error
            if (reply.length > maxMessageLength) {
                throw new TextExceedsMaxLength("Generated reply exceeds max discord message length");
            }

            // Return the reply
            return { 'message': message, 'reply': reply };

        } catch (err) {
            // Console error and return
            console.error(err.message);
            return;
        }
    }
}

// The ImageAI class extends the OpenAIApi class and is used to generate an image using DALL-E Model
class ImageManager extends OpenAIApi {
    // Call the super constructor of the OpenAIApi class
    // and pass it a new Configuration object with the API key
    constructor() {
        super(openai_config);
        // Set the name, body and defaultPrompt properties based on the specified AI model
        this.name = 'image';
        this.body = aiModels[this.name].body;
        this.defaultPrompt = this.body.prompt;
    }

    async generate_image(prompt) {
        console.log(`User prompt: ${prompt}`);
        console.log('Generating image...');
        // Concatenate the user prompt with the model default prompt
        this.body.prompt = prompt + this.defaultPrompt;

        try {
            // Use the superclass's createImage method to generate an image
            const response = await super.createImage(this.body);
            console.log('Status:', response.status, response.statusText);
            // Extract the image URL frome response data
            const url = response.data.data[0].url;

            // If the URL is too long, throw an error
            if (url.length > maxMessageLength) {
                throw new TextExceedsMaxLength("Generated url exceeds max discord message length");
            }

            // Return the URL
            return url;
            
        } catch (err) {
            // Console error and return
            console.error(err.message);
            return;
        }
    }
}

// Export the following classes
module.exports = { AskManager, ChatManager, ImageManager };
