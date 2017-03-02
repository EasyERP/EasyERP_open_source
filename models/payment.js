module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var extend = require('mongoose-schema-extend');
    var Schema = mongoose.Schema;

    function setPrice(num) {
        return num * 100;
    }

    var basePaymentSchema = new Schema({
        ID              : Number,
        invoice         : {type: ObjectId, ref: 'Invoice', default: null},
        paidAmount      : {type: Number, default: 0, set: setPrice},
        date            : {type: Date, default: Date.now},
        name            : {type: String, default: '', unique: true},
        workflow        : {type: String, enum: ['Draft', 'Paid'], default: 'Paid'},
        differenceAmount: {type: Number, default: 0, set: setPrice},
        whoCanRW        : {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        month           : {type: Number},
        year            : {type: Number},

        currency: {
            _id : {type: String, ref: 'currency', default: ''},
            rate: {type: Number, default: 1}
        },

        groups: {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },

        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        journal               : {type: ObjectId, ref: 'journal', default: null},
        otherIncomeLossAccount: {type: ObjectId, ref: 'chartOfAccount', default: null}, // journal for other income/loss with different currency of invoice and payment
        bankAccount           : {type: ObjectId, ref: 'chartOfAccount', default: null},

        bankExpenses: {
            amount : {type: Number, default: 0, set: setPrice},
            account: {type: ObjectId, ref: 'chartOfAccount', default: null}
        },

        overPayment: {
            amount : {type: Number, default: 0, set: setPrice},
            account: {type: ObjectId, ref: 'chartOfAccount', default: null}
        },

        otherIncomeLoss: {
            amount : {type: Number, default: 0, set: setPrice},
            account: {type: ObjectId, ref: 'chartOfAccount', default: null}
        },

        channel      : {type: ObjectId, default: null, ref: 'integrations'},
        integrationId: {type: String, default: ''}
    }, {collection: 'Payment', discriminatorKey: '_type'});

    var PaymentSchema = basePaymentSchema.extend({
        invoice      : {type: ObjectId, ref: 'Invoice', default: null},
        forSale      : {type: Boolean, default: true},
        paymentRef   : {type: String, default: ''},
        supplier     : {type: ObjectId, ref: 'Customers', default: null},
        paymentMethod: {type: ObjectId, ref: 'PaymentMethod', default: null},
        period       : {type: ObjectId, ref: 'Destination', default: null},
        bonus        : {type: Boolean},
        order        : {type: ObjectId, ref: 'Order', default: null},
        currency     : {
            _id : {type: String, ref: 'currency', default: null},
            rate: {type: Number, default: 1}
        },

        channel      : {type: ObjectId, ref: 'integrations', default: null},
        integrationId: {type: String, default: null},
        refund       : {type: Boolean, default: false},
        refundId     : {type: ObjectId, ref: 'Payment', default: null}
    });

    var InvoicePaymentSchema = PaymentSchema.extend({});

    var ProformaPaymentSchema = PaymentSchema.extend({});

    var ExpensesInvoicePaymentSchema = PaymentSchema.extend({});

    var DividendInvoicePaymentSchema = PaymentSchema.extend({});

    var purchasePaymentSchema = PaymentSchema.extend({
        forSale: {type: Boolean, default: false}
    });

    var PrepaymentSchema = PaymentSchema.extend({
        forSale: {type: Boolean, default: false}
    });

    var salaryPaymentSchema = basePaymentSchema.extend({
        invoice  : {type: ObjectId, ref: 'Invoice', default: null},
        isExpense: {type: Boolean, default: true},

        supplier: [{
            _id             : {type: ObjectId, ref: 'Employees', default: null},
            name            : {type: Object, default: null},
            paidAmount      : Number,
            differenceAmount: {type: Number, default: 0, set: setPrice}
        }],

        paymentMethod: {type: ObjectId, ref: 'ProductCategory', default: null},
        paymentRef   : [{type: ObjectId, ref: 'PayRoll', default: null}], // ref to PayRoll
        period       : {type: Date, default: null}
    });

    var payOutSchema = basePaymentSchema.extend({
        forSale      : {type: Boolean, default: false},
        supplier     : {type: ObjectId, ref: 'Employees', default: null},
        paymentMethod: {type: ObjectId, ref: 'PaymentMethod', default: null},
        paymentRef   : {type: String, default: ''},
        period       : {type: Date, default: null}
    });

    mongoose.model('Payment', PaymentSchema);
    mongoose.model('prepayment', PrepaymentSchema);
    mongoose.model('purchasePayments', purchasePaymentSchema);
    mongoose.model('InvoicePayment', InvoicePaymentSchema);
    mongoose.model('ProformaPayment', ProformaPaymentSchema);
    mongoose.model('expensesInvoicePayment', ExpensesInvoicePaymentSchema);
    mongoose.model('dividendInvoicePayment', DividendInvoicePaymentSchema);
    mongoose.model('salaryPayment', salaryPaymentSchema);
    mongoose.model('wTrackPayOut', payOutSchema);

    function setName(next) {
        var payment = this;
        var db = payment.db.db;

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : 'payment'
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }

            payment.name += '_' + rate.value.seq;

            next();
        });
    }

    PaymentSchema.pre('save', setName);
    PrepaymentSchema.pre('save', setName);
    ProformaPaymentSchema.pre('save', setName);
    InvoicePaymentSchema.pre('save', setName);
    ExpensesInvoicePaymentSchema.pre('save', setName);
    DividendInvoicePaymentSchema.pre('save', setName);
    salaryPaymentSchema.pre('save', setName);
    purchasePaymentSchema.pre('save', setName);

    /* PaymentSchema.post('save', function (doc) {
     var payment = this;
     var paymentDate = new Date(this.date);
     var db = payment.db.db;
     var invoiceId = doc.invoice._id;

     console.log('===================================================');
     console.log('||' + invoiceId + '||');
     console.log('===================================================');

     if(paymentDate === 'Invalid Date'){
     paymentDate = new Date();
     }

     db.collection('Invoice').findOneAndUpdate({
     _id: doc.invoice._id
     },
     //[['name', 1]],
     {
     $set: {paymentDate: paymentDate.toString()}
     },
     {
     returnOriginal: false
     },
     function (err, result) {
     if (err) {
     return console.error('An error was occurred during updating %s', doc.invoice);
     }

     console.log('Invoice %s was updated success', doc.invoice);
     console.dir(result);
     });
     });*/

    salaryPaymentSchema.pre('save', function (next) {
        var payment = this;
        var db = payment.db.db;

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : 'salary'
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }

            payment.name = payment.year + '/' + payment.month + '_' + rate.value.seq;

            next();
        });
    });
    salaryPaymentSchema.post('save', function (doc) {
        var payment = this;
        var db = payment.db.db;

        db.collection('Invoice').findOneAndUpdate({
                _id: doc.invoice._id
            },
            [['name', 1]],
            {
                $set: {paymentDate: new Date()}
            },
            null,
            function (err) {
                if (err) {
                    return console.error('An error was occurred during updating %s', doc.invoice);
                }

                console.log('Invoice %s was updated success', doc.invoice);
            });
    });

    payOutSchema.pre('save', function (next) {
        var payment = this;

        payment.name = new Date().valueOf();
        next();
    });

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Payment = PaymentSchema;
    mongoose.Schemas.InvoicePayment = InvoicePaymentSchema;
    mongoose.Schemas.Prepayment = PrepaymentSchema;
    mongoose.Schemas.ProformaPayment = ProformaPaymentSchema;
    mongoose.Schemas.ExpensesInvoicePayment = ExpensesInvoicePaymentSchema;
    mongoose.Schemas.DividendInvoicePayment = DividendInvoicePaymentSchema;
    mongoose.Schemas.salaryPayment = salaryPaymentSchema;
    mongoose.Schemas.wTrackPayOut = payOutSchema;
    mongoose.Schemas.purchasePayments = purchasePaymentSchema;
})();
