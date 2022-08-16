let mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Date, default: Date.now()},
    status: {type: String, enum: ['User', 'Admin'], default: 'User'}
})

module.exports = mongoose.model('Note', noteSchema)