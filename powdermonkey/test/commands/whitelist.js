const {
    describe,
    it
}            = require('mocha');
const { WhitelistCommand } = require('../../src/commands/whitelist');
const { EmbedBuilderMock } = require('../embedBuilderMock');
const expect = require('chai').expect;

const whitelistRepositoryMock = {
    read(key){
        console.log(`requested key ${key}`);
        throw new Error('Not Implemented');
    },
    readAll(){
        return {
            "embed": {
                "name": "Through Battle and Contest You can claim Yer spot about the Ship!",
                "description": "Join Rumbles and play games with the crew to compete for whitelist positions.",
                "url": "https://cursedpirates.xyz/",
                "icon": "monkey.png"
            }
        }
    }
}

describe("Whitelist Command", function() {
    describe("execute()", function(){
        it("interaction without string Option -- Returns whitelist page",
        async function(){
           var outputs = {};

           const whitelistConfig = whitelistRepositoryMock.readAll()['embed'];
           const expectedEmbedOutputs = {
            title: whitelistConfig.name,
            description: whitelistConfig.description,
            thumbnail: whitelistConfig.icon,
            url: whitelistConfig.url
           };
           const expectedReply = "embed";
           const embedBuilderMock = new EmbedBuilderMock();

           const subject = new WhitelistCommand(whitelistRepositoryMock, embedBuilderMock);

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

           expect(embedBuilderMock.outputs).to.deep.equal(expectedEmbedOutputs);
           expect(outputs.reply).equal(expectedReply);
       })
    })
})