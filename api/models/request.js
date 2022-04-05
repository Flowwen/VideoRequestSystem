const mongoose = require("mongoose")

const requestSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    requestName : {type:String,required:true},
    requestAddedon : { type: String, required: true, default: new Date().getTime() },
    requestForVideoDate : {type:Date,required:true},
    status : {type:Boolean,default:"no"},
    user: { type: mongoose.Schema.ObjectId,required:true ,ref: "User" }
    // video:[{type:mongoose.Schema.ObjectId,required:true,ref:"Video"}]
})

module.exports = mongoose.model("Request",requestSchema)