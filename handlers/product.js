/*TODO remove caseFilter methid after testing filters*/
var Products = function (models) {
    'use strict';

    var mongoose = require('mongoose');

    var ProductSchema = mongoose.Schemas.Products;
    var DepartmentSchema = mongoose.Schemas.Department;
    var objectId = mongoose.Types.ObjectId;

    var rewriteAccess = require('../helpers/rewriteAccess');
    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var async = require('async');
    var fs = require('fs');
    var exportDecorator = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Products;
    var pageHelper = require('../helpers/pageHelper');
    var FilterMapper = require('../helpers/filterMapper');

    /* exportDecorator.addExportFunctionsToHandler(this, function (req) {
     return models.get(req.session.lastDb, 'Product', ProductSchema)
     }, exportMap, 'Products');*/

    this.create = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var body = req.body;
        var product = new Product(body);

        if (!body.info) {
            return res.status(400).send();
        }

        if (req.session.uId) {
            product.createdBy.user = req.session.uId;
            product.editedBy.user = req.session.uId;
        }

        product.info.salePrice = parseFloat(product.info.salePrice).toFixed(2);

        product.save(function (err, product) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: product});
        });
    };

    function updateOnlySelectedFields(req, res, next, id, data) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);

        Product.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, product) {
            if (err) {
                next(err);
            } else {
                res.status(200).send({success: 'Product updated', result: product});
            }
        });

    }

    this.productsUpdateOnlySelectedFields = function (req, res, next) {
        var id = req.params._id;
        var data = req.body;

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };
        updateOnlySelectedFields(req, res, next, id, data);
    };

    function getProductImages(req, res, next, data) {
        var query = models.get(req.session.lastDb, 'Products', ProductSchema).find({});
        query.where('_id').in(data.ids).select('_id imageSrc').exec(function (error, response) {
            if (error) {
                next(error);
            } else {
                res.status(200).send({data: response});
            }
        });
    }

    this.getProductsImages = function (req, res, next) {
        var data = {};
        data.ids = req.query.ids || [];

        getProductImages(req, res, next, data);
    };

    function remove(req, res, next, id) {
        models.get(req.session.lastDb, 'Products', ProductSchema).remove({_id: id}, function (err, product) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: product});
        });
    }

    this.removeProduct = function (req, res, next) {
        var id = req.params._id;

        remove(req, res, next, id);
    };

    function getAll(req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var queryObject = {};
        var query = req.query;
        var key;

        if (query && query.canBeSold) {
            queryObject.canBeSold = true;

            if (query.service) {
                key = 'info.productType';
                queryObject[key] = 'Service';
            }
        } else {
            queryObject.canBePurchased = true;
        }

        Product.find(queryObject, function (err, products) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: products});
        });
    }

    this.getAll = function (req, res, next) {
        getAll(req, res, next);
    };

    /*function convertType(array, type) {
        var i;
        var result = [];

        if (type === 'integer') {
            for (i = array.length - 1; i >= 0; i--) {
                result[i] = parseInt(array[i], 10);
            }
        } else if (type === 'boolean') {
            for (i = array.length - 1; i >= 0; i--) {
                if (array[i] === 'true') {
                    result[i] = true;
                } else if (array[i] === 'false') {
                    result[i] = false;
                } else {
                    result[i] = null;
                }
            }
        }

        return result;
    }*/

    /*function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;
        var filterName;
        var filterNameKeys = Object.keys(filter);
        var i;

        for (i = filterNameKeys.length - 1; i >= 0; i--) {
            filterName = filterNameKeys[i];
            condition = filter[filterName].value;
            key = filter[filterName].key;

            switch (filterName) {
                case 'letter':
                    filtrElement.name = new RegExp('^[' + condition.toLowerCase() + condition.toUpperCase() + '].*');
                    resArray.push(filtrElement);
                    break;
                case 'name':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'productType':
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'canBeSold':
                    condition = convertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'canBeExpensed':
                    condition = convertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'canBePurchased':
                    condition = convertType(condition, 'boolean');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                // skip default;
            }
        }

        return resArray;
    }*/

    function getProductsFilter(req, res, next) {
        var mid = req.query.contentType === 'salesProduct' ? 65 : 58;

        var Product;
        var query = req.query;
        var optionsObject = {$and: []};
        var sort = {};
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;
        var paginationObject = pageHelper(query);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var parallelTasks;
        var getTotal;
        var getData;
        var filterMapper = new FilterMapper();

        Product = models.get(req.session.lastDb, 'Product', ProductSchema);

        if (query && query.sort) {
            sort = query.sort;
        } else {
            sort = {name: 1};
        }

        if (query.filter && typeof query.filter === 'object') {
            optionsObject.$and.push(filterMapper.mapFilter(query.filter, query.contentType)); // caseFilter(query.filter);
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Product, cb);
        };

        contentSearcher = function (productsIds, waterfallCallback) {

            optionsObject.$and.push({_id: {$in: productsIds}});

            getTotal = function (pCb) {

                Product.find(optionsObject).count(function (err, _res) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, _res);
                });
            };

            getData = function (pCb) {
                Product.find(optionsObject).sort(sort).skip(skip).limit(limit).exec(function (err, _res) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, _res);
                });
            };

            parallelTasks = [getTotal, getData];

            async.parallel(parallelTasks, function (err, result) {
                var count;
                var response = {};

                if (err) {
                    return waterfallCallback(err);
                }

                count = result[0] || 0;

                response.total = count;
                response.data = result[1];

                waterfallCallback(null, response);
            });

        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, products) {
            if (err) {
                return next(err);
            }

            res.status(200).send(products);
        });
    }

    function getProductsById(req, res, next) {
        var id = req.query.id;
        var Product = models.get(req.session.lastDb, 'Products', ProductSchema);

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        if (id.length < 24) {
            return res.status(400).send();
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
                $or: whoCanRw
            };
            var Model = models.get(req.session.lastDb, 'Product', ProductSchema);

            Model.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (productsIds, waterfallCallback) {
            var query;

            query = Product.findById(id);

            query
                .populate('info.productType', 'name _id')
                .populate('department', '_id name')
                .populate('createdBy.user')
                .populate('editedBy.user')
                .populate('groups.users')
                .populate('groups.group')
                .populate('groups.owner', '_id login');

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    }

    this.getForView = function (req, res, next) {
        var viewType = req.query.viewType;
        var id = req.query.id;

        if (id && id.length >= 24) {
            return getProductsById(req, res, next);
        } else if (id && id.length < 24) {
            return res.status(400).send();
        }

        switch (viewType) {
            case 'list':
            case 'thumbnails':
                getProductsFilter(req, res, next);
                break;
            case 'form':
                getProductsById(req, res, next);
                break;
            default:
                getAll(req, res, next);
                break;
        }
    };

    function getForDd(req, response, next) {
        var ProductTypesSchema = mongoose.Schemas.productTypes;
        var query;
        var res = {};

        res.data = [];

        query = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema).find();

        query.select('_id name ');
        query.sort({name: 1});
        query.exec(function (err, result) {
            if (err) {
                next(err);
            } else {
                res.data = result;
                response.status(200).send(res);
            }
        });
    }

    this.getProductsTypeForDd = function (req, res, next) {

        getForDd(req, res, next);
    };

    function getProductsAlphabet(req, response, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var queryObject = {};
        var query;

        query = Product.aggregate([{$match: queryObject}, {$project: {later: {$substr: ['$name', 0, 1]}}}, {$group: {_id: '$later'}}]);

        query.exec(function (err, result) {
            var res = {};

            if (err) {
                return next(err);
            }

            res.data = result;
            response.status(200).send(res);
        });
    }

    this.getProductsAlphabet = function (req, res, next) {

        getProductsAlphabet(req, res, next);
    };

    this.totalCollectionLength = function (req, res, next) {
        var result = {};
        var data = req.query;

        var optionsObject = {};

        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var departmentSearcher;
        var contentIdsSearcher;

        var contentSearcher;
        var waterfallTasks;

        var filterMapper = new FilterMapper();

        result.showMore = false;

        if (data.filter && typeof data.filter === 'object') {
            optionsObject.$and = filterMapper.mapFilter(data.filter, data.contentType); // caseFilter(data.filter);
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
                    optionsObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };
            var Model = models.get(req.session.lastDb, 'Product', ProductSchema);

            Model.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (productsIds, waterfallCallback) {
            var query;
            optionsObject._id = {$in: productsIds};

            query = Product.find(optionsObject);
            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, products) {
            if (err) {
                return next(err);
            }

            result.count = products.length;
            res.status(200).send(result);

        });
    };

};
module.exports = Products;
