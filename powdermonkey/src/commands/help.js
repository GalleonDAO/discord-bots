const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const path = require('path');
/**
 * @typedef {JsonRepository} = require('../services/jsonRepository');
 * @typedef {EmbedBuilder} = require('../utils/embedBuilder');
 */

class HelpCommand{
    #helpEmbed;
    /**
     * @param {import('discord.js').Collection} commandsCollection commands to Describe
     */
    constructor(commandsCollection){
        this.#helpEmbed = this.getHelpEmbed(commandsCollection);
        this.data = this.getCommandBuilder();
    }

    getCommandBuilder(){
        return new SlashCommandBuilder()
            .setName('help')
            .setDescription('How to use the commands');
    }
    getHelpEmbed(commands){
        var commandSummary ={};
        commands.forEach(command => {
            commandSummary[command.data.name] = {
                name: command.data.name,
                description: command.data.description,
                options: command.data.options.length > 0? this.getOptionsSummary(command.data.options) : undefined
            }
        });

        const filePath = path.join('src/assets/logos/',"glossary.png");
        const file = new MessageAttachment(filePath);

        const embed = new MessageEmbed()
        .setTitle("Help")
        .setDescription("Here's how to use Powder Monkey")
        .setColor('#040728')
        .setThumbnail('attachment://glossary.png');
        Object.keys(commandSummary).forEach(key=>{
            embed.addField('/'+commandSummary[key].name, commandSummary[key].description, false);
            if(commandSummary[key].options){
                Object.keys(commandSummary[key].options).forEach(optionKey=>{
                    if(commandSummary[key].options[optionKey].isSubcommand){
                        if(commandSummary[key].options[optionKey].subcommandOptions) //True if option is a subcommand Group or subcommand with options
                        {
                            Object.keys(commandSummary[key].options[optionKey].subcommandOptions).forEach(subCommandOptKey =>{
                                if(commandSummary[key].options[optionKey].subcommandOptions[subCommandOptKey].isSubcommand){
                                    embed.addField(`/${commandSummary[key].name} ${commandSummary[key].options[optionKey].name} ${commandSummary[key].options[optionKey].subcommandOptions[subCommandOptKey].name}`,
                                    commandSummary[key].options[optionKey].subcommandOptions[subCommandOptKey].description, true);
                                }
                                else{
                                    embed.addField(`Option: {${commandSummary[key].options[optionKey].subcommandOptions[subCommandOptKey].name}}`,
                                    `${commandSummary[key].options[optionKey].subcommandOptions[subCommandOptKey].description}
                                    Required: ${commandSummary[key].options[optionKey].subcommandOptions[subCommandOptKey].required? 'Yes':'No'}`, true);
                                } 
                            })
                        }
                    }
                    else{
                        embed.addField(`Option: {${commandSummary[key].options[optionKey].name}}`, `${commandSummary[key].options[optionKey].description}
                        Required: ${commandSummary[key].options[optionKey].required? 'Yes':'No'}`, true);
                    }
                });
            }
            embed.addField("\u200B","\u200B", false)// Generates an empty line for spacing
        });


        return {
            embeds: [embed],
            files: [file],
            ephemeral: true
        }
    }
    getOptionsSummary(options){
        var optionSummary = {};
        options.forEach(option =>{
            optionSummary[option.name] = {
                name: option.name,
                description: option.description,
                isSubcommand: (option.required == undefined),
                required: option.required   
            }
            if(optionSummary[option.name].isSubcommand){
                optionSummary[option.name].subcommandOptions = this.getOptionsSummary(option.options);
            }
        });
        return optionSummary;
    }

    async execute(interaction){
        await interaction.reply(this.#helpEmbed, "Help");
    }
}

module.exports = {
    HelpCommand
}