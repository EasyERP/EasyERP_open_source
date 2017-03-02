'use strict';

var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
var async = require('async');
var _ = require('../public/js/libs/underscore/underscore');
var Mailer = require('../helpers/mailer');
var mailer = new Mailer();
var logger = require('../helpers/logger');
var namesRetriever = require('../helpers/namesRetriever');

var History = function (models) {
    var HistoryService = require('../services/history')(models);
    var FollowerService = require('../services/followers')(models);
    var EmployeeService = require('../services/employee')(models);
    var OrgSettingsService = require('../services/organizationSetting')(models);

    this.sendToFollowers = function (options, callback) {
        var dbName = options.dbName;
        var contentName = options.contentName;
        var contentId = options.contentId;
        var followerId = options.followerId;
        var note = options.note;
        var files = options.files;
        var edit = options.edit;
        var query = {};
        var waterfallTasks;
        var _getHistory;
        var _getEmails;
        var err;

        function getHistory(options, cb) {
            if (typeof cb !== 'function') {
                cb = function () {
                };
            }

            if (note && typeof note === 'object') {
                return cb(null, note);
            }

            if (files && typeof note === 'object') {
                return cb(null, files);
            }

            HistoryService.getHistoryForTrackedObject(options, cb);
        }

        function getEmails(query, history, cb) {
            FollowerService
                .find(query, {dbName: dbName})
                .populate('followerId', '_id name workEmail')
                .exec(function (err, employees) {
                    if (err) {
                        logger.error(err.message + '\n\r' + err.stack);
                        return cb(err);
                    }

                    cb(null, history, employees);
                });
        }

        function sendTo(history, employees, cb) {
            var historyEntry;
            var isMe;
            var key;

            if (!note && !files) {
                key = Object.keys(history)[0];
                historyEntry = history[key][0];
            }
            if (files) {
                historyEntry = files;
            } else if (note) {
                historyEntry = note;
            }

            OrgSettingsService.getFromMail({dbName: dbName}, function (err, settings) {
                if (err) {
                    logger.error(err.message + '\n\r' + err.stack);
                    return cb(err);
                }

                async.each(employees, function (empObject, asyncCb) {
                    var employee = empObject.followerId;
                    var mailOptions;
                    var name = employee && employee.name ? employee.name.first + ' ' + employee.name.last : '';

                    if (historyEntry.editedBy) {
                        isMe = historyEntry.editedBy._id.toString() === empObject._id.toString();
                    } else {
                        if (historyEntry.authorId) {
                            isMe = historyEntry.authorId === empObject._id.toString();
                        } else {
                            isMe = historyEntry.user ? historyEntry.user._id === empObject._id.toString() : false;
                        }
                    }

                    mailOptions = {
                        employee   : name,
                        to         : employee.workEmail,
                        contentName: contentName,
                        note       : note,
                        edit       : edit,
                        files      : files,
                        history    : historyEntry,
                        you        : isMe,
                        dbName     : dbName
                    };

                    if (settings && !settings.defaultEmail && settings.contact) {
                        mailOptions.from = settings.contact.email;
                    }

                    mailer.sendHistory(mailOptions, asyncCb);
                }, cb);
            });
        }

        query.contentId = objectId(contentId);

        if (followerId) {
            query.followerId = objectId(followerId);
        }


        if (typeof callback !== 'function') {
            callback = function () {
            };
        }
        if (!dbName) {
            err = new Error('Invalid input parameters');
            err.status = 400;

            console.error(err);

            return callback(err);
        }
        _getHistory = async.apply(getHistory, options);
        _getEmails = async.apply(getEmails, query);

        waterfallTasks = [_getHistory, _getEmails, sendTo];

        async.waterfall(waterfallTasks, callback);
    };

    this.sendToLeadAssigneed = function (options, callback) {
        var dbName = options.dbName;
        var employeeId = options.employeeId;
        var parallelTasks;
        var err;

        function getEmployee(cb) {
            EmployeeService.findById(employeeId, {dbName: dbName}, cb);
        }

        function getDefaultEmail(employee, cb) {
            OrgSettingsService.getFromMail({dbName: dbName}, function (err, settings) {
                if (err) {
                    logger.error(err.message + '\n\r' + err.stack);
                    return cb(err);
                }

                cb(null, employee, settings);
            });
        }

        function sendTo(employee, settings, cb) {
            var mailOptions = {
                to                    : employee.workEmail,
                isOpportunity         : options.isOpportunity,
                employee              : employee.name,
                opportunityName       : options.opportunityName,
                opportunityDescription: options.opportunityDescription
            };

            if (settings && !settings.defaultEmail && settings.contact) {
                mailOptions.from = settings.contact.email;
            }

            mailer.sendAssignedToLead(mailOptions, cb);
        }

        if (typeof callback !== 'function') {
            callback = function () {
            };
        }

        if (!dbName) {
            err = new Error('Invalid input parameters');
            err.status = 400;

            logger.error(err.message + '\n\r' + err.stack);
            return callback(err);
        }

        parallelTasks = [getEmployee, getDefaultEmail, sendTo];

        async.waterfall(parallelTasks, callback);
    };
};

module.exports = History;
