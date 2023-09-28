//REQUIRES
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

//DB CONFIG
const port = process.env.PORT || 3003;
const db = process.env.FIXIE_URL ? process.env.FIXIE_URL + process.env.MONGO_DB_CONNECTION_STR : process.env.MONGO_DB_CONNECTION_STR;

mongoose
.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(port, () => console.log(`Listening on port ${port}`));