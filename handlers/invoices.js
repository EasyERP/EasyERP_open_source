var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');
// var oxr = require('open-exchange-rates');
// var fx = require('money');
var moment = require('../public/js/libs/moment/moment');
var fs = require('fs');
var pathMod = require('path');
var pageHelper = require('../helpers/pageHelper');

var invoiceCT = 'Invoices';
var purchaseInvoiceCT = 'purchaseInvoices';

var Module = function (models, event) {
    'use strict';

    var InvoiceSchema = mongoose.Schemas.Invoices;
    var purchaseInvoicesSchema = mongoose.Schemas.purchaseInvoices;
    var OrderSchema = mongoose.Schemas.Order;
    var DepartmentSchema = mongoose.Schemas.Department;
    var CustomerSchema = mongoose.Schemas.Customer;
    var OrderRowsSchema = mongoose.Schemas.OrderRow;
    var PrepaymentSchema = mongoose.Schemas.Prepayment;
    var WriteOffSchema = mongoose.Schemas.writeOff;
    var ExpensesInvoiceSchema = mongoose.Schemas.expensesInvoice;
    var DividendInvoiceSchema = mongoose.Schemas.dividendInvoice;
    var wTrackInvoiceSchema = mongoose.Schemas.wTrackInvoice;
    var wTrackSchema = mongoose.Schemas.wTrack;
    var objectId = mongoose.Types.ObjectId;

    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var access = require('../helpers/access.js')(models);
    var rewriteAccess = require('../helpers/rewriteAccess');
    var async = require('async');
    var workflowHandler = new WorkflowHandler(models);
    var _ = require('../node_modules/underscore');
    var CONSTANTS = require('../constants/mainConstants.js');
    var JournalEntryService = require('../services/journalEntry')(models);
    var JournalEntryHandler = require('./journalEntry');
    var _journalEntryHandler = new JournalEntryHandler(models, event);
    var path = require('path');
    var Uploader = require('../services/fileStorage/index');
    var HistoryService = require('../services/history.js')(models);
    var shippingService = require('../services/shippingMethod.js')(models);
    var JobsService = require('../services/jobs.js')(models);
    var ratesService = require('../services/rates')(models);
    var orgService = require('../services/organizationSetting')(models);
    var uploader = new Uploader();
    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();
    var ratesRetriever = require('../helpers/ratesRetriever')();
    var wTrackInvoiceCT = 'wTrackInvoice';

    // oxr.set({app_id: process.env.OXR_APP_ID});

    function getHistory(req, invoice, cb) {
        var dbName = req.session.lastDb;
        var Invoice = models.get(dbName, 'Invoices', InvoiceSchema);

        var historyOptions = {
            forNote: true,
            dbName : dbName,
            id     : invoice._id
        };

        HistoryService.getHistoryForTrackedObject(historyOptions, function (err, history) {
            var notes;
            var payments;

            if (err) {
                return cb(err);
            }

            notes = history.map(function (elem) {
                return {
                    date   : new Date(elem.date),
                    history: elem,
                    user   : elem.editedBy
                };
            });

            Invoice.populate(invoice, {
                path  : 'payments.createdBy.user',
                model : 'Users',
                select: 'login'
            }, function (err, invoice) {

                Invoice.populate(invoice, {
                    path  : 'payments.currency._id',
                    model : 'currency',
                    select: 'symbol'
                }, function (err, invoice) {
                    var payments;

                    payments = invoice.payments.map(function (elem) {
                        return {
                            date: elem.createdBy ? new Date(elem.createdBy.date) : '',
                            pay : (elem.currency && elem.currency._id ? elem.currency._id.symbol : '') + (elem.paidAmount / 100).toFixed(2),
                            user: elem.createdBy && elem.createdBy.user ? elem.createdBy.user.toJSON() : ''
                        };
                    });

                    if (!invoice.notes) {
                        invoice.notes = [];
                    }

                    invoice.notes = invoice.notes.concat(notes, payments);
                    invoice.notes = _.map(invoice.notes, function (el) {
                        el.date = new Date(el.date);

                        return el;
                    });
                    invoice.notes = _.sortBy(invoice.notes, 'date');
                    cb(null, invoice);
                });

            });

        }, true);

    }

    this.receive = function (req, res, next) {
        var id = req.body.orderId;
        var forSales = req.body.forSales;
        var journal = req.body.journal;
        var dbIndex = req.session.lastDb;
        var Invoice = models.get(dbIndex, 'Invoices', InvoiceSchema);
        var Payments = models.get(dbIndex, 'prepayment', PrepaymentSchema);
        var Order = models.get(dbIndex, 'order', OrderSchema);
        var Company = models.get(dbIndex, 'Customer', CustomerSchema);
        var request;
        var parallelTasks;
        var waterFallTasks;
        var createdInvoiceId;
        var fx = {};

        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        if (id.length < 24) {
            return res.status(400).send();
        }

        if (!forSales) {
            Invoice = models.get(dbIndex, purchaseInvoiceCT, purchaseInvoicesSchema);
        }

        function fetchFirstWorkflow(callback) {
            if (forSales) {
                request = {
                    query: {
                        wId         : 'Sales Invoice',
                        source      : 'purchase',
                        targetSource: 'invoice'
                    },

                    session: req.session
                };
            } else {
                request = {
                    query: {
                        wId         : 'Purchase Invoice',
                        source      : 'purchase',
                        targetSource: 'invoice'
                    },

                    session: req.session
                };
            }

            workflowHandler.getFirstForConvert(request, callback);
        }

        function findOrder(callback) {
            var query = Order.findById(id).lean();

            query
                .populate('products.info')
                .populate('products.jobs')
                .populate('project', '_id name salesmanager');

            query.exec(callback);
        }

        function renameFolder(orderId, invoiceId) {
            var os = require('os');
            var osType = (os.type().split('_')[0]);
            var dir;
            var oldDir;
            var newDir;

            switch (osType) {
                case 'Windows':
                    dir = pathMod.join(__dirname, '..\\routes\\uploads\\');
                    break;
                case 'Linux':
                    dir = pathMod.join(__dirname, '..\/routes\/uploads\/');
                    break;
                // skip default;
            }

            oldDir = dir + orderId;
            newDir = dir + invoiceId;

            fs.rename(oldDir, newDir);
        }

        function findPrepayments(callback) {
            Payments.aggregate([{
                $match: {
                    order: objectId(id)
                }
            }, {
                $project: {
                    paidAmount: {$divide: ['$paidAmount', '$currency.rate']},
                    date      : 1,
                    refund    : 1
                }
            }, {
                $project: {
                    paidAmount: {$cond: [{$eq: ['$refund', true]}, {$multiply: ['$paidAmount', -1]}, '$paidAmount']},
                    date      : 1,
                    refund    : 1
                }
            }, {
                $group: {
                    _id : null,
                    date: {$max: '$date'},
                    sum : {$sum: '$paidAmount'}
                }
            }], callback);
        }

        function parallel(callback) {
            async.parallel(parallelTasks, callback);
        }

        function getRates(parallelResponse, callback) {
            var order = parallelResponse[0];
            var date = moment(order.orderDate).format('YYYY-MM-DD');

            ratesService.getById({id: date, dbName: req.session.lastDb}, function (err, result) {

                fx.rates = result && result.rates ? result.rates : {};
                fx.base = result && result.base ? result.base : 'USD';

                callback(null, parallelResponse);
            });
        }

        function createInvoice(parallelResponse, callback) {
            var order;
            var workflow;
            var err;
            var invoice;
            var invoiceCurrency;
            var query;
            var paidAmount = 0;
            var prepayments;

            if (parallelResponse && parallelResponse.length) {
                prepayments = parallelResponse[2][0];
                order = parallelResponse[0];
                workflow = parallelResponse[1];

            } else {
                err = new Error(RESPONSES.BAD_REQUEST);
                err.status = 400;

                return callback(err);
            }

            invoiceCurrency = order.currency._id;
            order.currency._id = order.currency._id;

            delete order._id;
            delete order._type;

            invoice = new Invoice(order);

            invoice.invoiceDate = order.orderDate;
            invoice.dueDate = order.expectedDate;

            if (prepayments && prepayments.sum) {
                /* prepayments.paymentInfo.forEach(function (payment) {
                 var paid = payment.paidAmount;
                 var paidInUSD = paid / payment.currency.rate;

                 // paidAmount += fx(paidInUSD).from('USD').to(invoiceCurrency);
                 paidAmount += paid;
                 });*/

                paidAmount = prepayments.sum;

                invoice.paymentDate = prepayments.date;
            }

            if (req.session.uId) {
                invoice.createdBy.user = req.session.uId;
                invoice.editedBy.user = req.session.uId;
            }

            invoice.currency.rate = ratesRetriever.getRate(fx.rates, fx.base, invoiceCurrency);

            // invoice.sourceDocument = order.name;

            invoice.sourceDocument = id;
            invoice.paymentReference = order.name;
            invoice.paymentInfo.balance = order.paymentInfo.total - paidAmount;
            invoice.paymentInfo.taxes = order.paymentInfo.taxes;

            if (paidAmount >= order.paymentInfo.total) {
                invoice.workflow = objectId(CONSTANTS.INVOICE_PAID);
            } else if (paidAmount) {
                invoice.workflow = objectId(CONSTANTS.INVOICE_PARTIALY_PAID);
            } else {
                invoice.workflow = workflow._id;
            }

            if (forSales || forSales === 'true') {
                if (!invoice.project) {
                    invoice.project = order.project ? order.project._id : null;
                }
            }

            invoice.supplier = order.supplier;

            invoice.journal = journal;

            if (forSales || forSales === 'true') {
                invoice.salesPerson = order.project ? order.project.salesmanager : order.salesPerson;

                invoice.save(function (err, result) {
                    var historyOptions;

                    if (err) {
                        return next(err);
                    }

                    createdInvoiceId = result._id;

                    historyOptions = {
                        contentType: 'invoice',
                        data       : result.toJSON(),
                        dbName     : dbIndex,
                        contentId  : createdInvoiceId
                    };

                    HistoryService.addEntry(historyOptions, function () {
                        callback(null, result);
                    });
                });

            } else {
                query = Company.findById(invoice.supplier, {salesPurchases: 1}).lean();

                query.populate('salesPurchases.salesPerson', 'name');

                query.exec(function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result && result.salesPurchases.salesPerson) {
                        invoice.salesPerson = result.salesPurchases.salesPerson._id;
                    }

                    invoice.save(function (err, result) {
                        var historyOptions;

                        if (err) {
                            return next(err);
                        }

                        createdInvoiceId = result._id;

                        historyOptions = {
                            contentType: 'invoice',
                            data       : result.toJSON(),
                            dbName     : dbIndex,
                            contentId  : createdInvoiceId
                        };

                        HistoryService.addEntry(historyOptions, function () {
                            callback(null, result);
                        });

                    });
                });

            }

        }

        parallelTasks = [findOrder, fetchFirstWorkflow, findPrepayments];
        waterFallTasks = [parallel, getRates, createInvoice];

        async.waterfall(waterFallTasks, function (err, result) {

            if (err) {
                return next(err);
            }

            if (forSales) {
                request = {
                    query: {
                        wId   : 'Sales Order',
                        status: 'Done'
                    },

                    session: req.session
                };
            } else {
                request = {
                    query: {
                        wId   : 'Purchase Order',
                        status: 'Done'
                    },

                    session: req.session
                };
            }

            workflowHandler.getFirstForConvert(request, function (err, result) {
                if (err) {
                    return next(err);
                }

                Order.findByIdAndUpdate(id, {
                    $set: {
                        workflow: result._id,
                        editedBy: editedBy
                    }
                }, {new: true}, function (err) {
                    if (err) {
                        return next(err);
                    }

                    JobsService.setInvoiceToJobs({invoice: createdInvoiceId, order: id, dbName: req.session.lastDb});
                });
            });

            res.status(201).send(result);
        });

    };

    this.getSalesByCountry = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);
        var filter = req.query.filter || {};
        filter._type = {
            value: [wTrackInvoiceCT]
        };

        Invoice.aggregate([{
            $match: {
                $and: [
                    {
                        forSales: true
                    },
                    filterMapper.mapFilter(filter, {contentType: wTrackInvoiceCT})
                ]
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, /*{
         $lookup: {
         from        : 'journalentries',
         localField  : '_id',
         foreignField: 'sourceDocument._id',
         as          : 'journalEntries'
         }
         }, {
         $match: {
         journalEntries: {$exists: true, $not: {$size: 0}}
         }
         },*/ {
            $project: {
                supplier: {$arrayElemAt: ['$supplier', 0]},
                pays    : {$divide: ['$paymentInfo.total', '$currency.rate']}
            }
        }, {
            $group: {
                _id : '$supplier.address.country',
                pays: {$sum: '$pays'}

            }
        }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.updateOnlySelected = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var id = req.params.id;
        var data = req.body;
        var headers = req.headers;
        var Invoice = models.get(dbIndex, 'Invoices', InvoiceSchema);
        var Customer = models.get(dbIndex, 'Customers', CustomerSchema);
        var date;
        var journal;
        var fileName;
        var os;
        var _id;
        var osType;
        var path;
        var dir;
        var newDirname;
        var obj;
        var fx = {};
        var reverse;

        if (id.length < 24) {
            return res.status(400).send();
        }

        if (parseInt(headers.mid, 10) === 97) {
            Invoice = models.get(dbIndex, 'expensesInvoice', ExpensesInvoiceSchema);
        }

        delete data.salesPerson;

        if (data.reverse) {
            reverse = data.reverse;

            delete data.reverse;
        }

        function reverseEntry() {
            JournalEntryService.findAndReverse({id: id, dbName: dbIndex, uId: req.session.uId});
        }

        if (data.invoiceDate) {
            date = moment(new Date(data.invoiceDate));
            date = date.format('YYYY-MM-DD');
        }

        if (data.notes && data.notes.length !== 0) {
            obj = data.notes[data.notes.length - 1];

            if (!obj._id) {
                obj._id = mongoose.Types.ObjectId();
            }

            // obj.date = new Date();

            if (!obj.user) {
                obj.user = {};
                obj.user._id = req.session.uId;
                obj.user.login = req.session.uName;
            }

            data.notes[data.notes.length - 1] = obj;
        }

        if (data.fileName) {

            fileName = data.fileName;
            os = require('os');
            osType = (os.type().split('_')[0]);

            _id = id;

            switch (osType) {
                case 'Windows':
                    newDirname = __dirname.replace('handlers', 'routes');

                    while (newDirname.indexOf('\\') !== -1) {
                        newDirname = newDirname.replace('\\', '\/');
                    }
                    path = newDirname + '\/uploads\/' + _id + '\/' + fileName;
                    dir = newDirname + '\/uploads\/' + _id;
                    break;
                case 'Linux':
                    newDirname = __dirname.replace('handlers', 'routes');

                    while (newDirname.indexOf('\\') !== -1) {
                        newDirname = newDirname.replace('\\', '\/');
                    }
                    path = newDirname + '\/uploads\/' + _id + '\/' + fileName;
                    dir = newDirname + '\/uploads\/' + _id;
                    break;
                //skip default;
            }

            fs.unlink(path, function (err) {
                console.log(err);
                fs.readdir(dir, function () {
                    if (data.attachments && data.attachments.length === 0) {
                        fs.rmdir(dir, function () {
                        });
                    }
                });
            });

            delete data.fileName;

            Invoice.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, invoice) {
                if (err) {
                    return next(err);
                }

                if (reverse) {
                    reverseEntry();
                }

                res.status(200).send(invoice);

            });

        } else {

            data.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            };

            if (date) {
                ratesService.getById({id: date, dbName: req.session.lastDb}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    fx.rates = result && result.rates ? result.rates : {};
                    fx.base = result && result.base ? result.base : 'USD';

                    if (data.currency && data.currency.name && Object.keys(fx.rates).length) {
                        data.currency.rate = ratesRetriever.getRate(fx.rates, fx.base, data.currency._id || data.currency.name);
                    } else {
                        delete data.currency;
                    }

                    Invoice.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, invoice) {
                        var products = data.products;
                        var historyOptions;

                        if (err) {
                            return next(err);
                        }

                        if (reverse) {
                            reverseEntry();
                        }

                        historyOptions = {
                            contentType: 'invoice',
                            data       : data,
                            dbName     : dbIndex,
                            contentId  : invoice._id
                        };

                        HistoryService.addEntry(historyOptions, function () {
                            Customer.populate(invoice, {
                                path  : 'supplier',
                                select: '_id name fullName'
                            }, function (err) {
                                if (err) {
                                    return next(err);
                                }

                                invoice.populate('workflow', '_id name status')
                                    .populate('sourceDocument', '_id name')
                                    .populate('journal', '_id name')
                                    .populate('payments', '_id name date paymentRef paidAmount createdBy currency')
                                    .populate('department', '_id name')
                                    .populate('currency._id', 'name symbol')
                                    .populate('products.jobs', 'name description')
                                    .populate('products.product', 'name info')
                                    .populate('paymentTerms', function (err, invoice) {
                                        if (err) {
                                            return next(err);
                                        }

                                        if (invoice && invoice._type !== 'Proforma') {
                                            getHistory(req, invoice.toJSON(), function (err, invoice) {
                                                if (err) {
                                                    return next(err);
                                                }

                                                res.status(200).send(invoice);
                                            });
                                        } else {
                                            res.status(200).send(invoice);
                                        }
                                    });

                            });
                        });

                    });
                });
            } else {
                Invoice.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, invoice) {
                    var products = data.products;
                    var historyOptions;

                    if (err) {
                        return next(err);
                    }

                    if (reverse) {
                        reverseEntry();
                    }

                    historyOptions = {
                        contentType: 'invoice',
                        data       : data,
                        dbName     : dbIndex,
                        contentId  : invoice._id
                    };

                    HistoryService.addEntry(historyOptions, function () {
                        Customer.populate(invoice, {
                            path  : 'supplier',
                            select: '_id name fullName'
                        }, function (err) {
                            if (err) {
                                return next(err);
                            }

                            invoice.populate('workflow', '_id name status')
                                .populate('sourceDocument', '_id name')
                                .populate('journal', '_id name')
                                .populate('payments', '_id name date paymentRef paidAmount createdBy currency')
                                .populate('department', '_id name')
                                .populate('currency._id', 'name symbol')
                                .populate('products.jobs', 'name description')
                                .populate('products.product', 'name info')
                                .populate('paymentTerms', function (err, invoice) {
                                    if (err) {
                                        return next(err);
                                    }

                                    if (invoice && invoice._type !== 'Proforma') {
                                        getHistory(req, invoice.toJSON(), function (err, invoice) {
                                            if (err) {
                                                return next(err);
                                            }

                                            res.status(200).send(invoice);
                                        });
                                    } else {
                                        res.status(200).send(invoice);
                                    }
                                });

                        });
                    });

                });
            }

        }
    };

    this.getEmails = function (req, res, next) {
        var id = req.params.id;
        var Invoice = models.get(req.session.lastDb, 'wTrackInvoice', InvoiceSchema);

        Invoice.aggregate([
            {
                $match: {
                    _id: objectId(id)
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesPerson',
                    foreignField: '_id',
                    as          : 'salesPerson'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'supplier',
                    foreignField: '_id',
                    as          : 'supplier'
                }
            }, {
                $project: {
                    salesPerson: {$arrayElemAt: ['$salesPerson', 0]},
                    supplier   : {$arrayElemAt: ['$supplier', 0]}
                }
            }, {
                $project: {
                    _id            : 0,
                    salesmanager   : '$salesPerson.workEmail',
                    customerPersons: '$supplier.email'
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });

    };

    function journalEntryExpensesComposer(invoice, dbIndex, waterfallCb, uId) {
        var journalEntryBody = {};
        var cb = waterfallCb;
        var creditAccount;

        journalEntryBody.date = invoice.invoiceDate;
        journalEntryBody.journal = invoice.journal && invoice.journal._id || CONSTANTS.EXPENSES_INVOICE_JOURNAL;
        journalEntryBody.currency = {};
        journalEntryBody.currency._id = invoice.currency._id || 'USD';
        journalEntryBody.currency.rate = invoice.currency.rate || 1;
        journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total/* / invoice.currency.rate*/ : 0;
        journalEntryBody.sourceDocument = {};
        journalEntryBody.sourceDocument._id = invoice._id;
        journalEntryBody.sourceDocument.model = 'expensesInvoice';
        journalEntryBody.sourceDocument.name = invoice.name;
        journalEntryBody.uId = uId;
        journalEntryBody.dbName = dbIndex;

        journalEntryBody.accountsItems = [];

        invoice.products.forEach(function (prod) {
            journalEntryBody.accountsItems.push({
                debit  : prod.subTotal,
                credit : 0,
                account: prod.debitAccount
            });
        });

        creditAccount = invoice.products && invoice.products.length ? invoice.products[0].creditAccount : CONSTANTS.ACCOUNT_PAYABLE;

        journalEntryBody.accountsItems.push({
            debit  : 0,
            credit : invoice.paymentInfo.total,
            account: creditAccount
        });

        journalEntryBody.accountsItems.push({
            debit  : invoice.paymentInfo.taxes,
            credit : 0,
            account: invoice.taxAccount
        });

        JournalEntryService.createMultiRows(journalEntryBody, cb);
    }

    function journalEntryComposer(invoice, dbIndex, waterfallCb, uId) {
        var journalEntryBody = {};
        var beforeInvoiceBody = {};
        var shippingExp = invoice.sourceDocument && invoice.sourceDocument.shippingExpenses ? invoice.sourceDocument.shippingExpenses.amount : 0;
        var cb = waterfallCb;

        journalEntryBody.date = invoice.invoiceDate;
        journalEntryBody.journal = invoice.journal._id || CONSTANTS.INVOICE_JOURNAL;
        journalEntryBody.currency = {};
        journalEntryBody.currency._id = invoice.currency._id || 'USD';
        journalEntryBody.currency.rate = invoice.currency.rate || 1;
        journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total/* / invoice.currency.rate*/ : 0;
        journalEntryBody.sourceDocument = {};
        journalEntryBody.sourceDocument._id = invoice._id;
        journalEntryBody.sourceDocument.model = 'Invoice';
        journalEntryBody.sourceDocument.name = invoice.name;
        journalEntryBody.uId = uId;
        journalEntryBody.dbName = dbIndex;

        journalEntryBody.accountsItems = [];

        if (invoice.forSales) {
            journalEntryBody.accountsItems.push({
                debit  : journalEntryBody.amount,
                credit : 0,
                account: invoice.journal ? invoice.journal.debitAccount : ''
            }, {
                debit  : 0,
                credit : invoice.paymentInfo.unTaxed,
                account: invoice.journal ? invoice.journal.creditAccount : ''
            });
        } else {
            journalEntryBody.accountsItems.push({
                debit  : invoice.paymentInfo.unTaxed,
                credit : 0,
                account: invoice.journal ? invoice.journal.debitAccount : ''
            }, {
                debit  : 0,
                credit : journalEntryBody.amount,
                account: invoice.journal ? invoice.journal.creditAccount : ''
            });
        }

        if (invoice.paymentInfo.taxes) {
            if (invoice.forSales) {
                journalEntryBody.accountsItems.push({
                    debit  : 0,
                    credit : invoice.paymentInfo.taxes,
                    account: invoice.taxAccount
                });
            } else {
                journalEntryBody.accountsItems.push({
                    debit  : invoice.paymentInfo.taxes,
                    credit : 0,
                    account: invoice.taxAccount
                });
            }

        }

        if (invoice.paymentInfo.discount) {
            if (invoice.forSales) {
                journalEntryBody.accountsItems.push({
                    debit  : invoice.paymentInfo.discount,
                    credit : 0,
                    account: invoice.discount
                });
            } else {
                journalEntryBody.accountsItems.push({
                    debit  : 0,
                    credit : invoice.paymentInfo.discount,
                    account: invoice.discount
                });
            }
        }

        /*if (invoice.sourceDocument && invoice.sourceDocument.shippingExpenses.amount) {
            if (invoice.forSales) {
                journalEntryBody.accountsItems.push({
                    credit : invoice.sourceDocument.shippingExpenses.amount,
                    debit  : 0,
                    account: invoice.shipping
                });
            } else {
                journalEntryBody.accountsItems.push({
                    credit : 0,
                    debit  : invoice.sourceDocument.shippingExpenses.amount,
                    account: invoice.shipping
                });
            }
        }*/

        if (invoice.prepayment && invoice.forSales) {
            cb = _.after(2, waterfallCb);

            beforeInvoiceBody.date = invoice.invoiceDate;
            beforeInvoiceBody.journal = null; // CONSTANTS.BEFORE_INVOICE;
            beforeInvoiceBody.currency = {};
            beforeInvoiceBody.currency._id = invoice.currency ? invoice.currency._id : 'USD';
            beforeInvoiceBody.currency.rate = invoice.currency ? invoice.currency.rate : 1;
            beforeInvoiceBody.amount = invoice.prepayment;
            beforeInvoiceBody.sourceDocument = {};
            beforeInvoiceBody.sourceDocument._id = invoice._id;
            beforeInvoiceBody.sourceDocument.model = 'Invoice';
            beforeInvoiceBody.sourceDocument.name = invoice.name;
            beforeInvoiceBody.uId = uId;
            beforeInvoiceBody.dbName = dbIndex;
            beforeInvoiceBody.notDivideRate = true;

            beforeInvoiceBody.accountsItems = [{
                debit  : beforeInvoiceBody.amount,
                credit : 0,
                account: CONSTANTS.USR
            }, {
                debit  : 0,
                credit : beforeInvoiceBody.amount,
                account: CONSTANTS.ACCOUNT_RECEIVABLE
            }];

            JournalEntryService.createMultiRows(beforeInvoiceBody, cb);
        }

        JournalEntryService.createMultiRows(journalEntryBody, cb);
    }

    this.approve = function (req, res, next) {
        approve(req, res, next);
    };

    this.approveSyncedInvoice = function (options, cb) {
        var req = {};

        req.session = {
            lastDb: options.dbName
        };

        req.body = {
            invoiceId  : options.invoiceId,
            invoiceDate: options.invoiceDate
        };

        approve(req, null, null, cb)
    };

    function approve(req, res, next, cb) {
        var dbIndex = req.session.lastDb;
        var Prepayments = models.get(dbIndex, 'prepayment', PrepaymentSchema);
        var id = req.body.invoiceId;
        var invoiceDate = req.body.invoiceDate;
        var Invoice = models.get(dbIndex, 'Invoices', InvoiceSchema);
        var waterfallTasks;
        var updateInvoice;
        var addHistory;
        var findPrepayments;
        var getTaxAccount;
        var createJournalEntry;
        var getDiscountAccount;
        var getShippingAccount;

        updateInvoice = function (cb) {
            Invoice.findByIdAndUpdate(id, {
                $set: {
                    approved   : true,
                    invoiceDate: invoiceDate
                }
            }, {new: true})
                .populate('sourceDocument', 'status shippingMethod shippingExpenses')
                .populate('journal', 'debitAccount creditAccount')
                .exec(function (err, resp) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, resp);
                });
        };

        addHistory = function (resp, cb) {
            var historyOptions = {
                contentType: 'invoice',
                data       : {
                    approved: ' '
                },

                dbName   : dbIndex,
                contentId: id
            };

            HistoryService.addEntry(historyOptions, function (err) {
                if (err) {
                    return cb(err);
                }

                cb(null, resp);
            });
        };

        findPrepayments = function (resp, cb) {
            if (!resp.sourceDocument) {
                return cb(null, resp);
            }

            Prepayments.aggregate([{
                $match: {
                    order: resp.sourceDocument._id
                }
            }, {
                $project: {
                    paidAmount: {$divide: ['$paidAmount', '$currency.rate']},
                    refund    : 1
                }
            }, {
                $project: {
                    paidAmount: {$cond: [{$eq: ['$refund', true]}, {$multiply: ['$paidAmount', -1]}, '$paidAmount']},
                    refund    : 1
                }
            }, {
                $group: {
                    _id       : null,
                    prepayment: {$sum: '$paidAmount'}
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                resp = resp.toJSON();

                resp.prepayment = result && result.length ? result[0].prepayment : 0;

                cb(null, resp);
            });
        };

        getTaxAccount = function (resp, cb) {
            orgService.getDefaultTaxes({dbName: dbIndex, forSales: resp.forSales}, function (err, tax) {
                if (err) {
                    return cb(err);
                }

                resp.taxAccount = tax || null;

                cb(null, resp);
            });
        };

        getDiscountAccount = function (resp, cb) {
            orgService.getDiscount({dbName: dbIndex}, function (err, discount) {
                if (err) {
                    return cb(err);
                }

                resp.discount = discount || null;

                cb(null, resp);
            });
        };

        getShippingAccount = function (resp, cb) {
            orgService.getDefaultShippingAccount({dbName: dbIndex}, function (err, shipping) {
                if (err) {
                    return cb(err);
                }

                resp.shipping = shipping || null;

                cb(null, resp);
            });
        };

        createJournalEntry = function (resp, cb) {
            if (req.body.expensesInvoice) {
                return journalEntryExpensesComposer(resp, req.session.lastDb, cb, req.session.uId);

            }
            journalEntryComposer(resp, req.session.lastDb, cb, req.session.uId);
        };

        waterfallTasks = [updateInvoice, addHistory, findPrepayments, getTaxAccount, getDiscountAccount, getShippingAccount, createJournalEntry];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err && next) {
                return next(err);
            } else if (err && cb) {
                return cb(err);
            }

            if (res) {
                return res.status(200).send(result);
            }

            cb(null, result);
        });
    }

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var contentType = req.query.contentType;
        var accessRollSearcher;
        var Invoice;
        var query = req.query;
        var quickSearch = query.quickSearch;
        var forSales = query.forSales;
        var filter = query.filter || {};
        var optionsObject = {};
        var sort = {};
        var contentSearcher;
        var waterfallTasks;
        var paginationObject = pageHelper(query);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var keys;
        var matchObject = {};
        var keysLength;
        var i;
        var aggregation;
        var forPurchase = false;
        var pastDue = filter.pastDue;
        var moduleId;
        var regExp = new RegExp(quickSearch, 'ig');

        if (contentType === 'ExpensesInvoice') {
            req.query.sort = req.query.sort || {
                    invoiceDate: '-1'
                };

            Invoice = models.get(db, 'expensesInvoice', ExpensesInvoiceSchema);
        } else if (contentType === 'DividendInvoice') {
            Invoice = models.get(db, 'dividendInvoice', DividendInvoiceSchema);
        } else if (contentType === 'WriteOff') {
            Invoice = models.get(db, 'writeOff', WriteOffSchema);
        } else if (contentType === 'invoice') {
            Invoice = models.get(db, 'Invoices', InvoiceSchema);
        } else if (contentType === 'purchaseInvoices') {
            Invoice = models.get(db, purchaseInvoiceCT, purchaseInvoicesSchema);
        }

        if (req.query.sort) {
            keys = Object.keys(req.query.sort);
            keysLength = keys.length;

            sort = req.query.sort;

            for (i = 0; i < keysLength; i++) {
                sort[keys[i]] = parseInt(sort[keys[i]], 10);
            }

        } else {
            sort = {'editedBy.date': -1};
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Invoice, cb);
        };

        if (quickSearch) {
            matchObject['supplier.name'] = {
                $regex: regExp
            }
        }

        contentSearcher = function (invoicesIds, waterfallCallback) {
            var salesManagerMatch = {
                $and: [
                    {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]},
                    {
                        $or: [{
                            $and: [{
                                $eq: ['$$projectMember.startDate', null]
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }, {
                            $and: [{
                                $lte: ['$$projectMember.startDate', '$invoiceDate']
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }, {
                            $and: [{
                                $eq: ['$$projectMember.startDate', null]
                            }, {
                                $gte: ['$$projectMember.endDate', '$invoiceDate']
                            }]
                        }, {
                            $and: [{
                                $lte: ['$$projectMember.startDate', '$invoiceDate']
                            }, {
                                $gte: ['$$projectMember.endDate', '$invoiceDate']
                            }]
                        }]
                    }]
            };

            optionsObject.$and = [];
            if (filter && typeof filter === 'object') {
                optionsObject.$and.push(filterMapper.mapFilter(filter, {contentType: contentType}));
            }

            optionsObject.$and.push({_id: {$in: invoicesIds}});
            optionsObject.$and.push({expense: {$exists: false}});

            if (contentType === 'invoice') {
                optionsObject.$and.push({_type: 'Invoices'});
            } else if (contentType === 'WriteOff') {
                optionsObject.$and.push({_type: 'writeOff'});
            } else if (contentType === 'ExpensesInvoice') {
                optionsObject.$and.push({_type: 'expensesInvoice'});
            } else if (contentType === 'DividendInvoice') {
                optionsObject.$and.push({_type: 'dividendInvoice'});
            } else {
                optionsObject.$and.push({_type: purchaseInvoiceCT});
            }

            if (pastDue) {
                optionsObject.$and.push({dueDate: {$gt: new Date(filter.date.value[0])}}, {'paymentInfo.balance': {$gt: 0}});
            }

            aggregation = [{
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'project',
                    foreignField: 'projectId',
                    as          : 'projectMembers'
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
                    as          : 'currency._id'
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'workflow',
                    foreignField: '_id',
                    as          : 'workflow'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'supplier',
                    foreignField: '_id',
                    as          : 'supplier'
                }
            }, {
                $lookup: {
                    from        : 'Project',
                    localField  : 'project',
                    foreignField: '_id',
                    as          : 'project'
                }
            }, {
                $lookup: {
                    from        : 'expensesCategories',
                    localField  : 'expensesCategory',
                    foreignField: '_id',
                    as          : 'expensesCategory'
                }
            }, {
                $project: {
                    workflow        : {$arrayElemAt: ['$workflow', 0]},
                    supplier        : {$arrayElemAt: ['$supplier', 0]},
                    journal         : {$arrayElemAt: ['$journal', 0]},
                    project         : {$arrayElemAt: ['$project', 0]},
                    expense         : 1,
                    forSales        : 1,
                    'currency._id'  : {$arrayElemAt: ['$currency._id', 0]},
                    'currency.rate' : '$currency.rate',
                    paymentInfo     : 1,
                    invoiceDate     : 1,
                    name            : 1,
                    paymentDate     : 1,
                    dueDate         : 1,
                    expensesCategory: 1,
                    approved        : 1,
                    _type           : 1,
                    salesPerson     : 1,
                    payments        : 1,
                    'editedBy.date' : 1,
                    paid            : {$divide: [{$subtract: ['$paymentInfo.total', '$paymentInfo.balance']}, 100]}
                }
            }, {
                $project: {
                    salesPerson      : 1,
                    'workflow._id'   : 1,
                    'workflow.name'  : 1,
                    'workflow.status': 1,
                    'project._id'    : 1,
                    'supplier._id'   : '$supplier._id',
                    'supplier.name'  : {$concat: ['$supplier.name.first', ' ', '$supplier.name.last']},
                    'journal.name'   : '$journal.name',
                    'journal._id'    : '$journal._id',
                    expense          : 1,
                    forSales         : 1,
                    currency         : 1,
                    expensesCategory : 1,
                    paymentInfo      : 1,
                    invoiceDate      : 1,
                    name             : 1,
                    paymentDate      : 1,
                    dueDate          : 1,
                    payments         : 1,
                    approved         : 1,
                    _type            : 1,
                    editedBy         : 1,
                    paid             : 1
                }
            }, {
                $match: matchObject
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesPerson',
                    foreignField: '_id',
                    as          : 'salesPerson'
                }
            }, {
                $project: {
                    salesPerson     : {$arrayElemAt: ['$salesPerson', 0]},
                    workflow        : 1,
                    supplier        : 1,
                    expense         : 1,
                    forSales        : 1,
                    currency        : 1,
                    paymentInfo     : 1,
                    invoiceDate     : 1,
                    name            : 1,
                    expensesCategory: 1,
                    paymentDate     : 1,
                    dueDate         : 1,
                    approved        : 1,
                    _type           : 1,
                    journal         : 1,
                    paid            : 1,
                    editedBy        : 1,
                    project         : 1,
                    removable       : {
                        $cond: {
                            if: {
                              $eq: ['$paymentInfo.balance', '$paymentInfo.total']
                            },

                            then: true,
                            else: false
                        }
                    }
                }
            }, {
                $match: optionsObject
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
                    _id               : '$root._id',
                    'salesPerson.name': {$concat: ['$root.salesPerson.name.first', ' ', '$root.salesPerson.name.last']},
                    'salesPerson._id' : '$root.salesPerson._id',
                    workflow          : '$root.workflow',
                    supplier          : '$root.supplier',
                    project           : '$root.project',
                    expense           : '$root.expense',
                    currency          : '$root.currency',
                    journal           : '$root.journal',
                    paymentInfo       : '$root.paymentInfo',
                    invoiceDate       : '$root.invoiceDate',
                    name              : '$root.name',
                    paymentDate       : '$root.paymentDate',
                    dueDate           : '$root.dueDate',
                    approved          : '$root.approved',
                    removable         : '$root.removable',
                    paid              : '$root.paid',
                    editedBy          : '$root.editedBy',
                    expensesCategory  : '$root.expensesCategory',
                    total             : 1
                }
            }];

            aggregation.push({
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            });

            Invoice
                .aggregate(aggregation, function (err, result) {
                    waterfallCallback(null, result);
                });
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

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

    this.getInvoiceById = function (req, res, next) {
        var Prepayments = models.get(req.session.lastDb, 'prepayment', PrepaymentSchema);
        var data = req.query || {};
        var contentType = data.contentType;
        var id = data.id || data._id;
        var forSales;
        var Invoice;
        var optionsObject = {};
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var prepaymentsSearcher;
        var waterfallTasks;
        var orderRowsSearcher;
        var OrderRows = models.get(req.session.lastDb, 'orderRows', OrderRowsSchema);

        if (id.length < 24) {
            return res.status(400).send();
        }

        forSales = data.forSales !== 'false';

        Invoice = models.get(req.session.lastDb, 'Invoices', InvoiceSchema);

        if (contentType === 'ExpensesInvoice') {
            Invoice = models.get(req.session.lastDb, 'expensesInvoice', ExpensesInvoiceSchema);
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
                }, waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var arrOfObjectId = deps.objectID();

            Invoice.aggregate(
                {
                    $match: {
                        $and: [
                            /* optionsObject,*/
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
                                    }, {
                                        $and: [
                                            {whoCanRW: 'owner'},
                                            {'groups.owner': objectId(req.session.uId)}
                                        ]
                                    }, {whoCanRW: 'everyOne'}
                                ]
                            }
                        ]
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                }, waterfallCallback);
        };

        contentSearcher = function (invoicesIds, waterfallCallback) {
            var query;

            optionsObject = {_id: id};

            query = Invoice.findOne(optionsObject);

            query
                .populate('currency._id')
                .populate('expensesCategory', '_id account')
                .populate('products.debitAccount', '_id name')
                .populate('products.creditAccount', '_id name')
                .populate('products.taxes.taxCode', 'fullName rate')
                .populate('journal', '_id name')
                .populate('payments', '_id name date paymentRef paidAmount createdBy currency')
                .populate('paymentTerms', '_id name count')
                .populate('paymentMethod', '_id name account bank address swiftCode owner')
                .populate('project', '_id paymentMethod')
                .populate('sourceDocument', '_id name orderDate shippingMethod shippingExpenses')
                .populate('workflow', '_id name status')
                .populate('supplier', '_id name fullName address')
                .sort({'notes.date': -1});
            query.exec(function (err, result) {
                if (err) {
                    return waterfallCallback(err);
                }

                shippingService.populateShippingMethod({
                    dbName: req.session.lastDb,
                    query : result,
                    path  : 'sourceDocument.shippingMethod'
                }, function (err) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    waterfallCallback(null, result);
                });

            });
        };

        function getAvailableForRows(req, docs, forSales, cb) {
            var AvailabilitySchema = mongoose.Schemas.productsAvailability;
            var GoodsOutSchema = mongoose.Schemas.GoodsOutNote;
            var GoodsInSchema = mongoose.Schemas.GoodsInNote;

            var Availability = models.get(req.session.lastDb, 'productsAvailability', AvailabilitySchema);
            var GoodsOutNote = models.get(req.session.lastDb, 'GoodsOutNote', GoodsOutSchema);
            var GoodsInNote = models.get(req.session.lastDb, 'GoodsInNote', GoodsInSchema);
            var populateDocs = [];
            var allGoodsNotes = [];

            if (docs && docs.length) {
                async.each(docs, function (elem, eachCb) {
                    var product;
                    var warehouseId;

                    var parallelTasks;

                    elem = elem.toJSON();

                    product = elem.product ? elem.product._id : null;
                    warehouseId = elem.warehouse ? objectId(elem.warehouse._id) : null;

                    function getAvailabilities(parallelCb) {
                        Availability.aggregate([{
                            $match: {
                                product  : objectId(product),
                                warehouse: warehouseId
                            }
                        }, {
                            $project: {
                                product   : 1,
                                warehouse : 1,
                                onHand    : 1,
                                filterRows: {
                                    $filter: {
                                        input: '$orderRows',
                                        as   : 'elem',
                                        cond : {$eq: ['$$elem.orderRowId', objectId(elem._id)]}
                                    }
                                },

                                orderRows    : 1,
                                goodsOutNotes: 1
                            }
                        }, {
                            $project: {
                                product  : 1,
                                warehouse: 1,
                                onHand   : 1,
                                allocated: {
                                    $sum: '$filterRows.quantity'
                                },

                                allocatedAll: {
                                    $sum: '$orderRows.quantity'
                                },

                                fulfillAll: {
                                    $sum: '$goodsOutNotes.quantity'
                                }
                            }
                        }, {
                            $project: {
                                product  : 1,
                                warehouse: 1,
                                onHand   : 1,
                                allocated: 1,
                                inStock  : {
                                    $add: ['$onHand', '$allocatedAll', '$fulfillAll']
                                }
                            }
                        }, {
                            $group: {
                                _id      : '$warehouse',
                                allocated: {
                                    $sum: '$allocated'
                                },

                                onHand: {
                                    $sum: '$onHand'
                                },

                                inStock: {
                                    $sum: '$inStock'
                                },

                                onOrder: {
                                    $sum: '$onOrder'
                                }
                            }
                        }], function (err, availability) {
                            if (err) {
                                return parallelCb(err);
                            }
                            parallelCb(null, availability);
                        });
                    }

                    function getNotes(parallelCb) {
                        var Model = forSales ? GoodsOutNote : GoodsInNote;

                        Model.aggregate([{
                            $match: {
                                'orderRows.orderRowId': elem._id,
                                _type                 : forSales ? 'GoodsOutNote' : 'GoodsInNote'
                            }
                        }, {
                            $lookup: {
                                from        : 'warehouse',
                                localField  : 'warehouse',
                                foreignField: '_id',
                                as          : 'warehouse'
                            }
                        }, {
                            $lookup: {
                                from        : 'Users',
                                localField  : 'status.printedById',
                                foreignField: '_id',
                                as          : 'status.printedById'
                            }
                        }, {
                            $lookup: {
                                from        : 'Users',
                                localField  : 'status.pickedById',
                                foreignField: '_id',
                                as          : 'status.pickedById'
                            }
                        }, {
                            $lookup: {
                                from        : 'Users',
                                localField  : 'status.packedById',
                                foreignField: '_id',
                                as          : 'status.packedById'
                            }
                        }, {
                            $lookup: {
                                from        : 'Users',
                                localField  : 'status.shippedById',
                                foreignField: '_id',
                                as          : 'status.shippedById'
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
                                name    : '$name',
                                orderRow: {
                                    $filter: {
                                        input: '$orderRows',
                                        as   : 'elem',
                                        cond : {$eq: ['$$elem.orderRowId', objectId(elem._id)]}
                                    }
                                },

                                warehouse           : {$arrayElemAt: ['$warehouse', 0]},
                                order               : {$arrayElemAt: ['$order', 0]},
                                'status.printedById': {$arrayElemAt: ['$status.printedById', 0]},

                                'status.pickedById' : {$arrayElemAt: ['$status.pickedById', 0]},
                                'status.packedById' : {$arrayElemAt: ['$status.packedById', 0]},
                                'status.shippedById': {$arrayElemAt: ['$status.shippedById', 0]},
                                'status.printedOn'  : 1,
                                'status.pickedOn'   : 1,
                                'status.packedOn'   : 1,
                                'status.shippedOn'  : 1,
                                'status.shipped'    : 1,
                                'status.picked'     : 1,
                                'status.packed'     : 1,
                                'status.printed'    : 1
                            }
                        }, {
                            $project: {
                                name        : '$name',
                                orderRow    : {$arrayElemAt: ['$orderRow', 0]},
                                status      : 1,
                                warehouse   : 1,
                                'order.name': 1
                            }
                        }, {
                            $project: {
                                name        : '$name',
                                orderRow    : '$orderRow.orderRowId',
                                quantity    : '$orderRow.quantity',
                                status      : 1,
                                warehouse   : 1,
                                'order.name': 1
                            }
                        }], function (err, docs) {
                            if (err) {
                                return parallelCb(err);
                            }
                            if (docs && docs.length) {
                                docs = docs.map(function (el) {
                                    el._id = el._id.toJSON();
                                    return el;
                                });
                            }

                            parallelCb(null, docs);
                        });
                    }

                    parallelTasks = [getNotes, getAvailabilities];

                    async.parallel(parallelTasks, function (err, response) {
                        var availability;
                        var goodsNotes;

                        if (err) {
                            return eachCb(err);
                        }

                        availability = response[1];
                        goodsNotes = response[0];
                        allGoodsNotes = allGoodsNotes.concat(goodsNotes);

                        availability = availability && availability.length ? availability[0] : null;

                        if (availability) {
                            elem.inStock = availability.inStock;
                            elem.onHand = availability.onHand;
                            elem.allocated = availability.allocated;
                        }
                        elem.goodsNotes = goodsNotes;
                        elem.fulfilled = 0;

                        if (goodsNotes && goodsNotes.length) {
                            goodsNotes.forEach(function (el) {
                                elem.fulfilled += el.quantity;
                            });
                        }
                        populateDocs.push(elem);
                        eachCb();
                    });

                }, function (err) {
                    if (err) {
                        return cb(err);
                    }

                    allGoodsNotes = _.uniq(allGoodsNotes, '_id');

                    cb(null, populateDocs, allGoodsNotes);

                });
            } else {
                cb();
            }

        }

        orderRowsSearcher = function (invoice, waterfallCallback) {

            if (!invoice.sourceDocument) {
                return waterfallCallback(null, invoice);
            }

            OrderRows.find({order: invoice.sourceDocument._id})
                .populate('product', 'cost name sku info')
                .populate('taxes.taxCode', 'fullName')
                .populate('warehouse', 'name')
                .populate('debitAccount', 'name')
                .populate('creditAccount', 'name')
                .exec(function (err, docs) {
                    if (err) {
                        waterfallCallback(err);
                    }

                    invoice = invoice.toJSON();

                    getAvailableForRows(req, docs, invoice.forSales, function (err, docs, goodsNotes) {
                        if (err) {
                            return waterfallCallback(err);
                        }

                        invoice.products = docs;
                        invoice.account = docs && docs.length ? docs[0].debitAccount : {};

                        if (!invoice.forSales) {
                            invoice.account = docs && docs.length ? docs[0].creditAccount : {};
                        }

                        invoice.goodsNotes = goodsNotes;

                        waterfallCallback(null, invoice);
                    });

                });
        };

        prepaymentsSearcher = function (invoice, waterfallCallback) {
            if (!invoice.sourceDocument) {
                return waterfallCallback(null, invoice);
            }

            Prepayments.aggregate([{
                $match: {
                    order: objectId(invoice.sourceDocument._id)
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
                $project: {
                    paidAmount: {$cond: [{$eq: ['$refund', true]}, {$multiply: ['$paidAmount', -1]}, '$paidAmount']},
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
                    return waterfallCallback(err);
                }

                invoice.prepayment = result && result.length ? result[0] : {};

                waterfallCallback(null, invoice);
            });
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher, orderRowsSearcher, prepaymentsSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            if (result && result._type !== 'Proforma') {
                getHistory(req, result, function (err, invoice) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(invoice);
                });
            } else {
                res.status(200).send(result);
            }

        });
    };

    this.bulkRemove = function (req, res, next) {
        var body = req.body || {ids: []};
        var ids = body.ids;

        async.each(ids, function (id, cb) {
            removeInvoice(req, null, id, next, cb);
        }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });
    };

    function removeInvoice(req, res, id, next, callback) {
        var db = req.session.lastDb;
        var Order = models.get(db, 'Order', OrderSchema);
        var Model = models.get(db, 'Invoice', InvoiceSchema);
        var parallelTasks;
        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };
        var orderId;
        var orderUpdateQuery = {
            $set: {
                workflow: CONSTANTS.ORDERINPROGRESS,
                editedBy: editedBy
            }
        };
        if (!id || id.length < 24) {
            return res ? res.status(400).send() : callback();
        }

        Model.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }

            orderId = result.sourceDocument;

            function orderUpdate(parallelCb) {
                Order.findByIdAndUpdate(objectId(orderId), orderUpdateQuery, {new: true}, function (err) {
                    if (err) {
                        return parallelCb(err);
                    }

                    parallelCb();
                });

            }

            function folderRemove(parallelCb) {
                var os = require('os');
                var osType = (os.type().split('_')[0]);
                var dir;
                var _id = id;
                var newDirname;

                switch (osType) {
                    case 'Windows':
                        newDirname = __dirname.replace('handlers', 'routes');
                        while (newDirname.indexOf('\\') !== -1) {
                            newDirname = newDirname.replace('\\', '\/');
                        }
                        dir = newDirname + '\/uploads\/' + _id;
                        break;
                    case 'Linux':
                        newDirname = __dirname.replace('handlers', 'routes');
                        while (newDirname.indexOf('\\') !== -1) {
                            newDirname = newDirname.replace('\\', '\/');
                        }
                        dir = newDirname + '\/uploads\/' + _id;
                        break;

                }

                fs.readdir(dir, function (err, files) {
                    var file;

                    if (err) {
                        return parallelCb();
                    }
                    async.each(files, function (file, cb) {
                        file = pathMod.join(dir, file);
                        fs.unlink(file, function (err) {
                            if (err) {
                                return cb(err);
                            }
                            return cb();
                        });
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }
                        fs.rmdir(dir, function (err) {
                            if (err) {
                                return next(err);
                            }
                            parallelCb();
                        });
                    });
                });

            }

            function journalEntryRemove(parallelCb) {
                _journalEntryHandler.removeByDocId(id, db, parallelCb);
            }

            function updateJobs(parallelCb) {
                JobsService.removeInvoiceFromJobs({dbName: req.session.lastDb, invoice: id}, parallelCb);
            }

            parallelTasks = [orderUpdate, folderRemove, journalEntryRemove, updateJobs];

            async.parallel(parallelTasks, function (err) {
                if (err) {
                    return next(err);
                }

                if (res) {
                    res.status(200).send(result);
                } else if (callback) {
                    callback();
                }
            });
        });

    }

    this.removeInvoice = function (req, res, id, next) {
        removeInvoice(req, res, id, next);
    };

    this.getFilterValues = function (req, res, next) {
        var EmployeeSchema = mongoose.Schemas.Employee;
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);

        async.waterfall([
            function (cb) {
                Invoice
                    .aggregate([
                        {
                            $group: {
                                _id       : null,
                                'Due date': {
                                    $addToSet: '$dueDate'
                                }
                            }
                        }
                    ], function (err, invoice) {
                        if (err) {
                            cb(err);

                        } else {
                            cb(null, invoice);
                        }

                    });
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            _.map(result[0], function (value, key) {
                switch (key) {
                    case 'salesPerson':
                        result[0][key] = _.sortBy(value, 'name');
                        break;
                    // skip default;
                }
            });
            res.status(200).send(result);
        });
    };

    this.getForProject = function (req, res, next) {
        var db = req.session.lastDb;
        var Invoice = models.get(db, 'Invoice', InvoiceSchema);
        var contentType = req.query.contentType;
        var projectId = req.params.id;
        var query = req.query;
        var queryObject = {};
        var optionsObject = {};
        var sort = {};
        var Invoice;
        var count;
        var page;
        var skip;
        var key;

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        projectId = projectId ? objectId(projectId) : null;

        if (projectId) {
            queryObject.project = projectId;
        }

        count = parseInt(query.count, 10) || CONSTANTS.DEF_LIST_COUNT;
        page = parseInt(query.page, 10);

        count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count;
        skip = (page - 1) > 0 ? (page - 1) * count : 0;

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
                    queryObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };

            Invoice.aggregate([{
                $match: matchQuery
            }, {
                $project: {
                    _id: 1
                }
            }], waterfallCallback);
        };

        contentSearcher = function (invoicesIds, waterfallCallback) {
            var salesManagerMatch = {
                $and: [
                    {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]},
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

            optionsObject.$and.push({_id: {$in: _.pluck(invoicesIds, '_id')}});
            optionsObject.$and.push({expense: {$exists: false}});

            optionsObject.$and.push({_type: 'Invoices'});

            Invoice
                .aggregate([{
                    $match: queryObject
                }, {
                    $lookup: {
                        from        : 'Payment',
                        localField  : '_id',
                        foreignField: 'invoice',
                        as          : 'payments'
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
                        from        : 'Customers',
                        localField  : 'supplier',
                        foreignField: '_id',
                        as          : 'supplier'
                    }
                }, {
                    $lookup: {
                        from        : 'workflows',
                        localField  : 'workflow',
                        foreignField: '_id',
                        as          : 'workflow'
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
                        workflow       : {$arrayElemAt: ['$workflow', 0]},
                        supplier       : {$arrayElemAt: ['$supplier', 0]},
                        'currency._id' : {$arrayElemAt: ['$currency._id', 0]},
                        'currency.rate': 1,

                        salesManagers: {
                            $filter: {
                                input: '$projectMembers',
                                as   : 'projectMember',
                                cond : salesManagerMatch
                            }
                        },

                        expense    : 1,
                        project    : 1,
                        forSales   : 1,
                        paymentInfo: 1,
                        invoiceDate: 1,
                        name       : 1,
                        paymentDate: 1,
                        dueDate    : 1,
                        approved   : 1,
                        _type      : 1,
                        payments   : 1,
                        removable  : {
                            $cond: {
                                if  : {$ne: ['$payments', []]},
                                then: false,
                                else: true
                            }
                        },

                        paid: {$divide: [{$subtract: ['$paymentInfo.total', '$paymentInfo.balance']}, 100]}
                    }
                }, {
                    $project: {
                        salesManagers: {$arrayElemAt: ['$salesManagers', 0]},
                        supplier     : {
                            _id : '$supplier._id',
                            name: '$supplier.name'
                        },

                        workflow: {
                            status: '$workflow.status',
                            name  : '$workflow.name'
                        },

                        expense    : 1,
                        forSales   : 1,
                        currency   : 1,
                        paymentInfo: 1,
                        invoiceDate: 1,
                        name       : 1,
                        paymentDate: 1,
                        dueDate    : 1,
                        approved   : 1,
                        _type      : 1,
                        paid       : 1,
                        removable  : 1
                    }
                }, {
                    $lookup: {
                        from        : 'Employees',
                        localField  : 'salesManagers.employeeId',
                        foreignField: '_id',
                        as          : 'salesManagers'
                    }
                }, {
                    $project: {
                        salesPerson: {$arrayElemAt: ['$salesManagers', 0]},
                        workflow   : 1,
                        supplier   : 1,
                        expense    : 1,
                        forSales   : 1,
                        currency   : 1,
                        paymentInfo: 1,
                        invoiceDate: 1,
                        name       : 1,
                        paymentDate: 1,
                        dueDate    : 1,
                        approved   : 1,
                        _type      : 1,
                        removable  : 1,
                        paid       : 1
                    }
                }, {
                    $project: {
                        salesPerson: {
                            _id : '$salesPerson._id',
                            name: '$salesPerson.name'
                        },

                        workflow   : 1,
                        supplier   : 1,
                        expense    : 1,
                        forSales   : 1,
                        currency   : 1,
                        paymentInfo: 1,
                        invoiceDate: 1,
                        name       : 1,
                        paymentDate: 1,
                        dueDate    : 1,
                        approved   : 1,
                        _type      : 1,
                        removable  : 1,
                        paid       : 1
                    }
                }, {
                    $match: optionsObject
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
                        _id        : '$root._id',
                        salesPerson: '$root.salesPerson',
                        workflow   : '$root.workflow',
                        supplier   : '$root.supplier',
                        expense    : '$root.expense',
                        forSales   : '$root.forSales',
                        currency   : '$root.currency',
                        paymentInfo: '$root.paymentInfo',
                        invoiceDate: '$root.invoiceDate',
                        name       : '$root.name',
                        paymentDate: '$root.paymentDate',
                        dueDate    : '$root.dueDate',
                        approved   : '$root.approved',
                        _type      : '$root._type',
                        paid       : '$root.paid',
                        removable  : '$root.removable',
                        total      : 1
                    }
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: count
                }], function (err, result) {
                    waterfallCallback(null, result);
                });
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

    this.getStats = function (req, res, next) {
        var sortObj = {'invoiceDate': -1};
        var now = new Date();
        var sortValueInt;
        var keys;
        var key;
        var i;

        var salesManagerMatch = {
            $and: [
                {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]},
                {
                    $or: [{
                        $and: [{
                            $eq: ['$$projectMember.startDate', null]
                        }, {
                            $eq: ['$$projectMember.endDate', null]
                        }]
                    }, {
                        $and: [{
                            $lte: ['$$projectMember.startDate', '$invoiceDate']
                        }, {
                            $eq: ['$$projectMember.endDate', null]
                        }]
                    }, {
                        $and: [{
                            $eq: ['$$projectMember.startDate', null]
                        }, {
                            $gte: ['$$projectMember.endDate', '$invoiceDate']
                        }]
                    }, {
                        $and: [{
                            $lte: ['$$projectMember.startDate', '$invoiceDate']
                        }, {
                            $gte: ['$$projectMember.endDate', '$invoiceDate']
                        }]
                    }]
                }]
        };
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        sortObj = req.query.sort || sortObj;
        keys = Object.keys(sortObj);

        for (i = keys.length - 1; i >= 0; i--) {
            key = keys[i];
            sortValueInt = parseInt(sortObj[key], 10);
            sortObj[key] = sortValueInt;
            break;
        }

        Invoice.aggregate([{
            $match: {
                _type                : 'Invoices',
                forSales             : true,
                'paymentInfo.balance': {
                    $gt: 0
                }/*,
                 workflow             : {$ne: objectId(CONSTANTS.PROFORMA_CANCELLED)}*/
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
                from        : 'Project',
                localField  : 'project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                project : {$arrayElemAt: ['$project', 0]},
                supplier: {$arrayElemAt: ['$supplier', 0]},

                salesManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : salesManagerMatch
                    }
                },

                dueDate    : 1,
                name       : 1,
                invoiceDate: 1,
                paymentInfo: 1,
                currency   : 1,
                workflow   : 1
            }
        }, {
            $project: {
                salesManagers : {$arrayElemAt: ['$salesManagers', 0]},
                dueDate       : 1,
                'project.name': 1,
                invoiceDate   : 1,

                'supplier.name': {
                    $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                },

                name       : 1,
                paymentInfo: 1,
                currency   : 1,
                workflow   : 1,

                diffStatus: {
                    $cond: {
                        if: {
                            $lt: [{$subtract: [now, '$dueDate']}, 0]
                        },

                        then: -1,
                        else: {
                            $cond: {
                                if: {
                                    $lt: [{$subtract: [now, '$dueDate']}, 1296000000]
                                },

                                then: 0, else: {
                                    $cond: {
                                        if: {
                                            $lt: [{$subtract: [now, '$dueDate']}, 2592000000]
                                        },

                                        then: 1,
                                        else: {
                                            $cond: {
                                                if: {
                                                    $lt: [{$subtract: [now, '$dueDate']}, 5184000000]
                                                },

                                                then: 2,
                                                else: {
                                                    $cond: {
                                                        if: {
                                                            $lt: [{$subtract: [now, '$dueDate']}, 7776000000]
                                                        },

                                                        then: 3,
                                                        else: 4
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManagers.employeeId',
                foreignField: '_id',
                as          : 'salesManagers'
            }
        }, {
            $project: {
                salesPerson    : {$arrayElemAt: ['$salesManagers', 0]},
                dueDate        : 1,
                invoiceDate    : 1,
                'project.name' : 1,
                'supplier.name': 1,
                name           : 1,
                paymentInfo    : 1,
                currency       : 1,
                diffStatus     : 1,
                workflow       : 1
            }
        }, {
            $project: {
                'salesPerson.name': {
                    $concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']
                },

                dueDate        : 1,
                invoiceDate    : 1,
                'project.name' : 1,
                'supplier.name': 1,
                name           : 1,
                paymentInfo    : 1,
                rate           : {
                    $ifNull: ['$currency.rate', 1]
                },

                currency  : 1,
                diffStatus: 1,
                workflow  : 1
            }
        }, {
            $project: {
                'salesPerson.name'   : 1,
                dueDate              : 1,
                invoiceDate          : 1,
                'project.name'       : 1,
                'supplier.name'      : 1,
                name                 : 1,
                'paymentInfo.taxes'  : {$divide: ['$paymentInfo.taxes', '$rate']},
                'paymentInfo.unTaxed': {$divide: ['$paymentInfo.unTaxed', '$rate']},
                'paymentInfo.balance': {$divide: ['$paymentInfo.balance', '$rate']},
                'paymentInfo.total'  : {$divide: ['$paymentInfo.total', '$rate']},
                diffStatus           : 1,
                workflow             : 1
            }
        }, {
            $sort: sortObj
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.invoiceByWeek = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Invoice = models.get(dbIndex, invoiceCT, InvoiceSchema);
        var data = req.query;
        var forSales = data.forSales === 'true' || false;
        var filter = data.filter || {};
        var match = filterMapper.mapFilter(filter, {contentType: invoiceCT});
        var secondMatch = {
            forSales: forSales
        };

        if (!forSales) {
            Invoice = models.get(dbIndex, purchaseInvoiceCT, purchaseInvoicesSchema);
            match = filterMapper.mapFilter(filter, {contentType: purchaseInvoiceCT});
        }

        Invoice.aggregate([{
            $match: secondMatch
        }, {
            $match: match
        }, {
            $project: {
                week: {$week: '$invoiceDate'},
                year: {$year: '$invoiceDate'}
            }
        }, {
            $group: {
                _id  : '$week',
                count: {$sum: 1}
            }
        }, {
            $sort: {
                _id: 1
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });

    };

    this.getRevenueForSingle = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Invoice = models.get(dbIndex, invoiceCT, InvoiceSchema);
        var data = req.query;
        var forSales = data.forSales === 'true' || false;
        var filter = data.filter || {};
        var match = filterMapper.mapFilter(filter, {contentType: invoiceCT});
        var secondMatch = {
            forSales: forSales
        };

        if (!forSales) {
            Invoice = models.get(dbIndex, purchaseInvoiceCT, purchaseInvoicesSchema);
            match = filterMapper.mapFilter(filter, {contentType: purchaseInvoiceCT});
        }

        Invoice.aggregate([{
            $match: secondMatch
        }, {
            $match: match
        }, {
            $project: {
                paymentInfo    : 1,
                'currency.rate': {$ifNull: [1, '$currency.rate']}
            }
        }, {
            $project: {
                sum: {$divide: ['$paymentInfo.total', '$currency.rate']}
            }
        }, {
            $group: {
                _id  : null,
                total: {$sum: '$sum'},
                count: {$sum: 1}
            }
        }, {
            $project: {
                total: {$divide: ['$total', 100]},
                count: 1
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result && result.length ? result[0] : {});
        });

    };

    this.getInvoiceByWorkflows = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Invoice = models.get(dbIndex, invoiceCT, InvoiceSchema);
        var data = req.query;
        var forSales = data.forSales === 'true';
        var filter = data.filter || {};
        var match = filterMapper.mapFilter(filter, {contentType: invoiceCT});

        if (!forSales) {
            Invoice = models.get(dbIndex, purchaseInvoiceCT, purchaseInvoicesSchema);
            match = filterMapper.mapFilter(filter, {contentType: purchaseInvoiceCT});
        }

        Invoice.aggregate([{
            $match: match
        }, {
            $match: {
                forSales: forSales
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $project: {
                paymentInfo    : 1,
                workflow       : 1,
                'currency.rate': {$ifNull: [1, '$currency.rate']}
            }
        }, {
            $project: {
                sum     : {$divide: ['$paymentInfo.total', '$currency.rate']},
                workflow: {$arrayElemAt: ['$workflow', 0]}
            }
        }, {
            $group: {
                _id  : '$workflow._id',
                total: {$sum: '$sum'},
                name : {$first: '$workflow.name'},
                count: {$sum: 1}
            }
        }, {
            $project: {
                total: {$divide: ['$total', 100]},
                name : 1,
                count: 1
            }
        }, {
            $match: {
                total: {
                    $gt: 0
                }
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });

    };

    this.revenueBySales = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Invoice = models.get(dbIndex, invoiceCT, InvoiceSchema);
        var data = req.query;
        var forSales = data.forSales === 'true' || false;
        var filter = data.filter || {};
        var salesManagers = objectId(CONSTANTS.SALESMANAGER);
        var secondMatch = {forSales: true};
        var salesManagersMatch = {
            $and: [{
                $eq: ['$$salesPerson.projectPositionId', salesManagers]
            }, {
                $or: [{
                    $and: [{
                        $eq: ['$$salesPerson.startDate', null]
                    }, {
                        $eq: ['$$salesPerson.endDate', null]
                    }]
                }, {
                    $and: [{
                        $lte: ['$$salesPerson.startDate', '$invoiceDate']
                    }, {
                        $eq: ['$$salesPerson.endDate', null]
                    }]
                }, {
                    $and: [{
                        $gte: ['$$salesPerson.endDate', '$invoiceDate']
                    }, {
                        $eq: ['$$salesPerson.startDate', null]
                    }]
                }, {
                    $and: [{
                        $lte: ['$$salesPerson.startDate', '$invoiceDate']
                    }, {
                        $gte: ['$$salesPerson.endDate', '$invoiceDate']
                    }]
                }]
            }]
        };
        var match = filterMapper.mapFilter(filter, {contentType: invoiceCT});

        if (!forSales) {
            Invoice = models.get(dbIndex, purchaseInvoiceCT, purchaseInvoicesSchema);
            match = filterMapper.mapFilter(filter, {contentType: purchaseInvoiceCT});

            secondMatch = {forSales: false};
        }

        if (forSales) {
            Invoice.aggregate([{
                $match: secondMatch
            }, {
                $match: match
            }, {
                $project: {
                    paymentInfo: 1,
                    invoiceDate: 1,
                    project    : 1,
                    currency   : 1
                }
            }, {
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'project',
                    foreignField: 'projectId',
                    as          : 'salesPersons'
                }
            }, {
                $project: {
                    salesPersons: {
                        $filter: {
                            input: '$salesPersons',
                            as   : 'salesPerson',
                            cond : salesManagersMatch
                        }
                    },

                    currency   : 1,
                    paymentInfo: 1
                }
            }, {
                $unwind: {
                    path                      : '$salesPersons',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesPersons.employeeId',
                    foreignField: '_id',
                    as          : 'salesPerson'
                }
            }, {
                $project: {
                    paymentInfo: 1,
                    currency   : 1,
                    salesPerson: {$arrayElemAt: ['$salesPerson', 0]}
                }
            }, {
                $project: {
                    paymentInfo: 1,
                    currency   : 1,
                    salesPerson: 1,
                    sales      : {$ifNull: ['$salesPerson.name.first', null]}
                }
            }, {
                $project: {
                    sum        : {$divide: [{$divide: ['$paymentInfo.total', '$currency.rate']}, 100]},
                    salesPerson: {$cond: [{$eq: ['$sales', null]}, 'Not Assigned', {$concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']}]}
                }
            }, {
                $group: {
                    _id: '$salesPerson',
                    sum: {$sum: '$sum'}
                }
            }, {
                $match: {
                    sum: {
                        $gt: 0
                    }
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
        } else {
            Invoice.aggregate([{
                $match: secondMatch
            }, {
                $match: match
            }, {
                $project: {
                    paymentInfo: 1,
                    invoiceDate: 1,
                    project    : 1,
                    currency   : 1,
                    salesPerson: 1
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesPerson',
                    foreignField: '_id',
                    as          : 'salesPerson'
                }
            }, {
                $project: {
                    paymentInfo: 1,
                    invoiceDate: 1,
                    project    : 1,
                    currency   : 1,
                    salesPerson: {$arrayElemAt: ['$salesPerson', 0]}
                }
            }, {
                $project: {
                    paymentInfo: 1,
                    invoiceDate: 1,
                    project    : 1,
                    currency   : 1,
                    salesPerson: 1,
                    sales      : {$ifNull: ['$salesPerson.name.first', null]}
                }
            }, {
                $project: {
                    paymentInfo    : 1,
                    sales          : 1,
                    salesPerson    : 1,
                    'currency.rate': {$ifNull: [1, '$currency.rate']}
                }
            }, {
                $project: {
                    sum        : {$divide: [{$divide: ['$paymentInfo.total', '$currency.rate']}, 100]},
                    salesPerson: {$cond: [{$eq: ['$sales', null]}, 'Not Assigned', {$concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']}]}
                }
            }, {
                $group: {
                    _id: '$salesPerson',
                    sum: {$sum: '$sum'}
                }
            }, {
                $match: {
                    sum: {
                        $gt: 0
                    }
                }
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
        }

    };

    this.revenueByCountry = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Invoice = models.get(dbIndex, invoiceCT, InvoiceSchema);
        var data = req.query;
        var forSales = data.forSales === 'true' || false;
        var filter = data.filter || {};
        var match = filterMapper.mapFilter(filter, {contentType: invoiceCT});
        var secondMatch = {
            forSales: forSales
        };

        if (!forSales) {
            Invoice = models.get(dbIndex, purchaseInvoiceCT, purchaseInvoicesSchema);
            match = filterMapper.mapFilter(filter, {contentType: purchaseInvoiceCT});
        }

        Invoice.aggregate([{
            $match: secondMatch
        }, {
            $match: match
        }, {
            $project: {
                paymentInfo: 1,
                invoiceDate: 1,
                supplier   : 1,
                currency   : 1
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                paymentInfo    : 1,
                'currency.rate': {$ifNull: [1, '$currency.rate']},
                supplier       : {$arrayElemAt: ['$supplier', 0]}
            }
        }, {
            $project: {
                sum    : {$divide: [{$divide: ['$paymentInfo.total', '$currency.rate']}, 100]},
                country: '$supplier.address.country'
            }
        }, {
            $group: {
                _id: '$country',
                sum: {$sum: '$sum'}
            }
        }, {
            $match: {
                sum: {$gt: 0},
                _id: {$ne: null}
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.revenueByCustomer = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Invoice = models.get(dbIndex, invoiceCT, InvoiceSchema);
        var data = req.query;
        var forSales = data.forSales === 'true' || false;
        var filter = data.filter || {};
        var match = filterMapper.mapFilter(filter, {contentType: invoiceCT});
        var secondMatch = {
            forSales: forSales
        };

        if (!forSales) {
            Invoice = models.get(dbIndex, purchaseInvoiceCT, purchaseInvoicesSchema);
            match = filterMapper.mapFilter(filter, {contentType: purchaseInvoiceCT});
        }

        Invoice.aggregate([{
            $match: secondMatch
        }, {
            $match: match
        }, {
            $project: {
                paymentInfo: 1,
                invoiceDate: 1,
                supplier   : 1,
                currency   : 1
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                paymentInfo    : 1,
                'currency.rate': {$ifNull: [1, 'currency.rate']},
                supplier       : {$arrayElemAt: ['$supplier', 0]}
            }
        }, {
            $project: {
                sum     : {$divide: [{$divide: ['$paymentInfo.total', '$currency.rate']}, 100]},
                supplier: {$concat: ['$supplier.name.first', ' ', '$supplier.name.last']}
            }
        }, {
            $group: {
                _id: '$supplier',
                sum: {$sum: '$sum'}
            }
        }, {
            $match: {
                sum: {
                    $gt: 0
                },
                _id: {
                    $ne: null
                }
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

};

module.exports = Module;
