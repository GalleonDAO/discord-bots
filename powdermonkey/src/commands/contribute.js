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
        const contributeConfig = this.contirbuteRepository.readAll()['embed'];
        if(!contributeConfig)
            return await interaction.genericError('ERROR: Missing config for ContributeCommand');

        const embed = this.embedBuilder.createSingleSubjectEmbed(
            contributeConfig.name,
            contributeConfig.description,
            contributeConfig.icon,
            contributeConfig.url);

        await interaction.reply(embed,"contribute");
    }
}

module.exports = {
    ContributeCommand
}