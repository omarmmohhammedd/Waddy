const User = require("../models/User")
const Order = require("../models/Order")
const Review = require("../models/Review")
const { OrderSummery } = require("../config/Mailer")
const { getAuthData, getPaymentKey } = require("../config/paymop")

const getRate = async (req, res) => { 
    const { Dcountry, Rcountry, weight, Npackge } = req.body
    if (!Dcountry || !Rcountry || !weight || !Npackge) return res.status(400).json({ msg: "All Feilds Are Required" })
    if (typeof Dcountry !== "string" || typeof Rcountry !== "string" || typeof weight !== "number" || typeof Npackge !== "number") return res.status(400).json({ msg: "Invalid Type Of Requested Data" })
    if (Dcountry == Rcountry) {
        res.status(200).json({
            From: Dcountry,
            To: Rcountry,   
            Regular: {
                cost: 15 + (weight * 5 * Npackge),
                date: "3 Days"
            },
            Express: {
                cost: (30 + weight * 5 * Npackge),
                date: "1 Days"
            }
        })   
    } else {
        res.status(200).json({
            From: Dcountry,
            To: Rcountry,
            Regular: {
                cost: 25 + (weight * 5 * Npackge ),
                date: "3 Days"
            },
            Express: {
                cost: 55 + (weight * 10 * Npackge),
                date: "1 Days"
            }
        }) 
    }
}

const makeOrder = async (req, res) => {
    const  userId  = req.user.id
    const { senderName, senderPhone, senderEmail,senderPostalCode, senderAddress, receivedName, receivedPhone, receivedEmail, receivedPostalCode, receivedAddress, category, weight, dimension, services, notes, paymentId, deliverTime } = req.body
    if (!senderName || !senderPhone || !senderEmail || !senderPostalCode || !senderAddress || !receivedName || !receivedPhone || !receivedEmail || !receivedPostalCode || !receivedAddress || !category || !weight || !dimension || !notes || !paymentId || !deliverTime || !services) return res.status(400).json({msg:"All Fields Are Required"})
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
            category,
            weight,
            dimension,
            services,
            deliverTime,
            notes,
            paymentId
        })
        await order.save()
        await OrderSummery(order)
        res.status(201).send(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:error.message})
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

const makeReview = async (req, res) => {
    const userId = req.user.id
    const {orderId } = req.params
    const { delegateId, review } = req.body
    if (!delegateId || !review) return res.status(400).json({ msg: "All Feilds Are Required" })
    try {
        const userInfo = await User.findById(userId).exec()
        if (!userInfo) return res.status(400).json({ msg: "User Not Found" })
        const delegateInfo = await User.findById(delegateId).exec()
        if (!delegateInfo) return res.status(400).json({ msg: "Delegate Not Found" })
        const orderInfo = await Order.findById(orderId).exec()
        if (!orderInfo) return res.status(400).json({ msg: "Order Not Found" })
        if (review < 1 || review > 5) return res.status(409).json({ msg: "Review Must Be > 1" })
        await Review.create({
            userId,
            orderId,
            delegateId,
            supervisorId: await delegateInfo.supervisor,
            review
        }).then((val, err) => {
            if (err) return res.status(500).json({ msg: err.message })
            res.sendStatus(201)
        }) 
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg:error.message})
    }
    
}

module.exports = { makeOrder, getOrders, getOrderById, getOrderByTrackId, updateOrder, deleteOrder, getPaymopAuth, Payment_key, getRate,makeReview }