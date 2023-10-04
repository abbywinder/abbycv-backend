const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    endpoint: {
        type: String
    },
    type: {
        type: String,
        required: true
    }
});

module.exports = Log = mongoose.model('log', LogSchema);