const { SlashCommandBuilder } = require('@discordjs/builders');
/**
 * @typedef {JsonRepository} = require('../services/jsonRepository');
 * @typedef {EmbedBuilder} = require('../utils/embedBuilder');
 */

class ProductsCommand {
    /**
     * @param {JsonRepository} productsRepository data title Title of the embed
     * @param {EmbedBuilder} embedBuilder Description of the embed
     */
    constructor(productsRepository, embedBuilder) {
        this.productsRepository = productsRepository;
        this.embedBuilder = embedBuilder;
        this.data = this.getCommandBuilder();
    }

    getCommandBuilder(){
        const choices = this.productsRepository.readAll();
        const choicesArray = Object.keys(choices).map((key) => ({"name": choices[key].name,"value":key }));

        return new SlashCommandBuilder()
            .setName('products')
            .setDescription('Provides Information on Galleon Products')
            .addStringOption((option) => {
                option.setName('product')
                    .setDescription("The Product you would like to know more about");
                choicesArray.forEach(element => {
                    option.addChoices(element);
                });
                return option;
            });
    }

    async execute(interaction){
        const productName = interaction.options.getString('product');
        var embed;
        
        if(!productName){
            const products = this.productsRepository.readAll();
            embed = this.embedBuilder.createMultiSubjectEmbed('Products', 'Here are all Current Products', 'products.png',products);
        }
        else{
            const product = this.productsRepository.read(productName);
            embed = this.embedBuilder.createSingleSubjectEmbed(product.name, product.description, product.icon, product.url);
        }
        await interaction.reply(embed);
    }
}

module.exports = {
    ProductsCommand
}