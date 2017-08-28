'use strict';
var mongoose = require('mongoose');
var async = require('async');
var WorkflowHandler = require('./workflow');
var _ = require('lodash');
// var oxr = require('open-exchange-rates');
// var fx = require('money');
var moment = require('../public/js/libs/moment/moment');
var MAIN_CONSTANTS = require('../constants/mainConstants');

var purchaseInvoicesSchema = mongoose.Schemas.purchaseInvoices;
var wTrackPayOutSchema = mongoose.Schemas.wTrackPayOut;
var currencySchema = mongoose.Schemas.Currency;
var PaymentSchema = mongoose.Schemas.Payment;
var salaryPaymentSchema = mongoose.Schemas.salaryPayment;
var payrollSchema = mongoose.Schemas.PayRoll;
var JobsSchema = mongoose.Schemas.jobs;
var wTrackInvoiceSchema = mongoose.Schemas.wTrackInvoice;
var InvoiceSchema = mongoose.Schemas.Invoice;
var InvoicesSchema = mongoose.Schemas.Invoices;
var ExpensesInvoiceSchema = mongoose.Schemas.expensesInvoice;
var DividendInvoiceSchema = mongoose.Schemas.dividendInvoice;
var OrderSchema = mongoose.Schemas.Order;
var purchaseOrders = mongoose.Schemas.purchaseOrders;
var PrepaymentSchema = mongoose.Schemas.Prepayment;
var payRollInvoiceSchema = mongoose.Schemas.payRollInvoice;
var DepartmentSchema = mongoose.Schemas.Department;
var wTrackSchema = mongoose.Schemas.wTrack;
var objectId = mongoose.Types.ObjectId;
var RefundsHelper = require('../helpers/refunds');

