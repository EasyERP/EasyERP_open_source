/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var relatedStatusSchema = mongoose.Schema({
        _id: Number,
        status: String
    }, {collection: 'relatedStatus'});

    mongoose.model('relatedStatus', relatedStatusSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['relatedStatus'] = relatedStatusSchema;
})();