var mongoose        = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES       = require('../constants/responses');

var Proforma = function (models, event) {
	"use strict";

	var async           = require('async');

	var ProformaSchema  = mongoose.Schemas.Proforma;
	var CustomerSchema  = mongoose.Schemas.Customer;
	var QuotationSchema = mongoose.Schemas.Quotation;

	var workflowHandler = new WorkflowHandler(models);


	this.create = function (req, res, next) {
		var dbIndex   = req.session.lastDb;
		var id        = req.body.quotationId;
		var Proforma  = models.get(dbIndex, 'Proforma', ProformaSchema);
		var Company   = models.get(dbIndex, 'Customer', CustomerSchema);
		var Quotation = models.get(dbIndex, 'Quotation', QuotationSchema);
		var request;
		var parallelTasks;
		var waterFallTasks;

		function fetchFirstWorkflow(callback) {
			request = {
				query  : {
					wId         : 'Sales Invoice',
				},
				session: req.session
			};
			workflowHandler.getFirstForConvert(request, callback);
		}

		function findQuotation(callback) {
			var query = Quotation.findById(id).lean();

			query
				.populate('products.product')
				.populate('products.jobs')
				.populate('project', '_id projectName projectmanager');

			query.exec(callback)
		};

		function parallel(callback) {
			async.parallel(parallelTasks, callback);
		};

		function createProforma(parallelResponse, callback) {
			var quotation;
			var workflow;
			var err;
			var proforma;
			var supplier;
			var query;

			if (parallelResponse && parallelResponse.length) {
				quotation    = parallelResponse[0];
				workflow = parallelResponse[1];
			} else {
				err        = new Error(RESPONSES.BAD_REQUEST);
				err.status = 400;

				return callback(err);
			}

			delete quotation._id;


			proforma = new Proforma(quotation);


			if (req.session.uId) {
				proforma.createdBy.user = req.session.uId;
				proforma.editedBy.user  = req.session.uId;
			}

			proforma.sourceDocument      = id;
			proforma.paymentReference    = quotation.name;
			proforma.workflow            = workflow._id;
			proforma.paymentInfo.balance = quotation.paymentInfo.total;


			proforma.supplier = quotation['supplier'];


			query = Company.findById(proforma.supplier).lean();

			query.populate('salesPurchases.salesPerson', 'name');

			query.exec(function (err, result) {
				if (err) {
					callback(err)
				}

				if (result && result.salesPurchases.salesPerson) {
					proforma.salesPerson = result.salesPurchases.salesPerson._id;
				}

				proforma.save(callback);
			});
		};

		parallelTasks  = [findQuotation, fetchFirstWorkflow];
		waterFallTasks = [parallel, createProforma];

		async.waterfall(waterFallTasks, function (err, result) {
			if (err) {
				return next(err)
			}

			res.status(201).send(result);

		});
	};
};

module.exports = Proforma;
