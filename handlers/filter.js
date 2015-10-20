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
    var _ = require('../node_modules/underscore');
    var async = require('async');

    this.getFiltersValues = function (req, res, next) {
        var lastDB = req.session.lastDb;

        var WTrack = models.get(lastDB, 'wTrack', wTrackSchema);
        var Customer = models.get(lastDB, 'Customers', CustomerSchema);
        var Employee = models.get(lastDB, 'Employee', EmployeeSchema);
        var Project = models.get(lastDB, 'Project', ProjectSchema);
        var Task = models.get(lastDB, 'Tasks', TaskSchema);
        var wTrackInvoice = models.get(lastDB, 'wTrackInvoice', wTrackInvoiceSchema);
        var customerPayments = models.get(lastDB, 'Payment', customerPaymentsSchema);
        var Product = models.get(lastDB, 'Products', productSchema);
        var Quotation = models.get(lastDB, 'Quotation', QuotationSchema);

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
               // Quotation       : getQuotationFiltersValues,
                salesQuotation       : getSalesQuotation,
                salesOrder      : getSalesOrders
               // Order      : getOrdersFiltersValues
            },
            function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });

        function getWtrackFiltersValues(callback) {
            WTrack.aggregate([
                {
                    $group: {
                        _id             : null,
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
                    callback(err);
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
                    callback(err);
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
                    callback(err);
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
                    callback(err);
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
                    callback(err);
                }

                result = result[0];

                callback(null, result);
            });
        };

        function getProjectFiltersValues(callback) {
            Project.aggregate([
                {
                    $group: {
                        _id             : null,
                        'name'          : {
                            $addToSet: {
                                _id : '$_id',
                                name: '$projectName'
                            }
                        },
                        'customer'      : {
                            $addToSet: {
                                _id : '$customer._id',
                                name: {'$ifNull': ['$customer.name', 'None']}
                            }
                        },
                        'workflow'      : {
                            $addToSet: {
                                _id : '$workflow._id',
                                name: {'$ifNull': ['$workflow.name', 'None']}
                            }
                        },
                        'projectmanager': {
                            $addToSet: {
                                _id : '$projectmanager._id',
                                name: {'$ifNull': ['$projectmanager.name', 'None']}
                            }
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    callback(err);
                }

                if (result) {
                    result = result[0];

                    callback(null, result);
                }

            });
        };

        function getTasksFiltersValues(callback) {
            Task.aggregate([
                {
                    $group: {
                        _id         : null,
                        'project'   : {
                            $addToSet: {
                                _id : '$project._id',
                                name: '$project.projectName'
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

                callback(null, result);
            });
        };

        function getSalesInvoiceFiltersValues(callback) {
            wTrackInvoice.aggregate([
                {
                    $match: {
                        forSales   : true,
                        invoiceType: 'wTrack'
                    }
                },
                {
                    $group: {
                        _id          : null,
                        'project'    : {
                            $addToSet: {
                                _id : '$project._id',
                                name: '$project.name'
                            }
                        },
                        'salesPerson': {
                            $addToSet: {
                                _id : '$salesPerson._id',
                                name: {'$ifNull': ['$salesPerson.name', 'None']}
                            }
                        },
                        'supplier'   : {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: {'$ifNull': ['$supplier.name', 'None']}
                            }
                        },
                        'workflow'   : {
                            $addToSet: {
                                _id : '$workflow._id',
                                name: {'$ifNull': ['$workflow.name', 'None']}
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

        function getCustomerPaymentsFiltersValues(callback) {
            customerPayments.aggregate([
                {
                    $match: {
                        forSale: true
                    }
                },
                {
                    $group: {
                        _id            : null,
                        'assigned'     : {
                            $addToSet: {
                                _id : '$invoice.assigned._id',
                                name: '$invoice.assigned.name'
                            }
                        },
                        'supplier'     : {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: {'$ifNull': ['$supplier.fullName', 'None']}
                            }
                        },
                        'paymentMethod': {
                            $addToSet: {
                                _id : '$paymentMethod._id',
                                name: {'$ifNull': ['$paymentMethod.name', 'None']}
                            }
                        },
                        'workflow'     : {
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

        function getSupplierPaymentsFiltersValues(callback) {
            customerPayments.aggregate([
                {
                    $match: {
                        forSale: false
                    }
                },
                {
                    $group: {
                        _id         : null,
                        'supplier'  : {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: '$supplier.fullName'
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
                        isOrder: false
                    }
                },
                {
                    $group: {
                        _id           : null,
                        'supplier': {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: '$supplier.name'
                            }
                        },
                        'workflow'  : {
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
                }


            });
        };

        function getSalesQuotation(callback){
            Quotation.aggregate([
                {
                    $match: {
                        forSales: true,
                        isOrder: false
                    }
                },
                {
                    $group: {
                        _id         : null,
                        'projectName'  : {
                            $addToSet: {
                                _id : '$project._id',
                                name: '$project.projectName'
                            }
                        },
                        'supplier': {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: '$supplier.name'
                            }
                        },
                        'projectmanager'      : {
                            $addToSet: {
                                _id : '$project.projectmanager._id',
                                name: '$project.projectmanager.name'
                            }
                        },
                        'workflow'  : {
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

                if (result && result.length){
                    result = result[0];
                    callback(null, result);
                }

            });
        }

        function getSalesOrders(callback){
            Quotation.aggregate([
                {
                    $match: {
                        forSales: true,
                        isOrder: true
                    }
                },
                {
                    $group: {
                        _id         : null,
                        'projectName'  : {
                            $addToSet: {
                                _id : '$project._id',
                                name: '$project.projectName'
                            }
                        },
                        'supplier': {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: '$supplier.name'
                            }
                        },
                        'projectmanager'      : {
                            $addToSet: {
                                _id : '$project.projectmanager._id',
                                name: '$project.projectmanager.name'
                            }
                        },
                        'workflow'  : {
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

                if (result && result.length){
                    result = result[0];
                    callback(null, result);
                }

            });
        }

        function getOrdersFiltersValues(callback){
            Quotation.aggregate([
                {
                    $match: {
                        forSales: false,
                        isOrder: true
                    }
                },
                {
                    $group: {
                        _id         : null,
                        'projectName'  : {
                            $addToSet: {
                                _id : '$project._id',
                                name: '$project.projectName'
                            }
                        },
                        'supplier': {
                            $addToSet: {
                                _id : '$supplier._id',
                                name: '$supplier.name'
                            }
                        },
                        'projectmanager'      : {
                            $addToSet: {
                                _id : '$project.projectmanager._id',
                                name: '$project.projectmanager.name'
                            }
                        },
                        'workflow'  : {
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

                if (result && result.length){
                    result = result[0];
                    callback(null, result);
                }

            });
        }

    };

};

module.exports = Filters;