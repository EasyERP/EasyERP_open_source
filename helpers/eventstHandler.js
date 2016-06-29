var events = require('events');
var event = new events.EventEmitter();
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

    var io = app.get('io');
    var redisStore = require('./redisClient');
    var isoWeekYearComposer = require('./isoWeekYearComposer');
    var moment = require('../public/js/libs/moment/moment');

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

    event.on('fetchJobsCollection', function (options) {
        io.emit('fetchJobsCollection', options);
    });

    event.on('fetchInvoiceCollection', function (options) {
        io.emit('fetchInvoiceCollection', options);
    });

    event.on('sendMessage', function (options) {
        io.emit('sendMessage', options);
    });

    return event;
};

module.exports = eventsHandler;
