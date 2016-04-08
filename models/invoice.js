module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var extend = require('mongoose-schema-extend');

    var payments = {
        _id    : false,
        total  : {type: Number, default: 0, set: setPrice},
        balance: {type: Number, default: 0, set: setPrice},
        unTaxed: {type: Number, default: 0, set: setPrice},
        taxes  : {type: Number, default: 0, set: setPrice}
    };

    var productForJobs = {type: ObjectId, ref: 'Product', default: null};
    var productForPayRolls = [{type: ObjectId, ref: 'PayRoll', default: null}];
    var product = {type: ObjectId, ref: 'Product', default: null};

    var baseSchema = new mongoose.Schema({
        ID              : Number,
        name            : {type: String, default: ''},
        forSales        : {type: Boolean, default: true},
        supplier        : {type: ObjectId, ref: 'Customers', default: null},
        sourceDocument  : {type: ObjectId, ref: 'Quotation', default: null},//should be order in invoice case
        paymentReference: {type: String, default: 'free'},

        invoiceDate: {type: Date, default: Date.now},
        dueDate    : Date,
        paymentDate: Date,
        journal    : {type: ObjectId, ref: 'journal', default: null},
        currency   : {
            _id : {type: ObjectId, ref: 'currency', default: null},
            rate: {type: Number, default: 1}
        },

        salesPerson : {type: ObjectId, ref: 'Employees', default: null},
        paymentTerms: {type: ObjectId, ref: 'PaymentTerm', default: null},

        paymentInfo: payments,
        payments   : [{type: ObjectId, ref: 'Payment', default: null}],

        workflow: {type: ObjectId, ref: 'workflows', default: null},
        whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},

        groups: {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },

        creationDate: {type: Date, default: Date.now},
        createdBy   : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        editedBy : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        invoiced : {type: Boolean, default: false},
        removable: {type: Boolean, default: true}
    }, {collection: 'Invoice', discriminatorKey: '_type'});

    var jobsInvoiceSchema = baseSchema.extend({
        forSales: {type: Boolean, default: true},
        products: [{
            _id        : false,
            quantity   : {type: Number, default: 1},
            unitPrice  : Number,
            product    : productForJobs,
            description: {type: String, default: ''},
            jobs       : {type: ObjectId, ref: "jobs", default: null},
            taxes      : {type: Number, default: 0},
            subTotal   : Number
        }],
        project : {type: ObjectId, ref: 'Project', default: null}
    });

    var proformaSchema = jobsInvoiceSchema.extend({});

    var payRollInvoiceSchema = baseSchema.extend({
        expense : {type: Boolean, default: true},
        products: [{
            _id    : false,
            product: productForPayRolls,
            paid   : Number,
            diff   : Number
        }]
    });

    var invoiceSchema = baseSchema.extend({
        products: [{
            _id        : false,
            quantity   : {type: Number, default: 1},
            unitPrice  : Number,
            product    : product,
            description: {type: String, default: ''},
            taxes      : {type: Number, default: 0},
            subTotal   : Number
        }]
    });

    function setPrice(num) {
        return num * 100;
    };

    jobsInvoiceSchema.set('toJSON', {getters: true});
    payRollInvoiceSchema.set('toJSON', {getters: true});
    invoiceSchema.set('toJSON', {getters: true});
    proformaSchema.set('toJSON', {getters: true});

    mongoose.model('wTrackInvoice', jobsInvoiceSchema);
    mongoose.model('payRollInvoice', payRollInvoiceSchema);
    mongoose.model('Invoice', invoiceSchema);
    mongoose.model('Proforma', proformaSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['wTrackInvoice'] = jobsInvoiceSchema;
    mongoose.Schemas['payRollInvoice'] = payRollInvoiceSchema;
    mongoose.Schemas['Invoice'] = invoiceSchema;
    mongoose.Schemas['Proforma'] = proformaSchema;
})();