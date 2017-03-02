/**
 * Created by liliya on 29.10.15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var ProjectSchema = mongoose.Schemas['Project'];
var moment = require('../../public/js/libs/moment/moment');
var _ = require('../../node_modules/underscore');
var async = require('async');
var PaymentSchema = mongoose.Schemas['Payment'];
var InvoiceSchema = mongoose.Schemas['Invoice'];
var JobsSchema = mongoose.Schemas['jobs'];
var WtrackSchema = mongoose.Schemas['wTrack'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var Project = dbObject.model('Project', ProjectSchema);
    var Job = dbObject.model("jobs", JobsSchema);
    var Payment = dbObject.model("Payment", PaymentSchema);
    var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);
    var Wtrack = dbObject.model("wTrack", WtrackSchema);

    Job.aggregate({
        $match: {invoice: {$ne: null}}
    }, {
        $group: {
            _id: '$invoice',
            minDate: {$min: '$budget.budgetTotal.minDate'},
            maxDate: {$min: '$budget.budgetTotal.maxDate'}
        }
    }, {
        $lookup: {
            from: 'Invoice',
            localField: '_id',
            foreignField: '_id',
            as: '_id'
        }
    }, {
        $project: {
            _id: {$arrayElemAt: ["$_id", 0]},
            minDate: 1,
            maxDate: 1
        }
    }, function (err, result) {
        if (err) {
            return console.log(err);
        }
        var count = 0;

        result.forEach(function (res) {
            if (res._id && res._id.payments && (res._id.payments.length === 1) && (res.maxDate !== 201653)){
                var invoice = res._id.invoiceDate;
                var key = moment(invoice).isoWeekYear() * 100 + moment(invoice).isoWeek();
                if (res.maxDate){
                    var year = res.maxDate.toString().slice(0, 4);
                    var week = res.maxDate.toString().slice(4);
                    var newDate = moment().isoWeekYear(year).isoWeek(week).endOf('isoWeek');

                    if (key < res.maxDate){
                        console.log(key, res.maxDate, res._id.project, res._id._id, res._id.name);

                        Invoice.findByIdAndUpdate(res._id._id, {$set: {invoiceDate: new Date(newDate), paymentDate: new Date(moment(newDate).subtract(1, 'days'))}}, function (err, result) {
                            if (err){
                                return console.log(err);
                            }
                            result.payments.forEach(function (paym) {
                                Payment.findByIdAndUpdate(paym, {$set: {date: new Date(result.paymentDate)}}, function (err, result) {
                                    if (err){
                                        return console.log(err);
                                    }

                                    console.log('success')
                                })
                            });

                        });
                        count++;
                    }
                }
                }

        });

        console.log(count);
    })
});
