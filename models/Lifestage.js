const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LifestageSchema = new Schema({
    date_start: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v <= this.date_end;
            },
            message: 'Start date must be earlier than end date'
        }
    },
    date_end: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v >= this.date_start;
            },
            message: 'End date must be later than start date'
        }
    },
    title: {
        type: String,
        required: true, 
    },
    description: [String],
    soft_skills: [String],
    hard_skills: [String],
    achievements: [String],
    type: {
        type: String
    },
    background_col: {
        type: String
    }
});

module.exports = Lifestage = mongoose.model('lifestage', LifestageSchema);