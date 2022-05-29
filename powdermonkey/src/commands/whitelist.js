const { SlashCommandBuilder } = require('@discordjs/builders');
/**
 * @typedef {JsonRepository} = require('../services/jsonRepository');
 * @typedef {EmbedBuilder} = require('../utils/embedBuilder');
 */

class WhitelistCommand {
    /**
     * @param {JsonRepository} whitelistRepository data title Title of the embed
     * @param {EmbedBuilder} embedBuilder Description of the embed
     */
    constructor(whitelistRepository, embedBuilder) {
        this.whitelistRepository = whitelistRepository;
        this.embedBuilder = embedBuilder;
        this.data = this.getCommandBuilder();
    }

    getCommandBuilder(){
        return new SlashCommandBuilder()
            .setName('whitelist')
            .setDescription('Learn How to claim your spot on the Cursed Pirates Whitelist');
    }

    async execute(interaction){
        const whitelistConfig = this.whitelistRepository.readAll()['embed'];
        const embed = this.embedBuilder.createSingleSubjectEmbed(
            whitelistConfig.name,
            whitelistConfig.description,
            whitelistConfig.icon,
            whitelistConfig.url);

        await interaction.reply(embed);
    }
}

module.exports = {
    WhitelistCommand
}