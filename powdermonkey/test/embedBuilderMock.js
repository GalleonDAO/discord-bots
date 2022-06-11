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
}

module.exports ={
    EmbedBuilderMock
}