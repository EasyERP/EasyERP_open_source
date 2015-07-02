/**
 * Created by Roman on 04.05.2015.
 */

/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var async = require('async');
var WorkflowHandler = require('./workflow');

var Payment = function (models) {
    var access = require("../Modules/additions/access.js")(models);

    var PaymentSchema = mongoose.Schemas['Payment'];
    var InvoiceSchema = mongoose.Schemas['Invoice'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var waterfallTasks;

    this.getAll = function (req, res, next) {
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var query = {};

        Payment.find(query, function (err, payments) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: payments});
        });
    };

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;
        var forSale = req.params.byType === 'customers';

        switch (viewType) {
            case "list":
                getPaymentFilter(req, res, next, forSale);
                break;
            /*case "form":
                getProductsById(req, res, next);
                break;*/
        }
    };

    function getPaymentFilter(req, res, next, forSale) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 60, function (access) {
                if (access) {
                    var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
                    var optionsObject = {forSale: forSale};
                    var sort = {};
                    var count = req.query.count ? req.query.count : 50;
                    var page = req.query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (req.query.sort) {
                        sort = req.query.sort;
                    } else {
                        sort = {"name": 1};
                    }

                    departmentSearcher = function (waterfallCallback) {
                        models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                            {
                                $match: {
                                    users: objectId(req.session.uId)
                                }
                            }, {
                                $project: {
                                    _id: 1
                                }
                            },
                            waterfallCallback);
                    };

                    contentIdsSearcher = function (deps, waterfallCallback) {
                        var arrOfObjectId = deps.objectID();

                        Payment.aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.users': objectId(req.session.uId)}
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.group': {$in: arrOfObjectId}}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'owner'},
                                                        {'groups.owner': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {whoCanRW: "everyOne"}
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            waterfallCallback
                        );
                    };

                    contentSearcher = function (paymentsIds, waterfallCallback) {
                        optionsObject._id = {$in: paymentsIds};
                        var query = Payment.find(optionsObject).limit(count).skip(skip).sort(sort);

                        query.populate('supplier', '_id name fullName');

                        query.exec(waterfallCallback);
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function(err, result){
                        if(err){
                            return next(err);
                        }
                        res.status(200).send(result);
                    });
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    this.create = function (req, res, next) {
        var body = req.body;
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var workflowHandler = new WorkflowHandler(models);
        var invoiceId = body.invoice;

        function fetchInvoice(waterfallCallback) {
            Invoice.findById(invoiceId, waterfallCallback);
        };

        function savePayment(invoice, waterfallCallback) {
            var payment = new Payment(body);

            //payment.paidAmount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
            payment.name = invoice.sourceDocument;
            payment.whoCanRW = invoice.whoCanRW;
            payment.groups = invoice.groups;
            payment.createdBy.user = req.session.uId;
            payment.editedBy.user = req.session.uId;

            payment.save(function (err, payment) {
                if (err) {
                    return waterfallCallback(err);
                }
                waterfallCallback(null, invoice, payment);
            });
        };

        function invoiceUpdater(invoice, payment, waterfallCallback) {
            var totalToPay = (invoice.paymentInfo) ? invoice.paymentInfo.balance : 0;
            var paid = payment.paidAmount;
            var isNotFullPaid;
            var request = {
                query: {
                    wId: 'Purchase Invoice',
                    source: 'purchase',
                    targetSource: 'invoice'
                },
                session: req.session
            };

            totalToPay = parseFloat(totalToPay);
            paid = parseFloat(paid);

            isNotFullPaid = paid < totalToPay;

            if (isNotFullPaid) {
                request.query.status = 'In Progress';
                request.query.order = 1;
            } else {
                request.query.status = 'Done';
                request.query.order = 1;
            }

            workflowHandler.getFirstForConvert(request, function(err, workflow){
                if(err){
                    return waterfallCallback(err);
                }

                invoice.workflow = workflow._id;
                invoice.paymentInfo.balance = (totalToPay - paid).toFixed(2);
                invoice.paymentInfo.unTaxed = paid.toFixed(2);
                invoice.payments.push(payment._id);
                invoice.save(waterfallCallback);
            });
        };

        waterfallTasks = [fetchInvoice, savePayment, invoiceUpdater];

        async.waterfall(waterfallTasks, function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: response});
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var forSale = req.params.byType === 'customers';

        var queryObject;

        var departmentSearcher;
        var contentIdsSearcher;

        var contentSearcher;
        var waterfallTasks;

        if(forSale) {
            queryObject = {
                forSale: forSale
            };
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var arrOfObjectId = deps.objectID();

            models.get(req.session.lastDb, "Payment", PaymentSchema).aggregate(
                {
                    $match: {
                        $and: [
                            queryObject,
                            {
                                $or: [
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.users': objectId(req.session.uId)}
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.group': {$in: arrOfObjectId}}
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $and: [
                                            {whoCanRW: 'owner'},
                                            {'groups.owner': objectId(req.session.uId)}
                                        ]
                                    },
                                    {whoCanRW: "everyOne"}
                                ]
                            }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (paymentIds, waterfallCallback) {
            var query;
            var queryObject = {_id: {$in: paymentIds}};

            query = Payment.find(queryObject);
            query.count(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result});
        });
    };
};

module.exports = Payment;