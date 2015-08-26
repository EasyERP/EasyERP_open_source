
var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var Salary = function (models) {

    var access = require("../Modules/additions/access.js")(models);
    var SalarySchema = mongoose.Schemas['Salary'];
    var SalaryCashSchema = mongoose.Schemas['SalaryCash'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var _ = require('lodash');

    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var self = this;
    var objectId = mongoose.Types.ObjectId;

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var data = req.headers;
        var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);
        var SalaryCash = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);
        var queryObject = {};

        access.getDeleteAccess(req, req.session.uId, 66, function (access) {
            if (access) {


                if (data) {
                    if (data.month) {
                        queryObject.month = data.month;
                    }
                    if (data.year) {
                        queryObject.year = data.year;
                    }
                }

                if (queryObject.month && queryObject.year) {
                    Salary.remove(queryObject, function (err, salary) {
                        if (err) {
                            return next(err);
                        }
                        SalaryCash.remove({_id: id}, function (err, salaryCash) {
                            if (err) {
                                return next(err);
                            }
                            res.status(200).send({success: salaryCash});
                        });
                    });
                } else {
                    Salary.remove({_id: id}, function (err, salary) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send({success: salary});
                    });
                }

            } else {
                res.status(403).send();
            }
        });
    };

    this.putchModel = function (req, res, next) {
        var id = req.params.id;
        var data = mapObject(req.body);
        var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 66, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    Salary.findByIdAndUpdate(id, {$set: data}, function (err, response) {
                        if (err) {
                            return next(err);
                        }
                        self.recalculateCashSalary(req, function () {
                        });
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
        var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 66, function (access) {
                if (access) {
                    async.each(body, function (data, cb) {
                        var id = data._id;

                        data.editedBy = {
                            user: uId,
                            date: new Date().toISOString()
                        };
                        delete data._id;
                        data.baseSalary = data.calc['salary'];
                        Salary.findByIdAndUpdate(id, {$set: data}, cb);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        self.recalculateCashSalary(req, function () {
                        });
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

    this.create = function (req, res, next) {
        var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);
        var SalaryCash = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);
        var body = req.body;
        var salaryModel;
        var month;
        var year;

        if (body.length) {
            month = body[0].month;
            year = body[0].year;

            async.each(body, function (element, callback) {
                    salaryModel = new Salary(mapObject(element));

                    salaryModel.save(function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        callback();
                    });
                }, function (err) {
                    if (err) {
                        return next(err);
                    }
                    async.series([
                            function (callback) {
                                self.recalculateCashSalary(req, callback);
                            },
                            function (callback) {
                                var query = SalaryCash.findOne({"$and": [{month: month}, {year: year}]});

                                query.exec(function (err, result) {
                                    if (err) {
                                        return callback(err);
                                    }
                                    callback(null, result);
                                });
                            }
                        ],
                        function (err, results) {
                            if (err) {
                                return next(err);
                            }
                            if (results[1]) {
                                res.status(200).send({success: results[1]});
                            }
                        }
                    );
                }
            );

        } else {
            salaryModel = new Salary(mapObject(body));

            salaryModel.save(function (err, salary) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({success: salary});
            });
        }
    };

    function getSalaryFilter(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 66, function (access) {
                if (access) {
                    var Salary = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);
                    var query = req.query;
                    var queryObject = {};
                    var sort = {};
                    var count = query.count ? query.count : 100;
                    var page = req.query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (query && query.sort) {
                        sort = query.sort;
                    } else {
                        sort = {"year": -1, "month": -1};
                    }

                    departmentSearcher = function (waterfallCallback) {
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
                            waterfallCallback);
                    };

                    contentIdsSearcher = function (deps, waterfallCallback) {

                        Salary.aggregate(
                            {
                                $match: {}
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            waterfallCallback
                        );
                    };

                    contentSearcher = function (salaryIds, waterfallCallback) {
                        var query;
                        queryObject._id = {$in: salaryIds};

                        self.totalCollectionLength(req, function (err, ressult) {
                            if (ressult) {
                                query = Salary.find(queryObject)
                                    .limit(count)
                                    .skip(skip)
                                    .lean()
                                    .sort(sort);
                                query.exec(waterfallCallback);
                            } else {
                                async.series({
                                    first: function (callback) {
                                        self.recalculateCashSalary(req, callback);
                                    },
                                    second: function (callback) {
                                        query = Salary.find(queryObject)
                                            .limit(count)
                                            .skip(skip)
                                            .lean()
                                            .sort(sort);
                                        query.exec(function (err, result) {
                                            if (err) {
                                                callback(err);
                                            }
                                            callback(null, result);
                                        });
                                    }
                                }, waterfallCallback);
                            }
                        })

                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(result);
                    });

                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;
        var query = req.query.month;

        if (query) {
            getSalaryData(req, res, next);

        } else if (viewType == 'list') {
            getSalaryFilter(req, res, next);
        }
    };


    this.getById = function (req, res, next) {
        var id = req.params.id;
        var Salary = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);

        var queryObject = {_id: id};
        var query;

        query = Salary.findOne(queryObject);

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getByMonth = function (req, res, next) {
        var data = req.query;
        var month = data.month;
        var year = data.year;
        var empId = data._id;
        var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);

        var matchObject = {month: month, year: year, 'employee._id': empId};
        var query = Salary.findOne(matchObject);

        query.exec(function (err, result) {
            var baseSalary;

            if (err) {
                return next(err);
            }

            baseSalary = result ? result.baseSalary : null;
            //res.header('Content-Type', 'application/json');
            if (result){
                res.status(200).send({data: result.baseSalary});
            } else {
                res.status(200).send({data: 0});
            }

        });

    };

    this.totalCollectionLength = function (req, res, next) {
        var Salary = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);
        var query;

        query = Salary.find();
        query.exec(function (err, result) {
            if (next) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({count: result.length});
            } else if (typeof res == 'function') {
                res(null, result.length);
            }
        });
    };

    this.recalculateCashSalary = function (req, res, next) {

        var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);
        var CashSalary = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);
        var waterfallTasks;

        function getGroupedData(callback) {
            Salary.aggregate(
                [
                    {
                        $group: {
                            _id: {month: "$month", year: "$year"},
                            calcSalary: {$sum: "$calc.salary"},
                            calcOnCash: {$sum: "$calc.onCash"},
                            calcOnCard: {$sum: "$calc.onCard"},
                            paidOnCash: {$sum: "$paid.onCash"},
                            paidOnCard: {$sum: "$paid.onCard"},
                            diffOnCash: {$sum: "$diff.onCash"},
                            diffOnCard: {$sum: "$diff.onCard"},
                            diffTotal: {$sum: "$diff.total"},
                            employeesArray: {$push: "$$ROOT"},
                        }
                    }
                ], callback
            );
        };

        function saveGroupedData(fetchedArray, callback) {
            mongoose.connections[4].db.collection('SalaryCash').drop();
            async.eachLimit(fetchedArray, 100, function (fetchedSalary, cb) {
                var objectToSave = {};
                var momentYear = moment().year(fetchedSalary._id.year).format('YY');
                var momentMonth = moment().month(fetchedSalary._id.month - 1).format('MMM');

                if (fetchedSalary) {
                    objectToSave = {
                        dataKey: momentMonth + "/" + momentYear,
                        month: fetchedSalary._id.month,
                        year: fetchedSalary._id.year,
                        calc: {
                            salary: fetchedSalary.calcSalary,
                            onCash: fetchedSalary.calcOnCash,
                            onCard: fetchedSalary.calcOnCard
                        },
                        paid: {
                            onCash: fetchedSalary.paidOnCash,
                            onCard: fetchedSalary.paidOnCard
                        },
                        diff: {
                            onCash: fetchedSalary.diffOnCash,
                            onCard: fetchedSalary.diffOnCard,
                            total: fetchedSalary.diffTotal
                        },
                        employeesArray: fetchedSalary.employeesArray
                    }

                    CashSalary.findOneAndUpdate({dataKey: objectToSave.dataKey}, objectToSave, {upsert: true}, cb);
                }
            }, function (err) {
                if (err) {
                    return callback(err);
                }

                callback(null, 'Completed');
            })
        };

        waterfallTasks = [getGroupedData, saveGroupedData];

        async.waterfall(waterfallTasks, function (err, result) {
            if (next) {
                if (err) {
                    return next(err);
                }

                res.status(200).send('Complete');
            } else if (typeof res == 'function') {
                res(null, 'Done!');
            }
        });
    }

    this.checkDataKey = function (req, res, next) {
        var Salary = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);
        var query;
        var body = req.query;

        query = Salary.find({'dataKey': body.dataKey})

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result.length});
        });
    };

    this.getFilterValues = function (req, res, next) {
        var Salary = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);

        Salary.aggregate([
            {
                $group: {
                    _id: null,
                    'Year': {
                        $addToSet: '$year'
                    },
                    'Month': {
                        $addToSet: '$month'
                    }
                }
            }
        ], function (err, salary) {
            if (err) {
                return next(err)
            }
            res.status(200).send(salary)
        })

    };

    function getSalaryData(req, res, next) {
        var SalaryCash = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);
        var query;
        var queryObj = {};

        var data = req.query;

        if (data) {
            if (data.month) {
                queryObj.month = Number(data.month);
            }
            if (data.year) {
                queryObj.year = Number(data.year);
            }
        }


        query = SalaryCash.aggregate([
            {
                $match: queryObj
            },
            {
                $unwind: '$employeesArray'
            },

            {
                $match: {
                    'employeesArray.employee._id': objectId(data._id)
                }
            }
        ]);

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);

        });

    };
};

module.exports = Salary;