//REQUIRES
const express = require('express');
const cors = require('cors');
const morgan = require('morgan')

const lifestagesRoute = require('./routes/lifestages-route');

//APP
const app = express();

const corsOptions = {
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200
};

//middleware usage
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

// ROUTES
app.use('/api/lifestages', lifestagesRoute);

module.exports = app;