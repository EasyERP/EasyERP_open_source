'use strict';
var mongoose = require('mongoose');
var async = require('async');
var ImagesSchema = mongoose.Schemas.Images;

module.exports = function (models) {
    return new function () {
        this.findByIdAndUpdate = function (query, options, callback) {
            var id;
            var Images;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            id = options._id;

            delete options.dbName;
            delete options._id;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Images = models.get(dbName, 'Images', ImagesSchema);

            Images.findByIdAndUpdate(id, query, options, function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        };

        this.checkAsMain = function (options, callback) {
            var product = options.product;
            var id = options._id;
            var Images;
            var dbName;
            var err;
            //var query = options.query;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Images = models.get(dbName, 'Images', ImagesSchema);

            function uncheckAllImages(wCb) {
                Images.update({product: product, main: true}, {main: false}, {multi: true}, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb();
                });
            }

            function checkAsMain(wCb) {
                if (!id) {
                    wCb();
                }

                Images.findByIdAndUpdate(id, {main: true}, function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    wCb();
                });
            }

            async.waterfall([uncheckAllImages, checkAsMain], function (err, res) {
                if (err) {
                    return callback(err);
                }

                callback(null, 'image as main is checked');
            });

        };

        this.remove = function (options, callback) {
            var Images;
            var dbName;
            var id = options._id;
            var err;
            //var query = options.query;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Images = models.get(dbName, 'Images', ImagesSchema);

            Images.findByIdAndRemove(id, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.create = function (options, callback) {
            var Images;
            var images;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Images = models.get(dbName, 'Images', ImagesSchema);

            images = new Images(options);

            images.save(callback);
        };

        this.createMulti = function (options, callback) {
            var Images;
            var images;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Images = models.get(dbName, 'Images', ImagesSchema);

            // images = new Images(options);

            Images.collection.insertMany(options.images, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        };

        this.findAll = function (query, options, callback) {
            var Images;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Images = models.get(dbName, 'Images', ImagesSchema);

            Images.find(query, function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        };

        this.findOne = function (query, options, callback) {
            var Images;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Images = models.get(dbName, 'Images', ImagesSchema);

            Images.findOne(query, function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        };

        this.findOneAndUpdate = function (query, updateObject, options, callback) {
            var Images;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Images = models.get(dbName, 'Images', ImagesSchema);

            Images.findOneAndUpdate(query, updateObject, options, function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        };

        /*this.find = function (query, options, callback) {
         var ProductPrice;
         var dbName;
         var _query;
         var err;

         if (typeof options === 'function') {
         callback = options;
         options = {};
         }

         dbName = options.dbName;
         delete options.dbName;

         if (!dbName) {
         err = new Error('Invalid input parameters');
         err.status = 400;

         if (typeof callback !== 'function') {
         return populateWrapper(err);
         }

         return callback(err);
         }

         ProductPrice = models.get(dbName, 'ProductPrice', ProductPricesSchema);

         _query = ProductPrice.find(query);

         if (typeof callback !== 'function') {
         return _query;
         }

         _query.exec(function (err, doc) {
         if (err) {
         return callback(err);
         }

         callback(null, doc);
         });
         };*/
    };
};
