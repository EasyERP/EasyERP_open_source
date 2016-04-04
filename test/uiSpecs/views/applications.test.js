/*
define([
    'text!fixtures/index.html',
    'collections/Applications/filterCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/main/MainView',
    'views/Applications/list/ListView',
    'views/Applications/kanban/KanbanView',
    'views/Applications/form/FormView',
    'views/Applications/TopBarView',
    'views/Applications/CreateView',
    'views/Applications/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, ApplicationCollection, WorkflowCollection, MainView, ListView, KanBanView, FormView, TopBarView, CreateView, EditView, $, chai, chaiJquery, sinonChai, Custom) {
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
    var fakeApplication = {
        data: [
            {
                _id: "55b92ad221e4b7c40f000078",
                proposedSalary: 0,
                nextAction: "",
                sequence: 0,
                editedBy: {
                    date: "2016-04-01T15:14:48.490Z"
                },
                workflow: {
                    _id: "52d2c1369b57890814000005"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000018",
                    name: "Junior QA"
                },
                name: {
                    last: "Boyanivskiy",
                    first: "Oleg"
                },
                fullName: "Oleg Boyanivskiy",
                id: "55b92ad221e4b7c40f000078"
            },
            {
                _id: "56b9ccd88f23c5696159cd09",
                proposedSalary: 0,
                nextAction: "",
                sequence: -1,
                editedBy: {
                    date: "2016-03-11T12:29:55.515Z"
                },
                workflow: {
                    _id: "52d2c1369b57890814000005"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000021",
                    name: "Junior Android"
                },
                name: {
                    last: "Antonenko",
                    first: "Artem"
                },
                fullName: "Artem Antonenko",
                id: "56b9ccd88f23c5696159cd09"
            }
        ],
        workflowId: "52d2c1369b57890814000005"
    };
    var fakeWorkflows = {
        data: [
            {
                _id: "528ce51cf3f67bc40b000015",
                __v: 0,
                attachments: [ ],
                name: "Initial dsf",
                sequence: 4,
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
                _id: "528ce53bf3f67bc40b000016",
                __v: 0,
                attachments: [ ],
                name: "First Interview",
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
                _id: "52fa5108a7bec22c19000018",
                __v: 0,
                attachments: [ ],
                name: "Ready to teach",
                sequence: 4,
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
                _id: "528ce553f3f67bc40b000017",
                __v: 0,
                attachments: [ ],
                name: "Second Interview",
                sequence: 3,
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
                _id: "528ce5e3f3f67bc40b000018",
                __v: 0,
                attachments: [ ],
                name: "Internship",
                sequence: 2,
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
                _id: "528ce61bf3f67bc40b000019",
                __v: 0,
                attachments: [ ],
                name: "Contract Signed",
                sequence: 1,
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
                _id: "52d2c1369b57890814000005",
                __v: 0,
                attachments: [ ],
                name: "Contract End",
                sequence: 0,
                status: "Cancelled",
                wId: "Applications",
                wName: "",
                source: "",
                targetSource: [
                    ""
                ],
                visible: true,
                color: "#2C3E50"
            }
        ]
    };
    var fakeApplicationById = {
        enableView: true,
        _id: "55b92ad221e4b7c40f000078",
        dateBirth: "1988-11-12T00:00:00.000Z",
        ID: 33,
        isLead: 0,
        __v: 0,
        proposedSalary: 0,
        expectedSalary: 0,
        nextAction: "",
        passportNo: "",
        identNo: "",
        lastFire: 201607,
        fire: [
            {
                date: "2013-10-12T21:00:00.000Z",
                info: "Update",
                salary: 500,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    },
                    fullName: "Yana Gusti",
                    id: "55b92ad221e4b7c40f000063"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000018",
                    name: "Junior QA"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                }
            },
            {
                date: "2016-02-15T22:00:00.000Z",
                info: "Fired",
                salary: 600,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    },
                    fullName: "Yana Gusti",
                    id: "55b92ad221e4b7c40f000063"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000018",
                    name: "Junior QA"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                }
            }
        ],
        hire: [
            {
                date: "2013-10-12T21:00:00.000Z",
                info: "",
                salary: 500,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    },
                    fullName: "Yana Gusti",
                    id: "55b92ad221e4b7c40f000063"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000018",
                    name: "Junior QA"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                }
            },
            {
                date: "2014-10-31T22:00:00.000Z",
                info: "Update",
                salary: 600,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    },
                    fullName: "Yana Gusti",
                    id: "55b92ad221e4b7c40f000063"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000018",
                    name: "Junior QA"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                }
            }
        ],
        social: {
            GP: "",
            LI: "",
            FB: ""
        },
        sequence: 0,
        jobType: "Full-time",
        gender: "male",
        marital: "unmarried",
        contractEnd: {
            date: "2016-02-15T22:00:00.000Z",
            reason: "Fired"
        },
        attachments: [ ],
        editedBy: {
            date: "2016-04-04T06:35:07.821Z",
            user: {
                _id: "52203e707d4dba8813000003",
                __v: 0,
                attachments: [ ],
                lastAccess: "2016-04-04T06:06:58.757Z",
                profile: 1387275598000,
                relatedEmployee: "55b92ad221e4b7c40f00004f",
                savedFilters: [
                    {
                        _id: "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id: "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id: "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    }
                ],
                kanbanSettings: {
                    tasks: {
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ],
                        countPerPage: 10
                    },
                    applications: {
                        foldWorkflows: [
                            "Empty"
                        ],
                        countPerPage: 100
                    },
                    opportunities: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    }
                },
                credentials: {
                    access_token: "",
                    refresh_token: ""
                },
                pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                email: "info@thinkmobiles.com",
                login: "admin",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        createdBy: {
            date: "2015-07-29T19:34:42.477Z",
            user: {
                _id: "52203e707d4dba8813000003",
                __v: 0,
                attachments: [ ],
                lastAccess: "2016-04-04T06:06:58.757Z",
                profile: 1387275598000,
                relatedEmployee: "55b92ad221e4b7c40f00004f",
                savedFilters: [
                    {
                        _id: "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id: "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id: "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    }
                ],
                kanbanSettings: {
                    tasks: {
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ],
                        countPerPage: 10
                    },
                    applications: {
                        foldWorkflows: [
                            "Empty"
                        ],
                        countPerPage: 100
                    },
                    opportunities: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    }
                },
                credentials: {
                    access_token: "",
                    refresh_token: ""
                },
                pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                email: "info@thinkmobiles.com",
                login: "admin",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        creationDate: "2015-07-29T19:34:42.477Z",
        color: "#4d5a75",
        otherInfo: "",
        groups: {
            group: [ ],
            users: [ ],
            owner: {
                _id: "55ba28c8d79a3a3439000016",
                login: "AndrianaLemko"
            }
        },
        whoCanRW: "everyOne",
        workflow: {
            _id: "52d2c1369b57890814000005",
            __v: 0,
            attachments: [ ],
            name: "Contract End",
            sequence: 0,
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
        active: false,
        referredBy: "",
        source: "",
        age: 27,
        homeAddress: {
            country: "",
            zip: "",
            state: "",
            city: "",
            street: ""
        },
        otherId: "",
        bankAccountNo: "",
        nationality: "Ukrainian",
        coach: null,
        manager: {
            _id: "55b92ad221e4b7c40f000063",
            name: {
                last: "Gusti",
                first: "Yana"
            },
            fullName: "Yana Gusti",
            id: "55b92ad221e4b7c40f000063"
        },
        jobPosition: {
            _id: "55b92acf21e4b7c40f000018",
            name: "Junior QA"
        },
        department: {
            _id: "55b92ace21e4b7c40f000011",
            departmentName: "QA"
        },
        visibility: "Public",
        relatedUser: null,
        officeLocation: "",
        skype: "oleg_boyanivsky",
        workPhones: {
            phone: "",
            mobile: "+380951502044"
        },
        personalEmail: "boyanivsky@gmail.com",
        workEmail: "oleg.boyanivskiy@thinkmobiles.com",
        workAddress: {
            country: "",
            zip: "",
            state: "",
            city: "",
            street: ""
        },
        tags: [
            ""
        ],
        name: {
            last: "Boyanivskiy",
            first: "Oleg"
        },
        subject: "",
        imageSrc: "data:image/jpeg;base64,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",
        isEmployee: false,
        fullName: "Oleg Boyanivskiy",
        id: "55b92ad221e4b7c40f000078"
    };
    var fakeEmployees = {
        data: [
            {
                _id: "55b92ad221e4b7c40f000030",
                name: {
                    last: "Svatuk",
                    first: "Alex"
                },
                fullName: "Alex Svatuk",
                id: "55b92ad221e4b7c40f000030"
            },
            {
                _id: "55b92ad221e4b7c40f000031",
                name: {
                    last: "Gleba",
                    first: "Alex"
                },
                fullName: "Alex Gleba",
                id: "55b92ad221e4b7c40f000031"
            },
            {
                _id: "55b92ad221e4b7c40f00003e",
                name: {
                    last: "Lapchuk",
                    first: "Alex"
                },
                fullName: "Alex Lapchuk",
                id: "55b92ad221e4b7c40f00003e"
            },
            {
                _id: "55b92ad221e4b7c40f000044",
                name: {
                    last: "Devezenko",
                    first: "Alex"
                },
                fullName: "Alex Devezenko",
                id: "55b92ad221e4b7c40f000044"
            },
            {
                _id: "55b92ad221e4b7c40f00004f",
                name: {
                    last: "Sokhanych",
                    first: "Alex"
                },
                fullName: "Alex Sokhanych",
                id: "55b92ad221e4b7c40f00004f"
            },
            {
                _id: "55b92ad221e4b7c40f000057",
                name: {
                    last: "Roman",
                    first: "Alex"
                },
                fullName: "Alex Roman",
                id: "55b92ad221e4b7c40f000057"
            },
            {
                _id: "55b92ad221e4b7c40f000058",
                name: {
                    last: "Makhanets",
                    first: "Alex"
                },
                fullName: "Alex Makhanets",
                id: "55b92ad221e4b7c40f000058"
            },
            {
                _id: "55b92ad221e4b7c40f00006c",
                name: {
                    last: "Sich",
                    first: "Alex"
                },
                fullName: "Alex Sich",
                id: "55b92ad221e4b7c40f00006c"
            },
            {
                _id: "55b92ad221e4b7c40f00006d",
                name: {
                    last: "Tutunnik",
                    first: "Alex"
                },
                fullName: "Alex Tutunnik",
                id: "55b92ad221e4b7c40f00006d"
            },
            {
                _id: "55b92ad221e4b7c40f000084",
                name: {
                    last: "Dahno",
                    first: "Alex"
                },
                fullName: "Alex Dahno",
                id: "55b92ad221e4b7c40f000084"
            },
            {
                _id: "55b92ad221e4b7c40f00009e",
                name: {
                    last: "Michenko",
                    first: "Alex"
                },
                fullName: "Alex Michenko",
                id: "55b92ad221e4b7c40f00009e"
            },
            {
                _id: "55b92ad221e4b7c40f0000a7",
                name: {
                    last: "Ryabcev",
                    first: "Alex"
                },
                fullName: "Alex Ryabcev",
                id: "55b92ad221e4b7c40f0000a7"
            },
            {
                _id: "55b92ad221e4b7c40f0000ac",
                name: {
                    last: "Volkov",
                    first: "Alex"
                },
                fullName: "Alex Volkov",
                id: "55b92ad221e4b7c40f0000ac"
            },
            {
                _id: "55b92ad221e4b7c40f0000ce",
                name: {
                    last: "Storojenko",
                    first: "Alex"
                },
                fullName: "Alex Storojenko",
                id: "55b92ad221e4b7c40f0000ce"
            },
            {
                _id: "5638aa635d23a8eb04e80af0",
                name: {
                    last: "Siladii",
                    first: "Alex"
                },
                fullName: "Alex Siladii",
                id: "5638aa635d23a8eb04e80af0"
            },
            {
                _id: "564dac3e9b85f8b16b574fea",
                name: {
                    last: "Filchak",
                    first: "Alex"
                },
                fullName: "Alex Filchak",
                id: "564dac3e9b85f8b16b574fea"
            },
            {
                _id: "565f0fa6f6427f253cf6bf19",
                name: {
                    last: "Lysachenko",
                    first: "Alex"
                },
                fullName: "Alex Lysachenko",
                id: "565f0fa6f6427f253cf6bf19"
            },
            {
                _id: "566ede9e8453e8b464b70b71",
                name: {
                    last: "Tonkovid",
                    first: "Alex"
                },
                fullName: "Alex Tonkovid",
                id: "566ede9e8453e8b464b70b71"
            },
            {
                _id: "56b8b99e6c411b590588feb9",
                name: {
                    last: "Ovcharenko",
                    first: "Alex"
                },
                fullName: "Alex Ovcharenko",
                id: "56b8b99e6c411b590588feb9"
            },
            {
                _id: "55b92ad221e4b7c40f0000ba",
                name: {
                    last: "Klochkova",
                    first: "Alexandra"
                },
                fullName: "Alexandra Klochkova",
                id: "55b92ad221e4b7c40f0000ba"
            },
            {
                _id: "55c330d529bd6ccd0b000007",
                name: {
                    last: "Yurenko",
                    first: "Alina"
                },
                fullName: "Alina Yurenko",
                id: "55c330d529bd6ccd0b000007"
            },
            {
                _id: "55b92ad221e4b7c40f0000cb",
                name: {
                    last: "Yelahina",
                    first: "Alona"
                },
                fullName: "Alona Yelahina",
                id: "55b92ad221e4b7c40f0000cb"
            },
            {
                _id: "565c66633410ae512364dc00",
                name: {
                    last: "Timochchenko",
                    first: "Alona"
                },
                fullName: "Alona Timochchenko",
                id: "565c66633410ae512364dc00"
            },
            {
                _id: "560264bb8dc408c632000005",
                name: {
                    last: "Lyakh",
                    first: "Anastas"
                },
                fullName: "Anastas Lyakh",
                id: "560264bb8dc408c632000005"
            },
            {
                _id: "55ded6b3ae2b22730b00004e",
                name: {
                    last: "Dimova",
                    first: "Anastasia"
                },
                fullName: "Anastasia Dimova",
                id: "55ded6b3ae2b22730b00004e"
            },
            {
                _id: "55b92ad221e4b7c40f000059",
                name: {
                    last: "Dalekorey",
                    first: "Anatoliy"
                },
                fullName: "Anatoliy Dalekorey",
                id: "55b92ad221e4b7c40f000059"
            },
            {
                _id: "55b92ad221e4b7c40f0000b5",
                name: {
                    last: "Lemko",
                    first: "Andriana"
                },
                fullName: "Andriana Lemko",
                id: "55b92ad221e4b7c40f0000b5"
            },
            {
                _id: "55b92ad221e4b7c40f000045",
                name: {
                    last: "Tivodar",
                    first: "Andriy"
                },
                fullName: "Andriy Tivodar",
                id: "55b92ad221e4b7c40f000045"
            },
            {
                _id: "55b92ad221e4b7c40f00006e",
                name: {
                    last: "Hanchak",
                    first: "Andriy"
                },
                fullName: "Andriy Hanchak",
                id: "55b92ad221e4b7c40f00006e"
            },
            {
                _id: "55b92ad221e4b7c40f000096",
                name: {
                    last: "Herasymyuk",
                    first: "Andriy"
                },
                fullName: "Andriy Herasymyuk",
                id: "55b92ad221e4b7c40f000096"
            },
            {
                _id: "55b92ad221e4b7c40f000098",
                name: {
                    last: "Krupka",
                    first: "Andriy"
                },
                fullName: "Andriy Krupka",
                id: "55b92ad221e4b7c40f000098"
            },
            {
                _id: "55b92ad221e4b7c40f0000a3",
                name: {
                    last: "Karpenko",
                    first: "Andriy"
                },
                fullName: "Andriy Karpenko",
                id: "55b92ad221e4b7c40f0000a3"
            },
            {
                _id: "55b92ad221e4b7c40f0000a8",
                name: {
                    last: "Korneychuk",
                    first: "Andriy"
                },
                fullName: "Andriy Korneychuk",
                id: "55b92ad221e4b7c40f0000a8"
            },
            {
                _id: "55b92ad221e4b7c40f0000a9",
                name: {
                    last: "Loboda",
                    first: "Andriy"
                },
                fullName: "Andriy Loboda",
                id: "55b92ad221e4b7c40f0000a9"
            },
            {
                _id: "55b92ad221e4b7c40f0000b3",
                name: {
                    last: "Sarkanych",
                    first: "Andriy"
                },
                fullName: "Andriy Sarkanych",
                id: "55b92ad221e4b7c40f0000b3"
            },
            {
                _id: "55b92ad221e4b7c40f0000bf",
                name: {
                    last: "Fizer",
                    first: "Andriy"
                },
                fullName: "Andriy Fizer",
                id: "55b92ad221e4b7c40f0000bf"
            },
            {
                _id: "55b92ad221e4b7c40f0000c2",
                name: {
                    last: "Mistetskiy",
                    first: "Andriy"
                },
                fullName: "Andriy Mistetskiy",
                id: "55b92ad221e4b7c40f0000c2"
            },
            {
                _id: "55b92ad221e4b7c40f0000cd",
                name: {
                    last: "Vovk",
                    first: "Andriy"
                },
                fullName: "Andriy Vovk",
                id: "55b92ad221e4b7c40f0000cd"
            },
            {
                _id: "561bb90a9ebb48212ea838c7",
                name: {
                    last: "Svyd",
                    first: "Andriy"
                },
                fullName: "Andriy Svyd",
                id: "561bb90a9ebb48212ea838c7"
            },
            {
                _id: "561bc5ca9ebb48212ea838c8",
                name: {
                    last: "Sokalskiy",
                    first: "Andriy"
                },
                fullName: "Andriy Sokalskiy",
                id: "561bc5ca9ebb48212ea838c8"
            },
            {
                _id: "564da59f9b85f8b16b574fe9",
                name: {
                    last: "Chuprov",
                    first: "Andriy"
                },
                fullName: "Andriy Chuprov",
                id: "564da59f9b85f8b16b574fe9"
            },
            {
                _id: "566fe2348453e8b464b70ba6",
                name: {
                    last: "Lukashchuk",
                    first: "Andriy"
                },
                fullName: "Andriy Lukashchuk",
                id: "566fe2348453e8b464b70ba6"
            },
            {
                _id: "56965733d87c9004552b63be",
                name: {
                    last: "Samokhin",
                    first: "Andriy"
                },
                fullName: "Andriy Samokhin",
                id: "56965733d87c9004552b63be"
            },
            {
                _id: "569cce1dcf1f31f925c026fa",
                name: {
                    last: "Stupchuk",
                    first: "Andriy"
                },
                fullName: "Andriy Stupchuk",
                id: "569cce1dcf1f31f925c026fa"
            },
            {
                _id: "56c19971dfd8a81466e2f6dc",
                name: {
                    last: "Khainus",
                    first: "Andriy"
                },
                fullName: "Andriy Khainus",
                id: "56c19971dfd8a81466e2f6dc"
            },
            {
                _id: "56c59ba4d2b48ede4ba42266",
                name: {
                    last: "Lytvynenko",
                    first: "Andriy"
                },
                fullName: "Andriy Lytvynenko",
                id: "56c59ba4d2b48ede4ba42266"
            },
            {
                _id: "56dd4b727bd21335130c4f95",
                name: {
                    last: "Merentsov",
                    first: "Andriy"
                },
                fullName: "Andriy Merentsov",
                id: "56dd4b727bd21335130c4f95"
            },
            {
                _id: "56dd4d8eea0939141336783f",
                name: {
                    last: "Vasyliev",
                    first: "Andriy"
                },
                fullName: "Andriy Vasyliev",
                id: "56dd4d8eea0939141336783f"
            },
            {
                _id: "55b92ad221e4b7c40f0000b8",
                name: {
                    last: "Lobas",
                    first: "Anna"
                },
                fullName: "Anna Lobas",
                id: "55b92ad221e4b7c40f0000b8"
            },
            {
                _id: "55b92ad221e4b7c40f00006f",
                name: {
                    last: "Karabeinikov",
                    first: "Anton"
                },
                fullName: "Anton Karabeinikov",
                id: "55b92ad221e4b7c40f00006f"
            },
            {
                _id: "55b92ad221e4b7c40f00008c",
                name: {
                    last: "Gychka",
                    first: "Anton"
                },
                fullName: "Anton Gychka",
                id: "55b92ad221e4b7c40f00008c"
            },
            {
                _id: "55b92ad221e4b7c40f000094",
                name: {
                    last: "Yarosh",
                    first: "Anton"
                },
                fullName: "Anton Yarosh",
                id: "55b92ad221e4b7c40f000094"
            },
            {
                _id: "55c0656ad011746b0b000006",
                name: {
                    last: "Nizhegorodov",
                    first: "Anton"
                },
                fullName: "Anton Nizhegorodov",
                id: "55c0656ad011746b0b000006"
            },
            {
                _id: "55b92ad221e4b7c40f000083",
                name: {
                    last: "Zhuk",
                    first: "Antonina"
                },
                fullName: "Antonina Zhuk",
                id: "55b92ad221e4b7c40f000083"
            },
            {
                _id: "5629e27046bca6e4591f4919",
                name: {
                    last: "Petrov",
                    first: "Artem"
                },
                fullName: "Artem Petrov",
                id: "5629e27046bca6e4591f4919"
            },
            {
                _id: "56b9ccd88f23c5696159cd09",
                name: {
                    last: "Antonenko",
                    first: "Artem"
                },
                fullName: "Artem Antonenko",
                id: "56b9ccd88f23c5696159cd09"
            },
            {
                _id: "55b92ad221e4b7c40f000042",
                name: {
                    last: "Myhalko",
                    first: "Artur"
                },
                fullName: "Artur Myhalko",
                id: "55b92ad221e4b7c40f000042"
            },
            {
                _id: "55b92ad221e4b7c40f000032",
                name: {
                    last: "Sakalo",
                    first: "Bogdan"
                },
                fullName: "Bogdan Sakalo",
                id: "55b92ad221e4b7c40f000032"
            },
            {
                _id: "55b92ad221e4b7c40f00005a",
                name: {
                    last: "Cheypesh",
                    first: "Bogdan"
                },
                fullName: "Bogdan Cheypesh",
                id: "55b92ad221e4b7c40f00005a"
            },
            {
                _id: "569e63df044ae38173244cfd",
                name: {
                    last: "Danyliuk",
                    first: "Bogdan"
                },
                fullName: "Bogdan Danyliuk",
                id: "569e63df044ae38173244cfd"
            },
            {
                _id: "56e17661177f76f72edf774c",
                name: {
                    last: "Stets",
                    first: "Bogdana"
                },
                fullName: "Bogdana Stets",
                id: "56e17661177f76f72edf774c"
            },
            {
                _id: "56cc7cb7541812c07197357b",
                name: {
                    last: "Opanasiuk",
                    first: "Bohdana"
                },
                fullName: "Bohdana Opanasiuk",
                id: "56cc7cb7541812c07197357b"
            },
            {
                _id: "55b92ad221e4b7c40f000070",
                name: {
                    last: "Pozhidaev",
                    first: "Daniil"
                },
                fullName: "Daniil Pozhidaev",
                id: "55b92ad221e4b7c40f000070"
            },
            {
                _id: "55b92ad221e4b7c40f0000b1",
                name: {
                    last: "Korniyenko",
                    first: "Daniil"
                },
                fullName: "Daniil Korniyenko",
                id: "55b92ad221e4b7c40f0000b1"
            },
            {
                _id: "55fbcb65f9210c860c000005",
                name: {
                    last: "Shamolina",
                    first: "Daria"
                },
                fullName: "Daria Shamolina",
                id: "55fbcb65f9210c860c000005"
            },
            {
                _id: "55b92ad221e4b7c40f000046",
                name: {
                    last: "Udod",
                    first: "Denis"
                },
                fullName: "Denis Udod",
                id: "55b92ad221e4b7c40f000046"
            },
            {
                _id: "55b92ad221e4b7c40f0000b6",
                name: {
                    last: "Vengrin",
                    first: "Denis"
                },
                fullName: "Denis Vengrin",
                id: "55b92ad221e4b7c40f0000b6"
            },
            {
                _id: "55ca0145cbb0f4910b000009",
                name: {
                    last: "Zinkovskyi",
                    first: "Denis"
                },
                fullName: "Denis Zinkovskyi",
                id: "55ca0145cbb0f4910b000009"
            },
            {
                _id: "55effafa8f1e10e50b000006",
                name: {
                    last: "Pavlenko",
                    first: "Denis"
                },
                fullName: "Denis Pavlenko",
                id: "55effafa8f1e10e50b000006"
            },
            {
                _id: "5640741570bbc2b740ce89ec",
                name: {
                    last: "Lukashov",
                    first: "Denis"
                },
                fullName: "Denis Lukashov",
                id: "5640741570bbc2b740ce89ec"
            },
            {
                _id: "565c2793f4dcd63b5dbd7372",
                name: {
                    last: "Yaremenko",
                    first: "Denis"
                },
                fullName: "Denis Yaremenko",
                id: "565c2793f4dcd63b5dbd7372"
            },
            {
                _id: "566add9aa74aaf316eaea6fc",
                name: {
                    last: "Saranyuk",
                    first: "Denis"
                },
                fullName: "Denis Saranyuk",
                id: "566add9aa74aaf316eaea6fc"
            },
            {
                _id: "55b92ad221e4b7c40f000033",
                name: {
                    last: "Bruso",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Bruso",
                id: "55b92ad221e4b7c40f000033"
            },
            {
                _id: "55b92ad221e4b7c40f00006b",
                name: {
                    last: "Kanivets",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Kanivets",
                id: "55b92ad221e4b7c40f00006b"
            },
            {
                _id: "55b92ad221e4b7c40f000071",
                name: {
                    last: "Masalovich",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Masalovich",
                id: "55b92ad221e4b7c40f000071"
            },
            {
                _id: "55b92ad221e4b7c40f00009f",
                name: {
                    last: "Dzuba",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Dzuba",
                id: "55b92ad221e4b7c40f00009f"
            },
            {
                _id: "55b92ad221e4b7c40f0000bc",
                name: {
                    last: "Demchenko",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Demchenko",
                id: "55b92ad221e4b7c40f0000bc"
            },
            {
                _id: "55cdffa59b42266a4f000015",
                name: {
                    last: "Magar",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Magar",
                id: "55cdffa59b42266a4f000015"
            },
            {
                _id: "5600031ba36a8ca10c000028",
                name: {
                    last: "Mostiv",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Mostiv",
                id: "5600031ba36a8ca10c000028"
            },
            {
                _id: "5614d4c7ab24a83b1dc1a7a8",
                name: {
                    last: "Babilia",
                    first: "Dmytro"
                },
                fullName: "Dmytro Babilia",
                id: "5614d4c7ab24a83b1dc1a7a8"
            },
            {
                _id: "567ac0a48365c9a205406f33",
                name: {
                    last: "Kolochynsky",
                    first: "Dmytro"
                },
                fullName: "Dmytro Kolochynsky",
                id: "567ac0a48365c9a205406f33"
            },
            {
                _id: "564a03d1ad4bc9e53f1f6195",
                name: {
                    last: "Tanchenec",
                    first: "Edgard"
                },
                fullName: "Edgard Tanchenec",
                id: "564a03d1ad4bc9e53f1f6195"
            },
            {
                _id: "55b92ad221e4b7c40f00005b",
                name: {
                    last: "Chori",
                    first: "Eduard"
                },
                fullName: "Eduard Chori",
                id: "55b92ad221e4b7c40f00005b"
            },
            {
                _id: "55b92ad221e4b7c40f000067",
                name: {
                    last: "Rudenko",
                    first: "Eduard"
                },
                fullName: "Eduard Rudenko",
                id: "55b92ad221e4b7c40f000067"
            },
            {
                _id: "55b92ad221e4b7c40f000092",
                name: {
                    last: "Dedenok",
                    first: "Eduard"
                },
                fullName: "Eduard Dedenok",
                id: "55b92ad221e4b7c40f000092"
            },
            {
                _id: "55b92ad221e4b7c40f000066",
                name: {
                    last: "Gromadskiy",
                    first: "Egor"
                },
                fullName: "Egor Gromadskiy",
                id: "55b92ad221e4b7c40f000066"
            },
            {
                _id: "55b92ad221e4b7c40f000041",
                name: {
                    last: "Oleynikov",
                    first: "Eugen"
                },
                fullName: "Eugen Oleynikov",
                id: "55b92ad221e4b7c40f000041"
            },
            {
                _id: "55b92ad221e4b7c40f000072",
                name: {
                    last: "Bernikevich",
                    first: "Eugen"
                },
                fullName: "Eugen Bernikevich",
                id: "55b92ad221e4b7c40f000072"
            },
            {
                _id: "55b92ad221e4b7c40f00008b",
                name: {
                    last: "Ugolkov",
                    first: "Eugen"
                },
                fullName: "Eugen Ugolkov",
                id: "55b92ad221e4b7c40f00008b"
            },
            {
                _id: "55b92ad221e4b7c40f0000a4",
                name: {
                    last: "Sokolenko",
                    first: "Eugen"
                },
                fullName: "Eugen Sokolenko",
                id: "55b92ad221e4b7c40f0000a4"
            },
            {
                _id: "55c32e0d29bd6ccd0b000005",
                name: {
                    last: "Alexeev",
                    first: "Eugen"
                },
                fullName: "Eugen Alexeev",
                id: "55c32e0d29bd6ccd0b000005"
            },
            {
                _id: "55c98aa7cbb0f4910b000005",
                name: {
                    last: "Rechun",
                    first: "Eugen"
                },
                fullName: "Eugen Rechun",
                id: "55c98aa7cbb0f4910b000005"
            },
            {
                _id: "56029cc950de7f4138000005",
                name: {
                    last: "Lendyel",
                    first: "Eugen"
                },
                fullName: "Eugen Lendyel",
                id: "56029cc950de7f4138000005"
            },
            {
                _id: "56e696da81046d9741fb66fc",
                name: {
                    last: "Kovbel",
                    first: "Fedir"
                },
                fullName: "Fedir Kovbel",
                id: "56e696da81046d9741fb66fc"
            },
            {
                _id: "55b92ad221e4b7c40f000090",
                name: {
                    last: "Shterr",
                    first: "Gabriella"
                },
                fullName: "Gabriella Shterr",
                id: "55b92ad221e4b7c40f000090"
            },
            {
                _id: "56b9d3eb8f23c5696159cd0b",
                name: {
                    last: "Mykhailova",
                    first: "Galina"
                },
                fullName: "Galina Mykhailova",
                id: "56b9d3eb8f23c5696159cd0b"
            },
            {
                _id: "56e045e943fcd85c74307060",
                name: {
                    last: "Milchevych",
                    first: "Galina"
                },
                fullName: "Galina Milchevych",
                id: "56e045e943fcd85c74307060"
            },
            {
                _id: "55b92ad221e4b7c40f00003d",
                name: {
                    last: "Kravets",
                    first: "German"
                },
                fullName: "German Kravets",
                id: "55b92ad221e4b7c40f00003d"
            },
            {
                _id: "568158fc9cceae182b907756",
                name: {
                    last: "Belous",
                    first: "Herman"
                },
                fullName: "Herman Belous",
                id: "568158fc9cceae182b907756"
            },
            {
                _id: "55b92ad221e4b7c40f0000a2",
                name: {
                    last: "Stan",
                    first: "Igor"
                },
                fullName: "Igor Stan",
                id: "55b92ad221e4b7c40f0000a2"
            },
            {
                _id: "55b92ad221e4b7c40f0000bb",
                name: {
                    last: "Shepinka",
                    first: "Igor"
                },
                fullName: "Igor Shepinka",
                id: "55b92ad221e4b7c40f0000bb"
            },
            {
                _id: "56966c82d87c9004552b63c7",
                name: {
                    last: "Kuzma",
                    first: "Ihor"
                },
                fullName: "Ihor Kuzma",
                id: "56966c82d87c9004552b63c7"
            },
            {
                _id: "56a0d4b162d172544baf0e3a",
                name: {
                    last: "Ilnytskyi",
                    first: "Ihor"
                },
                fullName: "Ihor Ilnytskyi",
                id: "56a0d4b162d172544baf0e3a"
            },
            {
                _id: "55b92ad221e4b7c40f0000c6",
                name: {
                    last: "Kramarenko",
                    first: "Illia"
                },
                fullName: "Illia Kramarenko",
                id: "55b92ad221e4b7c40f0000c6"
            },
            {
                _id: "55b92ad221e4b7c40f000035",
                name: {
                    last: "Mondok",
                    first: "Ilya"
                },
                fullName: "Ilya Mondok",
                id: "55b92ad221e4b7c40f000035"
            },
            {
                _id: "55b92ad221e4b7c40f000047",
                name: {
                    last: "Khymych",
                    first: "Ilya"
                },
                fullName: "Ilya Khymych",
                id: "55b92ad221e4b7c40f000047"
            },
            {
                _id: "56090fae86e2435a33000008",
                name: {
                    last: "Nukhova",
                    first: "Inna"
                },
                fullName: "Inna Nukhova",
                id: "56090fae86e2435a33000008"
            },
            {
                _id: "55b92ad221e4b7c40f000073",
                name: {
                    last: "Grab",
                    first: "Irina"
                },
                fullName: "Irina Grab",
                id: "55b92ad221e4b7c40f000073"
            },
            {
                _id: "55b92ad221e4b7c40f000034",
                name: {
                    last: "Nazarovich",
                    first: "Ishtvan"
                },
                fullName: "Ishtvan Nazarovich",
                id: "55b92ad221e4b7c40f000034"
            },
            {
                _id: "55b92ad221e4b7c40f00005c",
                name: {
                    last: "Irchak",
                    first: "Ivan"
                },
                fullName: "Ivan Irchak",
                id: "55b92ad221e4b7c40f00005c"
            },
            {
                _id: "55b92ad221e4b7c40f000074",
                name: {
                    last: "Kornyk",
                    first: "Ivan"
                },
                fullName: "Ivan Kornyk",
                id: "55b92ad221e4b7c40f000074"
            },
            {
                _id: "55b92ad221e4b7c40f000087",
                name: {
                    last: "Kostromin",
                    first: "Ivan"
                },
                fullName: "Ivan Kostromin",
                id: "55b92ad221e4b7c40f000087"
            },
            {
                _id: "55b92ad221e4b7c40f00008e",
                name: {
                    last: "Grab",
                    first: "Ivan"
                },
                fullName: "Ivan Grab",
                id: "55b92ad221e4b7c40f00008e"
            },
            {
                _id: "55b92ad221e4b7c40f00009c",
                name: {
                    last: "Feltsan",
                    first: "Ivan"
                },
                fullName: "Ivan Feltsan",
                id: "55b92ad221e4b7c40f00009c"
            },
            {
                _id: "55b92ad221e4b7c40f0000a0",
                name: {
                    last: "Bilak",
                    first: "Ivan"
                },
                fullName: "Ivan Bilak",
                id: "55b92ad221e4b7c40f0000a0"
            },
            {
                _id: "55b92ad221e4b7c40f0000aa",
                name: {
                    last: "Lyashenko",
                    first: "Ivan"
                },
                fullName: "Ivan Lyashenko",
                id: "55b92ad221e4b7c40f0000aa"
            },
            {
                _id: "55b92ad221e4b7c40f0000c8",
                name: {
                    last: "Bizilya",
                    first: "Ivan"
                },
                fullName: "Ivan Bizilya",
                id: "55b92ad221e4b7c40f0000c8"
            },
            {
                _id: "55b92ad221e4b7c40f0000cc",
                name: {
                    last: "Lyakh",
                    first: "Ivan"
                },
                fullName: "Ivan Lyakh",
                id: "55b92ad221e4b7c40f0000cc"
            },
            {
                _id: "55c98b86cbb0f4910b000006",
                name: {
                    last: "Kovalenko",
                    first: "Ivan"
                },
                fullName: "Ivan Kovalenko",
                id: "55c98b86cbb0f4910b000006"
            },
            {
                _id: "55dd71eaf09cc2ec0b000007",
                name: {
                    last: "Khartov",
                    first: "Ivan"
                },
                fullName: "Ivan Khartov",
                id: "55dd71eaf09cc2ec0b000007"
            },
            {
                _id: "56a5ef86aa157ca50f21fb1d",
                name: {
                    last: "Pasichnyuk",
                    first: "Ivan"
                },
                fullName: "Ivan Pasichnyuk",
                id: "56a5ef86aa157ca50f21fb1d"
            },
            {
                _id: "55b92ad221e4b7c40f000048",
                name: {
                    last: "Chupova",
                    first: "Katerina"
                },
                fullName: "Katerina Chupova",
                id: "55b92ad221e4b7c40f000048"
            },
            {
                _id: "55b92ad221e4b7c40f000068",
                name: {
                    last: "Bartish",
                    first: "Katerina"
                },
                fullName: "Katerina Bartish",
                id: "55b92ad221e4b7c40f000068"
            },
            {
                _id: "55b92ad221e4b7c40f00009a",
                name: {
                    last: "Pasichnyuk",
                    first: "Katerina"
                },
                fullName: "Katerina Pasichnyuk",
                id: "55b92ad221e4b7c40f00009a"
            },
            {
                _id: "55b92ad221e4b7c40f0000ab",
                name: {
                    last: "Olkhovik",
                    first: "Katerina"
                },
                fullName: "Katerina Olkhovik",
                id: "55b92ad221e4b7c40f0000ab"
            },
            {
                _id: "55b92ad221e4b7c40f000085",
                name: {
                    last: "Gorbushko",
                    first: "Kirill"
                },
                fullName: "Kirill Gorbushko",
                id: "55b92ad221e4b7c40f000085"
            },
            {
                _id: "55e419094983acdd0b000012",
                name: {
                    last: "Paliiuk",
                    first: "Kirill"
                },
                fullName: "Kirill Paliiuk",
                id: "55e419094983acdd0b000012"
            },
            {
                _id: "56b9d49d8f23c5696159cd0c",
                name: {
                    last: "Bed",
                    first: "Kirill"
                },
                fullName: "Kirill Bed",
                id: "56b9d49d8f23c5696159cd0c"
            },
            {
                _id: "56b2287b99ce8d706a81b2bc",
                name: {
                    last: "Mudrenok",
                    first: "Kostiantyn"
                },
                fullName: "Kostiantyn Mudrenok",
                id: "56b2287b99ce8d706a81b2bc"
            },
            {
                _id: "55d1e234dda01e250c000015",
                name: {
                    last: "Rimar",
                    first: "Kristian"
                },
                fullName: "Kristian Rimar",
                id: "55d1e234dda01e250c000015"
            },
            {
                _id: "55b92ad221e4b7c40f00009b",
                name: {
                    last: "Popp",
                    first: "Larysa"
                },
                fullName: "Larysa Popp",
                id: "55b92ad221e4b7c40f00009b"
            },
            {
                _id: "55b92ad221e4b7c40f000075",
                name: {
                    last: "Gvozdyo",
                    first: "Lilia"
                },
                fullName: "Lilia Gvozdyo",
                id: "55b92ad221e4b7c40f000075"
            },
            {
                _id: "55b92ad221e4b7c40f0000c7",
                name: {
                    last: "Mykhailova",
                    first: "Liliya"
                },
                fullName: "Liliya Mykhailova",
                id: "55b92ad221e4b7c40f0000c7"
            },
            {
                _id: "55bf45cf65cda0810b00000a",
                name: {
                    last: "Shustur",
                    first: "Liliya"
                },
                fullName: "Liliya Shustur",
                id: "55bf45cf65cda0810b00000a"
            },
            {
                _id: "564a0186ad4bc9e53f1f6193",
                name: {
                    last: "Orlenko",
                    first: "Liliya"
                },
                fullName: "Liliya Orlenko",
                id: "564a0186ad4bc9e53f1f6193"
            },
            {
                _id: "56d06aef541812c0719735c8",
                name: {
                    last: "Garagonich",
                    first: "Liza"
                },
                fullName: "Liza Garagonich",
                id: "56d06aef541812c0719735c8"
            },
            {
                _id: "55b92ad221e4b7c40f00005d",
                name: {
                    last: "Gerevich",
                    first: "Lubomir"
                },
                fullName: "Lubomir Gerevich",
                id: "55b92ad221e4b7c40f00005d"
            },
            {
                _id: "55b92ad221e4b7c40f0000c1",
                name: {
                    last: "Zasukhina",
                    first: "Maria"
                },
                fullName: "Maria Zasukhina",
                id: "55b92ad221e4b7c40f0000c1"
            },
            {
                _id: "5684ec1a1fec73d05393a2a4",
                name: {
                    last: "Zaitseva",
                    first: "Maria"
                },
                fullName: "Maria Zaitseva",
                id: "5684ec1a1fec73d05393a2a4"
            },
            {
                _id: "560115cf536bd29228000006",
                name: {
                    last: "Myhalko",
                    first: "Marianna"
                },
                fullName: "Marianna Myhalko",
                id: "560115cf536bd29228000006"
            },
            {
                _id: "55b92ad221e4b7c40f00003f",
                name: {
                    last: "Kubichka",
                    first: "Marina"
                },
                fullName: "Marina Kubichka",
                id: "55b92ad221e4b7c40f00003f"
            },
            {
                _id: "56cdd631541812c071973584",
                name: {
                    last: "Sheverya",
                    first: "Maryna"
                },
                fullName: "Maryna Sheverya",
                id: "56cdd631541812c071973584"
            },
            {
                _id: "55b92ad221e4b7c40f000043",
                name: {
                    last: "Geraschenko",
                    first: "Maxim"
                },
                fullName: "Maxim Geraschenko",
                id: "55b92ad221e4b7c40f000043"
            },
            {
                _id: "55b92ad221e4b7c40f000089",
                name: {
                    last: "Sychov",
                    first: "Maxim"
                },
                fullName: "Maxim Sychov",
                id: "55b92ad221e4b7c40f000089"
            },
            {
                _id: "55b92ad221e4b7c40f0000a5",
                name: {
                    last: "Holubka",
                    first: "Maxim"
                },
                fullName: "Maxim Holubka",
                id: "55b92ad221e4b7c40f0000a5"
            },
            {
                _id: "55c06411d011746b0b000005",
                name: {
                    last: "Rachytskyy",
                    first: "Maxim"
                },
                fullName: "Maxim Rachytskyy",
                id: "55c06411d011746b0b000005"
            },
            {
                _id: "566ada96a74aaf316eaea69d",
                name: {
                    last: "Gladovskyy",
                    first: "Maxim"
                },
                fullName: "Maxim Gladovskyy",
                id: "566ada96a74aaf316eaea69d"
            },
            {
                _id: "55b92ad221e4b7c40f000036",
                name: {
                    last: "Yemets",
                    first: "Michael"
                },
                fullName: "Michael Yemets",
                id: "55b92ad221e4b7c40f000036"
            },
            {
                _id: "55b92ad221e4b7c40f000049",
                name: {
                    last: "Kapustey",
                    first: "Michael"
                },
                fullName: "Michael Kapustey",
                id: "55b92ad221e4b7c40f000049"
            },
            {
                _id: "55b92ad221e4b7c40f000055",
                name: {
                    last: "Rogach",
                    first: "Michael"
                },
                fullName: "Michael Rogach",
                id: "55b92ad221e4b7c40f000055"
            },
            {
                _id: "55b92ad221e4b7c40f00005e",
                name: {
                    last: "Didenko",
                    first: "Michael"
                },
                fullName: "Michael Didenko",
                id: "55b92ad221e4b7c40f00005e"
            },
            {
                _id: "55b92ad221e4b7c40f000069",
                name: {
                    last: "Afendikov",
                    first: "Michael"
                },
                fullName: "Michael Afendikov",
                id: "55b92ad221e4b7c40f000069"
            },
            {
                _id: "55b92ad221e4b7c40f000076",
                name: {
                    last: "Glagola",
                    first: "Michael"
                },
                fullName: "Michael Glagola",
                id: "55b92ad221e4b7c40f000076"
            },
            {
                _id: "55b92ad221e4b7c40f000077",
                name: {
                    last: "Soyma",
                    first: "Michael"
                },
                fullName: "Michael Soyma",
                id: "55b92ad221e4b7c40f000077"
            },
            {
                _id: "55b92ad221e4b7c40f0000b2",
                name: {
                    last: "Yeremenko",
                    first: "Michael"
                },
                fullName: "Michael Yeremenko",
                id: "55b92ad221e4b7c40f0000b2"
            },
            {
                _id: "55b92ad221e4b7c40f0000bd",
                name: {
                    last: "Vashkeba",
                    first: "Michael"
                },
                fullName: "Michael Vashkeba",
                id: "55b92ad221e4b7c40f0000bd"
            },
            {
                _id: "55b92ad221e4b7c40f0000c4",
                name: {
                    last: "Myronyshyn",
                    first: "Michael"
                },
                fullName: "Michael Myronyshyn",
                id: "55b92ad221e4b7c40f0000c4"
            },
            {
                _id: "55b92ad221e4b7c40f0000c5",
                name: {
                    last: "Gajdan",
                    first: "Michael"
                },
                fullName: "Michael Gajdan",
                id: "55b92ad221e4b7c40f0000c5"
            },
            {
                _id: "55dd7776f09cc2ec0b000009",
                name: {
                    last: "Kavka",
                    first: "Michael"
                },
                fullName: "Michael Kavka",
                id: "55dd7776f09cc2ec0b000009"
            },
            {
                _id: "5600042ca36a8ca10c000029",
                name: {
                    last: "Filchak",
                    first: "Michael"
                },
                fullName: "Michael Filchak",
                id: "5600042ca36a8ca10c000029"
            },
            {
                _id: "5667f310a3fc012a68f0d5f5",
                name: {
                    last: "Sopko",
                    first: "Michael"
                },
                fullName: "Michael Sopko",
                id: "5667f310a3fc012a68f0d5f5"
            },
            {
                _id: "56e2b53e896e98a661aa8326",
                name: {
                    last: "Ptitsyn",
                    first: "Michael"
                },
                fullName: "Michael Ptitsyn",
                id: "56e2b53e896e98a661aa8326"
            },
            {
                _id: "56b3412299ce8d706a81b2cd",
                name: {
                    last: "Kholtobin",
                    first: "Mykola"
                },
                fullName: "Mykola Kholtobin",
                id: "56b3412299ce8d706a81b2cd"
            },
            {
                _id: "56cb3695541812c071973546",
                name: {
                    last: "Vasylyna",
                    first: "Mykola"
                },
                fullName: "Mykola Vasylyna",
                id: "56cb3695541812c071973546"
            },
            {
                _id: "565c306af4dcd63b5dbd7373",
                name: {
                    last: "Matrafayilo",
                    first: "Myroslav"
                },
                fullName: "Myroslav Matrafayilo",
                id: "565c306af4dcd63b5dbd7373"
            },
            {
                _id: "55b92ad221e4b7c40f0000b7",
                name: {
                    last: "Polovka",
                    first: "Myroslava"
                },
                fullName: "Myroslava Polovka",
                id: "55b92ad221e4b7c40f0000b7"
            },
            {
                _id: "56bdf283dfd8a81466e2f6d0",
                name: {
                    last: "Shishko",
                    first: "Nadiya"
                },
                fullName: "Nadiya Shishko",
                id: "56bdf283dfd8a81466e2f6d0"
            },
            {
                _id: "56938d2cd87c9004552b639e",
                name: {
                    last: "Makarova",
                    first: "Nastya"
                },
                fullName: "Nastya Makarova",
                id: "56938d2cd87c9004552b639e"
            },
            {
                _id: "561ba8639ebb48212ea838c4",
                name: {
                    last: "Yartysh",
                    first: "Nataliya"
                },
                fullName: "Nataliya Yartysh",
                id: "561ba8639ebb48212ea838c4"
            },
            {
                _id: "566aa49f4f817b7f51746ec0",
                name: {
                    last: "Burtnyk",
                    first: "Nataliya"
                },
                fullName: "Nataliya Burtnyk",
                id: "566aa49f4f817b7f51746ec0"
            },
            {
                _id: "56af32e174d57e0d56d6bee5",
                name: {
                    last: "Sichko",
                    first: "Nataliya"
                },
                fullName: "Nataliya Sichko",
                id: "56af32e174d57e0d56d6bee5"
            },
            {
                _id: "56cdd88b541812c071973585",
                name: {
                    last: "Plovayko",
                    first: "Nelya"
                },
                fullName: "Nelya Plovayko",
                id: "56cdd88b541812c071973585"
            },
            {
                _id: "55b92ad221e4b7c40f0000a6",
                name: {
                    last: "Citrak",
                    first: "Norbert"
                },
                fullName: "Norbert Citrak",
                id: "55b92ad221e4b7c40f0000a6"
            },
            {
                _id: "55b92ad221e4b7c40f0000be",
                name: {
                    last: "Borys",
                    first: "Oksana"
                },
                fullName: "Oksana Borys",
                id: "55b92ad221e4b7c40f0000be"
            },
            {
                _id: "55b92ad221e4b7c40f0000c0",
                name: {
                    last: "Kordas",
                    first: "Oksana"
                },
                fullName: "Oksana Kordas",
                id: "55b92ad221e4b7c40f0000c0"
            },
            {
                _id: "56e0408e4f9ff8e0737d7c52",
                name: {
                    last: "Pylyp",
                    first: "Oksana"
                },
                fullName: "Oksana Pylyp",
                id: "56e0408e4f9ff8e0737d7c52"
            },
            {
                _id: "55b92ad221e4b7c40f00003c",
                name: {
                    last: "Stasiv",
                    first: "Oleg"
                },
                fullName: "Oleg Stasiv",
                id: "55b92ad221e4b7c40f00003c"
            },
            {
                _id: "55b92ad221e4b7c40f00004a",
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                fullName: "Oleg Ostroverkh",
                id: "55b92ad221e4b7c40f00004a"
            },
            {
                _id: "55b92ad221e4b7c40f000078",
                name: {
                    last: "Boyanivskiy",
                    first: "Oleg"
                },
                fullName: "Oleg Boyanivskiy",
                id: "55b92ad221e4b7c40f000078"
            },
            {
                _id: "55b92ad221e4b7c40f00008a",
                name: {
                    last: "Mahobey",
                    first: "Oleg"
                },
                fullName: "Oleg Mahobey",
                id: "55b92ad221e4b7c40f00008a"
            },
            {
                _id: "561ba7039ebb48212ea838c3",
                name: {
                    last: "Maliavska",
                    first: "Oleksandra"
                },
                fullName: "Oleksandra Maliavska",
                id: "561ba7039ebb48212ea838c3"
            },
            {
                _id: "56b9cbb48f23c5696159cd08",
                name: {
                    last: "Kovalenko",
                    first: "Oleksii"
                },
                fullName: "Oleksii Kovalenko",
                id: "56b9cbb48f23c5696159cd08"
            },
            {
                _id: "55b92ad221e4b7c40f000037",
                name: {
                    last: "Shanghin",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Shanghin",
                id: "55b92ad221e4b7c40f000037"
            },
            {
                _id: "55b92ad221e4b7c40f000079",
                name: {
                    last: "Gerasimov",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Gerasimov",
                id: "55b92ad221e4b7c40f000079"
            },
            {
                _id: "55b92ad221e4b7c40f000095",
                name: {
                    last: "Kuropyatnik",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Kuropyatnik",
                id: "55b92ad221e4b7c40f000095"
            },
            {
                _id: "55b92ad221e4b7c40f0000c9",
                name: {
                    last: "Fedosov",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Fedosov",
                id: "55b92ad221e4b7c40f0000c9"
            },
            {
                _id: "56e2b6a21f2850d361927dd8",
                name: {
                    last: "Protsenko",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Protsenko",
                id: "56e2b6a21f2850d361927dd8"
            },
            {
                _id: "55b92ad221e4b7c40f0000b9",
                name: {
                    last: "Melnyk",
                    first: "Olena"
                },
                fullName: "Olena Melnyk",
                id: "55b92ad221e4b7c40f0000b9"
            },
            {
                _id: "55e96ab13f3ae4fd0b000009",
                name: {
                    last: "Pavliuk",
                    first: "Oles"
                },
                fullName: "Oles Pavliuk",
                id: "55e96ab13f3ae4fd0b000009"
            },
            {
                _id: "55b92ad221e4b7c40f0000c3",
                name: {
                    last: "Prokoshkina",
                    first: "Olesia"
                },
                fullName: "Olesia Prokoshkina",
                id: "55b92ad221e4b7c40f0000c3"
            },
            {
                _id: "56123232c90e2fb026ce064b",
                name: {
                    last: "Sikora",
                    first: "Olga"
                },
                fullName: "Olga Sikora",
                id: "56123232c90e2fb026ce064b"
            },
            {
                _id: "55c84a4aaa36a0e60a000005",
                name: {
                    last: "Muratov",
                    first: "Pavlo"
                },
                fullName: "Pavlo Muratov",
                id: "55c84a4aaa36a0e60a000005"
            },
            {
                _id: "56964a03d87c9004552b63ba",
                name: {
                    last: "Skyba",
                    first: "Pavlo"
                },
                fullName: "Pavlo Skyba",
                id: "56964a03d87c9004552b63ba"
            },
            {
                _id: "56a7956faa157ca50f21fb25",
                name: {
                    last: "Demko",
                    first: "Pavlo"
                },
                fullName: "Pavlo Demko",
                id: "56a7956faa157ca50f21fb25"
            },
            {
                _id: "55b92ad221e4b7c40f00005f",
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                fullName: "Peter Voloshchuk",
                id: "55b92ad221e4b7c40f00005f"
            },
            {
                _id: "55e549309624477a0b000005",
                name: {
                    last: "Rospopa",
                    first: "Petro"
                },
                fullName: "Petro Rospopa",
                id: "55e549309624477a0b000005"
            },
            {
                _id: "56cc7ad8541812c071973579",
                name: {
                    last: "Tesliuk",
                    first: "Petro"
                },
                fullName: "Petro Tesliuk",
                id: "56cc7ad8541812c071973579"
            },
            {
                _id: "56a78c75aa157ca50f21fb24",
                name: {
                    last: "Iyber",
                    first: "Renata"
                },
                fullName: "Renata Iyber",
                id: "56a78c75aa157ca50f21fb24"
            },
            {
                _id: "55b92ad221e4b7c40f000051",
                name: {
                    last: "Mozes",
                    first: "Richard"
                },
                fullName: "Richard Mozes",
                id: "55b92ad221e4b7c40f000051"
            },
            {
                _id: "56e298ab5def9136621b7803",
                name: {
                    last: "Shinkovych",
                    first: "Rikhard"
                },
                fullName: "Rikhard Shinkovych",
                id: "56e298ab5def9136621b7803"
            },
            {
                _id: "55b92ad221e4b7c40f00007a",
                name: {
                    last: "Fogash",
                    first: "Robert"
                },
                fullName: "Robert Fogash",
                id: "55b92ad221e4b7c40f00007a"
            },
            {
                _id: "56e6b7d7977124d34db5829c",
                name: {
                    last: "Bachynska",
                    first: "Roksana"
                },
                fullName: "Roksana Bachynska",
                id: "56e6b7d7977124d34db5829c"
            },
            {
                _id: "55b92ad221e4b7c40f00004b",
                name: {
                    last: "Katona",
                    first: "Roland"
                },
                fullName: "Roland Katona",
                id: "55b92ad221e4b7c40f00004b"
            },
            {
                _id: "55b92ad221e4b7c40f000038",
                name: {
                    last: "Babunich",
                    first: "Roman"
                },
                fullName: "Roman Babunich",
                id: "55b92ad221e4b7c40f000038"
            },
            {
                _id: "55b92ad221e4b7c40f000060",
                name: {
                    last: "Buchuk",
                    first: "Roman"
                },
                fullName: "Roman Buchuk",
                id: "55b92ad221e4b7c40f000060"
            },
            {
                _id: "55b92ad221e4b7c40f00007b",
                name: {
                    last: "Guti",
                    first: "Roman"
                },
                fullName: "Roman Guti",
                id: "55b92ad221e4b7c40f00007b"
            },
            {
                _id: "55b92ad221e4b7c40f000086",
                name: {
                    last: "Kubichka",
                    first: "Roman"
                },
                fullName: "Roman Kubichka",
                id: "55b92ad221e4b7c40f000086"
            },
            {
                _id: "55b92ad221e4b7c40f0000b0",
                name: {
                    last: "Donchenko",
                    first: "Roman"
                },
                fullName: "Roman Donchenko",
                id: "55b92ad221e4b7c40f0000b0"
            },
            {
                _id: "55dd73d1f09cc2ec0b000008",
                name: {
                    last: "Vizenko",
                    first: "Roman"
                },
                fullName: "Roman Vizenko",
                id: "55dd73d1f09cc2ec0b000008"
            },
            {
                _id: "55eef3fd6dceaee10b000020",
                name: {
                    last: "Saldan",
                    first: "Roman"
                },
                fullName: "Roman Saldan",
                id: "55eef3fd6dceaee10b000020"
            },
            {
                _id: "5667f43da3fc012a68f0d5f6",
                name: {
                    last: "Katsala",
                    first: "Roman"
                },
                fullName: "Roman Katsala",
                id: "5667f43da3fc012a68f0d5f6"
            },
            {
                _id: "568bbdfd5827e3b24d8123a7",
                name: {
                    last: "Chaban",
                    first: "Roman"
                },
                fullName: "Roman Chaban",
                id: "568bbdfd5827e3b24d8123a7"
            },
            {
                _id: "568cd341b2bcba971ba6f5c4",
                name: {
                    last: "Rosul",
                    first: "Roman"
                },
                fullName: "Roman Rosul",
                id: "568cd341b2bcba971ba6f5c4"
            },
            {
                _id: "568cd4c0b2bcba971ba6f5c5",
                name: {
                    last: "Osadchuk",
                    first: "Roman"
                },
                fullName: "Roman Osadchuk",
                id: "568cd4c0b2bcba971ba6f5c5"
            },
            {
                _id: "569e3a73044ae38173244cfb",
                name: {
                    last: "Martyniuk",
                    first: "Roman"
                },
                fullName: "Roman Martyniuk",
                id: "569e3a73044ae38173244cfb"
            },
            {
                _id: "56d5a0c45132d292750a5e7e",
                name: {
                    last: "Ukrainskiy",
                    first: "Rostyslav"
                },
                fullName: "Rostyslav Ukrainskiy",
                id: "56d5a0c45132d292750a5e7e"
            },
            {
                _id: "55b92ad221e4b7c40f000056",
                name: {
                    last: "Labjak",
                    first: "Ruslan"
                },
                fullName: "Ruslan Labjak",
                id: "55b92ad221e4b7c40f000056"
            },
            {
                _id: "55b92ad221e4b7c40f000097",
                name: {
                    last: "Abylgazinov",
                    first: "Samgash"
                },
                fullName: "Samgash Abylgazinov",
                id: "55b92ad221e4b7c40f000097"
            },
            {
                _id: "568cdd375527d6691cb68b22",
                name: {
                    last: "Melnik",
                    first: "Sergey"
                },
                fullName: "Sergey Melnik",
                id: "568cdd375527d6691cb68b22"
            },
            {
                _id: "55b92ad221e4b7c40f000064",
                name: {
                    last: "Tilishevsky",
                    first: "Sergiy"
                },
                fullName: "Sergiy Tilishevsky",
                id: "55b92ad221e4b7c40f000064"
            },
            {
                _id: "55b92ad221e4b7c40f00007c",
                name: {
                    last: "Sheba",
                    first: "Sergiy"
                },
                fullName: "Sergiy Sheba",
                id: "55b92ad221e4b7c40f00007c"
            },
            {
                _id: "55b92ad221e4b7c40f0000a1",
                name: {
                    last: "Stepaniuk",
                    first: "Sergiy"
                },
                fullName: "Sergiy Stepaniuk",
                id: "55b92ad221e4b7c40f0000a1"
            },
            {
                _id: "55d1a2b18f61e2c90b000023",
                name: {
                    last: "Degtyar",
                    first: "Sergiy"
                },
                fullName: "Sergiy Degtyar",
                id: "55d1a2b18f61e2c90b000023"
            },
            {
                _id: "55dd63f8f09cc2ec0b000006",
                name: {
                    last: "Ihnatko",
                    first: "Sergiy"
                },
                fullName: "Sergiy Ihnatko",
                id: "55dd63f8f09cc2ec0b000006"
            },
            {
                _id: "5649b8ccad4bc9e53f1f6192",
                name: {
                    last: "Gevelev",
                    first: "Sergiy"
                },
                fullName: "Sergiy Gevelev",
                id: "5649b8ccad4bc9e53f1f6192"
            },
            {
                _id: "5652dd95c4d12cf51e7f7e0b",
                name: {
                    last: "Petakh",
                    first: "Sergiy"
                },
                fullName: "Sergiy Petakh",
                id: "5652dd95c4d12cf51e7f7e0b"
            },
            {
                _id: "56e17848f625de2a2f9cacd1",
                name: {
                    last: "Biloborodov",
                    first: "Sergiy"
                },
                fullName: "Sergiy Biloborodov",
                id: "56e17848f625de2a2f9cacd1"
            },
            {
                _id: "55b92ad221e4b7c40f00004c",
                name: {
                    last: "Nayda",
                    first: "Sofia"
                },
                fullName: "Sofia Nayda",
                id: "55b92ad221e4b7c40f00004c"
            },
            {
                _id: "56d823e78230197c0e089038",
                name: {
                    last: "Marenych",
                    first: "Sofiya"
                },
                fullName: "Sofiya Marenych",
                id: "56d823e78230197c0e089038"
            },
            {
                _id: "561b756f9ebb48212ea838c0",
                name: {
                    last: "Romanyuk",
                    first: "Stanislav"
                },
                fullName: "Stanislav Romanyuk",
                id: "561b756f9ebb48212ea838c0"
            },
            {
                _id: "55b92ad221e4b7c40f000039",
                name: {
                    last: "Rikun",
                    first: "Stas"
                },
                fullName: "Stas Rikun",
                id: "55b92ad221e4b7c40f000039"
            },
            {
                _id: "55b92ad221e4b7c40f00007d",
                name: {
                    last: "Volskiy",
                    first: "Stas"
                },
                fullName: "Stas Volskiy",
                id: "55b92ad221e4b7c40f00007d"
            },
            {
                _id: "55b92ad221e4b7c40f0000ad",
                name: {
                    last: "Krovspey",
                    first: "Stepan"
                },
                fullName: "Stepan Krovspey",
                id: "55b92ad221e4b7c40f0000ad"
            },
            {
                _id: "55b92ad221e4b7c40f00008d",
                name: {
                    last: "Kira",
                    first: "Svitlana"
                },
                fullName: "Svitlana Kira",
                id: "55b92ad221e4b7c40f00008d"
            },
            {
                _id: "55b92ad221e4b7c40f0000ae",
                name: {
                    last: "Dolottseva",
                    first: "Tamara"
                },
                fullName: "Tamara Dolottseva",
                id: "55b92ad221e4b7c40f0000ae"
            },
            {
                _id: "55b92ad221e4b7c40f000061",
                name: {
                    last: "Mondok",
                    first: "Tamas"
                },
                fullName: "Tamas Mondok",
                id: "55b92ad221e4b7c40f000061"
            },
            {
                _id: "55b92ad221e4b7c40f000050",
                name: {
                    last: "Holovatska",
                    first: "Tamila"
                },
                fullName: "Tamila Holovatska",
                id: "55b92ad221e4b7c40f000050"
            },
            {
                _id: "55b92ad221e4b7c40f00007e",
                name: {
                    last: "Zmiy",
                    first: "Taras"
                },
                fullName: "Taras Zmiy",
                id: "55b92ad221e4b7c40f00007e"
            },
            {
                _id: "564a02e0ad4bc9e53f1f6194",
                name: {
                    last: "Dvorian",
                    first: "Taras"
                },
                fullName: "Taras Dvorian",
                id: "564a02e0ad4bc9e53f1f6194"
            },
            {
                _id: "56813fe29cceae182b907755",
                name: {
                    last: "Ukrainskiy",
                    first: "Taras"
                },
                fullName: "Taras Ukrainskiy",
                id: "56813fe29cceae182b907755"
            },
            {
                _id: "56d9497dae35cc4f0e721074",
                name: {
                    last: "TESTING",
                    first: "Test"
                },
                fullName: "Test TESTING",
                id: "56d9497dae35cc4f0e721074"
            },
            {
                _id: "56cf0928541812c071973593",
                name: {
                    last: "Shepitko",
                    first: "Tetiana"
                },
                fullName: "Tetiana Shepitko",
                id: "56cf0928541812c071973593"
            },
            {
                _id: "55b92ad221e4b7c40f000099",
                name: {
                    last: "Smertina",
                    first: "Tetyana"
                },
                fullName: "Tetyana Smertina",
                id: "55b92ad221e4b7c40f000099"
            },
            {
                _id: "55c98df0cbb0f4910b000007",
                name: {
                    last: "Berezhnoi",
                    first: "Timur"
                },
                fullName: "Timur Berezhnoi",
                id: "55c98df0cbb0f4910b000007"
            },
            {
                _id: "55b92ad221e4b7c40f00006a",
                name: {
                    last: "Tsipf",
                    first: "Vadim"
                },
                fullName: "Vadim Tsipf",
                id: "55b92ad221e4b7c40f00006a"
            },
            {
                _id: "56011186536bd29228000005",
                name: {
                    last: "Khruslov",
                    first: "Valentyn"
                },
                fullName: "Valentyn Khruslov",
                id: "56011186536bd29228000005"
            },
            {
                _id: "561bb5329ebb48212ea838c6",
                name: {
                    last: "Ladomiryak",
                    first: "Valerii"
                },
                fullName: "Valerii Ladomiryak",
                id: "561bb5329ebb48212ea838c6"
            },
            {
                _id: "55b92ad221e4b7c40f0000af",
                name: {
                    last: "Tokareva",
                    first: "Valeriya"
                },
                fullName: "Valeriya Tokareva",
                id: "55b92ad221e4b7c40f0000af"
            },
            {
                _id: "55b92ad221e4b7c40f00007f",
                name: {
                    last: "Klimchenko",
                    first: "Vasilisa"
                },
                fullName: "Vasilisa Klimchenko",
                id: "55b92ad221e4b7c40f00007f"
            },
            {
                _id: "55b92ad221e4b7c40f00003a",
                name: {
                    last: "Agosta",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Agosta",
                id: "55b92ad221e4b7c40f00003a"
            },
            {
                _id: "55b92ad221e4b7c40f000040",
                name: {
                    last: "Almashiy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Almashiy",
                id: "55b92ad221e4b7c40f000040"
            },
            {
                _id: "55b92ad221e4b7c40f000053",
                name: {
                    last: "Seredniy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Seredniy",
                id: "55b92ad221e4b7c40f000053"
            },
            {
                _id: "55b92ad221e4b7c40f000062",
                name: {
                    last: "Cheypesh",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Cheypesh",
                id: "55b92ad221e4b7c40f000062"
            },
            {
                _id: "55b92ad221e4b7c40f000080",
                name: {
                    last: "Barchiy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Barchiy",
                id: "55b92ad221e4b7c40f000080"
            },
            {
                _id: "55b92ad221e4b7c40f000093",
                name: {
                    last: "Lupchey",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Lupchey",
                id: "55b92ad221e4b7c40f000093"
            },
            {
                _id: "55b92ad221e4b7c40f0000b4",
                name: {
                    last: "Prokopyshyn",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Prokopyshyn",
                id: "55b92ad221e4b7c40f0000b4"
            },
            {
                _id: "55d1d860dda01e250c000010",
                name: {
                    last: "Hoshovsky",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Hoshovsky",
                id: "55d1d860dda01e250c000010"
            },
            {
                _id: "55b92ad221e4b7c40f000088",
                name: {
                    last: "Buchok",
                    first: "Viktor"
                },
                fullName: "Viktor Buchok",
                id: "55b92ad221e4b7c40f000088"
            },
            {
                _id: "55b92ad221e4b7c40f000091",
                name: {
                    last: "Kiver",
                    first: "Viktor"
                },
                fullName: "Viktor Kiver",
                id: "55b92ad221e4b7c40f000091"
            },
            {
                _id: "55f9298456f79c9c0c000006",
                name: {
                    last: "Manhur",
                    first: "Viktor"
                },
                fullName: "Viktor Manhur",
                id: "55f9298456f79c9c0c000006"
            },
            {
                _id: "56c2f2a7dfd8a81466e2f71f",
                name: {
                    last: "Mateleshka",
                    first: "Viktor"
                },
                fullName: "Viktor Mateleshka",
                id: "56c2f2a7dfd8a81466e2f71f"
            },
            {
                _id: "5626278d750d38934bfa1313",
                name: {
                    last: "Rogachenko",
                    first: "Viktoria"
                },
                fullName: "Viktoria Rogachenko",
                id: "5626278d750d38934bfa1313"
            },
            {
                _id: "5637710e5d23a8eb04e80aed",
                name: {
                    last: "Kovalenko",
                    first: "Viktoria"
                },
                fullName: "Viktoria Kovalenko",
                id: "5637710e5d23a8eb04e80aed"
            },
            {
                _id: "55b92ad221e4b7c40f00003b",
                name: {
                    last: "Bizilya",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Bizilya",
                id: "55b92ad221e4b7c40f00003b"
            },
            {
                _id: "55b92ad221e4b7c40f00004e",
                name: {
                    last: "Shuba",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Shuba",
                id: "55b92ad221e4b7c40f00004e"
            },
            {
                _id: "55b92ad221e4b7c40f000081",
                name: {
                    last: "Sokhanych",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Sokhanych",
                id: "55b92ad221e4b7c40f000081"
            },
            {
                _id: "55b92ad221e4b7c40f000052",
                name: {
                    last: "Gerasimenko",
                    first: "Vladimir"
                },
                fullName: "Vladimir Gerasimenko",
                id: "55b92ad221e4b7c40f000052"
            },
            {
                _id: "561bb1269ebb48212ea838c5",
                name: {
                    last: "Pogorilyak",
                    first: "Vladimir"
                },
                fullName: "Vladimir Pogorilyak",
                id: "561bb1269ebb48212ea838c5"
            },
            {
                _id: "55eeed546dceaee10b00001e",
                name: {
                    last: "Turytskyi",
                    first: "Vladyslav"
                },
                fullName: "Vladyslav Turytskyi",
                id: "55eeed546dceaee10b00001e"
            },
            {
                _id: "568bbf935827e3b24d8123a8",
                name: {
                    last: "Hamalii",
                    first: "Vladyslav"
                },
                fullName: "Vladyslav Hamalii",
                id: "568bbf935827e3b24d8123a8"
            },
            {
                _id: "55eee9c26dceaee10b00001d",
                name: {
                    last: "Stepanchuk",
                    first: "Volodymyr"
                },
                fullName: "Volodymyr Stepanchuk",
                id: "55eee9c26dceaee10b00001d"
            },
            {
                _id: "55b92ad221e4b7c40f00004d",
                name: {
                    last: "Kopinets",
                    first: "Vyacheslav"
                },
                fullName: "Vyacheslav Kopinets",
                id: "55b92ad221e4b7c40f00004d"
            },
            {
                _id: "55b92ad221e4b7c40f000063",
                name: {
                    last: "Gusti",
                    first: "Yana"
                },
                fullName: "Yana Gusti",
                id: "55b92ad221e4b7c40f000063"
            },
            {
                _id: "55b92ad221e4b7c40f0000ca",
                name: {
                    last: "Vengerova",
                    first: "Yana"
                },
                fullName: "Yana Vengerova",
                id: "55b92ad221e4b7c40f0000ca"
            },
            {
                _id: "55f7c20a6d43203d0c000005",
                name: {
                    last: "Samaryk",
                    first: "Yana"
                },
                fullName: "Yana Samaryk",
                id: "55f7c20a6d43203d0c000005"
            },
            {
                _id: "5602a01550de7f4138000008",
                name: {
                    last: "Dufynets",
                    first: "Yana"
                },
                fullName: "Yana Dufynets",
                id: "5602a01550de7f4138000008"
            },
            {
                _id: "55b92ad221e4b7c40f000082",
                name: {
                    last: "Fuchko",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Fuchko",
                id: "55b92ad221e4b7c40f000082"
            },
            {
                _id: "55b92ad221e4b7c40f0000cf",
                name: {
                    last: "Denysiuk",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Denysiuk",
                id: "55b92ad221e4b7c40f0000cf"
            },
            {
                _id: "568bc0b55827e3b24d8123a9",
                name: {
                    last: "Syrota",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Syrota",
                id: "568bc0b55827e3b24d8123a9"
            },
            {
                _id: "56014cc8536bd29228000007",
                name: {
                    last: "Bezyk",
                    first: "Yevgenia"
                },
                fullName: "Yevgenia Bezyk",
                id: "56014cc8536bd29228000007"
            },
            {
                _id: "56e2e83a74ac46664a83e94b",
                name: {
                    last: "Melnyk",
                    first: "Yevgenia"
                },
                fullName: "Yevgenia Melnyk",
                id: "56e2e83a74ac46664a83e94b"
            },
            {
                _id: "55ed5a437221afe30b000006",
                name: {
                    last: "Porokhnitska",
                    first: "Yulia"
                },
                fullName: "Yulia Porokhnitska",
                id: "55ed5a437221afe30b000006"
            },
            {
                _id: "55b92ad221e4b7c40f000054",
                name: {
                    last: "Derevenko",
                    first: "Yuriy"
                },
                fullName: "Yuriy Derevenko",
                id: "55b92ad221e4b7c40f000054"
            },
            {
                _id: "55b92ad221e4b7c40f000065",
                name: {
                    last: "Sirko",
                    first: "Yuriy"
                },
                fullName: "Yuriy Sirko",
                id: "55b92ad221e4b7c40f000065"
            },
            {
                _id: "55b92ad221e4b7c40f00008f",
                name: {
                    last: "Holovatskyi",
                    first: "Yuriy"
                },
                fullName: "Yuriy Holovatskyi",
                id: "55b92ad221e4b7c40f00008f"
            },
            {
                _id: "55b92ad221e4b7c40f00009d",
                name: {
                    last: "Fedynec",
                    first: "Yuriy"
                },
                fullName: "Yuriy Fedynec",
                id: "55b92ad221e4b7c40f00009d"
            },
            {
                _id: "55f7c3736d43203d0c000006",
                name: {
                    last: "Bodak",
                    first: "Yuriy"
                },
                fullName: "Yuriy Bodak",
                id: "55f7c3736d43203d0c000006"
            },
            {
                _id: "56090d77066d979a33000009",
                name: {
                    last: "Bysaha",
                    first: "Yuriy"
                },
                fullName: "Yuriy Bysaha",
                id: "56090d77066d979a33000009"
            }
        ]
    };
    var fakeUsers = {
        data: [
            {
                _id: "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            },
            {
                _id: "55ba28c8d79a3a3439000016",
                login: "AndrianaLemko"
            },
            {
                _id: "55ba2ef1d79a3a343900001c",
                login: "AnnaLobas"
            },
            {
                _id: "55c1e1276708490b0b000035",
                login: "ArturMyhalko"
            },
            {
                _id: "55b9fbcdd79a3a3439000007",
                login: "Igor Stan"
            },
            {
                _id: "55b8cb7d0ce4affc2a0015cb",
                login: "Irina.Grab"
            },
            {
                _id: "55ba2f3ed79a3a343900001d",
                login: "MariaZasukhina"
            },
            {
                _id: "55c1e1aa6708490b0b000037",
                login: "OksanaKordas"
            },
            {
                _id: "55cb7302fea413b50b000007",
                login: "OlegOstroverkh"
            },
            {
                _id: "55bb1d7ecb76ca630b000005",
                login: "Stas.Volskiy"
            },
            {
                _id: "560d0c46963ba3087363de94",
                login: "Vitaliy.Shuba"
            },
            {
                _id: "52203e707d4dba8813000003",
                login: "admin"
            },
            {
                _id: "563f673270bbc2b740ce89ae",
                login: "alex.sokhanych"
            },
            {
                _id: "5631dc18bf9592df04c55106",
                login: "alina.yurenko"
            },
            {
                _id: "569f5d8c62d172544baf0d52",
                login: "alona.yelahina"
            },
            {
                _id: "56d6fff1805eb08d2b93d95b",
                login: "anastas.lyakh"
            },
            {
                _id: "56c44e38b81fd51e19207f40",
                login: "anatoliy.dalekorey"
            },
            {
                _id: "56bda2e0dfd8a81466e2f4e2",
                login: "andriy.hanchak"
            },
            {
                _id: "56dd3dd92e7b62c613ff2553",
                login: "andriy.merentsov"
            },
            {
                _id: "56dda0599fb95fbe18e3f8ed",
                login: "anton.nizhegorodov"
            },
            {
                _id: "56a72b95aa157ca50f21fb21",
                login: "anton.yarosh"
            },
            {
                _id: "56a72df2aa157ca50f21fb23",
                login: "dmytro.babilia"
            },
            {
                _id: "56d704f1805eb08d2b93d95f",
                login: "eugen.lendyel"
            },
            {
                _id: "563b58c2ab9698be7c9df6b6",
                login: "gabriella.shterr"
            },
            {
                _id: "56dfef269100b25c05819305",
                login: "igor.shepinka"
            },
            {
                _id: "55ba0c01d79a3a3439000014",
                login: "ivan.bilak"
            },
            {
                _id: "56b2e83b39df50996ae2f07e",
                login: "katerina.pasichnyuk"
            },
            {
                _id: "56239dcce9576d1728a9ed1c",
                login: "kristian.rimar"
            },
            {
                _id: "56239e0ce9576d1728a9ed1d",
                login: "liliya.shustur"
            },
            {
                _id: "56239f14e9576d1728a9ed23",
                login: "michael"
            },
            {
                _id: "56c47f1ed2b48ede4ba42201",
                login: "nadiya.shishko"
            },
            {
                _id: "561e37f7d6c741e8235f42cb",
                login: "natalia.yartysh"
            },
            {
                _id: "56cc3dcf541812c071973563",
                login: "nelia.plovaiko"
            },
            {
                _id: "569e1e8eea21e2ac7d729e2b",
                login: "office.manager"
            },
            {
                _id: "567181ae8453e8b464b70c19",
                login: "oles.pavliuk"
            },
            {
                _id: "56239e58e9576d1728a9ed1f",
                login: "olga.sikora"
            },
            {
                _id: "55b9fc0fd79a3a3439000008",
                login: "peter.volosh"
            },
            {
                _id: "55b9dd237a3632120b000005",
                login: "roland.katona"
            },
            {
                _id: "56ddac991e6cb7131892b2be",
                login: "roman.babunych"
            },
            {
                _id: "56a72af2aa157ca50f21fb20",
                login: "roman.kubichka"
            },
            {
                _id: "56cf238d541812c0719735a4",
                login: "sergey.melnik"
            },
            {
                _id: "56dd6b7986cd133418c45ada",
                login: "sergiy.ihnatko"
            },
            {
                _id: "56a72cafaa157ca50f21fb22",
                login: "stanislav.romanyuk"
            },
            {
                _id: "56dd6bb5cc599b9718529137",
                login: "tamara.dolottseva"
            },
            {
                _id: "56f944f94ff1cd48536c298f",
                login: "test"
            },
            {
                _id: "56d7e73eae35cc4f0e72105b",
                login: "testuser"
            },
            {
                _id: "56d83d0f32e6cca40d256674",
                login: "tetiana.shepitko"
            },
            {
                _id: "55ba00e9d79a3a343900000c",
                login: "vasiliy.almashi"
            },
            {
                _id: "56239efae9576d1728a9ed22",
                login: "vladyslav."
            },
            {
                _id: "56d70560805eb08d2b93d960",
                login: "yana.dufynets"
            },
            {
                _id: "55bf144765cda0810b000005",
                login: "yana.gusti"
            },
            {
                _id: "56dfd31116ff2db10581fa0e",
                login: "yana.vengerova"
            },
            {
                _id: "560255d1638625cf32000005",
                login: "yevgenia.bezyk"
            },
            {
                _id: "56e92c7a52252ef45d219264",
                login: "yevgenia.melnyk"
            }
        ]
    };
    var fakeApplicationsForList = {
        data: [
            {
                _id: "55b92ad221e4b7c40f000049",
                dateBirth: "1993-04-08T00:00:00.000Z",
                fire: [
                    {
                        date: "2013-08-03T21:00:00.000Z",
                        info: "Update",
                        salary: 600,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department: "55b92ace21e4b7c40f000016"
                    },
                    {
                        date: "2016-02-04T22:00:00.000Z",
                        info: "Fired",
                        salary: 800,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department: "55b92ace21e4b7c40f000016"
                    }
                ],
                hire: [
                    {
                        date: "2013-08-03T21:00:00.000Z",
                        info: "",
                        salary: 600,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department: "55b92ace21e4b7c40f000016"
                    },
                    {
                        date: "2015-03-03T22:00:00.000Z",
                        info: "Update",
                        salary: 800,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department: "55b92ace21e4b7c40f000016"
                    }
                ],
                sequence: 0,
                jobType: "Full-time",
                editedBy: {
                    date: "2016-04-04T08:36:29.197Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        __v: 0,
                        attachments: [],
                        credentials: {
                            access_token: "",
                            refresh_token: ""
                        },
                        email: "info@thinkmobiles.com",
                        kanbanSettings: {
                            applications: {
                                countPerPage: 100,
                                foldWorkflows: [
                                    "Empty"
                                ]
                            },
                            opportunities: {
                                countPerPage: 10
                            },
                            tasks: {
                                countPerPage: 10,
                                foldWorkflows: [
                                    "528ce3caf3f67bc40b000013",
                                    "528ce3acf3f67bc40b000012",
                                    "528ce30cf3f67bc40b00000f",
                                    "528ce35af3f67bc40b000010"
                                ]
                            }
                        },
                        lastAccess: "2016-04-04T06:06:58.757Z",
                        login: "admin",
                        pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                        profile: 1387275598000,
                        imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        savedFilters: [
                            {
                                _id: "56213057c558b13c1bbf874d",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "5621307bc558b13c1bbf874f",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56213103c558b13c1bbf8750",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56213197c558b13c1bbf8751",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56215e86c558b13c1bbf8755",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56229009184ec5a427913306",
                                viewType: "",
                                byDefault: "salesInvoice"
                            },
                            {
                                _id: "562506bb19a2ecca01ca84b3",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56265005d53978de6e9ea440",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "562b83ccb4677e225aa31df6",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "564dd4ce9fb8bc3f2195662c",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56570d714d96962262fd4b55",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56572368bfd103f108eb4a24",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56604795ccc590f32c577ece",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "566047c6ccc590f32c577ed1",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "5661a7bf7d284423697e34a8",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "5665429e9294f4d728bcafaa",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "566eba768453e8b464b70a40",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56c711ab0769bba2647ae710",
                                viewType: "",
                                byDefault: "Projects"
                            },
                            {
                                _id: "56daf5322e7b62c613ff2552",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56dd69d991cb620c19ff60c2",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56dd6af71e6cb7131892b2ba",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56dfe8e56e2877d85455a6bb",
                                viewType: "",
                                byDefault: "Leads"
                            }
                        ],
                        relatedEmployee: "55b92ad221e4b7c40f00004f"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.432Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        __v: 0,
                        attachments: [],
                        credentials: {
                            access_token: "",
                            refresh_token: ""
                        },
                        email: "info@thinkmobiles.com",
                        kanbanSettings: {
                            applications: {
                                countPerPage: 100,
                                foldWorkflows: [
                                    "Empty"
                                ]
                            },
                            opportunities: {
                                countPerPage: 10
                            },
                            tasks: {
                                countPerPage: 10,
                                foldWorkflows: [
                                    "528ce3caf3f67bc40b000013",
                                    "528ce3acf3f67bc40b000012",
                                    "528ce30cf3f67bc40b00000f",
                                    "528ce35af3f67bc40b000010"
                                ]
                            }
                        },
                        lastAccess: "2016-04-04T06:06:58.757Z",
                        login: "admin",
                        pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                        profile: 1387275598000,
                        imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        savedFilters: [
                            {
                                _id: "56213057c558b13c1bbf874d",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "5621307bc558b13c1bbf874f",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56213103c558b13c1bbf8750",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56213197c558b13c1bbf8751",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56215e86c558b13c1bbf8755",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56229009184ec5a427913306",
                                viewType: "",
                                byDefault: "salesInvoice"
                            },
                            {
                                _id: "562506bb19a2ecca01ca84b3",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56265005d53978de6e9ea440",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "562b83ccb4677e225aa31df6",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "564dd4ce9fb8bc3f2195662c",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56570d714d96962262fd4b55",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56572368bfd103f108eb4a24",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56604795ccc590f32c577ece",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "566047c6ccc590f32c577ed1",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "5661a7bf7d284423697e34a8",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "5665429e9294f4d728bcafaa",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "566eba768453e8b464b70a40",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56c711ab0769bba2647ae710",
                                viewType: "",
                                byDefault: "Projects"
                            },
                            {
                                _id: "56daf5322e7b62c613ff2552",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56dd69d991cb620c19ff60c2",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56dd6af71e6cb7131892b2ba",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56dfe8e56e2877d85455a6bb",
                                viewType: "",
                                byDefault: "Leads"
                            }
                        ],
                        relatedEmployee: "55b92ad221e4b7c40f00004f"
                    }
                },
                creationDate: "2015-07-29T19:34:42.432Z",
                workflow: {
                    _id: "52d2c1369b57890814000005",
                    __v: 0,
                    attachments: [],
                    color: "#2C3E50",
                    name: "Contract End",
                    sequence: 0,
                    status: "Cancelled",
                    wId: "Applications",
                    wName: "",
                    source: "",
                    targetSource: [
                        ""
                    ],
                    visible: true
                },
                manager: {
                    _id: "55b92ad221e4b7c40f000060",
                    dateBirth: "1983-03-06T22:00:00.000Z",
                    ID: 42,
                    isLead: 2,
                    fire: [
                        {
                            date: "2012-02-21T22:00:00.000Z",
                            info: "Update",
                            salary: 1400,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "56121847c90e2fb026ce0621",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-10-31T22:00:00.000Z",
                            info: "Update",
                            salary: 1800,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "56121847c90e2fb026ce0621",
                            department: "55b92ace21e4b7c40f000016"
                        }
                    ],
                    hire: [
                        {
                            date: "2012-02-21T22:00:00.000Z",
                            info: "",
                            salary: 1400,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "56121847c90e2fb026ce0621",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-10-31T22:00:00.000Z",
                            info: "",
                            salary: 1800,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "56121847c90e2fb026ce0621",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-12-31T22:00:00.000Z",
                            info: "",
                            salary: 2000,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "56121847c90e2fb026ce0621",
                            department: "55b92ace21e4b7c40f000016"
                        }
                    ],
                    social: {
                        FB: "null",
                        LI: "null"
                    },
                    sequence: 0,
                    jobType: "fullTime",
                    gender: "male",
                    marital: "unmarried",
                    contractEnd: {
                        date: "2015-07-29T19:34:42.461Z",
                        reason: ""
                    },
                    attachments: [],
                    editedBy: {
                        date: "2016-03-11T13:43:23.273Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:42.461Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.461Z",
                    color: "#4d5a75",
                    otherInfo: "",
                    groups: {
                        group: [],
                        users: [],
                        owner: "55ba28c8d79a3a3439000016"
                    },
                    whoCanRW: "everyOne",
                    workflow: null,
                    active: false,
                    referredBy: "",
                    source: "",
                    age: 33,
                    homeAddress: {
                        country: "",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    otherId: "",
                    bankAccountNo: "",
                    nationality: "",
                    coach: null,
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "56121847c90e2fb026ce0621",
                    department: "55b92ace21e4b7c40f000016",
                    visibility: "Public",
                    relatedUser: null,
                    officeLocation: "",
                    skype: "romashkabk",
                    workPhones: {
                        phone: "",
                        mobile: "+380667778480"
                    },
                    personalEmail: "",
                    workEmail: "roman.buchuk@thinkmobiles.com",
                    workAddress: {
                        country: "",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    tags: [
                        ""
                    ],
                    name: {
                        last: "Buchuk",
                        first: "Roman"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,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",
                    isEmployee: true,
                    __v: 0
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f00001c",
                    department: "55b92ace21e4b7c40f000016",
                    ID: 2,
                    editedBy: {
                        date: "2015-07-29T19:34:39.105Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:39.105Z",
                        user: "52203e707d4dba8813000003"
                    },
                    totalForecastedEmployees: 8,
                    numberOfEmployees: 3,
                    groups: {
                        group: [],
                        users: [],
                        owner: null
                    },
                    whoCanRW: "everyOne",
                    workflow: "528ce71ef3f67bc40b00001d",
                    expectedRecruitment: 5,
                    name: "Middle JS",
                    __v: 0
                },
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    ID: 8,
                    sequence: 0,
                    nestingLevel: 1,
                    editedBy: {
                        date: "2016-02-25T08:40:40.193Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.910Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [],
                    departmentManager: null,
                    parentDepartment: "56cebdf6541812c07197358f",
                    departmentName: "Web",
                    __v: 0
                },
                skype: "michael.kapustey",
                workPhones: {
                    mobile: "+380668456190",
                    phone: ""
                },
                personalEmail: "michaelkapustey@gmail.com",
                workEmail: "michael.kapustej@thinkmobiles.com",
                name: {
                    last: "Kapustey",
                    first: "Michael"
                },
                isEmployee: false
            }, {
                _id: "55c98aa7cbb0f4910b000005",
                dateBirth: "1994-07-28T00:00:00.000Z",
                fire: [
                    {
                        date: "2015-08-05T21:00:00.000Z",
                        info: "Update",
                        salary: 350,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f00004e",
                        jobPosition: "55b92acf21e4b7c40f000021",
                        department: "55b92ace21e4b7c40f000010"
                    },
                    {
                        date: "2015-12-27T22:00:00.000Z",
                        info: "",
                        salary: 400,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f00004e",
                        jobPosition: "55b92acf21e4b7c40f000021",
                        department: "55b92ace21e4b7c40f000010"
                    }
                ],
                hire: [
                    {
                        date: "2015-08-05T21:00:00.000Z",
                        info: "",
                        salary: 350,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f00004e",
                        jobPosition: "55b92acf21e4b7c40f000021",
                        department: "55b92ace21e4b7c40f000010"
                    },
                    {
                        date: "2015-09-30T21:00:00.000Z",
                        info: "",
                        salary: 400,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f00004e",
                        jobPosition: "55b92acf21e4b7c40f000021",
                        department: "55b92ace21e4b7c40f000010"
                    }
                ],
                sequence: 148,
                jobType: "fullTime",
                editedBy: {
                    date: "2016-04-04T08:32:17.607Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        __v: 0,
                        attachments: [ ],
                        credentials: {
                            access_token: "",
                            refresh_token: ""
                        },
                        email: "info@thinkmobiles.com",
                        kanbanSettings: {
                            applications: {
                                countPerPage: 100,
                                foldWorkflows: [
                                    "Empty"
                                ]
                            },
                            opportunities: {
                                countPerPage: 10
                            },
                            tasks: {
                                countPerPage: 10,
                                foldWorkflows: [
                                    "528ce3caf3f67bc40b000013",
                                    "528ce3acf3f67bc40b000012",
                                    "528ce30cf3f67bc40b00000f",
                                    "528ce35af3f67bc40b000010"
                                ]
                            }
                        },
                        lastAccess: "2016-04-04T06:06:58.757Z",
                        login: "admin",
                        pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                        profile: 1387275598000,
                        imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        savedFilters: [
                            {
                                _id: "56213057c558b13c1bbf874d",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "5621307bc558b13c1bbf874f",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56213103c558b13c1bbf8750",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56213197c558b13c1bbf8751",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56215e86c558b13c1bbf8755",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56229009184ec5a427913306",
                                viewType: "",
                                byDefault: "salesInvoice"
                            },
                            {
                                _id: "562506bb19a2ecca01ca84b3",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56265005d53978de6e9ea440",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "562b83ccb4677e225aa31df6",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "564dd4ce9fb8bc3f2195662c",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56570d714d96962262fd4b55",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56572368bfd103f108eb4a24",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56604795ccc590f32c577ece",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "566047c6ccc590f32c577ed1",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "5661a7bf7d284423697e34a8",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "5665429e9294f4d728bcafaa",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "566eba768453e8b464b70a40",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56c711ab0769bba2647ae710",
                                viewType: "",
                                byDefault: "Projects"
                            },
                            {
                                _id: "56daf5322e7b62c613ff2552",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56dd69d991cb620c19ff60c2",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56dd6af71e6cb7131892b2ba",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56dfe8e56e2877d85455a6bb",
                                viewType: "",
                                byDefault: "Leads"
                            }
                        ],
                        relatedEmployee: "55b92ad221e4b7c40f00004f"
                    }
                },
                createdBy: {
                    date: "2015-08-11T05:39:51.991Z",
                    user: {
                        _id: "55ba28c8d79a3a3439000016",
                        profile: 1438158808000,
                        kanbanSettings: {
                            tasks: {
                                foldWorkflows: [ ],
                                countPerPage: 10
                            },
                            applications: {
                                foldWorkflows: [ ],
                                countPerPage: 10
                            },
                            opportunities: {
                                foldWorkflows: [ ],
                                countPerPage: 10
                            }
                        },
                        credentials: {
                            access_token: "",
                            refresh_token: ""
                        },
                        pass: "e28ac09936a6b64abafe5870482de8ddd0b63cff921323ec91924d443afc907f",
                        email: "andriana.lemko@thinkmobiles.com",
                        login: "AndrianaLemko",
                        imageSrc: "data:image/jpeg;base64,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",
                        __v: 0,
                        lastAccess: "2016-03-21T07:48:07.268Z",
                        savedFilters: [ ],
                        relatedEmployee: null
                    }
                },
                creationDate: "2015-08-11T05:39:51.990Z",
                workflow: {
                    _id: "52d2c1369b57890814000005",
                    __v: 0,
                    attachments: [ ],
                    color: "#2C3E50",
                    name: "Contract End",
                    sequence: 0,
                    status: "Cancelled",
                    wId: "Applications",
                    wName: "",
                    source: "",
                    targetSource: [
                        ""
                    ],
                    visible: true
                },
                manager: {
                    _id: "55b92ad221e4b7c40f00004e",
                    dateBirth: "1994-06-16T21:00:00.000Z",
                    ID: 54,
                    isLead: 1,
                    fire: [
                        {
                            date: "2013-05-24T21:00:00.000Z",
                            info: "Update",
                            salary: 350,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2013-08-31T21:00:00.000Z",
                            info: "Update",
                            salary: 450,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2013-10-31T22:00:00.000Z",
                            info: "Update",
                            salary: 500,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000021",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2014-08-31T21:00:00.000Z",
                            info: "Update",
                            salary: 600,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000022",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2014-12-31T22:00:00.000Z",
                            info: "Update",
                            salary: 800,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2015-08-31T21:00:00.000Z",
                            info: "Update",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2015-12-31T22:00:00.000Z",
                            info: "Update",
                            salary: 1200,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        }
                    ],
                    hire: [
                        {
                            date: "2013-05-24T21:00:00.000Z",
                            info: "",
                            salary: 350,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2013-08-31T21:00:00.000Z",
                            info: "",
                            salary: 450,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2013-10-31T22:00:00.000Z",
                            info: "",
                            salary: 500,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000021",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2014-08-31T21:00:00.000Z",
                            info: "",
                            salary: 600,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000022",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2014-12-31T22:00:00.000Z",
                            info: "",
                            salary: 800,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2015-08-31T21:00:00.000Z",
                            info: "",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2015-12-31T22:00:00.000Z",
                            info: "",
                            salary: 1200,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2016-02-29T22:00:00.000Z",
                            info: "",
                            salary: 1400,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        }
                    ],
                    social: {
                        FB: "",
                        LI: ""
                    },
                    sequence: 0,
                    jobType: "Full-time",
                    gender: "male",
                    marital: "unmarried",
                    contractEnd: {
                        date: "2015-07-29T19:34:42.437Z",
                        reason: ""
                    },
                    attachments: [ ],
                    editedBy: {
                        date: "2016-03-11T13:41:16.494Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:42.437Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.437Z",
                    color: "#4d5a75",
                    otherInfo: "",
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: "55ba28c8d79a3a3439000016"
                    },
                    whoCanRW: "everyOne",
                    workflow: null,
                    active: false,
                    referredBy: "",
                    source: "",
                    age: 21,
                    homeAddress: {
                        country: "",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    otherId: "",
                    bankAccountNo: "",
                    nationality: "Ukrainian",
                    coach: null,
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "564438aa70bbc2b740ce8a19",
                    department: "55b92ace21e4b7c40f000010",
                    visibility: "Public",
                    relatedUser: "560d0c46963ba3087363de94",
                    officeLocation: "",
                    skype: "mikazme",
                    workPhones: {
                        phone: "",
                        mobile: "+380950366064"
                    },
                    personalEmail: "mikazmes@gmail.com",
                    workEmail: "vitaliy.shuba@thinkmobiles.com",
                    workAddress: {
                        country: "",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    tags: [
                        ""
                    ],
                    name: {
                        last: "Shuba",
                        first: "Vitaliy"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,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",
                    isEmployee: true,
                    __v: 0
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000021",
                    department: "55b92ace21e4b7c40f000010",
                    ID: 3,
                    editedBy: {
                        date: "2015-07-29T19:34:39.108Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:39.108Z",
                        user: "52203e707d4dba8813000003"
                    },
                    totalForecastedEmployees: 38,
                    numberOfEmployees: 23,
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: null
                    },
                    whoCanRW: "everyOne",
                    workflow: "528ce71ef3f67bc40b00001d",
                    expectedRecruitment: 15,
                    name: "Junior Android",
                    __v: 0
                },
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    ID: 2,
                    sequence: 4,
                    nestingLevel: 1,
                    editedBy: {
                        date: "2016-02-25T08:41:11.006Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.908Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: null,
                    parentDepartment: "56cebdf6541812c07197358f",
                    departmentName: "Android",
                    __v: 0
                },
                skype: "ok-zet",
                workPhones: {
                    mobile: "+380635793979",
                    phone: ""
                },
                personalEmail: "",
                workEmail: "eugen.rechun@thinkmobiles.com",
                name: {
                    last: "Rechun",
                    first: "Eugen"
                },
                isEmployee: false
            }
        ]
    };
    var fakeApplicationsByIdForList = {
        enableView: true,
        _id: "55b92ad221e4b7c40f000049",
        dateBirth: "1993-04-08T00:00:00.000Z",
        ID: 29,
        isLead: 2,
        __v: 0,
        transferred: [
            {
                department: "WP",
                date: "2015-10-07T21:00:00.000Z"
            }
        ],
        proposedSalary: 0,
        expectedSalary: 0,
        nextAction: "",
        passportNo: "",
        identNo: "",
        lastFire: 201605,
        fire: [
            {
                date: "2013-08-03T21:00:00.000Z",
                info: "Update",
                salary: 600,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f000060",
                    name: {
                        last: "Buchuk",
                        first: "Roman"
                    },
                    fullName: "Roman Buchuk",
                    id: "55b92ad221e4b7c40f000060"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f00001c",
                    name: "Middle JS"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                }
            },
            {
                date: "2016-02-04T22:00:00.000Z",
                info: "Fired",
                salary: 800,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f000060",
                    name: {
                        last: "Buchuk",
                        first: "Roman"
                    },
                    fullName: "Roman Buchuk",
                    id: "55b92ad221e4b7c40f000060"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f00001c",
                    name: "Middle JS"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                }
            }
        ],
        hire: [
            {
                date: "2013-08-03T21:00:00.000Z",
                info: "",
                salary: 600,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f000060",
                    name: {
                        last: "Buchuk",
                        first: "Roman"
                    },
                    fullName: "Roman Buchuk",
                    id: "55b92ad221e4b7c40f000060"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f00001c",
                    name: "Middle JS"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                }
            },
            {
                date: "2015-03-03T22:00:00.000Z",
                info: "Update",
                salary: 800,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f000060",
                    name: {
                        last: "Buchuk",
                        first: "Roman"
                    },
                    fullName: "Roman Buchuk",
                    id: "55b92ad221e4b7c40f000060"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f00001c",
                    name: "Middle JS"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                }
            }
        ],
        social: {
            GP: "",
            LI: "",
            FB: ""
        },
        sequence: 0,
        jobType: "Full-time",
        gender: "male",
        marital: "married",
        contractEnd: {
            date: "2016-02-04T22:00:00.000Z",
            reason: "Fired"
        },
        attachments: [ ],
        editedBy: {
            date: "2016-04-04T08:36:29.197Z",
            user: {
                _id: "52203e707d4dba8813000003",
                __v: 0,
                attachments: [ ],
                lastAccess: "2016-04-04T06:06:58.757Z",
                profile: 1387275598000,
                relatedEmployee: "55b92ad221e4b7c40f00004f",
                savedFilters: [
                    {
                        _id: "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id: "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id: "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    }
                ],
                kanbanSettings: {
                    tasks: {
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ],
                        countPerPage: 10
                    },
                    applications: {
                        foldWorkflows: [
                            "Empty"
                        ],
                        countPerPage: 100
                    },
                    opportunities: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    }
                },
                credentials: {
                    access_token: "",
                    refresh_token: ""
                },
                pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                email: "info@thinkmobiles.com",
                login: "admin",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        createdBy: {
            date: "2015-07-29T19:34:42.432Z",
            user: {
                _id: "52203e707d4dba8813000003",
                __v: 0,
                attachments: [ ],
                lastAccess: "2016-04-04T06:06:58.757Z",
                profile: 1387275598000,
                relatedEmployee: "55b92ad221e4b7c40f00004f",
                savedFilters: [
                    {
                        _id: "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id: "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id: "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    }
                ],
                kanbanSettings: {
                    tasks: {
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ],
                        countPerPage: 10
                    },
                    applications: {
                        foldWorkflows: [
                            "Empty"
                        ],
                        countPerPage: 100
                    },
                    opportunities: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    }
                },
                credentials: {
                    access_token: "",
                    refresh_token: ""
                },
                pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                email: "info@thinkmobiles.com",
                login: "admin",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        creationDate: "2015-07-29T19:34:42.432Z",
        color: "#4d5a75",
        otherInfo: "",
        groups: {
            group: [ ],
            users: [ ],
            owner: {
                _id: "55ba28c8d79a3a3439000016",
                login: "AndrianaLemko"
            }
        },
        whoCanRW: "everyOne",
        workflow: {
            _id: "52d2c1369b57890814000005",
            __v: 0,
            attachments: [ ],
            name: "Contract End",
            sequence: 0,
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
        active: false,
        referredBy: "",
        source: "",
        age: 22,
        homeAddress: {
            country: "",
            zip: "",
            state: "",
            city: "",
            street: ""
        },
        otherId: "",
        bankAccountNo: "",
        nationality: "Ukrainian",
        coach: null,
        manager: {
            _id: "55b92ad221e4b7c40f000060",
            name: {
                last: "Buchuk",
                first: "Roman"
            },
            fullName: "Roman Buchuk",
            id: "55b92ad221e4b7c40f000060"
        },
        jobPosition: {
            _id: "55b92acf21e4b7c40f00001c",
            name: "Middle JS"
        },
        department: {
            _id: "55b92ace21e4b7c40f000016",
            departmentName: "Web"
        },
        visibility: "Public",
        relatedUser: null,
        officeLocation: "",
        skype: "michael.kapustey",
        workPhones: {
            phone: "",
            mobile: "+380668456190"
        },
        personalEmail: "michaelkapustey@gmail.com",
        workEmail: "michael.kapustej@thinkmobiles.com",
        workAddress: {
            country: "",
            zip: "",
            state: "",
            city: "",
            street: ""
        },
        tags: [
            ""
        ],
        name: {
            last: "Kapustey",
            first: "Michael"
        },
        subject: "",
        imageSrc: "data:image/jpeg;base64,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",
        isEmployee: false,
        fullName: "Michael Kapustey",
        id: "55b92ad221e4b7c40f000049"
    }

    var view;
    var topBarView;
    var listView;
    var kanbanView;

    var workflowCollection;
    var applicationCollection;

    describe('DashboardVacation', function () {

        var $fixture;
        var $elFixture;

        after(function () {
            view.remove();
            topBarView.remove();
            kanbanView.remove();
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

            it('Should create main view', function (done) {
                //this.timeout(300);

                var $expectedSubMenuEl;
                var $expectedMenuEl;

                setTimeout(function () {
                    server.respondWith('GET', '/getModules', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);
                    view = new MainView({el: $elFixture, contentType: 'Applications'});
                    server.respond();

                    $expectedMenuEl = view.$el.find('#mainmenu-holder');
                    $expectedSubMenuEl = view.$el.find('#submenu-holder');

                    expect($expectedMenuEl).to.exist;
                    expect($expectedSubMenuEl).to.exist;

                    done();
                }, 300);


            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="43"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="43"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Applications');

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
                topBarView = new TopBarView({});

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Applications');
            });

        });


        describe('Application KanbanView', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;

            before(function () {
                App.currentViewType = 'kanban';
                server = sinon.fakeServer.create();
                //mainSpy = sinon.spy(App, 'render');
                 windowConfirmStub = sinon.stub(window, 'confirm').returns(true);
            });

            after(function () {
                server.restore();
                //mainSpy.restore();
                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to application KanBanView', function (done) {
                    //this.timeout(600);

                    var workflowsUrl = new RegExp('\/Workflows', 'i');
                    var applicationUrl = '/applications/kanban?workflowId=52d2c1369b57890814000005&viewType=kanban';
                    var applicationLengthUrl = new RegExp('\/applications\/getApplicationsLengthByWorkflows', 'i');

                    server.respondWith('GET', workflowsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWorkflows)]);
                    server.respondWith('GET', applicationLengthUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        showMore: false,
                        arrayOfObjects: [
                            {
                                _id: "52d2c1369b57890814000005",
                                count: 65
                            },
                            {
                                _id: null,
                                count: 223
                            }
                        ]
                    })]);
                    workflowCollection = new WorkflowCollection({
                        id: 'Applications'
                    });
                    server.respond();

                    setTimeout(function(){
                        server.respondWith('GET', applicationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeApplication)]);
                        kanbanView = new KanBanView({
                            workflowCollection: workflowCollection
                        });
                        server.respond();

                        expect(kanbanView.$el.find('.kanban')).to.exist;

                        done();
                    }, 300);

                });

                it('Try to open EditForm', function(){
                    var $needApplication = kanbanView.$el.find('#55b92ad221e4b7c40f000078');
                    var applicationUrl = new RegExp('\/applications\/', 'i');
                    var usersUrl = '/users/forDd';

                    server.respondWith('GET', applicationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeApplicationById)]);
                    server.respondWith('GET', usersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);
                    $needApplication.dblclick();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                });

                it ('Try to switch tabs', function(){
                    var $dialog = $('.ui-dialog');
                    var $firstTab = $dialog.find('.dialog-tabs li:nth-child(1) > a');
                    var $secondTab = $dialog.find('.dialog-tabs li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($secondTab).to.have.class('active');

                    $firstTab.click();
                    expect($firstTab).to.have.class('active');
                });

                it('Try to save application', function(){
                    var $next;
                    var $prev;
                    var $selectedItem;
                    var $saveBtn;
                    var $dialogEl = $('.ui-dialog');
                    var $nameInput = $dialogEl.find('#first');
                    var $relatedUserSelect = $dialogEl.find('#relatedUsersDd');
                    var applicationUrl = new RegExp('\/applications\/', 'i');

                    $nameInput.val('Test');
                    $relatedUserSelect.click();
                    $next = $dialogEl.find('.next');
                    $next.click();
                    $prev = $dialogEl.find('.prev');
                    $prev.click();
                    $selectedItem = $dialogEl.find('#560c099da5d4a2e20ba5068b');
                    $selectedItem.click();

                    $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                    server.respondWith('PATCH', applicationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    expect(window.location.hash).to.be.equals('#easyErp/Applications');

                });

                it('Try delete item from edit form', function(){
                    var $deleteBtn;
                    var $needApplication = kanbanView.$el.find('#55b92ad221e4b7c40f000078');
                    var applicationUrl = new RegExp('\/applications\/', 'i');
                    var usersUrl = '/users/forDd';

                    $needApplication.dblclick();
                    server.respond();
                    server.respond();

                    $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    server.respondWith('DELETE', applicationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    expect(window.location.hash).to.be.equals('#easyErp/Applications');
                    expect(kanbanView.$el.find('#forContent > div:nth-child(1)')).to.have.id('56b9ccd88f23c5696159cd09');
                });
            });
        });

        describe('Application ListView', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;

            before(function () {
                App.currentViewType = 'list';
                server = sinon.fakeServer.create();
                //mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm').returns(true);
            });

            after(function () {
                server.restore();
                //mainSpy.restore();
                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to application ListView', function () {
                    var applicationListUrl = new RegExp('\/applications\/list', 'i');
                    var workflowUrl = new RegExp('\/Workflows', 'i');
                    server.respondWith('GET', applicationListUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeApplicationsForList)]);
                    applicationCollection = new ApplicationCollection({
                        contentType: 'Applications',
                        viewType: 'list',
                        page: 1
                    });
                    server.respond();

                    server.respondWith('GET', applicationListUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWorkflows)]);
                    listView = new ListView({
                        collection: applicationCollection
                    });
                    server.respond();

                    expect(listView.$el.find('table')).to.have.class('list');
                });

                it('Try to go to EditForm', function(){
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var applicationUrl = new RegExp('\/applications\/', 'i');
                    var usersUrl = '/users/forDd';

                    server.respondWith('GET', applicationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeApplicationsByIdForList)]);
                    server.respondWith('GET', usersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                });

                it ('Try to switch tabs', function(){
                    var $dialog = $('.ui-dialog');
                    var $firstTab = $dialog.find('.dialog-tabs li:nth-child(1) > a');
                    var $secondTab = $dialog.find('.dialog-tabs li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($secondTab).to.have.class('active');

                    $firstTab.click();
                    expect($firstTab).to.have.class('active');
                });

                it('Try to add new job row', function(){
                    var $updateBtn;
                    var $hireDate;
                    var $dialogEl = $('.ui-dialog');
                    var $jobTab = $dialogEl.find('.dialog-tabs > li:nth-child(3) > a');

                    $jobTab.click();
                    $updateBtn = $dialogEl.find('#update');
                    $updateBtn.click();
                    $hireDate = $dialogEl.find('#hire2 > td[data-id="hireDate"]');
                    $hireDate.text('5 Apr, 2016');

                });

                it('Try to delete row in job table', function(){
                    var $dialogEl = $('.ui-dialog');
                    var $deleteRowBtn = $dialogEl.find('.fa-trash');

                    $deleteRowBtn.click();
                });

                it('Try to edit job row', function(){
                    var $needInput;
                    var $dialogEl = $('.ui-dialog');
                    var $needTd = $dialogEl.find('#hire0 > td:nth-child(8)');

                    $needTd.click();
                    $needInput = $dialogEl.find('#hire0 > td:nth-child(8) > input');
                    $needInput.val('999');
                    $dialogEl.find('#hire0 > td:nth-child(7)').click();
                });

                it('Try to save application', function(){
                    var $next;
                    var $prev;
                    var $selectedItem;
                    var $saveBtn;
                    var $dialogEl = $('.ui-dialog');
                    var $nameInput = $dialogEl.find('#first');
                    var $relatedUserSelect = $dialogEl.find('#relatedUsersDd');
                    var applicationUrl = new RegExp('\/applications\/', 'i');

                    $nameInput.val('Test');
                    $relatedUserSelect.click();
                    $next = $dialogEl.find('.next');
                    $next.click();
                    $prev = $dialogEl.find('.prev');
                    $prev.click();
                    $selectedItem = $dialogEl.find('#560c099da5d4a2e20ba5068b');
                    $selectedItem.click();

                    $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                    server.respondWith('PATCH', applicationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    expect(window.location.hash).to.be.equals('#easyErp/Applications');

                });

                it('Try delete item from edit form', function(){
                    var $deleteBtn;
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var applicationUrl = new RegExp('\/applications\/', 'i');

                    $needTd.click();
                    server.respond();
                    server.respond();

                    $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    server.respondWith('DELETE', applicationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    expect(window.location.hash).to.be.equals('#easyErp/Applications');
                });

            });
        });

        describe('Application CreateView', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var createView;

            before(function () {
                App.currentViewType = 'list';
                server = sinon.fakeServer.create();
                //mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm').returns(true);
            });

            after(function () {
                server.restore();
                //mainSpy.restore();
                windowConfirmStub.restore();

                createView.remove();
            });

            it('Try to create CreateView', function(){
                var usersUrl = '/users/forDd';

                server.respondWith('GET', usersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);
                createView = new CreateView();
                server.respond();

                expect($('.ui-dialog')).to.exist;

            });

            it ('Try to switch tabs', function(){
                var $dialog = $('.ui-dialog');
                var $firstTab = $dialog.find('.dialog-tabs li:nth-child(1) > a');
                var $secondTab = $dialog.find('.dialog-tabs li:nth-child(2) > a');

                expect($firstTab).to.have.class('active');

                $secondTab.click();
                expect($secondTab).to.have.class('active');

                $firstTab.click();
                expect($firstTab).to.have.class('active');
            });

            it ('Try to save application', function(){
                var $selectedItem;
                var $prev;
                var $next;
                var $dialogEl = $('.ui-dialog');
                var $firstName = $dialogEl.find('#first');
                var $lastName = $dialogEl.find('#last');
                var $birthDate = $dialogEl.find('#dateBirth');
                var $relatedUserSelect = $dialogEl.find('#relatedUsersDd');
                var applicationUrl = new RegExp('/applications', 'i');
                var $createBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.create-app-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                $firstName.val('Test');
                $lastName.val('Test');
                $birthDate.val('5 Apr, 1991');
                $relatedUserSelect.click();
                $next = $dialogEl.find('.next');
                $next.click();
                $prev = $dialogEl.find('.prev');
                $prev.click();
                $selectedItem = $dialogEl.find('#560c099da5d4a2e20ba5068b');
                $selectedItem.click();

                server.respondWith('POST', applicationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Created success'})]);
                $createBtn.click();
                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Applications');
            });


        });


    });


});
*/
