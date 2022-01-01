const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    ratings: {
        type: Object
    },
    complaintType: {
        type: String
    },
    content: {
        type: String
    }
});

module.exports= mongoose.model('Feedback', feedbackSchema);