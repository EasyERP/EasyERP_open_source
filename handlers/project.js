var mongoose = require('mongoose');
var Project = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var ProjectSchema = mongoose.Schemas['Project'];
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var MonthHoursSchema = mongoose.Schemas['MonthHours'];
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var _ = require('../node_modules/underscore');
    var async = require('async');
    var objectId = mongoose.Types.ObjectId;

    this.getForWtrack = function (req, res, next) {
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        Project
            .find()
            //.populate('customer._id', '_id name')
            //.populate('projectmanager._id', '_id name')
            //.populate('workflow._id', '_id name')
            .sort({projectName: 1})
            .lean()
            .exec(function (err, projects) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: projects})
            });
    };

    this.getForQuotation = function (req, res, next) {
        var pId = req.query.projectId;
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        Project.findOne({_id: objectId(pId)}, function (err, project) {
            if (err) {
                return next(err);
            }

            res.status(200).send(project);
        });
    };

    this.getFilterValues = function (req, res, next) {
        var project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        project.aggregate([
            {
                $group: {
                    _id      : null,
                    project  : {
                        $addToSet: '$projectName'
                    },
                    startDate: {
                        $addToSet: '$StartDate'
                    },
                    endDate  : {
                        $addToSet: '$EndDate'
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            _.map(result[0], function (value, key) {
                switch (key) {
                    case 'project':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num
                        });
                        break;

                }
            });

            res.status(200).send(result);
        });
    };

    this.updateAllProjects = function (req, res, next) {
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var paralellTasks;
        var count = 0;

        var query = Project.find({}, {_id: 1, bonus: 1}).lean();

        query.populate('bonus.employeeId', '_id name')
            .populate('bonus.bonusId', '_id name value isPercent');

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            async.eachLimit(result, 200, function (project) {
                var pID = project._id;

                paralellTasks = [getwTrackAndMonthHours];

                function getwTrackAndMonthHours(cb) {
                    var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
                    var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);

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
                                year : {$in: uYear},
                                month: {$in: uMonth}
                            }
                        }, {
                            $project: {
                                date : {$add: [{$multiply: ["$year", 100]}, "$month"]},
                                hours: '$hours'

                            }
                        }, {
                            $group: {
                                _id  : '$date',
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

                    budgetTotal.profitSum = 0;
                    budgetTotal.costSum = 0;
                    budgetTotal.rateSum = 0;
                    budgetTotal.revenueSum = 0;
                    budgetTotal.hoursSum = 0;

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

                            if (empId === emp) {
                                if (projectTeam[empId]) {
                                    projectTeam[empId].profit += parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                                    projectTeam[empId].cost += parseFloat((wTrack.cost / 100).toFixed(2));
                                    projectTeam[empId].rate += parseFloat(wTrack.rate);
                                    projectTeam[empId].hours += parseFloat(wTrack.worked);
                                    projectTeam[empId].revenue += parseFloat((wTrack.revenue / 100).toFixed(2));
                                } else {
                                    projectTeam[empId] = {};
                                    projectTeam[empId].profit = parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                                    projectTeam[empId].cost = parseFloat((wTrack.cost / 100).toFixed(2));
                                    projectTeam[empId].rate = parseFloat(wTrack.rate);
                                    projectTeam[empId].hours = parseFloat(wTrack.worked);
                                    projectTeam[empId].revenue = parseFloat((wTrack.revenue / 100).toFixed(2));
                                }
                            }
                        });
                    });

                    keys = Object.keys(projectTeam);
                    if (keys.length > 0) {

                        keys.forEach(function (key) {
                            budgetTotal.profitSum += parseFloat(projectTeam[key].profit);
                            budgetTotal.costSum += parseFloat(projectTeam[key].cost);
                            budgetTotal.hoursSum += parseFloat(projectTeam[key].hours);
                            budgetTotal.revenueSum += parseFloat(projectTeam[key].revenue);
                        });
                        budgetTotal.rateSum = parseFloat(budgetTotal.revenueSum) / parseInt(budgetTotal.hoursSum);

                        projectValues.revenue = budgetTotal.revenueSum;
                        projectValues.profit = budgetTotal.profitSum;
                        projectValues.markUp = ((budgetTotal.profitSum / budgetTotal.costSum) * 100).toFixed();
                        projectValues.radio = ((budgetTotal.revenueSum / budgetTotal.costSum) * 100).toFixed();

                        var empQuery = Employee.find({_id: {$in: keys}}, {
                            'name'            : 1,
                            'jobPosition.name': 1,
                            'department.name' : 1
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
                                // projectTeam: response,
                                bonus: bonus,
                                // budget: sortBudget,
                                // projectValues: projectValues,
                                //budgetTotal: budgetTotal
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
            res.status(200).send('success');
        });

    };

    this.getForDashboard = function (req, res, next) {
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        Project
            .find()
            .sort({projectName: 1})
            .lean()
            .exec(function (err, projects) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(projects)
            });
    };

    this.getProjectPMForDashboard = function (req, res, next) {
        var Project = models.get(req.session.lastDb, "Project", ProjectSchema);
        var data = {};
        var sort = req.query.sort ? req.query.sort : {projectName: 1};
        var collection;

        var query = Project.find({}).sort(sort).lean();

        query.populate('budget.projectTeam');

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            collection = result;

            collection.forEach(function (project) {
                var totalInPr = 0;
                // var totalNew = 0;
                var totalFinished = 0;
                var total = 0;
                var totalObj = {};
                var jobs = (project.budget && project.budget.projectTeam) ? project.budget.projectTeam : [];
                var minDate;
                var maxDate;

                project.total = {};

                totalObj.totalInPr = 0;
                totalObj.totalNew = 0;
                totalObj.totalFinished = 0;
                totalObj.total = 0;
                totalObj.revenueSum = 0;
                totalObj.costSum = 0;
                totalObj.profitSum = 0;
                totalObj.hoursSum = 0;
                totalObj.markUp = 0;
                totalObj.radio = 0;
                totalObj.minDate = 0;
                totalObj.maxDate = 0;
                totalObj.rateSum = {
                    byDev: 0,
                    byQA : 0
                };

                jobs.forEach(function (job) {
                    if (job.workflow.name === "In Progress") {
                        totalInPr += job.budget.budgetTotal ? job.budget.budgetTotal.costSum : 0;
                        //} else if (job.workflow.name === "New"){
                        //    totalNew += job.budget.budgetTotal ? job.budget.budgetTotal.costSum : 0;
                    } else if (job.workflow.name === "Finished") {
                        totalFinished += job.budget.budgetTotal.costSum;
                    }

                    total += job.budget.budgetTotal ? job.budget.budgetTotal.costSum : 0;

                    minDate = totalObj.minDate;
                    maxDate = totalObj.maxDate;

                    totalObj.revenueSum += job.budget.budgetTotal ? job.budget.budgetTotal.revenueSum : 0;
                    totalObj.costSum += job.budget.budgetTotal ? job.budget.budgetTotal.costSum : 0;
                    totalObj.profitSum += job.budget.budgetTotal ? job.budget.budgetTotal.profitSum : 0;
                    totalObj.hoursSum += job.budget.budgetTotal ? job.budget.budgetTotal.hoursSum : 0;
                    totalObj.minDate = (job.budget.budgetTotal ? job.budget.budgetTotal.minDate : minDate <= minDate) ? minDate : minDate;
                    totalObj.maxDate = (job.budget.budgetTotal ? job.budget.budgetTotal.minDate : maxDate >= maxDate) ? maxDate : maxDate;
                    totalObj.rateSum.byDev += job.budget.budgetTotal ? job.budget.budgetTotal.rateSum.byDev : 0;
                    totalObj.rateSum.byQA += job.budget.budgetTotal ? job.budget.budgetTotal.rateSum.byQA : 0;
                });

                totalObj.totalInPr = totalInPr;
                // totalObj.totalNew = totalNew;
                totalObj.totalFinished = totalFinished;
                totalObj.total = total;

                totalObj.markUp = ((totalObj.profitSum / totalObj.costSum) * 100);

                if (!isFinite(totalObj.markUp)) {
                    totalObj.markUp = 0;
                }

                totalObj.radio = ((totalObj.profitSum / totalObj.revenueSum) * 100);

                if (!isFinite(totalObj.radio)) {
                    totalObj.radio = 0;
                }

                project.total = totalObj;
            });

            data['data'] = collection;

            res.status(200).send(data);
        })
    };
};

module.exports = Project;