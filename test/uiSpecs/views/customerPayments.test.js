define([
    'text!fixtures/index.html',
    'collections/customerPayments/filterCollection',
    'views/main/MainView',
    'views/customerPayments/list/ListView',
    'views/customerPayments/TopBarView',
    'views/customerPayments/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (fixtures, CustomerPaymentsCollection, MainView, ListView, TopBarView, EditView, $, chai, chaiJquery, sinonChai) {
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
    var fakeCustomerPayments = [
        {
            _id: "573ad6da3c55369d62addcd1",
            _type: "ProformaPayment",
            period: null,
            paymentMethod: {
                _id: "565f2e05ab70d49024242e10",
                name: "CASH UAH",
                account: "CASH UAH",
                currency: "UAH",
                bank: "",
                owner: "CASH UAH"
            },
            supplier: {
                _id: "55ba0301d79a3a343900000d",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T10:57:05.119Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                createdBy: {
                    date: "2015-07-30T10:57:05.119Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                history: [ ],
                attachments: [ ],
                notes: [ ],
                groups: {
                    owner: "55b9fbcdd79a3a3439000007",
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
                website: "hashplay.net",
                address: {
                    country: "United States",
                    zip: "94107",
                    state: "California",
                    city: "San Francisco",
                    street: "350 Townsend St. 755"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "contact@hashplay.tv",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "#Play"
                },
                isOwn: false,
                type: "Company",
                __v: 0
            },
            paymentRef: "",
            forSale: true,
            currency: {
                rate: 25.42612,
                name: "UAH",
                _id: "565eab3faeb95fa9c0f9df2f"
            },
            differenceAmount: 0,
            workflow: "Paid",
            date: "2016-05-17T00:00:00.000Z",
            paidAmount: 20000,
            invoice: {
                _id: "573ad6c645310a4662c80051",
                workflow: {
                    _id: "56fabcf0e71823e438e4e1ca",
                    sequence: 3,
                    status: "Done",
                    name: "Invoiced",
                    wId: "Proforma",
                    visible: true,
                    __v: 0
                },
                name: "PO1054_1"
            },
            removable: false
        },
        {
            _id: "573af6a1efaa86d81d7a587b",
            _type: "InvoicePayment",
            period: null,
            paymentMethod: {
                _id: "565f2e05ab70d49024242e10",
                name: "CASH UAH",
                account: "CASH UAH",
                currency: "UAH",
                bank: "",
                owner: "CASH UAH"
            },
            supplier: {
                _id: "55cdc93c9b42266a4f000005",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-08-14T10:55:56.414Z",
                    user: "55b9dd237a3632120b000005"
                },
                createdBy: {
                    date: "2015-08-14T10:55:56.414Z",
                    user: "55b9dd237a3632120b000005"
                },
                history: [ ],
                attachments: [ ],
                notes: [ ],
                groups: {
                    owner: "55ba28c8d79a3a3439000016",
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
                website: "www.agilefind.com/",
                address: {
                    country: "United Kingdom",
                    zip: "",
                    state: "",
                    city: "London",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "AgileFind"
                },
                isOwn: false,
                type: "Company",
                __v: 0
            },
            paymentRef: "",
            forSale: true,
            currency: {
                rate: 25.39262,
                name: "UAH",
                _id: "565eab3faeb95fa9c0f9df2f"
            },
            differenceAmount: 48260.80569866362,
            workflow: "Paid",
            date: "2016-05-17T00:00:00.000Z",
            paidAmount: 50000,
            invoice: {
                _id: "573af67f7254d5421eb9560e",
                workflow: {
                    _id: "55647d952e4aa3804a765eca",
                    sequence: 3,
                    status: "In Progress",
                    name: "Partially Paid",
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
                name: "PO1058"
            },
            removable: true
        }
    ];
    var fakeSortedCustomerPayments = [
        {
        _id: "56ebe34142d9fc28253ef216",
        period: null,
        paymentMethod: {
            _id: "565f2e05ab70d49024242e10",
            name: "CASH UAH",
            account: "CASH UAH",
            currency: "UAH",
            bank: "",
            owner: "CASH UAH"
        },
        supplier: {
            _id: "569f603762d172544baf0d57",
            companyInfo: {
                industry: null
            },
            editedBy: {
                date: "2016-01-20T10:23:51.063Z",
                user: "561e37f7d6c741e8235f42cb"
            },
            createdBy: {
                date: "2016-01-20T10:23:51.063Z",
                user: "561e37f7d6c741e8235f42cb"
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
                LI: "https://www.linkedin.com/in/nahumnimrod?authType=NAME_SEARCH&authToken=yUvx&locale=en_US&trk=tyah&trkInfo=clickedVertical%3Amynetwork%2CclickedEntityId%3A150866939%2CauthType%3ANAME_SEARCH%2Cidx%3A1-1-1%2CtarId%3A1453285185948%2Ctas%3ANimrod%20Nahum",
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
                isCustomer: true
            },
            title: "",
            internalNotes: "",
            contacts: [ ],
            phones: {
                fax: "",
                mobile: "",
                phone: ""
            },
            skype: "nahum_nimrod",
            jobPosition: "",
            website: "",
            address: {
                country: "Israel",
                zip: "",
                state: "",
                city: "",
                street: ""
            },
            timezone: "UTC",
            department: null,
            company: "569f5fbf62d172544baf0d56",
            email: "nimrod.nahum@biscience.com",
            imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
            name: {
                last: "Nahum",
                first: "Nimrod"
            },
            isOwn: false,
            type: "Person",
            __v: 0
        },
        paymentRef: "",
        forSale: true,
        differenceAmount: 0,
        workflow: "Paid",
        date: "2016-03-18T00:00:00.000Z",
        paidAmount: 193200,
        invoice: {
            _id: "56e292493c074d636203bbd0",
            _type: "wTrackInvoice",
            __v: 0,
            project: "569f60d162d172544baf0d58",
            products: [
                {
                    subTotal: 1932,
                    unitPrice: 1932,
                    taxes: 0,
                    jobs: "56e291d1896e98a661aa831c",
                    description: "",
                    product: "5540d528dacb551c24000003",
                    quantity: 84
                }
            ],
            editedBy: {
                date: "2016-03-18T11:15:07.309Z",
                user: "561e37f7d6c741e8235f42cb"
            },
            createdBy: {
                date: "2016-03-11T09:38:59.834Z",
                user: "561e37f7d6c741e8235f42cb"
            },
            creationDate: "2016-03-11T09:38:59.834Z",
            groups: {
                group: [ ],
                users: [ ],
                owner: "560c099da5d4a2e20ba5068b"
            },
            whoCanRW: "everyOne",
            workflow: "55647d982e4aa3804a765ecb",
            payments: [
                "56ebe34142d9fc28253ef216"
            ],
            paymentInfo: {
                taxes: 0,
                unTaxed: 193200,
                balance: 0,
                total: 193200
            },
            paymentTerms: null,
            salesPerson: "561ba8639ebb48212ea838c4",
            currency: {
                rate: 1,
                _id: "565eab29aeb95fa9c0f9df2d"
            },
            journal: null,
            invoiceDate: "2016-03-11T00:00:00.000Z",
            paymentReference: "PO857",
            sourceDocument: "56e29233f9e1c56461b971d2",
            supplier: "569f603762d172544baf0d57",
            forSales: true,
            name: "PO857",
            dueDate: "2016-03-18T00:00:00.000Z",
            paymentDate: "2016-03-18T00:00:00.000Z"
        },
        assigned: {
            _id: "561ba8639ebb48212ea838c4",
            dateBirth: "1992-10-05T00:00:00.000Z",
            transferred: [ ],
            lastFire: null,
            fire: [
                {
                    date: "2015-10-11T21:00:00.000Z",
                    info: "Update",
                    salary: 600,
                    jobType: "fullTime",
                    manager: "55b92ad221e4b7c40f00004a",
                    jobPosition: "55b92acf21e4b7c40f00001f",
                    department: "55b92ace21e4b7c40f000014"
                }
            ],
            hire: [
                {
                    date: "2015-10-11T21:00:00.000Z",
                    info: "",
                    salary: 600,
                    jobType: "fullTime",
                    manager: "55b92ad221e4b7c40f00004a",
                    jobPosition: "55b92acf21e4b7c40f00001f",
                    department: "55b92ace21e4b7c40f000014"
                },
                {
                    date: "2015-12-11T22:00:00.000Z",
                    info: "плюс %",
                    salary: 450,
                    jobType: "fullTime",
                    manager: "55b92ad221e4b7c40f00004a",
                    jobPosition: "55b92acf21e4b7c40f00001f",
                    department: "55b92ace21e4b7c40f000014"
                }
            ],
            social: {
                FB: "",
                LI: ""
            },
            sequence: 162,
            jobType: "fullTime",
            gender: "male",
            marital: "unmarried",
            contractEnd: {
                date: "2015-10-12T12:32:35.919Z",
                reason: ""
            },
            attachments: [ ],
            editedBy: {
                date: "2016-03-11T14:03:45.967Z",
                user: "55ba2f3ed79a3a343900001d"
            },
            createdBy: {
                date: "2015-10-12T12:32:35.919Z",
                user: "55ba2f3ed79a3a343900001d"
            },
            creationDate: "2015-10-12T12:32:35.919Z",
            color: "#4d5a75",
            otherInfo: "",
            groups: {
                group: [ ],
                users: [ ],
                owner: "560c099da5d4a2e20ba5068b"
            },
            whoCanRW: "everyOne",
            workflow: null,
            active: false,
            referredBy: "",
            source: "www.rabota.ua",
            age: 23,
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
            manager: "55b92ad221e4b7c40f00004a",
            jobPosition: "55b92acf21e4b7c40f00001f",
            department: "55b92ace21e4b7c40f000014",
            visibility: "Public",
            relatedUser: "561e37f7d6c741e8235f42cb",
            officeLocation: "",
            skype: "natalia_yartush",
            workPhones: {
                phone: "",
                mobile: "+380974628318"
            },
            personalEmail: "n.yartysh@gmail.com",
            workEmail: "natalia.yartysh@thinkmobiles.com",
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
                last: "Yartysh",
                first: "Nataliya"
            },
            subject: "",
            imageSrc: "data:image/jpeg;base64,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",
            isEmployee: true,
            __v: 0
        }
    },
        {
        _id: "56eae89666a6a5573cd02d77",
        period: null,
        paymentMethod: {
            _id: "565f2e05ab70d49024242e10",
            name: "CASH UAH",
            account: "CASH UAH",
            currency: "UAH",
            bank: "",
            owner: "CASH UAH"
        },
        supplier: {
            _id: "55b92ad621e4b7c40f00063b",
            ID: 1063,
            companyInfo: {
                size: null,
                industry: null
            },
            editedBy: {
                date: "2015-07-29T19:34:46.014Z",
                user: "52203e707d4dba8813000003"
            },
            createdBy: {
                date: "2015-07-29T19:34:46.014Z",
                user: "52203e707d4dba8813000003"
            },
            history: [ ],
            attachments: [ ],
            notes: [ ],
            groups: {
                group: [ ],
                users: [ ],
                owner: null
            },
            whoCanRW: "everyOne",
            social: {
                LI: "",
                FB: ""
            },
            color: "#4d5a75",
            relatedUser: null,
            salesPurchases: {
                receiveMessages: 0,
                language: "English",
                reference: "",
                active: true,
                implementedBy: null,
                salesTeam: null,
                salesPerson: null,
                isSupplier: false,
                isCustomer: true
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
                country: "UAE",
                zip: "",
                state: "",
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
                first: "Foxtrapp"
            },
            isOwn: false,
            type: "Person",
            __v: 0
        },
        paymentRef: "",
        forSale: true,
        differenceAmount: 0,
        workflow: "Paid",
        date: "2016-03-17T00:00:00.000Z",
        paidAmount: 668400,
        invoice: {
            _id: "56eae875f2bfe8e73c41b3ff",
            _type: "wTrackInvoice",
            __v: 0,
            project: "55cb770bfea413b50b000008",
            products: [
                {
                    subTotal: 6684,
                    unitPrice: 6684,
                    taxes: 0,
                    jobs: "569eab1b2208b3af4a5271e8",
                    description: "",
                    product: "5540d528dacb551c24000003",
                    quantity: 1562
                }
            ],
            editedBy: {
                date: "2016-03-17T17:25:36.550Z",
                user: "56a72cafaa157ca50f21fb22"
            },
            createdBy: {
                date: "2016-01-27T12:49:25.506Z",
                user: "56a72cafaa157ca50f21fb22"
            },
            creationDate: "2016-01-27T12:49:25.506Z",
            groups: {
                group: [ ],
                users: [ ],
                owner: "55ba28c8d79a3a3439000016"
            },
            whoCanRW: "everyOne",
            workflow: "55647d982e4aa3804a765ecb",
            payments: [
                "56eae89666a6a5573cd02d77"
            ],
            paymentInfo: {
                taxes: 0,
                unTaxed: 668400,
                balance: 0,
                total: 668400
            },
            paymentTerms: null,
            salesPerson: "55b92ad221e4b7c40f00004a",
            currency: {
                rate: 1,
                _id: "565eab29aeb95fa9c0f9df2d"
            },
            journal: null,
            invoiceDate: "2016-03-17T00:00:00.000Z",
            paymentReference: "PO713",
            sourceDocument: "56a8bcd5aa157ca50f21fb28",
            supplier: "55b92ad621e4b7c40f00063b",
            forSales: true,
            name: "PO713",
            dueDate: "2016-03-17T00:00:00.000Z",
            paymentDate: "2016-03-17T00:00:00.000Z"
        },
        assigned: {
            _id: "55b92ad221e4b7c40f00004a",
            dateBirth: "1987-10-25T03:00:00.000Z",
            ID: 34,
            isLead: 2,
            fire: [
                {
                    date: "2014-05-25T21:00:00.000Z",
                    info: "Update",
                    salary: 600,
                    jobType: "Select",
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "55b92acf21e4b7c40f000024",
                    department: "55b92ace21e4b7c40f000014"
                }
            ],
            hire: [
                {
                    date: "2014-05-25T21:00:00.000Z",
                    info: "",
                    salary: 600,
                    jobType: "Select",
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "55b92acf21e4b7c40f000024",
                    department: "55b92ace21e4b7c40f000014"
                },
                {
                    date: "2014-07-31T21:00:00.000Z",
                    info: "плюс %",
                    salary: 450,
                    jobType: "Select",
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "55b92acf21e4b7c40f000024",
                    department: "55b92ace21e4b7c40f000014"
                }
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
                date: "2015-07-29T19:34:42.433Z",
                reason: ""
            },
            attachments: [ ],
            editedBy: {
                date: "2016-03-18T15:19:41.138Z",
                user: "55ba2f3ed79a3a343900001d"
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
            isEmployee: true,
            __v: 0
        }
    }
    ];

    var customerPaymentsCollection;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;

    describe('CustomerPayments View', function () {
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

                view = new MainView({el: $elFixture, contentType: 'customerPayments'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="61"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="61"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/customerPayments');

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
                var customerPaymentsUrl = new RegExp('\/payment\/customers\/list', 'i');

                server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomerPayments)]);

                customerPaymentsCollection = new CustomerPaymentsCollection({
                    viewType: 'list',
                    page: 1,
                    count: 100,
                    contentType: 'customerPayments'
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: customerPaymentsCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
            });
        });

        describe('CustomerPayments list view', function () {
            var server;
            var mainSpy;
            var clock;
            var $thisEl;

            before(function () {
                windowConfirmStub = sinon.stub(window, 'confirm');
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();
                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function(){

                it('Try to create customerPayments list view', function (done) {
                    var $listHolder;
                    var customerPaymentsUrl = new RegExp('\/payment\/customers\/list', 'i');

                    server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSortedCustomerPayments)]);

                    listView = new ListView({
                        collection: customerPaymentsCollection,
                        startTime: new Date(),
                        count: 100
                    });

                    server.respond();
                    clock.tick(200);

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.exist;

                    // bind events to topBar
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

                    // bind events to customerPayments collection
                    customerPaymentsCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to filter listView by Assigned and company', function(){
                    var $assigned;
                    var $company;
                    var $selectedItem;
                    var $closeBtn;
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var customerPaymentsUrl = new RegExp('\/payment\/customers\/list', 'i');

                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                    // select assigned
                    $assigned = $searchContainer.find('#assignedFullContainer > .groupName');
                    $assigned.click();
                    $selectedItem = $searchContainer.find('li[data-value="55b92ad221e4b7c40f0000cb"]');
                    server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeCustomerPayments[0], fakeCustomerPayments[1]])]);
                    $selectedItem.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);
                    expect($searchContainer.find('li[data-value="55b92ad221e4b7c40f0000cb"]')).to.have.class('checkedValue');

                    //select company
                    $company = $searchContainer.find('#supplierFullContainer > .groupName');
                    $company.click();
                    $selectedItem = $searchContainer.find('li[data-value="56a8930ceb2b76c70ec74d1d"]');
                    server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeCustomerPayments[0]])]);
                    $selectedItem.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(1);
                    expect($searchContainer.find('li[data-value="56a8930ceb2b76c70ec74d1d"]')).to.have.class('checkedValue');

                    // uncheck company Filter
                    server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeCustomerPayments[0], fakeCustomerPayments[1]])]);
                    $selectedItem.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);
                    expect($searchContainer.find('li[data-value="56a8930ceb2b76c70ec74d1d"]')).to.have.not.class('checkedValue');

                    //close filter dropdown
                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.class('hidden');

                    //close Employee filter
                    $closeBtn = $thisEl.find('span[data-value="assigned"]').next();
                    server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomerPayments)]);
                    $closeBtn.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);
                });

                it('Try to sort list', function () {
                    var $firstTableRow;
                    var $sortTypeBtn = listView.$el.find('th[data-sort="paidAmount"]');
                    var customerPaymentsUrl = new RegExp('\/payment\/customers\/list', 'i');

                    server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomerPayments)]);
                    $sortTypeBtn.click();
                    server.respond();
                    $firstTableRow = listView.$el.find('#listTable > tr:nth-child(1)');
                    expect($firstTableRow.attr('data-id')).to.be.equals('573ad6da3c55369d62addcd1');

                    server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeCustomerPayments[1], fakeCustomerPayments[0]])]);
                    $sortTypeBtn.click();
                    server.respond();
                    $firstTableRow = listView.$el.find('#listTable > tr:nth-child(1)');
                    expect($firstTableRow.attr('data-id')).to.be.equals('573af6a1efaa86d81d7a587b');

                });

                it('Try to cancel changes', function(){
                    var $dateInput;
                    var $date = $thisEl.find('#listTable > tr:nth-child(1) > td[data-type="dtPicker"]');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var currentDateValue = $date.text().trim();

                    // Change date
                    $date.click();
                    $dateInput = $date.find('input');
                    $dateInput.val('15 Apr, 2016');
                    $dateInput.trigger('change');

                    $deleteBtn.click();
                    expect($thisEl.find('#listTable > tr:nth-child(1) > td[data-type="dtPicker"]').text().trim()).to.be.equals(currentDateValue);
                });

                it('Try to delete item with 403 error', function(){
                    var spyResponse;
                    var supplierPaymentsUrl = new RegExp('\/payment\/', 'i');
                    var $firstEl = listView.$el.find('#listTable > tr:nth-child(1) >.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    $firstEl.click();

                    windowConfirmStub.returns(true);

                    server.respondWith('DELETE', supplierPaymentsUrl, [403, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                });

                it('Try to delete item', function () {
                    var supplierPaymentsUrl = new RegExp('\/payment\/', 'i');
                    var $firstEl = $(listView.$el.find('#listTable input')[0]);
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    $firstEl.prop('checked', true);
                    windowConfirmStub.returns(true);

                    server.respondWith('DELETE', supplierPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();
                });

                it('Try to edit item', function(){
                    var $input;
                    var $dateInput = listView.$el.find('td[data-content="date"]')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');

                    $dateInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('16 Mar, 2016');

                    server.respondWith('PATCH', '/payment/customers/', [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    listView.saveItem();
                    server.respond();

                    expect($tableContainer.find('input[type="text"].editing').length).to.equals(0);

                });

                it('Try to open edit dialog', function(){
                    var $editDialog;
                    var $needTdEl = $(listView.$el.find('td')[3]);

                    $needTdEl.click();
                    $editDialog = $('.ui-dialog');

                    expect($editDialog).to.exist;
                });

                it('Try to close EditForm', function () {
                    var $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-payment-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button');

                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

            });

        });

    });

});
