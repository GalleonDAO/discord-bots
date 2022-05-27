const {
    describe,
    it
}            = require('mocha');
const { LinksCommand } = require('../../src/commands/links');
const expect = require('chai').expect;

const linksRepositoryMock = {
    read(key){
        console.log(`requested key ${key}`);
        return {
            name: "Galleon Dapp",
            value: "https://app.galleon.community/"
        }
    },
    readAll(){
        return {
            galleoncommunity: {
                "name": "Galleon Community",
                "value": "https://galleon.community/"
            },
            galleondapp: {
                "name": "Galleon Dapp",
                "value": "https://app.galleon.community/"
            }
        }
    }
}

describe("Links Command", function() {
    describe("execute()", function(){
        it("interaction has string Option -- Returns specific link",
         async function(){
            var outputs = {};

            const expectedRequestedName = 'service';
            const expectedReply = "embed";
            const expectedEmbedRequest = linksRepositoryMock.read('galleondapp');

            const subject = new LinksCommand(linksRepositoryMock);
            subject.getLinkEmbed = function (link){
                outputs.requestedEmbed = link;
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
        it("interaction without string Option -- Returns all links",
        async function(){
           var outputs = {};

           const expectedRequestedName = 'service';
           const expectedReply = "embed";
           const expectedEmbedRequest = linksRepositoryMock.readAll();

           const subject = new LinksCommand(linksRepositoryMock);
           subject.getLinksEmbed = function (links){
               outputs.requestedEmbed = links;
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