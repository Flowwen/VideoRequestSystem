const checkAdmin = (req,res,next) => {
    try {
        if(req.userData == "admin")
            next();
        else
            res.status(401).json({
                message:`User is not authorized`
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:`Some error has occured`,
            error
        })
    }
}

module.exports = checkAdmin