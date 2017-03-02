'use strict';

module.exports = (function () {
    var mongoose = require('mongoose');

    var Schema = mongoose.Schema({
        _id  : {type: String, default: ''},
        date : {type: Date, default: Date.now},
        base : {type: String, default: 'USD', ref: 'currency'},
        rates: {type: JSON}
    }, {collection: 'rates'});

    mongoose.model('rates', Schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.rates = Schema;
})();

