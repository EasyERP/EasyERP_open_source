module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var taxes = {
        _id    : false,
        taxCode: {type: ObjectId, ref: 'taxes', default: null},
        tax    : {type: Number, default: 0}
    };

    var OrderRowSchema = mongoose.Schema({
        product                      : {type: ObjectId, ref: 'Product', default: null},
        order                        : {type: ObjectId, ref: 'Order', default: null},
        warehouse                    : {type: ObjectId, ref: 'warehouse', default: null},
        quantity                     : {type: Number, default: 0},
        taxes                        : [taxes],
        description                  : String,
        unitPrice                    : {type: Number, default: 0},
        costPrice                    : {type: Number, default: 0},
        subTotal                     : {type: Number, default: 0},
        nominalCode                  : {type: Number, default: 0},
        creationDate                 : {type: Date, default: Date.now},
        debitAccount                 : {type: ObjectId, ref: 'chartOfAccount', default: null},
        creditAccount                : {type: ObjectId, ref: 'chartOfAccount', default: null},
        channel                      : {type: ObjectId, ref: 'integrations', default: null},
        integrationId                : String,
        isFromManufacturingForReceive: {type: Boolean, default: false}
    }, {collection: 'orderRows'});

    mongoose.model('orderRows', OrderRowSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.OrderRow = OrderRowSchema;
})();
