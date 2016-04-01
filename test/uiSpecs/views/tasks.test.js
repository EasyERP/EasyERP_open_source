/*
define([
    'text!fixtures/index.html',
    'collections/Tasks/filterCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/main/MainView',
    'views/Tasks/list/ListView',
    'views/Tasks/kanban/KanbanView',
    'views/Tasks/TopBarView',
    'views/Tasks/CreateView',
    'views/Tasks/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, TasksCollection, WorkflowCollection, MainView, ListView, KanBanView, TopBarView, CreateView, EditView, $, chai, chaiJquery, sinonChai, Custom) {
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
    var fakeTasks = {
        data: [
            {
                _id: "56fcc88a956d5b400d39ea91",
                summary: "Test",
                editedBy: {
                    date: "2016-03-31T06:49:46.216Z",
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
                                countPerPage: 10,
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
                        lastAccess: "2016-03-31T06:00:20.887Z",
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
                    date: "2016-03-31T06:49:46.216Z",
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
                                countPerPage: 10,
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
                        lastAccess: "2016-03-31T06:00:20.887Z",
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
                progress: 0,
                logged: null,
                estimated: 8,
                type: "Task",
                workflow: {
                    _id: "528ce0cdf3f67bc40b00000c",
                    __v: 0,
                    attachments: [ ],
                    color: "#2C3E50",
                    name: "New",
                    sequence: 5,
                    status: "New",
                    wId: "Tasks",
                    wName: "task",
                    source: "task",
                    targetSource: [
                        "task"
                    ],
                    visible: true
                },
                EndDate: "2016-03-03T06:00:00.000Z",
                StartDate: "2016-03-02T22:00:00.000Z",
                sequence: 0,
                tags: [
                    ""
                ],
                assignedTo: {
                    _id: "55b92ad221e4b7c40f0000bd",
                    dateBirth: "1991-04-11T03:00:00.000Z",
                    ID: 2135,
                    isLead: 0,
                    fire: [
                        {
                            date: "2015-05-11T21:00:00.000Z",
                            info: "Update",
                            salary: 350,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-08-31T21:00:00.000Z",
                            info: "Update",
                            salary: 450,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-10-31T22:00:00.000Z",
                            info: "Update",
                            salary: 600,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        }
                    ],
                    hire: [
                        {
                            date: "2015-05-11T21:00:00.000Z",
                            info: "",
                            salary: 350,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-08-31T21:00:00.000Z",
                            info: "",
                            salary: 450,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-10-31T22:00:00.000Z",
                            info: "",
                            salary: 600,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2016-02-29T22:00:00.000Z",
                            info: "",
                            salary: 700,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
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
                        date: "2015-07-29T19:34:42.661Z",
                        reason: ""
                    },
                    attachments: [ ],
                    editedBy: {
                        date: "2016-03-11T13:54:05.498Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:42.661Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.661Z",
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
                    age: 24,
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
                    manager: "55b92ad221e4b7c40f000060",
                    jobPosition: "55b92acf21e4b7c40f000017",
                    department: "55b92ace21e4b7c40f000016",
                    visibility: "Public",
                    relatedUser: null,
                    officeLocation: "",
                    skype: "vashkebam",
                    workPhones: {
                        phone: "",
                        mobile: "+380502529273"
                    },
                    personalEmail: "",
                    workEmail: "michael.vashkeba@thinkmobiles.com",
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
                        last: "Vashkeba",
                        first: "Michael"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,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",
                    isEmployee: true,
                    __v: 0
                },
                project: {
                    _id: "562beda846bca6e4591f4930",
                    StartDate: "2015-10-18T21:00:00.000Z",
                    budget: {
                        bonus: [ ],
                        projectTeam: [
                            "56e12f5c55a3e27b03061240",
                            "56e12c2b8af0cbf501828bec",
                            "56e12eb4d6b3628b02612e43",
                            "56dffb84b07e2ad226b6893c",
                            "56dff725a12a4f3c26919c96",
                            "564cfdd06584412e6184219e",
                            "56aa209fb4dc0d09232bd7a3",
                            "56e12f39d40dde6a022319ad",
                            "56dffb3ca12a4f3c26919c97",
                            "566424e308ed794128637c24",
                            "566424cd08ed794128637c23",
                            "56dfe82f5db22bf954ad1fd0",
                            "56dfe5de2a7718fe47355966"
                        ]
                    },
                    bonus: [ ],
                    health: 1,
                    editedBy: {
                        date: "2016-03-14T17:40:17.881Z",
                        user: "56239f14e9576d1728a9ed23"
                    },
                    attachments: [ ],
                    notes: [ ],
                    projecttype: "iOs",
                    createdBy: {
                        date: "2015-10-24T20:44:24.279Z",
                        user: "55cb7302fea413b50b000007"
                    },
                    progress: 0,
                    remaining: 0,
                    logged: 0,
                    estimated: 0,
                    workflow: "528ce7f2f3f67bc40b000023",
                    parent: null,
                    sequence: 0,
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: "560c099da5d4a2e20ba5068b"
                    },
                    whoCanRW: "everyOne",
                    projectmanager: "55b92ad221e4b7c40f00004a",
                    customer: "562bed4062461bfd59ef58d1",
                    task: [
                        "56fcc88a956d5b400d39ea91"
                    ],
                    projectName: "TreatMe",
                    projectShortDesc: "Uber-like app",
                    __v: 0,
                    EndDate: "2016-03-10T22:00:00.000Z",
                    TargetEndDate: "",
                    description: ""
                },
                taskCount: 1
            },
            {
                _id: "56dfd3e78c59375e055e0cc2",
                editedBy: {
                    date: "2016-03-11T07:39:26.649Z",
                    user: {
                        _id: "56d7e73eae35cc4f0e72105b",
                        profile: 1387275504000,
                        relatedEmployee: null,
                        savedFilters: [
                            {
                                _id: "56d800358230197c0e089032",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8003f8df756130e1e9c9e",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8005f8230197c0e089033",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8007818488d9d0e65ae58",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8009618488d9d0e65ae59",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d800a8ae35cc4f0e721066",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d800c1981edd2e0e737449",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8014e612326bf0dfdffd9",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d801c48df756130e1e9ca1",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8037c32e6cca40d256671",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56e667895ec71b0042974587",
                                viewType: "",
                                byDefault: "DashVacation"
                            },
                            {
                                _id: "56e66e3ddd81ed4e426c60a5",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56e66e6c81046d9741fb66d6",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56e66e9204f9482d4273ed08",
                                viewType: "",
                                byDefault: "jobsDashboard"
                            },
                            {
                                _id: "56e67b59ef05acd9418dff30",
                                viewType: "",
                                byDefault: ""
                            }
                        ],
                        kanbanSettings: {
                            tasks: {
                                foldWorkflows: [ ],
                                countPerPage: 10
                            },
                            applications: {
                                foldWorkflows: [ ],
                                countPerPage: 20
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
                        pass: "37268335dd6931045bdcdf92623ff819a64244b53d0e746d438797349d4da578",
                        email: "test@test.com",
                        login: "testuser",
                        imageSrc: "data:image/jpeg;base64,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",
                        __v: 0,
                        lastAccess: "2016-03-17T16:27:18.358Z"
                    }
                },
                createdBy: {
                    date: "2016-03-09T07:42:31.415Z",
                    user: {
                        _id: "56d7e73eae35cc4f0e72105b",
                        profile: 1387275504000,
                        relatedEmployee: null,
                        savedFilters: [
                            {
                                _id: "56d800358230197c0e089032",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8003f8df756130e1e9c9e",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8005f8230197c0e089033",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8007818488d9d0e65ae58",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8009618488d9d0e65ae59",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d800a8ae35cc4f0e721066",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d800c1981edd2e0e737449",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8014e612326bf0dfdffd9",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d801c48df756130e1e9ca1",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56d8037c32e6cca40d256671",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56e667895ec71b0042974587",
                                viewType: "",
                                byDefault: "DashVacation"
                            },
                            {
                                _id: "56e66e3ddd81ed4e426c60a5",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56e66e6c81046d9741fb66d6",
                                viewType: "",
                                byDefault: ""
                            },
                            {
                                _id: "56e66e9204f9482d4273ed08",
                                viewType: "",
                                byDefault: "jobsDashboard"
                            },
                            {
                                _id: "56e67b59ef05acd9418dff30",
                                viewType: "",
                                byDefault: ""
                            }
                        ],
                        kanbanSettings: {
                            tasks: {
                                foldWorkflows: [ ],
                                countPerPage: 10
                            },
                            applications: {
                                foldWorkflows: [ ],
                                countPerPage: 20
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
                        pass: "37268335dd6931045bdcdf92623ff819a64244b53d0e746d438797349d4da578",
                        email: "test@test.com",
                        login: "testuser",
                        imageSrc: "data:image/jpeg;base64,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",
                        __v: 0,
                        lastAccess: "2016-03-17T16:27:18.358Z"
                    }
                },
                progress: 88,
                logged: 7,
                estimated: 8,
                type: "Task",
                workflow: {
                    _id: "528ce0cdf3f67bc40b00000c",
                    __v: 0,
                    attachments: [ ],
                    color: "#2C3E50",
                    name: "New",
                    sequence: 5,
                    status: "New",
                    wId: "Tasks",
                    wName: "task",
                    source: "task",
                    targetSource: [
                        "task"
                    ],
                    visible: true
                },
                EndDate: "2016-03-31T05:00:00.000Z",
                StartDate: "2016-03-30T21:00:00.000Z",
                sequence: -1,
                tags: [
                    ""
                ],
                assignedTo: {
                    _id: "55b92ad221e4b7c40f000030",
                    dateBirth: "1981-12-31T23:00:00.000Z",
                    ID: 1,
                    isLead: 2,
                    fire: [
                        {
                            date: "2011-10-10T21:00:00.000Z",
                            info: "Update",
                            salary: 1800,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5643483270bbc2b740ce8a16",
                            department: "55b92ace21e4b7c40f000012"
                        }
                    ],
                    hire: [
                        {
                            date: "2011-10-10T21:00:00.000Z",
                            info: "",
                            salary: 1800,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5643483270bbc2b740ce8a16",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2014-09-30T21:00:00.000Z",
                            info: "",
                            salary: 2000,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438d470bbc2b740ce8a1a",
                            department: "55bb1f40cb76ca630b000007"
                        }
                    ],
                    social: {
                        FB: "",
                        LI: ""
                    },
                    sequence: 0,
                    jobType: "fullTime",
                    gender: "male",
                    marital: "married",
                    contractEnd: {
                        date: "2015-07-29T19:34:42.405Z",
                        reason: ""
                    },
                    attachments: [ ],
                    editedBy: {
                        date: "2016-03-11T13:37:17.835Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:42.404Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.404Z",
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
                    nationality: "Ukrainian",
                    coach: null,
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "564438d470bbc2b740ce8a1a",
                    department: "55bb1f40cb76ca630b000007",
                    visibility: "Public",
                    relatedUser: null,
                    officeLocation: "",
                    skype: "alexsvt",
                    workPhones: {
                        phone: "",
                        mobile: "+380509369493"
                    },
                    personalEmail: "alsv82@gmail.com",
                    workEmail: "alex.svatuk@thinkmobiles.com",
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
                        first: "Alex",
                        last: "Svatuk"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,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",
                    isEmployee: true,
                    __v: 0
                },
                project: {
                    _id: "55cdc96d9b42266a4f000006",
                    TargetEndDate: "2015-08-17T22:00:00.000Z",
                    StartDate: "2015-08-09T21:00:00.000Z",
                    bonus: [ ],
                    health: 1,
                    editedBy: {
                        date: "2015-12-04T16:59:53.625Z",
                        user: "55bf144765cda0810b000005"
                    },
                    attachments: [ ],
                    notes: [ ],
                    projecttype: "",
                    createdBy: {
                        date: "2015-08-14T10:56:45.871Z",
                        user: "55b9dd237a3632120b000005"
                    },
                    progress: 0,
                    remaining: 0,
                    logged: 0,
                    estimated: 0,
                    workflow: "528ce82df3f67bc40b000025",
                    parent: null,
                    sequence: 0,
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: "55ba28c8d79a3a3439000016"
                    },
                    whoCanRW: "everyOne",
                    projectmanager: "55b92ad221e4b7c40f00004b",
                    customer: "55cdc93c9b42266a4f000005",
                    task: [
                        "56dfd3e78c59375e055e0cc2"
                    ],
                    projectName: "Absolute Vodka",
                    projectShortDesc: "Absolute Vodka",
                    __v: 0,
                    teams: { },
                    info: { },
                    description: "",
                    budget: {
                        bonus: [ ],
                        projectTeam: [
                            "564cfdd06584412e618421da"
                        ]
                    },
                    EndDate: "2015-08-27T21:00:00.000Z"
                },
                taskCount: 1,
                summary: "Test"
            }
        ]
    };
    var fakeTaskForm = {
        _id: "56fcc88a956d5b400d39ea91",
        summary: "Test",
        description: "",
        __v: 0,
        editedBy: {
            date: "2016-03-31T06:49:46.216Z",
            user: {
                _id: "52203e707d4dba8813000003",
                __v: 0,
                attachments: [ ],
                lastAccess: "2016-03-31T06:00:20.887Z",
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
                pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                email: "info@thinkmobiles.com",
                login: "admin",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        attachments: [ ],
        notes: [ ],
        createdBy: {
            date: "2016-03-31T06:49:46.216Z",
            user: {
                _id: "52203e707d4dba8813000003",
                __v: 0,
                attachments: [ ],
                lastAccess: "2016-03-31T06:00:20.887Z",
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
                pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                email: "info@thinkmobiles.com",
                login: "admin",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        progress: 0,
        remaining: 8,
        logged: null,
        estimated: 8,
        type: "Task",
        workflow: {
            _id: "528ce0cdf3f67bc40b00000c",
            __v: 0,
            attachments: [ ],
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
        duration: 1,
        EndDate: "2016-03-03T06:00:00.000Z",
        StartDate: "2016-03-02T22:00:00.000Z",
        customer: null,
        sequence: 0,
        priority: "P3",
        tags: [
            ""
        ],
        assignedTo: {
            _id: "55b92ad221e4b7c40f0000bd",
            name: {
                last: "Vashkeba",
                first: "Michael"
            },
            imageSrc: "data:image/jpeg;base64,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",
            fullName: "Michael Vashkeba",
            id: "55b92ad221e4b7c40f0000bd"
        },
        project: {
            _id: "562beda846bca6e4591f4930",
            projectName: "TreatMe",
            projectShortDesc: "Uber-like app"
        },
        taskCount: 1
    };
    var fakeTaskPriority = {
        data: [
            {
                attachments: [ ],
                priority: "P1"
            },
            {
                attachments: [ ],
                priority: "P2"
            },
            {
                attachments: [ ],
                priority: "P3"
            },
            {
                attachments: [ ],
                priority: "P4"
            },
            {
                attachments: [ ],
                priority: "P5"
            }
        ]
    };
    var fakeEmployee = {
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
    var fakeWorkflows = {
        data: [
            {
                _id: "528ce0cdf3f67bc40b00000c",
                __v: 0,
                attachments: [ ],
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
                _id: "528ce131f3f67bc40b00000d",
                __v: 0,
                attachments: [ ],
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
                _id: "528ce30cf3f67bc40b00000f",
                __v: 0,
                attachments: [ ],
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
                _id: "528ce35af3f67bc40b000010",
                __v: 0,
                attachments: [ ],
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
                _id: "528ce3acf3f67bc40b000012",
                __v: 0,
                attachments: [ ],
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
                _id: "528ce3caf3f67bc40b000013",
                __v: 0,
                attachments: [ ],
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
            }
        ]
    };
    var fakeTasksForKanban = {
        data: [
            {
                _id: "56fcc88a956d5b400d39ea91",
                summary: "Test",
                editedBy: {
                    date: "2016-03-31T06:49:46.216Z"
                },
                remaining: 8,
                type: "Task",
                workflow: "528ce0cdf3f67bc40b00000c",
                sequence: 1,
                priority: "P3",
                assignedTo: {
                    _id: "55b92ad221e4b7c40f000084",
                    name: {
                        last: "Dahno",
                        first: "Alex"
                    },
                    fullName: "Alex Dahno",
                    id: "55b92ad221e4b7c40f000084"
                },
                project: {
                    _id: "562beda846bca6e4591f4930",
                    projectShortDesc: "Uber-like app"
                },
                taskCount: 1
            },
            {
                _id: "56fd15f3a079b9722d00ea15",
                summary: "Test",
                editedBy: {
                    date: "2016-03-31T12:20:03.113Z"
                },
                remaining: 0,
                type: "Task",
                workflow: "528ce0cdf3f67bc40b00000c",
                sequence: 0,
                priority: "P3",
                assignedTo: {
                    _id: "55b92ad221e4b7c40f000030",
                    name: {
                        last: "Svatuk",
                        first: "Alex"
                    },
                    fullName: "Alex Svatuk",
                    id: "55b92ad221e4b7c40f000030"
                },
                project: {
                    _id: "56e689c75ec71b00429745a9",
                    projectShortDesc: "SDK"
                },
                taskCount: 1
            },
            {
                _id: "56dfd3e78c59375e055e0cc2",
                summary: "Test",
                editedBy: {
                    date: "2016-03-11T07:39:26.649Z"
                },
                remaining: 1,
                type: "Task",
                workflow: "528ce0cdf3f67bc40b00000c",
                sequence: -1,
                priority: "P3",
                assignedTo: {
                    _id: "55b92ad221e4b7c40f000030",
                    name: {
                        last: "Svatuk",
                        first: "Alex"
                    },
                    fullName: "Alex Svatuk",
                    id: "55b92ad221e4b7c40f000030"
                },
                project: {
                    _id: "55cdc96d9b42266a4f000006",
                    projectShortDesc: "Absolute Vodka"
                },
                taskCount: 1
            },
            {
                _id: "56fd179da079b9722d00ea16",
                summary: "erty",
                editedBy: {
                    date: "2016-03-31T12:27:09.907Z"
                },
                remaining: 0,
                type: "Task",
                workflow: "528ce0cdf3f67bc40b00000c",
                sequence: -1,
                priority: "P3",
                assignedTo: {
                    _id: "55b92ad221e4b7c40f000030",
                    name: {
                        last: "Svatuk",
                        first: "Alex"
                    },
                    fullName: "Alex Svatuk",
                    id: "55b92ad221e4b7c40f000030"
                },
                project: {
                    _id: "56e689c75ec71b00429745a9",
                    projectShortDesc: "SDK"
                },
                taskCount: 2
            }
        ],
        workflowId: "528ce0cdf3f67bc40b00000c",
        remaining: 9,
        time: 1533,
        fold: false
    };

    var view;
    var topBarView;
    var listView;
    var kanbanView;
    var tasksCollection;

    describe('TasksView', function () {

        var $fixture;
        var $elFixture;

        before(function(){
            var windowAlertStub = sinon.stub(window, 'alert').returns(true);
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();
            kanbanView.remove();
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
                this.timeout(300);

                var $expectedSubMenuEl;
                var $expectedMenuEl;

                setTimeout(function () {
                    server.respondWith('GET', '/getModules', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);
                    view = new MainView({el: $elFixture, contentType: 'Tasks'});
                    server.respond();

                    $expectedMenuEl = view.$el.find('#mainmenu-holder');
                    $expectedSubMenuEl = view.$el.find('#submenu-holder');

                    expect($expectedMenuEl).to.exist;
                    expect($expectedSubMenuEl).to.exist;

                    done();
                }, 200);


            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="40"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="40"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Tasks');

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
                var tasksUrl = new RegExp('\/Tasks\/list', 'i');

                server.respondWith('GET', tasksUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTasks)]);
                tasksCollection = new TasksCollection({
                    page: 1,
                    contentType: 'Tasks',
                    viewType: 'list'

                });
                server.respond();

                topBarView = new TopBarView({
                    collection: tasksCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Tasks');
            });

            it('Try to change ViewType', function(){
                var $listBtn = topBarView.$el.find('#listBtn');
                var $kanbanBtn = topBarView.$el.find('#kanbanBtn');

                expect(window.location.hash).to.be.equals('#easyErp/Tasks');

                $kanbanBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Tasks/kanban');

                $listBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Tasks/list');

            });

        });


        describe('Task list view', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var createView;

            before(function () {
                App.currentViewType = 'list';

                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm').returns(true);
            });

            after(function () {
                createView.remove();

                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create categories list view', function () {

                    listView = new ListView({
                        collection: tasksCollection,
                        startTime: new Date(),
                        page: 1
                    });

                    expect(listView.$el.find('.list')).to.exist;
                    expect(listView.$el.find('#searchContainer')).to.exist;

                });

                it('Try to open EditForm with error', function () {
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(3)');
                    var taskFormUrl = new RegExp('\/Tasks\/form', 'i');
                    var spyResponse;

                    server.respondWith('GET', taskFormUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $needTd.click();
                    server.respond();
                    spyResponse = mainSpy.args[0][0];

                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to open EditForm', function () {
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(3)');
                    var taskFormUrl = new RegExp('\/Tasks\/form', 'i');
                    var employeeUrl = '/employees/getPersonsForDd';

                    server.respondWith('GET', taskFormUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTaskForm)]);
                    server.respondWith('GET', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployee)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to edit item', function () {
                    var $selectedItem;
                    var $nextEl;
                    var $prevEl;
                    var $dialogEl = $('.ui-dialog');
                    var $startDate = $dialogEl.find('#StartDate');
                    var $logged = $dialogEl.find('#logged');
                    var $employeeSelect = $dialogEl.find('#assignedToDd');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var tasksUrl = new RegExp('\/Tasks\/', 'i');

                    $startDate.val('5 Apr, 2016');
                    $logged.val('6');
                    $employeeSelect.click();
                    $nextEl = $dialogEl.find('.next');
                    $nextEl.click();
                    $prevEl = $dialogEl.find('.prev');
                    $prevEl.click();
                    $selectedItem = $dialogEl.find('#55b92ad221e4b7c40f000084');
                    $selectedItem.click();

                    server.respondWith('PATCH', tasksUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Tasks/list');
                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to delete item with error', function(){
                    var $deleteBtn;
                    var spyResponse;
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(3)');
                    var taskFormUrl = new RegExp('\/Tasks\/form', 'i');
                    var taskUrl = new RegExp('\/Tasks\/', 'i');

                    server.respondWith('GET', taskFormUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTaskForm)]);
                    $needTd.click();
                    server.respond();

                    $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');

                    server.respondWith('DELETE', taskUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();
                    spyResponse = mainSpy.args[0][0];

                    expect(spyResponse).to.have.property('type', 'error');

                });

                it('Try to delete current task', function(){
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    var taskUrl = new RegExp('\/Tasks\/', 'i');

                    server.respondWith('DELETE', taskUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it ('Try to open CreateView', function(){
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var employeeUrl = '/employees/getPersonsForDd';

                    server.respondWith('GET', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployee)]);
                    $createBtn.click();
                    createView = new CreateView({});
                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                });

                it ('Try to create new task', function () {
                    var $selectedItem;
                    var $next;
                    var $prev;
                    var $dialogEl = $('.ui-dialog');
                    var $summary = $dialogEl.find('#summaryTask');
                    var $startDate = $dialogEl.find('#StartDate');
                    var $employeeSelect = $dialogEl.find('#assignedToDd');
                    var $createBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var taskUrl = '/Tasks/';

                    $summary.val('Test');
                    $startDate.val('4 Apr, 2016');
                    $employeeSelect.click();
                    $next = $dialogEl.find('.next');
                    $next.click();
                    $prev = $dialogEl.find('.prev');
                    $prev.click();
                    $selectedItem = $dialogEl.find('#55b92ad221e4b7c40f000084');
                    $selectedItem.click();

                    server.respondWith('POST', taskUrl, [201, {"Content-Type": "application/json"}, JSON.stringify({success: 'Created success'})]);
                    $createBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Tasks/list');

                });

                it('Try to cancel dialog', function(){
                    var $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });
            });
        });

        describe('Task kanban view', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var workflowCollection;

            before(function () {
                App.currentViewType = 'kanban';
                window.location.hash = 'easyErp/Tasks/kanban';

                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm').returns(true);
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function () {


                it('Try to create categories kanbanView', function (done) {

                    var workflowsUrl = new RegExp('\/Workflows', 'i');
                    var tasksUrl = '/Tasks/kanban?workflowId=528ce0cdf3f67bc40b00000c';
                    var tasksLengthUrl = new RegExp('\/tasks\/getLengthByWorkflows?parrentContentId', 'i');

                    server.respondWith('GET', workflowsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWorkflows)]);
                    server.respondWith('GET', tasksLengthUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        showMore: false,
                        arrayOfObjects: [
                            {
                                _id: "528ce0cdf3f67bc40b00000c",
                                count: 4,
                                totalRemaining: 9
                            }
                        ]
                    })]);
                    workflowCollection = new WorkflowCollection({
                        id: 'Tasks'
                    });
                    server.respond();
                    server.respond();

                    setTimeout(function(){
                        server.respondWith('GET', tasksUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTasksForKanban)]);
                        kanbanView = new KanBanView({
                            workflowCollection: workflowCollection
                        });
                        server.respond();
                        expect(kanbanView.$el.find('.kanban')).to.exist;

                        done();
                    }, 200);
                });

                it('Try to open edit form', function(){
                    var $needTaskEl = kanbanView.$el.find('#56fcc88a956d5b400d39ea91');
                    var taskFormUrl = new RegExp('\/Tasks\/form', 'i');
                    var employeeUrl = '/employees/getPersonsForDd';

                    server.respondWith('GET', taskFormUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTaskForm)]);
                    server.respondWith('GET', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployee)]);
                    $needTaskEl.dblclick();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to edit item', function(){
                    var $selectedItem;
                    var $nextEl;
                    var $prevEl;
                    var $dialogEl = $('.ui-dialog');
                    var $startDate = $dialogEl.find('#StartDate');
                    var $logged = $dialogEl.find('#logged');
                    var $employeeSelect = $dialogEl.find('#assignedToDd');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var tasksUrl = new RegExp('\/Tasks\/', 'i');

                    $startDate.val('5 Apr, 2016');
                    $logged.val('6');
                    $employeeSelect.click();
                    $nextEl = $dialogEl.find('.next');
                    $nextEl.click();
                    $prevEl = $dialogEl.find('.prev');
                    $prevEl.click();
                    $selectedItem = $dialogEl.find('#55b92ad221e4b7c40f000084');
                    $selectedItem.click();

                    server.respondWith('PATCH', tasksUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Tasks/kanban');
                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to delete current task', function(){
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    var taskUrl = new RegExp('\/Tasks\/', 'i');

                    server.respondWith('DELETE', taskUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });


            });
        });

    });


});
*/
