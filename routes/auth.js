const router = require("express").Router()
const { Register, Login, VerifyOTP, ForgetPassword, updatePassword, getUserInfo, changePassword } = require("../controllers/auth")
const verifyToken = require("../middlewares/verifyToken")
router.post('/register', Register)
router.post('/login', Login)
router.post('/forget', ForgetPassword)
router.post('/verifyotp', VerifyOTP)
router.patch('/updatepassword', updatePassword)
router.get("/userInfo", verifyToken, getUserInfo)
router.patch('/changepassword', verifyToken,changePassword)

module.exports = router
