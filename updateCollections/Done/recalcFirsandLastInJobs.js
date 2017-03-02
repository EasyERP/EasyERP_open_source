/**
 * Created by liliy on 12.02.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');
var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var projectSchema = mongoose.Schemas['Project'];
var employeeSchema = mongoose.Schemas['Employee'];
var jobsSchema = mongoose.Schemas['jobs'];
var projectId;
var Project = dbObject.model("Project", projectSchema);
var Employee = dbObject.model("Employees", employeeSchema);
var Job = dbObject.model("jobs", jobsSchema);
var ObjectId = mongoose.Types.ObjectId;
var moment = require('../../public/js/libs/moment/moment');
var count = 0;

var query = Job.find({/*'project': pId*/}).lean();

query
    .populate('wTracks');

query.exec(function (err, result) {
    if (err) {
        return console.log(err);
    }

    Employee.populate(result, {
        'path'  : "wTracks.employee",
        'select': '_id, name',
        'lean'  : true
    }, function (err, result) {
        async.forEach(result, function (job, cb) {
            var jobID = job._id;
            var projectTeam = {};
            var projectValues = {};
            var budgetTotal = {};
            var wTRack = job.wTracks;
            var empKeys;
            var keys;
            var hoursByMonth = {};
            var employees = {};
            var keysForPT;
            var sortBudget = [];
            var budget = {};
            var minDate = 1 / 0;
            var maxDate = 0;
            var nextDate;
            var nextMaxDate;

            budgetTotal.profitSum = 0;
            budgetTotal.costSum = 0;
            //budgetTotal.rateSum = 0;
            budgetTotal.revenueSum = 0;
            budgetTotal.hoursSum = 0;
            budgetTotal.revenueByQA = 0;
            budgetTotal.hoursByQA = 0;

            wTRack.forEach(function (wTrack) {
                var key;
                var employee = wTrack.employee;

                if (!( employee._id in employees)) {
                    employees[employee._id] = employee.name.first + ' ' + employee.name.last;
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

                    if (nextDate <= minDate) {
                        minDate = nextDate;
                    }

                    if (nextMaxDate > maxDate) {
                        if (wTrack.month === 1 && wTrack.week >= moment().year(wTrack.year - 1).isoWeeksInYear()){
                        } else {
                            maxDate = nextMaxDate;
                        }
                    }

                    if (empId === emp) {
                        if (projectTeam[empId]) {
                            if (wTrack.department.toString() === '55b92ace21e4b7c40f000011') {
                                projectTeam[empId].byQA.revenue += parseFloat(wTrack.revenue);
                                projectTeam[empId].byQA.hours += parseFloat(wTrack.worked);
                            }
                            projectTeam[empId].profit += parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                            projectTeam[empId].cost += parseFloat((wTrack.cost / 100).toFixed(2));
                            // projectTeam[empId].rate += parseFloat(wTrack.rate);
                            projectTeam[empId].hours += parseFloat(wTrack.worked);
                            projectTeam[empId].revenue += parseFloat((wTrack.revenue / 100).toFixed(2));
                        } else {
                            projectTeam[empId] = {};

                            if (wTrack.department.toString() === '55b92ace21e4b7c40f000011') {
                                projectTeam[empId].byQA = {};
                                projectTeam[empId].byQA.revenue = parseFloat(wTrack.revenue) / 100;
                                projectTeam[empId].byQA.hours = parseFloat(wTrack.worked);
                            }

                            projectTeam[empId].profit = parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                            projectTeam[empId].cost = parseFloat((wTrack.cost / 100).toFixed(2));
                            //projectTeam[empId].rate = parseFloat(wTrack.rate);
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
                //budgetTotal.rateSum = {};
                //var value = budgetTotal.revenueByQA / budgetTotal.hoursByQA;
                //var valueForDev = ((parseFloat(budgetTotal.revenueSum) - budgetTotal.revenueByQA)) / (budgetTotal.hoursSum - budgetTotal.hoursByQA);
                //budgetTotal.rateSum.byQA = isFinite(value) ? value : 0;
                //budgetTotal.rateSum.byDev = isFinite(valueForDev) ? valueForDev : 0;

                projectValues.revenue = budgetTotal.revenueSum;
                projectValues.profit = budgetTotal.profitSum;
                projectValues.markUp = ((budgetTotal.profitSum / budgetTotal.costSum) * 100);
                if (!isFinite(projectValues.markUp)) {
                    projectValues.markUp = 0;
                }
                projectValues.radio = ((budgetTotal.profitSum / budgetTotal.revenueSum) * 100);
                if (!isFinite(projectValues.radio)) {
                    projectValues.radio = 0;
                }

                var empQuery = Employee
                    .find({_id: {$in: keys}}, {
                        'name'       : 1,
                        'jobPosition': 1,
                        'department' : 1
                    })
                    .populate('department', '_id departmentName')
                    .populate('jobPosition', '_id name')
                    .lean();
                empQuery.exec(function (err, response) {

                    if (err) {
                        return console.log(err);
                    }

                    keysForPT = Object.keys(projectTeam);

                    response.forEach(function (employee) {
                        keysForPT.forEach(function (id) {
                            if ((employee._id).toString() === id) {
                                sortBudget.push(projectTeam[id]);
                            }
                        });
                    });

                    budget = {
                        projectTeam: response,
                        budget     : sortBudget,
                        budgetTotal: budgetTotal
                    };

                    Job.update({_id: jobID}, {$set: {budget: budget}}, function (err, result) {
                        if (err) {
                            return console.log(err);
                        }

                        console.log(count++);
                    });
                });
            } else {
                budget = {
                    projectTeam: [],
                    budget     : [],
                    budgetTotal: budgetTotal
                };

                Job.update({_id: jobID}, {$set: {budget: budget}}, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log(count++);
                });
            }
            cb();
        }, function () {
            Job.aggregate([
                {
                    $group: {
                        _id   : "$project",
                        jobIds: {$addToSet: '$_id'}
                    }
                }
            ], function (err, result) {
                if (err) {
                    return console.log(err);
                }

                async.each(result, function (res, cb) {

                    projectId = res._id;
                    var jobIds = res.jobIds;

                    Project.update({_id: projectId}, {$set: {"budget.projectTeam": jobIds}}, {new: true}, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        cb();
                    });

                }, function () {
                });
            });
        });
    });

});
