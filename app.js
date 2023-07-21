//REQUIRES
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const qs = require('qs');
const helmet = require('helmet');

const { logErrors, logAccess } = require('./middleware/logger');

const lifestagesRoute = require('./routes/lifestages-route');
const chatRoute = require('./routes/chat-route');
const { sanitizeReq } = require('./middleware/sanitize');
const { querySplitter } = require('./middleware/query-splitter');
const { rateLimiter } = require('./middleware/rate-limiter');

//APP
const app = express();

const corsOptions = {
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200
};


//middleware usage
app.use(helmet());
app.set('query parser', function(str) {
    return qs.parse(str ? decodeURIComponent(str) : str, {comma: true})
});
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(logAccess);
app.use(rateLimiter);
app.use(sanitizeReq);
app.use(querySplitter);

// ROUTES
app.use('/api/lifestages', lifestagesRoute);
app.use('/api/chat', chatRoute);


// error handler
app.use((err, req, res, next) => {
    logErrors(err, res.locals.endpoint ? res.locals.endpoint : 'entry', req);
    return res.status(500).send('An error has occurred.');
});

module.exports = app;