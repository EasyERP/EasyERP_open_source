/**
 * Created by soundstorm on 15.06.15.
 */
var mongoose = require('mongoose');
var Salary = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var SalarySchema = mongoose.Schemas['Salary'];
    var SalaryCashSchema = mongoose.Schemas['SalaryCash'];
    var async = require('async');

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
                    var query = Salary.find(queryObject).limit(count).skip(skip).sort(sort);
                    query.exec(function(err, result){
                        if(err){
                            return next(err);
                        }
                        res.status(200).send({success: result});
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

        switch (viewType) {
            case "list":
                getSalaryFilter(req, res, next);
                break;
            /*case "form":
                getProductsById(req, res, next);
                break;*/
        }
    };

    this.totalCollectionLength = function (req, res, next) {
        var Salary = models.get(req.session.lastDb, 'SalaryCash', SalaryCashSchema);
        var query;

        query = Salary.find();
        query.exec(function(err, result){
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result.length});
        });
    };

    this.recalculateCashSalary = function(req, res, next) {

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
                            employeesArray: {$push: "$$ROOT"}
                        }
                    }
                ], callback
            );
        };

        function saveGroupedData(fetchedArray, callback) {

            async.eachLimit(fetchedArray, 100, function (fetchedSalary, cb) {
                var objectToSave = {};

                if (fetchedSalary) {
                    objectToSave = {
                        dataKey: fetchedSalary._id.month + "_" + fetchedSalary._id.year,
                        month: fetchedSalary._id.month,
                        year: fetchedSalary._id.year,
                        calc: {
                            salary: fetchedSalary.calcSalary,
                            onCash: fetchedSalary.calcOnCash,
                            onCard: fetchedSalary.calcOnCard
                        },
                        paid: {
                            onCash: fetchedSalary.diffOnCash,
                            onCard: fetchedSalary.diffOnCard
                        },
                        diff: {
                            onCash: fetchedSalary.calcOnCash,
                            onCard: fetchedSalary.calcOnCard
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
            if (err) {
                next(err);
            }

            res.status(200).send('Complete');
        });
    }
};

module.exports = Salary;