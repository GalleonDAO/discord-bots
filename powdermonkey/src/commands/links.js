const { SlashCommandBuilder } = require('@discordjs/builders');
/**
 * @typedef {JsonRepository} = require('../services/jsonRepository');
 * @typedef {EmbedBuilder} = require('../utils/embedBuilder');
 */

class LinksCommand{
    /**
     * @param {JsonRepository} linksRepository data title Title of the embed
     * @param {EmbedBuilder} embedBuilder Description of the embed
     */
    constructor(linksRepository, embedBuilder){
        this.linksRepository = linksRepository;
        this.embedBuilder = embedBuilder;
        this.data = this.getCommandBuilder();
    }

    getCommandBuilder(){
        const choices = this.linksRepository.readAll();
        const choicesArray = Object.keys(choices).map((key) => ({"name": choices[key].name,"value":key }));

        return new SlashCommandBuilder()
            .setName('links')
            .setDescription('Provides useful Links')
            .addStringOption((option) => {
                option.setName('service')
                    .setDescription("The Service You need a Link for");
                choicesArray.forEach(element => {
                    option.addChoices(element);
                });
                return option;
            });
            
    }

    async execute(interaction){
        const service = interaction.options.getString('service');
        var embed;

        if(!service){
            const links = this.linksRepository.readAll();
            embed = this.embedBuilder.createMultiSubjectEmbed('Links','Here are The links I Have', 'links.png',links);
        }
        else{
            const link = this.linksRepository.read(service);
            embed = this.embedBuilder.createSingleSubjectEmbed(link.name, link.description, link.icon, link.url);
        }
        await interaction.reply(embed);
    }
}

module.exports = {
    LinksCommand
}