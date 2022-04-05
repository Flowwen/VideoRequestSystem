 const uploadService = require("./upload.service")
const multer = require("multer")
// const file = require("./index")

const fs = require("fs")

var details

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync("./uploads") ){
            fs.mkdirSync("./uploads")
        }
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        //  buf.toString("./uploads") + path.extname(file.originalname);
      cb(null,Date.now()+file.originalname)
      details = file
    }
  })
  
  const upload = multer({ storage: storage })

const uploadImage = (req, res) => {
    console.log(details.originalname)
    console.log(details) 
    console.log("File received2")
    uploadService.uploads(details.originalname).then((url) => {
        details.url = url
        console.log("URL ===================>");
        console.log(details.url);
        console.log("<====================");
        console.log(details)
    }).catch(() => {
        res.send({message: "Unable to upload image"})
    })
}

module.exports = {
   
    upload,
    uploadImage
    }