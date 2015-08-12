/**
 * Created by liliya on 8/12/15.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var savedFiltersSchema = mongoose.Schema({
        contentView: String,
        filter: [JSON]

}, {collection: 'savedFilters'});

mongoose.model('savedFilters', savedFiltersSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['savedFilters'] = savedFiltersSchema;
})();