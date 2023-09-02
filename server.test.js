require('dotenv').config();
const mongoose = require("mongoose");

describe('Server', () => {
    it('Should connect to database', async () => {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_STR);
    })
});