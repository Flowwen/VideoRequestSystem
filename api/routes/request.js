const express = require("express")
const router = express.Router()
const {requestForVideo,getAllRequest,deleteSingleRequest,acceptOrRejectRequest} = require("../controllers/request.js")
const authCheck = require("../middlewares/auth-check.js")


router.post("/",authCheck,requestForVideo)

router.get("/",authCheck,getAllRequest)

router.delete("/:requestId",authCheck,deleteSingleRequest)

router.patch("/:requestId",authCheck,acceptOrRejectRequest)

module.exports = router