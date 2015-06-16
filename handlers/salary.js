/**
 * Created by soundstorm on 15.06.15.
 */
var mongoose = require('mongoose');
var Salary = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var SalarySchema = mongoose.Schemas['Salary'];
    var SalaryCashSchema = mongoose.Schemas['Salary'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    //var mapObject = require('../helpers/bodyMaper');

    function groupForSalaryCash (req, res, next) {
        var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);
        models.get(req.session.lastDb, "Salary", SalarySchema).aggregate(
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
                        diffOnCard: {$sum: "$diff.onCard"}
                    }
                }
            ], function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(result)
            }
        );
    };
};

module.exports = Salary;