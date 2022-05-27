const {
    describe,
    it
}            = require('mocha');
const { ProductsCommand } = require('../../src/commands/products');
const expect = require('chai').expect;

const productsRepositoryMock = {
    read(key){
        console.log(`requested key ${key}`);
        return {
            name: "Doubloon",
            description: "Doubloon is the Arbitrum native governance token for Galleon",
            dapp_url: "https://app.galleon.community/dbl",
            icon: "dbl.png" 
        }
    },
    readAll(){
        return {
            dbl: {
                "name": "Doubloon",
                "description": "Doubloon is the Arbitrum native governance token for Galleon",
                "dapp_url": "https://app.galleon.community/dbl",
                "icon": "dbl.png" 
            },
            ethmaxy: {
                "name": "ETHMAXY",
                "description": "ETHMAXY is the best leveraged $ETH liquid staking strategy in DeFi today, all within one tradable ERC20 token.",
                "dapp_url": "https://app.galleon.community/ethmaxy",
                "icon": "ethmaxy.png" 
            }
        }
    }
}

describe("Products Command", function() {
    describe("execute()", function(){
        it("interaction has string Option -- Returns specific Product",
         async function(){
            var outputs = {};

            const expectedRequestedName = 'product';
            const expectedReply = "embed";
            const expectedEmbedRequest = productsRepositoryMock.read('dbl');

            const subject = new ProductsCommand(productsRepositoryMock);
            subject.getProductEmbed = function (product){
                outputs.requestedEmbed = product;
                return "embed";
            }

            const interaction = {
                options:{
                    getString(name){
                        outputs.requestedName = name;
                        return 'galleondapp';
                    }
                },
                reply(message){
                    outputs.reply = message;
                }
            };

            await subject.execute(interaction);
            
            expect(outputs.requestedName).equal(expectedRequestedName);
            expect(outputs.requestedEmbed).to.deep.equal(expectedEmbedRequest);
            expect(outputs.reply).equal(expectedReply);
        });
        it("interaction without string Option -- Returns all Products",
        async function(){
           var outputs = {};

           const expectedRequestedName = 'product';
           const expectedReply = "embed";
           const expectedEmbedRequest = productsRepositoryMock.readAll();

           const subject = new ProductsCommand(productsRepositoryMock);
           subject.getProductsEmbed = function (products){
               outputs.requestedEmbed = products;
               return "embed";
           }

           const interaction = {
               options:{
                   getString(name){
                       outputs.requestedName = name;
                       return undefined;
                   }
               },
               reply(message){
                   outputs.reply = message;
               }
           };

           await subject.execute(interaction);

           expect(outputs.requestedName).equal(expectedRequestedName);
           expect(outputs.requestedEmbed).to.deep.equal(expectedEmbedRequest);
           expect(outputs.reply).equal(expectedReply);
       })
    })
})