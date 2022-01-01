const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const joinUsSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    experience:{
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    whyWeHire: {
        type: String,
        required: true
    }
});

module.exports= mongoose.model('JoinUsRequests', joinUsSchema);