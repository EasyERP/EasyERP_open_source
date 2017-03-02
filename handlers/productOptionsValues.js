var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

var ProductOptionsValues = function (models) {
    var ProductSchema = mongoose.Schemas.Products;
    var ProductsOptionsValuesSchema = mongoose.Schemas.ProductOptionsValues;
    var pageHelper = require('../helpers/pageHelper');
    var objectId = mongoose.Types.ObjectId;

    this.createOptions = function (req, res, next) {
        var body = req.body;
        var OptionsValuesModel = models.get(req.session.lastDb, 'ProductOptionsValues', ProductsOptionsValuesSchema);
        var model;
        var err;
        var valuesArray = body.optionsValues;

        async.each(valuesArray, function (item, cb) {
            model = new OptionsValuesModel(item);

            model.save(function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Product options values is created'});
        });
    };

    this.updateOptions = function (req, res, next) {
        var OptionsValuesModel = models.get(req.session.lastDb, 'ProductOptionsValues', ProductsOptionsValuesSchema);
        var body = req.body;
        var id = body._id;
        var data = {
            value: body.value
        };

        OptionsValuesModel.findByIdAndUpdate(id, data, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Options updated success'});
        });
    };

    this.deleteOptions = function (req, res, next) {
        var OptionsValuesModel = models.get(req.session.lastDb, 'ProductOptionsValues', ProductsOptionsValuesSchema);
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var body = req.body;
        var id = body.id;
        var error;

        async.waterfall([
            function (pCb) {
                Product.find({variants: id}, {name: 1}, function (err, result) {
                    if (!result || !result.length) {
                        return pCb(null);
                    }

                    error = new Error('Product options is not deleted, because he used in ' + result[0].name + ' product');
                    error.status = 400;
                    pCb(error);
                });
            },
            function (pCb) {
                OptionsValuesModel.remove({_id: id}, function (err) {
                    pCb(null);
                });
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Product option has been deleted'});
        });
    };

    this.getByProductId = function (req, res, next) {
        var groupId = req.query.id;
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);

        Product.aggregate([{
            $match: {
                groupId: groupId
            }
        }, {
            $unwind: {
                path                      : '$variants',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'ProductOptionsValues',
                localField  : 'variants',
                foreignField: '_id',
                as          : 'variants'
            }
        }, {
            $unwind: {
                path                      : '$variants',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'ProductOptions',
                localField  : 'variants.optionId',
                foreignField: '_id',
                as          : 'variants.optionId'
            }
        }, {
            $project: {
                'variants.optionId': {$arrayElemAt: ['$variants.optionId', 0]},
                'variants.value'   : 1,
                'variants._id'     : 1
            }
        }, {
            $project: {
                _id      : '$variants.optionId._id',
                variantId: '$variants._id',
                name     : {$concat: ['$variants.optionId.name', ' / ', '$variants.value']}
            }
        }, {
            $sort: {name: 1}
        }], function (err, productOptions) {
            if (err) {
                return next(err);
            }

            res.status(200).send(productOptions);
        });
    };

    this.getForList = function (req, res, next) {
        var query = req.query;
        var _id = query.id;
        var OptionsValuesModel = models.get(req.session.lastDb, 'ProductOptionsValues', ProductsOptionsValuesSchema);

        OptionsValuesModel.find({optionId: _id}, {_id: 1, value: 1}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };
};

module.exports = ProductOptionsValues;
