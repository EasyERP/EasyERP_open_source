/*
define([
    'text!fixtures/index.html',
    'collections/Workflows/WorkflowsCollection',
    'views/main/MainView',
    'views/Workflows/ContentView',
    'views/Workflows/TopBarView',
    'views/Workflows/list/ListItemView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, WorkflowsCollection, MainView, ContentView, TopBarView,  ListItemView, $, chai, chaiJquery, sinonChai, Custom) {
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

    var fakeWorkflows = {
        data: [
            {
                _id: "528ce51cf3f67bc40b000015",
                __v: 0,
                attachments: [],
                name: "Initial Qualification",
                sequence: 6,
                status: "New",
                wId: "Applications",
                wName: "application",
                source: "application",
                targetSource: [
                    "application"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "52fa5108a7bec22c19000018",
                __v: 0,
                attachments: [],
                name: "Ready to teach",
                sequence: 6,
                status: "Pending",
                wId: "Applications",
                wName: "application",
                source: "application",
                targetSource: [
                    "application"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce0cdf3f67bc40b00000c",
                __v: 0,
                attachments: [],
                name: "New",
                sequence: 5,
                status: "New",
                wId: "Tasks",
                wName: "task",
                source: "task",
                targetSource: [
                    "task"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce53bf3f67bc40b000016",
                __v: 0,
                attachments: [],
                name: "First Interview",
                sequence: 5,
                status: "In Progress",
                wId: "Applications",
                wName: "application",
                source: "application",
                targetSource: [
                    "application"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528cdcb4f3f67bc40b000006",
                __v: 0,
                attachments: [],
                name: "New",
                sequence: 4,
                status: "New",
                wId: "Opportunities",
                wName: "opportunity",
                source: "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce131f3f67bc40b00000d",
                __v: 0,
                attachments: [],
                name: "In Progress",
                sequence: 4,
                status: "In Progress",
                wId: "Tasks",
                wName: "task",
                source: "task",
                targetSource: [
                    "task"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce553f3f67bc40b000017",
                __v: 0,
                attachments: [],
                name: "Second Interview",
                sequence: 4,
                status: "In Progress",
                wId: "Applications",
                wName: "application",
                source: "application",
                targetSource: [
                    "application"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce74ef3f67bc40b00001e",
                __v: 0,
                attachments: [],
                name: "Draft",
                sequence: 4,
                status: "New",
                wId: "Leads",
                wName: "lead",
                source: "lead",
                targetSource: [
                    "lead"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce7d0f3f67bc40b000021",
                __v: 0,
                attachments: [],
                name: "New",
                sequence: 4,
                status: "New",
                wId: "Projects",
                wName: "project",
                source: "project",
                targetSource: [
                    "project"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "5555e54c6a3f01acae0b5564",
                name: "Draft",
                sequence: 4,
                status: "New",
                wId: "Purchase Invoice",
                wName: "invoice",
                source: "purchase",
                targetSource: [
                    "invoice"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "55647d932e4aa3804a765ec9",
                name: "Unpaid",
                sequence: 4,
                status: "New",
                wId: "Sales Invoice",
                wName: "invoice",
                source: "purchase",
                targetSource: [
                    "invoice"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528cdd2af3f67bc40b000007",
                __v: 0,
                attachments: [],
                name: "Qualification",
                sequence: 3,
                status: "In Progress",
                wId: "Opportunities",
                wName: "opportunity",
                source: "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce30cf3f67bc40b00000f",
                __v: 0,
                attachments: [],
                name: "Fixed",
                sequence: 3,
                status: "In Progress",
                wId: "Tasks",
                wName: "task",
                source: "task",
                targetSource: [
                    "task"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce5e3f3f67bc40b000018",
                __v: 0,
                attachments: [],
                name: "Internship",
                sequence: 3,
                status: "Pending",
                wId: "Applications",
                wName: "application",
                source: "application",
                targetSource: [
                    "application"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce7e3f3f67bc40b000022",
                __v: 0,
                attachments: [],
                name: "Pending",
                sequence: 3,
                status: "Pending",
                wId: "Projects",
                wName: "project",
                source: "project",
                targetSource: [
                    "project"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "52b4265cc033b7e25ac4f91c",
                attachments: [],
                name: "Open",
                sequence: 3,
                status: "New",
                wId: "Leads",
                wName: "lead",
                source: "lead",
                targetSource: [
                    "lead"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "5555bf276a3f01acae0b5560",
                name: "Not Ordered",
                sequence: 3,
                status: "New",
                wId: "Purchase Order",
                wName: "order",
                source: "purchase",
                targetSource: [
                    "quotation"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "5555e570671a8b6800000003",
                sequence: 3,
                status: "In Progress",
                name: "Partially Paid",
                wId: "Purchase Invoice",
                __v: 0,
                source: "purchase",
                targetSource: [
                    "invoice"
                ],
                wName: "invoice",
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "55647b932e4aa3804a765ec5",
                name: "Not Invoiced",
                sequence: 3,
                status: "New",
                wId: "Sales Order",
                wName: "order",
                source: "purchase",
                targetSource: [
                    "quotation"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "55647d952e4aa3804a765eca",
                sequence: 3,
                status: "In Progress",
                name: "Partially Paid",
                wId: "Sales Invoice",
                __v: 0,
                source: "purchase",
                targetSource: [
                    "invoice"
                ],
                wName: "invoice",
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528cde9ef3f67bc40b000008",
                __v: 0,
                attachments: [],
                name: "Proposition",
                sequence: 2,
                status: "In Progress",
                wId: "Opportunities",
                wName: "opportunity",
                source: "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce35af3f67bc40b000010",
                __v: 0,
                attachments: [],
                name: "Testing",
                sequence: 2,
                status: "In Progress",
                wId: "Tasks",
                wName: "task",
                source: "task",
                targetSource: [
                    "task"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce61bf3f67bc40b000019",
                __v: 0,
                attachments: [],
                name: "Contract Signed",
                sequence: 2,
                status: "Hired",
                wId: "Applications",
                wName: "application",
                source: "application",
                targetSource: [
                    "application"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce779f3f67bc40b00001f",
                __v: 0,
                attachments: [],
                name: "In Progress",
                sequence: 2,
                status: "In Progress",
                wId: "Leads",
                wName: "lead",
                source: "lead",
                targetSource: [
                    "lead"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce7f2f3f67bc40b000023",
                __v: 0,
                attachments: [],
                name: "In Progress",
                sequence: 2,
                status: "In Progress",
                wId: "Projects",
                wName: "project",
                source: "project",
                targetSource: [
                    "project"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "5555bf276a3f01acae0b5561",
                name: "Invoiced",
                sequence: 2,
                status: "Done",
                wId: "Purchase Order",
                wName: "order",
                source: "purchase",
                targetSource: [
                    "order"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "5555e5b9671a8b6800000004",
                sequence: 2,
                status: "Done",
                name: "Paid",
                wId: "Purchase Invoice",
                __v: 0,
                source: "purchase",
                targetSource: [
                    "invoice"
                ],
                wName: "invoice",
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "55647d982e4aa3804a765ecb",
                sequence: 2,
                status: "Done",
                name: "Paid",
                wId: "Sales Invoice",
                __v: 0,
                source: "purchase",
                targetSource: [
                    "invoice"
                ],
                wName: "invoice",
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528cdef4f3f67bc40b00000a",
                __v: 0,
                attachments: [],
                name: "Won",
                sequence: 1,
                status: "Done",
                wId: "Opportunities",
                wName: "opportunity",
                source: "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce3acf3f67bc40b000012",
                __v: 0,
                attachments: [],
                name: "Done",
                sequence: 1,
                status: "Done",
                wId: "Tasks",
                wName: "task",
                source: "task",
                targetSource: [
                    "task"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce700f3f67bc40b00001c",
                __v: 0,
                attachments: [],
                name: "No Recruitment",
                sequence: 1,
                status: "New",
                wId: "Job positions",
                wName: "jobposition",
                source: "jobposition",
                targetSource: [
                    "jobposition"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce82df3f67bc40b000025",
                __v: 0,
                attachments: [],
                name: "Closed",
                sequence: 1,
                status: "Done",
                wId: "Projects",
                wName: "project",
                source: "project",
                targetSource: [
                    "project"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "52b426b7c033b7e25ac4f91d",
                attachments: [],
                name: "Closed",
                sequence: 1,
                status: "Done",
                wId: "Leads",
                wName: "lead",
                source: "lead",
                targetSource: [
                    "lead"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "52d2c1369b57890814000005",
                __v: 0,
                attachments: [],
                name: "Contract End",
                sequence: 1,
                status: "Cancelled",
                wId: "Applications",
                wName: "",
                source: "",
                targetSource: [
                    ""
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "55647b962e4aa3804a765ec6",
                name: "Invoiced",
                sequence: 1,
                status: "Done",
                wId: "Sales Order",
                wName: "order",
                source: "purchase",
                targetSource: [
                    "order"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "56599347bfd103f108eb4caa",
                sequence: 1,
                status: "In Progress",
                name: "Not Invoiced",
                wId: "Purchase Order",
                __v: 0,
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528cdf1cf3f67bc40b00000b",
                __v: 0,
                attachments: [],
                name: "Lost",
                sequence: 0,
                status: "Cancelled",
                wId: "Opportunities",
                wName: "opportunity",
                source: "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce3caf3f67bc40b000013",
                __v: 0,
                attachments: [],
                name: "Cancelled",
                sequence: 0,
                status: "Cancelled",
                wId: "Tasks",
                wName: "task",
                source: "task",
                targetSource: [
                    "task"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce682f3f67bc40b00001a",
                __v: 0,
                attachments: [],
                name: "Refused",
                sequence: 0,
                status: "Cancelled",
                wId: "Applications",
                wName: "application",
                source: "application",
                targetSource: [
                    "application"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce79bf3f67bc40b000020",
                __v: 0,
                attachments: [],
                name: "Cancelled",
                sequence: 0,
                status: "Cancelled",
                wId: "Leads",
                wName: "lead",
                source: "lead",
                targetSource: [
                    "lead"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce80ef3f67bc40b000024",
                __v: 0,
                attachments: [],
                name: "Cancelled",
                sequence: 0,
                status: "Cancelled",
                wId: "Projects",
                wName: "project",
                source: "project",
                targetSource: [
                    "project"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "555b09686ba860c41b000003",
                sequence: 0,
                status: "Cancelled",
                name: "Cancelled",
                wId: "Purchase Invoice",
                __v: 0,
                source: "purchase",
                targetSource: [
                    "invoice"
                ],
                wName: "invoice",
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "528ce71ef3f67bc40b00001d",
                __v: 0,
                attachments: [],
                name: "Recruitement in Progress",
                sequence: -1,
                status: "In Progress",
                wId: "Job positions",
                wName: "jobposition",
                source: "jobposition",
                targetSource: [
                    "jobposition"
                ],
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "56337c675d49d8d6537832ea",
                wId: "Jobs",
                name: "Finished",
                status: "Done",
                source: "jobs",
                visible: true,
                color: "#2C3E50"
            },
            {
                _id: "56337c705d49d8d6537832eb",
                wId: "Jobs",
                name: "In Progress",
                status: "In Progress",
                source: "jobs",
                visible: true,
                color: "#2C3E50"
            }
        ]
    };

    var fakeStatuses = {
        data: [
            {
                _id: 1,
                attachments: [ ],
                status: "New"
            },
            {
                _id: 2,
                attachments: [ ],
                status: "In Progress"
            },
            {
                _id: 3,
                attachments: [ ],
                status: "Pending"
            },
            {
                _id: 4,
                attachments: [ ],
                status: "Done"
            },
            {
                _id: 5,
                attachments: [ ],
                status: "Cancelled"
            }
        ]
    };

    var server;
    var view;
    var topBarView;
    var listView;
    var workflowCollection;

    describe('WorkFlow View', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            view.remove();

        });

        describe('#initialize()', function () {

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
                server.respondWith('GET', '/account/authenticated', [200, {"Content-Type": "application/json"}, 'OK']);

                view = new MainView({el: $elFixture, contentType: 'Workflows'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="44"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="44"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Workflows');

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

            it('Try to create TopBarView', function () {
                var workflowUrl = new RegExp('\/Workflows', 'i');

                server.respondWith('GET', workflowUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWorkflows)]);

                workflowCollection = new WorkflowsCollection({
                    count: 0,
                    page: 1,
                    contentType: 'Workflows'

                });
                server.respond();

                topBarView = new TopBarView({
                    collection: workflowCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Workflows');
            });

        });

        describe('Workflows list view', function () {
            var server;
            var windowConfirmStub;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
            });

            after(function () {
                server.restore();
                view.remove();
                listView.remove();

                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function(){

                it('Try to create workflow list view', function () {
                    var $contentHolderEl;
                    var $workflowListEl;
                    var $workflowAccordEl;
                    var relatedStatusesUrl = new RegExp('\/workflows\/relatedStatus', 'i');

                    server.respondWith('GET', relatedStatusesUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeStatuses)]);

                    listView = new ContentView({
                        collection: workflowCollection,
                        startTime: new Date()
                    });

                    server.respond();

                    $contentHolderEl = view.$el.find('#content-holder');
                    $workflowListEl = $contentHolderEl.find('.workflow-list-wrapper');
                    $workflowAccordEl = $contentHolderEl.find('#workflowAccord');

                    expect($contentHolderEl).to.exist;
                    expect($workflowListEl).to.exist;
                    expect($workflowListEl).to.have.class('left');
                    expect($workflowAccordEl.find('#workflowNames').text()).to.equals('\n        ');

                });

                it('Try to click li Applications', function(){
                    var $contentHolderEl;
                    var $workflowListEl;
                    var $workflowAccordEl;
                    var $needLiEl;
                    var workflowUrl = new RegExp('/Workflows', 'i');

                    $contentHolderEl = view.$el.find('#content-holder');
                    $workflowListEl = $contentHolderEl.find('.workflow-list-wrapper');
                    $workflowAccordEl = $contentHolderEl.find('#workflowAccord');
                    $needLiEl = $workflowListEl.find('li[data-id="Applications"]');

                    server.respondWith('GET', workflowUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWorkflows)]);
                    $needLiEl.click();
                    server.respond();

                    expect($workflowAccordEl.find('#details').text()).not.to.equals('\n        ');

                });

                it ('Try to open editForm', function(){
                    var firstAccEl = $('.row')[0];
                    var $needAEl = $(firstAccEl).find('.edit');

                    $needAEl.click();

                    expect($(firstAccEl).find('span.name')).to.have.class('hidden');
                    expect($(firstAccEl).find('span.status')).to.have.class('hidden');
                    expect($(firstAccEl).find('input')).to.have.exist;
                    expect($(firstAccEl).find('select')).to.have.exist;


                });

                it ('Try to edit item', function(){
                    var $firstAccEl = $('.row:nth-child(1)');
                    var $saveBtn = $firstAccEl.find('.save');
                    var $needInput = $firstAccEl.find('input');
                    var workflowUrl = new RegExp('\/workflows\/', 'i');

                    $needInput.val('Test workflow');

                    server.respondWith('PUT', workflowUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([{
                        status  : 'Pending'
                    }])]);

                    $saveBtn.click();

                    server.respond();

                });

                it('Try to delete item', function(){
                    var $firstEl = $('#workflows > div:nth-child(1)');
                    var $deleteBtn = $firstEl.find('.delete');
                    var workflowUrl = new RegExp('\/workflows\/', 'i');

                    windowConfirmStub.returns(true);

                    server.respondWith('DELETE', workflowUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([{success: 'Delete success'}])]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('#workflows > div:nth-child(2) > div.name').attr('data-id')).to.be.equals('528ce53bf3f67bc40b000016');

                });

                it('Try to create new status', function(){
                    var $saveBtn;
                    var $createBtn = listView.$el.find('#addNewStatus');
                    var $addedNew;
                    var $statusInput;
                    var workflowUrl = new RegExp('\/workflows\/', 'i');

                    $createBtn.click();

                    $addedNew = listView.$el.find('.addnew');
                    $statusInput = $addedNew.find('input');

                    $statusInput.val('Super Test workflow');
                    $saveBtn = $addedNew.find('#saveStatus');

                    server.respondWith('POST', workflowUrl, [201, {"Content-Type": "application/json"}, JSON.stringify([{success: 'Created success'}])]);
                    $saveBtn.click();
                    server.respond();

                    expect(window.location.hash).to.equals('#easyErp/Workflows');
                });
            });

        });


    });


});
*/
