const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url:String,
    filename:String
});

const customSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        min:10
    },
    date: {
        type: String,
        required: true
    },
    time:{
        type:Number,
        required:true
    },
    flavour:{
        type: String,
        lowercase: true,
        enum: ['blackforest', 'yellow butter', 'pound','red velvet','dutch', 'sponge','pineapple','genoise']
    },
    weight:{
        type:Number,
        enum:[0.5,1,1.5,2,2.5,3]
    },
    filling:{
        type: String,
        lowercase: true,
        enum: ['dark chocolate', 'dutch chocolate', 'vanilla','red velvet','blueberry', 'milk chocolate','pineapple']
    },
    icing:{
        type: String,
        lowercase: true,
        enum: ['dark chocolate', 'mango', 'vanilla','red velvet','fondant', 'milk chocolate','butter cream']
    },
    images:[ImageSchema]
})

const Custom = mongoose.model('Custom', customSchema);

module.exports = Custom;