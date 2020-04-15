const fs = require("fs");

const path = require("path")

const pathToData = path.join(__dirname, "../images.json")

function loadData(){
    const buffer = fs.readFileSync(pathToData)
    const data = buffer.toString()
    return JSON.parse(data)
}

function saveData(data){
   fs.writeFileSync(pathToData, JSON.stringify(data))
}

module.exports = {loadData, saveData}