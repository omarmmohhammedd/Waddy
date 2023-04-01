const jwt = require('jsonwebtoken');
module.exports= (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization
            jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (error, decoded) => {
                if (error) return res.status(error.status).json({ msg: error.message })
                if (!allowedRoles.includes(decoded.role)) return res.status(401).json({ msg: "This User Is Not Have Access To This Services" })
                req.user = decoded
                next()
            })
        } catch (error) {
            console.error(error)
            res.status(401).json({msg:"invalid Token"})
        }
    }
}
