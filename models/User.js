const mongoose = require('mongoose')

const User = mongoose.model('Users', new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 30
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: { validator: (val) => val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), message: "Invalid Email" },
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: { validator: (val) => val.match(/^[0-9]+$/), message: "Invalid Phone" },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 6,
        max: 30
    },
    address: {
        type: String,
        trim: true
    },
    companyName: {
        type: String,
        min: 3,
        max: 30
    },
    industry: {
        type: String,
        min: 3,
        max: 30
    },
    governorate: {
        type: String,
        min: 3,
        max: 30
    },
    postalCode: {
        type: Number,
        validate:{validator:(val)=>val.length === 5 ,message:"Postal Code must be 5 Numbers"}
    },
    role: {
        type: Number,
        default:1000
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    userImg: String

}))
module.exports = User