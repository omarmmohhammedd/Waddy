const jwt = require("jsonwebtoken")

const verifyToken = async (req, res, nxt) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        nxt()
    } catch (err) {
        res.status(401).json({ message: "Invalid token" })
    }
}
module.exports = verifyToken