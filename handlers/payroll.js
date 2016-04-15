var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');

var PayRoll = function (models) {
    "use strict";
    var access = require("../Modules/additions/access.js")(models);
    var PayRollSchema = mongoose.Schemas.PayRoll;
    var EmployeeSchema = mongoose.Schemas.Employees;
    var journalEntrySchema = mongoose.Schemas.journalEntry;
    var CONSTANTS = require('../constants/mainConstants.js');

    var _ = require('lodash');

    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var ObjectId = mongoose.Types.ObjectId;
    var mid = 66;

    var departmentArray = CONSTANTS.NOT_DEV_ARRAY;

    var journalArray = [ObjectId(CONSTANTS.SALARY_PAYABLE), ObjectId(CONSTANTS.OVERTIME_PAYABLE)];

    var composeExpensesAndCache = require('../helpers/expenses')(models);

    var JournalEntryHandler = require('./journalEntry');
    var journalEntry = new JournalEntryHandler(models);

    /*function convertType(array, type) {
     var i;

     if (type === 'integer') {
     for (i = array.length - 1; i >= 0; i--) {
     array[i] = parseInt(array[i], 10);
     }
     } else if (type === 'boolean') {
     for (i = array.length - 1; i >= 0; i--) {
     if (array[i] === 'true') {
     array[i] = true;
     } else if (array[i] === 'false') {
     array[i] = false;
     } else {
     array[i] = null;
     }
     }
     }
     }*/

    /*function caseFilter(filter) {
     var condition;
     var resArray = [];
     var filtrElement = {};
     var key;
     var filterName;

     for (filterName in filter) {
     condition = filter[filterName].value;
     key = filter[filterName].key;

     switch (filterName) {
     case 'employee':
     filtrElement[key] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'type':
     filtrElement[key] = {$in: condition.objectID()};
     resArray.push(filtrElement);
     break;
     case 'year':
     convertType(condition, 'integer');
     filtrElement[key] = {$in: condition};
     resArray.push(filtrElement);
     break;
     case 'month':
     convertType(condition, 'integer');
     filtrElement[key] = {$in: condition};
     resArray.push(filtrElement);
     break;
     case 'dataKey':
     convertType(condition, 'integer');
     filtrElement[key] = {$in: condition};
     resArray.push(filtrElement);
     break;
     }
     }

     return resArray;
     }*/

    this.create = function (req, res, next) {
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
        var body = req.body;
        var payRollModel;
        var error;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                body.createdBy = {
                    user: req.session.uId,
                    date: new Date().toISOString()
                };

                payRollModel = new PayRoll(mapObject(body));

                payRollModel.save(function (err, payRoll) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(payRoll);
                    composeExpensesAndCache(req);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            return next(error);
        }
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var error;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                PayRoll.remove({_id: id}, function (err, payRoll) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(payRoll);
                    composeExpensesAndCache(req);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            return next(error);
        }
    };

    this.removeByDataKey = function (req, res, next) {
        var body = req.body;
        var error;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
        var dataKeys = body && body.dataKeys ? body.dataKeys : null;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                if (dataKeys && dataKeys.length) {
                    async.each(dataKeys, function (dataKey, cb) {
                        PayRoll.remove({'dataKey': parseInt(dataKey, 10)}, cb);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }
                    });
                }

                composeExpensesAndCache(req, function (err) {
                    if (err) {
                        return next(err);
                    }
                });

                res.status(200).send('Done');

            });
        } else {
            error = new Error();
            error.status = 401;

            return next(error);
        }
    };

    this.putchModel = function (req, res, next) {
        var data = mapObject(req.body);
        var id = req.params.id;
        var error;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                data.editedBy = {
                    user: req.session.uId,
                    date: new Date().toISOString()
                };

                if (data.type) {
                    data.type = ObjectId(data.type);
                }

                PayRoll.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: 'updated'});

                    composeExpensesAndCache(req);
                });

            });
        } else {
            error = new Error();
            error.status = 401;

            return next(error);
        }
    };

    this.patchByDataKey = function (req, res, next) {
        var body = req.body;
        var uId;
        var error;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        var keys = body ? Object.keys(body) : null;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                if (keys.length) {
                    async.each(keys, function (key, cb) {
                        var data = body[key];

                        data.editedBy = {
                            user: uId,
                            date: new Date().toISOString()
                        };

                        PayRoll.update({'dataKey': key}, {$set: data}, {multi: true, new: true}, cb);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }
                    });
                }

                composeExpensesAndCache(req, function (err) {
                    if (err) {
                        return next(err);
                    }
                });

                res.status(200).send({done: 'success'});

            });
        } else {
            res.status(401).send();
        }
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var error;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                async.each(body, function (data, cb) {
                    var id = data._id;

                    data.editedBy = {
                        user: uId,
                        date: new Date().toISOString()
                    };
                    delete data._id;

                    if (data.type) {
                        data.type = ObjectId(data.type);
                    }

                    PayRoll.findByIdAndUpdate(id, {$set: data}, {new: true}, cb);
                }, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: 'updated'});

                    composeExpensesAndCache(req);
                });
            });
        } else {
            res.status(401).send();
        }
    };

    this.getAsyncData = function (req, res, next) {
        var data = req.query;
        var dataKey = data.dataKey;
        var _id = data._id;
        var sort = {date: -1, "type.name": -1};
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
        var queryObject = {dataKey: parseInt(dataKey, 10), employee: ObjectId(_id)};

        PayRoll.aggregate([{
            $match: queryObject
        }, {
            $lookup: {
                from        : "Employees",
                localField  : "employee",
                foreignField: "_id", as: "employee"
            }
        }, {
            $lookup: {
                from        : "journals",
                localField  : "type",
                foreignField: "_id", as: "type"
            }
        }, {
            $project: {
                employee: {$arrayElemAt: ["$employee", 0]},
                type    : {$arrayElemAt: ["$type", 0]},
                calc    : 1,
                paid    : 1,
                diff    : 1,
                month   : 1,
                year    : 1,
                dataKey : 1,
                date    : 1
            }
        }, {
            $sort: sort
        }], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    function getByDataKey(req, res, next) {
        var id = req.query.id;
        var data = req.query;
        var error;
        var sort = data.sort || {"employee.name.first": 1, "employee.name.last" : 1};
        var sortKeys = Object.keys(sort);
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        var queryObject = {dataKey: parseInt(id, 10)};
        var query;

        if (data.sort) {
            sort[sortKeys[0]] = parseInt(sort[sortKeys[0]], 10);
        }

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                // query = PayRoll.find(queryObject).sort(sort).populate('employee').populate('type');

                PayRoll.aggregate([{
                    $match: {
                        dataKey: parseInt(id, 10)
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "employee",
                        foreignField: "_id", as: "employee"
                    }
                }, {
                    $project: {
                        employee: {$arrayElemAt: ["$employee", 0]},
                        calc    : 1,
                        paid    : 1,
                        diff    : 1,
                        month   : 1,
                        year    : 1,
                        dataKey : 1
                    }
                }, {
                    $sort: sort
                }], function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(result);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            return next(error);
        }
    }

    this.getSorted = function (req, res, next) {
        var data = req.query;
        var db = req.session.lastDb;
        var dataKey = data.dataKey;
        var queryObject = {dataKey: parseInt(dataKey, 10)};
        var sort = data.sort || {"employee": 1};
        var sortKeys = Object.keys(sort);
        var Payroll = models.get(db, 'PayRoll', PayRollSchema);

        if (data.sort) {
            sort[sortKeys[0]] = parseInt(sort[sortKeys[0]], 10);
        }

        //   var query = Payroll.find(queryObject).sort(sort).lean();

        Payroll.aggregate([{
            $match: queryObject
        }, {
            $lookup: {
                from        : "Employees",
                localField  : "employee",
                foreignField: "_id", as: "employee"
            }
        }, {
            $project: {
                employee: {$arrayElemAt: ["$employee", 0]},
                calc    : 1,
                paid    : 1,
                diff    : 1,
                month   : 1,
                year    : 1,
                dataKey : 1
            }
        }, {
            $sort: sort
        }], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    function getForView(req, res, next) {
        var error;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                composeExpensesAndCache(req, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            return next(error);
        }
    }

    this.getForView = function (req, res, next) {
        var query = req.query;

        if (query.id) {
            getByDataKey(req, res, next);
        } else {
            getForView(req, res, next);
        }
    };

    function salaryReport(req, cb) {
        var date = new Date();
        var db = req.session.lastDb;
        var Employee = models.get(db, 'Employees', EmployeeSchema);
        var query = req.query;
        //var year = parseInt(query.year, 10) || date.getFullYear();
        var filter = query.filter || {};
        var startDate = new Date(query.startDate);
        var endDate = new Date(query.endDate);
        var key = 'salaryReport' + filter + startDate.toString() + endDate.toString();
        var redisStore = require('../helpers/redisClient');
        var waterfallTasks;
        var startDateKey = moment(startDate).year() * 100 +  moment(startDate).week(); // todo isoWeek (changed on week)
        var endDateKey = moment(endDate).year() * 100 +  moment(endDate).week(); // todo isoWeek (changed on week)
        var filterValue;

        function caseFilterEmployee(filter) {
            var condition;
            var resArray = [];
            var filtrElement = {};
            var filterName;
            var keyCase;

            for (filterName in filter) {
                condition = filter[filterName].value;
                keyCase = filter[filterName].key;

                switch (filterName) {
                    case 'employee':
                        filtrElement[keyCase] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    case 'department':
                        filtrElement[keyCase] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    case 'onlyEmployees':
                        resArray.push({isEmployee: true});
                        break;
                }
            }

            return resArray;
        }

        function checkFilter(callback) {
            callback(null, filter);
        }

        function getResult(filter, callback) {
            var matchObj;

            matchObj = {
                $and: [{
                    $or: [{
                        $and: [{
                            isEmployee: true
                        }, /*{ // commented in case of employee that was fired and again hired
                            $or: [{
                                lastFire: null
                            }, {
                                lastFire: {
                                    $ne : null,
                                    $gte: startDateKey
                                }
                            }]
                        },*/{
                            firstHire: {
                                $ne : null,
                                $lte: endDateKey
                            }
                        }]
                    }, {
                        $and: [{
                            isEmployee: false
                        }, {
                            lastFire: {
                                $ne : null,
                                $gte: startDateKey
                            }
                        }, {
                            firstHire: {
                                $ne : null,
                                $lte: endDateKey
                            }
                        }]
                    }
                    ]
                }]
            };

            if (filter && typeof filter === 'object') {
                filterValue = caseFilterEmployee(filter);
                if (filterValue.length) {
                    matchObj.$and.push({$and: caseFilterEmployee(filter)});
                }
            }

            Employee
                .aggregate([{
                    $lookup: {
                        from        : 'Department',
                        localField  : 'department',
                        foreignField: '_id',
                        as          : 'department'
                    }
                }, {
                    $project: {
                        department: {$arrayElemAt: ["$department", 0]},
                        isEmployee: 1,
                        name      : 1,
                        lastFire  : 1,
                        transfer  : 1,
                        firstHire  : {
                            $let: {
                                vars: {
                                    firstHired: {$arrayElemAt: ["$hire", 0]}
                                },
                                in  : {$add: [{$multiply: [{$year: '$$firstHired'}, 100]}, {$week: '$$firstHired'}]}
                            }
                        }
                    }
                }, {
                    $match: matchObj
                }, {
                    $unwind: '$transfer'
                }, {
                    $match: {
                        'transfer.status': {$ne: 'fired'}
                    }
                }, {
                    $project: {
                        isEmployee: 1,
                        department: 1,
                        transfer  : 1,
                        name      : 1,
                        lastFire  : 1,
                        year      : {$year: '$transfer.date'}
                    }
                    //}, {
                    //    $match: {
                    //        'year': {$lt: year + 1}
                    //    }
                }, {
                    $project: {
                        isEmployee: 1,
                        department: 1,
                        transfer  : 1,
                        name      : 1,
                        month     : {$month: '$transfer.date'},
                        year      : 1,
                        lastFire  : 1,
                        hireDate  : {$add: [{$multiply: [{$year: '$transfer.date'}, 100]}, {$month: '$transfer.date'}]}
                    }
                }, {
                    $group: {
                        _id       : '$_id',
                        department: {$addToSet: '$department'},
                        name      : {$addToSet: '$name'},
                        transfer  : {$push: '$$ROOT'},
                        lastFire  : {$addToSet: '$lastFire'}
                    }
                }, {
                    $project: {
                        _id       : 1,
                        department: {$arrayElemAt: ["$department", 0]},
                        name      : {$arrayElemAt: ["$name", 0]},
                        transfer  : 1,
                        lastFire  : {$arrayElemAt: ["$lastFire", 0]}
                    }
                }, {
                    $project: {
                        _id       : 1,
                        department: '$department.departmentName',
                        name      : {$concat: ['$name.first', ' ', '$name.last']},
                        transfer  : 1,
                        lastFire  : 1
                    }
                }, {
                    $sort: {
                        department: 1,
                        name      : 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback(err);
                    }

                    callback(null, result);
                });
        }

        waterfallTasks = [checkFilter, getResult];

        async.waterfall(waterfallTasks, function (err, result) {
            redisStore.writeToStorage('salaryReport', key, JSON.stringify(result));

            if (cb && typeof cb === 'function') {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            }
        });
    }

    this.getSalaryReport = function (req, res, next) {
        var error;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                salaryReport(req, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            return next(error);
        }
    };

    this.composeSalaryReport = function (req, cb) {
        salaryReport(req, cb);
    };

    this.recount = function (req, res, next) {
        var db = req.session.lastDb;
        var data = req.body;
        var dataKey = parseInt(data.dataKey, 10);
        var year = parseInt(data.dataKey.slice(0, 4), 10);
        var month = parseInt(data.dataKey.slice(4), 10);
        var Payroll = models.get(db, 'PayRoll', PayRollSchema);
        var waterfallFunc;

        req.body.month = month;
        req.body.year = year;

        function removeByDataKey(wfCb) {
            Payroll.remove({dataKey: dataKey}, wfCb);
        }

        /* function createIdleByMonth(removed, wfCb) {
         journalEntry.createIdleByMonth({req: req, callback: wfCb, month: month, year: year});
         }*/

        function generateByDataKey(created, wfCb) {
            generate(req, res, next, wfCb);
        }

        waterfallFunc = [removeByDataKey, /*createIdleByMonth,*/ generateByDataKey];

        async.waterfall(waterfallFunc, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });

    };

    function generate(req, res, next, cbFromRecalc) {
        var db = req.session.lastDb;
        var Employee = models.get(db, 'Employees', EmployeeSchema);
        var Payroll = models.get(db, 'PayRoll', PayRollSchema);
        var JournalEntry = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var data = req.body;
        var month = parseInt(data.month, 10);
        var year = parseInt(data.year, 10);
        var dataKey = year * 100 + month;
        var waterfallTasks;
        var employees;
        var ids = {};
        var i;
        var date = moment().isoWeekYear(year).month(month - 1).startOf('month');
        var endDate = moment(date).endOf('month');

        function getEmployees(callback) {
            var queryObject = {
              //  isEmployee: true,
                department: {
                    $in: departmentArray
                }
            };

            var query = Employee.find(queryObject, {transfer: 1}).lean();

            query.exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                employees = result;

                result.forEach(function (elem) {
                    var salary = 0;
                    var hire = elem.transfer;
                    var length = hire.length;
                    var dateToCreate;
                    var localDate = new Date(moment().isoWeekYear(year).month(month - 1).endOf('month').set({hour: 15, minute: 1, second: 0}));
                    var daysInMonth;
                    var payForDay;

                    journalEntry.removeByDocId({'sourceDocument._id': elem._id, journal: CONSTANTS.ADMIN_SALARY_JOURNAL, date: localDate}, req.session.lastDb, function (err, result) {

                    });

                    dateToCreate = endDate;

                    for (i = length - 1; i >= 0; i--) {
                        if (dateToCreate >= hire[i].date) {
                            salary = hire[i].salary;
                            break;
                        }
                    }

                    if ((moment(new Date(hire[0].date)).month() === moment(dateToCreate).month()) && (moment(new Date(hire[0].date)).year() === moment(dateToCreate).year())){
                        daysInMonth = moment(dateToCreate).endOf('month').date();
                        payForDay = salary / daysInMonth;

                        salary = payForDay * (daysInMonth - moment(new Date(hire[0].date)).date());
                    }

                    if (salary) {
                        ids[elem._id] = salary;
                    }
                });

                callback(null, ids);
            });
        }

        function getJournalEntries(ids, callback) {
            function matchEmployee(pcb) {
                JournalEntry.aggregate([{
                    $match: {
                        'sourceDocument.model': "Employees",
                        date                  : {
                            $gte: new Date(date),
                            $lte: new Date(endDate)
                        }
                    }
                }, {
                    $project: {
                        employee: '$sourceDocument._id',
                        debit   : {$divide: ['$debit', 100]},
                        credit  : {$divide: ['$credit', 100]},
                        journal : 1,
                        date    : 1
                    }
                }, {
                    $group: {
                        _id   : '$employee',
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    if (err) {
                        return pcb(err);
                    }

                    pcb(null, result);
                });
            }

            function matchByWTrack(pcb) {
                JournalEntry.aggregate([{
                    $match: {
                        'sourceDocument.model': "wTrack",
                        journal               : {$in: journalArray},
                        date                  : {
                            $gte: new Date(date),
                            $lte: new Date(endDate)
                        }
                    }
                }, {
                    $lookup: {
                        from        : "wTrack",
                        localField  : "sourceDocument._id",
                        foreignField: "_id", as: "sourceDocument"
                    }
                }, {
                    $project: {
                        debit  : {$divide: ['$debit', 100]},
                        credit : {$divide: ['$credit', 100]},
                        journal: 1,
                        wTrack : {$arrayElemAt: ["$sourceDocument", 0]},
                        date   : 1
                    }
                }, {
                    $project: {
                        debit   : '$debit',
                        credit  : '$credit',
                        journal : 1,
                        employee: '$wTrack.employee',
                        date    : 1
                    }
                }, {
                    $group: {
                        _id   : '$employee',
                        debit : {$sum: '$debit'},
                        credit: {$sum: '$credit'}
                    }
                }], function (err, result) {
                    if (err) {
                        return pcb(err);
                    }

                    pcb(null, result);
                });
            }

            async.parallel([matchByWTrack, matchEmployee], function (err, result) {
                if (err) {
                    return callback(err);
                }

                var empIds = _.pluck(result[0], '_id');
                var empIdsSecond = _.pluck(result[1], '_id');

                callback(null, {
                    resultByEmployee: result[0],
                    resultByWTrack  : result[1],
                    ids             : _.union(empIds, empIdsSecond),
                    empIds          : ids
                });
            });
        }

        function savePayroll(resultItems, callback) {
            var resultByEmployee = resultItems.resultByEmployee;
            var resultByWTrack = resultItems.resultByWTrack;
            var ids = resultItems.ids;
            var empIds = resultItems.empIds;
            var empKeys = Object.keys(empIds);
            var newPayroll;
            var parallelTasks;
            var startBody = {
                year   : year,
                month  : month,
                dataKey: dataKey,
                paid   : 0
            };
            var localDate = new Date(moment().isoWeekYear(year).month(month - 1).endOf('month').set({hour: 15, minute: 1, second: 0}));

            function createForNotDev(pCb) {
                async.each(empKeys, function (employee, asyncCb) {
                    startBody.employee = employee;
                    startBody.calc = empIds[employee];
                    startBody.diff = empIds[employee];

                    var cb = _.after(2, asyncCb);

                    var bodyAdminSalary = {
                        currency      : CONSTANTS.CURRENCY_USD,
                        journal       : CONSTANTS.ADMIN_SALARY_JOURNAL,
                        date          : localDate,
                        sourceDocument: {
                            model: 'Employees'
                        }
                    };

                    //if (employee.toString() === '55b92ad221e4b7c40f000030'){
                    //    return asyncCb();
                    //}

                    newPayroll = new Payroll(startBody);

                    bodyAdminSalary.sourceDocument._id = employee;
                    bodyAdminSalary.amount = empIds[employee] * 100;

                    journalEntry.createReconciled(bodyAdminSalary, req.session.lastDb, cb, req.session.uId);

                    newPayroll.save(cb);
                }, function () {
                    pCb();
                });
            }

            function createForDev(pCb) {
                var newArray = [];

                ids.forEach(function (el) {
                    newArray.push(el.toString());
                });

                newArray = _.uniq(newArray);

                async.each(newArray, function (id, asyncCb) {
                    var journalEntryEmp = _.find(resultByEmployee, function (el) {
                        return el._id.toString() === id.toString();
                    });

                    var journalEntrywTrack = _.find(resultByWTrack, function (el) {
                        return el._id.toString() === id.toString();
                    });

                    var sumFirst = parseFloat(journalEntryEmp ? (journalEntryEmp.debit || journalEntryEmp.credit).toFixed(2) : '0');
                    var sumSecond = parseFloat(journalEntrywTrack ? (journalEntrywTrack.debit || journalEntrywTrack.credit).toFixed(2) : '0');

                    startBody.employee = id;
                    startBody.calc = sumFirst + sumSecond;
                    startBody.diff = startBody.calc;
                    startBody.month = month;
                    startBody.year = year;
                    startBody.dataKey = startBody.year * 100 + startBody.month;
                    startBody.date = localDate;

                    newPayroll = new Payroll(startBody);

                    newPayroll.save(asyncCb);
                }, function () {
                    pCb();
                });
            }

            parallelTasks = [createForDev, createForNotDev];

            async.parallel(parallelTasks, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback();
            });
        }

        waterfallTasks = [getEmployees, getJournalEntries, savePayroll];

        async.waterfall(waterfallTasks, function (err) {
            if (err) {
                return next(err);
            }

            composeExpensesAndCache(req, function (err) {
                if (err) {
                    return next(err);
                }

                if (cbFromRecalc) {
                    cbFromRecalc(null, "ok");
                } else {
                    res.status(200).send("ok");
                }
            });
        });

    }

    this.generate = function (req, res, next) {
        generate(req, res, next);
    };
};

module.exports = PayRoll;