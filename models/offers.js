const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let i = 0;

const offersSchema = new Schema({
    // id: {
    //     type: Number,
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    services:[{
        serviceNames:{
            type: String,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        id:{
            type:Number,
            required:true
        }
    }],
    imagePath: {
        type: String, 
    }
})

module.exports = mongoose.model('Offers', offersSchema)