var mongoose = require('mongoose');

var Module = function (models, event) {
    'use strict';

    var DepartmentSchema = mongoose.Schemas.Department;
    var purchaseOrdersSchema = mongoose.Schemas.purchaseOrders;
    var JobsSchema = mongoose.Schemas.jobs;
    var wTrackSchema = mongoose.Schemas.wTrack;
    var objectId = mongoose.Types.ObjectId;
    var InvoiceSchema = mongoose.Schemas.Invoices;
    var manufacturingOrderSchema = mongoose.Schemas.manufacturingOrder;

    var rewriteAccess = require('../helpers/rewriteAccess');
    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var integrationStatsHelper = require('../helpers/integrationStatsComposer')(models);
    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();
    var RESPONSES = require('../constants/responses');
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var _ = require('../node_modules/underscore');
    var ratesService = require('../services/rates')(models);
    var goodsOutNotesService = require('../services/goodsOutNotes')(models);
    var goodsInNotesService = require('../services/goodsInNotes')(models);
    var OrderSchema = mongoose.Schemas.Order;
    var GoodsOutSchema = mongoose.Schemas.GoodsOutNote;
    var GoodsInSchema = mongoose.Schemas.GoodsInNote;
    var OrderRowsSchema = mongoose.Schemas.OrderRow;
    var PrepaymentSchema = mongoose.Schemas.Prepayment;
    var AvailabilitySchema = mongoose.Schemas.productsAvailability;
    var HistoryService = require('../services/history.js')(models);
    var StockReturnsService = require('../services/stockReturns.js')(models);
    var ConflictsService = require('../services/conflict.js')(models);
    var path = require('path');
    var CONSTANTS = require('../constants/mainConstants.js');
    var pageHelper = require('../helpers/pageHelper');
    var moment = require('../public/js/libs/moment/moment');
    var ratesRetriever = require('../helpers/ratesRetriever')();
    var redis = require('../helpers/redisClient');

    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();
    var GoodsOutNote = require('./goodsOutNote');
    var goodsOutNote = new GoodsOutNote(models, event);
    var GoodsInNotes = require('./goodsInNote');
    var goodsInNotes = new GoodsInNotes(models, event);
    var fs = require('fs');
    var orderCT = 'order';
    var purchaseOrderCT = 'purchaseOrders';

    function updateOnlySelectedFields(req, res, next, id, data) {
        var dbName = req.session.lastDb;
        var Order = models.get(dbName, 'Order', OrderSchema);
        var OrderRows = models.get(req.session.lastDb, 'orderRows', OrderRowsSchema);

        var orderRows;
        var fileName;
        var os;
        var _id;
        var osType;
        var path;
        var dir;
        var newDirname;
        var obj;
        var deletedOrderRows;

        if (data.orderRows) {
            orderRows = data.orderRows;
            delete data.orderRows;
        }

        if (data.deletedProducts) {
            deletedOrderRows = data.deletedProducts;
            delete data.deletedProducts;
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

        if (deletedOrderRows) {
            async.each(deletedOrderRows, function (orderRowId, cb) {
                OrderRows.findByIdAndRemove(orderRowId, function (err) {
                    if (err) {
                        return cb(err);
                    }

                    cb();
                });
            }, function (err) {
                if (err) {
                    return next(err);
                }

                updateOrderRows();
            });
        } else {
            updateOrderRows();
        }

        function updateOrderRows() {
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
                    fs.readdir(dir, function () {
                        if (data.attachments && data.attachments.length === 0) {
                            fs.rmdir(dir, function () {
                            });
                        }
                    });
                });

                delete data.fileName;

                Order.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, oredr) {
                    if (err) {
                        return next(err);
                    }

                    getById(req, res, next);
                    // res.status(200).send(oredr);

                });

            } else {
                Order.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, order) {
                    var historyOptions;

                    if (err) {
                        return next(err);
                    }

                    historyOptions = {
                        contentType: 'order',
                        data       : data,
                        dbName     : dbName,
                        contentId  : id
                    };

                    HistoryService.addEntry(historyOptions, function () {
                        if (orderRows) {
                            async.each(orderRows, function (orderRow, cb) {
                                var id = orderRow.id;
                                var row;

                                if (!id) {
                                    orderRow.order = order._id;
                                    row = new OrderRows(orderRow);
                                    row.save(function (err, elem) {
                                        if (err) {
                                            return cb(err);
                                        }
                                        cb();
                                    });
                                } else {
                                    delete orderRow.id;
                                    OrderRows.findByIdAndUpdate(id, orderRow, {new: true}, function (err, doc) {
                                        if (err) {
                                            return cb(err);
                                        }
                                        cb();
                                    });
                                }

                            }, function (err) {
                                if (err) {
                                    return next(err);
                                }

                                event.emit('recalculateStatus', req, order._id, next);

                                getById(req, res, next);
                                // res.status(200).send(order);
                            });

                        } else {
                            getById(req, res, next);
                            // res.status(200).send({success: 'Order was updated'});
                        }
                    });
                });
            }
        }
    }

    function getHistory(req, order, cb) {
        var Order = models.get(req.session.lastDb, 'Order', OrderSchema);

        var historyOptions = {
            forNote: true,
            dbName : req.session.lastDb,
            id     : order._id
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

            if (!order.notes) {
                order.notes = [];
            }
            order.notes = order.notes.concat(notes);
            order.notes = _.map(order.notes, function (el) {
                el.date = new Date(el.date);

                return el;
            });
            order.notes = _.sortBy(order.notes, 'date');
            cb(null, order);

        }, true);

    }

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var Order = models.get(db, 'Order', OrderSchema);
        var OrderRows = models.get(req.session.lastDb, 'orderRows', OrderRowsSchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var body = mapObject(req.body);
        var order;
        var mid = parseInt(req.headers.mid, 10) || 129;
        var arrayRows = body.products;
        var rates;
        var currency = body.currency;
        var base;

        if (mid === 129) {
            Order = models.get(db, 'purchaseOrders', purchaseOrdersSchema);
        }

        // currencyHalper(body.orderDate, function (err, oxr) {

        ratesService.getById({dbName: db, id: body.orderDate}, function (err, ratesObject) {
            rates = ratesObject ? ratesObject.rates : {};
            base = ratesObject ? ratesObject.base : 'USD';

            body.currency = body.currency || {};
            body.currency.rate = ratesRetriever.getRate(rates, base, currency.name);

            order = new Order(body);

            if (req.session.uId) {
                order.createdBy.user = req.session.uId;
                order.editedBy.user = req.session.uId;
            }

            order.save(function (err, _order) {
                var historyOptions;
                var arr;
                if (err) {
                    return next(err);
                }

                historyOptions = {
                    contentType: 'order',
                    data       : _order.toJSON(),
                    dbName     : db,
                    contentId  : _order._id
                };

                HistoryService.addEntry(historyOptions, function () {
                });

                arr = arrayRows.map(function (elem) {
                    elem._id = objectId();
                    elem.product = objectId(elem.product);
                    elem.warehouse = objectId(elem.warehouse);
                    elem.debitAccount = elem.debitAccount ? objectId(elem.debitAccount) : null;
                    elem.creditAccount = elem.creditAccount ? objectId(elem.creditAccount) : null;
                    elem.order = _order._id;
                    elem.quantity = parseInt(elem.quantity, 10);

                    return elem;
                });

                OrderRows.collection.insertMany(arr, function (err, docs) {
                    var insertedIds;

                    if (err) {
                        return next(err);
                    }

                    insertedIds = docs.insertedIds;

                    OrderRows.aggregate([{
                        $match: {_id: {$in: insertedIds}}
                    }, {
                        $lookup: {
                            from        : 'Products',
                            localField  : 'product',
                            foreignField: '_id',
                            as          : 'product'
                        }
                    }, {
                        $project: {
                            product: {$arrayElemAt: ['$product', 0]}
                        }
                    }, {
                        $group: {
                            _id : null,
                            jobs: {$addToSet: '$product.job'}
                        }
                    }], function (err, result) {
                        var jobIds;
                        var body;

                        if (err) {
                            return next(err);
                        }

                        body = {
                            order: _order._id,
                            type : 'Ordered'
                        };

                        jobIds = result && result.length ? result[0].jobs : [];

                        JobsModel.update({_id: {$in: jobIds}}, {$set: body}, {multi: true}, function (rer, result) {
                            if (err) {
                                return next(err);
                            }

                            res.status(201).send(_order);
                        });
                    });

                });

            });
        });
    };

    this.putchModel = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.params.id;
        var data = mapObject(req.body);
        //var mid = parseInt(req.headers.mid, 10);
        var waterfallTasks;
        var getGoodsOutNotes;
        var updateFields;
        var removeGoods;

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };
        data.currency = data.currency || {};

        if (data.cancel && data.forSales) {
            getGoodsOutNotes = function (callback) {
                goodsOutNotesService.getByOrder({dbName: db, order: objectId(id)}, callback);
            };

            removeGoods = function (ids, callback) {
                var options = {
                    ids   : ids,
                    dbName: db,
                    req   : req
                };
                goodsOutNote.removeByOrder(options, callback);
            };

            updateFields = function (callback) {
                callback();
                updateOnlySelectedFields(req, res, next, id, data);
            };

            waterfallTasks = [getGoodsOutNotes, removeGoods, updateFields];
            async.waterfall(waterfallTasks, function () {

            });

            return false;
        }

        if (data.cancel) {
            getGoodsOutNotes = function (callback) {
                goodsInNotesService.getByOrder({dbName: db, order: objectId(id)}, callback);
            };

            removeGoods = function (ids, orderRows, callback) {
                var options = {
                    ids   : ids,
                    dbName: db,
                    req   : req
                };
                goodsInNotes.removeByOrder(options, function (err) {
                    if (err && err.status !== 400) {
                        return next(err);
                    } else if (err && err.status === 400) {
                        res.status(400).send({error: err.message});
                    }

                    callback();
                });
            };

            updateFields = function (callback) {
                callback();
                updateOnlySelectedFields(req, res, next, id, data);
            };

            waterfallTasks = [getGoodsOutNotes, removeGoods, updateFields];
            async.waterfall(waterfallTasks, function () {

            });

            return false;
        }

        if (data.orderDate) {
            ratesService.getById({dbName: db, id: data.orderDate}, function (err, oxr) {
                var currency = data.currency ? data.currency.name : 'USD';
                var rates;
                var base;

                oxr = oxr || {};
                rates = oxr.rates || {};
                base = oxr.base || 'USD';
                data.currency.rate = ratesRetriever.getRate(rates, base, currency);
                updateOnlySelectedFields(req, res, next, id, data);
            });
        } else {
            updateOnlySelectedFields(req, res, next, id, data);
        }
    };

    this.updateModel = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.params.id;
        var data = mapObject(req.body);
        var waterfallTasks;
        var getGoodsOutNotes;
        var updateFields;
        var removeGoods;

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };
        data.currency = data.currency || {};

        if (data.cancel && data.forSales) {

            getGoodsOutNotes = function (callback) {
                goodsOutNotesService.getByOrder({dbName: db, order: objectId(id)}, callback);
            };

            removeGoods = function (ids, callback) {
                var options = {
                    ids   : ids,
                    dbName: db,
                    req   : req
                };
                goodsOutNote.removeByOrder(options, callback);
            };

            updateFields = function (callback) {
                callback();
                updateOnlySelectedFields(req, res, next, id, data);
            };

            waterfallTasks = [getGoodsOutNotes, removeGoods, updateFields];
            async.waterfall(waterfallTasks, function () {

            });

            return false;
        }

        if (data.orderDate) {

            ratesService.getById({dbName: db, id: data.orderDate}, function (err, oxr) {
                var currency = data.currency ? data.currency.name : 'USD';
                var rates;
                var base;

                oxr = oxr || {};
                rates = oxr.rates;
                base = oxr.base || 'USD';
                data.currency.rate = rates[currency][base] || 1;

                updateOnlySelectedFields(req, res, next, id, data);
            });
        } else {
            updateOnlySelectedFields(req, res, next, id, data);

        }
    };

    this.uploadFile = function (req, res, next) {
        var Order = models.get(req.session.lastDb, 'Order', OrderSchema);
        var headers = req.headers;
        var addNote = headers.addnote;
        var id = headers.modelid || 'empty';
        var contentType = headers.modelname || 'order';
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

                        user: {
                            _id  : req.session.uId,
                            login: req.session.uName
                        },

                        date: new Date()
                    };
                });
            }

            Order.findByIdAndUpdate(id, {
                $push: {
                    attachments: {$each: file},
                    notes      : {$each: notes}
                }
            }, {new: true}, function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Order updated success', data: response});
            });
        });
    };

    function getByViewType(req, res, next) {
        var Order = models.get(req.session.lastDb, 'Order', OrderSchema);
        var data = req.query;
        var quickSearch = data.quickSearch;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;
        var contentType = data.contentType;
        var sort = {};
        var filter = data.filter || {};
        var key;
        var queryObject = {};
        var optionsObject = {};
        var matchObject = {};
        var regExp;
        var pastDue = filter.pastDue;

        if (quickSearch) {
            regExp = new RegExp(quickSearch, 'ig');
            matchObject['supplier.name'] = {$regex: regExp};
        }

        queryObject.$and = [];

        if (filter && typeof filter === 'object') {
            queryObject.$and.push(filterMapper.mapFilter(filter, {contentType: contentType})); // caseFilter(filter);
        }

        if (data.sort) {
            key = Object.keys(data.sort)[0];
            data.sort[key] = parseInt(data.sort[key], 10);
            sort = data.sort;
        } else {
            sort = {orderDate: -1};
        }

        if (contentType !== 'order' && contentType !== 'integrationUnlinkedOrders') {
            Order = models.get(req.session.lastDb, 'purchaseOrders', purchaseOrdersSchema);

            queryObject.$and.push({_type: 'purchaseOrders'});
        } else {
            queryObject.$and.push({_type: 'Order'});
        }

        if (pastDue) {
            optionsObject.$and.push({expectedDate: {$gt: new Date(filter.date.value[1])}}, {'workflow.status': {$ne: 'Done'}});
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Order, cb);
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
                                $lte: ['$$projectMember.startDate', '$orderDate']
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }, {
                            $and: [{
                                $eq: ['$$projectMember.startDate', null]
                            }, {
                                $gte: ['$$projectMember.endDate', '$orderDate']
                            }]
                        }, {
                            $and: [{
                                $lte: ['$$projectMember.startDate', '$orderDate']
                            }, {
                                $gte: ['$$projectMember.endDate', '$orderDate']
                            }]
                        }]
                    }]
            };

            /*if (queryObject && queryObject.$and && queryObject.$and.length && queryObject.$and[0].name) {
             queryObject.$and[0] = {
             name: queryObject.$and[0].name.$in[0]
             };
             }*/

            newQueryObj.$and = [];
            newQueryObj.$and.push(queryObject);
            newQueryObj.$and.push({_id: {$in: ids}});

            //console.log(JSON.stringify(newQueryObj));
            Order.aggregate([{
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
                    as          : 'payments'
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
                $lookup: {
                    from        : 'Project',
                    localField  : 'project',
                    foreignField: '_id',
                    as          : 'project'
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
                    from        : 'integrations',
                    localField  : 'channel',
                    foreignField: '_id',
                    as          : 'channel'
                }
            }, {
                $project: {
                    workflow       : {$arrayElemAt: ['$workflow', 0]},
                    supplier       : {$arrayElemAt: ['$supplier', 0]},
                    'currency._id' : {$arrayElemAt: ['$currency._id', 0]},
                    payments       : 1,
                    'currency.rate': 1,
                    salesManagers  : {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : salesManagerMatch
                        }
                    },

                    channel    : {$arrayElemAt: ['$channel', 0]},
                    salesPerson: {$arrayElemAt: ['$salesPerson', 0]},
                    orderRows  : 1,
                    paymentInfo: 1,
                    orderDate  : 1,
                    name       : 1,
                    status     : 1,
                    _type      : 1,
                    forSales   : 1
                }
            }, {
                $project: {
                    salesManager: {$arrayElemAt: ['$salesManagers', 0]},
                    supplier    : {
                        _id : '$supplier._id',
                        name: {$concat: ['$supplier.name.first', ' ', '$supplier.name.last']}
                    },

                    workflow: {
                        _id   : '$workflow._id',
                        status: '$workflow.status',
                        name  : '$workflow.name'
                    },

                    tempWorkflow: {
                        _id   : '$tempWorkflow._id',
                        status: '$tempWorkflow.status'
                    },

                    channel: {
                        _id : '$channel._id',
                        name: '$channel.channelName',
                        type: '$channel.type'
                    },

                    currency       : 1,
                    paymentInfo    : 1,
                    orderDate      : 1,
                    salesPerson    : 1,
                    name           : 1,
                    isOrder        : 1,
                    proformaCounter: 1,
                    payments       : 1,
                    status         : 1,
                    _type          : 1,
                    forSales       : 1
                }
            }, {
                $match: matchObject
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesManager.employeeId',
                    foreignField: '_id',
                    as          : 'salesManager'
                }
            }, {
                $project: {
                    salesPerson : {$ifNull: ['$salesPerson', {$arrayElemAt: ['$salesManager', 0]}]},
                    workflow    : 1,
                    tempWorkflow: 1,
                    supplier    : 1,
                    currency    : 1,
                    paymentInfo : 1,
                    orderDate   : 1,
                    payments    : 1,
                    name        : 1,
                    status      : 1,
                    _type       : 1,
                    forSales    : 1,
                    channel     : 1
                }
            }, {
                $project: {
                    salesPerson : {
                        _id : '$salesPerson._id',
                        name: {$concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']}
                    },
                    workflow    : 1,
                    tempWorkflow: 1,
                    supplier    : 1,
                    currency    : 1,
                    paymentInfo : 1,
                    orderDate   : 1,
                    name        : 1,
                    status      : 1,
                    _type       : 1,
                    forSales    : 1,
                    channel     : 1,
                    payments    : 1,
                    removable   : {
                        $cond: {
                            if  : {$or: [{$eq: ['$workflow.status', 'Done']}, {$eq: ['$tempWorkflow.status', 'Done']}, {$and: [{$ne: ['$status.fulfillStatus', 'NOR']}, {$ne: ['$status.fulfillStatus', 'NOT']}]}]},
                            then: false,
                            else: true
                        }
                    }
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
                    _id        : '$root._id',
                    salesPerson: '$root.salesPerson',
                    workflow   : '$root.workflow',
                    supplier   : '$root.supplier',
                    currency   : '$root.currency',
                    paymentInfo: '$root.paymentInfo',
                    orderDate  : '$root.orderDate',
                    name       : '$root.name',
                    status     : '$root.status',
                    removable  : '$root.removable',
                    channel    : '$root.channel',
                    payments   : '$root.payments',
                    total      : 1
                }
            }, {
                $unwind: {
                    path                      : '$payments',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    salesPerson          : 1,
                    workflow             : 1,
                    supplier             : 1,
                    currency             : 1,
                    paymentInfo          : 1,
                    orderDate            : 1,
                    name                 : 1,
                    status               : 1,
                    removable            : 1,
                    channel              : 1,
                    total                : 1,
                    'payments.currency'  : 1,
                    'payments.paidAmount': {$cond: [{$eq: ['$payments.refund', true]}, {$multiply: ['$payments.paidAmount', -1]}, '$payments.paidAmount']}
                }
            }, {
                $group: {
                    _id         : '$_id',
                    salesPerson : {$first: '$salesPerson'},
                    workflow    : {$first: '$workflow'},
                    supplier    : {$first: '$supplier'},
                    currency    : {$first: '$currency'},
                    paymentInfo : {$first: '$paymentInfo'},
                    orderDate   : {$first: '$orderDate'},
                    name        : {$first: '$name'},
                    status      : {$first: '$status'},
                    removable   : {$first: '$removable'},
                    channel     : {$first: '$channel'},
                    paymentsPaid: {$sum: {$divide: ['$payments.paidAmount', '$payments.currency.rate']}},
                    total       : {$first: '$total'}
                }
            }, {
                $project: {
                    salesPerson   : 1,
                    workflow      : 1,
                    supplier      : 1,
                    currency      : 1,
                    paymentInfo   : 1,
                    orderDate     : 1,
                    name          : 1,
                    status        : 1,
                    removable     : 1,
                    channel       : 1,
                    paymentsPaid  : 1,
                    paymentBalance: {$subtract: ['$paymentInfo.total', '$paymentsPaid']},
                    total         : 1
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
            response.count = result.length;
            response.data = result;

            //console.log(result);

            res.status(200).send(response);
        });
    }

    function getAvailableForRows(req, docs, forSales, cb) {
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
                                    product      : 1,
                                    warehouse    : 1,
                                    onHand       : 1,
                                    filterRows   : {
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
                                $unwind: {
                                    path                      : '$goodsOutNotes',
                                    preserveNullAndEmptyArrays: true
                                }
                            }, {
                                $lookup: {
                                    from        : 'GoodsNote',
                                    localField  : 'goodsOutNotes.goodsNoteId',
                                    foreignField: '_id',
                                    as          : 'goodsOutNotes.goodsNoteId'
                                }
                            }, {
                                $project: {
                                    product    : 1,
                                    warehouse  : 1,
                                    onHand     : 1,
                                    filterRows : 1,
                                    orderRows  : 1,
                                    goodsNoteId: {$arrayElemAt: ['$goodsOutNotes.goodsNoteId', 0]},
                                    quantity   : '$goodsOutNotes.quantity'
                                }
                            }, {
                                $project: {
                                    product    : 1,
                                    warehouse  : 1,
                                    onHand     : 1,
                                    filterRows : 1,
                                    quantity   : 1,
                                    goodsNoteId: 1,
                                    allocated  : {
                                        $sum: '$filterRows.quantity'
                                    },

                                    allocatedAll: {
                                        $sum: '$orderRows.quantity'
                                    }
                                }
                            }, {
                                $group: {
                                    _id         : '$goodsNoteId.status.shipped',
                                    product     : {$first: '$product'},
                                    warehouse   : {$first: '$warehouse'},
                                    onHand      : {$sum: '$onHand'},
                                    filterRows  : {$first: '$filterRows'},
                                    allocatedAll: {$first: '$allocatedAll'},
                                    allocated   : {$first: '$allocated'},
                                    quantity    : {$sum: '$quantity'}
                                }
                            }],
                            function (err, availability) {
                                var availObj = {
                                    inStock: 0
                                };

                                if (err) {
                                    return parallelCb(err);
                                }

                                availability.forEach(function (el) {
                                    availObj.product = el.product;
                                    availObj.warehouse = el.warehouse;
                                    availObj.onHand = el.onHand;
                                    availObj.filterRows = el.filterRows;
                                    availObj.allocatedAll = el.allocatedAll;
                                    availObj.allocated = el.allocated;

                                    if (!el._id) {
                                        availObj.inStock += el.quantity;
                                    }
                                });

                                availObj.inStock += availObj.onHand;

                                parallelCb(null, [availObj]);
                            }
                        );
                    }

                    function getNotes(parallelCb) {
                        var Model = forSales ? GoodsOutNote : GoodsInNote;

                        Model.aggregate([{
                            $match: {
                                'orderRows.orderRowId': elem._id,
                                _type                 : forSales ? 'GoodsOutNote' : 'GoodsInNote',
                                archived              : {$ne: true}
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
                                from        : 'productsAvailability',
                                localField  : '_id',
                                foreignField: 'goodsInNote',
                                as          : 'goodsInNote'
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

                                goodsInNote         : {$arrayElemAt: ['$goodsInNote', 0]},
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
                                'status.receivedOn' : 1,
                                'status.shipped'    : 1,
                                'status.picked'     : 1,
                                'status.packed'     : 1,
                                'status.printed'    : 1
                            }
                        }, {
                            $project: {
                                name                : '$name',
                                orderRow            : {$arrayElemAt: ['$orderRow', 0]},
                                status              : 1,
                                warehouse           : 1,
                                'goodsInNote._id'   : 1,
                                'goodsInNote.onHand': 1,
                                'order.name'        : 1
                            }
                        }, {
                            $project: {
                                name        : '$name',
                                orderRow    : '$orderRow.orderRowId',
                                quantity    : '$orderRow.quantity',
                                status      : 1,
                                warehouse   : 1,
                                goodsInNote : 1,
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

                },
                function (err) {
                    if (err) {
                        return cb(err);
                    }

                    allGoodsNotes = _.uniq(allGoodsNotes, '_id');

                    cb(null, populateDocs, allGoodsNotes);

                }
            );
        } else {
            cb();
        }

    }

    function getById(req, res, next) {
        var id = req.query.id || req.params.id;
        var Order = models.get(req.session.lastDb, 'Order', OrderSchema);
        var manufacturingOrder = models.get(req.session.lastDb, 'manufacturingOrder', manufacturingOrderSchema);
        var Prepayments = models.get(req.session.lastDb, 'prepayment', PrepaymentSchema);
        var OrderRows = models.get(req.session.lastDb, 'orderRows', OrderRowsSchema);
        var Invoice = models.get(req.session.lastDb, 'Invoices', InvoiceSchema);
        var departmentSearcher;
        var contentIdsSearcher;
        var orderRowsSearcher;
        var contentSearcher;
        var prepaymentsSearcher;
        var invoiceSearcher;
        var stockReturnsSearcher;
        var waterfallTasks;
        var goodsId = req.query.goodsId;
        var type = req.query.type;
        var Model;
        var isManufacturing = false;

        if (goodsId) {
            id = goodsId;
        }

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

            var Model = models.get(req.session.lastDb, 'Order', OrderSchema);

            Model.aggregate({
                $match: matchQuery
            }, {
                $project: {
                    _id: 1
                }
            }, waterfallCallback);
        };

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var query;

            if (goodsId) {
                goodsOutNotesService.findOne({_id: goodsId}, {dbName: req.session.lastDb}, function (err, goodsNote) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    id = goodsNote.order;
                    Model = Order;

                    if (!goodsNote.order && goodsNote.manufacturingOrder) {
                        id = goodsNote.manufacturingOrder;

                        Model = manufacturingOrder;

                        isManufacturing = true;
                    }

                    query = Model.findById(id);

                    query
                        .populate('supplier', '_id name fullName address')
                        .populate('destination')
                        .populate('currency._id')
                        .populate('incoterm')
                        .populate('priceList', 'name')
                        .populate('costList', 'name')
                        .populate('warehouse', 'name')
                        .populate('salesPerson', 'name')
                        .populate('invoiceControl')
                        .populate('paymentTerm')
                        .populate('paymentMethod', '_id name account bank address swiftCode owner')
                        .populate('editedBy.user', '_id login')
                        .populate('deliverTo', '_id, name')
                        .populate('project', '_id name')
                        .populate('shippingMethod', '_id name')
                        .populate('workflow', '_id name status');

                    query.exec(waterfallCallback);
                })
            } else {
                query = Order.findById(id);

                query
                    .populate('supplier', '_id name fullName address')
                    .populate('destination')
                    .populate('currency._id')
                    .populate('incoterm')
                    .populate('priceList', 'name')
                    .populate('costList', 'name')
                    .populate('warehouse', 'name')
                    .populate('salesPerson', 'name')
                    .populate('invoiceControl')
                    .populate('paymentTerm')
                    .populate('paymentMethod', '_id name account bank address swiftCode owner')
                    .populate('editedBy.user', '_id login')
                    .populate('deliverTo', '_id, name')
                    .populate('project', '_id name')
                    .populate('shippingMethod', '_id name')
                    .populate('workflow', '_id name status');

                query.exec(waterfallCallback);
            }
        };

        orderRowsSearcher = function (order, waterfallCallback) {
            var query = {order: order && order._id};

            if (manufacturingOrder) {
                query.isFromManufacturingForReceive = true;
            }

            OrderRows.find(query)
                .populate('product', 'cost name sku info')
                .populate('debitAccount', 'name')
                .populate('creditAccount', 'name')
                .populate('taxes.taxCode', 'fullName rate')
                .populate('warehouse', 'name')
                .sort('products')
                .exec(function (err, docs) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    order = order ? order.toJSON() : {}

                    getAvailableForRows(req, docs, order.forSales, function (err, docs, goodsNotes) {
                        if (err) {
                            return waterfallCallback(err);
                        }

                        order.products = docs;
                        order.account = docs && docs.length ? docs[0].debitAccount : {};

                        if (!order.forSales) {
                            order.account = docs && docs.length ? docs[0].creditAccount : {};
                        }

                        order.goodsNotes = goodsNotes;

                        waterfallCallback(null, order);
                    });

                });
        };

        prepaymentsSearcher = function (order, waterfallCallback) {
            Prepayments.aggregate([{
                $match: {
                    order: objectId(id)
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

                order.prepayment = result && result.length ? result[0] : {};

                waterfallCallback(null, order);
            });
        };

        invoiceSearcher = function (order, waterfallCallback) {
            Invoice.aggregate([{
                $match: {
                    sourceDocument: objectId(id)
                }
            }, {
                $project: {
                    name: 1
                }
            }], function (err, result) {
                if (err) {
                    return waterfallCallback(err);
                }

                order.invoice = result && result.length ? result[0] : {};
                waterfallCallback(null, order);
            });
        };

        stockReturnsSearcher = function (order, waterfallCallback) {
            StockReturnsService.findForOrder({
                query : {order: objectId(order._id)},
                dbName: req.session.lastDb
            }, function (err, docs) {
                if (err) {
                    return waterfallCallback(err);
                }

                order.stockReturns = docs || [];

                waterfallCallback(null, order);
            })
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher, orderRowsSearcher, prepaymentsSearcher, invoiceSearcher, stockReturnsSearcher];

        async.waterfall(waterfallTasks, function (err, result) {

            if (err) {
                return next(err);
            }

            getHistory(req, result, function (err, order) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(order);
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
        var Order = models.get(req.session.lastDb, 'Order', OrderSchema);
        var OrderRows = models.get(req.session.lastDb, 'orderRows', OrderRowsSchema);
        var GoodsOutNote = models.get(req.session.lastDb, 'GoodsOutNote', GoodsOutSchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var Availability = models.get(req.session.lastDb, 'productsAvailability', AvailabilitySchema);
        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        Order.findByIdAndRemove(id, function (err, order) {
            if (err) {
                return next(err);
            }

            OrderRows.find({order: id}).populate('product', 'job').exec(function (err, docs) {
                    if (err) {
                        return next(err);
                    }

                    GoodsOutNote.remove({order: order._id}, function () {
                    });

                    async.each(docs, function (orderRow, cb) {
                        if (!orderRow.product.job) {
                            return cb();
                        }

                        Availability.update({product: orderRow.product._id}, {$set: {onHand: 1}}, function (err) {
                            if (err) {
                                return cb(err);
                            }

                            JobsModel.findByIdAndUpdate(orderRow.product.job, {
                                type    : type,
                                order   : null,
                                editedBy: editedBy
                            }, {new: true}, function (err, result) {
                                var wTracks;

                                if (err) {
                                    return cb(err);
                                }

                                project = result ? result.get('project') : null;
                                wTracks = result ? result.wTracks : [];

                                async.each(wTracks, function (wTr, callback) {
                                    wTrack.findByIdAndUpdate(wTr, {$set: {revenue: 0}}, callback);
                                }, function () {
                                    cb();
                                });
                            });
                        });

                    }, function () {
                        OrderRows.remove({order: id}, function (err) {
                            if (err) {
                                return next(err);
                            }
                        });

                        res.status(200).send({success: order});
                    });
                }
            );
        });
    };

    this.getForProject = function (req, res, next) {
        var db = req.session.lastDb;
        var projectId = req.params.id;
        var Order = models.get(db, 'Order', OrderSchema);
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

        if (projectId) {
            queryObject.project = projectId;
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

            Order.aggregate([{
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

            Order
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

                        paymentInfo: 1,
                        orderDate  : 1,
                        name       : 1,
                        status     : 1
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

                        currency   : 1,
                        paymentInfo: 1,
                        orderDate  : 1,
                        status     : 1,
                        name       : 1
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
                        currency   : 1,
                        paymentInfo: 1,
                        orderDate  : 1,
                        name       : 1,
                        status     : 1
                    }
                }, {
                    $project: {
                        salesPerson: {
                            _id : '$salesPerson._id',
                            name: '$salesPerson.name'
                        },

                        workflow   : 1,
                        supplier   : 1,
                        currency   : 1,
                        paymentInfo: 1,
                        orderDate  : 1,
                        name       : 1,
                        status     : 1,
                        removable  : {
                            $cond: {
                                if  : {$and: [{$ne: ['$workflow.status', 'Done']}, {$ne: ['$status.fulfillStatus', 'ALL']}]},
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
                        _id        : '$root._id',
                        salesPerson: '$root.salesPerson',
                        workflow   : '$root.workflow',
                        supplier   : '$root.supplier',
                        currency   : '$root.currency',
                        paymentInfo: '$root.paymentInfo',
                        orderDate  : '$root.orderDate',
                        status     : '$root.status',
                        name       : '$root.name',
                        removable  : '$root.removable',
                        total      : 1
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

    this.bulkRemove = function (req, res, next) {
        var db = req.session.lastDb;
        var Order = models.get(db, 'Order', OrderSchema);
        var OrderRows = models.get(db, 'orderRows', OrderRowsSchema);
        var GoodsOutNote = models.get(req.session.lastDb, 'GoodsOutNote', GoodsOutSchema);

        var body = req.body || {ids: []};
        var ids = body.ids;

        // todo some validation on ids array, like check for objectId

        Order.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            OrderRows.remove({order: {$in: ids}}, function (err, docs) {
                if (err) {
                    return next(err);
                }

                integrationStatsHelper(db, function (err, stats) {
                    if (err) {
                        return next(err);
                    }

                    ConflictsService.remove({'fields.order': {$in: ids}}, {dbName: db}, function () {
                        if (err) {
                            return next(err);
                        }

                        event.emit('recollectedStats', {dbName: db, stats: stats});
                        redis.writeToStorage('syncStats', db, JSON.stringify(stats));

                        GoodsOutNote.find({order: {$in: ids}}, function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            async.each(result, function (el, cb) {
                                goodsOutNotesService.remove({dbName: db, id: el._id}, cb)
                            }, function (err) {
                                if (err) {
                                    return next(err);
                                }

                                res.status(200).send(removed);
                            });
                        });
                    });
                });
            });

        });
    };

    this.getTotalForDashboard = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Order = models.get(req.session.lastDb, 'Order', OrderSchema);
        var data = req.query;
        var forSales = data.forSales === 'true';
        var filter = data.filter || {};
        var match = filterMapper.mapFilter(filter, {contentType: orderCT});

        if (!forSales) {
            Order = models.get(dbIndex, purchaseOrderCT, purchaseOrdersSchema);
            match = filterMapper.mapFilter(filter, {contentType: purchaseOrderCT});
        }

        Order.aggregate([{
            $match: match
        }, {
            $match: {
                forSales: forSales
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result.length});
        });
    };

    this.getByStatus = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Order = models.get(req.session.lastDb, 'Order', OrderSchema);
        var data = req.query;
        var forSales = data.forSales === 'true';
        var total = data.total === 'true';
        var filter = data.filter || {};
        var match = filterMapper.mapFilter(filter, {contentType: orderCT});
        var secondMatch;

        if (!forSales) {
            Order = models.get(dbIndex, purchaseOrderCT, purchaseOrdersSchema);
            match = filterMapper.mapFilter(filter, {contentType: purchaseOrderCT});
        }

        if (forSales) {
            if (total) {
                secondMatch = {
                    'status.shippingStatus': 'ALL'
                }
            } else {
                secondMatch = {
                    'status.shippingStatus': 'NOA'
                }
            }
        } else {
            if (total) {
                secondMatch = {
                    'status.fulfillStatus': 'ALL'
                }
            } else {
                secondMatch = {
                    'status.fulfillStatus': 'NOA'
                }
            }
        }

        Order.aggregate([{
            $match: match
        }, {
            $match: {
                forSales: forSales
            }
        }, {
            $match: secondMatch
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result.length});
        });
    };

    this.getByWorkflows = function (req, res, next) {
        var dbIndex = req.session.lastDb;
        var Order = models.get(req.session.lastDb, 'Order', OrderSchema);
        var data = req.query;
        var forSales = data.forSales === 'true';
        var filter = data.filter || {};
        var match = filterMapper.mapFilter(filter, {contentType: orderCT});

        if (!forSales) {
            Order = models.get(dbIndex, purchaseOrderCT, purchaseOrdersSchema);
            match = filterMapper.mapFilter(filter, {contentType: purchaseOrderCT});
        }

        Order.aggregate([{
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
                'currency.rate': {$ifNull: [1, '$currency.rate']},
                workflow       : 1,
                status         : 1
            }
        }, {
            $project: {
                sum     : {$divide: ['$paymentInfo.total', '$currency.rate']},
                workflow: {$arrayElemAt: ['$workflow', 0]},
                status  : 1
            }
        }, {
            $group: {
                _id   : '$workflow._id',
                total : {$sum: '$sum'},
                status: {$addToSet: '$status'},
                name  : {$first: '$workflow.name'},
                count : {$sum: 1}
            }
        }, {
            $project: {
                total : {$divide: ['$total', 100]},
                name  : 1,
                count : 1,
                status: 1
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

};

module.exports = Module;
