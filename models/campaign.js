module.exports = (function () {
    var mongoose = require('mongoose');
    var campaignSchema = mongoose.Schema({
        _id     : {type: String, default: ''},
        name    : {type: String, default: ''},
        sequence: {type: Number, default: 0}
    }, {collection: 'campaign'});

    mongoose.model('campaign', campaignSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Campaign = campaignSchema;
})();
