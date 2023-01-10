// AI models object and their respective configurations
const aiModels = {
    ask: {
        // configuration for ask model
        body: {
            model: 'text-davinci-003',  // name of the model
            prompt: 'The following is a question from a USER. Your name is GPT and your goal is to answer USER question cleverly and providing as many details as possible.\n\n',  // prompt to be used with the model
            max_tokens: 2000,  // maximum number of tokens in the generated text
            temperature: 0.5,  // temperature parameter for the model
            n: 1,  // number of responses to generate
            stream: false,  // flag to indicate if responses should be streamed
            stop: ['USER:', 'GPT:']
        }
    },
    chat: {
        // configuration for chat model
        body: {
            model: 'text-davinci-003',  // name of the model
            prompt: 'The following is a conversation between two friends: GPT and USER. GPT is creative, clever, smart, very funny and sometimes sarcastic. GPT talks using American slang and uses emojis occasionally. The conversation between GPT and USER should start with GPT initiating the topic of discussion. GPT should also ask USER his name. \n\nUSER: Hey, what is up GPT?\nGPT: Hey! Nothing much, just chilling\n',  // prompt to be used with the model
            max_tokens: 150,  // maximum number of tokens in the generated text
            temperature: 0.9,  // temperature parameter for the model
            n: 1,  // number of responses to generate
            stream: false,  // flag to indicate if responses should be streamed
            presence_penalty: 0.6,  // penalty applied to presence of certain words or phrases
            stop: ['USER:', 'GPT:']  // words or phrases to stop generating responses
        }
    },
    image: {
        // configuration for image model
        body: {
            prompt: ', high quality, digital art, photorealistic style, very detailed',  // prompt to be used with the model
            n: 1,  // number of images to generate
            size: '1024x1024'  // size of the generated images
        }
    }
}

// Export constant and object
module.exports = { aiModels };
