module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var ImagesSchema = new mongoose.Schema({
        imageSrc     : {type: String, default: ''},
        product      : {type: String, default: ''},
        channel      : {type: ObjectId, ref: 'integrations', default: null},
        integrationId: {type: String, default: ''}
    }, {collection: 'Images'});

    mongoose.model('Images', ImagesSchema);
    mongoose.Schemas.Images = ImagesSchema;
})();
