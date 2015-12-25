var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');

var Quotation = function (models, event) {
    var access = require("../Modules/additions/access.js")(models);
    var rewriteAccess = require('../helpers/rewriteAccess');
    var QuotationSchema = mongoose.Schemas['Quotation'];
    var CustomerSchema = mongoose.Schemas['Customer'];
    var WorkflowSchema = mongoose.Schemas['workflow'];
    var EmployeesSchema = mongoose.Schemas['Employees'];
    var ProjectSchema = mongoose.Schemas['Project'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var JobsSchema = mongoose.Schemas['jobs'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var workflowHandler = new WorkflowHandler(models);
    var _ = require('../node_modules/underscore');

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var project;
        var Customer = models.get(db, 'Customers', CustomerSchema);
        var Employee = models.get(db, 'Employees', EmployeesSchema);
        var Project = models.get(db, 'Project', ProjectSchema);
        var Workflow = models.get(db, 'workflows', WorkflowSchema);
        var Quotation = models.get(db, 'Quotation', QuotationSchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);

        var body = mapObject(req.body);
        var isPopulate = req.body.populate;

        var quotation = new Quotation(body);

        if (req.session.uId) {
            quotation.createdBy.user = req.session.uId;
            quotation.editedBy.user = req.session.uId;
        }

        quotation.save(function (err, _quotation) {
            if (err) {
                return next(err);
            }

            if (isPopulate) {
                async.parallel([
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
                            select: '_id projectName projectmanager'
                        }, function (err, resp) {
                            if (err) {
                                return callback(err);
                            }

                            Employee.populate(_quotation, {
                                path  : 'project.projectmanager',
                                select: '_id name'
                            }, function (err, resp) {
                                if (err) {
                                    return callback(err);
                                }

                                callback(null, resp);
                            });
                        });
                    }
                ], function (err) {
                    if (err) {
                        return next(err);
                    }

                    var id = _quotation._id;
                    var products = _quotation.products;

                    async.each(products, function (product, cb) {
                        var jobs = product.jobs;

                        JobsModel.findByIdAndUpdate(jobs, {
                            $set: {
                                quotation: id,
                                type     : "Quoted"
                            }
                        }, {new: true}, function (err, result) {
                            if (err) {
                                return cb(err);
                            }
                            project = result.project ? result.project : null;
                            cb();
                        });

                    }, function () {
                        if (project) {
                            event.emit('fetchJobsCollection', {project: project});
                        }
                        res.status(200).send(_quotation);
                    });
                })
            } else {
                res.status(200).send(_quotation);
            }
        });
    };

    function updateOnlySelectedFields(req, res, next, id, data) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var products;
        var project;

        Quotation.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, quotation) {
            if (err) {
                return next(err);
            }

            if (data.isOrder) {
                products = quotation.products;

                async.each(products, function (product, cb) {
                    var jobs = product.jobs;

                    JobsModel.findByIdAndUpdate(jobs, {$set: {type: "Ordered"}}, {new: true}, function (err, result) {
                        if (err) {
                            return cb(err);
                        }
                        project = result.project ? result.project : null;
                        cb();
                    });

                }, function () {
                    if (project) {
                        event.emit('fetchJobsCollection', {project: project});
                    }

                    res.status(200).send({success: 'Quotation updated', result: quotation});

                });
            } else {
                res.status(200).send({success: 'Quotation updated', result: quotation});
            }

        });

    }

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body);
        var mid = parseInt(req.headers.mid);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    updateOnlySelectedFields(req, res, next, id, data);
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.updateModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body);
        var mid = parseInt(req.headers.mid);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    updateOnlySelectedFields(req, res, next, id, data);
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.send(401);
        }
    };

    this.totalCollectionLength = function (req, res, next) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var data = req.query;

        var waterfallTasks;
        var contentType = data.contentType;
        var filter = data.filter || {};
        var isOrder = (contentType === 'Order' || contentType === 'salesOrder');

        if (isOrder) {
            filter.isOrder = {
                key  : 'isOrder',
                value: ['true']
            }
        } else {
            filter.isOrder = {
                key  : 'isOrder',
                value: ['false']
            }
        }

        var optionsObject = {};

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                optionsObject['$or'] = caseFilter(filter);
            } else {
                optionsObject['$and'] = caseFilter(filter);
            }
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
                   // optionsObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };

            Quotation.aggregate(
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

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var queryObject = {};

            queryObject['$and'] = [];
            queryObject.$and.push(optionsObject);
            queryObject.$and.push({_id: {$in: _.pluck(quotationsIds, '_id')}});

            //query = Quotation.count(queryObject);
            //query.count(waterfallCallback);
            Quotation.aggregate([{
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $lookup: {
                    from        : "Customers",
                    localField  : "supplier",
                    foreignField: "_id", as: "supplier"
                }
            }, {
                $lookup: {
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id", as: "project"
                }
            },
                {
                    $project: {
                        workflow   : {$arrayElemAt: ["$workflow", 0]},
                        supplier   : {$arrayElemAt: ["$supplier", 0]},
                        project    : {$arrayElemAt: ["$project", 0]},
                        forSales   : 1,
                        isOrder    : 1
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "project.projectmanager",
                        foreignField: "_id", as: "projectmanager"
                    }
                }, {
                    $project: {
                        forSales      : 1,
                        workflow      : 1,
                        supplier      : 1,
                        project       : 1,
                        isOrder       : 1,
                        projectmanager: {$arrayElemAt: ["$projectmanager", 0]}
                    }
                }, {
                    $match: queryObject
                }
            ], waterfallCallback);

        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result.length});
        });
    };

    function ConvertType(array, type) {
        if (type === 'integer') {
            for (var i = array.length - 1; i >= 0; i--) {
                array[i] = parseInt(array[i]);
            }
        } else if (type === 'boolean') {
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i] === 'true') {
                    array[i] = true;
                } else if (array[i] === 'false') {
                    array[i] = false;
                } else {
                    array[i] = null;
                }
            }
        }
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
                case 'reference':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'projectName':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'project':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'supplier':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'workflow':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'type':
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'projectmanager':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'forSales':
                    ConvertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'isOrder':
                    ConvertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
            }
        }

        return resArray;
    }

    this.getByViewType = function (req, res, next) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var query = req.query;
        var queryObject = {};
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;
        var contentType = query.contentType;
        var isOrder = (contentType === 'Order' || contentType === 'salesOrder');
        var sort = {};
        var count = parseInt(query.count) ? parseInt(query.count) : 100;
        var page = parseInt(query.page);
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;
        var filter = query.filter || {};
        var key;

        if (isOrder) {
            filter.isOrder = {
                key  : 'isOrder',
                value: ['true']
            }
        } else {
            filter.isOrder = {
                key  : 'isOrder',
                value: ['false']
            }
        }

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                queryObject['$or'] = caseFilter(filter);
            } else {
                queryObject['$and'] = caseFilter(filter);
            }
        }

        if (query.sort) {
            key = Object.keys(query.sort)[0];
            query.sort[key] = parseInt(query.sort[key]);
            sort = query.sort;
        } else {
            sort = {"orderDate": -1};
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
                    // queryObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };
            var Model = models.get(req.session.lastDb, "Quotation", QuotationSchema);

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

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var newQueryObj = {};

            newQueryObj.$and = [];
            newQueryObj.$and.push(queryObject);
            newQueryObj.$and.push({_id: {$in: _.pluck(quotationsIds, '_id')}});

            Quotation.aggregate([{
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $lookup: {
                    from        : "Customers",
                    localField  : "supplier",
                    foreignField: "_id", as: "supplier"
                }
            }, {
                $lookup: {
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id", as: "project"
                }
            },
                {
                    $project: {
                        workflow   : {$arrayElemAt: ["$workflow", 0]},
                        supplier   : {$arrayElemAt: ["$supplier", 0]},
                        project    : {$arrayElemAt: ["$project", 0]},
                        name       : 1,
                        paymentInfo: 1,
                        orderDate  : 1,
                        forSales   : 1,
                        isOrder    : 1
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "project.projectmanager",
                        foreignField: "_id", as: "projectmanager"
                    }
                }, {
                    $project: {
                        name          : 1,
                        paymentInfo   : 1,
                        orderDate     : 1,
                        forSales      : 1,
                        workflow      : 1,
                        supplier      : 1,
                        project       : 1,
                        isOrder       : 1,
                        projectmanager: {$arrayElemAt: ["$projectmanager", 0]}
                    }
                }, {
                    $match: newQueryObj
                }, {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: count
                }
            ], waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getById = function (req, res, next) {
        var id = req.params.id;
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        var contentType = req.query.contentType;
        var isOrder = ((contentType === 'Order') || (contentType === 'salesOrder'));

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
                $or: whoCanRw
            };

            var Model = models.get(req.session.lastDb, "Quotation", QuotationSchema);

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

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var queryObject = {_id: objectId(id)};
            var query;

            //queryObject.isOrder = isOrder;
            query = Quotation.findOne(queryObject);

            query
                .populate('supplier', '_id name fullName')
                .populate('destination')
                .populate('incoterm')
                .populate('invoiceControl')
                .populate('paymentTerm')
                .populate('products.product', '_id, name')
                .populate('products.jobs', '_id, name')
                .populate('groups.users')
                .populate('groups.group')
                .populate('groups.owner', '_id login')
                .populate('deliverTo', '_id, name')
                .populate('project', '_id projectName')
                .populate('workflow', '_id name status');

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var project;
        var type = "Not Quoted";
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);

        Quotation.findByIdAndRemove(id, function (err, quotation) {
            if (err) {
                return next(err);
            }

            var products = quotation.get('products');

            async.each(products, function (product, cb) {

                JobsModel.findByIdAndUpdate(product.jobs, {
                    type     : type,
                    quotation: null
                }, {new: true}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    project = result ? result.get('project') : null;
                    

                    async.each(result, function(job){
                        var wTracks = job.wTracks;

                        async.each(wTracks, function(wTrack, cb){
                            wTrack.findByIdAndUpdate(wTrack, {$set: {revenue: 0}}, cb)
                        });
                    });

                    cb();
                });

            }, function () {
                if (project) {
                    event.emit('fetchJobsCollection', {project: project});
                }

                res.status(200).send({success: quotation});
            });
        });
    };

    this.getFilterValues = function (req, res, next) {
        var CustomersSchema = mongoose.Schemas['Customers'];
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var Customers = models.get(req.session.lastDb, 'Customers', CustomersSchema);

        async.waterfall([
            function (cb) {
                Quotation
                    .aggregate([
                        {
                            $group: {
                                _id         : null,
                                /*'Reference': {
                                 $addToSet: '$supplierReference'
                                 },*/
                                'Order date': {
                                    $addToSet: '$orderDate'
                                }
                            }
                        }
                    ], function (err, quot) {
                        if (err) {
                            cb(err)

                        } else {
                            cb(null, quot)
                        }
                    })
            },
            function (quot, cb) {
                //Customers
                //    .populate(quot, {
                //        path  : 'supplier',
                //        model : Customers,
                //        select: 'name _id'
                //    },
                //    function (err, quot) {
                //        if (err) {
                //            return cb(err)
                //
                //        }
                //        cb(null, quot)
                //
                //    })
                cb(null, quot)
            }

        ], function (err, result) {
            if (err) {
                return next(err)
            }
            res.status(200).send(result)

        })
    };

};

module.exports = Quotation;