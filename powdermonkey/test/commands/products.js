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
            url: "https://app.galleon.community/dbl",
            icon: "dbl.png"
        }
    },
    readAll(){
        return {
            dbl: {
                "name": "Doubloon",
                "description": "Doubloon is the Arbitrum native governance token for Galleon",
                "url": "https://app.galleon.community/dbl",
                "icon": "dbl.png" 
            },
            ethmaxy: {
                "name": "ETHMAXY",
                "description": "ETHMAXY is the best leveraged $ETH liquid staking strategy in DeFi today, all within one tradable ERC20 token.",
                "url": "https://app.galleon.community/ethmaxy",
                "icon": "ethmaxy.png"
            }
        }
    }
}

const embedBuilderMock = {
    outputs:{},

    createSingleSubjectEmbed(title, description, thumbnail, url){
        this.outputs['title'] = title;
        this.outputs['description'] = description;
        this.outputs['thumbnail'] = thumbnail;
        this.outputs['url'] = url;

        return 'embed';
    },
    createMultiSubjectEmbed(title, description, thumbnail, fields){
        this.outputs['title'] = title;
        this.outputs['description'] = description;
        this.outputs['thumbnail'] = thumbnail;
        this.outputs['fields'] = fields;

        return 'embed';
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
                url: expectedProduct.url
           };
            const expectedRequestedName = 'product';
            const expectedReply = "embed";

            const subject = new ProductsCommand(productsRepositoryMock, embedBuilderMock);

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
            expect(outputs.reply).equal(expectedReply);
        });
        it("interaction without string Option -- Returns all Products",
        async function(){
           var outputs = {};

           const expectedEmbedOutputs = {
            title: 'Products',
            description: 'Here are all Current Products',
            thumbnail: 'products.png',
            fields: productsRepositoryMock.readAll()
           };
           const expectedRequestedName = 'product';
           const expectedReply = "embed";

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
           expect(outputs.reply).equal(expectedReply);
       })
    })
})