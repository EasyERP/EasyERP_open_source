module.exports = (function () {
    var mongoose = require('mongoose');
    var nationalitySchema = mongoose.Schema({
        _id: String
    }, {collection: 'nationality'});

    mongoose.model('nationality', nationalitySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.nationality = nationalitySchema;
})();
