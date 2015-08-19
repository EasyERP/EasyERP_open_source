/**
 * Created by soundstorm on 18.08.15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../models/index.js');
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
    forSales: {type: Boolean, default: true},
    supplier: { type: ObjectId, ref: 'Customers', default: null },
    /*fiscalPosition: { type: String, default: null },*/
    sourceDocument: { type: String, default: null },
    supplierInvoiceNumber: { type: String, default: null },
    paymentReference: { type: String, default: 'free' },

    invoiceDate: { type: Date, default: Date.now },
    dueDate: Date,
    paymentDate: Date,
    account: { type: String, default: null },
    journal: { type: String, default: null },

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

mongoose.model('InvoiceOld', invoiceSchema);

if(!mongoose.Schemas) {
    mongoose.Schemas = {};
}

function setPrice(num) {
    return num * 100;
}

mongoose.Schemas['InvoiceOld'] = invoiceSchema;

var InvoiceSchema = mongoose.Schemas['Invoice'];
var InvoiceSchemaOld = mongoose.Schemas['InvoiceOld'];

var dbObject = mongoose.createConnection('localhost', 'weTrack');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");
});

var Invoice = dbObject.model("Invoice", InvoiceSchema);
var InoiceOld = dbObject.model("InvoiceNew", InvoiceSchemaOld);

var query = InoiceOld.find()
    .populate('workflow', 'name')
    .populate('salesPerson', 'name')
    .populate('project', 'projectName')
    .populate('supplier', 'name')
    .lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 100, function (invoice, callback) {
        var objectToSave = {};

        if (invoice) {
            objectToSave = {
                salesPerson: invoice.salesPerson ? {
                    _id: invoice.salesPerson._id,
                    name: invoice.salesPerson.name.last
                        ? (invoice.salesPerson.name.first + ' ' +  invoice.salesPerson.name.last)
                        : invoice.salesPerson.name.first,
                } : {
                    _id: null,
                    name: null
                },

                supplier: invoice.supplier ? {
                    _id: invoice.supplier._id,
                    name: invoice.supplier.name.last
                        ? (invoice.supplier.name.first + ' ' +  invoice.supplier.name.last)
                        : invoice.supplier.name.first,
                } : {
                    _id: null,
                    name: null
                },

                workflow: invoice.workflow ? {
                    _id: invoice.workflow._id,
                    name: invoice.workflow.name
                } : {
                    _id: null,
                    name: null
                },
                project: invoice.project ? {
                    _id: invoice.project._id,
                    name: invoice.project.projectName
                } : {
                    _id: null,
                    name: null
                }
            };
        }

        Invoice.update({_id: invoice._id}, objectToSave, callback);
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    })
});

