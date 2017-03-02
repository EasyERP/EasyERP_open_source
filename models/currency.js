module.exports = (function () {
    var mongoose = require('mongoose');

    var currencySchema = new mongoose.Schema({
        _id     : {type: 'String'},
        name    : {type: String, default: ''},
        symbol  : {type: String, default: ''},
        decPlace: {type: Number, default: 2},
        sequence: {type: Number},
        active  : {type: Boolean, default: false}
    }, {collection: 'currency'});

    mongoose.model('currency', currencySchema);
    mongoose.Schemas.Currency = currencySchema;
})();
