/**
 * @typedef { SlashCommandBuilder } = require('@discordjs/builders');
 * @typedef { JsonRepository } = require('../services/jsonRepository');
 * @typedef { EmbedBuilder } = require('../utils/embedBuilder');
 * @typedef { CommandInteractionOptionResolver } = require('@discordjs');
 */

class GlossarySubCommand {
    /**
     * @param {JsonRepository} glossaryRepository data title Title of the embed
     * @param {EmbedBuilder} embedBuilder Description of the embed
     */
    constructor(glossaryRepository, embedBuilder) {
        this.glossaryRepository = glossaryRepository;
        this.embedBuilder = embedBuilder;
        this.keys = this.#getKeys();
    }

    /**
     * @return {String[]} A collection of available keys
     */
    #getKeys(){
        const words = this.glossaryRepository.readAll();
        return Object.keys(words);
    }

    /**
     * @param {SlashCommandBuilder} commandBuilder discordjs command builder, this will be modified
     */
    addSubCommand(commandBuilder){
        commandBuilder
            .addSubcommandGroup(subcommandgroup =>
                subcommandgroup
                    .setName('glossary')
                    .setDescription('Learn How to Parlay like a Salty Seadog')
                    .addSubcommand(subcommand =>
                        subcommand
                            .setName('random')
                            .setDescription('Fetch yerself a random word'))
                    .addSubcommand(subcommand => 
                        subcommand
                            .setName('list')
                            .setDescription('Get a list of all terms')));
    }

    /**
     * @return {{Word: Translation}} A key value pair of word: translation
     */
    #getRandomWord(){
        const key = this.keys[Math.floor(Math.random() * this.keys.length)];
        return {word: key, value: this.glossaryRepository.read(key)};
    }

    /**
     * @return {{embeds: [Embed]}} A key value pair of embeds: [Discord Embed Object]
     */
    #getRandomEmbed(){
        const word = this.#getRandomWord();

        return this.embedBuilder.createSingleSubjectEmbed(
            word.word,
            word.value,
            'glossary.png',
            "https://www.thepirateking.com/terminology/terminology_rennfair_primer.htm");
    }

    /**
     * @return {{embeds: [Embed]}} A key value pair of embeds: [Discord Embed Object]
     */
    #getListEmbed(){
        return this.embedBuilder.createMultiSubjectEmbed(
            'Words',
            "Here's a list of terms I know",
            'glossary.png',
            this.glossaryRepository.readAll()
        );
    }

    async execute(interaction){
        var embed;
        switch(interaction.options.getSubcommand()){
            case 'random':
                embed = this.#getRandomEmbed();
                break;
            case 'list':
                embed = this.#getListEmbed();
                break;
        }

        await interaction.reply(embed);
    }
}

module.exports = {
    GlossarySubCommand
}