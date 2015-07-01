/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var campaignSchema = mongoose.Schema({
        _id: { type: String, default: '' },
        name: { type: String, default: '' }
    }, { collection: 'campaign' });

    mongoose.model('campaign', campaignSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Campaign'] = campaignSchema;
})();