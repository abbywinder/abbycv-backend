const validator = require('validator');
const { logSanitiser } = require('./logger');

const sanitizeReq = (req, res, next) => {
    try {
        const sanitize = item => {
            const iterAll = item => {
                item && Object.keys(item).forEach(key => {
                    if (item[key] && typeof(item[key]) == 'object') {
                        iterAll(item[key]);
                        return;
                    };
    
                    item[key] = validator.escape(item[key])
                });
            };

            iterAll(item);
            return item;
        };
        
        req.headers = sanitize(req.headers);
        req.cookies = sanitize(req.cookies);
        req.query = sanitize(req.query);
        req.params = sanitize(req.params);
        req.body = sanitize(req.body);

        logSanitiser(req.ip, JSON.stringify({...req.headers, ...req.cookies, ...req.query, ...req.params, ...req.body}));
        next ();
    } catch (err) {
        return next(err);
    };
};

module.exports = {
    sanitizeReq: sanitizeReq
};