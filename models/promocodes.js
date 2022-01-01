const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const promocodesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    minAmount: {
        type: Number
    },
    discount: {
        type: Number
    }
});

module.exports = mongoose.model('Promocodes', promocodesSchema);