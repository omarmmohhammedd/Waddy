const router = require("express").Router()

const { makeOrder, getOrders, getOrderById, getOrderByTrackId, updateOrder, deleteOrder, getPaymopAuth, Payment_key, getRate, makeReview } = require("../controllers/Cilent")

router.post("/get_rate", getRate)
router.get("/orders", getOrders)
router.get("/order/:orderId", getOrderById)
router.get("/order/track/:trackId", getOrderByTrackId)
router.post("/order", makeOrder)
router.patch("/order/:orderId", updateOrder)
router.delete("/order/:orderId",deleteOrder)
router.get("/paymop/auth", getPaymopAuth)
router.post("/paymop/payment_key", Payment_key)
router.post("/make_review/:orderId", makeReview)
module.exports = router