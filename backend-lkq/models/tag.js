const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagsSchema = new Schema({
    name: { type: String, required: false },
    quotes: [{ 
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Quote'
    }]
});

module.exports = mongoose.model('Tag', tagsSchema);