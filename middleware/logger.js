const fs = require('fs');

const log = (req, response) => {
    const latestMessage = req.body.chat[req.body.chat.length - 1].message;
    const stream = fs.createWriteStream("logs/chats.txt", {flags:'a'});
    stream.write(`${new Date().toISOString()}\t${req.ip}\t${latestMessage.replaceAll('\n',' ')}\n`);
    stream.write(`${new Date().toISOString()}\t${req.ip}\t${response.replaceAll('\n',' ')}\n`);
    stream.end();
};

module.exports = {
    log: log
}