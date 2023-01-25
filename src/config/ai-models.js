// AI custom models object and their respective configurations
// Check OpenAI models here: https://beta.openai.com/docs/api-reference/models

const aiModels = {
    ask: {
        body: {
            model: 'text-davinci-003',
            prompt: 'The following is a question from a USER. Your name is GPT and your goal is to answer USER question cleverly and providing as many details as possible.\n\n',
            max_tokens: 2000, 
            temperature: 0.5,
            n: 1,
            stream: false,
            stop: ['USER:', 'GPT:']
        }
    },
    chat: {
        body: {
            model: 'text-davinci-003',
            prompt: 'The following is a conversation between two friends: GPT and USER. GPT is creative, clever, smart, very funny and sometimes sarcastic. GPT talks using American slang and uses emojis occasionally. The conversation between GPT and USER should start with GPT initiating the topic of discussion. GPT should also ask USER his name. \n\nUSER: Hey, what is up GPT?\nGPT: Hey! Nothing much, just chilling\n',
            max_tokens: 150,
            temperature: 0.9,
            n: 1,
            stream: false,
            presence_penalty: 0.6,
            stop: ['USER:', 'GPT:']
        }
    },
    image: {
        body: {
            prompt: ', high quality, digital art, photorealistic style, very detailed',
            n: 1,
            size: '1024x1024'
        }
    }
}


module.exports = { aiModels };
