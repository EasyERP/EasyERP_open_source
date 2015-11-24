var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');

var PayRoll = function (models) {
    "use strict";
    var access = require("../Modules/additions/access.js")(models);
    var PayRollSchema = mongoose.Schemas['PayRoll'];
    var _ = require('lodash');

    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var objectId = mongoose.Types.ObjectId;
    var mid = 66;

    var composeExpensesAndCache = require('../helpers/expenses')(models);

    function ConvertType(array, type) {
        if (type === 'integer') {
            for (var i = array.length - 1; i >= 0; i--) {
                array[i] = parseInt(array[i]);
            }
        } else if (type === 'boolean') {
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i] === 'true') {
                    array[i] = true;
                } else if (array[i] === 'false') {
                    array[i] = false;
                } else {
                    array[i] = null;
                }
            }
        }
    };

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;

        for (var filterName in filter) {
            condition = filter[filterName]['value'];
            key = filter[filterName]['key'];

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
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'month':
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'dataKey':
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
            }
        }
        ;

        return resArray;
    };

    this.create = function (req, res, next) {
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
        var body = req.body;
        var payRollModel;

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

            next(error);
        }
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
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
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.removeByDataKey = function (req, res, next) {
        var body = req.body;
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
                        PayRoll.remove({'dataKey': parseInt(dataKey)}, cb);
                    }, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                    })
                }

                composeExpensesAndCache(req, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                });

                res.status(200).send('Done');

            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.putchModel = function (req, res, next) {
        var data = mapObject(req.body);
        var id = req.params.id;
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
                    data.type._id = objectId(data.type._id);
                }

                PayRoll.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, response) {
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

            next(error);
        }
    };

    this.patchByDataKey = function (req, res, next) {
        var body = req.body;
        var uId;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        var keys = body ? Object.keys(body) : null;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }

                if (keys.length) {
                    async.each(keys, function (key, cb) {
                        var data = body[key];

                        data.editedBy = {
                            user: uId,
                            date: new Date().toISOString()
                        };

                        PayRoll.update({'dataKey': key}, {$set: data}, {multi: true, new: true}, cb);
                    }, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                    })
                }

                composeExpensesAndCache(req, function (err, result) {
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
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }

                async.each(body, function (data, cb) {
                    var id = data._id;

                    data.editedBy = {
                        user: uId,
                        date: new Date().toISOString()
                    };
                    delete data._id;

                    if (data.type) {
                        data.type._id = objectId(data.type._id);
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

    function getByDataKey(req, res, next) {
        var id = req.query.id;
        var data = req.query;
        var sort = data.sort ? data.sort : {"employee.name": 1};
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        var queryObject = {dataKey: parseInt(id)};
        var query;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }

                query = PayRoll.find(queryObject).sort(sort);

                query.exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(result);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.getSorted = function (req, res, next) {
        var data = req.query;
        var db = req.session.lastDb;
        var dataKey = data.dataKey;
        var queryObject = {dataKey: parseInt(dataKey)};
        var sort = data.sort ? data.sort : {"employee.name": 1};
        var Payroll = models.get(db, 'PayRoll', PayRollSchema);

        var query = Payroll.find(queryObject).sort(sort).lean();

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    function getForView(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
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

            next(error);
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

    this.generate = function (req, res, next) {
        var db = req.session.lastDb;
        var EmployeeSchema = mongoose.Schemas['Employees'];
        var Employee = models.get(db, 'Employees', EmployeeSchema);
        var Payroll = models.get(db, 'PayRoll', PayRollSchema);
        var data = req.body;
        var month = parseInt(data.month);
        var year = parseInt(data.year);
        var dateKey = year * 100 + month;
        var waterfallTasks;
        var maxKey = 0;
        var createdIds = [];
        var difference;
        var defObj;
        var employees;
        var ids = [];

        waterfallTasks = [getEmployees, savePayroll];

        async.waterfall(waterfallTasks, function (err, results) {
            if (err) {
                return next(err);
            }

            composeExpensesAndCache(req, function (err, results) {
                if (err) {
                    return next(err);
                }

                res.status(200).send("ok");
            });
        });

        function getEmployees(callback) {
            var queryObject = {
                isEmployee: true
            };

            var query = Employee.find(queryObject).lean();

            query.exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                employees = result;

                result.forEach(function (elem) {
                    ids.push(elem._id.toString());
                });

                callback(null, ids);
            })
        }

        function savePayroll(ids, callback) {

            var newResult;
            var keys;
            var query = Payroll.find({});

            query.exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                newResult = _.groupBy(result, "dataKey");

                keys = Object.keys(newResult);

                keys.forEach(function (key) {
                    if (parseInt(key) >= maxKey) {
                        maxKey = key;
                    }
                });

                var parseKey = parseInt(maxKey);

                var neqQuery = Payroll.find({dataKey: parseKey}).lean();

                neqQuery.exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    async.each(result, function (element, cb) {
                        var dataToSave = _.clone(element);

                        delete dataToSave._id;
                        delete dataToSave.ID;
                        delete dataToSave.data;
                        dataToSave.status = false;

                        dataToSave.dataKey = dateKey;
                        dataToSave.month = month;
                        dataToSave.year = year;
                        dataToSave.paid = 0;
                        dataToSave.diff = (dataToSave.paid ? dataToSave.paid : 0) - (dataToSave.calc ? dataToSave.calc : 0);

                        var PRoll = new Payroll(dataToSave);

                        if (dataToSave.type.name === "Salary Cash") {
                            defObj = dataToSave;
                        }

                        PRoll.save(function (err, result) {
                            createdIds.push(result.employee._id.toString());
                            cb();
                        });

                    }, function () {
                        difference = _.difference(ids, createdIds);

                        async.each(difference, function (id, callB) {
                            var PRoll;
                            var defObj = {};
                            var empl = _.find(employees, function (el) {
                                return el._id.toString() === id;
                            });

                            defObj.dataKey = dateKey;
                            defObj.month = month;
                            defObj.year = year;
                            defObj.paid = 0;
                            defObj.diff = 0;
                            defObj.calc = 0;

                            defObj.employee = {};
                            defObj.employee._id = empl._id;
                            defObj.employee.name = empl.name.first + ' ' + empl.name.last;


                            PRoll = new Payroll(defObj);

                            PRoll.save(function (err, result) {
                                callB();
                            });
                        }, function () {
                            callback();
                        });
                    });
                });
            });
        }

    };
};

module.exports = PayRoll;