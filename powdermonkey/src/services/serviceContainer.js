const { JsonRepository } = require('./jsonRepository');
const { EmbedBuilder } = require('../utils/embedBuilder');

class ServiceContainer{
    constructor(){
        this.services = this.#configureServices();
    }

    #configureServices(){
        var services = {};

        services['linksRepository'] = new JsonRepository('../configuration/links.json');
        services['productsRepository'] = new JsonRepository('../configuration/products.json');
        services['voyagesRepository'] = new JsonRepository('../configuration/voyages.json');
        services['contributeRepository'] = new JsonRepository('../configuration/contribute.json');
        services['shantiesRepository'] = new JsonRepository('../configuration/shanties.json');
        services['embedBuilder'] = new EmbedBuilder();

        return services;
    }

    getService(serviceName){
        return this.services[serviceName];    
    }
}

module.exports = {
    ServiceContainer
}