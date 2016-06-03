module.exports = (function () {
    var mongoose = require('mongoose');
    var LanguageSchema = mongoose.Schema({
        name: String

    }, {collection: 'languages'});

    mongoose.model('languages', LanguageSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.language = LanguageSchema;
})();
