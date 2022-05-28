const { SlashCommandBuilder } = require('@discordjs/builders');
/**
 * @typedef {JsonRepository} = require('../services/jsonRepository');
 * @typedef {EmbedBuilder} = require('../utils/embedBuilder');
 */

class ContributeCommand {
    /**
     * @param {JsonRepository} contirbuteRepository data title Title of the embed
     * @param {EmbedBuilder} embedBuilder Description of the embed
     */
    constructor(contirbuteRepository, embedBuilder) {
        this.contirbuteRepository = contirbuteRepository;
        this.embedBuilder = embedBuilder;
        this.data = this.getCommandBuilder();
    }

    getCommandBuilder(){
        return new SlashCommandBuilder()
            .setName('contribute')
            .setDescription('Learn More about Contributing');
    }

    async execute(interaction){
        const contirbuteConfig = this.contirbuteRepository.readAll();
        const embed = this.embedBuilder.createSingleSubjectEmbed(
            contirbuteConfig.name,
            contirbuteConfig.description,
            contirbuteConfig.icon,
            contirbuteConfig.url);

        await interaction.reply(embed);
    }
}

module.exports = {
    ContributeCommand
}