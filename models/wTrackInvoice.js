/**
 * Created by ANDREY on 29.04.2015.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var payments = {
        _id: false,
        //payments: [{ type: ObjectId, ref: 'Payment', default: null }],
        total: {type: Number, default: 0, set: setPrice},
        balance: {type: Number, default: 0, set: setPrice},
        unTaxed: {type: Number, default: 0, set: setPrice},
        taxes: {type: Number, default: 0, set: setPrice}
    };

    var products = {
        _id: false,
        quantity: {type: Number, default: 1},
        unitPrice: Number,
        product: {type: ObjectId, ref: 'wTrack', default: null},
        description: {type: String, default: ''},
        taxes: {type: Number, default: 0},
        subTotal: Number
    };

    var invoiceSchema = new mongoose.Schema({
        ID: Number,
        name: {type: String, default: ''},
        invoiceType: {type: String, default: 'wTrack'},
        forSales: {type: Boolean, default: true},
        supplier: { type: ObjectId, ref: 'Customers', default: null },
        /*fiscalPosition: { type: String, default: null },*/
        sourceDocument: { type: String, default: null },
        paymentReference: { type: String, default: 'free' },

        project: {type: ObjectId, ref: 'Project', default: null},

        invoiceDate: { type: Date, default: Date.now },
        dueDate: Date,
        paymentDate: Date,

        salesPerson: {type: ObjectId, ref: 'Employees', default: null},
        paymentTerms: {type: ObjectId, ref: 'PaymentTerm', default: null},

        paymentInfo: payments,
        payments: [{type: ObjectId, ref: 'Payment', default: null}],
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

    function setPrice(num) {
        return num * 100;
    }

    invoiceSchema.set('toJSON', {getters: true});

    mongoose.model('wTrackInvoice', invoiceSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['wTrackInvoice'] = invoiceSchema;
})();