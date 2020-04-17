const fs = require("fs");

const path = require("path")

const pathToData = path.join(__dirname, "../memes.json")

function loadMeme(){
    const buffer = fs.readFileSync(pathToData)
    const data = buffer.toString()
    return JSON.parse(data)
}

function saveMeme(data){
   fs.writeFileSync(pathToData, JSON.stringify(data))
}

module.exports = {loadMeme, saveMeme}