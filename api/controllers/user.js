const User = require("../models/user.js")
const mongoose = require("mongoose");
const bycrptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSignup = (req, res, next) => {
    // users.push(req.body)
    //1. Before creating new user we need to check whether a user with same email exists.



    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            console.log("This is the user");
            console.log(user);
            console.log("User ends");

            //2. if User exists then we need to send a conflict
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email already exists"
                })
            } else {

                bycrptjs.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        //3. If we are inside this block, means user is not found and we need to create a new user
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            accessLevel: req.body.accessLevel
                        })

                        //4. This is executed on db 
                        user.save()
                            .then(result => {
                                //5. In this block we capture the success result
                                console.log("This is the result from saving the user");
                                console.log(result);
                                //6. constructing successful response.
                                res.status(201).json({
                                    message: "User succesfully created",
                                    user: result
                                })
                            })
                    }
                })
            }
        })
        .catch(err => {
            //7. If there is error in any part of execution, catch it here and create error response and send the error response.
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

const userLogin = (req, res, next) => {
    console.log("Inside login");
    User.find({
        email: req.body.email.toLowerCase()
    })
        .exec()
        .then((user) => {
            console.log("Inside then");
            if (user.length < 1) {
                console.log("Inside if");
                return res.status(401).json({
                    message: `Auth Failed.`
                })
            }
            
            bycrptjs.compare(req.body.password, user[0].password, (err, result) => {
                console.log("Inside comapre");
                if (err) {
                    return res.status(401).json({
                        message: `Auth failed.`
                    })
                }
                
                
                if (result) {
                    
                    console.log("Inside token's if");
                    const token = jwt.sign({
                        email: user[0].email,
                        accessLevel: user[0].accessLevel
                    },
                    "prathamesh",
                    {
                        expiresIn: "1h"
                    })
                    
                    console.log("Inside token's end");
                    return res.status(200).json({
                        message: `Auth successful`,
                        token
                    })
                }

            })
                // .catch(err => {
                //  return res.status(401).json({
                //         message: `Auth failed`,
                //         error: err
                //     })
                // })
        })
        .catch(err => {
            console.log(err);
          return res.status(500).json({
                message: `There has been an error`,
                error:err
            })
        })
    }
    
    const getAllUsers = (req, res, next) => {
    if (req.userData.accessLevel !== 'admin')
        return res.status(401).json({
            message: `User not authorized.`
        })
    User.find()
    .exec()
    .then((users) => {
        
            const responseObject = {
                count: users.length,
                message: `Got all users`,
                users: users.map(user => {
                    return {
                        user,
                        request: {
                            type: "GET",
                            url: `http://localhost:5005/user/${user._id}`
                        }
                    }
                })
            }
            res.status(200).json(responseObject)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                message: `There has been an error`,
                error: err
            })
        });
}

const getSingleUser = (req, res, next) => {

    if (req.userData.accessLevel != "admin")
        return res.status(401).json({
            message: `User not authorized.`
        })

    let { userId } = req.params

    User.find({
        _id: userId
    })
        .exec()
        .then((user) => {
            console.log(user);
            res.status(200).json({
                message: "The API ran successfully",
                user
            })
        })
        .catch(error => {
            res.status(500).json({
                message: "There has been an error",
                error
            })
        })
}

const deleteSingleUser = (req, res, next) => {


    if (req.userData.accessLevel != "admin")
        return res.status(401).json({
            message: `User not authorized.`
        })

    let { userId } = req.params

    User.remove({
        _id: userId
    })
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                message: `User sucessfully removed`
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: `There has been an error`,
                error
            })
        })
}

const updateSingleUser = (req, res, next) => {
    let { userId } = req.params
    const updateOps = {}

    //Object.entries return a array of Key,value pair where we are desctructring and asiging to our declared "updateOps" object.
    for (const [key, value] of Object.entries(req.body))
        updateOps[key] = value

    User.update({ _id: userId }, { $set: updateOps })
        .exec()
        .then((successResult) => {
            res.status(200).json({
                message: `User sucessfully updated`
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: `There has been an error`,
                error
            })
        })

}


module.exports = {
    userSignup,
    userLogin,
    getAllUsers,
    getSingleUser,
    deleteSingleUser,
    updateSingleUser
}