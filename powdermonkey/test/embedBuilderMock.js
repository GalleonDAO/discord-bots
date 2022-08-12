class EmbedBuilderMock{
    outputs= {}
    createSingleSubjectEmbed(title, description, thumbnail, url, fields){
        this.outputs['title'] = title;
        this.outputs['description'] = description;
        this.outputs['thumbnail'] = thumbnail;
        this.outputs['url'] = url;
        if(fields)
            this.outputs['fields'] = fields;
        return 'embed';
    }
    createMultiSubjectEmbed(title, description, thumbnail, fields){
        this.outputs['title'] = title;
        this.outputs['description'] = description;
        this.outputs['thumbnail'] = thumbnail;
        this.outputs['fields'] = fields;

        return 'embed';
    }
    addNote(embed,note){
        this.outputs['embed'] = embed;
        this.outputs['note'] = note;

        return {embeds: ['embed', 'note']}
    }
    createMultiActionEmbed(title,description,thumbnail, fields, actions){
        this.outputs['title'] = title;
        this.outputs['description'] = description;
        this.outputs['thumbnail'] = thumbnail;
        this.outputs['actions'] = actions;
        if(fields)
            this.outputs['fields'] = fields;
        return 'embed';
    }

}

module.exports ={
    EmbedBuilderMock
}