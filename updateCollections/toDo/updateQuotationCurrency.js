require('../../models/index.js');
var async = require('async');

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;
var currencyHalper = require('../../helpers/currency');

/*var payments = {
 _id    : false,
 id     : false,
 total  : {type: Number, default: 0},
 unTaxed: {type: Number, default: 0},
 taxes  : {type: Number, default: 0}
 };

 var products = {
 _id          : false,
 id           : false,
 scheduledDate: {type: Date},
 quantity     : {type: Number, default: 1},
 taxes        : {type: Number},
 subTotal     : Number,
 unitPrice    : Number,
 product      : {type: ObjectId, ref: 'Product', default: null},
 description  : {type: String, default: ''},
 jobs         : {type: ObjectId, ref: "jobs", default: null}
 };

 var quotationSchema = new Schema({
 currency      : {
 _id : {type: ObjectId, ref: 'currency', default: null},
 rate: {type: Number, default: 1}
 },
 forSales      : {type: Boolean, default: true},
 type          : {type: String, default: 'Not Ordered', enum: ['Not Ordered', 'Not Invoiced', 'Invoiced']},
 isOrder       : {type: Boolean, default: false},
 supplier      : {type: ObjectId, ref: 'Customers', default: null},
 project       : {type: ObjectId, ref: 'Project', default: null},
 deliverTo     : {type: ObjectId, ref: 'DeliverTo', default: null},
 orderDate     : {type: Date, default: Date.now},
 expectedDate  : Date,
 name          : {type: String, default: 'PO', unique: true},
 destination   : {type: ObjectId, ref: 'Destination', default: null},
 incoterm      : {type: ObjectId, ref: 'Incoterm', default: null},
 invoiceControl: {type: ObjectId, ref: 'InvoicingControl', default: null},
 invoiceRecived: {type: Boolean, default: false},
 paymentTerm   : {type: ObjectId, ref: 'PaymentTerm', default: null},
 paymentInfo   : payments,
 products      : [products],
 workflow      : {type: ObjectId, ref: 'workflows', default: null},
 whoCanRW      : {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
 groups        : {
 owner: {type: ObjectId, ref: 'Users', default: null},
 users: [{type: ObjectId, ref: 'Users', default: null}],
 group: [{type: ObjectId, ref: 'Department', default: null}]
 },
 creationDate  : {type: Date, default: Date.now},
 createdBy     : {
 user: {type: ObjectId, ref: 'Users', default: null},
 date: {type: Date, default: Date.now}
 },
 editedBy      : {
 user: {type: ObjectId, ref: 'Users', default: null},
 date: {type: Date, default: Date.now}
 }
 }, {collection: 'Quotation'});*/

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Cuotation = dbObject.model("Quotation", Schema.Quotation);
var Invoice = dbObject.model("wTrackInvoice", Schema.wTrackInvoice);

var query = Cuotation.find({'currency._id': null});

var invoiceQuery = Invoice.find({'currency._id': null});

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 100, function (emp, callback) {
        var currency = {};

        if (emp) {
            currency._id = '565eab29aeb95fa9c0f9df2d';
            currency.rate = 1;

            Cuotation.update({_id: emp._id}, {$set: {currency: currency}}, callback);
        } else {
            callback();
        }
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});

invoiceQuery.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 100, function (emp, callback) {
        var currency = {};

        if (emp) {
            currency._id = '565eab29aeb95fa9c0f9df2d';
            currency.rate = 1;

            Invoice.update({_id: emp._id}, {$set: {currency: currency}}, callback);
        } else {
            callback();
        }
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});
