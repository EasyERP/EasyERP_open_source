/**
 * Created by soundstorm on 26.08.15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../models/index.js');
var async = require('async');

var paymentSchema = new mongoose.Schema({
    forSale:{type: Boolean, default: true},
    invoice: {type: ObjectId, ref: 'Invoice', default: null},
    supplier: {type: ObjectId, ref: 'Customers', default: null},
    paidAmount: {type: Number, default: 0},
    paymentMethod: {
        _id: {type: ObjectId, ref: 'PaymentMethod', default: null},
        name: String
    },
    date: {type: Date, default: Date.now},
    name: {type: String, default: '', unique: true},
    period: {type: ObjectId, ref: 'Destination', default: null},
    paymentRef: {type: String, default: ''},
    workflow: {type: String, enum: ['Draft', 'Paid'], default: 'Draft'},
    differenceAmount: {type: Number, default: 0},
    whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
    month: {type: Number},
    year:  {type: Number},
    bonus: {type: Boolean},

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
    }
}, {collection: 'Payment'});

mongoose.model('PaymentOld', paymentSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['PaymentOld'] = paymentSchema;

var PaymentSchema = mongoose.Schemas['Payment'];
var PaymentSchemaOld = mongoose.Schemas['PaymentOld'];

var dbObject = mongoose.createConnection('localhost', 'weTrack');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");
});

var Payment = dbObject.model("Payment", PaymentSchema);
var PaymentOld = dbObject.model("PaymentNew", PaymentSchemaOld);

var query = PaymentOld.find({forSale: false, bonus: true})
    .populate('supplier', 'name')
    .lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 100, function (payment, callback) {
        var objectToSave = {};

        if (payment) {
            objectToSave = {
                supplier: payment.supplier ? {
                    _id: payment.supplier._id,
                    name: (payment.supplier.name.first + ' ' +  payment.supplier.name.last)
                } : {
                    _id: null,
                    name: ''
                }
            };
        }

        Payment.update({_id: payment._id}, objectToSave, callback);
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    })
});