module.exports = (function () {
    'use strict';

    var mongoose = require('mongoose'), extend = require('mongoose-schema-extend');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var Schema = mongoose.Schema;
    var payments;
    var orderSchema;
    var purchaseOrdersSchema;
    var baseSchema;

    payments = {
        _id     : false,
        id      : false,
        total   : {type: Number, default: 0},
        discount: {type: Number, default: 0},
        unTaxed : {type: Number, default: 0},
        taxes   : {type: Number, default: 0}
    };

    baseSchema = new Schema({
        currency: {
            _id : {type: String, ref: 'currency', default: ''},
            rate: {type: Number, default: 1} // changed default to '0' for catching errors
        },

        forSales     : {type: Boolean, default: true},
        type         : {type: String, default: 'Not Ordered', enum: ['Not Ordered', 'Not Invoiced', 'Invoiced']},
        supplier     : {type: ObjectId, ref: 'Customers', default: null},
        orderDate    : {type: Date, default: Date.now},
        expectedDate : {type: Date, default: Date.now},
        integrationId: {type: String, default: ''},

        status: {
            allocateStatus: {type: String, default: 'NOR', enum: ['NOR', 'NOT', 'NOA', 'ALL']},
            fulfillStatus : {type: String, default: 'NOR', enum: ['NOR', 'NOT', 'NOA', 'ALL']},
            shippingStatus: {type: String, default: 'NOR', enum: ['NOR', 'NOT', 'NOA', 'ALL']}
        },

        paymentMethod   : {type: ObjectId, ref: 'PaymentMethod', default: null},
        name            : {type: String, default: 'SO', unique: true},
        destination     : {type: ObjectId, ref: 'Destination', default: null},
        paymentTerm     : {type: ObjectId, ref: 'PaymentTerm', default: null},
        salesPerson     : {type: ObjectId, ref: 'Employees', default: null},
        costList        : {type: ObjectId, ref: 'PriceList', default: null},
        priceList       : {type: ObjectId, ref: 'PriceList', default: null},
        paymentInfo     : payments,
        shippingMethod  : {type: ObjectId, ref: 'shippingMethod', default: null},
        shippingExpenses: {
            amount : {type: Number, default: 0},
            account: {type: ObjectId, ref: 'chartOfAccount', default: null}
        },

        workflow    : {type: ObjectId, ref: 'workflows', default: null},
        tempWorkflow: {type: ObjectId, ref: 'workflows', default: null},
        warehouse   : {type: ObjectId, ref: 'warehouse', default: null},
        whoCanRW    : {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        attachments : {type: Array, default: []},
        notes       : {type: Array, default: []},

        groups: {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },

        creationDate: {type: Date, default: Date.now},
        project     : {type: ObjectId, ref: 'Project', default: null},
        createdBy   : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        externalId: String,
        channel   : {type: ObjectId, ref: 'integrations', default: null},

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        conflictTypes: [{
            _id  : false,
            type : {type: String},
            value: {type: JSON}
        }]

    }, {collection: 'Order', discriminatorKey: '_type'});

    purchaseOrdersSchema = baseSchema.extend({});
    orderSchema = baseSchema.extend({});

    mongoose.model('Order', orderSchema);
    mongoose.model('purchaseOrders', purchaseOrdersSchema);

    function setName(next) {
        var quotation = this;
        var db = quotation.db.db;
        var prefix = quotation.forSales ? 'SO' : 'PO';

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : prefix
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }

            quotation.name = prefix + '_' + rate.value.seq;

            next();
        });
    }

    orderSchema.pre('save', setName);
    purchaseOrdersSchema.pre('save', setName);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Order = orderSchema;
    mongoose.Schemas.purchaseOrders = purchaseOrdersSchema;
})();
