var express = require('express');
var router = express.Router();
const Jimp = require('jimp');
const upload = require('../utils/upload')
const { loadData, saveData } = require('../utils/data')
const { loadMeme, saveMeme } = require('../utils/dataMeme')
const path = require("path")
const pathToUpload = path.join(__dirname, "../public/uploads")
const pathToMemes = path.join(__dirname, "../public/memes")
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Memes' });
});
router.get("/browse", (req, res) => {
    const data = loadData()
    res.render("allImages", { images: data })
})

router.post("/upload", upload, async (req, res) => {
    //the upload midleware return data in req obj(req.file)
    // console.log(req.file)

    const { file } = req

    if (!file) {
        return res.render("index", { error: "you need upload the file" })
    }
    const data = loadData()
    const found = data.findIndex(item => item.originalname === file.originalname || item.size === file.size)

    if (found !== -1) {
        return res.render("index", { error: "file already exist" })
    }

    // if (data.some(item => item.originalname === file.originalname)) {
    //     return res.render("allImages", { error: "file already exist" })
    // }

    await Jimp.read(`${pathToUpload}/${file.originalname}`)
        .then(lenna => {
            return lenna
                .resize(256, 256, Jimp.RESIZE_NEAREST_NEIGHBOR) // resize
                .quality(60) // set JPEG quality
                .write(`${pathToUpload}/${file.originalname}`); // save
        })
        .catch(err => {
            console.error(err);
        });

    //push the file to our database
    file.id = data.length === 0 ? 1 : data[data.length - 1].id + 1
    data.push(file)
    saveData(data)
    res.render("allImages", { images: data })
})

router.get("/memes", async (req, res) => {
    const data = loadMeme()
    res.render("memes", { images: data })
})


router.post("/memes", async (req, res) => {
    const inputTop = req.body.texttopMeme
    const inputBot = req.body.textbotMeme
    const id = req.body.id * 1

    if (!inputBot && !inputTop) {
        res.render("index", { errorText: "You need add text for picture" })
    } else {

        const dataMeme = loadMeme()
        const data = loadData()
        let fileName = data.find(item => item.id === id).originalname
        let idMeme = dataMeme.length === 0 ? 1 : dataMeme[dataMeme.length - 1].id + 1
        let newFileName = idMeme + fileName
        try {
            const image = await Jimp.read(`${pathToUpload}/${fileName}`)
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
            image.print(font, 0, 0, {
                text: inputTop,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
            },
                256
            ) // print a message on an image. message can be a any type
            image.print(font, 0, 0, {
                text: inputBot,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
            },
                256,
                256
            ); // print a message on an image with text wrapped at maxWidth
            await image.writeAsync(`${pathToMemes}/${newFileName}`); // save
        } catch (e) {
            console.log(e)
        }
        let memeFile = { inputTop: inputTop, inputBot: inputBot, filename: newFileName }
        memeFile.id = idMeme
        dataMeme.push(memeFile)
        saveMeme(dataMeme)
        res.render("memes", { images: dataMeme })
    }
})



module.exports = router;
