var mongoose = require('mongoose');
var Project = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var ProjectSchema = mongoose.Schemas['Project'];
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var MonthHoursSchema = mongoose.Schemas['MonthHours'];
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var jobsSchema = mongoose.Schemas['jobs'];
    var _ = require('../node_modules/underscore');
    var moment = require('../public/js/libs/moment/moment');
    var async = require('async');
    var objectId = mongoose.Types.ObjectId;
    var CONSTANTS = require('../constants/mainConstants.js');

    this.getForWtrack = function (req, res, next) {
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var data = req.query;
        var inProgress = data && data.inProgress ? true : false;
        var filter = inProgress ? {"workflow": CONSTANTS.PROJECTINPROGRESS} : {}; //add fof Projects in wTrack

        Project
            .find(filter)
            .sort({projectName: 1})
            .lean()
            .populate('workflow', '_id name')
            .populate('customer', '_id name')
            .populate('projectmanager', '_id name')
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
        //var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        //var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        //var paralellTasks;
        //var count = 0;
        //
        //var query = Project.find({}, {_id: 1, bonus: 1}).lean();
        //
        //query.populate('bonus.employeeId', '_id name')
        //    .populate('bonus.bonusId', '_id name value isPercent');
        //
        //query.exec(function (err, result) {
        //    if (err) {
        //        return next(err);
        //    }
        //
        //    async.eachLimit(result, 200, function (project) {
        //        var pID = project._id;
        //
        //        paralellTasks = [getwTrackAndMonthHours];
        //
        //        function getwTrackAndMonthHours(cb) {
        //            var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        //            var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
        //
        //            var query = WTrack.find({'project._id': project._id}).lean();
        //            var months = [];
        //            var years = [];
        //            var uMonth;
        //            var uYear;
        //
        //            query.exec(function (err, result) {
        //                if (err) {
        //                    return cb(err);
        //                }
        //
        //                result.forEach(function (res) {
        //                    months.push(res.month);
        //                    years.push(res.year);
        //                });
        //
        //                uMonth = _.uniq(months);
        //                uYear = _.uniq(years);
        //
        //                monthHours.aggregate([{
        //                    $match: {
        //                        year : {$in: uYear},
        //                        month: {$in: uMonth}
        //                    }
        //                }, {
        //                    $project: {
        //                        date : {$add: [{$multiply: ["$year", 100]}, "$month"]},
        //                        hours: '$hours'
        //
        //                    }
        //                }, {
        //                    $group: {
        //                        _id  : '$date',
        //                        value: {$addToSet: '$hours'}
        //                    }
        //                }], function (err, months) {
        //                    if (err) {
        //                        return cb(err);
        //                    }
        //
        //                    cb(null, {wTrack: result, monthHours: months});
        //                });
        //
        //            });
        //        };
        //        async.parallel(paralellTasks, function (err, result) {
        //            var projectTeam = {};
        //            var bonus = [];
        //            var projectValues = {};
        //            var budgetTotal = {};
        //            var wTRack = result[0] ? result[0]['wTrack'] : [];
        //            var monthHours = result[0] ? result[0]['monthHours'] : [];
        //            var bonuses = project.bonus;
        //            var empKeys;
        //            var keys;
        //            var hoursByMonth = {};
        //            var employees = {};
        //            var keysForPT;
        //            var sortBudget = [];
        //            var budget = {};
        //
        //            budgetTotal.profitSum = 0;
        //            budgetTotal.costSum = 0;
        //            budgetTotal.rateSum = 0;
        //            budgetTotal.revenueSum = 0;
        //            budgetTotal.hoursSum = 0;
        //
        //            wTRack.forEach(function (wTrack) {
        //                var key;
        //                var employee = wTrack.employee;
        //
        //                if (!( employee._id in employees)) {
        //                    employees[employee._id] = employee.name;
        //                }
        //
        //                key = wTrack.year * 100 + wTrack.month;
        //
        //                if (hoursByMonth[key]) {
        //                    hoursByMonth[key] += parseFloat(wTrack.worked);
        //                } else {
        //                    hoursByMonth[key] = parseFloat(wTrack.worked);
        //                }
        //            });
        //
        //            empKeys = Object.keys(employees);
        //
        //            empKeys.forEach(function (empId) {
        //                wTRack.forEach(function (wTrack) {
        //                    var emp = (wTrack.employee._id).toString();
        //
        //                    if (empId === emp) {
        //                        if (projectTeam[empId]) {
        //                            projectTeam[empId].profit += parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
        //                            projectTeam[empId].cost += parseFloat((wTrack.cost / 100).toFixed(2));
        //                            projectTeam[empId].rate += parseFloat(wTrack.rate);
        //                            projectTeam[empId].hours += parseFloat(wTrack.worked);
        //                            projectTeam[empId].revenue += parseFloat((wTrack.revenue / 100).toFixed(2));
        //                        } else {
        //                            projectTeam[empId] = {};
        //                            projectTeam[empId].profit = parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
        //                            projectTeam[empId].cost = parseFloat((wTrack.cost / 100).toFixed(2));
        //                            projectTeam[empId].rate = parseFloat(wTrack.rate);
        //                            projectTeam[empId].hours = parseFloat(wTrack.worked);
        //                            projectTeam[empId].revenue = parseFloat((wTrack.revenue / 100).toFixed(2));
        //                        }
        //                    }
        //                });
        //            });
        //
        //            keys = Object.keys(projectTeam);
        //            if (keys.length > 0) {
        //
        //                keys.forEach(function (key) {
        //                    budgetTotal.profitSum += parseFloat(projectTeam[key].profit);
        //                    budgetTotal.costSum += parseFloat(projectTeam[key].cost);
        //                    budgetTotal.hoursSum += parseFloat(projectTeam[key].hours);
        //                    budgetTotal.revenueSum += parseFloat(projectTeam[key].revenue);
        //                });
        //                budgetTotal.rateSum = parseFloat(budgetTotal.revenueSum) / parseInt(budgetTotal.hoursSum);
        //
        //                projectValues.revenue = budgetTotal.revenueSum;
        //                projectValues.profit = budgetTotal.profitSum;
        //                projectValues.markUp = ((budgetTotal.profitSum / budgetTotal.costSum) * 100).toFixed();
        //                projectValues.radio = ((budgetTotal.revenueSum / budgetTotal.costSum) * 100).toFixed();
        //
        //                var empQuery = Employee.find({_id: {$in: keys}}, {
        //                    'name'            : 1,
        //                    'jobPosition.name': 1,
        //                    'department.name' : 1
        //                }).lean();
        //                empQuery.exec(function (err, response) {
        //
        //                    if (err) {
        //                        return next(err);
        //                    }
        //
        //                    bonuses.forEach(function (element) {
        //                        var objToSave = {};
        //
        //                        objToSave.bonus = 0;
        //                        objToSave.resource = element.employeeId.name.first + ' ' + element.employeeId.name.last;
        //                        objToSave.percentage = element.bonusId.name;
        //
        //                        if (element.bonusId.isPercent) {
        //                            objToSave.bonus = (budgetTotal.revenueSum / 100) * element.bonusId.value * 100;
        //                            bonus.push(objToSave);
        //                        } else {
        //                            monthHours.forEach(function (month) {
        //                                objToSave.bonus += (hoursByMonth[month._id] / month.value[0]) * element.bonusId.value;
        //                            });
        //
        //                            objToSave.bonus = objToSave.bonus * 100;
        //                            bonus.push(objToSave);
        //                        }
        //
        //                    });
        //
        //                    keysForPT = Object.keys(projectTeam);
        //
        //                    response.forEach(function (employee) {
        //                        keysForPT.forEach(function (id) {
        //                            if ((employee._id).toString() === id) {
        //                                sortBudget.push(projectTeam[id]);
        //                            }
        //                        })
        //                    });
        //
        //                    budget = {
        //                        // projectTeam: response,
        //                        bonus: bonus
        //                        // budget: sortBudget,
        //                        // projectValues: projectValues,
        //                        //budgetTotal: budgetTotal
        //                    };
        //
        //                    Project.update({_id: pID}, {$set: {budget: budget}}, function (err, result) {
        //                        if (err) {
        //                            return next(err);
        //                        }
        //
        //                        console.log(count++);
        //                    })
        //                });
        //            }
        //        });
        //
        //    });
        //    res.status(200).send('success');
        //});
        var projectId;
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var Job = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var count = 0;

        var query = Job.find({}).lean();

        query
            .populate('wTracks');

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            //async.each(result, function (project, callback) {
            Employee.populate(result, {
                'path'  : "wTracks.employee",
                'select': '_id, name',
                'lean'  : true
            }, function (err, result) {
                async.each(result, function (job, cb) {
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
                                maxDate = nextMaxDate;
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
                                return next(err);
                            }

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
                                budget     : sortBudget,
                                budgetTotal: budgetTotal
                            };

                            Job.update({_id: jobID}, {$set: {budget: budget}}, function (err, result) {
                                if (err) {
                                    return next(err);
                                }

                                console.log(count++);
                            })
                        });
                    } else {
                        budget = {
                            projectTeam: [],
                            budget     : [],
                            budgetTotal: budgetTotal
                        };

                        Job.update({_id: jobID}, {$set: {budget: budget}}, function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            console.log(count++);

                        })
                    }
                    cb();
                }, function () {
                    res.status(200).send('success');

                    //Job.aggregate([{
                    //    $match: {
                    //        'project': ObjectId(pId)
                    //    }
                    //},
                    //    {
                    //        $group: {
                    //            _id   : "$project",
                    //            jobIds: {$addToSet: '$_id'}
                    //        }
                    //    }
                    //], function (err, result) {
                    //    if (err) {
                    //        return console.log(err);
                    //    }
                    //
                    //    async.each(result, function (res, cb) {
                    //
                    //        projectId = res._id;
                    //        var jobIds = res.jobIds;
                    //
                    //        Project.findByIdAndUpdate(projectId, {$set: {"budget.projectTeam": jobIds}}, {new: true}, function (err, result) {
                    //            if (err) {
                    //                console.log(err);
                    //            }
                    //            cb();
                    //        });
                    //
                    //    }, function () {
                    //        callback();
                    //        if (projectId) {
                    //            //event.emit('fetchJobsCollection', {project: projectId});
                    //        }
                    //    })
                    //})
                });
            });

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
        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var data = {};
        var sort = req.query.sort;
        var key;
        var collection;

        if (sort) {
            key = Object.keys(sort)[0];
            sort[key] = parseInt(sort[key]);
        } else {
            sort = {'projectmanager.name.first': 1};
        }

        Project.aggregate([{
            $unwind: '$budget.projectTeam'
        }, {
            $lookup: {
                from        : "Employees",
                localField  : "projectmanager",
                foreignField: "_id", as: "projectmanager"
            }
        }, {
            $lookup: {
                from        : "jobs",
                localField  : "budget.projectTeam",
                foreignField: "_id", as: "budget.projectTeam"
            }
        }, {
            $project: {
                'budget.projectTeam': {$arrayElemAt: ["$budget.projectTeam", 0]},
                projectmanager      : {$arrayElemAt: ["$projectmanager", 0]},
                'budget.budgetTotal': 1,
                projectName         : 1
            }
        }, {
            $project: {
                projectmanager      : 1,
                projectName         : 1,
                'budget.projectTeam': 1,
                'budget.budgetTotal': 1
            }
        }, {
            $group: {
                _id           : '$_id',
                projectmanager: {
                    $addToSet: '$projectmanager'
                },
                projectTeam   : {
                    $push: '$budget.projectTeam'
                },
                budgetTotal   : {
                    $addToSet: '$budget.budgetTotal'
                },
                projectName   : {
                    $addToSet: '$projectName'
                }
            }
        }, {
            $project: {
                _id                 : 1,
                projectmanager      : {$arrayElemAt: ["$projectmanager", 0]},
                projectName         : {$arrayElemAt: ["$projectName", 0]},
                'budget.projectTeam': '$projectTeam',
                'budget.budgetTotal': '$budgetTotal'
            }
        }, {
            $sort: sort
        }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            collection = result;

            collection.forEach(function (project) {
                var totalInPr = 0;
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
                minDate = 1000000;
                maxDate = 0;
                //totalObj.rateSum = {
                //    byDev: 0,
                //    byQA : 0
                //};

                jobs.forEach(function (job) {
                    if (job.workflow.name === "In Progress") {
                        totalInPr += job.budget.budgetTotal ? job.budget.budgetTotal.costSum : 0;
                    } else if (job.workflow.name === "Finished") {
                        totalFinished += job.budget.budgetTotal.costSum;
                    }

                    if (job.budget.budgetTotal && job.budget.budgetTotal.minDate) {
                        if (job.budget.budgetTotal.minDate <= minDate) {
                            totalObj.minDate = job.budget.budgetTotal.minDate;
                            minDate = totalObj.minDate;
                        }
                    }

                    if (job.budget.budgetTotal && job.budget.budgetTotal.maxDate) {
                        if (job.budget.budgetTotal.maxDate >= maxDate) {
                            totalObj.maxDate = job.budget.budgetTotal.maxDate;
                            maxDate = totalObj.maxDate;
                        }
                    }

                    total += job.budget.budgetTotal ? job.budget.budgetTotal.costSum : 0;

                    totalObj.revenueSum += job.budget.budgetTotal ? job.budget.budgetTotal.revenueSum : 0;
                    totalObj.costSum += job.budget.budgetTotal ? job.budget.budgetTotal.costSum : 0;
                    totalObj.profitSum += job.budget.budgetTotal ? job.budget.budgetTotal.profitSum : 0;
                    totalObj.hoursSum += job.budget.budgetTotal ? job.budget.budgetTotal.hoursSum : 0;
                    //totalObj.rateSum.byDev += job.budget.budgetTotal ? job.budget.budgetTotal.rateSum.byDev : 0;
                    //totalObj.rateSum.byQA += job.budget.budgetTotal ? job.budget.budgetTotal.rateSum.byQA : 0;
                });

                totalObj.totalInPr = totalInPr;
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

                var parallelTasks = [getMinWTrack, getMaxWTrack];

                function getMinWTrack(cb) {
                    WTrack.find({
                        "project" : project._id,
                        dateByWeek: minDate
                    }).sort({worked: -1}).exec(function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        var wTrack = result ? result[0] : null;
                        var newDate;
                        if (wTrack) {
                            newDate = moment([wTrack.year, wTrack.month - 1]).isoWeek(wTrack.week);

                            for (var i = 1; i <= 7; i++) {
                                var day = wTrack[i];
                                if (day) {
                                    break;
                                }
                            }

                            newDate = newDate.day(i);
                            cb(null, newDate);
                        }
                    });
                }

                function getMaxWTrack(cb) {
                    WTrack.find({
                        "project" : project._id,
                        dateByWeek: maxDate
                    }).sort({worked: 1}).exec(function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        var wTrack = result ? result[0] : null;
                        var newDate;
                        if (wTrack) {
                            newDate = moment([wTrack.year, wTrack.month - 1]).isoWeek(wTrack.week);

                            if (wTrack['7']) {  //need refactor
                                newDate = newDate.day(7);
                                return cb(null, newDate);
                            } else if (wTrack['6']) {
                                newDate = newDate.day(6);
                                return cb(null, newDate);
                            } else if (wTrack['5']) {
                                newDate = newDate.day(5);
                                return cb(null, newDate);
                            } else if (wTrack['4']) {
                                newDate = newDate.day(4);
                                return cb(null, newDate);
                            } else if (wTrack['3']) {
                                newDate = newDate.day(3);
                                return cb(null, newDate);
                            } else if (wTrack['2']) {
                                newDate = newDate.day(2);
                                return cb(null, newDate);
                            } else if (wTrack['1']) {
                                newDate = newDate.day(1);
                                return cb(null, newDate);
                            }
                        }
                    });
                }

                async.parallel(parallelTasks, function (err, result) {
                    var startDate = result[0];
                    var endDate = result[1];

                    Project.findByIdAndUpdate(project._id, {
                        $set: {
                            StartDate: startDate,
                            EndDate  : endDate
                        }
                    }, {new: true}, function (err, result) {

                    });
                });
            });

            if (collection[0].total.hasOwnProperty(key)){

                collection.sort(function(a , b){

                    var fieldA = a.total[key] || 0;
                    var fieldB = b.total[key] || 0;

                    if (sort[key] === 1) {
                        if (fieldA > fieldB) {
                            return 1;
                        }
                        if (fieldA < fieldB) {
                            return -1;
                        }
                        return 0;
                    } else {
                        if (fieldA < fieldB) {
                            return 1;
                        }
                        if (fieldA > fieldB) {
                            return -1;
                        }
                        return 0;
                    }
                });
            }


            data['data'] = collection;

            res.status(200).send(data);
        })
    };
};

module.exports = Project;