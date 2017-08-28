var mongoose = require('mongoose');
var priceListSchema = mongoose.Schemas.PriceLists;
var ProductPricesSchema = mongoose.Schemas.ProductPrices;
var pageHelper = require('../helpers/pageHelper');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');

var Module = function (models) {

    this.get = function (req, res, next) {
        var PriceListModel = models.get(req.session.lastDb, 'PriceList', priceListSchema);
        var priceList;

        // TODO remake with filter skip and sort
        PriceListModel.aggregate([
            {
                $group: {
                    _id  : null,
                    root : {$push: '$$ROOT'},
                    total: {$sum: 1}
                }
            }, {
                $unwind: {
                    path                      : '$root',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    _id          : '$root._id',
                    total        : 1,
                    currency     : '$root.currency',
                    cost         : '$root.cost',
                    name         : '$root.name',
                    priceListCode: '$root.priceListCode'
                }
            }, {
                $lookup: {
                    from        : 'currency',
                    localField  : 'currency',
                    foreignField: '_id',
                    as          : 'currencies'
                }
            }, {
                $unwind: {
                    path: '$currencies',
                  preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    total         : 1,
                    name          : 1,
                    priceListCode : 1,
                    cost          : 1,
                    currencyId    : '$currencies._id',
                    currencyName  : '$currencies.name',
                    currencySymbol: '$currencies.symbol'
                }
            }, {
                $group: {
                    _id  : '$total',
                    data : {$push: '$$ROOT'},
                    total: {$first: '$total'}
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result.length) {
                priceList = {
                    total: 0,
                    data : []
                };
            } else {
                priceList = result[0];
            }

            res.status(200).send(priceList);
        });
    };

    function getById(req, res, next) {
        var PriceListModel = models.get(req.session.lastDb, 'PriceList', priceListSchema);
        var priceListId = req.params.id;

        PriceListModel.aggregate([{
            $match: {
                _id: ObjectId(priceListId)
            }
        }, {
            $lookup: {
                from        : 'currency',
                localField  : 'currency',
                foreignField: '_id',
                as          : 'currencies'
            }
        }, {
            $unwind: '$currencies'
        }, {
            $project: {
                total         : 1,
                name          : 1,
                priceListCode : 1,
                cost          : 1,
                currencyId    : '$currencies._id',
                currencyName  : '$currencies.name',
                currencySymbol: '$currencies.symbol'
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result[0]);
        });
    }

    this.getById = getById;

    this.create = function (req, res, next) {
        var body = req.body;
        var PriceListModel = models.get(req.session.lastDb, 'PriceList', priceListSchema);
        var priceList;
        var error;

        if (!body.name || !body.currencyId) {
            error = new Error('Please provide Price list name and currency');
            error.status = 404;
            return next(error);
        }

        if (body.currencyId) {
            body.currency = body.currencyId;
        }

        priceList = new PriceListModel(body);
        priceList.save(function (err, list) {
            if (err) {
                return next(err);
            }

            req.params.id = list._id;

            getById(req, res, next);

            /* res.status(200).send({success: 'Price list created', id: priceList._id});*/
        });
    };

    this.resetPrices = function (req, res, next) {

        var ProductPriceModel = models.get(req.session.lastDb, 'ProductPrice', ProductPricesSchema);
        var query = req.body;
        var priceList = query.priceList ? ObjectId(query.priceList) : null;
        var rows = [];
        var paymentInfo = {
            total: 0,
            cost : 0
        };

        if (query.rows && query.rows.length && query.priceList) {
            async.each(query.rows, function (elem, eachCb) {
                var product = elem.product ? ObjectId(elem.product) : null;

                var row = {
                    quantity  : elem.quantity,
                    orderRowId: elem.orderRowId,
                    product   : product
                };

                ProductPriceModel.aggregate([{
                    $match: {
                        priceLists: priceList,
                        product   : product
                    }
                }, {
                    $project: {
                        prices  : 1,
                        maxCount: {$max: '$prices.count'}
                    }
                }, {
                    $project: {
                        prices: {
                            $filter: {
                                input: '$prices',
                                as   : 'elem',
                                cond : {$gte: [elem.quantity, '$$elem.count']}
                            }
                        },

                        maxCount: 1
                    }
                }, {
                    $unwind: {
                        path                      : '$prices',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $sort: {
                        'prices.count': -1
                    }
                }, {
                    $group: {
                        _id     : null,
                        prices  : {$push: '$prices'},
                        maxCount: {$first: '$maxCount'}
                    }
                }, {
                    $project: {
                        prices: {$cond: [{$eq: [{$size: '$prices'}, 0]}, {price: '$maxCount'}, {$arrayElemAt: ['$prices', 0]}]}
                    }
                }, {
                    $project: {
                        prices: '$prices.price'
                    }
                }], function (err, elements) {
                    if (err) {
                        return eachCb(err);
                    }
                    row.price = elements && elements.length ? elements[0].prices : 0;
                    row.priceAll = row.price * elem.quantity;
                    paymentInfo.total += row.priceAll;

                    rows.push(row);
                    eachCb();
                });

            }, function (err) {
                var responseObject;

                if (err) {
                    return next(err);
                }

                responseObject = {
                    rows: rows,
                    info: paymentInfo
                };

                res.status(200).send(responseObject);
            });
        } else {
            res.status(404).send({});
        }

    };

    this.getPrices = function (req, res, next) {
        var ProductPriceModel = models.get(req.session.lastDb, 'ProductPrice', ProductPricesSchema);
        var query = req.query;
        var priceList = query.priceList ? ObjectId(query.priceList) : query.costList ? ObjectId(query.costList) : null;
        var responseObj = {};
        var product = query.product ? ObjectId(query.product) : null;
        var quantity = parseFloat(query.quantity);

        ProductPriceModel.aggregate([{
            $match: {
                priceLists: priceList,
                product   : product
            }
        }, {
            $project: {
                prices  : 1,
                maxCount: {$max: '$prices.count'}
            }
        }, {
            $project: {
                prices: {
                    $filter: {
                        input: '$prices',
                        as   : 'elem',
                        cond : {$gte: ['$$elem.count', quantity]}
                    }
                },

                maxCount: 1
            }
        }, {
            $project: {
                prices: {$cond: [{$eq: [{$size: '$prices'}, 0]}, {price: '$maxCount'}, {$arrayElemAt: ['$prices', 0]}]}
            }
        }, {
            $project: {
                prices: '$prices.price'
            }
        }], function (err, elements) {
            if (err) {
                return next(err);
            }

            responseObj.price = elements && elements.length ? elements[0].prices : 0;

            res.status(200).send(responseObj);

        });
    };

    this.getForProduct = function (req, res, next) {
        var PriceListModel = models.get(req.session.lastDb, 'PriceList', priceListSchema);

        PriceListModel.find({}, {priceListCode: 1, cost: 1}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getForDd = function (req, res, next) {
        var PriceListModel = models.get(req.session.lastDb, 'PriceList', priceListSchema);
        var query = req.query || {};

        PriceListModel.find(query, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.delete = function (req, res, next) {
        var PriceListModel = models.get(req.session.lastDb, 'PriceList', priceListSchema);
        var body = req.body || {ids: []};
        var ids = body.ids || [req.params.id];

        PriceListModel.remove({_id: {$in: ids}}, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Price list is deleted'});
        });
    };

    this.update = function (req, res, next) {
        var PriceListModel = models.get(req.session.lastDb, 'PriceList', priceListSchema);
        var body = req.body;
        var _id = req.params._id;

        if (body.currencyId) {
            body.currency = body.currencyId;
        }

        PriceListModel.findByIdAndUpdate(_id, body, {new: true}, function (err, list) {
            if (err) {
                return next(err);
            }

            req.params.id = list._id;

            getById(req, res, next);

            // res.status(200).send({success: 'Price list is updated success'});
        });
    };
};

module.exports = Module;
