require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const { aiModels } = require('../config/ai-models.js');


// Openai configuration with apiKey
const apiKey = process.env.OPENAI_API_KEY;
const openai_config = new Configuration({ apiKey: apiKey });
// Discord max message length
const maxMessageLength = 2000;

// The AskAI class extends the OpenAIApi class and is used to generate answers to user prompts
class AskManager extends OpenAIApi {
    constructor() {
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
            if (!answer || answer.length > maxMessageLength) {
                throw new Error;
            }
                
            return answer;

        } catch (err) {
            const error = 'Error generating answer';
            console.error(error);
            return error;
        }
    }
}


// The ChatAI class extends the OpenAIApi class and is used to hold a conversation with a user
class ChatManager extends OpenAIApi {
    constructor() {
        super(openai_config);
        // Set the name, body and defaultPrompt properties based on the specified AI model
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
        console.log(message);
        // Concatenate the conversation and message to create the body's prompt
        this.body.prompt = chat + message;

        try {
            // Use the superclass's createCompletion method to generate a response
            const response = await super.createCompletion(this.body);
            console.log('Status:', response.status, response.statusText);
            // Extract the response text and trim leading and trailing whitespace
            const reply = response.data.choices[0].text.trim();
            if (!reply || reply.length > maxMessageLength) {
                throw new Error;
            }

            return { 'message': message, 'reply': reply };

        } catch (err) {
            const error = 'Error generating reply';
            console.error(error);
            return error;
        }
    }
}

// The ImageAI class extends the OpenAIApi class and is used to generate an image using DALL-E Model
class ImageManager extends OpenAIApi {
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
            if (!url) {
                throw new Error;
            }

            return url;

        } catch (err) {
            const error = 'Error generating image';
            console.error(error);
            return 'attachment://error.png';
        }
    }
}


module.exports = { AskManager, ChatManager, ImageManager };
