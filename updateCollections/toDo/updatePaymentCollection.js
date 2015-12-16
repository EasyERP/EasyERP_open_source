/**
 * Created by lilya on 15/12/15.
 */
/**
 * Created by lilya on 15/12/15.
 */
/**
 * Created by soundstorm on 18.08.15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');

var payments = {
    _id: false,
    total: {type: Number, default: 0, set: setPrice},
    balance: {type: Number, default: 0, set: setPrice},
    unTaxed: {type: Number, default: 0, set: setPrice},
    taxes: {type: Number, default: 0, set: setPrice}
};

var products = {
    _id: false,
    quantity: {type: Number, default: 1},
    unitPrice: Number,
    product: {type: ObjectId, ref: 'Product', default: null},
    description: {type: String, default: ''},
    taxes: Number,
    subTotal: Number
};

var invoiceSchema = new mongoose.Schema({
    ID              : Number,
    invoice         : {
        _id     : {type: ObjectId, ref: 'Invoice', default: null},
        name    : String,
        assigned: {
            _id : {type: ObjectId, ref: 'Employee', default: null},
            name: String
        }
    },
    paidAmount      : {type: Number, default: 0, set: setPrice},
    date            : {type: Date, default: Date.now},
    name            : {type: String, default: '', unique: true},
    workflow        : {type: String, enum: ['Draft', 'Paid'], default: 'Paid'},
    differenceAmount: {type: Number, default: 0, set: setPrice},
    whoCanRW        : {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
    month           : {type: Number},
    year            : {type: Number},
    currency: {
        name: {type: String, default: 'USD'},
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
    editedBy : {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date, default: Date.now}
    },
    forSale      : {type: Boolean, default: true},
    paymentRef   : {type: String, default: ''},
    supplier     : {
        _id     : {type: ObjectId, ref: 'Customers', default: null},
        fullName: String
    },
    paymentMethod: {
        _id : {type: ObjectId, ref: 'PaymentMethod', default: null},
        name: String
    },
    period       : {type: ObjectId, ref: 'Destination', default: null},
    bonus        : {type: Boolean}
}, { collection: 'Payment' });

mongoose.model('PaymentOld', invoiceSchema);

if(!mongoose.Schemas) {
    mongoose.Schemas = {};
}

function setPrice(num) {
    return num * 100;
}

mongoose.Schemas['PaymentOld'] = invoiceSchema;

var InvoiceSchema = mongoose.Schemas['Payment'];
var wTrackInvoiceSchema = mongoose.Schemas['wTrackPayOut'];
var InvoiceSchemaOld = mongoose.Schemas['PaymentOld'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Invoice = dbObject.model("Payment", InvoiceSchema);
var InvoiceWeTrack = dbObject.model("wTrackPayOut", wTrackInvoiceSchema);

var InoiceOld = dbObject.model("PaymentNew", InvoiceSchemaOld);

var query = InoiceOld.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 100, function (invoice, callback) {
        var objectToSave = {};

        if (invoice) {
            objectToSave = {
                invoice: invoice.invoice ? invoice.invoice._id : null,

                supplier: invoice.supplier ? invoice.supplier._id : null,

                paymentMethod: invoice.paymentMethod ? invoice.paymentMethod._id : null
            };
        }

        if (invoice._type && invoice._type === 'Payment') {
            Invoice.update({_id: invoice._id}, objectToSave, callback);
        } else {
            InvoiceWeTrack.update({_id: invoice._id}, objectToSave, callback);
        }

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    })
});

