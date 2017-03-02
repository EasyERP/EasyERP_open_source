module.exports = (function () {
    var mongoose = require('mongoose');

    var OptionsSchema = mongoose.Schema({
        name        : {type: String, default: 'default'},
        creationDate: {type: Date, default: Date.now}
    }, {collection: 'ProductOptions'});

    mongoose.model('ProductOptions', OptionsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.ProductOptions = OptionsSchema;
})();
