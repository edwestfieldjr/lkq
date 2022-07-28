const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    confirmationCode: {
        type: String,
        unique: true
    },
    isAdmin : {
        type: Boolean,
        default: false
    }, 
    quotes: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Quote'
    }],

}); 

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);