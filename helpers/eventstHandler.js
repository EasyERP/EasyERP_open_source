var events = require('events');
var event = new events.EventEmitter();
var async = require('async');
var eventsHandler;

require('pmx').init();

eventsHandler = function (app, mainDb) {
    'use strict';

    var dbsObject = mainDb.dbsObject;
    var mongoose = require('mongoose');
    var _ = require('underscore');
    var logWriter = require('./logger.js');
    var models = require('./models.js')(dbsObject);
    var tasksSchema = mongoose.Schemas.Task;
    var projectSchema = mongoose.Schemas.Project;
    var employeeSchema = mongoose.Schemas.Employee;
    var jobPositionSchema = mongoose.Schemas.JobPosition;
    var opportunitiesSchema = mongoose.Schemas.Opportunitie;
    var wTrackSchema = mongoose.Schemas.wTrack;
    var jobsSchema = mongoose.Schemas.jobs;

    var OrderSchema = mongoose.Schemas.Order;
    var GoodsOutSchema = mongoose.Schemas.GoodsOutNote;
    var OrderRowsSchema = mongoose.Schemas.OrderRow;
    var AvailabilitySchema = mongoose.Schemas.productsAvailability;
    var ManufacturingOrdersSchema = mongoose.Schemas.manufacturingOrder;

    var io = app.get('io');
    var redisStore = require('./redisClient');
    var isoWeekYearComposer = require('./isoWeekYearComposer');
    var moment = require('../public/js/libs/moment/moment');
    var CONSTANTS = require('../constants/mainConstants');
    var JournalEntryHandler = require('../handlers/journalEntry');
    var journalEntry = new JournalEntryHandler(models);

    // binding for remove Workflow
    event.on('removeWorkflow', function (req, wId, id) {
        var query;

        switch (wId) {
            case 'Opportunities':
            case 'Leads':
                query = models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema);
                break;
            case 'Projects':
                query = models.get(req.session.lastDb, 'Project', projectSchema);
                break;
            case 'Tasks':
                query = models.get(req.session.lastDb, 'Tasks', tasksSchema);
                break;
            case 'Applications':
                query = models.get(req.session.lastDb, 'Employees', employeeSchema);
                break;
            case 'Jobpositions':
                query = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
                break;
            // skip default case
        }

        if (query) {
            query.update({workflow: id}, {workflow: null}, {multi: true}).exec(function (err) {
                if (err) {
                    logWriter.error(err);
                }
            });
        }
    });

    event.on('recalculateKeys', function (options) {
        var req = options.req;
        var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var wTrackModel;
        var month;
        var week;
        var year;
        var _id;
        var isoYear;
        var dateByWeek;
        var dateByMonth;
        var query;

        if (options.wTrack) {
            wTrackModel = options.wTrack;

            if ('toJSON' in options.wTrack) {
                wTrackModel = options.wTrack.toJSON();
            }

            month = wTrackModel.month;
            week = wTrackModel.week;
            year = wTrackModel.year;
            _id = wTrackModel._id;

            isoYear = isoWeekYearComposer(wTrackModel);
            dateByWeek = isoYear * 100 + week;
            dateByMonth = year * 100 + month;

            query = {dateByWeek: dateByWeek, dateByMonth: dateByMonth, isoYear: isoYear};

            wTrack.findByIdAndUpdate(_id, query, {new: true}, function (err) {
                if (err) {
                    return logWriter.error(err);
                }
            });
        }

    });

    event.on('recalculateStatus', recalculateStatus);

    event.on('setReconcileTimeCard', function (options) {
        var req = options.req;
        var wTrackModel = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var jobsModel = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var employee = options.employee;
        var month = options.month;
        var year = options.year;
        var week = options.week;
        var jobs = options.jobs;
        var query = {};
        var date;
        var groupedResult;

        if (month && year) {
            query = {month: month, year: year};
            date = moment().year(year).month(month).date(1);
        } else if (year && week) {
            query = {week: week, year: year};
            date = moment().year(year).isoWeek(week).day(1);
        }

        if (employee) {
            query.employee = employee;
        }

        if (jobs) {
            jobsModel.update({_id: jobs}, {$set: {reconcile: true}}, function (err, result) {
                if (err) {
                    logWriter.error(err);
                }
            });
        } else {
            wTrackModel.find(query, {jobs: 1}, function (err, result) {
                if (err) {
                    return logWriter.error(err);
                }

                groupedResult = _.groupBy(result, 'jobs');
                jobs = Object.keys(groupedResult);

                jobsModel.update({_id: {$in: jobs}}, {$set: {reconcile: true}}, function (err) {
                    if (err) {
                        logWriter.error(err);
                    }
                });
            });
        }

        if (date) {
            journalEntry.setReconcileDate(req, date);
        } else if (employee) {
            Employee.findById(employee, {hire: 1}, function (err) {
                if (err) {
                    return logWriter.error(err);
                }

                date = employee.hire[0];

                journalEntry.setReconcileDate(req, date);
            });
        }
    });

    function recalculateStatus(req, orderId, next) {
        var dbName = req;
        var OrderRows;
        var Order;
        var isManufacturing = req.isManufacturing;

        if (typeof req === 'object') {
            dbName = req.session.lastDb;
        }

        Order = models.get(dbName, 'Order', OrderSchema);

        if (isManufacturing) {
            Order = models.get(dbName, 'ManufacturingOrders', ManufacturingOrdersSchema);
        }

        OrderRows = models.get(dbName, 'orderRows', OrderRowsSchema);

        OrderRows.find({
            order                        : orderId,
            product                      : {$ne: null},
            isFromManufacturingForReceive: {$ne: true}
        })
            .populate('product', 'cost name sku info')
            .exec(function (err, docs) {
                if (err) {
                    return next(err);
                }

                getAvailableForRows(req, docs, function (err, status) {
                    var updateObj = {status: status};
                    if (err) {
                        return next(err);
                    }

                    if (isManufacturing && status && status.shipped !== 'NOT') {
                        updateObj = {
                            status  : status,
                            workflow: CONSTANTS.ORDERDONE
                        };
                    }

                    Order.findByIdAndUpdate(orderId, updateObj, function (err, el) {
                        if (err) {
                            return next(err);
                        }
                        console.log('Status updated');

                    });
                });

            });
    }

    function getAvailableForRows(req, docs, cb) {
        var dbName = req;
        var Availability;
        var GoodsOutNote;

        if (typeof req === 'object') {
            dbName = req.session.lastDb;
        }

        Availability = models.get(dbName, 'productsAvailability', AvailabilitySchema);
        GoodsOutNote = models.get(dbName, 'GoodsOutNote', GoodsOutSchema);
        var stockStatus = {};

        if (docs && docs.length) {
            async.each(docs, function (elem, eahcCb) {
                var product;

                elem = elem.toJSON();
                product = elem.product ? elem.product._id : null;

                Availability.aggregate([{
                    $match: {
                        product  : product,
                        warehouse: elem.warehouse
                    }
                }, {
                    $project: {
                        product   : 1,
                        warehouse : 1,
                        onHand    : 1,
                        filterRows: {
                            $filter: {
                                input: '$orderRows',
                                as   : 'elem',
                                cond : {$eq: ['$$elem.orderRowId', elem._id]}
                            }
                        },

                        orderRows: 1
                    }
                }, {
                    $project: {
                        product  : 1,
                        warehouse: 1,
                        onHand   : 1,
                        allocated: {
                            $sum: '$filterRows.quantity'
                        }
                    }
                }, {
                    $project: {
                        product  : 1,
                        warehouse: 1,
                        onHand   : 1,
                        allocated: 1
                    }
                }, {
                    $group: {
                        _id      : '$warehouse',
                        allocated: {
                            $sum: '$allocated'
                        }
                    }
                }], function (err, availability) {
                    if (err) {
                        return eahcCb(err);
                    }

                    GoodsOutNote.aggregate([{
                        $match: {
                            'orderRows.orderRowId': elem._id,
                            _type                 : {$ne: 'stockReturns'}
                        }
                    }, {
                        $project: {
                            name    : '$name',
                            orderRow: {
                                $filter: {
                                    input: '$orderRows',
                                    as   : 'elem',
                                    cond : {$eq: ['$$elem.orderRowId', elem._id]}
                                }
                            },

                            status: 1
                        }
                    }, {
                        $project: {
                            name    : '$name',
                            orderRow: {$arrayElemAt: ['$orderRow', 0]},
                            status  : 1
                        }
                    }, {
                        $project: {
                            name    : '$name',
                            orderRow: '$orderRow.orderRowId',
                            quantity: '$orderRow.quantity',
                            status  : 1
                        }
                    }], function (err, docs) {
                        var fullfillOnRow = 0;
                        var shippedOnRow = 0;
                        var allocatedOnRow;
                        var shippedDocs;

                        if (err) {
                            return eahcCb(err);
                        }

                        availability = availability && availability.length ? availability[0].allocated : 0;

                        if (!docs || !docs.length) {

                            /*if (!stockStatus.fulfillStatus) {
                             stockStatus.fulfillStatus = 'NOA';
                             }*/

                            stockStatus.fulfillStatus = (stockStatus.fulfillStatus === 'NOA') || (stockStatus.fulfillStatus === 'ALL') ? 'NOA' : 'NOT';
                            stockStatus.shippingStatus = (stockStatus.shippingStatus === 'NOA') || (stockStatus.shippingStatus === 'ALL') ? 'NOA' : 'NOT';
                        } else {
                            shippedDocs = _.filter(docs, function (el) {
                                if (el.status && el.status.shipped) {
                                    return el;
                                }
                            });

                            if (shippedDocs.length) {
                                shippedDocs.forEach(function (el) {
                                    shippedOnRow += el.quantity;
                                });

                                if (shippedOnRow !== elem.quantity) {
                                    stockStatus.shippingStatus = 'NOA';
                                } else {
                                    stockStatus.shippingStatus = stockStatus.shippingStatus && (stockStatus.shippingStatus === 'NOA') ? 'NOA' : 'ALL';
                                }
                            } else {
                                stockStatus.shippingStatus = ((stockStatus.shippingStatus === 'NOA') || (stockStatus.shippingStatus === 'ALL')) ? 'NOA' : 'NOT';
                            }

                            docs.forEach(function (el) {
                                fullfillOnRow += el.quantity;
                            });

                            if (fullfillOnRow !== elem.quantity) {
                                stockStatus.fulfillStatus = 'NOA';
                            } else {
                                stockStatus.fulfillStatus = (stockStatus.fulfillStatus === 'NOA') ? 'NOA' : 'ALL';
                            }
                        }

                        allocatedOnRow = fullfillOnRow + availability;

                        if (!allocatedOnRow) {
                            // stockStatus.allocateStatus = stockStatus.allocateStatus || 'NOA';
                            stockStatus.allocateStatus = ((stockStatus.allocateStatus === 'NOA') || (stockStatus.allocateStatus === 'ALL')) ? 'NOA' : 'NOT';
                        } else if (allocatedOnRow !== elem.quantity) {
                            stockStatus.allocateStatus = 'NOA';
                        } else {
                            stockStatus.allocateStatus = stockStatus.allocateStatus && (stockStatus.allocateStatus === 'NOA') ? 'NOA' : 'ALL';
                        }

                        eahcCb();

                    });
                });

            }, function (err) {
                if (err) {
                    return cb(err);
                }

                cb(null, stockStatus);

            });
        } else {
            stockStatus.fulfillStatus = 'NOR';
            stockStatus.allocateStatus = 'NOR';
            stockStatus.shippingStatus = 'NOR';

            cb(null, stockStatus);
        }

    }

