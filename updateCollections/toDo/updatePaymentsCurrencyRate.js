var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var _ = require('lodash');
var oxr = require('open-exchange-rates');
var moment = require('../../public/js/libs/moment/moment');

oxr.set({app_id: '90432684fb4f46f483317e4ec2cd8bcc'});
require('../../models/index.js');

var PaymentSchema = mongoose.Schemas['Payment'];
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

var Payment = dbObject.model("Payment", PaymentSchema);

Payment.aggregate([
		{
			$lookup: {
				from        : 'Invoice',
				localField  : 'invoice',
				foreignField: '_id',
				as          : 'invoice'
			}
		},
		{
			$project: {
				invoice : {$arrayElemAt: ['$invoice', 0]},
				date    : 1
			}
		},
		{
			$lookup: {
				from        : 'currency',
				localField  : 'invoice.currency._id',
				foreignField: '_id',
				as          : 'currency'
			}
		},
		{
			$project: {
				date        : 1,
				currency: {$arrayElemAt: ['$currency', 0]}
			}
		}
	],
	function (error, payments) {
		if (error) {
			return console.dir(error);
		}

		async.eachLimit(payments, 50, function (payment, callback) {
			var date = moment(payment.date).format('YYYY-MM-DD');

			oxr.historical(date, function () {
				var currency = {};
				var objectToSave;

				if (!payment.currency) {
					currency.rate = 1;
					currency._id = ObjectId("565eab29aeb95fa9c0f9df2d");
				} else {
					currency.rate = oxr.rates[payment.currency.name];
					currency._id = payment.currency._id;
				}

				objectToSave = {
					currency: currency
				};

				Payment.update({_id: payment._id}, objectToSave, callback);
				//callback();
			});

		}, function (err) {
			if (err) {
				return console.dir(err);
			}
			console.dir('Good');
		});
	});
