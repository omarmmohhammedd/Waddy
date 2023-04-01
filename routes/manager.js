const router = require('express').Router();


const { getAllUsers, addSupervisor, getOrders, getOrder, deleteUser, getReviews, trackDelegate, ordersProof, getProofById, deleteProof, editSupervisor, deleteOrder, deleteReview } = require("../controllers/Manager")
const uploader = require("../middlewares/Multer")


router.get("/users", getAllUsers)
router.post("/supervisor", uploader.single("userImg"), addSupervisor)
router.delete("/users/:userId", deleteUser)
router.patch("/supervisor/:supervisorId", editSupervisor)
router.get("/orders", getOrders)
router.get("/orders/:orderId", getOrder)
router.get("/delegate_location/:delegateId", trackDelegate)
router.delete("/orders/:orderId", deleteOrder)
router.get("/proofs", ordersProof)
router.get("/proofs/:proofId", getProofById)
router.delete("/proofs/:proofId", deleteProof)
router.get("/reviews", getReviews)
router.delete('/reviews/:reviewId', deleteReview)
module.exports = router