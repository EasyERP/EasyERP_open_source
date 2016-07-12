/*TODO remove caseFilter methid after testing filters*/
var mongoose = require('mongoose');
var async = require('async');
var WorkflowHandler = require('./workflow');
var _ = require('lodash');
var oxr = require('open-exchange-rates');
var fx = require('money');
var moment = require('../public/js/libs/moment/moment');
var MAIN_CONSTANTS = require('../constants/mainConstants');

var wTrackPayOutSchema = mongoose.Schemas.wTrackPayOut;
var currencySchema = mongoose.Schemas.Currency;
var PaymentSchema = mongoose.Schemas.Payment;
var salaryPaymentSchema = mongoose.Schemas.salaryPayment;
var payrollSchema = mongoose.Schemas.PayRoll;
var JobsSchema = mongoose.Schemas.jobs;
var wTrackInvoiceSchema = mongoose.Schemas.wTrackInvoice;
var ExpensesInvoiceSchema = mongoose.Schemas.expensesInvoice;
var DividendInvoiceSchema = mongoose.Schemas.dividendInvoice;
var ProformaSchema = mongoose.Schemas.Proforma;
var payRollInvoiceSchema = mongoose.Schemas.payRollInvoice;
var DepartmentSchema = mongoose.Schemas.Department;
var wTrackSchema = mongoose.Schemas.wTrack;
var journalSchema = mongoose.Schemas.journal;
var objectId = mongoose.Types.ObjectId;

