/**
 * Created by Roman on 13.05.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var IncotermSchema = mongoose.Schema({
        code: String,
        name: String
    }, { collection: 'Incoterms' });

    mongoose.model('Incoterm', IncotermSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Incoterm'] = IncotermSchema;
})();