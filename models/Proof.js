const mongoose = require('mongoose');
const Proof = mongoose.model('Proofs', new mongoose.Schema({
    delegate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        required: true
    },
    img: {
        type: String,
        required:true
    }
},
    { timestamps: true }));

module.exports = Proof