'use strict';
var mongoose = require('mongoose');

var AvailabilitySchema = mongoose.Schemas.productsAvailability;
var WarehousesSchema = mongoose.Schemas.warehouse;
var LocationsSchema = mongoose.Schemas.locations;
var _ = require('underscore');
var async = require('async');

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var Availability;
            var availability;
            var dbName;
            var err;
            var body = options.body;

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

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);

            availability = new Availability(body);

            availability.save(function (err, doc) {
                if (err) {
                    return callback(err);
                }
                callback(null, doc);
            });
        };

        this.createMulti = function (options, callback) {
            var Availability;
            var dbName;
            var err;

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

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);

            Availability.collection.insertMany(options.availabilities, function (err) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        };

        this.createAvailabilityJob = function (options, callback) {
            var Availability;
            var availability;
            var Warehouse;
            var Location;
            var dbName;
            var err;
            var query = {};
            var warehouseId = options.warehouse;

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

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);
            Warehouse = models.get(dbName, 'warehouses', WarehousesSchema);
            Location = models.get(dbName, 'locations', LocationsSchema);

            if (warehouseId) {
                query._id = warehouseId;
            } else {
                query.isOwn = true;
            }

            Warehouse.findOne(query, function (err, warehouse) {
                var warehouse = warehouse ? warehouse._id : null;

                if (err) {
                    return callback(err);
                }

                Location.findOne({warehouse: warehouse}, function (err, location) {
                    var location = location ? location._id : null;

                    if (err) {
                        return callback(err);
                    }

                    availability = new Availability({
                        product  : options.product,
                        location : location,
                        warehouse: warehouse,
                        isJob    : true
                    });
                    availability.save(function (err, model) {
                        if (err) {
                            return callback(err);
                        }
                        callback();
                    });
                });
            });

        };

        this.updateByQuery = function (options, callback) {
            var Availability;
            var dbName;
            var query = options.query;
            var body = options.body;
            var settings = options.settings;
            var err;

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

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);

            Availability.update(query, body, settings || {}, function (err, availability) {
                if (err) {
                    return callback(err);
                }

                Availability.update({onHand: {$gt: 0}, archived: true}, {$set: {archived: false}}, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    Availability.remove({onHand: 0, orderRows: [], goodsOutNotes: []}, function (err) {
                        if (err) {
                            return callback(err);
                        }
                    });
                });

                callback(null, availability);

            });
        };

        this.updateById = function (options, callback) {
            var Availability;
            var dbName;
            var id = options.id;
            var body = options.body;
            var err;

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

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);

            Availability.findByIdAndUpdate(id, body, {new: true}, function (err, availability) {
                if (err) {
                    return callback(err);
                }

                callback(null, availability);

            });
        };

        this.tryToRempve = function (options, callback) {
            var Availability;
            var dbName;
            var query = options.query;
            var err;

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

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);

            Availability.find(query, function (err, result) {
                var goodsOut = 0;

                if (err) {
                    return callback(err);
                }

                result.forEach(function (el) {
                    goodsOut += el.goodsOutNotes.length;
                });

                if (!goodsOut) {
                    Availability.remove(query, function (err, docs) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, docs);
                    });
                } else {
                    err = new Error("Can't cancel Order because of some Sales");
                    err.status = 400;

                    callback(err);
                }
            });

        };

        this.remove = function (options, callback) {
            var Availability;
            var dbName;
            var query = options.query;
            var err;

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

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);

            Availability.remove(query, function (err, docs) {
                if (err) {
                    return callback(err);
                }
                console.log(docs);

                callback();

            });

        };

        this.find = function (options, callback) {
            var Availability;
            var dbName;
            var id = options.id;
            var query = options.query;
            var err;

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

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);

            Availability.find(query)
                .populate('location', 'name')
                .sort('creationDate')
                .exec(function (err, availability) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, availability);
                });
        };

        this.getProductAvailability = function (query, options, callback) {
            var Availability;
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

            if (!dbName || typeof query !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);
            Availability.aggregate([{
                $match: query
            }, {
                $project: {
                    onHand   : 1,
                    cost     : 1,
                    allocated: {
                        $sum: '$orderRows.quantity'
                    },

                    fulfilled: {
                        $sum: '$goodsOutNotes.quantity'
                    }
                }
            }, {
                $project: {
                    onHand   : 1,
                    allocated: 1,
                    cost     : 1,
                    inStock  : {
                        $add: ['$onHand', '$allocated', '$fulfilled']
                    }
                }
            }, {
                $group: {
                    _id: '$warehouse',

                    inStock: {
                        $sum: '$inStock'
                    },

                    onHand: {
                        $sum: '$onHand'
                    },

                    cost: {
                        $first: '$cost'
                    }
                }
            }], function (err, result) {
                var prodAvailable = {
                    inStock: 0,
                    onHand : 0,
                    cost   : 0
                };

                if (err) {
                    return callback(err);
                }

                if (result && result.length) {
                    prodAvailable = result[0];
                }

                callback(null, prodAvailable);
            });
        };

        this.getList = function (options, callback) {
            var obj = options.match || {};
            var sort = options.sort;
            var skip = options.skip;
            var limit = options.limit;
            var finalProject = options.finalProject;

            var Availability;
            var pipeLine;
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

            if (!dbName || typeof options !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            pipeLine = [
                {
                    $match: {isJob: false}
                },
                {
                    $lookup: {
                        from        : 'warehouse',
                        localField  : 'warehouse',
                        foreignField: '_id',
                        as          : 'warehouse'
                    }
                },

                {
                    $lookup: {
                        from        : 'Products',
                        localField  : 'product',
                        foreignField: '_id',
                        as          : 'product'
                    }
                },
                {
                    $lookup: {
                        from        : 'locations',
                        localField  : 'location',
                        foreignField: '_id',
                        as          : 'location'
                    }
                },
                {
                    $lookup: {
                        from        : 'GoodsNote',
                        localField  : 'goodsInNote',
                        foreignField: '_id',
                        as          : 'goodsInNote'
                    }
                },
                {
                    $lookup: {
                        from        : 'Users',
                        localField  : 'createdBy.user',
                        foreignField: '_id',
                        as          : 'createdBy.user'
                    }
                },
                {
                    $project: {
                        _id             : 1,
                        location        : {$arrayElemAt: ['$location', 0]},
                        warehouse       : {$arrayElemAt: ['$warehouse', 0]},
                        product         : {$arrayElemAt: ['$product', 0]},
                        goodsInNote     : {$arrayElemAt: ['$goodsInNote', 0]},
                        'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
                        description     : 1,
                        cost            : 1,
                        onHand          : 1,
                        allocated       : {
                            $add: [{
                                $sum: '$orderRows.quantity'
                            }, {
                                $sum: '$goodsOutNotes.quantity'
                            }]
                        },

                        inStock: {
                            $add: ['$onHand', {
                                $sum: '$orderRows.quantity'
                            }, {
                                $sum: '$goodsOutNotes.quantity'
                            }]
                        }
                    }
                },
                {
                    $unwind: {
                        path                      : '$product.variants',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from        : 'ProductOptionsValues',
                        localField  : 'product.variants',
                        foreignField: '_id',
                        as          : 'variants'
                    }
                },
                {
                    $project: {
                        _id        : 1,
                        location   : 1,
                        warehouse  : 1,
                        product    : 1,
                        variants   : {$arrayElemAt: ['$variants', 0]},
                        description: 1,
                        cost       : 1,
                        onHand     : 1,
                        allocated  : 1,
                        inStock    : 1,
                        goodsInNote: 1
                    }
                },
                {
                    $group: {
                        _id        : '$_id',
                        location   : {$first: '$location'},
                        product    : {$first: '$product'},
                        goodsInNote: {$first: '$goodsInNote'},
                        warehouse  : {$first: '$warehouse'},
                        createdBy  : {$first: '$createdBy'},
                        description: {$first: '$description'},
                        cost       : {$first: '$cost'},
                        variants   : {$push: '$variants.value'},
                        inStock    : {$first: '$inStock'},
                        allocated  : {$first: '$allocated'},
                        onHand     : {$first: '$onHand'}
                    }
                },
                {
                    $lookup: {
                        from        : 'Order',
                        localField  : 'goodsInNote.order',
                        foreignField: '_id',
                        as          : 'order'
                    }
                },
                {
                    $project: {
                        _id        : 1,
                        location   : 1,
                        warehouse  : 1,
                        product    : 1,
                        createdBy  : '$goodsInNote.createdBy',
                        description: 1,
                        variants   : 1,
                        cost       : 1,
                        onHand     : 1,
                        allocated  : 1,
                        inStock    : 1,
                        order      : {$arrayElemAt: ['$order', 0]}
                    }
                },
                {
                    $match: obj
                },
                {
                    $group: {
                        _id  : null,
                        total: {$sum: 1},
                        root : {$push: '$$ROOT'}
                    }
                },
                {
                    $unwind: '$root'
                },
                {
                    $project: {
                        _id        : '$root._id',
                        location   : '$root.location',
                        product    : '$root.product',
                        goodsInNote: '$root.goodsInNote',
                        warehouse  : '$root.warehouse',
                        createdBy  : '$root.createdBy',
                        description: '$root.description',
                        order      : '$root.order',
                        cost       : '$root.cost',
                        variants   : '$root.variants',
                        total      : 1,
                        value      : {$multiply: ['$root.inStock', '$root.cost']},
                        inStock    : '$root.inStock',
                        allocated  : '$root.allocated',
                        onHand     : '$root.onHand'
                    }
                }
            ];

            if (finalProject) {
                pipeLine.push({$project: finalProject});
            }

            if (sort) {
                pipeLine.push({
                    $sort: sort
                });
            }

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);
            Availability.aggregate(pipeLine, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.getAvailabilityForProducts = function (query, options, callback) {
            var Availability;
            var dbName;
            var err;

            var obj = options.match;
            var sort = options.sort;
            var skip = options.skip;
            var limit = options.limit;

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

            if (!dbName || typeof options !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);
            Availability.aggregate([
                {
                    $match: query
                }, {
                    $group: {
                        _id   : '$product',
                        onHand: {$sum: '$onHand'}
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };
    };
};

