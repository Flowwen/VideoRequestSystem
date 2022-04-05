const express = require("express")

const router = express.Router()

const { userSignup, userLogin, getAllUsers, getSingleUser, deleteSingleUser, updateSingleUser } = require("../controllers/user.js")

const authCheck = require("../middlewares/auth-check.js")


//create a user
router.post("/signup", userSignup)

router.post("/login", userLogin)

//get all user
router.get("/", authCheck, getAllUsers)

//get single user
router.get("/:userId", authCheck, getSingleUser)

//delete a single user
router.delete("/:userId", authCheck, deleteSingleUser)

//update a single user
router.put("/:userId", updateSingleUser)

module.exports = router