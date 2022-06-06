const { SlashCommandBuilder } = require('@discordjs/builders');
/**
 * @typedef {JsonRepository} = require('../services/jsonRepository');
 * @typedef {EmbedBuilder} = require('../utils/embedBuilder');
 */

class VoyagesCommand {
    /**
     * @param {JsonRepository} voyagesRepository data title Title of the embed
     * @param {EmbedBuilder} embedBuilder Description of the embed
     */
    constructor(voyagesRepository, embedBuilder) {
        this.voyagesRepository = voyagesRepository;
        this.embedBuilder = embedBuilder;
        this.data = this.getCommandBuilder();
    }

    getCommandBuilder(){
        const choices = this.voyagesRepository.readAll();
        const choicesArray = Object.keys(choices).map((key) => ({"name": choices[key].name,"value":key }));

        return new SlashCommandBuilder()
            .setName('voyages')
            .setDescription('Provides Information on Galleon Voyages')
            .addStringOption((option) => {
                option.setName('voyage')
                    .setDescription("The voyage you would like to know more about");
                choicesArray.forEach(element => {
                    option.addChoices(element);
                });
                return option;
            });
    }

    async execute(interaction){
        const voyageName = interaction.getStringChoice('voyage');
        var embed;

        if(!voyageName){
            const voyages = this.voyagesRepository.readAll();
            embed = this.embedBuilder.createMultiSubjectEmbed('Voyages', 'Here are all Current Voyages', 'voyages.png', voyages);
        }
        else{
            const voyage = this.voyagesRepository.read(voyageName);
            if(!voyage)
                return await interaction.choiceNotExistsError(voyageName);
                               
            embed = this.embedBuilder.createSingleSubjectEmbed(voyage.name, voyage.description, voyage.icon,voyage.url);
        }

        await interaction.reply(embed);
    }
}

module.exports = {
    VoyagesCommand
}