const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName:{
        type:String,
        // required:true
    },
    mobileNumber: {
        type: String,
        required: true,
        max: 10
    },
    address:{
        type:String
    },
    houseNo:{
        type:String
    },
    locality:{
        type:String
    },
    landmark:{
        type:String
    },
    clientSecret: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    email: {
        type: String
    },
    member: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('User', userSchema);