/**
 * Created by soundstorm on 30.04.15.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var productTypesSchema = mongoose.Schema({
        _id: String,
        neme: String

    }, { collection: 'productTypes' });

    mongoose.model('productTypes', productTypesSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['productTypes'] = productTypesSchema;
})();