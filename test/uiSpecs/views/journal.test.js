/*
define([
    'text!fixtures/index.html',
    'collections/journal/filterCollection',
    'views/main/MainView',
    'views/journal/list/ListView',
    'views/journal/TopBarView',
    'views/journal/CreateView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, JournalCollection, MainView, ListView, TopBarView, CreateView, $, chai, chaiJquery, sinonChai, Custom, async) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [{
        "_id": 19,
        "attachments": [],
        "link": false,
        "mname": "Sales",
        "parrent": null,
        "sequence": 1,
        "visible": true,
        "ancestors": [],
        "href": "Sales"
    }, {
        "_id": 36,
        "attachments": [],
        "link": false,
        "mname": "Project",
        "parrent": null,
        "sequence": 2,
        "visible": true,
        "ancestors": [],
        "href": "Project"
    }, {
        "_id": 9,
        "attachments": [],
        "link": false,
        "mname": "HR",
        "parrent": null,
        "sequence": 3,
        "visible": true,
        "ancestors": [],
        "href": "HR"
    }, {
        "_id": 49,
        "attachments": [],
        "htref": "persons",
        "link": true,
        "mname": "Persons",
        "parrent": 19,
        "sequence": 7,
        "visible": true,
        "ancestors": [],
        "href": "Persons"
    }, {
        "_id": 50,
        "attachments": [],
        "htref": "persons",
        "link": true,
        "mname": "Companies",
        "parrent": 19,
        "sequence": 8,
        "visible": true,
        "ancestors": [],
        "href": "Companies"
    }, {
        "_id": 24,
        "attachments": [],
        "link": true,
        "mname": "Leads",
        "parrent": 19,
        "sequence": 9,
        "visible": true,
        "ancestors": [],
        "href": "Leads"
    }, {
        "_id": 25,
        "attachments": [],
        "link": true,
        "mname": "Opportunities",
        "parrent": 19,
        "sequence": 10,
        "visible": true,
        "ancestors": [],
        "href": "Opportunities"
    }, {
        "_id": 39,
        "attachments": [],
        "link": true,
        "mname": "Projects",
        "parrent": 36,
        "sequence": 23,
        "visible": true,
        "ancestors": [],
        "href": "Projects"
    }, {
        "_id": 40,
        "attachments": [],
        "link": true,
        "mname": "Tasks",
        "parrent": 36,
        "sequence": 24,
        "visible": true,
        "ancestors": [],
        "href": "Tasks"
    }, {
        "_id": 29,
        "attachments": [],
        "link": true,
        "mname": "Dashboard",
        "parrent": 19,
        "sequence": 29,
        "visible": true,
        "ancestors": [],
        "href": "Dashboard"
    }, {
        "_id": 42,
        "attachments": [],
        "link": true,
        "mname": "Employees",
        "parrent": 9,
        "sequence": 29,
        "visible": true,
        "ancestors": [],
        "href": "Employees"
    }, {
        "_id": 43,
        "attachments": [],
        "link": true,
        "mname": "Applications",
        "parrent": 9,
        "sequence": 30,
        "visible": true,
        "ancestors": [],
        "href": "Applications"
    }, {
        "_id": 14,
        "attachments": [],
        "link": true,
        "mname": "Job Positions",
        "parrent": 9,
        "sequence": 32,
        "visible": true,
        "ancestors": [],
        "href": "JobPositions"
    }, {
        "_id": 15,
        "attachments": [],
        "link": true,
        "mname": "Groups",
        "parrent": 1,
        "sequence": 33,
        "visible": true,
        "ancestors": [],
        "href": "Departments"
    }, {
        "_id": 7,
        "__v": 0,
        "attachments": [],
        "link": true,
        "mname": "Users",
        "parrent": 1,
        "sequence": 42,
        "visible": true,
        "ancestors": [],
        "href": "Users"
    }, {
        "_id": 44,
        "attachments": [],
        "link": true,
        "mname": "Workflows",
        "parrent": 1,
        "sequence": 44,
        "visible": true,
        "ancestors": [],
        "href": "Workflows"
    }, {
        "_id": 51,
        "attachments": [],
        "link": true,
        "mname": "Profiles",
        "parrent": 1,
        "sequence": 51,
        "visible": true,
        "ancestors": [],
        "href": "Profiles"
    }, {
        "_id": 52,
        "attachments": [],
        "link": true,
        "mname": "Birthdays",
        "parrent": 9,
        "sequence": 52,
        "visible": true,
        "ancestors": [],
        "href": "Birthdays"
    }, {
        "_id": 53,
        "attachments": [],
        "link": true,
        "mname": "Dashboard",
        "parrent": 36,
        "sequence": 53,
        "visible": true,
        "ancestors": [],
        "href": "projectDashboard"
    }, {
        "_id": 54,
        "mname": "Purchases",
        "sequence": 54,
        "parrent": null,
        "link": false,
        "visible": true,
        "ancestors": [],
        "href": "Purchases"
    }, {
        "_id": 80,
        "mname": "Jobs Dashboard",
        "sequence": 54,
        "parrent": 36,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "jobsDashboard"
    }, {
        "_id": 55,
        "mname": "Quotation",
        "sequence": 55,
        "parrent": 54,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Quotation"
    }, {
        "_id": 57,
        "mname": "Order",
        "sequence": 56,
        "parrent": 54,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Order"
    }, {
        "_id": 56,
        "mname": "Invoice",
        "sequence": 57,
        "parrent": 54,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Invoice"
    }, {
        "_id": 58,
        "mname": "Product",
        "sequence": 58,
        "parrent": 54,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Product"
    }, {
        "_id": 59,
        "mname": "Accounting",
        "sequence": 59,
        "parrent": null,
        "link": false,
        "visible": true,
        "ancestors": [],
        "href": "Accounting"
    }, {
        "_id": 60,
        "mname": "Supplier Payments",
        "sequence": 60,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "supplierPayments"
    }, {
        "_id": 61,
        "mname": "Customer Payments",
        "sequence": 61,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "customerPayments"
    }, {
        "_id": 62,
        "mname": "Quotation",
        "sequence": 62,
        "parrent": 19,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "salesQuotation"
    }, {
        "_id": 63,
        "mname": "Order",
        "sequence": 63,
        "parrent": 19,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "salesOrder"
    }, {
        "_id": 64,
        "mname": "Invoice",
        "sequence": 64,
        "parrent": 19,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "salesInvoice"
    }, {
        "_id": 68,
        "mname": "MonthHours",
        "sequence": 68,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "monthHours"
    }, {
        "_id": 69,
        "mname": "Holidays",
        "sequence": 69,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Holiday"
    }, {
        "_id": 77,
        "mname": "Capacity",
        "sequence": 69,
        "parrent": 9,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Capacity"
    }, {
        "_id": 88,
        "mname": "Salary Report",
        "sequence": 69,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "salaryReport"
    }, {
        "_id": 70,
        "mname": "Vacation",
        "sequence": 70,
        "parrent": 9,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Vacation"
    }, {
        "_id": 71,
        "mname": "Attendance",
        "sequence": 71,
        "parrent": 9,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Attendance"
    }, {
        "_id": 76,
        "mname": "Efficiency",
        "sequence": 72,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Efficiency"
    }, {
        "_id": 72,
        "mname": "BonusType",
        "sequence": 73,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "bonusType"
    }, {
        "_id": 74,
        "mname": "HrDashboard",
        "sequence": 74,
        "parrent": 9,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "HrDashboard"
    }, {
        "_id": 66,
        "mname": "Payroll Expenses",
        "sequence": 77,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "PayrollExpenses"
    }, {
        "_id": 78,
        "mname": "Payroll",
        "sequence": 78,
        "parrent": null,
        "link": false,
        "visible": true,
        "ancestors": [],
        "href": "Payroll"
    }, {
        "_id": 79,
        "mname": "Payroll Payments",
        "sequence": 79,
        "parrent": 78,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "PayrollPayments"
    }, {
        "_id": 82,
        "mname": "Invoice Aging",
        "sequence": 82,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "invoiceAging"
    }, {
        "_id": 83,
        "mname": "ChartOfAccount",
        "sequence": 83,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "ChartOfAccount"
    }, {
        "_id": 85,
        "mname": "Journal",
        "sequence": 85,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "journal"
    }, {
        "_id": 86,
        "mname": "Journal Entry",
        "sequence": 86,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "journalEntry"
    }, {
        "_id": 87,
        "mname": "Invoice Charts",
        "sequence": 87,
        "parrent": 59,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "invoiceCharts"
    }, {
        "_id": 1,
        "__v": 0,
        "attachments": [],
        "link": false,
        "mname": "Settings",
        "parrent": null,
        "sequence": 1000,
        "visible": true,
        "ancestors": [],
        "href": "Settings"
    }, {
        "_id": 75,
        "mname": "tCard",
        "sequence": 1000,
        "parrent": 36,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "wTrack"
    }, {
        "_id": 84,
        "mname": "Categories",
        "sequence": 1000,
        "parrent": 1,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "productSettings"
    }, {
        "_id": 73,
        "mname": "DashBoardVacation",
        "sequence": 1001,
        "parrent": 36,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "DashBoardVacation"
    }];

    var fakeJournal = [
        {
            _id: "565ef6ba270f53d02ee71d65",
            name: "Invoice Journal",
            __v: 0,
            creditAccount: {
                _id: "565eb53a6aa50532e5df0be0",
                name: "200000 Product Sales"
            },
            debitAccount: {
                _id: "565eb53a6aa50532e5df0bc9",
                name: "101200 Account Receivable"
            },
            editedBy: {
                user: null
            },
            createdBy: {
                date: "2015-12-02T13:48:42.607Z",
                user: null
            },
            description: "",
            currency: {
                name: "USD"
            },
            transaction: "invoice",
            type: "",
            date: "2015-12-02T13:48:42.607Z"
        },
        {
            _id: "56c41876a2cb3024468a04db",
            name: "Salary Payable",
            __v: 0,
            creditAccount: {
                _id: "565eb53a6aa50532e5df0bdc",
                name: "111100 Account Payable"
            },
            debitAccount: {
                _id: "565eb53a6aa50532e5df0be4",
                name: "212100 Salary Expenses"
            },
            editedBy: {
                user: null
            },
            createdBy: {
                date: "2016-02-17T06:51:34.414Z",
                user: null
            },
            description: "",
            currency: {
                name: "USD"
            },
            transaction: "invoice",
            type: "",
            date: "2016-02-17T06:51:34.414Z"
        },
        {
            _id: "56c9d1b6c3b88f6d64490fb0",
            name: "Vacation & Holiday",
            __v: 0,
            creditAccount: {
                _id: "565eb53a6aa50532e5df0bdc",
                name: "111100 Account Payable"
            },
            debitAccount: {
                _id: "565eb53a6aa50532e5df0be4",
                name: "212100 Salary Expenses"
            },
            editedBy: {
                user: null
            },
            createdBy: {
                date: "2016-02-21T15:03:18.179Z",
                user: null
            },
            description: "",
            currency: {
                name: "USD"
            },
            transaction: "invoice",
            type: "",
            date: "2016-02-21T15:03:18.179Z"
        },
        {
            _id: "56cc727e541812c07197356c",
            name: "Wages Payable",
            __v: 0,
            creditAccount: {
                _id: "56c4444eb81fd51e19207f3e",
                name: "111101 Wages Payable"
            },
            debitAccount: {
                _id: "565eb53a6aa50532e5df0bda",
                name: "104001 Work In Process"
            },
            editedBy: {
                user: null
            },
            createdBy: {
                date: "2016-02-23T14:53:50.956Z",
                user: null
            },
            description: "",
            currency: {
                name: "USD"
            },
            transaction: "Payment",
            type: "",
            date: "2016-02-23T14:53:50.956Z"
        },
        {
            _id: "56cc72a8541812c07197356e",
            name: "Vacations and Holidays",
            __v: 0,
            creditAccount: {
                _id: "56c9d4c7c3b88f6d64490fb4",
                name: "212102 Vacation & Holiday Expense"
            },
            debitAccount: {
                _id: "565eb53a6aa50532e5df0bda",
                name: "104001 Work In Process"
            },
            editedBy: {
                user: null
            },
            createdBy: {
                date: "2016-02-23T14:54:32.803Z",
                user: null
            },
            description: "",
            currency: {
                name: "USD"
            },
            transaction: "Payment",
            type: "",
            date: "2016-02-23T14:54:32.803Z"
        },
        {
            _id: "56cc72c4541812c071973570",
            name: "Salary Idle Time",
            __v: 0,
            creditAccount: null,
            debitAccount: {
                _id: "565eb53a6aa50532e5df0bda",
                name: "104001 Work In Process"
            },
            editedBy: {
                user: null
            },
            createdBy: {
                date: "2016-02-23T14:55:00.702Z",
                user: null
            },
            description: "",
            currency: {
                name: "USD"
            },
            transaction: "Payment",
            type: "",
            date: "2016-02-23T14:55:00.702Z"
        },
        {
            _id: "56cc734b541812c071973572",
            name: "Admin Overhead",
            __v: 0,
            creditAccount: null,
            debitAccount: {
                _id: "565eb53a6aa50532e5df0bda",
                name: "104001 Work In Process"
            },
            editedBy: {
                user: null
            },
            createdBy: {
                date: "2016-02-23T14:57:15.675Z",
                user: null
            },
            description: "",
            currency: {
                name: "USD"
            },
            transaction: "Payment",
            type: "",
            date: "2016-02-23T14:57:15.674Z"
        },
        {
            _id: "56cc7383541812c071973574",
            name: "Overtime Salary",
            __v: 0,
            creditAccount: {
                _id: "56c9d555c3b88f6d64490fb5",
                name: "212103 Salary Overtime Paybale"
            },
            debitAccount: {
                _id: "565eb53a6aa50532e5df0bda",
                name: "104001 Work In Process"
            },
            editedBy: {
                user: null
            },
            createdBy: {
                date: "2016-02-23T14:58:11.149Z",
                user: null
            },
            description: "",
            currency: {
                name: "USD"
            },
            transaction: "Payment",
            type: "",
            date: "2016-02-23T14:58:11.149Z"
        }
    ];

    var fakeChartofAccoutnForDD = {
        data: [
            {
                _id: "565eb53a6aa50532e5df0bc9",
                code: 101200,
                name: "101200 Account Receivable",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.799Z",
                    user: null
                },
                editedBy: {
                    date: "2016-03-16T13:42:01.148Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: null,
                type: "Receivableeeee",
                account: "Account Receivable"
            },
            {
                _id: "565eb53a6aa50532e5df0bca",
                code: 101400,
                name: "101400 Erste USD",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.800Z",
                    user: null
                },
                editedBy: {
                    date: "2016-03-16T13:42:01.148Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: "565c5433385ea8b670ff499e",
                type: "Bank and Cash",
                account: "Erste USD"
            },
            {
                _id: "565eb53a6aa50532e5df0bcb",
                code: 101402,
                name: "101402 Ukrsibbank USD ThinkMobiles",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.800Z",
                    user: null
                },
                editedBy: {
                    date: "2016-03-16T13:40:07.814Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: "565c5d9adf6d008a7a6abb09",
                type: "Bank and Cash",
                account: "Ukrsibbank USD ThinkMobiles"
            },
            {
                _id: "565eb53a6aa50532e5df0bcc",
                code: 101403,
                name: "101403 Ukrsibbank EUR ThinkMobiles",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.800Z",
                    user: null
                },
                editedBy: {
                    date: "2015-12-02T14:19:59.501Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: "565c5d9adf6d008a7a6abb0a",
                type: "Bank and Cash",
                account: "Ukrsibbank EUR ThinkMobiles"
            },
            {
                _id: "565eb53a6aa50532e5df0bcd",
                code: 101403,
                name: "101403 Ukrsibbank UAH ThinkMobiles",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.800Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Bank and Cash",
                account: "Ukrsibbank UAH ThinkMobiles"
            },
            {
                _id: "565eb53a6aa50532e5df0bce",
                code: 101404,
                name: "101404 Ukrsibbank USD YTS",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.801Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: "565c6059b8078e097eee955a",
                type: "Bank and Cash",
                account: "Ukrsibbank USD YTS"
            },
            {
                _id: "565eb53a6aa50532e5df0bcf",
                code: 101405,
                name: "101405 Ukrsibbank UAH YTS",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.801Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: "565c6059b8078e097eee955b",
                type: "Bank and Cash",
                account: "Ukrsibbank UAH YTS"
            },
            {
                _id: "565eb53a6aa50532e5df0bd0",
                code: 101406,
                name: "101406 Payoneer USD",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.801Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: "555cc981532aebbc4a8baf36",
                type: "Bank and Cash",
                account: "Payoneer USD"
            },
            {
                _id: "565eb53a6aa50532e5df0bd1",
                code: 101407,
                name: "101407 UniCreditBank USD",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.801Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: "565c6059b8078e097eee955c",
                type: "Bank and Cash",
                account: "UniCreditBank USD"
            },
            {
                _id: "565eb53a6aa50532e5df0bd2",
                code: 101500,
                name: "101500 Cash USD",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.801Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: "565c610f618d81c97e786eee",
                type: "Bank and Cash",
                account: "Cash USD"
            },
            {
                _id: "565eb53a6aa50532e5df0bd3",
                code: 101501,
                name: "101501 Cash UAH",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.801Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: "565c610f618d81c97e786eef",
                type: "Bank and Cash",
                account: "Cash UAH"
            },
            {
                _id: "565eb53a6aa50532e5df0bd4",
                code: 101700,
                name: "101700 Liquidity Transfers",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.802Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Current Assets",
                account: "Liquidity Transfers"
            },
            {
                _id: "565eb53a6aa50532e5df0bd5",
                code: 101600,
                name: "101600 Opening Income Account",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.802Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Other Income",
                account: "Opening Income Account"
            },
            {
                _id: "565eb53a6aa50532e5df0bd6",
                code: 101401,
                name: "101401 Erste EUR",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.802Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: "565c5b62bc6a01997710e02c",
                type: "Bank and Cash",
                account: "Erste EUR"
            },
            {
                _id: "565eb53a6aa50532e5df0bd7",
                code: 102000,
                name: "102000 Non-current assets",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.802Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Non-current Assets",
                account: "Non-current assets"
            },
            {
                _id: "565eb53a6aa50532e5df0bd8",
                code: 103000,
                name: "103000 Prepayments",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.802Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Prepayments",
                account: "Prepayments"
            },
            {
                _id: "565eb53a6aa50532e5df0bd9",
                code: 104000,
                name: "104000 Finished Goods",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.802Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Inventory",
                account: "Finished Goods"
            },
            {
                _id: "565eb53a6aa50532e5df0bda",
                code: 104001,
                name: "104001 Work In Process",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.803Z",
                    user: null
                },
                editedBy: {
                    date: "2016-02-23T14:49:03.808Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: null,
                type: "Inventory",
                account: "Work In Process"
            },
            {
                _id: "565eb53a6aa50532e5df0bdb",
                code: 111000,
                name: "111000 Current Liabilities",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.803Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Current Liabilities",
                account: "Current Liabilities"
            },
            {
                _id: "565eb53a6aa50532e5df0bdc",
                code: 111100,
                name: "111100 Account Payable",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.803Z",
                    user: null
                },
                editedBy: {
                    date: "2016-02-23T14:23:30.866Z",
                    user: "560255d1638625cf32000005"
                },
                payMethod: null,
                type: "Payable",
                account: "Account Payable"
            },
            {
                _id: "565eb53a6aa50532e5df0bdd",
                code: 111200,
                name: "111200 Tax Received",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.803Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Current Liabilities",
                account: "Tax Received"
            },
            {
                _id: "565eb53a6aa50532e5df0bde",
                code: 111300,
                name: "111300 Reserve and Profit/Loss Account",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.803Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Current Liabilities",
                account: "Reserve and Profit/Loss Account"
            },
            {
                _id: "565eb53a6aa50532e5df0bdf",
                code: 112000,
                name: "112000 Non-current Liabilities",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.804Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Non-current Liabilities",
                account: "Non-current Liabilities"
            },
            {
                _id: "565eb53a6aa50532e5df0be0",
                code: 200000,
                name: "200000 Product Sales",
                accountType: "Credit",
                createdBy: {
                    date: "2016-03-17T08:29:08.804Z",
                    user: null
                },
                editedBy: {
                    date: "2016-02-22T15:48:53.979Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: null,
                type: "Income",
                account: "Product Sales"
            },
            {
                _id: "565eb53a6aa50532e5df0be1",
                code: 201000,
                name: "201000 Foreign Exchange Gain",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.804Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Income",
                account: "Foreign Exchange Gain"
            },
            {
                _id: "565eb53a6aa50532e5df0be2",
                code: 210000,
                name: "210000 Cost of Goods Sold",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.804Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Cost of Goods Sold"
            },
            {
                _id: "565eb53a6aa50532e5df0be3",
                code: 211000,
                name: "211000 Foreign Exchange Loss",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.805Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Foreign Exchange Loss"
            },
            {
                _id: "565eb53a6aa50532e5df0be4",
                code: 212100,
                name: "212100 Salary Expenses",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.805Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Salary Expenses"
            },
            {
                _id: "565eb53a6aa50532e5df0be5",
                code: 212200,
                name: "212200 Purchase of Equipments",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.805Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Purchase of Equipments"
            },
            {
                _id: "565eb53a6aa50532e5df0be6",
                code: 212300,
                name: "212300 Bank Fees",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.805Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Bank Fees"
            },
            {
                _id: "565eb53a6aa50532e5df0be7",
                code: 212400,
                name: "212400 Selling And Marketing",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.806Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Selling And Marketing"
            },
            {
                _id: "565eb53a6aa50532e5df0be8",
                code: 212401,
                name: "212401 Software&cloud",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.806Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Software&cloud"
            },
            {
                _id: "565eb53a6aa50532e5df0be9",
                code: 212500,
                name: "212500 Office Supply",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.806Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Office Supply"
            },
            {
                _id: "565eb53a6aa50532e5df0bea",
                code: 212500,
                name: "212500 Office Furniture",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.807Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Office Furniture"
            },
            {
                _id: "565eb53a6aa50532e5df0beb",
                code: 212600,
                name: "212600 Rent&Utilities",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.807Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Rent&Utilities"
            },
            {
                _id: "565eb53a6aa50532e5df0bec",
                code: 212700,
                name: "212700 Hardware",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.809Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Hardware"
            },
            {
                _id: "565eb53a6aa50532e5df0bed",
                code: 212800,
                name: "212800 HR Expenses",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.809Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "HR Expenses"
            },
            {
                _id: "565eb53a6aa50532e5df0bee",
                code: 212801,
                name: "212801 Outsource",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.809Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Outsource"
            },
            {
                _id: "565eb53a6aa50532e5df0bef",
                code: 212802,
                name: "212802 Events/meetings",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.810Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Events/meetings"
            },
            {
                _id: "565eb53a6aa50532e5df0bf0",
                code: 212803,
                name: "212803 Events/meetings",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.810Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Events/meetings"
            },
            {
                _id: "565eb53a6aa50532e5df0bf1",
                code: 220000,
                name: "220000 Other Expenses",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.810Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Expenses",
                account: "Other Expenses"
            },
            {
                _id: "565eb53a6aa50532e5df0bf2",
                code: 300100,
                name: "300100 Capital",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.810Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Equity",
                account: "Capital"
            },
            {
                _id: "565eb53a6aa50532e5df0bf3",
                code: 300200,
                name: "300200 Dividends",
                accountType: "Debit",
                createdBy: {
                    date: "2016-03-17T08:29:08.810Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "Equity",
                account: "Dividends"
            },
            {
                _id: "56c4444eb81fd51e19207f3e",
                __v: 0,
                code: 111101,
                accountType: "Credit",
                name: "111101 Wages Payable",
                createdBy: {
                    date: "2016-02-17T09:58:38.810Z",
                    user: null
                },
                editedBy: {
                    date: "2016-02-23T14:49:03.807Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: null,
                type: "Payable",
                account: "Wages Payable"
            },
            {
                _id: "56c9d4c7c3b88f6d64490fb4",
                code: 212102,
                __v: 0,
                accountType: "Credit",
                name: "212102 Vacation & Holiday Expense",
                createdBy: {
                    date: "2016-02-21T15:16:23.022Z",
                    user: null
                },
                editedBy: {
                    date: "2016-02-23T14:50:12.960Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: null,
                type: "Expenses",
                account: "Vacation & Holiday Expense"
            },
            {
                _id: "56c9d555c3b88f6d64490fb5",
                code: 212103,
                __v: 0,
                accountType: "Credit",
                name: "212103 Salary Overtime Paybale",
                createdBy: {
                    date: "2016-02-21T15:18:45.244Z",
                    user: null
                },
                editedBy: {
                    date: "2016-02-23T14:50:12.959Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: null,
                type: "Payable",
                account: "Salary Overtime Paybale"
            },
            {
                _id: "56e95546347c942527b6f6f3",
                code: 111111,
                __v: 0,
                createdBy: {
                    date: "2016-03-16T12:44:54.452Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "",
                account: "test"
            },
            {
                _id: "56e95e24347c942527b6f6f4",
                code: 1,
                __v: 0,
                createdBy: {
                    date: "2016-03-16T13:22:44.873Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "12",
                account: "1"
            },
            {
                _id: "56e95ffb347c942527b6f6f5",
                code: 1111111,
                __v: 0,
                createdBy: {
                    date: "2016-03-16T13:30:35.899Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "",
                account: "test"
            },
            {
                _id: "56e96023347c942527b6f6f6",
                code: 1243,
                __v: 0,
                createdBy: {
                    date: "2016-03-16T13:31:15.277Z",
                    user: null
                },
                editedBy: {
                    user: null
                },
                payMethod: null,
                type: "",
                account: "test"
            }
        ]
    };

    var journalCollection;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;

    describe('Journal View', function () {
        var $fixture;
        var $elFixture;

        before(function(){
            windowConfirmStub = sinon.stub(window, 'confirm');
        });

        after(function(){
            view.remove();
            topBarView.remove();
            listView.remove();

            windowConfirmStub.restore();
        });

        describe('#initialize()', function () {
            var server;

            before(function () {
                $fixture = $(fixtures);
                $fixture.appendTo(document.body);
                $elFixture = $fixture.find('#wrapper');

                server = sinon.fakeServer.create();

            });

            after(function () {
                server.restore();
            });

            it('Should create main view', function () {
                var $expectedSubMenuEl;
                var $expectedMenuEl;

                server.respondWith('GET', '/getModules', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'journal'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="85"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="85"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/journal');

            });

        });

        describe('TopBarView', function(){
            var server;

            before(function(){
                server = sinon.fakeServer.create();
            });

            after(function(){
                server.restore();
            });

            it('Try to create TopBarView', function(){
                var journalUrl = new RegExp('\/journal\/list', 'i');

                server.respondWith('GET', journalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJournal)]);

                journalCollection = new JournalCollection({
                    viewType: 'list',
                    page: 1,
                    count: 100
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: journalCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

        });

        describe('ChartsOfAccount list view', function () {
            var server;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function(){

                it('Try to create Journal list view', function (done) {
                    var $listHolder;
                    var journalUrl = new RegExp('\/journal\/list', 'i');

                    setTimeout(function(){
                        server.respondWith('GET', journalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJournal)]);

                        listView = new ListView({
                            collection: journalCollection,
                            startTime: new Date()
                        });

                        server.respond();

                        $listHolder = listView.$el;

                        expect($listHolder.find('table')).to.exist;

                        done();
                    }, 50);

                });

                it('Try to delete item', function () {
                    var journalUrl = new RegExp('\/journal\/', 'i');
                    var $firstEl = listView.$el.find('tr:nth-child(1) > td:nth-child(1) > .checkbox');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                   windowConfirmStub.returns(true);

                    $firstEl.prop('checked', true);

                    server.respondWith('DELETE', journalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);

                    $deleteBtn.click();

                    listView.deleteItems();

                    server.respond();

                    expect(windowConfirmStub.called).to.be.true;
                });

                it('Try to create item', function(){
                    var $dialogEl;
                    var $journalName;
                    var $transactionEl;
                    var $debitEl;
                    var $creditEl;
                    var $createDialogBtn;
                    var $debitNextBtn;
                    var $debitPrevBtn;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');

                    server.respondWith('GET', '/chartOfAccount/getForDd', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeChartofAccoutnForDD)]);

                    $createBtn.click();
                    listView.createItem();

                    server.respond();

                    $dialogEl = $('.ui-dialog');
                    $createDialogBtn = $dialogEl.find('#createBtn');

                    expect($dialogEl).to.be.exist;

                    $journalName = $dialogEl.find('#nameInput');
                    $journalName.val('Test');

                    $dialogEl.find('a#typeDd.current-selected').click();
                    $transactionEl = $dialogEl.find('.newSelectList li:nth-child(1)');
                    $transactionEl.click();

                    $dialogEl.find('a#debitDd.current-selected').click();
                    $debitNextBtn = $dialogEl.find('a.next');
                    $debitNextBtn.click();
                    $debitPrevBtn = $dialogEl.find('a.prev');
                    $debitPrevBtn.click();
                    $debitEl = $dialogEl.find('.newSelectList li:nth-child(1)');
                    $debitEl.click();

                    $dialogEl.find('a#creditDd.current-selected').click();
                    $creditEl = $dialogEl.find('.newSelectList li:nth-child(1)');
                    $creditEl.click();

                    server.respondWith('POST', '/journal/', [201, {"Content-Type": "application/json"}, JSON.stringify({})]);

                    $createDialogBtn.click();

                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/journal');
                    expect($('.ui-dialog')).to.be.not.exist;

                });

            });

        });

    });

});
*/
