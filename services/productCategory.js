'use strict';
var mongoose = require('mongoose');
var CategorySchema = mongoose.Schemas.ProductCategory;
var objectId = mongoose.Types.ObjectId;

module.exports = function (models) {
    return new function () {
        this.update = function (options, callback) {
            var ProductCategory;
            var dbName;
            var err;
            var query = options.query;
            var setObject = options.setObject;

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

            ProductCategory = models.get(dbName, 'ProductCategory', CategorySchema);

            ProductCategory.update(query, setObject, {multi: true}, function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null);
            });
        };

        this.findOne = function (query, options, callback) {
            var ProductCategory;
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

            ProductCategory = models.get(dbName, 'ProductCategory', CategorySchema);

            ProductCategory.findOne(query, options, function (err, category) {
                if (err) {
                    return callback(err);
                }

                callback(null, category);
            });
        };

        this.create = function (options, callback) {
            var dbName;
            var ProductCategory;
            var model;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
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

            ProductCategory = models.get(dbName, 'ProductCategory', CategorySchema);
            model = new ProductCategory(options);
            model.save(function (err, result) {
                if (err) {
                    return callback(err);
                }


                callback(null, result);
            });
        };
    };
};
