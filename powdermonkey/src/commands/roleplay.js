const { SlashCommandBuilder } = require('@discordjs/builders');
const { GlossarySubCommand } = require('./subcommands/glossary');
/**
 * @typedef {JsonRepository} = require('../services/jsonRepository');
 * @typedef {EmbedBuilder} = require('../utils/embedBuilder');
 */

class RoleplayCommand {
    /**
     * @param {JsonRepository} glossaryRepository
     * @param {EmbedBuilder} embedBuilder
     */
    constructor(glossaryRepository, embedBuilder) {
        this.embedBuilder = embedBuilder;
        this.subcommands = [new GlossarySubCommand(glossaryRepository, embedBuilder)]
        this.data = this.getCommandBuilder();
    }

    getCommandBuilder(){
        var builder = new SlashCommandBuilder()
            .setName('roleplay')
            .setDescription('Learn How to be a True Swashbuckler');
        this.subcommands[0].addSubCommand(builder);
        return builder;
    }

    async execute(interaction){
        if(interaction.options.getSubcommandGroup() === 'glossary')
            await this.subcommands[0].execute(interaction);
    }
}

module.exports = {
    RoleplayCommand
}