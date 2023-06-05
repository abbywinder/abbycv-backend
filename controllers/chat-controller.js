const { Configuration, OpenAIApi } = require('openai');
const { logChat } = require('../middleware/logger');

const postToChatGPTGetResponse = async (req, res, next) => {
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

        if (response) res.status(200).send({response: response});
        else res.status(404).send('No data found');

        logChat(req.body.chat, req.ip, response);
        return;
    } catch (err) {
        res.locals.endpoint = 'postToChatGPTGetResponse';
        return next(err);
    };
};

module.exports = {
    postToChatGPTGetResponse: postToChatGPTGetResponse
}