const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

class LinksCommand{
    constructor(linksRepository){
        this.linksRepository = linksRepository;
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
        if(!service){
            const links = this.linksRepository.readAll();
            await interaction.reply(this.getLinksEmbed(links));
        }
        else{
            const link = this.linksRepository.read(service);
            await interaction.reply(this.getLinkEmbed(link));
        }
    }

    getLinksEmbed(links){
        const embed = new MessageEmbed()
            .setTitle('Links');
        Object.keys(links).forEach(key =>
            embed.addField(links[key].name, links[key].value));

        return { embeds: [embed]};
    }

    getLinkEmbed(link){
        return {
            embeds: [new MessageEmbed()
                        .setTitle(link.name)
                        .setURL(link.value)]
        };
    }
}

module.exports = {
    LinksCommand
}