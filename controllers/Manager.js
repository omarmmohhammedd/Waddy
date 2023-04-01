const User = require("../models/User")
const Order = require("../models/Order")
const Review = require("../models/Review")
const Location = require("../models/Location")
const Proof = require("../models/Proof")
const bcrypt = require("bcrypt")

const getAllUsers = async (req, res) => { 
    try {
        const users = await User.find({}).populate({ path: "supervisor", select: "firstName lastName email phone address userImg" })
        res.status(200).json({ users })
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.message})
    }
}

const addSupervisor = async (req, res) => {
    const { firstName, lastName, email, phone, city } = req.body
    const userImg = req.file ? req.file.path : false
    if (!firstName || !lastName || !email || !phone || !city) return res.status(400).json({ msg: "All Feilds Are Required" })
    try {
        const duplicate = await User.findOne({ $or: [{ email }, { phone }] })
        if (duplicate) return res.status(409).json({ msg: "Email Or Phone Are Exists" })
        const duplicateCity = await User.findOne({ address: city })
        if (duplicateCity) return res.status(409).json({ msg: "There Is Superviosr in  The Same  City" })
        const password = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        await User.create({ firstName, lastName, email, phone, password: await bcrypt.hash(password, 10), role: 3000, userImg: userImg && "http://localhost:8080/" + userImg, address:city })
        res.status(201).json({ password }) 
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.message})
    }

}

const deleteUser = async (req, res) => {
    const { userId } = req.params
    try {
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ msg: "User not found" })
        await User.findByIdAndDelete(userId).then(() => {
            res.sendStatus(200)
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate({ path: "delegate", select: "firstName lastName email phone " }).populate({ path: "supervisor", select: "firstName lastName email phone city" })
        res.status(200).json({ orders })
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.message})
    }
}

const getOrder = async (req, res) => {
    const { orderId } = req.params
    try {
        const order = await Order.findById(orderId).populate({ path: "delegate", select: "firstName lastName email phone " }).populate({ path: "supervisor", select: "firstName lastName email phone city " })
        if (!order) return res.status(404).json({ msg: "Order Not Found" })
        res.status(200).json({ order })
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.message})
    }
}

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).populate({ path: "userId", select: "firstName lastName email phone address governorate companyName postalCode" }).populate({ path: "delegateId", select: "firstName lastName email phone address " }).populate({ path: "supervisorId", select: "firstName lastName email phone address" }).populate("orderId")
        res.status(200).json(reviews)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const deleteReview = async (req, res) => {
    const { reviewId } = req.params
    try {
        const review = await Review.findById(reviewId)
        if (!review) return res.status(404).json({ msg: "Review not found" })
        await Review.findByIdAndDelete(reviewId).then(() => {
            res.sendStatus(200)
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const trackDelegate = async (req, res) => {
    const { delegateId } = req.params
    try {
        const delegateInfo = await User.findById(delegateId)
        if (!delegateInfo) return res.status(404).json({ message: 'Delegate not found' })
        const delegateLocation = await Location.find({ delegate: delegateId })
        if (!delegateLocation) return res.status(404).json({ message: "Can't Find Delegate Location" })
        res.status(200).json({ Location: delegateLocation })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: error.message })
    }
}

const ordersProof = async (req, res) => {
    try {
        const Proofs = await Proof.find({}).populate({ path: "delegate", select: "firstName lastName email phone " }).populate({ path: "order" })
        if (!Proofs.length) return res.status(404).json({ Proofs })
        res.status(200).json({ Proofs })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const getProofById = async (req, res) => {
    const { proofId } = req.params
    try {
        const orderProof = await Proof.findById(proofId).populate({ path:"delegate",select:"firstName lastName email phone"}).populate("order")
        if (!orderProof) return res.status(404).json({ orderProof })
        res.status(200).json({ Proof:orderProof })
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
        await Proof.findByIdAndDelete(proofId).then(() => res.sendStatus(200))
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }

}

const editSupervisor = async (req, res) => {
    const { supervisorId } = req.params
    const { city } = req.body
    try {
        const supervisor = await User.findById(supervisorId)
        if (!supervisor) return res.status(404).json({ msg: "Supervisor Not Found" })
        const duplicate = await User.findOne({ $and: [{ address: city, role: 3000 }] })
        if(duplicate) return res.status(409).json({msg:"Anthor Supervisor Have The Same City"})
        await User.findByIdAndUpdate(supervisorId, { address:city }).then(() => res.sendStatus(200))
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.message})
    }
}

const deleteOrder = async (req, res) => {
    const { orderId } = req.params
    try {
        const order = await Order.findById(orderId)
        if (!order) res.status(404).json({ msg: "Order not found" })
        await Order.findByIdAndDelete(orderId).then(() => res.sendStatus(200))
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.message})
    }
}

module.exports = { getAllUsers, addSupervisor, getOrders, getOrder, deleteUser, getReviews, trackDelegate, ordersProof, getProofById, deleteProof, editSupervisor, deleteOrder, deleteReview }