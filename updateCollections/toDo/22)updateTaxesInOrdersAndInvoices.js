var mongoose = require('mongoose');
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;

require('../../models/index.js');

var OrderRowsSchema = mongoose.Schemas.OrderRow;
var InvoiceSchema = mongoose.Schemas.Invoice;
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
var dbObject = mongoose.createConnection('localhost', 'CRM');
var OrderRow = dbObject.model('orderRows', OrderRowsSchema);
var Invoice = dbObject.model('Invoice', InvoiceSchema);
var images;

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log('Connection to production is success');
});

async.parallel([
    function (pCb) {
        OrderRow.find({}, function (err, result) {
            if (err) {
                return console.log(err);
            }

            result.forEach(function (el) {
               // console.log(el.taxes, typeof(el.taxes) === 'Number' || el.taxes === null);
               // if (typeof(el.taxes) === 'Number' || el.taxes === null) {
                 //   var id = el._id.toString();

                    OrderRow.findByIdAndUpdate(el._id, {$set: {taxes: []}}, function(err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        console.log('ok');
                    });
               // }
            });

            pCb();
        });
    },
    function (pCb) { //todo change taxes for invoices too
        pCb();
    }
], function (err, result) {
    if (err) {
        return console.error(err);
    }

    console.log('taxes in Order Rows was been updated');
});
