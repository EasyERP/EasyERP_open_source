var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');
var oxr = require('open-exchange-rates');
var fx = require('money');
var moment = require('../public/js/libs/moment/moment');
var fs = require('fs');
var pathMod = require('path');
var pageHelper = require('../helpers/pageHelper');

var Module = function (models, event) {
    'use strict';

    var InvoiceSchema = mongoose.Schemas.Invoice;
    var wTrackInvoiceSchema = mongoose.Schemas.wTrackInvoice;
    var OrderSchema = mongoose.Schemas.Quotation;
    var ProductSchema = mongoose.Schemas.Products;
    var ProformaSchema = mongoose.Schemas.Proforma;
    var WriteOffSchema = mongoose.Schemas.writeOff;
    var ExpensesInvoiceSchema = mongoose.Schemas.expensesInvoice;
    var DividendInvoiceSchema = mongoose.Schemas.dividendInvoice;
    var DepartmentSchema = mongoose.Schemas.Department;
    var CustomerSchema = mongoose.Schemas.Customer;
    var PaymentSchema = mongoose.Schemas.Payment;
    var wTrackSchema = mongoose.Schemas.wTrack;
    var JobsSchema = mongoose.Schemas.jobs;
    var objectId = mongoose.Types.ObjectId;

    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var access = require('../helpers/access.js')(models);
    var rewriteAccess = require('../helpers/rewriteAccess');
    var async = require('async');
    var workflowHandler = new WorkflowHandler(models);
    var _ = require('../node_modules/underscore');
    var CONSTANTS = require('../constants/mainConstants.js');
    var JournalEntryHandler = require('./journalEntry');
    var _journalEntryHandler = new JournalEntryHandler(models, event);
    var path = require('path');
    var Uploader = require('../services/fileStorage/index');
    var HistoryService = require('../services/history.js')(models);
    var uploader = new Uploader();
    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();

    var wTrackInvoiceCT = 'wTrackInvoice';

    oxr.set({app_id: process.env.OXR_APP_ID});

    function journalEntryComposer(invoice, dbIndex, waterfallCb, uId) {
        var journalEntryBody = {};
        var beforeInvoiceBody = {};
        var cb = waterfallCb;

        journalEntryBody.date = invoice.invoiceDate;
        journalEntryBody.journal = invoice.journal || CONSTANTS.INVOICE_JOURNAL;
        journalEntryBody.currency = invoice.currency || 'USD';
        journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
        journalEntryBody.sourceDocument = {};
        journalEntryBody.sourceDocument._id = invoice._id;
        journalEntryBody.sourceDocument.model = 'Invoice';
        journalEntryBody.sourceDocument.name = invoice.name;

        if (invoice.paymentInfo.total - invoice.paymentInfo.balance > 0) {
            cb = _.after(2, waterfallCb);

            beforeInvoiceBody.date = invoice.invoiceDate;
            beforeInvoiceBody.journal = CONSTANTS.BEFORE_INVOICE;
            beforeInvoiceBody.currency = invoice.currency ? invoice.currency._id : 'USD';
            beforeInvoiceBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total - invoice.paymentInfo.balance : 0;
            beforeInvoiceBody.sourceDocument = {};
            beforeInvoiceBody.sourceDocument._id = invoice._id;
            beforeInvoiceBody.sourceDocument.model = 'Proforma';
            journalEntryBody.sourceDocument.name = invoice.name;

            _journalEntryHandler.create(beforeInvoiceBody, dbIndex, cb, uId);
        }

        _journalEntryHandler.create(journalEntryBody, dbIndex, cb, uId);
    }

    function getHistory(req, invoice, cb) {
        var dbName = req.session.lastDb;
        var Invoice = models.get(dbName, wTrackInvoiceCT, wTrackInvoiceSchema);

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
                    date   : elem.date,
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
                            date: elem.createdBy ? elem.createdBy.date : '',
                            pay : (elem.currency && elem.currency._id ? elem.currency._id.symbol : '') + (elem.paidAmount / 100).toFixed(2),
                            user: elem.createdBy && elem.createdBy.user ? elem.createdBy.user.toJSON() : ''
                        };
                    });

                    if (!invoice.notes) {
                        invoice.notes = [];
                    }

                    invoice.notes = invoice.notes.concat(notes, payments);
                    invoice.notes = _.sortBy(invoice.notes, 'date');
                    cb(null, invoice);
                });
            });
        });

    }

    this.create = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var body = req.body;
        var forSales = body.forSales;
        var waterfallTasks;
        var createdBy = {};
        var editedBy = {};

        var Invoice;
        var invoice;

        function invoiceSaver(waterfallCb) {

            invoice = new Invoice(body);

            if (req.session.uId) {
                invoice.createdBy.user = createdBy.user = req.session.uId;
                invoice.editedBy.user = editedBy.user = req.session.uId;
            }

            invoice.save(function (err, result) {
                var historyOptions;

                if (err) {
                    return waterfallCb(err);
                }

                historyOptions = {
                    contentType: 'invoice',
                    data       : result.toJSON(),
                    dbName     : dbIndex,
                    contentId  : result._id
                };

                HistoryService.addEntry(historyOptions, function () {
                    result = result.toObject();
                    result.currency = result.currency || {};
                    result.currency.name = body.currency ? body.currency.name : 'USD';

                    if (forSales) {
                        waterfallCb(null, dbIndex, result);
                    } else { // added in case of bad creating no forSales invoice ( property model undefined for Journal )
                        waterfallCb(null, result);
                    }
                });
            });
        }

        if (forSales) {
            Invoice = models.get(dbIndex, wTrackInvoiceCT, wTrackInvoiceSchema);
            waterfallTasks = [invoiceSaver];
        } else {
            Invoice = models.get(dbIndex, 'Invoice', InvoiceSchema);
            waterfallTasks = [invoiceSaver];   // added in case of bad creating no forSales invoice ( property model undefined for Journal )
        }

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(201).send(result);
        });
    };

    this.getSalesByCountry = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);
        var filter = req.query.filter || {};
        filter._type = {
            value: [wTrackInvoiceCT]
        };

        Invoice.aggregate([
            {
                $match: {
                    $and: [
                        {
                            forSales: true
                        },
                        filterMapper.mapFilter(filter, {contentType: wTrackInvoiceCT})
                    ]
                }
            },
            {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'supplier',
                    foreignField: '_id',
                    as          : 'supplier'
                }
            },
            {
                $lookup: {
                    from        : 'journalentries',
                    localField  : '_id',
                    foreignField: 'sourceDocument._id',
                    as          : 'journalEntries'
                }
            },
            {
                $match: {
                    journalEntries: {$exists: true, $not: {$size: 0}}
                }
            },
            {
                $project: {
                    supplier: {$arrayElemAt: ['$supplier', 0]},
                    pays    : {$sum: '$journalEntries.debit'}
                }
            },
            {
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

    this.receive = function (req, res, next) {
        var id = req.body.orderId;
        var forSales = req.body.forSales;
        var journal = req.body.journal;
        var dbIndex = req.session.lastDb;
        var Invoice = models.get(dbIndex, 'Invoice', InvoiceSchema);
        var wTrackInvoice = models.get(dbIndex, wTrackInvoiceCT, wTrackInvoiceSchema);
        var Order = models.get(dbIndex, 'Quotation', OrderSchema);
        var Company = models.get(dbIndex, 'Customer', CustomerSchema);
        var request;
        var date = moment().format('YYYY-MM-DD');
        var parallelTasks;
        var waterFallTasks;

        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        if (id.length < 24) {
            return res.status(400).send();
        }

        function getRates(callback) {
            oxr.historical(date, function () {
                fx.rates = oxr.rates;
                fx.base = oxr.base;
                callback();
            });
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
                .populate('currency._id')
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

        function findProformaPayments(callback) {
            Invoice.aggregate([
                {
                    $match: {
                        sourceDocument: objectId(id)
                    }
                }, {
                    $project: {
                        payments   : 1,
                        paymentDate: 1,
                        dueDate    : 1,
                        _id        : 0
                    }
                }, {
                    $unwind: '$payments'
                }, {
                    $lookup: {
                        from        : 'Payment',
                        localField  : 'payments',
                        foreignField: '_id',
                        as          : 'payment'
                    }
                }, {
                    $project: {
                        payment    : {$arrayElemAt: ['$payment', 0]},
                        paymentDate: 1,
                        dueDate    : 1
                    }
                }, {
                    $group: {
                        _id         : null,
                        paymentsInfo: {$push: '$payment'},
                        payments    : {$push: '$payment._id'},
                        paymentDate : {$first: '$paymentDate'},
                        dueDate     : {$max: '$dueDate'}
                    }
                }
            ], callback);
        }

        function changeProformaWorkflow(callback) {
            var request = {
                query: {
                    wId   : 'Proforma',
                    status: 'Done'
                },

                session: req.session
            };

            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                Invoice.update({
                    sourceDocument: objectId(id)
                }, {
                    $set: {
                        workflow: workflow._id,
                        invoiced: true,
                        editedBy: editedBy
                    }
                }, {
                    multi: true
                }, callback);
            });
        }

        function parallel(callback) {
            async.parallel(parallelTasks, callback);
        }

        function createInvoice(parallelResponse, callback) {
            var userId = req.session.uId;
            var order;
            var workflow;
            var err;
            var invoice;
            var invoiceCurrency;
            var query;
            var paidAmount = 0;
            var proforma;
            var payments;

            if (parallelResponse && parallelResponse.length) {
                proforma = parallelResponse[2][0];
                order = parallelResponse[0];
                workflow = parallelResponse[1];

                // order.attachments[0].shortPas = order.attachments[0].shortPas.replace('..%2Froutes', '');
                //  delete order.attachments;

            } else {
                err = new Error(RESPONSES.BAD_REQUEST);
                err.status = 400;

                return callback(err);
            }

            invoiceCurrency = order.currency._id.name;
            order.currency._id = order.currency._id._id;

            delete order._id;

            if (forSales) {
                invoice = new wTrackInvoice(order);
            } else {
                invoice = new Invoice(order);
            }

            invoice.invoiceDate = order.orderDate;

            if (proforma) {
                proforma.paymentsInfo.forEach(function (payment) {
                    var paid = payment.paidAmount;
                    var paidInUSD = paid / payment.currency.rate;

                    paidAmount += fx(paidInUSD).from('USD').to(invoiceCurrency);
                });

                payments = proforma.payments;
                invoice.paymentDate = proforma.paymentDate;
            }

            if (userId) {
                invoice.createdBy.user = userId;
                invoice.editedBy.user = userId;
            }

            invoice.currency.rate = oxr.rates[invoiceCurrency][oxr.base];

            // invoice.sourceDocument = order.name;
            invoice.payments = payments;
            invoice.sourceDocument = id;
            invoice.paymentReference = order.name;
            invoice.paymentInfo.balance = order.paymentInfo.total - paidAmount;

            if (payments && payments.length) {
                invoice.removable = true;
            }

            if (paidAmount >= order.paymentInfo.total) {
                invoice.workflow = objectId(CONSTANTS.INVOICE_PAID);
            } else if (paidAmount) {
                invoice.workflow = objectId(CONSTANTS.INVOICE_PARTIALY_PAID);
            } else {
                invoice.workflow = workflow._id;
            }

            if (forSales === 'true') {
                if (!invoice.project) {
                    invoice.project = order.project ? order.project._id : null;
                }
            }

            invoice.supplier = order.supplier;

            invoice.journal = journal;

            if (forSales === 'true') {
                invoice.salesPerson = order.project.salesmanager || null;

                invoice.save(function (err, result) {
                    var historyOptions;

                    if (err) {
                        return next(err);
                    }
                    historyOptions = {
                        contentType: 'invoice',
                        data       : result.toJSON(),
                        dbName     : dbIndex,
                        contentId  : result._id
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

                        historyOptions = {
                            contentType: 'invoice',
                            data       : result.toJSON(),
                            dbName     : dbIndex,
                            contentId  : result._id
                        };

                        HistoryService.addEntry(historyOptions, function () {
                            callback(null, result);
                        });

                    });
                });

            }

        }

        parallelTasks = [findOrder, fetchFirstWorkflow, findProformaPayments, changeProformaWorkflow, getRates];
        waterFallTasks = [parallel, createInvoice/* , createJournalEntry*/];

        async.waterfall(waterFallTasks, function (err, result) {

            if (err) {
                return next(err);
            }

            Order.findByIdAndUpdate(id, {
                $set: {
                    workflow: CONSTANTS.ORDERDONE
                }
            }, {new: true}, function (err) {
                if (err) {
                    return next(err);
                }
            });

            res.status(201).send(result);
        });

    };

    this.uploadFile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var headers = req.headers;
        var addNote = headers.addnote;
        var id = headers.modelid || 'empty';
        var contentType = headers.modelname || 'invoices';
        var files = req.files && req.files.attachfile ? req.files.attachfile : null;
        var dir;
        var err;

        contentType = contentType.toLowerCase();
        dir = path.join(contentType, id);

        if (!files) {
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

        uploader.postFile(dir, files, {userId: req.session.uName}, function (err, file) {
            var notes = [];
            if (err) {
                return next(err);
            }

            if (addNote) {
                notes = file.map(function (elem) {
                    return {
                        _id: mongoose.Types.ObjectId(),

                        attachment: {
                            name    : elem.name,
                            shortPas: elem.shortPas
                        },

                        user: {
                            _id  : req.session.uId,
                            login: req.session.uName
                        },

                        date: new Date()
                    }
                });
            }

            Model.findByIdAndUpdate(id, {
                $push: {
                    attachments: {$each: file},
                    notes      : {$each: notes}
                }
            }, {new: true}, function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Invoice updated success', data: response});
            });
        });
    };

    this.updateOnlySelected = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.params.id;
        var data = req.body;
        var Invoice = models.get(db, wTrackInvoiceCT, wTrackInvoiceSchema);
        var JobsModel = models.get(db, 'jobs', JobsSchema);
        var ProductModel = models.get(db, 'Product', ProductSchema);
        var Customer = models.get(db, 'Customers', CustomerSchema);
        var date;
        var query;
        var queryForClosed;
        var model;
        var journal;
        var dateForJobs;
        var dateForJobsFinished;
        var fileName;
        var os;
        var _id;
        var osType;
        var path;
        var dir;
        var invoiceProducts;
        var invoiceJobs;
        var newDirname;
        var obj;

        if (id.length < 24) {
            return res.status(400).send();
        }

        delete data.salesPerson;

        date = moment(new Date(data.invoiceDate));
        date = date.format('YYYY-MM-DD');

        Invoice = models.get(db, wTrackInvoiceCT, wTrackInvoiceSchema);

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

                res.status(200).send(invoice);

            });

        } else {

            data.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            };

            oxr.historical(date, function () {
                fx.rates = oxr.rates;
                fx.base = oxr.base;

                if (data.currency && data.currency.name && Object.keys(oxr.rates).length) {
                    data.currency.rate = oxr.rates[data.currency.name];
                }

                Invoice.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, invoice) {
                    var products = data.products;
                    var historyOptions;

                    if (err) {
                        return next(err);
                    }
                    historyOptions = {
                        contentType: 'invoice',
                        data       : data,
                        dbName     : db,
                        contentId  : invoice._id
                    };

                    if (products) {
                        async.each(products, function (result, cb) {
                            var jobs = result.jobs;
                            var productId = result.product;
                            var editedBy = {
                                user: req.session.uId,
                                date: new Date()
                            };
                            ProductModel.findByIdAndUpdate(productId, {
                                'info.description': result.description
                            }, function (err) {
                                if (err) {
                                    return next(err);
                                }
                                JobsModel.findByIdAndUpdate(jobs, {
                                    $set: {
                                        description: result.jobDescription,
                                        editedBy   : editedBy
                                    }
                                }, {new: true}, function (err, job) {
                                    if (err) {
                                        return cb(err);
                                    }

                                    cb();
                                });
                            });

                        }, function () {
                            if (invoice && invoice._type === 'Proforma') {
                                model = 'Proforma';

                                query = {
                                    'sourceDocument.model': model,
                                    'sourceDocument._id'  : id,
                                    journal               : CONSTANTS.BEFORE_INVOICE
                                };
                                _journalEntryHandler.changeDate(query, data.invoiceDate, req.session.lastDb, function () {
                                });

                                journal = invoice.journal; // CONSTANTS.PROFORMA_JOURNAL;
                            } else {
                                model = 'Invoice';
                                journal = invoice.journal; // CONSTANTS.INVOICE_JOURNAL;

                                dateForJobs = moment(new Date(data.invoiceDate)).subtract(1, 'seconds');
                                dateForJobsFinished = moment(new Date(data.invoiceDate)).subtract(2, 'seconds');

                                invoiceProducts = invoice.products;

                                invoiceJobs = [];

                                invoiceProducts.forEach(function (prod) {
                                    invoiceJobs.push(prod.jobs);
                                });

                                query = {
                                    'sourceDocument.model': 'jobs',
                                    'sourceDocument._id'  : {$in: invoiceJobs},
                                    journal               : CONSTANTS.JOB_FINISHED
                                };
                                _journalEntryHandler.changeDate(query, dateForJobs, req.session.lastDb, function () {
                                });

                                queryForClosed = {
                                    'sourceDocument.model': 'jobs',
                                    'sourceDocument._id'  : {$in: invoiceJobs},
                                    journal               : CONSTANTS.CLOSED_JOB
                                };
                                _journalEntryHandler.changeDate(query, dateForJobsFinished, req.session.lastDb, function () {
                                });

                                query = {'sourceDocument.model': model, 'sourceDocument._id': id, journal: journal};
                                _journalEntryHandler.changeDate(query, data.invoiceDate, req.session.lastDb, function () {
                                });
                            }

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
                                        .populate('paymentTerms', function (err) {
                                            if (err) {
                                                return next(err);
                                            }

                                            if (invoice && invoice._type !== 'Proforma') {
                                                getHistory(req, invoice, function (err, invoice) {
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
                    } else {
                        if (invoice && invoice._type === 'Proforma') {
                            model = 'Proforma';

                            query = {
                                'sourceDocument.model': model,
                                'sourceDocument._id'  : id,
                                journal               : CONSTANTS.BEFORE_INVOICE
                            };
                            _journalEntryHandler.changeDate(query, data.invoiceDate, req.session.lastDb, function () {
                            });

                            journal = invoice.journal; // CONSTANTS.PROFORMA_JOURNAL;
                        } else {
                            model = 'Invoice';
                            journal = invoice.journal; // CONSTANTS.INVOICE_JOURNAL;

                            dateForJobs = moment(new Date(data.invoiceDate)).subtract(1, 'seconds');
                            dateForJobsFinished = moment(new Date(data.invoiceDate)).subtract(2, 'seconds');

                            invoiceProducts = invoice.products;

                            invoiceJobs = [];

                            invoiceProducts.forEach(function (prod) {
                                invoiceJobs.push(prod.jobs);
                            });

                            query = {
                                'sourceDocument.model': 'jobs',
                                'sourceDocument._id'  : {$in: invoiceJobs},
                                journal               : CONSTANTS.JOB_FINISHED
                            };
                            _journalEntryHandler.changeDate(query, dateForJobs, req.session.lastDb, function () {
                            });

                            queryForClosed = {
                                'sourceDocument.model': 'jobs',
                                'sourceDocument._id'  : {$in: invoiceJobs},
                                journal               : CONSTANTS.CLOSED_JOB
                            };
                            _journalEntryHandler.changeDate(query, dateForJobsFinished, req.session.lastDb, function () {
                            });

                            query = {'sourceDocument.model': model, 'sourceDocument._id': id, journal: journal};
                            _journalEntryHandler.changeDate(query, invoice.invoiceDate, req.session.lastDb, function () {
                            });
                        }
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

                    }

                });
            });
        }
    };

    this.getEmails = function (req, res, next) {
        var id = req.params.id;
        var Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);

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

    this.approve = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.body.invoiceId;
        var invoiceDate = req.body.invoiceDate;
        var JobsModel = models.get(db, 'jobs', JobsSchema);
        var products;
        var project;

        var Invoice = models.get(db, wTrackInvoiceCT, wTrackInvoiceSchema);

        Invoice.findByIdAndUpdate(id, {
            $set: {
                approved   : true,
                invoiceDate: invoiceDate
            }
        }, {new: true}, function (err, resp) {
            var parallelTask;
            var setWorkflow;
            var updateJobs;
            var historyOptions;

            if (err) {
                return next(err);
            }

            historyOptions = {
                contentType: 'invoice',

                data: {
                    approved: ' '
                },

                dbName   : db,
                contentId: id
            };

            HistoryService.addEntry(historyOptions, function () {
                products = resp.products;

                if (resp._type !== 'Proforma') {
                    setWorkflow = function (callback) {
                        var request;

                        journalEntryComposer(resp, req.session.lastDb, function () {
                        }, req.session.uId);

                        request = {
                            query: {
                                wId   : 'Proforma',
                                status: 'Cancelled'
                            },

                            session: req.session
                        };

                        workflowHandler.getFirstForConvert(request, function (err, workflow) {
                            Invoice.update({
                                sourceDocument: objectId(resp.sourceDocument),
                                payments      : []
                            }, {
                                $set: {
                                    workflow: workflow._id,
                                    invoiced: true
                                }
                            }, {
                                multi: true
                            }, callback);
                        });
                    };

                    updateJobs = function (callback) {
                        if (products) {
                            async.each(products, function (result, cb) {
                                var jobs = result.jobs;
                                var editedBy = {
                                    user: req.session.uId,
                                    date: new Date()
                                };
                                JobsModel.findByIdAndUpdate(jobs, {
                                    $set: {
                                        invoice : resp._id,
                                        type    : 'Invoiced',
                                        workflow: CONSTANTS.JOBSFINISHED,
                                        editedBy: editedBy
                                    }
                                }, {new: true}, function (err, job) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    project = job.project || null;

                                    _journalEntryHandler.createCostsForJob({
                                        req     : req,
                                        jobId   : jobs,
                                        workflow: CONSTANTS.JOBSFINISHED
                                    });

                                    cb();
                                });

                            }, function () {
                                if (project) {
                                    event.emit('fetchJobsCollection', {project: project, dbName: db});
                                }
                                callback();
                            });
                        }
                    };

                    parallelTask = [updateJobs, setWorkflow];
                    async.parallel(parallelTask, function (err, response) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(response);
                    });
                } else {
                    res.status(200).send(resp);
                }
            });

        });
    };

    this.getAll = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var query = {};

        Invoice.find(query, function (err, invoices) {
            if (err) {
                return next(err);
            }

            res.status(200).send(invoices);
        });
    };

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var contentType = req.query.contentType;
        var moduleId;
        var accessRollSearcher;
        var Invoice;
        var query = req.query;
        var filter = query.filter || {};
        var optionsObject = {};
        var sort = {};
        var contentSearcher;
        var waterfallTasks;
        var paginationObject = pageHelper(query);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var keys;
        var keysLength;
        var i;
        var aggregation;
        var forPurchase = false;

        if (contentType === 'salesProforma') {
            moduleId = 99;
        } else if (contentType === 'proforma') {
            moduleId = 95;
        } else if (contentType === 'ExpensesInvoice') {
            moduleId = 97;
        } else if (contentType === 'WriteOff') {
            moduleId = 105;
        } else if (contentType === 'DividendInvoice') {
            moduleId = 100;
        } else {
            moduleId = 64;
        }

        if (contentType === 'salesProforma') {
            Invoice = models.get(db, 'Proforma', ProformaSchema);
        } else if (contentType === 'proforma') {
            Invoice = models.get(db, 'Proforma', ProformaSchema);
            forPurchase = true;
        } else if (contentType === 'ExpensesInvoice') {
            Invoice = models.get(db, 'expensesInvoice', ExpensesInvoiceSchema);
        } else if (contentType === 'DividendInvoice') {
            Invoice = models.get(db, 'dividendInvoice', DividendInvoiceSchema);
        } else if (contentType === 'WriteOff') {
            Invoice = models.get(db, 'writeOff', WriteOffSchema);
        } else if (contentType === 'Invoices') {
            Invoice = models.get(db, 'Invoice', InvoiceSchema);

            filter.forSales = {
                key  : 'forSales',
                type : 'boolean',
                value: ['false']
            };
        } else {
            Invoice = models.get(db, wTrackInvoiceCT, wTrackInvoiceSchema);

            filter.forSales = {
                key  : 'forSales',
                type : 'boolean',
                value: ['true']
            };
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
            if (filter && typeof filter === 'object') {
                optionsObject.$and.push(filterMapper.mapFilter(filter, {contentType: contentType}));
            }

            optionsObject.$and.push({_id: {$in: invoicesIds}});
            optionsObject.$and.push({expense: {$exists: false}});

            if (contentType === 'salesProforma' || contentType === 'proforma') {
                optionsObject.$and.push({_type: 'Proforma'});
            } else if (contentType === 'ExpensesInvoice') {
                optionsObject.$and.push({_type: 'expensesInvoice'});
            } else if (contentType === 'DividendInvoice') {
                optionsObject.$and.push({_type: 'dividendInvoice'});
            } else if (contentType === 'Invoices') {
                optionsObject.$and.push({_type: 'Invoice'});
            } else if (contentType === 'WriteOff') {
                optionsObject.$and.push({_type: 'writeOff'});
            } else {
                optionsObject.$and.push({$and: [{_type: {$ne: 'Proforma'}}, {_type: {$ne: 'expensesInvoice'}}]});
            }

            if (forPurchase) {
                aggregation = [
                    {
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
                            from        : 'expensesCategories',
                            localField  : 'expensesCategory',
                            foreignField: '_id',
                            as          : 'expensesCategory'
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
                            workflow        : {$arrayElemAt: ['$workflow', 0]},
                            supplier        : {$arrayElemAt: ['$supplier', 0]},
                            journal         : {$arrayElemAt: ['$journal', 0]},
                            expense         : 1,
                            forSales        : 1,
                            'currency._id'  : {$arrayElemAt: ['$currency._id', 0]},
                            'currency.rate' : '$currency.rate',
                            paymentInfo     : 1,
                            invoiceDate     : 1,
                            name            : 1,
                            paymentDate     : 1,
                            dueDate         : 1,
                            approved        : 1,
                            expensesCategory: 1,
                            _type           : 1,
                            removable       : 1,
                            'editedBy.date' : 1,
                            paid            : {$divide: [{$subtract: ['$paymentInfo.total', '$paymentInfo.balance']}, 100]}
                        }
                    }, {
                        $project: {
                            salesManager     : '$supplier.salesPurchases.salesPerson',
                            'workflow._id'   : 1,
                            'workflow.name'  : 1,
                            'workflow.status': 1,
                            'supplier._id'   : '$supplier._id',
                            'supplier.name'  : {$concat: ['$supplier.name.first', ' ', '$supplier.name.last']},
                            'journal.name'   : '$journal.name',
                            'journal._id'    : '$journal._id',
                            expense          : 1,
                            forSales         : 1,
                            currency         : 1,
                            paymentInfo      : 1,
                            invoiceDate      : 1,
                            name             : 1,
                            paymentDate      : 1,
                            dueDate          : 1,
                            payments         : 1,
                            approved         : 1,
                            _type            : 1,
                            removable        : 1,
                            editedBy         : 1,
                            paid             : 1,
                            expensesCategory : 1
                        }
                    }, {
                        $lookup: {
                            from        : 'Employees',
                            localField  : 'salesManager',
                            foreignField: '_id',
                            as          : 'salesManager'
                        }
                    }, {
                        $project: {
                            salesPerson     : {$arrayElemAt: ['$salesManager', 0]},
                            workflow        : 1,
                            supplier        : 1,
                            project         : 1,
                            expense         : 1,
                            forSales        : 1,
                            currency        : 1,
                            paymentInfo     : 1,
                            invoiceDate     : 1,
                            name            : 1,
                            paymentDate     : 1,
                            dueDate         : 1,
                            approved        : 1,
                            _type           : 1,
                            removable       : 1,
                            journal         : 1,
                            paid            : 1,
                            editedBy        : 1,
                            expensesCategory: 1
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
                            'salesPerson.name': {
                                $concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']
                            },
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
                    }
                ];
            } else {
                aggregation = [
                    {
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
                            from        : 'currency',
                            localField  : 'currency._id',
                            foreignField: '_id',
                            as          : 'currency._id'
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
                            from        : 'workflows',
                            localField  : 'workflow',
                            foreignField: '_id',
                            as          : 'workflow'
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
                            workflow: {$arrayElemAt: ['$workflow', 0]},
                            supplier: {$arrayElemAt: ['$supplier', 0]},
                            project : {$arrayElemAt: ['$project', 0]},
                            journal : {$arrayElemAt: ['$journal', 0]},

                            salesManagers: {
                                $filter: {
                                    input: '$projectMembers',
                                    as   : 'projectMember',
                                    cond : salesManagerMatch
                                }
                            },

                            expense         : 1,
                            forSales        : 1,
                            'currency._id'  : {$arrayElemAt: ['$currency._id', 0]},
                            'currency.rate' : '$currency.rate',
                            paymentInfo     : 1,
                            invoiceDate     : 1,
                            name            : 1,
                            paymentDate     : 1,
                            expensesCategory: 1,
                            dueDate         : 1,
                            approved        : 1,
                            _type           : 1,
                            removable       : 1,
                            'editedBy.date' : 1,
                            paid            : {$divide: [{$subtract: ['$paymentInfo.total', '$paymentInfo.balance']}, 100]}
                        }
                    }, {
                        $project: {
                            salesManagers    : {$arrayElemAt: ['$salesManagers', 0]},
                            'workflow._id'   : 1,
                            'workflow.name'  : 1,
                            'workflow.status': 1,
                            'supplier._id'   : '$supplier._id',
                            'supplier.name'  : {$concat: ['$supplier.name.first', ' ', '$supplier.name.last']},
                            'project._id'    : '$project._id',
                            'project.name'   : '$project.name',
                            'journal.name'   : '$journal.name',
                            'journal._id'    : '$journal._id',
                            expense          : 1,
                            forSales         : 1,
                            currency         : 1,
                            paymentInfo      : 1,
                            invoiceDate      : 1,
                            name             : 1,
                            paymentDate      : 1,
                            dueDate          : 1,
                            expensesCategory : 1,
                            payments         : 1,
                            approved         : 1,
                            _type            : 1,
                            removable        : 1,
                            editedBy         : 1,
                            paid             : 1
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
                            salesPerson     : {$arrayElemAt: ['$salesManagers', 0]},
                            workflow        : 1,
                            supplier        : 1,
                            project         : 1,
                            expense         : 1,
                            forSales        : 1,
                            currency        : 1,
                            paymentInfo     : 1,
                            expensesCategory: 1,
                            invoiceDate     : 1,
                            name            : 1,
                            paymentDate     : 1,
                            dueDate         : 1,
                            approved        : 1,
                            _type           : 1,
                            removable       : 1,
                            journal         : 1,
                            paid            : 1,
                            editedBy        : 1
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
                            'salesPerson.name': {$concat: ['$$root.salesPerson.name.first', ' ', '$$root.salesPerson.name.last']},
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
                    }
                ];
            }

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

            firstElement = result && result.length ? result[0] : {};
            count = firstElement && firstElement.total ? firstElement.total : 0;
            response.total = count;
            response.data = result;

            res.status(200).send(response);
        });
    };

    this.getInvoiceById = function (req, res, next) {
        var data = req.query || {};
        var contentType = data.contentType;
        var id = data.id || data._id;
        var forSales;
        var Invoice;
        var optionsObject = {};
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        if (id.length < 24) {
            return res.status(400).send();
        }

        forSales = data.forSales !== 'false';

        if ((contentType === 'DividendInvoice') || (contentType === 'dividendInvoice')) {
            Invoice = models.get(req.session.lastDb, 'dividendInvoice', DividendInvoiceSchema);
        } else if (forSales) {
            Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);
        } else if (contentType === 'WriteOff') {
            Invoice = models.get(req.session.lastDb, 'writeOff', WriteOffSchema);
        } else {
            Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
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

            models.get(req.session.lastDb, 'Invoice', InvoiceSchema).aggregate(
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
                .populate('products.jobs', '_id name description')
                .populate('products.product', '_id name info')
                .populate('project', '_id name paymentMethod paymentTerms')
                .populate('currency._id')
                .populate('journal', '_id name')
                .populate('payments', '_id name date paymentRef paidAmount createdBy currency')
                .populate('department', '_id name')
                .populate('paymentTerms', '_id name count')
                .populate('createdBy.user', '_id login')
                .populate('editedBy.user', '_id login')
                .populate('groups.users')
                .populate('groups.group')
                .populate('groups.owner', '_id login')
                .populate('sourceDocument', '_id name')
                .populate('workflow', '_id name status')
                .populate('supplier', '_id name fullName');

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            if (result && result._type !== 'Proforma') {
                getHistory(req, result.toJSON(), function (err, invoice) {
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
        var db = req.session.lastDb;
        var Model = models.get(db, 'Invoice', InvoiceSchema);
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
        var paymentIds = [];
        var jobs = [];
        var project;
        var orderId;
        var invoiceDeleted;
        var Payment = models.get(db, 'Payment', PaymentSchema);
        var wTrack = models.get(db, 'wTrack', wTrackSchema);
        var Order = models.get(db, 'Quotation', OrderSchema);
        var Proforma = models.get(db, 'Proforma', ProformaSchema);
        var JobsModel = models.get(db, 'jobs', JobsSchema);
        var parallelTasks;
        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };
        var orderUpdateQuery = {
            $set: {
                workflow: CONSTANTS.ORDERNEW
            }
        };

        if (id.length < 24) {
            return res ? res.status(400).send() : callback();
        }

        models.get(db, 'Invoice', InvoiceSchema).findByIdAndRemove(id, function (err, result) {
            var proformaBalance;
            var isProformaPaid;

            if (err) {
                return next(err);
            }

            invoiceDeleted = result.toJSON();

            orderId = invoiceDeleted.sourceDocument;

            if (invoiceDeleted._type === 'Proforma') {
                orderUpdateQuery.$inc = {
                    proformaCounter: -1
                };
            }

            Order.findByIdAndUpdate(objectId(orderId), orderUpdateQuery,
                {new: true}, function (err) {
                    if (err) {
                        return next(err);
                    }
                });

            async.each(invoiceDeleted.products, function (product) {
                jobs.push(product.jobs);
            });
            async.each(invoiceDeleted.payments, function (payment) {
                paymentIds.push(payment);
            });

            proformaBalance = result.get('paymentInfo').balance;
            isProformaPaid = (proformaBalance === 0);

            function proformaUpdate(parallelCb) {
                var request = {
                    query: {
                        wId   : 'Proforma',
                        status: 'New'
                    },

                    session: req.session
                };

                workflowHandler.getFirstForConvert(request, function (err, workflow) {
                    Proforma.update({
                        sourceDocument: orderId,
                        _type         : 'Proforma',
                        payments      : []
                    }, {
                        $set: {
                            workflow: workflow._id,
                            invoiced: false
                        }
                    }, {
                        multi: true
                    }, parallelCb);
                });
            }

            function proformaCancelledUpdate(parallelCb) {
                var request;

                if (isProformaPaid) {
                    request = {
                        query: {
                            wId   : 'Proforma',
                            status: 'Done',
                            name  : 'Paid'
                        },

                        session: req.session
                    };

                } else {
                    request = {
                        query: {
                            wId   : 'Proforma',
                            status: 'In Progress'
                        },

                        session: req.session
                    };
                }

                workflowHandler.getFirstForConvert(request, function (err, workflow) {
                    Proforma.update({
                        sourceDocument: orderId,
                        _type         : 'Proforma',
                        payments      : {$ne: []}
                    }, {
                        $set: {
                            workflow: workflow._id,
                            invoiced: false
                        }
                    }, {
                        multi: true
                    }, parallelCb);
                });
            }

            function paymentsRemove(parallelCb) {
                async.each(paymentIds, function (pid, cb) {
                    Payment.remove({invoice: id}, cb);
                }, function () {
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

            function jobsUpdateAndWTracks(parallelCb) {
                var setData = {};
                var array;
                var updateObject = {
                    type    : 'Ordered',
                    invoice : null,
                    workflow: CONSTANTS.JOBSINPROGRESS,
                    editedBy: editedBy
                };
                if (result && result._type === 'writeOff') {
                    updateObject.type = 'Not Ordered';
                }

                async.each(jobs, function (id, cb) {
                    setData.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };

                    JobsModel.findByIdAndUpdate(id, updateObject, {new: true}, function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        /*_journalEntryHandler.checkAndCreateForJob({
                         req     : req,
                         jobId   : id,
                         jobName : result.name,
                         workflow: CONSTANTS.JOBSINPROGRESS,
                         wTracks : result ? result.wTracks : [],
                         date    : invoiceDeleted.invoiceDate
                         });*/

                        project = result ? result.project : null;
                        array = result ? result.wTracks : [];

                        async.each(array, function (id) {
                            setData.editedBy = {
                                user: req.session.uId,
                                date: new Date().toISOString()
                            };

                            setData.isPaid = false;
                            setData.amount = 0;

                            wTrack.findByIdAndUpdate(id, setData, {new: true}, function (err, result) {
                                if (err) {
                                    return console.log(err);
                                }

                            });
                        });
                        cb();
                    });
                }, function () {
                    if (project) {
                        event.emit('fetchJobsCollection', {project: project, dbName: db});
                    }
                    parallelCb();
                });
            }

            if (result && result._type !== 'expensesInvoice') {
                parallelTasks = [proformaUpdate, proformaCancelledUpdate, paymentsRemove, journalEntryRemove, jobsUpdateAndWTracks, folderRemove];
            } else if (result && result._type === 'writeOff') {
                parallelTasks = [jobsUpdateAndWTracks, journalEntryRemove, folderRemove];
            } else {
                parallelTasks = [proformaUpdate, proformaCancelledUpdate, paymentsRemove, journalEntryRemove, folderRemove];
            }

            async.parallel(parallelTasks, function (err) {
                if (err) {
                    return next(err);
                }
            });

            if (res) {
                res.status(200).send(result);
            } else if (callback) {
                callback();
            }
        });

    }

    this.removeInvoice = function (req, res, id, next) {
        removeInvoice(req, res, id, next);
    };

    this.updateInvoice = function (req, res, _id, data, next) {
        var Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);

        if (_id.length < 24) {
            return res.status(400).send();
        }

        Invoice.findByIdAndUpdate(_id, data.invoice, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });

    };

    this.revenueByCountry = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);
        var data = req.query;
        var filter = data.filter || {};

        filter._type = {
            backend: '_type',
            value  : [wTrackInvoiceCT]
        };

        Invoice.aggregate([
            {
                $match: filterMapper.mapFilter(filter, {contentType: wTrackInvoiceCT})
            },
            {
                $project: {
                    paymentInfo: 1,
                    invoiceDate: 1,
                    supplier   : 1,
                    currency   : 1
                }
            },
            {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'supplier',
                    foreignField: '_id',
                    as          : 'supplier'
                }
            },
            {
                $project: {
                    paymentInfo: 1,
                    currency   : 1,
                    supplier   : {$arrayElemAt: ['$supplier', 0]}
                }
            },
            {
                $project: {
                    sum    : {$divide: ['$paymentInfo.total', '$currency.rate']},
                    country: '$supplier.address.country'
                }
            },
            {
                $group: {
                    _id: '$country',
                    sum: {$sum: '$sum'}
                }
            }, {
                $match: {
                    _id: {$ne: null},
                    sum: {$ne: null}
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.revenueByCustomer = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);
        var data = req.query;
        var filter = data.filter || {};

        filter._type = {
            backend: '_type',
            value  : [wTrackInvoiceCT]
        };

        Invoice.aggregate([
            {
                $match: filterMapper.mapFilter(filter, {contentType: wTrackInvoiceCT})
            },
            {
                $project: {
                    paymentInfo: 1,
                    invoiceDate: 1,
                    supplier   : 1,
                    currency   : 1
                }
            },
            {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'supplier',
                    foreignField: '_id',
                    as          : 'supplier'
                }
            },
            {
                $project: {
                    paymentInfo: 1,
                    currency   : 1,
                    supplier   : {$arrayElemAt: ['$supplier', 0]}
                }
            },
            {
                $project: {
                    sum     : {$divide: ['$paymentInfo.total', '$currency.rate']},
                    supplier: {$concat: ['$supplier.name.first', ' ', '$supplier.name.last']}
                }
            },
            {
                $group: {
                    _id: '$supplier',
                    sum: {$sum: '$sum'}
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.revenueBySales = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);
        var data = req.query;
        var filter = data.filter || {};
        var salesManagers = objectId(CONSTANTS.SALESMANAGER);
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

        filter._type = {
            backend: '_type',
            value  : [wTrackInvoiceCT]
        };

        Invoice.aggregate([
            {
                $match: filterMapper.mapFilter(filter, {contentType: wTrackInvoiceCT})
            },
            {
                $project: {
                    paymentInfo: 1,
                    invoiceDate: 1,
                    project    : 1,
                    currency   : 1
                }
            },
            {
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'project',
                    foreignField: 'projectId',
                    as          : 'salesPersons'
                }
            },
            {
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
            },
            {
                $unwind: {
                    path                      : '$salesPersons',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesPersons.employeeId',
                    foreignField: '_id',
                    as          : 'salesPerson'
                }
            },
            {
                $project: {
                    paymentInfo: 1,
                    currency   : 1,
                    salesPerson: {$arrayElemAt: ['$salesPerson', 0]}
                }
            },
            {
                $project: {
                    sum        : {$divide: ['$paymentInfo.total', '$currency.rate']},
                    salesPerson: {$concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']}
                }
            },
            {
                $group: {
                    _id: '$salesPerson',
                    sum: {$sum: '$sum'}
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.invoiceByWeek = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);
        var data = req.query;
        var filter = data.filter || {};

        filter._type = {
            backend: '_type',
            value  : ['Proforma', wTrackInvoiceCT]
        };

        Invoice.aggregate([{
            $match: filterMapper.mapFilter(filter, {contentType: wTrackInvoiceCT})
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

    this.generateName = function (req, res, next) {
        var project = req.query.projectId;
        var currentDbName = req.session ? req.session.lastDb : null;
        var db = currentDbName ? models.connection(currentDbName) : null;
        var date = moment().format('DD/MM/YYYY');

        db.collection('settings').findOneAndUpdate({
            dbName : currentDbName,
            name   : 'invoice',
            project: project
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            var resultName;

            if (err) {
                return next(err);
            }

            resultName = rate.value.seq + '-' + date;
            res.status(200).send(resultName);
        });
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

    this.getStats = function (req, res, next) {
        var sortObj = {'paymentInfo.balance': -1};
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
        var Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);
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
                forSales             : true,
                'paymentInfo.balance': {
                    $gt: 0
                },
                workflow             : {$ne: objectId(CONSTANTS.PROFORMA_CANCELLED)}
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
                rate           : '$currency.rate',
                diffStatus     : 1,
                workflow       : 1
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

    this.chartForProject = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var now = moment();

        var query = req.query;
        var startDate = query.startDate ? moment(new Date(query.startDate)) : moment(now).subtract(1, 'month');
        var endDate = query.endDate ? moment(new Date(query.endDate)) : now;

        startDate = startDate.toDate();
        endDate = endDate.toDate();

        console.log(startDate, endDate);

        Invoice
            .aggregate([{
                $match: {
                    dueDate: {$gte: startDate, $lte: endDate}
                }
            }])
            .exec(function (err, invoices) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(invoices);
            });
    };

    this.getStatsForProject = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, wTrackInvoiceCT, wTrackInvoiceSchema);
        var baseUrl = req.baseUrl;
        var query = req.query;
        var queryObject = {};
        var filter = query.filter;
        var optionsObject = {};

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

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

            Invoice.aggregate(
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

        contentSearcher = function (invoicesIds, waterfallCallback) {
            var condition = '$and';

            invoicesIds = _.pluck(invoicesIds, '_id');

            if (filter && typeof filter === 'object') {
                optionsObject[condition] = [];
                condition = filter.condition || 'and';
                condition = '$' + condition;
                optionsObject[condition].push(filterMapper.mapFilter(filter, {}));
            }

            optionsObject[condition].push({_id: {$in: invoicesIds}});
            optionsObject[condition].push({expense: {$exists: false}});

            if (baseUrl === '/proforma') {
                optionsObject.$and.push({_type: 'Proforma'});
            } else {
                optionsObject.$and.push({_type: {$ne: 'Proforma'}});
            }

            Invoice
                .aggregate([{
                    $lookup: {
                        from        : 'Project',
                        localField  : 'project',
                        foreignField: '_id',
                        as          : 'project'
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
                        project    : {$arrayElemAt: ['$project', 0]},
                        name       : 1,
                        paymentInfo: 1,
                        status     : {$arrayElemAt: ['$workflow', 0]},
                        ammount    : {$divide: ['$paymentInfo.total', 100]},
                        paid       : {$divide: [{$subtract: ['$paymentInfo.total', '$paymentInfo.balance']}, 100]},
                        balance    : {$divide: ['$paymentInfo.balance', 100]},
                        currency   : 1,
                        _type      : 1
                    }
                }, {
                    $match: optionsObject
                }, {
                    $project: {
                        project    : 1,
                        name       : 1,
                        paymentInfo: 1,
                        status     : '$status.name',
                        ammount    : 1,
                        currency   : 1,
                        paid       : 1,
                        balance    : 1
                    }
                }, {
                    $group: {
                        _id: null,

                        invoices: {
                            $push: {
                                _id     : '$_id',
                                name    : '$name',
                                status  : '$status',
                                currency: '$currency',

                                paymentInfo: {
                                    ammount: '$ammount',
                                    paid   : '$paid',
                                    balance: '$balance'
                                }
                            }
                        },

                        ammount: {$sum: {$divide: ['$ammount', '$currency.rate']}},
                        paid   : {$sum: {$divide: ['$paid', '$currency.rate']}},
                        balance: {$sum: {$divide: ['$balance', '$currency.rate']}}
                    }
                }])
                .exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: result[0]});
        });
    };

    this.getForProject = function (req, res, next) {
        var db = req.session.lastDb;
        var contentType = req.query.contentType;
        var projectId = req.params.id;
        var moduleId;
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

        if (contentType === 'salesProforma') {
            moduleId = 99;
        } else if (contentType === 'proforma') {
            moduleId = 95;
        } else if (contentType === 'ExpensesInvoice') {
            moduleId = 97;
        } else if (contentType === 'DividendInvoice') {
            moduleId = 100;
        } else {
            moduleId = 64;
        }

        if (projectId) {
            queryObject.project = projectId;
        }

        if (contentType === 'salesProforma' || contentType === 'proforma') {
            Invoice = models.get(db, 'Proforma', ProformaSchema);
        } else if (contentType === 'ExpensesInvoice') {
            Invoice = models.get(db, 'expensesInvoice', ExpensesInvoiceSchema);
        } else if (contentType === 'DividendInvoice') {
            Invoice = models.get(db, 'dividendInvoice', DividendInvoiceSchema);
        } else {
            Invoice = models.get(db, 'Invoice', InvoiceSchema);
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

            if (contentType === 'salesProforma' || contentType === 'proforma') {
                optionsObject.$and.push({_type: 'Proforma'});
            } else if (contentType === 'ExpensesInvoice') {
                optionsObject.$and.push({_type: 'expensesInvoice'});
            } else if (contentType === 'DividendInvoice') {
                optionsObject.$and.push({_type: 'dividendInvoice'});
            } else {
                optionsObject.$and.push({$and: [{_type: {$ne: 'Proforma'}}, {_type: {$ne: 'expensesInvoice'}}, {_type: {$ne: 'writeOff'}}]});
            }

            Invoice
                .aggregate([{
                    $match: queryObject
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
                    $project: {
                        workflow: {$arrayElemAt: ['$workflow', 0]},
                        supplier: {$arrayElemAt: ['$supplier', 0]},

                        salesManagers: {
                            $filter: {
                                input: '$projectMembers',
                                as   : 'projectMember',
                                cond : salesManagerMatch
                            }
                        },

                        expense    : 1,
                        forSales   : 1,
                        currency   : 1,
                        paymentInfo: 1,
                        invoiceDate: 1,
                        name       : 1,
                        paymentDate: 1,
                        dueDate    : 1,
                        payments   : 1,
                        approved   : 1,
                        _type      : 1,
                        removable  : 1,
                        paid       : {$divide: [{$subtract: ['$paymentInfo.total', '$paymentInfo.balance']}, 100]}
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
                        payments   : 1,
                        approved   : 1,
                        _type      : 1,
                        removable  : 1,
                        paid       : 1
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
                        payments   : 1,
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
                        payments   : 1,
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
                        payments   : '$root.payments',
                        approved   : '$root.approved',
                        _type      : '$root._type',
                        removable  : '$root.removable',
                        paid       : '$root.paid',
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
};

module.exports = Module;
