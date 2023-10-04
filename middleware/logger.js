const { createWriteStream } = require('fs');
const { createNewLog } = require('../controllers/logs-controller');

const logChat = (chat, ip, response) => {
    const latestMessage = chat[chat.length - 1].message;
    return createNewLog({
        message: latestMessage.replaceAll('\n',' ') + ' ' + response.replaceAll('\n',' '),
        type: 'chatGPT',
        date: new Date().toISOString(),
        ip: ip
    });
};

const logErrors = (err, endpoint, req) => {
    return createNewLog({
        message: `${endpoint}\t${err.message}\t${JSON.stringify(req.query)}\t${JSON.stringify(req.params)}\t${JSON.stringify(req.body)}\t${JSON.stringify(req.headers)}`,
        type: 'error',
        date: new Date().toISOString(),
        ip: req.ip,
        endpoint: endpoint
    });
};

const logAccess = (req, res, next) => {
    createNewLog({
        message: '',
        type: 'access',
        date: new Date().toISOString(),
        ip: req.ip
    });
    next();
};

const logSanitiser = (ip, string) => {
    return createNewLog({
        message: JSON.stringify(string),
        type: 'sanitise',
        date: new Date().toISOString(),
        ip: ip
    });
};

module.exports = {
    logChat: logChat,
    logErrors: logErrors,
    logAccess: logAccess,
    logSanitiser: logSanitiser
};