var mongoose = require('mongoose');
var async = require('async');

var Employee = function (event, models) {
    'use strict';
    /**
     * @module Employee
     */
    var accessRoll = require("../helpers/accessRollHelper.js")(models);
    var uploadFileArray = require("../helpers/uploadFileArray.js")();
    var EmployeeSchema = mongoose.Schemas.Employee;
    var ProjectSchema = mongoose.Schemas.Project;
    var DepartmentSchema = mongoose.Schemas.Department;
    var jobPositionSchema = mongoose.Schemas.JobPosition;
    var nationalitySchema = mongoose.Schemas.nationality;
    var LanguageSchema = mongoose.Schemas.language;
    var SourceSchema = mongoose.Schemas.source;
    var birthdaysSchema = mongoose.Schemas.birthday;
    var _ = require('underscore');
    var fs = require('fs');
    var moment = require('../public/js/libs/moment/moment');
    var objectId = mongoose.Types.ObjectId;
    var validatorEmployee = require('../helpers/validator');
    var Payroll = require('../handlers/payroll');
    var payrollHandler = new Payroll(models);
    var ids = ['52203e707d4dba8813000003', '563f673270bbc2b740ce89ae', '55b8cb7d0ce4affc2a0015cb', '55ba2ef1d79a3a343900001c', '560255d1638625cf32000005'];

    var exportDecorator = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Employees;
    exportDecorator.addExportFunctionsToHandler(this, function (req) {
        return models.get(req.session.lastDb, 'Employee', EmployeeSchema);
    }, exportMap, 'Employees');

    this.getNameAndDepartment = getNameAndDepartment;

    function getNameAndDepartment(db, isEmployee, callback) {
        var Employee = models.get(db, 'Employees', EmployeeSchema);
        var query;

        if (isEmployee) {
            query = Employee.find({isEmployee: true});
        } else {
            query = Employee.find();
        }

        query
            .select('_id name department')
            .populate('department', 'departmentName _id')
            .sort({'name.first': 1})
            .lean()
            .exec(function (err, employees) {
                if (err) {
                    return callback(err);
                }

                callback(null, employees);
            });
    }

    this.getNameAndDepartment = getNameAndDepartment;

    this.getMinHireDate = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee.aggregate([{
            $project: {
                hire: 1
            }
        }, {
            $unwind: '$hire'
        }, {
            $project: {
                date: '$hire.date'
            }
        }, {
            $group: {
                _id: '$date'
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            var arr = _.pluck(result, '_id');
            var min = _.min(arr);

            res.status(200).send({min: min});
        });

    };

    this.getForDD = function (req, res, next) {
        var isEmployee = req.query.isEmployee;

        getNameAndDepartment(req.session.lastDb, isEmployee, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.getBySales = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        function assigneFinder(cb) {
            var match = {
                'projectmanager': {$ne: null}
            };

            Project.aggregate([{
                $match: match
            }, {
                $group: {
                    _id: "$projectmanager"
                }
            }], cb);
        }

        function employeeFinder(assignedArr, cb) {
            Employee
                .find({_id: {$in: assignedArr}})
                .select('_id name')
                .sort({'name.first': 1, 'name.last': 1})
                .lean()
                .exec(cb);
        }

        async.waterfall([assigneFinder, employeeFinder], function (err, employees) {
            if (err) {
                return next(err);
            }

            res.status(200).send(employees);
        });

    };

    this.byDepartment = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee
            .aggregate([{
                $match: {isEmployee: true}
            }, {
                $group: {
                    _id      : "$department",
                    employees: {
                        $push: {
                            name: {$concat: ['$name.first', ' ', '$name.last']},
                            _id : '$_id'
                        }
                    }
                }
            }, {
                $project: {
                    department: '$_id',
                    employees : 1,
                    _id       : 0
                }
            }], function (err, employees) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(employees);
            });
    };

    this.getForProjectDetails = function (req, res, next) {
        var idsArray = req.query.data || [];
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee
            .find({_id: {$in: idsArray}})
            .populate('jobPosition', '_id name')
            .populate('department', '_id departmentName')
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });

    };

    function getDate(date) {
        var _date = new Date(date);
        var currentTimeZoneOffsetInMiliseconds = -_date.getTimezoneOffset() * 60 * 1000;
        var valaueOf_date = _date.valueOf();

        valaueOf_date += currentTimeZoneOffsetInMiliseconds;

        return new Date(valaueOf_date);
    }

    function getAge(birthday) {
        var today = new Date();
        var years;

        birthday = new Date(birthday);
        years = today.getFullYear() - birthday.getFullYear();

        birthday.setFullYear(today.getFullYear());

        if (today < birthday) {
            years--;
        }
        return (years < 0) ? 0 : years;
    }

    this.create = function (req, res, next) {
        var employee;
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var body = req.body;
        var err;

        if (body.dateBirth) {
            body.dateBirth = getDate(body.dateBirth);
            body.age = getAge(body.dateBirth);
        }

        if (!validatorEmployee.validEmployeeBody(body)) {
            err = new Error();
            err.status = 404;

            return next(err);
        }

        employee = new Employee(body);

        employee.createdBy.user = req.session.uId;
        employee.editedBy.user = req.session.uId;
        employee.createdBy.date = new Date();
        employee.editedBy.date = new Date();

        event.emit('updateSequence', Employee, "sequence", 0, 0, employee.workflow, employee.workflow, true, false, function (sequence) {
            employee.sequence = sequence;

            employee.save(function (err, employee) {
                if (err) {
                    return next(err);
                }

                res.send(201, {success: 'A new Employees create success', result: employee, id: employee._id});

                if (employee.isEmployee) {
                    event.emit('recalculate', req, res, next);
                }

                event.emit('dropHoursCashes', req);
                event.emit('recollectVacationDash');

            });
        });
    };

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;
        var filterName;

        for (filterName in filter) {
            condition = filter[filterName].value;
            key = filter[filterName].key;

            switch (filterName) {
                case 'name':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'letter':
                    filtrElement['name.last'] = new RegExp('^[' + filter.letter.toLowerCase() + filter.letter.toUpperCase() + '].*');
                    resArray.push(filtrElement);
                    break;
                case 'department':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'manager':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'jobPosition':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
            }
        }

        return resArray;
    }

    function getById(req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var id = req.params.id;
        var query = Employee.findById(id);

        query.populate('coach', 'name _id')
            .populate('relatedUser', 'login _id')
            .populate('workflow')
            .populate('createdBy.user')
            .populate('editedBy.user')
            .populate('groups.users')
            .populate('manager', '_id name')
            .populate('jobPosition', '_id name fullName')
            .populate('department', '_id departmentName')
            .populate('groups.group')
            .populate('hire.department', '_id departmentName')
            .populate('hire.jobPosition', '_id name')
            .populate('hire.manager', '_id name')
            .populate('fire.department', '_id departmentName')
            .populate('fire.jobPosition', '_id name')
            .populate('fire.manager', '_id name')
            .populate('groups.owner', '_id login');

        query.exec(function (err, employee) {
            if (err) {
                return next(err);
            }

            if (ids.indexOf(req.session.uId) !== -1) {
                employee._doc.enableView = true;
            }

            res.status(200).send(employee);
        });
    }

    this.totalCollectionLength = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var data = req.query;
        var contentType = data.contentType;
        var optionsObject = {};
        var filter = data.filter || {};
        var waterfallTasks;
        var accessRollSearcher;
        var contentSearcher;
        var project;
        var projectSecond;
        var response = {};

        response.showMore = false;

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                optionsObject.$or = caseFilter(filter);
            } else {
                optionsObject.$and = caseFilter(filter);
            }
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Employee, cb);
        };

        contentSearcher = function (ids, cb) {
            var queryObject = {};

            queryObject.$and = [];

            if (optionsObject.$and.length) {
                queryObject.$and.push(optionsObject);
            }

            if (contentType === 'Employees') {
                queryObject.$and.push({isEmployee: true});
            } else if (contentType === 'Applications') {
                queryObject.$and.push({isEmployee: false});
            }

            queryObject.$and.push({_id: {$in: ids}});

            switch (contentType) {
                case ('Employees'):

                    project = {
                        manager         : {$arrayElemAt: ["$manager", 0]},
                        jobPosition     : {$arrayElemAt: ["$jobPosition", 0]},
                        department      : {$arrayElemAt: ["$department", 0]},
                        'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                        'editedBy.user' : {$arrayElemAt: ["$editedBy.user", 0]},
                        name            : 1,
                        'editedBy.date' : 1,
                        'createdBy.date': 1,
                        dateBirth       : 1,
                        skype           : 1,
                        workEmail       : 1,
                        workPhones      : 1,
                        jobType         : 1,
                        isEmployee      : 1
                    };

                    projectSecond = {
                        manager         : 1,
                        jobPosition     : 1,
                        department      : 1,
                        'createdBy.user': 1,
                        'editedBy.user' : 1,
                        'editedBy.date' : 1,
                        'createdBy.date': 1,
                        name            : 1,
                        dateBirth       : 1,
                        skype           : 1,
                        workEmail       : 1,
                        workPhones      : 1,
                        jobType         : 1,
                        isEmployee      : 1
                    };
                    break;
                case ('Applications'):

                    if (data && data.filter && data.filter.workflow) {
                        data.filter.workflow = data.filter.workflow.map(function (item) {
                            return item === "null" ? null : item;
                        });
                    }

                    project = {
                        manager         : {$arrayElemAt: ["$manager", 0]},
                        jobPosition     : {$arrayElemAt: ["$jobPosition", 0]},
                        department      : {$arrayElemAt: ["$department", 0]},
                        'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                        'editedBy.user' : {$arrayElemAt: ["$editedBy.user", 0]},
                        name            : 1,
                        'editedBy.date' : 1,
                        'createdBy.date': 1,
                        dateBirth       : 1,
                        skype           : 1,
                        workEmail       : 1,
                        workPhones      : 1,
                        jobType         : 1,
                        isEmployee      : 1,
                        creationDate    : 1,
                        workflow        : {$arrayElemAt: ["$workflow", 0]},
                        personalEmail   : 1,
                        sequence        : 1,
                        hire            : 1,
                        fire            : 1
                    };

                    projectSecond = {
                        manager         : 1,
                        jobPosition     : 1,
                        department      : 1,
                        'createdBy.user': 1,
                        'editedBy.user' : 1,
                        'editedBy.date' : 1,
                        'createdBy.date': 1,
                        name            : 1,
                        dateBirth       : 1,
                        skype           : 1,
                        workEmail       : 1,
                        workPhones      : 1,
                        jobType         : 1,
                        isEmployee      : 1,
                        creationDate    : 1,
                        workflow        : 1,
                        personalEmail   : 1,
                        sequence        : 1,
                        hire            : 1,
                        fire            : 1
                    };
                    break;
            }

            Employee.aggregate([{
                $lookup: {
                    from        : "Employees",
                    localField  : "manager",
                    foreignField: "_id", as: "manager"
                }
            }, {
                $lookup: {
                    from        : "JobPosition",
                    localField  : "jobPosition",
                    foreignField: "_id", as: "jobPosition"
                }
            }, {
                $lookup: {
                    from        : "Department",
                    localField  : "department",
                    foreignField: "_id", as: "department"
                }
            }, {
                $lookup: {
                    from        : "Users",
                    localField  : "relatedUser",
                    foreignField: "_id", as: "relatedUser"
                }
            }, {
                $lookup: {
                    from        : "Users",
                    localField  : "createdBy.user",
                    foreignField: "_id", as: "createdBy.user"
                }
            }, {
                $lookup: {
                    from        : "Users",
                    localField  : "editedBy.user",
                    foreignField: "_id", as: "editedBy.user"
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $project: project
            }, {
                $project: projectSecond
            }, {
                $match: queryObject
            }], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }
            if (data.currentNumber && data.currentNumber < result.length) {
                response.showMore = true;
            }
            response.count = result.length;
            res.status(200).send(response);
        });
    };

    function getFilter(req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var data = req.query;
        var contentType = data.contentType;
        var viewType = data.viewType;
        var optionsObject = {};
        var filter = data.filter || {};
        var waterfallTasks;
        var accessRollSearcher;
        var contentSearcher;
        var keySort;
        var sort;
        var project;
        var projectSecond;

        var skip = ((parseInt(data.page || 1, 10) - 1) * parseInt(data.count || 100, 10));
        var limit = parseInt(data.count, 10) || 100;

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                optionsObject.$or = caseFilter(filter);
            } else {
                optionsObject.$and = caseFilter(filter);
            }
        }

        if (data.sort) {
            keySort = Object.keys(data.sort)[0];
            data.sort[keySort] = parseInt(data.sort[keySort], 10);
            sort = data.sort;
        } else {
            sort = {"editedBy.date": -1};
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Employee, cb);
        };

        contentSearcher = function (ids, cb) {
            var queryObject = {};

            queryObject.$and = [];

            if (optionsObject.$and.length) {
                queryObject.$and.push(optionsObject);
            }

            if (contentType === 'Employees') {
                queryObject.$and.push({isEmployee: true});
            } else if (contentType === 'Applications') {
                queryObject.$and.push({isEmployee: false});
            }

            queryObject.$and.push({_id: {$in: ids}});

            switch (contentType) {
                case ('Employees'):
                    switch (viewType) {
                        case ('list'):
                        {
                            project = {
                                manager         : {$arrayElemAt: ["$manager", 0]},
                                jobPosition     : {$arrayElemAt: ["$jobPosition", 0]},
                                department      : {$arrayElemAt: ["$department", 0]},
                                'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                                'editedBy.user' : {$arrayElemAt: ["$editedBy.user", 0]},
                                name            : 1,
                                'editedBy.date' : 1,
                                'createdBy.date': 1,
                                dateBirth       : 1,
                                skype           : 1,
                                workEmail       : 1,
                                workPhones      : 1,
                                jobType         : 1,
                                isEmployee      : 1
                            };

                            projectSecond = {
                                manager         : 1,
                                jobPosition     : 1,
                                department      : 1,
                                'createdBy.user': 1,
                                'editedBy.user' : 1,
                                'editedBy.date' : 1,
                                'createdBy.date': 1,
                                name            : 1,
                                dateBirth       : 1,
                                skype           : 1,
                                workEmail       : 1,
                                workPhones      : 1,
                                jobType         : 1,
                                isEmployee      : 1
                            };
                        }
                            break;
                        case ('thumbnails'):
                        {
                            project = {
                                jobPosition        : {$arrayElemAt: ["$jobPosition", 0]},
                                department         : {$arrayElemAt: ["$department", 0]},
                                manager            : {$arrayElemAt: ["$manager", 0]},
                                age                : 1,
                                relatedUser        : {$arrayElemAt: ["$relatedUser", 0]},
                                'workPhones.mobile': 1,
                                name               : 1,
                                dateBirth          : 1,
                                isEmployee         : 1
                            };

                            projectSecond = {
                                jobPosition        : 1,
                                department         : 1,
                                manager            : 1,
                                age                : 1,
                                'relatedUser.login': 1,
                                'workPhones.mobile': 1,
                                name               : 1,
                                dateBirth          : 1,
                                isEmployee         : 1
                            };
                        }
                            break;

                    }
                    break;
                case ('Applications'):
                    switch (viewType) {
                        case ('list'):
                        {
                            if (data && data.filter && data.filter.workflow) {
                                data.filter.workflow = data.filter.workflow.map(function (item) {
                                    return item === "null" ? null : item;
                                });
                            }

                            project = {
                                manager         : {$arrayElemAt: ["$manager", 0]},
                                jobPosition     : {$arrayElemAt: ["$jobPosition", 0]},
                                department      : {$arrayElemAt: ["$department", 0]},
                                'createdBy.user': {$arrayElemAt: ["$createdBy.user", 0]},
                                'editedBy.user' : {$arrayElemAt: ["$editedBy.user", 0]},
                                name            : 1,
                                'editedBy.date' : 1,
                                'createdBy.date': 1,
                                dateBirth       : 1,
                                skype           : 1,
                                workEmail       : 1,
                                workPhones      : 1,
                                jobType         : 1,
                                isEmployee      : 1,
                                creationDate    : 1,
                                workflow        : {$arrayElemAt: ["$workflow", 0]},
                                personalEmail   : 1,
                                sequence        : 1,
                                hire            : 1,
                                fire            : 1
                            };

                            projectSecond = {
                                manager         : 1,
                                jobPosition     : 1,
                                department      : 1,
                                'createdBy.user': 1,
                                'editedBy.user' : 1,
                                'editedBy.date' : 1,
                                'createdBy.date': 1,
                                name            : 1,
                                dateBirth       : 1,
                                skype           : 1,
                                workEmail       : 1,
                                workPhones      : 1,
                                jobType         : 1,
                                isEmployee      : 1,
                                creationDate    : 1,
                                workflow        : 1,
                                personalEmail   : 1,
                                sequence        : 1,
                                hire            : 1,
                                fire            : 1
                            };
                        }
                            break;
                    }
                    break;
            }

            Employee.aggregate([{
                $lookup: {
                    from        : "Employees",
                    localField  : "manager",
                    foreignField: "_id", as: "manager"
                }
            }, {
                $lookup: {
                    from        : "JobPosition",
                    localField  : "jobPosition",
                    foreignField: "_id", as: "jobPosition"
                }
            }, {
                $lookup: {
                    from        : "Department",
                    localField  : "department",
                    foreignField: "_id", as: "department"
                }
            }, {
                $lookup: {
                    from        : "Users",
                    localField  : "relatedUser",
                    foreignField: "_id", as: "relatedUser"
                }
            }, {
                $lookup: {
                    from        : "Users",
                    localField  : "createdBy.user",
                    foreignField: "_id", as: "createdBy.user"
                }
            }, {
                $lookup: {
                    from        : "Users",
                    localField  : "editedBy.user",
                    foreignField: "_id", as: "editedBy.user"
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $project: project
            }, {
                $project: projectSecond
            }, {
                $match: queryObject
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit
            }
            ], function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });

    }

    this.updateOnlySelectedFields = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var _id = req.params.id;
        var dbName = req.session.lastDb;
        var UsersSchema = mongoose.Schemas.User;
        var UsersModel = models.get(dbName, 'Users', UsersSchema);
        var Department = models.get(dbName, 'Department', DepartmentSchema);
        var JobPosition = models.get(dbName, 'jobPosition', jobPositionSchema);
        var data = req.body;
        var fileName = data.fileName;
        var updateObject = data;
        var dataObj = {};
        var query = {};

        updateObject.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };

        if (data.workflow && data.sequenceStart && data.workflowStart) {
            if (data.sequence === -1) {
                event.emit('updateSequence', Employee, "sequence", data.sequenceStart, data.sequence, data.workflowStart, data.workflowStart, false, true, function () {
                    event.emit('updateSequence', Employee, "sequence", data.sequenceStart, data.sequence, data.workflow, data.workflow, true, false, function (sequence) {
                        data.sequence = sequence;
                        if (data.workflow === data.workflowStart) {
                            data.sequence -= 1;
                        }

                        if (data.fired) {
                            dataObj = {
                                'fire': data.fired
                            };
                        } else if (data.hired) {
                            dataObj = {
                                'hire': data.hired
                            };
                        }

                        if (dataObj.hire || dataObj.fire) {
                            query = {$set: updateObject, $push: dataObj};
                        } else {
                            query = {$set: updateObject};
                        }

                        Employee.findByIdAndUpdate(_id, query, {new: true}, function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            res.status(200).send({success: 'Employees updated', sequence: result.sequence});
                        });
                    });
                });
            } else {
                event.emit('updateSequence', Employee, "sequence", data.sequenceStart, data.sequence, data.workflowStart, data.workflow, false, false, function (sequence) {
                    delete data.sequenceStart;
                    delete data.workflowStart;
                    data.sequence = sequence;

                    Employee.findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'Employees updated'});
                    });
                });
            }
        } else {
            if (updateObject.dateBirth) {
                updateObject.age = getAge(updateObject.dateBirth);
            }

            if (data.fired) {
                dataObj = {
                    'fire': data.fired
                };

            } else if (data.hired) {
                dataObj = {
                    'hire': data.hired
                };
            }

            if (dataObj.hire || dataObj.fire) {
                query = {$set: updateObject, $push: dataObj};
            } else if (data.relatedUser) {
                query = {$set: updateObject};
                event.emit('updateName', data.relatedUser, UsersModel, '_id', 'RelatedEmployee', _id);
            } else if (data.currentUser) {
                event.emit('updateName', data.currentUser, UsersModel, '_id', 'RelatedEmployee', null);
                delete data.currentUser;
                query = {$set: updateObject};
            } else {
                query = {$set: updateObject};
            }

            Employee.findByIdAndUpdate(_id, query, {new: true}, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (updateObject.dateBirth || updateObject.contractEnd || updateObject.hired) {
                    event.emit('recalculate', req, res, next);
                }
                if (fileName) {
                    var os = require("os");
                    var osType = (os.type().split('_')[0]);
                    var path;
                    var dir;
                    var newDirname;

                    switch (osType) {
                        case "Windows":
                        {
                            newDirname = __dirname.replace("\\Modules", "");
                            while (newDirname.indexOf("\\") !== -1) {
                                newDirname = newDirname.replace("\\", "\/");
                            }
                            path = newDirname + "\/uploads\/" + _id + "\/" + fileName;
                            dir = newDirname + "\/uploads\/" + _id;
                        }
                            break;
                        case "Linux":
                        {
                            newDirname = __dirname.replace("/Modules", "");
                            while (newDirname.indexOf("\\") !== -1) {
                                newDirname = newDirname.replace("\\", "\/");
                            }
                            path = newDirname + "\/uploads\/" + _id + "\/" + fileName;
                            dir = newDirname + "\/uploads\/" + _id;
                        }
                            break;
                    }

                    fs.unlink(path, function (err) {
                        console.log(err);
                        fs.readdir(dir, function (err, files) {
                            if (files && files.length === 0) {
                                fs.rmdir(dir, function () {
                                });
                            }
                        });
                    });

                }
                event.emit('dropHoursCashes', req);
                event.emit('recollectVacationDash');

                function populateEmployee(cb) {
                    Employee.populate(result, {
                        'path'  : 'manager',
                        'select': 'name _id'
                    }, cb);
                }

                function populateGroupsUsers(cb) {
                    UsersModel.populate(result, {
                        'path'  : 'groups.users',
                        'select': 'login _id'
                    }, cb);
                }

                function populateGroupsOwner(cb) {
                    UsersModel.populate(result, {
                        'path'  : 'groups.owner',
                        'select': 'login _id'
                    }, cb);
                }

                function populateGroups(cb) {
                    Department.populate(result, {
                        'path'  : 'groups.group',
                        'select': 'departmentName _id'
                    }, cb);
                }

                function populateEmployeeHire(cb) {
                    Employee.populate(result, {
                        'path'  : 'hire.manager',
                        'select': 'name _id'
                    }, cb);
                }

                function populateEmployeeFire(cb) {
                    Employee.populate(result, {
                        'path'  : 'fire.manager',
                        'select': 'name _id'
                    }, cb);
                }

                function populateDepartment(cb) {
                    Department.populate(result, {
                        'path'  : 'department',
                        'select': 'departmentName _id'
                    }, cb);
                }

                function populateDepartmentFire(cb) {
                    Department.populate(result, {
                        'path'  : 'fire.department',
                        'select': 'departmentName _id'
                    }, cb);
                }

                function populateDepartmentHire(cb) {
                    Department.populate(result, {
                        'path'  : 'hire.department',
                        'select': 'departmentName _id'
                    }, cb);
                }

                function populateJobPosition(cb) {
                    JobPosition.populate(result, {
                        'path'  : 'jobPosition',
                        'select': 'name _id'
                    }, cb);
                }

                function populateJobPositionFire(cb) {
                    JobPosition.populate(result, {
                        'path'  : 'fire.jobPosition',
                        'select': 'name _id'
                    }, cb);
                }

                function populateJobPositionHire(cb) {
                    JobPosition.populate(result, {
                        'path'  : 'hire.jobPosition',
                        'select': 'name _id'
                    }, cb);
                }

                function populateRelatedUser(cb) {
                    UsersModel.populate(result, {
                        'path'  : 'relatedUser',
                        'select': 'login _id'
                    }, cb);
                }

                async.parallel([populateRelatedUser, populateGroupsUsers, populateGroupsOwner, populateGroups, populateEmployee, populateEmployeeFire, populateDepartment, populateJobPosition, populateEmployeeHire, populateDepartmentHire, populateJobPositionHire, populateDepartmentFire, populateJobPositionFire], function () {
                    res.status(200).send(result);
                });

                payrollHandler.composeSalaryReport(req);

            });
        }
    };

    this.remove = function (req, res, next) {
        var _id = req.params.id;
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee.findByIdAndRemove(_id, function (err, result) {
            if (err) {
                return next(err);
            }

            if (result && !result.isEmployee) {
                event.emit('updateSequence', Employee, "sequence", result.sequence, 0, result.workflow, result.workflow, false, true);
            }

            event.emit('recalculate', req, res, next);
            event.emit('dropHoursCashes', req);
            event.emit('recollectVacationDash', req);

            res.status(200).send({success: 'Employees removed'});
        });
    };

    function getApplicationsForKanban(req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var response = {};
        var startTime = new Date();
        var filterObj = {};
        var condition;
        var data = req.query;

        response.data = [];
        response.workflowId = data.workflowId;
        models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
            {
                $match: {
                    users: objectId(req.session.uId)
                }
            }, {
                $project: {
                    _id: 1
                }
            },
            function (err, deps) {
                if (err) {
                    return next(err);
                }

                var arrOfObjectId = deps.objectID();
                filterObj.$and = [];
                filterObj.$and.push({isEmployee: false});
                filterObj.$and.push({workflow: objectId(data.workflowId)});
                /*filterObj['$and'].push({$or: []});
                 or = filterObj['$and'][2]['$or'];*/

                if (data && data.filter) {
                    if (data.filter.condition === 'or') {
                        filterObj.$and.push({$or: []});
                        condition = filterObj.$and[2].$or;
                    } else {
                        filterObj.$and.push({$and: []});
                        condition = filterObj.$and[2].$and;
                    }

                    if (data.filter && data.filter.Name) {
                        condition.push({'name.last': {$in: data.filter.Name}});
                    }
                    if (data.filter && data.filter.Email) {
                        condition.push({'workEmail': {$in: data.filter.Email}});
                    }
                    if (!condition.length) {
                        filterObj.$and.pop();
                    }
                }
                Employee.aggregate(
                    {
                        $match: {
                            $and: [
                                filterObj,
                                {
                                    $or: [
                                        {
                                            $or: [
                                                {
                                                    $and: [
                                                        {whoCanRW: 'group'},
                                                        {'groups.users': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'group'},
                                                        {'groups.group': {$in: arrOfObjectId}}
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            $and: [
                                                {whoCanRW: 'owner'},
                                                {'groups.owner': objectId(req.session.uId)}
                                            ]
                                        },
                                        {whoCanRW: "everyOne"}
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        $project: {
                            _id: 1
                        }
                    },
                    function (err, responseApplications) {
                        if (err) {
                            return next(err);
                        }

                        Employee
                            .where('_id').in(responseApplications)
                            .select("_id name proposedSalary jobPosition nextAction workflow editedBy.date sequence fired")
                            .populate('workflow', '_id')
                            .populate('jobPosition', '_id name')
                            .sort({lastFire: -1, 'sequence': -1})
                            .limit(req.session.kanbanSettings.applications.countPerPage)
                            .exec(function (err, result) {
                                if (err) {
                                    return next(err);
                                }

                                response.data = result;
                                response.time = (new Date() - startTime);
                                response.workflowId = data.workflowId;
                                response.fold = (req.session.kanbanSettings.applications.foldWorkflows && req.session.kanbanSettings.applications.foldWorkflows.indexOf(data.workflowId.toString()) !== -1);

                                res.status(200).send(response);
                            });
                    });
            });
    }

    this.getForDdByRelatedUser = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var result = {};
        var uId = req.session.uId;

        var query = Employee.find({relatedUser: uId, isEmployee: true}, {name: 1}).sort({'name.first': 1});

        query.exec(function (err, user) {
            if (err) {
                return next(err);
            }

            result.data = user;
            res.status(200).send(result);

        });
    };

    this.getByViewTpe = function (req, res, next) {
        var query = req.query;
        var viewType = query.viewType;
        var id = req.params.id;

        if (viewType === id) {
            viewType = id;
        }

        if (id && id.length >= 24) {
            getById(req, res, next);
            return false;
        }

        switch (viewType) {
            case "form":
                getById(req, res, next);
                break;
            case "kanban":
                getApplicationsForKanban(req, res, next);
                break;
            case "thumbnails":
                getFilter(req, res, next);
                break;
            case "list":
                getFilter(req, res, next);
                break;
        }
    };

    this.getSalesPerson = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var result = {};
        var query = Employee.find(/*{'isEmployee': true}*/{}, {name: 1}).sort({'name.first': 1});

        query.exec(function (err, employees) {
            if (err) {
                return next(err);
            }

            result.data = employees;
            res.status(200).send(result);
        });

    };

    this.getEmployeesAlphabet = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var response = {};
        var query = Employee
            .aggregate([{
                $match: {
                    isEmployee: true
                }
            }, {
                $project: {
                    later: {$substr: ["$name.last", 0, 1]}
                }
            }, {
                $group: {
                    _id: "$later"
                }
            }]);

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            response.data = result;
            res.status(200).send(response);
        });
    };

    this.getEmployeesImages = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var data = req.params;
        var ids = data.ids || [];

        if (!ids.length) {
            ids = req.query.ids || [];
        }

        var query = Employee.find({isEmployee: true, _id: {$in: ids}}, {imageSrc: 1, name: 1});

        query.exec(function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: response});

        });
    };

    this.getCollectionLengthByWorkflows = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;
        var data = {};
        data.showMore = false;

        accessRollSearcher = function (cb) {
            accessRoll(req, Employee, cb);
        };

        contentSearcher = function (deps, cb) {
            Employee
                .aggregate([{
                    $match: {
                        _id: {$in: deps}
                    }
                }, {
                    $project: {
                        _id     : 1,
                        workflow: 1
                    }
                },
                    {
                        $group: {
                            _id  : "$workflow",
                            count: {$sum: 1}
                        }
                    }
                ], function (err, result) {
                    if (err) {
                        cb(err);
                    }

                    cb(null, result);
                });
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            result.forEach(function (object) {
                if (object.count > req.session.kanbanSettings.applications.countPerPage) {
                    data.showMore = true;
                }
            });
            data.arrayOfObjects = result;
            res.send(data);
        });

    };

    this.getNationality = function (req, res, next) {
        var Nationality = models.get(req.session.lastDb, 'nationality', nationalitySchema);

        Nationality.find({}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.getLanguages = function (req, res, next) {
        var Languages = models.get(req.session.lastDb, 'languages', LanguageSchema);

        Languages.find({}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.getSources = function (req, res, next) {
        var Sources = models.get(req.session.lastDb, 'sources', SourceSchema);

        Sources.find({}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.getSalaryByMonth = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var query = req.query;
        var _id = query._id;
        var month = query.month;
        var year = query.year;
        var date = moment().year(year).month(month - 1).date(1);

        Employee.findById(_id, {hire: 1, fire: 1}, function (err, result) {
            if (err){
                return next(err);
            }
            var hire = result.hire;
            var salary = 0;
            var i;
            var length = hire.length;

            for (i = length - 1; i >= 0; i--){
                if (date >= hire[i].date){
                    salary = hire[i].salary;
                    break;
                }
            }

            return res.status(200).send({data: salary});
        });
    };

    this.uploadEmployeesFiles = function (req, res, next) {
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        uploadFileArray(req, res, next, Employee);
    };

    var check = function (req, callback) {
        var now = new Date();
        var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var Birthdays = models.get(req.session.lastDb, "birthdays", birthdaysSchema);

        Birthdays.find({}, function (err, birth) {
            if (err) {
                callback(-1);
            } else {
                if (birth.length === 0) {
                    callback(0);
                } else {
                    if (birth[0].date < dateOnly) {
                        callback(0);
                    } else {
                        callback(1, birth[0].currentEmployees);
                    }
                }
            }
        });
    };

    var getEmployeesInDateRange = function (req, res, next, callback) {
        var now = new Date();
        var day = 0;
        var _month = now.getMonth() + 1;
        var NUMBER_OF_MONTH = 1;
        var tempMonthLength = _month + NUMBER_OF_MONTH;
        var realPart;
        var query;
        var Employee = models.get(req.session.lastDb, "Employees", EmployeeSchema);

        /*function getAge(birthday) {
         birthday = new Date(birthday);
         var today = new Date();
         var years = today.getFullYear() - birthday.getFullYear();

         birthday.setFullYear(today.getFullYear());

         if (today < birthday) {
         years--;
         }
         return (years < 0) ? 0 : years;
         }*/

        var separateWeklyAndMonthly = function (arrayOfEmployees) {
            var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var dayNumber = dateOnly.getDay();
            var LeftOffset = dayNumber - 1;
            var RightOffset = 7 - dayNumber;
            var FirstDateWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - LeftOffset).valueOf();
            var LastDateWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + RightOffset).valueOf();
            var FirstDateNxtWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + RightOffset + 1).valueOf();
            var LastDateNxtWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + RightOffset * 2 + 1).valueOf();

            var currentEmployees = {};

            function getDaysToBirthday(birthday) {
                var today = new Date();
                var days;
                var firstDayOfYear = new Date(today.getFullYear() + 1, 0, 1);
                var lastDayOfYear = new Date(today.getFullYear(), 11, 31);
                if (birthday.getMonth() >= today.getMonth()) {
                    birthday.setFullYear(today.getFullYear());
                    days = Math.round((birthday - today) / 1000 / 60 / 60 / 24);
                } else {
                    days = Math.round((lastDayOfYear - today) / 1000 / 60 / 60 / 24);
                    days += Math.round((birthday.setFullYear(today.getFullYear() + 1) - firstDayOfYear) / 1000 / 60 / 60 / 24);
                }
                return days;
            }

            currentEmployees.monthly = arrayOfEmployees.map(function (employee) {
                if (employee.dateBirth) {
                    employee.daysForBirth = getDaysToBirthday(employee.dateBirth);
                }
                return employee;
            });

            currentEmployees.nextweek = currentEmployees.monthly.filter(function (employee) {
                if (employee.dateBirth) {
                    var birthday = new Date(employee.dateBirth);
                    birthday.setHours(0);
                    var valueOfBirthday = birthday.valueOf();
                    if (valueOfBirthday >= FirstDateNxtWeek) {
                        if ((valueOfBirthday <= LastDateNxtWeek)) {
                            return true;
                        }
                    }
                }
            });

            currentEmployees.weekly = currentEmployees.monthly.filter(function (employee) {
                if (employee.dateBirth) {
                    var birthday = new Date(employee.dateBirth);
                    birthday.setHours(0);
                    var valueOfBirthday = birthday.valueOf();
                    if (valueOfBirthday >= FirstDateWeek) {
                        if ((valueOfBirthday <= LastDateWeek)) {
                            return true;
                        }
                    }

                }
            });
            currentEmployees.monthly.sort(function (a, b) {
                if (a.daysForBirth > b.daysForBirth) {
                    return 1;
                }
                if (a.daysForBirth < b.daysForBirth) {
                    return -1;
                }
                return 0;
            });
            currentEmployees.weekly.sort(function (a, b) {
                if (a.daysForBirth > b.daysForBirth) {
                    return 1;
                }
                if (a.daysForBirth < b.daysForBirth) {
                    return -1;
                }
                return 0;
            });

            currentEmployees.nextweek.sort(function (a, b) {
                if (a.daysForBirth > b.daysForBirth) {
                    return 1;
                }
                if (a.daysForBirth < b.daysForBirth) {
                    return -1;
                }
                return 0;
            });
            return currentEmployees;
        };

        if (tempMonthLength / 12 < 1) {

            query = {
                $or: [
                    {$and: [{month: _month}, {days: {$gte: day}}, {days: {$lte: 31}}]},
                    {$and: [{month: {$gt: _month}}, {month: {$lt: tempMonthLength}}]},
                    {$and: [{month: tempMonthLength}, {days: {$lte: day}}]}
                ]
            };
        } else {
            realPart = tempMonthLength % 12;
            query = {
                $or: [
                    {$and: [{month: _month}, {days: {$gte: day}}, {days: {$lte: 31}}]},
                    {$and: [{month: {$gte: 1}}, {month: {$lt: realPart}}]},
                    {$and: [{month: realPart}, {days: {$lt: day}}]}
                ]
            };
        }

        Employee.aggregate(
            {
                $match: {
                    $and: [
                        {dateBirth: {$ne: null}},
                        {isEmployee: true}
                    ]
                }
            },
            {
                $project: {
                    _id  : 1,
                    month: {$month: '$dateBirth'},
                    days : {$dayOfMonth: '$dateBirth'}
                }
            },
            {
                $match: query
            },
            function (err, result) {
                if (err) {
                    return next(err);
                }

                Employee.find().where('_id').in(result)
                    .select('_id name dateBirth age jobPosition workPhones.mobile department')
                    .populate('jobPosition', '_id name')
                    .populate('department', ' _id departmentName')
                    .lean()
                    .exec(function (err, resArray) {
                        if (err) {
                            return callback(req, res, next, separateWeklyAndMonthly([]));
                        }
                        resArray.map(function (employee) {
                            employee.age = getAge(employee.dateBirth);
                            return employee;
                        });
                        callback(req, res, next, separateWeklyAndMonthly(resArray));
                    });
            });
    };

    var set = function (req, res, next, currentEmployees) {
        var result = {};
        var data = {};
        var now = new Date();
        var Birthdays = models.get(req.session.lastDb, "birthdays", birthdaysSchema);

        data.date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        data.currentEmployees = currentEmployees;

        Birthdays.findByIdAndUpdate({_id: 1}, data, {new: true, upsert: true}, function (err, birth) {
            if (err) {
                if (res) {
                    return next(err);
                }
            }
            result.data = birth.currentEmployees;
            if (res) {
                res.send(result);
            }
        });
    };

    this.getBirthdays = function (req, res, next) {

        var err = new Error();
        var result = {};
        result.data = [];

        check(req, function (status, employees) {
            switch (status) {
                case -1:
                {
                    err.status = 500;
                    next(err);
                }
                    break;
                case 0:
                {
                    getEmployeesInDateRange(req, res, next, set);
                }
                    break;
                case 1:
                {
                    result.data = employees;
                    res.status(200).send(result);
                }
                    break;
            }
        });
    };

    var recalculate = function (req, res, next) {
        getEmployeesInDateRange(req, res, next, set);
    };

    event.on('recalculate', recalculate);
};
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees/form/:id`
 *
 * This __method__ allows get all Employees for `form` viewType.
 * @method Employees
 * @param {String} form - View type
 * @param {String} id - Id of employee
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Birthdays`
 *
 * This __method__ allows get all birthdays of Employees for current week, next week and current month.
 * @example {
 *   "data": {
 *       "weekly": [
 *           {
 *               "daysForBirth": 3,
 *               "_id": "55b92ad221e4b7c40f000047",
 *               "dateBirth": "2015-08-30T00:00:00.000Z",
 *               "age": 26,
 *               "jobPosition": {
 *                   "_id": "55b92acf21e4b7c40f000027",
 *                   "name": "Senior iOS"
 *                   },
 *               "department": {
 *                   "_id": "55b92ace21e4b7c40f00000f",
 *                   "name": "iOS"
 *                   },
 *               "workPhones": {
 *                   "mobile": "+38 050 10 86 444"
 *                   },
 *               "name": {
 *                   "last": "Khymych",
 *                   "first": "Ilya"
 *                   }
 *            }
 *         ]
 *       }
 *   }
 *
 * @method Birthdays
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/getForDdByRelatedUser`
 *
 * This __method__ allows get related Employees for current user.
 * @example {
 *   "data": [
 *       {
 *           "_id": "55b92ad221e4b7550f00004f",
 *           "name": {
 *               "last": "Alex",
 *               "first": "Alex"
 *           },
 *           "fullName": "Alex Alex",
 *           "id": "55b92ad221e4b7550f00004f"
 *        }
 *      ]
 *   }
 *
 * @method getForDdByRelatedUser
 * @instance
 */
/**
 * __Type__ `POST`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees`
 *
 * This __method__ allows create new Employee.
 * @example {
 *   "success": "A new Employees create success",
 *   "result": {
 *         .......//model of Employee
 *         }
 *   }
 * @method Employees
 * @property {JSON} Object - Object with properties for new Employee
 * @instance
 */
