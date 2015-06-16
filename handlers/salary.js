/**
 * Created by soundstorm on 15.06.15.
 */
var mongoose = require('mongoose');
var Salary = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var SalarySchema = mongoose.Schemas['Salary'];
    var SalaryCashSchema = mongoose.Schemas['SalaryCash'];
    var async = require('async');

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
                var model;
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