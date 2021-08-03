var mongoose = require('mongoose');

var Module = function (models, event) {
    'use strict';

    var QuotationSchema = mongoose.Schemas.Quotation;
    var CustomerSchema = mongoose.Schemas.Customer;
    var WorkflowSchema = mongoose.Schemas.workflow;
    var EmployeesSchema = mongoose.Schemas.Employees;
    var ProjectSchema = mongoose.Schemas.Project;
    var ProductSchema = mongoose.Schemas.Products;
    var DepartmentSchema = mongoose.Schemas.Department;
    var JobsSchema = mongoose.Schemas.jobs;
    var wTrackSchema = mongoose.Schemas.wTrack;
    var objectId = mongoose.Types.ObjectId;

    var rewriteAccess = require('../helpers/rewriteAccess');
    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();
    var RESPONSES = require('../constants/responses');
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var _ = require('../node_modules/underscore');
    var HistoryService = require('../services/history.js')(models);
    var currencyHalper = require('../helpers/currency');
    var path = require('path');
    var CONSTANTS = require('../constants/mainConstants.js');
    var pageHelper = require('../helpers/pageHelper');
    var moment = require('../public/js/libs/moment/moment');

    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();

    function updateOnlySelectedFields(req, res, next, id, data) {
        var dbName = req.session.lastDb;
        var Quotation = models.get(dbName, 'Quotation', QuotationSchema);
        var JobsModel = models.get(dbName, 'jobs', JobsSchema);
        var ProductModel = models.get(dbName, 'Product', ProductSchema);

        var wTrackModel = models.get(dbName, 'wTrack', wTrackSchema);
        var products;
        var project;
        var oldProducts = [];
        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };
        var obj;

        var indexOfBinary = function (arr, jobs) {
            var minIndex = 0;
            var maxIndex = arr.length - 1;
            var currentIndex;
            var currentElement;

            while (minIndex <= maxIndex) {
                currentIndex = (minIndex + maxIndex) / 2 | 0;
                currentElement = arr[currentIndex].jobs.id;
                if (currentElement > jobs) {
                    minIndex = currentIndex + 1;
                } else if (currentElement < jobs) {
                    maxIndex = currentIndex - 1;
                } else {
                    return currentIndex;
                }
            }

            return -1;
        };

        delete data.attachments;

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

        Quotation.findById(id, function (err, oldQuotation) {
            if (err) {
                return next(err);
            }

            oldProducts = oldQuotation.toJSON().products;

            Quotation.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, quotation) {
                var historyOptions;
                if (err) {
                    return next(err);
                }

                historyOptions = {
                    contentType: 'quotation',
                    data       : data,
                    dbName     : dbName,
                    contentId  : quotation._id
                };

                if (quotation.forSales) {
                    products = data.products || quotation.toJSON().products;

                    async.each(products, function (product, cb) {
                        var jobs = product.jobs;
                        var productId = product.product;
                        var _type = quotation.toJSON().isOrder ? 'Ordered' : 'Quoted';

                        var index = indexOfBinary(oldProducts, jobs.id);

                        if (index !== -1) {
                            oldProducts.splice(index, 1);
                        }

                        ProductModel.findByIdAndUpdate(productId, {
                            'info.description': product.description
                        }, function (err) {
                            var saveObject;

                            if (err) {
                                return next(err);
                            }

                            saveObject = {
                                quotation: id,
                                type     : _type,
                                editedBy : editedBy
                            };
                            if (product.jobDescription) {
                                saveObject.description = product.jobDescription;
                            }

                            JobsModel.findByIdAndUpdate(jobs, {
                                $set: saveObject
                            }, {new: true}, function (err, result) {
                                if (err) {
                                    return cb(err);
                                }
                                project = result.project || null;
                                cb();
                            });
                        });

                    }, function () {
                        var type;

                        if (project) {
                            event.emit('fetchJobsCollection', {project: project, dbName: dbName});
                        }
                        HistoryService.addEntry(historyOptions, function () {
                            if (err) {
                                return next(err);
                            }
                            quotation.populate('supplier', '_id name fullName')
                                .populate('destination')
                                .populate('currency._id')
                                .populate('incoterm')
                                .populate('invoiceControl')
                                .populate('paymentTerm')
                                .populate('products.product', '_id name info')
                                .populate('products.jobs', '_id name description')
                                .populate('groups.users')
                                .populate('groups.group')
                                .populate('groups.owner', '_id login')
                                .populate('editedBy.user', '_id login')
                                .populate('deliverTo', '_id, name')
                                .populate('project', '_id name')
                                .populate('workflow', function (err, quotation) {
                                    getHistory(req, quotation.toJSON(), function (err, quotation) {
                                        if (err) {
                                            return next(err);
                                        }

                                        res.status(200).send(quotation);
                                        if (oldProducts.length > 0) {
                                            async.each(oldProducts, function (oldProduct, cb) {

                                                type = 'Not Ordered';

                                                JobsModel.findByIdAndUpdate(oldProduct.jobs, {
                                                    type     : type,
                                                    quotation: null,
                                                    editedBy : editedBy
                                                }, {new: true}, function (err, result) {
                                                    var wTracks;

                                                    if (err) {
                                                        return next(err);
                                                    }

                                                    project = result ? result.get('project') : null;
                                                    wTracks = result ? result.wTracks : [];

                                                    async.each(wTracks, function (wTr, callback) {
                                                        wTrackModel.findByIdAndUpdate(wTr, {$set: {revenue: 0}}, callback);
                                                    }, function () {
                                                        cb();
                                                    });
                                                });

                                            });
                                        }
                                    });

                                });

                        });

                    });
                } else {
                    HistoryService.addEntry(historyOptions, function () {

                        if (err) {
                            return next(err);
                        }
                        quotation.populate('supplier', '_id name fullName')
                            .populate('destination')
                            .populate('currency._id')
                            .populate('incoterm')
                            .populate('invoiceControl')
                            .populate('paymentTerm')
                            .populate('products.product', '_id name info')
                            .populate('products.jobs', '_id name description')
                            .populate('groups.users')
                            .populate('groups.group')
                            .populate('groups.owner', '_id login')
                            .populate('editedBy.user', '_id login')
                            .populate('deliverTo', '_id, name')
                            .populate('project', '_id name')
                            .populate('workflow', function (err, quotation) {
                                getHistory(req, quotation.toJSON(), function (err, quotation) {
                                    if (err) {
                                        return next(err);
                                    }

                                    res.status(200).send(quotation);
                                });

                            });
                    });

                }
            });
        });
    }

    function getHistory(req, quotation, cb) {
        var dbName = req.session.lastDb;
        var Quotation = models.get(dbName, 'Quotation', QuotationSchema);

        var historyOptions = {
            dbName : dbName,
            id     : quotation._id,
            forNote: true
        };

        HistoryService.getHistoryForTrackedObject(historyOptions, function (err, history) {
            var notes;

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
            quotation.notes = quotation.notes.concat(notes);
            quotation.notes = _.sortBy(quotation.notes, 'date');
            cb(null, quotation);

        });

    }

    this.getForProject = function (req, res, next) {
        var db = req.session.lastDb;
        var contentType = req.query.contentType;
        var projectId = req.params.id;
        var Quotation = models.get(db, 'Quotation', QuotationSchema);
        var Order = models.get(db, 'Order', QuotationSchema);
        var moduleId;
        var query = req.query;
        var queryObject = {};
        var optionsObject = {};
        var sort = {};
        var paginationObject = pageHelper(query);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var key;

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        projectId = projectId ? objectId(projectId) : null;

        if (contentType === 'salesQuotations') {
            moduleId = 62;
        } else if (contentType === 'salesOrders') {
            moduleId = 63;
        }

        if (projectId) {
            queryObject.project = projectId;
        }

        if (contentType === 'salesQuotations') {
            Quotation = models.get(db, 'Quotation', QuotationSchema);
        } else if (contentType === 'salesOrders') {
            Quotation = Order;
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
                    queryObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };

            Quotation.aggregate([{
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

            optionsObject.$and.push({_id: {$in: _.pluck(ids, '_id')}});

            if (contentType === 'salesQuotations') {
                optionsObject.$and.push({isOrder: false});
            } else if (contentType === 'salesOrders') {
                optionsObject.$and.push({isOrder: true});
            }

            Quotation
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

                        currency       : 1,
                        paymentInfo    : 1,
                        orderDate      : 1,
                        name           : 1,
                        isOrder        : 1,
                        proformaCounter: 1
                    }
                }, {
                    $project: {
                        salesManagers: {$arrayElemAt: ['$salesManagers', 0]},

                        supplier: {
                            _id : '$supplier._id',
                            name: '$supplier.name'
                        },

                        workflow: {
                            status: '$workflow.status',
                            name  : '$workflow.name'
                        },

                        currency       : 1,
                        paymentInfo    : 1,
                        orderDate      : 1,
                        name           : 1,
                        isOrder        : 1,
                        proformaCounter: 1
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
                        workflow       : 1,
                        supplier       : 1,
                        currency       : 1,
                        paymentInfo    : 1,
                        orderDate      : 1,
                        name           : 1,
                        isOrder        : 1,
                        proformaCounter: 1
                    }
                }, {
                    $project: {
                        salesPerson: {
                            _id : '$salesPerson._id',
                            name: '$salesPerson.name'
                        },

                        workflow       : 1,
                        supplier       : 1,
                        currency       : 1,
                        paymentInfo    : 1,
                        orderDate      : 1,
                        name           : 1,
                        isOrder        : 1,
                        proformaCounter: 1
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
                        _id            : '$root._id',
                        salesPerson    : '$root.salesPerson',
                        workflow       : '$root.workflow',
                        supplier       : '$root.supplier',
                        currency       : '$root.currency',
                        paymentInfo    : '$root.paymentInfo',
                        orderDate      : '$root.orderDate',
                        name           : '$root.name',
                        isOrder        : '$root.isOrder',
                        proformaCounter: '$root.proformaCounter',
                        total          : 1
                    }
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
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

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var Customer = models.get(db, 'Customers', CustomerSchema);
        var Employee = models.get(db, 'Employees', EmployeesSchema);
        var Project = models.get(db, 'Project', ProjectSchema);
        var Workflow = models.get(db, 'workflows', WorkflowSchema);
        var Quotation = models.get(db, 'Quotation', QuotationSchema);
        var JobsModel = models.get(db, 'jobs', JobsSchema);
        var wTrackModel = models.get(db, 'wTrack', wTrackSchema);
        var body = mapObject(req.body);
        var currency = body.currency ? body.currency.name : 'USD';
        var isPopulate = req.body.populate;
        var quotation;
        var project;
        var rates;
        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        currencyHalper(body.orderDate, function (err, oxr) {
            oxr = oxr || {};
            rates = oxr.rates;

            body.currency = body.currency || {};
            body.currency.rate = rates && rates[currency] ? rates[currency] : 1;
            quotation = new Quotation(body);

            if (req.session.uId) {
                quotation.createdBy.user = req.session.uId;
                quotation.editedBy.user = req.session.uId;
            }

            quotation.save(function (err, _quotation) {
                var historyOptions;
                var parellelTasks = [
                    function (callback) {
                        Customer.populate(_quotation, {
                            path  : 'supplier',
                            select: '_id name fullName'
                        }, function (err, resp) {
                            if (err) {
                                return callback(err);
                            }

                            callback(null, resp);
                        });
                    },
                    function (callback) {
                        Workflow.populate(_quotation, {
                            path  : 'workflow',
                            select: '-sequence'
                        }, function (err, resp) {
                            if (err) {
                                return callback(err);
                            }

                            callback(null, resp);
                        });
                    },
                    function (callback) {
                        Project.populate(_quotation, {
                            path  : 'project',
                            select: '_id name salesmanager'
                        }, function (err) {
                            if (err) {
                                return callback(err);
                            }

                            Employee.populate(_quotation, {
                                path  : 'project.salesmanager',
                                select: '_id name'
                            }, function (err, resp) {
                                if (err) {
                                    return callback(err);
                                }

                                callback(null, resp);
                            });
                        });
                    }
                ];

                if (err) {
                    return next(err);
                }

                historyOptions = {
                    contentType: 'quotation',
                    data       : _quotation.toJSON(),
                    dbName     : db,
                    contentId  : _quotation._id
                };

                if (isPopulate) {

                    async.parallel(parellelTasks, function (err) {
                        var id;
                        var products;

                        if (err) {
                            return next(err);
                        }

                        id = _quotation._id;
                        products = body.products;

                        async.each(products, function (product, cb) {
                            var jobs = product.jobs;

                            JobsModel.findByIdAndUpdate(jobs, {
                                $set: {
                                    quotation  : id,
                                    type       : 'Quoted',
                                    editedBy   : editedBy,
                                    description: product.jobDescription
                                }
                            }, {new: true}, function (err, result) {
                                if (err) {
                                    return cb(err);
                                }
                                if (result.project) {
                                    project = result.project;
                                } else {
                                    project = null;
                                }
                                cb();
                            });

                        }, function () {
                            if (project) {
                                event.emit('fetchJobsCollection', {project: project, dbName: db});
                            }

                            HistoryService.addEntry(historyOptions, function () {
                                res.status(201).send(_quotation);
                            });

                        });
                    });
                } else {

                    HistoryService.addEntry(historyOptions, function () {
                        res.status(201).send(_quotation);
                    });
                }
            });
        });
    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body);
        var mid = parseInt(req.headers.mid, 10);

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };
        updateOnlySelectedFields(req, res, next, id, data);
    };

    this.updateModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body);

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };
        data.currency = data.currency || {};
        currencyHalper(data.orderDate, function (err, oxr) {
            var currency = data.currency ? data.currency.name : 'USD';
            var rates;

            oxr = oxr || {};
            rates = oxr.rates;
            data.currency.rate = rates[currency] || 1;

            updateOnlySelectedFields(req, res, next, id, data);
        });
    };

    this.uploadFile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
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
                        _id       : mongoose.Types.ObjectId(),
                        attachment: {
                            name    : elem.name,
                            shortPas: elem.shortPas
                        },
                        user      : {
                            _id  : req.session.uId,
                            login: req.session.uName
                        },
                        date      : new Date()
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

    function getByViewType(req, res, next) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;
        var contentType = data.contentType;
        var isOrder = (contentType === 'Orders' || contentType === 'salesOrders');
        var sort = {};
        var filter = data.filter || {};
        var key;
        var queryObject = {};

        queryObject.$and = [];

        if (filter && typeof filter === 'object') {
            if ((contentType === 'Orders') || (contentType === 'Quotations')) {
                queryObject.$and.push({forSales: false});
            } else {
                queryObject.$and.push({forSales: true});
            }

            if (isOrder) {
                queryObject.$and.push({isOrder: true});
            } else {
                queryObject.$and.push({isOrder: false});
            }

            queryObject.$and.push(filterMapper.mapFilter(filter, {contentType: contentType}));
        }

        if (data.sort) {
            key = Object.keys(data.sort)[0];
            data.sort[key] = parseInt(data.sort[key], 10);
            sort = data.sort;
        } else {
            sort = {orderDate: -1};
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Quotation, cb);
        };

        contentSearcher = function (ids, cb) {
            var newQueryObj = {};
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

            newQueryObj.$and = [];
            newQueryObj.$and.push(queryObject);
            newQueryObj.$and.push({_id: {$in: ids}});

            Quotation.aggregate([{
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'project',
                    foreignField: 'projectId',
                    as          : 'projectMembers'
                }
            }, {
                $lookup: {
                    from        : 'Payment',
                    localField  : '_id',
                    foreignField: 'order',
                    as          : 'payment'
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
                $project: {
                    workflow: {$arrayElemAt: ['$workflow', 0]},
                    supplier: {$arrayElemAt: ['$supplier', 0]},

                    salesManagers  : {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : salesManagerMatch
                        }
                    },
                    name           : 1,
                    paymentInfo    : 1,
                    project        : {$arrayElemAt: ['$project', 0]},
                    payment        : {$arrayElemAt: ['$payment', 0]},
                    orderDate      : 1,
                    forSales       : 1,
                    isOrder        : 1,
                    'currency._id' : {$arrayElemAt: ['$currency._id', 0]},
                    'currency.rate': '$currency.rate',
                    proformaCounter: 1
                }
            }, {
                $project: {
                    salesManagers    : {$arrayElemAt: ['$salesManagers', 0]},
                    name             : 1,
                    paymentInfo      : 1,
                    orderDate        : 1,
                    forSales         : 1,
                    payment          : 1,
                    'project._id'    : 1,
                    'project.name'   : 1,
                    'workflow._id'   : '$workflow._id',
                    'workflow.status': '$workflow.status',
                    'workflow.name'  : '$workflow.name',
                    'supplier._id'   : '$supplier._id',
                    'supplier.name'  : '$supplier.name',
                    isOrder          : 1,
                    currency         : 1,
                    proformaCounter  : 1
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
                    salesManager   : {$arrayElemAt: ['$salesManagers', 0]},
                    name           : 1,
                    paymentInfo    : 1,
                    project        : 1,
                    payment        : 1,
                    orderDate      : 1,
                    forSales       : 1,
                    workflow       : 1,
                    supplier       : 1,
                    isOrder        : 1,
                    currency       : 1,
                    proformaCounter: 1
                }
            }, {
                $match: newQueryObj
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
                    _id                  : '$root._id',
                    'salesManager.name'  : '$root.salesManager.name',
                    name                 : '$root.name',
                    'paymentInfo.total'  : '$root.paymentInfo.total',
                    'paymentInfo.unTaxed': '$root.paymentInfo.unTaxed',
                    orderDate            : '$root.orderDate',
                    /* forSales           : '$root.forSales',*/
                    workflow             : '$root.workflow',
                    supplier             : '$root.supplier',
                    /* isOrder            : '$root.isOrder',*/
                    currency             : '$root.currency',
                    project              : '$root.project',
                    paymentPayd          : {$divide: ['$root.payment.paidAmount', '$root.currency.rate']},
                    paymentBalance       : {$subtract: ['$root.paymentInfo.total', {$divide: ['$root.payment.paidAmount', '$root.currency.rate']}]},
                    proformaCounter      : '$root.proformaCounter',
                    total                : 1
                }
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            }], cb);
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
    }

    function getById(req, res, next) {
        var id = req.query.id || req.params.id;
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        if (id.length < 24) {
            return res.status(400).send();
        }

        /* var contentType = req.query.contentType;
         var isOrder = ((contentType === 'Orders') || (contentType === 'salesOrders'));*/

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

            var Model = models.get(req.session.lastDb, 'Quotation', QuotationSchema);

            Model.aggregate([
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                }],
                waterfallCallback
            );
        };

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var queryObject = {_id: id};
            var query;

            // queryObject.isOrder = isOrder;
            query = Quotation.findOne(queryObject);

            query
                .populate('supplier', '_id name fullName')
                .populate('destination')
                .populate('currency._id')
                .populate('incoterm')
                .populate('invoiceControl')
                .populate('paymentTerm')
                .populate('products.product', '_id name info')
                .populate('products.jobs', '_id name description')
                .populate('groups.users')
                .populate('groups.group')
                .populate('groups.owner', '_id login')
                .populate('editedBy.user', '_id login')
                .populate('deliverTo', '_id, name')
                .populate('project', '_id name')
                .populate('workflow', '_id name status');

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            getHistory(req, result.toJSON(), function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
        });
    }

    this.getById = function (req, res, next) {
        getById(req, res, next);
    };

    this.getByViewType = function (req, res, next) {
        var query = req.query;
        var viewType = query.viewType;
        var id = req.query.id;

        if (id && id.length >= 24) {
            getById(req, res, next);
            return false;
        }

        switch (viewType) {
            case 'form':
                getById(req, res, next);
                break;
            default:
                getByViewType(req, res, next);
                break;
        }
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var project;
        var type = 'Not Ordered';
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        Quotation.findByIdAndRemove(id, function (err, quotation) {
            var products;

            if (err) {
                return next(err);
            }

            products = quotation ? quotation.get('products') : [];

            async.each(products, function (product, cb) {

                JobsModel.findByIdAndUpdate(product.jobs, {
                    type     : type,
                    quotation: null,
                    editedBy : editedBy
                }, {new: true}, function (err, result) {
                    var wTracks;

                    if (err) {
                        return next(err);
                    }

                    project = result ? result.get('project') : null;
                    wTracks = result ? result.wTracks : [];

                    async.each(wTracks, function (wTr, callback) {
                        wTrack.findByIdAndUpdate(wTr, {$set: {revenue: 0}}, callback);
                    }, function () {
                        cb();
                    });
                });

            }, function () {
                res.status(200).send({success: quotation});
            });
        });
    };

    this.getFilterValues = function (req, res, next) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);

        async.waterfall([
            function (cb) {
                Quotation
                    .aggregate([
                        {
                            $group: {
                                _id         : null,
                                'Order date': {
                                    $addToSet: '$orderDate'
                                }
                            }
                        }
                    ], function (err, quot) {
                        if (err) {
                            return cb(err);

                        }

                        cb(null, quot);
                    });
            },
            function (quot, cb) {
                cb(null, quot);
            }

        ], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);

        });
    };

    this.bulkRemove = function (req, res, next) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        // todo some validation on ids array, like check for objectId

        Quotation.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
        });
    };
};

module.exports = Module;
