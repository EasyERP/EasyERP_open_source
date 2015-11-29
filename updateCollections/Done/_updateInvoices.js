/**
 * Created by lilya on 27/11/15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var InvoiceSchema = mongoose.Schemas['wTrackInvoice'];
var async = require('async');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);

var query = Invoice.find({'workflow.name':'Draft'}).lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.each(_res, function (invoice, callback) {

        var updateObject = {
            _id: "55647d932e4aa3804a765ec9",
            name: "Unpaid",
            status: 'New'
        };

        Invoice.update({_id: invoice._id}, {$set: {workflow: updateObject}}, callback);

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        return console.dir('Good');
    })
});