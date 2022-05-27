const linksData = require('../configuration/links.json');

function read(key){
    return linksData[key];
}

function readAll(){
    return linksData;
}

module.exports = {
    read,
    readAll
}