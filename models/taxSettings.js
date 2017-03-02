module.exports = (function () {
    'use strict';
    var mongoose = require('mongoose');

    var taxSchema = new mongoose.Schema({
        name     : {type: String, default: ''},
        fullName : {type: String, default: ''},
        code     : {type: String, default: ''},
        rate     : {type: Number, default: 0},
        sequence : {type: Number, default: 0},
        country  : {type: String, default: 0},
        isDefault: {type: Boolean, default: false}
    }, {collection: 'taxes'});

    mongoose.model('taxes', taxSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.taxes = taxSchema;
})();

