class ServiceContainer{
    constructor(){
        this.services = this.configureServices();
    }

    configureServices(){
        var services = {};

        services['linksRepository'] = require('./linksRepository');
        services['productsRepository'] = require('./productsRepository');

        return services;
    }

    getService(serviceName){
        return this.services[serviceName];    
    }
}

module.exports = {
    ServiceContainer
}