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
        }, {
            _id        : 36,
            attachments: [],
            link       : false,
            mname      : 'Project',
            parrent    : null,
            sequence   : 2,
            visible    : true,
            ancestors  : [],
            href       : 'Project'
        }, {
            _id        : 9,
            attachments: [],
            link       : false,
            mname      : 'HR',
            parrent    : null,
            sequence   : 3,
            visible    : true,
            ancestors  : [],
            href       : 'HR'
        }, {
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
        }, {
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
        }, {
            _id        : 24,
            attachments: [],
            link       : true,
            mname      : 'Leads',
            parrent    : 19,
            sequence   : 9,
            visible    : true,
            ancestors  : [],
            href       : 'Leads'
        }, {
            _id        : 25,
            attachments: [],
            link       : true,
            mname      : 'Opportunities',
            parrent    : 19,
            sequence   : 10,
            visible    : true,
            ancestors  : [],
            href       : 'Opportunities'
        }, {
            _id        : 39,
            attachments: [],
            link       : true,
            mname      : 'Projects',
            parrent    : 36,
            sequence   : 23,
            visible    : true,
            ancestors  : [],
            href       : 'Projects'
        }, {
            _id        : 40,
            attachments: [],
            link       : true,
            mname      : 'Tasks',
            parrent    : 36,
            sequence   : 24,
            visible    : true,
            ancestors  : [],
            href       : 'Tasks'
        }, {
            _id        : 29,
            attachments: [],
            link       : true,
            mname      : 'Dashboard',
            parrent    : 19,
            sequence   : 29,
            visible    : true,
            ancestors  : [],
            href       : 'Dashboard'
        }, {
            _id        : 42,
            attachments: [],
            link       : true,
            mname      : 'Employees',
            parrent    : 9,
            sequence   : 29,
            visible    : true,
            ancestors  : [],
            href       : 'Employees'
        }, {
            _id        : 43,
            attachments: [],
            link       : true,
            mname      : 'Applications',
            parrent    : 9,
            sequence   : 30,
            visible    : true,
            ancestors  : [],
            href       : 'Applications'
        }, {
            _id        : 14,
            attachments: [],
            link       : true,
            mname      : 'Job Positions',
            parrent    : 9,
            sequence   : 32,
            visible    : true,
            ancestors  : [],
            href       : 'JobPositions'
        }, {
            _id        : 15,
            attachments: [],
            link       : true,
            mname      : 'Groups',
            parrent    : 1,
            sequence   : 33,
            visible    : true,
            ancestors  : [],
            href       : 'Departments'
        }, {
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
        }, {
            _id        : 44,
            attachments: [],
            link       : true,
            mname      : 'Workflows',
            parrent    : 1,
            sequence   : 44,
            visible    : true,
            ancestors  : [],
            href       : 'Workflows'
        }, {
            _id        : 51,
            attachments: [],
            link       : true,
            mname      : 'Profiles',
            parrent    : 1,
            sequence   : 51,
            visible    : true,
            ancestors  : [],
            href       : 'Profiles'
        }, {
            _id        : 52,
            attachments: [],
            link       : true,
            mname      : 'Birthdays',
            parrent    : 9,
            sequence   : 52,
            visible    : true,
            ancestors  : [],
            href       : 'Birthdays'
        }, {
            _id        : 53,
            attachments: [],
            link       : true,
            mname      : 'Dashboard',
            parrent    : 36,
            sequence   : 53,
            visible    : true,
            ancestors  : [],
            href       : 'projectDashboard'
        }, {
            _id      : 54,
            mname    : 'Purchases',
            sequence : 54,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : 'Purchases'
        }, {
            _id      : 80,
            mname    : 'Jobs Dashboard',
            sequence : 54,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'jobsDashboard'
        }, {
            _id      : 55,
            mname    : 'Quotation',
            sequence : 55,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Quotation'
        }, {
            _id      : 57,
            mname    : 'Order',
            sequence : 56,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Order'
        }, {
            _id      : 56,
            mname    : 'Invoice',
            sequence : 57,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Invoice'
        }, {
            _id      : 58,
            mname    : 'Product',
            sequence : 58,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Product'
        }, {
            _id      : 59,
            mname    : 'Accounting',
            sequence : 59,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : 'Accounting'
        }, {
            _id      : 60,
            mname    : 'Supplier Payments',
            sequence : 60,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'supplierPayments'
        }, {
            _id      : 61,
            mname    : 'Customer Payments',
            sequence : 61,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'customerPayments'
        }, {
            _id      : 62,
            mname    : 'Quotation',
            sequence : 62,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'salesQuotation'
        }, {
            _id      : 63,
            mname    : 'Order',
            sequence : 63,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'salesOrder'
        }, {
            _id      : 64,
            mname    : 'Invoice',
            sequence : 64,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'salesInvoice'
        }, {
            _id      : 68,
            mname    : 'MonthHours',
            sequence : 68,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'monthHours'
        }, {
            _id      : 69,
            mname    : 'Holidays',
            sequence : 69,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Holiday'
        }, {
            _id      : 77,
            mname    : 'Capacity',
            sequence : 69,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Capacity'
        }, {
            _id      : 88,
            mname    : 'Salary Report',
            sequence : 69,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'salaryReport'
        }, {
            _id      : 70,
            mname    : 'Vacation',
            sequence : 70,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Vacation'
        }, {
            _id      : 71,
            mname    : 'Attendance',
            sequence : 71,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Attendance'
        }, {
            _id      : 76,
            mname    : 'Efficiency',
            sequence : 72,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'Efficiency'
        }, {
            _id      : 72,
            mname    : 'BonusType',
            sequence : 73,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'bonusType'
        }, {
            _id      : 74,
            mname    : 'HrDashboard',
            sequence : 74,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'HrDashboard'
        }, {
            _id      : 66,
            mname    : 'Payroll Expenses',
            sequence : 77,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'PayrollExpenses'
        }, {
            _id      : 78,
            mname    : 'Payroll',
            sequence : 78,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : 'Payroll'
        }, {
            _id      : 79,
            mname    : 'Payroll Payments',
            sequence : 79,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'PayrollPayments'
        }, {
            _id      : 82,
            mname    : 'Invoice Aging',
            sequence : 82,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'invoiceAging'
        }, {
            _id      : 83,
            mname    : 'ChartOfAccount',
            sequence : 83,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'ChartOfAccount'
        }, {
            _id      : 85,
            mname    : 'Journal',
            sequence : 85,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'journal'
        }, {
            _id      : 86,
            mname    : 'Journal Entry',
            sequence : 86,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'journalEntry'
        }, {
            _id      : 87,
            mname    : 'Invoice Charts',
            sequence : 87,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'invoiceCharts'
        }, {
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
        }, {
            _id      : 75,
            mname    : 'tCard',
            sequence : 1000,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'wTrack'
        }, {
            _id      : 84,
            mname    : 'Categories',
            sequence : 1000,
            parrent  : 1,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'productSettings'
        }, {
            _id      : 73,
            mname    : 'DashBoardVacation',
            sequence : 1001,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : 'DashBoardVacation'
        }];
});
