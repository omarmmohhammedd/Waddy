const User = require("../models/User")
const Order = require("../models/Order")

const makeOrder = async (req, res) => {
    const  userId  = req.user.id
    const { senderName, senderPhone, senderEmail, senderPostalCode, senderAddress, receivedName, receivedPhone, receivedEmail, receivedPostalCode, receivedAddress, products, category, weight, dimension, services, paymentMethod, notes } = req.body
    try {
        const foundUser = await User.findById(userId)
        if (!foundUser) return res.status(404).send("User not found")
        const order = new Order({
            user:userId,
            senderName,
            senderPhone,
            senderEmail,
            senderPostalCode,
            senderAddress,
            receivedName,
            receivedPhone,
            receivedEmail,
            receivedPostalCode,
            receivedAddress,
            products,
            category,
            weight,
            dimension,
            services,
            paymentMethod,
            notes
        })
        await order.save()
        res.status(201).send(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.msg})
    }
}

const getOrders = async (req, res) => {
    const userId = req.user.id
    try {
        const orders = await Order.find({ user:userId }).populate({ path: "user", select:"firstName lastName email phone address"}).populate({path:"delegate", select:"firstName lastName email phone address"})
        res.status(200).send(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.msg})
    }
}

const getOrderById = async (req, res) => {
    const { orderId } = req.params
    const userId = req.user.id
    try {
        const order = await Order.findById(orderId).populate({ path: "user", select: "firstName lastName email phone address" }).populate({ path: "delegate", select: "firstName lastName email phone address" })
        if (!order) return res.status(404).send("Order not found")
        if(order.user.id !== userId) return res.status(401).json({msg:"This Client is not authorized To Access This Order"})
        res.status(200).send(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.msg})
    }
}

const getOrderByTrackId = async (req, res) => {
    const { trackId } = req.params
    const userId = req.user.id
    try {
        const order = await Order.find({ trackId,user:userId }).populate({ path: "user", select: "firstName lastName email phone address" }).populate({ path: "delegate", select: "firstName lastName email phone address" })
        if (!order.length) return res.status(404).send("Orders not found")
        res.status(200).send(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.msg})
    }
}

const updateOrder = async (req, res) => {
    const { orderId } = req.params
    const userId = req.user.id
    const { senderName, senderPhone, senderEmail, senderPostalCode, senderAddress, receivedName, receivedPhone, receivedEmail, receivedPostalCode, receivedAddress, products, category, weight, dimension, services, paymentMethod, notes } = req.body
    try {
        const order = await Order.findByIdAndUpdate(orderId, { senderName, senderPhone, senderEmail, senderPostalCode, senderAddress, receivedName, receivedPhone, receivedEmail, receivedPostalCode, receivedAddress, products, category, weight, dimension, services, paymentMethod, notes })
        if (order.user.id !== userId) return res.status(401).json({ msg: "This Client is not authorized To Access This Order" })
        res.status(201).json(order)
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:error.msg})
    }

}

const deleteOrder = async (req, res) => {
    const { orderId } = req.params
    const userId = req.user.id
    try {
        const order = await Order.findByIdAndDelete(orderId)
        if (!order) return res.status(404).send("Order not found")
        if (order.user.id !== userId) return res.status(401).json({ msg: "This Client is not authorized To Access This Order" })
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.msg})
    }

}

module.exports = { makeOrder, getOrders, getOrderById, getOrderByTrackId, updateOrder, deleteOrder }