var Module = function (models, event) {
    'use strict';
    var composeExpensesAndCache = require('../helpers/expenses')(models);

    var rewriteAccess = require('../helpers/rewriteAccess');
    var JournalEntryHandler = require('./journalEntry');
    var journalEntry = new JournalEntryHandler(models);
    var pageHelper = require('../helpers/pageHelper');

    var FilterMapper = require('../helpers/filterMapper');

    oxr.set({app_id: process.env.OXR_APP_ID});

    function returnModuleId(req) {
        var moduleId;
        var type = req.params.byType;

        moduleId = type === 'customers' ? 61 : (type === 'supplier') ? 60 : 79;

        return moduleId;
    }

    function returnModel(req) {
        var moduleId = returnModuleId(req);
        var Payment;

        if (moduleId === 61) {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        } else if (moduleId === 79) {
            Payment = models.get(req.session.lastDb, 'salaryPayment', salaryPaymentSchema);
        } else if (moduleId === 60) {
            Payment = models.get(req.session.lastDb, 'wTrackPayOut', wTrackPayOutSchema);
        }

        return Payment;
    }

    /*function ConvertType(array, type) {
     var i;

     if (type === 'integer') {
     for (i = array.length - 1; i >= 0; i--) {
     array[i] = parseInt(array[i], 10);
     }
     } else if (type === 'boolean') {
     for (i = array.length - 1; i >= 0; i--) {
     if (array[i] === 'true') {
     array[i] = true;
     } else if (array[i] === 'false') {
     array[i] = false;
     } else {
     array[i] = null;
     }
     }
     }
     }*/

    /*function caseFilter(filter) {
     var condition;
     var resArray = [];
     var filtrElement = {};
     var key;
     var filterName;
     var i;
     var filterKeys = Object.keys(filter);

     for (i = filterKeys.length - 1; i >= 0; i--) {
     filterName = filterKeys[i];
     condition = filter[filterName].value ? filter[filterName].value : [];
     key = filter[filterName].key;

     switch (filterName) {
     case 'assigned':
     filtrElement[key] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'name':
     filtrElement[key] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'supplier':
     filtrElement[key] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'paymentMethod':
     filtrElement[key] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'workflow':
     filtrElement[key] = {$in: condition};
     resArray.push(filtrElement);
     break;
     case 'forSale':
     condition = ConvertType(condition, 'boolean');
     filtrElement[key] = condition;
     resArray.push(filtrElement);
     break;
     case 'paymentRef':
     filtrElement[key] = {$in: condition};
     resArray.push(filtrElement);
     break;
     case 'year':
     ConvertType(condition, 'integer');
     filtrElement[key] = {$in: condition};
     resArray.push(filtrElement);
     break;
     case 'month':
     ConvertType(condition, 'integer');
     filtrElement[key] = {$in: condition};
     resArray.push(filtrElement);
     break;
     // skip default;
     }
     }

     return resArray;
     }*/

    function getPaymentFilter(req, res, next, options) {
        var moduleId = returnModuleId(req);
        var data = req.query;
        var contentType = data.contentType;
        var filter = data.filter || {};
        var forSale = options ? !!options.forSale : false;
        var bonus = options ? !!options.bonus : false;
        var salary = options ? !!options.salary : false;
        var expenses = options ? !!options.expenses : false;
        var dividend = options ? !!options.dividend : false;
        var Payment = returnModel(req, options);
        var supplier = 'Customers';
        var paymentMethod = 'PaymentMethod';
        var optionsObject = {}; // {forSale: forSale};
        var sort = {};
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;
        var key;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var filterMapper = new FilterMapper();

        if (req.query.sort) {
            key = Object.keys(req.query.sort)[0];
            req.query.sort[key] = parseInt(req.query.sort[key], 10);
            sort = req.query.sort;
        } else {
            sort = {date: -1};
        }

        optionsObject.$and = [];

        if (filter && typeof filter === 'object') {
            optionsObject.$and.push(filterMapper.mapFilter(filter, contentType)); // caseFilter(filter);
        }

        if (!salary) {
            optionsObject.$and.push({forSale: forSale});
        } else {
            optionsObject.$and.push({isExpense: true});
            paymentMethod = 'ProductCategory';
        }

        if (bonus) {
            //  optionsObject.$and.push({bonus: bonus}); //todo   this is case of no view purchase payments in supplier payments
            supplier = 'Employees';
        }

        if (!forSale && !dividend && !expenses) {
            optionsObject.$and.push({_type: {$nin: ['expensesInvoicePayment', 'dividendInvoicePayment']}});
        }

        if (expenses) {
            optionsObject.$and.push({_type: 'expensesInvoicePayment'});
        }

        if (dividend) {
            optionsObject.$and.push({_type: 'dividendInvoicePayment'});
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, 'Department', DepartmentSchema).aggregate(
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
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $and: [
                    // optionsObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };

            Payment.aggregate(
                {
                    $match: matchQuery
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
            var salesManagerMatch;

            optionsObject.$and.push({_id: {$in: _.pluck(paymentsIds, '_id')}});
            salesManagerMatch = {
                $and: [
                    {$eq: ['$$projectMember.projectPositionId', objectId(MAIN_CONSTANTS.SALESMANAGER)]},
                    {
                        $or: [{
                            $and: [{
                                $eq: ['$$projectMember.startDate', null]
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }, {
                            $and: [{
                                $lte: ['$$projectMember.startDate', '$quotation.orderDate']
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }, {
                            $and: [{
                                $eq: ['$$projectMember.startDate', null]
                            }, {
                                $gte: ['$$projectMember.endDate', '$quotation.orderDate']
                            }]
                        }, {
                            $and: [{
                                $lte: ['$$projectMember.startDate', '$quotation.orderDate']
                            }, {
                                $gte: ['$$projectMember.endDate', '$quotation.orderDate']
                            }]
                        }]
                    }]
            };

            Payment.aggregate([{
                $lookup: {
                    from        : supplier,
                    localField  : 'supplier',
                    foreignField: '_id',
                    as          : 'supplier'
                }
            }, {
                $lookup: {
                    from        : 'Invoice',
                    localField  : 'invoice',
                    foreignField: '_id',
                    as          : 'invoice'
                }
            }, {
                $lookup: {
                    from        : paymentMethod,
                    localField  : 'paymentMethod',
                    foreignField: '_id',
                    as          : 'paymentMethod'
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $lookup: {
                    from        : 'currency',
                    localField  : 'currency._id',
                    foreignField: '_id',
                    as          : 'currency.obj'
                }
            }, {
                $project: {
                    supplier        : {$arrayElemAt: ['$supplier', 0]},
                    invoice         : {$arrayElemAt: ['$invoice', 0]},
                    paymentMethod   : {$arrayElemAt: ['$paymentMethod', 0]},
                    journal         : {$arrayElemAt: ['$journal', 0]},
                    'currency.obj'  : {$arrayElemAt: ['$currency.obj', 0]},
                    'currency.rate' : 1,
                    forSale         : 1,
                    differenceAmount: 1,
                    paidAmount      : 1,
                    workflow        : 1,
                    name            : 1,
                    date            : 1,
                    isExpense       : 1,
                    bonus           : 1,
                    paymentRef      : 1,
                    year            : 1,
                    month           : 1,
                    period          : 1,
                    _type           : 1
                }
            }, {
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'invoice.project',
                    foreignField: 'projectId',
                    as          : 'projectMembers'
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'invoice.workflow',
                    foreignField: '_id',
                    as          : 'invoice.workflow'
                }
            }, {
                $project: {
                    'supplier.name'   : '$supplier.name',
                    'supplier._id'    : '$supplier._id',
                    'journal.name'    : '$journal.name',
                    'journal._id'     : '$journal._id',
                    'currency.name'   : '$currency.obj.name',
                    'currency._id'    : '$currency.obj._id',
                    'currency.rate'   : 1,
                    'invoice._id'     : 1,
                    'invoice.name'    : 1,
                    'invoice.workflow': {$arrayElemAt: ['$invoice.workflow', 0]},

                    salesmanagers: {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : salesManagerMatch
                        }
                    },

                    forSale             : 1,
                    differenceAmount    : 1,
                    paidAmount          : 1,
                    workflow            : 1,
                    date                : 1,
                    'paymentMethod.name': '$paymentMethod.name',
                    'paymentMethod._id' : '$paymentMethod._id',
                    isExpense           : 1,
                    bonus               : 1,
                    paymentRef          : 1,
                    year                : 1,
                    month               : 1,
                    period              : 1,
                    _type               : 1
                }
            }, {
                $project: {
                    supplier               : 1,
                    journal                : 1,
                    'currency.name'        : 1,
                    'currency._id'         : 1,
                    'currency.rate'        : 1,
                    'invoice._id'          : 1,
                    'invoice.name'         : 1,
                    'invoice.workflow.name': '$invoice.workflow.name',
                    salesmanagers          : {$arrayElemAt: ['$salesmanagers', 0]},
                    forSale                : 1,
                    differenceAmount       : 1,
                    paidAmount             : 1,
                    workflow               : 1,
                    date                   : 1,
                    paymentMethod          : 1,
                    isExpense              : 1,
                    bonus                  : 1,
                    paymentRef             : 1,
                    year                   : 1,
                    month                  : 1,
                    period                 : 1,
                    _type                  : 1
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesmanagers.employeeId',
                    foreignField: '_id',
                    as          : 'salesmanagers'
                }
            }, {
                $project: {
                    assigned          : {$arrayElemAt: ['$salesmanagers', 0]},
                    supplier          : 1,
                    journal           : 1,
                    'currency.name'   : 1,
                    'currency._id'    : 1,
                    'currency.rate'   : 1,
                    'invoice._id'     : 1,
                    'invoice.name'    : 1,
                    'invoice.workflow': 1,
                    forSale           : 1,
                    differenceAmount  : 1,
                    paidAmount        : 1,
                    workflow          : 1,
                    date              : 1,
                    name              : 1,
                    paymentMethod     : 1,
                    isExpense         : 1,
                    bonus             : 1,
                    paymentRef        : 1,
                    year              : 1,
                    month             : 1,
                    period            : 1,
                    _type             : 1
                }
            }, {
                $match: optionsObject
            }, {
                $project: {
                    supplier          : 1,
                    journal           : 1,
                    'currency.name'   : 1,
                    'currency._id'    : 1,
                    'currency.rate'   : 1,
                    'invoice._id'     : 1,
                    'invoice.name'    : 1,
                    'invoice.workflow': 1,
                    'assigned.name'   : '$assigned.name',
                    'assigned._id'    : '$assigned._id',
                    forSale           : 1,
                    differenceAmount  : 1,
                    name              : 1,
                    paidAmount        : 1,
                    workflow          : 1,
                    date              : 1,
                    paymentMethod     : 1,
                    isExpense         : 1,
                    bonus             : 1,
                    paymentRef        : 1,
                    year              : 1,
                    month             : 1,
                    period            : 1,
                    _type             : 1,
                    removable         : {
                        $cond: {
                            if  : {$and: [{$eq: ['$_type', 'ProformaPayment']}, {$eq: ['$invoice.workflow.name', 'Invoiced']}]},
                            then: false,
                            else: true
                        }
                    }
                }
            }, {
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    _id             : '$root._id',
                    supplier        : '$root.supplier',
                    journal         : '$root.journal',
                    currency        : '$root.currency',
                    invoice         : '$root.invoice',
                    assigned        : '$root.assigned',
                    forSale         : '$root.forSale',
                    differenceAmount: '$root.differenceAmount',
                    name            : '$root.name',
                    paidAmount      : '$root.paidAmount',
                    workflow        : '$root.workflow',
                    date            : '$root.date',
                    paymentMethod   : '$root.paymentMethod',
                    isExpense       : '$root.isExpense',
                    bonus           : '$root.bonus',
                    paymentRef      : '$root.paymentRef',
                    year            : '$root.year',
                    month           : '$root.month',
                    period          : '$root.period',
                    _type           : '$root._type',
                    removable       : '$root.removable',
                    total           : 1
                }
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            }
            ], waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            var count;
            var firstElement;
            var response = {};

            if (err) {
                return next(err);
            }

            firstElement = result[0];
            count = firstElement && firstElement.total ? firstElement.total : 0;
            response.total = count;
            response.data = result;

            res.status(200).send(response);
        });
    }

    function getById(req, res, next) {
        var id = req.query.id;
        var Payment;
        var query;
        var moduleId = returnModuleId(req);

        if (moduleId === 79) {
            Payment = models.get(req.session.lastDb, 'salaryPayment', salaryPaymentSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        query = Payment.findById(id);

        query
            .populate('supplier', '_id name fullName')
            .populate('paymentMethod', '_id name')
            .populate('journal', '_id name')
            .populate('currency', '_id name');

        query.exec(function (err, payment) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: payment});
        });
    }

    this.getById = function (req, res, next) {
        getById(req, res, next);
    };

    this.getAll = function (req, res, next) {
        // this temporary unused
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var query = {};

        Payment.find(query, function (err, payments) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: payments});
        });
    };

    this.amountLeftCalc = function (req, res) {
        var data = req.query;
        var diff;
        var date = new Date(data.date);
        var totalAmount = data.totalAmount;
        var paymentAmount = data.paymentAmount;
        var invoiceCurrency = data.invoiceCurrency;
        var paymentCurrency = data.paymentCurrency;

        date = moment(date).format('YYYY-MM-DD');

        oxr.historical(date, function () {
            fx.rates = oxr.rates;
            fx.base = oxr.base;
            diff = totalAmount - fx(paymentAmount).from(paymentCurrency).to(invoiceCurrency);

            res.status(200).send({difference: diff});
        });
    };

    this.getForView = function (req, res, next) {
        var viewType = req.query.viewType;
        var id = req.query.id;
        var type = req.query.contentType;
        var forSale = type === 'customerPayments';
        var bonus = type === 'supplierPayments';
        var salary = type === 'PayrollPayments';
        var expenses = type === 'ExpensesPayments';
        var dividend = type === 'DividendPayments';
        var options = {
            forSale : forSale,
            bonus   : bonus,
            salary  : salary,
            dividend: dividend,
            expenses: expenses
        };

        if (id && id.length >= 24) {
            return getById(req, res, next);
        }

        switch (viewType) {
            case 'list':
                getPaymentFilter(req, res, next, options);
                break;
            case 'form':
                getById(req, res, next);
                break;
            // skip default;
        }
    };

    this.createPayOut = function (req, res, next) {
        var body = req.body;
        // var moduleId = returnModuleId(req);
        var payment;
        var Payment = models.get(req.session.lastDb, 'wTrackPayOut', wTrackPayOutSchema);

        if (!body || (body && !body.supplier)) {
            return res.status(400).send();
        }

        payment = new Payment(body);

        payment.save(function (err, payment) {
            if (err) {
                return next(err);
            }

            res.status(200).send(payment);
        });
    };

    function payrollExpensUpdater(db, _payment, mulParram, cb) {
        var Payroll = models.get(db, 'PayRoll', payrollSchema);
        var id = _payment.paymentRef ? _payment.paymentRef : _payment.product;
        var paid = _payment.paidAmount ? _payment.paidAmount : _payment.paid;

        paid = paid * mulParram;

        Payroll.findByIdAndUpdate(id, {
            $inc: {
                diff: -paid,
                paid: paid
            }
        }, function (err, result) {
            cb(err, result);
        });
    }

    this.salaryPayOut = function (req, res, next) {
        var db = req.session.lastDb;
        var body = req.body;
        // var salaryPayment = body[0];
        var moduleId = 66;
        var mapBody;
        var Payment = models.get(req.session.lastDb, 'salaryPayment', salaryPaymentSchema);
        var Invoice = models.get(req.session.lastDb, 'payRollInvoice', payRollInvoiceSchema);
        var waterFallTasks;
        var createInvoice;
        var createPayment;
        var updatePayRolls;

        if (body && !body.length) {
            return res.status(400).send();
        }

        mapBody = function (cb) {
            var totalAmount = 0;
            var suppliers = [];
            var products = [];
            var resultObject = {};

            _.map(body, function (_payment) {
                var supplierObject = _payment.supplier;
                var productObject = {};

                productObject.product = _payment.paymentRef;
                productObject.paid = _payment.paidAmount;
                productObject.diff = _payment.differenceAmount;

                supplierObject.paidAmount = _payment.paidAmount;
                supplierObject.differenceAmount = _payment.differenceAmount;
                supplierObject.name = _payment.supplier.name;

                totalAmount += _payment.paidAmount;
                suppliers.push(supplierObject);
                products.push(productObject);

                return true;
            });
            resultObject.currency = body[0].currency;
            resultObject.suppliers = suppliers;
            resultObject.products = products;
            resultObject.totalAmount = totalAmount;

            cb(null, resultObject);
        };

        createInvoice = function (params, cb) {
            var invoice = new Invoice({
                products: params.products,
                currency: {_id: objectId(params.currency)}
            });

            invoice.save(function (err, result) {
                if (err) {
                    return cb(err);
                }

                params.invoice = result;
                cb(null, params);
            });
        };

        createPayment = function (params, cb) {
            var paymentObject = _.clone(body[0]);
            var payment;

            paymentObject.invoice = params.invoice.get('_id');

            paymentObject.supplier = params.suppliers;
            paymentObject.paidAmount = params.totalAmount;
            paymentObject.currency = params.invoice.get('currency');

            payment = new Payment(paymentObject);
            payment.save(function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        updatePayRolls = function (params, cb) {
            var bodySalary;

            async.each(body, function (_payment, eachCb) {
                payrollExpensUpdater(db, _payment, 1, eachCb);

                bodySalary = {
                    currency: MAIN_CONSTANTS.CURRENCY_USD,
                    journal : MAIN_CONSTANTS.SALARY_PAYMENT_JOURNAL,
                    date    : new Date(_payment.date),
                    // date    : new Date('2014-8-31'),

                    sourceDocument: {
                        model: 'salaryPayment',
                        _id  : _payment.supplier._id
                    },

                    amount: _payment.paidAmount * 100
                };

                journalEntry.createReconciled(bodySalary, req.session.lastDb, function () {

                }, req.session.uId);
            }, function (err) {
                if (err) {
                    return cb(err);
                }

                cb(null, params);
            });
        };

        waterFallTasks = [mapBody, createInvoice, createPayment, updatePayRolls];

        async.waterfall(waterFallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: result});
            composeExpensesAndCache(req);
        });
    };

    this.getForProject = function (req, res, next) {
        var db = req.session.lastDb;
        var contentType = req.query.contentType;
        var projectId = req.params.id;
        var moduleId;
        var query = req.query;
        // var queryObject = {};
        var optionsObject = {};
        var sort = {};
        var Payment;
        var paginationObject = pageHelper(query);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var key;
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        projectId = projectId ? objectId(projectId) : null;

        if (contentType === 'customerPayments') {
            moduleId = 61;
            Payment = models.get(db, 'customerPayments', PaymentSchema);
        }

        if (req.query.sort) {
            key = Object.keys(req.query.sort)[0];
            req.query.sort[key] = parseInt(req.query.sort[key], 10);
            sort = req.query.sort;
        } else {
            sort = {workflow: -1};
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, 'Department', DepartmentSchema).aggregate(
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
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $and: [
                    {
                        'invoice.project': projectId
                    },
                    {
                        $or: whoCanRw
                    }
                ]
            };

            Payment.aggregate([{
                $lookup: {
                    from        : 'Invoice',
                    localField  : 'invoice',
                    foreignField: '_id',
                    as          : 'invoice'
                }
            }, {
                $project: {
                    invoice : {$arrayElemAt: ['$invoice', 0]},
                    whoCanRW: 1,
                    groups  : 1
                }
            }, {
                $match: matchQuery
            }, {
                $project: {
                    _id: 1
                }
            }], waterfallCallback);
        };

        contentSearcher = function (ids, waterfallCallback) {
            var salesManagerMatch = {
                $and: [
                    {$eq: ['$$projectMember.projectPositionId', objectId(MAIN_CONSTANTS.SALESMANAGER)]},
                    {
                        $or: [{
                            $and: [{
                                $eq: ['$$projectMember.startDate', null]
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }, {
                            $and: [{
                                $lte: ['$$projectMember.startDate', '$quotation.orderDate']
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }, {
                            $and: [{
                                $eq: ['$$projectMember.startDate', null]
                            }, {
                                $gte: ['$$projectMember.endDate', '$quotation.orderDate']
                            }]
                        }, {
                            $and: [{
                                $lte: ['$$projectMember.startDate', '$quotation.orderDate']
                            }, {
                                $gte: ['$$projectMember.endDate', '$quotation.orderDate']
                            }]
                        }]
                    }]
            };

            optionsObject.$and = [];

            optionsObject.$and.push({_id: {$in: _.pluck(ids, '_id')}});
            optionsObject.$and.push({_type: {$in: ['InvoicePayment', 'ProformaPayment']}});

            Payment.aggregate([{
                $match: optionsObject
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'supplier',
                    foreignField: '_id',
                    as          : 'supplier'
                }
            }, {
                $lookup: {
                    from        : 'Invoice',
                    localField  : 'invoice',
                    foreignField: '_id',
                    as          : 'invoice'
                }
            }, {
                $lookup: {
                    from        : 'PaymentMethod',
                    localField  : 'paymentMethod',
                    foreignField: '_id',
                    as          : 'paymentMethod'
                }
            }, {
                $lookup: {
                    from        : 'journals',
                    localField  : 'journal',
                    foreignField: '_id',
                    as          : 'journal'
                }
            }, {
                $project: {
                    supplier        : {$arrayElemAt: ['$supplier', 0]},
                    invoice         : {$arrayElemAt: ['$invoice', 0]},
                    paymentMethod   : {$arrayElemAt: ['$paymentMethod', 0]},
                    journal         : {$arrayElemAt: ['$journal', 0]},
                    currency        : 1,
                    differenceAmount: 1,
                    paidAmount      : 1,
                    workflow        : 1,
                    name            : 1,
                    date            : 1,
                    _type           : 1
                }
            }, {
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'invoice.project',
                    foreignField: 'projectId',
                    as          : 'projectMembers'
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'invoice.workflow',
                    foreignField: '_id',
                    as          : 'invoice.workflow'
                }
            }, {
                $project: {
                    'supplier.name'   : '$supplier.name',
                    currency          : 1,
                    'invoice._id'     : 1,
                    'invoice.name'    : 1,
                    'journal._id'     : 1,
                    'journal.name'    : 1,
                    'invoice.workflow': {$arrayElemAt: ['$invoice.workflow', 0]},

                    salesmanagers: {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : salesManagerMatch
                        }
                    },

                    differenceAmount    : 1,
                    paidAmount          : 1,
                    workflow            : 1,
                    date                : 1,
                    'paymentMethod.name': '$paymentMethod.name',
                    _type               : 1
                }
            }, {
                $project: {
                    supplier        : 1,
                    currency        : 1,
                    journal         : 1,
                    'invoice._id'   : 1,
                    'invoice.name'  : 1,
                    salesmanagers   : {$arrayElemAt: ['$salesmanagers', 0]},
                    differenceAmount: 1,
                    paidAmount      : 1,
                    workflow        : 1,
                    date            : 1,
                    paymentMethod   : 1,
                    _type           : 1,
                    removable       : {
                        $cond: {
                            if  : {$and: [{$eq: ['$_type', 'ProformaPayment']}, {$eq: ['$invoice.workflow.name', 'Invoiced']}]},
                            then: false,
                            else: true
                        }
                    }

                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesmanagers.employeeId',
                    foreignField: '_id',
                    as          : 'salesmanagers'
                }
            }, {
                $lookup: {
                    from        : 'currency',
                    localField  : 'currency._id',
                    foreignField: '_id',
                    as          : 'currency._id'
                }
            }, {
                $project: {
                    assigned        : {$arrayElemAt: ['$salesmanagers', 0]},
                    supplier        : 1,
                    journal         : 1,
                    'currencyModel' : {$arrayElemAt: ['$currency._id', 0]},
                    'currency.rate' : 1,
                    'invoice._id'   : 1,
                    'invoice.name'  : 1,
                    forSale         : 1,
                    differenceAmount: 1,
                    paidAmount      : 1,
                    workflow        : 1,
                    date            : 1,
                    name            : 1,
                    paymentMethod   : 1,
                    _type           : 1,
                    removable       : 1
                }
            }, {
                $project: {
                    supplier        : 1,
                    journal         : 1,
                    'currency.rate' : 1,
                    'currency._id'  : '$currencyModel._id',
                    'currency.name' : '$currencyModel.name',
                    'invoice._id'   : 1,
                    'invoice.name'  : 1,
                    'assigned.name' : '$assigned.name',
                    differenceAmount: 1,
                    name            : 1,
                    paidAmount      : 1,
                    workflow        : 1,
                    date            : 1,
                    paymentMethod   : 1,
                    removable       : 1
                }
            }, {
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    _id             : '$root._id',
                    supplier        : '$root.supplier',
                    journal         : '$root.journal',
                    currency        : '$root.currency',
                    invoice         : '$root.invoice',
                    assigned        : '$root.assigned',
                    differenceAmount: '$root.differenceAmount',
                    name            : '$root.name',
                    paidAmount      : '$root.paidAmount',
                    workflow        : '$root.workflow',
                    date            : '$root.date',
                    paymentMethod   : '$root.paymentMethod',
                    removable       : '$root.removable',
                    total           : 1
                }
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            }
            ], waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            var count;
            var firstElement;
            var response = {};

            if (err) {
                return next(err);
            }

            firstElement = result[0];
            count = firstElement && firstElement.total ? firstElement.total : 0;
            response.total = count;
            response.data = result;

            res.status(200).send(response);
        });
    };

    this.create = function (req, res, next) {
        var dbName = req.session.lastDb;
        var body = req.body;
        var PaymentSchema = mongoose.Schemas.InvoicePayment;
        var Invoice = models.get(dbName, 'wTrackInvoice', wTrackInvoiceSchema);
        var Journal = models.get(req.session.lastDb, 'journal', journalSchema);
        var workflowHandler = new WorkflowHandler(models);
        var invoiceId = body.invoice;
        var now = new Date();
        var date = body.date ? moment(new Date(body.date)) : now;
        var mid = body.mid;
        var data = body;
        var isForSale = data.forSale;
        var project;
        var Payment = models.get(req.session.lastDb, 'InvoicePayment', PaymentSchema);
        var removable = true;
        var waterfallTasks;

        if (body && !body.invoice) {
            return res.status(400).send();
        }

        delete data.mid;

        date = date.format('YYYY-MM-DD');

        if (mid === 56) {
            PaymentSchema = mongoose.Schemas.InvoicePayment;
            Payment = models.get(req.session.lastDb, 'InvoicePayment', PaymentSchema);
            Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
            removable = false;
        } else if (mid === 95) {
            PaymentSchema = mongoose.Schemas.ProformaPayment;
            Payment = models.get(req.session.lastDb, 'ProformaPayment', PaymentSchema);
            Invoice = models.get(req.session.lastDb, 'Proforma', ProformaSchema);
        } else if (mid === 97) {
            PaymentSchema = mongoose.Schemas.ExpensesInvoicePayment;
            Payment = models.get(req.session.lastDb, 'expensesInvoicePayment', PaymentSchema);
            Invoice = models.get(req.session.lastDb, 'expensesInvoice', ExpensesInvoiceSchema);
        } else if (mid === 100) {
            PaymentSchema = mongoose.Schemas.DividendInvoicePayment;
            Payment = models.get(req.session.lastDb, 'dividendInvoicePayment', PaymentSchema);
            Invoice = models.get(req.session.lastDb, 'dividendInvoice', DividendInvoiceSchema);
        }

        function fetchInvoice(waterfallCallback) {
            Invoice.find({_id: invoiceId}).populate('currency._id', 'name').populate('payments').exec(function (err, invoice) {
                waterfallCallback(null, invoice[0]);
            });
        }

        function savePayment(invoice, waterfallCallback) {
            var payment = new Payment(data);

            // payment.paidAmount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
            // payment.name = invoice.sourceDocument;
            payment.whoCanRW = invoice.whoCanRW;
            payment.groups = invoice.groups;
            payment.createdBy.user = req.session.uId;
            payment.editedBy.user = req.session.uId;

            payment.currency.rate = oxr.rates[data.currency.name];

            payment.save(function (err, payment) {
                if (err) {
                    return waterfallCallback(err);
                }

                Payment.findById(payment._id).populate('paymentMethod', 'chartAccount').populate('currency._id').exec(function (err, resultPayment){
                    if (err){
                        return waterfallCallback(err);
                    }

                    waterfallCallback(null, invoice, resultPayment);
                });
            });
        }

        function invoiceUpdater(invoice, payment, waterfallCallback) {
            var totalToPay = (invoice.paymentInfo) ? invoice.paymentInfo.balance : 0;
            var paid = payment.paidAmount;
            var paymentCurrency = data.currency.name;
            var invoiceCurrency = invoice.currency._id.name;
            var isNotFullPaid;
            var wId;
            var paymentDate = new Date(payment.date);
            var invoiceType = invoice._type;
            var payments = [];
            var request = {
                query: {
                    source      : 'purchase',
                    targetSource: 'invoice'
                },

                session: req.session
            };

            if (!paymentCurrency) {
                paymentCurrency = invoiceCurrency;
            }

            invoice.payments = invoice.payments || [];

            invoice.payments.forEach(function (paym) {
                payments.push(paym._id.toString());

                if (paym.date > paymentDate) {
                    paymentDate = paym.date;
                }
            });

            invoice.removable = removable;

            paid = fx(paid).from(paymentCurrency).to(invoiceCurrency);

            if (paymentDate === 'Invalid Date') {
                paymentDate = new Date();
            }

            if (invoiceType === 'wTrackInvoice' || invoiceType === 'expensesInvoice' || invoiceType === 'dividendInvoice') {
                wId = 'Sales Invoice';
            } else if (invoiceType === 'Proforma') {
                wId = 'Proforma';
                request.query = {};
            } else {
                wId = 'Purchase Invoice';
            }

            request.query.wId = wId;

            /* totalToPay = parseFloat(totalToPay).toFixed(2);
             paid = parseFloat(paid).toFixed(2);

             isNotFullPaid = parseFloat(paid) < parseFloat(totalToPay);*/

            totalToPay = parseInt(totalToPay, 10);
            paid = parseInt(paid, 10);

            isNotFullPaid = paid < totalToPay;

            if (isNotFullPaid) {
                request.query.status = 'In Progress';
                request.query.order = 1;
            } else {
                request.query.status = 'Done';
                request.query.order = 1;
            }

            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                if (err) {
                    return waterfallCallback(err);
                }

                invoice.workflow = workflow._id;
                invoice.paymentInfo.balance = totalToPay - paid;
                // invoice.paymentInfo.unTaxed += paid / 100;// commented by Liliya forRoman
                // invoice.paymentInfo.unTaxed = paid * (1 + invoice.paymentInfo.taxes);

                payments.push(payment._id);
                invoice.payments = payments;

                invoice.paymentDate = new Date(paymentDate); // Because we have it in post.schema

                // delete invoice.paymentDate;

                Invoice.findByIdAndUpdate(invoiceId, invoice, {new: true}, function (err, invoice) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    project = invoice ? invoice.get('project') : null;

                    payments = invoice ? invoice.get('payments') : [];

                    if (project) {
                        event.emit('fetchInvoiceCollection', {project: project, dbName: dbName});
                    }
                    if (isForSale) { // todo added in case of no last task
                        waterfallCallback(null, invoice, payment);
                    } else {
                        waterfallCallback(null, payment);
                    }

                });
            });
        }

        function createJournalEntry(invoice, payment, waterfallCallback) {
            var journal = MAIN_CONSTANTS.PAYMENT_JOURNAL;
            var invoiceType = invoice._type;
            var paymentBody;
            var bodyOtherIncome;
            var queryForJournal = {};
            var amountByInvoice;
            var differenceAmount;

            if (!isForSale) {
                waterfallCallback = payment;
                payment = invoice;
            }

            if (invoiceType === 'Proforma') {
                journal = MAIN_CONSTANTS.PROFORMA_JOURNAL;
            } else if (invoiceType === 'expensesInvoicePayment') {
                journal = MAIN_CONSTANTS.EXPENSES_PAYMENT_JOURNAL;
            } else if (invoiceType === 'dividendInvoicePayment') {
                journal = MAIN_CONSTANTS.DIVIDEND_PAYMENT_JOURNAL;
            }

            amountByInvoice = payment.paidAmount / invoice.currency.rate;
            differenceAmount = payment.paidAmount / fx.rates[payment.currency._id.name];

            paymentBody = {
                journal       : journal,
                currency      : payment.currency._id._id,
                date          : payment.date,
                sourceDocument: {
                    model: 'Payment',
                    _id  : payment._id
                },

                amount: amountByInvoice
            };

            bodyOtherIncome = {
                currency      : MAIN_CONSTANTS.CURRENCY_USD,
                date          : new Date(date),
                sourceDocument: {
                    model: 'Payment',
                    _id  : payment._id
                },
                amount        : Math.abs(amountByInvoice - differenceAmount)
            };

            if (Math.abs(amountByInvoice - differenceAmount) !== 0) {

                if (differenceAmount > amountByInvoice) {
                    queryForJournal = {
                        debitAccount: payment.paymentMethod ? payment.paymentMethod.chartAccount : null,
                        creditAccount: MAIN_CONSTANTS.OTHER_INCOME_ACCOUNT
                    }
                } else if (differenceAmount < amountByInvoice) {
                    queryForJournal = {
                        debitAccount: MAIN_CONSTANTS.OTHER_INCOME_ACCOUNT,
                        creditAccount: payment.paymentMethod ? payment.paymentMethod.chartAccount : null
                    }
                }

                queryForJournal.name = 'Other Income / Loss';
                queryForJournal.transaction = 'Payment';

                Journal.update(queryForJournal, {
                    $set: queryForJournal
                }, {upsert: true}, function (err, result) {
                    var modelId;
                    var query = {};

                    if (err) {
                        return cb(err);
                    }

                    modelId = result && result.upserted && result.upserted.length ? result.upserted[0]._id : null;

                    if (modelId) {
                        query._id = modelId;
                    } else {
                        query.debitAccount = queryForJournal.debitAccount;
                        query.creditAccount = queryForJournal.creditAccount
                    }

                    Journal.find(query, function (err, result) {
                        if (err) {
                            return waterfallCallback(err);
                        }

                        bodyOtherIncome.journal = result && result.length ? result[0]._id : null;

                        if (bodyOtherIncome.journal) {

                            journalEntry.createReconciled(bodyOtherIncome, req.session.lastDb, function () {

                            }, req.session.uId);
                        }

                        journalEntry.createReconciled(paymentBody, req.session.lastDb, function () {

                        }, req.session.uId);

                        waterfallCallback(null, invoice, payment);
                    });
                })
            } else {
                journalEntry.createReconciled(paymentBody, req.session.lastDb, function () {

                }, req.session.uId);

                waterfallCallback(null, invoice, payment);
            }

        }

        function updateWtrack(invoice, payment, waterfallCallback) {
            var paid = payment.paidAmount || 0;
            var wTrackIds = _.pluck(invoice.products, 'product');

            function updateWTrack(id, cb) {
                var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

                function wTrackFinder(innerWaterfallCb) {
                    wTrack.findById(id, function (err, wTrackDoc) {
                        if (err) {
                            return innerWaterfallCb(err);
                        }
                        innerWaterfallCb(null, wTrackDoc);
                    });
                }

                function wTrackUpdater(wTrackDoc, innerWaterfallCb) {
                    var wTrackAmount;
                    var revenue;
                    var differance;
                    var isPaid;
                    if (!wTrackDoc) {

                        return innerWaterfallCb();
                    }

                    if (!wTrackDoc.isPaid) {
                        revenue = wTrackDoc.revenue;
                        wTrackAmount = wTrackDoc.amount;
                        differance = wTrackAmount - revenue; // differance - negative value

                        if ((paid + differance) >= 0) {
                            differance = -differance;
                        } else {
                            differance = paid;
                        }

                        paid -= differance;
                        wTrackAmount += differance;
                        isPaid = revenue === wTrackAmount;

                        wTrackDoc.amount = wTrackAmount / 100;
                        wTrackDoc.isPaid = isPaid;
                        wTrackDoc.save(function (err) {
                            if (err) {
                                return innerWaterfallCb(err);
                            }
                            innerWaterfallCb(null, payment);
                        });
                    } else {
                        innerWaterfallCb(null, payment);
                    }
                }

                async.waterfall([wTrackFinder, wTrackUpdater], cb);
            }

            if (!paid) {
                return waterfallCallback(null, payment);
            }

            async.eachSeries(wTrackIds, updateWTrack, function (err, result) {
                if (err) {
                    return waterfallCallback(err);
                }

                waterfallCallback(null, payment);
            });

        }

        function getRates(waterfallCallback) {
            oxr.historical(date, function () {
                fx.rates = oxr.rates;
                fx.base = oxr.base;
                waterfallCallback();
            });
        }

        waterfallTasks = [getRates, fetchInvoice, savePayment, invoiceUpdater, createJournalEntry];

        if (isForSale) { // todo added condition for purchase payment
            waterfallTasks.push(updateWtrack);
        }

        async.waterfall(waterfallTasks, function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(201).send(response);
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var contentType = req.params.contentType;
        var uId;
        var invoiceId;
        var dbName = req.session.lastDb;
        var Invoice = models.get(dbName, 'wTrackInvoice', wTrackInvoiceSchema);
        var forSale = contentType === 'customers';
        var bonus = contentType === 'supplier';
        var salary = contentType === 'salary';
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var type = 'Invoiced';
        var project;
        var paid;
        var options = {
            forSale: forSale,
            bonus  : bonus,
            salary : salary
        };
        var Payment = returnModel(req, options);
        var moduleId = returnModuleId(req);

        async.each(body, function (data, cb) {
            var id = data._id;

            if (!id || id.length < 24) {
                return res.status(400).send();
            }

            data.editedBy = {
                user: uId,
                date: new Date().toISOString()
            };

            if (moduleId === 60) {
                delete data.paid;
                delete data.differenceAmount;
                delete data.paidAmount;
            }

            delete data._id;

            Payment.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, payment) {
                invoiceId = payment ? payment.get('invoice') : null;
                paid = payment ? payment.get('paidAmount') : 0;

                if (invoiceId && (payment._type !== 'salaryPayment')) {

                    Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);

                    Invoice.findById({_id: invoiceId}, function (err) {
                        if (err) {
                            return next(err);
                        }

                        Invoice.findByIdAndUpdate(invoiceId,
                            {
                                paymentDate: data.date
                            },
                            {new: true}, function (err, result) {
                                var products;

                                if (err) {
                                    return next(err);
                                }

                                products = result.get('products');

                                async.each(products, function (product, callBack) {

                                    JobsModel.findByIdAndUpdate(product.jobs, {type: type}, {new: true}, function (err, result) {
                                        if (err) {
                                            return next(err);
                                        }

                                        project = result ? result.get('project') : null;

                                        callBack();
                                    });

                                }, function () {
                                    if (project) {
                                        event.emit('fetchJobsCollection', {project: project, dbName: dbName});
                                        event.emit('fetchInvoiceCollection', {project: project, dbName: dbName});
                                    }
                                });
                            });
                    });
                }
                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
        });
    };

    this.bulkRemove = function (req, res, next) {
        var db = req.session.lastDb;
        var Payment = models.get(db, 'Payment', PaymentSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;
        var Invoice;
        var invoiceId;
        var paid;
        var date;
        var workflowObj;
        var wId;
        var request;
        var workflowHandler = new WorkflowHandler(models);
        var JobsModel = models.get(db, 'jobs', JobsSchema);
        var Currency = models.get(db, 'currency', currencySchema);
        var isNotFullPaid;

        async.each(ids, function (id, cb) {
            Payment.findByIdAndRemove(id, function (err, removed) {
                if (err) {
                    return next(err);
                }

                date = moment(removed.date).format('YYYY-MM-DD');

                Currency.findById(removed.currency._id, function (err, paymentCurrency) {
                    if (err) {
                        return next(err);
                    }

                    oxr.historical(date, function () {
                        fx.rates = oxr.rates;
                        fx.base = oxr.base;

                        journalEntry.removeByDocId(id, db, function () {

                        });

                        invoiceId = removed ? removed.get('invoice') : null;
                        paid = removed ? removed.get('paidAmount') : 0;

                        if (invoiceId && (removed && removed._type !== 'salaryPayment')) {

                            Invoice = models.get(db, 'wTrackInvoice', wTrackInvoiceSchema);

                            Invoice.find({payments: removed._id}, function (err, invoices) {
                                if (err) {
                                    return next(err);
                                }

                                invoices.forEach(function (inv) {
                                    Invoice.findByIdAndUpdate(inv._id, {$pull: {payments: removed._id}}, {new: true})
                                        .populate('payments')
                                        .populate('currency._id')
                                        .exec(function (err, invoice) {

                                            var paymentInfo = invoice.get('paymentInfo');
                                            var project = invoice ? invoice.get('project') : null;
                                            var payments = invoice ? invoice.get('payments') : [];
                                            var removable = true;
                                            var invoiceType = invoice._type;
                                            var paymentDate = null;

                                            paid = fx(removed.paidAmount).from(paymentCurrency.name).to(invoice.currency._id.name);

                                            payments.forEach(function (payment) {
                                                if (payment._type !== 'ProformaPayment') {
                                                    removable = false;
                                                }

                                                if (payment.date > paymentDate) {
                                                    paymentDate = payment.date;
                                                }
                                            });

                                            request = {
                                                query: {
                                                    source      : 'purchase',
                                                    targetSource: 'invoice'
                                                },

                                                session: req.session
                                            };

                                            if (invoiceType === 'wTrackInvoice' || invoiceType === 'expensesInvoice' || invoiceType === 'dividendInvoice') {
                                                wId = 'Sales Invoice';
                                            } else if (invoiceType === 'Proforma') {
                                                wId = 'Proforma';
                                                request.query = {};
                                            } else {
                                                wId = 'Purchase Invoice';
                                            }

                                            request.query.wId = wId;

                                            isNotFullPaid = paymentInfo.total > parseInt(paymentInfo.balance + paid, 10);

                                            if (isNotFullPaid) {
                                                request.query.status = 'In Progress';
                                                request.query.order = 1;
                                            } else {
                                                request.query.status = 'New';
                                                request.query.order = 1;

                                                if ((invoiceType === 'Proforma') && !payments.length && invoice.get('invoiced')) {
                                                    request.query.status = 'Cancelled';
                                                }
                                            }

                                            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                                                var query = {};
                                                var paymentInfoNew = {};

                                                if (err) {
                                                    return next(err);
                                                }

                                                workflowObj = workflow._id;

                                                paymentInfoNew.total = paymentInfo.total;
                                                paymentInfoNew.taxes = paymentInfo.taxes;
                                                paymentInfoNew.unTaxed = paymentInfoNew.total;

                                                if (paymentInfo.total !== parseInt(paymentInfo.balance, 10)) {
                                                    paymentInfoNew.balance = parseInt(paymentInfo.balance + paid, 10);
                                                } else {
                                                    paymentInfoNew.balance = parseInt(paymentInfo.balance, 10);
                                                }

                                                query.paymentInfo = paymentInfoNew;

                                                query.removable = removable;

                                                query.paymentDate = paymentDate;

                                                if (!invoice.invoiced) {
                                                    query.workflow = workflowObj;
                                                }

                                                Invoice.findByIdAndUpdate(invoice._id, {
                                                    $set: query
                                                }, {new: true}, function (err, result) {
                                                    var products;
                                                    var payments;

                                                    if (err) {
                                                        return next(err);
                                                    }

                                                    products = result.get('products');

                                                    payments = result.get('payments') ? result.get('payments') : [];

                                                    if (result._type !== 'expensesInvoice' && result._type !== 'dividendInvoice') {

                                                        async.each(products, function (product) {

                                                            JobsModel.findByIdAndUpdate(product.jobs, {payments: payments}, {new: true}, function (err, result) {
                                                                if (err) {
                                                                    return next(err);
                                                                }

                                                                project = result ? result.get('project') : null;
                                                            });

                                                        });
                                                    }

                                                    if (project) {
                                                        event.emit('fetchInvoiceCollection', {
                                                            project: project,
                                                            dbName : db
                                                        });
                                                    }

                                                });
                                            });

                                        });
                                });
                                cb();
                            });
                        } else if (invoiceId) {
                            Invoice = models.get(req.session.lastDb, 'payRollInvoice', payRollInvoiceSchema);

                            Invoice.findByIdAndRemove(invoiceId, function (err, invoice) {
                                if (err) {
                                    return next(err);
                                }

                                async.each(invoice.products, function (_payment, eachCb) {
                                    payrollExpensUpdater(db, _payment, -1, eachCb);
                                    journalEntry.removeByDocId({
                                        'sourceDocument.model': 'salaryPayment',
                                        'sourceDocument._id'  : _payment
                                    }, req.session.lastDb, function () {
                                    });
                                }, function (err) {
                                    if (err) {
                                        return next(err);
                                    }
                                    cb();
                                    composeExpensesAndCache(req);
                                });
                            });
                        } else {
                            cb();
                        }

                    });

                });

            });
        }, function () {
            res.status(200).send({success: true});
        });
    };

    this.remove = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.params.id;
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        var Invoice;
        var invoiceId;
        var paid;
        var date;
        var workflowObj;
        var wId;
        var request;
        var moduleId = req.headers.mid || returnModuleId(req);
        var workflowHandler = new WorkflowHandler(models);
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var Currency = models.get(req.session.lastDb, 'currency', currencySchema);
        var isNotFullPaid;

        Payment.findByIdAndRemove(id, function (err, removed) {
            if (err) {
                return next(err);
            }

            date = moment(removed.date).format('YYYY-MM-DD');

            Currency.findById(removed.currency._id, function (err, paymentCurrency) {
                if (err) {
                    return next(err);
                }

                oxr.historical(date, function () {
                    fx.rates = oxr.rates;
                    fx.base = oxr.base;

                    journalEntry.removeByDocId(id, db, function () {

                    });

                    invoiceId = removed ? removed.get('invoice') : null;
                    paid = removed ? removed.get('paidAmount') : 0;

                    if (invoiceId && (removed && removed._type !== 'salaryPayment')) {

                        Invoice = models.get(db, 'wTrackInvoice', wTrackInvoiceSchema);

                        Invoice.find({payments: removed._id}, function (err, invoices) {
                            if (err) {
                                return next(err);
                            }

                            invoices.forEach(function (inv) {
                                Invoice.findByIdAndUpdate(inv._id, {$pull: {payments: removed._id}}, {new: true})
                                    .populate('payments')
                                    .populate('currency._id')
                                    .exec(function (err, invoice) {

                                        var paymentInfo = invoice.get('paymentInfo');
                                        var project = invoice ? invoice.get('project') : null;
                                        var payments = invoice ? invoice.get('payments') : [];
                                        var removable = true;
                                        var invoiceType = invoice._type;
                                        var paymentDate = null;

                                        if (paymentCurrency.name !== invoice.currency._id.name){
                                            paid = fx(removed.paidAmount).from(paymentCurrency.name).to(invoice.currency._id.name);
                                        }

                                        payments.forEach(function (payment) {
                                            if (payment._type !== 'ProformaPayment') {
                                                removable = false;
                                            }

                                            if (payment.date > paymentDate) {
                                                paymentDate = payment.date;
                                            }
                                        });

                                        request = {
                                            query: {
                                                source      : 'purchase',
                                                targetSource: 'invoice'
                                            },

                                            session: req.session
                                        };

                                        if (invoiceType === 'wTrackInvoice' || invoiceType === 'expensesInvoice' || invoiceType === 'dividendInvoice') {
                                            wId = 'Sales Invoice';
                                        } else if (invoiceType === 'Proforma') {
                                            wId = 'Proforma';
                                            request.query = {};
                                        } else {
                                            wId = 'Purchase Invoice';
                                        }

                                        request.query.wId = wId;

                                        isNotFullPaid = paymentInfo.total > parseInt(paymentInfo.balance + paid, 10);

                                        if (isNotFullPaid) {
                                            request.query.status = 'In Progress';
                                            request.query.order = 1;
                                        } else {
                                            request.query.status = 'New';
                                            request.query.order = 1;

                                            if ((invoiceType === 'Proforma') && !payments.length && invoice.get('invoiced')) {
                                                request.query.status = 'Cancelled';
                                            }
                                        }

                                        workflowHandler.getFirstForConvert(request, function (err, workflow) {
                                            var query = {};
                                            var paymentInfoNew = {};

                                            if (err) {
                                                return next(err);
                                            }

                                            workflowObj = workflow._id;

                                            paymentInfoNew.total = paymentInfo.total;
                                            paymentInfoNew.taxes = paymentInfo.taxes;
                                            paymentInfoNew.unTaxed = paymentInfoNew.total;

                                            if (paymentInfo.total !== parseInt(paymentInfo.balance, 10)) {
                                                paymentInfoNew.balance = parseInt(paymentInfo.balance + paid, 10);
                                            } else {
                                                paymentInfoNew.balance = parseInt(paymentInfo.balance, 10);
                                            }

                                            query.paymentInfo = paymentInfoNew;

                                            query.removable = removable;

                                            if (!invoice.invoiced) {
                                                query.workflow = workflowObj;
                                            }

                                            query.paymentDate = paymentDate;

                                            Invoice.findByIdAndUpdate(invoice._id, {
                                                $set: query
                                            }, {new: true}, function (err, result) {
                                                var products;
                                                var payments;

                                                if (err) {
                                                    return next(err);
                                                }

                                                products = result.get('products');

                                                payments = result.get('payments') ? result.get('payments') : [];

                                                if (result._type !== 'expensesInvoice' && result._type !== 'dividendInvoice') {

                                                    async.each(products, function (product) {

                                                        JobsModel.findByIdAndUpdate(product.jobs, {payments: payments}, {new: true}, function (err, result) {
                                                            if (err) {
                                                                return next(err);
                                                            }

                                                            project = result ? result.get('project') : null;
                                                        });

                                                    });
                                                }

                                                if (project) {
                                                    event.emit('fetchInvoiceCollection', {
                                                        project: project,
                                                        dbName : db
                                                    });
                                                }

                                            });
                                        });

                                    });
                            });
                            res.status(200).send({success: removed});
                        });
                    } else if (invoiceId) {
                        Invoice = models.get(req.session.lastDb, 'payRollInvoice', payRollInvoiceSchema);

                        Invoice.findByIdAndRemove(invoiceId, function (err, invoice) {
                            if (err) {
                                return next(err);
                            }

                            async.each(invoice.products, function (_payment, eachCb) {
                                payrollExpensUpdater(db, _payment, -1, eachCb);
                                journalEntry.removeByDocId({
                                    'sourceDocument.model': 'salaryPayment',
                                    'sourceDocument._id'  : _payment
                                }, req.session.lastDb, function () {
                                });
                            }, function (err) {
                                if (err) {
                                    return next(err);
                                }

                                res.status(200).send({success: 'Done'});
                                composeExpensesAndCache(req);
                            });
                        });
                    } else {
                        res.status(200).send({success: 'Done'});
                    }

                });

            });

        });
    };

};

module.exports = Module;
