require('dotenv').config();
const { OpenAI } = require('openai');
const { aiModels } = require('../config/ai-models.js');


// Openai configuration with apiKey
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: apiKey });
// Discord max message length
const maxMessageLength = 2000;

// The AskAI class extends the OpenAIApi class and is used to generate answers to user prompts
class AskManager {
    constructor() {
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
            const response = await openai.completions.create(this.body);
            console.log('Status:', response.status, response.statusText);
            // Extract the response text and trim leading and trailing whitespace
            const answer = response.choices[0].text.trim();
            if (!answer || answer.length > maxMessageLength) {
                throw new Error;
            }
                
            return answer;

        } catch (err) {
            console.error(err);
            return;
        }
    }
}


// The ChatAI class extends the OpenAIApi class and is used to hold a conversation with a user
class ChatManager {
    constructor() {
        // Set the name, body and defaultPrompt properties based on the specified AI model
        this.name = 'chat';
        this.body = aiModels[this.name].body;
        this.defaultPrompt = JSON.stringify(this.body.messages);
    }

    // This method generates an answer to a user message (prompt)
    async generate_reply(chat, prompt) {
        console.log(`User prompt: ${prompt}`);
        console.log(`Generating reply...`);
        // Concatenate the first stop, the prompt, and the second stop to format the message
        const messages = JSON.parse(chat);
        const message = { role: "user", content: prompt };
        // Concatenate the conversation and message to create the body's prompt
        messages.push(message);
        this.body.messages = messages;

        try {
            const response = await openai.chat.completions.create(this.body);
            console.log('Status:', response.status, response.statusText);

            // Extract the response text and trim leading and trailing whitespace
            const reply = response.choices[0].message;
            if (!reply.content || reply.content.length > maxMessageLength) {
                throw new Error;
            }

            messages.push(reply);
            return [messages, reply];

        } catch (err) {
            console.error(err);
            return;
        }
    }
}

// The ImageAI class extends the OpenAIApi class and is used to generate an image using DALL-E Model
class ImageManager {
    constructor() {
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
            const response = await openai.images.generate(this.body);
            console.log('Status:', response.status, response.statusText);
            // Extract the image URL frome response data
            const url = response.data[0].url;
            if (!url) {
                throw new Error;
            }

            return url;

        } catch (err) {
            console.error(err);
            return;
        }
    }
}


module.exports = { AskManager, ChatManager, ImageManager };