var Module = function (models, event) {

    var composeExpensesAndCache = require('../helpers/expenses')(models);
    var HistoryWriter = require('../helpers/historyWriter.js');
    var historyWriter = new HistoryWriter(models);

    var rewriteAccess = require('../helpers/rewriteAccess');
    var JournalEntryHandler = require('./journalEntry');
    var journalEntry = new JournalEntryHandler(models);
    var pageHelper = require('../helpers/pageHelper');

    var journalService = require('../services/journalEntry')(models);
    var ratesService = require('../services/rates')(models);
    var invoiceService = require('../services/invoices')(models);
    var ratesRetriever = require('../helpers/ratesRetriever')();

    var FilterMapper = require('../helpers/filterMapper');

    var refundsHelper = new RefundsHelper(models);
    // oxr.set({app_id: process.env.OXR_APP_ID});

    function returnModuleId(req) {
        var moduleId;
        var type = req.params.byType || 'customers';

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
        var purchasePayments = options ? !!options.purchasePayments : false;
        var quickSearch = data.quickSearch;
        var matchObject = {};
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
        var aggregate;
        var aggregatePurchase = false;
        var regExp = new RegExp(quickSearch, 'ig');

        if (req.query.sort) {
            key = Object.keys(req.query.sort)[0];
            req.query.sort[key] = parseInt(req.query.sort[key], 10);
            sort = req.query.sort;
        } else {
            sort = {date: -1};
        }

        optionsObject.$and = [];

        if (filter && typeof filter === 'object') {
            optionsObject.$and.push(filterMapper.mapFilter(filter, {contentType: contentType}));
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

        if (!forSale && !dividend && !expenses && !purchasePayments) {
            optionsObject.$and.push({_type: {$nin: ['expensesInvoicePayment', 'dividendInvoicePayment', 'purchasePayments', 'ProformaPayment']}});
        }

        if (expenses) {
            optionsObject.$and.push({_type: 'expensesInvoicePayment'});
        }

        if (dividend) {
            optionsObject.$and.push({_type: 'dividendInvoicePayment'});
        }

        if (purchasePayments) {
            optionsObject.$and.push({_type: {$in: ['purchasePayments', 'prepayment']}});
            aggregatePurchase = true;
        }

        if (quickSearch) {
            matchObject['assignedName'] = {$regex: regExp};
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
                $or: whoCanRw
            };

            Payment.aggregate({
                $match: matchQuery
            }, {
                $project: {
                    _id: 1
                }
            }, waterfallCallback);
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

            if (aggregatePurchase) {
                aggregate = [{
                    $match: optionsObject
                },
                    {
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
                            from        : 'Order',
                            localField  : 'order',
                            foreignField: '_id',
                            as          : 'order'
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
                            from        : 'currency',
                            localField  : 'currency._id',
                            foreignField: '_id',
                            as          : 'currency.obj'
                        }
                    }, {
                        $project: {
                            supplier        : {$arrayElemAt: ['$supplier', 0]},
                            order           : {$arrayElemAt: ['$order', 0]},
                            invoice         : {$arrayElemAt: ['$invoice', 0]},
                            paymentMethod   : {$arrayElemAt: ['$paymentMethod', 0]},
                            'currency.obj'  : {$arrayElemAt: ['$currency.obj', 0]},
                            'currency.rate' : 1,
                            bankExpenses    : 1,
                            bankAccount     : 1,
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
                            refund          : 1,
                            _type           : 1
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
                            'supplier.name'      : '$supplier.name',
                            'supplier._id'       : '$supplier._id',
                            'supplier.address'   : '$supplier.address',
                            'currency.name'      : '$currency.obj.name',
                            'currency.symbol'    : '$currency.obj.symbol',
                            'currency._id'       : '$currency.obj._id',
                            'currency.rate'      : 1,
                            'order._id'          : 1,
                            'order.name'         : 1,
                            'order.salesPerson'  : 1,
                            'invoice._id'        : 1,
                            'invoice.name'       : 1,
                            'invoice.salesPerson': 1,
                            'invoice.workflow'   : {$arrayElemAt: ['$invoice.workflow', 0]},
                            salesmanager         : {$ifNull: ['$invoice.salesPerson', '$order.salesPerson']},
                            bankExpenses         : 1,
                            name                 : 1,
                            bankAccount          : 1,
                            forSale              : 1,
                            differenceAmount     : 1,
                            paidAmount           : 1,
                            workflow             : 1,
                            refund               : 1,
                            date                 : 1,
                            'paymentMethod.name' : '$paymentMethod.name',
                            'paymentMethod._id'  : '$paymentMethod._id',
                            isExpense            : 1,
                            bonus                : 1,
                            paymentRef           : 1,
                            year                 : 1,
                            month                : 1,
                            period               : 1,
                            _type                : 1
                        }
                    }, {
                        $lookup: {
                            from        : 'Employees',
                            localField  : 'salesmanager',
                            foreignField: '_id',
                            as          : 'salesPerson'
                        }
                    }, {
                        $lookup: {
                            from        : 'chartOfAccount',
                            localField  : 'bankAccount',
                            foreignField: '_id',
                            as          : 'bankAccount'
                        }
                    }, {
                        $lookup: {
                            from        : 'chartOfAccount',
                            localField  : 'bankExpenses.account',
                            foreignField: '_id',
                            as          : 'bankExpenses.account'
                        }
                    }, {
                        $project: {
                            supplier               : 1,
                            'currency.name'        : 1,
                            'currency._id'         : 1,
                            'currency.symbol'      : 1,
                            'currency.rate'        : 1,
                            'invoice._id'          : 1,
                            'invoice.name'         : 1,
                            'invoice.workflow.name': '$invoice.workflow.name',
                            bankAccount            : {$arrayElemAt: ['$bankAccount', 0]},
                            salesPerson            : {$arrayElemAt: ['$salesPerson', 0]},
                            'bankExpenses.account' : {$arrayElemAt: ['$bankExpenses.account', 0]},
                            'bankExpenses.amount'  : 1,
                            name                   : 1,
                            order                  : 1,
                            forSale                : 1,
                            refund                 : 1,
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
                        $project: {
                            assigned          : '$salesPerson',
                            salesPerson       : 1,
                            'bankAccount.name': 1,
                            'bankAccount._id' : 1,
                            supplier          : 1,
                            currency          : 1,
                            'invoice._id'     : 1,
                            'invoice.name'    : 1,
                            'invoice.workflow': 1,
                            bankExpenses      : 1,
                            order             : 1,
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
                            refund            : 1,
                            year              : 1,
                            month             : 1,
                            period            : 1,
                            _type             : 1
                        }
                    }, {
                        $match: optionsObject
                    }, {
                        $project: {
                            'assigned.name'   : '$assigned.name',
                            assignedName      : {
                                $concat: ['$assigned.name.first', ' ', '$assigned.name.last']
                            },
                            'assigned._id'    : '$assigned._id',
                            supplier          : 1,
                            currency          : 1,
                            'invoice._id'     : 1,
                            'invoice.name'    : 1,
                            'invoice.workflow': 1,
                            bankExpenses      : 1,
                            bankAccount       : 1,
                            order             : 1,
                            refund            : 1,
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
                        $match: matchObject
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
                            currency        : '$root.currency',
                            invoice         : '$root.invoice',
                            assigned        : '$root.assigned',
                            forSale         : '$root.forSale',
                            differenceAmount: '$root.differenceAmount',
                            bankAccount     : '$root.bankAccount',
                            bankExpenses    : '$root.bankExpenses',
                            order           : '$root.order',
                            name            : '$root.name',
                            paidAmount      : '$root.paidAmount',
                            workflow        : '$root.workflow',
                            date            : '$root.date',
                            paymentMethod   : '$root.paymentMethod',
                            isExpense       : '$root.isExpense',
                            refund          : '$root.refund',
                            bonus           : '$root.bonus',
                            paymentRef      : '$root.paymentRef',
                            year            : '$root.year',
                            month           : '$root.month',
                            period          : '$root.period',
                            _type           : '$root._type',
                            removable       : '$root.removable',
                            total           : 1
                        }
                    }
                ];
            } else {
                aggregate = [
                    {
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
                            from        : 'Order',
                            localField  : 'order',
                            foreignField: '_id',
                            as          : 'order'
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
                            from        : 'currency',
                            localField  : 'currency._id',
                            foreignField: '_id',
                            as          : 'currency.obj'
                        }
                    }, {
                        $project: {
                            supplier        : {$arrayElemAt: ['$supplier', 0]},
                            invoice         : {$arrayElemAt: ['$invoice', 0]},
                            order           : {$arrayElemAt: ['$order', 0]},
                            paymentMethod   : {$arrayElemAt: ['$paymentMethod', 0]},
                            'currency.obj'  : {$arrayElemAt: ['$currency.obj', 0]},
                            'currency.rate' : 1,
                            forSale         : 1,
                            bankAccount     : 1,
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
                            refund          : 1,
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
                        $lookup: {
                            from        : 'chartOfAccount',
                            localField  : 'bankAccount',
                            foreignField: '_id',
                            as          : 'bankAccount'
                        }
                    }, {
                        $lookup: {
                            from        : 'chartOfAccount',
                            localField  : 'bankExpenses.account',
                            foreignField: '_id',
                            as          : 'bankExpenses.account'
                        }
                    }, {
                        $lookup: {
                            from        : 'chartOfAccount',
                            localField  : 'otherIncomeLossAccount',
                            foreignField: '_id',
                            as          : 'otherIncomeLossAccount'
                        }
                    }, {
                        $project: {
                            'supplier.name'       : '$supplier.name',
                            'supplier._id'        : '$supplier._id',
                            'supplier.address'    : '$supplier.address',
                            'currency.name'       : '$currency.obj.name',
                            'currency.symbol'     : '$currency.obj.symbol',
                            'currency._id'        : '$currency.obj._id',
                            'currency.rate'       : 1,
                            refund                : 1,
                            'order._id'           : 1,
                            'order.name'          : 1,
                            'order.orderDate'     : 1,
                            'invoice._id'         : 1,
                            'invoice.name'        : 1,
                            'invoice.invoiceDate' : 1,
                            'invoice.workflow'    : {$arrayElemAt: ['$invoice.workflow', 0]},
                            bankAccount           : {$arrayElemAt: ['$bankAccount', 0]},
                            otherIncomeLossAccount: {$arrayElemAt: ['$otherIncomeLossAccount', 0]},
                            'bankExpenses.account': {$arrayElemAt: ['$bankExpenses.account', 0]},
                            'bankExpenses.amount' : 1,

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
                            name                : 1,
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
                            supplier                     : 1,
                            'bankAccount.name'           : '$bankAccount.name',
                            'bankAccount._id'            : '$bankAccount._id',
                            'otherIncomeLossAccount.name': '$otherIncomeLossAccount.name',
                            'otherIncomeLossAccount._id' : '$otherIncomeLossAccount._id',
                            currency                     : 1,
                            'invoice._id'                : 1,
                            'invoice.name'               : 1,
                            'invoice.invoiceDate'        : 1,
                            'invoice.workflow.name'      : '$invoice.workflow.name',
                            bankExpenses                 : 1,
                            order                        : 1,
                            name                         : 1,
                            salesmanagers                : {$arrayElemAt: ['$salesmanagers', 0]},
                            forSale                      : 1,
                            differenceAmount             : 1,
                            paidAmount                   : 1,
                            workflow                     : 1,
                            date                         : 1,
                            paymentMethod                : 1,
                            isExpense                    : 1,
                            bonus                        : 1,
                            paymentRef                   : 1,
                            year                         : 1,
                            month                        : 1,
                            period                       : 1,
                            refund                       : 1,
                            _type                        : 1
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
                            assigned              : {$arrayElemAt: ['$salesmanagers', 0]},
                            supplier              : 1,
                            bankAccount           : 1,
                            otherIncomeLossAccount: 1,
                            currency              : 1,
                            'invoice._id'         : 1,
                            'invoice.name'        : 1,
                            'invoice.invoiceDate' : 1,
                            'invoice.workflow'    : 1,
                            bankExpenses          : 1,
                            order                 : 1,
                            forSale               : 1,
                            differenceAmount      : 1,
                            paidAmount            : 1,
                            workflow              : 1,
                            date                  : 1,
                            name                  : 1,
                            paymentMethod         : 1,
                            isExpense             : 1,
                            bonus                 : 1,
                            paymentRef            : 1,
                            year                  : 1,
                            month                 : 1,
                            period                : 1,
                            refund                : 1,
                            _type                 : 1
                        }
                    }, {
                        $match: optionsObject
                    }, {
                        $project: {
                            supplier              : 1,
                            bankAccount           : 1,
                            otherIncomeLossAccount: 1,
                            currency              : 1,
                            'invoice._id'         : 1,
                            'invoice.name'        : 1,
                            'invoice.invoiceDate' : 1,
                            'invoice.workflow'    : 1,
                            'assigned.name'       : '$assigned.name',
                            assignedName          : {
                                $concat: ['$assigned.name.first', ' ', '$assigned.name.last']
                            },
                            'assigned._id'        : '$assigned._id',
                            bankExpenses          : 1,
                            order                 : 1,
                            forSale               : 1,
                            differenceAmount      : 1,
                            name                  : 1,
                            paidAmount            : 1,
                            workflow              : 1,
                            date                  : 1,
                            paymentMethod         : 1,
                            isExpense             : 1,
                            bonus                 : 1,
                            paymentRef            : 1,
                            year                  : 1,
                            month                 : 1,
                            period                : 1,
                            _type                 : 1,
                            refund                : 1,
                            removable             : {
                                $cond: {
                                    if  : {$and: [{$eq: ['$_type', 'ProformaPayment']}, {$eq: ['$invoice.workflow.name', 'Invoiced']}]},
                                    then: false,
                                    else: true
                                }
                            }
                        }
                    }, {
                        $match: matchObject
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
                            _id                   : '$root._id',
                            supplier              : '$root.supplier',
                            bankAccount           : '$root.bankAccount',
                            otherIncomeLossAccount: '$root.otherIncomeLossAccount',
                            currency              : '$root.currency',
                            invoice               : '$root.invoice',
                            assigned              : '$root.assigned',
                            bankExpenses          : '$root.bankExpenses',
                            order                 : '$root.order',
                            forSale               : '$root.forSale',
                            differenceAmount      : '$root.differenceAmount',
                            name                  : '$root.name',
                            paidAmount            : '$root.paidAmount',
                            workflow              : '$root.workflow',
                            date                  : '$root.date',
                            paymentMethod         : '$root.paymentMethod',
                            isExpense             : '$root.isExpense',
                            bonus                 : '$root.bonus',
                            paymentRef            : '$root.paymentRef',
                            year                  : '$root.year',
                            month                 : '$root.month',
                            period                : '$root.period',
                            _type                 : '$root._type',
                            refund                : '$root.refund',
                            removable             : '$root.removable',
                            total                 : 1
                        }
                    }
                ];
            }

            aggregate.push({
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            });

            Payment.aggregate(aggregate, waterfallCallback);
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
        var id = req.query.id || req.query._id;
        var query;
        var Payment = returnModel(req);

        query = Payment.findById(id);

        query
            .populate('supplier', '_id name fullName')
            .populate('paymentMethod', '_id name')
            .populate('bankAccount', '_id name')
            .populate('currency._id', '_id name')
            .populate('order', 'name')
            .populate('invoice');

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

    this.amountLeftCalc = function (req, res, next) {
        var data = req.query;
        var diff;
        var date = new Date(data.date);
        var totalAmount = data.totalAmount;
        var paymentAmount = data.paymentAmount;
        var invoiceCurrency = data.invoiceCurrency;
        var paymentCurrency = data.paymentCurrency;
        var fx = {};

        date = moment(date).format('YYYY-MM-DD');

        ratesService.getById({id: date, dbName: req.session.lastDb}, function (err, result) {
            var rate;

            if (err) {
                return next(err);
            }

            fx.rates = result && result.rates ? result.rates : {};
            fx.base = result && result.base ? result.base : 'USD';

            // rate = fx.rates[paymentCurrency][invoiceCurrency] || (1 / fx.rates[invoiceCurrency][paymentCurrency]) || 1;
            rate = ratesRetriever.getRate(fx.rates, invoiceCurrency, paymentCurrency);

            diff = totalAmount - paymentAmount / rate;

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
        var purchasePayments = type === 'purchasePayments';

        var options = {
            forSale         : forSale,
            bonus           : bonus,
            salary          : salary,
            dividend        : dividend,
            expenses        : expenses,
            purchasePayments: purchasePayments
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
                        _id  : _payment.supplier._id,
                        name : _payment.supplier.name
                    },

                    amount: _payment.paidAmount * 100
                };

                journalEntry.createReconciled(bodySalary, {
                    dbName: req.session.lastDb,
                    uId   : req.session.uId
                });
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

    this.refundAmount = function (req, res, next) {
        var db = req.session.lastDb;
        var Payment = models.get(db, 'prepayment', PrepaymentSchema);
        var query = req.query;
        var id = query.id;
        var max = 0;
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var invoice;

        /* Payment.aggregate([{
         $match: {
         refundId: objectId(id),
         refund  : true
         }
         }, {
         $group: {
         _id       : null,
         paidAmount: {$sum: '$paidAmount'}
         }
         }], function (err, result) {
         var refundAmount;

         if (err) {
         return next(err);
         }

         refundAmount = result && result.length ? result[0].paidAmount / 100 : 0;

         res.status(200).send({refundAmount: refundAmount});
         });*/

        Payment.findById(id).populate('invoice').exec(function (err, payment) {
            if (err) {
                return next(err);
            }

            if (payment.order) {
                Invoice.aggregate([{
                    $match: {
                        sourceDocument: payment.order
                    }
                }, {
                    $project: {
                        name       : 1,
                        paymentInfo: 1
                    }
                }], function (err, result) {

                    if (err) {
                        return next(err);
                    }

                    invoice = result && result.length ? result[0] : null;

                    if (invoice) {
                        max = invoice.paymentInfo.total - invoice.paymentInfo.balance;

                        res.status(200).send({refundAmount: max / 100});
                    } else {
                        Payment.aggregate([{
                            $match: {
                                order : payment.order,
                                refund: true
                            }
                        }, {
                            $project: {
                                paidAmount: 1,
                                currency  : 1,
                                date      : 1,
                                name      : 1,
                                refund    : 1
                            }
                        }, {
                            $project: {
                                paidAmount: {$divide: ['$paidAmount', '$currency.rate']},
                                date      : 1,
                                name      : 1,
                                refund    : 1
                            }
                        }, {
                            $group: {
                                _id  : null,
                                sum  : {$sum: '$paidAmount'},
                                names: {$push: '$name'},
                                date : {$min: '$date'}
                            }
                        }], function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            max = result && result.length ? result[0].sum : 0;

                            res.status(200).send({refundAmount: max / 100});
                        });
                    }
                });
            } else if (payment.invoice && payment.invoice._id) {
                max = payment.invoice.paymentInfo.total - payment.invoice.paymentInfo.balance;

                res.status(200).send({refundAmount: max / 100});
            } else {
                res.status(200).send({refundAmount: 0});
            }
        });

    };

    this.getPrepayments = function (req, res, next) {
        var db = req.session.lastDb;
        var Payment = models.get(db, 'prepayment', PrepaymentSchema);
        var query = req.query;
        var id = query.id;

        Payment.aggregate([{
            $match: {
                order: objectId(id)
            }
        }, {
            $project: {
                currency  : 1,
                paidAmount: 1,
                refund    : 1
            }
        }, {
            $project: {
                sum          : {$divide: ['$paidAmount', '$currency.rate']},
                sumInCurrency: '$paidAmount',
                refund       : 1
            }
        }, {
            $project: {
                sum          : {$cond: [{$eq: ['$refund', true]}, {$multiply: ['$sum', -1]}, '$sum']},
                sumInCurrency: '$paidAmount',
                refund       : 1
            }
        }, {
            $group: {
                _id          : null,
                sum          : {$sum: '$sum'},
                sumInCurrency: {$sum: '$sumInCurrency'}
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result && result.length ? {
                    sum          : result[0].sum || 0,
                    sumInCurrency: result[0].sumInCurrency || 0
                } : {});
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
                        $or: [{'invoice.project': projectId}, {'order.project': projectId}]
                    }, {
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
                $lookup: {
                    from        : 'Order',
                    localField  : 'order',
                    foreignField: '_id',
                    as          : 'order'
                }
            }, {
                $project: {
                    invoice : {$arrayElemAt: ['$invoice', 0]},
                    order   : {$arrayElemAt: ['$order', 0]},
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
                                $lte: ['$$projectMember.startDate', '$order.orderDate']
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }, {
                            $and: [{
                                $eq: ['$$projectMember.startDate', null]
                            }, {
                                $gte: ['$$projectMember.endDate', '$order.orderDate']
                            }]
                        }, {
                            $and: [{
                                $lte: ['$$projectMember.startDate', '$order.orderDate']
                            }, {
                                $gte: ['$$projectMember.endDate', '$order.orderDate']
                            }]
                        }]
                    }]
            };

            optionsObject.$and = [];

            optionsObject.$and.push({_id: {$in: _.pluck(ids, '_id')}});
            // optionsObject.$and.push({_type: {$in: ['InvoicePayment', 'ProformaPayment']}});

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
                    from        : 'Order',
                    localField  : 'order',
                    foreignField: '_id',
                    as          : 'order'
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
                    from        : 'chartOfAccount',
                    localField  : 'bankAccount',
                    foreignField: '_id',
                    as          : 'bankAccount'
                }
            }, {
                $project: {
                    supplier        : {$arrayElemAt: ['$supplier', 0]},
                    invoice         : {$arrayElemAt: ['$invoice', 0]},
                    order           : {$arrayElemAt: ['$order', 0]},
                    paymentMethod   : {$arrayElemAt: ['$paymentMethod', 0]},
                    bankAccount     : {$arrayElemAt: ['$bankAccount', 0]},
                    bankExpenses    : 1,
                    currency        : 1,
                    differenceAmount: 1,
                    paidAmount      : 1,
                    workflow        : 1,
                    name            : 1,
                    date            : 1,
                    _type           : 1,
                    project         : {
                        $cond: {
                            if  : {$eq: ['$invoice', []]},
                            then: true,
                            else: false
                        }
                    }
                }
            }, {
                $project: {
                    supplier        : 1,
                    invoice         : 1,
                    order           : 1,
                    paymentMethod   : 1,
                    bankAccount     : 1,
                    bankExpenses    : 1,
                    currency        : 1,
                    differenceAmount: 1,
                    paidAmount      : 1,
                    workflow        : 1,
                    name            : 1,
                    date            : 1,
                    _type           : 1,
                    project         : {
                        $cond: ['$project', '$order.project', '$invoice.project']
                    }
                }
            }, {
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'project',
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
                    bankExpenses      : 1,
                    'invoice._id'     : 1,
                    'invoice.name'    : 1,
                    'order._id'       : 1,
                    'order.orderDate' : 1,
                    'order.name'      : 1,
                    'bankAccount._id' : 1,
                    'bankAccount.name': 1,
                    'invoice.workflow': {$arrayElemAt: ['$invoice.workflow', 0]},

                    salesmanagers: {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : salesManagerMatch
                        }
                    },

                    name                : 1,
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
                    bankExpenses    : 1,
                    bankAccount     : 1,
                    order           : 1,
                    'invoice._id'   : 1,
                    'invoice.name'  : 1,
                    salesmanagers   : {$arrayElemAt: ['$salesmanagers', 0]},
                    differenceAmount: 1,
                    paidAmount      : 1,
                    workflow        : 1,
                    name            : 1,
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
                    currencyModel   : {$arrayElemAt: ['$currency._id', 0]},
                    bankExpenses    : 1,
                    order           : 1,
                    bankAccount     : 1,
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
                    bankExpenses    : 1,
                    bankAccount     : 1,
                    'currency.rate' : 1,
                    'currency._id'  : '$currencyModel._id',
                    'currency.name' : '$currencyModel.name',
                    'invoice._id'   : 1,
                    'invoice.name'  : 1,
                    'assigned.name' : '$assigned.name',
                    order           : 1,
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
                    bankExpenses    : '$root.bankExpenses',
                    bankAccount     : '$root.bankAccount',
                    currency        : '$root.currency',
                    invoice         : '$root.invoice',
                    order           : '$root.order',
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

    function createRefund(options, res, next) {
        var Model = options.model;
        var req = options.req;
        var dbName = req.session.lastDb;
        var data = req.body;
        var workflowHandler = new WorkflowHandler(models);
        var now = new Date();
        var date = data.date ? moment(new Date(data.date)) : now;
        var waterfallTasks;
        var fx = {};
        var request = {
            query: {
                source      : 'purchase',
                targetSource: 'invoice'
            },

            session: req.session
        };

        function getRates(waterfallCallback) {
            ratesService.getById({id: date, dbName: dbName}, function (err, result) {
                if (err) {
                    return waterfallCallback(err);
                }
                fx.rates = result && result.rates ? result.rates : {};
                fx.base = result && result.base ? result.base : 'USD';
                waterfallCallback();
            });
        }

        function savePayment(waterfallCallback) {
            var payment = new Model(data);

            payment.createdBy.user = req.session.uId;
            payment.editedBy.user = req.session.uId;

            payment.currency.rate = ratesRetriever.getRate(fx.rates, fx.base, data.currency.name);

            payment.save(function (err, payment) {
                if (err) {
                    return waterfallCallback(err);
                }

                Model.findById(payment._id).populate('paymentMethod').exec(function (err, resultPayment) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    waterfallCallback(null, resultPayment);
                });
            });
        }

        function createJournalEntry(payment, waterfallCallback) {
            var bankAccount = payment.bankAccount;
            var debitAccount;
            var amount = payment.paidAmount;
            var rate = ratesRetriever.getRate(fx.rates, fx.base, payment.currency._id);
            var ratedAmount = amount / rate;
            var paymentBody;
            var accountsItems = [];

            if (payment.order) {
                debitAccount = MAIN_CONSTANTS.USR;
            } else if (payment.invoice) {
                debitAccount = MAIN_CONSTANTS.ACCOUNT_RECEIVABLE;
            }

            paymentBody = {
                journal : null,
                currency: {
                    _id : payment.currency._id,
                    rate: payment.currency.rate
                },

                date          : payment.date,
                sourceDocument: {
                    model: 'Payment',
                    _id  : payment._id,
                    name : payment.name
                },

                accountsItems: accountsItems,
                amount       : ratedAmount
            };

            accountsItems.push({
                debit  : 0,
                credit : ratedAmount,
                account: bankAccount
            }, {
                debit  : ratedAmount,
                credit : 0,
                account: debitAccount
            });

            paymentBody.dbName = req.session.lastDb;
            paymentBody.uId = req.session.uId;
            paymentBody.notDivideRate = true;

            journalService.createMultiRows(paymentBody);

            waterfallCallback(null, payment);
        }

        function updateInvoice(payment, waterfallCallback) {
            invoiceService.find({_id: payment.invoice}, {dbName: dbName}, function (err, result) {
                var invoice;
                if (err) {
                    return waterfallCallback(err);
                }

                invoice = result && result.length ? result[0] : {};

                if (invoice.forSales) {
                    request.query.wId = 'Sales Invoice';
                } else {
                    request.query.wId = 'Purchase Invoice';
                }

                request.query.status = 'New';
                request.query.order = 1;

                if (invoice.paymentInfo.balance + payment.paidAmount === invoice.paymentInfo.total) {

                    workflowHandler.getFirstForConvert(request, function (err, workflow) {
                        invoiceService.findAndUpdate({_id: payment.invoice}, {
                            $inc: {'paymentInfo.balance': payment.paidAmount},
                            $set: {workflow: workflow._id}
                        }, {
                            dbName: dbName,
                            new   : true
                        }, function (err) {
                            if (err) {
                                return waterfallCallback(err);
                            }

                            waterfallCallback(null, payment);
                        });
                    });

                } else {
                    invoiceService.findAndUpdate({_id: payment.invoice}, {$inc: {'paymentInfo.balance': payment.paidAmount}}, {
                        dbName: dbName,
                        new   : true
                    }, function (err) {
                        if (err) {
                            return waterfallCallback(err);
                        }

                        waterfallCallback(null, payment);
                    });
                }
            });
        }

        if (data.checkSource) {
            invoiceService.getSourceForRefund({dbName: dbName, sourceDocument: data.order}, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (result.order) {
                    data.order = result.id;
                } else if (result.invoice) {
                    data.invoice = result.id;

                    delete data.order;
                }

                waterfallTasks = [getRates, savePayment, createJournalEntry];

                if (data.invoice) {
                    waterfallTasks.push(updateInvoice);
                }

                async.waterfall(waterfallTasks, function (err, payment) {
                    if (err) {

                        return next(err);
                    }

                    res.status(201).send(payment);
                });
            });
        } else {
            waterfallTasks = [getRates, savePayment, createJournalEntry];

            if (data.invoice) {
                waterfallTasks.push(updateInvoice);
            }

            async.waterfall(waterfallTasks, function (err, payment) {
                if (err) {

                    return next(err);
                }

                res.status(201).send(payment);
            });
        }

    }

    this.create = function (req, res, next) {
        var dbName = req.session.lastDb;
        var body = req.body;
        var PaymentSchema;
        var Invoice;
        var Order;
        var workflowHandler = new WorkflowHandler(models);
        var invoiceId = body.invoice;
        var orderId = body.order;
        var now = new Date();
        var date = body.date ? moment(new Date(body.date)) : now;
        var mid = body.mid;
        var data = body;
        var isForSale = data.forSale;
        var project;
        var Payment;
        var removable = true;
        var waterfallTasks;
        var fx = {};
        var refundsOptions;

        delete data.mid;

        date = date.format('YYYY-MM-DD');

        if (mid === 56) {
            PaymentSchema = mongoose.Schemas.InvoicePayment;
            Payment = models.get(req.session.lastDb, 'InvoicePayment', PaymentSchema);
            Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
            removable = false;
        } else if (mid === 123) {
            PaymentSchema = mongoose.Schemas.Prepayment;
            Payment = models.get(req.session.lastDb, 'prepayment', PaymentSchema);
            Order = models.get(dbName, 'Order', OrderSchema);
        } else if (mid === 129) {
            PaymentSchema = mongoose.Schemas.Prepayment;
            Payment = models.get(req.session.lastDb, 'prepayment', PaymentSchema);
            Order = models.get(dbName, 'purchaseOrders', purchaseOrders);
        } else if (mid === 128) {
            PaymentSchema = mongoose.Schemas.Payment;
            Payment = models.get(req.session.lastDb, 'InvoicePayment', PaymentSchema);
            Invoice = models.get(req.session.lastDb, 'invoices', InvoicesSchema);
        } else if (mid === 130) {
            PaymentSchema = mongoose.Schemas.purchasePayments;
            Payment = models.get(req.session.lastDb, 'purchasePayments', PaymentSchema);
            Invoice = models.get(req.session.lastDb, 'purchaseInvoices', purchaseInvoicesSchema);
        } else if (mid === 97) {
            PaymentSchema = mongoose.Schemas.ExpensesInvoicePayment;
            Payment = models.get(req.session.lastDb, 'expensesInvoicePayment', PaymentSchema);
            Invoice = models.get(req.session.lastDb, 'expensesInvoice', ExpensesInvoiceSchema);
        } else if (mid === 100) {
            PaymentSchema = mongoose.Schemas.DividendInvoicePayment;
            Payment = models.get(req.session.lastDb, 'dividendInvoicePayment', PaymentSchema);
            Invoice = models.get(req.session.lastDb, 'dividendInvoice', DividendInvoiceSchema);
        } else if (mid === 109) {
            PaymentSchema = mongoose.Schemas.purchasePayments;
            Payment = models.get(req.session.lastDb, 'purchasePayments', PaymentSchema);
            Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        }

        if (data.refund) {
            refundsOptions = {
                data  : req.body,
                dbName: req.session.lastDb,
                user  : req.session.uId
            };

            return refundsHelper.createPaymentReturn(refundsOptions, function (err, payment) {
                if (err) {
                    return next(err);
                }

                res.status(201).send(payment);
            });
        }

        function fetchInvoice(waterfallCallback) {
            if (invoiceId) {
                Invoice.find({_id: invoiceId}).populate('payments').exec(function (err, invoice) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    waterfallCallback(null, {
                        invoice: invoice && invoice.length ? invoice[0] : {}
                    });
                });
            } else {
                Order.find({_id: orderId}).exec(function (err, order) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    waterfallCallback(null, {
                        order: order && order.length ? order[0] : {}
                    });
                });
            }

        }

        function savePayment(invoice, waterfallCallback) {
            var source = invoice.invoice || invoice.order;
            var payment = new Payment(data);

            // payment.paidAmount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
            // payment.name = invoice.sourceDocument;
            payment.whoCanRW = source.whoCanRW;
            payment.groups = source.groups;
            payment.createdBy.user = req.session.uId;
            payment.editedBy.user = req.session.uId;

            payment.currency.rate = ratesRetriever.getRate(fx.rates, fx.base, data.currency.name);

            payment.save(function (err, payment) {
                if (err) {
                    return waterfallCallback(err);
                }

                Payment.findById(payment._id).populate('paymentMethod').exec(function (err, resultPayment) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    waterfallCallback(null, invoice, resultPayment);
                });
            });
        }

        function invoiceUpdater(invoice, payment, waterfallCallback) {
            var sourceInvoice = invoice.invoice;
            var sourceOrder = invoice.order;
            var totalToPay = sourceInvoice && sourceInvoice.paymentInfo ? sourceInvoice.paymentInfo.balance : 0;
            var paid = payment.paidAmount;
            var paymentCurrency = payment.currency._id;
            var invoiceCurrency = sourceInvoice ? sourceInvoice.currency._id : sourceOrder.currency._id;
            var isNotFullPaid;
            var wId;
            var paymentDate = new Date(payment.date);
            var invoiceType = sourceInvoice && sourceInvoice._type;
            var payments = [];
            var rate = ratesRetriever.getRate(fx.rates, fx.base, paymentCurrency);
            var request = {
                query: {
                    source      : 'purchase',
                    targetSource: 'invoice'
                },

                session: req.session
            };

            if (!sourceOrder) {

                if (!paymentCurrency) {
                    paymentCurrency = invoiceCurrency;
                }

                if (paymentDate > sourceInvoice.paymentDate) {
                    sourceInvoice.paymentDate = paymentDate;
                }

                sourceInvoice.removable = removable;

                sourceInvoice.payments = sourceInvoice.payments || [];

                paid = paid / rate;

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

                totalToPay = parseInt(totalToPay, 10);
                paid = parseInt(paid, 10);

                isNotFullPaid = paid < totalToPay;

                if (isNotFullPaid || sourceOrder) {
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

                    sourceInvoice.payments.push(payment._id);

                    sourceInvoice.workflow = workflow._id;
                    sourceInvoice.paymentInfo.balance = totalToPay - paid;

                    sourceInvoice.paymentDate = new Date(paymentDate); // Because we have it in post.schema

                    Invoice.findByIdAndUpdate(invoiceId, sourceInvoice, {new: true}).exec(function (err, invoice) {

                        if (err) {
                            return waterfallCallback(err);
                        }

                        if (project) {
                            event.emit('fetchInvoiceCollection', {project: project, dbName: dbName});
                        }

                        ratesService.getPrevious({
                            id    : moment(paymentDate).format('YYYY-MM-DD'),
                            dbName: dbName
                        }, function (err, prevRates) {
                            if (err) {
                                return waterfallCallback(err);
                            }

                            invoice = invoice.toJSON();

                            invoice.rates = prevRates && prevRates.rates ? prevRates.rates : {};
                            invoice.base = prevRates && prevRates.base ? prevRates.base : 'USD';

                            waterfallCallback(null, invoice, payment);
                        });

                    });

                });
            } else {
                if (sourceOrder.forSales) {
                    request = {
                        query: {
                            wId   : 'Sales Order',
                            status: 'In Progress'
                        },

                        session: req.session
                    };
                } else {
                    request = {
                        query: {
                            wId   : 'Purchase Order',
                            status: 'In Progress'
                        },

                        session: req.session
                    };
                }

                workflowHandler.getFirstForConvert(request, function (err, result) {
                    var editedBy;

                    if (err) {
                        return waterfallCallback(err);
                    }

                    editedBy = {
                        user: req.session.uId,
                        date: new Date()
                    };

                    Order.findByIdAndUpdate(sourceOrder._id, {
                        $set: {
                            workflow: result._id,
                            editedBy: editedBy
                        }
                    }, {new: true}, function (err) {
                        if (err) {
                            return waterfallCallback(err);
                        }

                        waterfallCallback(null, sourceOrder, payment);
                    });
                });
            }
        }

        function createJournalEntry(invoice, payment, waterfallCallback) {
            var journal = payment.journal;
            var invoiceType = invoice._type;
            var paymentBody;
            var amountByInvoice;
            var differenceAmount;
            var accountsItems = [];
            var debitAccount;
            var creditAccount;
            var prevRates = invoice.rates;
            var base = invoice.base || 'USD';
            var invoiceRate = ratesRetriever.getRate(prevRates, fx.base, invoice.currency._id);
            var gainAccount;
            var lossAccount;
            var rate = ratesRetriever.getRate(fx.rates, fx.base, payment.currency._id);

            if (isForSale) {
                if (invoiceType === 'Order') {
                    debitAccount = payment.bankAccount;
                    creditAccount = MAIN_CONSTANTS.USR;
                } else {
                    debitAccount = payment.bankAccount;
                    creditAccount = MAIN_CONSTANTS.ACCOUNT_RECEIVABLE;
                }

            } else {
                creditAccount = payment.bankAccount;
                debitAccount = MAIN_CONSTANTS.ACCOUNT_PAYABLE;
            }

            if (!journal) {
                if (invoiceType === 'Proforma') {
                    journal = MAIN_CONSTANTS.PROFORMA_JOURNAL;
                } else if (invoiceType === 'expensesInvoicePayment') {
                    journal = MAIN_CONSTANTS.EXPENSES_PAYMENT_JOURNAL;
                } else if (invoiceType === 'dividendInvoicePayment') {
                    journal = MAIN_CONSTANTS.DIVIDEND_PAYMENT_JOURNAL;
                }
            }

            amountByInvoice = payment.paidAmount / invoiceRate;
            differenceAmount = payment.paidAmount / rate;

            paymentBody = {
                journal : journal && journal._id ? journal._id : null,
                currency: {
                    _id : payment.currency._id,
                    rate: payment.currency.rate
                },

                date          : payment.date,
                sourceDocument: {
                    model: 'Payment',
                    _id  : payment._id,
                    name : payment.name
                },

                accountsItems: accountsItems,
                amount       : differenceAmount
            };

            if (payment.bankExpenses && payment.bankExpenses.amount) {
                if (isForSale) {
                    paymentBody.accountsItems.push({
                        credit : 0,
                        debit  : payment.bankExpenses.amount,
                        account: debitAccount
                    });
                } else {
                    paymentBody.accountsItems.push({
                        debit  : 0,
                        credit : payment.bankExpenses.amount,
                        account: creditAccount
                    });
                }
            }

            if (payment.overPayment && payment.overPayment.amount) {
                paymentBody.accountsItems.push({
                    debit  : payment.overPayment.amount,
                    credit : 0,
                    account: debitAccount
                });
            }

            if (payment.paymentMethod.currency !== fx.base) {
                gainAccount = '565eb53a6aa50532e5df0b15'; // unrealized
                lossAccount = '565eb53a6aa50532e5df0b16'; // unrealized
            } else {
                gainAccount = '565eb53a6aa50532e5df0be1'; // foreign ex gain
                lossAccount = '565eb53a6aa50532e5df0be3'; // foreign ex loss
            }
            if (isFinite(amountByInvoice) && Math.abs(amountByInvoice - differenceAmount) !== 0) {

                if (isForSale) {
                    if (differenceAmount > amountByInvoice) {
                        paymentBody.accountsItems.push({
                            debit  : 0,
                            credit : Math.abs(amountByInvoice - differenceAmount),
                            account: gainAccount
                        });

                    } else if (differenceAmount < amountByInvoice) {

                        paymentBody.accountsItems.push({
                            credit : 0,
                            debit  : Math.abs(amountByInvoice - differenceAmount),
                            account: lossAccount
                        });

                    }
                } else {
                    if (differenceAmount > amountByInvoice) {
                        paymentBody.accountsItems.push({
                            credit : 0,
                            debit  : Math.abs(amountByInvoice - differenceAmount),
                            account: gainAccount
                        });

                    } else if (differenceAmount < amountByInvoice) {

                        paymentBody.accountsItems.push({
                            debit  : 0,
                            credit : Math.abs(amountByInvoice - differenceAmount),
                            account: lossAccount
                        });

                    }
                }

            }

            if (isForSale) {
                paymentBody.accountsItems.push({
                    debit   : 0,
                    credit  : amountByInvoice,
                    creditFC: payment.paidAmount,
                    account : creditAccount
                }, {
                    credit : 0,
                    debit  : differenceAmount - payment.bankExpenses.amount,
                    debitFC: payment.paidAmount,
                    account: debitAccount
                });
            } else {
                paymentBody.accountsItems.push({
                    debit   : 0,
                    credit  : differenceAmount - payment.bankExpenses.amount,
                    creditFC: payment.paidAmount,
                    account : creditAccount
                }, {
                    credit : 0,
                    debit  : amountByInvoice,
                    // debitFC: differenceAmount,
                    account: debitAccount
                });
            }

            paymentBody.dbName = req.session.lastDb;
            paymentBody.uId = req.session.uId;
            paymentBody.notDivideRate = true;

            journalService.createMultiRows(paymentBody);

            waterfallCallback(null, invoice, payment);
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
            ratesService.getById({id: date, dbName: dbName}, function (err, result) {
                if (err) {
                    return waterfallCallback(err);
                }
                fx.rates = result && result.rates ? result.rates : {};
                fx.base = result && result.base ? result.base : 'USD';
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
        var fx = {};
        var paymentCurrency;

        async.eachLimit(ids, 1, function (id, cb) {
            Payment.findByIdAndRemove(id, function (err, removed) {
                if (err) {
                    return next(err);
                }

                if (!removed) {
                    return res.status(200).send(removed);
                }

                date = moment(removed.date).format('YYYY-MM-DD');

                paymentCurrency = removed.currency._id;

                ratesService.getPrevious({id: date, dbName: db}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    fx.rates = result && result.rates ? result.rates : {};
                    fx.base = result && result.rates ? result.base : 'USD';

                    journalEntry.removeByDocId(id, db, function () {

                    });

                    invoiceId = removed ? removed.get('invoice') : null;
                    paid = removed ? removed.get('paidAmount') : 0;

                    if (invoiceId && (removed && removed._type !== 'salaryPayment')) {

                        Invoice = models.get(db, 'wTrackInvoice', wTrackInvoiceSchema);

                        Invoice.find({_id: invoiceId}, function (err, invoices) {
                            if (err) {
                                return next(err);
                            }

                            invoices.forEach(function (inv) {
                                Invoice.findByIdAndUpdate(inv._id, {$pull: {payments: removed._id}}, {new: true})
                                    .populate('payments')
                                    .exec(function (err, invoice) {

                                        var paymentInfo = invoice.get('paymentInfo');
                                        var project = invoice ? invoice.get('project') : null;
                                        var payments = invoice ? invoice.get('payments') : [];
                                        var removable = true;
                                        var invoiceType = invoice._type;
                                        var paymentDate = null;
                                        var rate = ratesRetriever.getRate(fx.rates, invoice.currency._id, paymentCurrency);

                                        paid = removed.paidAmount / rate;

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

                                            if (removed.refund) {
                                                paid *= -1;
                                            }

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
        var fx = {};
        var paymentCurrency;

        Payment.findByIdAndRemove(id, function (err, removed) {
            if (err) {
                return next(err);
            }

            date = moment(removed.date).format('YYYY-MM-DD');

            paymentCurrency = removed.currency._id;

            ratesService.getById({id: date, dbName: db}, function (err, result) {
                if (err) {
                    return next(err);
                }

                fx.rates = result && result.rates ? result.rates : {};
                fx.base = result && result.base ? result.base : 'USD';

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
                                .exec(function (err, invoice) {

                                    var paymentInfo = invoice.get('paymentInfo');
                                    var project = invoice ? invoice.get('project') : null;
                                    var payments = invoice ? invoice.get('payments') : [];
                                    var removable = true;
                                    var invoiceType = invoice._type;
                                    var paymentDate = null;
                                    var rate = ratesRetriever.getRate(fx.rates, invoice.currency._id, paymentCurrency);

                                    if (paymentCurrency !== invoice.currency._id) {
                                        paid = removed.paidAmount / rate;
                                    } else {
                                        paid = removed.paidAmount;
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

                                    if (invoiceType === 'wTrackInvoice' || invoiceType === 'Invoices' || invoiceType === 'expensesInvoice' || invoiceType === 'dividendInvoice') {
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
    };

};

module.exports = Module;
