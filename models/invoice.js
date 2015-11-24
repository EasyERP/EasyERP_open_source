module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var extend = require('mongoose-schema-extend');

    var payments = {
        _id: false,
        total: {type: Number, default: 0, set: setPrice},
        balance: {type: Number, default: 0, set: setPrice},
        unTaxed: {type: Number, default: 0, set: setPrice},
        taxes: {type: Number, default: 0, set: setPrice}
    };

    var productForJobs = {type: ObjectId, ref: 'Product', default: null};
    var product = {type: ObjectId, ref: 'Product', default: null};

    var baseSchema = new mongoose.Schema({
        ID: Number,
        name: {type: String, default: ''},
        invoiceType: {type: String, default: 'sales', enum: ['sales', 'purchases', 'jobs']},
        supplier: {
            _id: {type: ObjectId, ref: 'Customers', default: null},
            name: String
        },
        sourceDocument: { type: String, default: null },//should be order in invoice case
        paymentReference: { type: String, default: 'free' },

        invoiceDate: { type: Date, default: Date.now },
        dueDate: Date,
        paymentDate: Date,

        salesPerson: {
            _id: {type: ObjectId, ref: 'Employees', default: null},
            name: String
        },
        paymentTerms: {type: ObjectId, ref: 'PaymentTerm', default: null},

        paymentInfo: payments,
        payments: [{type: ObjectId, ref: 'Payment', default: null}],

        workflow: {
            _id: {type: ObjectId, ref: 'workflows', default: null},
            name: String,
            status: String
        },
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

    var jobsInvoiceSchema = baseSchema.extend({
        products: [ {
            _id: false,
            quantity: {type: Number, default: 1},
            unitPrice: Number,
            product: productForJobs,
            description  : {type: String, default: ''},
            jobs: {type: ObjectId, ref: "jobs", default: null},
            taxes: {type: Number, default: 0},
            subTotal: Number
        }],
        project: {
            _id: {type: ObjectId, ref: 'Project', default: null},
            name: String
        }
    });

    var invoiceSchema = baseSchema.extend({
        products: [ {
            _id: false,
            quantity: {type: Number, default: 1},
            unitPrice: Number,
            product: product,
            description  : {type: String, default: ''},
            taxes: {type: Number, default: 0},
            subTotal: Number
        }]
    });

    function setPrice(num) {
        return num * 100;
    };

    jobsInvoiceSchema.set('toJSON', {getters: true});
    invoiceSchema.set('toJSON', {getters: true});

    mongoose.model('wTrackInvoice', jobsInvoiceSchema);
    mongoose.model('Invoice', invoiceSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['wTrackInvoice'] = jobsInvoiceSchema;
    mongoose.Schemas['Invoice'] = invoiceSchema;
})();