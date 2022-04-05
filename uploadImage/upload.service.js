var cloudinary = require('cloudinary').v2
const path = require("path")

const uploads = (filename) => {

    return new Promise((resolve, reject) => {
        cloudinary.config({
            cloud_name: "dxsoktp2b",
            api_key: "923135667415732",
            api_secret: "Tjzvjdv-2s2gx2NJanLSJ-lRRfw"
        })
    
        console.log("Uploading...")
        // __dirname = "/home/flowwen/FyndFinalProject"
        console.log(__dirname + "/uploads/" + filename)
        var filepath = path.resolve(__dirname + "/../uploads/" + filename)
        cloudinary.uploader.upload(filepath, {
            resource_type: "video"
        }).then((data) => {
            console.log("Uploaded")
            resolve(data.secure_url)
        }).catch((err) => {
            console.log(err)
            reject()
        })
        
    }) 
}

module.exports = {
    uploads
}