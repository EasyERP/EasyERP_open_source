/**
 * Created by lilya on 27/11/15.
 */

module.exports = (function () {

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var chartAccountSchema = mongoose.Schema({

        _id: Number,
        account: {type: String, default: ""},
        type: {type: String, default: ""}

    }, {collection: 'chartOfAccount'});

    mongoose.model('chartOfAccount', chartAccountSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['chartOfAccount'] = chartAccountSchema;
})();