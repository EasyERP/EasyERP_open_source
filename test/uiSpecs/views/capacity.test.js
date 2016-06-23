/*
define([
    'text!fixtures/index.html',
    'collections/Capacity/filterCollection',
    'views/main/MainView',
    'views/Capacity/list/ListView',
    'views/Capacity/TopBarView',
    /!*'views/Capacity/CreateView',*!/
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, CapacityCollection, MainView, ListView, TopBarView, /!*CreateView,*!/ $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [
        {
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
            "href": "salesQuotations"
        }, {
            "_id": 63,
            "mname": "Order",
            "sequence": 63,
            "parrent": 19,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "salesOrders"
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
    var fakeCapacity = {
        capacityObject: {
            PM: [
                {
                    _id: "560e2b4bc90e2fb026cdff79",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "PM",
                        _id: "55bb1f40cb76ca630b000007"
                    },
                    employee: {
                        name: "Alex Svatuk",
                        _id: "55b92ad221e4b7c40f000030"
                    },
                    id: "560e2b4bc90e2fb026cdff79"
                }
            ],
            Android: [
                {
                    _id: "560e2b4bc90e2fb026cdff7a",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Michael Yemets",
                        _id: "55b92ad221e4b7c40f000036"
                    },
                    id: "560e2b4bc90e2fb026cdff7a"
                },
                {
                    _id: "560e2b4bc90e2fb026cdffe4",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Oleksiy Shanghin",
                        _id: "55b92ad221e4b7c40f000037"
                    },
                    id: "560e2b4bc90e2fb026cdffe4"
                },
                {
                    _id: "560e2b4bc90e2fb026ce002b",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Dmitriy Bruso",
                        _id: "55b92ad221e4b7c40f000033"
                    },
                    id: "560e2b4bc90e2fb026ce002b"
                },
                {
                    _id: "560e2b4bc90e2fb026ce002c",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Ilya Mondok",
                        _id: "55b92ad221e4b7c40f000035"
                    },
                    id: "560e2b4bc90e2fb026ce002c"
                },
                {
                    _id: "560e2b4bc90e2fb026ce002f",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Vitaliy Shuba",
                        _id: "55b92ad221e4b7c40f00004e"
                    },
                    id: "560e2b4bc90e2fb026ce002f"
                },
                {
                    _id: "560e2b4bc90e2fb026ce0032",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Alex Sich",
                        _id: "55b92ad221e4b7c40f00006c"
                    },
                    id: "560e2b4bc90e2fb026ce0032"
                },
                {
                    _id: "560e2b4bc90e2fb026ce0034",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Michael Soyma",
                        _id: "55b92ad221e4b7c40f000077"
                    },
                    id: "560e2b4bc90e2fb026ce0034"
                },
                {
                    _id: "560e2b4ec90e2fb026ce016f",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Tamas Mondok",
                        _id: "55b92ad221e4b7c40f000061"
                    },
                    id: "560e2b4ec90e2fb026ce016f"
                },
                {
                    _id: "560e2b4ec90e2fb026ce0171",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Vasiliy Barchiy",
                        _id: "55b92ad221e4b7c40f000080"
                    },
                    id: "560e2b4ec90e2fb026ce0171"
                },
                {
                    _id: "560e2b51c90e2fb026ce0327",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Sofia Nayda",
                        _id: "55b92ad221e4b7c40f00004c"
                    },
                    id: "560e2b51c90e2fb026ce0327"
                },
                {
                    _id: "560e2b51c90e2fb026ce0328",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    employee: {
                        name: "Eduard Chori",
                        _id: "55b92ad221e4b7c40f00005b"
                    },
                    id: "560e2b51c90e2fb026ce0328"
                }
            ],
            QA: [
                {
                    _id: "560e2b4bc90e2fb026cdff7b",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "QA",
                        _id: "55b92ace21e4b7c40f000011"
                    },
                    employee: {
                        name: "Vitaliy Bizilya",
                        _id: "55b92ad221e4b7c40f00003b"
                    },
                    id: "560e2b4bc90e2fb026cdff7b"
                },
                {
                    _id: "560e2b4bc90e2fb026cdff81",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "QA",
                        _id: "55b92ace21e4b7c40f000011"
                    },
                    employee: {
                        name: "Oleg Boyanivskiy",
                        _id: "55b92ad221e4b7c40f000078"
                    },
                    id: "560e2b4bc90e2fb026cdff81"
                },
                {
                    _id: "560e2b4bc90e2fb026ce0030",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "QA",
                        _id: "55b92ace21e4b7c40f000011"
                    },
                    employee: {
                        name: "Lubomir Gerevich",
                        _id: "55b92ad221e4b7c40f00005d"
                    },
                    id: "560e2b4bc90e2fb026ce0030"
                },
                {
                    _id: "560e2b4bc90e2fb026ce0036",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "QA",
                        _id: "55b92ace21e4b7c40f000011"
                    },
                    employee: {
                        name: "Vitaliy Sokhanych",
                        _id: "55b92ad221e4b7c40f000081"
                    },
                    id: "560e2b4bc90e2fb026ce0036"
                },
                {
                    _id: "560e2b51c90e2fb026ce032a",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "QA",
                        _id: "55b92ace21e4b7c40f000011"
                    },
                    employee: {
                        name: "Anton Karabeinikov",
                        _id: "55b92ad221e4b7c40f00006f"
                    },
                    id: "560e2b51c90e2fb026ce032a"
                },
                {
                    _id: "560e2b51c90e2fb026ce032d",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "QA",
                        _id: "55b92ace21e4b7c40f000011"
                    },
                    employee: {
                        name: "Vasilisa Klimchenko",
                        _id: "55b92ad221e4b7c40f00007f"
                    },
                    id: "560e2b51c90e2fb026ce032d"
                }
            ],
            BusinessDev: [
                {
                    _id: "560e2b4bc90e2fb026cdff7c",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "BusinessDev",
                        _id: "55b92ace21e4b7c40f000014"
                    },
                    employee: {
                        name: "Alex Sokhanych",
                        _id: "55b92ad221e4b7c40f00004f"
                    },
                    id: "560e2b4bc90e2fb026cdff7c"
                },
                {
                    _id: "560e2b4bc90e2fb026cdff7f",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "BusinessDev",
                        _id: "55b92ace21e4b7c40f000014"
                    },
                    employee: {
                        name: "Yana Gusti",
                        _id: "55b92ad221e4b7c40f000063"
                    },
                    id: "560e2b4bc90e2fb026cdff7f"
                },
                {
                    _id: "560e2b4bc90e2fb026cdffe6",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "BusinessDev",
                        _id: "55b92ace21e4b7c40f000014"
                    },
                    employee: {
                        name: "Roland Katona",
                        _id: "55b92ad221e4b7c40f00004b"
                    },
                    id: "560e2b4bc90e2fb026cdffe6"
                }
            ],
            iOS: [
                {
                    _id: "560e2b4bc90e2fb026cdff7d",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Anatoliy Dalekorey",
                        _id: "55b92ad221e4b7c40f000059"
                    },
                    id: "560e2b4bc90e2fb026cdff7d"
                },
                {
                    _id: "560e2b4bc90e2fb026cdff82",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Yaroslav Fuchko",
                        _id: "55b92ad221e4b7c40f000082"
                    },
                    id: "560e2b4bc90e2fb026cdff82"
                },
                {
                    _id: "560e2b4bc90e2fb026cdffe3",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Alex Gleba",
                        _id: "55b92ad221e4b7c40f000031"
                    },
                    id: "560e2b4bc90e2fb026cdffe3"
                },
                {
                    _id: "560e2b4bc90e2fb026cdffe7",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Andriy Hanchak",
                        _id: "55b92ad221e4b7c40f00006e"
                    },
                    id: "560e2b4bc90e2fb026cdffe7"
                },
                {
                    _id: "560e2b4bc90e2fb026cdffe9",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Oleksiy Gerasimov",
                        _id: "55b92ad221e4b7c40f000079"
                    },
                    id: "560e2b4bc90e2fb026cdffe9"
                },
                {
                    _id: "560e2b4bc90e2fb026ce002d",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Vasiliy Agosta",
                        _id: "55b92ad221e4b7c40f00003a"
                    },
                    id: "560e2b4bc90e2fb026ce002d"
                },
                {
                    _id: "560e2b4bc90e2fb026ce0035",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Sergiy Sheba",
                        _id: "55b92ad221e4b7c40f00007c"
                    },
                    id: "560e2b4bc90e2fb026ce0035"
                },
                {
                    _id: "560e2b4ec90e2fb026ce016c",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Katerina Chupova",
                        _id: "55b92ad221e4b7c40f000048"
                    },
                    id: "560e2b4ec90e2fb026ce016c"
                },
                {
                    _id: "560e2b4ec90e2fb026ce016e",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Ivan Irchak",
                        _id: "55b92ad221e4b7c40f00005c"
                    },
                    id: "560e2b4ec90e2fb026ce016e"
                },
                {
                    _id: "560e2b4ec90e2fb026ce0170",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Roman Guti",
                        _id: "55b92ad221e4b7c40f00007b"
                    },
                    id: "560e2b4ec90e2fb026ce0170"
                },
                {
                    _id: "560e2b51c90e2fb026ce0326",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Ilya Khymych",
                        _id: "55b92ad221e4b7c40f000047"
                    },
                    id: "560e2b51c90e2fb026ce0326"
                },
                {
                    _id: "560e2b51c90e2fb026ce032c",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    employee: {
                        name: "Robert Fogash",
                        _id: "55b92ad221e4b7c40f00007a"
                    },
                    id: "560e2b51c90e2fb026ce032c"
                }
            ],
            WP: [
                {
                    _id: "560e2b4bc90e2fb026cdff7e",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "WP",
                        _id: "55b92ace21e4b7c40f000012"
                    },
                    employee: {
                        name: "Michael Didenko",
                        _id: "55b92ad221e4b7c40f00005e"
                    },
                    id: "560e2b4bc90e2fb026cdff7e"
                },
                {
                    _id: "560e2b4bc90e2fb026cdffe5",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "WP",
                        _id: "55b92ace21e4b7c40f000012"
                    },
                    employee: {
                        name: "Denis Udod",
                        _id: "55b92ad221e4b7c40f000046"
                    },
                    id: "560e2b4bc90e2fb026cdffe5"
                },
                {
                    _id: "560e2b4bc90e2fb026ce0033",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "WP",
                        _id: "55b92ace21e4b7c40f000012"
                    },
                    employee: {
                        name: "Eugen Bernikevich",
                        _id: "55b92ad221e4b7c40f000072"
                    },
                    id: "560e2b4bc90e2fb026ce0033"
                },
                {
                    _id: "560e2b51c90e2fb026ce0324",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "WP",
                        _id: "55b92ace21e4b7c40f000012"
                    },
                    employee: {
                        name: "Bogdan Sakalo",
                        _id: "55b92ad221e4b7c40f000032"
                    },
                    id: "560e2b51c90e2fb026ce0324"
                },
                {
                    _id: "560e2b51c90e2fb026ce0325",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "WP",
                        _id: "55b92ace21e4b7c40f000012"
                    },
                    employee: {
                        name: "Roman Babunich",
                        _id: "55b92ad221e4b7c40f000038"
                    },
                    id: "560e2b51c90e2fb026ce0325"
                }
            ],
            HR: [
                {
                    _id: "560e2b4bc90e2fb026cdff80",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "HR",
                        _id: "55b92ace21e4b7c40f000015"
                    },
                    employee: {
                        name: "Irina Grab",
                        _id: "55b92ad221e4b7c40f000073"
                    },
                    id: "560e2b4bc90e2fb026cdff80"
                }
            ],
            Web: [
                {
                    _id: "560e2b4bc90e2fb026cdffe8",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    employee: {
                        name: "Ivan Kornyk",
                        _id: "55b92ad221e4b7c40f000074"
                    },
                    id: "560e2b4bc90e2fb026cdffe8"
                },
                {
                    _id: "560e2b4bc90e2fb026ce0031",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    employee: {
                        name: "Vasiliy Cheypesh",
                        _id: "55b92ad221e4b7c40f000062"
                    },
                    id: "560e2b4bc90e2fb026ce0031"
                },
                {
                    _id: "560e2b4ec90e2fb026ce016d",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    employee: {
                        name: "Vyacheslav Kopinets",
                        _id: "55b92ad221e4b7c40f00004d"
                    },
                    id: "560e2b4ec90e2fb026ce016d"
                },
                {
                    _id: "560e2b51c90e2fb026ce0329",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    employee: {
                        name: "Roman Buchuk",
                        _id: "55b92ad221e4b7c40f000060"
                    },
                    id: "560e2b51c90e2fb026ce0329"
                }
            ],
            Marketing: [
                {
                    _id: "560e2b4bc90e2fb026ce002e",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Marketing",
                        _id: "55b92ace21e4b7c40f000013"
                    },
                    employee: {
                        name: "Alex Devezenko",
                        _id: "55b92ad221e4b7c40f000044"
                    },
                    id: "560e2b4bc90e2fb026ce002e"
                },
                {
                    _id: "560e2b51c90e2fb026ce032b",
                    year: 2014,
                    month: 4,
                    capacityMonthTotal: 176,
                    __v: 0,
                    capacityArray: [
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8,
                        8,
                        8,
                        null,
                        null,
                        8,
                        8,
                        8
                    ],
                    vacation: null,
                    department: {
                        name: "Marketing",
                        _id: "55b92ace21e4b7c40f000013"
                    },
                    employee: {
                        name: "Lilia Gvozdyo",
                        _id: "55b92ad221e4b7c40f000075"
                    },
                    id: "560e2b51c90e2fb026ce032b"
                }
            ]
        },
        departmentObject: {
            PM: {
                name: "PM",
                _id: "55bb1f40cb76ca630b000007"
            },
            Android: {
                name: "Android",
                _id: "55b92ace21e4b7c40f000010"
            },
            QA: {
                name: "QA",
                _id: "55b92ace21e4b7c40f000011"
            },
            BusinessDev: {
                name: "BusinessDev",
                _id: "55b92ace21e4b7c40f000014"
            },
            iOS: {
                name: "iOS",
                _id: "55b92ace21e4b7c40f00000f"
            },
            WP: {
                name: "WP",
                _id: "55b92ace21e4b7c40f000012"
            },
            HR: {
                name: "HR",
                _id: "55b92ace21e4b7c40f000015"
            },
            Web: {
                name: "Web",
                _id: "55b92ace21e4b7c40f000016"
            },
            Marketing: {
                name: "Marketing",
                _id: "55b92ace21e4b7c40f000013"
            }
        }
    };
    var fakeEmployees = {
        data: [
            {
                _id: "55b92ad221e4b7c40f000030",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    first: "Alex",
                    last: "Svatuk"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000031",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gleba",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003e",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Lapchuk",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000044",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Devezenko",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004f",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Sokhanych",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000057",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Roman",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000058",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Makhanets",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006c",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Sich",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Tutunnik",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000084",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Dahno",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009e",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Michenko",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a7",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Ryabcev",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ac",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Volkov",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ce",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Storojenko",
                    first: "Alex"
                }
            },
            {
                _id: "5638aa635d23a8eb04e80af0",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Siladii",
                    first: "Alex"
                }
            },
            {
                _id: "564dac3e9b85f8b16b574fea",
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    departmentName: "Unity"
                },
                name: {
                    last: "Filchak",
                    first: "Alex"
                }
            },
            {
                _id: "565f0fa6f6427f253cf6bf19",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Lysachenko",
                    first: "Alex"
                }
            },
            {
                _id: "566ede9e8453e8b464b70b71",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Tonkovid",
                    first: "Alex"
                }
            },
            {
                _id: "56b8b99e6c411b590588feb9",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Ovcharenko",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ba",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Klochkova",
                    first: "Alexandra"
                }
            },
            {
                _id: "55c330d529bd6ccd0b000007",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Yurenko",
                    first: "Alina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cb",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Yelahina",
                    first: "Alona"
                }
            },
            {
                _id: "565c66633410ae512364dc00",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Timochchenko",
                    first: "Alona"
                }
            },
            {
                _id: "560264bb8dc408c632000005",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Lyakh",
                    first: "Anastas"
                }
            },
            {
                _id: "55ded6b3ae2b22730b00004e",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Dimova",
                    first: "Anastasia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000059",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Dalekorey",
                    first: "Anatoliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b5",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Lemko",
                    first: "Andriana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000045",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Tivodar",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006e",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Hanchak",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000096",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Herasymyuk",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000098",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Krupka",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a3",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Karpenko",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a8",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    first: "Andriy",
                    last: "Korneychuk"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a9",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Loboda",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b3",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Sarkanych",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bf",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Fizer",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c2",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Mistetskiy",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cd",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    first: "Andriy",
                    last: "Vovk"
                }
            },
            {
                _id: "561bb90a9ebb48212ea838c7",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Svyd",
                    first: "Andriy"
                }
            },
            {
                _id: "561bc5ca9ebb48212ea838c8",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Sokalskiy",
                    first: "Andriy"
                }
            },
            {
                _id: "564da59f9b85f8b16b574fe9",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Chuprov",
                    first: "Andriy"
                }
            },
            {
                _id: "566fe2348453e8b464b70ba6",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Lukashchuk",
                    first: "Andriy"
                }
            },
            {
                _id: "5693b24bd87c9004552b63a1",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Horak",
                    first: "Andriy"
                }
            },
            {
                _id: "56965733d87c9004552b63be",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Samokhin",
                    first: "Andriy"
                }
            },
            {
                _id: "569cce1dcf1f31f925c026fa",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Stupchuk",
                    first: "Andriy"
                }
            },
            {
                _id: "56c19971dfd8a81466e2f6dc",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Khainus",
                    first: "Andriy"
                }
            },
            {
                _id: "56c59ba4d2b48ede4ba42266",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Lytvynenko",
                    first: "Andriy"
                }
            },
            {
                _id: "56dd4b727bd21335130c4f95",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Merentsov",
                    first: "Andriy"
                }
            },
            {
                _id: "56dd4d8eea0939141336783f",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Vasyliev",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b8",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Lobas",
                    first: "Anna"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006f",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Karabeinikov",
                    first: "Anton"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008c",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Gychka",
                    first: "Anton"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000094",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Yarosh",
                    first: "Anton"
                }
            },
            {
                _id: "55c0656ad011746b0b000006",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Nizhegorodov",
                    first: "Anton"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000083",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Zhuk",
                    first: "Antonina"
                }
            },
            {
                _id: "5629e27046bca6e4591f4919",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Petrov",
                    first: "Artem"
                }
            },
            {
                _id: "56b9ccd88f23c5696159cd09",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Antonenko",
                    first: "Artem"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000042",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Myhalko",
                    first: "Artur"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000032",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Sakalo",
                    first: "Bogdan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005a",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Cheypesh",
                    first: "Bogdan"
                }
            },
            {
                _id: "569e63df044ae38173244cfd",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Danyliuk",
                    first: "Bogdan"
                }
            },
            {
                _id: "56e17661177f76f72edf774c",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Stets",
                    first: "Bogdana"
                }
            },
            {
                _id: "56cc7cb7541812c07197357b",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Opanasiuk",
                    first: "Bohdana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000070",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Pozhidaev",
                    first: "Daniil"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b1",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Korniyenko",
                    first: "Daniil"
                }
            },
            {
                _id: "55fbcb65f9210c860c000005",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Shamolina",
                    first: "Daria"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000046",
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    departmentName: "Unity"
                },
                name: {
                    last: "Udod",
                    first: "Denis"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b6",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Vengrin",
                    first: "Denis"
                }
            },
            {
                _id: "55ca0145cbb0f4910b000009",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Zinkovskyi",
                    first: "Denis"
                }
            },
            {
                _id: "55effafa8f1e10e50b000006",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Pavlenko",
                    first: "Denis"
                }
            },
            {
                _id: "5640741570bbc2b740ce89ec",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Lukashov",
                    first: "Denis"
                }
            },
            {
                _id: "565c2793f4dcd63b5dbd7372",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Yaremenko",
                    first: "Denis"
                }
            },
            {
                _id: "566add9aa74aaf316eaea6fc",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Saranyuk",
                    first: "Denis"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000033",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Bruso",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006b",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kanivets",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000071",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Masalovich",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009f",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Dzuba",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bc",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Demchenko",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55cdffa59b42266a4f000015",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Magar",
                    first: "Dmitriy"
                }
            },
            {
                _id: "5600031ba36a8ca10c000028",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Mostiv",
                    first: "Dmitriy"
                }
            },
            {
                _id: "5614d4c7ab24a83b1dc1a7a8",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Babilia",
                    first: "Dmytro"
                }
            },
            {
                _id: "567ac0a48365c9a205406f33",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kolochynsky",
                    first: "Dmytro"
                }
            },
            {
                _id: "564a03d1ad4bc9e53f1f6195",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Tanchenec",
                    first: "Edgard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005b",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Chori",
                    first: "Eduard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000067",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Rudenko",
                    first: "Eduard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000092",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Dedenok",
                    first: "Eduard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000066",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Gromadskiy",
                    first: "Egor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000041",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Oleynikov",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000072",
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    departmentName: "Unity"
                },
                name: {
                    last: "Bernikevich",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008b",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Ugolkov",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a4",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Sokolenko",
                    first: "Eugen"
                }
            },
            {
                _id: "55c32e0d29bd6ccd0b000005",
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    departmentName: "Unity"
                },
                name: {
                    last: "Alexeev",
                    first: "Eugen"
                }
            },
            {
                _id: "55c98aa7cbb0f4910b000005",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Rechun",
                    first: "Eugen"
                }
            },
            {
                _id: "56029cc950de7f4138000005",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Lendyel",
                    first: "Eugen"
                }
            },
            {
                _id: "56e696da81046d9741fb66fc",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Kovbel",
                    first: "Fedir"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000090",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Shterr",
                    first: "Gabriella"
                }
            },
            {
                _id: "56b9d3eb8f23c5696159cd0b",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Mykhailova",
                    first: "Galina"
                }
            },
            {
                _id: "56e045e943fcd85c74307060",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Milchevych",
                    first: "Galina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Kravets",
                    first: "German"
                }
            },
            {
                _id: "568158fc9cceae182b907756",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Belous",
                    first: "Herman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a2",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Stan",
                    first: "Igor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bb",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Shepinka",
                    first: "Igor"
                }
            },
            {
                _id: "56966c82d87c9004552b63c7",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Kuzma",
                    first: "Ihor"
                }
            },
            {
                _id: "56a0d4b162d172544baf0e3a",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Ilnytskyi",
                    first: "Ihor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c6",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Kramarenko",
                    first: "Illia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000035",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mondok",
                    first: "Ilya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000047",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Khymych",
                    first: "Ilya"
                }
            },
            {
                _id: "56090fae86e2435a33000008",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Nukhova",
                    first: "Inna"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000073",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Grab",
                    first: "Irina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000034",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Nazarovich",
                    first: "Ishtvan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005c",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Irchak",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000074",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Kornyk",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000087",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kostromin",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008e",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Grab",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009c",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Feltsan",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a0",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Bilak",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000aa",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Lyashenko",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c8",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Bizilya",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cc",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    first: "Ivan",
                    last: "Lyakh"
                }
            },
            {
                _id: "55c98b86cbb0f4910b000006",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Kovalenko",
                    first: "Ivan"
                }
            },
            {
                _id: "55dd71eaf09cc2ec0b000007",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Khartov",
                    first: "Ivan"
                }
            },
            {
                _id: "56a5ef86aa157ca50f21fb1d",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Pasichnyuk",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000048",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Chupova",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000068",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Bartish",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009a",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Pasichnyuk",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ab",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Olkhovik",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000085",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gorbushko",
                    first: "Kirill"
                }
            },
            {
                _id: "55e419094983acdd0b000012",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    first: "Kirill",
                    last: "Paliiuk"
                }
            },
            {
                _id: "56b9d49d8f23c5696159cd0c",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Bed",
                    first: "Kirill"
                }
            },
            {
                _id: "56b2287b99ce8d706a81b2bc",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Mudrenok",
                    first: "Kostiantyn"
                }
            },
            {
                _id: "55d1e234dda01e250c000015",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Rimar",
                    first: "Kristian"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009b",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Popp",
                    first: "Larysa"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000075",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Gvozdyo",
                    first: "Lilia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c7",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Mykhailova",
                    first: "Liliya"
                }
            },
            {
                _id: "55bf45cf65cda0810b00000a",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    first: "Liliya",
                    last: "Shustur"
                }
            },
            {
                _id: "564a0186ad4bc9e53f1f6193",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Orlenko",
                    first: "Liliya"
                }
            },
            {
                _id: "56d06aef541812c0719735c8",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Garagonich",
                    first: "Liza"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005d",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Gerevich",
                    first: "Lubomir"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c1",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Zasukhina",
                    first: "Maria"
                }
            },
            {
                _id: "5684ec1a1fec73d05393a2a4",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Zaitseva",
                    first: "Maria"
                }
            },
            {
                _id: "560115cf536bd29228000006",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Myhalko",
                    first: "Marianna"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003f",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Kubichka",
                    first: "Marina"
                }
            },
            {
                _id: "56cdd631541812c071973584",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Sheverya",
                    first: "Maryna"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000043",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Geraschenko",
                    first: "Maxim"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000089",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Sychov",
                    first: "Maxim"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a5",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Holubka",
                    first: "Maxim"
                }
            },
            {
                _id: "55c06411d011746b0b000005",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Rachytskyy",
                    first: "Maxim"
                }
            },
            {
                _id: "566ada96a74aaf316eaea69d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Gladovskyy",
                    first: "Maxim"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000036",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Yemets",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000049",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Kapustey",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000055",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Rogach",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005e",
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    departmentName: "Unity"
                },
                name: {
                    last: "Didenko",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000069",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Afendikov",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000076",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Glagola",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000077",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Soyma",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b2",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Yeremenko",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bd",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Vashkeba",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c4",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Myronyshyn",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c5",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gajdan",
                    first: "Michael"
                }
            },
            {
                _id: "55dd7776f09cc2ec0b000009",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Kavka",
                    first: "Michael"
                }
            },
            {
                _id: "5600042ca36a8ca10c000029",
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    departmentName: "Unity"
                },
                name: {
                    last: "Filchak",
                    first: "Michael"
                }
            },
            {
                _id: "5667f310a3fc012a68f0d5f5",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Sopko",
                    first: "Michael"
                }
            },
            {
                _id: "56e2b53e896e98a661aa8326",
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    departmentName: "Unity"
                },
                name: {
                    last: "Ptitsyn",
                    first: "Michael"
                }
            },
            {
                _id: "56b3412299ce8d706a81b2cd",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Kholtobin",
                    first: "Mykola"
                }
            },
            {
                _id: "56cb3695541812c071973546",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Vasylyna",
                    first: "Mykola"
                }
            },
            {
                _id: "565c306af4dcd63b5dbd7373",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Matrafayilo",
                    first: "Myroslav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b7",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Polovka",
                    first: "Myroslava"
                }
            },
            {
                _id: "56bdf283dfd8a81466e2f6d0",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Shishko",
                    first: "Nadiya"
                }
            },
            {
                _id: "56938d2cd87c9004552b639e",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Makarova",
                    first: "Nastya"
                }
            },
            {
                _id: "561ba8639ebb48212ea838c4",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Yartysh",
                    first: "Nataliya"
                }
            },
            {
                _id: "566aa49f4f817b7f51746ec0",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Burtnyk",
                    first: "Nataliya"
                }
            },
            {
                _id: "56af32e174d57e0d56d6bee5",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Sichko",
                    first: "Nataliya"
                }
            },
            {
                _id: "56cdd88b541812c071973585",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Plovayko",
                    first: "Nelya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a6",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Citrak",
                    first: "Norbert"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000be",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Borys",
                    first: "Oksana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c0",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Kordas",
                    first: "Oksana"
                }
            },
            {
                _id: "56e0408e4f9ff8e0737d7c52",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Pylyp",
                    first: "Oksana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003c",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Stasiv",
                    first: "Oleg"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004a",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000078",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Boyanivskiy",
                    first: "Oleg"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008a",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mahobey",
                    first: "Oleg"
                }
            },
            {
                _id: "561ba7039ebb48212ea838c3",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Maliavska",
                    first: "Oleksandra"
                }
            },
            {
                _id: "56b9cbb48f23c5696159cd08",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Kovalenko",
                    first: "Oleksii"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000037",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Shanghin",
                    first: "Oleksiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000079",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gerasimov",
                    first: "Oleksiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000095",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Kuropyatnik",
                    first: "Oleksiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c9",
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    departmentName: "Unity"
                },
                name: {
                    first: "Oleksiy",
                    last: "Fedosov"
                }
            },
            {
                _id: "56e2b6a21f2850d361927dd8",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Protsenko",
                    first: "Oleksiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b9",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Melnyk",
                    first: "Olena"
                }
            },
            {
                _id: "55e96ab13f3ae4fd0b000009",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Pavliuk",
                    first: "Oles"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c3",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    first: "Olesia",
                    last: "Prokoshkina"
                }
            },
            {
                _id: "56123232c90e2fb026ce064b",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Sikora",
                    first: "Olga"
                }
            },
            {
                _id: "55c84a4aaa36a0e60a000005",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Muratov",
                    first: "Pavlo"
                }
            },
            {
                _id: "56964a03d87c9004552b63ba",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Skyba",
                    first: "Pavlo"
                }
            },
            {
                _id: "56a7956faa157ca50f21fb25",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Demko",
                    first: "Pavlo"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005f",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                }
            },
            {
                _id: "55e549309624477a0b000005",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Rospopa",
                    first: "Petro"
                }
            },
            {
                _id: "56cc7ad8541812c071973579",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Tesliuk",
                    first: "Petro"
                }
            },
            {
                _id: "56a78c75aa157ca50f21fb24",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Iyber",
                    first: "Renata"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000051",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mozes",
                    first: "Richard"
                }
            },
            {
                _id: "56e298ab5def9136621b7803",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Shinkovych",
                    first: "Rikhard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007a",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Fogash",
                    first: "Robert"
                }
            },
            {
                _id: "56e6b7d7977124d34db5829c",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Bachynska",
                    first: "Roksana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004b",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Katona",
                    first: "Roland"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000038",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Babunich",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000060",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Buchuk",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007b",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Guti",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000086",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Kubichka",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b0",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Donchenko",
                    first: "Roman"
                }
            },
            {
                _id: "55dd73d1f09cc2ec0b000008",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Vizenko",
                    first: "Roman"
                }
            },
            {
                _id: "55eef3fd6dceaee10b000020",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Saldan",
                    first: "Roman"
                }
            },
            {
                _id: "5667f43da3fc012a68f0d5f6",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Katsala",
                    first: "Roman"
                }
            },
            {
                _id: "568bbdfd5827e3b24d8123a7",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Chaban",
                    first: "Roman"
                }
            },
            {
                _id: "568cd341b2bcba971ba6f5c4",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Rosul",
                    first: "Roman"
                }
            },
            {
                _id: "568cd4c0b2bcba971ba6f5c5",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Osadchuk",
                    first: "Roman"
                }
            },
            {
                _id: "569e3a73044ae38173244cfb",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Martyniuk",
                    first: "Roman"
                }
            },
            {
                _id: "56d5a0c45132d292750a5e7e",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Ukrainskiy",
                    first: "Rostyslav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000056",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Labjak",
                    first: "Ruslan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000097",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Abylgazinov",
                    first: "Samgash"
                }
            },
            {
                _id: "568cdd375527d6691cb68b22",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Melnik",
                    first: "Sergey"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000064",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Tilishevsky",
                    first: "Sergiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007c",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Sheba",
                    first: "Sergiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a1",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Stepaniuk",
                    first: "Sergiy"
                }
            },
            {
                _id: "55d1a2b18f61e2c90b000023",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Degtyar",
                    first: "Sergiy"
                }
            },
            {
                _id: "55dd63f8f09cc2ec0b000006",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Ihnatko",
                    first: "Sergiy"
                }
            },
            {
                _id: "5649b8ccad4bc9e53f1f6192",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Gevelev",
                    first: "Sergiy"
                }
            },
            {
                _id: "5652dd95c4d12cf51e7f7e0b",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Petakh",
                    first: "Sergiy"
                }
            },
            {
                _id: "56e17848f625de2a2f9cacd1",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Biloborodov",
                    first: "Sergiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004c",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Nayda",
                    first: "Sofia"
                }
            },
            {
                _id: "56d823e78230197c0e089038",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Marenych",
                    first: "Sofiya"
                }
            },
            {
                _id: "561b756f9ebb48212ea838c0",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Romanyuk",
                    first: "Stanislav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000039",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Rikun",
                    first: "Stas"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007d",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Volskiy",
                    first: "Stas"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ad",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Krovspey",
                    first: "Stepan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008d",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Kira",
                    first: "Svitlana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ae",
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    departmentName: "Unity"
                },
                name: {
                    last: "Dolottseva",
                    first: "Tamara"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000061",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mondok",
                    first: "Tamas"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000050",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Holovatska",
                    first: "Tamila"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007e",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Zmiy",
                    first: "Taras"
                }
            },
            {
                _id: "564a02e0ad4bc9e53f1f6194",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Dvorian",
                    first: "Taras"
                }
            },
            {
                _id: "56813fe29cceae182b907755",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Ukrainskiy",
                    first: "Taras"
                }
            },
            {
                _id: "56d9497dae35cc4f0e721074",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "TESTING",
                    first: "Test"
                }
            },
            {
                _id: "56cf0928541812c071973593",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Shepitko",
                    first: "Tetiana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000099",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Smertina",
                    first: "Tetyana"
                }
            },
            {
                _id: "55c98df0cbb0f4910b000007",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Berezhnoi",
                    first: "Timur"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006a",
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    departmentName: "Unity"
                },
                name: {
                    last: "Tsipf",
                    first: "Vadim"
                }
            },
            {
                _id: "56011186536bd29228000005",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Khruslov",
                    first: "Valentyn"
                }
            },
            {
                _id: "561bb5329ebb48212ea838c6",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Ladomiryak",
                    first: "Valerii"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000af",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Tokareva",
                    first: "Valeriya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007f",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Klimchenko",
                    first: "Vasilisa"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003a",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Agosta",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000040",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Almashiy",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000053",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Seredniy",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000062",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Cheypesh",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000080",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Barchiy",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000093",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Lupchey",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b4",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Prokopyshyn",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55d1d860dda01e250c000010",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Hoshovsky",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000088",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Buchok",
                    first: "Viktor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000091",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kiver",
                    first: "Viktor"
                }
            },
            {
                _id: "55f9298456f79c9c0c000006",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Manhur",
                    first: "Viktor"
                }
            },
            {
                _id: "56c2f2a7dfd8a81466e2f71f",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Mateleshka",
                    first: "Viktor"
                }
            },
            {
                _id: "5626278d750d38934bfa1313",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Rogachenko",
                    first: "Viktoria"
                }
            },
            {
                _id: "5637710e5d23a8eb04e80aed",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Kovalenko",
                    first: "Viktoria"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003b",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Bizilya",
                    first: "Vitaliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004e",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Shuba",
                    first: "Vitaliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000081",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Sokhanych",
                    first: "Vitaliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000052",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Gerasimenko",
                    first: "Vladimir"
                }
            },
            {
                _id: "561bb1269ebb48212ea838c5",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Pogorilyak",
                    first: "Vladimir"
                }
            },
            {
                _id: "55eeed546dceaee10b00001e",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Turytskyi",
                    first: "Vladyslav"
                }
            },
            {
                _id: "568bbf935827e3b24d8123a8",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Hamalii",
                    first: "Vladyslav"
                }
            },
            {
                _id: "55eee9c26dceaee10b00001d",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Stepanchuk",
                    first: "Volodymyr"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Kopinets",
                    first: "Vyacheslav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000063",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Gusti",
                    first: "Yana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ca",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Vengerova",
                    first: "Yana"
                }
            },
            {
                _id: "55f7c20a6d43203d0c000005",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Samaryk",
                    first: "Yana"
                }
            },
            {
                _id: "5602a01550de7f4138000008",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Dufynets",
                    first: "Yana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000082",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Fuchko",
                    first: "Yaroslav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cf",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Denysiuk",
                    first: "Yaroslav"
                }
            },
            {
                _id: "568bc0b55827e3b24d8123a9",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Syrota",
                    first: "Yaroslav"
                }
            },
            {
                _id: "56014cc8536bd29228000007",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Bezyk",
                    first: "Yevgenia"
                }
            },
            {
                _id: "56e2e83a74ac46664a83e94b",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Melnyk",
                    first: "Yevgenia"
                }
            },
            {
                _id: "55ed5a437221afe30b000006",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Porokhnitska",
                    first: "Yulia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000054",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Derevenko",
                    first: "Yuriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000065",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Sirko",
                    first: "Yuriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008f",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Holovatskyi",
                    first: "Yuriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009d",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Fedynec",
                    first: "Yuriy"
                }
            },
            {
                _id: "55f7c3736d43203d0c000006",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Bodak",
                    first: "Yuriy"
                }
            },
            {
                _id: "56090d77066d979a33000009",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    first: "Yuriy",
                    last: "Bysaha"
                }
            }
        ]
    };

    var view;
    var topBarView;
    var listView;

    var capacityCollection;

    describe('CapacityView', function () {
        var $fixture;
        var $elFixture;

        after(function () {
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

                server.respondWith('GET', '/modules/', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'Capacity'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="77"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="77"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Capacity');

            });

        });

        describe('TopBarView', function () {
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to fetch collection with error response', function(){
                var capacityUrl = new RegExp('\/capacity\/list', 'i');

                server.respondWith('GET', capacityUrl, [401, {"Content-Type": "application/json"}, JSON.stringify(fakeCapacity)]);
                capacityCollection = new CapacityCollection({
                    viewType: 'list',
                    contentType: 'Capacity',
                    month: 4,
                    year: 2016
                });
                server.respond();
            });

            it('Try to create TopBarView', function () {
                var capacityUrl = new RegExp('\/capacity\/list', 'i');

                server.respondWith('GET', capacityUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCapacity)]);
                capacityCollection = new CapacityCollection({
                    viewType: 'list',
                    contentType: 'Capacity'
                });
                server.respond();

                topBarView = new TopBarView({
                    collection: capacityCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Capacity');
            });
        });

        describe('CapacityView', function () {
            var server;
            var windowConfirmStub;
            var clock;
            var mainSpy;

            before(function () {
                window.location.hash = '#easyErp/Capacity/list';

                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                clock.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create Capacity view', function (done) {
                    var $thisEl;
                    var employeesUrl = '/employees/getForDD';
                    var vacationUrl = new RegExp('\/vacation\/list', 'i');

                    server.respondWith('GET', employeesUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployees)]);
                    server.respondWith('GET', vacationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([])]);
                    listView = new ListView({
                        startTime: new Date(),
                        collection: capacityCollection
                    });
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    $thisEl = listView.$el;

                    expect($thisEl.find('.vacation-list')).to.exist;

                    topBarView.bind('copyEvent', listView.copy, listView);
                    topBarView.bind('generateEvent', listView.generate, listView);
                    topBarView.bind('createEvent', listView.createItem, listView);
                    topBarView.bind('editEvent', listView.editItem, listView);
                    topBarView.bind('saveEvent', listView.saveItem, listView);
                    topBarView.bind('deleteEvent', listView.deleteItems, listView);
                    topBarView.bind('generateInvoice', listView.generateInvoice, listView);
                    topBarView.bind('copyRow', listView.copyRow, listView);
                    topBarView.bind('exportToCsv', listView.exportToCsv, listView);
                    topBarView.bind('exportToXlsx', listView.exportToXlsx, listView);
                    topBarView.bind('importEvent', listView.importFiles, listView);
                    topBarView.bind('pay', listView.newPayment, listView);
                    topBarView.bind('changeDateRange', listView.changeDateRange, listView);

                    capacityCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to show more collection with error', function(done){
                    var spyResponse;
                    var capacityUrl = new RegExp('\/capacity\/list', 'i');

                    server.respondWith('GET', capacityUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakeCapacity)]);
                    capacityCollection.showMore();
                    server.respond();

                    clock.tick(200);
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some Error.');

                    done();
                });

                it('Try to show more collection', function(done){
                    var $thisEl;
                    var capacityUrl = new RegExp('\/capacity\/list', 'i');

                    server.respondWith('GET', capacityUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCapacity)]);
                    capacityCollection.showMore({
                        month: 4,
                        year: 2015
                    });
                    server.respond();

                    clock.tick(200);
                    $thisEl = listView.$el;
                    expect($thisEl.find('.vacation-list')).to.exist;

                    done();
                });

                it('Try to open departments capacity', function () {
                    var $thisEl = listView.$el;
                    var $needDepartmentRow = $thisEl.find('.departmentRow[data-name="Web"] td:nth-child(2)');

                    expect($thisEl.find('.subRowsWeb')).to.have.css({'display': 'none'});

                    $needDepartmentRow.click();

                    expect($thisEl.find('.subRowsWeb')).to.have.css({'display': 'table-row'});
                });

                it('Try to sort employees', function () {
                    var $thisEl = listView.$el;
                    var $employeeSortBtn = $thisEl.find('.oe-sortable[data-sort="employee.name"]');

                    $employeeSortBtn.click();
                    expect($thisEl.find('.subRowsWeb').attr('data-id')).to.be.equals('560e2b4ec90e2fb026ce016d');

                    $employeeSortBtn.click();
                    expect($thisEl.find('.subRowsWeb').attr('data-id')).to.be.equals('560e2b4bc90e2fb026cdffe8');
                });

                it('Try to create item', function () {
                    var $newTr;
                    var $selectEmployeeEl;
                    var $next;
                    var $prev;
                    var $selectedItem;
                    var $thisEl = listView.$el;
                    var $createBtn = $thisEl.find('.departmentRow[data-name="Web"] .createBtn');

                    $createBtn.click();
                    $newTr = $thisEl.find('.false');
                    $selectEmployeeEl = $newTr.find('td[data-content="employee"]');
                    $selectEmployeeEl.click();
                    $next = $thisEl.find('.next');
                    $next.click();
                    $prev = $thisEl.find('.prev');
                    $prev.click();
                    $selectedItem = $thisEl.find('#55b92ad221e4b7c40f000030');
                    $selectedItem.click();

                    expect($thisEl.find('.false > td[data-dayid="0"]').text()).to.be.equals('8');
                });

                it('Try to save created item', function () {
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var capacityUrl = new RegExp('\/capacity\/', 'i');
                    var hashUrlCapacity = new RegExp('#easyErp\/Capacity', 'i');

                    server.respondWith('GET', capacityUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Created success'})]);
                    $saveBtn.click();
                    server.respond();

                    /!*if (firefoxPattern.test(userAgent)) {
                        expect(window.location.hash).to.be.equals('#easyErp/Capacity');
                    } else {*!/
                        expect(hashUrlCapacity.test(window.location.hash)).to.be.true;
                    /!*}*!/
                });

                it('Try to delete items', function () {
                    var $thisEl = listView.$el;
                    var $needRow = $thisEl.find('tr[data-id="560e2b4ec90e2fb026ce016d"]');
                    var $needCheckbox = $needRow.find('.notForm > input');
                    var capacityUrl = new RegExp('\/Capacity\/', 'i');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    windowConfirmStub.returns(true);

                    listView.changed = false;
                    $needCheckbox.click();

                    server.respondWith('DELETE', capacityUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Deleted success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect($thisEl.find('tr[data-id="560e2b4ec90e2fb026ce016d"]')).to.not.exist;

                });

                it('Try to edit item', function () {
                    var $thisEl = listView.$el;
                    var $needInput;
                    var $totalHoursTd;
                    var $needRow = $thisEl.find('tr[data-id="560e2b51c90e2fb026ce0329"]');
                    var $editTd = $needRow.find('td[data-dayid="0"]');
                    var $anotherTd = $needRow.find('td[data-dayid="1"]');
                    var capacityUrl = new RegExp('\/capacity\/', 'i');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var hashUrlCapacity = new RegExp('#easyErp\/Capacity', 'i');

                    $editTd.click();
                    $needInput = $editTd.find('input');
                    $needInput.val('16');
                    $anotherTd.click();
                    $totalHoursTd = $needRow.find('td.totalHours');

                    expect($totalHoursTd.text().trim()).to.be.equals('184');
                    server.respondWith('DELETE', capacityUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Deleted success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect(hashUrlCapacity.test(window.location.hash)).to.be.true;
                });
            });
        });
    });
});
*/
