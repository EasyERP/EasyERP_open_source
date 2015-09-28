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
        var mid = 77;

        function setVacations(model, vacation, db, callback) {
            var vacArrayLength;
            var vacArray;
            var capacityArray;
            var total;

            var Capacity = models.get(db, 'Capacity', CapacitySchema);

            vacArray = vacation.vacArray;
            capacityArray = model.capacityArray;
            total = model.capacityMonthTotal;

            vacArrayLength = vacArray.length;

            for (var i = vacArrayLength - 1; i >= 0; i--) {
                if (vacArray[i]) {
                    if (capacityArray[i]) {
                        total -= capacityArray[i];
                    }

                    capacityArray[i] = vacArray[i];
                }
            }

            callback(null, {array: capacityArray, total: total});
        };

        function getCapacityFilter(modelId, req, res, next) {

            if (req.session && req.session.loggedIn && req.session.lastDb) {
                access.getReadAccess(req, req.session.uId, modelId, function (access) {
                    if (!access) {
                        error = new Error();
                        error.status = 403;

                        next(error);
                    }

                    var Capacity = models.get(req.session.lastDb, 'Capacity', CapacitySchema);
                    var query = req.query;
                    var queryObject = {};

                    if (query) {
                        if (query.employee) {
                            queryObject['employee._id'] = objectId(query.employee);
                        }
                        if (query.year) {
                            queryObject.year = query.year;
                        }
                        if (query.month) {
                            queryObject.month = query.month;
                        }
                    }

                    query = Capacity.find(queryObject)
                        .populate('vacation');

                    query.exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        result = _.groupBy(result, function(element) {
                            return element.department.name + '_' + element.department._id;
                        });

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
            var viewType = req.params.viewType;

            switch (viewType) {
                case "list":
                    getCapacityFilter(mid, req, res, next);
                    break;
            }
        };

        function createCapacityOnMonth(db, month, year, callback) {
            var employeeHandler = new EmployeeHandler(models);
            var Capacity = models.get(db, 'Capacity', CapacitySchema);
            var VacationSchema = mongoose.Schemas['Vacation'];
            var Vacation = models.get(db, 'Vacation', VacationSchema);
            var capacity;
            var waterfallTasks;
            var date = moment([year, month - 1]);

            var daysCount = date.daysInMonth();

            waterfallTasks = [getEmployees, saveCapacities];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null);
            })

            function getEmployees(callback) {
                employeeHandler.getNameAndDepartment(db, function (err, result) {
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
                    var saveOrNot = true;

                    var modelObject = {
                        year : year,
                        month: month
                    }

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

                    modelObject.capacityArray = [];
                    modelObject.capacityMonthTotal = 0;

                    for (var day = daysCount - 1; day >= 0; day--) {

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
                        var seriesTasks = [saveModel];

                        function saveModel(seriaCB) {
                            if (saveOrNot) {
                                capacity = new Capacity(modelObject);
                                capacity.save(function (err, result) {
                                    if (err) {
                                        return seriaCB(err);
                                    }

                                    return seriaCB(null, result);
                                });
                            } else {
                                seriaCB(null, 'Done');
                            }
                        }

                        function getData(seriaCB) {
                            setVacations(modelObject, result, db, function (err, result) {
                                if (err) {
                                    return seriaCB(err)
                                }

                                if (result.total !== 0) {
                                    modelObject.capacityArray = result.array;
                                    modelObject.capacityMonthTotal = result.total;
                                } else {
                                    saveOrNot = false;
                                }

                                seriaCB(null, 'Good');
                            })
                        }

                        if (err) {
                            return cb(err);
                        }

                        result = result[0];

                        if (!result) {
                            modelObject.vacation = null;
                        } else {
                            modelObject.vacation = result._id;
                            seriesTasks.unshift(getData);
                        }

                        async.series(seriesTasks, function (err) {
                            if (err) {
                                return cb(err);
                            }

                            cb(null, 'Good');
                        })
                    });

                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, 'Good');

                });
            }
        };

        this.createAll = function (req, res, next) {
            var db = req.session.lastDb

            var date = moment(new Date());

            var year = parseInt(date.format('YYYY'));
            var month = parseInt(date.format('M'));

            createCapacityOnMonth(db, month, year, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send('ok');
            })
        };

        this.create = function (req, res, next) {
            var Capacity = models.get(req.session.lastDb, 'Capacity', CapacitySchema);
            var body = req.body;
            var capacity;
            var result = 0;

            body.monthTotal = result;

            capacity = new Capacity(body);

            capacity.save(function (err, capacityResult) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({success: capacityResult});
            });
        };

        this.putchModel = function (req, res, next) {
            var id = req.params.id;
            var data = req.body;
            var Capacity = models.get(req.session.lastDb, 'Capacity', CapacitySchema);

            if (req.session && req.session.loggedIn && req.session.lastDb) {
                access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                    if (access) {
                        data.editedBy = {
                            user: req.session.uId,
                            date: new Date().toISOString()
                        };

                        Capacity.findByIdAndUpdate(id, {$set: data}, function (err, response) {
                            if (err) {
                                return next(err);
                            }

                            res.status(200).send({success: 'updated'});
                        });
                    } else {
                        res.status(403).send();
                    }
                });
            } else {
                res.status(401).send();
            }

        };

        this.putchBulk = function (req, res, next) {
            var body = req.body;
            var uId;
            var Capacity = models.get(req.session.lastDb, 'Capacity', CapacitySchema);

            if (req.session && req.session.loggedIn && req.session.lastDb) {
                uId = req.session.uId;
                access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                    if (access) {
                        async.each(body, function (data, cb) {
                            var id = data._id;

                            data.editedBy = {
                                user: uId,
                                date: new Date().toISOString()
                            };
                            delete data._id;

                            Capacity.findByIdAndUpdate(id, {$set: data}, cb);
                        }, function (err) {
                            if (err) {
                                return next(err);
                            }

                            res.status(200).send({success: 'updated'});
                        });
                    } else {
                        res.status(403).send();
                    }
                });
            } else {
                res.status(401).send();
            }
        };
    }
    ;

module.exports = Capacity;