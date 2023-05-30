const { Configuration, OpenAIApi } = require('openai');
const { log } = require('../middleware/logger');

const postToChatGPTGetResponse = async (req, res) => {
    try {
        const chatValid = req.body.chat && Array.isArray(req.body.chat) && !req.body.chat.some(e => typeof(e.message) !== 'string');
        if (!chatValid) return res.status(400).send('Bad request.')

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const messages = chatValid
        ? req.body.chat.map(message => ({role: message.sender === "chatbot" ? "assistant" : "user", content: message.message}))
        : [];

        const openai = new OpenAIApi(configuration);
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 2048,
            temperature: 0.7
        });
            
        const response = completion.data.choices[0].message.content;
        chatValid && log(req, response);

        if (response) return res.status(200).send({response: response});
        else return res.status(404).send('No data found');
    } catch (err) {
        return res.status(500).send('An error has occurred.');
    };
};

module.exports = {
    postToChatGPTGetResponse: postToChatGPTGetResponse
}