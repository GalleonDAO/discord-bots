const {
    describe,
    it
}            = require('mocha');
const { RoleplayCommand } = require('../../src/commands/roleplay');
const { EmbedBuilderMock } = require('../embedBuilderMock');
const expect = require('chai').expect;

const glossaryRepositoryMock = {
    readAll(){
        return {
            "avast": {
                "name": "Avast Ye!",
                "description": "A hailing phrase to indicate that the hailed must stop and give attention."
            }
        }
    }
};
const embedBuilderMock = new EmbedBuilderMock();

describe("Roleplay Command", function() {
    describe("execute()", function(){
        it("interaction has glossary subcommandGroup -- calls glossary subcommand",
        async function(){
           var outputs = {};
           const subject = new RoleplayCommand(glossaryRepositoryMock, embedBuilderMock);
           subject.subcommands = [
               {
                    async execute(){
                        outputs.calledCommand = 'glossary';
                    }    
               }
           ]

           const interaction = {
               getSubcommandGroup(){
                   return 'glossary'
               }
           };

           await subject.execute(interaction);

           expect(outputs.calledCommand).equal('glossary');
       })
    })
})