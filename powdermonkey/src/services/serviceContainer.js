const { JsonRepository } = require('./jsonRepository');

class ServiceContainer{
    constructor(){
        this.services = this.configureServices();
    }

    configureServices(){
        var services = {};

        services['linksRepository'] = new JsonRepository('../configuration/links.json');
        services['productsRepository'] = new JsonRepository('../configuration/products.json');

        return services;
    }

    getService(serviceName){
        return this.services[serviceName];    
    }
}

module.exports = {
    ServiceContainer
}