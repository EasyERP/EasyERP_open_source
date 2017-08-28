module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var extend = require('mongoose-schema-extend');

    var payments = {
        _id     : false,
        total   : {type: Number, default: 0},
        balance : {type: Number, default: 0},
        unTaxed : {type: Number, default: 0},
        discount: {type: Number, default: 0},
        taxes   : {type: Number, default: 0}
    };

    var productForJobs = {type: ObjectId, ref: 'Product', default: null};
    var productForPayRolls = [{type: ObjectId, ref: 'PayRoll', default: null}];
    var product = {type: ObjectId, ref: 'Product', default: null};

    var baseSchema = new mongoose.Schema({
        ID              : Number,
        name            : {type: String, default: ''},
        forSales        : {type: Boolean, default: true},
        supplier        : {type: ObjectId, ref: 'Customers', default: null},
        sourceDocument  : {type: ObjectId, ref: 'Quotation', default: null}, // should be order in invoice case
        paymentReference: {type: String, default: 'free'},
        invoiceDate     : {type: Date, default: Date.now},
        dueDate         : Date,
        paymentDate     : Date,
        journal         : {type: ObjectId, ref: 'journal', default: null},
        currency        : {
            _id : {type: String, ref: 'currency', default: ''},
            rate: {type: Number, default: 1}
        },

        salesPerson  : {type: ObjectId, ref: 'Employees', default: null},
        paymentTerms : {type: ObjectId, ref: 'PaymentTerm', default: null},
        paymentMethod: {type: ObjectId, ref: 'PaymentMethod', default: null},
        paymentInfo  : payments,
        payments     : [{type: ObjectId, ref: 'Payment', default: null}],
        workflow     : {type: ObjectId, ref: 'workflows', default: null},
        whoCanRW     : {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        groups       : {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },

        creationDate: {type: Date, default: Date.now}, // remove it, duplicated by createdAt & invoiceDate
        createdBy   : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy    : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        channel      : {type: ObjectId, ref: 'integrations', default: null},
        attachments  : {type: Array, default: []},
        notes        : {type: Array, default: []},
        invoiced     : {type: Boolean, default: false},
        removable    : {type: Boolean, default: true},
        approved     : {type: Boolean, default: false},
        emailed      : {type: Boolean, default: false},
        project      : {type: ObjectId, ref: 'Project', default: null},
        /*externalId : {type: String, default: ''},
         magentoId  : {type: String, default: ''},*/
        integrationId: {type: String, default: ''},
        reconcile    : {type: Boolean, default: true}
    }, {collection: 'Invoice', discriminatorKey: '_type'});

    var jobsInvoiceSchema = baseSchema.extend({
        forSales: {type: Boolean, default: true},
        products: [{
            _id        : false,
            quantity   : {type: Number, default: 1},
            unitPrice  : Number,
            product    : productForJobs,
            description: {type: String, default: ''},
            jobs       : {type: ObjectId, ref: 'jobs', default: null},
            taxes      : {type: Number, default: 0},
            subTotal   : Number
        }],

        project: {type: ObjectId, ref: 'Project', default: null}
    });

    var writeOffSchema = baseSchema.extend({
        products: [{
            _id        : false,
            quantity   : {type: Number, default: 1},
            unitPrice  : Number,
            product    : productForJobs,
            description: {type: String, default: ''},
            jobs       : {type: ObjectId, ref: 'jobs', default: null},
            taxes      : {type: Number, default: 0},
            subTotal   : Number

        }],

        project: {type: ObjectId, ref: 'Project', default: null}
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

    var invoicesSchema = baseSchema.extend({
        sourceDocument: {type: ObjectId, ref: 'Order', default: null}
    });

    var purchaseInvoicesSchema = baseSchema.extend({
        sourceDocument: {type: ObjectId, ref: 'Order', default: null}
    });

    var invoiceSchema = baseSchema.extend({
        products: [{
            _id        : false,
            quantity   : {type: Number, default: 1},
            unitPrice  : Number,
            product    : product,
            description: {type: String, default: ''},
            taxes      : [{
                _id    : false,
                taxCode: {type: ObjectId, ref: 'taxes', default: null},
                tax    : {type: Number, default: 0}
            }],

            subTotal     : Number,
            debitAccount : {type: ObjectId, ref: 'chartOfAccount', default: null},
            creditAccount: {type: ObjectId, ref: 'chartOfAccount', default: null}
        }]
    });

    var expensesInvoiceSchema = invoiceSchema.extend({
        expensesCategory: {type: ObjectId, ref: 'expensesCategory', default: null}
    });

    var dividendInvoiceSchema = invoiceSchema.extend({
        products: [{
            _id        : false,
            quantity   : {type: Number, default: 1},
            unitPrice  : Number,
            product    : {type: ObjectId, ref: 'Employees', default: null},
            description: {type: String, default: ''},
            taxes      : [{
                _id    : false,
                taxCode: {type: ObjectId, ref: 'taxes', default: null},
                tax    : {type: Number, default: 0}
            }],

            subTotal: Number
        }]
    });

    /*    function setPrice(num) {
     return num * 100;
     };*/

    dividendInvoiceSchema.pre('save', function (next) {
        var invoice = this;
        var db = invoice.db.db;

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : 'DividendDeclaration'
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }
            invoice.name = 'DD' + rate.value.seq;

            next();
        });
    });

    writeOffSchema.pre('save', function (next) {
        var invoice = this;
        var db = invoice.db.db;

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : 'WriteOff'
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }
            invoice.name = 'WO' + rate.value.seq;

            next();
        });
    });

    invoiceSchema.pre('save', function (next) {
        var invoice = this;
        var db = invoice.db.db;

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : 'invoice'
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }
            invoice.name = 'PI' + rate.value.seq;

            next();
        });
    });

    invoicesSchema.pre('save', function (next) {
        var invoice = this;
        var db = invoice.db.db;

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : 'invoice'
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }
            invoice.name = 'SI' + rate.value.seq;

            next();
        });
    });

    purchaseInvoicesSchema.pre('save', function (next) {
        var invoice = this;
        var db = invoice.db.db;

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : 'invoice'
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }
            invoice.name = 'PI' + rate.value.seq;

            next();
        });
    });

    purchaseInvoicesSchema.set('toJSON', {getters: true});
    jobsInvoiceSchema.set('toJSON', {getters: true});
    expensesInvoiceSchema.set('toJSON', {getters: true});
    dividendInvoiceSchema.set('toJSON', {getters: true});
    payRollInvoiceSchema.set('toJSON', {getters: true});
    invoiceSchema.set('toJSON', {getters: true});
    invoicesSchema.set('toJSON', {getters: true});
    writeOffSchema.set('toJSON', {getters: true});

    mongoose.model('wTrackInvoice', jobsInvoiceSchema);
    mongoose.model('payRollInvoice', payRollInvoiceSchema);
    mongoose.model('Invoice', invoiceSchema);
    mongoose.model('Invoices', invoicesSchema);
    mongoose.model('purchaseInvoices', purchaseInvoicesSchema);
    mongoose.model('expensesInvoice', expensesInvoiceSchema);
    mongoose.model('dividendInvoice', dividendInvoiceSchema);
    mongoose.model('Proforma', proformaSchema);
    mongoose.model('writeOff', writeOffSchema);

    function setName(next) {
        var proforma = this;
        var db = proforma.db.db;

        db.collection('settings').findOneAndUpdate({
                dbName   : db.databaseName,
                name     : 'proforma',
                quotation: proforma.name
            }, {
                $inc: {seq: 1}
            }, {
                returnOriginal: false,
                upsert        : true
            },
            function (err, rate) {
                if (err) {
                    return next(err);
                }

                proforma.name += '_' + rate.value.seq;

                next();
            });
    }

    proformaSchema.pre('save', setName);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.wTrackInvoice = jobsInvoiceSchema;
    mongoose.Schemas.payRollInvoice = payRollInvoiceSchema;
    mongoose.Schemas.Invoice = invoiceSchema;
    mongoose.Schemas.Invoices = invoicesSchema;
    mongoose.Schemas.purchaseInvoices = purchaseInvoicesSchema;
    mongoose.Schemas.expensesInvoice = expensesInvoiceSchema;
    mongoose.Schemas.dividendInvoice = dividendInvoiceSchema;
    mongoose.Schemas.Proforma = proformaSchema;
    mongoose.Schemas.writeOff = writeOffSchema;
})();
