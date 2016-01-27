/**
 * Created by Roman on 23.04.2015.
 */
define([], function () {
    var filters = {
        wTrack          : {
            'Assigned'    : {
                view   : 'projectManager',
                backend: 'projectmanager._id',
                type   : 'ObjectId'
            },
            'Employee'    : {
                view   : 'employee',
                backend: 'employee._id',
                type   : 'ObjectId'
            },
            'Customer'    : {
                view   : 'customer',
                backend: 'customer._id',
                type   : 'ObjectId'
            },
            'Project Name': {
                view   : 'projectName',
                backend: 'project._id',
                type   : 'ObjectId'
            },
            'Department'  : {
                view   : 'department',
                backend: 'department._id',
                type   : 'ObjectId'
            },
            'Month'       : {
                view   : 'month',
                backend: 'month',
                type   : 'integer'
            },
            'Year'        : {
                view   : 'year',
                backend: 'year',
                type   : 'integer'
            },
            'Week'        : {
                view   : 'week',
                backend: 'week',
                type   : 'integer'
            },
            'Status'      : {
                view   : 'isPaid',
                backend: 'isPaid',
                type   : 'boolean'
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
        DashVacation    : {
            'Employee'  : {
                view   : 'name',
                backend: 'employee'
            },
            'Department': {
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
            'Project'     : {
                view   : 'project',
                backend: 'project'
            },
            'Task Summary': {
                view   : 'summary',
                backend: 'summary'
            },
            'Status'      : {
                view   : 'workflow',
                backend: 'workflow'
            },
            'Assigned To' : {
                view   : 'assignedTo',
                backend: 'assignedTo'
            },
            'Type'        : {
                view   : 'type',
                backend: 'type'
            }
        },
        customerPayments: {
            'Assigned'   : {
                view   : 'assigned',
                backend: 'assigned._id'
            },
            'Company'    : {
                view   : 'supplier',
                backend: 'supplier._id'
            },
            'Payment way': {
                view   : 'paymentMethod',
                backend: 'paymentMethod._id'
            },
            'Name'       : {
                view   : 'name',
                backend: '_id'
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
        Invoice         : {
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
                backend: 'projectmanager._id'
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
                backend: 'projectmanager._id'
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
        PayrollExpenses : {
            'Employee'    : {
                view   : 'employee',
                backend: 'employee._id'
            },
            'Payment Type': {
                view   : 'type',
                backend: 'type._id'
            },
            'Data Key'    : {
                view   : 'dataKey',
                backend: 'dataKey'
            }
        },
        "jobsDashboard" : {
            "Sales Manager": {
                view   : 'projectManager',
                backend: 'projectmanager._id'
            },
            "Project"      : {
                view   : 'project',
                backend: 'project._id'
            },
            "Status"       : {
                view   : 'workflow',
                backend: 'workflow._id'
            },
            "Type"         : {
                view   : 'type',
                backend: 'type'
            },
            "Payment Count": {
                view   : 'paymentsCount',
                backend: 'payment.count'
            }
        },
        "salaryReport"  : {
            "Employee"  : {
                view   : 'employee',
                backend: '_id'
            },
            "Department": {
                view   : 'department',
                backend: 'department._id'
            }
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
        PAYROLLEXPENSES   : 'PayrollExpenses',
        REVENUE           : 'Revenue',
        MONTHHOURS        : 'monthHours',
        BONUSTYPE         : 'bonusType',
        HOLIDAY           : 'Holiday',
        VACATION          : 'Vacation',
        ATTENDANCE        : 'Attendance',
        DASHBOARD_VACATION: 'DashBoardVacation',
        DASHBOARD_HR      : 'HrDashboard',
        EFFICIENCY        : 'Efficiency',
        CAPACITY          : 'Capacity',
        JOBSDASHBOARD     : 'jobsDashboard',
        PAYROLLPAYMENTS   : 'PayrollPayments',
        PRODUCTSETTINGS   : "productSettings",
        INVOICEAGING      : "invoiceAging",
        CHARTOFACCOUNT    : "ChartOfAccount",
        JOURNAL           : "journal",
        JOURNALENTRY      : "journalEntry",
        INVOICECHARTS     : "invoiceCharts",
        SALARYREPORT      : "salaryReport",

        RESPONSES: {
            BAD_RESPONSE            : 'Please try again',
            CREATE_QUOTATION        : 'Supplier and project fields can not be empty!',
            CONFIRM_ORDER           : 'Please add at most one product to quotation',
            DOUBLE_EMPLOYEE_VACATION: 'Current Employee already has vacation line'
        },

        EXPENSESCAREGORY: "56459202624e48551dfe3b24",

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
        SELECTP_ROJECT   : 'Please select a Project',

        IT_SERVICES: 'IT services',

        DASH_VAC_WEEK_BEFORE: 2,
        DASH_VAC_WEEK_AFTER : 8,

        MID: {
            'Employees'   : 42,
            'Applications': 43
        }
    };
});