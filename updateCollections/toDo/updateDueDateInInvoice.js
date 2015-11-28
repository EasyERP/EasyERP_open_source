/**
 * Created by soundstorm on 06.08.15.
 */

/**
 * Created by Roman on 04.04.2015.
 */

var mongoose = require('mongoose');
var moment = require('../../public/js/libs/moment/moment');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');

var jobsInvoiceSchema = mongoose.Schemas['wTrackInvoice'];

var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");
});

var Invoice = dbObject.model("wTrackInvoice", jobsInvoiceSchema);

var query = Invoice.find({dueDate: {$exists: false}});

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }
    _res.forEach(function (wt) {
        var date = moment(wt.invoiceDate);
        date.add(15, 'days');
        date = date.toDate();

        Invoice.findByIdAndUpdate(wt._id, {$set: {dueDate: date}}, function (err, response) {
            if (err) {
                console.log(err);
            }

            console.log(response);
        });
    });
});
