const { createWriteStream } = require('fs');

const logChat = (chat, ip, response) => {
    const latestMessage = chat[chat.length - 1].message;
    const stream = createWriteStream("logs/chats.txt", {flags:'a'});
    stream.write(`${new Date().toISOString()}\t${ip}\t${latestMessage.replaceAll('\n',' ')}\n`);
    stream.write(`${new Date().toISOString()}\t${ip}\t${response.replaceAll('\n',' ')}\n`);
    stream.end();
};

const logErrors = (err, endpoint, req) => {
    const stream = createWriteStream("logs/errors.txt", {flags:'a'});
    stream.write(`${new Date().toISOString()}\t${req.ip}\t${endpoint}\t${err.message}\t${JSON.stringify(req.query)}\t${JSON.stringify(req.params)}\t${JSON.stringify(req.body)}\t${JSON.stringify(req.headers)}\n`);
    stream.end();
};

module.exports = {
    logChat: logChat,
    logErrors: logErrors
}