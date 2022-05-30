const {
    describe,
    it
}            = require('mocha');
const { VoyagesCommand } = require('../../src/commands/voyages');
const expect = require('chai').expect;

const voyagesRepositoryMock = {
    read(key){
        console.log(`requested key ${key}`);
        return {
            name: "Flying Dutchman Capital",
            description: "Add me",
            url: "https://flyingdutchman.capital/",
            icon: "fdc.png"
        }
    },
    readAll(){
        return {
            fdc:{
                name: "Flying Dutchman Capital",
                description: "Add me",
                url: "https://flyingdutchman.capital/",
                icon: "fdc.png"
            },
            cursepirates:{
                name: "Cursed Pirates",
                description: "Add me",
                url: "https://cursedpirates.xyz/",
                icon: "pirates.png"
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


describe("Voyages Command", function() {
    describe("execute()", function(){
        it("interaction has string Option -- Returns specific Voyage",
         async function(){
            var outputs = {};

            const expectedProduct = voyagesRepositoryMock.read('fdc');
            const expectedEmbedOutputs = {
                title: expectedProduct.name,
                description: expectedProduct.description,
                thumbnail: expectedProduct.icon,
                url: expectedProduct.url
           };
            const expectedRequestedName = 'voyage';
            const expectedReply = "embed";

            const subject = new VoyagesCommand(voyagesRepositoryMock, embedBuilderMock);

            const interaction = {
                getStringChoice(name){
                    outputs.requestedName = name;
                    return 'fdc';
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
        it("interaction without string Option -- Returns all voyages",
        async function(){
           var outputs = {};

           const expectedEmbedOutputs = {
            title: 'Voyages',
            description: 'Here are all Current Voyages',
            thumbnail: 'voyages.png',
            fields: voyagesRepositoryMock.readAll()
           };
           const expectedRequestedName = 'voyage';
           const expectedReply = "embed";

           const subject = new VoyagesCommand(voyagesRepositoryMock, embedBuilderMock);

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