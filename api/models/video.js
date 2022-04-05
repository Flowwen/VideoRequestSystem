const mongoose = require('mongoose')
const videoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    videoName: { type: String, required: true },
    videoDetails: { type: String },
    videoForDate:{type:Date,required:true},
    addedOn: { type: String, required: true, default: new Date().getTime() },
    cloudinary_id: { type: String },
    // user: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    request: [{ type: mongoose.Schema.ObjectId, ref: "Request" }]
})

module.exports = mongoose.model("Video", videoSchema)