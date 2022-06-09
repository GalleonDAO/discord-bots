const {
    describe,
    it
}            = require('mocha');
const { GlossarySubCommand } = require('../../src/commands/subcommands/glossary');
const { EmbedBuilderMock } = require('../embedBuilderMock');
const expect = require('chai').expect;

const glossaryRepositoryMock = {
    read(key){
        console.log(`requested key ${key}`);
        return {
            "name": "Avast Ye!",
            "description": "A hailing phrase to indicate that the hailed must stop and give attention."
          }
    },
    readAll(){
        return {
            "avast": {
                "name": "Avast Ye!",
                "description": "A hailing phrase to indicate that the hailed must stop and give attention."
              },
              "bilge": {
                "name": "Bilge",
                "description": "The lowest part inside the ship, within the hull itself. If any place on the ship was going to be dank and musty, the bilge was such a place. It was the first place to show signs of leakage and was often considered the most filthy, dead space of a ship. Hence, a \"bilge rat\" is a creature considered most lowly by a pirate. Though, many a pirate found himself eating those same rats to survive!"
              }
        }
    }
}

describe("Glossary SubCommand", function() {
    describe("execute()", function(){
        it("random subcommand -- Returns a random word",
        async function(){
            var outputs = {};

            //Bypassing the random behaviour to focus on logic
            const expectedWord = glossaryRepositoryMock.read('avast');
            const expectedEmbedOutputs = {
                    title: expectedWord.name,
                    description: expectedWord.description,
                    thumbnail: 'glossary.png',
                    url: "https://www.thepirateking.com/terminology/terminology_rennfair_primer.htm",
            };
            const expectedReply = 'embed';
            const embedBuilderMock = new EmbedBuilderMock();

            const subject = new GlossarySubCommand(glossaryRepositoryMock, embedBuilderMock);

            const interaction = {
                reply(message){
                    outputs.reply = message;
                },
                getSubcommand(){
                    return 'random';
                }
            };

            await subject.execute(interaction);

            expect(embedBuilderMock.outputs).to.deep.equal(expectedEmbedOutputs);
            expect(outputs.reply).to.deep.equal(expectedReply);
       }),

       it("list subcommand -- Returns a list of words",
       async function(){
           var outputs = {};

           //Bypassing the random behaviour to focus on logic
           const expectedEmbedOutputs = {
                   title: 'Words',
                   description: "Here's a list of terms I know",
                   thumbnail: 'glossary.png',
                   fields: glossaryRepositoryMock.readAll()
           };
           const expectedReply = 'embed';
           const embedBuilderMock = new EmbedBuilderMock();

           const subject = new GlossarySubCommand(glossaryRepositoryMock, embedBuilderMock);

           const interaction = {
               reply(message){
                   outputs.reply = message;
               },
               getSubcommand(){
                   return 'list';
               }
           };

           await subject.execute(interaction);

           expect(embedBuilderMock.outputs).to.deep.equal(expectedEmbedOutputs);
           expect(outputs.reply).to.deep.equal(expectedReply);
      })
    })
});