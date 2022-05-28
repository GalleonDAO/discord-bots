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
            "name": "Galleon Dapp",
            "description": "Interact with Galleon Structured products Here",
            "url": "https://app.galleon.community/",
            "icon": "galleon.png"
        }
    },
    readAll(){
        return {
            galleoncommunity: {
                "name": "Galleon Community",
                "description": "The Central Page for all things Galleon",
                "url": "https://galleon.community/",
                "icon": "galleon.png"
            },
            galleondapp: {
                "name": "Galleon Dapp",
                "description": "Interact with Galleon Structured products Here",
                "url": "https://app.galleon.community/",
                "icon": "galleon.png"
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

describe("Links Command", function() {
    describe("execute()", function(){
        it("interaction has string Option -- Returns specific link",
         async function(){
            var outputs = {};

            const expectedLink = linksRepositoryMock.read('galleondapp');
            const expectedEmbedOutputs = {
                title: expectedLink.name,
                description: expectedLink.description,
                thumbnail: expectedLink.icon,
                url: expectedLink.url
           };
            const expectedRequestedName = 'service';
            const expectedReply = "embed";

            const subject = new LinksCommand(linksRepositoryMock, embedBuilderMock);

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
            
            expect(embedBuilderMock.outputs).to.deep.equal(expectedEmbedOutputs);
            expect(outputs.requestedName).equal(expectedRequestedName);
            expect(outputs.reply).equal(expectedReply);
        });
        it("interaction without string Option -- Returns all links",
        async function(){
           var outputs = {};
   
           const expectedEmbedOutputs = {
                title: 'Links',
                description: 'Here are The links I Have',
                thumbnail: 'links.png',
                fields: linksRepositoryMock.readAll()
           };
           const expectedRequestedName = 'service';
           const expectedReply = "embed";

           const subject = new LinksCommand(linksRepositoryMock, embedBuilderMock);

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
           expect(outputs.requestedName).equal(expectedRequestedName);
           expect(outputs.reply).equal(expectedReply);
       })
    })
})