const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {
    try {
        let headerToken = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(headerToken,"prathamesh")
        req.userData = decoded
        next();
    } catch (error) {
        return res.status(401).json({
            message: `Auth failed.`
        })
    }
}