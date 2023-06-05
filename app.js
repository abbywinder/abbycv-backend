//REQUIRES
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const qs = require('qs');

const { logErrors } = require('./middleware/logger');

const lifestagesRoute = require('./routes/lifestages-route');
const chatRoute = require('./routes/chat-route');

//APP
const app = express();

const corsOptions = {
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200
};


//middleware usage
app.set('query parser', function(str) {
    return qs.parse(str ? decodeURIComponent(str) : str, {comma: true})
});
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

// ROUTES
app.use('/api/lifestages', lifestagesRoute);
app.use('/api/chat', chatRoute);

// error handler
app.use((err, req, res, next) => {
    logErrors(err, res.locals.endpoint ? res.locals.endpoint : 'entry', req);
    return res.status(500).send('An error has occurred.');
});

module.exports = app;