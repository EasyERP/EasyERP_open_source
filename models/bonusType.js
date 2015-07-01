/**
 * Created by Liliya_Pikiner on 7/1/2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var bonusTypeSchema = mongoose.Schema({
        name: {type: String},
        type: {type: String},
        value: {type: Number},
        isPercent: {type: Boolean}
    }, {collection: 'bonusType'});

    mongoose.model('bonusType', bonusTypeSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['bonusType'] = bonusTypeSchema;
})();
