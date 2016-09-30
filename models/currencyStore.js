module.exports = (function () {
    var mongoose = require('mongoose');

    var currencySchema = new mongoose.Schema({
        data  : Array,
        date  : Date
    }, {collection: 'CurrencyStore'});

    mongoose.model('CurrencyStore', currencySchema);
    mongoose.Schemas.currencyStore = currencySchema;
})();
