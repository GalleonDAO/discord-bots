const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const path = require('path');

class EmbedBuilder{

    /**
     * @param {string} title Title of the embed
     * @param {string} description Description of the embed
     * @param {string} thumbnail filename of the thumbnail in the /assets/logos/ directory
     * @param {string} url Url of the parent page
     */
    createSingleSubjectEmbed(title, description, thumbnail, url) {

        const filePath = path.join('src/assets/logos/',thumbnail);
        const file = new MessageAttachment(filePath);

        const actionRow = new MessageActionRow()
            .addComponents(new MessageButton()
                .setLabel('Link')
                .setStyle('LINK')
                .setURL(url));

        return{ 
            embeds: [new MessageEmbed()
            .setTitle(title)
            .setThumbnail(`attachment://${thumbnail}`)
            .setDescription(description)
            .setColor('#040728')
            .setURL(url)],
            components: [actionRow],
            files: [file],
            ephemeral: true
        }
    }

    /**
     * @param {string} title Title of the embed
     * @param {string} description Description of the embed
     * @param {string} thumbnail filename of the thumbnail in the /assets/logos/ directory
     * @param {Object} fields Fields to be added
     */
    createMultiSubjectEmbed(title, description, thumbnail, fields){
        const filePath = path.join('src/assets/logos/',thumbnail);
        const file = new MessageAttachment(filePath);

        const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor('#040728')
        .setThumbnail(`attachment://${thumbnail}`);
        Object.keys(fields).forEach(key =>
            embed.addField(fields[key].name, fields[key].description));

            return {
                embeds: [embed],
                files: [file],
                ephemeral: true
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
                .setColor('#040728')
                .setThumbnail(`attachment://${thumbnail}`); 

        const actionRow = new MessageActionRow()
                .addComponents(buttons);

        return {
            content: "[\u200B](" + mediaEmbed + ")",
            components: [actionRow],
            embeds: [embed],
            files: [file],
            ephemeral: true
        };
    }
}

module.exports = {
    EmbedBuilder
}