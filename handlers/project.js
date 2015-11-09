var mongoose = require('mongoose');
var Project = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var ProjectSchema = mongoose.Schemas['Project'];
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var MonthHoursSchema = mongoose.Schemas['MonthHours'];
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var _ = require('../node_modules/underscore');
    var async = require('async');

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

    this.getFilterValues = function (req, res, next) {
        var project = models.get(req.session.lastDb, 'Project', ProjectSchema);

        project.aggregate([
            {
                $group: {
                    _id: null,
                    project: {
                        $addToSet: '$projectName'
                    },
                    startDate: {
                        $addToSet: '$StartDate'
                    },
                    endDate: {
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

        var query = Project.find({}, {'projectName': 1, 'projectmanager': 1, '_id': 1, 'workflow': 1, 'budget': 1}).sort(sort);

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            data['data'] = result;
            res.status(200).send(data);
        })
    };
};

module.exports = Project;