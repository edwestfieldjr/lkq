const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const quotesSchema = new Schema({
    text: { type: String, required: true },
    author: { 
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    creator: { 
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    tags: [{ 
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Tag'
    }]
});

module.exports = mongoose.model('Quote', quotesSchema);