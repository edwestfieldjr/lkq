const mongoose = require("mongoose")
const Schema = mongoose.Schema; 
const uniqueValidator = require('mongoose-unique-validator');

const authorSchema = new Schema({
    name: { type: String, required: false, default: 'Anonymous'},
    ref_url: { 
        type: String, 
        required: false, 
        default: 'https://en.wikipedia.org/wiki/Anonymous_work'},
    ref_img: { 
        type: String, 
        required: false , 
        default: 'https://images.unsplash.com/photo-1534294668821-28a3054f4256' /* Photo by Jeremy Bishop on Unsplash - https://unsplash.com/photos/KFIjzXYg1RM */},
    quotes: [{         
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Quote', 
        default: new Array()
    }],
    
});

authorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Author', authorSchema);