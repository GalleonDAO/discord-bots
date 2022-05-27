const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const path = require('path');

class ProductsCommand {
    constructor(productsRepository){
        this.productsRepository = productsRepository;
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
        if(!productName){
            const products = this.productsRepository.readAll();
            await interaction.reply(this.getProductsEmbed(products));
        }
        else{
            const product = this.productsRepository.read(productName);
            await interaction.reply(this.getProductEmbed(product));
        }
    }

    getProductsEmbed(products){
        const embed = new MessageEmbed()
            .setTitle('Products');
        Object.keys(products).forEach(key =>
            embed.addField(products[key].name, products[key].description));

            return { embeds: [embed]};
    }

    getProductEmbed(product){
        const filePath = path.join('src/assets/logos/',product.icon);
        const file = new MessageAttachment(filePath);
        return{ 
            embeds: [new MessageEmbed()
            .setTitle(product.name)
            .setThumbnail(`attachment://${product.icon}`)
            .setDescription(product.description)
            .setURL(product.dapp_url)],
            files: [file]
        }

        //TODO: Get Current Price
    }
}

module.exports = {
    ProductsCommand
}