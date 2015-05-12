/**
 * Created by Roman on 29.04.2015.
 */

var mongoose = require('mongoose');
var Products = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var ProductSchema = mongoose.Schemas['Products'];

    var fs = require("fs");

    function updateOnlySelectedFields(req, id, data, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);

        Product.findByIdAndUpdate(id, { $set: data}, function (err, product) {
            if (err) {
                next(err);
            }
            res.send(200, { success: 'Product updated', result: product });
        });

    };

    this.productsUpdateOnlySelectedFields = function (req, res, next) {
        var id = req.param('_id');
        var data = req.body;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    updateOnlySelectedFields(req, id, data, res, next);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    this.getProductsImages = function (req, res, next) {
        var data = {};
        data.ids = req.param('ids') || [];

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    getProductImages(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getProductImages(req, data, res) {
        var query = models.get(req.session.lastDb, "Products", ProductSchema).find({});
        query.where('_id').in(data.ids).
            select('_id imageSrc').
            exec(function (error, response) {
                if (error) {
                    res.send(500, { error: "Can't find Products Imgs" });
                } else res.send(200, { data: response });
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
                                uploadProductFile(req, res, req.headers.id, files);
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
                                    uploadProductFile(req, res, req.headers.id, files);
                                });
                        });
                    } else {
                        uploadFileArray(req, res, function (files) {
                            uploadProductFile(req, res, req.headers.id, files);
                        });
                    }
                });
            }
        });
    };

    function addAtach(req, _id, files, res, next) {//to be deleted
        models.get(req.session.lastDb, "Product", ProductSchema).findByIdAndUpdate(_id, { $push: { attachments: { $each: files } } }, { upsert: true }, function (err, result) {
            if (err) {
                next(err);
            } else {
                res.send(200, {success: 'Products updated success', data: result});
            }
        });
    }// end update

    function uploadProductFile(req, res, id, files) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    addAtach(req, id, files, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    this.create = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var body = req.body;
        var product = new Product(body);

        product.info.salePrice = parseFloat(product.info.salePrice).toFixed(2);

        product.save(function (err, product) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: product});
        });
    };

    function remove(req, _id, res, next) {
        models.get(req.session.lastDb, "Products", ProductSchema).remove({_id: _id}, function (err, customer) {
            if (err) {
                res.send(500, {error: "Can't remove product"});
            } else {
                res.send(200, {success: 'Product removed'});
            }
        });
    }// end remove

    this.removeProduct = function (req, res, next) {
        var id = req.param('_id');
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    remove(req, id, res, next);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
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
                    var query = {};
                    var sort = {};
                    var count = req.query.count ? req.query.count : 50;
                    var page = req.query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * 50 : 0;
                    var skip = (page-1)>0 ? (page-1)*count : 0;

                    if (req.query.filter.letter) {
                        query['name'] = new RegExp('^[' + req.query.filter.letter.toLowerCase() + req.query.filter.letter.toUpperCase() + '].*');
                    }
                    if (req.query.sort) {
                        sort = req.query.sort;
                    } else {
                        sort = { "name": 1 };
                    }

                    Product.find(query).limit(count).skip(skip).sort(sort).exec(function (err, products) {
                        if (err) {
                            return next(err);
                        } else {
                            res.status(200).send({success: products});
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

    function getProductsById(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    var data = {};
                    for (var i in req.query) {
                        data[i] = req.query[i];
                    }
                    var query = models.get(req.session.lastDb, "Products", ProductSchema).findById(data.id);
                    query.populate('info.productType', 'name _id');

                    query.exec(function (err, findedProduct) {
                        if (err) {
                            res.send(500, { error: "Can't find Product" });
                        } else {
                            res.send(findedProduct);
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
            res.send(401);
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

    this.totalCollectionLength = function (req, response, next) {
        var res = {};
        var data = {};

        for (var i in req.query) {
            data[i] = req.query[i];
        }
        res['showMore'] = false;

        var optionsObject = {};

        if (data.filter.letter) {
            optionsObject['name'] = new RegExp('^[' + data.filter.letter.toLowerCase() + data.filter.letter.toUpperCase() + '].*');
        }
        var Product = models.get(req.session.lastDb, 'Product', ProductSchema);
        var query = optionsObject;
        var count = req.query.count ? req.query.count : 50;
        var page = req.query.page;
        var skip = (page - 1) > 0 ? (page - 1) * 50 : 0;

        Product.find(query).limit(count).skip(skip).exec(function (err, products) {
            if (err) {
                return next(err);
            } else {
                if (req.query.currentNumber && req.query.currentNumber < products.length) {
                    res['showMore'] = true;
                }
                res['count'] = products.length;
                response.status(200).send(res);
            }
        });
    };

};

module.exports = Products;