/**
 * __Type__ `PATCH`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees/:id`
 *
 * This __method__ allows to update only modified fields in Employee by id.
 * @example {
 *   "success": "Employees updated",
 *   "result": {
 *       "_id": "55deaef309b1c0e30a000006",
 *       .......//model of Employee
 *       }
 *   }
 *
 * @method Employees
 * @param {String} id - Id of Employee
 * @instance
 */
/**
 * __Type__ `DELETE`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees/:id`
 *
 * This __method__ allows to delete Employee by id.
 * @example {
 *   "success": "Employees removed"
 *  }
 *
 * @method Employees
 * @param {String} id - Id of Employee
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/getSalesPerson`
 *
 * This __method__ allows to get Employees that can be sales persons.
 * @example {
 *   "data": [
 *       {
 *           "_id": "55b92ad221e4b7c400000030",
 *           "name": {
 *               "first": "Alex",
 *               "last": "Alex"
 *           },
 *           "fullName": "Alex Alex",
 *           "id": "55b92ad221e4b7c400000030"
 *       },
 *       ...........
 *       ]
 *     }
 *
 * @method getSalesPerson
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees/kanban`
 *
 * This __method__ allows get all Employees for `kanban` viewType.
 * @method Employees
 * @param {String} kanban - View type
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Employees/list`
 *
 * This __method__ allows get all Employees for `list` viewType.33
 *
 * @example
 *        {"data": [{
     *        "_id": "55b92ad221e4b7c40f000030",
     *        "dateBirth": "1981-12-31T00:00:00.000Z",
     *        "ID": 1,
     *        "isLead": 2,
     *        "__v": 0,
     *        "lastFire": null,
     *        "fire": [],
     *        "hire": [
     *            "2011-10-11T00:00:00.000Z"
     *            ],
     *        "social": {
     *            "GP": "",
     *            "LI": "",
     *            "FB": ""
     *            },
     *        "sequence": 0,
     *        "jobType": null,
     *        "gender": "male",
     *        "marital": "unmarried",
     *        "contractEnd": {
     *            "date": "2015-07-29T19:34:42.405Z",
     *            "reason": ""
     *            },
     *        "attachments": [],
     *        "editedBy": {
     *            "date": "2015-08-18T05:55:15.458Z",
     *            "user": "52203e707d4dba8813000003"
     *            },
     *        "createdBy": {
     *            "date": "2015-07-29T19:34:42.404Z",
     *            "user": "52203e707d4dba8813000003"
     *            },
     *        "creationDate": "2015-07-29T19:34:42.404Z",
     *        "color": "#4d5a75",
     *        "otherInfo": "",
     *        "groups": {
     *            "group": [],
     *            "users": [],
     *            "owner": "55ba28c8d79a3a3439000016"
     *            },
     *        "whoCanRW": "everyOne",
     *        "workflow": null,
     *        "active": false,
     *        "referredBy": "",
     *        "source": "",
     *        "age": 33,
     *        "homeAddress": {
     *            "country": "",
     *            "zip": "",
     *            "state": "",
     *            "city": "",
     *            "street": ""
     *            },
     *        "otherId": "",
     *        "bankAccountNo": "",
     *        "nationality": "",
     *        "coach": null,
     *        "manager": {
     *            "name": "Select",
     *            "_id": null
     *            },
     *        "jobPosition": {
     *            "name": "Senior iOS",
     *            "_id": "55b92acf21e4b7c40f000027"
     *        },
     *        "department": {
     *            "name": "PM",
     *            "_id": "55bb1f40cb76ca630b000007"
     *            },
     *        "visibility": "Public",
     *        "relatedUser": null,
     *        "officeLocation": "",
     *        "skype": "alexsvt",
     *        "workPhones": {
     *            "phone": "",
     *            "mobile": "+380509365593"
     *            },
     *        "personalEmail": "",
     *        "workEmail": "alex@thinkmobiles.com",
 *        "workAddress": {
     *            "country": "",
     *            "zip": "",
     *            "state": "",
     *            "city": "",
     *            "street": ""
     *            },
 *        "tags": [
 *            ""
 *            ],
 *        "name": {
     *            "last": "Svatuk",
     *            "first": "Alex"
     *            },
 *        "subject": "",
 *        "imageSrc": "data:image/jpeg;base64,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",
 *        "isEmployee": true,
 *        "fullName": "Alex Ssss",
 *        "id": "55b92ad221e4b7c40f000030"
 *        }]}
 * @method Employees
 * @param {String} list - View type
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/totalCollectionLength/Employees`
 * This __method__ allows get count of Employees.
 * @example {
                 *         "showMore": false,
                 *         "count": 135
                 *     }
 * @method totalCollectionLength
 * @param {String} Employees - Content type
 * @instance
 */

/**
 * @module Application
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/totalCollectionLength/Applications`
 * This __method__ allows get count of Employees that are not hired.
 * @example {
     *         "showmore": false,
     *         "count": 42
     *     }
 *
 * @method totalCollectionLength
 * @param {String} Applications - Content type
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.122:8089/Applications/form/:id`
 *
 * This __method__ allows get all Employees that are not hired for `form` viewType.
 * @method Applications
 * @param {String} form  - View type
 * @param {String} id - Id of employee
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.122:8089/Applications/kanban`
 *
 * This __method__ allows get all Employees that are not hired for `kanban` viewType.
 * @method Applications
 * @param {String} kanban  - View type
 * @instance
 */
/**
 * __Type__ `GET`
 *
 * Base ___url___ for build __requests__ is `http:/192.168.88.122:8089/Applications/list`
 *
 * This __method__ allows get all Employees that are not hired for `list` viewType.
 * @method Applications
 * @param {String} list  - View type
 * @instance
 */
module.exports = Employee;