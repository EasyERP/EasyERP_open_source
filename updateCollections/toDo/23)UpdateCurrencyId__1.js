var mongoose = require('mongoose');
require('../../models/index.js');
var ObjectId = mongoose.Schema.Types.ObjectId;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbsObject = {};
var journalEntrSchema = mongoose.Schemas.journalEntry;
var PaymentSchema = mongoose.Schemas.Payment;
var InvoiceSchema = mongoose.Schemas.Invoices;
var PriceListsSchema = mongoose.Schemas.PriceLists;
var OrderSchema = mongoose.Schemas.Order;
var dbName = 'CRM';
var dbObject = mongoose.createConnection('localhost', dbName, 27017);
dbsObject[dbName] = dbObject;
var models = require('../../helpers/models')(dbsObject);
var payments = {
    _id     : false,
    total   : {type: Number, default: 0},
    balance : {type: Number, default: 0},
    unTaxed : {type: Number, default: 0},
    discount: {type: Number, default: 0},
    taxes   : {type: Number, default: 0}
};
var invoiceSchemaOld = new mongoose.Schema({
    ID              : Number,
    name            : {type: String, default: ''},
    forSales        : {type: Boolean, default: true},
    supplier        : {type: ObjectId, ref: 'Customers', default: null},
    paymentReference: {type: String, default: 'free'},

    invoiceDate: {type: Date, default: Date.now},
    dueDate    : Date,
    paymentDate: Date,
    journal    : {type: ObjectId, ref: 'journal', default: null},

    currency: {
        _id : {type: ObjectId, ref: 'currency', default: null},
        rate: {type: Number, default: 1}
    },

    salesPerson : {type: ObjectId, ref: 'Employees', default: null},
    paymentTerms: {type: ObjectId, ref: 'PaymentTerm', default: null},

    paymentMethod: {type: ObjectId, ref: 'PaymentMethod', default: null},

    paymentInfo: payments,
    payments   : [{type: ObjectId, ref: 'Payment', default: null}],

    workflow: {type: ObjectId, ref: 'workflows', default: null},
    whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},

    groups: {
        owner: {type: ObjectId, ref: 'Users', default: null},
        users: [{type: ObjectId, ref: 'Users', default: null}],
        group: [{type: ObjectId, ref: 'Department', default: null}]
    },

    creationDate: {type: Date, default: Date.now}, // remove it, duplicated by createdAt & invoiceDate
    createdBy   : {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date, default: Date.now}
    },

    editedBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date, default: Date.now}
    },

    channel       : {type: ObjectId, ref: 'integrations', default: null},
    attachments   : {type: Array, default: []},
    notes         : {type: Array, default: []},
    invoiced      : {type: Boolean, default: false},
    removable     : {type: Boolean, default: true},
    approved      : {type: Boolean, default: false},
    emailed       : {type: Boolean, default: false},
    project       : {type: ObjectId, ref: 'Project', default: null},
    integrationId : {type: String, default: ''},
    reconcile     : {type: Boolean, default: true},
    sourceDocument: {type: ObjectId, ref: 'Order', default: null}
}, {collection: 'Invoice'});

var paymentsOrder = {
    _id     : false,
    id      : false,
    total   : {type: Number, default: 0},
    discount: {type: Number, default: 0},
    unTaxed : {type: Number, default: 0},
    taxes   : {type: Number, default: 0}
};

var OrderOld = new mongoose.Schema({
    currency: {
        _id : {type: ObjectId, ref: 'currency', default: null},
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
    paymentInfo     : paymentsOrder,
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
    }

}, {collection: 'Order', discriminatorKey: '_type'});

mongoose.model('InvoicesOld', invoiceSchemaOld);

var InvoiceOld = models.get(dbName, 'InvoicesOld', invoiceSchemaOld);
var Invoice = models.get(dbName, 'Invoices', InvoiceSchema);

mongoose.model('OrderOld', OrderOld);

var OrderOldModel = models.get(dbName, 'OrderOld', OrderOld);
var Order = models.get(dbName, 'Order', OrderSchema);

function setPrice(num) {
    return num * 100;
}

var basePaymentSchema = new mongoose.Schema({
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
        _id : {type: ObjectId, ref: 'currency', default: null},
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
    externalId            : {type: String, default: null},
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
    }
}, {collection: 'Payment'});

