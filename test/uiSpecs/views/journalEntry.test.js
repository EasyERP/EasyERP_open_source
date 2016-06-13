define([
    'Underscore',
    'text!fixtures/index.html',
    'collections/journalEntry/filterCollection',
    'views/main/MainView',
    'views/journalEntry/list/ListView',
    'views/journalEntry/TopBarView',
    'views/Filter/filterView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (_, fixtures, JournalEntryCollection, MainView, ListView, TopBarView, FilterView, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;

    var modules = [
        {
            "_id"        : 19,
            "attachments": [],
            "link"       : false,
            "mname"      : "Sales",
            "parrent"    : null,
            "sequence"   : 1,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Sales"
        }, {
            "_id"        : 36,
            "attachments": [],
            "link"       : false,
            "mname"      : "Project",
            "parrent"    : null,
            "sequence"   : 2,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Project"
        }, {
            "_id"        : 9,
            "attachments": [],
            "link"       : false,
            "mname"      : "HR",
            "parrent"    : null,
            "sequence"   : 3,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "HR"
        }, {
            "_id"        : 49,
            "attachments": [],
            "htref"      : "persons",
            "link"       : true,
            "mname"      : "Persons",
            "parrent"    : 19,
            "sequence"   : 7,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Persons"
        }, {
            "_id"        : 50,
            "attachments": [],
            "htref"      : "persons",
            "link"       : true,
            "mname"      : "Companies",
            "parrent"    : 19,
            "sequence"   : 8,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Companies"
        }, {
            "_id"        : 24,
            "attachments": [],
            "link"       : true,
            "mname"      : "Leads",
            "parrent"    : 19,
            "sequence"   : 9,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Leads"
        }, {
            "_id"        : 25,
            "attachments": [],
            "link"       : true,
            "mname"      : "Opportunities",
            "parrent"    : 19,
            "sequence"   : 10,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Opportunities"
        }, {
            "_id"        : 39,
            "attachments": [],
            "link"       : true,
            "mname"      : "Projects",
            "parrent"    : 36,
            "sequence"   : 23,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Projects"
        }, {
            "_id"        : 40,
            "attachments": [],
            "link"       : true,
            "mname"      : "Tasks",
            "parrent"    : 36,
            "sequence"   : 24,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Tasks"
        }, {
            "_id"        : 29,
            "attachments": [],
            "link"       : true,
            "mname"      : "Dashboard",
            "parrent"    : 19,
            "sequence"   : 29,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Dashboard"
        }, {
            "_id"        : 42,
            "attachments": [],
            "link"       : true,
            "mname"      : "Employees",
            "parrent"    : 9,
            "sequence"   : 29,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Employees"
        }, {
            "_id"        : 43,
            "attachments": [],
            "link"       : true,
            "mname"      : "Applications",
            "parrent"    : 9,
            "sequence"   : 30,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Applications"
        }, {
            "_id"        : 14,
            "attachments": [],
            "link"       : true,
            "mname"      : "Job Positions",
            "parrent"    : 9,
            "sequence"   : 32,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "JobPositions"
        }, {
            "_id"        : 15,
            "attachments": [],
            "link"       : true,
            "mname"      : "Groups",
            "parrent"    : 1,
            "sequence"   : 33,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Departments"
        }, {
            "_id"        : 7,
            "__v"        : 0,
            "attachments": [],
            "link"       : true,
            "mname"      : "Users",
            "parrent"    : 1,
            "sequence"   : 42,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Users"
        }, {
            "_id"        : 44,
            "attachments": [],
            "link"       : true,
            "mname"      : "Workflows",
            "parrent"    : 1,
            "sequence"   : 44,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Workflows"
        }, {
            "_id"        : 51,
            "attachments": [],
            "link"       : true,
            "mname"      : "Profiles",
            "parrent"    : 1,
            "sequence"   : 51,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Profiles"
        }, {
            "_id"        : 52,
            "attachments": [],
            "link"       : true,
            "mname"      : "Birthdays",
            "parrent"    : 9,
            "sequence"   : 52,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Birthdays"
        }, {
            "_id"        : 53,
            "attachments": [],
            "link"       : true,
            "mname"      : "Dashboard",
            "parrent"    : 36,
            "sequence"   : 53,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "projectDashboard"
        }, {
            "_id"      : 54,
            "mname"    : "Purchases",
            "sequence" : 54,
            "parrent"  : null,
            "link"     : false,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Purchases"
        }, {
            "_id"      : 80,
            "mname"    : "Jobs Dashboard",
            "sequence" : 54,
            "parrent"  : 36,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "jobsDashboard"
        }, {
            "_id"      : 55,
            "mname"    : "Quotation",
            "sequence" : 55,
            "parrent"  : 54,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Quotation"
        }, {
            "_id"      : 57,
            "mname"    : "Order",
            "sequence" : 56,
            "parrent"  : 54,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Order"
        }, {
            "_id"      : 56,
            "mname"    : "Invoice",
            "sequence" : 57,
            "parrent"  : 54,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Invoice"
        }, {
            "_id"      : 58,
            "mname"    : "Product",
            "sequence" : 58,
            "parrent"  : 54,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Product"
        }, {
            "_id"      : 59,
            "mname"    : "Accounting",
            "sequence" : 59,
            "parrent"  : null,
            "link"     : false,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Accounting"
        }, {
            "_id"      : 60,
            "mname"    : "Supplier Payments",
            "sequence" : 60,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "supplierPayments"
        }, {
            "_id"      : 61,
            "mname"    : "Customer Payments",
            "sequence" : 61,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "customerPayments"
        }, {
            "_id"      : 62,
            "mname"    : "Quotation",
            "sequence" : 62,
            "parrent"  : 19,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "salesQuotation"
        }, {
            "_id"      : 63,
            "mname"    : "Order",
            "sequence" : 63,
            "parrent"  : 19,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "salesOrder"
        }, {
            "_id"      : 64,
            "mname"    : "Invoice",
            "sequence" : 64,
            "parrent"  : 19,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "salesInvoice"
        }, {
            "_id"      : 68,
            "mname"    : "MonthHours",
            "sequence" : 68,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "monthHours"
        }, {
            "_id"      : 69,
            "mname"    : "Holidays",
            "sequence" : 69,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Holiday"
        }, {
            "_id"      : 77,
            "mname"    : "Capacity",
            "sequence" : 69,
            "parrent"  : 9,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Capacity"
        }, {
            "_id"      : 88,
            "mname"    : "Salary Report",
            "sequence" : 69,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "salaryReport"
        }, {
            "_id"      : 70,
            "mname"    : "Vacation",
            "sequence" : 70,
            "parrent"  : 9,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Vacation"
        }, {
            "_id"      : 71,
            "mname"    : "Attendance",
            "sequence" : 71,
            "parrent"  : 9,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Attendance"
        }, {
            "_id"      : 76,
            "mname"    : "Efficiency",
            "sequence" : 72,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Efficiency"
        }, {
            "_id"      : 72,
            "mname"    : "BonusType",
            "sequence" : 73,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "bonusType"
        }, {
            "_id"      : 74,
            "mname"    : "HrDashboard",
            "sequence" : 74,
            "parrent"  : 9,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "HrDashboard"
        }, {
            "_id"      : 66,
            "mname"    : "Payroll Expenses",
            "sequence" : 77,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "PayrollExpenses"
        }, {
            "_id"      : 78,
            "mname"    : "Payroll",
            "sequence" : 78,
            "parrent"  : null,
            "link"     : false,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Payroll"
        }, {
            "_id"      : 79,
            "mname"    : "Payroll Payments",
            "sequence" : 79,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "PayrollPayments"
        }, {
            "_id"      : 82,
            "mname"    : "Invoice Aging",
            "sequence" : 82,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "invoiceAging"
        }, {
            "_id"      : 83,
            "mname"    : "ChartOfAccount",
            "sequence" : 83,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "ChartOfAccount"
        }, {
            "_id"      : 85,
            "mname"    : "Journal",
            "sequence" : 85,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "journal"
        }, {
            "_id"      : 86,
            "mname"    : "Journal Entry",
            "sequence" : 86,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "journalEntry"
        }, {
            "_id"      : 87,
            "mname"    : "Invoice Charts",
            "sequence" : 87,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "invoiceCharts"
        }, {
            "_id"        : 1,
            "__v"        : 0,
            "attachments": [],
            "link"       : false,
            "mname"      : "Settings",
            "parrent"    : null,
            "sequence"   : 1000,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Settings"
        }, {
            "_id"      : 75,
            "mname"    : "tCard",
            "sequence" : 1000,
            "parrent"  : 36,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "wTrack"
        }, {
            "_id"      : 84,
            "mname"    : "Categories",
            "sequence" : 1000,
            "parrent"  : 1,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "productSettings"
        }, {
            "_id"      : 73,
            "mname"    : "DashBoardVacation",
            "sequence" : 1001,
            "parrent"  : 36,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "DashBoardVacation"
        }];
    var fakeJournalEntry = [
        {
            _id           : "572b5a78c7389cfa5172a6af",
            debit         : 13300,
            sourceDocument: {
                model  : "Invoice",
                _id    : {
                    _id             : "568bb6af7c0383e04c60e892",
                    _type           : "wTrackInvoice",
                    __v             : 0,
                    project         : "55b92ad621e4b7c40f00068c",
                    products        : [
                        {
                            subTotal   : 13300,
                            unitPrice  : 13300,
                            taxes      : 0,
                            jobs       : "568bb6047c0383e04c60e88b",
                            description: "",
                            product    : "5540d528dacb551c24000003",
                            quantity   : 19
                        }
                    ],
                    editedBy        : {
                        date: "2016-03-14T07:55:20.865Z",
                        user: "55bf144765cda0810b000005"
                    },
                    createdBy       : {
                        date: "2016-01-05T12:27:04.595Z",
                        user: "55bf144765cda0810b000005"
                    },
                    creationDate    : "2016-01-05T12:27:04.595Z",
                    groups          : {
                        group: [],
                        users: [],
                        owner: "560c099da5d4a2e20ba5068b"
                    },
                    whoCanRW        : "everyOne",
                    workflow        : "55647d982e4aa3804a765ecb",
                    payments        : [
                        "56e66e6d3d5bc25541857e14"
                    ],
                    paymentInfo     : {
                        taxes  : 0,
                        unTaxed: 13300,
                        balance: 0,
                        total  : 13300
                    },
                    paymentTerms    : null,
                    salesPerson     : "55b92ad221e4b7c40f000063",
                    currency        : {
                        _id : "565eab29aeb95fa9c0f9df2d",
                        rate: 1
                    },
                    journal         : "565ef6ba270f53d02ee71d65",
                    invoiceDate     : "2016-01-01T04:00:00.000Z",
                    paymentReference: "PO651",
                    sourceDocument  : "568bb6987c0383e04c60e891",
                    supplier        : "55b92ad521e4b7c40f000621",
                    forSales        : true,
                    name            : "26780540",
                    dueDate         : "2016-01-15T04:00:00.000Z",
                    paymentDate     : "2016-01-08T04:00:00.000Z",
                    approved        : true,
                    reconcile       : true,
                    attachments     : [],
                    removable       : false
                },
                subject: {
                    _id           : "55b92ad521e4b7c40f000621",
                    ID            : 22,
                    companyInfo   : {
                        size    : null,
                        industry: null
                    },
                    editedBy      : {
                        date: "2015-07-29T19:34:45.999Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy     : {
                        date: "2015-07-29T19:34:45.999Z",
                        user: "52203e707d4dba8813000003"
                    },
                    history       : [],
                    attachments   : [],
                    notes         : [],
                    groups        : {
                        group: [],
                        users: [],
                        owner: null
                    },
                    whoCanRW      : "everyOne",
                    social        : {
                        LI: "",
                        FB: ""
                    },
                    color         : "#4d5a75",
                    relatedUser   : null,
                    salesPurchases: {
                        receiveMessages: 0,
                        language       : "English",
                        reference      : "",
                        active         : true,
                        implementedBy  : null,
                        salesTeam      : null,
                        salesPerson    : null,
                        isSupplier     : false,
                        isCustomer     : true
                    },
                    title         : "",
                    internalNotes : "",
                    contacts      : [],
                    phones        : {
                        fax   : "",
                        mobile: "",
                        phone : ""
                    },
                    skype         : "",
                    jobPosition   : "",
                    website       : "",
                    address       : {
                        country: null,
                        zip    : "",
                        state  : "",
                        city   : "",
                        street : ""
                    },
                    timezone      : "UTC",
                    department    : null,
                    company       : null,
                    email         : "",
                    imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    name          : {
                        last : "",
                        first: "Mike Allstar"
                    },
                    isOwn         : false,
                    type          : "Person",
                    __v           : 0
                },
                name   : "26780540"
            },
            currency      : {
                rate: 1,
                name: "USD"
            },
            account       : {
                _id     : "565eb53a6aa50532e5df0bc9",
                code    : 101200,
                account : "Account Receivable",
                type    : "Receivable",
                name    : "101200 Account Receivable",
                editedBy: {
                    date: "2015-12-02T14:21:11.878Z",
                    user: "52203e707d4dba8813000003"
                }
            },
            journal       : {
                name         : "Invoice Journal",
                creditAccount: {
                    _id    : "565eb53a6aa50532e5df0be0",
                    code   : 200000,
                    account: "Product Sales",
                    type   : "Income",
                    name   : "200000 Product Sales"
                },
                debitAccount : {
                    _id     : "565eb53a6aa50532e5df0bc9",
                    code    : 101200,
                    account : "Account Receivable",
                    type    : "Receivable",
                    name    : "101200 Account Receivable",
                    editedBy: {
                        date: "2015-12-02T14:21:11.878Z",
                        user: "52203e707d4dba8813000003"
                    }
                }
            },
            date          : "2016-01-01T04:00:00.000Z"
        },
        {
            _id           : "572b5a78c7389cfa5172a549",
            debit         : 14400,
            sourceDocument: {
                model  : "Invoice",
                _id    : {
                    _id             : "568a4fce3cce9254776f2b44",
                    _type           : "wTrackInvoice",
                    __v             : 0,
                    project         : "55b92ad621e4b7c40f000672",
                    products        : [
                        {
                            unitPrice  : 7200,
                            subTotal   : 7200,
                            taxes      : 0,
                            jobs       : "568a3ce63cce9254776f2b36",
                            description: "",
                            product    : "5540d528dacb551c24000003",
                            quantity   : 8
                        },
                        {
                            unitPrice  : 7200,
                            subTotal   : 7200,
                            taxes      : 0,
                            jobs       : "568a3cb63cce9254776f2b34",
                            description: "",
                            product    : "5540d528dacb551c24000003",
                            quantity   : 8
                        }
                    ],
                    editedBy        : {
                        date: "2016-01-05T12:16:46.819Z",
                        user: "55bf144765cda0810b000005"
                    },
                    createdBy       : {
                        date: "2016-01-04T10:55:21.506Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate    : "2016-01-04T10:55:21.506Z",
                    groups          : {
                        group: [],
                        users: [],
                        owner: "560c099da5d4a2e20ba5068b"
                    },
                    whoCanRW        : "everyOne",
                    workflow        : "55647d982e4aa3804a765ecb",
                    payments        : [
                        "568bb4377c0383e04c60e880"
                    ],
                    paymentInfo     : {
                        taxes  : 0,
                        unTaxed: 14400,
                        balance: 0,
                        total  : 14400
                    },
                    paymentTerms    : null,
                    salesPerson     : "55b92ad221e4b7c40f000063",
                    currency        : {
                        _id : "565eab29aeb95fa9c0f9df2d",
                        rate: 1
                    },
                    journal         : "565ef6ba270f53d02ee71d65",
                    invoiceDate     : "2016-01-03T04:00:00.000Z",
                    paymentReference: "PO647",
                    sourceDocument  : "568a4f993cce9254776f2b43",
                    supplier        : "55b92ad521e4b7c40f000621",
                    forSales        : true,
                    name            : "26662835",
                    dueDate         : "2016-01-18T23:00:00.000Z",
                    paymentDate     : "2016-01-04T04:00:00.000Z",
                    approved        : true,
                    reconcile       : true,
                    attachments     : [],
                    removable       : false
                },
                subject: {
                    _id           : "55b92ad521e4b7c40f000621",
                    ID            : 22,
                    companyInfo   : {
                        size    : null,
                        industry: null
                    },
                    editedBy      : {
                        date: "2015-07-29T19:34:45.999Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy     : {
                        date: "2015-07-29T19:34:45.999Z",
                        user: "52203e707d4dba8813000003"
                    },
                    history       : [],
                    attachments   : [],
                    notes         : [],
                    groups        : {
                        group: [],
                        users: [],
                        owner: null
                    },
                    whoCanRW      : "everyOne",
                    social        : {
                        LI: "",
                        FB: ""
                    },
                    color         : "#4d5a75",
                    relatedUser   : null,
                    salesPurchases: {
                        receiveMessages: 0,
                        language       : "English",
                        reference      : "",
                        active         : true,
                        implementedBy  : null,
                        salesTeam      : null,
                        salesPerson    : null,
                        isSupplier     : false,
                        isCustomer     : true
                    },
                    title         : "",
                    internalNotes : "",
                    contacts      : [],
                    phones        : {
                        fax   : "",
                        mobile: "",
                        phone : ""
                    },
                    skype         : "",
                    jobPosition   : "",
                    website       : "",
                    address       : {
                        country: null,
                        zip    : "",
                        state  : "",
                        city   : "",
                        street : ""
                    },
                    timezone      : "UTC",
                    department    : null,
                    company       : null,
                    email         : "",
                    imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    name          : {
                        last : "",
                        first: "Mike Allstar"
                    },
                    isOwn         : false,
                    type          : "Person",
                    __v           : 0
                },
                name   : "26662835"
            },
            currency      : {
                rate: 1,
                name: "USD"
            },
            account       : {
                _id     : "565eb53a6aa50532e5df0bc9",
                code    : 101200,
                account : "Account Receivable",
                type    : "Receivable",
                name    : "101200 Account Receivable",
                editedBy: {
                    date: "2015-12-02T14:21:11.878Z",
                    user: "52203e707d4dba8813000003"
                }
            },
            journal       : {
                name         : "Invoice Journal",
                creditAccount: {
                    _id    : "565eb53a6aa50532e5df0be0",
                    code   : 200000,
                    account: "Product Sales",
                    type   : "Income",
                    name   : "200000 Product Sales"
                },
                debitAccount : {
                    _id     : "565eb53a6aa50532e5df0bc9",
                    code    : 101200,
                    account : "Account Receivable",
                    type    : "Receivable",
                    name    : "101200 Account Receivable",
                    editedBy: {
                        date: "2015-12-02T14:21:11.878Z",
                        user: "52203e707d4dba8813000003"
                    }
                }
            },
            date          : "2016-01-03T04:00:00.000Z"
        },
        {
            _id           : "572b5a77c7389cfa5172a3b1",
            debit         : 432000,
            sourceDocument: {
                model  : "Invoice",
                _id    : {
                    _id             : "56a15c402208b3af4a527286",
                    _type           : "wTrackInvoice",
                    __v             : 0,
                    project         : "55b92ad621e4b7c40f00067f",
                    products        : [
                        {
                            subTotal   : 432000,
                            unitPrice  : 432000,
                            taxes      : 0,
                            jobs       : "5661f62225e5eb511510bb41",
                            description: "",
                            product    : "5540d528dacb551c24000003",
                            quantity   : 256
                        }
                    ],
                    editedBy        : {
                        date: "2016-02-12T09:38:12.564Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy       : {
                        date: "2016-01-21T22:31:14.602Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    creationDate    : "2016-01-21T22:31:14.602Z",
                    groups          : {
                        group: [],
                        users: [],
                        owner: "560c099da5d4a2e20ba5068b"
                    },
                    whoCanRW        : "everyOne",
                    workflow        : "55647d982e4aa3804a765ecb",
                    payments        : [
                        "56bda818dfd8a81466e2f50a"
                    ],
                    paymentInfo     : {
                        taxes  : 0,
                        unTaxed: 432000,
                        balance: 0,
                        total  : 432000
                    },
                    paymentTerms    : null,
                    salesPerson     : "55b92ad221e4b7c40f00004a",
                    currency        : {
                        _id : "565eab29aeb95fa9c0f9df2d",
                        rate: 1
                    },
                    journal         : "565ef6ba270f53d02ee71d65",
                    invoiceDate     : "2016-01-03T04:00:00.000Z",
                    paymentReference: "PO701",
                    sourceDocument  : "56a15c322208b3af4a527285",
                    supplier        : "55b92ad621e4b7c40f000624",
                    forSales        : true,
                    name            : "A0104012016",
                    dueDate         : "2016-01-17T04:00:00.000Z",
                    paymentDate     : "2016-01-10T04:00:00.000Z",
                    approved        : true,
                    reconcile       : true,
                    attachments     : [],
                    removable       : false
                },
                subject: {
                    _id           : "55b92ad621e4b7c40f000624",
                    ID            : 37,
                    companyInfo   : {
                        size    : null,
                        industry: null
                    },
                    editedBy      : {
                        date: "2015-07-29T19:34:46.000Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy     : {
                        date: "2015-07-29T19:34:46.000Z",
                        user: "52203e707d4dba8813000003"
                    },
                    history       : [],
                    attachments   : [],
                    notes         : [],
                    groups        : {
                        group: [],
                        users: [],
                        owner: null
                    },
                    whoCanRW      : "everyOne",
                    social        : {
                        LI: "",
                        FB: ""
                    },
                    color         : "#4d5a75",
                    relatedUser   : null,
                    salesPurchases: {
                        receiveMessages: 0,
                        language       : "English",
                        reference      : "",
                        active         : true,
                        implementedBy  : null,
                        salesTeam      : null,
                        salesPerson    : null,
                        isSupplier     : false,
                        isCustomer     : true
                    },
                    title         : "",
                    internalNotes : "",
                    contacts      : [],
                    phones        : {
                        fax   : "",
                        mobile: "",
                        phone : ""
                    },
                    skype         : "",
                    jobPosition   : "",
                    website       : "",
                    address       : {
                        country: "France",
                        zip    : "",
                        state  : "",
                        city   : "",
                        street : ""
                    },
                    timezone      : "UTC",
                    department    : null,
                    company       : null,
                    email         : "",
                    imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    name          : {
                        last : "",
                        first: "Giroptic"
                    },
                    isOwn         : false,
                    type          : "Person",
                    __v           : 0
                },
                name   : "A0104012016"
            },
            currency      : {
                rate: 1,
                name: "USD"
            },
            account       : {
                _id     : "565eb53a6aa50532e5df0bc9",
                code    : 101200,
                account : "Account Receivable",
                type    : "Receivable",
                name    : "101200 Account Receivable",
                editedBy: {
                    date: "2015-12-02T14:21:11.878Z",
                    user: "52203e707d4dba8813000003"
                }
            },
            journal       : {
                name         : "Invoice Journal",
                creditAccount: {
                    _id    : "565eb53a6aa50532e5df0be0",
                    code   : 200000,
                    account: "Product Sales",
                    type   : "Income",
                    name   : "200000 Product Sales"
                },
                debitAccount : {
                    _id     : "565eb53a6aa50532e5df0bc9",
                    code    : 101200,
                    account : "Account Receivable",
                    type    : "Receivable",
                    name    : "101200 Account Receivable",
                    editedBy: {
                        date: "2015-12-02T14:21:11.878Z",
                        user: "52203e707d4dba8813000003"
                    }
                }
            },
            date          : "2016-01-03T04:00:00.000Z"
        }
    ];
    var fakeInvoiceForForm = {
        _id             : "568bb6af7c0383e04c60e892",
        _type           : "wTrackInvoice",
        __v             : 0,
        project         : {
            _id: "55b92ad621e4b7c40f00068c"
        },
        products        : [
            {
                subTotal   : 13300,
                unitPrice  : 13300,
                taxes      : 0,
                jobs       : {
                    _id      : "568bb6047c0383e04c60e88b",
                    invoice  : "568bb6af7c0383e04c60e892",
                    quotation: "568bb6987c0383e04c60e891",
                    budget   : {
                        budgetTotal: {
                            minDate   : 201553,
                            maxDate   : 201553,
                            hoursSum  : 19,
                            revenueSum: 13300,
                            costSum   : 0
                        },
                        projectTeam: [
                            {
                                budget    : {
                                    hoursSum  : 19,
                                    revenueSum: 13300,
                                    costSum   : 0
                                },
                                employee  : {
                                    name       : {
                                        first: "Sergiy",
                                        last : "Tilishevsky"
                                    },
                                    jobPosition: {
                                        name: "Junior QA",
                                        _id : "55b92acf21e4b7c40f000018"
                                    },
                                    _id        : "55b92ad221e4b7c40f000064"
                                },
                                department: {
                                    departmentName: "QA",
                                    _id           : "55b92ace21e4b7c40f000011"
                                }
                            }
                        ]
                    },
                    project  : "55b92ad621e4b7c40f00068c",
                    wTracks  : [
                        "568bb6307c0383e04c60e88c"
                    ],
                    type     : "Invoiced",
                    workflow : "56337c675d49d8d6537832ea",
                    name     : "53 week",
                    __v      : 0,
                    editedBy : {
                        date: "2016-03-29T14:08:57.028Z",
                        user: "55bf144765cda0810b000005"
                    },
                    createdBy: {
                        user: null,
                        date: "2016-01-05T12:25:20.630Z"
                    }
                },
                description: "",
                product    : {
                    _id              : "5540d528dacb551c24000003",
                    editedBy         : {
                        date: "2015-10-30T14:18:42.379Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy        : {
                        date: "2015-04-29T12:57:12.785Z",
                        user: null
                    },
                    creationDate     : "2015-04-29T12:57:12.785Z",
                    groups           : {
                        group: [],
                        users: [],
                        owner: "560c099da5d4a2e20ba5068b"
                    },
                    whoCanRW         : "everyOne",
                    workflow         : null,
                    info             : {
                        description: "",
                        barcode    : "",
                        isActive   : true,
                        salePrice  : 0,
                        productType: "Service"
                    },
                    name             : "IT services",
                    imageSrc         : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    canBePurchased   : true,
                    eventSubscription: true,
                    canBeExpensed    : true,
                    canBeSold        : true,
                    __v              : 0,
                    accounting       : {
                        category: {
                            name: ""
                        }
                    }
                },
                quantity   : 19
            }
        ],
        editedBy        : {
            date: "2016-03-14T07:55:20.865Z",
            user: {
                _id            : "55bf144765cda0810b000005",
                profile        : 1387275598000,
                kanbanSettings : {
                    tasks        : {
                        foldWorkflows: [],
                        countPerPage : 10
                    },
                    applications : {
                        foldWorkflows: [],
                        countPerPage : 5
                    },
                    opportunities: {
                        foldWorkflows: [],
                        countPerPage : 10
                    }
                },
                credentials    : {
                    access_token : "",
                    refresh_token: ""
                },
                pass           : "ebe5ffd65e0e1de96e45a13e645646812c9ba15ba57d28a1cc3886365d948c26",
                email          : "yana.gusti@thinkmobiles.com",
                login          : "yana.gusti",
                imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                __v            : 0,
                lastAccess     : "2016-05-17T13:32:44.013Z",
                savedFilters   : [
                    {
                        _id      : null,
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5624c55fe9576d1728a9ed40",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5624c78a25f58a237fd5b4d2",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "562df97d129820ab5994e8fb",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "562f6e8071c88830607cd587",
                        viewType : "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "565c5e853410ae512364dbb1",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "566010ba6226e3c43108dbe1",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56618b467d284423697e2bf8",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "566191577d284423697e2d88",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "566e7a4a8453e8b464b70914",
                        viewType : "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56efa708fed15a0833469c69",
                        viewType : "",
                        byDefault: "wTrack"
                    }
                ],
                relatedEmployee: null
            }
        },
        createdBy       : {
            date: "2016-01-05T12:27:04.595Z",
            user: {
                _id            : "55bf144765cda0810b000005",
                profile        : 1387275598000,
                kanbanSettings : {
                    tasks        : {
                        foldWorkflows: [],
                        countPerPage : 10
                    },
                    applications : {
                        foldWorkflows: [],
                        countPerPage : 5
                    },
                    opportunities: {
                        foldWorkflows: [],
                        countPerPage : 10
                    }
                },
                credentials    : {
                    access_token : "",
                    refresh_token: ""
                },
                pass           : "ebe5ffd65e0e1de96e45a13e645646812c9ba15ba57d28a1cc3886365d948c26",
                email          : "yana.gusti@thinkmobiles.com",
                login          : "yana.gusti",
                imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                __v            : 0,
                lastAccess     : "2016-05-17T13:32:44.013Z",
                savedFilters   : [
                    {
                        _id      : null,
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5624c55fe9576d1728a9ed40",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5624c78a25f58a237fd5b4d2",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "562df97d129820ab5994e8fb",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "562f6e8071c88830607cd587",
                        viewType : "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "565c5e853410ae512364dbb1",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "566010ba6226e3c43108dbe1",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56618b467d284423697e2bf8",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "566191577d284423697e2d88",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "566e7a4a8453e8b464b70914",
                        viewType : "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56efa708fed15a0833469c69",
                        viewType : "",
                        byDefault: "wTrack"
                    }
                ],
                relatedEmployee: null
            }
        },
        creationDate    : "2016-01-05T12:27:04.595Z",
        groups          : {
            group: [],
            users: [],
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        whoCanRW        : "everyOne",
        workflow        : {
            _id   : "55647d982e4aa3804a765ecb",
            status: "Done",
            name  : "Paid"
        },
        payments        : [
            {
                _id       : "56e66e6d3d5bc25541857e14",
                paymentRef: "",
                name      : "PP_289",
                date      : "2016-01-08T04:00:00.000Z",
                paidAmount: 13300
            }
        ],
        paymentInfo     : {
            taxes  : 0,
            unTaxed: 13300,
            balance: 0,
            total  : 13300
        },
        paymentTerms    : null,
        salesPerson     : "55b92ad221e4b7c40f000063",
        currency        : {
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                name    : "USD",
                sequence: 0
            },
            rate: 1
        },
        journal         : "565ef6ba270f53d02ee71d65",
        invoiceDate     : "2016-01-01T04:00:00.000Z",
        paymentReference: "PO651",
        sourceDocument  : {
            _id           : "568bb6987c0383e04c60e891",
            expectedDate  : "2016-01-04T23:00:00.000Z",
            editedBy      : {
                date: "2016-01-05T12:27:27.637Z",
                user: "55bf144765cda0810b000005"
            },
            createdBy     : {
                date: "2016-01-05T12:27:04.595Z",
                user: "55bf144765cda0810b000005"
            },
            creationDate  : "2016-01-05T12:27:04.595Z",
            groups        : {
                group: [],
                users: [],
                owner: "560c099da5d4a2e20ba5068b"
            },
            whoCanRW      : "everyOne",
            workflow      : "55647b962e4aa3804a765ec6",
            products      : [
                {
                    scheduledDate: "2016-01-04T23:00:00.000Z",
                    jobs         : "568bb6047c0383e04c60e88b",
                    description  : "",
                    product      : "5540d528dacb551c24000003",
                    unitPrice    : 13300,
                    subTotal     : 13300,
                    taxes        : 0,
                    quantity     : 19
                }
            ],
            paymentInfo   : {
                total  : 13300,
                unTaxed: 13300,
                taxes  : 0
            },
            paymentTerm   : null,
            invoiceRecived: false,
            invoiceControl: null,
            incoterm      : null,
            destination   : null,
            name          : "PO651",
            orderDate     : "2016-01-04T23:00:00.000Z",
            deliverTo     : "55543831d51bdef79ea0d58c",
            project       : "55b92ad621e4b7c40f00068c",
            supplier      : "55b92ad521e4b7c40f000621",
            isOrder       : true,
            type          : "Not Invoiced",
            forSales      : true,
            currency      : {
                _id : "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            __v           : 0
        },
        supplier        : {
            _id : "55b92ad521e4b7c40f000621",
            name: {
                last : "",
                first: "Mike Allstar"
            }
        },
        forSales        : true,
        name            : "26780540",
        dueDate         : "2016-01-15T04:00:00.000Z",
        paymentDate     : "2016-01-08T04:00:00.000Z",
        approved        : true,
        reconcile       : true,
        attachments     : [],
        removable       : false
    };
    var journalEntryCollection;
    var view;
    var topBarView;
    var listView;
    var setDateRangeSpy;
    var showDatePickerSpy;
    var reconcileSpy;
    // var debounceStub;

    chai.use(chaiJquery);
    chai.use(sinonChai);

    expect = chai.expect;

    describe('JournalEntry View', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            setDateRangeSpy = sinon.spy(TopBarView.prototype, 'setDateRange');
            showDatePickerSpy = sinon.spy(TopBarView.prototype, 'showDatePickers');
            reconcileSpy = sinon.spy(TopBarView.prototype, 'reconcile');
            //debounceStub = sinon.stub(_, 'debounce', function(debFunction){
            //    return debFunction;
            //});
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();

            setDateRangeSpy.restore();
            showDatePickerSpy.restore();
            reconcileSpy.restore();
            //debounceStub.restore();
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

        describe('TopBarView', function () {
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to create TopBarView', function (done) {
                var journalEntryUrl = new RegExp('journalEntries\/list', 'i');
                var journalTotalUrl = new RegExp('journalEntries\/totalCollectionLength', 'i');

                server.respondWith('GET', journalTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    count     : 3,
                    totalValue: 10000
                })]);
                server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournalEntry)]);
                journalEntryCollection = new JournalEntryCollection({
                    viewType: 'list',
                    page    : 1,
                    count   : 100
                });
                server.respond();
                server.respond();

                topBarView = new TopBarView({
                    collection: journalEntryCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;

                done();
            });

        });

        describe('journalEntry list view', function () {
            var server;
            var mainSpy;
            var clock;
            var renderSpy;
            var $thisEl;
            var selectSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                renderSpy = sinon.spy(ListView.prototype, 'render');
                selectSpy = sinon.spy(FilterView.prototype, 'selectValue');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();
                renderSpy.restore();
                selectSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create JournalEntry list view', function (done) {
                    var journalEntryUrl = new RegExp('journalEntries\/list', 'i');
                    var journalTotalUrl = new RegExp('journalEntries\/totalCollectionLength', 'i');

                    server.respondWith('GET', journalTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count     : 3,
                        totalValue: 10000
                    })]);
                    server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournalEntry)]);
                    listView = new ListView({
                        collection: journalEntryCollection,
                        startTime : new Date()
                    });
                    server.respond();
                    server.respond();
                    clock.tick(200);
                    $thisEl = listView.$el;

                    expect(renderSpy.calledOnce).to.be.true;
                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listFooter')).to.exist;

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

                    journalEntryCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to filter ListView', function () {
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var journalEntryUrl = new RegExp('journalEntries\/list', 'i');
                    var journalTotalUrl = new RegExp('journalEntries\/totalCollectionLength', 'i');
                    var $journal;
                    var $subject;
                    var $next;
                    var $prev;
                    var $selectedItem;

                    // open search dropdown
                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                    // select Journal filter
                    $journal = $searchContainer.find('#journalNameFullContainer > .groupName');
                    $journal.click();
                    $selectedItem = $searchContainer.find('#journalNameUl > li').first();

                    server.respondWith('GET', journalTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count     : 2,
                        totalValue: 10000
                    })]);
                    server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([
                        fakeJournalEntry[0],
                        fakeJournalEntry[1]
                    ])]);
                    $selectedItem.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);
                    expect(selectSpy.calledOnce).to.be.true;

                    // select Subject
                    $subject = $searchContainer.find('#sourceDocumentFullContainer > .groupName');
                    $subject.click();
                    $next = $searchContainer.find('.next');
                    $next.click();
                    expect($searchContainer.find('#sourceDocumentContainer .counter').text().trim()).to.be.equals('8-14 of 20');
                    $prev = $searchContainer.find('.prev');
                    $prev.click();
                    expect($searchContainer.find('#sourceDocumentContainer .counter').text().trim()).to.be.equals('1-7 of 20');
                    $selectedItem = $searchContainer.find('#sourceDocumentUl > li').first();

                    server.respondWith('GET', journalTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count     : 1,
                        totalValue: 10000
                    })]);
                    server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([
                        fakeJournalEntry[0]
                    ])]);
                    $selectedItem.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(1);
                    expect(selectSpy.calledTwice).to.be.true;

                    // unselect Subject filter
                    server.respondWith('GET', journalTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count     : 2,
                        totalValue: 10000
                    })]);
                    server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([
                        fakeJournalEntry[0],
                        fakeJournalEntry[1]
                    ])]);
                    $selectedItem = $searchContainer.find('#sourceDocumentUl > li').first();
                    $selectedItem.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);
                    expect(selectSpy.calledThrice).to.be.true;

                    // close filter dropdown
                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.class('hidden');
                });

                it('Try to remove Journal filter', function () {
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $closeBtn = $searchContainer.find('.removeValues');
                    var journalEntryUrl = new RegExp('journalEntries\/list', 'i');
                    var journalTotalUrl = new RegExp('journalEntries\/totalCollectionLength', 'i');

                    server.respondWith('GET', journalTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count     : 3,
                        totalValue: 10000
                    })]);
                    server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournalEntry)]);
                    $closeBtn.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                });

                it('Try to change date range', function (done) {
                    var $topBarEl = topBarView.$el;
                    var $updateDateBtn = $topBarEl.find('#updateDate');
                    var $dateRange = $topBarEl.find('.dateRange');
                    var journalEntryUrl = new RegExp('journalEntries\/list', 'i');
                    var journalTotalUrl = new RegExp('journalEntries\/totalCollectionLength', 'i');
                    var $cancelBtn;
                    var $thisMonth;
                    var $finYear;
                    var $lastMonth;
                    var $lastQuarter;
                    var $lastFinYear;
                    var $customDate;
                    var $startDate;
                    var $endDate;

                    server.respondWith('GET', journalTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count     : 3,
                        totalValue: 10000
                    })]);
                    server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournalEntry)]);
                    // open dateRange DropDown
                    $dateRange.click();
                    expect($topBarEl.find('.frameDetail')).to.not.have.class('hidden');

                    // open dateRange DropDown
                    $dateRange.click();
                    expect($topBarEl.find('.frameDetail')).to.have.class('hidden');

                    $dateRange.click();

                    $thisMonth = $topBarEl.find('#thisMonth');
                    $thisMonth.click();
                    server.respond();
                    expect(setDateRangeSpy.calledOnce).to.be.true;

                    $finYear = $topBarEl.find('#thisYear');
                    $finYear.click();
                    server.respond();
                    expect(setDateRangeSpy.calledTwice).to.be.true;

                    $lastMonth = $topBarEl.find('#lastMonth');
                    $lastMonth.click();
                    server.respond();
                    expect(setDateRangeSpy.calledThrice).to.be.true;

                    $lastQuarter = $topBarEl.find('#lastQuarter');
                    $lastQuarter.click();
                    server.respond();
                    expect(setDateRangeSpy.callCount).to.be.equals(4);

                    $lastFinYear = $topBarEl.find('#lastYear');
                    $lastFinYear.click();
                    server.respond();
                    expect(setDateRangeSpy.callCount).to.be.equals(5);

                    // open dateRange dropdown
                    $dateRange.click();

                    // cancel dateRange dropdown
                    $cancelBtn = $topBarEl.find('#cancelBtn');
                    $cancelBtn.click();

                    $dateRange.click();
                    $customDate = $topBarEl.find('#custom');
                    $customDate.click();
                    expect(showDatePickerSpy.calledOnce).to.be.true;

                    $startDate = $topBarEl.find('#startDate');
                    $startDate.datepicker('setDate', new Date('1 May, 2016'));
                    $startDate.change();

                    $endDate = $topBarEl.find('#endDate');
                    $endDate.datepicker('setDate', new Date('1 June, 2016'));
                    $endDate.change();

                    $updateDateBtn.click();
                    server.respond();

                    done();
                });

                it('Try to reconcile JournalEntry with reconcile btn have class "greenBtn"', function () {
                    var $topBarEl = topBarView.$el;
                    var $reconcileBtn = $topBarEl.find('#reconcileBtn');

                    mainSpy.reset();
                    reconcileSpy.reset();

                    $reconcileBtn.removeClass('btnAttention');
                    $reconcileBtn.addClass('greenBtn');

                    $reconcileBtn.click();

                    expect(reconcileSpy.calledOnce).to.be.true;
                    expect(reconcileSpy.args[0][0]).to.have.property('result', false);
                });

                it('Try to reconcile JournalEntry', function (done) {
                    var $topBarEl = topBarView.$el;
                    var $reconcileBtn = $topBarEl.find('#reconcileBtn');
                    var reconcileUrl = '/journalEntries/reconcile';
                    var spyResponse;

                    mainSpy.reset();

                    $reconcileBtn.removeClass('greenBtn');
                    $reconcileBtn.addClass('btnAttention');

                    server.respondWith('POST', reconcileUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: true})]);
                    $reconcileBtn.click();
                    server.respond();
                    clock.tick(200);

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'notify');
                    expect(spyResponse).to.have.property('message', 'Your request has been sent for processing. Please, wait few minutes.');

                    done();
                });

                it('Try to viewSourceDocument with error response', function () {
                    var $needDividendInvoice = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(5) > a');
                    var invoiceUrl = new RegExp('\/Invoice\/form', 'i');
                    var spyResponse;

                    mainSpy.reset();

                    server.respondWith('GET', invoiceUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $needDividendInvoice.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];

                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please refresh browser');
                });

                it('Try to viewSourceDocument with 200 status response', function (done) {
                    var $needDividendInvoice = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(5) > a');
                    var invoiceUrl = new RegExp('\/Invoice\/form', 'i');

                    App.currentUser = {
                        profile: {
                            _id: '1387275598000'
                        }
                    };

                    mainSpy.reset();

                    server.respondWith('GET', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoiceForForm)]);
                    $needDividendInvoice.click();
                    server.respond();

                    clock.tick(200);

                    expect($('.ui-dialog')).to.exist;

                    done();
                });
            });
        });
    });
});
