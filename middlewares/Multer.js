const multer = require('multer')
const fs = require('fs')

module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (!fs.existsSync('public')) fs.mkdirSync('public')
            cb(null, 'public')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "__" + file.originalname)
        }
    })
})