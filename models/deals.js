const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dealsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    link: {
        type: String
    }
});

module.exports = mongoose.model('Deals', dealsSchema);