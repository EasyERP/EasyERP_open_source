/**
 * Created by liliya on 29.09.15.
 */
var mongoose = require('mongoose');
require('../models/index.js');
var ProjectSchema = mongoose.Schemas['Project'];
var wTrackSchema = mongoose.Schemas['wTrack'];
var MonthHoursSchema = mongoose.Schemas['MonthHours'];
var EmployeeSchema = mongoose.Schemas['Employee'];
var _ = require('../node_modules/underscore');
var async = require('async');

var dbObject = mongoose.createConnection('localhost', 'weTrack');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");

    var Project = dbObject.model('Project', ProjectSchema);
    var Employee = dbObject.model('Employees', EmployeeSchema);
    var paralellTasks;
    var count = 0;

    var query = Project.find({}, {_id: 1, bonus: 1}).lean();

    query
        .populate('bonus.employeeId', '_id name')
        .populate('bonus.bonusId', '_id name value isPercent');

    query.exec(function (err, result) {
        if (err) {
            return next(err);
        }

        async.eachLimit(result, 200, function (project) {
            var pID = project._id;

            paralellTasks = [getwTrackAndMonthHours];

            function getwTrackAndMonthHours(cb) {
                var WTrack = dbObject.model('wTrack', wTrackSchema);
                var monthHours = dbObject.model('MonthHours', MonthHoursSchema);

                var query = WTrack.find({'project._id': project._id}).lean();
                var months = [];
                var years = [];
                var uMonth;
                var uYear;

                query.exec(function (err, result) {
                    if (err) {
                        return cb(err);
                    }

                    result.forEach(function (res) {
                        months.push(res.month);
                        years.push(res.year);
                    });

                    uMonth = _.uniq(months);
                    uYear = _.uniq(years);

                    monthHours.aggregate([{
                        $match: {
                            year: {$in: uYear},
                            month: {$in: uMonth}
                        }
                    }, {
                        $project: {
                            date: {$add: [{$multiply: ["$year", 100]}, "$month"]},
                            hours: '$hours'

                        }
                    }, {
                        $group: {
                            _id: '$date',
                            value: {$addToSet: '$hours'}
                        }
                    }], function (err, months) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, {wTrack: result, monthHours: months});
                    });


                });
            };

            async.parallel(paralellTasks, function (err, result) {
                var projectTeam = {};
                var bonus = [];
                var projectValues = {};
                var budgetTotal = {};
                var wTRack = result[0] ? result[0]['wTrack'] : [];
                var monthHours = result[0] ? result[0]['monthHours'] : [];
                var bonuses = project.bonus;
                var empKeys;
                var keys;
                var hoursByMonth = {};
                var employees = {};
                var keysForPT;
                var sortBudget = [];
                var budget = {};
                var minDate = 1/0;
                var maxDate = 0;
                var nextDate;
                var nextMaxDate;

                budgetTotal.profitSum = 0;
                budgetTotal.costSum = 0;
                budgetTotal.rateSum = 0;
                budgetTotal.revenueSum = 0;
                budgetTotal.hoursSum = 0;
                budgetTotal.revenueByQA = 0;
                budgetTotal.hoursByQA = 0;

                wTRack.forEach(function (wTrack) {
                    var key;
                    var employee = wTrack.employee;

                    if (!( employee._id in employees)) {
                        employees[employee._id] = employee.name;
                    }

                    key = wTrack.year * 100 + wTrack.month;

                    if (hoursByMonth[key]) {
                        hoursByMonth[key] += parseFloat(wTrack.worked);
                    } else {
                        hoursByMonth[key] = parseFloat(wTrack.worked);
                    }
                });

                empKeys = Object.keys(employees);

                empKeys.forEach(function (empId) {
                    wTRack.forEach(function (wTrack) {
                        var emp = (wTrack.employee._id).toString();

                        nextDate = wTrack.dateByWeek;
                        nextMaxDate = wTrack.dateByWeek;

                        if (nextDate <= minDate){
                            minDate = nextDate;
                        }

                        if (nextMaxDate > maxDate){
                            maxDate = nextMaxDate;
                        }

                        if (empId === emp) {
                            if (projectTeam[empId]) {
                                if (wTrack.department._id.toString() === '55b92ace21e4b7c40f000011'){
                                    projectTeam[empId].byQA.revenue += parseFloat(wTrack.revenue);
                                    projectTeam[empId].byQA.hours += parseFloat(wTrack.worked);
                                }
                                projectTeam[empId].profit += parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                                projectTeam[empId].cost += parseFloat((wTrack.cost / 100).toFixed(2));
                                projectTeam[empId].rate += parseFloat(wTrack.rate);
                                projectTeam[empId].hours += parseFloat(wTrack.worked);
                                projectTeam[empId].revenue += parseFloat((wTrack.revenue / 100).toFixed(2));
                            } else {
                                projectTeam[empId] = {};

                                if (wTrack.department._id.toString() === '55b92ace21e4b7c40f000011'){
                                    projectTeam[empId].byQA = {};
                                    projectTeam[empId].byQA.revenue = parseFloat(wTrack.revenue);
                                    projectTeam[empId].byQA.hours = parseFloat(wTrack.worked);
                                }

                                projectTeam[empId].profit = parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                                projectTeam[empId].cost = parseFloat((wTrack.cost / 100).toFixed(2));
                                projectTeam[empId].rate = parseFloat(wTrack.rate);
                                projectTeam[empId].hours = parseFloat(wTrack.worked);
                                projectTeam[empId].revenue = parseFloat((wTrack.revenue / 100).toFixed(2));
                            }
                        }
                    });

                    budgetTotal.maxDate = maxDate;
                    budgetTotal.minDate = minDate;
                });


                keys = Object.keys(projectTeam);
                if (keys.length > 0) {

                    keys.forEach(function (key) {
                        budgetTotal.profitSum += parseFloat(projectTeam[key].profit);
                        budgetTotal.costSum += parseFloat(projectTeam[key].cost);
                        budgetTotal.hoursSum += parseFloat(projectTeam[key].hours);
                        budgetTotal.revenueSum += parseFloat(projectTeam[key].revenue);
                        budgetTotal.revenueByQA += parseFloat(projectTeam[key].byQA ? projectTeam[key].byQA.revenue / 100 : 0);
                        budgetTotal.hoursByQA += parseFloat(projectTeam[key].byQA ? projectTeam[key].byQA.hours : 0);
                    });
                    budgetTotal.rateSum = {};
                    var value = budgetTotal.revenueByQA / budgetTotal.hoursByQA;
                    budgetTotal.rateSum.byQA = value? value : 0;
                    budgetTotal.rateSum.byDev = (parseFloat(budgetTotal.revenueSum) / parseInt(budgetTotal.hoursSum)) - budgetTotal.rateSum.byQA;

                    projectValues.revenue = budgetTotal.revenueSum;
                    projectValues.profit = budgetTotal.profitSum;
                    projectValues.markUp = ((budgetTotal.profitSum / budgetTotal.costSum) * 100);
                   if (!isFinite(projectValues.markUp)){
                       projectValues.markUp = 0;
                   }
                    projectValues.radio = ((budgetTotal.revenueSum / budgetTotal.costSum) * 100);
                    if (!isFinite(projectValues.radio)){
                        projectValues.radio = 0;
                    }

                    var empQuery = Employee.find({_id: {$in: keys}}, {
                        'name': 1,
                        'jobPosition.name': 1,
                        'department.name': 1
                    }).lean();
                    empQuery.exec(function (err, response) {

                        if (err) {
                            return next(err);
                        }

                        bonuses.forEach(function (element) {
                            var objToSave = {};

                            objToSave.bonus = 0;
                            objToSave.resource = element.employeeId.name.first + ' ' + element.employeeId.name.last;
                            objToSave.percentage = element.bonusId.name;

                            if (element.bonusId.isPercent) {
                                objToSave.bonus = (budgetTotal.revenueSum / 100) * element.bonusId.value * 100;
                                bonus.push(objToSave);
                            } else {
                                monthHours.forEach(function (month) {
                                    objToSave.bonus += (hoursByMonth[month._id] / month.value[0]) * element.bonusId.value;
                                });

                                objToSave.bonus = objToSave.bonus * 100;
                                bonus.push(objToSave);
                            }

                        });

                        keysForPT = Object.keys(projectTeam);

                        response.forEach(function (employee) {
                            keysForPT.forEach(function (id) {
                                if ((employee._id).toString() === id) {
                                    sortBudget.push(projectTeam[id]);
                                }
                            })
                        });

                        budget = {
                            projectTeam: response,
                            bonus: bonus,
                            budget: sortBudget,
                            projectValues: projectValues,
                            budgetTotal: budgetTotal
                        };


                        Project.update({_id: pID}, {$set: {budget: budget}}, function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            console.log(count++);
                        })
                    });
                }
            });

        });
        console.log('success');
    });
});
