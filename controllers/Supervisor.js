const User = require("../models/User")
const Order = require("../models/Order")
const Review = require("../models/Review")
const Location = require("../models/Location")
const Proof = require("../models/Proof")
const bcrypt = require("bcrypt")


const addDelegate = async (req, res) => {
    const { firstName, lastName, email, phone } = req.body
    if (!firstName || !lastName || !email || !phone ) return res.status(400).json({ msg: "All Feilds Are Required" })
    const img = req.file ? req.file.path : false
    try {
        const duplicate = await User.findOne({ $or: [{ email }, { phone }] })
        if (duplicate) return res.status(409).json({ msg: "Email Or Phone Already Exists" })
        const password = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        await User.create({ firstName, lastName, email, phone, password: await bcrypt.hash(password, 10), role: 2000, supervisor: req.user.id,userImg: img  && "http://localhost:8080/" + img})
        res.status(201).json({password})
    } catch (error) {   
        console.error(error)
        res.status(500).json({ msg:error.message })
    }
}

const delDelegate = async (req, res) => {
    const { delegateId } = req.params 
    try {
        const delegate = await User.findById(delegateId)
        if (!delegate) return res.status(404).json({ msg: "User not found" })
        await User.findByIdAndDelete(delegateId).then(() => {
            res.sendStatus(200)
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg:error.message })
    }
} 

const getOrders = async (req, res) => { 
    const supervisor = req.user.id
    try {
        const orders = await Order.find({ supervisor }).populate({ path: "user", select: "firstName lastName email phone address governorate companyName postalCode" }).populate({ path: "delegate", select: "firstName lastName email phone address " }).populate({ path: "supervisor", select: "firstName lastName email phone address" })
        res.status(200).json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg:error.message })
    }
}

const getReviews = async (req, res) => { 
    const supervisor = req.user.id
    try {
        const reviews = await Review.find({ supervisorId: supervisor }).populate({ path: "userId", select: "firstName lastName email phone address governorate companyName postalCode" }).populate({ path: "delegateId", select: "firstName lastName email phone address " }).populate({ path: "supervisorId", select: "firstName lastName email phone address" })
        res.status(200).json(reviews)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg:error.message })
    }
}

const getDelegates = async (req, res) => {
    const supervisor = req.user.id
    try {
        const delegates = await User.find({ supervisor, role: 2000 }).exec()
        if (!delegates.length) return res.status(404).json({ delegates: [] })
        res.status(200).json({ delegates })  
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const trackDelegate = async (req, res) => {
    const supervisor = req.user.id
    const {delegateId} = req.params
    try {
        const delegateInfo = await User.findById(delegateId)
        if (!delegateInfo) return res.status(404).json({ message: 'Delegate not found' })
        if (!delegateInfo.supervisor.equals(supervisor)) return res.status(409).json({ message: "This Delegate Not Belong To This Supervisor" })
        const delegateLocation = await Location.find({ delegate: delegateId })
        if (!delegateLocation) return res.status(404).json({ message: "Can't Find Delegate Location" })
        res.status(200).json({Location : delegateLocation})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: error.message })
    }
}

const ordersProof = async (req, res) => {
    try {
        const Proofs = await Proof.find({})
        if (!Proofs.length) return res.status(404).json({ Proofs })
        res.status(200).json({ Proofs }) 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const getProof = async (req, res) => { 
    const { proofId } = req.params
    try {
        const orderProof = await Proof.findById(proofId)
        if (!orderProof) return res.status(404).json({ msg:"Can't Find Order Proof" })
        res.status(200).json({ orderProof })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const deleteProof = async (req, res) => { 
    const { proofId } = req.params
    try {
        const proof = await Proof.findById(proofId)
        if (!proof) return res.status(404).json({ msg: "Can't Find This Proof" })
        await Proof.findByIdAndDelete(proofId).then(() => {
            res.sendStatus(200)
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }

}

const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
    res.status(200).json({orders})
}

module.exports = { addDelegate, getOrders, getReviews, delDelegate, getDelegates, trackDelegate, ordersProof, getProof, deleteProof, getAllOrders }