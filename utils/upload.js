const multer = require('multer')

const path = require("path")

const pathToUpload = path.join(__dirname, "../public/uploads") // define the file to save 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, pathToUpload) // if 1st arg is null, it will call next arg 
    },
    filename: function (req, file, cb) {
    //   cb(null, file.fieldname + '-' + Date.now())
    const allows = ["image/gif", "image/jpeg", "image/png", "image/jpg"]
    if(!allows.includes(file.mimetype)){
        const error = new Error("fileType is not allows ")
        cb(error, undefined)
    }

    
  
    cb(null, file.originalname) // file name
    // console.log(file)
    }
  })
   
  const upload = multer({ storage: storage }).single("fileUpload")

  module.exports = upload