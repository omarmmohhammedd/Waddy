const User = require("../models/User")
const Order = require("../models/Order")
const { OrderSummery } = require("../config/Mailer")
const { getAuthData, getPaymentKey } = require("../config/paymop")

const makeOrder = async (req, res) => {
    const  userId  = req.user.id
    const {  senderPostalCode, senderAddress, receivedName, receivedPhone, receivedEmail, receivedPostalCode, receivedAddress, category, weight, dimension, services, notes,paymentId } = req.body
    try {
        const foundUser = await User.findById(userId)
        if (!foundUser) return res.status(404).send("User not found")
        const order = new Order({
            user:userId,
            senderName:foundUser.firstName,
            senderPhone: foundUser.phone,
            senderEmail: foundUser.email,
            senderPostalCode,
            senderAddress,
            receivedName,
            receivedPhone,
            receivedEmail,
            receivedPostalCode,
            receivedAddress,
            category,
            weight,
            dimension,
            price:services,
            deliverTime:"2 Days",
            notes,
            paymentId
        })
        await order.save()
        await OrderSummery(order)
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
    try {
        const order = await Order.findOne({ trackId }).populate({ path: "user", select: "firstName lastName email phone address" }).populate({ path: "delegate", select: "firstName lastName email phone address" })
        if (!order) return res.status(404).send("Orders not found")
        res.status(200).json({ order })
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
        const order = await Order.findById(orderId)
        if(!order) return res.status(404).json({msg:"Order not found"})
        if (!order.user.equals(userId)) return res.status(401).json({ msg: "This Client is not authorized To Access This Order" })
        await Order.findByIdAndUpdate(orderId, { senderName, senderPhone, senderEmail, senderPostalCode, senderAddress, receivedName, receivedPhone, receivedEmail, receivedPostalCode, receivedAddress, products, category, weight, dimension, price: services, paymentMethod, notes }).then((val) => {
            res.status(201).json(order)
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:error.msg})
    }

}

const deleteOrder = async (req, res) => {
    const { orderId } = req.params
    const userId = req.user.id
    try {
        const order = await Order.findById(orderId)
        if (!order) return res.status(404).json({ msg: "Order not found" })
        if (!order.user.equals(userId)) return res.status(401).json({ msg: "This Client is not authorized To Access This Order" })
        await Order.findByIdAndDelete(orderId).then(()=> res.sendStatus(200))
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.msg})
    }

}

const getPaymopAuth = async (req, res) => { 
    const { price } = req.body
    const AuthData = await getAuthData(price)
    if (AuthData.error) return res.status(AuthData.error.response.status).json(AuthData.error.message)
    res.status(200).json(AuthData)
}

const Payment_key = async (req, res) => {
    const { order, token, paymentId } = req.body
    const PaymentData = await getPaymentKey(order, token, paymentId)
    if (PaymentData.error) return res.status(PaymentData.error.response.status).json(PaymentData.error.message)
    res.status(200).json(PaymentData)
}
module.exports = { makeOrder, getOrders, getOrderById, getOrderByTrackId, updateOrder, deleteOrder, getPaymopAuth, Payment_key }