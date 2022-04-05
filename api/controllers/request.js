const mongoose = require("mongoose")
const Request = require("../models/request.js")
const Video = require("../models/video.js")

// const requestForVideo = (req, res, next) => {
//     let request = new Request({
//         _id: mongoose.Types.ObjectId(),
//         requestName: req.body.requestName,
//         requestForVideoDate: req.body.requestForVideoDate,
//         user: req.body.user
//         // video:req.body.video       
//     })

//     Video.updateMany({videoForDate : request.requestForVideoDate },{$push:{request:request._id}})
//     .then(result => {
//         console.log(result);
//     })
//     request.save()
//     .then(result => {
//         console.log(result);
//         res.status(201).json({
//             message: `Request successfully sent.`,
//             result
//         })
//     })
//     .catch(error => {
//         console.log(error);
//         res.status(500).json({
//             message: `There has been an error`,
//             error
//         })
//     })

// }
const requestForVideo = async (req, res, next) => {

    try {

        let request = new Request({
            _id: mongoose.Types.ObjectId(),
            requestName: req.body.requestName,
            requestForVideoDate: req.body.requestForVideoDate,
            user: req.body.user
            // video:req.body.video       
        })

        let updatedVideo = await Video.updateMany({ videoForDate: request.requestForVideoDate }, { $push: { request: request._id } })

       let result = await request.save()
        console.log(result);

        res.status(201).json({
            message: `Request successfully sent.`,
            result,
            video: updatedVideo
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `There has been an error`,
            error
        })
    }

}

const getAllRequest = async (req, res, next) => {
    try {

        let result = await Request.find()

        res.status(200).json({
            message: `Got all request`,
            requests: result.map(request => {
                return {
                    id: request._id,
                    requestName: request.requestName,
                    requestForVideoDate: request.requestForVideoDate,
                    requestAddedon: request.requestAddedon,
                    status: request.status,
                    user: request.user
                }
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `There has been an error`,
            error
        })
    }
}


const deleteSingleRequest = async (req, res, next) => {
    try {
        console.log("inside delete single request");
        let { requestId } = req.params

        let request = await Request.findById({ _id: requestId })

        let updatedVideo = await Video.updateMany({ videoForDate: request.requestForVideoDate }, { $pull: { request: request._id } })

        console.log("calling delete on db");
        await request.remove()

        res.status(200).json({
            message: `Request deleted successfully`,
            request,
            updatedVideo
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `There has been an error`,
            error
        })
    }
}

const acceptOrRejectRequest = async (req, res, next) => {
    try {
        //Acquiring request Id
        let { requestId } = req.params

        //Acquiring status from Admin
        const data = {
            status: req.body.status
        }

        //Updating it in DB
        let request = await Request.findByIdAndUpdate({ _id: requestId }, data, { new: true })

        console.log(request);

        res.status(200).json({
            message: `Status of request updated.`,
            result: request
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `There has been an error`,
            error
        })
    }
}


module.exports = { requestForVideo, getAllRequest, deleteSingleRequest, acceptOrRejectRequest }