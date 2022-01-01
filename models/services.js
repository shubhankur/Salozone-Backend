const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const servicesSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: true,
    },
    basePrice: {
        type: String
    },
    discountedPrice: {
        type: String
    },
    type:{
        type: String
    },
    imagePath:{
        type: String
    },
    product:[{
        id: { type: Number},
        name: { type: String, trim: true },
        basePrice: { type: String, trim: true },
        discountedPrice: { type: String, trim: true }
    }]
});

module.exports = mongoose.model('Services', servicesSchema);