module.exports = (function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;
    var LanguageSchema;

    LanguageSchema = Schema({
        name: {type: String, required: true}
    }, {collection: 'languages'});

    mongoose.model('languages', LanguageSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.language = LanguageSchema;
})();
