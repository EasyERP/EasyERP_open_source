var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');

var Module = function (models) {
    'use strict';

    var PayRollSchema = mongoose.Schemas.PayRoll;
    var EmployeeSchema = mongoose.Schemas.Employees;
    var journalEntrySchema = mongoose.Schemas.journalEntry;
    var ObjectId = mongoose.Types.ObjectId;

    var CONSTANTS = require('../constants/mainConstants.js');
    var _ = require('lodash');
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var departmentArray = CONSTANTS.NOT_DEV_ARRAY;
    var journalArray = [
        ObjectId(CONSTANTS.SALARY_PAYABLE),
        ObjectId(CONSTANTS.OVERTIME_PAYABLE),
        ObjectId(CONSTANTS.IDLE_PAYABLE),
        ObjectId(CONSTANTS.VACATION_PAYABLE)
    ];
    var composeExpensesAndCache = require('../helpers/expenses')(models);
    var JournalEntryHandler = require('./journalEntry');
    var journalEntry = new JournalEntryHandler(models);

    this.create = function (req, res, next) {
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
        var body = req.body;
        var payRollModel;

        if (!body.month || !body.year) {
            return res.status(400).send();
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
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        PayRoll.remove({_id: id}, function (err, payRoll) {
            if (err) {
                return next(err);
            }
            res.status(200).send(payRoll);
            composeExpensesAndCache(req);
        });
    };

    this.removeByDataKey = function (req, res, next) {
        var body = req.body;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
        var dataKeys = body && body.dataKeys ? body.dataKeys : null;

        if (!dataKeys) {
            return res.status(400).send();
        }

        if (dataKeys && dataKeys.length) {
            async.each(dataKeys, function (dataKey, cb) {
                PayRoll.remove({dataKey: parseInt(dataKey, 10)}, cb);
            }, function (err) {
                if (err) {
                    return next(err);
                }
            });
        }

        res.status(200).send('Done');
        composeExpensesAndCache(req, function (err) {
            if (err) {
                return next(err);
            }
        });
    };

    this.putchModel = function (req, res, next) {
        var data = mapObject(req.body);
        var id = req.params.id;
        var error;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

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
    };

    this.patchByDataKey = function (req, res, next) {
        var body = req.body;
        var uId = req.session.uId;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        var keys = body ? Object.keys(body) : null;

        if (keys.length) {
            async.each(keys, function (key, cb) {
                var data = body[key];

                data.editedBy = {
                    user: uId,
                    date: new Date().toISOString()
                };

                PayRoll.find({dataKey: key}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    if (!result.length) {
                        return res.status(400).send();
                    }

                    PayRoll.update({dataKey: key}, {$set: data}, {multi: true, new: true}, cb);
                });

            }, function (err) {
                if (err) {
                    return next(err);
                }
            });
        }

        res.status(200).send({done: 'success'});
        composeExpensesAndCache(req, function (err) {
            /* if (err) {
             return next(err);
             }*/
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

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
    };

    this.getAsyncData = function (req, res, next) {
        var data = req.query;
        var dataKey = data.dataKey;
        var _id = data._id;
        var sort = {date: -1, 'type.name': -1};
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
        var queryObject = {dataKey: parseInt(dataKey, 10), employee: ObjectId(_id)};

        PayRoll.aggregate([{
            $match: queryObject
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'employee',
                foreignField: '_id',
                as          : 'employee'
            }
        }, {
            $lookup: {
                from        : 'journals',
                localField  : 'type',
                foreignField: '_id',
                as          : 'type'
            }
        }, {
            $project: {
                employee: {$arrayElemAt: ['$employee', 0]},
                type    : {$arrayElemAt: ['$type', 0]},
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
        var id = req.query.id || req.params.id || req.query.dataKey;
        var data = req.query;
        var error;
        var sort = data.sort || {'employee.name.first': 1, 'employee.name.last': 1};
        var sortKeys = Object.keys(sort);
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        var queryObject = {dataKey: parseInt(id, 10)};
        var query;

        if (data.sort) {
            sort[sortKeys[0]] = parseInt(sort[sortKeys[0]], 10);
        }

        PayRoll.aggregate([{
            $match: {
                dataKey: parseInt(id, 10)
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'employee',
                foreignField: '_id',
                as          : 'employee'
            }
        }, {
            $project: {
                employee: {$arrayElemAt: ['$employee', 0]},
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
    }

    this.getSorted = function (req, res, next) {
        var data = req.query;
        var db = req.session.lastDb;
        var dataKey = data.dataKey;
        var queryObject = {dataKey: parseInt(dataKey, 10)};
        var sort = data.sort || {employee: 1};
        var sortKeys = Object.keys(sort);
        var Payroll = models.get(db, 'PayRoll', PayRollSchema);

        if (data.sort) {
            sort[sortKeys[0]] = parseInt(sort[sortKeys[0]], 10);
        }

        Payroll.aggregate([{
            $match: queryObject
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'employee',
                foreignField: '_id',
                as          : 'employee'
            }
        }, {
            $project: {
                employee: {$arrayElemAt: ['$employee', 0]},
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

        composeExpensesAndCache(req, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    }

    this.getForView = function (req, res, next) {
        var query = req.query;
        var id = req.params.id;
        var sort = query.sort || {};

        if (Object.keys(sort).length) {
            return getByDataKey(req, res, next);
        }

        if (query.id || id) {
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
        var filter = query.filter || {};
        var startDate = new Date(query.startDate);
        var endDate = new Date(query.endDate);
        var key = 'salaryReport' + filter + startDate.toString() + endDate.toString();
        var redisStore = require('../helpers/redisClient');
        var waterfallTasks;
        var startDateKey = moment(startDate).year() * 100 + moment(startDate).week(); // todo isoWeek (changed on week)
        var endDateKey = moment(endDate).year() * 100 + moment(endDate).week(); // todo isoWeek (changed on week)
        var filterValue;

        function caseFilterEmployee(filter) {
            var condition;
            var resArray = [];
            var filtrElement = {};
            var filterName;
            var keyCase;
            var i;
            var filterNameKeys = Object.keys(filter);

            for (i = filterNameKeys.length - 1; i >= 0; i--) {
                filterName = filterNameKeys[i];
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
                    // skip default;
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
                        }, /* { // commented in case of employee that was fired and again hired
                         $or: [{
                         lastFire: null
                         }, {
                         lastFire: {
                         $ne : null,
                         $gte: startDateKey
                         }
                         }]
                         },*/
                            {
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
                        department: {$arrayElemAt: ['$department', 0]},
                        isEmployee: 1,
                        name      : 1,
                        lastFire  : 1,
                        transfer  : 1,
                        firstHire : {
                            $let: {
                                vars: {
                                    firstHired: {$arrayElemAt: ['$hire', 0]}
                                },

                                in: {$add: [{$multiply: [{$year: '$$firstHired'}, 100]}, {$week: '$$firstHired'}]}
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
                    /* }, {
                     $match: {
                     'year': {$lt: year + 1}
                     }*/
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
                        department: {$arrayElemAt: ['$department', 0]},
                        name      : {$arrayElemAt: ['$name', 0]},
                        transfer  : 1,
                        lastFire  : {$arrayElemAt: ['$lastFire', 0]}
                    }
                }, {
                    $project: {
                        _id       : 1,
                        department: '$department.name',
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

        salaryReport(req, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.composeSalaryReport = function (req, cb) {
        salaryReport(req, cb);
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
        var date = moment().year(year).month(month - 1).startOf('month');
        var endDate = moment(date).endOf('month');
        var employeesIds = [];
        var employeeQueryForEmployeeByDep;
        var startDateKey = date.year() * 100 + date.isoWeek();
        var endDateKey = endDate.year() * 100 + endDate.isoWeek();

        date = new Date(date);
        endDate = new Date(endDate);

        if (!data.month || !data.year) {
            return res.status(400).send();
        }

        employeeQueryForEmployeeByDep = {
            $and: [{
                $or: [{
                    $and: [{
                        isEmployee: true
                    }, {
                        $or: [{
                            lastFire: null,
                            lastHire: {
                                $ne : null,
                                $lte: endDateKey
                            }
                        }, {
                            lastFire: {
                                $ne : null,
                                $gte: startDateKey
                            }
                        }, {
                            lastHire: {
                                $ne : null,
                                $lte: endDateKey
                            }
                        }]
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
                        lastHire: {
                            $ne : null,
                            $lte: endDateKey
                        }
                    }]
                }]
            }]
        };

        function getEmployees(mainCb) {
            Employee.aggregate([{
                $match: {
                    hire: {$ne: []}
                }
            }/*, {
             $lookup: {
             from        : 'transfers',
             localField  : '_id',
             foreignField: 'employee',
             as          : 'transfer'
             }
             }*/, {
                $project: {
                    isEmployee  : 1,
                    department  : 1,
                    fire        : 1,
                    hire        : 1,
                    lastFire    : 1,
                    transfer    : 1,
                    lastTransfer: {$max: '$transfer.date'},
                    hireCount   : {$size: '$hire'},
                    lastHire    : {
                        $let: {
                            vars: {
                                lastHired: {$arrayElemAt: [{$slice: ['$hire', -1]}, 0]}
                            },

                            in: {$add: [{$multiply: [{$year: '$$lastHired'}, 100]}, {$week: '$$lastHired'}]}
                        }
                    }
                }
            }, {
                $match: employeeQueryForEmployeeByDep
            }, {
                $project: {
                    department: 1,
                    transfer  : {
                        $filter: {
                            input: '$transfer',
                            as   : 'item',

                            cond: {
                                $lte: ['$$item.date', endDate]
                            }
                        }
                    }
                }
            }, {
                $project: {
                    department  : 1,
                    transferDate: {$max: '$transfer.date'},
                    transfer    : 1
                }
            }, {
                $project: {
                    department: 1,
                    salary    : {
                        $filter: {
                            input: '$transfer',
                            as   : 'item',

                            cond: {
                                $eq: ['$$item.date', '$transferDate']
                            }
                        }
                    }
                }
            }, {
                $project: {
                    department          : 1,
                    salary              : {$max: '$salary.salary'},
                    payrollStructureType: {$arrayElemAt: ['$salary', 0]}
                }
            }, {
                $project: {
                    department          : 1,
                    salary              : 1,
                    payrollStructureType: '$payrollStructureType.payrollStructureType'
                }
            }, {
                $lookup: {
                    from        : 'payrollStructureTypes',
                    localField  : 'payrollStructureType',
                    foreignField: '_id',
                    as          : 'payrollStructureType'
                }
            }, {
                $project: {
                    department          : 1,
                    salary              : 1,
                    payrollStructureType: {$first: '$payrollStructureType'}
                }
            }, {
                $project: {
                    department          : 1,
                    salary              : 1,
                    payrollStructureType: '$payrollStructureType.formula'
                }
            }], function (err, result) {
                if (err) {
                    return mainCb(err);
                }

                mainCb(null, result);
            });
        }

        function generatePayroll(employeesResult, mainCb) {

            async.each(function (empObject, asyncCb) {
                var employee = empObject._id;
                var department = empObject.department;
                var salary = empObject.salary;

            });

        }

        async.waterfall([getEmployees, generatePayroll], function (err, result) {
            if (err) {
                return next(err);
            }

            composeExpensesAndCache(req, function (err) {
                if (err) {
                    return next(err);
                }

                if (cbFromRecalc) {
                    cbFromRecalc(null, 'ok');
                } else {
                    res.status(200).send('ok');
                }
            });
        });

    }

    /* function generate(req, res, next, cbFromRecalc) {
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
     var date = moment().year(year).month(month - 1).startOf('month');
     var endDate = moment(date).endOf('month');
     var employeesIds = [];

     date = new Date(date);
     endDate = new Date(endDate);

     if (!data.month || !data.year) {
     return res.status(400).send();
     }

     function getEmployees(callback) {
     var queryObject = {
     //  isEmployee: true,
     department: {
     $in: departmentArray
     }
     };

     var query = Employee.find({} /!* queryObject*!/, {transfer: 1, fire: 1}).lean();

     query.exec(function (err, result) {
     if (err) {
     return callback(err);
     }

     employees = result;

     result.forEach(function (elem) {
     var salary = 0;
     var hire = elem.transfer;
     var fire = elem.fire;
     var length = hire.length;
     var dateToCreate = endDate;
     var localDate = new Date(moment().year(year).month(month - 1).endOf('month').set({
     hour  : 15,
     minute: 1,
     second: 0
     }));
     var daysInMonth;
     var payForDay;
     var department;
     var hireKey = moment(new Date(hire[0].date)).year() * 100 + moment(new Date(hire[0].date)).month() + 1;
     var fireKey = fire[0] ? moment(new Date(fire[0])).year() * 100 + moment(new Date(fire[0])).month() + 1 : Infinity;
     var localKey = moment(dateToCreate).year() * 100 + moment(dateToCreate).month() + 1;

     journalEntry.removeByDocId({
     'sourceDocument._id': elem._id,
     journal             : CONSTANTS.ADMIN_SALARY_JOURNAL,
     date                : localDate
     }, req.session.lastDb, function () {

     });

     for (i = length - 1; i >= 0; i--) {
     if (dateToCreate >= hire[i].date && (hire[i].status !== 'fired')) {
     salary = hire[i].salary;
     department = hire[i].department;
     break;
     } else {
     department = hire[i].department;
     }
     }

     if (hireKey === localKey) {
     daysInMonth = moment(dateToCreate).endOf('month').date();
     payForDay = salary / daysInMonth;

     salary = payForDay * (daysInMonth - moment(new Date(hire[0].date)).date() + 1);
     }

     if (fireKey === localKey) {
     daysInMonth = moment(dateToCreate).endOf('month').date();
     payForDay = salary / daysInMonth;

     salary = payForDay * moment(new Date(fire[0])).date();
     } else if (fireKey < localKey) {
     salary = 0;
     }

     if (salary || (salary === 0)) {
     ids[elem._id] = {
     salary    : salary,
     department: department
     };
     }
     });

     employeesIds = Object.keys(ids);

     callback(null, ids);
     });
     }

     function getJournalEntries(ids, callback) {
     /!* function matchEmployee(pcb) {
     JournalEntry.aggregate([{
     $match: {
     'sourceDocument.model': 'Employees',
     journal               : {$in: [ObjectId(CONSTANTS.IDLE_PAYABLE), ObjectId(CONSTANTS.VACATION_PAYABLE)]},
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
     _id: {
     employee: '$employee',
     journal : '$journal'
     },

     debit : {$sum: '$debit'},
     credit: {$sum: '$credit'}
     }
     }, {
     $group: {
     _id : '$_id.employee',
     root: {$push: '$$ROOT'}
     }
     }], function (err, result) {
     if (err) {
     return pcb(err);
     }

     pcb(null, result);
     });
     }*!/

     function matchByWTrack(pcb) {
     /!* JournalEntry.aggregate([{
     $match: {
     // 'sourceDocument.model': 'wTrack',
     journal: {$in: journalArray},
     debit  : {$gt: 0},
     date   : {
     $gte: new Date(date),
     $lte: new Date(endDate)
     }
     }
     }, {
     $project: {
     debit  : {$divide: ['$debit', 100]},
     journal: {
     $cond: {
     if: {
     $eq: ['$journal', ObjectId(CONSTANTS.VACATION_PAYABLE)]
     },

     then: 'vacation',
     else: {
     $cond: {
     if: {
     $eq: ['$journal', ObjectId(CONSTANTS.OVERTIME_PAYABLE)]
     },

     then: 'overtime',
     else: 'base'
     }
     }
     }
     },

     date    : 1,
     employee: {
     $cond: {
     if: {
     $ifNull: ['$sourceDocument.employee', null]
     },

     then: '$sourceDocument._id',
     else: '$sourceDocument.employee'
     }
     }
     }
     }, {
     $project: {
     journal : 1,
     amount  : '$debit',
     employee: '$employee'
     }
     }, {
     $match: {
     amount: {$gt: 0}
     }
     }, {
     $group: {
     _id: {
     employee: '$employee',
     journal : '$journal'
     },

     amount : {$sum: '$amount'},
     journal: {$first: '$journal'}
     }
     }, {
     $group: {
     _id : '$_id.employee',
     root: {$push: '$$ROOT'}
     }
     }], function (err, result) {
     if (err) {
     return pcb(err);
     }

     pcb(null, result);
     });*!/

     /!* Employee.aggregate([{
     $match: {
     _id: {$in: employeesIds.objectID()}
     }
     }, {
     $lookup: {
     from        : 'journalentries',
     localField  : '_id',
     foreignField: 'sourceDocument.employee',
     as          : 'vacationsAndIdle'
     }
     }, {
     $lookup: {
     from        : 'journalentries',
     localField  : '_id',
     foreignField: 'sourceDocument._id',
     as          : 'workedAndOvertime'
     }
     }, {
     $project: {
     vacationsAndIdle: {
     $filter: {
     input: '$vacationsAndIdle',
     as   : 'item',

     cond: {
     $and: [{
     $gte: ['$$item.date', date]
     }, {
     $lte: ['$$item.date', endDate]
     }, {
     $gt: ['$$item.debit', 0]

     }]
     }
     }
     },

     workedAndOvertime: {
     $filter: {
     input: '$vacationsAndIdle',
     as   : 'item',

     cond: {
     $and: [{
     $gte: ['$$item.date', date]
     }, {
     $lte: ['$$item.date', endDate]
     }, {
     $gt: ['$$item.debit', 0]
     }]
     }
     }
     }
     }
     }, {
     $project: {
     vacation: {
     $filter: {
     input: '$vacationsAndIdle',
     as   : 'item',

     cond: {
     $eq: ['$$item.journal', ObjectId(CONSTANTS.VACATION_PAYABLE)]
     }
     }
     },

     overtime: {
     $filter: {
     input: '$workedAndOvertime',
     as   : 'item',

     cond: {
     $eq: ['$$item.journal', ObjectId(CONSTANTS.OVERTIME_PAYABLE)]
     }
     }
     },

     worked: {
     $filter: {
     input: '$workedAndOvertime',
     as   : 'item',

     cond: {
     $eq: ['$$item.journal', ObjectId(CONSTANTS.SALARY_PAYABLE)]
     }
     }
     },

     idle: {
     $filter: {
     input: '$vacationsAndIdle',
     as   : 'item',

     cond: {
     $eq: ['$$item.journal', ObjectId(CONSTANTS.IDLE_PAYABLE)]
     }
     }
     }
     }
     }, {
     $unwind: {
     path                      : '$vacation',
     preserveNullAndEmptyArrays: true
     }
     }, {
     $unwind: {
     path                      : '$idle',
     preserveNullAndEmptyArrays: true
     }
     }, {
     $unwind: {
     path                      : '$overtime',
     preserveNullAndEmptyArrays: true
     }
     }, {
     $unwind: {
     path                      : '$worked',
     preserveNullAndEmptyArrays: true
     }
     }, {
     $group: {
     _id     : '$_id',
     vacation: {$sum: '$vacation.debit'},
     idle    : {$sum: '$idle.debit'},
     overtime: {$sum: '$overtime.debit'},
     worked  : {$sum: '$worked.debit'}
     }
     }, {
     $project: {
     vacation: {$divide: ['$vacation', 100]},
     idle    : {$divide: ['$idle', 100]},
     overtime: {$divide: ['$overtime', 100]},
     worked  : {$divide: ['$worked', 100]},
     total   : {$divide: [{$add: ['$vacation', '$idle', '$overtime', '$worked']}, 100]}
     }
     }], function (err, result) {
     if (err) {
     return pcb(err);
     }

     pcb(null, result);
     });*!/
     }

     async.parallel([matchByWTrack/!* , matchEmployee*!/], function (err, result) {
     var empIds;
     var empIdsSecond;
     var resultArray;

     if (err) {
     return callback(err);
     }

     empIds = _.pluck(result[0], '_id');
     empIdsSecond = _.pluck(result[1], '_id');

     resultArray = _.union(result[0], result[1]);

     callback(null, {
     resultByEmployee: result[1],
     resultByWTrack  : result[0],
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
     var localDate = new Date(moment().isoWeekYear(year).month(month - 1).endOf('month').set({
     hour  : 15,
     minute: 1,
     second: 0
     }));

     function createForNotDev(pCb) {
     async.each(empKeys, function (employee, asyncCb) {
     var cb;
     var bodyAdminSalary;

     startBody.employee = employee;
     startBody.calc = empIds[employee].salary;
     startBody.diff = empIds[employee].salary;

     cb = _.after(2, asyncCb);

     bodyAdminSalary = {
     currency      : CONSTANTS.CURRENCY_USD,
     journal       : CONSTANTS.ADMIN_SALARY_JOURNAL,
     date          : localDate,
     sourceDocument: {
     model: 'Employees'
     }
     };

     if (departmentArray.indexOf(empIds[employee].department.toString()) === -1) {
     return asyncCb();
     }

     if (startBody.calc) {
     newPayroll = new Payroll(startBody);

     bodyAdminSalary.sourceDocument._id = employee;
     bodyAdminSalary.amount = empIds[employee].salary * 100;

     journalEntry.createReconciled(bodyAdminSalary, req.session.lastDb, cb, req.session.uId);

     newPayroll.save(cb);
     } else {
     asyncCb();
     }

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

     async.parallel(parallelTasks, function (err) {
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
     cbFromRecalc(null, 'ok');
     } else {
     res.status(200).send('ok');
     }
     });
     });

     }*/

    function recount(req, res, next) {
        var db = req.session.lastDb;
        var data = req.body;
        var dataKey = parseInt(data.dataKey, 10);
        var year;
        var month;
        var Payroll = models.get(db, 'PayRoll', PayRollSchema);
        var waterfallFunc;

        if (!dataKey) {
            year = parseInt(data.year, 10);
            month = parseInt(data.month, 10);
            dataKey = year * 100 + month;
        } else if (data.dataKey) {
            year = parseInt(data.dataKey.slice(0, 4), 10);
            month = parseInt(data.dataKey.slice(4), 10);
        }

        if (!dataKey && !month && !year) {
            return res.status(400).send();
        }

        req.body.month = month;
        req.body.year = year;

        function removeByDataKey(wfCb) {
            Payroll.remove({dataKey: dataKey}, wfCb);
        }

        function createIdleByMonth(removed, wfCb) {
            journalEntry.createIdleByMonth({req: req, callback: wfCb, month: month, year: year});
        }

        function generateByDataKey(wfCb) {
            generate(req, res, next, wfCb);
        }

        waterfallFunc = [removeByDataKey, createIdleByMonth, generateByDataKey];

        async.waterfall(waterfallFunc, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });

    }

    this.recount = function (req, res, next) {
        recount(req, res, next);
    };

    this.generate = function (req, res, next) {
        recount(req, res, next);
    };
};

module.exports = Module;
