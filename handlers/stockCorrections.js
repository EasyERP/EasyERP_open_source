var async = require('async');
var stockCorrections;
stockCorrections = function (models, event) {
    'use strict';

    var mongoose = require('mongoose');

    var AvailabilitySchema = mongoose.Schemas.productsAvailability;
    var StockCorrectionsSchema = mongoose.Schemas.stockCorrection;
    var GoodsOutSchema = mongoose.Schemas.GoodsOutNote;
    var objectId = mongoose.Types.ObjectId;
    var StockCorrectionService = require('../services/stockCorrection')(models);
    var AvailabilityService = require('../services/productAvailability')(models);

    this.create = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var options = {
            body  : body,
            dbName: dbName
        };

        body.createdBy = {
            user: req.session.uId
        };

        StockCorrectionService.create(options, function (err, doc) {
            if (err) {
                return next(err);
            }

            function callback(err) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(doc);
            }

            async.each(body.orderRows, function (elem, eachCb) {
                var options;

                if (elem.quantity <= 0) {
                    options = {
                        query: {
                            location: body.location,
                            product : elem.product
                        },

                        dbName: dbName
                    };

                    AvailabilityService.find(options, function (err, docs) {

                        var lastQuantity = elem.quantity;

                        if (err) {
                            return eachCb(err);
                        }

                        if (docs.length) {

                            async.each(docs, function (doc, eachChildCb) {
                                var optionsEach;

                                if (lastQuantity > 0) {
                                    return eachChildCb();
                                }

                                lastQuantity += doc.onHand;

                                if ((!lastQuantity || lastQuantity < 0) && !doc.orderRows.length && !doc.goodsOutNotes.length) {
                                    optionsEach = {
                                        query: {
                                            _id: doc._id
                                        },

                                        body: {$set: {archived: true}},

                                        dbName: dbName
                                    };
                                    AvailabilityService.updateByQuery(optionsEach, function (err, doc) {
                                        if (err) {
                                            return eachChildCb(err);
                                        }

                                        eachChildCb();
                                    });
                                } else {
                                    optionsEach = {
                                        body: {
                                            onHand: lastQuantity
                                        },

                                        query: {
                                            _id: doc._id
                                        },

                                        dbName: dbName
                                    };
                                    AvailabilityService.updateByQuery(optionsEach, function (err, doc) {
                                        if (err) {
                                            return eachChildCb(err);
                                        }

                                        eachChildCb();
                                    });
                                }

                            }, function (err) {
                                if (err) {
                                    return eachCb(err);
                                }
                                eachCb();
                            });
                        } else {
                            eachCb();
                        }

                    });
                } else {
                    options = {
                        dbName: dbName,
                        body  : {
                            location   : body.location,
                            warehouse  : body.warehouse,
                            goodsInNote: doc._id,
                            product    : elem.product,
                            onHand     : elem.quantity,
                            cost       : elem.cost
                        }
                    };

                    AvailabilityService.create(options, function (err, doc) {
                        if (err) {
                            return eachCb(err);
                        }

                        eachCb();
                    });
                }

            }, callback);

        });
    };

    this.allocate = function (req, res, next) {
        var body = req.body;
        var Availability = models.get(req.session.lastDb, 'productsAvailability', AvailabilitySchema);
        var GoodsOutNote = models.get(req.session.lastDb, 'GoodsOutNote', GoodsOutSchema);
        var orderId = body.order;

        async.each(body.data, function (elem, eachCb) {

            var lastSum = elem.quantity;
            var isFilled;

            Availability.find({
                warehouse: elem.warehouse,
                product  : elem.product
            }, function (err, avalabilities) {
                if (err) {
                    return eachCb(err);
                }
                if (avalabilities.length) {
                    async.each(avalabilities, function (availability, cb) {
                        var allocated = 0;
                        var resultOnHand;
                        var existedRow = {
                            quantity: 0
                        };

                        var allOnHand;

                        availability.orderRows.forEach(function (orderRow) {
                            if (orderRow.orderRowId.toJSON() === elem.orderRowId) {
                                existedRow = orderRow;
                            } else {
                                allocated += orderRow.quantity;
                            }
                        });

                        if (isFilled && elem.quantity) {
                            return cb();
                        }

                        allOnHand = availability.onHand + existedRow.quantity;

                        if (!allOnHand) {
                            return cb();
                        }

                        resultOnHand = allOnHand - lastSum;

                        if (resultOnHand < 0) {
                            lastSum = Math.abs(resultOnHand);
                            resultOnHand = 0;
                        } else {
                            isFilled = true;
                        }

                        if (existedRow.orderRowId) {

                            if (!elem.quantity) {
                                Availability.update({_id: availability._id}, {
                                    $inc : {
                                        onHand: existedRow.quantity
                                    },
                                    $pull: {
                                        orderRows: {orderRowId: existedRow.orderRowId}
                                    }
                                }, function (err) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    cb();
                                });
                            } else {
                                Availability.update({
                                    _id                   : availability._id,
                                    'orderRows.orderRowId': existedRow.orderRowId
                                }, {
                                    'orderRows.$.quantity': resultOnHand ? lastSum : allOnHand,
                                    onHand                : resultOnHand
                                }, function (err) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    cb();
                                });
                            }

                        } else if (elem.quantity) {
                            Availability.findByIdAndUpdate(availability._id, {
                                $addToSet: {
                                    orderRows: {
                                        orderRowId: elem.orderRowId,
                                        quantity  : resultOnHand ? lastSum : allOnHand
                                    }
                                }, onHand: resultOnHand
                            }, function (err) {
                                if (err) {
                                    return cb(err);
                                }
                                cb();
                            });
                        } else {
                            cb();
                        }
                    }, function (err) {
                        if (err) {
                            return eachCb(err);
                        }
                        eachCb();
                    });
                } else {
                    eachCb();
                }
            });

        }, function (err) {
            if (err) {
                return next(err);
            }

            event.emit('recalculateStatus', req, orderId, next);
            res.status(200).send({success: 'Products updated'});
        });

    };

    this.getCorrections = function (req, res, next) {
        var data = req.query;
        var limit = parseInt(data.count, 10);
        var skip = (parseInt(data.page || 1, 10) - 1) * limit;
        var obj = {};
        var addObj = {};
        var StockCorrection = models.get(req.session.lastDb, 'stockCorrections', StockCorrectionsSchema);
        /* var filterMapper = new FilterMapper();*/

        var keys;
        var sort;

        obj.$and = [];
        obj.$and.push({_type: 'stockCorrections'});

        /*if (data && data.filter) {

         obj.$and.push(filterMapper.mapFilter(data.filter, 'DealTasks'));
         }*/

        if (data.sort) {
            keys = Object.keys(data.sort)[0];
            data.sort[keys] = parseInt(data.sort[keys], 10);
            sort = data.sort;
        } else {
            sort = {'editedBy.date': -1};
        }

        StockCorrection
            .aggregate([
                {
                    $match: obj
                },
                {
                    $lookup: {
                        from        : 'warehouse',
                        localField  : 'warehouse',
                        foreignField: '_id',
                        as          : 'warehouse'
                    }
                },
                {
                    $lookup: {
                        from        : 'locations',
                        localField  : 'location',
                        foreignField: '_id',
                        as          : 'location'
                    }
                },
                {
                    $lookup: {
                        from        : 'Users',
                        localField  : 'createdBy.user',
                        foreignField: '_id',
                        as          : 'createdBy.user'
                    }
                },
                {
                    $project: {
                        _id             : 1,
                        location        : {$arrayElemAt: ['$location', 0]},
                        warehouse       : {$arrayElemAt: ['$warehouse', 0]},
                        'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
                        'createdBy.date': 1,
                        'editedBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
                        'editedBy.date': 1,
                        description     : 1
                    }
                },
                {
                    $group: {
                        _id  : null,
                        total: {$sum: 1},
                        root : {$push: '$$ROOT'}
                    }
                },
                {
                    $unwind: '$root'
                },
                {
                    $project: {
                        _id        : '$root._id',
                        location   : '$root.location',
                        warehouse  : '$root.warehouse',
                        createdBy  : '$root.createdBy',
                        editedBy   : '$root.editedBy',
                        description: '$root.description',
                        total      : 1
                    }
                },
                {
                    $sort: sort
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }
            ], function (err, result) {
                var count;
                var response = {};

                if (err) {
                    return next(err);
                }

                count = result[0] && result[0].total ? result[0].total : 0;

                response.total = count;
                response.data = result;

                res.status(200).send(response);
            });

    };

    this.getById = function (req, res, next) {
        var id = req.params.id;
        var StockCorrection = models.get(req.session.lastDb, 'stockCorrections', StockCorrectionsSchema);

        StockCorrection.findById(id)
            .populate('warehouse', ' name')
            .populate('location', ' name')
            .populate('orderRows.product', ' name')
            .populate('createdBy.user', 'login')
            .exec(function (err, correction) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(correction);
            });
    };

    this.getProductsAvailable = function (req, res, next) {
        var Availability = models.get(req.session.lastDb, 'productsAvailability', AvailabilitySchema);
        var queryObject = req.query;
        var product = queryObject.product;
        var warehouseFrom = queryObject.warehouse;
        var warehouseTo = queryObject.warehouseTo;
        var location = queryObject.location;
        var queryFrom;
        var queryTo;

        queryFrom = {
            warehouse: objectId(warehouseFrom),
            product  : objectId(product)
        };

        queryTo = {
            warehouse: objectId(warehouseTo),
            product  : objectId(product)
        };

        if (location) {
            queryFrom.location = objectId(location);
            queryTo.location = objectId(location);

            delete queryFrom.warehouse;
            delete queryTo.warehouse;
        }

        function getAvailabilityFrom(pCb) {
            Availability.aggregate([{
                $match: queryFrom
            }, {
                $lookup: {
                    from        : 'Products',
                    localField  : 'product',
                    foreignField: '_id',
                    as          : 'product'
                }
            }, {
                $project: {
                    product  : {$arrayElemAt: ['$product', 0]},
                    warehouse: 1,
                    onHand   : 1
                }

            }, {
                $group: {
                    _id    : '$warehouse',
                    onHand : {$sum: '$onHand'},
                    product: {$first: '$product'}
                }
            }], function (err, availability) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, availability && availability.length ? availability[0] : {});
            });
        }

        function getAvailabilityTo(pCb) {
            Availability.aggregate([{
                $match: queryTo
            }, {
                $lookup: {
                    from        : 'Products',
                    localField  : 'product',
                    foreignField: '_id',
                    as          : 'product'
                }
            }, {
                $project: {
                    warehouse: 1,
                    onHand   : 1
                }

            }, {
                $group: {
                    _id   : '$warehouse',
                    onHand: {$sum: '$onHand'}
                }
            }], function (err, availability) {
                if (err) {
                    return pCb(err);
                }

                pCb(null, availability && availability.length ? availability[0] : {});
            });
        }

        async.parallel({
            getAvailabilityFrom: getAvailabilityFrom,
            getAvailabilityTo  : getAvailabilityTo
        }, function (err, result) {
            var getAvailabilityFrom = result.getAvailabilityFrom;
            var getAvailabilityTo = result.getAvailabilityTo;
            var data = getAvailabilityFrom;

            if (err) {
                return next(err);
            }

            if (getAvailabilityTo && getAvailabilityTo.onHand) {
                data.destination = getAvailabilityTo.onHand;
            }

            res.status(200).send(data);
        });
    };

    this.bulkRemove = function (req, res, next) {
        var StockCorrection = models.get(req.session.lastDb, 'stockCorrections', StockCorrectionsSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        // todo some validation on ids array, like check for objectId

        StockCorrection.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
        });
    };

    this.remove = function (req, res, next) {
        var StockCorrection = models.get(req.session.lastDb, 'stockCorrections', StockCorrectionsSchema);
        var id = req.params.id;

        StockCorrection.findOneAndRemove({_id: id}, function (err, correction) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: correction});
        });
    };

};

module.exports = stockCorrections;
