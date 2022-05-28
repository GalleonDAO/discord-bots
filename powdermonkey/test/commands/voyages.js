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

describe("Voyages Command", function() {
    describe("execute()", function(){
        it("interaction has string Option -- Returns specific Voyage",
         async function(){
            var outputs = {};

            const expectedRequestedName = 'voyage';
            const expectedReply = "embed";
            const expectedEmbedRequest = voyagesRepositoryMock.read('fdc');

            const subject = new VoyagesCommand(voyagesRepositoryMock);
            subject.getVoyageEmbed = function (voyage){
                outputs.requestedEmbed = voyage;
                return "embed";
            }

            const interaction = {
                options:{
                    getString(name){
                        outputs.requestedName = name;
                        return 'fdc';
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
        it("interaction without string Option -- Returns all voyages",
        async function(){
           var outputs = {};

           const expectedRequestedName = 'voyage';
           const expectedReply = "embed";
           const expectedEmbedRequest = voyagesRepositoryMock.readAll();

           const subject = new VoyagesCommand(voyagesRepositoryMock);
           subject.getVoyagesEmbed = function (voyages){
               outputs.requestedEmbed = voyages;
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