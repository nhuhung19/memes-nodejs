var express = require('express');
var router = express.Router();
const upload = require('../utils/upload')
const {loadData, saveData} = require('../utils/data')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/browse", (req, res) => {
  const data = loadData()
  res.render("allImages", {images: data})
})

router.post("/upload", upload, (req, res) => {
  //the upload midleware return data in req obj(req.file)
  console.log(req.file)

  if(!req.file){
    return res.render("allImages", {error: "you need upload the file"})
  }
  const data = loadData()

  if(data.some(item => item.originalname === req.file.originalname)){

    return res.render("allImages", {error: "file already exist"})

  }else{
    //push the file to our database
    data.push(req.file)
    saveData(data)
  }


  res.render("allImages", {images: data})
})
module.exports = router;
