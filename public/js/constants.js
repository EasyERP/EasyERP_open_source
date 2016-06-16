define([], function () {
    var filters = {
        wTrack: {
            employee: {
                displayName: 'Employee',
                backend    : 'employee._id',
                type       : 'ObjectId'
            },

            customer: {
                displayName: 'Customer',
                backend    : 'customer._id',
                type       : 'ObjectId'
            },

            project: {
                displayName: 'Project Name',
                backend    : 'project._id',
                type       : 'ObjectId'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id',
                type       : 'ObjectId'
            },

            month: {
                displayName: 'Month',
                backend    : 'month',
                type       : 'integer'
            },

            year: {
                displayName: 'Year',
                backend    : 'year',
                type       : 'integer'
            },

            week: {
                displayName: 'Week',
                backend    : 'week',
                type       : 'integer'
            },

            _type: {
                displayName: 'Type',
                backend    : '_type',
                type       : 'string'
            },

            isPaid: {
                displayName: 'Status',
                backend    : 'isPaid',
                type       : 'boolean'
            }
        },

        Persons: {
            name: {
                displayName: 'Full Name',
                backend    : '_id'
            },

            country: {
                displayName: 'Country',
                backend    : 'address.country'
            },

            services: {
                displayName: 'Services',
                backend    : 'services'
            }
        },

        DashVacation: {
            name: {
                displayName: 'Employee',
                backend    : 'employee'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id'
            }
        },

        Companies: {
            name: {
                displayName: 'Name',
                backend    : '_id'
            },

            country: {
                displayName: 'Country',
                backend    : 'address.country'
            },

            services: {
                displayName: 'Services',
                backend    : 'services'
            }
        },

        Employees: {
            name: {
                backend    : '_id',
                displayName: 'Full Name'
            },

            department: {
                backend    : 'department._id',
                displayName: 'Department'
            },

            manager: {
                backend    : 'manager._id',
                displayName: 'Manager'
            },

            jobPosition: {
                backend    : 'jobPosition._id',
                displayName: 'Job Position'
            }
        },

        Applications: {
            name: {
                displayName: 'Full Name',
                backend    : '_id'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id'
            },

            jobPosition: {
                displayName: 'Job Position',
                backend    : 'jobPosition._id'
            }
        },

        JobPositions: {
            name: {
                displayName: 'Name',
                backend    : 'name'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            },

            department: {
                displayName: 'Department',
                backend    : 'department'
            }
        },

        salesInvoices: {
            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesPerson: {
                displayName: 'Assigned',
                backend    : 'salesPerson._id'
            },

            project: {
                displayName: 'Project Name',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        ExpensesInvoice: {
            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        DividendInvoice: {
            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        salesProforma: {
            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesPerson: {
                displayName: 'Assigned',
                backend    : 'salesPerson._id'
            },

            project: {
                displayName: 'Project Name',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        Projects: {
            name: {
                displayName: 'Project Name',
                backend    : '_id'
            },

            customer: {
                displayName: 'Contact',
                backend    : 'customer._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            projectManager: {
                displayName: 'Project Manager',
                backend    : 'projectManager._id'
            }
        },

        Leads: {
            contactName: {
                displayName: 'Contact Name',
                backend    : 'contactName'
            },

            source: {
                displayName: 'Source',
                backend    : 'source'
            },

            workflow: {
                displayName: 'Stage',
                backend    : 'workflow._id'
            },

            salesPerson: {
                displayName: 'Sales Person',
                backend    : 'salesPerson._id'
            }
        },

        Opportunities: {
            customer: {
                displayName: 'Customer',
                backend    : 'customer._id'
            },

            workflow: {
                displayName: 'Stage',
                backend    : 'workflow._id'
            },

            salesPerson: {
                displayName: 'Sales Person',
                backend    : 'salesPerson._id'
            }
        },

        Tasks: {
            project: {
                displayName: 'Project',
                backend    : 'project'
            },

            summary: {
                displayName: 'Task Summary',
                backend    : 'summary'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            },

            assignedTo: {
                displayName: 'Assigned To',
                backend    : 'assignedTo'
            },

            type: {
                displayName: 'Type',
                backend    : 'type'
            }
        },

        customerPayments: {
            assigned: {
                displayName: 'Assigned',
                backend    : 'assigned._id'
            },

            supplier: {
                displayName: 'Company',
                backend    : 'supplier._id'
            },

            paymentMethod: {
                displayName: 'Payment way',
                backend    : 'paymentMethod._id'
            },

            name: {
                displayName: 'Name',
                backend    : '_id'
            }
        },

        supplierPayments: {
            supplier: {
                displayName: 'Employee',
                backend    : 'supplier._id'
            },

            paymentRef: {
                displayName: 'Bonus Type',
                backend    : 'paymentRef'
            },

            year: {
                displayName: 'Year',
                backend    : 'year'
            },

            month: {
                displayName: 'Month',
                backend    : 'month'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            }
        },

        ExpensesPayments: {
            supplier: {
                displayName: 'Employee',
                backend    : 'supplier._id'
            },

            year: {
                displayName: 'Year',
                backend    : 'year'
            },

            month: {
                displayName: 'Month',
                backend    : 'month'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            }
        },

        DividendPayments: {
            year: {
                displayName: 'Year',
                backend    : 'year'
            },

            month: {
                displayName: 'Month',
                backend    : 'month'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            }
        },

        Product: {
            name: {
                displayName: 'Product Name',
                backend    : '_id'
            },

            productType: {
                displayName: 'Product Type',
                backend    : 'info.productType'
            },

            canBeSold: {
                displayName: 'Can be Sold',
                backend    : 'canBeSold'
            },

            canBeExpensed: {
                displayName: 'Can be Expensed',
                backend    : 'canBeExpensed'
            },

            canBePurchased: {
                displayName: 'Can be Purchased',
                backend    : 'canBePurchased'
            }
        },

        salesProduct: {
            name: {
                displayName: 'Product Name',
                backend    : '_id'
            },

            productType: {
                displayName: 'Product Type',
                backend    : 'info.productType'
            },

            canBeSold: {
                displayName: 'Can be Sold',
                backend    : 'canBeSold'
            },

            canBeExpensed: {
                displayName: 'Can be Expensed',
                backend    : 'canBeExpensed'
            },

            canBePurchased: {
                displayName: 'Can be Purchased',
                backend    : 'canBePurchased'
            }
        },

        Quotations: {
            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        Invoices: {
            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        salesQuotations: {
            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        salesOrders: {
            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        Orders: {
            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        PayrollExpenses: {
            employee: {
                displayName: 'Employee',
                backend    : 'employee._id'
            },

            type: {
                displayName: 'Payment Type',
                backend    : 'type._id'
            },

            dataKey: {
                displayName: 'Data Key',
                backend    : 'dataKey'
            }
        },

        jobsDashboard: {
            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            type: {
                displayName: 'Type',
                backend    : 'type'
            },

            paymentsCount: {
                displayName: 'Payment Count',
                backend    : 'payment.count'
            }
        },

        salaryReport: {
            employee: {
                displayName: 'Employee',
                backend    : '_id'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id'
            },

            onlyEmployees: {
                displayName: 'Only Employees',
                backend    : 'onlyEmployees'
            }
        },

        journalEntry: {
            journalName: {
                displayName: 'Journal',
                backend    : 'journal.name'
            },

            sourceDocument: {
                displayName: 'Subject',
                backend    : 'sourceDocument.subject._id'
            },

            creditAccount: {
                displayName: 'Credit Account',
                backend    : 'journal.creditAccount._id'
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
        ORDERS            : 'Orders',
        INVOICES          : 'Invoices',
        QUOTATIONS        : 'Quotations',
        DASHBOARD         : 'Dashboard',
        DEGREES           : 'Degrees',
        SOURCEOFAPPLICANTS: 'SourceOfApplicants',
        LEADSWORKFLOW     : 'LeadsWorkflow',
        MYPROFILE         : 'myProfile',
        PRODUCT           : 'Product',
        SUPPLIERPAYMENTS  : 'supplierPayments',
        CUSTOMERPAYMENTS  : 'customerPayments',
        SALESQUOTATIONS   : 'salesQuotations',
        SALESORDERS       : 'salesOrders',
        SALESINVOICES     : 'salesInvoices',
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
        PRODUCTSETTINGS   : 'productSettings',
        INVOICEAGING      : 'invoiceAging',
        CHARTOFACCOUNT    : 'ChartOfAccount',
        JOURNAL           : 'journal',
        JOURNALENTRY      : 'journalEntry',
        INVENTORYREPORT   : 'inventoryReport',
        INVOICECHARTS     : 'invoiceCharts',
        SALARYREPORT      : 'salaryReport',
        TRIALBALANCE      : 'trialBalance',
        PROFITANDLOSS     : 'profitAndLoss',
        BALANCESHEET      : 'balanceSheet',
        CASHFLOW          : 'cashFlow',
        CLOSEMONTH        : 'closeMonth',
        SALESPROFORMA     : 'salesProforma',
        EXPENSESINVOICE   : 'ExpensesInvoice',
        EXPENSESPAYMENTS  : 'ExpensesPayments',
        DIVIDENDINVOICE   : 'DividendInvoice',
        DIVIDENDPAYMENTS  : 'DividendPayments',
        SETTINGSEMPLOYEE  : 'settingsEmployee',

        RESPONSES: {
            BAD_RESPONSE            : 'Please try again',
            CREATE_QUOTATION        : 'Supplier and project fields can not be empty!',
            CONFIRM_ORDER           : 'Please add at most one product to quotation',
            DOUBLE_EMPLOYEE_VACATION: 'Current Employee already has vacation line'
        },

        INVOICE_APPROVE_PROFILES: [
            1387275598000,
            1438768659000
        ],

        EXPENSESCAREGORY: '56459202624e48551dfe3b24',

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

        SELECTP_ROJECT: 'Please select a Project',

        IT_SERVICES: 'IT services',

        END_CONTRACT_WORKFLOW_ID: '52d2c1369b57890814000005',
        TRASH_BIN               : "<a class='fa fa - trash'></a>",

        DASH_VAC_WEEK_BEFORE    : 2,
        DASH_VAC_WEEK_AFTER     : 8,
        DASH_VAC_RANGE_WEEKS_MIN: 6,

        DEFAULT_ELEMENTS_PER_PAGE  : 100,
        DEFAULT_THUMBNAILS_PER_PAGE: 50,

        URLS: {
            PROFILES_FOR_DD           : '/profiles/forDd',
            CURRENT_USER              : '/users/current',
            USERS                     : '/users/',
            USERS_FOR_DD              : '/users/forDd',
            APPLICATIONS              : '/applications/',
            EMPLOYEES                 : '/employees/',
            CHARTOFACCOUNT            : '/ChartOfAccount/',
            COMPANIES                 : '/companies/',
            DEGREES                   : '/Degrees/',
            DEPARTMENTS               : '/departments/',
            EVENTS                    : '/Events/',
            HOLIDAY                   : '/Holiday/',
            INVOICES                  : '/invoices/',
            JOBPOSITIONS              : '/JobPositions/',
            JOURNALENTRY              : '/journalEntries/',
            JOURNAL                   : '/journals/',
            LEADS                     : '/leads/',
            MONTHHOURS                : '/monthHours/',
            OPPORTUNITIES             : '/Opportunities/',
            PAYMENT                   : '/payment/',
            PAYROLL                   : '/payroll/',
            PERSONS                   : '/persons/',
            PRODUCT                   : '/product/',
            PROFILES                  : '/profiles/',
            PROJECTS                  : '/projects/',
            PROJECTS_GET_FOR_WTRACK   : '/projects/getForWtrack',
            PROJECTS_GET_FOR_QUOTATION: '/projects/getForQuotation',
            QUOTATIONS                : '/quotations/',
            SOURCESOFAPPLICANTS       : '/SourcesOfApplicants/',
            TASKS                     : '/Tasks/',
            VACATION                  : '/vacation/',
            WTRACK                    : '/wTrack/',
            BIRTHDAYS                 : '/employees/birthdays/',
            BONUSTYPE                 : '/bonusType/',
            BONUSTYPE_FORDD           : '/bonusType/getForDD',
            CAPACITY                  : '/capacity/',
            PAYMENTCUSTOMERS          : '/payment/',
            EMPLOYEES_PERSONSFORDD    : '/employees/getPersonsForDd',
            CUSTOMERS                 : '/customers/',
            DASHBOARD_HR              : 'dashboard/hr',
            DASHBOARD_VACATION        : 'dashboard/vacation',
            EMPLOYEES_GETFORDD        : '/employees/getForDD',
            EMPLOYEES_ALPHABET        : '/employees/getEmployeesAlphabet',
            INVOICE_STATS             : '/invoices/stats/',
            REVENUE_SYNTHETIC         : 'revenue/synthetic',
            JOBS                      : '/jobs/',
            JOBS_DASHBOARD            : '/jobs/getForOverview',
            JOURNAL_ENTRY             : '/journalEntries/',
            WORKFLOWS                 : '/workflows/',
            MODULES                   : '/getModules',
            PAYMENT_SALARY            : '/payment/',
            PRIORITY                  : '/Priority',
            PRODUCT_ALPHABET          : '/product/getProductsAlphabet',
            CATEGORY                  : '/category/',
            PROJECT_DASHBOARD         : 'project/getProjectPMForDashboard',
            PAYMENT_SUPPLIER          : '/payment/',
            APPLICATIONS_WFLENGTH     : '/applications/getApplicationsLengthByWorkflows',
            APPLICATIONS_KANBAN       : '/applications/',
            EMPLOYEES_NATIONALITY     : '/employees/nationality',
            JOBPOSITIONS_JOBTYPE      : '/jobPositions/jobType',
            JOBPOSITIONS_FORDD        : '/jobPositions/getForDd',
            DEPARTMENTS_FORDD         : '/departments/getForDD',
            WORKFLOWS_FORDD           : '/workflows/getWorkflowsForDd',
            EMPLOYEES_RELATEDUSER     : '/employees/getForDdByRelatedUser',
            PROJECT_TYPE              : '/projects/projectType',
            EMPLOYEES_LANGUAGES       : '/employees/languages',
            DEPARTMENTS_FOREDITDD     : '/departments/getDepartmentsForEditDd',
            CURRENCY_FORDD            : '/currency/getForDd',
            SUPPLIER                  : '/supplier',
            WORKFLOWS_FETCH           : '/workflows/fetch',
            PAYMENT_AMOUNT_LEFT       : '/payment/amountLeftCalc'
        },

        MID: {
            Employees   : 42,
            Applications: 43,
            Persons     : 49,
            Companies   : 50
        },

        MIN_DATE: '2014-08-01',

        INVOICE_JOURNAL : '565ef6ba270f53d02ee71d65',
        PROFORMA_JOURNAL: '57035e4321f9b0c4313d4146',
        PAYMENT_TERMS   : '55536e52475b7be475f335f6',
        PAYMENT_METHOD  : '565f2e05ab70d49024242e07',
        END_OF_PROJECT  : 'To end of project',

        DEFAULT_SCREEN_WIDTH: 1349,
        PAGINATION_ARRAY    : [25, 50, 100, 200]
    };
});
