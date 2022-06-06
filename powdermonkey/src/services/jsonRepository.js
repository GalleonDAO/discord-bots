class JsonRepository{
    constructor(dataSource){
        this.dataSource = require(dataSource);
    }

    read(key){
        return this.dataSource[key];
    }
    
    readAll(){
        return this.dataSource;
    }
}

module.exports = {
    JsonRepository
}