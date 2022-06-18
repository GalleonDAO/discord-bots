const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 * @typedef {Object} Product
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {ActionProps[]} actions
 */

/**
 * @typedef {Object} ActionProps
 * @property {string} label
 * @property {string} url
 */

class ProductsCommand {
    /**
     * @param {import('../services/jsonRepository').JsonRepository} productsRepository data source
     * @param {import('../utils/embedBuilder').EmbedBuilder} embedBuilder discord embed builder
     * @param {import('../services/PriceService').PriceService} priceService product price fetching service
     */
    constructor(productsRepository, embedBuilder, priceService) {
        this.productsRepository = productsRepository;
        this.embedBuilder = embedBuilder;
        this.priceService = priceService;
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

    /**
     * 
     * @param {string} productName 
     * @param {Product} product 
     * @returns 
     */
    async getProductEmbed(productName, product){
        const priceData = await this.priceService.fetchCoingeckoData(this.priceService.KNOWN_TOKENS[productName]);
        return this.embedBuilder.createMultiActionEmbed(product.name,
            product.description, 
            product.icon, 
            { Price: `${priceData?.price? `$${priceData.price}`: 'unavailable'}`, Change: `${priceData?.change? `${priceData.change}%`: 'unavailable'}`},
            product.actions); 
    }

    /**
     * 
     * @param {import('../utils/discordInteractionHandler').DiscordInteractionHandler} interaction 
     * @returns 
     */
    async execute(interaction){
        const productName = interaction.getStringChoice('product');
        var embed;
        
        if(!productName){
            const products = this.productsRepository.readAll();
            embed = this.embedBuilder.createMultiSubjectEmbed('Products', 'Here are all Current Products', 'products.png',products);
            embed = this.embedBuilder.addNote(embed, "Try /products {service} for more information on a single product",);
        }
        else{
            const product = this.productsRepository.read(productName);
            if(!product)
                return await interaction.choiceNotExistsError(productName);

            embed = await this.getProductEmbed(productName,product);           
        }
        await interaction.reply(embed,"products");
    }
}

module.exports = {
    ProductsCommand
}