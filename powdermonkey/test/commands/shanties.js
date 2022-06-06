const {
    describe,
    it
}            = require('mocha');
const { ShantiesCommand } = require('../../src/commands/shanties');
const expect = require('chai').expect;

const shantiesRepositoryMock = {
    read(key){
        console.log(`requested key ${key}`);
        return {
            "name": "Wellerman",
            "artist": "The Longest Johns",
            "description": "A pirate classic, nothing makes you feel the ocean breeze in your hair like a whaling shanty",
            "icon": "crown.png",
            "links": {
                "Spotify": "https://open.spotify.com/track/6ZblDQM0Gq0daaPAwuHOmD",
                "Youtube": "https://www.youtube.com/watch?v=-FIf3fXPF6Q"
            }
        }
    },
    readAll(){
        return {
            "wellerman": {
                "name": "Wellerman",
                "artist": "The Longest Johns",
                "description": "A pirate classic, nothing makes you feel the ocean breeze in your hair like a whaling shanty",
                "icon": "crown.png",
                "links": {
                    "Spotify": "https://open.spotify.com/track/6ZblDQM0Gq0daaPAwuHOmD",
                    "Youtube": "https://www.youtube.com/watch?v=-FIf3fXPF6Q"
                }
            },
            "jolirouge": {
                "name": "Joli Rouge",
                "artist": "The Dreadnoughts",
                "description": "Something a bit more upbeat, slam your flagon's and chug 'til ye drop.",
                "icon": "crown.png",
                "links": {
                    "Spotify": "https://open.spotify.com/track/5tLHdDudxoCVAs89X6G5dL",
                    "Youtube": "https://www.youtube.com/watch?v=Yeh1S_kl8YI"
                }
            }
        }
    }
}

const embedBuilderMock = {
    outputs:{},

    createMediaEmbed(title, description, thumbnail, mediaEmbed, links){
        this.outputs['title'] = title;
        this.outputs['description'] = description;
        this.outputs['thumbnail'] = thumbnail;
        this.outputs['mediaEmbed'] = mediaEmbed;
        this.outputs['links'] = links;

        return {embeds: 'embed', content: 'content'};
    }
}


describe("Shanties Command", function() {
    describe("execute()", function(){
        it("interaction without string Option -- Returns a random shanty",
        async function(){
           var outputs = {};

           //Bypassing the random behaviour to focus on logic
           const expectedShanty = shantiesRepositoryMock.read('wellerman');
           const expectedEmbedOutputs = {
            title: `I've chosen ye ${expectedShanty.name} by ${expectedShanty.artist}`,
            description: expectedShanty.description,
            thumbnail: expectedShanty.icon,
            mediaEmbed: expectedShanty.links['Youtube'],
            links: expectedShanty.links
           };
           const expectedReply = {embeds: 'embed', content: 'content'};
           const expectedFollowUp = "content";

           const subject = new ShantiesCommand(shantiesRepositoryMock, embedBuilderMock);

           const interaction = {
               reply(message){
                   outputs.reply = message;
               },
               followUp(message){
                   outputs.followUp = message;
               }
           };

           await subject.execute(interaction);

           expect(embedBuilderMock.outputs).to.deep.equal(expectedEmbedOutputs);
           expect(outputs.reply).to.deep.equal(expectedReply);
           expect(outputs.followUp).equal(expectedFollowUp);
       })
    })
})