var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');

var Invoice = function (models, event) {
    "use strict";

    var access = require("../Modules/additions/access.js")(models);
    var rewriteAccess = require('../helpers/rewriteAccess');
    var InvoiceSchema = mongoose.Schemas['Invoice'];
    var wTrackInvoiceSchema = mongoose.Schemas['wTrackInvoice'];
    var OrderSchema = mongoose.Schemas['Quotation'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var CustomerSchema = mongoose.Schemas['Customer'];
    var PaymentSchema = mongoose.Schemas['Payment'];
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var JobsSchema = mongoose.Schemas['jobs'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var workflowHandler = new WorkflowHandler(models);
    var moment = require('../public/js/libs/moment/moment');
    var _ = require('../node_modules/underscore');
    var CONSTANTS = require('../constants/mainConstants.js');

    var journalEntryHandler = require('./journalEntry');
    var _journalEntryHandler = new journalEntryHandler(models);

    function checkDb(db) {
        var validDbs = ["weTrack", "production", "development"];

        return validDbs.indexOf(db) !== -1;
    };

    function journalEntryComposer(invoice, dbIndex, waterfallCb, uId) {
        var journalEntryBody = {};

        journalEntryBody.date = invoice.invoiceDate;
        journalEntryBody.journal = invoice.journal;
        journalEntryBody.currency = invoice.currency ? invoice.currency.name : 'USD';
        journalEntryBody.amount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
        journalEntryBody.sourceDocument = {};
        journalEntryBody.sourceDocument._id = invoice._id;
        journalEntryBody.sourceDocument.model = 'Invoice';

        _journalEntryHandler.create(journalEntryBody, dbIndex, waterfallCb, uId)
    }

    this.create = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var isWtrack = checkDb(dbIndex);
        var body = req.body;
        var waterfallTasks
        var forSales = body.forSales;

        if (forSales) {
            waterfallTasks = [invoiceSaver, journalEntryComposer];
        } else {
            waterfallTasks = [invoiceSaver];
        }

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
                if (forSales) {
                    waterfallCb(null, dbIndex, result);
                } else {
                    waterfallCb(null, result);
                }

            });
        }

        if (isWtrack && forSales) {
            Invoice = models.get(dbIndex, 'wTrackInvoice', wTrackInvoiceSchema);
        } else {
            Invoice = models.get(dbIndex, 'Invoice', InvoiceSchema);
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
        var dbIndex = req.session.lastDb;
        var JobsModel = models.get(dbIndex, 'jobs', JobsSchema);
        var Invoice = models.get(dbIndex, 'Invoice', InvoiceSchema);
        var wTrackInvoice = models.get(dbIndex, 'wTrackInvoice', wTrackInvoiceSchema);
        var Order = models.get(dbIndex, 'Quotation', OrderSchema);
        var Company = models.get(dbIndex, 'Customer', CustomerSchema);
        var request;
        var parallelTasks;
        var waterFallTasks;

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
                .populate('project', '_id projectName projectmanager');

            query.exec(callback)
        };

        function parallel(callback) {
            async.parallel(parallelTasks, callback);
        };

        function createInvoice(parallelResponse, callback) {
            var order;
            var workflow;
            var err;
            var invoice;
            var supplier;
            var query;

            if (parallelResponse && parallelResponse.length) {
                order = parallelResponse[0];
                workflow = parallelResponse[1];
            } else {
                err = new Error(RESPONSES.BAD_REQUEST);
                err.status = 400;

                return callback(err);
            }

            delete order._id;

            if (forSales === "true") {
                invoice = new wTrackInvoice(order);
            } else {
                invoice = new Invoice(order);
            }

            if (req.session.uId) {
                invoice.createdBy.user = req.session.uId;
                invoice.editedBy.user = req.session.uId;
            }

            // invoice.sourceDocument = order.name;
            invoice.sourceDocument = id;
            invoice.paymentReference = order.name;
            invoice.workflow = workflow._id;
            invoice.paymentInfo.balance = order.paymentInfo.total;

            if (forSales === "true") {
                if (!invoice.project) {
                    invoice.project = order.project ? order.project._id : null;
                }
            }

            invoice.supplier = order['supplier'];

            if (forSales === "true") {
                invoice.salesPerson = order.project.projectmanager ? order.project.projectmanager : null;

                invoice.save(callback);

            } else {
                query = Company.findById(invoice.supplier).lean();

                query.populate('salesPurchases.salesPerson', 'name');

                query.exec(function (err, result) {
                    if (err) {
                        callback(err)
                    }

                    if (result && result.salesPurchases.salesPerson) {
                        invoice.salesPerson = result.salesPurchases.salesPerson._id;
                    }

                    invoice.save(callback);
                })

            }

        };

        parallelTasks = [findOrder, fetchFirstWorkflow];
        waterFallTasks = [parallel, createInvoice];

        async.waterfall(waterFallTasks, function (err, result) {
            if (err) {
                return next(err)
            }
            var project;
            var invoiceId = result._id;
            var name = result.name;
            var products = result.products;

            Order.findByIdAndUpdate(id, {
                $set: {
                    workflow: CONSTANTS.ORDERDONE
                }
            }, {new: true}, function (err, result) {
                if (err) {
                    return next(err)
                }
            });

            async.each(products, function (result, cb) {
                var jobs = result.jobs;

                JobsModel.findByIdAndUpdate(jobs, {
                    $set: {
                        invoice : invoiceId,
                        type    : "Invoiced",
                        workflow: CONSTANTS.JOBSFINISHED
                    }
                }, {new: true}, function (err, job) {
                    if (err) {
                        return cb(err);
                    }
                    project = job.project ? job.project : null;
                    cb();
                });

            }, function () {
                if (project) {
                    event.emit('fetchJobsCollection', {project: project});
                }

                res.status(201).send(result);
            });
        });

    };

    this.updateOnlySelected = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.params.id;
        var data = req.body;
        var journalId = data.journal;
        var moduleId;
        var isWtrack;
        var Invoice;
        var updateName = false;
        var JobsModel = models.get(db, 'jobs', JobsSchema);
        var PaymentModel = models.get(db, 'Payment', PaymentSchema);
        var optionsForPayments;
        var Customer = models.get(db, 'Customers', CustomerSchema);

        if (checkDb(db)) {
            moduleId = 64;
            isWtrack = true;
        }

        if (isWtrack) {
            Invoice = models.get(db, 'wTrackInvoice', wTrackInvoiceSchema);
        } else {
            Invoice = models.get(db, 'Invoice', InvoiceSchema);
        }

        delete data.journal;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {

                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };

                    Invoice.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, invoice) {
                        if (err) {
                            return next(err);
                        }

                        if (!invoice.journal) {
                            Invoice.findByIdAndUpdate(id, {$set: {journal: journalId}}, {new: true}, function (err, invoice) {
                                if (err) {
                                    return next(err);
                                }

                                journalEntryComposer(invoice, db, function (err, response) {
                                    if (err) {
                                        return next(err);
                                    }

                                    Customer.populate(invoice, {
                                        path  : 'supplier',
                                        select: '_id name fullName'
                                    }, function (err, resp) {
                                        if (err) {
                                            return next(err);
                                        }

                                        res.status(200).send(invoice);
                                    });

                                }, req.session.uId);
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
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
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
    };

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
    };

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 56;

        if (checkDb(db)) {
            moduleId = 64;
        }

        if (req.session && req.session.loggedIn && db) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Invoice = models.get(db, 'Invoice', InvoiceSchema);

                    var query = req.query;
                    var queryObject = {};
                    var filter = query.filter;

                    var optionsObject = {};
                    var sort = {};
                    var count = parseInt(query.count) ? parseInt(query.count) : 100;
                    var page = parseInt(query.page);
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

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

                        Invoice
                            .aggregate([{
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
        var isWtrack = checkDb(req.session.lastDb);
        var moduleId = 56;
        var data = req.query || {};
        var id = data.id;
        var forSales;

        if (isWtrack) {
            moduleId = 64
        }

        forSales = data.forSales !== 'false';

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Invoice;
                    var optionsObject = {};

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (isWtrack) {
                        if (forSales) {
                            Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
                        } else {
                            Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
                        }
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
        var moduleId = 56;
        var paymentIds = [];
        var jobs = [];
        var wTrackIds = [];
        var project;
        var orderId;
        var invoiceDeleted;
        var Payment = models.get(db, "Payment", PaymentSchema);
        var wTrack = models.get(db, "wTrack", wTrackSchema);
        var Order = models.get(db, 'Quotation', OrderSchema);
        var JobsModel = models.get(db, 'jobs', JobsSchema);

        if (checkDb(db)) {
            moduleId = 64
        }

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

                        function paymentsRemove(parallelCb) {
                            async.each(paymentIds, function (id) {
                                Payment.findByIdAndRemove(id, parallelCb);
                            });
                        };

                        function journalEntryRemove(parallelCb) {
                            _journalEntryHandler.removeByDocId(id, db, parallelCb);
                        };

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
                                    workflow: CONSTANTS.JOBSINPROGRESS
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
                        };

                        async.parallel([paymentsRemove, journalEntryRemove, jobsUpdateAndWTracks], function (err, result) {
                            if (err) {
                                next(err)
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
        var moduleId = 56;
        var isWtrack;
        var Invoice;

        if (checkDb(db)) {
            moduleId = 64;
            isWtrack = true;
        }

        if (isWtrack) {
            Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
        } else {
            Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        }

        if (req.session && req.session.loggedIn && db) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {

                    Invoice.findByIdAndUpdate(_id, data.invoice, {new: true}, function (err, result) {

                        if (err) {
                            next(err);
                        } else {
                            res.status(200).send(result);
                        }
                    })

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
        var waterfallTasks;
        var query = req.query;
        var filter = query.filter;
        var filterObj = {};

        // var filterObj = filter ? filterMapper.mapFilter(filter) : null;
        if (filter) {
            filterObj['$and'] = caseFilter(filter);
        }



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
                            cb(err)

                        } else {
                            cb(null, invoice)
                        }

                    })
            }
        ], function (err, result) {
            if (err) {
                return next(err)
            }

            _.map(result[0], function (value, key) {
                switch (key) {
                    case 'salesPerson':
                        result[0][key] = _.sortBy(value, 'name');
                        break;
                        ;

                }
            });
            res.status(200).send(result)
        })
    };

    this.getStats = function (req, res, next) {
        var db = req.session.lastDb;
        var Invoice;
        var now = new Date();
        var moduleId;

        var isWtrack;

        if (checkDb(db)) {
            moduleId = 64;
            isWtrack = true;
        }

        if (isWtrack) {
            Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
        } else {
            Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
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
            $sort: {
                'paymentInfo.balance': -1
            }
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
        var moduleId = 56;
        var isWtrack;
        var Invoice;

        if (checkDb(db)) {
            moduleId = 64;
            isWtrack = true;
        }

        if (isWtrack) {
            Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
        } else {
            Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        }

        if (req.session && req.session.loggedIn && db) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var query = req.query;
                    var queryObject = {};
                    var filter = query.filter;

                    var optionsObject = {};

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

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

                        Invoice
                            .aggregate([{
                                $lookup: {
                                    from        : "Project",
                                    localField  : "project",
                                    foreignField: "_id", as: "project"
                                }
                            }, {
                                $lookup: {
                                    from        : "workflows",
                                    localField  : "workflow",
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
                                    balance    : {$divide: ['$paymentInfo.balance', 100]}
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
                                            paymentInfo: {
                                                ammount: '$ammount',
                                                paid   : '$paid',
                                                balance: '$balance'
                                            }
                                        }
                                    },
                                    ammount : {$sum: '$ammount'},
                                    paid    : {$sum: '$paid'},
                                    balance : {$sum: '$balance'}
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