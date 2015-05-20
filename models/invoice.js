/**
 * Created by ANDREY on 29.04.2015.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var payments = {
        _id: false,
        id: false,
        total: {type: Number, default: 0},
        balance: {type: Number, default: 0},
        unTaxed: {type: Number, default: 0},
        taxes: {type: Number, default: 0}
    };

    var products = {
        _id: false,
        id: false,
        quantity: {type: Number, default: 1},
        unitPrice: Number,
        product: {type: ObjectId, ref: 'Product', default: null},
        description: {type: String, default: ''},
        taxes: Number,
        subTotal: Number
    };

    var invoiceSchema = new mongoose.Schema({

        supplier: { type: ObjectId, ref: 'Customers', default: null },
        /*fiscalPosition: { type: String, default: null },*/
        sourceDocument: { type: String, default: null },
        supplierInvoiceNumber: { type: String, default: null },
        paymentReference: { type: String, default: 'free' },

        invoiceDate: { type: Date, default: Date.now },
        dueDate: Date,
        account: { type: String, default: null },
        journal: { type: String, default: null },

        salesPerson: {type: ObjectId, ref: 'Employees', default: null},
        paymentTerms: {type: ObjectId, ref: 'PaymentTerm', default: null},

        paymentInfo: payments,
        products: [ products],

        workflow: {type: ObjectId, ref: 'workflows', default: null},
        whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},

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
        }

    }, { collection: 'Invoice' });

    mongoose.model('Invoice', invoiceSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Invoice'] = invoiceSchema;
})();