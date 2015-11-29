/**
 * Created by lilya on 24/11/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');
var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    var customerSchema = mongoose.Schemas['Customer'];
    var Customer = dbObject.model("Customers", customerSchema);
    var InvoiceSchema = mongoose.Schemas['wTrackInvoice'];
    var Invoice = dbObject.model('wTrackInvoice', InvoiceSchema);

    var PaymentSchema = mongoose.Schemas['Payment'];
    var Payment = dbObject.model('Payment', PaymentSchema);

    var ProjectSchema = mongoose.Schemas['Project'];
    var Project = dbObject.model('Project', ProjectSchema);

    var QuotationSchema = mongoose.Schemas['Quotation'];
    var Quotation = dbObject.model('Quotation', QuotationSchema);

    var wTrackSchema = mongoose.Schemas['wTrack'];
    var wTrack = dbObject.model('wTrack', wTrackSchema);
    var CONSTANTS = require('../../constants/mainConstants');

    var count = 0;

    var query = Customer.find().lean();

    query.exec(function(err, customers){
        if (err){
            console.log(err);
        }

        async.each(customers, function(customer, cb){
            var fullName = customer.name ? customer.name.first + ' ' + customer.name.last : '';
            var customerId = customer._id;

            var parallelTasks = [
                function invoiceUpdater(parallelCb){
                    Invoice.update({'supplier._id': customerId}, {$set: {'supplier.name': fullName}}, parallelCb);
                },
                function paymentUpdater(parallelCb){
                    Payment.update({'supplier._id': customerId}, {$set: {'supplier.fullName': fullName}}, parallelCb);
                },
                function projectUpdater(parallelCb){
                    Project.update({'customer._id': customerId}, {$set: {'customer.name': fullName}}, parallelCb);
                },
                function quotationUpdater(parallelCb){
                    Quotation.update({'supplier._id': customerId}, {$set: {'supplier.name': fullName}}, parallelCb);
                },
                function wTrackUpdater(parallelCb){
                    wTrack.update({'project.customer._id': customerId}, {$set: {'project.customer.name': fullName}}, parallelCb);
                }
            ];

            async.parallel(parallelTasks, function(err){
                "use strict";
                if(err){
                    return cb(err);
                }

                cb();
            });

        }, function(err){
            if(err){
                return console.error(err);
            }

            console.log('All done');

            dbObject.close();
        });
    });

});