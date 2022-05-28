const { MessageAttachment, MessageEmbed } = require('discord.js');
const path = require('path');

class EmbedBuilder{
    /**
     * @param {string} title Title of the embed
     * @param {string} description Description of the embed
     * @param {string} thumbnail filename of the thumbnail in the /assets/logos/ directory
     * @param {string} url Url of the parent page
     * @param {Object} _options additional options for embed
     */
    createSingleSubjectEmbed(title, description, thumbnail, url, _options) {

        const filePath = path.join('src/assets/logos/',thumbnail);
        const file = new MessageAttachment(filePath);

        return{ 
            embeds: [new MessageEmbed()
            .setTitle(title)
            .setThumbnail(`attachment://${thumbnail}`)
            .setDescription(description)
            .setURL(url)],
            files: [file]
        }
    }

    /**
     * @param {string} title Title of the embed
     * @param {string} description Description of the embed
     * @param {string} thumbnail filename of the thumbnail in the /assets/logos/ directory
     * @param {string} url Url of the parent page
     * @param {Object} _options additional options for embed
     */
    createMultiSubjectEmbed(title, description, thumbnail, fields, _options){
        const filePath = path.join('src/assets/logos/',thumbnail);
        const file = new MessageAttachment(filePath);

        const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setThumbnail(`attachment://${thumbnail}`);
        Object.keys(fields).forEach(key =>
            embed.addField(fields[key].name, fields[key].description));

            return {
                embeds: [embed],
                files: [file]
            };
    }
}

module.exports = {
    EmbedBuilder
}