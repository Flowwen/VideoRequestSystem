const express = require("express")
const router = express.Router()
const uploadController = require("./upload.controller.js")
//const uploads = require("./upload.service")


router.post("/", uploadController.upload.single('video'),uploadController.uploadImage)


module.exports = router