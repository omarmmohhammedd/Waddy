const mongoose = require('mongoose');
const { v4: uuidv4} = require('uuid');
const Order = mongoose.model('Orders', new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    trackId: {
        type: String,
        default: "SK"+uuidv4().replace(/-/g, '').slice(0,10)
    },
    senderName: {
        type: String,
        required: true,
        min: 2,
        max:50
    },
    senderPhone: {
        type: String,
        required: true,
        validate:{validator:(val)=>val.length ===11 ,message:"Invalid phone number Must be 11 Number"}
    },
    senderEmail: {
        type: String,
        required: true,
        validate: { validator: (val) => val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), message: "Invalid Email" },
    },
    senderPostalCode: {
        type: String,
        required: true,
        validate: { validator: (val) => val.length === 5, message: "Invalid Postal Code" },
    },
    senderAddress: {
        type: String,
        required: true
    },
    receivedName: {
        type: String,
        required: true,
        min: 2,
        max:50
    },
    receivedPhone: {
        type: String,
        required: true,
        validate:{validator:(val)=>val.length ===11 ,message:"Invalid phone number Must be 11 Number"}
    },
    receivedEmail: {
        type: String,
        required: true,
        validate: { validator: (val) => val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), message: "Invalid Email" },
    },
    receivedPostalCode: {
        type: String,
        required: true,
        validate: { validator: (val) => val.length === 5, message: "Invalid Postal Code" },
    },
    receivedAddress: {
        type: String,
        required: true
    },
    products: Array,
    category: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    dimension: {
        type:Array
    },
    services: {
        type: Number,
        default:25
    },
    notes: String,
    paymentMethod: {
        type: String,
        required: true
    },
    delegate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
},{timestamps:true}))

module.exports = Order