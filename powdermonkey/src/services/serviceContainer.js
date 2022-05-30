const { JsonRepository } = require('./jsonRepository');
const { EmbedBuilder } = require('../utils/embedBuilder');
const { LinksCommand } = require('../commands/links');
const { ProductsCommand } = require('../commands/products');
const { VoyagesCommand } = require('../commands/voyages');
const { ContributeCommand } = require('../commands/contribute');
const { ShantiesCommand } = require('../commands/shanties');
const { WhitelistCommand } = require('../commands/whitelist');
const { RoleplayCommand } = require('../commands/roleplay');

class ServiceContainer{
    #services = {};
    #commands = {};
    constructor(){
        this.#buildServiceContainer();
    }

    #buildServiceContainer(){
        this.#configureServices();
        this.#configureCommands();
    }

    #configureServices(){
        this.#services['linksRepository']      = new JsonRepository('../configuration/links.json');
        this.#services['productsRepository']   = new JsonRepository('../configuration/products.json');
        this.#services['voyagesRepository']    = new JsonRepository('../configuration/voyages.json');
        this.#services['contributeRepository'] = new JsonRepository('../configuration/contribute.json');
        this.#services['shantiesRepository']   = new JsonRepository('../configuration/shanties.json');
        this.#services['whitelistRepository']  = new JsonRepository('../configuration/whitelist.json');
        this.#services['glossaryRepository']   = new JsonRepository('../configuration/glossary.json');
        this.#services['embedBuilder']         = new EmbedBuilder();
    }

    #configureCommands(){
        try{
            this.#commands['links']      = new LinksCommand(this.#services['linksRepository'],this.#services['embedBuilder']);
            this.#commands['products']   = new ProductsCommand(this.#services['productsRepository'],this.#services['embedBuilder']);
            this.#commands['voyages']    = new VoyagesCommand(this.#services['voyagesRepository'],this.#services['embedBuilder']);
            this.#commands['contribute'] = new ContributeCommand(this.#services['contributeRepository'],this.#services['embedBuilder']);
            this.#commands['shanties']   = new ShantiesCommand(this.#services['shantiesRepository'],this.#services['embedBuilder']);
            this.#commands['whitelist']  = new WhitelistCommand(this.#services['whitelistRepository'],this.#services['embedBuilder']);
            this.#commands['roleplay']   = new RoleplayCommand(this.#services['glossaryRepository'],this.#services['embedBuilder']);
        }
        catch(err){
            console.error(err);
            throw new Error('Ensure all required services are configured before initialising commands')
        }
    }

    getService(serviceName){
        return this.#services[serviceName];    
    }

    getCommand(commandName){
        return this.#commands[commandName];
    }
    getCommandsList(){
        return Object.keys(this.#commands);
    }
}

module.exports = {
    ServiceContainer
}