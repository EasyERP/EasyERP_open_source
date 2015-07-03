/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var Quotation = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var QuotationSchema = mongoose.Schemas['Quotation'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');

    this.create = function (req, res, next) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var body = mapObject(req.body);
        var quotation = new Quotation(body);

        quotation.save(function (err, _quotation) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: _quotation});
        });
    };

    function updateOnlySelectedFields(req, res, next, id, data) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);

        Quotation.findByIdAndUpdate(id, {$set: data}, function (err, quotation) {
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

        if (data && data.filter && data.filter.forSales) {
            optionsObject['forSales'] = true;
        } else {
            optionsObject['forSales'] = false;
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
            var queryObject = {_id: {$in: quotationsIds}};
            var query;

            queryObject.isOrder = isOrder;
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
        var count = query.count ? query.count : 50;
        var page = query.page;
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;

        if (query && query.filter && query.filter.forSales) {
            queryObject['forSales'] = true;
        } else {
            queryObject['forSales'] = false;
        }

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
            var query;
            var queryObject = {$and: []};
            
            queryObject.$and.push({_id: {$in: quotationsIds}});
            queryObject.$and.push({isOrder: isOrder});

            if (req.query && req.query.filter) {
                if (req.query.filter.workflow) {
                    queryObject.$and.push({workflow: {$in: req.query.filter.workflow}});
                }
            }


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

};

module.exports = Quotation;