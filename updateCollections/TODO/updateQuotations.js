/**
 * Created by lilya on 27/11/15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var QuotationSchema = mongoose.Schemas['Quotation'];
var async = require('async');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Quotation = dbObject.model("Quotation", QuotationSchema);

var query = Quotation.find() .lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.each(_res, function (quot, callback) {

        var workNotQuoted = {
            _id: "55647b932e4aa3804a765ec5",
            name: "Not Quoted"
        };

        var workNotInvoiced = {
            _id: "56586521d89184c0049e6a7d",
            name: "Not Invoiced"
        };

        var Invoiced = {
            _id: "55647b962e4aa3804a765ec6",
            name: "Invoiced"
        };

        if (quot.type === 'Not Ordered'){
            Quotation.update({_id: quot._id}, {$set: {workflow: workNotQuoted}}, callback);
        } else if (quot.type === 'Not Invoiced'){
            Quotation.update({_id: quot._id}, {$set: {workflow: workNotInvoiced}}, callback);
        } else if (quot.type === 'Invoiced'){
            Quotation.update({_id: quot._id}, {$set: {workflow: Invoiced}}, callback);
        }

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        return console.dir('Good');
    })
});