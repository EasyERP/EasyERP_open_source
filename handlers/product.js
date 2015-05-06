/**
 * Created by Roman on 29.04.2015.
 */

var mongoose = require('mongoose');
var Products = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var ProductSchema = mongoose.Schemas['Products'];

    function addAtach(req, _id, files, res, next) {//to be deleted
        models.get(req.session.lastDb, "Employees", ProductSchema).findByIdAndUpdate(_id, { $push: { attachments: { $each: files } } }, { upsert: true }, function (err, result) {
            if (err) {
                next(err);
            } else {
                res.send(200, {success: 'Products updated success', data: result});
                if (data.recalculate) {
                    event.emit('recalculate', req);
                }
            }
        });
    }// end update

    function uploadProductFile(req, res, id, files) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 58, function (access) {
                if (access) {
                    this.addAtach(req, id, files, res);
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

        product.save(function (err, product) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: product});
        });
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

    this.getForView = function (req, res, next) {
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
                        sort = { "name": -1 };
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