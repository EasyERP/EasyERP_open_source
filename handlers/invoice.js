/**
 * Created by ANDREY on 29.04.2015.
 */

var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');

var Invoice = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var InvoiceSchema = mongoose.Schemas['Invoice'];
    var OrderSchema = mongoose.Schemas['Quotation'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var workflowHandler = new WorkflowHandler(models);

    this.create = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var body = req.body;

        var invoice = new Invoice(body);

        if (req.session.uId) {
            invoice.createdBy.user = req.session.uId;
            invoice.editedBy.user = req.session.uId;
        }

        invoice.save(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: result});
        });
    };

    this.receive = function (req, res, next) {
        var id = req.body.orderId;
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var Order = models.get(req.session.lastDb, 'Quotation', OrderSchema);
        var parallelTasks;
        var waterFallTasks;

        function fetchFirstWorkflow(callback) {
            var request = {
                query: {
                    wId: 'Invoice',
                    source: 'purchase',
                    targetSource: 'invoice'
                },
                session: req.session
            };

            workflowHandler.getFirstForConvert(request, callback);
        }

        function findOrder(callback) {
            Order.findById(id, callback);
        };

        function parallel(callback) {
            async.parallel(parallelTasks, callback);
        };

        function createInvoice(parallelResponse, callback) {
            var order;
            var workflow;
            var err;
            var invoice;

            if (parallelResponse && parallelResponse.length) {
                order = parallelResponse[0];
                workflow = parallelResponse[1];
            } else {
                err = new Error(RESPONSES.BAD_REQUEST);
                err.status = 400;

                return callback(err);
            }

            invoice = new Invoice(order);

            if (req.session.uId) {
                invoice.createdBy.user = req.session.uId;
                invoice.editedBy.user = req.session.uId;
            }

            invoice.sourceDocument = order.name;
            invoice.paymentReference = order.name;
            invoice.workflow = workflow._id;
            invoice.paymentInfo.balance = order.paymentInfo.total;

            invoice.save(callback);

        };

        parallelTasks = [findOrder, fetchFirstWorkflow];
        waterFallTasks = [parallel, createInvoice];

        async.waterfall(waterFallTasks, function (err, result) {
            if (err) {
                return next(err)
            }

            res.status(201).send({success: result});
        });

    };

    this.updateOnlySelected = function (req, res, next) {
        var id = req.params.id;
        var data = req.body;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 56, function (access) {
                if (access) {

                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };

                    var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);

                    Invoice.findByIdAndUpdate(id, {$set: data}, function (err, invoice) {
                        if (err) {
                            next(err);
                        } else {
                            res.status(200).send({success: 'Invoice updated', result: invoice});
                        }
                    });

                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    }

    this.getAll = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var query = {};

        Invoice.find(query, function (err, invoice) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: invoice});
        });
    };

    this.getForView = function (req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 56, function (access) {
                if (access) {
                    var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
                    var optionsObject = {};
                    var sort = {};
                    var count = req.query.count ? req.query.count : 50;
                    var page = req.query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (req.query.sort) {
                        sort = req.query.sort;
                        //} else {
                        //    sort = {"supplier": 1};
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

                    contentSearcher = function (invoicesIds, waterfallCallback) {
                        optionsObject._id = {$in: invoicesIds};

                        var query = Invoice.find(optionsObject).limit(count).skip(skip).sort(sort);

                        query.populate('supplier', 'name _id').
                            populate('salesPerson', 'name _id').
                            populate('department', '_id departmentName').
                            populate('createdBy.user').
                            populate('editedBy.user').
                            populate('groups.users').
                            populate('groups.group').
                            populate('groups.owner', '_id login').
                            populate('workflow', '-sequence');

                        query.exec(waterfallCallback);
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send({success: result});
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
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 56, function (access) {
                if (access) {
                    var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
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
                        var data = {};
                        for (var i in req.query) {
                            data[i] = req.query[i];
                        }
                        var id = data.id;
                        optionsObject = {_id: id};

                        var query = Invoice.findOne(optionsObject);

                        query.populate('supplier', '_id name').
                            populate('salesPerson', 'name _id').
                            populate('products.product', '_id name').
                            populate('payments', '_id name date paymentRef paidAmount').
                            populate('department', '_id departmentName').
                            populate('createdBy.user').
                            populate('editedBy.user').
                            populate('groups.users').
                            populate('groups.group').
                            populate('groups.owner', '_id login').
                            populate('workflow', '-sequence');

                        query.exec(waterfallCallback);
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(result);
                    });
                } else {
                    response.send(403);
                }
            });

        } else {
            response.send(401);
        }
    };

    this.removeInvoice = function(req, res, id, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 56, function (access) {
                if (access) {

                    models.get(req.session.lastDb, "Invoice", InvoiceSchema).findByIdAndRemove(id, function (err, result) {
                        if (err) {
                            next(err);
                        } else {
                            res.status(200).send({success: result});
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

    this.updateInvoice = function (req,res, _id, data, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 56, function (access) {
                if (access) {
                    var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
                    //data.editedBy = {
                    //    user: req.session.uId,
                    //    date: new Date().toISOString()
                    //}

                    //if (data.supplier && data.supplier._id) {
                    //    data.supplier = data.supplier._id;
                    //}

                    Invoice.findByIdAndUpdate(_id, data.invoice, function (err, result) {

                        if (err) {
                            next(err);
                        } else {
                            res.status(200).send({success: 'Invoice updated success', result: result});
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

        var optionsObject = {};
        var result = {};

        result['showMore'] = false;

        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
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
            var arrOfObjectId = deps.objectID();

            models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
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

        contentSearcher = function (invoicesIds, waterfallCallback) {
            optionsObject._id = {$in: invoicesIds};
            var query = Invoice.find(optionsObject);
            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, invoice) {
            if (err) {
                return next(err);
            } else {

                result['count'] = invoice.length;
                res.status(200).send(result);
            }
        });
    };


};

module.exports = Invoice;