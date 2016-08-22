module.exports = (function () {
    var mongoose = require('mongoose');

    var countriesSchema = new mongoose.Schema({
        _id : {type: String, default: ''},
        name: {type: String, default: ''},
        code: {type: String, default: ''}
    }, {collection: 'countries'});

    mongoose.model('countries', countriesSchema);
    mongoose.Schemas.countries = countriesSchema;
})();
