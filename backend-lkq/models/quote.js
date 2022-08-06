const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const quotesSchema = new Schema({
    text: { 
        type: String, 
        required: true 
    },
    isPublic: { 
        type: Boolean,
        default: false,
    },
    author: { 
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Author'
    },
    creator: { 
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    tags: [{ 
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Tag'
    }]
});

module.exports = mongoose.model('Quote', quotesSchema);