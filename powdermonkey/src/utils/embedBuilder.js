const {
  MessageAttachment,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const path = require("path");

const embedColour = "#040728";
const secondaryColour = "#025BEE";

/**
 * @typedef {Object} Embed
 * @property {string?} content
 * @property {MessageEmbed[]?} embeds
 * @property {MessageActionRow[]?} components
 * @property {MessageAttachment[]?} files
 * @property {boolean?} ephemeral
 */

class EmbedBuilder {
  /**
   * Adds a simple note to an existing embed
   * @param {Embed} embed
   * @param {string} note
   * @returns {Embed}
   */
  addNote(embed, note) {
    embed.embeds.push(
      new MessageEmbed().setTitle(note).setColor(secondaryColour)
    );
    return embed;
  }

  /**
   *
   * @param {string} title
   * @param {string} message
   * @param {string?} thumbnail
   * @param {boolean} isEphemeral
   * @returns {Embed}
   */
  createMessageEmbed(title, message, thumbnail, isEphemeral = true) {
    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(message)
      .setColor(secondaryColour);
    let file = null;

    if (thumbnail) {
      const filePath = path.join("src/assets/logos/", thumbnail);
      file = new MessageAttachment(filePath);

      embed.setThumbnail(`attachment://${thumbnail}`);
    }

    return {
      embeds: [embed],
      files: file ? [file] : null,
      ephemeral: isEphemeral,
    };
  }

  /**
   * @param {string} title Title of the embed
   * @param {string} description Description of the embed
   * @param {string} thumbnail filename of the thumbnail in the /assets/logos/ directory
   * @param {string} url Url of the parent page
   * @param {Object} fields optional fields to add
   * @returns {Embed}
   */
  createSingleSubjectEmbed(
    title,
    description,
    thumbnail,
    url,
    fields,
    inline = true
  ) {
    const filePath = path.join("src/assets/logos/", thumbnail);
    const file = new MessageAttachment(filePath);

    const actionRow = new MessageActionRow().addComponents(
      new MessageButton().setLabel("Link").setStyle("LINK").setURL(url)
    );
    const embed = new MessageEmbed()
      .setTitle(title)
      .setThumbnail(`attachment://${thumbnail}`)
      .setDescription(description)
      .setColor(embedColour)
      .setURL(url);
    if (fields) {
      Object.keys(fields).forEach((key) =>
        embed.addField(key, fields[key], inline)
      );
    }

    return {
      embeds: [embed],
      components: [actionRow],
      files: [file],
      ephemeral: true,
    };
  }

  /**
   *
   * @param {string} title
   * @param {string} description
   * @param {string} thumbnail
   * @param {Object} fields
   * @param {import('../commands/products').ActionProps[]} actions product price fetching service
   * @returns {Embed}
   */
  createMultiActionEmbed(title, description, thumbnail, fields, actions) {
    const filePath = path.join("src/assets/logos/", thumbnail);
    const file = new MessageAttachment(filePath);

    const actionRow = new MessageActionRow();
    actions.forEach((action) => {
      actionRow.addComponents(
        new MessageButton()
          .setLabel(action.label)
          .setStyle("LINK")
          .setURL(action.url)
      );
    });

    const embed = new MessageEmbed()
      .setTitle(title)
      .setThumbnail(`attachment://${thumbnail}`)
      .setDescription(description)
      .setColor(embedColour);
    if (fields) {
      Object.keys(fields).forEach((key) =>
        embed.addField(key, fields[key], true)
      );
    }

    return {
      embeds: [embed],
      components: [actionRow],
      files: [file],
      ephemeral: true,
    };
  }

  /**
   * @param {string} title Title of the embed
   * @param {string} description Description of the embed
   * @param {string} thumbnail filename of the thumbnail in the /assets/logos/ directory
   * @param {Object} fields Fields to be added
   * @returns {Embed}
   */
  createMultiSubjectEmbed(title, description, thumbnail, fields) {
    const filePath = path.join("src/assets/logos/", thumbnail);
    const file = new MessageAttachment(filePath);

    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setColor(embedColour)
      .setThumbnail(`attachment://${thumbnail}`);
    Object.keys(fields).forEach((key) =>
      embed.addField(fields[key].name, fields[key].description)
    );

    return {
      embeds: [embed],
      files: [file],
      ephemeral: true,
    };
  }

  /**
   * @param {string} title Title of the embed
   * @param {string} description Comments to add with the embed
   * @param {string} thumbnail filename of the thumbnail in the /assets/logos/ directory
   * @param {string} mediaEmbed escaped html string for an embedded media player
   * @param {Object} links Links to alternative sources
   * @returns {Embed}
   */
  createMediaEmbed(title, description, thumbnail, mediaEmbed, links) {
    const filePath = path.join("src/assets/logos/", thumbnail);
    const file = new MessageAttachment(filePath);

    var buttons = [];
    Object.keys(links).forEach((key) =>
      buttons.push(
        new MessageButton()
          .setLabel(`Listen on ${key}`)
          .setStyle("LINK")
          .setURL(links[key])
      )
    );

    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description.toString()) //safety net for unescaped characters
      .setColor(embedColour)
      .setThumbnail(`attachment://${thumbnail}`);

    const actionRow = new MessageActionRow().addComponents(buttons);

    return {
      content: "[\u200B](" + mediaEmbed + ")",
      components: [actionRow],
      embeds: [embed],
      files: [file],
      ephemeral: true,
    };
  }
}

module.exports = {
  EmbedBuilder,
};
