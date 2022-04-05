const express = require("express")
const app = express()
const mongoose = require("mongoose")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const userRouter = require("../api/routes/user.js")
const uploadRouter = require("../uploadImage/index.js")
const videoRouter = require("../api/routes/video.js")
const requestRouter = require("../api/routes/request.js")
const dotenv = require('dotenv')


dotenv.config()
// const dbUrl = "mongodb+srv://prathamesh:prathameshp@cluster0.e8fvx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
console.log("DB_URL",process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    () => console.log("MongoDB is connected. 🔥🔥🔥")
).catch(
    (error) => console.log(error)
)

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(morgan("dev"))

app.get("/", (req, res, next) => {
    res.json({ message: "This works on GET" })
    next()
})

app.use("/user",userRouter)
app.use("/upload",uploadRouter)
app.use("/video",videoRouter)
app.use("/request",requestRouter)

module.exports = app