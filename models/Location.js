const mongoose = require('mongoose');
const Location = mongoose.model("Locations", new mongoose.Schema({
    delegate: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    latitude: {
        type: Number,
        required:true
    },
    longitude: {
        type: Number,
        required: true
    }
},
    { timestamps: true }
))

module.exports = Location