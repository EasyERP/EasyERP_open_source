var mongoose = require('mongoose');
var Filters = function (models) {
    var wTrackSchema = mongoose.Schemas.wTrack;
    var ExpensesInvoiceSchema = mongoose.Schemas.expensesInvoice;
    var DividendInvoiceSchema = mongoose.Schemas.dividendInvoice;
    var CustomerSchema = mongoose.Schemas.Customer;
    var EmployeeSchema = mongoose.Schemas.Employee;
    var ProjectSchema = mongoose.Schemas.Project;
    var TaskSchema = mongoose.Schemas.Tasks;
    var wTrackInvoiceSchema = mongoose.Schemas.wTrackInvoice;
    var ProformaSchema = mongoose.Schemas.Proforma;
    var customerPaymentsSchema = mongoose.Schemas.Payment;
    var ExpensesInvoicePaymentSchema = mongoose.Schemas.ExpensesInvoicePayment;
    var QuotationSchema = mongoose.Schemas.Quotation;
    var productSchema = mongoose.Schemas.Products;
    var PayRollSchema = mongoose.Schemas.PayRoll;
    var JobsSchema = mongoose.Schemas.jobs;
    var OpportunitiesSchema = mongoose.Schemas.Opportunitie;
    var journalEntrySchema = mongoose.Schemas.journalEntry;
    var _ = require('../node_modules/underscore');
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var CONSTANTS = require('../constants/mainConstants.js');
    var moment = require('../public/js/libs/moment/moment');

    this.getFiltersValues = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var query = req.query;

        var startFilter;
        var WTrack = models.get(lastDB, 'wTrack', wTrackSchema);
        var Customer = models.get(lastDB, 'Customers', CustomerSchema);
        var Employee = models.get(lastDB, 'Employee', EmployeeSchema);
        var Project = models.get(lastDB, 'Project', ProjectSchema);
        var Task = models.get(lastDB, 'Tasks', TaskSchema);
        var wTrackInvoice = models.get(lastDB, 'wTrackInvoice', wTrackInvoiceSchema);
        var ExpensesInvoice = models.get(lastDB, 'expensesInvoice', ExpensesInvoiceSchema);
        var DividendInvoice = models.get(lastDB, 'dividendInvoice', DividendInvoiceSchema);
        var Proforma = models.get(lastDB, 'Proforma', ProformaSchema);
        var customerPayments = models.get(lastDB, 'Payment', customerPaymentsSchema);
        var ExpensesPayments = models.get(lastDB, 'expensesInvoicePayment', ExpensesInvoicePaymentSchema);
        var Product = models.get(lastDB, 'Products', productSchema);
        var Quotation = models.get(lastDB, 'Quotation', QuotationSchema);
        var PayRoll = models.get(lastDB, 'PayRoll', PayRollSchema);
        var Jobs = models.get(lastDB, 'jobs', JobsSchema);
        var Opportunities = models.get(lastDB, 'Opportunities', OpportunitiesSchema);
        var JournalEntry = models.get(req.session.lastDb, 'journalEntry', journalEntrySchema);
        var startDate;
        var endDate;
        var dateRangeObject;
        var _startDate;
        var _endDate;

        //made by R.Katsala block
        function validNames(result) {
            var modelName;
            var filterName;

            for (modelName in result) {
                for (filterName in result[modelName]) {
                    if (_.isArray(result[modelName][filterName])) {
                        result[modelName][filterName] = _.reject(result[modelName][filterName], function (element) {
                            return (element ? (element.name === '' || element.name === 'None') : null);
                        });
                    }
                }
            }

            return result;
        }

        //end R.Katsala block

        function dateRange() {
            "use strict";
            var weeksArr = [];
            var startWeek = moment().isoWeek() - 1;
            var year = moment().isoWeekYear();
            var week;

            for (var i = 0; i <= 11; i++) {
                if (startWeek + i > 53) {
                    week = startWeek + i - 53;
                    weeksArr.push((year + 1) * 100 + week);
                } else {
                    week = startWeek + i;
                    weeksArr.push(year * 100 + week);
                }
            }

            weeksArr.sort();

            return {
                startDate: weeksArr[0],
                endDate  : weeksArr[weeksArr.length - 1]
            };
        }

        if (query) {
            startFilter = query.filter;

            if (startFilter) {
                startDate = startFilter.startDate;
                endDate = startFilter.startDate;
            } else if (query.startDate && query.endDate) {
                _startDate = moment(new Date(query.startDate));
                _endDate = moment(new Date(query.endDate));
                startDate = _startDate.isoWeekYear() * 100 + _startDate.isoWeek();
                endDate = _endDate.isoWeekYear() * 100 + _endDate.isoWeek();
            }
        }

        if (!startDate || !endDate) {
            dateRangeObject = dateRange();

            startDate = dateRangeObject.startDate;
            endDate = dateRangeObject.endDate;
        }

        console.log(startDate, endDate);

        async.parallel({
                wTrack          : getWtrackFiltersValues,
                Persons         : getPersonFiltersValues,
                Companies       : getCompaniesFiltersValues,
                Employees       : getEmployeeFiltersValues,
                Applications    : getApplicationFiltersValues,
                Projects        : getProjectFiltersValues,
                Tasks           : getTasksFiltersValues,
                salesInvoice    : getSalesInvoiceFiltersValues,
                salesProforma   : getSalesProformaFiltersValues,
                Invoice         : getInvoiceFiltersValues,
                ExpensesInvoice : getExpensesInvoiceFiltersValues,
                DividendInvoice : getDividendInvoiceFiltersValues,
                customerPayments: getCustomerPaymentsFiltersValues,
                supplierPayments: getSupplierPaymentsFiltersValues,
                ExpensesPayments: getExpensesPaymentsFiltersValues,
                DividendPayments: getDividendPaymentsFiltersValues,
                Product         : getProductsFiltersValues,
                salesProduct    : getProductsFiltersValues,
                Quotation       : getQuotationFiltersValues,
                salesQuotation  : getSalesQuotation,
                salesOrder      : getSalesOrders,
                Order           : getOrdersFiltersValues,
                PayrollExpenses : getPayRollFiltersValues,
                DashVacation    : getDashVacationFiltersValues,
                jobsDashboard   : getDashJobsFiltersValues,
                salaryReport    : getsalaryReportFiltersValues,
                Leads           : getLeadsFiltersValues,
                Opportunities   : getOpportunitiesFiltersValues,
                journalEntry    : getJournalEntryFiltersValues
            },
            function (err, result) {
                if (err) {
                    return next(err);
                }

                //made by R.Katsala block
                result = validNames(result);
                //end R.Katsala block

                res.status(200).send(result);
            });

        function getWtrackFiltersValues(callback) {
            WTrack.aggregate([{
                $lookup: {
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id", as: "project"
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "employee",
                    foreignField: "_id", as: "employee"
                }
            }, {
                $lookup: {
                    from        : "Department",
                    localField  : "department",
                    foreignField: "_id", as: "department"
                }
            }, {
                $project: {
                    project   : {$arrayElemAt: ["$project", 0]},
                    employee  : {$arrayElemAt: ["$employee", 0]},
                    department: {$arrayElemAt: ["$department", 0]},
                    month     : 1,
                    year      : 1,
                    week      : 1,
                    isPaid    : 1,
                    _type     : 1
                }
            }, {
                $lookup: {
                    from        : "Customers",
                    localField  : "project.customer",
                    foreignField: "_id",
                    as          : "customer"
                }
            }, {
                $project: {
                    customer  : {$arrayElemAt: ["$customer", 0]},
                    project   : 1,
                    employee  : 1,
                    department: 1,
                    month     : 1,
                    year      : 1,
                    week      : 1,
                    isPaid    : 1,
                    _type     : 1
                }
            }, {
                $group: {
                    _id          : null,
                    'jobs'       : {
                        $addToSet: {
                            _id : '$jobs._id',
                            name: '$jobs.name'
                        }
                    },
                    'project': {
                        $addToSet: {
                            _id : '$project._id',
                            name: '$project.name'
                        }
                    },
                    'customer'   : {
                        $addToSet: {
                            _id : '$customer._id',
                            name: {
                                $concat: ['$customer.name.first', ' ', '$customer.name.last']
                            }
                        }
                    },
                    'employee'   : {
                        $addToSet: {
                            _id       : '$employee._id',
                            name      : {
                                $concat: ['$employee.name.first', ' ', '$employee.name.last']
                            },
                            isEmployee: '$employee.isEmployee'
                        }
                    },
                    'department' : {
                        $addToSet: {
                            _id : '$department._id',
                            name: '$department.name'
                        }
                    },
                    'year'       : {
                        $addToSet: {
                            _id : '$year',
                            name: '$year'
                        }
                    },
                    'month'      : {
                        $addToSet: {
                            _id : '$month',
                            name: '$month'
                        }
                    },
                    'week'       : {
                        $addToSet: {
                            _id : '$week',
                            name: '$week'
                        }
                    },
                    '_type'      : {
                        $addToSet: {
                            _id : '$_type',
                            name: '$_type'
                        }
                    }
                }
            }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                if (result) {
                    result['isPaid'] = [
                        {
                            _id : 'true',
                            name: 'Paid'
                        },
                        {
                            _id : 'false',
                            name: 'Unpaid'
                        }
                    ]
                }

                callback(null, result);
            });
        }

        function getPersonFiltersValues(callback) {
            Customer.aggregate([
                {
                    $match: {type: 'Person'}
                },
                {
                    $group: {
                        _id      : null,
                        'name'   : {
                            $addToSet: {
                                _id : '$_id',
                                name: {$concat: ['$name.first', ' ', '$name.last']}
                            }
                        },
                        'country': {
                            $addToSet: {
                                _id : '$address.country',
                                name: {'$ifNull': ['$address.country', 'None']}
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                if (result) {
                    result['services'] = [
                        {
                            _id : 'isSupplier',
                            name: 'Supplier'
                        },
                        {
                            _id : 'isCustomer',
                            name: 'Customer'
                        }
                    ]
                }

                callback(null, result);
            });
        }

        function getCompaniesFiltersValues(callback) {
            Customer.aggregate([
                {
                    $match: {type: 'Company'}
                },
                {
                    $group: {
                        _id      : null,
                        'name'   : {
                            $addToSet: {
                                _id : '$_id',
                                name: {$concat: ['$name.first', ' ', '$name.last']}
                            }
                        },
                        'country': {
                            $addToSet: {
                                _id : '$address.country',
                                name: {'$ifNull': ['$address.country', 'None']}
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                if (result) {
                    result['services'] = [
                        {
                            _id : 'isSupplier',
                            name: 'Supplier'
                        },
                        {
                            _id : 'isCustomer',
                            name: 'Customer'
                        }
                    ]
                }

                callback(null, result);
            });
        }

        function getsalaryReportFiltersValues(callback) {
            Employee.aggregate([{
                $lookup: {
                    from        : "Department",
                    localField  : "department",
                    foreignField: "_id",
                    as          : "department"
                }
            }, {
                $project: {
                    department: {$arrayElemAt: ["$department", 0]},
                    name      : 1,
                    isEmployee: 1
                }
            }, {
                $project: {
                    department: 1,
                    name      : 1,
                    isEmployee: 1
                }
            }, {
                $group: {
                    _id         : null,
                    'employee'  : {
                        $addToSet: {
                            _id       : '$_id',
                            name      : {$concat: ['$name.first', ' ', '$name.last']},
                            isEmployee: '$isEmployee'
                        }
                    },
                    'department': {
                        $addToSet: {
                            _id : '$department._id',
                            name: {'$ifNull': ['$department.name', 'None']}
                        }
                    }
                }
            }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                result.onlyEmployees = {
                    _id : 'true',
                    name: 'true'
                };

                callback(null, result);
            });
        }

        function getEmployeeFiltersValues(callback) {
            Employee.aggregate([
                {
                    $match: {'isEmployee': true}
                }, {
                    $lookup: {
                        from        : "Department",
                        localField  : "department",
                        foreignField: "_id",
                        as          : "department"
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "manager",
                        foreignField: "_id",
                        as          : "manager"
                    }
                }, {
                    $lookup: {
                        from        : "JobPosition",
                        localField  : "jobPosition",
                        foreignField: "_id",
                        as          : "jobPosition"
                    }
                }, {
                    $project: {
                        department : {$arrayElemAt: ["$department", 0]},
                        manager    : {$arrayElemAt: ["$manager", 0]},
                        jobPosition: {$arrayElemAt: ["$jobPosition", 0]},
                        name       : 1
                    }
                }, {
                    $project: {
                        department    : 1,
                        'manager._id' : 1,
                        'manager.name': {
                            $concat: ['$manager.name.first', ' ', '$manager.name.last']
                        },
                        jobPosition   : 1,
                        name          : 1
                    }
                }, {
                    $group: {
                        _id          : null,
                        'name'       : {
                            $addToSet: {
                                _id : '$_id',
                                name: {$concat: ['$name.first', ' ', '$name.last']}
                            }
                        },
                        'department' : {
                            $addToSet: {
                                _id : '$department._id',
                                name: {'$ifNull': ['$department.name', 'None']}
                            }
                        },
                        'jobPosition': {
                            $addToSet: {
                                _id : '$jobPosition._id',
                                name: {'$ifNull': ['$jobPosition.name', 'None']}
                            }
                        },
                        'manager'    : {
                            $addToSet: {
                                _id : '$manager._id',
                                name: {'$ifNull': ['$manager.name', 'None']}
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getApplicationFiltersValues(callback) {
            Employee.aggregate([
                {
                    $match: {'isEmployee': false}
                }, {
                    $lookup: {
                        from        : "Department",
                        localField  : "department",
                        foreignField: "_id", as: "department"
                    }
                }, {
                    $lookup: {
                        from        : "JobPosition",
                        localField  : "jobPosition",
                        foreignField: "_id", as: "jobPosition"
                    }
                }, {
                    $project: {
                        department : {$arrayElemAt: ["$department", 0]},
                        jobPosition: {$arrayElemAt: ["$jobPosition", 0]},
                        name       : 1
                    }
                }, {
                    $project: {
                        department : 1,
                        jobPosition: 1,
                        name       : 1
                    }
                }, {
                    $group: {
                        _id          : null,
                        'name'       : {
                            $addToSet: {
                                _id : '$_id',
                                name: {$concat: ['$name.first', ' ', '$name.last']}
                            }
                        },
                        'department' : {
                            $addToSet: {
                                _id : '$department._id',
                                name: {'$ifNull': ['$department.name', 'None']}
                            }
                        },
                        'jobPosition': {
                            $addToSet: {
                                _id : '$jobPosition._id',
                                name: {'$ifNull': ['$jobPosition.name', 'None']}
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getProjectFiltersValues(callback) {
            Project
                .aggregate([{
                    $lookup: {
                        from        : 'Customers',
                        localField  : 'customer',
                        foreignField: '_id',
                        as          : 'customer'
                    }
                }, {
                    $lookup: {
                        from        : 'workflows',
                        localField  : 'workflow',
                        foreignField: '_id',
                        as          : 'workflow'
                    }
                }, {
                    $lookup: {
                        from        : 'projectMembers',
                        localField  : '_id',
                        foreignField: 'projectId',
                        as          : 'projectMembers'
                    }
                }, {
                    $project: {
                        name           : 1,
                        workflow       : {$arrayElemAt: ['$workflow', 0]},
                        customer       : {$arrayElemAt: ['$customer', 0]},
                        projectManagers: {
                            $filter: {
                                input: '$projectMembers',
                                as   : 'projectMember',
                                cond : {
                                    $and: [{
                                        $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.PROJECTSMANAGER)]
                                    }]
                                }
                            }
                        },

                        salesManagers: {
                            $filter: {
                                input: '$projectMembers',
                                as   : 'projectMember',
                                cond : {
                                    $and: [{
                                        $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                                    }]
                                }
                            }
                        }
                    }
                }, {
                    $unwind: {
                        path                      : '$projectManagers',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $unwind: {
                        path                      : '$salesManagers',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : 'Employees',
                        localField  : 'salesManagers.employeeId',
                        foreignField: '_id',
                        as          : 'salesManager'
                    }
                }, {
                    $project: {
                        name           : 1,
                        workflow       : 1,
                        customer       : 1,
                        projectManagers: 1,
                        salesManager   : {$arrayElemAt: ['$salesManager', 0]}
                    }
                }, {
                    $lookup: {
                        from        : 'Employees',
                        localField  : 'projectManagers.employeeId',
                        foreignField: '_id',
                        as          : 'projectManager'
                    }
                }, {
                    $project: {
                        name          : 1,
                        workflow      : 1,
                        customer      : 1,
                        salesManager  : {
                            _id : '$salesManager._id',
                            name: '$salesManager.name'
                        },
                        projectManager: {$arrayElemAt: ['$projectManager', 0]}
                    }
                }, {
                    $project: {
                        name          : 1,
                        workflow      : 1,
                        customer      : 1,
                        salesManager  : 1,
                        projectManager: {
                            _id : '$projectManager._id',
                            name: '$projectManager.name'
                        }
                    }
                }, {
                    $group: {
                        _id: null,

                        workflow: {
                            $addToSet: {
                                _id : '$workflow._id',
                                name: '$workflow.name'
                            }
                        },

                        customer: {
                            $addToSet: {
                                _id : '$customer._id',
                                name: {$concat: ['$customer.name.first', ' ', '$customer.name.last']}
                            }
                        },

                        projectManager: {
                            $addToSet: {
                                _id : '$projectManager._id',
                                name: {$concat: ['$projectManager.name.first', ' ', '$projectManager.name.last']}
                            }
                        },

                        salesManager: {
                            $addToSet: {
                                _id : '$salesManager._id',
                                name: {$concat: ['$salesManager.name.first', ' ', '$salesManager.name.last']}
                            }
                        },

                        name: {
                            $addToSet: {
                                _id : '$_id',
                                name: '$name'
                            }
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result.length === 0) {
                        return callback(null, result);
                    }

                    if (result) {
                        result = result[0];

                        callback(null, result);
                    }

                });
        }

        function getDashVacationFiltersValues(callback) {
            var matchObjectForDash = {
                /*isEmployee: true,*/
                $or: [
                    {
                        isEmployee: true
                    }, {
                        $and: [{isEmployee: false}, {
                            lastFire: {
                                $ne : null,
                                $gte: startDate
                            }
                        }]
                    }
                ]
            };

            Employee.aggregate([
                {
                    $match: matchObjectForDash
                }, {
                    $lookup: {
                        from        : "Department",
                        localField  : "department",
                        foreignField: "_id",
                        as          : "department"
                    }
                }, {
                    $project: {
                        name      : 1,
                        department: {$arrayElemAt: ['$department', 0]}
                    }
                }, {
                    $group: {
                        _id         : null,
                        'name'      : {
                            $addToSet: {
                                _id : '$_id',
                                name: {$concat: ['$name.first', ' ', '$name.last']}
                            }
                        },
                        'department': {
                            $addToSet: {
                                _id : '$department._id',
                                name: {'$ifNull': ['$department.name', 'None']}
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getTasksFiltersValues(callback) {   // added $lookups in aggregation and one new field Summary
            Task.aggregate([{

                $lookup: {
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id",
                    as          : "project"
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "assignedTo",
                    foreignField: "_id",
                    as          : "assignedTo"
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id",
                    as          : "workflow"
                }
            }, {
                $project: {
                    summary   : 1,
                    type      : 1,
                    workflow  : {$arrayElemAt: ["$workflow", 0]},
                    assignedTo: {$arrayElemAt: ["$assignedTo", 0]},
                    project   : {$arrayElemAt: ["$project", 0]}
                }
            }, {
                $group: {
                    _id         : null,
                    'project'   : {
                        $addToSet: {
                            _id : '$project._id',
                            name: '$project.name'
                        }
                    },
                    'summary'   : {
                        $addToSet: {
                            _id : '$_id',
                            name: '$summary'
                        }
                    },
                    'assignedTo': {
                        $addToSet: {
                            _id : '$assignedTo._id',
                            name: {'$ifNull': [{$concat: ['$assignedTo.name.first', ' ', '$assignedTo.name.last']}, 'None']}
                        }
                    },
                    'workflow'  : {
                        $addToSet: {
                            _id : '$workflow._id',
                            name: {'$ifNull': ['$workflow.name', 'None']}
                        }
                    },
                    'type'      : {
                        $addToSet: {
                            _id : '$type',
                            name: '$type'
                        }
                    }
                }
            }

            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                /*Project.populate(result, {"path": "project._id", select: "projectName _id"}, {lean: true}, function(err, projects){
                 if (err){
                 return callback(err);
                 }

                 callback(null, result);
                 });*/

                callback(null, result);
            });
        }

        function getInvoiceFiltersValues(callback) {
            wTrackInvoice.aggregate([{
                $match: {
                    forSales: false
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $lookup: {
                    from        : "Customers",
                    localField  : "supplier",
                    foreignField: "_id", as: "supplier"
                }
            }, {
                $project: {
                    workflow: {$arrayElemAt: ["$workflow", 0]},
                    supplier: {$arrayElemAt: ["$supplier", 0]}
                }
            }, {
                $group: {
                    _id       : null,
                    'workflow': {
                        $addToSet: {
                            _id : '$workflow._id',
                            name: '$workflow.name'
                        }
                    },
                    /*'project'    : {
                     $addToSet: {
                     _id : '$project._id',
                     name: '$project.projectName'
                     }
                     },
                     'salesPerson': {
                     $addToSet: {
                     _id : '$salesPerson._id',
                     name: {
                     $concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']
                     }
                     }
                     },*/
                    'supplier': {
                        $addToSet: {
                            _id : '$supplier._id',
                            name: {
                                $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                            }
                        }
                    }
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getExpensesInvoiceFiltersValues(callback) {
            ExpensesInvoice.aggregate([{
                $match: {
                    forSales: false
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $lookup: {
                    from        : "Customers",
                    localField  : "supplier",
                    foreignField: "_id", as: "supplier"
                }
            }, {
                $project: {
                    workflow: {$arrayElemAt: ["$workflow", 0]},
                    supplier: {$arrayElemAt: ["$supplier", 0]}
                }
            }, {
                $group: {
                    _id       : null,
                    'workflow': {
                        $addToSet: {
                            _id : '$workflow._id',
                            name: '$workflow.name'
                        }
                    },
                    'supplier': {
                        $addToSet: {
                            _id : '$supplier._id',
                            name: {
                                $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                            }
                        }
                    }
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getDividendInvoiceFiltersValues(callback) {
            DividendInvoice.aggregate([{
                $match: {
                    _type: 'dividendInvoice'
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $project: {
                    workflow: {$arrayElemAt: ["$workflow", 0]}
                }
            }, {
                $group: {
                    _id       : null,
                    'workflow': {
                        $addToSet: {
                            _id : '$workflow._id',
                            name: '$workflow.name'
                        }
                    }
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getSalesInvoiceFiltersValues(callback) {
            wTrackInvoice.aggregate([{
                $match: {
                    forSales: true,
                    _type   : "wTrackInvoice"
                }
            }, {
                $lookup: {
                    from        : "projectMembers",
                    localField  : "project",
                    foreignField: "projectId",
                    as          : "projectMembers"
                }
            }, {
                $lookup: {
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id", as: "project"
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $lookup: {
                    from        : "Customers",
                    localField  : "supplier",
                    foreignField: "_id", as: "supplier"
                }
            }, {
                $project: {
                    workflow     : {$arrayElemAt: ["$workflow", 0]},
                    supplier     : {$arrayElemAt: ["$supplier", 0]},
                    project      : {$arrayElemAt: ["$project", 0]},
                    salesmanagers: {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : {$eq: ["$$projectMember.projectPositionId", objectId(CONSTANTS.SALESMANAGER)]}
                        }
                    }
                }
            }, {
                $unwind: {
                    path                      : '$salesmanagers',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "salesmanagers.employeeId",
                    foreignField: "_id",
                    as          : "salesmanagers"
                }
            }, {
                $project: {
                    workflow     : 1,
                    supplier     : 1,
                    salesmanagers: {$arrayElemAt: ['$salesmanagers', 0]},
                    project      : 1
                }
            }, {
                $group: {
                    _id          : null,
                    'workflow'   : {
                        $addToSet: {
                            _id : '$workflow._id',
                            name: '$workflow.name'
                        }
                    },
                    'project'    : {
                        $addToSet: {
                            _id : '$project._id',
                            name: '$project.name'
                        }
                    },
                    'salesPerson': {
                        $addToSet: {
                            _id : '$salesmanagers._id',
                            name: {
                                $concat: ['$salesmanagers.name.first', ' ', '$salesmanagers.name.last']
                            }
                        }
                    },
                    'supplier'   : {
                        $addToSet: {
                            _id : '$supplier._id',
                            name: {
                                $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                            }
                        }
                    }
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getSalesProformaFiltersValues(callback) {
            Proforma.aggregate([{
                $match: {
                    forSales: true,
                    _type   : "Proforma"
                }
            }, {
                $lookup: {
                    from        : "projectMembers",
                    localField  : "project",
                    foreignField: "projectId",
                    as          : "projectMembers"
                }
            }, {
                $lookup: {
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id", as: "project"
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "salesPerson",
                    foreignField: "_id", as: "salesPerson"
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $lookup: {
                    from        : "Customers",
                    localField  : "supplier",
                    foreignField: "_id", as: "supplier"
                }
            }, {
                $project: {
                    workflow     : {$arrayElemAt: ["$workflow", 0]},
                    supplier     : {$arrayElemAt: ["$supplier", 0]},
                    project      : {$arrayElemAt: ["$project", 0]},
                    salesmanagers: {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : {$eq: ["$$projectMember.projectPositionId", objectId(CONSTANTS.SALESMANAGER)]}
                        }
                    }
                }
            }, {
                $unwind: {
                    path                      : '$salesmanagers',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "salesmanagers.employeeId",
                    foreignField: "_id",
                    as          : "salesmanagers"
                }
            }, {
                $project: {
                    workflow     : 1,
                    supplier     : 1,
                    salesmanagers: {$arrayElemAt: ['$salesmanagers', 0]},
                    project      : 1
                }
            }, {
                $group: {
                    _id          : null,
                    'workflow'   : {
                        $addToSet: {
                            _id : '$workflow._id',
                            name: '$workflow.name'
                        }
                    },
                    'project'    : {
                        $addToSet: {
                            _id : '$project._id',
                            name: '$project.name'
                        }
                    },
                    'salesPerson': {
                        $addToSet: {
                            _id : '$salesmanagers._id',
                            name: {
                                $concat: ['$salesmanagers.name.first', ' ', '$salesmanagers.name.last']
                            }
                        }
                    },
                    'supplier'   : {
                        $addToSet: {
                            _id : '$supplier._id',
                            name: {
                                $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                            }
                        }
                    }
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getCustomerPaymentsFiltersValues(callback) {
            customerPayments.aggregate([
                {
                    $match: {
                        forSale: true
                    }
                }, {
                    $lookup: {
                        from        : "Invoice",
                        localField  : "invoice",
                        foreignField: "_id", as: "invoice"
                    }
                }, {
                    $lookup: {
                        from        : "Customers",
                        localField  : "supplier",
                        foreignField: "_id", as: "supplier"
                    }
                }, {
                    $lookup: {
                        from        : "PaymentMethod",
                        localField  : "paymentMethod",
                        foreignField: "_id", as: "paymentMethod"
                    }
                }, {
                    $project: {
                        supplier     : {$arrayElemAt: ["$supplier", 0]},
                        invoice      : {$arrayElemAt: ["$invoice", 0]},
                        paymentMethod: {$arrayElemAt: ["$paymentMethod", 0]},
                        name         : 1
                    }
                }, {
                    $lookup: {
                        from        : "projectMembers",
                        localField  : "invoice.project",
                        foreignField: "projectId",
                        as          : "projectMembers"
                    }
                }, {
                    $project: {
                        supplier     : 1,
                        salesmanagers: {
                            $filter: {
                                input: '$projectMembers',
                                as   : 'projectMember',
                                cond : {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]}
                            }
                        },
                        name         : 1,
                        paymentMethod: 1
                    }
                }, {
                    $unwind: {
                        path                      : '$salesmanagers',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "salesmanagers.employeeId",
                        foreignField: "_id",
                        as          : "salesmanagers"
                    }
                }, {
                    $project: {
                        supplier     : 1,
                        salesmanager : {$arrayElemAt: ["$salesmanagers", 0]},
                        paymentMethod: 1,
                        name         : 1
                    }
                }, {
                    $group: {
                        _id            : null,
                        'assigned'     : {
                            $addToSet: {
                                _id : '$salesmanager._id',
                                name: {
                                    $concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']
                                }
                            }
                        },
                        'supplier'     : {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: {
                                    $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                                }
                            }
                        },
                        'name'         : {
                            $addToSet: {
                                _id : '$_id',
                                name: '$name'
                            }
                        },
                        'paymentMethod': {
                            $addToSet: {
                                _id : '$paymentMethod._id',
                                name: '$paymentMethod.name'
                            }
                        }
                    }
                }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getSupplierPaymentsFiltersValues(callback) {
            customerPayments.aggregate([{
                $match: {
                    forSale: false,
                    bonus  : true
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "supplier",
                    foreignField: "_id", as: "supplier"
                }
            }, {
                $project: {
                    supplier  : {$arrayElemAt: ["$supplier", 0]},
                    paymentRef: 1,
                    year      : 1,
                    month     : 1,
                    workflow  : 1
                }
            }, {
                $project: {
                    supplier  : 1,
                    paymentRef: 1,
                    year      : 1,
                    month     : 1,
                    workflow  : 1
                }
            }, {
                $group: {
                    _id         : null,
                    'supplier'  : {
                        $addToSet: {
                            _id       : '$supplier._id',
                            name      : {
                                $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                            },
                            isEmployee: '$supplier.isEmployee'
                        }
                    },
                    'paymentRef': {
                        $addToSet: {
                            _id : '$paymentRef',
                            name: {'$ifNull': ['$paymentRef', 'None']}
                        }
                    },
                    'year'      : {
                        $addToSet: {
                            _id : '$year',
                            name: {'$ifNull': ['$year', 'None']}
                        }
                    },
                    'month'     : {
                        $addToSet: {
                            _id : '$month',
                            name: {'$ifNull': ['$month', 'None']}
                        }
                    },
                    'workflow'  : {
                        $addToSet: {
                            _id : '$workflow',
                            name: {'$ifNull': ['$workflow', 'None']}
                        }
                    }
                }
            }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getExpensesPaymentsFiltersValues(callback) {
            ExpensesPayments.aggregate([{
                $match: {
                    _type: 'expensesInvoicePayment'
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "supplier",
                    foreignField: "_id", as: "supplier"
                }
            }, {
                $project: {
                    supplier  : {$arrayElemAt: ["$supplier", 0]},
                    paymentRef: 1,
                    year      : 1,
                    month     : 1,
                    workflow  : 1
                }
            }, {
                $project: {
                    supplier  : 1,
                    paymentRef: 1,
                    year      : 1,
                    month     : 1,
                    workflow  : 1
                }
            }, {
                $group: {
                    _id         : null,
                    'supplier'  : {
                        $addToSet: {
                            _id       : '$supplier._id',
                            name      : {
                                $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                            },
                            isEmployee: '$supplier.isEmployee'
                        }
                    },
                    'paymentRef': {
                        $addToSet: {
                            _id : '$paymentRef',
                            name: {'$ifNull': ['$paymentRef', 'None']}
                        }
                    },
                    'year'      : {
                        $addToSet: {
                            _id : '$year',
                            name: {'$ifNull': ['$year', 'None']}
                        }
                    },
                    'month'     : {
                        $addToSet: {
                            _id : '$month',
                            name: {'$ifNull': ['$month', 'None']}
                        }
                    },
                    'workflow'  : {
                        $addToSet: {
                            _id : '$workflow',
                            name: {'$ifNull': ['$workflow', 'None']}
                        }
                    }
                }
            }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getDividendPaymentsFiltersValues(callback) {
            ExpensesPayments.aggregate([{
                $match: {
                    _type: 'dividendInvoicePayment'
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "supplier",
                    foreignField: "_id", as: "supplier"
                }
            }, {
                $project: {
                    supplier  : {$arrayElemAt: ["$supplier", 0]},
                    paymentRef: 1,
                    year      : 1,
                    month     : 1,
                    workflow  : 1
                }
            }, {
                $project: {
                    supplier  : 1,
                    paymentRef: 1,
                    year      : 1,
                    month     : 1,
                    workflow  : 1
                }
            }, {
                $group: {
                    _id         : null,
                    'supplier'  : {
                        $addToSet: {
                            _id       : '$supplier._id',
                            name      : {
                                $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                            },
                            isEmployee: '$supplier.isEmployee'
                        }
                    },
                    'paymentRef': {
                        $addToSet: {
                            _id : '$paymentRef',
                            name: {'$ifNull': ['$paymentRef', 'None']}
                        }
                    },
                    'year'      : {
                        $addToSet: {
                            _id : '$year',
                            name: {'$ifNull': ['$year', 'None']}
                        }
                    },
                    'month'     : {
                        $addToSet: {
                            _id : '$month',
                            name: {'$ifNull': ['$month', 'None']}
                        }
                    },
                    'workflow'  : {
                        $addToSet: {
                            _id : '$workflow',
                            name: {'$ifNull': ['$workflow', 'None']}
                        }
                    }
                }
            }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                callback(null, result);
            });
        }

        function getProductsFiltersValues(callback) {
            Product.aggregate([
                {
                    $group: {
                        _id          : null,
                        'name'       : {
                            $addToSet: {
                                _id : '$_id',
                                name: '$name'
                            }
                        },
                        'productType': {
                            $addToSet: {
                                _id : '$info.productType',
                                name: {'$ifNull': ['$info.productType', 'None']}
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                result = result[0];

                result['canBeSold'] = [
                    {
                        _id : 'true',
                        name: 'True'
                    },
                    {
                        _id : 'false',
                        name: 'False'
                    }
                ];

                result['canBeExpensed'] = [
                    {
                        _id : 'true',
                        name: 'True'
                    },
                    {
                        _id : 'false',
                        name: 'False'
                    }
                ];

                result['canBePurchased'] = [
                    {
                        _id : 'true',
                        name: 'True'
                    },
                    {
                        _id : 'false',
                        name: 'False'
                    }
                ];

                callback(null, result);
            });
        }

        function getQuotationFiltersValues(callback) {
            Quotation.aggregate([
                {
                    $match: {
                        forSales: false,
                        isOrder : false
                    }
                }, {
                    $lookup: {
                        from        : "workflows",
                        localField  : "workflow",
                        foreignField: "_id", as: "workflow"
                    }
                }, {
                    $lookup: {
                        from        : "Customers",
                        localField  : "supplier",
                        foreignField: "_id", as: "supplier"
                    }
                }, {
                    $project: {
                        workflow: {$arrayElemAt: ["$workflow", 0]},
                        supplier: {$arrayElemAt: ["$supplier", 0]}
                    }
                }, {
                    $group: {
                        _id       : null,
                        'supplier': {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: {
                                    $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                                }
                            }
                        },
                        'workflow': {
                            $addToSet: {
                                _id : '$workflow._id',
                                name: '$workflow.name'
                            }
                        }
                    }
                }
            ], function (err, result) {

                if (err) {
                    return callback(err);
                }

                if (!result.length) {
                    return callback(null, result);
                }

                if (result && result.length > 0) {
                    result = result[0];
                    callback(null, result);
                } else {
                    callback(null, []);
                }

            });
        }

        function getSalesQuotation(callback) {
            Quotation.aggregate([
                {
                    $match: {
                        forSales: true,
                        isOrder : false
                    }
                }, {
                    $lookup: {
                        from        : "projectMembers",
                        localField  : "project",
                        foreignField: "projectId",
                        as          : "projectMembers"
                    }
                }, {
                    $lookup: {
                        from        : "Project",
                        localField  : "project",
                        foreignField: "_id", as: "project"
                    }
                }, {
                    $lookup: {
                        from        : "Customers",
                        localField  : "supplier",
                        foreignField: "_id", as: "supplier"
                    }
                }, {
                    $lookup: {
                        from        : "workflows",
                        localField  : "workflow",
                        foreignField: "_id", as: "workflow"
                    }
                }, {
                    $project: {
                        workflow     : {$arrayElemAt: ["$workflow", 0]},
                        project      : {$arrayElemAt: ["$project", 0]},
                        supplier     : {$arrayElemAt: ["$supplier", 0]},
                        salesmanagers: {
                            $filter: {
                                input: '$projectMembers',
                                as   : 'projectMember',
                                cond : {$eq: ["$$projectMember.projectPositionId", objectId(CONSTANTS.SALESMANAGER)]}
                            }
                        }
                    }
                }, {
                    $unwind: {
                        path                      : '$salesmanagers',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "salesmanagers.employeeId",
                        foreignField: "_id",
                        as          : "salesmanager"
                    }
                }, {
                    $project: {
                        workflow    : 1,
                        project     : 1,
                        supplier    : 1,
                        salesmanager: {$arrayElemAt: ["$salesmanager", 0]}
                    }
                }, {
                    $group: {
                        _id           : null,
                        'project' : {
                            $addToSet: {
                                _id : '$project._id',
                                name: '$project.name'
                            }
                        },
                        'supplier'    : {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: {
                                    $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                                }
                            }
                        },
                        'salesmanager': {
                            $addToSet: {
                                _id : '$salesmanager._id',
                                name: {
                                    $concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']
                                }
                            }
                        },
                        'workflow'    : {
                            $addToSet: {
                                _id : '$workflow._id',
                                name: '$workflow.name'
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result && result.length) {
                    result = result[0];
                    callback(null, result);
                } else {
                    callback(null, []);
                }

            });
        }

        function getSalesOrders(callback) {
            Quotation.aggregate([
                {
                    $match: {
                        forSales: true,
                        isOrder : true
                    }
                }, {
                    $lookup: {
                        from        : "projectMembers",
                        localField  : "project",
                        foreignField: "projectId",
                        as          : "projectMembers"
                    }
                }, {
                    $lookup: {
                        from        : "Project",
                        localField  : "project",
                        foreignField: "_id", as: "project"
                    }
                }, {
                    $lookup: {
                        from        : "Customers",
                        localField  : "supplier",
                        foreignField: "_id", as: "supplier"
                    }
                }, {
                    $lookup: {
                        from        : "workflows",
                        localField  : "workflow",
                        foreignField: "_id", as: "workflow"
                    }
                }, {
                    $project: {
                        workflow     : {$arrayElemAt: ["$workflow", 0]},
                        project      : {$arrayElemAt: ["$project", 0]},
                        supplier     : {$arrayElemAt: ["$supplier", 0]},
                        salesmanagers: {
                            $filter: {
                                input: '$projectMembers',
                                as   : 'projectMember',
                                cond : {$eq: ["$$projectMember.projectPositionId", objectId(CONSTANTS.SALESMANAGER)]}
                            }
                        }
                    }
                }, {
                    $unwind: {
                        path                      : '$salesmanagers',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "salesmanagers.employeeId",
                        foreignField: "_id",
                        as          : "salesmanager"
                    }
                }, {
                    $project: {
                        workflow    : 1,
                        project     : 1,
                        supplier    : 1,
                        salesmanager: {$arrayElemAt: ["$salesmanager", 0]}
                    }
                }, {
                    $group: {
                        _id           : null,
                        'project' : {
                            $addToSet: {
                                _id : '$project._id',
                                name: '$project.name'
                            }
                        },
                        'supplier'    : {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: {
                                    $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                                }
                            }
                        },
                        'salesmanager': {
                            $addToSet: {
                                _id : '$salesmanager._id',
                                name: {
                                    $concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']
                                }
                            }
                        },
                        'workflow'    : {
                            $addToSet: {
                                _id : '$workflow._id',
                                name: '$workflow.name'
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result && result.length) {
                    result = result[0];
                    callback(null, result);
                } else {
                    callback(null, []);
                }

            });
        }

        function getDashJobsFiltersValues(callback) {
            Jobs.aggregate([{
                $lookup: {
                    from        : "projectMembers",
                    localField  : "project",
                    foreignField: "projectId",
                    as          : "projectMembers"
                }
            }, {
                $lookup: {
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id",
                    as          : "project"
                }
            }, {
                $lookup: {
                    from        : "Invoice",
                    localField  : "invoice",
                    foreignField: "_id",
                    as          : "invoice"
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id",
                    as          : "workflow"
                }
            }, {
                $lookup: {
                    from        : "Quotation",
                    localField  : "quotation",
                    foreignField: "_id",
                    as          : "quotation"
                }
            }, {
                $project: {
                    name         : 1,
                    workflow     : {$arrayElemAt: ["$workflow", 0]},
                    type         : 1,
                    wTracks      : 1,
                    project      : {$arrayElemAt: ["$project", 0]},
                    budget       : 1,
                    quotation    : {$arrayElemAt: ["$quotation", 0]},
                    invoice      : {$arrayElemAt: ["$invoice", 0]},
                    salesmanagers: {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : {$eq: ["$$projectMember.projectPositionId", objectId(CONSTANTS.SALESMANAGER)]}
                        }
                    }
                }
            }, {
                $unwind: {
                    path                      : '$salesmanagers',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : "Payment",
                    localField  : "invoice._id",
                    foreignField: "invoice",
                    as          : "payments"
                }
            }, {
                $lookup: {
                    from        : "Employees",
                    localField  : "salesmanagers.employeeId",
                    foreignField: "_id",
                    as          : "salesmanager"
                }
            }, {
                $project: {
                    order       : {
                        $cond: {
                            if  : {
                                $eq: ['$type', 'Not Quoted']
                            },
                            then: -1,
                            else: {
                                $cond: {
                                    if  : {
                                        $eq: ['$type', 'Quoted']
                                    },
                                    then: 0,
                                    else: 1
                                }
                            }
                        }
                    },
                    name        : 1,
                    workflow    : 1,
                    type        : 1,
                    wTracks     : 1,
                    project     : 1,
                    budget      : 1,
                    quotation   : 1,
                    invoice     : 1,
                    salesmanager: {$arrayElemAt: ["$salesmanager", 0]},
                    payment     : {
                        paid : {$sum: '$payments.paidAmount'},
                        count: {$size: '$payments'}
                    }
                }
            }, {
                $project: {
                    order       : 1,
                    name        : 1,
                    workflow    : 1,
                    type        : 1,
                    wTracks     : 1,
                    project     : 1,
                    budget      : 1,
                    quotation   : 1,
                    invoice     : 1,
                    salesmanager: 1,
                    payment     : 1
                }
            }, {
                $match: {
                    $or: [
                        {"invoice._type": 'wTrackInvoice'},
                        {quotation: {$exists: true}},
                        {type: 'Not Quoted'}
                    ]
                }
            }, {
                $group: {
                    _id            : null,
                    'type'         : {
                        $addToSet: {
                            _id : '$type',
                            name: '$type'
                        }
                    },
                    'workflow'     : {
                        $addToSet: {
                            _id : '$workflow._id',
                            name: '$workflow.name'
                        }
                    },
                    'project'      : {
                        $addToSet: {
                            _id : '$project._id',
                            name: '$project.projectName'
                        }
                    },
                    'salesmanager' : {
                        $addToSet: {
                            _id : '$salesmanager._id',
                            name: {
                                $concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']
                            }
                        }
                    },
                    'paymentsCount': {
                        $addToSet: {
                            _id : '$payment.count',
                            name: '$payment.count'
                        }
                    }
                }
            }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result && result.length) {
                    result = result[0];
                    callback(null, result);
                } else {
                    callback(null, []);
                }

            });
        }

        function getOrdersFiltersValues(callback) {
            Quotation.aggregate([
                {
                    $match: {
                        forSales: false,
                        isOrder : true
                    }
                }, {
                    $lookup: {
                        from        : "workflows",
                        localField  : "workflow",
                        foreignField: "_id", as: "workflow"
                    }
                }, {
                    $lookup: {
                        from        : "Customer",
                        localField  : "supplier",
                        foreignField: "_id", as: "supplier"
                    }
                }, {
                    $project: {
                        workflow: {$arrayElemAt: ["$workflow", 0]},
                        supplier: {$arrayElemAt: ["$supplier", 0]}
                    }
                }, {
                    $group: {
                        _id             : null,
                        'projectName'   : {
                            $addToSet: {
                                _id : '$project._id',
                                name: '$project.projectName'
                            }
                        },
                        'supplier'      : {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: {
                                    $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                                }
                            }
                        },
                        'projectmanager': {
                            $addToSet: {
                                _id : '$project.projectmanager._id',
                                name: '$project.projectmanager.name'
                            }
                        },
                        'workflow'      : {
                            $addToSet: {
                                _id : '$workflow._id',
                                name: '$workflow.name'
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result && result.length) {
                    result = result[0];
                    callback(null, result);
                } else {
                    callback(null, []);
                }

            });
        }

        function getPayRollFiltersValues(callback) {
            PayRoll.aggregate([
                {
                    $group: {
                        _id       : null,
                        'year'    : {
                            $addToSet: {
                                _id : '$year',
                                name: '$year'
                            }
                        },
                        'month'   : {
                            $addToSet: {
                                _id : '$month',
                                name: '$month'
                            }
                        },
                        'employee': {
                            $addToSet: '$employee'
                        },
                        'dataKey' : {
                            $addToSet: {
                                _id : '$dataKey',
                                name: '$dataKey'
                            }
                        },
                        'type'    : {
                            $addToSet: {
                                _id : '$type._id',
                                name: '$type.name'
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (!result || result.length === 0) {
                    return callback(null, []);
                }

                result = result[0];

                if (!result.dataKey) {
                    return callback(null, result);
                }

                result.dataKey = _.map(result.dataKey, function (element) {
                    element.name = element.name ? element.name.toString() : "";

                    return {
                        _id : element._id,
                        name: element.name.substring(4, 6) + '/' + element.name.substring(0, 4)
                    }
                });

                callback(null, result);

            });
        }

        function getLeadsFiltersValues(callback) {
            Opportunities.aggregate([
                {
                    $match: {
                        isOpportunitie: false
                    }
                }, {
                    $lookup: {
                        from        : "workflows",
                        localField  : "workflow",
                        foreignField: "_id", as: "workflow"
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "salesPerson",
                        foreignField: "_id", as: "salesPerson"
                    }
                }, {
                    $project: {
                        workflow   : {$arrayElemAt: ["$workflow", 0]},
                        source     : 1,
                        contactName: {$concat: ["$contactName.first", " ", "$contactName.last"]},
                        salesPerson: {$arrayElemAt: ["$salesPerson", 0]}
                    }
                }, {
                    $group: {
                        _id        : null,
                        contactName: {
                            $addToSet: {
                                _id : "$contactName",
                                name: "$contactName"
                            }
                        },
                        source     : {
                            $addToSet: {
                                _id : "$source",
                                name: "$source"
                            }
                        },
                        workflow   : {
                            $addToSet: {
                                _id : "$workflow._id",
                                name: "$workflow.name"
                            }
                        },
                        salesPerson: {
                            $addToSet: {
                                _id : "$salesPerson._id",
                                name: {$concat: ["$salesPerson.name.first", " ", "$salesPerson.name.last"]}
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result && result.length) {
                    result = result[0];
                    callback(null, result);
                } else {
                    callback(null, []);
                }

            });
        }

        function getOpportunitiesFiltersValues(callback) {
            Opportunities.aggregate([
                {
                    $match: {
                        isOpportunitie: true
                    }
                }, {
                    $lookup: {
                        from        : "Customers",
                        localField  : "customer",
                        foreignField: "_id", as: "customer"
                    }
                }, {
                    $lookup: {
                        from        : "workflows",
                        localField  : "workflow",
                        foreignField: "_id", as: "workflow"
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "salesPerson",
                        foreignField: "_id", as: "salesPerson"
                    }
                }, {
                    $project: {
                        customer   : {$arrayElemAt: ["$customer", 0]},
                        workflow   : {$arrayElemAt: ["$workflow", 0]},
                        salesPerson: {$arrayElemAt: ["$salesPerson", 0]}
                    }
                }, {
                    $group: {
                        _id        : null,
                        customer   : {
                            $addToSet: {
                                _id : "$customer._id",
                                name: {$concat: ["$customer.name.first", " ", "$customer.name.last"]}
                            }
                        },
                        workflow   : {
                            $addToSet: {
                                _id : "$workflow._id",
                                name: "$workflow.name"
                            }
                        },
                        salesPerson: {
                            $addToSet: {
                                _id : "$salesPerson._id",
                                name: {$concat: ["$salesPerson.name.first", " ", "$salesPerson.name.last"]}
                            }
                        }
                    }
                }
            ], function (err, result) {
                var emptyCustomer = {
                    name: 'Empty',
                    _id : 'Empty'
                };

                if (err) {
                    return callback(err);
                }

                if (result && result.length) {
                    result = result[0];

                    result.customer.unshift(emptyCustomer);

                    callback(null, result);
                } else {
                    callback(null, []);
                }

            });
        }

        function getJournalEntryFiltersValues(callback) {
            var getForInvoices = function (pCb) {
                JournalEntry.aggregate([{
                    $match: {
                        //"sourceDocument.model": "wTrack",
                        debit: {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : "jobs",
                        localField  : "sourceDocument._id",
                        foreignField: "_id", as: "sourceDocument._id"
                    }
                }, {
                    $lookup: {
                        from        : "journals",
                        localField  : "journal",
                        foreignField: "_id", as: "journal"
                    }
                }, {
                    $project: {
                        journal             : {$arrayElemAt: ["$journal", 0]},
                        'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]}
                    }
                }, {
                    $lookup: {
                        from        : "jobs",
                        localField  : "sourceDocument._id.jobs",
                        foreignField: "_id", as: "sourceDocument._id.jobs"
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "journal.debitAccount",
                        foreignField: "_id", as: "journal.debitAccount"
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "journal.creditAccount",
                        foreignField: "_id", as: "journal.creditAccount"
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "sourceDocument._id.employee",
                        foreignField: "_id", as: "sourceDocument._id.employee"
                    }
                }, {
                    $project: {
                        'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
                        'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
                        'journal.name'          : 1,
                        'sourceDocument._id'    : 1,
                        'sourceDocument.jobs'   : {$arrayElemAt: ["$sourceDocument._id.jobs", 0]},
                        'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument._id.employee", 0]},
                        'sourceDocument.name'   : '$sourceDocument._id.jobs.name'
                    }
                }, {
                    $group: {
                        _id           : null,
                        journalName   : {
                            $addToSet: {
                                _id : "$journal.name",
                                name: "$journal.name"
                            }
                        },
                        sourceDocument: {
                            $addToSet: {
                                _id : "$sourceDocument.subject._id",
                                name: {$concat: ["$sourceDocument.subject.name.first", " ", "$sourceDocument.subject.name.last"]}
                            }
                        },
                        creditAccount : {
                            $addToSet: {
                                _id : "$journal.creditAccount._id",
                                name: "$journal.creditAccount.name"
                            }
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result && result.length) {
                        result = result[0];
                        pCb(null, result);
                    } else {
                        pCb(null, {});
                    }

                });
            };

            var getForEmployees = function (pCb) {
                JournalEntry.aggregate([{
                    $match: {
                        "sourceDocument.model": "Invoice",
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : "Invoice",
                        localField  : "sourceDocument._id",
                        foreignField: "_id", as: "sourceDocument._id"
                    }
                }, {
                    $lookup: {
                        from        : "journals",
                        localField  : "journal",
                        foreignField: "_id", as: "journal"
                    }
                }, {
                    $project: {
                        journal             : {$arrayElemAt: ["$journal", 0]},
                        'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]}
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "journal.debitAccount",
                        foreignField: "_id", as: "journal.debitAccount"
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "journal.creditAccount",
                        foreignField: "_id", as: "journal.creditAccount"
                    }
                }, {
                    $lookup: {
                        from        : "Customers",
                        localField  : "sourceDocument._id.supplier",
                        foreignField: "_id", as: "sourceDocument.subject"
                    }
                }, {
                    $project: {
                        'journal.debitAccount'  : {$arrayElemAt: ["$journal.debitAccount", 0]},
                        'journal.creditAccount' : {$arrayElemAt: ["$journal.creditAccount", 0]},
                        'journal.name'          : 1,
                        'sourceDocument._id'    : 1,
                        'sourceDocument.name'   : '$sourceDocument._id.name',
                        'sourceDocument.subject': {$arrayElemAt: ["$sourceDocument.subject", 0]},
                    }
                }, {
                    $group: {
                        _id           : null,
                        journalName   : {
                            $addToSet: {
                                _id : "$journal.name",
                                name: "$journal.name"
                            }
                        },
                        sourceDocument: {
                            $addToSet: {
                                _id : "$sourceDocument.subject._id",
                                name: {$concat: ["$sourceDocument.subject.name.first", " ", "$sourceDocument.subject.name.last"]}
                            }
                        },
                        creditAccount : {
                            $addToSet: {
                                _id : "$journal.creditAccount._id",
                                name: "$journal.creditAccount.name"
                            }
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result && result.length) {
                        result = result[0];
                        pCb(null, result);
                    } else {
                        pCb(null, {});
                    }

                });
            };

            var getByEmployees = function (pCb) {
                JournalEntry.aggregate([{
                    $match: {
                        "sourceDocument.model": "Employees",
                        debit                 : {$gt: 0}
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "sourceDocument._id",
                        foreignField: "_id", as: "sourceDocument._id"
                    }
                }, {
                    $lookup: {
                        from        : "journals",
                        localField  : "journal",
                        foreignField: "_id", as: "journal"
                    }
                }, {
                    $project: {
                        journal             : {$arrayElemAt: ["$journal", 0]},
                        'sourceDocument._id': {$arrayElemAt: ["$sourceDocument._id", 0]}
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "journal.debitAccount",
                        foreignField: "_id", as: "journal.debitAccount"
                    }
                }, {
                    $lookup: {
                        from        : "chartOfAccount",
                        localField  : "journal.creditAccount",
                        foreignField: "_id", as: "journal.creditAccount"
                    }
                }, {
                    $project: {
                        'journal.debitAccount' : {$arrayElemAt: ["$journal.debitAccount", 0]},
                        'journal.creditAccount': {$arrayElemAt: ["$journal.creditAccount", 0]},
                        'journal.name'         : 1,
                        'sourceDocument._id'   : 1,
                        'sourceDocument.name'  : '$sourceDocument._id.name'
                    }
                }, {
                    $group: {
                        _id           : null,
                        journalName   : {
                            $addToSet: {
                                _id : "$journal.name",
                                name: "$journal.name"
                            }
                        },
                        sourceDocument: {
                            $addToSet: {
                                _id : "$sourceDocument._id._id",
                                name: {$concat: ["$sourceDocument.name.first", " ", "$sourceDocument.name.last"]}
                            }
                        },
                        creditAccount : {
                            $addToSet: {
                                _id : "$journal.creditAccount._id",
                                name: "$journal.creditAccount.name"
                            }
                        }
                    }
                }], function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result && result.length) {
                        result = result[0];
                        pCb(null, result);
                    } else {
                        pCb(null, {});
                    }

                });
            };

            var parallelTasks = [getForInvoices, getForEmployees, getByEmployees];

            async.parallel(parallelTasks, function (err, result) {
                var empInvoice = result[0];
                var empResult = result[2];
                callback(null, {
                    journalName   : _.union(empInvoice.journalName, empResult.journalName),
                    sourceDocument: _.union(empInvoice.sourceDocument, empResult.sourceDocument),
                    creditAccount : _.union(empInvoice.creditAccount, empResult.creditAccount)
                });
            });

        }
    };
};

module.exports = Filters;