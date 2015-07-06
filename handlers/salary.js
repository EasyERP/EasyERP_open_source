/**
 * Created by soundstorm on 15.06.15.
 */
var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var Salary = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var SalarySchema = mongoose.Schemas['Salary'];
    var SalaryCashSchema = mongoose.Schemas['SalaryCash'];
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var self = this;

    this.remove = function (req, res, next) {
        var self = this;
        var id = req.params.id;
        var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);

        Salary.remove({_id: id}, function (err, salary) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: salary});
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
                    var count = query.count ? query.count : 50;
                    var page = req.query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    //var departmentSearcher;
                    //var contentIdsSearcher;
                    //var contentSearcher;
                    //var waterfallTasks;

                    if (query && query.sort) {
                        sort = query.sort;
                    } else {
                        sort = {"year": -1, "month": -1};
                    }

                    /*departmentSearcher = function (waterfallCallback) {
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
                     };*/

                    /*contentIdsSearcher = function (deps, waterfallCallback) {
                     var arrOfObjectId = deps.objectID();

                     models.get(req.session.lastDb, "Product", ProductSchema).aggregate(
                     {
                     $match: {
                     $and: [
                     queryObject,
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
                     waterfallCallback
                     );
                     };*/

                    /*contentSearcher = function (productsIds, waterfallCallback) {
                     queryObject._id = {$in: productsIds};

                     var query = Product.find(queryObject).limit(count).skip(skip).sort(sort);
                     query.exec(waterfallCallback);
                     };

                     waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                     async.waterfall(waterfallTasks, function(err, result){
                     if(err){
                     return next(err);
                     }
                     res.status(200).send({success: result});
                     });*/
                    self.totalCollectionLength(req, function (err, ressult) {
                        if (ressult) {
                            var query = Salary.find(queryObject).limit(count).skip(skip).sort(sort);
                            query.exec(function (err, result) {
                                if (err) {
                                    return next(err);
                                }
                                res.status(200).send({success: result});
                            });
                        } else {
                            async.series({
                                    first: function (callback) {
                                        self.recalculateCashSalary(req, callback);
                                    },
                                    second: function (callback) {
                                        var query = Salary.find(queryObject).limit(count).skip(skip).sort(sort);
                                        query.exec(function (err, result) {
                                            if (err) {
                                                callback(err);
                                            }
                                            callback(null, result);
                                        });
                                    }
                                },
                                function (err, results) {
                                    if (err) {
                                        return next(err);
                                    }
                                    if (results.second) {
                                        res.status(200).send({success: results.second});
                                    }
                                });
                        }
                    })
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

        switch (viewType) {
            case "list":
                getSalaryFilter(req, res, next);
                break;
            /*case "form":
             getProductsById(req, res, next);
             break;*/
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
                            employeesArray: {$push: "$$ROOT"}
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

    this.getSalaryData = function (req, res, next) {
        var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);
        var SalaryCash = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);
        var query;
        var queryObj = {};

        var data = req.query;

        if (data) {
            if (data.month) {
                queryObj.month = data.month;
            }
            if (data.year) {
                queryObj.year = data.year;
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
                    '$employee._id': data._id
                }
            }
        ]);

        query.exac(function(err, result){
            if (err){
                return next(err);
            }

            res.status(200).send(result);
        });

    };
};


module.exports = Salary;