'use strict';

var mongoose = require('mongoose');
var OrderSchema = mongoose.Schemas.Order;
var ManufacturingOrdersSchema = mongoose.Schemas.manufacturingOrder;
var validator = require('validator');
var _ = require('lodash');
var async = require('async');
var leanWrapper = require('../helpers/callbackWrapper').lean;
var objectId = mongoose.Types.ObjectId;
var unlinkedWorkflowId = require('../constants/mainConstants').DEFAULT_UNLINKED_WORKFLOW_ID;
var InProgressWorkflowId = require('../constants/mainConstants').IN_PROGRESS_WORKFLOW_ID;
var WorkflowHandler = require('../handlers/workflow');

module.exports = function (models) {
    var workflowHandler = new WorkflowHandler(models);

    return new function () {
        this.create = function (options, callback) {
            var dbName;
            var Order;
            var order;
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

            Order = models.get(dbName, 'Order', OrderSchema);
            order = new Order(options);
            order.save(function (err, order) {
                if (err) {
                    return callback(err);
                }

                callback(null, order);
            });
        };

        this.findByIdAndUpdate = function (_id, updateObject, options, callback) {
            var _options = {new: true};
            var dbName;
            var Order;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!_id || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Order = models.get(dbName, 'Order', OrderSchema);
            Order.findByIdAndUpdate(_id, updateObject, _options, function (err, order) {
                if (err) {
                    return callback(err);
                }

                callback(null, order);
            });
        };

        this.findOneAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var Order;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!query || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Order = models.get(dbName, 'Order', OrderSchema);
            Order.findOneAndUpdate(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.findAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var Order;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!query || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Order = models.get(dbName, 'Order', OrderSchema);
            Order.update(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.findById = function (_id, options, callback) {
            var Order;
            var dbName;
            var query;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;

            if (!dbName || !validator.isMongoId(_id)) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options.manufacturingOrder) {
                delete options.manufacturingOrder;
                Order = models.get(dbName, 'ManufacturingOrders', ManufacturingOrdersSchema);
            } else {
                Order = models.get(dbName, 'Order', OrderSchema);
            }

            query = Order.findById(_id);

            if (typeof callback !== 'function') {
                return query;
            }

            query.exec(function (err, order) {
                if (err) {
                    return callback(err);
                }

                callback(null, order);
            });
        };

        this.findByIdAndRemove = function (_id, options, callback) {
            var Order;
            var dbName;
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

            if (!dbName || !_id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Order = models.get(dbName, 'Order', OrderSchema);
            Order.findByIdAndRemove(_id, function (err, order) {
                if (err) {
                    return callback(err);
                }

                callback(null, order);
            });
        };

        this.findOne = function (query, options, callback) {
            var Order;
            var dbName;
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

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Order = models.get(dbName, 'Order', OrderSchema);
            Order.findOne(query, options, function (err, order) {
                if (err) {
                    return callback(err);
                }

                callback(null, order);
            });
        };

        this.find = function (query, options, callback) {
            var Order;
            var dbName;
            var err;
            var lean;
            var searcher;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            lean = options.lean;

            delete options.dbName;
            delete options.lean;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return leanWrapper(err);
            }

            Order = models.get(dbName, 'Order', OrderSchema);
            searcher = Order.find(query, options);

            if (lean) {
                searcher = searcher.lean();
            }

            searcher.exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.count = function (options, callback) {
            var Model;
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

            Model = models.get(dbName, 'Order', OrderSchema);
            Model.count(options, function (err, count) {
                if (err) {
                    return callback(err);
                }

                callback(null, count);
            });
        };

        this.importedOrders = function (dbName, callback) {
            var Order;

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            Order = models.get(dbName, 'Order', OrderSchema);

            Order.aggregate([
                {
                    $group: {
                        _id  : '$channel',
                        count: {$sum: 1}
                    }
                }
            ], function (err, orders) {
                if (err) {
                    return callback(err);
                }

                callback(null, orders);
            });
        };

        this.importedUnlinked = function (dbName, callback) {
            var Model;

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            Model = models.get(dbName, 'Order', OrderSchema);
            Model.aggregate([
                {
                    $match: {
                        workflow: objectId(unlinkedWorkflowId)
                    }
                },
                {
                    $group: {
                        _id  : '$channel',
                        count: {$sum: 1}
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        };

        this.fixOrder = function (options, callback) {
            var Order;
            var dbName;
            var err;
            var field;
            var name;
            var id;
            var orderId;
            var queryObj;

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

                return leanWrapper(err);
            }

            field = options.field;
            name = options.name;
            id = options.id;
            orderId = options.orderId;

            Order = models.get(dbName, 'Order', OrderSchema);

            queryObj = {
                workflow            : unlinkedWorkflowId,
                'conflictTypes.type': field
            };

            if (name) {
                queryObj['conflictTypes.value.name'] = name;
            }

            if (orderId) {
                orderId = orderId.toString();
                queryObj._id = objectId(orderId);
            }

            Order.find(queryObj, function (err, result) {
                if (err) {
                    return callback(err);
                }

                async.each(result, function (order, cb) {
                    var conflictTypes = order.conflictTypes;
                    var type = _.find(conflictTypes, function (el) {
                        return el.type === field;
                    });
                    var index = conflictTypes.indexOf(type);
                    var body = {
                        $set: {}
                    };

                    if (name) {
                        body.$set[field] = id;
                    }

                    if (((type && type.value.name && type.value.name.length) || orderId) && index !== -1) {
                        conflictTypes.splice(index, 1);
                    }

                    body.$set.conflictTypes = conflictTypes;

                    if (conflictTypes.length === 0) {
                        body.$set.workflow = order.tempWorkflow;
                    }

                    Order.findByIdAndUpdate(order._id, body, {new: true}, function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        cb();
                    });
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, {success: true});
                });
            });

        };

        this.setInProgressStatus = function (options, callback) {
            var Order;
            var dbName;
            var err;
            var query;
            var request;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            query = options.query;

            if (!query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Order = models.get(dbName, 'Order', OrderSchema);

            request = {
                query: {},

                session: {
                    lastDb: dbName
                }
            };

            request.query.wId = 'Purchase Order';
            request.query.status = 'In Progress';
            request.query.order = 1;

            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                var updateObj;

                if (err) {
                    return callback(err);
                }

                updateObj = {workflow: workflow._id};

                Order.update(query, {$set: updateObj}, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback();
                });
            });
        };
    };
};
