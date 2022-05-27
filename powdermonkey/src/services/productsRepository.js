const productsData = require('../configuration/products.json');

function read(key){
    return productsData[key];
}

function readAll(){
    return productsData;
}

module.exports = {
    read,
    readAll
}