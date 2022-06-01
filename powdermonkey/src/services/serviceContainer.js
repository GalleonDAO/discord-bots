const { JsonRepository } = require('./jsonRepository');
const { EmbedBuilder } = require('../utils/embedBuilder');
const { LinksCommand } = require('../commands/links');
const { ProductsCommand } = require('../commands/products');
const { VoyagesCommand } = require('../commands/voyages');
const { ContributeCommand } = require('../commands/contribute');
const { ShantiesCommand } = require('../commands/shanties');
const { WhitelistCommand } = require('../commands/whitelist');
const { RoleplayCommand } = require('../commands/roleplay');
const { LogWrapper } = require('../utils/logWrapper');
const dotenv = require('dotenv');

class ServiceContainer{
    #services = {};
    #commands = {};

    constructor(){
        this.#buildServiceContainer();
    }

    #buildServiceContainer(){
        dotenv.config(); //TODO: Moving this to a contained class would be more secure but it works for now
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
        this.#services['logger']               = new LogWrapper(process.env['MONITORING_API_KEY']);
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

    getConfigurationOption(optionName){
        return process.env[optionName];
    }

    getCommandsList(){
        return Object.keys(this.#commands);
    }
}

module.exports = {
    ServiceContainer
}