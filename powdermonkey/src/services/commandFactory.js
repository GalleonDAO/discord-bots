const { LinksCommand } = require('../commands/links');
const { ProductsCommand } = require('../commands/products');
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
        }
    }
}

module.exports = {
    CommandFactory
}

