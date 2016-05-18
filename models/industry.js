/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var IndustrySchema = mongoose.Schema({
        name: String,
        ID: Number
    }, { collection: 'Industry' });

    mongoose.model('Industry', IndustrySchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Industry'] = IndustrySchema;
})();