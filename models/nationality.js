module.exports = (function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var nationalitySchema = Schema({
        name: {type: String, required: true}
    }, {collection: 'nationality'});

    mongoose.model('nationality', nationalitySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.nationality = nationalitySchema;
})();
