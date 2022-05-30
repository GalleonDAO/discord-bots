/**
 * @typedef { Interaction, InteractionReplyOptions } = require("discord.js");
 */

/**
 * This Handler is used for global error handling and decoration of discord interactions
 * Making the interaction private prevents bypassing global acitons
 */
class DiscordInteractionHandler{
    /**
     * @type {Interaction}
     */
    #interaction;

    /**
     * This Handler is used for global error handling and decoration of discord interactions
     * Making the interaction private prevents bypassing global acitons
     * @param {Interaction} interaction Discord Interaction Object
     */
    constructor(interaction){
        this.#interaction = interaction;
    }

    /**
     * @param {InteractionReplyOptions} message 
     */
    async reply(message){
        try{
            await this.#interaction.reply(message);
        }
        catch(err){
            await this.genericError(err);
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
            await this.genericError(err);
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
     * @param {String} error 
     */
    async genericError(error){
        console.error(error);
        //TODO: swap this for logging implementation
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
        console.error(`ERROR: Requested command: ${commandName} does not exist`);
        //TODO: swap this for logging implementation
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
    async choiceNotExistsError(choiceName){
        console.error(`ERROR: Requested choice: ${choiceName} does not exist`);
        //TODO: swap this for logging implementation
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