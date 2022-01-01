const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userMadeCombosSchema = new Schema({
    services:[
        {
            id: {
                type: Number
            },
            name: {
                type: String
            },
            price: {
                type: Number
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: String
    }
});

module.exports = mongoose.model('UserMadeCombos', userMadeCombosSchema);