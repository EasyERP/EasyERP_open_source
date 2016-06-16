define([], function () {
    return [
        {
            _id        : 19,
            attachments: [],
            link       : false,
            mname      : 'Sales',
            parrent    : null,
            sequence   : 1,
            visible    : true,
            ancestors  : [],
            href       : 'Sales'
        },
        {
            _id        : 36,
            attachments: [],
            link       : false,
            mname      : 'Project',
            parrent    : null,
            sequence   : 2,
            visible    : true,
            ancestors  : [],
            href       : 'Project'
        },
        {
            _id        : 9,
            attachments: [],
            link       : false,
            mname      : 'HR',
            parrent    : null,
            sequence   : 3,
            visible    : true,
            ancestors  : [],
            href       : 'HR'
        },
        {
            _id        : 24,
            attachments: [],
            link       : true,
            mname      : 'Leads',
            parrent    : 19,
            sequence   : 5,
            visible    : true,
            ancestors  : [],
            href       : 'Leads'
        },
        {
            _id        : 25,
            attachments: [],
            link       : true,
            mname      : 'Opportunities',
            parrent    : 19,
            sequence   : 6,
            visible    : true,
            ancestors  : [],
            href       : 'Opportunities'
        },
        {
            _id        : 49,
            attachments: [],
            htref      : 'persons',
            link       : true,
            mname      : 'Persons',
            parrent    : 19,
            sequence   : 7,
            visible    : true,
            ancestors  : [],
            href       : 'Persons'
        },
        {
            _id        : 50,
            attachments: [],
            htref      : 'persons',
            link       : true,
            mname      : 'Companies',
            parrent    : 19,
            sequence   : 8,
            visible    : true,
            ancestors  : [],
            href       : 'Companies'
        },
        {
            _id        : 39,
            attachments: [],
            link       : true,
            mname      : 'Projects',
            parrent    : 36,
            sequence   : 21,
            visible    : true,
            ancestors  : [],
            href       : 'Projects'
        },
        {
            _id      : 73,
            mname    : 'Dashboard Vacation',
            sequence : 22,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'DashBoardVacation'
        },
        {
            _id        : 40,
            attachments: [],
            link       : true,
            mname      : 'Tasks',
            parrent    : 36,
            sequence   : 24,
            visible    : true,
            ancestors  : [],
            href       : 'Tasks'
        },
        {
            _id        : 29,
            attachments: [],
            link       : true,
            mname      : 'Dashboard',
            parrent    : 19,
            sequence   : 29,
            visible    : true,
            ancestors  : [],
            href       : 'Dashboard'
        },
        {
            _id        : 42,
            attachments: [],
            link       : true,
            mname      : 'Employees',
            parrent    : 9,
            sequence   : 29,
            visible    : true,
            ancestors  : [],
            href       : 'Employees'
        },
        {
            _id        : 43,
            attachments: [],
            link       : true,
            mname      : 'Applications',
            parrent    : 9,
            sequence   : 30,
            visible    : true,
            ancestors  : [],
            href       : 'Applications'
        },
        {
            _id        : 14,
            attachments: [],
            link       : true,
            mname      : 'Job Positions',
            parrent    : 9,
            sequence   : 32,
            visible    : true,
            ancestors  : [],
            href       : 'JobPositions'
        },
        {
            _id        : 15,
            attachments: [],
            link       : true,
            mname      : 'Groups',
            parrent    : 1,
            sequence   : 33,
            visible    : true,
            ancestors  : [],
            href       : 'Departments'
        },
        {
            _id        : 7,
            __v        : 0,
            attachments: [],
            link       : true,
            mname      : 'Users',
            parrent    : 1,
            sequence   : 42,
            visible    : true,
            ancestors  : [],
            href       : 'Users'
        },
        {
            _id        : 44,
            attachments: [],
            link       : true,
            mname      : 'Workflows',
            parrent    : 1,
            sequence   : 44,
            visible    : true,
            ancestors  : [],
            href       : 'Workflows'
        },
        {
            _id        : 51,
            attachments: [],
            link       : true,
            mname      : 'Profiles',
            parrent    : 1,
            sequence   : 51,
            visible    : true,
            ancestors  : [],
            href       : 'Profiles'
        },
        {
            _id        : 52,
            attachments: [],
            link       : true,
            mname      : 'Birthdays',
            parrent    : 9,
            sequence   : 52,
            visible    : true,
            ancestors  : [],
            href       : 'Birthdays'
        },
        {
            _id        : 53,
            attachments: [],
            link       : true,
            mname      : 'Dashboard',
            parrent    : 36,
            sequence   : 53,
            visible    : true,
            ancestors  : [],
            href       : 'projectDashboard'
        },
        {
            _id      : 54,
            mname    : 'Purchases',
            sequence : 54,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : 'Purchases'
        },
        {
            _id      : 80,
            mname    : 'Jobs Dashboard',
            sequence : 54,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'jobsDashboard'
        },
        {
            _id      : 55,
            mname    : 'Quotations',
            sequence : 55,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Quotations'
        },
        {
            _id      : 57,
            mname    : 'Orders',
            sequence : 56,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Orders'
        },
        {
            _id      : 56,
            mname    : 'Invoice',
            sequence : 57,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Invoice'
        },
        {
            _id      : 58,
            mname    : 'Product',
            sequence : 58,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Product'
        },
        {
            _id      : 59,
            mname    : 'Accounting',
            sequence : 59,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : 'Accounting'
        },
        {
            _id      : 60,
            mname    : 'Supplier Payments',
            sequence : 60,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'supplierPayments'
        },
        {
            _id      : 61,
            mname    : 'Sales Payments',
            sequence : 61,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'customerPayments'
        },
        {
            _id      : 62,
            mname    : 'Quotations',
            sequence : 62,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'salesQuotations'
        },
        {
            _id      : 63,
            mname    : 'Orders',
            sequence : 63,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'salesOrders'
        },
        {
            _id      : 64,
            mname    : 'Invoice',
            sequence : 64,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'salesInvoices'
        },
        {
            _id      : 99,
            mname    : 'Proforma',
            sequence : 65,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'salesProforma'
        },
        {
            _id      : 67,
            mname    : 'Profit',
            sequence : 67,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Revenue'
        },
        {
            _id      : 68,
            mname    : 'MonthHours',
            sequence : 68,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'monthHours'
        },
        {
            _id      : 69,
            mname    : 'Holidays',
            sequence : 69,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Holiday'
        },
        {
            _id      : 77,
            mname    : 'Capacity',
            sequence : 69,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Capacity'
        },
        {
            _id      : 88,
            mname    : 'Salary Report',
            sequence : 69,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'salaryReport'
        },
        {
            _id      : 70,
            mname    : 'Vacation',
            sequence : 70,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Vacation'
        },
        {
            _id      : 71,
            mname    : 'Attendance',
            sequence : 71,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Attendance'
        },
        {
            _id      : 76,
            mname    : 'Efficiency',
            sequence : 72,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Efficiency'
        },
        {
            _id      : 72,
            mname    : 'Bonus Type',
            sequence : 73,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'bonusType'
        },
        {
            _id      : 74,
            mname    : 'HrDashboard',
            sequence : 74,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'HrDashboard'
        },
        {
            _id      : 66,
            mname    : 'Payroll Expenses',
            sequence : 77,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'PayrollExpenses'
        },
        {
            _id      : 78,
            mname    : 'Payroll',
            sequence : 78,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : 'Payroll'
        },
        {
            _id      : 79,
            mname    : 'Payroll Payments',
            sequence : 79,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'PayrollPayments'
        },
        {
            _id      : 82,
            mname    : 'Invoice Aging',
            sequence : 82,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'invoiceAging'
        },
        {
            _id      : 83,
            mname    : 'Chart Of Account',
            sequence : 83,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'ChartOfAccount'
        },
        {
            _id      : 100,
            mname    : 'Inventory Report',
            sequence : 83,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'inventoryReport'
        },
        {
            _id      : 85,
            mname    : 'Journal',
            sequence : 85,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'journal'
        },
        {
            _id      : 86,
            mname    : 'Journal Entry',
            sequence : 86,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'journalEntry'
        },
        {
            _id      : 87,
            mname    : 'Invoice Charts',
            sequence : 87,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'invoiceCharts'
        },
        {
            _id      : 89,
            mname    : 'Trial Balance',
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'trialBalance'
        },
        {
            _id      : 91,
            mname    : 'Profit And Loss',
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'profitAndLoss'
        },
        {
            _id      : 92,
            mname    : 'Balance Sheet',
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'balanceSheet'
        },
        {
            _id      : 93,
            mname    : 'Cash Flow',
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'cashFlow'
        },
        {
            _id      : 94,
            mname    : 'Close Month',
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'closeMonth'
        },
        {
            _id      : 96,
            mname    : 'Expenses',
            sequence : 96,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : 'Expenses'
        },
        {
            _id      : 97,
            mname    : 'Invoice',
            sequence : 97,
            parrent  : 96,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'ExpensesInvoice'
        },
        {
            _id      : 98,
            mname    : 'Expenses Payments',
            sequence : 98,
            parrent  : 96,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'ExpensesPayments'
        },
        {
            _id      : 101,
            mname    : 'Dividend declaration',
            sequence : 101,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'DividendInvoice'
        },
        {
            _id      : 102,
            mname    : 'Dividend Payments',
            sequence : 101,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'DividendPayments'
        },
        {
            _id      : 103,
            link     : true,
            mname    : 'Settings Employee',
            parrent  : 1,
            sequence : 103,
            visible  : true,
            ancestors: [],
            href     : 'settingsEmployee'
        },
        {
            _id        : 1,
            __v        : 0,
            attachments: [],
            link       : false,
            mname      : 'Settings',
            parrent    : null,
            sequence   : 1000,
            visible    : true,
            ancestors  : [],
            href       : 'Settings'
        },
        {
            _id      : 75,
            mname    : 'tCard',
            sequence : 1000,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'wTrack'
        },
        {
            _id      : 84,
            mname    : 'Product Categories',
            sequence : 1000,
            parrent  : 1,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'productSettings'
        }
    ];
});
