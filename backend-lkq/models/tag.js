const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagsSchema = new Schema({
    name: { type: String, required: true },
    quotes: [{ 
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Quote'
    }]
});

module.exports = mongoose.model('Tag', tagsSchema);