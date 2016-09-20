module.exports = (function () {
    var mongoose = require('mongoose');

    var currencySchema = new mongoose.Schema({
        name    : {type: String, default: ''},
        symbol  : {type: String, default: ''},
        decPlace: {type: Number, default: 2},
        sequence: {type: Number}
    }, {collection: 'currency'});

    mongoose.model('currency', currencySchema);
    mongoose.Schemas.Currency = currencySchema;
})();
