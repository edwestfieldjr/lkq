const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const quotesSchema = new Schema({
    text: { type: String, required: true },
    tags: { type: String, required: false },
    author: { 
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    creator: { 
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Quote', placesSchema);