const { LOG_SEVERITY } = require("../services/azureLoggingService");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
// const emoji = "<a:dancing_crab:960471758954192907>";

const EMOJI_CODES = {
  CRAB: "<a:dancing_crab:960471758954192907>",
  GREEN_CHECK: "\u2705",
  NO_ENTRY: "\u26D4",
};

const BUTTON_STYLES = {
  SUCCESS: "SUCCESS",
  DANGER: "DANGER",
};

/**
 * @typedef { Interaction, InteractionReplyOptions } = require("discord.js");
 */

/**
 * This Handler is used for global error handling and decoration of discord interactions
 * Making the interaction private prevents bypassing global acitons
 */
class AdminInteractionHandler {
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

  #getIsPublicMessageEmbed() {
    const embed = new MessageEmbed().setTitle("Make this response Public?");
    const actionRow = new MessageActionRow().addComponents([
      new MessageButton()
        .setLabel("Public")
        .setCustomId("public")
        .setEmoji(EMOJI_CODES.GREEN_CHECK)
        .setStyle(BUTTON_STYLES.SUCCESS),
      new MessageButton()
        .setLabel("Private")
        .setCustomId("private")
        .setEmoji(EMOJI_CODES.NO_ENTRY)
        .setStyle(BUTTON_STYLES.DANGER),
    ]);

    return {
      embeds: [embed],
      components: [actionRow],
      ephemeral: true,
    };
  }

  /**
   * @param {import('discord.js').InteractionReplyOptions } message
   */
  async reply(message, commandName) {
    this.#interaction
      .reply(this.#getIsPublicMessageEmbed())
      .then(() => {
        const collector =
          this.#interaction.channel.createMessageComponentCollector({
            filter: (buttonClick) => {
              return (
                (buttonClick.customId === "public" &&
                  buttonClick.user.id === this.#interaction.user.id) ||
                (buttonClick.customId === "private" &&
                  buttonClick.user.id === this.#interaction.user.id)
              );
            },
            time: 5000,
            max: 1,
          });

        collector.on("collect", async (click) => {
          if (click.customId === "public") {
            click
              .update({
                content: "Making response public!",
                components: [],
                embeds: [],
              })
              .then(() => {
                message.ephemeral = false;

                this.followUp(message).then(() => {
                  this.followUp(
                    `This information came from the /${commandName} command\r\n${EMOJI_CODES.CRAB} Try /help to see what else I can do ${EMOJI_CODES.CRAB}`
                  );
                });
              });
          } else {
            click
              .update({
                content: "Making response private!",
                components: [],
                embeds: [],
              })
              .then(() => {
                this.followUp(message);
              });
          }
        });
      })
      .catch((err) => {
        this.genericError(this.reply.name, err);
      });
  }

  /**
   * @param {import('discord.js').InteractionReplyOptions } message
   */
  async followUp(message) {
    try {
      await this.#interaction.followUp(message);
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
  AdminInteractionHandler,
};
