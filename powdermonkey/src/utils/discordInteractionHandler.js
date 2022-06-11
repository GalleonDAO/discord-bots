const { LOG_SEVERITY } = require('../services/azureLoggingService');
/**
 * @typedef { Interaction, InteractionReplyOptions } = require("discord.js");
 */

/**
 * This Handler is used for global error handling and decoration of discord interactions
 * Making the interaction private prevents bypassing global acitons
 */
class DiscordInteractionHandler{
    #interaction;
    #logger;

    /**
     * This Handler is used for global error handling and decoration of discord interactions
     * Making the interaction private prevents bypassing global acitons
     * @param {import('discord.js').Interaction } interaction
     * @param {import('../utils/logWrapper.js').LogWrapper} logger
     */
    constructor(interaction, logger){
        this.#interaction = interaction;
        this.#logger = logger;
    }

    /**
     * @param {InteractionReplyOptions} message 
     */
    async reply(message, commandName){
        try{
            await this.#interaction.reply(message);
            await this.followUp(`Thanks for using the /${commandName} command!`);
        }
        catch(err){
            await this.genericError(this.reply.name, err);
        }
    }

    /**
     * @param {InteractionReplyOptions} message 
     */
    async followUp(message){
        try{
            await this.#interaction.followUp(message);
        }
        catch(err){
            await this.genericError(this.followUp.name, err);
        }
    }

    /**
     * @returns {String} The name of the Subcommand Group
     */
    getSubcommandGroup(){
        return this.#interaction.options.getSubcommandGroup();
    }

    /**
     * @returns {String} The name of the subcommand
     */
    getSubcommand(){
        return this.#interaction.options.getSubcommand();
    }

    /**
     * @param {String} key The Name of the command option 
     * @returns {?String} The value of the option if exists
     */
    getStringChoice(key){
        return this.#interaction.options.getString(key);
    }


    /**
     * @param {Object} error 
     */
    async genericError(functionName, error){
        this.#logger.logMessage(LOG_SEVERITY.ERROR, functionName, error.stack, error.message);
        try{
            await this.#interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
        catch{
            // If the interaction token has expired sending an error reply will cause a fatal error
            // No need to log this as the first catch will log error
        }
    }

    /**
     * @param {String} commandName 
     */
    async commandNotExistsError(commandName){
        this.#logger.logMessage(LOG_SEVERITY.WARN, commandName, 'N/A', `ERROR: Requested command: ${commandName} does not exist`);
        try{
            await this.#interaction.reply({ content: `The specified command '${commandName}' does not exist`, ephemeral: true })
        }
        catch{
            // If the interaction token has expired sending an error reply will cause a fatal error
            // No need to log this as the first catch will log error
        }
    }

    /**
     * @param {String} choiceName 
     */
    async choiceNotExistsError(commandName, choiceName){
        this.#logger.logMessage(LOG_SEVERITY.WARN, commandName, 'N/A', `ERROR: Requested choice: ${choiceName} does not exist for command: ${commandName}`);
        try{
            await this.#interaction.reply({ content: `The specified choice '${choiceName}' does not exist`, ephemeral: true })
        }
        catch{
            // If the interaction token has expired sending an error reply will cause a fatal error
            // No need to log this as the first catch will log error
        }
    }
}

module.exports = {
    DiscordInteractionHandler
}