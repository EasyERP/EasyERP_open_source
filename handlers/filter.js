var mongoose = require('mongoose');
var Filters = function (models) {
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var CustomerSchema = mongoose.Schemas['Customer'];
    var EmployeeSchema = mongoose.Schemas['Employee'];
    var ProjectSchema = mongoose.Schemas['Project'];
    var TaskSchema = mongoose.Schemas['Tasks'];
    var wTrackInvoiceSchema = mongoose.Schemas['wTrackInvoice'];
    var customerPaymentsSchema = mongoose.Schemas['Payment'];
    var QuotationSchema = mongoose.Schemas['Quotation'];
    var productSchema = mongoose.Schemas['Products'];
    var PayRollSchema = mongoose.Schemas['PayRoll'];
    var JobsSchema = mongoose.Schemas['jobs'];
    var _ = require('../node_modules/underscore');
    var async = require('async');
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
        var customerPayments = models.get(lastDB, 'Payment', customerPaymentsSchema);
        var Product = models.get(lastDB, 'Products', productSchema);
        var Quotation = models.get(lastDB, 'Quotation', QuotationSchema);
        var PayRoll = models.get(lastDB, 'PayRoll', PayRollSchema);
        var Jobs = models.get(lastDB, 'jobs', JobsSchema);
        var startDate;
        var endDate;
        var dateRangeObject;

        //made by R.Katsala block
        function validNames(result) {
            var modelName;
            var filterName;

            for (modelName in result) {
                for (filterName in result[modelName]) {
                    if (_.isArray(result[modelName][filterName])) {
                        result[modelName][filterName] = _.reject(result[modelName][filterName], function (element) {
                            return (element.name === '' || element.name === 'None');
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
        };

        if (query) {
            startFilter = query.filter;

            if (startFilter) {
                startDate = startFilter.startDate;
                endDate = startFilter.startDate;
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
                customerPayments: getCustomerPaymentsFiltersValues,
                supplierPayments: getSupplierPaymentsFiltersValues,
                Product         : getProductsFiltersValues,
                salesProduct    : getProductsFiltersValues,
                Quotation       : getQuotationFiltersValues,
                salesQuotation  : getSalesQuotation,
                salesOrder      : getSalesOrders,
                Order           : getOrdersFiltersValues,
                PayrollExpenses : getPayRollFiltersValues,
                DashVacation    : getDashVacationFiltersValues,
                Dashboard       : getDashJobsFiltersValues
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
            WTrack.aggregate([
                {
                    $group: {
                        _id             : null,
                        'jobs'          : {
                            $addToSet: {
                                _id : '$jobs._id',
                                name: '$jobs.name'
                            }
                        },
                        'projectManager': {
                            $addToSet: {
                                _id : '$project.projectmanager._id',
                                name: '$project.projectmanager.name'
                            }
                        },
                        'projectName'   : {
                            $addToSet: {
                                _id : '$project._id',
                                name: '$project.projectName'
                            }
                        },
                        'customer'      : {
                            $addToSet: {
                                _id : '$project.customer._id',
                                name: '$project.customer.name'
                            }
                        },
                        'employee'      : {
                            $addToSet: '$employee'
                        },
                        'department'    : {
                            $addToSet: {
                                _id : '$department._id',
                                name: '$department.departmentName'
                            }
                        },
                        'year'          : {
                            $addToSet: {
                                _id : '$year',
                                name: '$year'
                            }
                        },
                        'month'         : {
                            $addToSet: {
                                _id : '$month',
                                name: '$month'
                            }
                        },
                        'week'          : {
                            $addToSet: {
                                _id : '$week',
                                name: '$week'
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return callback(err);
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
                ;

                callback(null, result);
            });
        };

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
        };

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
        };

        function getEmployeeFiltersValues(callback) {
            Employee.aggregate([
                {
                    $match: {'isEmployee': true}
                },
                {
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

                result = result[0];

                callback(null, result);
            });
        };

        function getApplicationFiltersValues(callback) {
            Employee.aggregate([
                {
                    $match: {'isEmployee': false}
                },
                {
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

                result = result[0];

                callback(null, result);
            });
        };

        function getProjectFiltersValues(callback) {
            Project
                .aggregate([{
                    $lookup: {
                        from        : "Employees",
                        localField  : "projectmanager",
                        foreignField: "_id", as: "projectmanager"
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
                    $project: {
                        projectName   : 1,
                        workflow      : {$arrayElemAt: ["$workflow", 0]},
                        customer      : {$arrayElemAt: ["$customer", 0]},
                        projectmanager: {$arrayElemAt: ["$projectmanager", 0]}
                    }
                }, {
                    $project: {
                        projectName   : 1,
                        workflow      : 1,
                        customer      : 1,
                        projectmanager: 1
                    }
                }, {
                    $group: {
                        _id             : null,
                        'workflow'      : {
                            $addToSet: {
                                _id : '$workflow._id',
                                name: '$workflow.name'
                            }
                        },
                        'customer'      : {
                            $addToSet: {
                                _id : '$customer._id',
                                name: {$concat: ['$customer.name.first', ' ', '$customer.name.last']}
                            }
                        },
                        'projectmanager': {
                            $addToSet: {
                                _id : '$projectmanager._id',
                                name: {$concat: ['$projectmanager.name.first', ' ', '$projectmanager.name.last']}
                            }
                        },
                        'name'          : {
                            $addToSet: {
                                _id : '$_id',
                                name: '$projectName'
                            }
                        }
                    }
                }
                ], function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    if (result) {
                        result = result[0];

                        callback(null, result);
                    }

                });
        };

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
                        } /*{firedCount: {$gt: 0}}*/]
                    }
                ]
            };

            Employee.aggregate([
                {
                    $match: matchObjectForDash
                },
                {
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

                result = result[0];

                callback(null, result);
            });
        };

        function getTasksFiltersValues(callback) {
            Task.aggregate([
                {
                    $group: {
                        _id         : null,
                        'project'   : {
                            $addToSet: {
                                _id : '$project',
                                name: '$project.name'
                            }
                        },
                        'assignedTo': {
                            $addToSet: {
                                _id : '$assignedTo._id',
                                name: {'$ifNull': ['$assignedTo.name', 'None']}
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
                    callback(err);
                }

                result = result[0];

                //Project.populate(result, {"path": "project._id", select: "projectName _id"}, {lean: true}, function(err, projects){
                //    if (err){
                //        return callback(err);
                //    }
                //
                //    callback(null, result);
                //});

                callback(null, result);
            });
        };

        function getSalesInvoiceFiltersValues(callback) {
            wTrackInvoice.aggregate([{
                $match: {
                    forSales: true,
                    _type   : "wTrackInvoice"
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
                    workflow   : {$arrayElemAt: ["$workflow", 0]},
                    supplier   : {$arrayElemAt: ["$supplier", 0]},
                    salesPerson: {$arrayElemAt: ["$salesPerson", 0]},
                    project    : {$arrayElemAt: ["$project", 0]}
                }
            }, {
                $project: {
                    workflow   : 1,
                    supplier   : 1,
                    salesPerson: 1,
                    project    : 1
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
                    callback(err);
                }

                result = result[0];

                callback(null, result);
            });
        };

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
                    $project: {
                        supplier: {$arrayElemAt: ["$supplier", 0]},
                        invoice : {$arrayElemAt: ["$invoice", 0]},
                        name    : 1
                    }
                }, {
                    $project: {
                        supplier: 1,
                        invoice : 1,
                        name    : 1
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "invoice.salesPerson",
                        foreignField: "_id", as: "assigned"
                    }
                }, {
                    $project: {
                        supplier: 1,
                        assigned: {$arrayElemAt: ["$assigned", 0]},
                        name    : 1
                    }
                }, {
                    $group: {
                        _id       : null,
                        'assigned': {
                            $addToSet: {
                                _id : '$assigned._id',
                                name: {
                                    $concat: ['$assigned.name.first', ' ', '$assigned.name.last']
                                }
                            }
                        },
                        'supplier': {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: {
                                    $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                                }
                            }
                        },
                        'name'    : {
                            $addToSet: {
                                _id : '$_id',
                                name: '$name'
                            }
                        }
                    }
                }], function (err, result) {
                if (err) {
                    callback(err);
                }

                result = result[0];

                callback(null, result);
            });
        };

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
                            _id : '$supplier._id',
                            name: {
                                $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                            }
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
                    callback(err);
                }

                result = result[0];

                callback(null, result);
            });
        };

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
                    callback(err);
                }
                if (result.length === 0) {
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
        };

        function getQuotationFiltersValues(callback) {
            Quotation.aggregate([
                {
                    $match: {
                        forSales: false,
                        isOrder : false
                    }
                },
                {
                    $group: {
                        _id       : null,
                        'supplier': {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: '$supplier.name'
                            }
                        },
                        //'type': {
                        //    $addToSet: {
                        //        _id : '$type',
                        //        name: '$type'
                        //    }
                        //},
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
                    callback(err);
                }

                if (result && result.length > 0) {
                    result = result[0];
                    callback(null, result);
                } else {
                    callback(null, []);
                }

            });
        };

        function getSalesQuotation(callback) {
            Quotation.aggregate([
                {
                    $match: {
                        forSales: true,
                        isOrder : false
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
                        workflow: {$arrayElemAt: ["$workflow", 0]},
                        project : {$arrayElemAt: ["$project", 0]},
                        supplier: {$arrayElemAt: ["$supplier", 0]}
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "project.projectmanager",
                        foreignField: "_id", as: "projectmanager"
                    }
                }, {
                    $project: {
                        workflow      : 1,
                        project       : 1,
                        supplier      : 1,
                        projectmanager: {$arrayElemAt: ["$projectmanager", 0]}
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
                                _id : '$projectmanager._id',
                                name: {
                                    $concat: ['$projectmanager.name.first', ' ', '$projectmanager.name.last']
                                }
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
                    callback(err);
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
                        workflow: {$arrayElemAt: ["$workflow", 0]},
                        project : {$arrayElemAt: ["$project", 0]},
                        supplier: {$arrayElemAt: ["$supplier", 0]}
                    }
                }, {
                    $lookup: {
                        from        : "Employees",
                        localField  : "project.projectmanager",
                        foreignField: "_id", as: "projectmanager"
                    }
                }, {
                    $project: {
                        workflow      : 1,
                        project       : 1,
                        supplier      : 1,
                        projectmanager: {$arrayElemAt: ["$projectmanager", 0]}
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
                                _id : '$projectmanager._id',
                                name: {
                                    $concat: ['$projectmanager.name.first', ' ', '$projectmanager.name.last']
                                }
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
                    callback(err);
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
                    from        : "Project",
                    localField  : "project",
                    foreignField: "_id", as: "project"
                }
            }, {
                $lookup: {
                    from        : "Invoice",
                    localField  : "invoice",
                    foreignField: "_id", as: "invoice"
                }
            }, {
                $lookup: {
                    from        : "workflows",
                    localField  : "workflow",
                    foreignField: "_id", as: "workflow"
                }
            }, {
                $lookup: {
                    from        : "Quotation",
                    localField  : "quotation",
                    foreignField: "_id", as: "quotation"
                }
            }, {
                $project: {
                    name     : 1,
                    workflow : {$arrayElemAt: ["$workflow", 0]},
                    type     : 1,
                    wTracks  : 1,
                    project  : {$arrayElemAt: ["$project", 0]},
                    budget   : 1,
                    quotation: {$arrayElemAt: ["$quotation", 0]},
                    invoice  : {$arrayElemAt: ["$invoice", 0]}
                }
            }, {
                $lookup: {
                    from        : "Payment",
                    localField  : "invoice._id",
                    foreignField: "invoice._id", as: "payments"
                }
            }, {
                $project: {
                    order    : {
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
                    name     : 1,
                    workflow : 1,
                    type     : 1,
                    wTracks  : 1,
                    project  : 1,
                    budget   : 1,
                    quotation: 1,
                    invoice  : 1,
                    payment  : {
                        paid : {$sum: '$payments.paidAmount'},
                        count: {$size: '$payments'}
                    }
                }
            }, {
                $group: {
                    _id             : null,
                    'type'          : {
                        $addToSet: {
                            _id : '$type',
                            name: '$type'
                        }
                    },
                    'workflow'      : {
                        $addToSet: {
                            _id : '$workflow._id',
                            name: '$workflow.name'
                        }
                    },
                    'project'       : {
                        $addToSet: {
                            _id : '$project._id',
                            name: '$project.projectName'
                        }
                    },
                    'projectManager': {
                        $addToSet: {
                            _id : '$project.projectmanager._id',
                            name: '$project.projectmanager.name'
                        }
                    },
                    'paymentsCount' : {
                        $addToSet: {
                            _id : '$payment.count',
                            name: '$payment.count'
                        }
                    }
                }
            }
            ], function (err, result) {
                if (err) {
                    callback(err);
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
                },
                {
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
                                name: '$supplier.name'
                            }
                        },
                        'projectmanager': {
                            $addToSet: {
                                _id : '$project.projectmanager._id',
                                name: '$project.projectmanager.name'
                            }
                        },
                        //'type': {
                        //    $addToSet: {
                        //        _id : '$type',
                        //        name: '$type'
                        //    }
                        //},
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
                    callback(err);
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
                    callback(err);
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
    };
};

module.exports = Filters;