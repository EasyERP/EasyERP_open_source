define([
    'text!fixtures/index.html',
    'collections/salesProforma/filterCollection',
    'views/main/MainView',
    'views/salesProforma/list/ListView',
    'views/salesProforma/TopBarView',
    'views/Filter/FilterView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (fixtures, ProformaCollection, MainView, ListView, TopBarView, FilterView, $, chai, chaiJquery, sinonChai) {
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
    var fakeProformas = [
        {
            _id: "570f8d09a2489b5b7ba831cb",
            _type: "Proforma",
            project: {
                _id: "562beda846bca6e4591f4930",
                StartDate: null,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "566424cd08ed794128637c23"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-05-05T13:29:43.413Z",
                    user: "563f673270bbc2b740ce89ae"
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
                workflow: "528ce82df3f67bc40b000025",
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: null,
                customer: "562bed4062461bfd59ef58d1",
                task: [ ],
                projectName: "TreatMe",
                projectShortDesc: "Uber-like app",
                __v: 0,
                EndDate: null,
                TargetEndDate: "",
                description: "",
                salesmanager: "55b92ad221e4b7c40f00004a"
            },
            approved: false,
            removable: true,
            editedBy: {
                user: {
                    _id: "563f673270bbc2b740ce89ae",
                    profile: 1387275598000,
                    savedFilters: [
                        {
                            _id: "564f2dabe91e851912a2024c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "564f2dc4e91e851912a2024d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56573baebfd103f108eb4abb",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56574882bfd103f108eb4af6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565853f7bfd103f108eb4b42",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565bf2a1a9a4e40204299eb3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5662dfacf13e46fd14535337",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "569e3c58044ae38173244cfc",
                            viewType: "",
                            byDefault: "Dashboard"
                        },
                        {
                            _id: "56b117f55b84a7c8083d1c92",
                            viewType: "",
                            byDefault: "salaryReport"
                        },
                        {
                            _id: "56c0b323199ed6e66578f123",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id: "56d853618230197c0e089039",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id: "56f2490ff5b5bf6750f5916a",
                            viewType: "",
                            byDefault: "jobsDashboard"
                        },
                        {
                            _id: "570b7dcd25a185a8548d7d6a",
                            viewType: "",
                            byDefault: "Projects"
                        }
                    ],
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
                    pass: "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                    email: "info@thinkmobiles.com",
                    login: "alex.sokhanych",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    __v: 0,
                    lastAccess: "2016-05-05T15:23:35.898Z",
                    relatedEmployee: null
                }
            },
            createdBy: {
                user: {
                    _id: "563f673270bbc2b740ce89ae",
                    profile: 1387275598000,
                    savedFilters: [
                        {
                            _id: "564f2dabe91e851912a2024c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "564f2dc4e91e851912a2024d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56573baebfd103f108eb4abb",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56574882bfd103f108eb4af6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565853f7bfd103f108eb4b42",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565bf2a1a9a4e40204299eb3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5662dfacf13e46fd14535337",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "569e3c58044ae38173244cfc",
                            viewType: "",
                            byDefault: "Dashboard"
                        },
                        {
                            _id: "56b117f55b84a7c8083d1c92",
                            viewType: "",
                            byDefault: "salaryReport"
                        },
                        {
                            _id: "56c0b323199ed6e66578f123",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id: "56d853618230197c0e089039",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id: "56f2490ff5b5bf6750f5916a",
                            viewType: "",
                            byDefault: "jobsDashboard"
                        },
                        {
                            _id: "570b7dcd25a185a8548d7d6a",
                            viewType: "",
                            byDefault: "Projects"
                        }
                    ],
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
                    pass: "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                    email: "info@thinkmobiles.com",
                    login: "alex.sokhanych",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    __v: 0,
                    lastAccess: "2016-05-05T15:23:35.898Z",
                    relatedEmployee: null
                }
            },
            workflow: {
                _id: "56fabcf0e71823e438e4e1ca",
                sequence: 3,
                status: "Done",
                name: "Invoiced",
                wId: "Proforma",
                visible: true,
                __v: 0
            },
            payments: [
                "570f8d45983b1a8e4f9bbfb1"
            ],
            paymentInfo: {
                total: 700000,
                unTaxed: 700000,
                balance: 0,
                taxes: 0
            },
            currency: {
                _id: "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2015-10-28T04:00:00.000Z",
            sourceDocument: {
                _id: "570f8cf76f3bd57c48cdb091",
                editedBy: {
                    date: "2016-05-05T13:28:59.766Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    user: "563f673270bbc2b740ce89ae",
                    date: "2016-04-14T12:28:39.744Z"
                },
                creationDate: "2016-04-14T12:28:39.744Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: "55647b962e4aa3804a765ec6",
                products: [
                    {
                        scheduledDate: "",
                        jobs: "566424cd08ed794128637c23",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        unitPrice: 1670000,
                        subTotal: 1670000,
                        taxes: null,
                        quantity: 4458
                    }
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 1670000,
                    total: 1670000
                },
                paymentTerm: null,
                invoiceRecived: false,
                invoiceControl: null,
                incoterm: null,
                destination: null,
                name: "PO970",
                expectedDate: "2015-10-10T22:00:00.000Z",
                orderDate: "2015-10-10T22:00:00.000Z",
                deliverTo: "55543831d51bdef79ea0d58c",
                project: "562beda846bca6e4591f4930",
                supplier: "562bed4062461bfd59ef58d1",
                isOrder: true,
                type: "Not Invoiced",
                forSales: true,
                currency: {
                    _id: "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                __v: 0,
                attachments: [
                    {
                        uploaderName: "alex.sokhanych",
                        uploadDate: "2016-05-05T13:28:59.685Z",
                        size: "0.175&nbsp;Mb",
                        shortPas: "..%2Froutes%2Fuploads%2F570f8cf76f3bd57c48cdb091%2Fnot%20correct%20invoice.pdf",
                        name: "not correct invoice.pdf",
                        _id: "572b4a9bbb0c85d606b23d93"
                    }
                ]
            },
            supplier: {
                _id: "562bed4062461bfd59ef58d1",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-10-24T20:42:40.705Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-10-24T20:42:40.705Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [ ],
                attachments: [ ],
                notes: [ ],
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [ ],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
                    zip: "",
                    state: "California",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "TreatMe"
                },
                isOwn: false,
                type: "Company",
                __v: 0
            },
            forSales: true,
            name: "PO970",
            dueDate: "2015-11-11T04:00:00.000Z",
            paymentDate: "2015-11-04T04:00:00.000Z",
            paid: 7000,
            salesPerson: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    "2016-03-14T22:00:00.000Z"
                ],
                hire: [
                    "2014-05-25T21:00:00.000Z"
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Select",
                gender: "male",
                marital: "married",
                contractEnd: {
                    reason: "Fired",
                    date: "2016-03-14T22:00:00.000Z"
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-04-04T15:36:05.882Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
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
                age: 28,
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
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
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
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: false,
                __v: 0,
                lastFire: 201611,
                transfer: [
                    {
                        date: "2014-05-26T01:00:00.000Z",
                        isDeveloper: true,
                        info: "",
                        salary: 600,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "hired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date: "2014-08-01T01:00:00.000Z",
                        isDeveloper: true,
                        info: "плюс %",
                        salary: 450,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date: "2016-03-15T02:00:00.000Z",
                        isDeveloper: true,
                        info: "Fired",
                        salary: 450,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "fired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    }
                ],
                weeklyScheduler: "57332c3b94ee1140b6bb49e2"
            }
        },
        {
            _id: "570f8d4d983b1a8e4f9bbfb3",
            _type: "Proforma",
            project: {
                _id: "562beda846bca6e4591f4930",
                StartDate: null,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "566424cd08ed794128637c23"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-05-05T13:29:43.413Z",
                    user: "563f673270bbc2b740ce89ae"
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
                workflow: "528ce82df3f67bc40b000025",
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: null,
                customer: "562bed4062461bfd59ef58d1",
                task: [ ],
                projectName: "TreatMe",
                projectShortDesc: "Uber-like app",
                __v: 0,
                EndDate: null,
                TargetEndDate: "",
                description: "",
                salesmanager: "55b92ad221e4b7c40f00004a"
            },
            approved: false,
            removable: true,
            editedBy: {
                user: {
                    _id: "563f673270bbc2b740ce89ae",
                    profile: 1387275598000,
                    savedFilters: [
                        {
                            _id: "564f2dabe91e851912a2024c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "564f2dc4e91e851912a2024d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56573baebfd103f108eb4abb",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56574882bfd103f108eb4af6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565853f7bfd103f108eb4b42",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565bf2a1a9a4e40204299eb3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5662dfacf13e46fd14535337",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "569e3c58044ae38173244cfc",
                            viewType: "",
                            byDefault: "Dashboard"
                        },
                        {
                            _id: "56b117f55b84a7c8083d1c92",
                            viewType: "",
                            byDefault: "salaryReport"
                        },
                        {
                            _id: "56c0b323199ed6e66578f123",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id: "56d853618230197c0e089039",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id: "56f2490ff5b5bf6750f5916a",
                            viewType: "",
                            byDefault: "jobsDashboard"
                        },
                        {
                            _id: "570b7dcd25a185a8548d7d6a",
                            viewType: "",
                            byDefault: "Projects"
                        }
                    ],
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
                    pass: "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                    email: "info@thinkmobiles.com",
                    login: "alex.sokhanych",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    __v: 0,
                    lastAccess: "2016-05-05T15:23:35.898Z",
                    relatedEmployee: null
                }
            },
            createdBy: {
                user: {
                    _id: "563f673270bbc2b740ce89ae",
                    profile: 1387275598000,
                    savedFilters: [
                        {
                            _id: "564f2dabe91e851912a2024c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "564f2dc4e91e851912a2024d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56573baebfd103f108eb4abb",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56574882bfd103f108eb4af6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565853f7bfd103f108eb4b42",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565bf2a1a9a4e40204299eb3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5662dfacf13e46fd14535337",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "569e3c58044ae38173244cfc",
                            viewType: "",
                            byDefault: "Dashboard"
                        },
                        {
                            _id: "56b117f55b84a7c8083d1c92",
                            viewType: "",
                            byDefault: "salaryReport"
                        },
                        {
                            _id: "56c0b323199ed6e66578f123",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id: "56d853618230197c0e089039",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id: "56f2490ff5b5bf6750f5916a",
                            viewType: "",
                            byDefault: "jobsDashboard"
                        },
                        {
                            _id: "570b7dcd25a185a8548d7d6a",
                            viewType: "",
                            byDefault: "Projects"
                        }
                    ],
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
                    pass: "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                    email: "info@thinkmobiles.com",
                    login: "alex.sokhanych",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    __v: 0,
                    lastAccess: "2016-05-05T15:23:35.898Z",
                    relatedEmployee: null
                }
            },
            workflow: {
                _id: "56fabcf0e71823e438e4e1ca",
                sequence: 3,
                status: "Done",
                name: "Invoiced",
                wId: "Proforma",
                visible: true,
                __v: 0
            },
            payments: [
                "570f8d9ca2489b5b7ba831cc"
            ],
            paymentInfo: {
                total: 400000,
                unTaxed: 400000,
                balance: 0,
                taxes: 0
            },
            currency: {
                _id: "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2015-11-19T04:00:00.000Z",
            sourceDocument: {
                _id: "570f8cf76f3bd57c48cdb091",
                editedBy: {
                    date: "2016-05-05T13:28:59.766Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    user: "563f673270bbc2b740ce89ae",
                    date: "2016-04-14T12:28:39.744Z"
                },
                creationDate: "2016-04-14T12:28:39.744Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: "55647b962e4aa3804a765ec6",
                products: [
                    {
                        scheduledDate: "",
                        jobs: "566424cd08ed794128637c23",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        unitPrice: 1670000,
                        subTotal: 1670000,
                        taxes: null,
                        quantity: 4458
                    }
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 1670000,
                    total: 1670000
                },
                paymentTerm: null,
                invoiceRecived: false,
                invoiceControl: null,
                incoterm: null,
                destination: null,
                name: "PO970",
                expectedDate: "2015-10-10T22:00:00.000Z",
                orderDate: "2015-10-10T22:00:00.000Z",
                deliverTo: "55543831d51bdef79ea0d58c",
                project: "562beda846bca6e4591f4930",
                supplier: "562bed4062461bfd59ef58d1",
                isOrder: true,
                type: "Not Invoiced",
                forSales: true,
                currency: {
                    _id: "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                __v: 0,
                attachments: [
                    {
                        uploaderName: "alex.sokhanych",
                        uploadDate: "2016-05-05T13:28:59.685Z",
                        size: "0.175&nbsp;Mb",
                        shortPas: "..%2Froutes%2Fuploads%2F570f8cf76f3bd57c48cdb091%2Fnot%20correct%20invoice.pdf",
                        name: "not correct invoice.pdf",
                        _id: "572b4a9bbb0c85d606b23d93"
                    }
                ]
            },
            supplier: {
                _id: "562bed4062461bfd59ef58d1",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-10-24T20:42:40.705Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-10-24T20:42:40.705Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [ ],
                attachments: [ ],
                notes: [ ],
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [ ],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
                    zip: "",
                    state: "California",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "TreatMe"
                },
                isOwn: false,
                type: "Company",
                __v: 0
            },
            forSales: true,
            name: "PO970",
            dueDate: "2015-12-03T04:00:00.000Z",
            paymentDate: "2015-11-29T04:00:00.000Z",
            paid: 4000,
            salesPerson: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    "2016-03-14T22:00:00.000Z"
                ],
                hire: [
                    "2014-05-25T21:00:00.000Z"
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Select",
                gender: "male",
                marital: "married",
                contractEnd: {
                    reason: "Fired",
                    date: "2016-03-14T22:00:00.000Z"
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-04-04T15:36:05.882Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
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
                age: 28,
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
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
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
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: false,
                __v: 0,
                lastFire: 201611,
                transfer: [
                    {
                        date: "2014-05-26T01:00:00.000Z",
                        isDeveloper: true,
                        info: "",
                        salary: 600,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "hired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date: "2014-08-01T01:00:00.000Z",
                        isDeveloper: true,
                        info: "плюс %",
                        salary: 450,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date: "2016-03-15T02:00:00.000Z",
                        isDeveloper: true,
                        info: "Fired",
                        salary: 450,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "fired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    }
                ],
                weeklyScheduler: "57332c3b94ee1140b6bb49e2"
            }
        },
        {
            _id: "570f8db56f3bd57c48cdb093",
            _type: "Proforma",
            project: {
                _id: "562beda846bca6e4591f4930",
                StartDate: null,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "566424cd08ed794128637c23"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-05-05T13:29:43.413Z",
                    user: "563f673270bbc2b740ce89ae"
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
                workflow: "528ce82df3f67bc40b000025",
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: null,
                customer: "562bed4062461bfd59ef58d1",
                task: [ ],
                projectName: "TreatMe",
                projectShortDesc: "Uber-like app",
                __v: 0,
                EndDate: null,
                TargetEndDate: "",
                description: "",
                salesmanager: "55b92ad221e4b7c40f00004a"
            },
            approved: false,
            removable: true,
            editedBy: {
                user: {
                    _id: "563f673270bbc2b740ce89ae",
                    profile: 1387275598000,
                    savedFilters: [
                        {
                            _id: "564f2dabe91e851912a2024c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "564f2dc4e91e851912a2024d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56573baebfd103f108eb4abb",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56574882bfd103f108eb4af6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565853f7bfd103f108eb4b42",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565bf2a1a9a4e40204299eb3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5662dfacf13e46fd14535337",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "569e3c58044ae38173244cfc",
                            viewType: "",
                            byDefault: "Dashboard"
                        },
                        {
                            _id: "56b117f55b84a7c8083d1c92",
                            viewType: "",
                            byDefault: "salaryReport"
                        },
                        {
                            _id: "56c0b323199ed6e66578f123",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id: "56d853618230197c0e089039",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id: "56f2490ff5b5bf6750f5916a",
                            viewType: "",
                            byDefault: "jobsDashboard"
                        },
                        {
                            _id: "570b7dcd25a185a8548d7d6a",
                            viewType: "",
                            byDefault: "Projects"
                        }
                    ],
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
                    pass: "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                    email: "info@thinkmobiles.com",
                    login: "alex.sokhanych",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    __v: 0,
                    lastAccess: "2016-05-05T15:23:35.898Z",
                    relatedEmployee: null
                }
            },
            createdBy: {
                user: {
                    _id: "563f673270bbc2b740ce89ae",
                    profile: 1387275598000,
                    savedFilters: [
                        {
                            _id: "564f2dabe91e851912a2024c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "564f2dc4e91e851912a2024d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56573baebfd103f108eb4abb",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56574882bfd103f108eb4af6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565853f7bfd103f108eb4b42",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "565bf2a1a9a4e40204299eb3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5662dfacf13e46fd14535337",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "569e3c58044ae38173244cfc",
                            viewType: "",
                            byDefault: "Dashboard"
                        },
                        {
                            _id: "56b117f55b84a7c8083d1c92",
                            viewType: "",
                            byDefault: "salaryReport"
                        },
                        {
                            _id: "56c0b323199ed6e66578f123",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id: "56d853618230197c0e089039",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id: "56f2490ff5b5bf6750f5916a",
                            viewType: "",
                            byDefault: "jobsDashboard"
                        },
                        {
                            _id: "570b7dcd25a185a8548d7d6a",
                            viewType: "",
                            byDefault: "Projects"
                        }
                    ],
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
                    pass: "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                    email: "info@thinkmobiles.com",
                    login: "alex.sokhanych",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    __v: 0,
                    lastAccess: "2016-05-05T15:23:35.898Z",
                    relatedEmployee: null
                }
            },
            workflow: {
                _id: "56fabcf0e71823e438e4e1ca",
                sequence: 3,
                status: "Done",
                name: "Invoiced",
                wId: "Proforma",
                visible: true,
                __v: 0
            },
            payments: [
                "570f8dd7f5eb71d05056effd"
            ],
            paymentInfo: {
                total: 570000,
                unTaxed: 570000,
                balance: 0,
                taxes: 0
            },
            currency: {
                _id: "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2016-01-26T04:00:00.000Z",
            sourceDocument: {
                _id: "570f8cf76f3bd57c48cdb091",
                editedBy: {
                    date: "2016-05-05T13:28:59.766Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    user: "563f673270bbc2b740ce89ae",
                    date: "2016-04-14T12:28:39.744Z"
                },
                creationDate: "2016-04-14T12:28:39.744Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: "55647b962e4aa3804a765ec6",
                products: [
                    {
                        scheduledDate: "",
                        jobs: "566424cd08ed794128637c23",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        unitPrice: 1670000,
                        subTotal: 1670000,
                        taxes: null,
                        quantity: 4458
                    }
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 1670000,
                    total: 1670000
                },
                paymentTerm: null,
                invoiceRecived: false,
                invoiceControl: null,
                incoterm: null,
                destination: null,
                name: "PO970",
                expectedDate: "2015-10-10T22:00:00.000Z",
                orderDate: "2015-10-10T22:00:00.000Z",
                deliverTo: "55543831d51bdef79ea0d58c",
                project: "562beda846bca6e4591f4930",
                supplier: "562bed4062461bfd59ef58d1",
                isOrder: true,
                type: "Not Invoiced",
                forSales: true,
                currency: {
                    _id: "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                __v: 0,
                attachments: [
                    {
                        uploaderName: "alex.sokhanych",
                        uploadDate: "2016-05-05T13:28:59.685Z",
                        size: "0.175&nbsp;Mb",
                        shortPas: "..%2Froutes%2Fuploads%2F570f8cf76f3bd57c48cdb091%2Fnot%20correct%20invoice.pdf",
                        name: "not correct invoice.pdf",
                        _id: "572b4a9bbb0c85d606b23d93"
                    }
                ]
            },
            supplier: {
                _id: "562bed4062461bfd59ef58d1",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-10-24T20:42:40.705Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-10-24T20:42:40.705Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [ ],
                attachments: [ ],
                notes: [ ],
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [ ],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
                    zip: "",
                    state: "California",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "TreatMe"
                },
                isOwn: false,
                type: "Company",
                __v: 0
            },
            forSales: true,
            name: "PO970",
            dueDate: "2016-01-28T00:00:00.000Z",
            paymentDate: "2016-01-27T04:00:00.000Z",
            paid: 5700,
            salesPerson: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    "2016-03-14T22:00:00.000Z"
                ],
                hire: [
                    "2014-05-25T21:00:00.000Z"
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Select",
                gender: "male",
                marital: "married",
                contractEnd: {
                    reason: "Fired",
                    date: "2016-03-14T22:00:00.000Z"
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-04-04T15:36:05.882Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
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
                age: 28,
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
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
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
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: false,
                __v: 0,
                lastFire: 201611,
                transfer: [
                    {
                        date: "2014-05-26T01:00:00.000Z",
                        isDeveloper: true,
                        info: "",
                        salary: 600,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "hired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date: "2014-08-01T01:00:00.000Z",
                        isDeveloper: true,
                        info: "плюс %",
                        salary: 450,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date: "2016-03-15T02:00:00.000Z",
                        isDeveloper: true,
                        info: "Fired",
                        salary: 450,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "fired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    }
                ],
                weeklyScheduler: "57332c3b94ee1140b6bb49e2"
            }
        }
    ];
    var fakeInvoiceById = {
        _id: "570f8d09a2489b5b7ba831cb",
        _type: "Proforma",
        project: {
            _id: "562beda846bca6e4591f4930"
        },
        products: [
            {
                unitPrice: 700000,
                subTotal: 700000,
                taxes: 0,
                jobs: {
                    _id: "566424cd08ed794128637c23",
                    invoice: "572b4a9c35b6dafc05d3bce9",
                    quotation: "570f8cf76f3bd57c48cdb091",
                    budget: {
                        budgetTotal: {
                            minDate: 201543,
                            maxDate: 201610,
                            hoursSum: 4458,
                            revenueSum: 1669999.9999999998,
                            costSum: 15043
                        },
                        projectTeam: [
                            {
                                budget: {
                                    hoursSum: 656,
                                    revenueSum: 245742.4854194706,
                                    costSum: 0
                                },
                                employee: {
                                    name: {
                                        first: "Ivan",
                                        last: "Grab"
                                    },
                                    jobPosition: {
                                        name: "Junior iOS",
                                        _id: "55b92acf21e4b7c40f00002c"
                                    },
                                    _id: "55b92ad221e4b7c40f00008e"
                                },
                                department: {
                                    departmentName: "iOS",
                                    _id: "55b92ace21e4b7c40f00000f"
                                }
                            },
                            {
                                budget: {
                                    hoursSum: 160,
                                    revenueSum: 59937.19156572453,
                                    costSum: 15043
                                },
                                employee: {
                                    name: {
                                        first: "Timur",
                                        last: "Berezhnoi"
                                    },
                                    jobPosition: {
                                        name: "Junior JS",
                                        _id: "55b92acf21e4b7c40f000017"
                                    },
                                    _id: "55c98df0cbb0f4910b000007"
                                },
                                department: {
                                    departmentName: "Web",
                                    _id: "55b92ace21e4b7c40f000016"
                                }
                            },
                            {
                                budget: {
                                    hoursSum: 564,
                                    revenueSum: 211278.60026917903,
                                    costSum: 0
                                },
                                employee: {
                                    name: {
                                        first: "Michael",
                                        last: "Vashkeba"
                                    },
                                    jobPosition: {
                                        name: "Junior JS",
                                        _id: "55b92acf21e4b7c40f000017"
                                    },
                                    _id: "55b92ad221e4b7c40f0000bd"
                                },
                                department: {
                                    departmentName: "Web",
                                    _id: "55b92ace21e4b7c40f000016"
                                }
                            },
                            {
                                budget: {
                                    hoursSum: 376,
                                    revenueSum: 140852.40017945267,
                                    costSum: 0
                                },
                                employee: {
                                    name: {
                                        first: "Sergiy",
                                        last: "Degtyar"
                                    },
                                    jobPosition: {
                                        name: "Junior iOS",
                                        _id: "55b92acf21e4b7c40f00002c"
                                    },
                                    _id: "55d1a2b18f61e2c90b000023"
                                },
                                department: {
                                    departmentName: "iOS",
                                    _id: "55b92ace21e4b7c40f00000f"
                                }
                            },
                            {
                                budget: {
                                    hoursSum: 248,
                                    revenueSum: 92902.64692687303,
                                    costSum: 0
                                },
                                employee: {
                                    name: {
                                        first: "Ishtvan",
                                        last: "Nazarovich"
                                    },
                                    jobPosition: {
                                        name: "Middle JS",
                                        _id: "55b92acf21e4b7c40f00001c"
                                    },
                                    _id: "55b92ad221e4b7c40f000034"
                                },
                                department: {
                                    departmentName: "Web",
                                    _id: "55b92ace21e4b7c40f000016"
                                }
                            },
                            {
                                budget: {
                                    hoursSum: 235,
                                    revenueSum: 88032.75011215793,
                                    costSum: 0
                                },
                                employee: {
                                    name: {
                                        first: "Liliya",
                                        last: "Orlenko"
                                    },
                                    jobPosition: {
                                        name: "Junior Designer",
                                        _id: "55b92acf21e4b7c40f000028"
                                    },
                                    _id: "564a0186ad4bc9e53f1f6193"
                                },
                                department: {
                                    departmentName: "Design",
                                    _id: "55bb1f14cb76ca630b000006"
                                }
                            },
                            {
                                budget: {
                                    hoursSum: 236,
                                    revenueSum: 88407.3575594437,
                                    costSum: 0
                                },
                                employee: {
                                    name: {
                                        first: "Valerii",
                                        last: "Ladomiryak"
                                    },
                                    jobPosition: {
                                        name: "CSS",
                                        _id: "55ddd8a2f09cc2ec0b000030"
                                    },
                                    _id: "561bb5329ebb48212ea838c6"
                                },
                                department: {
                                    departmentName: "CSS/FrontEnd",
                                    _id: "56802e9d1afe27f547b7ba51"
                                }
                            },
                            {
                                budget: {
                                    hoursSum: 560,
                                    revenueSum: 209780.1704800359,
                                    costSum: 0
                                },
                                employee: {
                                    name: {
                                        first: "Ivan",
                                        last: "Lyashenko"
                                    },
                                    jobPosition: {
                                        name: "Junior JS",
                                        _id: "55b92acf21e4b7c40f000017"
                                    },
                                    _id: "55b92ad221e4b7c40f0000aa"
                                },
                                department: {
                                    departmentName: "Web",
                                    _id: "55b92ace21e4b7c40f000016"
                                }
                            },
                            {
                                budget: {
                                    hoursSum: 784,
                                    revenueSum: 293692.23867205024,
                                    costSum: 0
                                },
                                employee: {
                                    name: {
                                        first: "Michael",
                                        last: "Glagola"
                                    },
                                    jobPosition: {
                                        name: "Middle iOS",
                                        _id: "55b92acf21e4b7c40f00001d"
                                    },
                                    _id: "55b92ad221e4b7c40f000076"
                                },
                                department: {
                                    departmentName: "iOS",
                                    _id: "55b92ace21e4b7c40f00000f"
                                }
                            },
                            {
                                budget: {
                                    hoursSum: 535,
                                    revenueSum: 200414.9842978914,
                                    costSum: 0
                                },
                                employee: {
                                    name: {
                                        first: "Oleg",
                                        last: "Stasiv"
                                    },
                                    jobPosition: {
                                        name: "Junior QA",
                                        _id: "55b92acf21e4b7c40f000018"
                                    },
                                    _id: "55b92ad221e4b7c40f00003c"
                                },
                                department: {
                                    departmentName: "QA",
                                    _id: "55b92ace21e4b7c40f000011"
                                }
                            },
                            {
                                budget: {
                                    hoursSum: 104,
                                    revenueSum: 38959.174517720945,
                                    costSum: 0
                                },
                                employee: {
                                    name: {
                                        first: "Yuriy",
                                        last: "Derevenko"
                                    },
                                    jobPosition: {
                                        name: "Junior JS",
                                        _id: "55b92acf21e4b7c40f000017"
                                    },
                                    _id: "55b92ad221e4b7c40f000054"
                                },
                                department: {
                                    departmentName: "Web",
                                    _id: "55b92ace21e4b7c40f000016"
                                }
                            }
                        ]
                    },
                    project: "562beda846bca6e4591f4930",
                    wTracks: [
                        "5707d4e83094378f405ed41e",
                        "5707c14b66ef2b474164f335",
                        "5707bc1d66ef2b474164f332",
                        "5703d107ed3f15af0782f19d",
                        "5703d107e7050b54043a69cc",
                        "5703d107c3a5da3e0347a496",
                        "5703d107b50d351f04817ca0",
                        "5703d10769c37d5903700b89",
                        "5703b935e7050b54043a69c0",
                        "5703b6a7ed3f15af0782f185",
                        "5703b621e7050b54043a69be",
                        "5703b3b6c3a5da3e0347a486",
                        "5703b34669c37d5903700b72",
                        "5703b134c3a5da3e0347a485",
                        "5703b0270bbb61c30355b54d",
                        "57035b00e7050b54043a6995",
                        "5702f0c3ec814f7c039b806b",
                        "5702bcfbed3f15af0782f15b",
                        "56e95f1d9c44f71b3c1b4157",
                        "56e7e772dae0bc904da269ad",
                        "56e7e61bdae0bc904da269ac",
                        "56e7e26e87b309154e4e448f",
                        "56e7e27ac64e96844ef3d6aa",
                        "56e67de7ef05acd9418dff33",
                        "5707c14b27a2fa52402a8db2",
                        "56e67dc881046d9741fb66f9",
                        "565d5f84f6427f253cf6be23",
                        "565d6309f6427f253cf6be3f",
                        "56e041777e101f9873feca2f",
                        "5702f220c3a5da3e0347a46b",
                        "564050a970bbc2b740ce89bd",
                        "562beeb9f9ccedb2591836e7",
                        "567d05328365c9a205406f44",
                        "563b8b0bab9698be7c9df70a",
                        "5707bc1d9bc121fe40812252",
                        "563b8b05ab9698be7c9df709",
                        "56e7e786dae0bc904da269ae",
                        "563b88f3ab9698be7c9df704",
                        "563b8bf0ab9698be7c9df70f",
                        "56e00e64f20b938426716710",
                        "563b8799ab9698be7c9df701",
                        "562bef58129820ab5994e8de",
                        "566427aa08ed794128637c27",
                        "5702eb79ec814f7c039b806a",
                        "562beefb84deb7cb59d61b7a",
                        "562beee7f9ccedb2591836e9",
                        "563b874fab9698be7c9df6ff",
                        "566057578a0c9ef2053e5249",
                        "562beec8f9ccedb2591836e8",
                        "563b8beaab9698be7c9df70e",
                        "5703b33169c37d5903700b71",
                        "56e2738f1f2850d361927dcd",
                        "56cc247b541812c07197355f",
                        "563b8647ab9698be7c9df6fa",
                        "563b88e5ab9698be7c9df702",
                        "562bef2cd2d9ab425a6dd075",
                        "56e00be8b2ba0d1b26c50c0c",
                        "5707d66e497452d7405810e5",
                        "562bef4346bca6e4591f4931",
                        "562beec2b4677e225aa31e0c",
                        "563b878fab9698be7c9df700",
                        "566427bf08ed794128637c28",
                        "562bef354a431b5a5a31120b",
                        "562beef462461bfd59ef58d2",
                        "5664281108ed794128637c2c",
                        "56c46ef6b81fd51e19207f67",
                        "563b8b3eab9698be7c9df70b",
                        "563b8bc6ab9698be7c9df70d",
                        "562beeedf9ccedb2591836ea",
                        "56e95efa5b2485993c163e23",
                        "562bee85129820ab5994e8dd",
                        "562bef3d62461bfd59ef58d3",
                        "563b860fab9698be7c9df6f9",
                        "5664281108ed794128637c2d",
                        "568110dbc699b1b24862bd5b",
                        "56405dd170bbc2b740ce89e6",
                        "562bef6ad2d9ab425a6dd076",
                        "563b8b9cab9698be7c9df70c",
                        "5703547ee7050b54043a6992",
                        "567d055c8365c9a205406f45",
                        "563b86a2ab9698be7c9df6fb",
                        "56d953758230197c0e08903c",
                        "563b86a9ab9698be7c9df6fc",
                        "566e828b8453e8b464b709ce",
                        "563b85ffab9698be7c9df6f8",
                        "563b86b7ab9698be7c9df6fd",
                        "56c474b7d2b48ede4ba421ee",
                        "5664278208ed794128637c26",
                        "567d05158365c9a205406f43",
                        "563b88edab9698be7c9df703",
                        "566427e108ed794128637c29",
                        "5664281108ed794128637c2a",
                        "5664281108ed794128637c2b",
                        "56e7e28349e358ee4d71399a",
                        "5664290a08ed794128637c2f",
                        "5664290a08ed794128637c30",
                        "569cafc6cf1f31f925c026f1",
                        "5664290a08ed794128637c31",
                        "570757fbac6351f52432f9fe",
                        "5664290a08ed794128637c32",
                        "56642ac708ed794128637c3c",
                        "5703b700ec814f7c039b8092",
                        "5664294608ed794128637c36",
                        "563b8a82ab9698be7c9df706",
                        "56642a4108ed794128637c37",
                        "5707e75f66ef2b474164f33a",
                        "56cac9915b5327a650b82dd7",
                        "56e00be8b2ba0d1b26c50c0e",
                        "563b8a07ab9698be7c9df705",
                        "568110e3c699b1b24862bd5e",
                        "56936350d87c9004552b6373",
                        "5707f091497452d7405810ec",
                        "5693640cd87c9004552b637c",
                        "569cb01ccf1f31f925c026f2",
                        "56e67df268e298b241985656",
                        "564050b070bbc2b740ce89c0",
                        "563b8ae5ab9698be7c9df707",
                        "56aa1f26b4dc0d09232bd7a0",
                        "56aa1f7eb4dc0d09232bd7a2",
                        "5702ee850bbb61c30355b52e",
                        "563b8afeab9698be7c9df708",
                        "56aa2ce6b4dc0d09232bd7ab",
                        "563b8bf6ab9698be7c9df710",
                        "56aa1f2eb4dc0d09232bd7a1",
                        "5664294608ed794128637c35",
                        "56b0bf2ad6ef38a708dfc299",
                        "56bc4a46cccd9a3d059f38b9",
                        "5703d107e7050b54043a69cd",
                        "56cac9c35b5327a650b82dd8",
                        "56d808d88df756130e1e9ca4",
                        "562bef7146bca6e4591f4932",
                        "56d81156ae35cc4f0e721071",
                        "56e67dd63d5bc25541857e30",
                        "56e00be8b2ba0d1b26c50c0a",
                        "56e00be8b2ba0d1b26c50c0d",
                        "56e273c21f2850d361927dce",
                        "56e00e5ef20b93842671670e",
                        "562bef7962461bfd59ef58d4",
                        "56e13efb21de3dfb527b9327",
                        "56e2737bf9e1c56461b971cd"
                    ],
                    type: "Invoiced",
                    workflow: "56337c675d49d8d6537832ea",
                    name: "Main sprint",
                    __v: 0,
                    payments: [
                        "56642edb08ed794128637c4a"
                    ],
                    editedBy: {
                        date: "2016-05-05T13:29:43.938Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        user: null,
                        date: "2015-11-09T07:52:09.421Z"
                    }
                },
                description: "",
                product: {
                    _id: "5540d528dacb551c24000003",
                    editedBy: {
                        date: "2015-10-30T14:18:42.379Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-04-29T12:57:12.785Z",
                        user: null
                    },
                    creationDate: "2015-04-29T12:57:12.785Z",
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: "560c099da5d4a2e20ba5068b"
                    },
                    whoCanRW: "everyOne",
                    workflow: null,
                    info: {
                        description: "",
                        barcode: "",
                        isActive: true,
                        salePrice: 0,
                        productType: "Service"
                    },
                    name: "IT services",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    canBePurchased: true,
                    eventSubscription: true,
                    canBeExpensed: true,
                    canBeSold: true,
                    __v: 0,
                    accounting: {
                        category: {
                            name: ""
                        }
                    }
                },
                quantity: 4644
            }
        ],
        approved: false,
        removable: true,
        invoiced: true,
        editedBy: {
            user: {
                _id: "563f673270bbc2b740ce89ae",
                profile: 1387275598000,
                savedFilters: [
                    {
                        _id: "564f2dabe91e851912a2024c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "564f2dc4e91e851912a2024d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56573baebfd103f108eb4abb",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56574882bfd103f108eb4af6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "565853f7bfd103f108eb4b42",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "565bf2a1a9a4e40204299eb3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5662dfacf13e46fd14535337",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "569e3c58044ae38173244cfc",
                        viewType: "",
                        byDefault: "Dashboard"
                    },
                    {
                        _id: "56b117f55b84a7c8083d1c92",
                        viewType: "",
                        byDefault: "salaryReport"
                    },
                    {
                        _id: "56c0b323199ed6e66578f123",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id: "56d853618230197c0e089039",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id: "56f2490ff5b5bf6750f5916a",
                        viewType: "",
                        byDefault: "jobsDashboard"
                    },
                    {
                        _id: "570b7dcd25a185a8548d7d6a",
                        viewType: "",
                        byDefault: "Projects"
                    }
                ],
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
                pass: "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                email: "info@thinkmobiles.com",
                login: "alex.sokhanych",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                __v: 0,
                lastAccess: "2016-05-05T15:23:35.898Z",
                relatedEmployee: null
            },
            date: "2016-04-14T12:29:34.637Z"
        },
        createdBy: {
            user: {
                _id: "563f673270bbc2b740ce89ae",
                profile: 1387275598000,
                savedFilters: [
                    {
                        _id: "564f2dabe91e851912a2024c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "564f2dc4e91e851912a2024d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56573baebfd103f108eb4abb",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56574882bfd103f108eb4af6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "565853f7bfd103f108eb4b42",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "565bf2a1a9a4e40204299eb3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5662dfacf13e46fd14535337",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "569e3c58044ae38173244cfc",
                        viewType: "",
                        byDefault: "Dashboard"
                    },
                    {
                        _id: "56b117f55b84a7c8083d1c92",
                        viewType: "",
                        byDefault: "salaryReport"
                    },
                    {
                        _id: "56c0b323199ed6e66578f123",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id: "56d853618230197c0e089039",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id: "56f2490ff5b5bf6750f5916a",
                        viewType: "",
                        byDefault: "jobsDashboard"
                    },
                    {
                        _id: "570b7dcd25a185a8548d7d6a",
                        viewType: "",
                        byDefault: "Projects"
                    }
                ],
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
                pass: "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                email: "info@thinkmobiles.com",
                login: "alex.sokhanych",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                __v: 0,
                lastAccess: "2016-05-05T15:23:35.898Z",
                relatedEmployee: null
            },
            date: "2016-04-14T12:28:39.744Z"
        },
        creationDate: "2016-04-14T12:28:39.744Z",
        groups: {
            owner: {
                _id: "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            },
            users: [ ],
            group: [ ]
        },
        whoCanRW: "everyOne",
        workflow: {
            _id: "56fabcf0e71823e438e4e1ca",
            status: "Done",
            name: "Invoiced"
        },
        payments: [
            {
                _id: "570f8d45983b1a8e4f9bbfb1",
                paymentRef: "",
                name: "PP_344",
                date: "2015-11-04T04:00:00.000Z",
                paidAmount: 700000
            }
        ],
        paymentInfo: {
            total: 700000,
            unTaxed: 700000,
            balance: 0,
            taxes: 0
        },
        paymentTerms: null,
        salesPerson: "55b92ad221e4b7c40f00004a",
        currency: {
            _id: {
                _id: "565eab29aeb95fa9c0f9df2d",
                name: "USD",
                sequence: 0
            },
            rate: 1
        },
        journal: "57035e4321f9b0c4313d4146",
        invoiceDate: "2015-10-28T04:00:00.000Z",
        paymentReference: "PO970",
        sourceDocument: {
            _id: "570f8cf76f3bd57c48cdb091",
            editedBy: {
                date: "2016-05-05T13:28:59.766Z",
                user: "563f673270bbc2b740ce89ae"
            },
            createdBy: {
                user: "563f673270bbc2b740ce89ae",
                date: "2016-04-14T12:28:39.744Z"
            },
            creationDate: "2016-04-14T12:28:39.744Z",
            groups: {
                group: [ ],
                users: [ ],
                owner: "560c099da5d4a2e20ba5068b"
            },
            whoCanRW: "everyOne",
            workflow: "55647b962e4aa3804a765ec6",
            products: [
                {
                    scheduledDate: "",
                    jobs: "566424cd08ed794128637c23",
                    description: "",
                    product: "5540d528dacb551c24000003",
                    unitPrice: 1670000,
                    subTotal: 1670000,
                    taxes: null,
                    quantity: 4458
                }
            ],
            paymentInfo: {
                taxes: 0,
                unTaxed: 1670000,
                total: 1670000
            },
            paymentTerm: null,
            invoiceRecived: false,
            invoiceControl: null,
            incoterm: null,
            destination: null,
            name: "PO970",
            expectedDate: "2015-10-10T22:00:00.000Z",
            orderDate: "2015-10-10T22:00:00.000Z",
            deliverTo: "55543831d51bdef79ea0d58c",
            project: "562beda846bca6e4591f4930",
            supplier: "562bed4062461bfd59ef58d1",
            isOrder: true,
            type: "Not Invoiced",
            forSales: true,
            currency: {
                _id: "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            __v: 0,
            attachments: [
                {
                    uploaderName: "alex.sokhanych",
                    uploadDate: "2016-05-05T13:28:59.685Z",
                    size: "0.175&nbsp;Mb",
                    shortPas: "..%2Froutes%2Fuploads%2F570f8cf76f3bd57c48cdb091%2Fnot%20correct%20invoice.pdf",
                    name: "not correct invoice.pdf",
                    _id: "572b4a9bbb0c85d606b23d93"
                }
            ]
        },
        supplier: {
            _id: "562bed4062461bfd59ef58d1",
            name: {
                last: "",
                first: "TreatMe"
            }
        },
        forSales: true,
        name: "PO970",
        __v: 0,
        dueDate: "2015-11-11T04:00:00.000Z",
        reconcile: true,
        attachments: [ ],
        paymentDate: "2015-11-04T04:00:00.000Z"
    };

    var view;
    var topBarView;
    var listView;
    var proformaCollection;

    describe('SalesProformaView', function () {

        var $fixture;
        var $elFixture;

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
                view = new MainView({el: $elFixture, contentType: 'salesProforma'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="99"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="99"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/salesProforma');
            });

        });

        describe('TopBarView', function () {
            var server;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                clock.restore();
            });

            it('Try to fetch collection with error', function () {
                var proformaUrl = new RegExp('\/Proforma\/list', 'i');

                server.respondWith('GET', proformaUrl, [401, {"Content-Type": "application/json"}, JSON.stringify({})]);
                proformaCollection = new ProformaCollection({
                    page: 1,
                    count: 2,
                    viewType: 'list',
                    contentType: 'salesProforma'
                });
                server.respond();

                //expect(window.location.hash).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var proformaUrl = new RegExp('\/Proforma\/list', 'i');
                var proformaTotalUrl = new RegExp('\/Proforma\/totalCollectionLength', 'i');

                server.respondWith('GET', proformaUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProformas)]);
                server.respondWith('GET', proformaTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                    count: 3
                })]);
                proformaCollection = new ProformaCollection({
                    page: 1,
                    viewType: 'list',
                    contentType: 'salesProforma'
                });
                server.respond();
                server.respond();

                server.respondWith('GET', '/currentDb', [200, {"Content-Type": "application/json"}, 'micheldb']);
                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: proformaCollection
                });
                server.respond();

                clock.tick(200);

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Proforma');
            });

        });

        describe('InvoiceListView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var windowConfirmStub;
            var selectValueSpy;
            var deleteItemSpy;

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
                selectValueSpy = sinon.spy(FilterView.prototype, 'selectValue');
                deleteItemSpy = sinon.spy(ListView.prototype, 'deleteItems');
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                selectValueSpy.restore();
                deleteItemSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to invoice ListView', function (done) {
                    var proformaUrl = new RegExp('\/Proforma\/list', 'i');
                    var proformaTotalUrl = new RegExp('\/Proforma\/totalCollectionLength', 'i');

                    server.respondWith('GET', proformaUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProformas)]);
                    server.respondWith('GET', proformaTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 3
                    })]);
                    listView = new ListView({
                        startTime: new Date(),
                        collection: proformaCollection
                    });
                    server.respond();
                    server.respond();

                    clock.tick(300);

                    expect(listView.$el.find('.list')).to.exist;

                    $thisEl = listView.$el;

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

                    proformaCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to filter listView', function () {
                    var proformaUrl = new RegExp('\/Proforma\/list', 'i');
                    var proformaTotalUrl = new RegExp('\/Proforma\/totalCollectionLength', 'i');
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var $customer;
                    var $assigned;
                    var $selectedItem;

                    // open filter dropdown
                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.not.have.class('hidden');

                    //select customer filter
                    $customer = $searchContainer.find('#supplierFullContainer > .groupName');
                    $customer.click();
                    $selectedItem = $searchContainer.find('#supplierUl > li:nth-child(1)');

                    server.respondWith('GET', proformaUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeProformas[0], fakeProformas[1]])]);
                    server.respondWith('GET', proformaTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    $selectedItem.click();
                    server.respond();
                    server.respond();

                    expect(selectValueSpy.calledOnce).to.be.true;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);

                    // select Assigned filter
                    $assigned = $searchContainer.find('#salesPersonFullContainer > .groupName');
                    $assigned.click();
                    $selectedItem = $searchContainer.find('#salesPersonUl > li:nth-child(1)');

                    server.respondWith('GET', proformaUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeProformas[0]])]);
                    server.respondWith('GET', proformaTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 1
                    })]);
                    $selectedItem.click();
                    server.respond();
                    server.respond();

                    expect(selectValueSpy.calledTwice).to.be.true;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(1);

                    //unselect Assigned filter

                    server.respondWith('GET', proformaUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeProformas[0], fakeProformas[1]])]);
                    server.respondWith('GET', proformaTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    $selectedItem.click();
                    server.respond();
                    server.respond();

                    expect(selectValueSpy.calledThrice).to.be.true;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);

                    //close filter dropdown
                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.class('hidden');
                });

                it('Try to close customer filter', function(){
                    var proformaUrl = new RegExp('\/Proforma\/list', 'i');
                    var proformaTotalUrl = new RegExp('\/Proforma\/totalCollectionLength', 'i');
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $closeBtn = $searchContainer.find('.removeValues');

                    server.respondWith('GET', proformaUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProformas)]);
                    server.respondWith('GET', proformaTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 3
                    })]);
                    $closeBtn.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                });

                it('Try to delete item', function(done){
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var deleteUrl = new RegExp('\/Invoice\/', 'i');
                    var invoiceTotalUrl = new RegExp('\/Invoice\/totalCollectionLength', 'i');
                    var $deleteBtn;

                    $needCheckBox.click();
                    $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    server.respondWith('DELETE', deleteUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"_id":"57172daf20c8d9397a7a6d43","_type":"Proforma","project":"56a0d60062d172544baf0e3d","__v":0,"dueDate":"2016-04-10T22:00:00.000Z","reconcile":true,"paymentDate":"2016-02-09T04:00:00.000Z","products":[{"unitPrice":400000,"subTotal":400000,"taxes":0,"jobs":"56a0e0cc62d172544baf1108","description":"","product":"5540d528dacb551c24000003","quantity":2590}],"emailed":false,"approved":false,"removable":true,"invoiced":false,"attachments":[],"editedBy":{"date":"2016-04-20T07:20:54.545Z","user":"563f673270bbc2b740ce89ae"},"createdBy":{"date":"2016-04-20T07:20:08.140Z","user":"563f673270bbc2b740ce89ae"},"creationDate":"2016-04-20T07:20:08.140Z","groups":{"group":[],"users":[],"owner":"560c099da5d4a2e20ba5068b"},"whoCanRW":"everyOne","workflow":"56fabc6b5ad5d96f4fb08eab","payments":["57172ddf20c8d9397a7a6d46"],"paymentInfo":{"taxes":0,"unTaxed":400000,"balance":0,"total":400000},"paymentTerms":null,"salesPerson":"55b92ad221e4b7c40f0000a2","currency":{"rate":1,"_id":"565eab29aeb95fa9c0f9df2d"},"journal":"57035e4321f9b0c4313d4146","invoiceDate":"2016-02-01T04:00:00.000Z","paymentReference":"PO995","sourceDocument":"57172da81eca60707afbc9d0","supplier":"56a0d53b62d172544baf0e3c","forSales":true,"name":"PO995","id":"57172daf20c8d9397a7a6d43"})]);
                    server.respondWith('GET', invoiceTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 30
                    })]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    expect(deleteItemSpy.calledOnce).to.be.true;

                    done();
                });

                it('Try to go to edit form with error response', function(){
                    var spyResponse;
                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var invoiceUrl = new RegExp('\/Invoice\/form', 'i');

                    server.respondWith('GET', invoiceUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakeInvoiceById)]);
                    $needTd.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to go to edit form', function(done){
                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var invoiceUrl = new RegExp('\/Invoice\/form', 'i');

                    App.currentDb = 'michelDb';
                    App.currentUser = {
                        profile: {
                            _id: '1387275598000'
                        }
                    };

                    server.respondWith('GET', '/currentDb', [200, {"Content-Type": "application/json"}, 'micheldb']);
                    server.respondWith('GET', invoiceUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeInvoiceById)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    expect($('.ui-dialog')).to.exist;

                    done();
                });
            });
        });
    });
});