/**
 * Created by ANDREY on 29.04.2015.
 */

var mongoose = require('mongoose');
var Invoice = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var InvoiceSchema = mongoose.Schemas['Invoice'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');

    this.create = function (req, res, next) {
        var Invoice =  models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
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

    this.getAll = function (req, res, next) {
        var Invoice =  models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
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
                    } else {
                        sort = {"supplierId": 1};
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

                        query.populate('supplierId','name _id').
                            populate('salesPerson','name').
                            populate('department', '_id departmentName').
                            populate('createdBy.user').
                            populate('editedBy.user').
                            populate('groups.users').
                            populate('groups.group').
                            populate('groups.owner', '_id login');

                        query.exec(waterfallCallback);
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function(err, result){
                        if(err){
                            return next(err);
                        }
                        res.status(200).send({success: result});
                    });
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    this.getInvoiceById = function (req, response) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 56, function (access) {
                if (access) {

                    var data = {};
                    for (var i in req.query) {
                        data[i] = req.query[i];
                    }
                    var id = data.id;

                    var query = models.get(req.session.lastDb, "Invoice", InvoiceSchema).findById(id);
                    query.populate('supplierId','name').
                        populate('salesPerson','name').
                        populate('department', '_id departmentName').
                        populate('createdBy.user').
                        populate('editedBy.user').
                        populate('groups.users').
                        populate('groups.group').
                        populate('groups.owner', '_id login');

                    query.exec(function (err, result) {
                        if (err) {
                            console.log(err)
                        } else {
                            response.send(result);
                        }
                    });
                } else {
                    response.send(403);
                }
            });

        } else {
            response.send(401);
        }
    };

    this.removeInvoice = function(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 56, function (access) {
                if (access) {

                    models.get(req.session.lastDb, "Invoice", InvoiceSchema).findByIdAndRemove(id, function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send(500, {error: "Can't remove Invoice"});
                        } else {
                            res.send(200, {success: 'Invoice removed'});
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

    this.updateInvoice = function (req,res, _id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 56, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }

                    if (data.supplierId && data.supplierId._id) {
                        data.supplierId = data.supplierId._id;
                    }

                    models.get(req.session.lastDb, "Invoice", InvoiceSchema).findByIdAndUpdate(_id, data, function (err, result) {

                        if (err) {
                            console.log(err);
                            res.send(500, {error: "Can't update Invoice"});
                        } else {
                            res.send(200, {success: 'Invoice updated success', result: result});
                        }
                    })

                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

        };

    this.invoiceUpdateOnlySelectedFields = function (reg, res, id){
    if (req.session && req.session.loggedIn && req.session.lastDb) {
        access.getEditWritAccess(req, req.session.uId, 56, function (access) {
            if (access) {

                var data= req.body;

                data.editedBy = {
                    user: req.session.uId,
                    date: new Date().toISOString()
                };
                //----------------------------
                var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);

                Invoice.findByIdAndUpdate(id, { $set: data}, function (err, invoice) {
                    if (err) {
                        res.send(500, {error: "Can't update Invoice"});
                    }
                    res.send(200, { success: 'Invoice updated', result: invoice });
                });
                //----------------------------
            } else {
                res.send(403);
            }
        });
    } else {
        res.send(401);
    }

    }

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