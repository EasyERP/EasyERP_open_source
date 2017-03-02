module.exports = (function () {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var Schema = mongoose.Schema;
    var payments;
    var products;
    var quotationSchema;

    payments = {
        _id     : false,
        id      : false,
        total   : {type: Number, default: 0},
        discount: {type: Number, default: 0},
        unTaxed : {type: Number, default: 0},
        taxes   : {type: Number, default: 0}
    };

    products = {
        _id          : false,
        id           : false,
        scheduledDate: {type: Date},
        quantity     : {type: Number, default: 1},
        taxes        : {type: Number, default: 0},
        subTotal     : {type: Number, default: 0},
        unitPrice    : {type: Number, default: 0},
        product      : {type: ObjectId, ref: 'Product', default: null},
        description  : {type: String, default: ''},
        jobs         : {type: ObjectId, ref: 'jobs', default: null}
    };

    quotationSchema = new Schema({
        currency: {
            _id : {type: String, ref: 'currency', default: null},
            rate: {type: Number, default: 0} // changed default to '0' for catching errors
        },

        forSales      : {type: Boolean, default: true},
        type          : {type: String, default: 'Not Ordered', enum: ['Not Ordered', 'Not Invoiced', 'Invoiced']},
        isOrder       : {type: Boolean, default: false},
        supplier      : {type: ObjectId, ref: 'Customers', default: null},
        project       : {type: ObjectId, ref: 'Project', default: null},
        deliverTo     : {type: ObjectId, ref: 'DeliverTo', default: null},
        orderDate     : {type: Date, default: Date.now},
        expectedDate  : {type: Date, default: Date.now},
        name          : {type: String, default: 'PO', unique: true},
        destination   : {type: ObjectId, ref: 'Destination', default: null},
        incoterm      : {type: ObjectId, ref: 'Incoterm', default: null},
        invoiceControl: {type: ObjectId, ref: 'InvoicingControl', default: null},
        invoiceRecived: {type: Boolean, default: false},
        paymentTerm   : {type: ObjectId, ref: 'PaymentTerm', default: null},
        paymentInfo   : payments,
        products      : [products],
        workflow      : {type: ObjectId, ref: 'workflows', default: null},
        whoCanRW      : {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        attachments: {type: Array, default: []},
        notes      : {type: Array, default: []},

        groups: {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },

        creationDate: {type: Date, default: Date.now},

        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        proformaCounter: {type: Number, default: 0},
        externalId     : {type: String, default: null}

    }, {collection: 'Quotation'});

    mongoose.model('Quotation', quotationSchema);

    quotationSchema.pre('save', function (next) {
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
            // quotation.name = 'PO' + rate.seq; //it was working before mongoose and mongo update
            quotation.name = prefix + '_' + rate.value.seq;

            next();
        });
    });

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Quotation = quotationSchema;
})();
