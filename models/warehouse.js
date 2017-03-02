module.exports = (function () {
    'use strict';
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var warehouseSchema = new mongoose.Schema({
        name   : {type: String, default: '', required: true},
        address: {
            street : {type: String, default: ''},
            city   : {type: String, default: ''},
            state  : {type: String, default: ''},
            zip    : {type: String, default: ''},
            country: {type: String, default: ''}
        },

        isOwn    : {type: Boolean, default: true},
        main     : {type: Boolean, default: false},
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        account: {type: ObjectId, ref: 'chartOfAccount', default: null}

    }, {collection: 'warehouse'});

    mongoose.model('warehouse', warehouseSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.warehouse = warehouseSchema;
})();
