const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LifestageSchema = new Schema({
    date_start: {
        type: Date
    },
    date_end: {
        type: Date
    },
    title: {
        type: String
    },
    description: [String],
    soft_skills: [String],
    hard_skills: [String],
    achievements: [String],
});

module.exports = Lifestage = mongoose.model('lifestage', LifestageSchema);