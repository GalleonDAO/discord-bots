const { JsonRepository } = require("./jsonRepository");
const { EmbedBuilder } = require("../utils/embedBuilder");
const { LinksCommand } = require("../commands/links");
const { ProductsCommand } = require("../commands/products");
const { VoyagesCommand } = require("../commands/voyages");
const { ContributeCommand } = require("../commands/contribute");
const { ShantiesCommand } = require("../commands/shanties");
const { WhitelistCommand } = require("../commands/whitelist");
const { RoleplayCommand } = require("../commands/roleplay");
const { LogWrapper } = require("../utils/logWrapper");
const dotenv = require("dotenv");
const appsettings = require("../configuration/appsettings.json");
const { PriceService } = require("./PriceService");
const { HelpCommand } = require("../commands/help");

class ServiceContainer {
  #services = {};
  #commands = {};

  static #instance = new ServiceContainer(); //Lazy singleton

  static getInstance = () => {
    return this.#instance;
  };

  constructor() {
    this.#buildServiceContainer();
  }

  #buildServiceContainer() {
    dotenv.config(); //TODO: Moving this to a contained class would be more secure but it works for now
    this.#registerServices();
    this.#registerCommands();
  }

  #addLogging() {
    /**
     * @type {import('../utils/logWrapper').loggingOptions}
     */
    let loggingOptions = {
      azureLoggingOptions: appsettings.AZURE_LOGGING,
      fileLoggingOptions: appsettings.FILE_LOGGING,
      consoleLoggingOptions: appsettings.CONSOLE_LOGGING,
    };

    loggingOptions.azureLoggingOptions.API_KEY = process.env.MONITORING_API_KEY;
    this.#services["logger"] = new LogWrapper(loggingOptions);
  }

  #registerServices() {
    this.#addLogging();

    this.#services["linksRepository"] = new JsonRepository(
      "../configuration/links.json"
    );
    this.#services["productsRepository"] = new JsonRepository(
      "../configuration/products.json"
    );
    this.#services["voyagesRepository"] = new JsonRepository(
      "../configuration/voyages.json"
    );
    this.#services["contributeRepository"] = new JsonRepository(
      "../configuration/contribute.json"
    );
    this.#services["shantiesRepository"] = new JsonRepository(
      "../configuration/shanties.json"
    );
    this.#services["whitelistRepository"] = new JsonRepository(
      "../configuration/whitelist.json"
    );
    this.#services["glossaryRepository"] = new JsonRepository(
      "../configuration/glossary.json"
    );
    this.#services["embedBuilder"] = new EmbedBuilder();
    this.#services["priceService"] = new PriceService(this.#services["logger"]);
  }

  #registerCommands() {
    try {
      this.#commands["links"] = new LinksCommand(
        this.#services["linksRepository"],
        this.#services["embedBuilder"]
      );
      this.#commands["products"] = new ProductsCommand(
        this.#services["productsRepository"],
        this.#services["embedBuilder"],
        this.#services["priceService"]
      );
      this.#commands["voyages"] = new VoyagesCommand(
        this.#services["voyagesRepository"],
        this.#services["embedBuilder"]
      );
      this.#commands["contribute"] = new ContributeCommand(
        this.#services["contributeRepository"],
        this.#services["embedBuilder"]
      );
      this.#commands["shanties"] = new ShantiesCommand(
        this.#services["shantiesRepository"],
        this.#services["embedBuilder"]
      );
      this.#commands["whitelist"] = new WhitelistCommand(
        this.#services["whitelistRepository"],
        this.#services["embedBuilder"]
      );
      this.#commands["roleplay"] = new RoleplayCommand(
        this.#services["glossaryRepository"],
        this.#services["embedBuilder"]
      );
    } catch (err) {
      console.error(err);
      throw new Error(
        "Ensure all required services are configured before initialising commands"
      );
    }
  }

  /**
   * Adds A help command to the service collection
   * @param {import('discord.js').Collection} commandsCollection commands to Describe
   */
  configureHelpCommand(commandsCollection) {
    this.#commands["help"] = new HelpCommand(commandsCollection);
    commandsCollection.set(
      this.#commands["help"].data.name,
      this.#commands["help"]
    );
    return commandsCollection;
  }

  getService(serviceName) {
    return this.#services[serviceName];
  }

  getCommand(commandName) {
    return this.#commands[commandName];
  }

  getConfigurationOption(optionName) {
    return process.env[optionName];
  }

  getCommandsList() {
    return Object.keys(this.#commands);
  }
}

module.exports = {
  ServiceContainer,
};
