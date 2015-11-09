/**
 * Created by Roman on 23.04.2015.
 */
define([], function () {
    var filters = {
        wTrack          : {
            'Assigned'    : {
                view   : 'projectManager',
                backend: 'project.projectmanager._id'
            },
            'Employee'    : {
                view   : 'employee',
                backend: 'employee._id'
            },
            'Customer'    : {
                view   : 'customer',
                backend: 'project.customer._id'
            },
            'Project Name': {
                view   : 'projectName',
                backend: 'project._id'
            },
            'Department'  : {
                view   : 'department',
                backend: 'department._id'
            },
            'Month'       : {
                view   : 'month',
                backend: 'month'
            },
            'Year'        : {
                view   : 'year',
                backend: 'year'
            },
            'Week'        : {
                view   : 'week',
                backend: 'week'
            },
            'Status'      : {
                view   : 'isPaid',
                backend: 'isPaid'
            }
        },
        Persons         : {
            'Full Name': {
                view   : 'name',
                backend: '_id'
            },
            'Country'  : {
                view   : 'country',
                backend: 'address.country'
            },
            'Services' : {
                view   : 'services',
                backend: 'services'
            }
        },
        DashVacation         : {
            'Employee'   : {
                view   : 'name',
                backend: 'employee'
            },
            'Department'  : {
                view   : 'department',
                backend: 'department._id'
            }
        },
        Companies       : {
            'Name'    : {
                view   : 'name',
                backend: '_id'
            },
            'Country' : {
                view   : 'country',
                backend: 'address.country'
            },
            'Services': {
                view   : 'services',
                backend: 'services'
            }
        },
        Employees       : {
            'Full Name'   : {
                view   : 'name',
                backend: '_id'
            },
            'Department'  : {
                view   : 'department',
                backend: 'department._id'
            },
            'Manager'     : {
                view   : 'manager',
                backend: 'manager._id'
            },
            'Job Position': {
                view   : 'jobPosition',
                backend: 'jobPosition._id'
            }
        },
        Applications    : {
            'Full Name'   : {
                view   : 'name',
                backend: '_id'
            },
            'Department'  : {
                view   : 'department',
                backend: 'department._id'
            },
            /*'Manager': {
             view: 'manager',
             backend: 'manager._id'
             },*/
            'Job Position': {
                view   : 'jobPosition',
                backend: 'jobPosition._id'
            }
        },
        JobPositions    : {
            'Name'      : {
                view   : 'name',
                backend: 'name'
            },
            'Status'    : {
                view   : 'workflow',
                backend: 'workflow'
            },
            'Department': {
                view   : 'department',
                backend: 'department'
            }
        },
        salesInvoice    : {
            'Customer'    : {
                view   : 'supplier',
                backend: 'supplier._id'
            },
            'Assigned'    : {
                view   : 'salesPerson',
                backend: 'salesPerson._id'
            },
            'Project Name': {
                view   : 'project',
                backend: 'project._id'
            }
            ,
            'Status'      : {
                view   : 'workflow',
                backend: 'workflow._id'
            }
        },
        Projects        : {
            'Project Name' : {
                view   : 'name',
                backend: '_id'
            },
            'Contact'      : {
                view   : 'customer',
                backend: 'customer._id'
            },
            'Status'       : {
                view   : 'workflow',
                backend: 'workflow._id'
            },
            'Sales Manager': {
                view   : 'projectmanager',
                backend: 'projectmanager._id'
            }
        },
        Leads           : {},
        Opportunities   : {},
        Tasks           : {
            'Project'    : {
                view   : 'project',
                backend: 'project'
            },
            'Status'     : {
                view   : 'workflow',
                backend: 'workflow'
            },
            'Assigned To': {
                view   : 'assignedTo',
                backend: 'assignedTo'
            },
            'Type'       : {
                view   : 'type',
                backend: 'type'
            },
        },
        customerPayments: {
            'Assigned'   : {
                view   : 'assigned',
                backend: 'invoice.assigned._id'
            },
            'Company'    : {
                view   : 'supplier',
                backend: 'supplier._id'
            },
            'Payment Way': {
                view   : 'paymentMethod',
                backend: 'paymentMethod._id'
            },
            'Name'     : {
                view   : 'name',
                backend: '_id'
            },
            'Status'     : {
                view   : 'workflow',
                backend: 'workflow'
            }
        },
        supplierPayments: {
            'Employee'  : {
                view   : 'supplier',
                backend: 'supplier._id'
            },
            'Bonus Type': {
                view   : 'paymentRef',
                backend: 'paymentRef'
            },
            'Year'      : {
                view   : 'year',
                backend: 'year'
            },
            'Month'     : {
                view   : 'month',
                backend: 'month'
            },
            'Status'    : {
                view   : 'workflow',
                backend: 'workflow'
            }
        },
        Product         : {
            'Product Name'    : {
                view   : 'name',
                backend: '_id'
            },
            'Product Type'    : {
                view   : 'productType',
                backend: 'info.productType'
            },
            'Can be Sold'     : {
                view   : 'canBeSold',
                backend: 'canBeSold'
            },
            'Can be Expensed' : {
                view   : 'canBeExpensed',
                backend: 'canBeExpensed'
            },
            'Can be Purchased': {
                view   : 'canBePurchased',
                backend: 'canBePurchased'
            }
        },
        salesProduct    : {
            'Product Name'    : {
                view   : 'name',
                backend: '_id'
            },
            'Product Type'    : {
                view   : 'productType',
                backend: 'info.productType'
            },
            'Can be Sold'     : {
                view   : 'canBeSold',
                backend: 'canBeSold'
            },
            'Can be Expensed' : {
                view   : 'canBeExpensed',
                backend: 'canBeExpensed'
            },
            'Can be Purchased': {
                view   : 'canBePurchased',
                backend: 'canBePurchased'
            }
        },
        Quotation       : {
            'Supplier': {
                view   : 'supplier',
                backend: 'supplier._id'
            },
            'Status'  : {
                view   : 'workflow',
                backend: 'workflow._id'
            }
        },
        salesQuotation  : {
            'Project'      : {
                view   : 'projectName',
                backend: 'project._id'
            },
            'Customer'     : {
                view   : 'supplier',
                backend: 'supplier._id'
            },
            'Sales Manager': {
                view   : 'projectmanager',
                backend: 'project.projectmanager._id'
            },
            'Status'       : {
                view   : 'workflow',
                backend: 'workflow._id'
            }
        },
        salesOrder      : {
            'Project'      : {
                view   : 'projectName',
                backend: 'project._id'
            },
            'Customer'     : {
                view   : 'supplier',
                backend: 'supplier._id'
            },
            'Sales Manager': {
                view   : 'projectmanager',
                backend: 'project.projectmanager._id'
            },
            'Status'       : {
                view   : 'workflow',
                backend: 'workflow._id'
            }
        },
        Order           : {
            'Supplier': {
                view   : 'supplier',
                backend: 'supplier._id'
            },
            'Status'  : {
                view   : 'workflow',
                backend: 'workflow._id'
            }
        },
        Payroll         : {
            'Employee': {
                view   : 'employee',
                backend: 'employee._id'
            },/*
            'Month'   : {
                view   : 'month',
                backend: 'month'
            },
            'Year'    : {
                view   : 'year',
                backend: 'year'
            },*/
            'Data Key'    : {
                view   : 'dataKey',
                backend: 'dataKey'
            },
        }
    };

    return {
        PERSONS           : 'Persons',
        COMPANIES         : 'Companies',
        LEADS             : 'Leads',
        OPPORTUNITIES     : 'Opportunities',
        PROJECTS          : 'Projects',
        TASKS             : 'Tasks',
        EMPLOYEES         : 'Employees',
        APPLICATIONS      : 'Applications',
        JOBPOSITIONS      : 'JobPositions',
        BIRTHDAYS         : 'Birthdays',
        DEPARTMENTS       : 'Departments',
        USERS             : 'Users',
        PROFILES          : 'Profiles',
        ORDER             : 'Order',
        INVOICE           : 'Invoice',
        QUOTATION         : 'Quotation',
        DASHBOARD         : 'Dashboard',
        DEGREES           : 'Degrees',
        SOURCEOFAPPLICANTS: 'SourceOfApplicants',
        LEADSWORKFLOW     : 'LeadsWorkflow',
        MYPROFILE         : 'myProfile',
        PRODUCT           : 'Product',
        SUPPLIERPAYMENTS  : 'supplierPayments',
        CUSTOMERPAYMENTS  : 'customerPayments',
        SALESQUOTATION    : 'salesQuotation',
        SALESORDER        : 'salesOrder',
        SALESINVOICE      : 'salesInvoice',
        SALESPRODUCT      : 'salesProduct',
        WTRACK            : 'wTrack',
        PAYROLL           : 'Payroll',
        REVENUE           : 'Revenue',
        MONTHHOURS        : 'monthHours',
        BONUSTYPE         : 'bonusType',
        HOLIDAY           : 'Holiday',
        VACATION          : 'Vacation',
        ATTENDANCE        : 'Attendance',
        DASHBOARD_VACATION: 'DashBoardVacation',
        DASHBOARD_HR      : 'HrDashboard',
        HOURS             : 'Hours',
        CAPACITY          : 'Capacity',

        RESPONSES: {
            BAD_RESPONSE            : 'Please try again',
            CREATE_QUOTATION        : 'Supplier and project fields can not be empty!',
            CONFIRM_ORDER           : 'Please add at most one product to quotation',
            DOUBLE_EMPLOYEE_VACATION: 'Current Employee already has vacation line'
        },

        WTRACK_DB_NAME   : 'weTrack',
        FILTERS          : filters,
        FILTERVALUESCOUNT: 7,
        DEPARTMENTS_ORDER: [
            'iOS',
            'Android',
            'Web',
            'WP',
            'QA',
            'Design',
            'PM'
        ],
    }
});