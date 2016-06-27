

var mongoose = require('mongoose');
require('../../models/index.js');
var InvoiceSchema = mongoose.Schemas['wTrackInvoice'];
var async = require('async');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Invoice = dbObject.model('wTrackInvoice', InvoiceSchema);

var query = Invoice.find({forSales: true, _type: 'wTrackInvoice'}).lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.each(_res, function (project, callback) {
        var attachments = project.attachments || [];
        var newAttachments = [];

        attachments.forEach(function(_attach){
            var url = 'uploads/invoices/' + project._id + '/' + _attach.name;

            url = encodeURIComponent(url);

            _attach.shortPas = url;
            newAttachments.push(_attach);
        });
        Invoice.update({_id: project._id}, {$set: {attachments: newAttachments}}, callback);

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        return console.dir('Good');
    });
});