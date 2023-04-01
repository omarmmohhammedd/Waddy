const User = require("../models/User")
const Order = require("../models/Order")
const Proof = require("../models/Proof")

const getAllOrders = async (req, res) => {
   try {
       const Orders = await Order.find({ status: "Pending" }).populate({ path: "user", select: "firstName lastName email phone address governorate companyName postalCode" }).exec()
       if (!Orders) return res.status(404).json({ Orders })
       res.status(200).json({ Orders })
   } catch (error) {
       console.error(error)
       res.status(500).json({msg: error.message})
   }
}

const getOrder = async (req, res) => {
    const { orderId } = req.params
    try {
        const order = await Order.findById(orderId).populate({ path: "user", select: "firstName lastName email phone address governorate companyName postalCode" }).exec()
        if (!order) return res.status(404).json({ msg: "Order Not Found" })
        res.status(200).json({ order })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const takeOrder = async (req, res) => {
    const { orderId } = req.params
    const delegateId = req.user.id
    try {
        const delegateInfo = await User.findById(delegateId)
        const order = await Order.findById(orderId)
        if (!order) return res.status(404).json({ msg: 'Order not found' })
        if (order.delegate) return res.status(409).json({ msg: 'Other  Delegate Has Been Taken This Order' })
        if (order.status !== "Pending") return res.status(409).json({ msg: "Order Can't Be Taken Because This Order is Not Available" })
        await Order.findByIdAndUpdate(orderId, { delegate: delegateId, supervisor: delegateInfo.supervisor, status:"Prepared"}).then(() => { 
            res.sendStatus(200)
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const getDelegateOrders = async (req, res) => {
    const delegateId = req.user.id
    const orders = await Order.find({ delegate: delegateId }).exec()
    if (!orders.length) return res.status(404).json({ orders })
    res.status(200).json({ orders })
}

const addProof = async (req, res) => {
    const { orderId } = req.params
    const delegateId = req.user.id
    const img = req.file ? req.file.path : false
    try {
        if (!img) return res.status(403).json({ msg: "Please Provide Image Of Proof" })
        const order = await Order.findById(orderId)
        if (!order) return res.status(404).json({ msg: "Order Not Found" })
        await Proof.create({
            delegate: delegateId,
            order: orderId,
            img:"http://localhost:8080/"+img
        }).then(() => {
            res.sendStatus(200)
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const orderConfirmtion = async (req, res) => { 
    const { orderId } = req.params
    const { type } = req.query
    if (type != "Deliverd" && type != "Rejected") return res.status(400).json({ msg: "Enter Valid Type Of Order Status" })
    try {
        const order = await Order.findById(orderId)
        if(!order) return res.status(404).json({msg:"Order not found"})
        if (type === "Deliverd") await Order.findByIdAndUpdate(orderId, { status: "Delivered" }).then(() => res.sendStatus(200))
        else await Order.findByIdAndUpdate(orderId, { status: "Rejected" }).then(() => res.sendStatus(200))
    } catch (error) {
        console.error(error.message)
        res.status(500).json({msg: error.message})
    }
}


module.exports = { getAllOrders, addProof, takeOrder, getDelegateOrders, orderConfirmtion, getOrder }