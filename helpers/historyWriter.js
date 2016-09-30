var mongoose = require('mongoose');
var objectId = mongoose.Types.ObjectId;
var historyMapper = require('../constants/historyMapper');
var async = require('async');
var _ = require('../public/js/libs/underscore/underscore');
var Mailer = require('../helpers/mailer');
var mailer = new Mailer();

var History = function (models) {
    'use strict';

    var HistoryEntrySchema = mongoose.Schemas.History;
    var OrgSettingsSchema = mongoose.Schemas.orgSettingsSchema;
    var followersSchema = mongoose.Schemas.followers;

    function generateHistoryEntry(contentType, keyValue) {
        var mapSchema = historyMapper[contentType.toUpperCase()];
        var mapSchemaKeys = Object.keys(mapSchema.map);
        var historyEntry;
        var mappedValue;
        var i;

        function processKey(keyPath) {
            var keys = keyPath.split('.');
            var val;

            if (keys[0] === keyValue.key && (keys.length === 1 || keys[1] === Object.keys(keyValue.value)[0])) {
                val = keyValue.value;

                if (keys.length > 1) {
                    keys.shift();

                    for (i = keys.length - 1; i >= 0; i--) {
                        if (val.hasOwnProperty(keys[i])) {
                            val = val[keys[i]];
                        } else {
                            return null;
                        }
                    }
                }

                mappedValue = mapSchema.map[keyPath];

                historyEntry = {
                    collectionName: mapSchema.collectionName,
                    contentType   : contentType,
                    newValue      : val,
                    changedField  : mappedValue.name,
                    isRef         : mappedValue.isRef
                };

                if (mappedValue.isRef) {
                    if (objectId.isValid(val)) {
                        historyEntry.newValue = objectId(val);  // toDo need to be investigated, sometimes an error occurs
                    } else {
                        historyEntry.newValue = val; // toDo need to be investigated, sometimes an error occurs
                    }
                }
            } else {
                return null;
            }
        }

        for (i = mapSchemaKeys.length - 1; i >= 0; i--) {
            processKey(mapSchemaKeys[i]);
        }

        return historyEntry;
    }

    this.sendToFollowers = function (options) {
        sendToFollowers(options);
    };

    function sendToFollowers(options) {
        var req = options.req;
        var contentName = options.contentName;
        var FollowersModel = models.get(req.session.lastDb, 'followers', followersSchema);
        var contentId = options.contentId;
        var historyRecord = options.historyRecord;
        var followerId = options.followerId;
        var deal = options.deal;
        var note = options.note;
        var edit = options.edit;
        var files = options.files;
        var waterfallFuncs;
        var query = {};

        query.contentId = objectId(contentId);

        if (followerId) {
            query.followerId = objectId(followerId);
        }

        function getHistory(cb) {
            if (note) {
                return cb(null, note);
            }

            if (files) {
                return cb(null, files);
            }

            getHistoryForTrackedObject({req: req, _id: historyRecord._id}, cb);
        }

        function getEmails(history, cb) {
            FollowersModel.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'followerId',
                    foreignField: '_id',
                    as          : 'followerId'
                }
            }, {
                $project: {
                    followerId: {$arrayElemAt: ['$followerId', 0]}
                }
            }, {
                $project: {
                    name : {$concat: ['$followerId.name.first', ' ', '$followerId.name.last']},
                    _id  : '$followerId._id',
                    email: '$followerId.workEmail'
                }
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, history || note || files, result);
            });
        }

        function sendTo(history, emails, cb) {
            async.each(emails, function (empObject, asyncCb) {
                var key;
                var historyEntry;
                var options;

                if (!note && !files) {
                    key = Object.keys(history)[0];
                    historyEntry = history[key][0];
                }
                if (files) {
                    historyEntry = files;
                } else if (note) {
                    historyEntry = note;
                }

                options = {
                    employee   : empObject.name,
                    to         : empObject.email,
                    contentName: contentName,
                    note       : note,
                    edit       : edit,
                    files      : files,
                    history    : historyEntry,
                    you        : historyEntry.editedBy ? historyEntry.editedBy._id.toString() === empObject._id.toString() : historyEntry.authorId ? historyEntry.authorId === empObject._id.toString() : historyEntry.user ? historyEntry.user._id === empObject._id.toString() : false,
                    req        : req
                };

                getFromMail(options, asyncCb);
            }, cb);
        }

        waterfallFuncs = [getHistory, getEmails, sendTo];

        async.waterfall(waterfallFuncs, function (err, result) {
            if (err) {
                return console.log(err);
            }
        });

    }

    function getFromMail(mailOptions, cb){

        var OrgSettings;
        if (mailOptions.req){
            OrgSettings = models.get(mailOptions.req.session.lastDb, 'orgSettings', OrgSettingsSchema);
            OrgSettings.findOne()
                .populate('contact', 'email')
                .exec(function(err, settings){
                    if (err){
                        return console.log(err);
                    }
                    if (settings && !settings.defaultEmail && settings.contact){
                        mailOptions.from = settings.contact.email;
                    }
                    mailer.sendHistory(mailOptions, cb);
                });
        } else {
            mailer.sendHistory(mailOptions, cb);
        }
    }

    this.addEntry = function (options, callback) {
        var contentType = options.contentType;
        var data = options.data;
        var contentId = options.contentId;
        var contentName = options.contentName;
        var deal = options.deal;
        var followerId = options.followerId;
        var historyRecords = [];
        var date = new Date();
        var HistoryEntry = models.get(options.req.session.lastDb, 'History', HistoryEntrySchema);
        var dataKeys = Object.keys(data);
        var keyValue;
        var historyEntry;
        var key;
        var i;
        var keyArray;
        var arrayDataKey;
        for (i = dataKeys.length - 1; i >= 0; i--) {
            key = dataKeys[i];

        }

        for (i = dataKeys.length - 1; i >= 0; i--) {

            key = dataKeys[i];

            if (key.indexOf('.') !== -1) {
                keyArray = key.split('.');
                if (!data[keyArray[0]]) {
                    data[keyArray[0]] = {};
                }

                data[keyArray[0]][keyArray[1]] = data[key];
                dataKeys.unshift(keyArray[0]);
                i++;
                continue;
            }
            keyValue = {
                key  : key,
                value: data[key]
            };

            if (data[key]) {
                if (typeof data[key] === 'object' && !(data[key] instanceof objectId) && !(data[key] instanceof Date)) {
                    arrayDataKey = Object.keys(data[key]);
                    arrayDataKey.forEach(function (elem, index) {
                        var name = arrayDataKey[index];

                        keyValue.value = {};
                        keyValue.value[name] = data[key][name];
                        historyEntry = generateHistoryEntry(contentType, keyValue);

                        if (historyEntry) {

                            historyEntry.editedBy = objectId(options.req.session.uId);
                            historyEntry.contentId = objectId(options.contentId);
                            historyEntry.date = date;

                            historyRecords.push(historyEntry);
                        }
                        delete data[key][name];
                    });
                } else {
                    historyEntry = generateHistoryEntry(contentType, keyValue);

                    if (historyEntry) {

                        historyEntry.editedBy = objectId(options.req.session.uId);
                        historyEntry.contentId = objectId(options.contentId);
                        historyEntry.date = date;

                        historyRecords.push(historyEntry);
                    }
                }
            }

        }

        if (historyRecords.length) {

            async.each(historyRecords, function (historyRecord, cb) {
                HistoryEntry.aggregate([{
                    $match: {
                        changedField: historyRecord.changedField,
                        contentId   : historyRecord.contentId
                    }
                }, {
                    $sort: {
                        date: -1
                    }
                }, {
                    $limit: 1
                }], function (err, result) {
                    var historyItem;

                    if (err) {
                        console.log(err);
                        cb();
                    } else {
                        if (result.length) {
                            historyRecord.prevValue = result[0].newValue;
                        } else {
                            historyRecord.prevValue = null;
                        }

                        if (historyRecord.prevValue || historyRecord.newValue) {
                            historyItem = new HistoryEntry(historyRecord);

                            historyItem.save(function (error, res) {
                                if (error) {
                                    return console.log(error);
                                }

                                sendToFollowers({
                                    contentName  : contentName || 'task',
                                    req          : options.req,
                                    contentId    : deal || contentId,
                                    deal         : deal,
                                    historyRecord: res,
                                    followerId   : followerId
                                });
                                cb();
                            });
                        } else {
                            cb();
                        }
                    }
                });
            }, function () {
                if (typeof callback === 'function') {
                    callback();
                }
            });

        } else if (typeof callback === 'function') {
            callback();
        }
    };

    this.deleteHistoryById = function (req, id) {
        var HistoryEntry = models.get(req.session.lastDb, 'History', HistoryEntrySchema);
        HistoryEntry.remove(id, function (err, res) {
            if (err) {
                console.log(err);
            }
            console.log('History was deleted success');
        });
    }

    this.getHistoryForTrackedObject = function (options, callback, forNote) {
        getHistoryForTrackedObject(options, callback, forNote);
    };

    function getHistoryForTrackedObject(options, callback, forNote) {
        var id = options.id;
        var _id = options._id;
        var filter = options.filter || {};
        var query = {};
        var matchObject = {};
        var queryObj = {};
        var HistoryEntry = models.get(options.req.session.lastDb, 'History', HistoryEntrySchema);

        if (_id) {
            query._id = _id;
            matchObject._id = _id;
            queryObj._id = _id;
        } else {
            query.contentId = id;
            matchObject.contentId = id;
            matchObject.isRef = {$ne: true};
            queryObj.contentId = id;
        }

        function getFunctionToGetForRefField(fieldDescription) {
            var fieldCollection = fieldDescription.collection;
            var changedField = fieldDescription.name;
            var project = fieldDescription.project;

            return function getHistoryWithPopulation(cb) {

                query.changedField = changedField;

                HistoryEntry.aggregate([{
                    $match: query
                }, {
                    $match: filter
                }, {
                    $lookup: {
                        from        : 'Users',
                        localField  : 'editedBy',
                        foreignField: '_id',
                        as          : 'editedBy'
                    }
                }, {
                    $lookup: {
                        from        : fieldCollection,
                        localField  : 'newValue',
                        foreignField: '_id',
                        as          : 'tmp'
                    }
                }, {
                    $project: {
                        editedBy      : {$arrayElemAt: ['$editedBy', 0]},
                        tmp           : {$arrayElemAt: ['$tmp', 0]},
                        newValue      : 1,
                        prevValue     : 1,
                        date          : 1,
                        changedField  : 1,
                        contentId     : 1,
                        collectionName: 1
                    }
                }, {
                    $project: {
                        'editedBy.login': '$editedBy.login',
                        'editedBy._id'  : '$editedBy._id',
                        newValue        : project,
                        prevValue       : 1,
                        date            : 1,
                        changedField    : 1,
                        contentId       : 1,
                        collectionName  : 1
                    }
                }, {
                    $lookup: {
                        from        : fieldCollection,
                        localField  : 'prevValue',
                        foreignField: '_id',
                        as          : 'tmp'
                    }
                }, {
                    $project: {
                        editedBy      : 1,
                        tmp           : {$arrayElemAt: ['$tmp', 0]},
                        newValue      : 1,
                        prevValue     : 1,
                        date          : 1,
                        changedField  : 1,
                        contentId     : 1,
                        collectionName: 1
                    }
                }, {
                    $project: {
                        editedBy      : 1,
                        newValue      : 1,
                        prevValue     : project,
                        date          : 1,
                        changedField  : 1,
                        _id           : 0,
                        contentId     : 1,
                        collectionName: 1
                    }
                }], function (err, result) {
                    if (typeof callback === 'function') {
                        cb(err, result);
                    }
                });
            };
        }

        function getHistoryWithoutPopulation(cb) {

            HistoryEntry.aggregate([{
                $match: matchObject
            }, {
                $match: filter
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'editedBy',
                    foreignField: '_id',
                    as          : 'editedBy'
                }
            }, {
                $project: {
                    editedBy      : {$arrayElemAt: ['$editedBy', 0]},
                    newValue      : 1,
                    prevValue     : 1,
                    date          : 1,
                    changedField  : 1,
                    contentId     : 1,
                    collectionName: 1
                }
            }, {
                $project: {
                    'editedBy.login': '$editedBy.login',
                    'editedBy._id'  : '$editedBy._id',
                    newValue        : 1,
                    prevValue       : 1,
                    date            : 1,
                    changedField    : 1,
                    _id             : 0,
                    contentId       : 1,
                    collectionName  : 1
                }
            }], function (err, result) {
                if (typeof callback === 'function') {
                    cb(err, result);
                }
            });
        }

        HistoryEntry.findOne(queryObj, function (err, res) {
            var contentType;
            var mapSchema;
            var mapSchemaKeys;
            var parallel = [];
            var parallelFunc;
            var field;
            var key;
            var i;

            if (res) {
                contentType = res.contentType;
                mapSchema = historyMapper[contentType.toUpperCase()];
                mapSchemaKeys = Object.keys(mapSchema.map);

                for (i = mapSchemaKeys.length - 1; i >= 0; i--) {
                    key = mapSchemaKeys[i];
                    field = mapSchema.map[key];

                    if (field.isRef) {
                        parallelFunc = getFunctionToGetForRefField(field);
                        parallel.push(parallelFunc);
                    }
                }

                parallel.push(getHistoryWithoutPopulation);

                async.parallel(parallel, function (errr, results) {
                    var responseArr = [].concat.apply([], results);
                    responseArr = _.sortBy(responseArr, 'date');

                    if (!forNote) {
                        responseArr = _.groupBy(responseArr, 'date');
                    }
                    callback(errr, responseArr);
                });
            } else {
                callback(null, []);
            }
        });

    }
};

module.exports = History;
