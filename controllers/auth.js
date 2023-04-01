const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const { sendOTP, verifyOTP } = require("../config/Mailer")

const Register = async (req, res) => {
    const { type } = req.query
    const userImg = req.file ? req.file.path :false
    if (type === "personal") {
        const { firstName, lastName, email, password, confirmPassword, phone, address } = req.body
        if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !address) return res.status(400).json({ msg: "All Fields Required" })
        if (password !== confirmPassword) return res.status(400).json({ msg: "Passwords Must Be Equals " })
        try {
            const duplicate = await User.find({ $or: [{ email, phone }] })
            if (duplicate.length > 0) return res.status(400).json({ msg: "Email or Phone Already Exists" })
            await User.create({
                firstName,
                lastName,
                email,
                password: await bcrypt.hash(password, 10),
                phone,
                address,
                userImg: userImg && "http://localhost:8080" + userImg
            }).then((value, err) => {
                if (err) return res.status(500).json({ msg: err.message })
                res.sendStatus(201)
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ msg: error.message })
        }
    } else {
        const { firstName, lastName, email, password, confirmPassword, companyName, industry, phone, governorate, postalcode } = req.body
        if (!firstName || !lastName || !email || !password || !confirmPassword || !companyName || !industry || !phone || !governorate || !postalcode) return res.status(400).json({ msg: "All Feilds Are Required" })
        if (password !== confirmPassword) return res.status(400).json({ msg: "Passwords Must Be Equals " })
        try {
            const duplicate = await User.find({ $or: [{ email, phone }] })
            if (duplicate.length > 0) return res.status(400).json({ msg: "Email or Phone Already Exists" })
            await User.create({
                firstName,
                lastName,
                email,
                password: await bcrypt.hash(password, 10),
                companyName,
                industry,
                phone,
                governorate,
                postalcode,
                userImg: userImg && "http://localhost:8080" + userImg
            }).then((value,err) => {
                if (err) return res.status(500).json({ msg: err.message })
                res.sendStatus(201)
            })
            
        } catch (error) {
            console.error(error)
            res.status(500).json({ msg: error.message })
        }
        
        
    }
}

const Login = async (req, res) => { 
    const { email, password } = req.body
    if (!email ||!password) return res.status(400).json({ msg: "All Fields Required" })
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ msg: "Email Not Found" })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: "Password Incorrect" })
        const token = jwt.sign({ id: user._id ,role:user.role}, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.json({ token, user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const ForgetPassword = async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ msg: "All Fields Required" })
    try {
            const user = await User.findOne({ email })
            if (!user) return res.status(400).json({ msg: "Email Not Found" })
            sendOTP(email)
            res.sendStatus(200)
        }
    catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const VerifyOTP = async (req, res) => { 
    const { email, otp } = req.body
    if (!email  || !otp) return res.status(400).json({ msg: "All Fields Required" })
    try {
            const user = await User.findOne({ email })
            if (!user) return res.status(400).json({ msg: "Email Not Found" })
            const isMatch = await verifyOTP(otp)
            if (!isMatch) return res.status(400).json({ msg: "OTP Incorrect" })
            const userId = user._id
            res.status(200).json({ userId })
        }
    catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const updatePassword = async (req, res) => {
    const { userId, password, confirmPassword } = req.body
    if (!userId || !password || !confirmPassword) return res.status(400).json({ msg: "All Fields Required" })
    if (password !== confirmPassword) return res.status(400).json({ msg: "Passwords Must Be Equals " })
    try {
        const user = await User.findById(userId)
        if (!user) return res.status(400).json({ msg: "User Not Found" })
        await User.findByIdAndUpdate(userId, { password: await bcrypt.hash(password, 10) }).then((val,err) => {
            if(err) return res.status(500).json({msg:err.message})
            res.sendStatus(200)
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const getUserInfo = async (req,res) => {
    const userId = req.user.id
    try {
        const userInfo = await User.findById(userId)
        res.status(200).json(userInfo)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.msg })
    }
}

const changePassword = async (req, res) => { 
    const userId = req.user.id
    const { oldPassword, newPassword, newConfirmPassword } = req.body
    if (!oldPassword || !newPassword || !newConfirmPassword) return res.status(400).json({ msg: "All Fields Required" })
    try {
        const user = await User.findById(userId)
        if (!user) return res.status(400).json({ msg: "User Not Found" })
        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) return res.status(400).json({ msg: "Old Password Incorrect" })
        if (newPassword !== newConfirmPassword) return res.status(400).json({ msg: "Passwords Must Be Equals " })
        await User.findByIdAndUpdate(userId, { password: await bcrypt.hash(newPassword, 10) }).then((val, err) => {
            if (err) return res.status(500).json({ msg: err.message })
            res.sendStatus(200)
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error.message })
    }
}

const changeUserInfo = async (req, res) => {
    const { username } = req.query
    if (!username) return res.status(400).json({ msg: "All Fields Required" })
    const userId = req.user.id
    await User.findByIdAndUpdate(userId, { username }).then((userInfo,err) => {
        if (err) return res.status(err).json({ msg: err.message })
        res.status(200).json(userInfo)
    })
}

module.exports = { Register, Login, ForgetPassword, VerifyOTP, updatePassword, getUserInfo, changePassword, changeUserInfo }