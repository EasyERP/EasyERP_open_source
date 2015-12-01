module.exports = (function () {
    var mongoose = require('mongoose');

    var currencySchema = new mongoose.Schema({
        name    : {type: String, default: ''},
        sequence: {type: Number}
    }, {collection: 'currency'});

    mongoose.Schemas['Currency'] = currencySchema;
})();