define([
    'text!fixtures/index.html',
    'collections/DividendInvoice/filterCollection',
    'views/main/MainView',
    'views/DividendInvoice/list/ListView',
    'views/DividendInvoice/TopBarView',
    'views/DividendInvoice/CreateView',
    'views/DividendInvoice/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (fixtures, DividendCollection, MainView, ListView, TopBarView, CreateView, EditView, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [
        {
            _id: 19,
            attachments: [ ],
            link: false,
            mname: "Sales",
            parrent: null,
            sequence: 1,
            visible: true,
            ancestors: [ ],
            href: "Sales"
        },
        {
            _id: 36,
            attachments: [ ],
            link: false,
            mname: "Project",
            parrent: null,
            sequence: 2,
            visible: true,
            ancestors: [ ],
            href: "Project"
        },
        {
            _id: 9,
            attachments: [ ],
            link: false,
            mname: "HR",
            parrent: null,
            sequence: 3,
            visible: true,
            ancestors: [ ],
            href: "HR"
        },
        {
            _id: 24,
            attachments: [ ],
            link: true,
            mname: "Leads",
            parrent: 19,
            sequence: 5,
            visible: true,
            ancestors: [ ],
            href: "Leads"
        },
        {
            _id: 25,
            attachments: [ ],
            link: true,
            mname: "Opportunities",
            parrent: 19,
            sequence: 6,
            visible: true,
            ancestors: [ ],
            href: "Opportunities"
        },
        {
            _id: 49,
            attachments: [ ],
            htref: "persons",
            link: true,
            mname: "Persons",
            parrent: 19,
            sequence: 7,
            visible: true,
            ancestors: [ ],
            href: "Persons"
        },
        {
            _id: 50,
            attachments: [ ],
            htref: "persons",
            link: true,
            mname: "Companies",
            parrent: 19,
            sequence: 8,
            visible: true,
            ancestors: [ ],
            href: "Companies"
        },
        {
            _id: 39,
            attachments: [ ],
            link: true,
            mname: "Projects",
            parrent: 36,
            sequence: 21,
            visible: true,
            ancestors: [ ],
            href: "Projects"
        },
        {
            _id: 73,
            mname: "Dashboard Vacation",
            sequence: 22,
            parrent: 36,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "DashBoardVacation"
        },
        {
            _id: 40,
            attachments: [ ],
            link: true,
            mname: "Tasks",
            parrent: 36,
            sequence: 24,
            visible: true,
            ancestors: [ ],
            href: "Tasks"
        },
        {
            _id: 29,
            attachments: [ ],
            link: true,
            mname: "Dashboard",
            parrent: 19,
            sequence: 29,
            visible: true,
            ancestors: [ ],
            href: "Dashboard"
        },
        {
            _id: 42,
            attachments: [ ],
            link: true,
            mname: "Employees",
            parrent: 9,
            sequence: 29,
            visible: true,
            ancestors: [ ],
            href: "Employees"
        },
        {
            _id: 43,
            attachments: [ ],
            link: true,
            mname: "Applications",
            parrent: 9,
            sequence: 30,
            visible: true,
            ancestors: [ ],
            href: "Applications"
        },
        {
            _id: 14,
            attachments: [ ],
            link: true,
            mname: "Job Positions",
            parrent: 9,
            sequence: 32,
            visible: true,
            ancestors: [ ],
            href: "JobPositions"
        },
        {
            _id: 15,
            attachments: [ ],
            link: true,
            mname: "Groups",
            parrent: 1,
            sequence: 33,
            visible: true,
            ancestors: [ ],
            href: "Departments"
        },
        {
            _id: 7,
            __v: 0,
            attachments: [ ],
            link: true,
            mname: "Users",
            parrent: 1,
            sequence: 42,
            visible: true,
            ancestors: [ ],
            href: "Users"
        },
        {
            _id: 44,
            attachments: [ ],
            link: true,
            mname: "Workflows",
            parrent: 1,
            sequence: 44,
            visible: true,
            ancestors: [ ],
            href: "Workflows"
        },
        {
            _id: 51,
            attachments: [ ],
            link: true,
            mname: "Profiles",
            parrent: 1,
            sequence: 51,
            visible: true,
            ancestors: [ ],
            href: "Profiles"
        },
        {
            _id: 52,
            attachments: [ ],
            link: true,
            mname: "Birthdays",
            parrent: 9,
            sequence: 52,
            visible: true,
            ancestors: [ ],
            href: "Birthdays"
        },
        {
            _id: 53,
            attachments: [ ],
            link: true,
            mname: "Dashboard",
            parrent: 36,
            sequence: 53,
            visible: true,
            ancestors: [ ],
            href: "projectDashboard"
        },
        {
            _id: 54,
            mname: "Purchases",
            sequence: 54,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Purchases"
        },
        {
            _id: 80,
            mname: "Jobs Dashboard",
            sequence: 54,
            parrent: 36,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "jobsDashboard"
        },
        {
            _id: 55,
            mname: "Quotation",
            sequence: 55,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Quotation"
        },
        {
            _id: 57,
            mname: "Order",
            sequence: 56,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Order"
        },
        {
            _id: 56,
            mname: "Invoice",
            sequence: 57,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Invoice"
        },
        {
            _id: 58,
            mname: "Product",
            sequence: 58,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Product"
        },
        {
            _id: 59,
            mname: "Accounting",
            sequence: 59,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Accounting"
        },
        {
            _id: 60,
            mname: "Supplier Payments",
            sequence: 60,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "supplierPayments"
        },
        {
            _id: 61,
            mname: "Sales Payments",
            sequence: 61,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "customerPayments"
        },
        {
            _id: 62,
            mname: "Quotation",
            sequence: 62,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesQuotation"
        },
        {
            _id: 63,
            mname: "Order",
            sequence: 63,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesOrder"
        },
        {
            _id: 64,
            mname: "Invoice",
            sequence: 64,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesInvoice"
        },
        {
            _id: 99,
            mname: "Proforma",
            sequence: 65,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesProforma"
        },
        {
            _id: 67,
            mname: "Revenue",
            sequence: 67,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Revenue"
        },
        {
            _id: 68,
            mname: "MonthHours",
            sequence: 68,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "monthHours"
        },
        {
            _id: 69,
            mname: "Holidays",
            sequence: 69,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Holiday"
        },
        {
            _id: 77,
            mname: "Capacity",
            sequence: 69,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Capacity"
        },
        {
            _id: 88,
            mname: "Salary Report",
            sequence: 69,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salaryReport"
        },
        {
            _id: 70,
            mname: "Vacation",
            sequence: 70,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Vacation"
        },
        {
            _id: 71,
            mname: "Attendance",
            sequence: 71,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Attendance"
        },
        {
            _id: 76,
            mname: "Efficiency",
            sequence: 72,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Efficiency"
        },
        {
            _id: 72,
            mname: "Bonus Type",
            sequence: 73,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "bonusType"
        },
        {
            _id: 74,
            mname: "HrDashboard",
            sequence: 74,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "HrDashboard"
        },
        {
            _id: 66,
            mname: "Payroll Expenses",
            sequence: 77,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "PayrollExpenses"
        },
        {
            _id: 78,
            mname: "Payroll",
            sequence: 78,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Payroll"
        },
        {
            _id: 79,
            mname: "Payroll Payments",
            sequence: 79,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "PayrollPayments"
        },
        {
            _id: 82,
            mname: "Invoice Aging",
            sequence: 82,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "invoiceAging"
        },
        {
            _id: 83,
            mname: "Chart Of Account",
            sequence: 83,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "ChartOfAccount"
        },
        {
            _id: 100,
            mname: "Inventory Report",
            sequence: 83,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "inventoryReport"
        },
        {
            _id: 85,
            mname: "Journal",
            sequence: 85,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "journal"
        },
        {
            _id: 86,
            mname: "Journal Entry",
            sequence: 86,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "journalEntry"
        },
        {
            _id: 87,
            mname: "Invoice Charts",
            sequence: 87,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "invoiceCharts"
        },
        {
            _id: 89,
            mname: "Trial Balance",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "trialBalance"
        },
        {
            _id: 91,
            mname: "Profit And Loss",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "profitAndLoss"
        },
        {
            _id: 92,
            mname: "Balance Sheet",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "balanceSheet"
        },
        {
            _id: 93,
            mname: "Cash Flow",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "cashFlow"
        },
        {
            _id: 94,
            mname: "Close Month",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "closeMonth"
        },
        {
            _id: 96,
            mname: "Expenses",
            sequence: 96,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Expenses"
        },
        {
            _id: 97,
            mname: "Invoice",
            sequence: 97,
            parrent: 96,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "ExpensesInvoice"
        },
        {
            _id: 98,
            mname: "Expenses Payments",
            sequence: 98,
            parrent: 96,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "ExpensesPayments"
        },
        {
            _id: 101,
            mname: "Dividend declaration",
            sequence: 101,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "DividendInvoice"
        },
        {
            _id: 102,
            mname: "Dividend payment",
            sequence: 101,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "DividendPayments"
        },
        {
            _id: 103,
            link: true,
            mname: "Employee",
            parrent: 1,
            sequence: 103,
            visible: true,
            ancestors: [ ],
            href: "settingsEmployee"
        },
        {
            _id: 1,
            __v: 0,
            attachments: [ ],
            link: false,
            mname: "Settings",
            parrent: null,
            sequence: 1000,
            visible: true,
            ancestors: [ ],
            href: "Settings"
        },
        {
            _id: 75,
            mname: "tCard",
            sequence: 1000,
            parrent: 36,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "wTrack"
        },
        {
            _id: 84,
            mname: "Product Categories",
            sequence: 1000,
            parrent: 1,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "productSettings"
        }
    ];
    var fakeDividendDeclaration = [
        {
            _id: "5742f26e7afe352f10c11c3d",
            _type: "dividendInvoice",
            dueDate: "2016-06-05T21:00:00.000Z",
            approved: false,
            removable: true,
            editedBy: {
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
                    lastAccess: "2016-05-23T09:57:39.014Z",
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
                        },
                        {
                            _id: "56f3d039c1785edc507e81ea",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5708ca211d118cb6401008cc",
                            viewType: "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy: {
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
                    lastAccess: "2016-05-23T09:57:39.014Z",
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
                        },
                        {
                            _id: "56f3d039c1785edc507e81ea",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5708ca211d118cb6401008cc",
                            viewType: "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow: {
                _id: "55647d982e4aa3804a765ecb",
                sequence: 2,
                status: "Done",
                name: "Paid",
                wId: "Sales Invoice",
                color: "#2C3E50",
                __v: 0,
                source: "purchase",
                targetSource: [
                    "invoice"
                ],
                wName: "invoice",
                visible: true
            },
            payments: [
                "5742f2d07afe352f10c11c3e"
            ],
            paymentInfo: {
                total: 0,
                balance: -250000,
                unTaxed: 0,
                taxes: 0,
            },
            currency: {
                _id: "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2016-05-22T21:00:00.000Z",
            forSales: false,
            name: "DD1",
            paymentDate: "2016-05-22T21:00:00.000Z",
            paid: 2500
        }
    ];

    var view;
    var topBarView;
    var listView;
    var dividendCollection;

    describe('SettingsEmployee', function () {

        var $fixture;
        var $elFixture;
        before(function(){

        });

        after(function () {
            view.remove();
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
                view = new MainView({el: $elFixture, contentType: 'DividendInvoice'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="101"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="101"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/DividendInvoice');
            });

        });

        describe('TopBarView', function () {
            var server;
            var mainSpy;

            before(function(){
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function(){
                server.restore();
                mainSpy.restore();
            });

            it('Try to fetch collection with error', function(){
                var dividendUrl = new RegExp('\/Invoice\/list', 'i');

                server.respondWith('GET', dividendUrl, [401, {"Content-Type": "application/json"}, JSON.stringify({})]);
                dividendCollection = new DividendCollection({});
                server.respond();
            });

            it('Try to create TopBarView', function(){
                var dividendUrl = new RegExp('\/Invoice\/list', 'i');
                var dividendTotalUrl = new RegExp('\/Invoice\/totalCollectionLength');

                server.respondWith('GET', dividendUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDividendDeclaration)]);
                server.respondWith('GET', dividendTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                    count: 1
                })]);
                dividendCollection = new DividendCollection({});
                server.respond();

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: dividendCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Dividend declaration');
            });
        });

        describe('CloseMonthView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var windowConfirmStub;
            var deleteScheduleSpy;
            var deletePayrollSpy;
            var alertStub;

            before(function () {
                App.startPreload = function() {
                    App.preloaderShowFlag = true;
                    $('#loading').show();
                };

                App.stopPreload = function() {
                    App.preloaderShowFlag = false;
                    $('#loading').hide();
                };

                App.currentDb = 'michelDb';

                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                alertStub.restore();
            });

            describe('INITIALIZE', function () {

                /*it('Try to create dividendDeclarationListView', function (done) {
                    var dividendUrl = new RegExp('\/Invoice\/list', 'i');
                    var dividendTotalUrl = new RegExp('\/Invoice\/totalCollectionLength');

                    server.respondWith('GET', dividendUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDividendDeclaration)]);
                    server.respondWith('GET', dividendTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 1
                    })]);
                    listView = new ListView({
                        startTime: new Date(),
                        collection: dividendCollection
                    });
                    server.respond();
                    server.respond();
                    clock.tick(300);

                    $thisEl = listView.$el;

                    expect($thisEl.find('#listTable')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(1);

                    done();
                });*/

                /*it('Try to go to EditDialog', function(){
                    var $needTd = $thisEl.find('#weeklyScheduler tr:nth-child(1) > td:nth-child(2)');

                    $needTd.click();
                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to edit item', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#weeklySchedulerName > input');
                    var $mondayInput = $dialog.find('td[data-content="1"] > input');
                    var $saveBtn = $dialog.find('#create-weeklyScheduler-dialog');
                    var keyUpEvent = $.Event('keyup');
                    var scheduleUrl = new RegExp('weeklyScheduler\/', 'i');
                    var weekScheduleUrl = new RegExp('\/weeklyScheduler\/list', 'i');
                    var spyResponse;

                    $nameInput.val('');
                    $mondayInput.val('3');
                    $mondayInput.trigger(keyUpEvent);

                    //save with empty name
                    $saveBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');

                    //save with hours > 24
                    $nameInput.val('Test');
                    $mondayInput.val('25');
                    $saveBtn.click();
                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'hours should be in 0-24 range');

                    //save with error response
                    $mondayInput.val('3');
                    server.respondWith('PATCH', scheduleUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    server.respondWith('GET', weekScheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSchedule)]);
                    server.respondWith('PATCH', scheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"1":8,"2":8,"3":8,"4":8,"5":8,"6":0,"7":0,"_id":"57332c3b94ee1140b6bb49e2","totalHours":40,"name":"UA-40"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try cancel EditDialog', function(){
                    var $needTd = $thisEl.find('#weeklyScheduler tr:nth-child(1) > td:nth-child(2)');
                    var $cancelBtn;

                    $needTd.click();
                    expect($('.ui-dialog')).to.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to delete schedule item', function(){
                    var $deleteBtn = $thisEl.find('.fa-trash-o').eq(1);
                    var scheduleUrl = new RegExp('\/weeklyScheduler\/', 'i');

                    server.respondWith('DELETE', scheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"1":4,"2":4,"3":4,"4":4,"5":4,"6":0,"7":0,"_id":"573add0245310a4662c8005b","__v":0,"totalHours":20,"name":"UA-20"})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteScheduleSpy.calledOnce).to.be.true;
                });

                it('Try to create schedule item', function(){
                    mainSpy.reset();

                    var $createBtn = $thisEl.find('#weeklyScheduler .fa-plus');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.exist;

                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#weeklySchedulerName > input');
                    var $mondayInput = $dialog.find('td[data-content="1"] > input');
                    var $saveBtn = $dialog.find('#create-weeklyScheduler-dialog');
                    var keyUpEvent = $.Event('keyup');
                    var scheduleUrl = 'weeklyScheduler';
                    var weekScheduleUrl = new RegExp('\/weeklyScheduler\/list', 'i');
                    var spyResponse;

                    $nameInput.val('');
                    $mondayInput.val('3');
                    $mondayInput.trigger(keyUpEvent);

                    //save with empty name
                    $saveBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');

                    //save with hours > 24
                    $nameInput.val('Test');
                    $mondayInput.val('25');
                    $saveBtn.click();
                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'hours should be in 0-24 range');

                    $mondayInput.val('3');
                    server.respondWith('GET', weekScheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSchedule)]);
                    server.respondWith('POST', scheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"__v":0,"_id":"573f35b5a7312792307f9e50","totalHours":0,"name":"sf"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try cancel CreateDialog', function(){
                    var $createBtn = $thisEl.find('#weeklyScheduler .fa-plus');
                    var $cancelBtn;

                    $createBtn.click();
                    expect($('.ui-dialog')).to.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                // payRollEarning views testing
                it('Try to go to EditDialog', function(){
                    var $needTd = $thisEl.find('#listTableearnings > tr:nth-child(1) > td:nth-child(2)');

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save payroll earning with empty name', function(){
                    mainSpy.reset();

                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $nameInput.val('');
                    $saveBtn.click();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try to save model with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('\/payrollComponentTypes\/', 'i');

                    $nameInput.val('Test');

                    server.respondWith('PATCH', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save model with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEarning)]);
                    server.respondWith('PATCH', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"_id":"573edafcf9281fb40d5db50a","__v":0,"description":"fff","type":"earnings","name":"ffff"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel EditDialog', function(){
                    var $needTd = $thisEl.find('#listTableearnings > tr:nth-child(1) > td:nth-child(2)');
                    var $cancelBtn;

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to remove Payroll earning type item', function(){
                    var $deleteBtn = $thisEl.find('#earningType .fa-trash-o');
                    var deleteUrl = new RegExp('\/payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEarning)]);
                    server.respondWith('DELETE', deleteUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        _id: "573edafcf9281fb40d5db50a",
                        __v: 0,
                        description: "fff",
                        type: "earnings",
                        name: "fff"
                    })]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect(deletePayrollSpy.calledOnce).to.be.true;
                });

                it('Try to open CreateDialog', function(){
                    var $createBtn = $thisEl.find('#earningType #top-bar-createBtn');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to create PayRollEarning Type item with empty name', function(){
                    mainSpy.reset();

                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $createBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try create item with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('\/payrollComponentTypes', 'i');

                    $nameInput.val('Test');

                    server.respondWith('POST', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $createBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to create item with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('payrollComponentTypes', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEarning)]);
                    server.respondWith('POST', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"__v":0,"_id":"5742ecdf7afe352f10c11c3a","description":"Test test","type":"earnings","name":"TestName"})]);
                    $createBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel CreateDialog', function(){
                    var $createBtn = $thisEl.find('#earningType #top-bar-createBtn');
                    var $cancelBtn;

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();
                    expect($('.ui-dialog')).to.not.exist;
                });

                // payRollDeduction views testing
                it('Try to go to EditDialog', function(){
                    var $needTd = $thisEl.find('#listTabledeductions > tr:nth-child(1) > td:nth-child(2)');

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save payroll deduction with empty name', function(){
                    mainSpy.reset();

                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $nameInput.val('');
                    $saveBtn.click();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try to save model with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('\/payrollComponentTypes\/', 'i');

                    $nameInput.val('Test');

                    server.respondWith('PATCH', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    //expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save model with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=deductions';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDeductions)]);
                    server.respondWith('PATCH', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"_id":"5742ee217afe352f10c11c3b","__v":0,"description":"asdsd","type":"deductions","name":"sdsa"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel EditDialog', function(){
                    var $needTd = $thisEl.find('#listTabledeductions > tr:nth-child(1) > td:nth-child(2)');
                    var $cancelBtn;

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to remove Payroll deduction type item', function(){
                    var $deleteBtn = $thisEl.find('#deductionType .fa-trash-o');
                    var deleteUrl = new RegExp('\/payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDeductions)]);
                    server.respondWith('DELETE', deleteUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"_id":"5742ee217afe352f10c11c3b","__v":0,"description":"asdsd","type":"deductions","name":"sdsa"})]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect(deletePayrollSpy.calledTwice).to.be.true;
                });

                it('Try to open CreateDialog', function(){
                    var $createBtn = $thisEl.find('#deductionType #top-bar-createBtn');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to create PayRollDeduction Type item with empty name', function(){
                    mainSpy.reset();

                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $createBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try create item with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('\/payrollComponentTypes\/', 'i');

                    $nameInput.val('Test');

                    server.respondWith('POST', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $createBtn.click();
                    server.respond();

                    //expect($('.ui-dialog')).to.be.exist;
                });


                it('Try to create item with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('payrollComponentTypes', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=deductions';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDeductions)]);
                    server.respondWith('POST', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"__v":0,"_id":"5742ef4d7afe352f10c11c3c","description":"Test","type":"deductions","name":"TestName"})]);
                    $createBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel CreateDialog', function(){
                    var $createBtn = $thisEl.find('#deductionType #top-bar-createBtn');
                    var $cancelBtn;

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();
                    expect($('.ui-dialog')).to.not.exist;
                });*/
            });
        });
    });
});