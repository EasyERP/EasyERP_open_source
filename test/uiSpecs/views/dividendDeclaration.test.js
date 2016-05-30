define([
    'Underscore',
    'text!fixtures/index.html',
    'collections/DividendInvoice/filterCollection',
    'views/main/MainView',
    'views/DividendInvoice/list/ListView',
    'views/DividendInvoice/TopBarView',
    'views/DividendInvoice/CreateView',
    'views/DividendInvoice/EditView',
    'views/DividendPayments/CreateView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (_,
             fixtures,
             DividendCollection,
             MainView,
             ListView,
             TopBarView,
             CreateView,
             EditView,
             PaymentsCreateView,
             $,
             chai,
             chaiJquery,
             sinonChai) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [
        {
            _id        : 19,
            attachments: [],
            link       : false,
            mname      : "Sales",
            parrent    : null,
            sequence   : 1,
            visible    : true,
            ancestors  : [],
            href       : "Sales"
        },
        {
            _id        : 36,
            attachments: [],
            link       : false,
            mname      : "Project",
            parrent    : null,
            sequence   : 2,
            visible    : true,
            ancestors  : [],
            href       : "Project"
        },
        {
            _id        : 9,
            attachments: [],
            link       : false,
            mname      : "HR",
            parrent    : null,
            sequence   : 3,
            visible    : true,
            ancestors  : [],
            href       : "HR"
        },
        {
            _id        : 24,
            attachments: [],
            link       : true,
            mname      : "Leads",
            parrent    : 19,
            sequence   : 5,
            visible    : true,
            ancestors  : [],
            href       : "Leads"
        },
        {
            _id        : 25,
            attachments: [],
            link       : true,
            mname      : "Opportunities",
            parrent    : 19,
            sequence   : 6,
            visible    : true,
            ancestors  : [],
            href       : "Opportunities"
        },
        {
            _id        : 49,
            attachments: [],
            htref      : "persons",
            link       : true,
            mname      : "Persons",
            parrent    : 19,
            sequence   : 7,
            visible    : true,
            ancestors  : [],
            href       : "Persons"
        },
        {
            _id        : 50,
            attachments: [],
            htref      : "persons",
            link       : true,
            mname      : "Companies",
            parrent    : 19,
            sequence   : 8,
            visible    : true,
            ancestors  : [],
            href       : "Companies"
        },
        {
            _id        : 39,
            attachments: [],
            link       : true,
            mname      : "Projects",
            parrent    : 36,
            sequence   : 21,
            visible    : true,
            ancestors  : [],
            href       : "Projects"
        },
        {
            _id      : 73,
            mname    : "Dashboard Vacation",
            sequence : 22,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "DashBoardVacation"
        },
        {
            _id        : 40,
            attachments: [],
            link       : true,
            mname      : "Tasks",
            parrent    : 36,
            sequence   : 24,
            visible    : true,
            ancestors  : [],
            href       : "Tasks"
        },
        {
            _id        : 29,
            attachments: [],
            link       : true,
            mname      : "Dashboard",
            parrent    : 19,
            sequence   : 29,
            visible    : true,
            ancestors  : [],
            href       : "Dashboard"
        },
        {
            _id        : 42,
            attachments: [],
            link       : true,
            mname      : "Employees",
            parrent    : 9,
            sequence   : 29,
            visible    : true,
            ancestors  : [],
            href       : "Employees"
        },
        {
            _id        : 43,
            attachments: [],
            link       : true,
            mname      : "Applications",
            parrent    : 9,
            sequence   : 30,
            visible    : true,
            ancestors  : [],
            href       : "Applications"
        },
        {
            _id        : 14,
            attachments: [],
            link       : true,
            mname      : "Job Positions",
            parrent    : 9,
            sequence   : 32,
            visible    : true,
            ancestors  : [],
            href       : "JobPositions"
        },
        {
            _id        : 15,
            attachments: [],
            link       : true,
            mname      : "Groups",
            parrent    : 1,
            sequence   : 33,
            visible    : true,
            ancestors  : [],
            href       : "Departments"
        },
        {
            _id        : 7,
            __v        : 0,
            attachments: [],
            link       : true,
            mname      : "Users",
            parrent    : 1,
            sequence   : 42,
            visible    : true,
            ancestors  : [],
            href       : "Users"
        },
        {
            _id        : 44,
            attachments: [],
            link       : true,
            mname      : "Workflows",
            parrent    : 1,
            sequence   : 44,
            visible    : true,
            ancestors  : [],
            href       : "Workflows"
        },
        {
            _id        : 51,
            attachments: [],
            link       : true,
            mname      : "Profiles",
            parrent    : 1,
            sequence   : 51,
            visible    : true,
            ancestors  : [],
            href       : "Profiles"
        },
        {
            _id        : 52,
            attachments: [],
            link       : true,
            mname      : "Birthdays",
            parrent    : 9,
            sequence   : 52,
            visible    : true,
            ancestors  : [],
            href       : "Birthdays"
        },
        {
            _id        : 53,
            attachments: [],
            link       : true,
            mname      : "Dashboard",
            parrent    : 36,
            sequence   : 53,
            visible    : true,
            ancestors  : [],
            href       : "projectDashboard"
        },
        {
            _id      : 54,
            mname    : "Purchases",
            sequence : 54,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : "Purchases"
        },
        {
            _id      : 80,
            mname    : "Jobs Dashboard",
            sequence : 54,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "jobsDashboard"
        },
        {
            _id      : 55,
            mname    : "Quotation",
            sequence : 55,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Quotation"
        },
        {
            _id      : 57,
            mname    : "Order",
            sequence : 56,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Order"
        },
        {
            _id      : 56,
            mname    : "Invoice",
            sequence : 57,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Invoice"
        },
        {
            _id      : 58,
            mname    : "Product",
            sequence : 58,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Product"
        },
        {
            _id      : 59,
            mname    : "Accounting",
            sequence : 59,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : "Accounting"
        },
        {
            _id      : 60,
            mname    : "Supplier Payments",
            sequence : 60,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "supplierPayments"
        },
        {
            _id      : 61,
            mname    : "Sales Payments",
            sequence : 61,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "customerPayments"
        },
        {
            _id      : 62,
            mname    : "Quotation",
            sequence : 62,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "salesQuotation"
        },
        {
            _id      : 63,
            mname    : "Order",
            sequence : 63,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "salesOrder"
        },
        {
            _id      : 64,
            mname    : "Invoice",
            sequence : 64,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "salesInvoice"
        },
        {
            _id      : 99,
            mname    : "Proforma",
            sequence : 65,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "salesProforma"
        },
        {
            _id      : 67,
            mname    : "Revenue",
            sequence : 67,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Revenue"
        },
        {
            _id      : 68,
            mname    : "MonthHours",
            sequence : 68,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "monthHours"
        },
        {
            _id      : 69,
            mname    : "Holidays",
            sequence : 69,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Holiday"
        },
        {
            _id      : 77,
            mname    : "Capacity",
            sequence : 69,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Capacity"
        },
        {
            _id      : 88,
            mname    : "Salary Report",
            sequence : 69,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "salaryReport"
        },
        {
            _id      : 70,
            mname    : "Vacation",
            sequence : 70,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Vacation"
        },
        {
            _id      : 71,
            mname    : "Attendance",
            sequence : 71,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Attendance"
        },
        {
            _id      : 76,
            mname    : "Efficiency",
            sequence : 72,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Efficiency"
        },
        {
            _id      : 72,
            mname    : "Bonus Type",
            sequence : 73,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "bonusType"
        },
        {
            _id      : 74,
            mname    : "HrDashboard",
            sequence : 74,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "HrDashboard"
        },
        {
            _id      : 66,
            mname    : "Payroll Expenses",
            sequence : 77,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "PayrollExpenses"
        },
        {
            _id      : 78,
            mname    : "Payroll",
            sequence : 78,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : "Payroll"
        },
        {
            _id      : 79,
            mname    : "Payroll Payments",
            sequence : 79,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "PayrollPayments"
        },
        {
            _id      : 82,
            mname    : "Invoice Aging",
            sequence : 82,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "invoiceAging"
        },
        {
            _id      : 83,
            mname    : "Chart Of Account",
            sequence : 83,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "ChartOfAccount"
        },
        {
            _id      : 100,
            mname    : "Inventory Report",
            sequence : 83,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "inventoryReport"
        },
        {
            _id      : 85,
            mname    : "Journal",
            sequence : 85,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "journal"
        },
        {
            _id      : 86,
            mname    : "Journal Entry",
            sequence : 86,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "journalEntry"
        },
        {
            _id      : 87,
            mname    : "Invoice Charts",
            sequence : 87,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "invoiceCharts"
        },
        {
            _id      : 89,
            mname    : "Trial Balance",
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "trialBalance"
        },
        {
            _id      : 91,
            mname    : "Profit And Loss",
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "profitAndLoss"
        },
        {
            _id      : 92,
            mname    : "Balance Sheet",
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "balanceSheet"
        },
        {
            _id      : 93,
            mname    : "Cash Flow",
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "cashFlow"
        },
        {
            _id      : 94,
            mname    : "Close Month",
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "closeMonth"
        },
        {
            _id      : 96,
            mname    : "Expenses",
            sequence : 96,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : "Expenses"
        },
        {
            _id      : 97,
            mname    : "Invoice",
            sequence : 97,
            parrent  : 96,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "ExpensesInvoice"
        },
        {
            _id      : 98,
            mname    : "Expenses Payments",
            sequence : 98,
            parrent  : 96,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "ExpensesPayments"
        },
        {
            _id      : 101,
            mname    : "Dividend declaration",
            sequence : 101,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "DividendInvoice"
        },
        {
            _id      : 102,
            mname    : "Dividend payment",
            sequence : 101,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "DividendPayments"
        },
        {
            _id      : 103,
            link     : true,
            mname    : "Employee",
            parrent  : 1,
            sequence : 103,
            visible  : true,
            ancestors: [],
            href     : "settingsEmployee"
        },
        {
            _id        : 1,
            __v        : 0,
            attachments: [],
            link       : false,
            mname      : "Settings",
            parrent    : null,
            sequence   : 1000,
            visible    : true,
            ancestors  : [],
            href       : "Settings"
        },
        {
            _id      : 75,
            mname    : "tCard",
            sequence : 1000,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "wTrack"
        },
        {
            _id      : 84,
            mname    : "Product Categories",
            sequence : 1000,
            parrent  : 1,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "productSettings"
        }
    ];
    var fakeDividendDeclaration = [
        {
            _id        : "574400cf355ba73610d82ebe",
            _type      : "dividendInvoice",
            dueDate    : "2016-06-06T21:00:00.000Z",
            approved   : false,
            removable  : true,
            editedBy   : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy  : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow   : {
                _id         : "55647d982e4aa3804a765ecb",
                sequence    : 2,
                status      : "Done",
                name        : "Paid",
                wId         : "Sales Invoice",
                color       : "#2C3E50",
                __v         : 0,
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true
            },
            payments   : [
                "574400dd355ba73610d82ec0"
            ],
            paymentInfo: {
                total  : 0,
                balance: -55500,
                unTaxed: 0,
                taxes  : 0
            },
            currency   : {
                _id : "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2016-05-23T21:00:00.000Z",
            forSales   : false,
            name       : "DD3",
            paymentDate: "2016-05-23T21:00:00.000Z",
            paid       : 555
        },
        {
            _id        : "574400d3355ba73610d82ebf",
            _type      : "dividendInvoice",
            dueDate    : "2016-06-06T21:00:00.000Z",
            approved   : false,
            removable  : true,
            editedBy   : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy  : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow   : {
                _id         : "55647d982e4aa3804a765ecb",
                sequence    : 2,
                status      : "Done",
                name        : "Paid",
                wId         : "Sales Invoice",
                color       : "#2C3E50",
                __v         : 0,
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true
            },
            payments   : [
                "574400f9355ba73610d82ec4"
            ],
            paymentInfo: {
                total  : 0,
                balance: -77700,
                unTaxed: 0,
                taxes  : 0
            },
            currency   : {
                _id : "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2016-05-23T21:00:00.000Z",
            forSales   : false,
            name       : "DD4",
            paymentDate: "2016-05-23T21:00:00.000Z",
            paid       : 777
        },
        {
            _id        : "5742f26e7afe352f10c11c3d",
            _type      : "dividendInvoice",
            dueDate    : "2016-06-05T21:00:00.000Z",
            approved   : false,
            removable  : true,
            editedBy   : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy  : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow   : {
                _id         : "55647d932e4aa3804a765ec9",
                color       : "#2C3E50",
                name        : "Unpaid",
                sequence    : 4,
                status      : "New",
                wId         : "Sales Invoice",
                wName       : "invoice",
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                visible     : true
            },
            payments   : [],
            paymentInfo: {
                balance: 0,
                unTaxed: 0,
                taxes  : 0,
                total  : 0
            },
            currency   : {
                _id : "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2016-05-22T21:00:00.000Z",
            forSales   : false,
            name       : "DD1",
            paymentDate: "2016-05-22T21:00:00.000Z",
            paid       : 0
        },
        {
            _id        : "574448a58aa0eeae38752548",
            _type      : "dividendInvoice",
            dueDate    : "2016-06-06T21:00:00.000Z",
            approved   : false,
            removable  : true,
            editedBy   : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy  : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow   : {
                _id         : "55647d932e4aa3804a765ec9",
                color       : "#2C3E50",
                name        : "Unpaid",
                sequence    : 4,
                status      : "New",
                wId         : "Sales Invoice",
                wName       : "invoice",
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                visible     : true
            },
            payments   : [],
            paymentInfo: {
                taxes  : 0,
                unTaxed: 0,
                balance: 0,
                total  : 0
            },
            currency   : {
                rate: 1,
                _id : "565eab29aeb95fa9c0f9df2d"
            },
            invoiceDate: "2016-05-23T21:00:00.000Z",
            forSales   : false,
            name       : "DD8",
            paid       : 0
        }
    ];
    var fakeDividendAfterDelete = [
        {
            _id        : "574400cf355ba73610d82ebe",
            _type      : "dividendInvoice",
            dueDate    : "2016-06-06T21:00:00.000Z",
            approved   : false,
            removable  : true,
            editedBy   : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy  : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow   : {
                _id         : "55647d982e4aa3804a765ecb",
                sequence    : 2,
                status      : "Done",
                name        : "Paid",
                wId         : "Sales Invoice",
                color       : "#2C3E50",
                __v         : 0,
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true
            },
            payments   : [
                "574400dd355ba73610d82ec0"
            ],
            paymentInfo: {
                total  : 0,
                balance: -55500,
                unTaxed: 0,
                taxes  : 0
            },
            currency   : {
                _id : "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2016-05-23T21:00:00.000Z",
            forSales   : false,
            name       : "DD3",
            paymentDate: "2016-05-23T21:00:00.000Z",
            paid       : 555
        },
        {
            _id        : "574400d3355ba73610d82ebf",
            _type      : "dividendInvoice",
            dueDate    : "2016-06-06T21:00:00.000Z",
            approved   : false,
            removable  : true,
            editedBy   : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType : "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType : "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType : "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy  : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v            : 0,
                    attachments    : [],
                    credentials    : {
                        access_token : "",
                        refresh_token: ""
                    },
                    email          : "info@thinkmobiles.com",
                    kanbanSettings : {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess     : "2016-05-24T07:28:57.964Z",
                    login          : "admin",
                    pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile        : 1387275598000,
                    imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters   : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType : "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType : "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType: "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType: "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow   : {
                _id         : "55647d982e4aa3804a765ecb",
                sequence: 2,
                status  : "Done",
                name    : "Paid",
                wId     : "Sales Invoice",
                color   : "#2C3E50",
                __v     : 0,
                source  : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true
            },
            payments   : [
                "574400f9355ba73610d82ec4"
            ],
            paymentInfo: {
                total  : 0,
                balance: -77700,
                unTaxed: 0,
                taxes  : 0
            },
            currency   : {
                _id : "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2016-05-23T21:00:00.000Z",
            forSales   : false,
            name       : "DD4",
            paymentDate: "2016-05-23T21:00:00.000Z",
            paid       : 777
        },
        {
            _id        : "574448a58aa0eeae38752548",
            _type: "dividendInvoice",
            dueDate: "2016-06-06T21:00:00.000Z",
            approved: false,
            removable: true,
            editedBy : {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v: 0,
                    attachments: [],
                    credentials: {
                        access_token : "",
                        refresh_token: ""
                    },
                    email      : "info@thinkmobiles.com",
                    kanbanSettings: {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess    : "2016-05-24T07:28:57.964Z",
                    login         : "admin",
                    pass          : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile       : 1387275598000,
                    imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters  : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType: "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType: "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy: {
                user: {
                    _id            : "52203e707d4dba8813000003",
                    __v: 0,
                    attachments: [],
                    credentials: {
                        access_token : "",
                        refresh_token: ""
                    },
                    email      : "info@thinkmobiles.com",
                    kanbanSettings: {
                        applications : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks        : {
                            countPerPage : 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess    : "2016-05-24T07:28:57.964Z",
                    login         : "admin",
                    pass          : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile       : 1387275598000,
                    imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters  : [
                        {
                            _id      : "56213057c558b13c1bbf874d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5621307bc558b13c1bbf874f",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213103c558b13c1bbf8750",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56213197c558b13c1bbf8751",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56215e86c558b13c1bbf8755",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56229009184ec5a427913306",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id      : "562506bb19a2ecca01ca84b3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56265005d53978de6e9ea440",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "562b83ccb4677e225aa31df6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "564dd4ce9fb8bc3f2195662c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56570d714d96962262fd4b55",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56572368bfd103f108eb4a24",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56604795ccc590f32c577ece",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "566047c6ccc590f32c577ed1",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5661a7bf7d284423697e34a8",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5665429e9294f4d728bcafaa",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "566eba768453e8b464b70a40",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56c711ab0769bba2647ae710",
                            viewType: "",
                            byDefault: "Projects"
                        },
                        {
                            _id      : "56daf5322e7b62c613ff2552",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd69d991cb620c19ff60c2",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dd6af71e6cb7131892b2ba",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "56dfe8e56e2877d85455a6bb",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id      : "56f3d039c1785edc507e81ea",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id      : "5708ca211d118cb6401008cc",
                            viewType: "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow : {
                _id         : "55647d932e4aa3804a765ec9",
                color: "#2C3E50",
                name : "Unpaid",
                sequence: 4,
                status  : "New",
                wId     : "Sales Invoice",
                wName   : "invoice",
                source  : "purchase",
                targetSource: [
                    "invoice"
                ],
                visible     : true
            },
            payments : [],
            paymentInfo: {
                taxes  : 0,
                unTaxed: 0,
                balance: 0,
                total  : 0
            },
            currency   : {
                rate: 1,
                _id : "565eab29aeb95fa9c0f9df2d"
            },
            invoiceDate: "2016-05-23T21:00:00.000Z",
            forSales   : false,
            name       : "DD8",
            paid       : 0
        }
    ];
    var fakeDividendForForm = {
        _id             : "574400cf355ba73610d82ebe",
        _type: "dividendInvoice",
        dueDate: "2016-06-06T21:00:00.000Z",
        products: [],
        emailed : false,
        approved: false,
        removable: true,
        invoiced : false,
        attachments: [],
        editedBy   : {
            user: {
                _id            : "52203e707d4dba8813000003",
                __v: 0,
                attachments: [],
                credentials: {
                    access_token : "",
                    refresh_token: ""
                },
                email      : "info@thinkmobiles.com",
                kanbanSettings: {
                    applications : {
                        countPerPage : 10,
                        foldWorkflows: [
                            "Empty"
                        ]
                    },
                    opportunities: {
                        countPerPage: 10
                    },
                    tasks        : {
                        countPerPage : 10,
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ]
                    }
                },
                lastAccess    : "2016-05-24T07:28:57.964Z",
                login         : "admin",
                pass          : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                profile       : 1387275598000,
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                savedFilters  : [
                    {
                        _id      : "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id      : "56f3d039c1785edc507e81ea",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5708ca211d118cb6401008cc",
                        viewType: "",
                        byDefault: "Employees"
                    }
                ],
                relatedEmployee: "55b92ad221e4b7c40f00004f"
            },
            date: "2016-05-24T07:20:47.685Z"
        },
        createdBy  : {
            user: {
                _id            : "52203e707d4dba8813000003",
                __v: 0,
                attachments: [],
                credentials: {
                    access_token : "",
                    refresh_token: ""
                },
                email      : "info@thinkmobiles.com",
                kanbanSettings: {
                    applications : {
                        countPerPage : 10,
                        foldWorkflows: [
                            "Empty"
                        ]
                    },
                    opportunities: {
                        countPerPage: 10
                    },
                    tasks        : {
                        countPerPage : 10,
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ]
                    }
                },
                lastAccess    : "2016-05-24T07:28:57.964Z",
                login         : "admin",
                pass          : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                profile       : 1387275598000,
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                savedFilters  : [
                    {
                        _id      : "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id      : "56f3d039c1785edc507e81ea",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5708ca211d118cb6401008cc",
                        viewType: "",
                        byDefault: "Employees"
                    }
                ],
                relatedEmployee: "55b92ad221e4b7c40f00004f"
            },
            date: "2016-05-24T07:20:47.685Z"
        },
        creationDate: "2016-05-24T07:20:47.685Z",
        groups      : {
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            },
            users: [],
            group: []
        },
        whoCanRW    : "everyOne",
        workflow    : {
            _id   : "55647d982e4aa3804a765ecb",
            status: "Done",
            name  : "Paid"
        },
        payments    : [
            {
                _id       : "574400dd355ba73610d82ec0",
                paymentRef: "",
                name      : "PP_2",
                date      : "2016-05-23T21:00:00.000Z",
                paidAmount: 55500
            }
        ],
        paymentInfo : {
            total  : 0,
            balance: -55500,
            unTaxed: 0,
            taxes  : 0
        },
        paymentTerms: null,
        salesPerson : null,
        currency    : {
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                name: "USD",
                sequence: 0
            },
            rate: 1
        },
        journal     : "572347d78ba4fd1330062726",
        invoiceDate : "2016-05-23T21:00:00.000Z",
        paymentReference: "free",
        sourceDocument  : null,
        supplier        : null,
        forSales        : false,
        name            : "DD3",
        __v             : 0,
        paymentDate     : "2016-05-23T21:00:00.000Z"
    };
    var fakeDividendUnpaidFoForm = {
        _id             : "574448a58aa0eeae38752548",
        _type: "dividendInvoice",
        dueDate: "2016-06-06T21:00:00.000Z",
        products: [],
        emailed : false,
        approved: false,
        removable: true,
        invoiced : false,
        attachments: [],
        editedBy   : {
            date: "2016-05-24T12:27:17.691Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v: 0,
                attachments: [],
                credentials: {
                    access_token : "",
                    refresh_token: ""
                },
                email      : "info@thinkmobiles.com",
                kanbanSettings: {
                    applications : {
                        countPerPage : 10,
                        foldWorkflows: [
                            "Empty"
                        ]
                    },
                    opportunities: {
                        countPerPage: 10
                    },
                    tasks        : {
                        countPerPage : 10,
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ]
                    }
                },
                lastAccess    : "2016-05-24T07:28:57.964Z",
                login         : "admin",
                pass          : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                profile       : 1387275598000,
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                savedFilters  : [
                    {
                        _id      : "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id      : "56f3d039c1785edc507e81ea",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5708ca211d118cb6401008cc",
                        viewType: "",
                        byDefault: "Employees"
                    }
                ],
                relatedEmployee: "55b92ad221e4b7c40f00004f"
            }
        },
        createdBy  : {
            date: "2016-05-24T12:27:17.691Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v: 0,
                attachments: [],
                credentials: {
                    access_token : "",
                    refresh_token: ""
                },
                email      : "info@thinkmobiles.com",
                kanbanSettings: {
                    applications : {
                        countPerPage : 10,
                        foldWorkflows: [
                            "Empty"
                        ]
                    },
                    opportunities: {
                        countPerPage: 10
                    },
                    tasks        : {
                        countPerPage : 10,
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ]
                    }
                },
                lastAccess    : "2016-05-24T07:28:57.964Z",
                login         : "admin",
                pass          : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                profile       : 1387275598000,
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                savedFilters  : [
                    {
                        _id      : "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id      : "56f3d039c1785edc507e81ea",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5708ca211d118cb6401008cc",
                        viewType: "",
                        byDefault: "Employees"
                    }
                ],
                relatedEmployee: "55b92ad221e4b7c40f00004f"
            }
        },
        creationDate: "2016-05-24T12:27:17.691Z",
        groups      : {
            group: [],
            users: [],
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        whoCanRW    : "everyOne",
        workflow    : {
            _id   : "55647d932e4aa3804a765ec9",
            name: "Unpaid",
            status: "New"
        },
        payments    : [],
        paymentInfo : {
            taxes  : 0,
            unTaxed: 0,
            balance: 0,
            total  : 0
        },
        paymentTerms: null,
        salesPerson : null,
        currency    : {
            rate: 1,
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                name: "USD",
                sequence: 0
            }
        },
        journal     : "572347d78ba4fd1330062726",
        invoiceDate : "2016-05-23T21:00:00.000Z",
        paymentReference: "free",
        sourceDocument  : null,
        supplier        : null,
        forSales        : false,
        name            : "DD8",
        __v             : 0
    };
    var fakePaymentMethods = {
        data: [
            {
                _id     : "565f2e05ab70d49024242e10",
                name: "CASH UAH",
                account: "CASH UAH",
                currency: "UAH",
                bank    : "",
                owner   : "CASH UAH"
            },
            {
                _id     : "565f2e05ab70d49024242e0f",
                name: "CASH USD",
                account: "CASH USD",
                currency: "USD",
                bank    : "",
                owner   : "CASH USD"
            },
            {
                _id     : "565f2e05ab70d49024242e07",
                name: "Erste Bank HU24 1160 0006 0000 0000 4916 1522",
                account: "HU24 1160 0006 0000 0000 4916 1522",
                currency: "USD",
                bank    : "Erste Bank",
                owner   : "Alexander Sokhanych"
            },
            {
                _id     : "565f2e05ab70d49024242e08",
                name: "Erste Bank HU27 1160 0006 0000 0000 4810 3101",
                account: "HU27 1160 0006 0000 0000 4810 3101",
                currency: "EUR",
                bank    : "Erste Bank",
                owner   : "Alexander Sokhanych"
            },
            {
                _id     : "555cc981532aebbc4a8baf36",
                name: "Payoneer ",
                account: "Payoneer ",
                currency: "USD",
                bank    : "",
                owner   : "Payoneer "
            },
            {
                _id  : "555cc981532aebbc4a8baf38",
                name: "Primary",
                owner: ""
            },
            {
                _id  : "555cc981532aebbc4a8baf37",
                name: "UkrSibBank",
                owner: ""
            },
            {
                _id     : "565f2e05ab70d49024242e0c",
                name: "Ukrsibbank 26000479199400",
                account: "26000479199400",
                currency: "USD",
                bank    : "Ukrsibbank",
                owner   : "YourTradingSystems"
            },
            {
                _id     : "565f2e05ab70d49024242e0d",
                name: "Ukrsibbank 26000479199400",
                account: "26000479199400",
                currency: "UAH",
                bank    : "Ukrsibbank",
                owner   : "YourTradingSystems"
            },
            {
                _id     : "565f2e05ab70d49024242e09",
                name: "Ukrsibbank 26005536599700",
                account: "26005536599700",
                currency: "USD",
                bank    : "Ukrsibbank",
                owner   : "ThinkMobiles"
            },
            {
                _id     : "565f2e05ab70d49024242e0b",
                name: "Ukrsibbank 26005536599700",
                account: "26005536599700",
                currency: "UAH",
                bank    : "Ukrsibbank",
                owner   : "ThinkMobiles"
            },
            {
                _id     : "565f2e05ab70d49024242e0a",
                name: "Ukrsibbank 26049536599700",
                account: "26049536599700",
                currency: "EUR",
                bank    : "Ukrsibbank",
                owner   : "ThinkMobiles"
            },
            {
                _id     : "565f2e05ab70d49024242e0e",
                name: "Unicreditbank",
                account: "Unicreditbank",
                currency: "USD",
                bank    : "",
                owner   : "Unicreditbank"
            }
        ]
    };
    var fakeCurrency = {
        data: [
            {
                _id     : "565eab29aeb95fa9c0f9df2d",
                sequence: 0,
                name    : "USD"
            },
            {
                _id     : "565eab34aeb95fa9c0f9df2e",
                sequence: 1,
                name    : "EUR"
            },
            {
                _id     : "565eab3faeb95fa9c0f9df2f",
                sequence: 2,
                name    : "UAH"
            }
        ]
    };

    var view;
    var topBarView;
    var listView;
    var dividendCollection;

    describe('DividendDeclaration', function () {

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

                server.respondWith('GET', '/getModules', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);
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

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to fetch collection with error', function () {
                var dividendUrl = new RegExp('\/Invoice\/list', 'i');

                server.respondWith('GET', dividendUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                dividendCollection = new DividendCollection({
                    viewType   : 'list',
                    contentType: 'DividendInvoice',
                    page       : 1,
                    count      : 2
                });
                server.respond();
            });

            it('Try to create TopBarView', function () {
                var dividendUrl = new RegExp('\/Invoice\/list', 'i');
                var dividendTotalUrl = new RegExp('\/Invoice\/totalCollectionLength');

                server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendDeclaration)]);
                server.respondWith('GET', dividendTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    count: 1
                })]);
                dividendCollection = new DividendCollection({
                    viewType   : 'list',
                    contentType: 'DividendInvoice',
                    page       : 1,
                    count      : 2
                });
                server.respond();

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: dividendCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Dividend declaration');
            });
        });

        describe('DividendDeclarationViews', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var windowConfirmStub;
            var alertStub;
            var deleteSpy;
            var deleteRenderSpy;
            var paymentCreateInitSpy;
            var debounceStub;

            before(function () {
                App.startPreload = function () {
                    App.preloaderShowFlag = true;
                    $('#loading').show();
                };

                App.stopPreload = function () {
                    App.preloaderShowFlag = false;
                    $('#loading').hide();
                };

                App.currentDb = 'michelDb';
                App.currentUser = {
                    profile: {
                        _id: '1387275598000'
                    }
                };

                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
                deleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
                deleteRenderSpy = sinon.spy(ListView.prototype, 'deleteItemsRender');
                paymentCreateInitSpy = sinon.spy(PaymentsCreateView.prototype, 'initialize');
                debounceStub = sinon.stub(_, 'debounce', function (debFunction) {
                    return debFunction;
                });
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                alertStub.restore();
                deleteRenderSpy.restore();
                deleteSpy.restore();
                paymentCreateInitSpy.restore();
                debounceStub.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create dividendDeclarationListView', function (done) {
                    var dividendListUrl = new RegExp('\/Invoice\/list', 'i');
                    var dividendTotalUrl = new RegExp('\/Invoice\/totalCollectionLength');

                    server.respondWith('GET', dividendListUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendDeclaration)]);
                    server.respondWith('GET', dividendTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 4
                    })]);
                    listView = new ListView({
                        startTime : new Date(),
                        collection: dividendCollection
                    });
                    server.respond();
                    server.respond();
                    clock.tick(300);

                    $thisEl = listView.$el;

                    expect($thisEl.find('#listTable')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(4);

                    // bind events to topBarView and filterCollection
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

                    dividendCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to delete item with error response', function () {
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(3) > td.notForm > input');
                    var dividendUrl = new RegExp('\/Invoice\/', 'i');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var spyResponse;

                    mainSpy.reset();

                    $needCheckBox.click();

                    server.respondWith('DELETE', dividendUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(deleteSpy.calledOnce).to.be.true;
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                });

                it('Try to delete item good response', function () {
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var dividendUrl = new RegExp('\/Invoice\/', 'i');
                    var dividendTotalUrl = new RegExp('\/Invoice\/totalCollectionLength');
                    var dividendListUrl = new RegExp('\/Invoice\/list', 'i');

                    server.respondWith('GET', dividendListUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendAfterDelete)]);
                    server.respondWith('GET', dividendTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 3
                    })]);
                    server.respondWith('DELETE', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "_id"             : "5742f26e7afe352f10c11c3d",
                        "_type": "dividendInvoice",
                        "dueDate": "2016-06-05T21:00:00.000Z",
                        "__v"    : 0,
                        "paymentDate": "2016-05-22T21:00:00.000Z",
                        "products"   : [],
                        "emailed"    : false,
                        "approved"   : false,
                        "removable"  : true,
                        "invoiced"   : false,
                        "attachments": [],
                        "editedBy"   : {
                            "date": "2016-05-23T12:07:10.745Z",
                            "user": "52203e707d4dba8813000003"
                        },
                        "createdBy"  : {
                            "date": "2016-05-23T12:07:10.745Z",
                            "user": "52203e707d4dba8813000003"
                        },
                        "creationDate": "2016-05-23T12:07:10.745Z",
                        "groups"      : {
                            "group": [],
                            "users": [],
                            "owner": "560c099da5d4a2e20ba5068b"
                        },
                        "whoCanRW"    : "everyOne",
                        "workflow"    : "55647d932e4aa3804a765ec9",
                        "payments"    : [],
                        "paymentInfo" : {
                            "taxes"  : 0,
                            "unTaxed": 0,
                            "balance": 0,
                            "total"  : 0
                        },
                        "paymentTerms": null,
                        "salesPerson" : null,
                        "currency"    : {
                            "rate": 1,
                            "_id" : "565eab29aeb95fa9c0f9df2d"
                        },
                        "journal"     : "572347d78ba4fd1330062726",
                        "invoiceDate" : "2016-05-22T21:00:00.000Z",
                        "paymentReference": "free",
                        "sourceDocument"  : null,
                        "supplier"        : null,
                        "forSales"        : false,
                        "name"            : "DD1",
                        "id"              : "5742f26e7afe352f10c11c3d"
                    })]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect(deleteSpy.calledTwice).to.be.true;
                });

                it('Try to showMore items with error response', function () {
                    var $secondBtn = $thisEl.find('.pageList > a').eq(1);
                    var dividendListUrl = new RegExp('\/Invoice\/list', 'i');
                    var spyResponse;

                    mainSpy.reset();

                    server.respondWith('GET', dividendListUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendAfterDelete)]);
                    $secondBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some Error.');
                });

                it('Try to showMore items with good response', function () {
                    var $secondBtn = $thisEl.find('.pageList > a').eq(1);
                    var dividendTotalUrl = new RegExp('\/Invoice\/totalCollectionLength');
                    var dividendListUrl = new RegExp('\/Invoice\/list', 'i');

                    server.respondWith('GET', dividendListUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendAfterDelete)]);
                    server.respondWith('GET', dividendTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 2
                    })]);
                    $secondBtn.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                });

                it('Try to go to editDialog with error response', function () {
                    mainSpy.reset();

                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(3)');
                    var dividendUrl = new RegExp('\/Invoice\/form');

                    server.respondWith('GET', dividendUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $needTd.click();
                    server.respond();

                    expect(mainSpy.args[0][0]).to.have.property('type', 'error');
                    expect(mainSpy.args[0][0]).to.have.property('message', 'Please refresh browser');
                });

                it('Try to go to editDialog with good response', function () {
                    mainSpy.reset();

                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(3)');
                    var dividendUrl = new RegExp('\/Invoice\/form');

                    server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendForForm)]);
                    $needTd.click();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                /*it('Try to change tab', function(){
                 var $dialog = $('.ui-dialog');
                 var $firstTab = $dialog.find('.dialog-tabs > li').eq(0).find('a');
                 var $secondTab = $dialog.find('.dialog-tabs > li').eq(1).find('a');

                 expect($firstTab).to.have.class('active');

                 $secondTab.click();
                 expect($secondTab).to.have.class('active');

                 $firstTab.click();
                 expect($firstTab).to.have.class('active');
                 });*/

                it('Try to delete item with 403 error status response', function () {
                    mainSpy.reset();

                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-invoice-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    var dividendUrl = new RegExp('\/Invoice\/', 'i');

                    server.respondWith('DELETE', dividendUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(mainSpy.args[0][0]).to.have.property('type', 'error');
                    expect(mainSpy.args[0][0]).to.have.property('message', 'You do not have permission to perform this action');
                });

                it('Try to delete item', function () {
                    deleteRenderSpy.reset();
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-invoice-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    var dividendUrl = new RegExp('\/Invoice\/', 'i');

                    server.respondWith('DELETE', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "_id"             : "5742f26e7afe352f10c11c3d",
                        "_type": "dividendInvoice",
                        "dueDate": "2016-06-05T21:00:00.000Z",
                        "__v"    : 0,
                        "paymentDate": "2016-05-22T21:00:00.000Z",
                        "products"   : [],
                        "emailed"    : false,
                        "approved"   : false,
                        "removable"  : true,
                        "invoiced"   : false,
                        "attachments": [],
                        "editedBy"   : {
                            "date": "2016-05-23T12:07:10.745Z",
                            "user": "52203e707d4dba8813000003"
                        },
                        "createdBy"  : {
                            "date": "2016-05-23T12:07:10.745Z",
                            "user": "52203e707d4dba8813000003"
                        },
                        "creationDate": "2016-05-23T12:07:10.745Z",
                        "groups"      : {
                            "group": [],
                            "users": [],
                            "owner": "560c099da5d4a2e20ba5068b"
                        },
                        "whoCanRW"    : "everyOne",
                        "workflow"    : "55647d932e4aa3804a765ec9",
                        "payments"    : [],
                        "paymentInfo" : {
                            "taxes"  : 0,
                            "unTaxed": 0,
                            "balance": 0,
                            "total"  : 0
                        },
                        "paymentTerms": null,
                        "salesPerson" : null,
                        "currency"    : {
                            "rate": 1,
                            "_id" : "565eab29aeb95fa9c0f9df2d"
                        },
                        "journal"     : "572347d78ba4fd1330062726",
                        "invoiceDate" : "2016-05-22T21:00:00.000Z",
                        "paymentReference": "free",
                        "sourceDocument"  : null,
                        "supplier"        : null,
                        "forSales"        : false,
                        "name"            : "DD1",
                        "id"              : "5742f26e7afe352f10c11c3d"
                    })]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    //expect(deleteRenderSpy.called).to.be.true;  //todo uncomment after fix ListView
                });

                it('Try to open not paid item and open CreatePaymentView', function (done) {
                    paymentCreateInitSpy.reset();

                    var $unPaidTd = $thisEl.find('#listTable > tr:nth-child(3) > td:nth-child(2)');
                    var dividendUrl = new RegExp('\/Invoice\/form');
                    var paymentMethodUrl = '/paymentMethod';
                    var currencyUrl = '/currency/getForDd';
                    var $dialog;
                    var $payBtn;

                    server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendUnpaidFoForm)]);
                    $unPaidTd.click();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                    // go to payment dialog
                    $dialog = $('.ui-dialog');
                    $payBtn = $dialog.find('.newPayment');

                    server.respondWith('GET', paymentMethodUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakePaymentMethods)]);
                    server.respondWith('GET', currencyUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCurrency)]);
                    $payBtn.click();
                    server.respond();
                    server.respond();

                    clock.tick(2000);

                    expect($('.ui-dialog')).to.exist;
                    expect(paymentCreateInitSpy.calledOnce).to.be.true;
                    done();
                });

                it('Try to changePaidAmount', function (done) {
                    var $dialog = $('.ui-dialog');
                    var $amountInput = $dialog.find('#paidAmount');
                    var amountLeftUrl = new RegExp('\/payment\/amountLeftCalc', 'i');

                    debounceStub.reset();

                    server.respondWith('GET', amountLeftUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        difference: -5000
                    })]);
                    clock.tick(10000);
                    $amountInput.trigger('keyup'); // not work
                    server.respond();
                    expect($dialog.find('#differenceAmount').text().trim()).to.be.equals('-5000.00');

                    done();
                });

                it('Try to select bank account and currency', function () {
                    var $dialog = $('.ui-dialog');
                    var $bankAccount = $dialog.find('#paymentMethod');
                    var $currency = $dialog.find('#currencyDd');
                    var $next;
                    var $prev;
                    var $selectedItem;

                    // select bank account
                    $bankAccount.click();
                    $next = $dialog.find('.next');
                    $next.click();

                    expect($dialog.find('.counter').text().trim()).to.be.equals('11-13 of 13');
                    $prev = $dialog.find('.prev');
                    $prev.click();

                    expect($dialog.find('.counter').text().trim()).to.be.equals('1-10 of 13');
                    $selectedItem = $dialog.find('ul.newSelectList').first().find('li').first();
                    $selectedItem.click();
                    expect($dialog.find('#paymentMethod').text().trim()).to.be.equals('CASH UAH');

                    // select currency
                    $currency.click();
                    $selectedItem = $dialog.find('ul.newSelectList').eq(1).find('li').eq(1);
                    $selectedItem.click();
                    //expect($dialog.find('#currencyDd').text().trim()).to.be.equals('EUR');
                });

                it('Try to save payment with empty paidAmount', function () {
                    var $saveBtn = $('#create-payment-dialog');
                    var spyResponse;

                    mainSpy.reset();

                    $saveBtn.click();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please, enter Paid Amount!');
                });

                it('Try to save payment with 400 status error response', function () {
                    var $saveBtn = $('#create-payment-dialog');
                    var paymentUrl = '/payment/';
                    var $dialog = $('.ui-dialog');
                    var $amountInput = $dialog.find('#paidAmount');

                    $amountInput.val('5000');

                    server.respondWith('POST', paymentUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                });

                it('Try to save payment with 400 status error response', function () {
                    var $saveBtn = $('#create-payment-dialog');
                    var paymentUrl = '/payment/';
                    var $dialog = $('.ui-dialog');
                    var $amountInput = $dialog.find('#paidAmount');

                    $amountInput.val('5000');

                    server.respondWith('POST', paymentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/DividendPayments/list');
                });

            });
        });
    });
});