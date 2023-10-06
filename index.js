require("dotenv").config();
const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const chatHistory = new Map();
// const conversation = [
//     { role: 'system', content: '' },
//   ];



const maxTokens = 150;
// const apiKey = 'YOUR_API_KEY_HERE';
const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

client.on('messageCreate', async (message) => {
    console.log(message);
    if (message.author.bot) return;
    console.log('---------------------------- Message ----------------');
    console.log(message.content);
    if (message.mentions.has("1144881230245003406") && !message.author.bot) {
        console.log('mentioned found');
        console.log(message.content);
        const inputText = message.content.replace('/<@!?(\d+)>/g', '');
        // conversation.push({ role: 'user', content: inputText });

        console.log('---------- message text ----------');
        console.log(inputText);
        if (inputText) {

            let conversation = [
                { "role": "system", "content": "Your name is ClavyBot, A helpful assistant. Try to give a very short but clear non-formal answer in just one sentence." },
                { "role": "user", "content": inputText },
                { "role": "assistant", "content": "" },
            ];

            console.log('----------- Input  found -----------------');

            const response = await axios.post(
                apiUrl,
                {
                    model: "gpt-3.5-turbo",
                    messages: conversation,
                    max_tokens: maxTokens
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('---- chat gpt resp --');
            console.log( response.data.choices[0].message.content);
            console.log('sending response');

            message.reply( response.data.choices[0].message.content);

        } else {
            message.channel.send('Please provide a message for me to complete.');
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
