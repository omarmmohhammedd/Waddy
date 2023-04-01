const router = require("express").Router()
const { Register, Login, VerifyOTP, ForgetPassword, updatePassword, getUserInfo, changePassword, changeUserInfo } = require("../controllers/auth")
const verifyToken = require("../middlewares/verifyToken")
const uploader = require("../middlewares/Multer")
router.post('/register', uploader.single("userImg"),Register)
router.post('/login', Login)
router.post('/forget', ForgetPassword)
router.post('/verifyotp', VerifyOTP)
router.patch('/updatepassword', updatePassword)
router.get("/userInfo", verifyToken, getUserInfo)
router.patch('/changepassword', verifyToken, changePassword)
router.patch("/userInfo", verifyToken, changeUserInfo)

module.exports = router
