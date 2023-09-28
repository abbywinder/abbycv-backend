//REQUIRES
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// FIXIE CONFIG
let proxy = {};
if (process.env.FIXIE_SOCKS_SOCKS_HOST) {
    const fixieData = process.env.FIXIE_SOCKS_SOCKS_HOST.split(new RegExp('[/(:\\/@/]+'));
    proxy = {
        proxyUsername: fixieData[0],
        proxyPassword: fixieData[1],
        proxyHost: fixieData[2],
        proxyPort: fixieData[3]
    }
};

//DB CONFIG
const port = process.env.PORT || 3003;
const db = process.env.MONGO_DB_CONNECTION_STR;

mongoose
.connect(db, {
    ...{
        useNewUrlParser: true, 
        useUnifiedTopology: true
    },
    ...proxy
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(port, () => console.log(`Listening on port ${port}`));