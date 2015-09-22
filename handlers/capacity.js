var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var objectId = mongoose.Types.ObjectId;
var Capacity = function (models) {
    var EmployeeHandler = require('../handlers/employee');
    var access = require("../Modules/additions/access.js")(models);
    var CapacitySchema = mongoose.Schemas['Capacity'];
    var async = require('async');
    var _ = require('lodash');
    var error;
    var query;

    function getCapacityFilter(modelId, req, res, next) {
        var vacArrayLength;
        var vacArray;
        var capacityArray;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, modelId, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }
                var Capacity = models.get(req.session.lastDb, 'Capacity', CapacitySchema);
                var options = req.query;
                var queryObject = {};

                if (options) {
                    if (options.employee) {
                        queryObject['employee._id'] = objectId(options.employee);
                    }
                    if (options.year) {
                        queryObject.year = options.year;
                    }
                    if (options.month) {
                        queryObject.month = options.month;
                    }
                }

                query = Capacity.find(queryObject)
                    .populate('vacation');

                query.exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    if (result.vacation && result.vacation._id) {
                        vacArray = result.vacation.vacArray;
                        capacityArray = result.capacityArray;

                        vacArrayLength = vacArray.length();

                        for (var i = vacArrayLength; i > 0; i--) {
                            capacityArray[i] = vacArray[i];
                        }

                        result.capacityArray = capacityArray;
                    }

                    result = _.groupBy(result, 'department.name');

                    res.status(200).send(result);
                });
            });

        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.getForType = function (req, res, next) {
        //var contentType = req.body.contentType;

        //switch (contentType) {
        //case "capacity":
        getCapacityFilter(77, req, res, next);
        //break;
        //}
    };

    this.create = function (req, res, next) {
        var employeeHandler = new EmployeeHandler(models);
        var Capacity = models.get(req.session.lastDb, 'Capacity', CapacitySchema);
        var VacationSchema = mongoose.Schemas['Vacation'];
        var Vacation = models.get(req.session.lastDb, 'Vacation', VacationSchema);
        var capacity;
        var waterfallTasks;

        var date = moment(new Date());
        var daysCount;

        var year = parseInt(date.format('YYYY'));
        var month = parseInt(date.format('M'));

        waterfallTasks = [getEmployees, saveCapacities];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send('ok');
        })

        function getEmployees(callback) {
            employeeHandler.getNameAndDepartment(req.session.lastDb, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            })
        }

        function saveCapacities(employees, callback) {
            var dateValue;
            var dayNumber;

            async.eachLimit(employees, 100, function (employee, cb) {
                var query;
                var queryObject = {};

                var modelObject = {
                    year : year,
                    month: month + 1
                }

                if (employee) {

                    queryObject.month = modelObject.month;
                    queryObject.year = modelObject.year;
                    queryObject['employee._id'] = employee._id;

                    modelObject.employee = {
                        _id : employee._id,
                        name: employee.name.first + ' ' + employee.name.last
                    }
                    modelObject.department = {
                        _id : employee.department._id,
                        name: employee.department.name
                    }

                    daysCount = date.daysInMonth();
                    modelObject.capacityArray = [];
                    modelObject.capacityMonthTotal = 0;

                    for (var day = daysCount; day >= 0; day--) {

                        dateValue = moment([year, month - 1, day + 1]);

                        dayNumber = moment(dateValue).day();

                        if (dayNumber !== 0 && dayNumber !== 6) {
                            modelObject.capacityArray[day] = 8;
                            modelObject.capacityMonthTotal += 8;
                        } else {
                            modelObject.capacityArray[day] = null;
                        }
                    }

                    query = Vacation.find(queryObject).lean();

                    query.exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        result = result[0];

                        if (result) {
                            modelObject.vacation = result._id;
                        } else {
                            modelObject.vacation = null;
                        }

                        capacity = new Capacity(modelObject);
                        capacity.save(function (err, result) {
                            if (err) {
                                return cb(err);
                            }

                            cb(null, result);
                        });
                    });
                }
            }, function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null, 'Good');

            });
        }
    }
};

module.exports = Capacity;