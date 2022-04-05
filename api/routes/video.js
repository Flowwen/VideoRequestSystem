const express = require('express')
const router = express.Router()
const cloudinary = require("../../utils/cloudinary.js")
const upload = require("../../utils/multer")
const user = require('../models/user.js')
const Video = require("../models/video.js")
const mongoose = require("mongoose")
const { uploadNewVideo, getAllVideos, getSingleVideo, deleteSingleVideo, updateSingleVideo,videosByRequestStatus } = require("../controllers/video.js")
const authCheck = require('../middlewares/auth-check.js')

// router.post("/", upload.single('video'), async (req, res) => {
//     try {
//         console.log("inside cloudinary uplaod");
//         const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "video" })

//         let video = new Video({
//             _id: mongoose.Types.ObjectId(),
//             videoName: req.body.videoName,
//             videoDetails: result.secure_url,
//             cloudinary_id: result.public_id,
//             user:req.body.user,
//             request:req.body.request
//         })

//         await video.save()
//         res.status(200).json({
//             message: `Video upload successfully`,
//             video
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: `There was an error while uploading`,
//             error
//         })
//     }
// })
// router.post("/", upload.single('video'), uploadNewVideo)
router.post("/",authCheck, upload.single('video'), uploadNewVideo)

router.get("/",authCheck, getAllVideos)

router.get("/:videoId",authCheck, getSingleVideo)

router.delete("/:videoId",authCheck, deleteSingleVideo)

router.patch("/:videoId",authCheck, upload.single('video'), updateSingleVideo)

router.post("/:userId",authCheck,videosByRequestStatus)

module.exports = router