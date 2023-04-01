const router = require("express").Router()

const { getAllOrders, addProof, takeOrder, getDelegateOrders, orderConfirmtion, getOrder } = require("../controllers/Delegate")
const uploader = require("../middlewares/Multer")

router.get("/orders", getAllOrders)
router.get("/orders/:orderId", getOrder)
router.get("/delegate_orders", getDelegateOrders)
router.post("/proof/:orderId", uploader.single("proof"),addProof)
router.post("/take_order/:orderId", takeOrder)
router.patch("/confirm_order/:orderId", orderConfirmtion)

module.exports = router