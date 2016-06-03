module.exports = (function () {
    var mongoose = require('mongoose');

    var bonusTypeSchema = mongoose.Schema({
        ID       : Number,
        name     : {type: String},
        bonusType: {type: String, enum: ['HR', 'Sales', 'Developer', 'PM'], default: 'Developer'},
        value    : {type: Number},
        isPercent: {type: Boolean}
    }, {collection: 'bonusType'});

    mongoose.model('bonusType', bonusTypeSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.bonusType = bonusTypeSchema;
})();