mongoose.model('PaymentOld', basePaymentSchema);

var journalEntriesSchema = new mongoose.Schema({
    date   : {type: Date, default: Date.now},
    type   : {type: String, default: ''},
    journal: {type: ObjectId, ref: 'journal', default: null},
    account: {type: ObjectId, ref: 'chartOfAccount', default: null},

    currency: {
        _id : {type: String, ref: 'currency', default: null},
        rate: {type: Number, default: 1}
    },

    createdBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date, default: Date.now}
    },

    editedBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date, default: Date.now}
    },

    sourceDocument: {
        _id     : {type: ObjectId, default: null},
        model   : {type: String, default: 'Invoice'},
        employee: {type: ObjectId, default: null},
        name    : {type: String, default: ''}
    },

    debit    : {type: Number, default: 0},
    credit   : {type: Number, default: 0},
    debitFC  : {type: Number, default: 0},
    creditFC : {type: Number, default: 0},
    reversed : {type: Boolean, default: false},
    timestamp: {type: Number}
}, {collection: 'journalentries'});

mongoose.model('journalEntryOld', journalEntriesSchema);

var journalEntryOld = models.get(dbName, 'journalEntryOld', journalEntriesSchema);
var journalEntry = models.get(dbName, 'journalEntry', journalEntrSchema);

var PaymentOld = models.get(dbName, 'PaymentOld', basePaymentSchema);
var Payment = models.get(dbName, 'Payment', PaymentSchema);

journalEntryOld.find({}).populate('currency._id').exec(function (err, result) {
    if (err) {
        return console.log(err);
    }

    result.forEach(function (el) {
        var currency = {
            _id : el.currency._id ? el.currency._id.name : 'USD',
            rate: el.currency.rate
        };
        journalEntry.update({_id: el._id}, {$set: {currency: currency}}, function (err, result) {
            if (err) {
                return console.log(err);
            }

        });
    });
    console.log('je');
});

PaymentOld.find({}).populate('currency._id').exec(function (err, result) {
    if (err) {
        return console.log(err);
    }

    result.forEach(function (el) {
        var currency = {
            _id : el.currency._id ? el.currency._id.name : 'USD',
            rate: el.currency.rate
        };

        if (currency._id === '') {
            console.log(el.currency._id);
        }
        Payment.update({_id: el._id}, {$set: {currency: currency}}, function (err, result) {
            if (err) {
                return console.log(err);
            }

        });
    });
    console.log('payments');

});

InvoiceOld.find({}).populate('currency._id').exec(function (err, result) {
    if (err) {
        return console.log(err);
    }

    result.forEach(function (el) {
        var currency = {
            _id : el.currency._id ? el.currency._id.name : 'USD',
            rate: el.currency.rate
        };
        Invoice.update({_id: el._id}, {$set: {currency: currency}}, function (err, result) {
            if (err) {
                return console.log(err);
            }

        });
    });
    console.log('invoice');

});

OrderOldModel.find({}).populate('currency._id').exec(function (err, result) {
    if (err) {
        return console.log(err);
    }

    result.forEach(function (el) {
        var currency = {
            _id : el.currency._id ? el.currency._id.name : 'USD',
            rate: el.currency.rate
        };
        Order.update({_id: el._id}, {$set: {currency: currency}}, function (err, result) {
            if (err) {
                return console.log(err);
            }

        });
    });
    console.log('order');

});

var priceListsSchemaOld = new mongoose.Schema({
    priceListCode: {type: String, default: null},
    name         : {type: 'String', default: null},
    currency     : {type: ObjectId, ref: 'currency', default: null},
    cost         : {type: Boolean, default: false}
}, {collection: 'PriceLists'});

mongoose.model('PriceListOld', priceListsSchemaOld);

var PriceListModelOld = models.get(dbName, 'PriceListOld', priceListsSchemaOld);
var PriceListModel = models.get(dbName, 'PriceList', PriceListsSchema);

PriceListModelOld.find({}).populate('currency').exec(function (err, result) {
    if (err) {
        return console.log(err);
    }

    result.forEach(function (el) {
        var currency = el.currency ? el.currency.name : 'USD';

        PriceListModel.update({_id: el._id}, {$set: {currency: currency}}, function (err, result) {
            if (err) {
                return console.log(err);
            }

        });
    });
    console.log('good price list');
});
