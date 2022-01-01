const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    employee:{
        type:Schema.Types.ObjectId,
        ref:'employee'
    },
    bookedTime:{
        type:Number,
        default:new Date().getTime()
    },
    bookingDate:{
        type: String,
        required: true
    },
    bookingId:{
        type: String,
        required: true
    },
    bookingTime:{
        type: String,
        required: true
    },
    bookingAddress:{
        type: String,
        required: true
    },
    paymentStatus:{
        type: String,
        required: true
    },
    userComment: {
        type: String
    },
    services:[
        {
            quantity:{
                type: Number
            },
            id: {
                type: Number
            },
            name: {
                type: String
            }
        }
    ],
    paymentMode:{
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    mihpayid:{
        type: String
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderStatus:{
        type:String,
        default:'Pending'
    }

});


module.exports = mongoose.model('Booking', bookingSchema);