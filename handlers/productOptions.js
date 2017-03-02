var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

var ProductOptions = function (models) {
    var ProductSchema = mongoose.Schemas.Products;
    var ProductsOptionsSchema = mongoose.Schemas.ProductOptions;
    var ProductsOptionsValuesSchema = mongoose.Schemas.ProductOptionsValues;
    var ProductTypesSchema = mongoose.Schemas.productTypes;
    var pageHelper = require('../helpers/pageHelper');
    var ObjectId = mongoose.Types.ObjectId;

    var productService = require('../services/products')(models);

    function updateTypesForOptions(ProductTypesModel, Product, modelId, checkedPrTypes, checkedNow, callback) {
        var deletedTypes = _.difference(checkedPrTypes, checkedNow);
        var addedTypes = _.difference(checkedNow, checkedPrTypes);
        var addingTypes = function (pCb) {
            if (addedTypes.length) {

                async.eachLimit(addedTypes, 1, function (item, eCb) {
                    ProductTypesModel.findByIdAndUpdate(item, {$push: {options: ObjectId(modelId)}}, {new: true}, function (err, result) {
                        if (err) {
                            return eCb(err);
                        }

                        eCb();
                    });

                }, function (err) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb();
                });
            } else {
                return pCb();
            }
        };

        var deletingTypes = function (pCb) {
            if (deletedTypes.length) {
                async.eachLimit(deletedTypes, 1, function (item, eCb) {
                    Product.find({'info.productType': item}, {name: 1}, function (err, result) {
                        if (err) {
                            return eCb(err);
                        }

                        if (!result || !result.length) {
                            ProductTypesModel.findByIdAndUpdate(item, {$pull: {options: ObjectId(modelId)}}, {new: true}, function (err, result) {
                                if (err) {
                                    return eCb(err);
                                }

                                return eCb();
                            });
                        } else {
                            err = new Error('Product with this product type aleady used');
                            err.status = 400;
                            return eCb(err);
                        }
                    });

                }, function (err) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null);
                });
            } else {
                return pCb(null);
            }
        };

        async.parallel([
            addingTypes,
            deletingTypes
        ], function (err) {
            if (err) {
                return callback(err);
            }

            callback();
        });
    }

    this.newVariants = function (req, res, next) {
        var db = req.session.lastDb;
        var body = req.body;
        var changedProduct = body.changedProductArr;

        if (!changedProduct || !changedProduct.length) {
            req.status(400).send();
        }

        async.each(changedProduct, function (product, eachCb) {
            productService.findOneAndUpdate({_id: product.product}, {$push: {variants: product.value}}, {dbName: db}, function (err, result) {
                if (err) {
                    return next(err);
                }

                eachCb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send();
        });
    };

    this.createOptions = function (req, res, next) {
        var body = req.body;
        var OptionsModel = models.get(req.session.lastDb, 'ProductOptions', ProductsOptionsSchema);
        var model;
        var err;

        if (!body.name) {
            err = new Error('Please provide Product Option name');
            err.status = 400;
            return next(err);
        }

        model = new OptionsModel(body);
        model.save(function (err, model) {
            if (err) {
                return next(err);
            }

            res.status(200).send(model);
        });
    };

    this.getProductVariants = function (req, res, next) {
        var db = req.session.lastDb;
        var params = req.params;
        var groupId = params.id;

        productService.find({groupId: groupId}, {
            dbName    : db,
            name      : 1,
            'info.SKU': 1,
            variants  : 1,
            imageSrc  : 1
        }, function (err, products) {
            if (err) {
                return next(err);
            }

            res.status(200).send(products);
        });
    };

    this.updateOptions = function (req, res, next) {
        var OptionsModel = models.get(req.session.lastDb, 'ProductOptions', ProductsOptionsSchema);
        var ProductTypesModel = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema);
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var body = req.body;
        var _id = req.params._id;
        var data = {
            name: body.name
        };

        async.parallel([
            function (pCb) {
                OptionsModel.findByIdAndUpdate(_id, data, {new: true}, function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb();
                });
            },
            function (pCb) {
                updateTypesForOptions(ProductTypesModel, Product, _id, body.checkedPrTypes, body.checkedNow, pCb);
            }
        ], function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Options update is success'});
        });

    };

    this.deleteOptions = function (req, res, next) {
        var ProductTypesModel = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema);
        var OptionsModel = models.get(req.session.lastDb, 'ProductOptions', ProductsOptionsSchema);
        var OptionsValuesModel = models.get(req.session.lastDb, 'ProductOptionsValues', ProductsOptionsValuesSchema);
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var id = req.params.id;
        var ids = [id];
        var variantsIds = [];
        var error;

        var deletingWithProductTypes = function (wCb) {
            ProductTypesModel.find({}, function (err, result) {
                if (err) {
                    return wCb(err);
                }

                if (result.length) {
                    async.eachLimit(result, 3, function (item, eCb) {

                        ProductTypesModel.findByIdAndUpdate(item._id, {$pull: {options: {$in: ids}}}, {new: true}, function () {
                            eCb();
                        });
                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb();
                    });
                }
            });
        };

        async.waterfall([
            function (wCb) {
                OptionsValuesModel.find({optionId: {$in: ids}}, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    if (result && result.length) {
                        variantsIds = _.pluck(result, '_id');
                    }

                    wCb(null, variantsIds);
                });
            },
            function (variantsIds, wCb) {
                Product.find({variants: {$in: variantsIds}}, {name: 1}, function (err, result) {
                    if (!result || !result.length) {
                        return wCb(null);
                    }

                    error = new Error('Product options is not deleted, because he used in ' + result[0].name + ' product');
                    error.status = 400;
                    wCb(error);
                });
            },
            deletingWithProductTypes,
            function (wCb) {
                OptionsValuesModel.remove({optionId: {$in: ids}}, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb();
                });
            },
            function (wCb) {
                OptionsModel.remove({_id: {$in: ids}}, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb();
                });
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Product options with values deleted'});
        });

    };

    this.getOneOption = function (req, res, next) {
        var OptionsModel = models.get(req.session.lastDb, 'ProductOptions', ProductsOptionsSchema);
        var _id = req.params._id;

        OptionsModel.findById(_id, function (err, model) {
            if (err) {
                return next(err);
            }

            res.status(200).send(model);
        });
    };

    /* prTypes.forEach(function (item, key) {
     if (item.options.length && (item.options.indexOf(_id) !== -1)) {
     checkedPrTypes.push(item._id);
     }
     });*/

    this.getForList = function (req, res, next) {
        var query = req.query;
        var paginationObject = pageHelper(query);
        var skip = paginationObject.skip;
        var limit = paginationObject.limit;
        var OptionsModel = models.get(req.session.lastDb, 'ProductOptions', ProductsOptionsSchema);
        var sortObj;
        var key;
        var match = query.ids || [];
        var matchObject = {};
        var ids = [];

        if (match && match.length) {
            match.forEach(function (el) {
                ids.push(el._id);
            });

            ids = ids.objectID();

            matchObject = {_id: {$nin: ids}};
        }

        if (query.sort) {
            key = Object.keys(query.sort)[0];
            req.query.sort[key] = parseInt(query.sort[key], 10);

            sortObj = query.sort;
        } else {
            sortObj = {
                creationDate: -1
            };
        }

        OptionsModel
            .aggregate([{
                $match: matchObject
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
                    _id  : 0,
                    total: 1,
                    data : {
                        _id : '$root._id',
                        name: '$root.name',
                        date: '$root.creationDate'
                    }
                }
            }, {
                $sort: sortObj
            }, {
                $skip: skip
            }, {
                $limit: limit
            }, {
                $group: {
                    _id  : null,
                    total: {$first: '$total'},
                    data : {$push: '$data'}
                }
            }, {
                $project: {
                    _id  : 1,
                    total: '$total',
                    data : '$data'
                }
            }
            ])
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                if (result && result.length) {
                    res.status(200).send(result[0]);
                } else {
                    res.status(200).send({});
                }
            });
    };
};

module.exports = ProductOptions;
