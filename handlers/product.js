/**
 * Created by Roman on 29.04.2015.
 */

var mongoose = require('mongoose');
var Products = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var ProductSchema = mongoose.Schemas['Products'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');

    var fs = require("fs");

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

        Product.findByIdAndUpdate(id, {$set: data}, function (err, product) {
            if (err) {
                next(err);
            } else {
                res.status(200).send({success: 'Product updated', result: product});
            }
        });

    };

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
    }

    this.getProductsImages = function (req, res, next) {
        var data = {};
        data.ids = req.params.ids || [];

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    getProductImages(req, data, res, next);
                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    function getProductImages(req, res, next, data) {
        var query = models.get(req.session.lastDb, "Products", ProductSchema).find({});
        query.where('_id').in(data.ids).
            select('_id imageSrc').
            exec(function (error, response) {
                if (error) {
                    next(err);
                } else res.status(200).send({data: response});
            });

    };

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
                    if (!errr)
                        dir += req.headers.id;
                    fs.mkdir(dir, function (errr) {
                        if (!errr)
                            uploadFileArray(req, res, function (files) {
                                uploadProductFile(req, res, next, req.headers.id, files);
                            });
                    });
                });
            } else {
                dir += req.headers.id;
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        fs.mkdir(dir, function (errr) {
                            if (!errr)
                                uploadFileArray(req, res, function (files) {
                                    uploadProductFile(req, res, next, req.headers.id, files);
                                });
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
        models.get(req.session.lastDb, "Product", ProductSchema).findByIdAndUpdate(_id, {$push: {attachments: {$each: files}}}, {upsert: true}, function (err, result) {
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
    };

    function remove(req, res, next, _id) {
        models.get(req.session.lastDb, "Products", ProductSchema).remove({_id: _id}, function (err, product) {
            if (err) {
                return next(err);
            } else {
                res.status(200).send({success: product});
            }
        });
    };

    this.removeProduct = function (req, res, next) {
        var id = req.params._id;
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    remove(req, id, res, next);
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
        var query = {};

        Product.find(query, function (err, products) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: products});
        });
    };

    function getProductsFilter(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
                    var optionsObject = {};
                    var sort = {};
                    var count = req.query.count ? req.query.count : 50;
                    var page = req.query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (req.query.filter.letter) {
                        optionsObject['name'] = new RegExp('^[' + req.query.filter.letter.toLowerCase() + req.query.filter.letter.toUpperCase() + '].*');
                    }
                    if (req.query.sort) {
                        sort = req.query.sort;
                    } else {
                        sort = {"name": 1};
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

                        models.get(req.session.lastDb, "Product", ProductSchema).aggregate(
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

                    contentSearcher = function (quotationsIds, waterfallCallback) {
                        optionsObject._id = {$in: quotationsIds};
                        var query = Product.find(optionsObject).limit(count).skip(skip).sort(sort);
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

    function getProductsById(req, res, next) {
        var id = req.params.id;
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
            var arrOfObjectId = deps.objectID();

            models.get(req.session.lastDb, "Product", ProductSchema).aggregate(
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

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var query;

            query = Product.findById(id);

            query.populate('info.productType', 'name _id').
                populate('department', '_id departmentName').
                populate('createdBy.user').
                populate('editedBy.user').
                populate('groups.users').
                populate('groups.group').
                populate('groups.owner', '_id login');

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;

        switch (viewType) {
            case "list":
                getProductsFilter(req, res, next);
                break;
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
    };

    this.getProductsTypeForDd = function (req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            getForDd(req, res, next);
        } else {
            res.status(401).send();
        }
    };

    function getProductsAlphabet(req, response, next) {
        var query = models.get(req.session.lastDb, "Products", ProductSchema).aggregate([{$match: {}}, {$project: {later: {$substr: ["$name", 0, 1]}}}, {$group: {_id: "$later"}}]);
        query.exec(function (err, result) {
            if (err) {
                next(err)
            } else {
                var res = {};
                res['data'] = result;
                response.status(200).send(res);
            }
        });
    };

    this.getProductsAlphabet = function (req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            getProductsAlphabet(req, res, next);
        } else {
            res.send(401);
        }
    };

    this.totalCollectionLength = function (req, res, next) {
        var result = {};
        var data = {};

        for (var i in req.query) {
            data[i] = req.query[i];
        }

        result['showMore'] = false;

        var contentType = req.params.contentType;
        var optionsObject = {};

        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var departmentSearcher;
        var contentIdsSearcher;

        var contentSearcher;
        var waterfallTasks;

        if (data.filter.letter) {
            optionsObject['name'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
        }

        var count = req.query.count ? req.query.count : 50;
        var page = req.query.page;
        var skip = (page - 1) > 0 ? (page - 1) * 50 : 0;

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

            models.get(req.session.lastDb, "Product", ProductSchema).aggregate(
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

        contentSearcher = function (quotationsIds, waterfallCallback) {
            optionsObject._id = {$in: quotationsIds};
            var query = Product.find(optionsObject).limit(count).skip(skip);
            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, products) {
            if (err) {
                return next(err);
            } else {
                if (req.query.currentNumber && req.query.currentNumber < products.length) {
                    result['showMore'] = true;
                }
                result['count'] = products.length;
                res.status(200).send(result);
            }
        });
    };

};

module.exports = Products;