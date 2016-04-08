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
        Leads           : {
            'Contact Name': {
                view   : 'contactName',
                backend: 'contactName'
            },
            'Source'      : {
                view   : 'source',
                backend: 'source'
            },
            'Stage'       : {
                view   : 'workflow',
                backend: 'workflow._id'
            },
            'Sales Person': {
                view   : 'salesPerson',
                backend: 'salesPerson._id'
            }
        },
        Opportunities   : {
            'Customer'    : {
                view   : 'customer',
                backend: 'customer._id'
            },
            'Stage'       : {
                view   : 'workflow',
                backend: 'workflow._id'
            },
            'Sales Person': {
                view   : 'salesPerson',
                backend: 'salesPerson._id'
            }
        },
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
            "Employee"      : {
                view   : 'employee',
                backend: '_id'
            },
            "Department"    : {
                view   : 'department',
                backend: 'department._id'
            },
            "Only Employees": {
                view   : 'onlyEmployees',
                backend: 'onlyEmployees'
            }
        },
        "journalEntry"  : {
            "Journal"       : {
                view   : 'journalName',
                backend: 'journal.name'
            },
            "Subject"       : {
                view   : 'sourceDocument',
                backend: 'sourceDocument.subject._id'
            },
            "Credit Account": {
                view   : 'creditAccount',
                backend: 'journal.creditAccount._id'
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
        TRIALBALANCE      : "trialBalance",
        PROFITANDLOSS     : "profitAndLoss",
        BALANCESHEET      : 'balanceSheet',
        CASHFLOW          : 'cashFlow',
        CLOSEMONTH        : 'closeMonth',

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

        END_CONTRACT_WORKFLOW_ID : "52d2c1369b57890814000005",
        TRASH_BIN   : '<a class="fa fa-trash"></a>',

        DASH_VAC_WEEK_BEFORE: 2,
        DASH_VAC_WEEK_AFTER : 8,

        DEFAULT_ELEMENTS_PER_PAGE: 100,

        URLS: {
            PROFILES_FOR_DD       : '/profiles/forDd',
            CURRENT_USER          : '/users/current',
            USERS                 : '/users/',
            USERS_FOR_DD          : '/users/forDd',
            APPLICATIONS          : '/applications/',
            EMPLOYEES             : '/employees/',
            CHARTOFACCOUNT        : '/ChartOfAccount/',
            COMPANIES             : '/companies/',
            DEGREES               : '/Degrees/',
            DEPARTMENTS           : '/Departments/',
            EVENTS                : '/Events/',
            HOLIDAY               : '/Holiday/',
            INVOICE               : '/Invoice/',
            JOBPOSITIONS          : '/JobPositions/',
            JOURNALENTRY          : '/journalEntry/',
            JOURNAL               : '/journal/',
            LEADS                 : '/leads/',
            MONTHHOURS            : '/monthHours/',
            OPPORTUNITIES         : '/Opportunities/',
            PAYMENT               : '/payment/',
            PAYROLL               : '/payroll/',
            PERSONS               : '/persons/',
            PRODUCT               : '/product/',
            PROFILES              : '/profiles/',
            PROJECTS              : '/Projects/',
            QUOTATION             : '/quotation/',
            SOURCESOFAPPLICANTS   : '/SourcesOfApplicants/',
            TASKS                 : '/Tasks/',
            VACATION              : '/vacation/',
            WTRACK                : '/wTrack/',
            BIRTHDAYS             : '/employees/birthdays/',
            BONUSTYPE             : '/bonusType/',
            CAPACITY              : '/capacity/',
            PAYMENTCUSTOMERS      : '/payment/customers/',
            EMPLOYEES_PERSONSFORDD: '/employees/getPersonsForDd',
            CUSTOMERS             : '/customers/',
            DASHBOARD_HR          : 'dashboard/hr',
            DASHBOARD_VACATION    : 'dashboard/vacation',
            EMPLOYEES_GETFORDD    : "/employees/getForDD",
            EMPLOYEES_ALPHABET    : "/employees/getEmployeesAlphabet",
            INVOICE_STATS         : "/invoice/stats/",
            REVENUE_SYNTHETIC     : 'revenue/synthetic',
            JOBS                  : '/jobs/',
            JOURNAL_ENTRY         : "/journal/journalEntry/",
            WORKFLOWS             : '/workflows/',
            MODULES               : "/getModules",
            PAYMENT_SALARY        : "/payment/salary/",
            PRIORITY              : "/Priority",
            PRODUCT_ALPHABET      : "/product/getProductsAlphabet",
            CATEGORY              : "/category/",
            PROJECT_DASHBOARD     : "project/getProjectPMForDashboard",
            PAYMENT_SUPPLIER      : "/payment/supplier/",
            APPLICATIONS_WFLENGTH : '/applications/getApplicationsLengthByWorkflows',
            APPLICATIONS_KANBAN   : '/applications/kanban',
            EMPLOYEES_NATIONALITY : "/employees/nationality",
            JOBPOSITIONS_JOBTYPE  : "/jobPositions/jobType",
            JOBPOSITIONS_FORDD    : "/jobPositions/getForDd",
            DEPARTMENTS_FORDD     : "/departments/getForDD",
            WORKFLOWS_FORDD       : "/workflows/getWorkflowsForDd",
            EMPLOYEES_RELATEDUSER : "/employees/getForDdByRelatedUser",
            PROJECT_TYPE          : '/projectType',
            EMPLOYEES_LANGUAGES   : "/employees/languages",
            DEPARTMENTS_FOREDITDD : "/departments/getDepartmentsForEditDd",
            CURRENCY_FORDD        : "/currency/getForDd",
            SUPPLIER              : '/supplier',
            WORKFLOWS_FETCH       : '/workflows/fetch',
            PAYMENT_AMOUNT_LEFT   : '/payment/amountLeftCalc'
        },

        MID: {
            'Employees'   : 42,
            'Applications': 43,
            'Persons'     : 49,
            'Companies'   : 50
        },

        INVOICE_JOURNAL: '565ef6ba270f53d02ee71d65',
        PROFORMA_JOURNAL: '57035e4321f9b0c4313d4146'
    };
});