// if name was updated, need update related wTrack, or other models
    event.on('updateName', function (id, targetModel, searchField, fieldName, fieldValue, fieldInArray) {
        // fieldInArray(bool) added for update values in array. If true then fieldName contains .$.
        var sercObject = {};
        var updateObject = {};

        sercObject[searchField] = id;

        if (fieldInArray) {
            updateObject.$set = {};
            updateObject.$set[fieldName] = fieldValue;
        } else {
            updateObject[fieldName] = fieldValue;
        }

        targetModel.update(sercObject, updateObject, {multi: true}, function (err) {
            if (err) {
                logWriter.error(err);
            }
        });
    });
// binding for Sequence
    event.on('updateSequence', function (model, sequenceField, start, end, workflowStart, workflowEnd, isCreate, isDelete, callback) {
        var query;
        var objFind = {};
        var objChange = {};
        var inc;
        var c;

        if (workflowStart === workflowEnd) {// on one workflow
            if (!(isCreate || isDelete)) {
                inc = -1;

                if (start > end) {
                    inc = 1;
                    c = end;
                    end = start;
                    start = c;
                } else {
                    end -= 1;
                }
                objChange = {};
                objFind = {workflow: workflowStart};
                objFind[sequenceField] = {$gte: start, $lte: end};
                objChange[sequenceField] = inc;
                query = model.update(objFind, {$inc: objChange}, {multi: true});
                query.exec(function (err, res) {
                    if (callback) {
                        callback((inc === -1) ? end : start);
                    }
                });
            } else {
                if (isCreate) {
                    query = model.count({workflow: workflowStart}).exec(function (err, res) {
                        if (callback) {
                            callback(res);
                        }
                    });
                }
                if (isDelete) {
                    objChange = {};
                    objFind = {workflow: workflowStart};
                    objFind[sequenceField] = {$gt: start};
                    objChange[sequenceField] = -1;
                    query = model.update(objFind, {$inc: objChange}, {multi: true});
                    query.exec(function (err, res) {
                        if (callback) {
                            callback(res);
                        }
                    });
                }
            }
        } else {// between workflow
            objChange = {};
            objFind = {workflow: workflowStart};
            objFind[sequenceField] = {$gte: start};
            objChange[sequenceField] = -1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec();
            objFind = {workflow: workflowEnd};
            objFind[sequenceField] = {$gte: end};
            objChange[sequenceField] = 1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec(function () {
                if (callback) {
                    callback(end);
                }
            });

        }
    });
