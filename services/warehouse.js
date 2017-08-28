'use strict';
var mongoose = require('mongoose');
var WarehouseSchema = mongoose.Schemas.warehouse;
var locationSchema = mongoose.Schemas.locations;
var ObjectId = mongoose.Types.ObjectId;

var _ = require('underscore');
var async = require('async');

module.exports = function (models) {
    return new function () {

        this.findOne = function (query, options, callback) {
            var dbName;
            var err;
            var Warehouse;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Warehouse = models.get(dbName, 'warehouse', WarehouseSchema);

            Warehouse.findOne(query, options, function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });

        };

        this.create = function (options, callback) {
            var Warehouse;
            var dbName;
            var err;
            var body = options.body;
            var warehouse;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (!body || !Object.keys(body).length) {
                body = {
                    "_id"      : ObjectId("57dfc6ea6066337b771e99e2"),
                    "createdBy": {
                        "date": new Date(),
                        "user": null
                    },
                    "updatedBy": {
                        "date": new Date(),
                        "user": null
                    },
                    "main"     : true,
                    "isOwn"    : true,
                    "address"  : {},
                    "name"     : "Main Warehouse",
                    "__v"      : 0,
                    "account"  : ObjectId("5788b4be52adaf4c49e4b51c")
                };
            }

            Warehouse = models.get(dbName, 'warehouse', WarehouseSchema);

            warehouse = new Warehouse(body);

            warehouse.save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                callback(null, model);
            });
        };

        this.createLocation = function (options, callback) {
            var Location;
            var dbName;
            var err;
            var body = options.body;
            var location;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (!body || !Object.keys(body).length) {
                body = {
                    "_id"      : ObjectId("57dfc7076066337b771e99e4"),
                    "updatedBy": {
                        "date": new Date(),
                        "user": null
                    },
                    "createdBy": {
                        "date": new Date(),
                        "user": null
                    },
                    "zone"     : null,
                    "warehouse": ObjectId("57dfc6ea6066337b771e99e2"),
                    "groupingD": "Bin",
                    "groupingC": "Shelf",
                    "groupingB": "Bay",
                    "groupingA": "Alsle",
                    "name"     : "Alsle.Bay.Shelf.Bin"
                };
            }

            Location = models.get(dbName, 'location', locationSchema);

            location = new Location(body);

            location.save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                callback(null, model);
            });
        };

        this.findLocation = function (query, options, callback){
            var dbName;
            var err;
            var Location;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Location = models.get(dbName, 'location', locationSchema);

            Location.findOne(query, options, function (err, doc) {
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        };

    };
};

