//REQUIRES
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const qs = require('qs');


const lifestagesRoute = require('./routes/lifestages-route');
const chatRoute = require('./routes/chat-route');

//APP
const app = express();

const corsOptions = {
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200
};

app.set('query parser', function(str) {
    return qs.parse(str ? decodeURIComponent(str) : str, {comma: true})
});

//middleware usage
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

// ROUTES
app.use('/api/lifestages', lifestagesRoute);
app.use('/api/chat', chatRoute);

module.exports = app;