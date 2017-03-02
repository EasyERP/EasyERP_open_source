var mongoose = require('mongoose');
var RESPONSES = require('../constants/responses');
var Uploader = require('../services/fileStorage/index');
var uploader = new Uploader();
var path = require('path');
var objectId = mongoose.Types.ObjectId;
var imageHelper = require('../helpers/imageHelper');
var async = require('async');
var _ = require('lodash');

var Images = function (models) {

    var ImagesService = require('../services/images')(models);
    var productService = require('../services/products')(models);

    this.checkAsMain = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.params.id;
        var product = req.params.product;

        productService.findOneAndUpdate({_id: product}, {$set: {imageSrc: id}}, {dbName: db}, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({
                data: {
                    changed: true,
                    message: 'images is checked as main'
                }
            });
        });
    };

    this.uploadFiles = function (req, res, next) {
        var db = req.session.lastDb;
        var body = req.body;
        var item = body.item;
        var image = body.image;
        var imageData = imageHelper.cutPrefixFromBase64(image);
        var error;

        var imageName = (new objectId()).toString();

        uploader.postImage(item.toString(), {
            data: imageData.image,
            name: imageName + '.' + imageData.mimeType
        }, function (err, imagePath) {
            if (err) {
                return next(err);
            }

            if (!imagePath) {
                error = new Error('Upload error');
                error.status = 400;

                return next(err);
            }

            ImagesService.create({
                main    : false,
                imageSrc: imagePath,
                product : item,
                dbName  : db
            }, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Images is attach!', data: result});
            });
        });
    };

    this.deleteImage = function (req, res, next) {
        var db = req.session.lastDb;
        var id = req.params.id;
        var main = false;

        async.waterfall([
            function (wCb) {
                productService.find({imageSrc: id}, {dbName: db})
                    .lean()
                    .exec(function (err, resultProducts) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb(null, resultProducts);
                    });
            },

            function (resultProducts, wCb) {
                var productIds;
                var groupId;

                if (!wCb && typeof resultProducts === 'function') {
                    wCb = resultProducts;

                    return wCb();
                }

                if (!resultProducts.length) {
                    return wCb();
                }

                groupId = resultProducts[0].groupId;
                productIds = _.pluck(resultProducts, '_id');

                main = !main;

                ImagesService.findOneAndUpdate({
                    imageSrc: '/customImages/default.png',
                    product : groupId
                }, {
                    imageSrc: '/customImages/default.png',
                    product : groupId
                }, {
                    dbName: db,
                    upsert: true,
                    new   : true
                }, function (err, resultImage) {
                    if (err) {
                        return wCb(err);
                    }

                    productService.findAndUpdate({
                        _id: {$in: productIds}
                    }, {
                        $set: {imageSrc: resultImage._id}
                    }, {
                        dbName: db,
                        multi : true
                    }, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb();
                    });
                });
            },

            function (wCb) {
                ImagesService.remove({dbName: db, _id: id}, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb(null, result);
                });
            },

            function (deletedImage, wCb) {
                var absPath = __dirname;
                var filePath;

                absPath = absPath.substr(0, absPath.lastIndexOf('/'));
                filePath = absPath + '/' + deletedImage.imageSrc;

                uploader.removeFile(filePath, wCb);
            }
        ], function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Removed success', main: main});
        });
    };
};

module.exports = Images;
