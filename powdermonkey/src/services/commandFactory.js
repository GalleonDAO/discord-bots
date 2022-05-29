const { LinksCommand } = require('../commands/links');
const { ProductsCommand } = require('../commands/products');
const { VoyagesCommand } = require('../commands/voyages');
const { ContributeCommand } = require('../commands/contribute');
const { ShantiesCommand } = require('../commands/shanties');
const { WhitelistCommand } = require('../commands/whitelist');
const { RoleplayCommand } = require('../commands/roleplay');
class CommandFactory{
    constructor(serviceContainer){
        this.serviceContainer = serviceContainer;
        this.embedBuilder = serviceContainer.getService('embedBuilder');
    }
    
    createCommand(name){
        switch(name){
            case 'links':
                return new LinksCommand(this.serviceContainer.getService('linksRepository'),this.embedBuilder);
            case 'products':
                return new ProductsCommand(this.serviceContainer.getService('productsRepository'),this.embedBuilder);
            case 'voyages':
                return new VoyagesCommand(this.serviceContainer.getService('voyagesRepository'),this.embedBuilder);
            case 'contribute':
                return new ContributeCommand(this.serviceContainer.getService('contributeRepository'),this.embedBuilder);
            case 'shanties':
                return new ShantiesCommand(this.serviceContainer.getService('shantiesRepository'),this.embedBuilder);
            case 'whitelist':
                return new WhitelistCommand(this.serviceContainer.getService('whitelistRepository'),this.embedBuilder);
            case 'roleplay':
                return new RoleplayCommand(this.serviceContainer.getService('glossaryRepository'),this.embedBuilder);
        }
    }
}

module.exports = {
    CommandFactory
}

