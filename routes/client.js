const router = require("express").Router()

const { makeOrder, getOrders, getOrderById, getOrderByTrackId, updateOrder, deleteOrder } = require("../controllers/Cilent")

router.get("/orders", getOrders)
router.get("/order/:orderId", getOrderById)
router.get("/order/track/:trackId", getOrderByTrackId)
router.post("/order", makeOrder)
router.patch("/order/:orderId", updateOrder)
router.delete("/order/:orderId",deleteOrder)

module.exports = router