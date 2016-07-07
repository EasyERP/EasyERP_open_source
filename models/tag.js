module.exports = (function () {
    var mongoose = require('mongoose');

    var tagsSchema = mongoose.Schema({
        name : String,
        color: {type: String, default: '#4d5a75'},
        type : String
    }, {collection: 'tags'});

    mongoose.model('tags', tagsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Tags = tagsSchema;
})();













