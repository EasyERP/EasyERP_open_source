/**
 * Created by liliy on 10.03.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var async = require('async');
var moment = require('../../public/js/libs/moment/moment');
var events = require('events');
var event = new events.EventEmitter();


var QuotationSchema = mongoose.Schemas['Quotation'];
var ProjectSchema = mongoose.Schemas.Project;
var employeeSchema = mongoose.Schemas.Employee;
var wTrackSchema = mongoose.Schemas.wTrack;
var jobsSchema = mongoose.Schemas.jobs;
var MonthHoursSchema = mongoose.Schemas['MonthHours'];
var ObjectId = mongoose.Types.ObjectId;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

// var dbObject = mongoose.createConnection('144.76.56.111:28017/lilyadb', connectOptions);

var dbObject = mongoose.createConnection('localhost', 'new_production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var quotationModel = dbObject.model("Quotation", QuotationSchema);
    var ProjectModel = dbObject.model('Project', ProjectSchema);
    var EmployeeModel = dbObject.model('Employees', employeeSchema);
    var wTrackModel = dbObject.model('wTrack', wTrackSchema);
    var JobModel = dbObject.model('jobs', jobsSchema);
    var monthHours = dbObject.model('MonthHours', MonthHoursSchema);


    quotationModel.aggregate([
        {$match: {"currency.rate": {$exists: true}}},
        {$match: {"currency.rate": {$ne: 1}}}
    ], function (err, result) {

        async.each(result, function (quotation, cb) {

            var totalAmount = 0;

            if (!quotation || !wTrackModel) {
                return false;
            }

            async.each(quotation.products, wTrackUpdater, function (err) {
                if (err) {
                    logger.error(err);
                }
            });

            function wTrackUpdater(product, cb) {
                var waterfallTasks = [totalWorkedCalculator, wTrackUpdatertotalWorked];

                function totalWorkedCalculator(waterfallCb) {
                    wTrackModel.aggregate([{
                        $match: {
                            jobs: product.jobs
                        }
                    }, {
                        $group: {
                            _id        : null,
                            totalWorked: {$sum: '$worked'},
                            ids        : {$addToSet: '$_id'}
                        }
                    }], function (err, wetracks) {
                        var totalWorked;
                        var ids = [];

                        if (err) {
                            return waterfallCb(err);
                        }

                        if (wetracks[0]) {
                            totalWorked = wetracks[0].totalWorked;
                            ids = wetracks[0].ids;
                        } else {
                            totalWorked = 0;
                        }

                        waterfallCb(null, totalWorked, ids);
                    });
                };

                function wTrackUpdatertotalWorked(totalWorked, ids, waterfallCb) {
                    wTrackModel.find({
                        _id: {$in: ids}
                    }, function (err, wTracks) {
                        if (err) {
                            return waterfallCb(err);
                        }

                        if (quotation.currency && quotation.currency.rate) {
                            totalAmount = product.unitPrice / quotation.currency.rate;
                        } else {
                            totalAmount = product.unitPrice;
                        }

                        async.each(wTracks, function (wTrack, cb) {
                            var revenue = (wTrack.worked / totalWorked) * totalAmount * 100;

                            wTrackModel.findByIdAndUpdate(wTrack._id, {$set: {revenue: revenue}}, {new: true}, function (err, updated) {
                                if (err) {
                                    return cb(err);
                                }
                                if (updated && updated.project && updated.jobs) {
                                    event.emit('updateProjectDetails', {
                                        _id  : updated.project,
                                        jobId: updated.jobs
                                    });
                                }
                                cb();
                            });
                        }, function (err) {
                            if (err) {
                                return waterfallCb(err);
                            }

                            waterfallCb();
                        });
                    });
                };

                function waterfallMasterCb(err, response) {
                    if (err) {
                        return cb(err);
                    }
                    cb();
                };

                async.waterfall(waterfallTasks, waterfallMasterCb);

            }


            cb();

        }, function () {
            console.log('good');
        });
    });

    event.on('updateProjectDetails', function (options) {
        var updateProject = _.debounce(updateProjectDet, 500);
        var pId = options._id;

        updateProject();

        function updateProjectDet() {

            var paralellTasks;
            var projectTeamInProject;
            var editedBy = {
                date: new Date()
            };

            var query = ProjectModel.find({_id: pId}, {_id: 1, bonus: 1, 'budget.projectTeam': 1}).lean();

            query.populate('bonus.employeeId', '_id name')
                .populate('bonus.bonusId', '_id name value isPercent');

            query.exec(function (err, result) {
                if (err) {
                    return console.log(err);
                }

                projectTeamInProject = result && result[0] && result[0].budget ? result[0].budget.projectTeam : [];

                result.forEach(function (project) {
                    paralellTasks = [getwTrackAndMonthHours];

                    function getwTrackAndMonthHours(cb) {

                        var query = wTrackModel.find({'project': project._id}).lean();
                        query
                            .populate('employee', '_id name');
                        var months = [];
                        var years = [];
                        var uMonth;
                        var uYear;

                        query.exec(function (err, result) {
                            if (err) {
                                return cb(err);
                            }
                            if (result.length) {
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
                            } else {
                                ProjectModel.update({_id: project._id}, {
                                    $set: {
                                        budget: {
                                            projectTeam: [],
                                            bonus      : []
                                        }
                                    }
                                }, function (err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }

                                });
                            }

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
                        var empQuery;

                        budgetTotal.profitSum = 0;
                        budgetTotal.costSum = 0;
                        budgetTotal.revenueSum = 0;
                        budgetTotal.hoursSum = 0;
                        budgetTotal.revenueByQA = 0;
                        budgetTotal.hoursByQA = 0;

                        wTRack.forEach(function (wTrack) {
                            var key;
                            var employee = wTrack.employee;

                            if (employee && !(employee._id in employees)) {
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
                                if (!wTrack.employee || !wTrack.employee._id) {
                                    return;
                                }

                                var emp = (wTrack.employee._id).toString();

                                if (empId === emp) {
                                    if (projectTeam[empId]) {
                                        if (wTrack.department.toString() === '55b92ace21e4b7c40f000011') {
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

                                        if (wTrack.department.toString() === '55b92ace21e4b7c40f000011') {
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
                            // var value = budgetTotal.revenueByQA / budgetTotal.hoursByQA;
                            // budgetTotal.rateSum.byQA = value ? value : 0;
                            // budgetTotal.rateSum.byDev = ((parseFloat(budgetTotal.revenueSum) - budgetTotal.revenueByQA)) / (budgetTotal.hoursSum - parseInt(budgetTotal.hoursByQA));

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

                            empQuery = EmployeeModel
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

                                response = response || [];

                                if (bonuses) {
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
                                    bonus: bonus
                                };

                                ProjectModel.update({_id: project._id}, {$set: {"budget.bonus": budget.bonus}}, function (err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }

                                    //console.log('success');
                                });
                            });
                        }
                    });
                });

                //console.log('success');

                wTrackModel.aggregate([{
                    $match: {
                        "project": ObjectId(pId)
                    }
                },
                    {
                        $group: {
                            _id: "$jobs",
                            ids: {$addToSet: '$_id'}
                        }
                    }
                ], function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    async.each(projectTeamInProject, function (el, cb) {
                        var element;

                        element = _.find(result, function (resEl) {
                            return resEl._id.toString() === el.toString();
                        });

                        JobModel.findByIdAndUpdate(el, {
                            $set: {
                                wTracks : element ? element.ids : [],
                                editedBy: editedBy
                            }
                        }, {new: true}, function (err) {

                            cb();
                        });

                    }, function () {
                        event.emit('updateJobBudget', {pId: pId});
                    });
                });

            });

        };
    });

    event.on('updateJobBudget', function (options) {
        var pId = options.pId;
        var projectId;

        // var count = 0;
        var editedBy = {
            date: new Date()
        };

        var query = JobModel.find({project: pId}).lean();

        query
            .populate('wTracks');

        query.exec(function (err, result) {
            if (err) {
                return console.log(err);
            }
            if (result && result.length) { //add from
                EmployeeModel.populate(result, {
                    'path'  : "wTracks.employee",
                    'select': '_id, name',
                    'lean'  : true
                }, function (err, result) {
                    result = result || [];

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

                            if (employee && !(employee._id in employees)) {
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
                                if (!wTrack.employee || !wTrack.employee._id) {
                                    return;
                                }

                                var emp = (wTrack.employee._id).toString();

                                nextDate = wTrack.dateByWeek;
                                nextMaxDate = wTrack.dateByWeek;

                                if (nextDate <= minDate) {
                                    minDate = nextDate;
                                }

                                if (nextMaxDate > maxDate) {
                                    if (wTrack.month === 1 && wTrack.week >= moment().year(wTrack.year - 1).isoWeeksInYear()) {
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

                            var empQuery = EmployeeModel
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
                                    })
                                });

                                budget = {
                                    projectTeam: response,
                                    budget     : sortBudget,
                                    budgetTotal: budgetTotal
                                };

                                JobModel.update({_id: jobID}, {$set: {budget: budget}}, function (err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }

                                    //event.emit('updateQuntity', {
                                    //    jobId   : jobID,
                                    //    quontity: budget.budgetTotal.hoursSum,
                                    //});
                                    //console.log(count++);
                                })
                            });
                        } else {
                            budget = {
                                projectTeam: [],
                                budget     : [],
                                budgetTotal: budgetTotal
                            };

                            JobModel.update({_id: jobID}, {
                                $set: {
                                    budget  : budget,
                                    editedBy: editedBy
                                }
                            }, function (err, result) {
                                if (err) {
                                    return console.log(err);
                                }

                                event.emit('updateQuntity', {
                                    jobId   : jobID,
                                    quontity: budget.budgetTotal.hoursSum
                                });
                                //console.log(count++);
                            })
                        }
                        cb();
                    }, function () {
                        JobModel.aggregate([{
                            $match: {
                                'project': ObjectId(pId)
                            }
                        },
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

                                ProjectModel.findByIdAndUpdate(projectId, {$set: {"budget.projectTeam": jobIds}}, {new: true}, function (err, result) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    cb();
                                });

                            }, function () {
                                if (projectId) {
                                    //event.emit('fetchJobsCollection', {project: projectId});
                                }
                            })
                        })
                    });
                });
            }
        });

    });


});