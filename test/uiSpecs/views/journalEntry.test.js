define([
    'text!fixtures/index.html',
    'collections/journalEntry/filterCollection',
    'views/main/MainView',
    'views/journalEntry/list/ListView',
    'views/journalEntry/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, JournalEntryCollection, MainView, ListView, TopBarView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var fakeJournalEntry = [
        {
            _id: "565f470c2ceb020214aa003a",
            credit: 0,
            debit: 9100,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-01T23:00:00.000Z"
        },
        {
            _id: "565f470c2ceb020214aa003b",
            credit: 9100,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-01T23:00:00.000Z"
        },
        {
            _id: "565f47742ceb020214aa017c",
            credit: 0,
            debit: 41300,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-01T23:00:00.000Z"
        },
        {
            _id: "565f47742ceb020214aa017d",
            credit: 41300,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-01T23:00:00.000Z"
        },
        {
            _id: "565f50572ceb020214aa0c5a",
            credit: 0,
            debit: 17500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-01T23:00:00.000Z"
        },
        {
            _id: "565f50572ceb020214aa0c5b",
            credit: 17500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-01T23:00:00.000Z"
        },
        {
            _id: "565f588e2ceb020214aa1a81",
            credit: 0,
            debit: 7200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-01T23:00:00.000Z"
        },
        {
            _id: "565f588e2ceb020214aa1a82",
            credit: 7200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-01T23:00:00.000Z"
        },
        {
            _id: "565ff035969be49714d66b81",
            credit: 0,
            debit: 14400,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-02T23:00:00.000Z"
        },
        {
            _id: "565ff035969be49714d66b82",
            credit: 14400,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-02T23:00:00.000Z"
        },
        {
            _id: "5660111c6226e3c43108dd31",
            credit: 0,
            debit: 4200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-02T23:00:00.000Z"
        },
        {
            _id: "5660111c6226e3c43108dd32",
            credit: 4200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-02T23:00:00.000Z"
        },
        {
            _id: "5660234f4afaaced62c67469",
            credit: 0,
            debit: 17500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-02T23:00:00.000Z"
        },
        {
            _id: "5660234f4afaaced62c6746a",
            credit: 17500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-02T23:00:00.000Z"
        },
        {
            _id: "566024814afaaced62c68763",
            credit: 0,
            debit: 80000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "566024814afaaced62c68764",
            credit: 80000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "56605a2421ac545f176a6078",
            credit: 0,
            debit: 15200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-02T23:00:00.000Z"
        },
        {
            _id: "56605a2421ac545f176a6079",
            credit: 15200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-02T23:00:00.000Z"
        },
        {
            _id: "566065417f54fd33261686aa",
            credit: 0,
            debit: 266000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-13T22:00:00.000Z"
        },
        {
            _id: "566065417f54fd33261686ab",
            credit: 266000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-13T22:00:00.000Z"
        },
        {
            _id: "566065b97f54fd3326168700",
            credit: 0,
            debit: 582000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-18T23:00:00.000Z"
        },
        {
            _id: "566065b97f54fd3326168701",
            credit: 582000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-18T23:00:00.000Z"
        },
        {
            _id: "56617b92bb8be7814fb52449",
            credit: 0,
            debit: 139427.79967415854,
            currency: {
                rate: 0.915169,
                name: "EUR"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-27T23:00:00.000Z"
        },
        {
            _id: "56617b92bb8be7814fb5244a",
            credit: 139427.79967415854,
            debit: 0,
            currency: {
                rate: 0.915169,
                name: "EUR"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-27T23:00:00.000Z"
        },
        {
            _id: "56617cd8bb8be7814fb52483",
            credit: 0,
            debit: 400000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-23T22:00:00.000Z"
        },
        {
            _id: "56617cd8bb8be7814fb52484",
            credit: 400000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-23T22:00:00.000Z"
        },
        {
            _id: "56618052bb8be7814fb52503",
            credit: 0,
            debit: 321200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-07-16T22:00:00.000Z"
        },
        {
            _id: "56618052bb8be7814fb52504",
            credit: 321200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-07-16T22:00:00.000Z"
        },
        {
            _id: "5661823cbb8be7814fb526e8",
            credit: 0,
            debit: 359300,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-02T22:00:00.000Z"
        },
        {
            _id: "5661823cbb8be7814fb526e9",
            credit: 359300,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-02T22:00:00.000Z"
        },
        {
            _id: "566185777d284423697e27e6",
            credit: 0,
            debit: 356300,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-02T22:00:00.000Z"
        },
        {
            _id: "566185777d284423697e27e7",
            credit: 356300,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-02T22:00:00.000Z"
        },
        {
            _id: "566187a97d284423697e2bc5",
            credit: 0,
            debit: 2997100,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-23T23:00:00.000Z"
        },
        {
            _id: "566187a97d284423697e2bc6",
            credit: 2997100,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-23T23:00:00.000Z"
        },
        {
            _id: "56618c617d284423697e2ce0",
            credit: 0,
            debit: 654000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-04-03T22:00:00.000Z"
        },
        {
            _id: "56618c617d284423697e2ce1",
            credit: 654000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-04-03T22:00:00.000Z"
        },
        {
            _id: "566196b47d284423697e2ef5",
            credit: 0,
            debit: 534400,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-03T22:00:00.000Z"
        },
        {
            _id: "566196b47d284423697e2ef6",
            credit: 534400,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-03T22:00:00.000Z"
        },
        {
            _id: "5661a83a7d284423697e34ef",
            credit: 0,
            debit: 499800,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-01T23:00:00.000Z"
        },
        {
            _id: "5661a83a7d284423697e34f0",
            credit: 499800,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-01T23:00:00.000Z"
        },
        {
            _id: "5661a94c7d284423697e35a9",
            credit: 0,
            debit: 499800,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-01T23:00:00.000Z"
        },
        {
            _id: "5661a94c7d284423697e35aa",
            credit: 499800,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-01T23:00:00.000Z"
        },
        {
            _id: "5661a9f57d284423697e36b0",
            credit: 0,
            debit: 344000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-01T23:00:00.000Z"
        },
        {
            _id: "5661a9f57d284423697e36b1",
            credit: 344000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-01T23:00:00.000Z"
        },
        {
            _id: "5661af2d7d284423697e37ff",
            credit: 0,
            debit: 416000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-13T22:00:00.000Z"
        },
        {
            _id: "5661af2d7d284423697e3800",
            credit: 416000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-13T22:00:00.000Z"
        },
        {
            _id: "5661b14a3aeeb5d44081e12a",
            credit: 0,
            debit: 270400,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-03T23:00:00.000Z"
        },
        {
            _id: "5661b14a3aeeb5d44081e12b",
            credit: 270400,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-03T23:00:00.000Z"
        },
        {
            _id: "5661b35e7a1ba5c5537a9e00",
            credit: 0,
            debit: 457600,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-08T22:00:00.000Z"
        },
        {
            _id: "5661b35e7a1ba5c5537a9e01",
            credit: 457600,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-08T22:00:00.000Z"
        },
        {
            _id: "5661bdb6f13e46fd14533a03",
            credit: 0,
            debit: 561600,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-08T23:00:00.000Z"
        },
        {
            _id: "5661bdb6f13e46fd14533a04",
            credit: 561600,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-08T23:00:00.000Z"
        },
        {
            _id: "5661c099f13e46fd14533b34",
            credit: 0,
            debit: 280200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-08T22:00:00.000Z"
        },
        {
            _id: "5661c099f13e46fd14533b35",
            credit: 280200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-08T22:00:00.000Z"
        },
        {
            _id: "5661c34af13e46fd14533c57",
            credit: 0,
            debit: 459500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-13T22:00:00.000Z"
        },
        {
            _id: "5661c34af13e46fd14533c58",
            credit: 459500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-13T22:00:00.000Z"
        },
        {
            _id: "5661c522f67424071592a3b7",
            credit: 0,
            debit: 239200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-22T23:00:00.000Z"
        },
        {
            _id: "5661c522f67424071592a3b8",
            credit: 239200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-22T23:00:00.000Z"
        },
        {
            _id: "5661c610f67424071592a3f8",
            credit: 0,
            debit: 341566.24216778326,
            currency: {
                rate: 0.894702,
                name: "EUR"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-23T22:00:00.000Z"
        },
        {
            _id: "5661c610f67424071592a3f9",
            credit: 341566.24216778326,
            debit: 0,
            currency: {
                rate: 0.894702,
                name: "EUR"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-23T22:00:00.000Z"
        },
        {
            _id: "5661c7aaf13e46fd14533f4a",
            credit: 0,
            debit: 115200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-14T22:00:00.000Z"
        },
        {
            _id: "5661c7aaf13e46fd14533f4b",
            credit: 115200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-14T22:00:00.000Z"
        },
        {
            _id: "5661dcf025e5eb511510b946",
            credit: 0,
            debit: 45000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-25T23:00:00.000Z"
        },
        {
            _id: "5661dcf025e5eb511510b947",
            credit: 45000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-25T23:00:00.000Z"
        },
        {
            _id: "5661fec4f67424071592a5f1",
            credit: 0,
            debit: 850400,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-08-03T22:00:00.000Z"
        },
        {
            _id: "5661fec4f67424071592a5f2",
            credit: 850400,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-08-03T22:00:00.000Z"
        },
        {
            _id: "5662007e25e5eb511510bc8f",
            credit: 0,
            debit: 705000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-03T22:00:00.000Z"
        },
        {
            _id: "5662007e25e5eb511510bc90",
            credit: 705000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-03T22:00:00.000Z"
        },
        {
            _id: "5662018925e5eb511510bcc7",
            credit: 0,
            debit: 1200000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-29T23:00:00.000Z"
        },
        {
            _id: "5662018925e5eb511510bcc8",
            credit: 1200000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-29T23:00:00.000Z"
        },
        {
            _id: "566205f025e5eb511510bd7e",
            credit: 0,
            debit: 498800,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-29T23:00:00.000Z"
        },
        {
            _id: "566205f025e5eb511510bd7f",
            credit: 498800,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-29T23:00:00.000Z"
        },
        {
            _id: "566212ee25e5eb511510be45",
            credit: 0,
            debit: 484800,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-30T22:00:00.000Z"
        },
        {
            _id: "566212ee25e5eb511510be46",
            credit: 484800,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-30T22:00:00.000Z"
        },
        {
            _id: "5662156625e5eb511510bf04",
            credit: 0,
            debit: 725300,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-01T23:00:00.000Z"
        },
        {
            _id: "5662156625e5eb511510bf05",
            credit: 725300,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-01T23:00:00.000Z"
        },
        {
            _id: "566217aa25e5eb511510c057",
            credit: 0,
            debit: 699600,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "566217aa25e5eb511510c058",
            credit: 699600,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "5662bffd5c6e70021566f10c",
            credit: 0,
            debit: 1003800,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-24T22:00:00.000Z"
        },
        {
            _id: "5662bffd5c6e70021566f10d",
            credit: 1003800,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-24T22:00:00.000Z"
        },
        {
            _id: "5662ce61f13e46fd14535040",
            credit: 0,
            debit: 1302500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-20T22:00:00.000Z"
        },
        {
            _id: "5662ce61f13e46fd14535041",
            credit: 1302500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-20T22:00:00.000Z"
        },
        {
            _id: "5662edaef13e46fd14535547",
            credit: 0,
            debit: 196000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-11T23:00:00.000Z"
        },
        {
            _id: "5662edaef13e46fd14535548",
            credit: 196000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-11T23:00:00.000Z"
        },
        {
            _id: "5662ee05f13e46fd14535562",
            credit: 0,
            debit: 200000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-09T22:00:00.000Z"
        },
        {
            _id: "5662ee05f13e46fd14535563",
            credit: 200000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-09T22:00:00.000Z"
        },
        {
            _id: "5662eeedf13e46fd145355b9",
            credit: 0,
            debit: 204000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-11T22:00:00.000Z"
        },
        {
            _id: "5662eeedf13e46fd145355ba",
            credit: 204000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-11T22:00:00.000Z"
        },
        {
            _id: "5662ef37f13e46fd145355fc",
            credit: 0,
            debit: 200000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-19T22:00:00.000Z"
        },
        {
            _id: "5662ef37f13e46fd145355fd",
            credit: 200000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-19T22:00:00.000Z"
        },
        {
            _id: "566401b808ed794128637b8c",
            credit: 0,
            debit: 558800,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-05T23:00:00.000Z"
        },
        {
            _id: "566401b808ed794128637b8d",
            credit: 558800,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-05T23:00:00.000Z"
        },
        {
            _id: "5664026408ed794128637b9f",
            credit: 0,
            debit: 168000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-15T23:00:00.000Z"
        },
        {
            _id: "5664026408ed794128637ba0",
            credit: 168000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-15T23:00:00.000Z"
        },
        {
            _id: "5664125a08ed794128637bc5",
            credit: 0,
            debit: 387000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-29T23:00:00.000Z"
        },
        {
            _id: "5664125a08ed794128637bc6",
            credit: 387000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-29T23:00:00.000Z"
        },
        {
            _id: "56641da908ed794128637bdc",
            credit: 0,
            debit: 464500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-12T23:00:00.000Z"
        },
        {
            _id: "56641da908ed794128637bdd",
            credit: 464500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-12T23:00:00.000Z"
        },
        {
            _id: "56641e8608ed794128637bff",
            credit: 0,
            debit: 696000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-26T23:00:00.000Z"
        },
        {
            _id: "56641e8608ed794128637c00",
            credit: 696000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-26T23:00:00.000Z"
        },
        {
            _id: "56642ebc08ed794128637c45",
            credit: 0,
            debit: 700000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-22T22:00:00.000Z"
        },
        {
            _id: "56642ebc08ed794128637c46",
            credit: 700000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-22T22:00:00.000Z"
        },
        {
            _id: "56642fef08ed794128637c68",
            credit: 0,
            debit: 400000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-18T23:00:00.000Z"
        },
        {
            _id: "56642fef08ed794128637c69",
            credit: 400000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-18T23:00:00.000Z"
        },
        {
            _id: "5664c47c08ed794128637c97",
            credit: 0,
            debit: 533000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-29T23:00:00.000Z"
        },
        {
            _id: "5664c47c08ed794128637c98",
            credit: 533000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-29T23:00:00.000Z"
        },
        {
            _id: "5664c5f508ed794128637cc6",
            credit: 0,
            debit: 960000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "5664c5f508ed794128637cc7",
            credit: 960000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "5664c9a308ed794128637cda",
            credit: 0,
            debit: 1160000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-18T23:00:00.000Z"
        },
        {
            _id: "5664c9a308ed794128637cdb",
            credit: 1160000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-18T23:00:00.000Z"
        },
        {
            _id: "5664cba208ed794128637cea",
            credit: 0,
            debit: 30000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-04T23:00:00.000Z"
        },
        {
            _id: "5664cba208ed794128637ceb",
            credit: 30000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-04T23:00:00.000Z"
        },
        {
            _id: "5664cd5d08ed794128637d17",
            credit: 0,
            debit: 263200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "5664cd5d08ed794128637d18",
            credit: 263200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "5664cfdc08ed794128637d27",
            credit: 0,
            debit: 320000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-19T23:00:00.000Z"
        },
        {
            _id: "5664cfdc08ed794128637d28",
            credit: 320000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-19T23:00:00.000Z"
        },
        {
            _id: "5664d06608ed794128637d4a",
            credit: 0,
            debit: 392000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-29T23:00:00.000Z"
        },
        {
            _id: "5664d06608ed794128637d4b",
            credit: 392000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-29T23:00:00.000Z"
        },
        {
            _id: "5665471f9294f4d728bcb1a9",
            credit: 0,
            debit: 68000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "5665471f9294f4d728bcb1aa",
            credit: 68000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "56654cc69294f4d728bcb407",
            credit: 0,
            debit: 300000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-07-31T22:00:00.000Z"
        },
        {
            _id: "56654cc69294f4d728bcb408",
            credit: 300000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-07-31T22:00:00.000Z"
        },
        {
            _id: "56654dd89294f4d728bcb50d",
            credit: 0,
            debit: 300000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-08-31T22:00:00.000Z"
        },
        {
            _id: "56654dd89294f4d728bcb50e",
            credit: 300000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-08-31T22:00:00.000Z"
        },
        {
            _id: "566558139294f4d728bcc1d2",
            credit: 0,
            debit: 1064200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-10T23:00:00.000Z"
        },
        {
            _id: "566558139294f4d728bcc1d3",
            credit: 1064200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-10T23:00:00.000Z"
        },
        {
            _id: "56685be4a3fc012a68f0d842",
            credit: 0,
            debit: 260000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-20T22:00:00.000Z"
        },
        {
            _id: "56685be4a3fc012a68f0d843",
            credit: 260000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-20T22:00:00.000Z"
        },
        {
            _id: "566860dba3fc012a68f0d861",
            credit: 0,
            debit: 80000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-12T23:00:00.000Z"
        },
        {
            _id: "566860dba3fc012a68f0d862",
            credit: 80000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-12T23:00:00.000Z"
        },
        {
            _id: "566886eb18ee5c115c2ef9e0",
            credit: 0,
            debit: 215600,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-08-31T22:00:00.000Z"
        },
        {
            _id: "566886eb18ee5c115c2ef9e1",
            credit: 215600,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-08-31T22:00:00.000Z"
        },
        {
            _id: "56688a8318ee5c115c2ef9f4",
            credit: 0,
            debit: 96800,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-01T22:00:00.000Z"
        },
        {
            _id: "56688a8318ee5c115c2ef9f5",
            credit: 96800,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-01T22:00:00.000Z"
        },
        {
            _id: "56688cc718ee5c115c2efa0f",
            credit: 0,
            debit: 81400,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-29T23:00:00.000Z"
        },
        {
            _id: "56688cc718ee5c115c2efa10",
            credit: 81400,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-29T23:00:00.000Z"
        },
        {
            _id: "5668a24c65bcfefe46fb460f",
            credit: 0,
            debit: 1258000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-19T23:00:00.000Z"
        },
        {
            _id: "5668a24c65bcfefe46fb4610",
            credit: 1258000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-19T23:00:00.000Z"
        },
        {
            _id: "566adc34a74aaf316eaea6d4",
            credit: 0,
            debit: 204000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-07-20T22:00:00.000Z"
        },
        {
            _id: "566adc34a74aaf316eaea6d5",
            credit: 204000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-07-20T22:00:00.000Z"
        },
        {
            _id: "566c2f898453e8b464b7089e",
            credit: 0,
            debit: 450000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-22T23:00:00.000Z"
        },
        {
            _id: "566c2f898453e8b464b7089f",
            credit: 450000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-22T23:00:00.000Z"
        },
        {
            _id: "566c32148453e8b464b708ad",
            credit: 0,
            debit: 450000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-03T23:00:00.000Z"
        },
        {
            _id: "566c32148453e8b464b708ae",
            credit: 450000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-03T23:00:00.000Z"
        },
        {
            _id: "566e7d928453e8b464b7094a",
            credit: 0,
            debit: 6300,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-04T23:00:00.000Z"
        },
        {
            _id: "566e7d928453e8b464b7094b",
            credit: 6300,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-04T23:00:00.000Z"
        },
        {
            _id: "566e7dd68453e8b464b7097d",
            credit: 0,
            debit: 4200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-12T23:00:00.000Z"
        },
        {
            _id: "566e7dd68453e8b464b7097e",
            credit: 4200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-12T23:00:00.000Z"
        },
        {
            _id: "566e8f1a8453e8b464b70a1a",
            credit: 0,
            debit: 608000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-09T23:00:00.000Z"
        },
        {
            _id: "566e8f1a8453e8b464b70a1b",
            credit: 608000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-09T23:00:00.000Z"
        },
        {
            _id: "566ebc968453e8b464b70a5e",
            credit: 0,
            debit: 342500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-13T23:00:00.000Z"
        },
        {
            _id: "566ebc968453e8b464b70a5f",
            credit: 342500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-13T23:00:00.000Z"
        },
        {
            _id: "566ebd458453e8b464b70aad",
            credit: 0,
            debit: 342500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-13T23:00:00.000Z"
        },
        {
            _id: "566ebd458453e8b464b70aae",
            credit: 342500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-13T23:00:00.000Z"
        },
        {
            _id: "568bb3e97c0383e04c60e876",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-03T23:00:00.000Z"
        },
        {
            _id: "568bb3e97c0383e04c60e877",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-03T23:00:00.000Z"
        },
        {
            _id: "568bb5d77c0383e04c60e886",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-04T23:00:00.000Z"
        },
        {
            _id: "568bb5d77c0383e04c60e887",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-04T23:00:00.000Z"
        },
        {
            _id: "568bb70b7c0383e04c60e895",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "568bb70b7c0383e04c60e896",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "568bb8717c0383e04c60e8a4",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-04T23:00:00.000Z"
        },
        {
            _id: "568bb8717c0383e04c60e8a5",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-04T23:00:00.000Z"
        },
        {
            _id: "568bb9c57c0383e04c60e8b0",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-04T23:00:00.000Z"
        },
        {
            _id: "568bb9c57c0383e04c60e8b1",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-04T23:00:00.000Z"
        },
        {
            _id: "569ca74fcf1f31f925c026c3",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-17T23:00:00.000Z"
        },
        {
            _id: "569ca74fcf1f31f925c026c4",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-17T23:00:00.000Z"
        },
        {
            _id: "569ca8bbcf1f31f925c026d0",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-17T23:00:00.000Z"
        },
        {
            _id: "569ca8bbcf1f31f925c026d1",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-17T23:00:00.000Z"
        },
        {
            _id: "56a0b73362d172544baf0ded",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-22T23:00:00.000Z"
        },
        {
            _id: "56a0b73362d172544baf0dee",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-22T23:00:00.000Z"
        },
        {
            _id: "56a0ba5b62d172544baf0dfb",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-17T23:00:00.000Z"
        },
        {
            _id: "56a0ba5b62d172544baf0dfc",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-17T23:00:00.000Z"
        },
        {
            _id: "56a102d262d172544baf113a",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-29T23:00:00.000Z"
        },
        {
            _id: "56a102d262d172544baf113b",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-29T23:00:00.000Z"
        },
        {
            _id: "56a1472a2208b3af4a52727e",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-07T23:00:00.000Z"
        },
        {
            _id: "56a1472a2208b3af4a52727f",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-07T23:00:00.000Z"
        },
        {
            _id: "56a15c772208b3af4a527289",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-03T23:00:00.000Z"
        },
        {
            _id: "56a15c772208b3af4a52728a",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-03T23:00:00.000Z"
        },
        {
            _id: "56a1fba862d172544baf1147",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-14T23:00:00.000Z"
        },
        {
            _id: "56a1fba862d172544baf1148",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-14T23:00:00.000Z"
        },
        {
            _id: "56a20726aa157ca50f21fab8",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-29T23:00:00.000Z"
        },
        {
            _id: "56a20726aa157ca50f21fab9",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-29T23:00:00.000Z"
        },
        {
            _id: "56a21033aa157ca50f21fac7",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-29T23:00:00.000Z"
        },
        {
            _id: "56a21033aa157ca50f21fac8",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-29T23:00:00.000Z"
        },
        {
            _id: "56a214beaa157ca50f21fad1",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-21T23:00:00.000Z"
        },
        {
            _id: "56a214beaa157ca50f21fad2",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-21T23:00:00.000Z"
        },
        {
            _id: "56a21a3baa157ca50f21fadb",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-21T23:00:00.000Z"
        },
        {
            _id: "56a21a3baa157ca50f21fadc",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-21T23:00:00.000Z"
        },
        {
            _id: "56a24166aa157ca50f21fb09",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-10T23:00:00.000Z"
        },
        {
            _id: "56a24166aa157ca50f21fb0a",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-10T23:00:00.000Z"
        },
        {
            _id: "56a98729d59a04d6225b0dec",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-27T23:00:00.000Z"
        },
        {
            _id: "56a98729d59a04d6225b0ded",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-27T23:00:00.000Z"
        },
        {
            _id: "56a9cdd0b4dc0d09232bd730",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-03T23:00:00.000Z"
        },
        {
            _id: "56a9cdd0b4dc0d09232bd731",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-03T23:00:00.000Z"
        },
        {
            _id: "56a9d3ecb4dc0d09232bd738",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-13T23:00:00.000Z"
        },
        {
            _id: "56a9d3ecb4dc0d09232bd739",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-13T23:00:00.000Z"
        },
        {
            _id: "56a9d6abb4dc0d09232bd74e",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-13T23:00:00.000Z"
        },
        {
            _id: "56a9d6abb4dc0d09232bd74f",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-13T23:00:00.000Z"
        },
        {
            _id: "56a9de47b4dc0d09232bd75c",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-02T23:00:00.000Z"
        },
        {
            _id: "56a9de47b4dc0d09232bd75d",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-02T23:00:00.000Z"
        },
        {
            _id: "56ab46a2b4dc0d09232bd7c9",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-19T23:00:00.000Z"
        },
        {
            _id: "56ab46a2b4dc0d09232bd7ca",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-19T23:00:00.000Z"
        },
        {
            _id: "56ab4863b4dc0d09232bd7de",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab4863b4dc0d09232bd7df",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab494cb4dc0d09232bd7f3",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab494cb4dc0d09232bd7f4",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab4a65b4dc0d09232bd803",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab4a65b4dc0d09232bd804",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab4a9eb4dc0d09232bd80c",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab4a9eb4dc0d09232bd80d",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab4ce16d7173f43f96ad24",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab4ce16d7173f43f96ad25",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab4d346d7173f43f96ad2d",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab4d346d7173f43f96ad2e",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-28T23:00:00.000Z"
        },
        {
            _id: "56ab5fe874d57e0d56d6bdac",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-22T23:00:00.000Z"
        },
        {
            _id: "56ab5fe874d57e0d56d6bdad",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-22T23:00:00.000Z"
        },
        {
            _id: "56af4dd674d57e0d56d6beeb",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-06T23:00:00.000Z"
        },
        {
            _id: "56af4dd674d57e0d56d6beec",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-06T23:00:00.000Z"
        },
        {
            _id: "56af4fcd74d57e0d56d6bef3",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-10T23:00:00.000Z"
        },
        {
            _id: "56af4fcd74d57e0d56d6bef4",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-10T23:00:00.000Z"
        },
        {
            _id: "56af5b5074d57e0d56d6bf0b",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-31T23:00:00.000Z"
        },
        {
            _id: "56af5b5074d57e0d56d6bf0c",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-31T23:00:00.000Z"
        },
        {
            _id: "56af67d274d57e0d56d6bf35",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-06-16T22:00:00.000Z"
        },
        {
            _id: "56af67d274d57e0d56d6bf36",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-06-16T22:00:00.000Z"
        },
        {
            _id: "56af68f074d57e0d56d6bf42",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-04-15T22:00:00.000Z"
        },
        {
            _id: "56af68f074d57e0d56d6bf43",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-04-15T22:00:00.000Z"
        },
        {
            _id: "56b066cd74d57e0d56d6bfa6",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-01T23:00:00.000Z"
        },
        {
            _id: "56b066cd74d57e0d56d6bfa7",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-01T23:00:00.000Z"
        },
        {
            _id: "56b0a782d6ef38a708dfc289",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-01T23:00:00.000Z"
        },
        {
            _id: "56b0a782d6ef38a708dfc28a",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-01T23:00:00.000Z"
        },
        {
            _id: "56b4c19c99ce8d706a81b2eb",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-19T23:00:00.000Z"
        },
        {
            _id: "56b4c19c99ce8d706a81b2ec",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-19T23:00:00.000Z"
        },
        {
            _id: "56b9cffbfae0cea53a581805",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-01-30T23:00:00.000Z"
        },
        {
            _id: "56b9cffbfae0cea53a581806",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-01-30T23:00:00.000Z"
        },
        {
            _id: "56b9d08cfae0cea53a58180f",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-02-26T23:00:00.000Z"
        },
        {
            _id: "56b9d08cfae0cea53a581810",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-02-26T23:00:00.000Z"
        },
        {
            _id: "56b9d0f7fae0cea53a581817",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-03-30T22:00:00.000Z"
        },
        {
            _id: "56b9d0f7fae0cea53a581818",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-03-30T22:00:00.000Z"
        },
        {
            _id: "56b9e718fae0cea53a581820",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-04-08T22:00:00.000Z"
        },
        {
            _id: "56b9e718fae0cea53a581821",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-04-08T22:00:00.000Z"
        },
        {
            _id: "56b9e758fae0cea53a581828",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-05-28T22:00:00.000Z"
        },
        {
            _id: "56b9e758fae0cea53a581829",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-05-28T22:00:00.000Z"
        },
        {
            _id: "56b9e81dfae0cea53a581830",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-06-29T22:00:00.000Z"
        },
        {
            _id: "56b9e81dfae0cea53a581831",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-06-29T22:00:00.000Z"
        },
        {
            _id: "56b9e85bfae0cea53a581838",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-07-30T22:00:00.000Z"
        },
        {
            _id: "56b9e85bfae0cea53a581839",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-07-30T22:00:00.000Z"
        },
        {
            _id: "56b9ea2cfae0cea53a581840",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-08-30T22:00:00.000Z"
        },
        {
            _id: "56b9ea2cfae0cea53a581841",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-08-30T22:00:00.000Z"
        },
        {
            _id: "56b9ea79fae0cea53a581848",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-29T22:00:00.000Z"
        },
        {
            _id: "56b9ea79fae0cea53a581849",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-29T22:00:00.000Z"
        },
        {
            _id: "56b9eabcfae0cea53a581850",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-30T23:00:00.000Z"
        },
        {
            _id: "56b9eabcfae0cea53a581851",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-30T23:00:00.000Z"
        },
        {
            _id: "56b9edcefae0cea53a58185f",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-08T23:00:00.000Z"
        },
        {
            _id: "56b9edcefae0cea53a581860",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-08T23:00:00.000Z"
        },
        {
            _id: "56bc9e7fdfd8a81466e2f497",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-10T23:00:00.000Z"
        },
        {
            _id: "56bc9e7fdfd8a81466e2f498",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-10T23:00:00.000Z"
        },
        {
            _id: "56bda26cdfd8a81466e2f4dd",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-31T23:00:00.000Z"
        },
        {
            _id: "56bda26cdfd8a81466e2f4de",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-31T23:00:00.000Z"
        },
        {
            _id: "56bda45ddfd8a81466e2f4ea",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-01T23:00:00.000Z"
        },
        {
            _id: "56bda45ddfd8a81466e2f4eb",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-01T23:00:00.000Z"
        },
        {
            _id: "56bda680dfd8a81466e2f4f9",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-31T23:00:00.000Z"
        },
        {
            _id: "56bda680dfd8a81466e2f4fa",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-31T23:00:00.000Z"
        },
        {
            _id: "56bda71fdfd8a81466e2f503",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-29T23:00:00.000Z"
        },
        {
            _id: "56bda71fdfd8a81466e2f504",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-29T23:00:00.000Z"
        },
        {
            _id: "56bda9e3dfd8a81466e2f50f",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-06T23:00:00.000Z"
        },
        {
            _id: "56bda9e3dfd8a81466e2f510",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-06T23:00:00.000Z"
        },
        {
            _id: "56bdc6b7dfd8a81466e2f577",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-29T23:00:00.000Z"
        },
        {
            _id: "56bdc6b7dfd8a81466e2f578",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-29T23:00:00.000Z"
        },
        {
            _id: "56bdc79bdfd8a81466e2f583",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-01T23:00:00.000Z"
        },
        {
            _id: "56bdc79bdfd8a81466e2f584",
            credit: null,
            debit: null,
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-01T23:00:00.000Z"
        },
        {
            _id: "56c46414b81fd51e19207f50",
            credit: 0,
            debit: 166500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-07-16T22:00:00.000Z"
        },
        {
            _id: "56c46414b81fd51e19207f51",
            credit: 166500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-07-16T22:00:00.000Z"
        },
        {
            _id: "56c468d7b81fd51e19207f5d",
            credit: 0,
            debit: 225000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-22T23:00:00.000Z"
        },
        {
            _id: "56c468d7b81fd51e19207f5e",
            credit: 225000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-22T23:00:00.000Z"
        },
        {
            _id: "56c59732d2b48ede4ba42231",
            credit: 0,
            debit: 920000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-01-21T23:00:00.000Z"
        },
        {
            _id: "56c59732d2b48ede4ba42232",
            credit: 920000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-01-21T23:00:00.000Z"
        },
        {
            _id: "56c598b5d2b48ede4ba42245",
            credit: 0,
            debit: 1142500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-07T23:00:00.000Z"
        },
        {
            _id: "56c598b5d2b48ede4ba42246",
            credit: 1142500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-07T23:00:00.000Z"
        },
        {
            _id: "56c599e8d2b48ede4ba42253",
            credit: 0,
            debit: 811000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-31T23:00:00.000Z"
        },
        {
            _id: "56c599e8d2b48ede4ba42254",
            credit: 811000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-31T23:00:00.000Z"
        },
        {
            _id: "56c59af2d2b48ede4ba42261",
            credit: 0,
            debit: 199400,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-30T23:00:00.000Z"
        },
        {
            _id: "56c59af2d2b48ede4ba42262",
            credit: 199400,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-30T23:00:00.000Z"
        },
        {
            _id: "56c59d51d2b48ede4ba4226f",
            credit: 0,
            debit: 742000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-29T23:00:00.000Z"
        },
        {
            _id: "56c59d51d2b48ede4ba42270",
            credit: 742000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-29T23:00:00.000Z"
        },
        {
            _id: "56c6e4d00769bba2647ae6f3",
            credit: 0,
            debit: 197500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-30T22:00:00.000Z"
        },
        {
            _id: "56c6e4d00769bba2647ae6f4",
            credit: 197500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-30T22:00:00.000Z"
        },
        {
            _id: "56c6e93ac3b88f6d64490fa0",
            credit: 0,
            debit: 733500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56c6e93ac3b88f6d64490fa1",
            credit: 733500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56c6eabfc3b88f6d64490fa9",
            credit: 0,
            debit: 640000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-14T22:00:00.000Z"
        },
        {
            _id: "56c6eabfc3b88f6d64490faa",
            credit: 640000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-10-14T22:00:00.000Z"
        },
        {
            _id: "56c6ebbf0769bba2647ae6fc",
            credit: 0,
            debit: 637500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-20T23:00:00.000Z"
        },
        {
            _id: "56c6ebbf0769bba2647ae6fd",
            credit: 637500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-20T23:00:00.000Z"
        },
        {
            _id: "56c70e3d0769bba2647ae709",
            credit: 0,
            debit: 249700,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "56c70e3d0769bba2647ae70a",
            credit: 249700,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "56caedc95b5327a650b82e06",
            credit: 0,
            debit: 7200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caedc95b5327a650b82e07",
            credit: 7200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caee775b5327a650b82e21",
            credit: 0,
            debit: 7200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caee775b5327a650b82e22",
            credit: 7200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caeea35b5327a650b82e2a",
            credit: 0,
            debit: 7200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caeea35b5327a650b82e2b",
            credit: 7200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caeed75b5327a650b82e33",
            credit: 0,
            debit: 7200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caeed75b5327a650b82e34",
            credit: 7200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf55b5b5327a650b82e3b",
            credit: 0,
            debit: 17500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf55b5b5327a650b82e3c",
            credit: 17500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf5895b5327a650b82e44",
            credit: 0,
            debit: 17500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf5895b5327a650b82e45",
            credit: 17500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf5c05b5327a650b82e4d",
            credit: 0,
            debit: 17500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf5c05b5327a650b82e4e",
            credit: 17500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf6045b5327a650b82e56",
            credit: 0,
            debit: 17500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf6045b5327a650b82e57",
            credit: 17500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf6bf5b5327a650b82e5e",
            credit: 0,
            debit: 10500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf6bf5b5327a650b82e5f",
            credit: 10500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf6f35b5327a650b82e67",
            credit: 0,
            debit: 11000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf6f35b5327a650b82e68",
            credit: 11000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf73d5b5327a650b82e70",
            credit: 0,
            debit: 14000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56caf73d5b5327a650b82e71",
            credit: 14000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-21T23:00:00.000Z"
        },
        {
            _id: "56cf1c0e541812c07197359c",
            credit: 0,
            debit: 136000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-24T23:00:00.000Z"
        },
        {
            _id: "56cf1c0e541812c07197359d",
            credit: 136000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-24T23:00:00.000Z"
        },
        {
            _id: "56d805deae35cc4f0e72106a",
            credit: 0,
            debit: 668000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-02T23:00:00.000Z"
        },
        {
            _id: "56d805deae35cc4f0e72106b",
            credit: 668000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-02T23:00:00.000Z"
        },
        {
            _id: "56d80748ae35cc4f0e72106e",
            credit: 0,
            debit: 611500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-02T23:00:00.000Z"
        },
        {
            _id: "56d80748ae35cc4f0e72106f",
            credit: 611500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-02T23:00:00.000Z"
        },
        {
            _id: "56d96bc432e6cca40d2566c3",
            credit: 0,
            debit: 992600,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-11T23:00:00.000Z"
        },
        {
            _id: "56d96bc432e6cca40d2566c4",
            credit: 992600,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-11T23:00:00.000Z"
        },
        {
            _id: "56d96deaae35cc4f0e7210c8",
            credit: 0,
            debit: 1320400,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56d96deaae35cc4f0e7210c9",
            credit: 1320400,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56d96e18b6dcdce60d165b0d",
            credit: 0,
            debit: 1209900,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56d96e18b6dcdce60d165b0e",
            credit: 1209900,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56d971e3ad9f78b50581d253",
            credit: 0,
            debit: 97000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-29T23:00:00.000Z"
        },
        {
            _id: "56d971e3ad9f78b50581d254",
            credit: 97000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-29T23:00:00.000Z"
        },
        {
            _id: "56d97318ad9f78b50581d257",
            credit: 0,
            debit: 1496000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56d97318ad9f78b50581d258",
            credit: 1496000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56d97478df9bc89a05d663ed",
            credit: 0,
            debit: 423500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56d97478df9bc89a05d663ee",
            credit: 423500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56d975394c2b769305a36b6e",
            credit: 0,
            debit: 217500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56d975394c2b769305a36b6f",
            credit: 217500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-31T23:00:00.000Z"
        },
        {
            _id: "56d976b736cb5d0c06d6826b",
            credit: 0,
            debit: 247000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "56d976b736cb5d0c06d6826c",
            credit: 247000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "56d977a3df9bc89a05d663f7",
            credit: 0,
            debit: 199200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "56d977a3df9bc89a05d663f8",
            credit: 199200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "56d9786636cb5d0c06d6826f",
            credit: 0,
            debit: 311000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "56d9786636cb5d0c06d68270",
            credit: 311000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-11-30T23:00:00.000Z"
        },
        {
            _id: "56d97de309a6415405b63549",
            credit: 0,
            debit: 48000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-30T22:00:00.000Z"
        },
        {
            _id: "56d97de309a6415405b6354a",
            credit: 48000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-09-30T22:00:00.000Z"
        },
        {
            _id: "56dd9cdf98e6115b18a7d280",
            credit: 0,
            debit: 668400,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-16T23:00:00.000Z"
        },
        {
            _id: "56dd9cdf98e6115b18a7d281",
            credit: 668400,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-16T23:00:00.000Z"
        },
        {
            _id: "56ddf6f79fb95fbe18e3f8f0",
            credit: 0,
            debit: 651200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-08-31T22:00:00.000Z"
        },
        {
            _id: "56ddf6f79fb95fbe18e3f8f1",
            credit: 651200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-08-31T22:00:00.000Z"
        },
        {
            _id: "56e03e6243fcd85c7430705d",
            credit: 0,
            debit: 164000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-24T00:00:00.000Z"
        },
        {
            _id: "56e03e6243fcd85c7430705e",
            credit: 164000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-24T00:00:00.000Z"
        },
        {
            _id: "56e18e98d62294582e10ca70",
            credit: 0,
            debit: 530000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-10T00:00:00.000Z"
        },
        {
            _id: "56e18e98d62294582e10ca71",
            credit: 530000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-10T00:00:00.000Z"
        },
        {
            _id: "56e298713c074d636203bbd6",
            credit: 0,
            debit: 156000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-11T00:00:00.000Z"
        },
        {
            _id: "56e298713c074d636203bbd7",
            credit: 156000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-11T00:00:00.000Z"
        },
        {
            _id: "56e6649b68e298b241985638",
            credit: 0,
            debit: 1237600,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e6649b68e298b241985639",
            credit: 1237600,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e666f45ec71b0042974585",
            credit: 0,
            debit: 704000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-03T00:00:00.000Z"
        },
        {
            _id: "56e666f45ec71b0042974586",
            credit: 704000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-03T00:00:00.000Z"
        },
        {
            _id: "56e6687bdd81ed4e426c609c",
            credit: 0,
            debit: 955700,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-18T00:00:00.000Z"
        },
        {
            _id: "56e6687bdd81ed4e426c609d",
            credit: 955700,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-18T00:00:00.000Z"
        },
        {
            _id: "56e66ba57c22c0704120b1c6",
            credit: 0,
            debit: 328000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e66ba57c22c0704120b1c7",
            credit: 328000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e66de45ec71b004297458e",
            credit: 0,
            debit: 17500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e66de45ec71b004297458f",
            credit: 17500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e66e8c68e298b241985644",
            credit: 0,
            debit: 14700,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e66e8c68e298b241985645",
            credit: 14700,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e66fc1ef05acd9418dff18",
            credit: 0,
            debit: 222500,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-05T00:00:00.000Z"
        },
        {
            _id: "56e66fc1ef05acd9418dff19",
            credit: 222500,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-05T00:00:00.000Z"
        },
        {
            _id: "56e6705d5ec71b0042974595",
            credit: 0,
            debit: 169000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-05T00:00:00.000Z"
        },
        {
            _id: "56e6705d5ec71b0042974596",
            credit: 169000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-01-05T00:00:00.000Z"
        },
        {
            _id: "56e6708cef05acd9418dff1d",
            credit: 0,
            debit: 7200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e6708cef05acd9418dff1e",
            credit: 7200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e670d481046d9741fb66dd",
            credit: 0,
            debit: 300000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-25T00:00:00.000Z"
        },
        {
            _id: "56e670d481046d9741fb66de",
            credit: 300000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-25T00:00:00.000Z"
        },
        {
            _id: "56e672a5ef05acd9418dff23",
            credit: 0,
            debit: 7200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e672a5ef05acd9418dff24",
            credit: 7200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e672db81046d9741fb66e4",
            credit: 0,
            debit: 7200,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e672db81046d9741fb66e5",
            credit: 7200,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e6748f7c22c0704120b1d1",
            credit: 0,
            debit: 2100,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e6748f7c22c0704120b1d2",
            credit: 2100,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e6748f81046d9741fb66e8",
            credit: 0,
            debit: 36000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-02T00:00:00.000Z"
        },
        {
            _id: "56e6748f81046d9741fb66e9",
            credit: 36000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-02-02T00:00:00.000Z"
        },
        {
            _id: "56e674bf3d5bc25541857e21",
            credit: 0,
            debit: 1600,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e674bf3d5bc25541857e22",
            credit: 1600,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e674eedd81ed4e426c60bf",
            credit: 0,
            debit: 2100,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e674eedd81ed4e426c60c0",
            credit: 2100,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-14T00:00:00.000Z"
        },
        {
            _id: "56e68f7c04f9482d4273ed2a",
            credit: 0,
            debit: 1200000,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-10T00:00:00.000Z"
        },
        {
            _id: "56e68f7c04f9482d4273ed2b",
            credit: 1200000,
            debit: 0,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2016-03-10T00:00:00.000Z"
        }
    ];

    var journalEntryCollection;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;

    describe('JournalEntry View', function () {
        var $fixture;
        var $elFixture;

        after(function(){
            view.remove();
            topBarView.remove();
            listView.remove();
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

                view = new MainView({el: $elFixture, contentType: 'journalEntry'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="86"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="86"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/journalEntry');

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
                var journalEntryUrl = new RegExp('\/journal\/journalEntry\/list', 'i');

                server.respondWith('GET', journalEntryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJournalEntry)]);

                journalEntryCollection = new JournalEntryCollection({
                    viewType: 'list',
                    page: 1,
                    count: 100
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: journalEntryCollection
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

                it('Try to create JournalEntry list view', function (done) {
                    var $listHolder;
                    var journalEntryUrl = new RegExp('\/journal\/journalEntry\/list', 'i');

                    setTimeout(function(){
                        server.respondWith('GET', journalEntryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJournalEntry)]);

                        listView = new ListView({
                            collection: journalEntryCollection,
                            startTime: new Date()
                        });

                        server.respond();

                        $listHolder = listView.$el;

                        expect($listHolder.find('table')).to.exist;
                        expect($listHolder.find('#listFooter')).to.exist;
                        expect($listHolder.find('td#totalDebit').text()).to.be.equals('549 386.00');
                        expect($listHolder.find('td#totalCredit').text()).to.be.equals('549 386.00');
                        done();
                    }, 50);

                });
            });

        });

    });

});
