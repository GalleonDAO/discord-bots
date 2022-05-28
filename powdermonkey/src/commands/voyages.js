const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const path = require('path');

class VoyagesCommand {
    constructor(voyagesRepository){
        this.voyagesRepository = voyagesRepository;
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
        const voyageName = interaction.options.getString('voyage');
        if(!voyageName){
            const voyages = this.voyagesRepository.readAll();
            await interaction.reply(this.getVoyagesEmbed(voyages));
        }
        else{
            const voyage = this.voyagesRepository.read(voyageName);
            await interaction.reply(this.getVoyageEmbed(voyage));
        }
    }

    getVoyagesEmbed(voyages){
        const embed = new MessageEmbed()
            .setTitle('Voyages');
        Object.keys(voyages).forEach(key =>
            embed.addField(voyages[key].name, voyages[key].description));

            return { embeds: [embed]};
    }

    getVoyageEmbed(voyage){
        const filePath = path.join('src/assets/logos/',voyage.icon);
        const file = new MessageAttachment(filePath);
        return{ 
            embeds: [new MessageEmbed()
            .setTitle(voyage.name)
            .setThumbnail(`attachment://${voyage.icon}`)
            .setDescription(voyage.description)
            .setURL(voyage.dapp_url)],
            files: [file]
        }
    }
}

module.exports = {
    VoyagesCommand
}