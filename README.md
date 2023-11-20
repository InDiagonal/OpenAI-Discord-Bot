# OpenAI Bot (Beta v0.0.3)

<span>&nbsp;&nbsp;</span><img src="https://camo.githubusercontent.com/d55d8a7f07a103454ebb77b653d9600ce27e011f78395d9713b432c8c011c76a/68747470733a2f2f646973636f72642e6a732e6f72672f7374617469632f6c6f676f2e737667" width="15%"/><span>&nbsp;&nbsp;&nbsp;</span><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/2560px-OpenAI_Logo.svg.png" width="15%"/>

<a href="#-features">Features</a>
•
<a href="#-installation">Installation</a>
•
<a href="#-support">Support</a>
•
<a href="#%EF%B8%8F-dependencies">Dependencies</a>
•
<a href="#-license">License</a>

#### Video Demo:

> [https://youtu.be/jCkin9aoEvw](https://youtu.be/jCkin9aoEvw)

#### Description:

OpenAI Bot allows users to access the capabilities of advanced artificial intelligence technologies right from a Discord server. With this bot, you can use the GPT-4 language model to generate human-like text. Whether you're looking to retrieve creative ideas, write compelling content, or simply have some fun, the GPT-4 model is up to the task.

In addition to text generation, OpenAI Bot also allows users to access the DALL-E image generation model. This model can create unique and original images based on text input, allowing you to create visually striking graphics and artwork with ease. Whether you're an artist looking to generate new ideas, a designer looking to create eye-catching graphics, or just someone who enjoys creating and experimenting, the DALL-E model is a great resource.

## ⚡ Features

### `/ask` command

The `ask` slash command allows users to ask any question and receive an exhaustive answer. Simply type `/ask` followed by your question in a Discord channel where the bot is present, and the bot will use OpenAI's AI models to provide an answer.

### `/image` command

The `image` slash command allows users to generate an image using OpenAI's DALL·E technology. Simply type `/image` followed by a description of the image you want to generate in a Discord channel where the bot is present, and the bot will send you an embedded message with the generated image.

### `/chat` command

The `chat` slash command allows users to chat with OpenAI's GPT chatbot. Type `/chat` followed by `open` in a Discord channel where the bot is present, and the bot will begin a chat session with you. All chat sessions are saved in a local SQL database. To temporarily close a chat session type `/chat` followed by `close`. If you want to permanently delete your chat history from the database, type `/chat` followed by `delete`. _[ NOTE: You will be asked to confirm your choice since deletion is IRREVERSIBLE ]_

## 🛠 Installation

To install and run OpenAI Bot on your own Discord server, follow these steps:

1. Download the source code by cloning this repository or downloading a zip file.
2. Install the dependencies by running `npm install` in the root directory of the project.
3. In the `.env` file located in the root directory of the project insert the following values:
    - **Discord API token** as the value for the `DISCORD_TOKEN` variable. (You can sign up for a Discord API Token at [https://discord.com/developers/applications/](https://discord.com/developers/applications/))
    - **Application ID** as the value for the `CLIENT_ID` variable.
    - **Your Development Server ID** as the value for the `GUILD_ID` variable.
    - **OpenAI API key** as the value for the `OPENAI_API_KEY` variable. (You can sign up for an OpenAI API key at [https://beta.openai.com/signup/](https://beta.openai.com/signup/))
4. Start the bot by running `npm start` or `node .` in the root directory of the project.

## 🆘 Support

If you need any support while setting up your own bot, feel free to join the __[Development Server](https://discord.gg/ndCY5x8Dpq)__.

## ⛓️ Dependencies

OpenAI Bot has the following dependencies:

- **[discord.js](https://www.npmjs.com/package/discord.js)**: A JavaScript library for interacting with the Discord API.
- **[openai](https://www.npmjs.com/package/openai)**: A JavaScript library for interacting with the OpenAI API.
- **[sqlite3](https://www.npmjs.com/package/sqlite3)**: A JavaScript library that provides a self-contained, serverless, zero-configuration, transactional SQL database engine.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: A JavaScript library that loads environment variables from a .env file and makes them accessible via process.env object in Node.js applications

## 📖 License

OpenAI Bot is open source and released under the [MIT License](https://opensource.org/licenses/MIT).
