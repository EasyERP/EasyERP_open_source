'use strict';
var mongoose = require('mongoose');
var CategorySchema = mongoose.Schemas.ProductCategory;
var ObjectId = mongoose.Types.ObjectId;

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

        this.find = function (query, options, callback) {
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

            ProductCategory.find(query, options, function (err, categories) {
                if (err) {
                    return callback(err);
                }

                callback(null, categories);
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

            if (!Object.keys(options).length) {
                options = {
                    "_id"                : ObjectId('564591f9624e48551dfe3b23'),
                    "sequence"           : 0,
                    "nestingLevel"       : 1,
                    "editedBy"           : {
                        "date": new Date(),
                        "user": null
                    },
                    "createdBy"          : {
                        "date": new Date(),
                        "user": null
                    },
                    "users"              : [],
                    "parent"             : null,
                    "fullName"           : "All",
                    "name"               : "All",
                    "__v"                : 0,
                    "productsCount"      : 0,
                    "child"              : [],
                    "main"               : false,
                    "externalId"         : null,
                    "taxesAccount"       : null,
                    "debitAccount"       : null,
                    "creditAccount"      : null,
                    "bankExpensesAccount": null,
                    "otherIncome"        : null,
                    "otherLoss"          : null
                };
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
