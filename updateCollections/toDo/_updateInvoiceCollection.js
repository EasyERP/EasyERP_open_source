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
    name            : {type: String, default: ''},
    forSales        : {type: Boolean, default: true},
    supplier        : {
        _id : {type: ObjectId, ref: 'Customers', default: null},
        name: String
    },
    sourceDocument  : {type: ObjectId, ref: 'Quotation', default: null},//should be order in invoice case
    paymentReference: {type: String, default: 'free'},

    invoiceDate: {type: Date, default: Date.now},
    dueDate    : Date,
    paymentDate: Date,
    journal: {type: ObjectId, ref: 'journal', default: null},
    currency: {
        _id : {type: ObjectId, ref: 'currency', default: null},
        name: {type: String, default: ''},
        rate: {type: Number, default: 1}
    },

    salesPerson : {
        _id : {type: ObjectId, ref: 'Employees', default: null},
        name: String
    },
    paymentTerms: {type: ObjectId, ref: 'PaymentTerm', default: null},

    paymentInfo: payments,
    payments   : [{type: ObjectId, ref: 'Payment', default: null}],

    workflow: {
        _id   : {type: ObjectId, ref: 'workflows', default: null},
        name  : String,
        status: String
    },
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
    forSales: {type: Boolean, default: true},
    products: [{
        _id        : false,
        quantity   : {type: Number, default: 1},
        unitPrice  : Number,
        product    : {type: ObjectId, ref: 'Product', default: null},
        description: {type: String, default: ''},
        jobs       : {type: ObjectId, ref: "jobs", default: null},
        taxes      : {type: Number, default: 0},
        subTotal   : Number
    }],
    project :{
        _id: {type: ObjectId, ref: 'Project', default: null},
        name: String
    }
}, { collection: 'Invoice' });

mongoose.model('InvoiceOld', invoiceSchema);

if(!mongoose.Schemas) {
    mongoose.Schemas = {};
}

function setPrice(num) {
    return num * 100;
}

mongoose.Schemas['InvoiceOld'] = invoiceSchema;

var InvoiceSchema = mongoose.Schemas['Invoice'];
var wTrackInvoiceSchema = mongoose.Schemas['wTrackInvoice'];
var InvoiceSchemaOld = mongoose.Schemas['InvoiceOld'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Invoice = dbObject.model("Invoice", InvoiceSchema);
var InvoiceWeTrack = dbObject.model("wTrackInvoice", wTrackInvoiceSchema);

var InoiceOld = dbObject.model("InvoiceNew", InvoiceSchemaOld);

var query = InoiceOld.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 100, function (invoice, callback) {
        var objectToSave = {};

        if (invoice) {
            objectToSave = {
                salesPerson: invoice.salesPerson ? invoice.salesPerson._id : null,

                supplier: invoice.supplier ? invoice.supplier._id : null,

                workflow: invoice.workflow ? invoice.workflow._id : null
            };
        }

        if (invoice._type === 'wTrackInvoice') {
            objectToSave['project'] = invoice.project ? invoice.project._id : null
        }

        if (invoice._type && invoice._type === 'wTrackInvoice') {
            InvoiceWeTrack.update({_id: invoice._id}, objectToSave, callback);
        } else {
            Invoice.update({_id: invoice._id}, objectToSave, callback);
        }

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    })
});

