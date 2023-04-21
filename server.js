//REQUIRES
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const mongoose = require('mongoose');

const lifestagesRoute = require('./routes/lifestages-route');

//APP
const app = express();
const port = process.env.PORT || 3003;

const corsOptions = {
    origin: ['http://localhost:3003'],
    optionsSuccessStatus: 200
};

//middleware usage
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

// ROUTES
app.use('/api/lifestages', lifestagesRoute);

//DB CONFIG
const db = process.env.MONGO_DB_CONNECTION_STR;

mongoose
.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(port, () => console.log(`Listening on port ${port}`));