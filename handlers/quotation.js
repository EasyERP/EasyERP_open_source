var mongoose = require('mongoose');
var Quotation = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var QuotationSchema = mongoose.Schemas['Quotation'];
    var CustomerSchema = mongoose.Schemas['Customer'];
    var WorkflowSchema = mongoose.Schemas['workflow'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');

    this.create = function (req, res, next) {
        var db = req.session.lastDb;

        var Customer = models.get(db, 'Customers', CustomerSchema);
        var Workflow = models.get(db, 'workflows', WorkflowSchema);
        var Quotation = models.get(db, 'Quotation', QuotationSchema);

        var body = mapObject(req.body);
        var isPopulate = req.body.populate;
        var quotation = new Quotation(body);

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
                            select: '-sequence',
                        }, function (err, resp) {
                            if (err) {
                                return callback(err);
                            }

                            callback(null, resp);
                        });
                    }
                ], function (err, results) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(_quotation);
                })
            } else {
                res.status(200).send(_quotation);
            }
        });
    };

    function updateOnlySelectedFields(req, res, next, id, data) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);

        Quotation.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, quotation) {
            if (err) {
                next(err);
            } else {
                res.status(200).send({success: 'Quotation updated', result: quotation});
            }
        });

    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 55, function (access) {
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

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 55, function (access) {
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
        var isOrder = (contentType === 'Order' || contentType === 'salesOrder');

        var optionsObject = {};

        /*if (data && data.filter && data.filter.forSales) {
         optionsObject['forSales'] = true;
         } else {
         optionsObject['forSales'] = false;
         }*/

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
            var arrOfObjectId = deps.objectID();

            Quotation.aggregate(
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

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var data = req.query;
            var query;
            var queryObject = {};
            queryObject['$and'] = [];

            queryObject.$and.push({_id: {$in: quotationsIds}});
            queryObject.$and.push({isOrder: isOrder});

            caseFilter(queryObject, data);

            query = Quotation.count(queryObject);
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

    /*function caseFilter (queryObject, data) {
     var filter = data.filter;

     if (data && filter) {
     if (filter.condition === 'or') {
     queryObject['$or'] = []
     }
     if (filter.workflow) {
     queryObject.$and.push({workflow: {$in: filter.workflow.objectID()}});
     }
     /!*if (filter.Reference) {
     queryObject.$and.push({supplierReference: {$in: filter.Reference}});
     }*!/
     if (filter.supplier) {
     queryObject.$and.push({supplier: {$in: filter.supplier}});
     }
     if (filter['Order date']) {
     if (filter.condition === 'or') {
     queryObject.$or.push({orderDate: {$gte: new Date(filter['Order date'][0].start), $lte: new Date(filter['Order date'][0].end)}});
     } else {
     queryObject.$and.push({orderDate: {$gte: new Date(filter['Order date'][0].start), $lte: new Date(filter['Order date'][0].end)}});
     }

     }
     }
     };*/

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
                case 'projectName':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'forSales':
                    ConvertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'canBeSold':
                    ConvertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
            }
        }
        ;

        return resArray;
    };

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
        var count = query.count ? query.count : 100;
        var page = query.page;
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;
        var filter = query.filter;

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                queryObject['$or'] = caseFilter(filter);
            } else {
                queryObject['$and'] = caseFilter(filter);
            }
        }

        /*if (query && query.filter && query.filter.forSales) {
         queryObject['forSales'] = true;
         } else {
         queryObject['forSales'] = false;
         }*/

        if (query.sort) {
            sort = query.sort;
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

            models.get(req.session.lastDb, "Quotation", QuotationSchema).aggregate(
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

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var data = req.query;
            var query;
            var queryObject = {};

            queryObject.$and = [];

            queryObject.$and.push({_id: {$in: quotationsIds}});
            queryObject.$and.push({isOrder: isOrder});

            query = Quotation
                .find(queryObject)
                .limit(count)
                .skip(skip)
                .sort(sort);

            query.populate('supplier', '_id name fullName');
            query.populate('destination');
            query.populate('incoterm');
            query.populate('invoiceControl');
            query.populate('paymentTerm');
            query.populate('products.product', '_id, name');
            query.populate('workflow', '-sequence');

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

    this.getById = function (req, res, next) {
        var id = req.params.id;
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        /* var queryParams = {};

         for (var i in req.query) {
         queryParams[i] = req.query[i];
         }*/

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        var contentType = req.query.contentType;
        var isOrder = !!(contentType === 'Order');

        /* var data = {};

         for (var i in req.query) {
         data[i] = req.query[i];
         }*/

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

            models.get(req.session.lastDb, "Quotation", QuotationSchema).aggregate(
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

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var queryObject = {_id: id};
            var query;

            queryObject.isOrder = isOrder;
            query = Quotation.findOne(queryObject);

            query.populate('supplier', '_id name fullName');
            query.populate('destination');
            query.populate('incoterm');
            query.populate('invoiceControl');
            query.populate('paymentTerm');
            query.populate('products.product', '_id, name');
            query.populate('groups.users');
            query.populate('groups.group');
            query.populate('groups.owner', '_id login');
            query.populate('workflow', '-sequence');
            query.populate('deliverTo', '_id, name');

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
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);

        Quotation.remove({_id: id}, function (err, product) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: product});
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
                Customers
                    .populate(quot, {
                        path  : 'supplier',
                        model : Customers,
                        select: 'name _id'
                    },
                    function (err, quot) {
                        if (err) {
                            return cb(err)

                        }
                        cb(null, quot)

                    })
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