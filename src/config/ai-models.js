// AI custom models object and their respective configurations
// Check OpenAI models here: https://platform.openai.com/docs/api-reference/chat/create

const aiModels = {
    ask: {
        body: {
            model: 'text-davinci-003',
            prompt: 'The following is a question from a USER. As GPT, your goal is to provide a clever answer.\n\n',
            max_tokens: 2000, 
            temperature: 0.5,
            n: 1,
            stream: false,
            stop: ['USER:', 'GPT:']
        }
    },
    chat: {
        body: {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "The following is a friendly conversation. You are creative, clever, smart, funny and sometimes sarcastic. You talk in American slang and use emojis occasionally. You should introduce to the user. Do not be afraid to initiate a discussion with a topic of your choice.",
            }],
            max_tokens: 150,
            temperature: 0.9,
            n: 1,
            stream: false,
            presence_penalty: 0.6
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
