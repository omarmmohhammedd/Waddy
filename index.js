const express = require('express')
const app = express()
const cors = require('cors')
const path  = require('path')
const mongoose = require('mongoose')
const morgan = require("morgan")
const server = require("http").createServer(app)
const io = require('socket.io')(server,{cors:{origin:"http://localhost:3000"}})
require("dotenv").config()
const PORT = process.env.PORT || 8080
const verifyRoles = require("./middlewares/verifyRoles")
const allowedRoles = require("./config/allowedRoles")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(morgan("common"))
// Routes For Authenticate
app.use("/auth", require("./routes/auth"))
// Routes For Clients
app.use("/client", verifyRoles(allowedRoles.client), require("./routes/client"))
// Routes For Delegate
app.use("/delegate", verifyRoles(allowedRoles.delegate),require("./routes/delegate"))
// Routes For SuperVisors
app.use("/supervisor", verifyRoles(allowedRoles.supervisor), require("./routes/supervisor"))
// Routes For Manager
app.use("/manager", verifyRoles(allowedRoles.manager), require("./routes/manager"))
// Setup Socket Server For Listening To Delegate Location 
io.on("connection", (socket) => {
    console.log("user Connected")
    socket.on("updateLocation",async (data) => {
        const Location = require("./models/Location")
        const deletgateLocation = await Location.findOne({ delegate: data.delegate })
        if (deletgateLocation) {
            await Location.findOneAndUpdate({ delegate: data.delegate }, { latitude: data.latitude, longitude: data.longitude })
            socket.emit("delegateLocation")
        } else {
            const location = new Location({
                delegate: data.delegate,
                latitude: data.latitude,
                longitude: data.longitude
            })
            await location.save()
        }
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected")
    })
})
// Setup MongoDB connection And Running The Server 
mongoose.set("strictPopulate")
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
        }).then(() => {
        server.listen(PORT, () => {
        console.log(`Server Running On Port ${PORT}`)
        })
        }).catch(err => {
        console.error(err)
        })