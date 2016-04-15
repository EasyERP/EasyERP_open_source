var mongoose = require('mongoose');
var Products = function (models) {
        'use strict';

        var access = require("../Modules/additions/access.js")(models);
        var rewriteAccess = require('../helpers/rewriteAccess');
        var ProductSchema = mongoose.Schemas['Products'];
        var DepartmentSchema = mongoose.Schemas['Department'];
        var objectId = mongoose.Types.ObjectId;
        var async = require('async');
        var _ = require('lodash');
        var underscore = require('../node_modules/underscore');
        var CONSTANTS = require('../constants/mainConstants.js');

        var fs = require("fs");

        var exportDecorator = require('../helpers/exporter/exportDecorator');
        var exportMap = require('../helpers/csvMap').Products;

        //exportDecorator.addExportFunctionsToHandler(this, function (req) {
        //    return models.get(req.session.lastDb, 'Product', ProductSchema)
        //}, exportMap, 'Products');

        this.create = function (req, res, next) {
            var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
            var body = req.body;
            var product = new Product(body);

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

            if (req.session && req.session.loggedIn && req.session.lastDb) {
                access.getEditWritAccess(req, req.session.uId, 58, function (access) {
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

        this.getProductsImages = function (req, res, next) {
            var data = {};
            data.ids = req.query.ids || [];

            if (req.session && req.session.loggedIn && req.session.lastDb) {
                //    access.getReadAccess(req, req.session.uId, mid, function (access) {
                //        if (access) {
                getProductImages(req, res, next, data); //commented for salesProducts for PM
                //    } else {
                //        res.status(403).send();
                //    }
                //});

            }
            else {
                res.status(401).send();
            }
        };

        function getProductImages(req, res, next, data) {
            var query = models.get(req.session.lastDb, "Products", ProductSchema).find({});
            query.where('_id').in(data.ids).select('_id imageSrc').exec(function (error, response) {
                if (error) {
                    next(error);
                } else {
                    res.status(200).send({data: response});
                }
            });
        }

        this.uploadProductFiles = function (req, res, next) {
            var os = require("os");
            var osType = (os.type().split('_')[0]);
            var dir;
            switch (osType) {
                case "Windows":
                {
                    dir = __dirname + "\\uploads\\";
                }
                    break;
                case "Linux":
                {
                    dir = __dirname + "\/uploads\/";
                }
            }
            fs.readdir(dir, function (err, files) {
                if (err) {
                    fs.mkdir(dir, function (errr) {
                        if (!errr) {
                            dir += req.headers.id;
                        }
                        fs.mkdir(dir, function (errr) {
                            if (!errr) {
                                uploadFileArray(req, res, function (files) {
                                    uploadProductFile(req, res, next, req.headers.id, files);
                                });
                            }
                        });
                    });
                } else {
                    dir += req.headers.id;
                    fs.readdir(dir, function (err, files) {
                        if (err) {
                            fs.mkdir(dir, function (errr) {
                                if (!errr) {
                                    uploadFileArray(req, res, function (files) {
                                        uploadProductFile(req, res, next, req.headers.id, files);
                                    });
                                }
                            });
                        } else {
                            uploadFileArray(req, res, function (files) {
                                uploadProductFile(req, res, next, req.headers.id, files);
                            });
                        }
                    });
                }
            });
        };

        function addAtach(req, res, next, _id, files) {//to be deleted
            models.get(req.session.lastDb, "Product", ProductSchema).findByIdAndUpdate(_id, {$push: {attachments: {$each: files}}}, {
                new   : true,
                upsert: true
            }, function (err, result) {
                if (err) {
                    next(err);
                } else {
                    res.status(200).send({success: 'Products updated success', data: result});
                }
            });
        }// end update

        function uploadProductFile(req, res, next, id, files) {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                access.getEditWritAccess(req, req.session.uId, 58, function (access) {
                    if (access) {
                        addAtach(req, res, next, id, files);
                    } else {
                        res.status(403).send();
                    }
                });
            } else {
                res.status(401).send();
            }
        }

        function remove(req, res, next, id) {
            models.get(req.session.lastDb, "Products", ProductSchema).remove({_id: id}, function (err, product) {
                if (err) {
                    return next(err);
                } else {
                    res.status(200).send({success: product});
                }
            });
        }

        this.removeProduct = function (req, res, next) {
            var id = req.params._id;
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                access.getDeleteAccess(req, req.session.uId, 58, function (access) {
                    if (access) {
                        remove(req, res, next, id);
                    } else {
                        res.status(403).send();
                    }
                });
            } else {
                res.status(401).send();
            }
        };

        this.getAll = function (req, res, next) {
            var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
            var queryObject = {};
            var query = req.query;

            if (query && query.canBeSold) {
                queryObject.canBeSold = true;

                if (query.service) {
                    var key = 'info.productType';
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
        };

        function caseFilter(filter) {
            var condition;
            var resArray = [];
            var filtrElement = {};
            var key;

            for (var filterName in filter) {
                condition = filter[filterName]['value'];
                key = filter[filterName]['key'];

                switch (filterName) {
                    case 'letter':
                        filtrElement['name'] = new RegExp('^[' + condition.toLowerCase() + condition.toUpperCase() + '].*');
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
                        condition = ConvertType(condition, 'boolean');
                        filtrElement[key] = {$in: condition};
                        resArray.push(filtrElement);
                        break;
                    case 'canBeExpensed':
                        condition = ConvertType(condition, 'boolean');
                        filtrElement[key] = {$in: condition};
                        resArray.push(filtrElement);
                        break;
                    case 'canBePurchased':
                        condition = ConvertType(condition, 'boolean');
                        filtrElement[key] = {$in: condition};
                        resArray.push(filtrElement);
                        break;
                }
            }

            return resArray;
        }

        function ConvertType(array, type) {
            var result = [];
            if (type === 'integer') {
                for (var i = array.length - 1; i >= 0; i--) {
                    result[i] = parseInt(array[i]);
                }
            } else if (type === 'boolean') {
                for (var i = array.length - 1; i >= 0; i--) {
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
        }

        function getProductsFilter(req, res, next) {
            var mid = req.query.contentType === 'salesProduct' ? 65 : 58;
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                access.getReadAccess(req, req.session.uId, mid, function (access) {
                    var Product;
                    var query = req.query;
                    var optionsObject = {};
                    var sort = {};
                    var count;
                    var page;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;
                    var skip;

                    if (access) {
                        Product = models.get(req.session.lastDb, 'Product', ProductSchema);
                        count = parseInt(query.count, 10) || CONSTANTS.DEF_LIST_COUNT;
                        page = req.query.page;

                        count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count;
                        skip = (page - 1) > 0 ? (page - 1) * count : 0;

                        if (query && query.sort) {
                            sort = query.sort;
                        } else {
                            sort = {"name": 1};
                        }

                        if (query.filter && typeof query.filter === 'object') {
                            if (query.filter.condition === 'or') {
                                optionsObject['$or'] = caseFilter(query.filter);
                            } else {
                                optionsObject['$and'] = caseFilter(query.filter);
                            }
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
                            var Model = models.get(req.session.lastDb, "Product", ProductSchema);

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

                            query = Product.find(optionsObject)
                                .limit(count)
                                .skip(skip)
                                .sort(sort);
                            query.exec(waterfallCallback);
                        };

                        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                        async.waterfall(waterfallTasks, function (err, products) {
                            if (err) {
                                return next(err);
                            }
                            res.status(200).send({success: products});

                        });
                    } else {
                        res.send(403);
                    }
                });

            } else {
                res.send(401);
            }
        }

        function getProductsById(req, res, next) {
            var id = req.query.id;
            var Product = models.get(req.session.lastDb, "Products", ProductSchema);

            var departmentSearcher;
            var contentIdsSearcher;
            var contentSearcher;
            var waterfallTasks;

            var contentType = req.query.contentType;

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
                var everyOne = rewriteAccess.everyOne();
                var owner = rewriteAccess.owner(req.session.uId);
                var group = rewriteAccess.group(req.session.uId, deps);
                var whoCanRw = [everyOne, owner, group];
                var matchQuery = {
                    $or: whoCanRw
                };
                var Model = models.get(req.session.lastDb, "Product", ProductSchema);

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

                query.populate('info.productType', 'name _id').populate('department', '_id departmentName').populate('createdBy.user').populate('editedBy.user').populate('groups.users').populate('groups.group').populate('groups.owner', '_id login');

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
            var viewType = req.params.viewType;

            switch (viewType) {
                case "list":
                case "thumbnails":
                    getProductsFilter(req, res, next);
                    break;
                case "form":
                    getProductsById(req, res, next);
                    break;
            }
        };

        function getForDd(req, response, next) {
            var ProductTypesSchema = mongoose.Schemas['productTypes'];

            var res = {};
            res['data'] = [];

            var query = models.get(req.session.lastDb, 'productTypes', ProductTypesSchema).find();
            query.select('_id name ');
            query.sort({'name': 1});
            query.exec(function (err, result) {
                if (err) {
                    next(err);
                } else {
                    res['data'] = result;
                    response.status(200).send(res);
                }
            });
        }

        this.getProductsTypeForDd = function (req, res, next) {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                getForDd(req, res, next);
            } else {
                res.status(401).send();
            }
        };

        function getProductsAlphabet(req, response, next) {
            var queryObject = {};
            var query;

            query = models.get(req.session.lastDb, "Product", ProductSchema).aggregate([{$match: queryObject}, {$project: {later: {$substr: ["$name", 0, 1]}}}, {$group: {_id: "$later"}}]);
            query.exec(function (err, result) {
                if (err) {
                    next(err)
                } else {
                    var res = {};
                    res['data'] = result;
                    response.status(200).send(res);
                }
            });
        }

        this.getProductsAlphabet = function (req, res, next) {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                getProductsAlphabet(req, res, next);
            } else {
                res.send(401);
            }
        };

        this.totalCollectionLength = function (req, res, next) {
            var result = {};
            var data = req.query;

            result['showMore'] = false;

            var optionsObject = {};

            var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
            var departmentSearcher;
            var contentIdsSearcher;

            var contentSearcher;
            var waterfallTasks;

            if (data.filter && typeof data.filter === 'object') {
                if (data.filter.condition === 'or') {
                    optionsObject['$or'] = caseFilter(data.filter);
                } else {
                    optionsObject['$and'] = caseFilter(data.filter);
                }
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
                var Model = models.get(req.session.lastDb, "Product", ProductSchema);

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
                if (data.currentNumber && data.currentNumber < products.length) {
                    result['showMore'] = true;
                }
                result['count'] = products.length;
                res.status(200).send(result);

            });
        };

    }
    ;

module.exports = Products;