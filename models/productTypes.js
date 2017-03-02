module.exports = (function () {
    var mongoose = require('mongoose');
    var productTypesSchema = mongoose.Schema({
        name        : String,
        options     : {type: Array, default: []},
        creationDate: {type: Date, default: Date.now}
    }, {collection: 'productTypes'});

    mongoose.model('productTypes', productTypesSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.productTypes = productTypesSchema;
})();
