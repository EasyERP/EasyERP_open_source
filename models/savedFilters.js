/**
 * Created by liliya on 8/12/15.
 */
/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var savedFiltersSchema = mongoose.Schema({
       savedFilters:  [{type: ObjectId, ref: 'wTrack', default: null}]

}, {collection: 'savedFilters'});

mongoose.model('savedFiltersModel', savedFiltersSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['savedFilters'] = savedFiltersSchema;
})();