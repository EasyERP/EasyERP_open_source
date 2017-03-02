module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var OptionsValuesSchema = mongoose.Schema({
        value   : {type: String, default: 'default'},
        optionId: {type: ObjectId, ref: 'productsOptions', default: null}
    }, {collection: 'ProductOptionsValues'});

    mongoose.model('ProductOptionsValues', OptionsValuesSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.ProductOptionsValues = OptionsValuesSchema;
})();