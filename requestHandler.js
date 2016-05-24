require('pmx').init();

var requestHandler = function (app, event, mainDb) {
    'use strict';

    var dbsObject = mainDb.dbsObject;
    var mongoose = require('mongoose');
    var async = require('async');
    var _ = require('./node_modules/underscore');
    var logWriter = require('./Modules/additions/logWriter.js')();
    var models = require('./models.js')(dbsObject);
    // var department = require("./Modules/Department.js")(event, models);
    var users = require('./Modules/Users.js')(mainDb, models);
    var profile = require('./Modules/Profile.js')(models);
    var access = require('./Modules/additions/access.js')(models);
    // var employee = require('./Modules/Employees.js')(event, models);
    var customer = require('./Modules/Customers.js')(event, models);
    // var workflow = require('./Modules/Workflow.js')(models, event);
    var project = require('./Modules/Projects.js')(models, event);
    // var jobPosition = require('./Modules/JobPosition.js')(event, models);
    // var degrees = require('./Modules/Degrees.js')(models);
    // var campaigns = require('./Modules/Campaigns.js')(models);
    var opportunities = require('./Modules/Opportunities.js')(models, event);
    var modules = require('./Modules/Module.js')(models);
    // var sources = require('./Modules/Sources.js')(models);
    // var languages = require('./Modules/Languages.js')(models);
    // var jobType = require('./Modules/JobType.js')(models);
    // var nationality = require('./Modules/Nationality.js')(models);
    // var birthdays = require('./Modules/Birthdays.js')(models, event);
    var Scheduler = require('./Modules/Scheduler.js')(dbsObject, models);
    var scheduler = new Scheduler();

    var tasksSchema = mongoose.Schemas.Task;
    var projectSchema = mongoose.Schemas.Project;
    var employeeSchema = mongoose.Schemas.Employee;
    var jobPositionSchema = mongoose.Schemas.JobPosition;
    var opportunitiesSchema = mongoose.Schemas.Opportunitie;
    var userSchema = mongoose.Schemas.User;
    var HoursCashesSchema = mongoose.Schemas.HoursCashes;
    var wTrackSchema = mongoose.Schemas.wTrack;
    var SalarySchema = mongoose.Schemas.Salary;
    var MonthHoursSchema = mongoose.Schemas.MonthHours;
    var ProjectSchema = mongoose.Schemas.Project;
    var jobsSchema = mongoose.Schemas.jobs;
    var ObjectId = mongoose.Types.ObjectId;
    var QuotationSchema = mongoose.Schemas.Quotation;
    var InvoiceSchema = mongoose.Schemas.wTrackInvoice;

    var io = app.get('io');
    var redisStore = require('./helpers/redisClient');
    var isoWeekYearComposer = require('./helpers/isoWeekYearComposer');
    var logger = app.get('logger');
    var moment = require('./public/js/libs/moment/moment');

    var JournalEntryHandler = require('./handlers/journalEntry');
    var journalEntry = new JournalEntryHandler(models);

    //binding for remove Workflow
    event.on('removeWorkflow', function (req, wId, id) {
        var query;
        switch (wId) {
            case 'Opportunities':
            case 'Leads':
                query = models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema);
                break;
            case 'Projects':
                query = models.get(req.session.lastDb, 'Project', projectSchema);
                break;
            case 'Tasks':
                query = models.get(req.session.lastDb, 'Tasks', tasksSchema);
                break;
            case 'Applications':
                query = models.get(req.session.lastDb, 'Employees', employeeSchema);
                break;
            case 'Jobpositions':
                query = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
                break;

        }
        if (query) {
            query.update({workflow: id}, {workflow: null}, {multi: true}).exec(function (err, result) {
                if (err) {
                    logWriter.log('Removed workflow update ' + err);
                }
            });
        }
    });

    event.on('dropHoursCashes', function (req) {
        var HoursCashes = models.get(req.session.lastDb, 'HoursCashes', HoursCashesSchema);

        HoursCashes.remove({}, function (err) {
            if (err) {
                return logger.error(err);
            }

            //console.log('HoursCashes removed');
        });

    });

    event.on('recalculateKeys', function (options) {
        var req = options.req;

        var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        var wTrackModel;
        var month;
        var week;
        var year;
        var _id;

        var isoYear;
        var dateByWeek;
        var dateByMonth;

        var query;

        if (options.wTrack) {
            wTrackModel = options.wTrack;

            if ('toJSON' in options.wTrack) {
                wTrackModel = options.wTrack.toJSON();
            }

            month = wTrackModel.month;
            week = wTrackModel.week;
            year = wTrackModel.year;
            _id = wTrackModel._id;

            isoYear = isoWeekYearComposer(wTrackModel);
            dateByWeek = isoYear * 100 + week;
            dateByMonth = year * 100 + month;

            query = {dateByWeek: dateByWeek, dateByMonth: dateByMonth, isoYear: isoYear};

            wTrack.findByIdAndUpdate(_id, query, {new: true}, function (err, result) {
                if (err) {
                    return logger.error(err);
                }
            });
        }

    });

    event.on('updateCost', function (params) {
        var update = _.debounce(updateWTrack, 500);

        update();

        function updateWTrack() {
            var req = params.req;
            var year = params.year;
            var month = params.month;
            var fixedExpense = params.fixedExpense;
            var expenseCoefficient = params.expenseCoefficient;
            var hours = params.hours;

            var monthFromSalary = params.monthFromSalary;
            var yearFromSalary = params.yearFromSalary;
            var waterfallTasks = [getWTracks, getBaseSalary];
            var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
            var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);
            var keyForRetrive;

            if (monthFromSalary && yearFromSalary) {
                year = parseInt(yearFromSalary);
                month = parseInt(monthFromSalary);
                keyForRetrive = year * 100 + month;
            }

            async.waterfall(waterfallTasks, function (err, result) {
                var baseSalary;

                if (err) {
                    return console.log(err);
                }

                baseSalary = result;

                baseSalary.forEach(function (object) {
                    var key = Object.keys(object)[0];

                    wTrack
                        .find({
                            month: month,
                            year: year,
                            'employee': ObjectId(key)
                        }, {
                            worked: 1,
                            revenue: 1,
                            'employee': 1,
                            _id: 1
                        }, function (err, result) {
                            if (err) {
                                return console.log(err);
                            }

                            if (monthFromSalary && yearFromSalary) {
                                redisStore.readFromStorage('monthHours', keyForRetrive, function (err, monthHour) {
                                    if (err) {
                                        return console.log(err);
                                    }

                                    monthHour = JSON.parse(monthHour);
                                    if (monthHour[0]) {
                                        fixedExpense = parseInt(monthHour[0].fixedExpense);
                                        expenseCoefficient = parseFloat(monthHour[0].expenseCoefficient);
                                        hours = parseInt(monthHour[0].hours);
                                    } else {
                                        fixedExpense = 0;
                                        expenseCoefficient = 0;
                                        hours = 1;
                                    }

                                    result.forEach(function (element) {
                                        var id = element._id;
                                        var calc = ((((object[key] * expenseCoefficient) + fixedExpense) / hours) * element.worked).toFixed(2);

                                        wTrack.findByIdAndUpdate(id, {
                                            $set: {
                                                cost: parseFloat(calc) * 100
                                            }
                                        }, {
                                            new: true
                                        }, function (err, result) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                        });

                                    });
                                });
                            } else {
                                result.forEach(function (element) {
                                    var id = element._id;
                                    var calc = ((((object[key] * expenseCoefficient) + fixedExpense) / hours) * element.worked).toFixed(2);

                                    wTrack.findByIdAndUpdate(id, {
                                        $set: {
                                            cost: parseFloat(calc) * 100
                                        }
                                    }, {
                                        new: true
                                    }, function (err, result) {
                                        if (err) {
                                            return console.log(err);
                                        }
                                    });

                                });
                            }

                        });
                });
            });

            function getWTracks(cb) {
                wTrack.aggregate([{
                    $match: {
                        year: year,
                        month: month
                    }
                }, {
                    $group: {
                        _id: '$employee'
                    }
                }], function (err, wTracks) {
                    var result;

                    if (err) {
                        return cb(err);
                    }

                    result = _.pluck(wTracks, '_id');
                    cb(null, result);
                });
            };

            function getBaseSalary(result, cb) {
                var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
                var date = moment().year(year).month(month - 1).date(1);
                var query = Employee
                    .find(
                        {
                            _id: {$in: result}
                        }, {
                            transfer: 1
                        })
                    .lean();
                query.exec(function (err, salary) {
                    if (err) {
                        return cb(err);
                    }
                    var salary = 0;
                    var i;

                    var result = _.map(salary, function (element) {
                        var obj = {};
                        var hire = element.transfer;
                        var length = hire.length;

                        for (i = length - 1; i >= 0; i--) {
                            if (date >= hire[i].date) {
                                salary = hire[i].salary;
                                break;
                            }
                        }

                        obj[element._id] = salary;
                        return obj;
                    });

                    cb(null, result);
                });
            }
        }
    });

    event.on('updateRevenue', function (options) {
        var wTrack = options.wTrack;
        var project = options.project;
        var req = options.req;
        var jobsArray = [];
        var ProjectModel = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);

        var waterfallTasks;

        function getData(cb) {
            if (wTrack) {
                jobsArray.push(wTrack.jobs);
                cb(null, jobsArray);
            } else if (project) {
                ProjectModel.findById(project, function (err, result) {
                    if (err) {
                        return cb(err);
                    }
                    jobsArray = result.budget.projectTeam;
                    cb(null, jobsArray);
                });
            }
        }

        function recalculate(jobsArray, cb) {
            Quotation.find({'products.jobs': {$in: jobsArray}}, function (err, result) {
                if (err) {
                    return cb(err);
                }
                async.each(result, function (quotation) {
                    event.emit('recalculateRevenue', {
                        quotation: quotation,
                        req: req
                    });
                });
            });

        }

        waterfallTasks = [getData, recalculate];

        async.waterfall(waterfallTasks, function (err, result) {
            console.log('Synthetic revenue recalculated');
        });

    });

    event.on('setReconcileTimeCard', function (options) {
        var req = options.req;
        var wTrackModel = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var jobsModel = models.get(req.session.lastDb, 'jobs', jobsSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var employee = options.employee;
        var month = options.month;
        var year = options.year;
        var week = options.week;
        var jobs = options.jobs;
        var dateNow = new Date();
        // var dateKey = moment(dateNow).isoWeekYear() * 100 + moment(dateNow).isoWeek();
        var query = {};
        var date;

        if (month && year) {
            query = {month: month, year: year};
            date = moment().year(year).month(month).date(1);
        } else if (year && week) {
            query = {week: week, year: year};
            date = moment().year(year).isoWeek(week).day(1);
        }

        if (employee) {
            query.employee = employee;
        }

        if (jobs) {
            jobsModel.update({_id: jobs}, {$set: {reconcile: true}}, function (err, result) {
                if (err) {
                    console.log(err);
                }
            });
        } else {
            wTrackModel.find(query, {jobs: 1}, function (err, result) {
                if (err) {
                    console.log(err);
                }

                var groupedResult = _.groupBy(result, 'jobs');
                var jobs = Object.keys(groupedResult);

                jobsModel.update({_id: {$in: jobs}}, {$set: {reconcile: true}}, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }


        if (date) {
            journalEntry.setReconcileDate(req, date);
        } else if (employee) {
            Employee.findById(employee, {hire: 1}, function (err, result) {
                if (err) {
                    console.log(err);
                }

                var date = employee.hire[0];

                journalEntry.setReconcileDate(req, date);
            });
        }
    });

    event.on('updateProjectDetails', function (options) {
        /*var updateProject = _.debounce(updateProjectDet, 500);
        var pId = options._id;

        updateProject();

        function updateProjectDet() {
            var req = options.req;

            var jobId = options.jobId;
            var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
            var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
            var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
            var Job = models.get(req.session.lastDb, 'jobs', jobsSchema);
            var paralellTasks;
            var projectTeamInProject;
            var editedBy = {
                user: req.session.uId,
                date: new Date()
            };

            var query = Project.find({_id: pId}, {_id: 1, bonus: 1, 'budget.projectTeam': 1}).lean();

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
                        var WTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
                        var monthHours = models.get(req.session.lastDb, 'MonthHours', MonthHoursSchema);

                        var query = WTrack.find({'project': project._id}).lean();
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
                                        year: {$in: uYear},
                                        month: {$in: uMonth}
                                    }
                                }, {
                                    $project: {
                                        date: {$add: [{$multiply: ['$year', 100]}, '$month']},
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
                            } else {
                                Project.update({_id: project._id}, {
                                    $set: {
                                        budget: {
                                            projectTeam: [],
                                            bonus: []
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
                        /!*                        budgetTotal.revenueByQA = 0;
                         budgetTotal.hoursByQA = 0;*!/

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
                                        /!*                                        if (wTrack.department.toString() === '55b92ace21e4b7c40f000011') {
                                         projectTeam[empId].byQA.revenue += parseFloat(wTrack.revenue);
                                         projectTeam[empId].byQA.hours += parseFloat(wTrack.worked);
                                         }*!/
                                        projectTeam[empId].profit += parseFloat(((wTrack.revenue - wTrack.cost) / 100).toFixed(2));
                                        projectTeam[empId].cost += parseFloat((wTrack.cost / 100).toFixed(2));
                                        projectTeam[empId].rate += parseFloat(wTrack.rate);
                                        projectTeam[empId].hours += parseFloat(wTrack.worked);
                                        projectTeam[empId].revenue += parseFloat((wTrack.revenue / 100).toFixed(2));
                                    } else {
                                        projectTeam[empId] = {};

                                        /!*                                       if (wTrack.department.toString() === '55b92ace21e4b7c40f000011') {
                                         projectTeam[empId].byQA = {};
                                         projectTeam[empId].byQA.revenue = parseFloat(wTrack.revenue);
                                         projectTeam[empId].byQA.hours = parseFloat(wTrack.worked);
                                         }*!/
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
                                budgetTotal.profitSum += parseFloat(projectTeam[key].revenue - projectTeam[key].cost);
                                budgetTotal.costSum += parseFloat(projectTeam[key].cost);
                                budgetTotal.hoursSum += parseFloat(projectTeam[key].hours);
                                budgetTotal.revenueSum += parseFloat(projectTeam[key].revenue);
                                //budgetTotal.revenueByQA += parseFloat(projectTeam[key].byQA ? projectTeam[key].byQA.revenue / 100 : 0);
                                //budgetTotal.hoursByQA += parseFloat(projectTeam[key].byQA ? projectTeam[key].byQA.hours : 0);
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

                            empQuery = Employee
                                .find({_id: {$in: keys}}, {
                                    'name': 1,
                                    'jobPosition': 1,
                                    'department': 1
                                })
                                .populate('department', '_id departmentName')
                                .populate('jobPosition', '_id name')
                                .lean();
                            empQuery.exec(function (err, response) {

                                if (err) {
                                    return console.log(err);
                                }

                                response = response || [];

/!*                                bonuses.forEach(function (element) {
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

                                });*!/

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

                                Project.update({_id: project._id}, {$set: {'budget.bonus': budget.bonus}}, function (err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }

                                    // console.log('success');
                                });
                            });
                        }
                    });
                });


                wTrack.aggregate([{
                    $match: {
                        project: ObjectId(pId)
                    }
                },
                    {
                        $group: {
                            _id: '$jobs',
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

                        Job.findByIdAndUpdate(el, {
                            $set: {
                                wTracks: element ? element.ids : [],
                                editedBy: editedBy
                            }
                        }, {new: true}, function (err) {

                            cb();
                        });

                    }, function () {
                        event.emit('updateJobBudget', {req: options.req, pId: pId});
                    });
                });

            });

        };*/
    });

    event.on('updateJobBudget', function (options) {
        var req = options.req;
        var pId = options.pId;
        var projectId;
        var Project = models.get(req.session.lastDb, 'Project', ProjectSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var Job = models.get(req.session.lastDb, 'jobs', jobsSchema);
        // var count = 0;
        var editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        Job.aggregate([/*{
         $match: {project: ObjectId(pId)}
         },*/ {
            $unwind: {
                path: '$wTracks',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: 'wTrack',
                localField: 'wTracks',
                foreignField: '_id',
                as: 'wTrack'
            }
        }, {
            $project: {
                wTrack: {$arrayElemAt: ['$wTrack', 0]},
                budget: 1
            }
        }, {
            $group: {
                _id: {
                    _id: '$_id',
                    department: '$wTrack.department',
                    employee: '$wTrack.employee'
                },
                costSum: {$sum: '$wTrack.cost'},
                revenueSum: {$sum: '$wTrack.revenue'},
                hoursSum: {$sum: '$wTrack.worked'},
                maxDate: {$max: '$wTrack.dateByWeek'},
                minDate: {$min: '$wTrack.dateByWeek'}
            }
        }, {
            $lookup: {
                from: 'Department',
                localField: '_id.department',
                foreignField: '_id',
                as: 'department'
            }
        }, {
            $lookup: {
                from: 'Employees',
                localField: '_id.employee',
                foreignField: '_id',
                as: 'employee'
            }
        }, {
            $project: {
                _id: '$_id._id',
                department: {$arrayElemAt: ['$department', 0]},
                employee: {$arrayElemAt: ['$employee', 0]},
                'budget.costSum': '$costSum',
                'budget.revenueSum': '$revenueSum',
                'budget.hoursSum': '$hoursSum',
                maxDate: 1,
                minDate: 1
            }
        }, {
            $lookup: {
                from: 'JobPosition',
                localField: 'employee.jobPosition',
                foreignField: '_id',
                as: 'employee.jobPosition'
            }
        }, {
            $project: {
                _id: '$_id',
                'department._id': '$department._id',
                'department.departmentName': '$department.departmentName',
                'employee._id': '$employee._id',
                'employee.name': '$employee.name',
                'employee.jobPosition': {$arrayElemAt: ['$employee.jobPosition', 0]},
                budget: '$budget',
                maxDate: 1,
                minDate: 1
            }
        }, {
            $project: {
                _id: '$_id',
                department: '$department',
                'employee._id': '$employee._id',
                'employee.name': '$employee.name',
                'employee.jobPosition._id': '$employee.jobPosition._id',
                'employee.jobPosition.name': '$employee.jobPosition.name',
                budget: '$budget',
                maxDate: 1,
                minDate: 1
            }
        }, {
            $group: {
                _id: '$_id',
                projectTeam: {$push: {department: '$department', employee: '$employee', budget: '$budget'}},
                budgetTotalCost: {$sum: '$budget.costSum'},
                budgetTotalRevenue: {$sum: '$budget.revenueSum'},
                budgetTotalHoursSum: {$sum: '$budget.hoursSum'},
                maxDate: {$max: '$maxDate'},
                minDate: {$min: '$minDate'}
            }
        }, {
            $project: {
                _id: '$_id',
                projectTeam: '$projectTeam',
                'budgetTotal.costSum': '$budgetTotalCost',
                'budgetTotal.revenueSum': '$budgetTotalRevenue',
                'budgetTotal.hoursSum': '$budgetTotalHoursSum',
                'budgetTotal.maxDate': '$maxDate',
                'budgetTotal.minDate': '$minDate'
            }
        }
        ], function (err, result) {
            if (err) {
                return console.log(err);
            }

            async.each(result, function (res, cb) {

                var jobID = res._id;
                var budgetTotal = res.budgetTotal;
                var projectTeam = res.projectTeam;
                var budget = {};

                budget = {
                    projectTeam: projectTeam,
                    budgetTotal: budgetTotal
                };

                Job.update({_id: jobID}, {$set: {budget: budget}}, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    event.emit('updateQuntity', {
                        jobId: jobID,
                        quontity: budget.budgetTotal.hoursSum,
                        req: req
                    });
                });

                cb();

            }, function () {
                Job.aggregate([{
                    $match: {
                        project: ObjectId(pId)
                    }
                },
                    {
                        $group: {
                            _id: '$project',
                            jobIds: {$addToSet: '$_id'}
                        }
                    },

                    {
                        $lookup: {
                            from: 'Project',
                            localField: '_id',
                            foreignField: '_id',
                            as: '_id'
                        }
                    }
                ], function (err, result) {
                    var jobIds;

                    if (err) {
                        return console.log(err);
                    }

                    async.each(result, function (res, cb) {

                        projectId = res._id._id;
                        jobIds = res.jobIds;

                        Project.findByIdAndUpdate(projectId, {$set: {'budget.projectTeam': jobIds}}, {new: true}, function (err, result) {
                            if (err) {
                                return cb(err);
                            }
                            cb();
                        });

                    }, function () {
                        if (projectId) {
                            event.emit('fetchJobsCollection', {project: projectId});
                        }
                    });
                });
            });
        });
    });

    event.on('updateQuntity', function (options) {
        var req = options.req;
        var jobId = options.jobId;
        var newProducts;
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var Job = models.get(req.session.lastDb, 'jobs', jobsSchema);

        Job.findById(jobId, function (err, job) {
            if (err) {
                return console.log(err);
            }
            if (job && job.quotation) {
                Quotation.findById(job.quotation, {products: 1}, function (err, result) {
                    var products;
                    var obj;
                    var index;
                    var objId;
                    var objQuantity;

                    if (err) {
                        return console.log(err);
                    }

                    if (result) {
                        products = result.toJSON().products;

                        if (products) {
                            obj = _.find(products, function (obj) {
                                return obj.jobs.toString() === jobId.toString();
                            });
                            index = _.indexOf(products, obj);
                            newProducts = _.clone(products);

                            obj.quantity = job.toJSON().budget.budgetTotal.hoursSum;
                            newProducts[index] = obj;

                            Quotation.findByIdAndUpdate(job.quotation, {$set: {products: newProducts}}, {new: true}, function (err, result) {
                                if (err) {
                                    return console.log(err);
                                }
                            });

                        }
                    }
                });

            }
        });
    });

//if name was updated, need update related wTrack, or other models
    event.on('updateName', function (id, targetModel, searchField, fieldName, fieldValue, fieldInArray) {
        //fieldInArray(bool) added for update values in array. If true then fieldName contains .$.
        var sercObject = {};
        var updateObject = {};

        sercObject[searchField] = id;

        if (fieldInArray) {
            updateObject['$set'] = {};
            updateObject['$set'][fieldName] = fieldValue;
        } else {
            updateObject[fieldName] = fieldValue;
        }

        targetModel.update(sercObject, updateObject, {multi: true}, function (err) {
            if (err) {
                logWriter.log('requestHandler_eventEmiter_updateName', err.message);
            }
        });
    });

    event.on('updateNames', function (options) {
        //fieldInArray(bool) added for update values in array. If true then fieldName contains .$.
        var id = options.id;
        var targetModel = options.targetModel;
        var searchField = options.searchField;
        var fieldName = options.fieldName;
        var fieldValue = options.fieldValue;
        var fieldInArray = options.fieldInArray;
        var projectId = options.projectId;
        var searchObject = {};
        var updateObject = {};

        searchObject[searchField] = id;

        if (fieldInArray) {
            updateObject['$set'] = {};
            updateObject['$set'][fieldName] = fieldValue;
        } else {
            updateObject[fieldName] = fieldValue;
        }

        targetModel.update(searchObject, updateObject, {multi: true}, function (err) {
            if (err) {
                logWriter.log('requestHandler_eventEmiter_updateName', err.message);
            }

            if (projectId) {
                event.emit('fetchJobsCollection', {project: projectId});
            }
        });
    });

//binding for Sequence
    event.on('updateSequence', function (model, sequenceField, start, end, workflowStart, workflowEnd, isCreate, isDelete, callback) {
        var query;
        var objFind = {};
        var objChange = {};
        if (workflowStart == workflowEnd) {//on one workflow

            if (!(isCreate || isDelete)) {
                var inc = -1;
                if (start > end) {
                    inc = 1;
                    var c = end;
                    end = start;
                    start = c;
                } else {
                    end -= 1;
                }
                objChange = {};
                objFind = {workflow: workflowStart};
                objFind[sequenceField] = {$gte: start, $lte: end};
                objChange[sequenceField] = inc;
                query = model.update(objFind, {$inc: objChange}, {multi: true});
                query.exec(function (err, res) {
                    if (callback) {
                        callback((inc === -1) ? end : start);
                    }
                });
            } else {
                if (isCreate) {
                    query = model.count({workflow: workflowStart}).exec(function (err, res) {
                        if (callback) {
                            callback(res);
                        }
                    });
                }
                if (isDelete) {
                    objChange = {};
                    objFind = {workflow: workflowStart};
                    objFind[sequenceField] = {$gt: start};
                    objChange[sequenceField] = -1;
                    query = model.update(objFind, {$inc: objChange}, {multi: true});
                    query.exec(function (err, res) {
                        if (callback) {
                            callback(res);
                        }
                    });
                }
            }
        } else {//between workflow
            objChange = {};
            objFind = {workflow: workflowStart};
            objFind[sequenceField] = {$gte: start};
            objChange[sequenceField] = -1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec();
            objFind = {workflow: workflowEnd};
            objFind[sequenceField] = {$gte: end};
            objChange[sequenceField] = 1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec(function (err, res) {
                if (callback) {
                    callback(end);
                }
            });

        }
    });
//Emit UI event for information user about some changes
    event.on('recollectVacationDash', function () {
        io.emit('recollectVacationDash');
        redisStore.removeAllFromStorage('dashboardVacation');
    });

    event.on('recollectProjectInfo', function () {
        io.emit('recollectProjectInfo');
    });

    event.on('fetchJobsCollection', function (options) {
        io.emit('fetchJobsCollection', options);
    });

    event.on('fetchInvoiceCollection', function (options) {
        io.emit('fetchInvoiceCollection', options);
    });

    event.on('sendMessage', function (options) {
        io.emit('sendMessage', options);
    });

    event.on('recalculateRevenue', function (options) {
        var quotation = options.quotation;
        var req = options.req;
        var wTrackModel = options.wTrackModel || models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var totalAmount = 0;

        if (!quotation || !wTrackModel) {
            return false;
        }

        // totalAmount = quotation.paymentInfo.total;

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
                        _id: null,
                        totalWorked: {$sum: '$worked'},
                        ids: {$addToSet: '$_id'}
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
                        var revenue = (wTrack.worked / totalWorked) * totalAmount;

                        wTrackModel.findByIdAndUpdate(wTrack._id, {$set: {revenue: revenue}}, {new: true}, function (err, updated) {
                            if (err) {
                                return cb(err);
                            }
                            if (updated && updated.project && updated.jobs) {
                                event.emit('updateProjectDetails', {
                                    req: req,
                                    _id: updated.project,
                                    jobId: updated.jobs
                                });
                            }
                            //event.emit('updateProjectDetails', {req: req, _id: updated.project, jobId: updated.jobs});
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
                //console.log(response);
                cb();
            };

            async.waterfall(waterfallTasks, waterfallMasterCb);

        }
    });

    Array.prototype.objectID = function () {

        var _arrayOfID = [];
        var objectId = mongoose.Types.ObjectId;
        for (var i = 0; i < this.length; i++) {
            if (this[i] && typeof this[i] == 'object' && this[i].hasOwnProperty('_id')) {
                _arrayOfID.push(this[i]._id);
            } else {
                if (typeof this[i] == 'string' && this[i].length === 24) {
                    _arrayOfID.push(objectId(this[i]));
                }
                if (this[i] === null || this[i] === 'null') {
                    _arrayOfID.push(null);
                }

            }
        }
        return _arrayOfID;
    };

    Array.prototype.toNumber = function () {
        var el;
        var _arrayOfNumbers = [];
        var value;

        for (var i = 0; i < this.length; i++) {
            el = this[i];
            value = parseInt(el);

            if (typeof el === 'string' && isFinite(value)) {
                _arrayOfNumbers.push(value);
            }
        }
        return _arrayOfNumbers;
    };

    Array.prototype.getShowmore = function (countPerPage) {
        var showMore = false;
        for (var i = 0; i < this.length; i++) {
            if (this[i].count > countPerPage) {
                showMore = true;
            }
        }
        return showMore;
    };

    function getModules(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            models.get(req.session.lastDb, 'Users', userSchema).findById(req.session.uId, function (err, _user) {
                if (_user) {
                    modules.get(req, _user.profile, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function redirectFromModuleId(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            models.get(req.session.lastDb, 'Users', userSchema).findById(req.session.uId, function (err, _user) {
                if (_user) {
                    modules.redirectToUrl(req, _user.profile, res, id);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function usersTotalCollectionLength(req, res) {
        users.getTotalCount(req, res);
    }

    function updateCurrentUser(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            /* access.getEditWritAccess(req, req.session.uId, 7, function (access) {
             if (access) {*/
            users.updateUser(req, req.session.uId, req.body, res, data);
            /* } else {
             res.send(403);
             }
             });*/
        } else {
            res.send(401);
        }
    };

    function updateUser(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            //access.getEditWritAccess(req, req.session.uId, 7, function (access) { //commented access for saving filters
            //    if (access) {
            users.updateUser(req, id, data.user, res);
            //    } else {
            //        res.send(403);
            //    }
            //});
        } else {
            res.send(401);
        }
    }

    function uploadFile(req, res, id, file) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    models.get(req.session.lastDb, 'Customers', customer.schema).findByIdAndUpdate(id, {$push: {attachments: {$each: file}}}, {new: true}, function (err, response) {
                        if (err) {
                            res.send(401);
                        } else {
                            res.send(200, {success: 'Customers updated success', data: response});
                        }
                    });
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function createProject(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.project.uId = req.session.uId;
                    project.create(req, data.project, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function updateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    project.updateOnlySelectedFields(req, id, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getProjectType(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getProjectType(req, res);
        } else {
            res.send(401);
        }
    }

    function getProjects(req, res, data, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.uId = req.session.uId;
                    project.get(req, data, res, next);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getProjectByEndDateForDashboard(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.getProjectByEndDateForDashboard(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getProjectStatusCountForDashboard(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.getProjectStatusCountForDashboard(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getProjectsForList(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.uId = req.session.uId;
                    project.getProjectsForList(req, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getProjectsById(req, res, data) {

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.getById(req, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getProjectsForDd(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getForDd(req, res, next);
        } else {
            res.send(401);
        }
    }

    function updateProject(req, res, id, data, remove) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.project.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }
                    project.update(req, id, data.project, res, remove);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function uploadProjectsFiles(req, res, id, file) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.update(req, id, {$push: {attachments: {$each: file}}}, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function uploadInvoiceFiles(req, res, id, file) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 64, function (access) {
                var Invoice = models.get(req.session.lastDb, 'wTrackInvoice', InvoiceSchema);
                if (access) {
                    Invoice.findByIdAndUpdate(id, {$push: {attachments: {$each: file}}}, {new: true}, function (err, result) {
                        res.status(200).send(result);
                    });
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function removeProject(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function uploadTasksFiles(req, res, id, file) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.addAtachments(req, id, {$push: {attachments: {$each: file}}}, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getLeadsPriority(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getLeadsPriority(req, res);
        } else {
            res.send(401);
        }
    }


    function uploadApplicationFile(req, res, id, files) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    employee.addAtach(req, id, files, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function uploadOpportunitiesFiles(req, res, id, file) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    opportunities.update(req, id, {$push: {attachments: {$each: file}}}, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function projectsTotalCollectionLength(req, res) {
        project.getTotalCount(req, res);
    }

    function initScheduler() {
        scheduler.initEveryDayScheduler();
    }

    return {
        getModules: getModules,
        redirectFromModuleId: redirectFromModuleId,
        usersTotalCollectionLength: usersTotalCollectionLength,
        updateUser: updateUser,
        updateCurrentUser: updateCurrentUser,
        uploadFile: uploadFile,
        projectsTotalCollectionLength: projectsTotalCollectionLength,
        getProjects: getProjects,
        getProjectsForList: getProjectsForList,
        getProjectsById: getProjectsById,
        getProjectsForDd: getProjectsForDd,
        createProject: createProject,
        updateProject: updateProject,
        uploadProjectsFiles: uploadProjectsFiles,
        removeProject: removeProject,
        getProjectStatusCountForDashboard: getProjectStatusCountForDashboard,
        getProjectByEndDateForDashboard: getProjectByEndDateForDashboard,
        updateOnlySelectedFields: updateOnlySelectedFields,
        getProjectType: getProjectType,
        uploadTasksFiles: uploadTasksFiles,
        getLeadsPriority: getLeadsPriority,
        uploadApplicationFile: uploadApplicationFile,
        uploadOpportunitiesFiles: uploadOpportunitiesFiles,
        uploadInvoiceFiles: uploadInvoiceFiles,
        initScheduler: initScheduler
    };
}
module.exports = requestHandler;
