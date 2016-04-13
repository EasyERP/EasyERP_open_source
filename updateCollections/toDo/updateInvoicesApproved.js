var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

require('../../models/index.js');

var InvoiceSchema = mongoose.Schemas['wTrackInvoice'];
var connectOptions = {
	user: 'easyerp',
	pass: '1q2w3e!@#',
	w   : 1,
	j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'maxdb', 28017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
	console.log("Connection to production is success");
});

var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);

Invoice.update({}, {$set: {approved: true}}, {multi: true},
	function (err, invoices) {
		if (err) {
			return console.dir(err);
		}
		console.dir('Good');
	});
