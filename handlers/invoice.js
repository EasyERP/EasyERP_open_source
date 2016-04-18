var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');
var oxr = require('open-exchange-rates');
var fx = require('money');
var moment = require('../public/js/libs/moment/moment');
var fs = require("fs");
// var fileUploader = require('../helpers/fileUploader');

var Invoice = function (models, event) {
    "use strict";

    var access = require("../Modules/additions/access.js")(models);
    var rewriteAccess = require('../helpers/rewriteAccess');
    var InvoiceSchema = mongoose.Schemas.Invoice;
    var wTrackInvoiceSchema = mongoose.Schemas.wTrackInvoice;
    var OrderSchema = mongoose.Schemas.Quotation;
    var ProformaSchema = mongoose.Schemas.Proforma;
    var DepartmentSchema = mongoose.Schemas.Department;
    var CustomerSchema = mongoose.Schemas.Customer;
    var PaymentSchema = mongoose.Schemas.Payment;
    var wTrackSchema = mongoose.Schemas.wTrack;
    var JobsSchema = mongoose.Schemas.jobs;
    var WorkflowSchema = mongoose.Schemas.workflow;
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var workflowHandler = new WorkflowHandler(models);
    var moment = require('../public/js/libs/moment/moment');
    var _ = require('../node_modules/underscore');
    var CONSTANTS = require('../constants/mainConstants.js');

    var JournalEntryHandler = require('./journalEntry');
    var _journalEntryHandler = new JournalEntryHandler(models);

    oxr.set({app_id: process.env.OXR_APP_ID});

    function journalEntryComposer(invoice, dbIndex, waterfallCb, uId) {
        var journalEntryBody = {};
        var beforeInvoiceBody = {};
        var cb = waterfallCb;

        journalEntryBody.date = invoice.invoiceDate;
        journalEntryBody.journal = invoice.journal;
        journalEntryBody.currency = invoice.currency || 'USD';
        journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.balance : 0;
        journalEntryBody.sourceDocument = {};
        journalEntryBody.sourceDocument._id = invoice._id;
        journalEntryBody.sourceDocument.model = 'Invoice';

        if (invoice.paymentInfo.total - invoice.paymentInfo.balance > 0) {
            cb = _.after(2, waterfallCb);

            beforeInvoiceBody.date = invoice.invoiceDate;
            beforeInvoiceBody.journal = invoice.journal;
            beforeInvoiceBody.currency = invoice.currency ? invoice.currency._id : 'USD';
            beforeInvoiceBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total - invoice.paymentInfo.balance : 0;
            beforeInvoiceBody.sourceDocument = {};
            beforeInvoiceBody.sourceDocument._id = invoice._id;
            beforeInvoiceBody.sourceDocument.model = 'proforma';

            _journalEntryHandler.create(journalEntryBody, dbIndex, cb, uId);
        }

        _journalEntryHandler.create(journalEntryBody, dbIndex, cb, uId);
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
                if (err) {
                    return waterfallCb(err);
                }

                result = result.toObject();
                result.currency = result.currency || {};
                result.currency.name = body.currency ? body.currency.name : 'USD';

                if (forSales) {
                    waterfallCb(null, dbIndex, result);
                } else { // added in case of bad creating no forSales invoice ( property model undefined for Journal )
                    waterfallCb(null, result);
                }
            });
        }

        if (forSales) {
            Invoice = models.get(dbIndex, 'wTrackInvoice', wTrackInvoiceSchema);
            waterfallTasks = [invoiceSaver, journalEntryComposer];
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

    this.receive = function (req, res, next) {
        var id = req.body.orderId;
        var forSales = req.body.forSales;
        var journal = req.body.journal;
        var dbIndex = req.session.lastDb;
        var JobsModel = models.get(dbIndex, 'jobs', JobsSchema);
        var Invoice = models.get(dbIndex, 'Invoice', InvoiceSchema);
        var wTrackInvoice = models.get(dbIndex, 'wTrackInvoice', wTrackInvoiceSchema);
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

        function getRates(callback) {
            oxr.historical(date, function () {
                fx.rates = oxr.rates;
                fx.base = oxr.base;
                callback();
            });
        }

        function fetchFirstWorkflow(callback) {
            if (forSales === "true") {
                request = {
                    query  : {
                        wId         : 'Sales Invoice',
                        source      : 'purchase',
                        targetSource: 'invoice'
                    },
                    session: req.session
                };
            } else {
                request = {
                    query  : {
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

            query//.populate('supplier', 'name')
                .populate('products.product')
                .populate('products.jobs')
                .populate('currency._id')
                .populate('project', '_id projectName projectmanager');

            query.exec(callback);
        }

        function findProformaPayments(callback) {
            Invoice.aggregate([
                {
                    $match: {
                        sourceDocument: objectId(id)
                    }
                },
                {
                    $project: {
                        payments   : 1,
                        paymentDate: 1,
                        dueDate    : 1,
                        _id        : 0
                    }
                },
                {
                    $unwind: '$payments'
                },
                {
                    $lookup: {
                        from        : 'Payment',
                        localField  : 'payments',
                        foreignField: '_id',
                        as          : 'payment'
                    }
                },
                {
                    $project: {
                        payment    : {$arrayElemAt: ['$payment', 0]},
                        paymentDate: 1,
                        dueDate    : 1
                    }
                },
                {
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
                query  : {
                    wId   : 'Proforma',
                    status: 'Done'
                },
                session: req.session
            };

            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                Invoice.update(
                    {
                        sourceDocument: objectId(id)
                    },
                    {
                        $set: {
                            workflow: workflow._id,
                            invoiced: true
                        }
                    },
                    {
                        multi: true
                    }, callback);
            });
        }

        function parallel(callback) {
            async.parallel(parallelTasks, callback);
        }

        function createInvoice(parallelResponse, callback) {
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

            } else {
                err = new Error(RESPONSES.BAD_REQUEST);
                err.status = 400;

                return callback(err);
            }

            invoiceCurrency = order.currency._id.name;
            order.currency._id = order.currency._id._id;

            delete order._id;

            if (forSales === 'true') {
                invoice = new wTrackInvoice(order);
            } else {
                invoice = new Invoice(order);
            }

            if (proforma) {
                proforma.paymentsInfo.forEach(function (payment) {
                    var paid = payment.paidAmount;
                    var paidInUSD = paid / payment.currency.rate;

                    paidAmount += fx(paidInUSD).from('USD').to(invoiceCurrency);
                });

                paidAmount = paidAmount / 100;

                payments = proforma.payments;
                invoice.paymentDate = proforma.paymentDate;
            }

            if (req.session.uId) {
                invoice.createdBy.user = req.session.uId;
                invoice.editedBy.user = req.session.uId;
            }

            invoice.currency.rate = oxr.rates[invoiceCurrency];

            // invoice.sourceDocument = order.name;
            invoice.payments = payments;
            invoice.sourceDocument = id;
            invoice.paymentReference = order.name;
            invoice.paymentInfo.balance = order.paymentInfo.total - paidAmount;

            if (payments && payments.length){
                invoice.removable = true;
            }

            if (paidAmount === order.paymentInfo.total) {
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
                invoice.salesPerson = order.project.projectmanager || null;

                invoice.save(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    callback(null, result);
                });

            } else {
                query = Company.findById(invoice.supplier).lean();

                query.populate('salesPurchases.salesPerson', 'name');

                query.exec(function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result && result.salesPurchases.salesPerson) {
                        invoice.salesPerson = result.salesPurchases.salesPerson._id;
                    }

                    invoice.save(function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        callback(null, result);
                    });
                });

            }

        }

        function createJournalEntry(invoice, callback) {
            journalEntryComposer(invoice, req.session.lastDb, callback, req.session.uId);
        }

        parallelTasks = [findOrder, fetchFirstWorkflow, findProformaPayments, changeProformaWorkflow, getRates];
        waterFallTasks = [parallel, createInvoice/*, createJournalEntry*/];

        async.waterfall(waterFallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            var project;
            var invoiceId = result._id;
            var products = result.products;

            Order.findByIdAndUpdate(id, {
                $set: {
                    workflow: CONSTANTS.ORDERDONE
                }
            }, {new: true}, function (err) {
                if (err) {
                    return next(err);
                }
            });

            if (products) {
                async.each(products, function (result, cb) {
                    var jobs = result.jobs;

                    JobsModel.findByIdAndUpdate(jobs, {
                        $set: {
                            invoice : invoiceId,
                            type    : "Invoiced",
                            workflow: CONSTANTS.JOBSFINISHED,
                            editedBy: editedBy
                        }
                    }, {new: true}, function (err, job) {
                        if (err) {
                            return cb(err);
                        }
                        project = job.project || null;
                        cb();
                    });

                }, function () {
                    if (project) {
                        event.emit('fetchJobsCollection', {project: project});
                    }

                    res.status(201).send(result);
                });
            } else {
                res.status(201).send(result);
            }

        });

    };

    function uploadFileArray(req, res, callback) {
        var files = [];
        if (req.files && req.files.attachfile && !req.files.attachfile.length) {
            req.files.attachfile = [req.files.attachfile];
        }
        var path;
        var os = require("os");
        var osType = (os.type().split('_')[0]);

        req.files.attachfile.forEach(function (item) {
            var localPath;
            switch (osType) {
                case "Windows":
                {
                    localPath = __dirname + "\\uploads\\" + req.headers.id;
                }
                    break;
                case "Linux":
                {
                    localPath = __dirname + "\/uploads\/" + req.headers.id;
                }
            }
            fs.readdir(localPath, function (err, files) {
                if (!err) {
                    var k = '';
                    var maxK = 0;
                    var checkIs = false;
                    var attachfileName = item.name.slice(0, item.name.lastIndexOf('.'));
                    files.forEach(function (fileName) {
                        if (fileName == item.name) {
                            k = 1;
                            checkIs = true;
                        } else {
                            if ((fileName.indexOf(attachfileName) === 0) &&
                                (fileName.lastIndexOf(attachfileName) === 0) &&
                                (fileName.lastIndexOf(').') !== -1) &&
                                (fileName.lastIndexOf('(') !== -1) &&
                                (fileName.lastIndexOf('(') < fileName.lastIndexOf(').')) &&
                                (attachfileName.length == fileName.lastIndexOf('('))) {
                                var intVal = fileName.slice(fileName.lastIndexOf('(') + 1, fileName.lastIndexOf(').'));
                                k = parseInt(intVal) + 1;
                            }
                        }
                        if (maxK < k) {
                            maxK = k;
                        }
                    });
                    if (!(maxK == 0) && checkIs) {
                        item.name = attachfileName + '(' + maxK + ')' + item.name.slice(item.name.lastIndexOf('.'));
                    }
                }
            });

            fs.readFile(item.path, function (err, data) {
                var shortPas;
                switch (osType) {
                    case "Windows":
                    {
                        path = __dirname + "\\uploads\\" + req.headers.id + "\\" + item.name;
                        shortPas = "\\uploads\\" + req.headers.id + "\\" + item.name;
                    }
                        break;
                    case "Linux":
                    {
                        path = __dirname + "\/uploads\/" + req.headers.id + "\/" + item.name;
                        shortPas = "\/uploads\/" + req.headers.id + "\/" + item.name;
                    }
                }
                fs.writeFile(path, data, function (err) {
                    if (!err) {
                        var file = {};
                        file._id = mongoose.Types.ObjectId();
                        file.name = item.name;
                        file.shortPas = encodeURIComponent(shortPas);
                        if (item.size >= 1024) {
                            file.size = (Math.round(item.size / 1024 / 1024 * 1000) / 1000) + '&nbsp;Mb';
                        }
                        else {
                            file.size = (Math.round(item.size / 1024 * 1000) / 1000) + '&nbsp;Kb';
                        }
                        file.uploadDate = new Date();
                        file.uploaderName = req.session.uName;
                        files.push(file);

                        if (files.length == req.files.attachfile.length) {
                            if (callback) {
                                callback(files);
                            }
                        }
                    } else {
                        console.log(err);
                        res.send(500);
                    }

                });
            });
        });

    }

    this.attach = function (req, res, next) {
        var os = require("os");
        var osType = (os.type().split('_')[0]);
        var dir;
        switch (osType) {
            case "Windows":
            {
                dir = __dirname + "\\uploads\\";
            }
                break;
            case "Linux":
            {
                dir = __dirname + "\/uploads\/";
            }
        }
        fs.readdir(dir, function (err, files) {
            if (err) {
                fs.mkdir(dir, function (errr) {
                    if (!errr) {
                        dir += req.headers.id;
                    }
                    fs.mkdir(dir, function (errr) {
                        if (!errr) {
                            uploadFileArray(req, res, function (files) {
                                uploadFile(req, res, req.headers.id, files);
                            });
                        }
                    });
                });
            } else {
                dir += req.headers.id;
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        fs.mkdir(dir, function (errr) {
                            if (!errr) {
                                uploadFileArray(req, res, function (files) {
                                    uploadFile(req, res, req.headers.id, files);
                                });
                            }
                        });
                    } else {
                        uploadFileArray(req, res, function (files) {
                            uploadFile(req, res, req.headers.id, files);
                        });
                    }
                });
            }
        });
    };

    function uploadFile(req, res, id, file) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 63, function (access) {
                if (access) {
                    models.get(req.session.lastDb, "Quotation", OrderSchema).findByIdAndUpdate(id, {$set: {attachments: file}}, {new: true}, function (err, response) {
                        if (err) {
                            res.send(401);
                        } else {
                            res.send(200, {success: 'Order updated success', data: response});
                        }
                    });
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    this.updateOnlySelected = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.params.id;
        var data = req.body;
        var isProforma;
        var journalId = data.journal;
        var moduleId = 64;
        var Invoice = models.get(db, 'wTrackInvoice', wTrackInvoiceSchema);
        var date;
        var updateName = false;
        var JobsModel = models.get(db, 'jobs', JobsSchema);
        var PaymentModel = models.get(db, 'Payment', PaymentSchema);
        var Customer = models.get(db, 'Customers', CustomerSchema);
        var query;
        var model;
        var journal;
        var dateForobs;

        date = moment(new Date(data.invoiceDate));
        date = date.format('YYYY-MM-DD');

        Invoice = models.get(db, 'wTrackInvoice', wTrackInvoiceSchema);

        delete data.journal;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {

                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };

                    oxr.historical(date, function () {
                        fx.rates = oxr.rates;
                        fx.base = oxr.base;

                        data.currency.rate = oxr.rates[data.currency.name];

                        Invoice.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, invoice) {
                            if (err) {
                                return next(err);
                            }

                            if (invoice._type === 'Proforma') {
                                model = "Proforma";

                                query = {"sourceDocument.model": model, journal: CONSTANTS.BEFORE_INVOICE};
                                _journalEntryHandler.changeDate(query, data.invoiceDate, req.session.lastDb, function () {});

                                journal = CONSTANTS.PROFORMA_JOURNAL;
                            } else {
                                model = "Invoice";
                                journal = CONSTANTS.INVOICE_JOURNAL;

                                dateForobs = moment(new Date(data.invoiceDate)).subtract(1, 'seconds');

                                query = {"sourceDocument.model": 'jobs', journal: {$in: [CONSTANTS.JOB_FINISHED, CONSTANTS.FINISHED_JOB_JOURNAL, CONSTANTS.CLOSED_JOB]}};
                                _journalEntryHandler.changeDate(query, dateForobs, req.session.lastDb, function () {});
                            }

                            query = {"sourceDocument.model": model, journal: journal};
                            _journalEntryHandler.changeDate(query, data.invoiceDate, req.session.lastDb, function () {});

                            if (!invoice.journal && journalId) { // todo in case of purchase invoice hasnt journalId
                                Invoice.findByIdAndUpdate(id, {$set: {journal: journalId}}, {new: true}, function (err, invoice) {
                                    if (err) {
                                        return next(err);
                                    }

                                    /*journalEntryComposer(invoice, db, function (err, response) {
                                     if (err) {
                                     return next(err);
                                     }
                                     }, req.session.uId);*/

                                    Customer.populate(invoice, {
                                        path  : 'supplier',
                                        select: '_id name fullName'
                                    }, function (err, resp) {
                                        if (err) {
                                            return next(err);
                                        }

                                        res.status(200).send(invoice);
                                    });
                                });
                            } else {
                                Customer.populate(invoice, {
                                    path  : 'supplier',
                                    select: '_id name fullName'
                                }, function (err, resp) {
                                    if (err) {
                                        return next(err);
                                    }

                                    res.status(200).send(invoice);
                                });
                            }
                        });
                    });

                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.approve = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.body.invoiceId;
        var moduleId = 64;

        var Invoice = models.get(db, 'wTrackInvoice', wTrackInvoiceSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getApproveAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {

                    Invoice.findByIdAndUpdate(id, {$set: {approved: true}}, {new: true}, function (err, resp) {
                        if (err) {
                            return next(err);
                        }

                        journalEntryComposer(resp, req.session.lastDb, function () {}, req.session.uId);

                        res.status(200).send(resp);
                    });

                } else {
                    res.status(401).send();
                }
            });
        }
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

    function ConvertType(element, type) {
        if (type === 'boolean') {
            if (element === 'true') {
                element = true;
            } else if (element === 'false') {
                element = false;
            }
        }

        return element;
    }

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;

        for (var filterName in filter) {
            condition = filter[filterName]['value'];
            key = filter[filterName]['key'];

            switch (filterName) {
                case 'project':
                    if (condition) {
                        filtrElement[key] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                    }
                    break;
                case 'salesPerson':
                    if (condition) {
                        filtrElement[key] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                    }
                    break;
                case 'supplier':
                    if (condition) {
                        filtrElement[key] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                    }
                    break;
                case 'workflow':
                    if (condition) {
                        filtrElement[key] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                    }
                    break;
                case 'forSales':
                    if (condition) {
                        condition = ConvertType(condition[0], 'boolean');
                        filtrElement[key] = condition;
                        resArray.push(filtrElement);
                    }
                    break;
            }
        }

        return resArray;
    }

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 64;

        if (req.session && req.session.loggedIn && db) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                var Invoice;

                var query = req.query;
                var queryObject = {};
                var filter = query.filter;
                var baseUrl = req.baseUrl;

                var optionsObject = {};
                var sort = {};
                var count;
                var page;
                var skip;

                var departmentSearcher;
                var contentIdsSearcher;
                var contentSearcher;
                var waterfallTasks;

                if (access) {
                    Invoice = models.get(db, 'Invoice', InvoiceSchema);

                    count = parseInt(query.count) || CONSTANTS.DEF_LIST_COUNT;
                    page = parseInt(query.page);

                    count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count;
                    skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    if (req.query.sort) {
                        var key = Object.keys(req.query.sort)[0];
                        req.query.sort[key] = parseInt(req.query.sort[key]);
                        sort = req.query.sort;
                    } else {
                        sort = {"workflow": -1};
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
                        var Model = models.get(req.session.lastDb, "Invoice", InvoiceSchema);

                        Model.aggregate(
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
                        optionsObject.$and = [];

                        if (filter && typeof filter === 'object') {
                            if (filter.condition === 'or') {
                                optionsObject['$or'] = caseFilter(filter);
                            } else {
                                optionsObject['$and'] = caseFilter(filter);
                            }
                        }

                        optionsObject.$and.push({_id: {$in: _.pluck(invoicesIds, "_id")}});
                        optionsObject.$and.push({expense: {$exists: false}});

                        if (baseUrl === '/Proforma') {
                            optionsObject.$and.push({_type: 'Proforma'});
                        } else {
                            optionsObject.$and.push({_type: {$ne: 'Proforma'}});
                        }

                        Invoice
                            .aggregate([{
                                $lookup: {
                                    from                   : "Employees",
                                    localField             : "salesPerson",
                                    foreignField: "_id", as: "salesPerson"
                                }
                            }, {
                                $lookup: {
                                    from                   : "Customers",
                                    localField             : "supplier",
                                    foreignField: "_id", as: "supplier"
                                }
                            }, {
                                $lookup: {
                                    from                   : "workflows",
                                    localField             : "workflow",
                                    foreignField: "_id", as: "workflow"
                                }
                            }, {
                                $lookup: {
                                    from                   : "Users",
                                    localField             : "createdBy.user",
                                    foreignField: "_id", as: "createdBy.user"
                                }
                            }, {
                                $lookup: {
                                    from                   : "Users",
                                    localField             : "editedBy.user",
                                    foreignField: "_id", as: "editedBy.user"
                                }
                            }, {
                                $lookup: {
                                    from                   : "Quotation",
                                    localField             : "sourceDocument",
                                    foreignField: "_id", as: "sourceDocument"
                                }
                            }, {
                                $lookup: {
                                    from                   : "Project",
                                    localField             : "project",
                                    foreignField: "_id", as: "project"
                                }
                            }, {
                                $project: {
                                    sourceDocument  : {$arrayElemAt: ["$sourceDocument", 0]},
                                    workflow        : {$arrayElemAt: ["$workflow", 0]},
                                    supplier        : {$arrayElemAt: ["$supplier", 0]},
                                    salesPerson     : {$arrayElemAt: ["$salesPerson", 0]},
                                    'editedBy.user' : {$arrayElemAt: ["$editedBy.user", 0]},
                                    'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                                    project         : {$arrayElemAt: ["$project", 0]},
                                    expense         : 1,
                                    forSales        : 1,
                                    currency        : 1,
                                    paymentInfo     : 1,
                                    invoiceDate     : 1,
                                    name            : 1,
                                    paymentDate     : 1,
                                    dueDate         : 1,
                                    payments        : 1,
                                    approved        : 1,
                                    _type           : 1,
                                    removable       : 1,
                                    paid            : {$divide: [{$subtract: ['$paymentInfo.total', '$paymentInfo.balance']}, 100]}
                                }
                            }, {
                                $match: optionsObject
                            }, {
                                $sort: sort
                            }, {
                                $skip: skip
                            }, {
                                $limit: count
                            }
                            ], function (err, result) {
                                waterfallCallback(null, result)
                            });
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });
                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    this.getInvoiceById = function (req, res, next) {
        var moduleId = 64;
        var data = req.query || {};
        var id = data.id;
        var forSales;

        forSales = data.forSales !== 'false';

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                var Invoice;
                var optionsObject = {};

                var departmentSearcher;
                var contentIdsSearcher;
                var contentSearcher;
                var waterfallTasks;

                if (access) {
                    if (forSales) {
                        Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
                    } else {
                        Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
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

                        models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        /*optionsObject,*/
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

                    contentSearcher = function (invoicesIds, waterfallCallback) {

                        optionsObject = {
                            _id     : id,
                            forSales: forSales
                        };

                        var query = Invoice.findOne(optionsObject);

                        query.populate('products.product')
                            .populate('products.jobs')
                            .populate('currency._id')
                            .populate('payments', '_id name date paymentRef paidAmount')
                            .populate('department', '_id departmentName')
                            .populate('paymentTerms', '_id name')
                            .populate('createdBy.user')
                            .populate('editedBy.user')
                            .populate('groups.users')
                            .populate('groups.group')
                            .populate('groups.owner', '_id login')
                            .populate('sourceDocument')
                            .populate('workflow', '_id name status')
                            .populate('supplier', '_id name fullName')
                            .populate('salesPerson', '_id name fullName');

                        query.lean().exec(waterfallCallback);
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function (err, result) {
                        if (err) {
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

    this.removeInvoice = function (req, res, id, next) {
        var db = req.session.lastDb;
        var moduleId = 64;
        var paymentIds = [];
        var jobs = [];
        var wTrackIds = [];
        var project;
        var orderId;
        var invoiceDeleted;
        var Payment = models.get(db, "Payment", PaymentSchema);
        var wTrack = models.get(db, "wTrack", wTrackSchema);
        var Order = models.get(db, 'Quotation', OrderSchema);
        var Proforma = models.get(db, 'Proforma', ProformaSchema);
        var JobsModel = models.get(db, 'jobs', JobsSchema);
        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        if (req.session && req.session.loggedIn && db) {
            access.getDeleteAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {

                    models.get(db, "Invoice", InvoiceSchema).findByIdAndRemove(id, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        invoiceDeleted = result.toJSON();

                        orderId = invoiceDeleted.sourceDocument;

                        Order.findByIdAndUpdate(objectId(orderId), {
                            $set: {
                                workflow: CONSTANTS.ORDERNEW
                            }
                        }, {new: true}, function (err, result) {
                            if (err) {
                                return next(err)
                            }
                        });

                        async.each(invoiceDeleted.products, function (product) {
                            jobs.push(product.jobs);
                        });
                        async.each(invoiceDeleted.payments, function (payment) {
                            paymentIds.push(payment);
                        });

                        function proformaUpdate(parallelCb) {
                            var request = {
                                query  : {
                                    wId   : 'Proforma',
                                    status: 'New'
                                },
                                session: req.session
                            };

                            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                                Proforma.update(
                                    {
                                        sourceDocument: orderId,
                                        _type         : 'Proforma'
                                    },
                                    {
                                        $set: {
                                            workflow: workflow._id,
                                            invoiced: false
                                        }
                                    },
                                    {
                                        multi: true
                                    },
                                    parallelCb);
                            });
                        };

                        function paymentsRemove(parallelCb) {
                            async.each(paymentIds, function (pid, cb) {
                                Payment.remove({invoice: id}, cb);
                            }, function () {
                                parallelCb();
                            });
                        }

                        function journalEntryRemove(parallelCb) {
                            _journalEntryHandler.removeByDocId(id, db, parallelCb);
                        }

                        function jobsUpdateAndWTracks(parallelCb) {
                            var setData = {};
                            var array;

                            async.each(jobs, function (id, cb) {
                                setData.editedBy = {
                                    user: req.session.uId,
                                    date: new Date().toISOString()
                                };

                                JobsModel.findByIdAndUpdate(id, {
                                    type    : "Ordered",
                                    invoice : null,
                                    workflow: CONSTANTS.JOBSINPROGRESS,
                                    editedBy: editedBy
                                }, {new: true}, function (err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }

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
                                    event.emit('fetchJobsCollection', {project: project});
                                }
                                parallelCb();
                            });
                        }

                        async.parallel([proformaUpdate, paymentsRemove, journalEntryRemove, jobsUpdateAndWTracks], function (err, result) {
                            if (err) {
                               return next(err);
                            }
                        });

                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }

    };

    this.updateInvoice = function (req, res, _id, data, next) {
        var db = req.session.lastDb;
        var moduleId = 64;
        var Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);

        if (req.session && req.session.loggedIn && db) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {

                    Invoice.findByIdAndUpdate(_id, data.invoice, {new: true}, function (err, result) {

                        if (err) {
                            next(err);
                        } else {
                            res.status(200).send(result);
                        }
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }

    };

    this.totalCollectionLength = function (req, res, next) {

        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var query = req.query;
        var filter = query.filter;
        var filterObj;
        // var filterObj = filter ? filterMapper.mapFilter(filter) : null;

        if (filter) {
            filterObj = {};
            filterObj['$and'] = caseFilter(filter);
        }

        var waterfallTasks;

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
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
                    //  optionsObject,
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
            var queryObject = {};

            queryObject['$and'] = [];

            if (filterObj) {
                queryObject['$and'].push(filterObj);
            }

            queryObject['$and'].push({_id: {$in: _.pluck(invoicesIds, '_id')}});

            Invoice.aggregate([{
                $lookup: {
                    from        : "Employees",
                    localField  : "salesPerson",
                    foreignField: "_id", as: "salesPerson"
                }
            }, {
                $lookup: {
                    from        : "Customers",
                    localField  : "supplier",
                    foreignField: "_id", as: "supplier"
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $lookup: {
                    from        : "Users",
                    localField  : "createdBy.user",
                    foreignField: "_id", as: "createdBy.user"
                }
            }, {
                $lookup: {
                    from        : "Users",
                    localField  : "editedBy.user",
                    foreignField: "_id", as: "editedBy.user"
                }
            }, {
                $lookup: {
                    from        : "Quotation",
                    localField  : "sourceDocument",
                    foreignField: "_id", as: "sourceDocument"
                }
            }, {
                $lookup: {
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id", as: "project"
                }
            }, {
                $project: {
                    sourceDocument  : {$arrayElemAt: ["$sourceDocument", 0]},
                    workflow        : {$arrayElemAt: ["$workflow", 0]},
                    supplier        : {$arrayElemAt: ["$supplier", 0]},
                    salesPerson     : {$arrayElemAt: ["$salesPerson", 0]},
                    'editedBy.user' : {$arrayElemAt: ["$editedBy.user", 0]},
                    'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                    project         : {$arrayElemAt: ["$project", 0]},
                    expense         : 1,
                    forSales        : 1,
                    paymentInfo     : 1,
                    invoiceDate     : 1,
                    name            : 1,
                    paymentDate     : 1,
                    dueDate         : 1,
                    payments        : 1
                }
            }, {
                $project: {
                    sourceDocument  : 1,
                    workflow        : 1,
                    supplier        : 1,
                    salesPerson     : 1,
                    'editedBy.user' : 1,
                    'createdBy.user': 1,
                    project         : 1,
                    expense         : 1,
                    forSales        : 1,
                    paymentInfo     : 1,
                    invoiceDate     : 1,
                    name            : 1,
                    paymentDate     : 1,
                    dueDate         : 1,
                    payments        : 1
                }
            }, {
                $match: queryObject
            }], function (err, result) {
                if (err) {
                    return next(err);
                }

                waterfallCallback(null, result.length);
            });

            /* var query;
             var queryObject = ({_id: {$in: invoicesIds}});

             query = Invoice.find(queryObject);
             query.exec(waterfallCallback);*/
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            } else {

                res.status(200).send({count: result});
            }
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
            },
            {
                $inc: {seq: 1}
            },
            {
                returnOriginal: false,
                upsert        : true
            },
            function (err, rate) {
                var resultName;

                if (err) {
                    return next(err);
                }

                resultName = rate.value.seq + '-' + date;
                res.status(200).send(resultName);
            });
    };

    this.getFilterValues = function (req, res, next) {
        var EmployeeSchema = mongoose.Schemas['Employee'];
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

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
                }
            });
            res.status(200).send(result)
        });
    };

    this.getStats = function (req, res, next) {
        var sortObj = {'paymentInfo.balance': -1};
        var now = new Date();
        var sortValueInt;
        var key;
        var Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);

        sortObj = req.query.sort || sortObj;

        for (key in sortObj) {
            sortValueInt = parseInt(sortObj[key]);
            sortObj[key] = sortValueInt;
            break;
        }

        Invoice.aggregate([{
            $match: {
                forSales             : true,
                'paymentInfo.balance': {
                    $gt: 0
                }
            }
        }, {
            $lookup: {
                from        : "Project",
                localField  : "project",
                foreignField: "_id", as: "project"
            }
        }, {
            $lookup: {
                from        : "Customers",
                localField  : "supplier",
                foreignField: "_id", as: "supplier"
            }
        }, {
            $lookup: {
                from        : "Employees",
                localField  : "salesPerson",
                foreignField: "_id", as: "salesPerson"
            }
        }, {
            $project: {
                project    : {$arrayElemAt: ["$project", 0]},
                supplier   : {$arrayElemAt: ["$supplier", 0]},
                salesPerson: {$arrayElemAt: ["$salesPerson", 0]},
                dueDate    : 1,
                name       : 1,
                paymentInfo: 1
            }
        }, {
            $project: {
                dueDate              : 1,
                'project.projectName': 1,
                'supplier.name'      : {
                    $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                },
                name                 : 1,
                paymentInfo          : 1,
                'salesPerson.name'   : {
                    $concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']
                },
                diffStatus           : {
                    $cond: {
                        if  : {
                            $lt: [{$subtract: [now, '$dueDate']}, 0]
                        },
                        then: -1,
                        else: {
                            $cond: {
                                if  : {
                                    $lt: [{$subtract: [now, '$dueDate']}, 1296000000]
                                },
                                then: 0,
                                else: {
                                    $cond: {
                                        if  : {
                                            $lt: [{$subtract: [now, '$dueDate']}, 2592000000]
                                        },
                                        then: 1,
                                        else: {
                                            $cond: {
                                                if  : {
                                                    $lt: [{$subtract: [now, '$dueDate']}, 5184000000]
                                                },
                                                then: 2,
                                                else: {
                                                    $cond: {
                                                        if  : {
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
        var startDate = query.startDate ? moment(query.startDate) : moment(now).subtract(1, 'month');
        var endDate = query.endDate ? moment(query.endDate) : now;

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
        var db = req.session.lastDb;
        var moduleId = 64;
        var Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
        var baseUrl = req.baseUrl;

        if (req.session && req.session.loggedIn && db) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                var query = req.query;
                var queryObject = {};
                var filter = query.filter;

                var optionsObject = {};

                var departmentSearcher;
                var contentIdsSearcher;
                var contentSearcher;
                var waterfallTasks;

                if (access) {

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
                            condition = filter.condition || 'and';
                            condition = '$' + condition;
                            optionsObject[condition] = caseFilter(filter);
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
                                    from                   : "Project",
                                    localField             : "project",
                                    foreignField: "_id", as: "project"
                                }
                            }, {
                                $lookup: {
                                    from                   : "workflows",
                                    localField             : "workflow",
                                    foreignField: "_id", as: "workflow"
                                }
                            }, {
                                $project: {
                                    project    : {$arrayElemAt: ["$project", 0]},
                                    name       : 1,
                                    paymentInfo: 1,
                                    status     : {$arrayElemAt: ["$workflow", 0]},
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
                                    _id     : null,
                                    invoices: {
                                        $push: {
                                            _id        : '$_id',
                                            name       : '$name',
                                            status     : '$status',
                                            currency   : '$currency',
                                            paymentInfo: {
                                                ammount: '$ammount',
                                                paid   : '$paid',
                                                balance: '$balance'
                                            }
                                        }
                                    },
                                    ammount : {$sum: {$divide: ['$ammount', '$currency.rate']}},
                                    paid    : {$sum: {$divide: ['$paid', '$currency.rate']}},
                                    balance : {$sum: {$divide: ['$balance', '$currency.rate']}}
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
                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    }

};

module.exports = Invoice;