// Emit UI event for information user about some changes
    event.on('recollectVacationDash', function (options) {
        var dbName;

        options = options || {};
        dbName = options.dbName;
        io.emit('recollectVacationDash', dbName);
        redisStore.removeAllFromStorage('dashboardVacation');
    });

    event.on('clearAllCashedData', function () {
        io.emit('clearAllCashedData');
    });

    event.on('fetchJobsCollection', function (options) {
        io.emit('fetchJobsCollection', options);
    });

    event.on('editModel', function (options) {
        io.emit('editModel', options);
    });

    event.on('fetchInvoiceCollection', function (options) {
        io.emit('fetchInvoiceCollection', options);
    });

    event.on('sendMessage', function (options) {
        io.emit('sendMessage', options);
    });

    event.on('savedCategories', function (options) {
        io.emit('savedCategories', options);
    });

    event.on('savedProduct', function (options) {
        io.emit('savedProduct', options);
    });

    event.on('savedCustomers', function (options) {
        io.emit('savedCustomers', options);
    });

    event.on('savedOrders', function (options) {
        io.emit('savedOrders', options);
    });

    event.on('savedInvoices', function (options) {
        io.emit('savedInvoices', options);
    });

    event.on('savedInventory', function (options) {
        io.emit('savedInventory', options);
    });

    event.on('getAllDone', function (options) {
        io.emit('getAllDone', options);
    });

    event.on('recollectedStats', function (options) {
        io.emit('recollectedStats', options);
    });

    event.on('showResolveConflict', function (options) {
        io.emit('showResolveConflict', options);
    });

    event.on('showInfoDelete', function (options) {
        io.emit('showInfoDelete', options);
    });

    return event;
};

module.exports = eventsHandler;
