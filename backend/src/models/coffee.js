const mongoose = require('../database');

const CoffeeSchema = new mongoose.Schema({
    intensity: {
        type: String,
        lowercase: true,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Coffee = mongoose.model('Coffee', CoffeeSchema);

module.exports = Coffee;