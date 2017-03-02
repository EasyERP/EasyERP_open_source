var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

var ProductOptions = function (models) {
    var ProductsOptionsSchema = mongoose.Schemas.ProductOptions;
    var ProductsOptionsValuesSchema = mongoose.Schemas.ProductOptionsValues;
    var ProductTypesSchema = mongoose.Schemas.productTypes;
    var pageHelper = require('../helpers/pageHelper');
    var ObjectId = mongoose.Types.ObjectId;

    this.createProductType = function (req, res, next) {
        var body = req.body;
        var ProductTypeModel = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema);
        var model;
        var err;

        if (!body.name) {
            err = new Error('Please provide Product Type name');
            err.status = 404;
            return next(err);
        }

        model = new ProductTypeModel(body);
        model.save(function (err, result) {
            if (err) {
                return next(err);
            }

            req.params._id = result._id.toString();

            getProductTypeById(req, res, next);

            // res.status(200).send({success: 'Product options created', id: model._id});
        });
    };

    this.updateProductType = function (req, res, next) {
        var ProductTypesModel = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema);
        var body = req.body;
        var _id = req.params._id;
        var currentOptions;

        if (!body.options) {
            ProductTypesModel.findByIdAndUpdate(_id, body, {new: true}, function (err) {
                if (err) {
                    return next(err);
                }

                req.params._id = _id.toString();

                getProductTypeById(req, res, next);

                // res.status(200).send({success: 'Product type updated success'});
            });
        } else {
            ProductTypesModel.findOne({_id: _id}, function (err, result) {
                if (err) {
                    return next(err);
                }

                currentOptions = result.options;

                updateOptionsForProdTypes(_id, currentOptions, body.options, ProductTypesModel, function (err) {
                    if (err) {
                        return next(err);
                    }

                    req.params._id = _id.toString();

                    getProductTypeById(req, res, next);

                    // res.status(200).send({success: 'Product type updated success'});
                });
            });
        }
    };

    this.deleteProductType = function (req, res, next) {
        var ProductTypesModel = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema);
        var body = req.body || {ids: []};
        var ids = body.ids || [req.params.id];

        ProductTypesModel.remove({_id: {$in: ids}}, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Product type is deleted'});
        });
    };

    function updateOptionsForProdTypes(modelId, currentOpts, newOpts, ProductTypesModel, callback) {
        var deletedOptions;
        var addedOptions;
        var addingOption;
        var deletingOptions;

        currentOpts = currentOpts.toStringObjectIds();

        deletedOptions = _.difference(currentOpts, newOpts);
        addedOptions = _.difference(newOpts, currentOpts);

        addingOption = function (pCb) {
            if (!addedOptions.length) {
                return pCb();
            }

            addedOptions = addedOptions.objectID();

            ProductTypesModel.findByIdAndUpdate(modelId, {$pushAll: {options: addedOptions}}, {new: true}, function (err, result) {
                if (err) {
                    return pCb(err);
                }

                pCb();
            });
        };

        deletingOptions = function (pCb) {
            if (!deletedOptions.length) {
                return pCb();
            }

            deletedOptions = deletedOptions.objectID();

            ProductTypesModel.findByIdAndUpdate(modelId, {$pullAll: {options: deletedOptions}}, {new: true}, function (err, result) {
                if (err) {
                    return pCb(err);
                }

                pCb();
            });
        };

        async.parallel([
            addingOption,
            deletingOptions
        ], function (err) {
            if (err) {
                return callback(err);
            }

            callback();
        });
    }

    this.getProductTypeById = getProductTypeById;

    function getProductTypeById(req, res, next) {
        var ProductTypesModel = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema);
        var _id = req.params._id;
        var model;

        _id = _id && _id.length >= 24 ? ObjectId(_id) : null;

        ProductTypesModel.aggregate([{
            $match: {_id: ObjectId(_id)}
        }, {
            $unwind: {
                path                      : '$options',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'ProductOptions',
                localField  : 'options',
                foreignField: '_id',
                as          : 'options'
            }
        }, {
            $unwind: {
                path                      : '$options',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'ProductOptionsValues',
                localField  : 'options._id',
                foreignField: 'optionId',
                as          : 'optionsValue'
            }
        }, {
            $project: {
                name: '$name',
                opts: {
                    name  : '$options.name',
                    _id   : '$options._id',
                    values: '$optionsValue'
                }
            }
        }, {
            $group: {
                _id : '$_id',
                opts: {$push: '$opts'},
                name: {$first: '$name'}
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            if (result.length) {
                model = result[0];
            } else {
                model = {};
            }

            res.status(200).send(model);
        });
    }

    this.getAllProductTypes = function (req, res, next) {
        var query = req.query;
        var paginationObject = pageHelper(query);
        var skip = paginationObject.skip;
        var limit = paginationObject.limit;
        var ProductTypesModel = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema);
        var sortObj;
        var key;

        if (query.sort) {
            key = Object.keys(query.sort)[0];
            req.query.sort[key] = parseInt(query.sort[key], 10);

            sortObj = query.sort;
        } else {
            sortObj = {
                creationDate: -1
            };
        }

        ProductTypesModel.aggregate([{
            $lookup: {
                from        : 'Products',
                localField  : '_id',
                foreignField: 'info.productType',
                as          : 'Products'
            }
        }, {
            $unwind: {
                path                      : '$options',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'ProductOptions',
                localField  : 'options',
                foreignField: '_id',
                as          : 'productOptions'
            }
        }, {
            $project: {
                countProducts: {$size: '$Products'},
                name         : '$name',
                opts         : {$arrayElemAt: ['$productOptions', 0]}
            }
        }, {
            $group: {
                _id          : '$_id',
                options      : {$push: '$opts'},
                name         : {$first: '$name'},
                countProducts: {$first: '$countProducts'}
            }
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
                _id  : 1,
                total: 1,
                data : {
                    _id          : '$root._id',
                    name         : '$root.name',
                    options      : '$root.options',
                    countProducts: '$root.countProducts'
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
        }]).exec(function (err, result) {
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
