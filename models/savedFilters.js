module.exports = (function () {
    var mongoose = require('mongoose');

    var savedFiltersSchema = mongoose.Schema({
        ID    : Number,
        name  : String,
        filter: JSON

    }, {collection: 'savedFilters'});

    mongoose.model('savedFilters', savedFiltersSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.savedFilters = savedFiltersSchema;
})();
