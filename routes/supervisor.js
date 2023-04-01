const router = require("express").Router()

const { addDelegate, getOrders, getReviews, delDelegate, getDelegates, trackDelegate, ordersProof, getProof, deleteProof, getAllOrders } = require("../controllers/Supervisor")

const uploader = require("../middlewares/Multer")
router.get("/delegates",getDelegates)
router.get("/orders", getOrders)
router.get("/all_orders", getAllOrders)
router.get('/reviews', getReviews)
router.post("/add_delegate", uploader.single("userImg"), addDelegate)
router.get("/delegate_location/:delegateId", trackDelegate)
router.delete("/remove_delegate/:delegateId", delDelegate)
router.get("/proofs", ordersProof)
router.get("/proofs/:proofId", getProof)
router.delete("/proofs/:proofId",deleteProof)

module.exports = router