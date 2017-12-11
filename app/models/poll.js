const mongoose = require('mongoose');

const optionsSchema = mongoose.Schema({
    name: String,
    votes: Number
});

const pollSchema = mongoose.Schema({
    userId: String,
    options: [optionsSchema],
    name: String
});

module.exports = mongoose.model('Poll', pollSchema);
