const { LinksCommand } = require('../commands/links');
const { ProductsCommand } = require('../commands/products');
const { VoyagesCommand } = require('../commands/voyages');
class CommandFactory{
    constructor(serviceContainer){
        this.serviceContainer = serviceContainer;
    }
    
    createCommand(name){
        switch(name){
            case 'links':
                return new LinksCommand(this.serviceContainer.getService('linksRepository'));
            case 'products':
                return new ProductsCommand(this.serviceContainer.getService('productsRepository'));
            case 'voyages':
                return new VoyagesCommand(this.serviceContainer.getService('voyagesRepository'));
        }
    }
}

module.exports = {
    CommandFactory
}

