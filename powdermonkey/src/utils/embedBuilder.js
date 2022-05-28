const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton, MessageActionRowComponentResolvable } = require('discord.js');
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
     * @param {Object} fields Fields to be added
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

    /**
     * @param {string} title Title of the embed
     * @param {string} description Comments to add with the embed
     * @param {string} thumbnail filename of the thumbnail in the /assets/logos/ directory
     * @param {string} mediaEmbed escaped html string for an embedded media player
     * @param {Object} links Links to alternative sources
     */
    createMediaEmbed(title, description, thumbnail, mediaEmbed, links){
        const filePath = path.join('src/assets/logos/',thumbnail);
        const file = new MessageAttachment(filePath);

        var buttons = [];
        Object.keys(links).forEach(key =>
            buttons.push( new MessageButton()
                .setLabel(`Listen on ${key}`)
                .setStyle('LINK')
                .setURL(links[key]))
        );
        
        const embed = new MessageEmbed()
                .setTitle(title)
                .setDescription(description.toString()) //safety net for unescaped characters
                .setThumbnail(`attachment://${thumbnail}`); 

        const actionRow = new MessageActionRow()
                .addComponents(buttons);

        return {
            content: "[\u200B](" + mediaEmbed + ")",
            components: [actionRow],
            embeds: [embed],
            files: [file]
        };
    }
}

module.exports = {
    EmbedBuilder
}