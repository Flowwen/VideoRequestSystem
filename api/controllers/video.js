const mongoose = require("mongoose")
const Video = require('../models/video.js')
const cloudinary = require("../../utils/cloudinary.js");
const user = require("../models/user.js");
const Request = require("../models/request.js");
const { insertMany } = require("../models/video.js");

const uploadNewVideo = async (req, res, next) => {
    try {
        console.log("inside cloudinary uplaod");
        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "video" })

        let video = new Video({
            _id: mongoose.Types.ObjectId(),
            videoName: req.body.videoName,
            videoDetails: result.secure_url,
            videoForDate: new Date(req.body.videoForDate),
            cloudinary_id: result.public_id,
            user: req.body.user,
            request: req.body.request
        })

        await video.save()
        res.status(200).json({
            message: `Video upload successfully`,
            video
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `There was an error while uploading`,
            error
        })
    }
}

const getAllVideos = (req, res, next) => {
    console.log("inside get all videos");
    Video.find()
        // .select("user request videoName videoDetails")
        // .populate("user", "firstName email", "request")
        .exec()
        .then((result) => {
            console.log(`List of all videos`);
            console.log(result);

            res.status(200).json({
                message: `Got all videos`,
                videos: result.map(video => {
                    return {
                        _id: video._id,
                        videoName: video.videoName,
                        videoDetails: video.videoDetails,
                        addedOn: video.addedOn,
                        videoForDate: video.videoForDate,
                        cloudinary_id: video.cloudinary_id,
                        user: video.user,
                        request: video.request
                    }
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: `There has been an error`,
                error: err
            })
        })
}

const getSingleVideo = (req, res, next) => {
    let { videoId } = req.params;
    console.log(videoId);
    Video.findById({
        _id: videoId
    })
        .populate("request", "requestForVideoDate status user")
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: `This is the result from getting a single video`,
                video: result
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: `There has been an error`,
                error
            })
        })
}
const deleteSingleVideo = async (req, res, next) => {
    try {
        let { videoId } = req.params;
        //Find video by id
        let video = await Video.findById({
            _id: videoId
        })

        //Delete video from cloudinary
        await cloudinary.uploader.destroy(video.cloudinary_id, { resource_type: "video" })

        //Delete video from db
        await video.remove()

        res.status(200).json({
            message: `Video Deleted Successfully`,
            video
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `There has been an error`,
            error
        })
    }
}
const updateSingleVideo = async (req, res, next) => {
    try {
        let { videoId } = req.params
        //Find video to update
        let video = await Video.findById({
            _id: videoId
        })

        console.log(video);

        let result;

        if (req.file) {
            //Delete current video from cloudinary
            await cloudinary.uploader.destroy(video.cloudinary_id, { resource_type: "video" })

            //upload the video that you want to update
            result = await cloudinary.uploader.upload(req.file.path, { resource_type: "video" })
        }

        console.log(result);

        //update video on db
        const data = {
            videoName: req.body.videoName || video.videoName,
            videoDetails: result.secure_url || video.videoDetails,
            cloudinary_id: result.public_id || video.cloudinary_id,
            addedOn: req.body.addedOn || video.addedOn,
            user: req.body.user || video.user,
            request: req.body.request || video.request
        }

        console.log(data);

        video = await Video.findByIdAndUpdate({ _id: videoId }, data, { new: true })

        console.log(video);

        res.status(200).json({
            message: `Video updated successfully`,
            result: video
        })

    } catch (error) {
        res.status(500).json({
            message: `There has been an error`,
            error
        })
    }
}

const videosByRequestStatus = async (req, res, next) => {

    try {

        console.log("inside video req by status");
    let { userId } = req.params;
    let finalRequestArray = [];
    let videos = [];

    finalRequestArray = await Request.find({ user: userId });

    console.log("Before request filter ========>");
    console.log(finalRequestArray);
    console.log("<==========Before request filter");

    finalRequestArray = finalRequestArray.filter(x => x.status == true).sort((a, b) => a.requestForVideoDate - b.requestForVideoDate);

    console.log("After request filter ========>");
    console.log(finalRequestArray);
    console.log("<==========After request filter");

    console.log(finalRequestArray.length);

        videos = await Video.find({ videoForDate: { $gte: finalRequestArray[0].requestForVideoDate, $lte: finalRequestArray[finalRequestArray.length - 1].requestForVideoDate } })


    console.log("Before videos filter =========>");
    console.log(videos);
    console.log("<=========Before videos filter");

    finalRequestArray = finalRequestArray.map(x => x._id.toString());
    console.log(finalRequestArray);
    //code to get the video
    let finalVideosArray = videos.filter(x => x.request.some(itr => finalRequestArray.includes(itr.toString())))

    console.log("AFter videos filter =========>");
    console.log(finalVideosArray);
    console.log("<=========After videos filter");

    res.status(200).json({
        message:`Videos to watch`,
        videos:finalVideosArray
    })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:`There has been an error`,
            error
        })
    }

    
}


module.exports = { uploadNewVideo, getAllVideos, getSingleVideo, deleteSingleVideo, updateSingleVideo, videosByRequestStatus }