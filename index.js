const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require("dotenv").config()
const PORT = process.env.PORT || 8080
const verifyToken = require("./middlewares/verifyToken")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use("/auth", require("./routes/auth"))

app.use("/client",verifyToken,require("./routes/client"))
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })
}).catch(err => {
    console.error(err)
})
