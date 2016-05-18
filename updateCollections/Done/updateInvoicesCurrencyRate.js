var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var _ = require('lodash');
var oxr = require('open-exchange-rates');
var moment = require('../../public/js/libs/moment/moment');

oxr.set({app_id: '90432684fb4f46f483317e4ec2cd8bcc'});
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

Invoice.aggregate([
		{
			$match: {
				'currency._id': {$exists: true}
			}
		},
		{
			$lookup: {
				from        : 'currency',
				localField  : 'currency._id',
				foreignField: '_id',
				as          : 'currency.obj'
			}
		},
		{
			$project: {
				'currency'  : {$arrayElemAt: ['$currency.obj', 0]},
				creationDate: 1
			}
		}
	],
	function (error, invoices) {
		if (error) {
			return console.dir(error);
		}

		async.eachLimit(invoices, 50, function (invoice, callback) {
			var date = moment(invoice.creationDate).format('YYYY-MM-DD');

			oxr.historical(date, function () {
				var currency = {};
				var objectToSave;

				currency.rate = oxr.rates[invoice.currency.name];
				currency._id = invoice.currency._id;

				if (currency.rate !== 1) {
					console.log(currency.rate, invoice.creationDate);
				}

				objectToSave = {
					currency: currency
				};

				Invoice.update({_id: invoice._id}, objectToSave, callback);
				//callback();
			});

		}, function (err) {
			if (err) {
				return console.dir(err);
			}
			console.dir('Good');
		});
	});
