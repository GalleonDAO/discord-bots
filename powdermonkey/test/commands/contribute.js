const {
    describe,
    it
}            = require('mocha');
const { ContributeCommand } = require('../../src/commands/contribute');
const expect = require('chai').expect;

const contributeRepositoryMock = {
    read(key){
        console.log(`requested key ${key}`);
        throw new Error('Not Implemented');
    },
    readAll(){
        return {
            "embed": {
                "name": "Contribute to Galleon!",
                "description": "We welcome all contributors aboard the deck, We'll build a better vessel together.",
                "url": "https://www.notion.so/galleon/Contributors-1ea47926167344f08dffd8b30b4efc16",
                "icon": "contribute.png"
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


describe("Contribute Command", function() {
    describe("execute()", function(){
        it("interaction without string Option -- Returns contribute page",
        async function(){
           var outputs = {};

           const contributeConfig = contributeRepositoryMock.readAll()['embed'];
           const expectedEmbedOutputs = {
            title: contributeConfig.name,
            description: contributeConfig.description,
            thumbnail: contributeConfig.icon,
            url: contributeConfig.url
           };
           const expectedReply = "embed";

           const subject = new ContributeCommand(contributeRepositoryMock, embedBuilderMock);

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