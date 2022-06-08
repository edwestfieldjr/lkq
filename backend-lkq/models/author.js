const mongoose = require("mongoose")
const Schema = mongoose.Schema; 
const uniqueValidator = require('mongoose-unique-validator');

const authorSchema = new Schema({
    name: { type: String, required: true },
    ref_url: { type: String, required: true },
    quotes: [{         
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Quote' 
    }],
    
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Author', authorSchema);