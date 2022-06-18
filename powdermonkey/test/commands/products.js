const {
    describe,
    it
}            = require('mocha');
const { ProductsCommand } = require('../../src/commands/products');
const { EmbedBuilderMock } = require('../embedBuilderMock');
const expect = require('chai').expect;

const productsRepositoryMock = {
    read(key){
        console.log(`requested key ${key}`);
        return {
            name: "Doubloon",
            description: "Doubloon is the Arbitrum native governance token for Galleon",
            icon: "dbl.png",
            actions: [
                {
                    "label": "Trade on Galleon",
                    "url": "https://app.galleon.community/dbl"
                },
                {
                    "label": "View on Coingecko",
                    "url": "https://www.coingecko.com/en/coins/doubloon"
                },
                {
                    "label": "Stake on Token Terminal",
                    "url": "https://app.xtokenterminal.io/mining/pools/arbitrum/0x7CC778c9b8fB55Bb874D0EaEf0751ff465f80498"
                }
            ] 
        }
    },
    readAll(){
        return {
            dbl: {
                "name": "Doubloon",
                "description": "Doubloon is the Arbitrum native governance token for Galleon",
                "icon": "dbl.png",
                "actions": [
                    {
                        "label": "Trade on Galleon",
                        "url": "https://app.galleon.community/dbl"
                    },
                    {
                        "label": "View on Coingecko",
                        "url": "https://www.coingecko.com/en/coins/doubloon"
                    },
                    {
                        "label": "Stake on Token Terminal",
                        "url": "https://app.xtokenterminal.io/mining/pools/arbitrum/0x7CC778c9b8fB55Bb874D0EaEf0751ff465f80498"
                    }
                ] 
            },
            ethmaxy: {
                "name": "ETHMAXY",
                "description": "ETHMAXY is the best leveraged $ETH liquid staking strategy in DeFi today, all within one tradable ERC20 token.",
                "icon": "ethmaxy.png",
                "actions": [
                    {
                        "label": "Trade on Galleon",
                        "url": "https://app.galleon.community/ethmaxy"
                    },
                    {
                        "label": "View on Coingecko",
                        "url": "https://www.coingecko.com/en/coins/eth-max-yield-index"
                    },
                    {
                        "label": "View on TokenSets",
                        "url": "https://www.tokensets.com/portfolio/ethmaxy"
                    }
                ]
            }
        }
    }
}

describe("Products Command", function() {
    describe("execute()", function(){
        it("interaction has string Option -- Returns specific Product",
         async function(){
            var outputs = {};

            const expectedProduct = productsRepositoryMock.read('dbl');
            const expectedEmbedOutputs = {
                title: expectedProduct.name,
                description: expectedProduct.description,
                thumbnail: expectedProduct.icon,
                fields: {Price: '$100', Change: '5%'},
                actions: expectedProduct.actions
           };
            const expectedRequestedName = 'product';
            const expectedReply = "embed";
            const expectedRequestedToken = "doubloon";

            const embedBuilderMock = new EmbedBuilderMock();
            const priceServiceMock = {
                outputs: {},
                KNOWN_TOKENS: {
                    "dbl" : "doubloon"
                },
                async fetchCoingeckoData(tokenId){
                    this.outputs.requestedToken = tokenId;
                    return {price: 100,symbol: 'dbl',circSupply: 10000000,change: 5}
                }
            };
        

            const subject = new ProductsCommand(productsRepositoryMock, embedBuilderMock, priceServiceMock);

            const interaction = {
                getStringChoice(name){
                    outputs.requestedName = name;
                    return 'dbl';
                },
                reply(message){
                    outputs.reply = message;
                }
            };

            await subject.execute(interaction);
            
            expect(embedBuilderMock.outputs).to.deep.equal(expectedEmbedOutputs);
            expect(outputs.requestedName).equal(expectedRequestedName);
            expect(priceServiceMock.outputs.requestedToken).equal(expectedRequestedToken);
            expect(outputs.reply).equal(expectedReply);
        });
        it("interaction without string Option -- Returns all Products",
        async function(){
           var outputs = {};

           const expectedEmbedOutputs = {
            title: 'Products',
            description: 'Here are all Current Products',
            thumbnail: 'products.png',
            fields: productsRepositoryMock.readAll(),
            embed: "embed",
            note: "Try /products {service} for more information on a single product"
           };
           const expectedRequestedName = 'product';
           const expectedReply = {embeds:['embed','note']};
           const embedBuilderMock = new EmbedBuilderMock();

           const subject = new ProductsCommand(productsRepositoryMock, embedBuilderMock);

           const interaction = {
                getStringChoice(name){
                    outputs.requestedName = name;
                    return undefined;
                },
               reply(message){
                   outputs.reply = message;
               }
           };

           await subject.execute(interaction);

           expect(embedBuilderMock.outputs).to.deep.equal(expectedEmbedOutputs);
           expect(outputs.requestedName).equal(expectedRequestedName);
           expect(outputs.reply).to.deep.equal(expectedReply);
       })
    });
    describe("getProductEmbed()", function(){
        it("price data available -- returns price data with embed",
        async function(){
            const expectedFields = {
                Price: "$100",
                Change: "5%"
            }

            const embedBuilderMock = new EmbedBuilderMock();
            const priceServiceMock = {
                outputs: {},
                KNOWN_TOKENS: {
                    "dbl" : "doubloon"
                },
                async fetchCoingeckoData(tokenId){
                    this.outputs.requestedToken = tokenId;
                    return {price: 100,symbol: 'dbl',circSupply: 10000000,change: 5}
                }
            };

            const subject = new ProductsCommand(productsRepositoryMock, embedBuilderMock, priceServiceMock);

            await subject.getProductEmbed('dbl',productsRepositoryMock.read('dbl'));

            expect(expectedFields).to.deep.equal(embedBuilderMock.outputs.fields);
        });
        it("price data not available -- returns unavailable with embed",
        async function(){
            const expectedFields = {
                Price: "unavailable",
                Change: "unavailable"
            }

            const embedBuilderMock = new EmbedBuilderMock();
            const priceServiceMock = {
                outputs: {},
                KNOWN_TOKENS: {
                    "dbl" : "doubloon"
                },
                async fetchCoingeckoData(tokenId){
                    this.outputs.requestedToken = tokenId;
                    return undefined
                }
            };

            const subject = new ProductsCommand(productsRepositoryMock, embedBuilderMock, priceServiceMock);

            await subject.getProductEmbed('dbl',productsRepositoryMock.read('dbl'));

            expect(expectedFields).to.deep.equal(embedBuilderMock.outputs.fields);
        });
    });
})