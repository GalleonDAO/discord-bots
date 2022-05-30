const { SlashCommandBuilder } = require('@discordjs/builders');
/**
 * @typedef {JsonRepository} = require('../services/jsonRepository');
 * @typedef {EmbedBuilder} = require('../utils/embedBuilder');
 */

class ShantiesCommand {
    /**
     * @param {JsonRepository} shantiesRepository data title Title of the embed
     * @param {EmbedBuilder} embedBuilder Description of the embed
     */
    constructor(shantiesRepository, embedBuilder) {
        this.shantiesRepository = shantiesRepository;
        this.embedBuilder = embedBuilder;
        this.data = this.getCommandBuilder();
        this.keys = this.#getKeys();
    }

    #getKeys(){
        const shanties = this.shantiesRepository.readAll();
        return Object.keys(shanties);
    }

    #getShanty(){
        const key = this.keys[Math.floor(Math.random() * this.keys.length)];
        return this.shantiesRepository.read(key);
    }

    getCommandBuilder(){
        return new SlashCommandBuilder()
            .setName('shanties')
            .setDescription('Hoist the colours and grab the rum, a shanty\'s what ye need!');
    }

    async execute(interaction){
        const shanty = this.#getShanty();
        if(!shanty)
            return await interaction.genericError('Missing Shanty Data');

        const embed = this.embedBuilder.createMediaEmbed(
            `I've chosen ye ${shanty.name} by ${shanty.artist}`,
            shanty.description,
            shanty.icon,
            shanty.links['Youtube'],
            shanty.links
        );

        await interaction.reply(embed);

        //discord won't render link embeds if the response also contains a message embed
        //this fires our embed and then follows up with a hidden character masking the link to the media embed
        await interaction.followUp(embed.content); 
    }
}

module.exports = {
    ShantiesCommand
}