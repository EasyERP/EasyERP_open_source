module.exports = (function () {
    var mongoose = require('mongoose');
    var SourceSchema = mongoose.Schema({
        _id : String,
        name: String

    }, {collection: 'sources'});

    mongoose.model('sources', SourceSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.source = SourceSchema;
})();
