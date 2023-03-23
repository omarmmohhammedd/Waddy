const mongoose = require('mongoose');
const Review = mongoose.model('Reviews', new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    delegate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        required: true
    },
    review: {
        type: Number,
        default: 1,
        required: true
    }
}));

module.exports = Review