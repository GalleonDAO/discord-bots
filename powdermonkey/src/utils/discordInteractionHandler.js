const { LOG_SEVERITY } = require("../services/azureLoggingService");
const { ServiceContainer } = require("../services/serviceContainer");

/**
 * @type {import('./embedBuilder').EmbedBuilder}
 */
const embedBuilder = ServiceContainer.getInstance().getService("embedBuilder");
const emoji = "<a:dancing_crab:960471758954192907>";

/**
 * @typedef { Interaction, InteractionReplyOptions } = require("discord.js");
 */

/**
 * This Handler is used for global error handling and decoration of discord interactions
 * Making the interaction private prevents bypassing global acitons
 */
class DiscordInteractionHandler {
  #interaction;
  #logger;

  /**
   * This Handler is used for global error handling and decoration of discord interactions
   * Making the interaction private prevents bypassing global acitons
   * @param {import('discord.js').Interaction } interaction
   * @param {import('../utils/logWrapper.js').LogWrapper} logger
   */
  constructor(interaction, logger) {
    this.#interaction = interaction;
    this.#logger = logger;
  }

  /**
   * @param {import('discord.js').InteractionReplyOptions } message
   */
  async reply(message, commandName) {
    this.#interaction
      .reply(message)
      .then(() =>
        this.send(
          embedBuilder.createMessageEmbed(
            `Another sailor armed with the /${commandName} command!`,
            `${emoji} Time to fetch more powder ${emoji}.`,
            "monkey.png",
            false
          ),
          this.#interaction.channel
        )
      )
      .catch((err) => this.genericError(this.reply.name, err));
  }

  /**
   * @param {import('discord.js').InteractionReplyOptions } message
   */
  async followUp(message, parent) {
    try {
      if (parent) await parent.reply(message);
      else await this.#interaction.followUp(message);
    } catch (err) {
      await this.genericError(this.followUp.name, err);
    }
  }

  /**
   * @param {import('discord.js').InteractionReplyOptions } message
   */
  async send(message, channel) {
    try {
      await channel.send(message);
    } catch (err) {
      await this.genericError(this.followUp.name, err);
    }
  }

  /**
   * @returns {String} The name of the Subcommand Group
   */
  getSubcommandGroup() {
    return this.#interaction.options.getSubcommandGroup();
  }

  /**
   * @returns {String} The name of the subcommand
   */
  getSubcommand() {
    return this.#interaction.options.getSubcommand();
  }

  /**
   * @param {String} key The Name of the command option
   * @returns {?String} The value of the option if exists
   */
  getStringChoice(key) {
    return this.#interaction.options.getString(key);
  }

  /**
   * @param {Object} error
   */
  async genericError(functionName, error) {
    this.#logger.logMessage(
      LOG_SEVERITY.ERROR,
      functionName,
      error.stack,
      error.message
    );
    try {
      await this.#interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } catch {
      // If the interaction token has expired sending an error reply will cause a fatal error
      // No need to log this as the first catch will log error
    }
  }

  /**
   * @param {String} commandName
   */
  async commandNotExistsError(commandName) {
    this.#logger.logMessage(
      LOG_SEVERITY.WARN,
      commandName,
      "N/A",
      `ERROR: Requested command: ${commandName} does not exist`
    );
    try {
      await this.#interaction.reply({
        content: `The specified command '${commandName}' does not exist`,
        ephemeral: true,
      });
    } catch {
      // If the interaction token has expired sending an error reply will cause a fatal error
      // No need to log this as the first catch will log error
    }
  }

  /**
   * @param {String} choiceName
   */
  async choiceNotExistsError(commandName, choiceName) {
    this.#logger.logMessage(
      LOG_SEVERITY.WARN,
      commandName,
      "N/A",
      `ERROR: Requested choice: ${choiceName} does not exist for command: ${commandName}`
    );
    try {
      await this.#interaction.reply({
        content: `The specified choice '${choiceName}' does not exist`,
        ephemeral: true,
      });
    } catch {
      // If the interaction token has expired sending an error reply will cause a fatal error
      // No need to log this as the first catch will log error
    }
  }
}

module.exports = {
  DiscordInteractionHandler,
};
