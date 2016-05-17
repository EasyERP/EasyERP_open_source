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
            _id: "56bda686dfd8a81466e2f4fc",
            period: null,
            paymentMethod: {
                _id: "565f2e05ab70d49024242e07",
                name: "Erste Bank HU24 1160 0006 0000 0000 4916 1522",
                account: "HU24 1160 0006 0000 0000 4916 1522",
                currency: "USD",
                bank: "Erste Bank",
                owner: "Alexander Sokhanych"
            },
            supplier: {
                _id: "55b92ad621e4b7c40f00065b",
                ID: 65,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.027Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.027Z",
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
                    country: "Australia",
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
                    first: "Kogan.com"
                },
                isOwn: false,
                type: "Person",
                __v: 0
            },
            paymentRef: "I0101022016",
            forSale: true,
            differenceAmount: 0,
            workflow: "Paid",
            date: "2016-02-11T23:00:00.000Z",
            paidAmount: 290700,
            invoice: {
                _id: "56bda66cdfd8a81466e2f4f6",
                _type: "wTrackInvoice",
                __v: 0,
                project: "55b92ad621e4b7c40f0006cf",
                products: [
                    {
                        subTotal: 2907,
                        unitPrice: 2907,
                        taxes: 0,
                        jobs: "569e94782208b3af4a5271ab",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        quantity: 75
                    }
                ],
                editedBy: {
                    date: "2016-02-12T09:31:44.223Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2016-02-12T09:28:50.749Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                creationDate: "2016-02-12T09:28:50.749Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: "55647d982e4aa3804a765ecb",
                payments: [
                    "56bda686dfd8a81466e2f4fc"
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 290700,
                    balance: 0,
                    total: 290700
                },
                paymentTerms: null,
                salesPerson: "55b92ad221e4b7c40f00004a",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                },
                journal: "565ef6ba270f53d02ee71d65",
                invoiceDate: "2016-01-31T23:00:00.000Z",
                paymentReference: "PO807",
                sourceDocument: "56bda5d2dfd8a81466e2f4f5",
                supplier: "55b92ad621e4b7c40f00065b",
                forSales: true,
                name: "I0101022016",
                dueDate: "2016-02-05T23:00:00.000Z",
                paymentDate: "2016-02-11T23:00:00.000Z"
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
                        jobType: "",
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
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2014-07-31T21:00:00.000Z",
                        info: "Update",
                        salary: 450,
                        jobType: "",
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
                jobType: "",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-07-29T19:34:42.433Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-27T21:36:05.228Z",
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
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDlo5ypBB5rRguhKCGH41hAnNWraVlbvWcolxmatzCrLuUisu4iPPy1a+1yMpAWmKjPy2SamKaKm09iglqzHJ6Vajt1U1ZVP5059sZAwWYnoOTVOVzNRGpCewGDUUmxH2k5Pp3q15U7ryRAn5tSw2PmXK2yMpYjJbrg1NyrEKW7shdmSFc8Bzyaljslbny2kbs0nyj8utaTWyWFyB/rZGXktyVpC4TAyc5ycCk5DSK8MBHBwQOxHAq/awMmSCq5/vfzp019Bb2vmN8qDsepNc/d+ILiU4gURKT16k0knIbaW50f2bzGw/f+In+VMW0SSXcrlFJ5BGTj+nQVxslxLK26SR5G7FiTTobiWBt0TMh9RVezfcn2i7HcGzihzszlu5NJFpjSAFlKLuyfUmubtvEd5EAo2EhcAsMn8zXT6P4jtblRFdDZPj7zEYbp+XPaocWty1JPY0LewjXhY9o6fKev1NW1hjiXkhfbuaDM54AC/SmgkryM+tZc66F8r6iPcEDESgf73X8KzZ0edyZWZgM4yelaBQN04zTHiYE5HWspOe5pHlRiz6asgOOncGs59MeB90TFMHp2rqdi9+9NMCv93HPrVRqPYUorcw4LsxEJOnzHp6H8alkvJhxHGE9+tXJrINw6AelZ11HLZMuPmjb+E9qtJMTbAyySACdiRRVy4028Fkk8cLNuAJUDJX8KK05WTzLucTHCTVtIABnFSRwIp+Z6srCx4A47GtXIxUSr5eeKlVcKNo3EdhV5NOUgbi2e1WksUiICqWPr6VLkOxmfZzIpaZ8D+6tTw6eylWgi3jA75rQWxeQYI2p3OOSK1I3hSHbGMAccdanmHYy20c/K0sqqM9KnFlDbOGdQcj7ynGKfPIrkc/MOmKlMUkoG5cDFTcditlF5hGQeCSOTVWa3WOF7lwQg5YngVsW9gwAOML1561z/AIyuZVMNlnCFd5A788D+dOKbdgbSRzmoXr3kuSNqDhVzmqyj3pSPXn61PbReZKPQV07Iw1bGrbv6H6UrRMgyRWyI8J0yB1qOa0eZRsBz7Vnzm3s9DNtovMcKFJP+zyfWrsUDdI1KzBgARwB/n8e9Nis5kclkOQPWrUdpITzH1PUZ59hTbJUWdBoWotcQm2kzujHBJ5x7/wCNaqth8ZyD3rmLcS2F3DORtUECQdsYHXt0J9e1dFFcQXJDwNtf+41ck463RvGS2ZZ3BRkjP0p8Z8zPIIqv84zuQjHPHepNpKhkVs4zlaSY2gmUE/IBketQM8sePk785q0q3G35o1x+tSGI7QDwp5xjNPlvqLmtoZ6Tuod3jJH8IUd6t21vDeSqXQPGBuGfWpxbhgUBJB6jFT2toLdiyk4IwAe1b046mM5FnAUDHT0ope+KK6DE83sbSKe6bf6ZrVeJYtqxpux3pLmwksWVwm0E4PNWmdIYxuYFj2rkdzo9CPyFLAscbakiAGe2e5qrLcGVgiDCjvU8MbdWz9TSuNImZ3YBY1JHc01bVmJwevUVMsscY5Iohv45GMcS4bPGRQO1h0NgI/ncj8aJdStbbKqTI4/u9KqXpmclZHP0qj5YOc80uYrkvuPutauZFZYmEB6Y6muUvmuZ53mmDkFtu9s9q3NRhKrHsXLEgAUhVZbd0lGQwCjnnHQH+VaQlbUmUObQ5jHrV2xUbxjP1qCaExTtHtPy8c1q2duEQHqcdh0raT0MYRdy0i7m49KuQQncCKih24B5BrQtTuI4J+lc0jqRbhtldQWQE+pFWksYQx+XJqaBTtBPPtVxIwWojG5EpmZrFgkulSbYxuXkDpnnpUfl2kRRlwyjg47Vs3sYNjKrDIK44qtf6XCbYCKPDD+71NbqJyzbZMkVvOg2OyknOAasfZ1HQmudgmntpQq5ADD7wretrhpchx0700ovoJTY82/o3H0oFuM5Zif0qaiq5IlczEA2jA4FFH9aMVRIcUUGigDnvEsxGnKVxlmB5rkv7UJky65rV8U3LraQq3Vuw+lc3EpJBI61i7S1NIXSN+KbCeYFyKtxXLSghjtHpWZBN5VuyMOD0qeDdIN3v0rFo6Ey26HYSpyR3PNO0xDHco5/WkziEr6mrSo0MIcdhSi7MU9jQubdbo9MHpmqE+nPGvH6VHZanK11sI4B5rohtkj5wc1vKClqc0Kko6dDklSQXQ3IdicisoKyTBWVthYIw6lSOK7i40+OQE4wK5rU7FYLxhGCCyhyc8Hr/hWaTjudKnFmX5ayzNuUNzxkVbEB8s7ccDNVYsqxzzV+2jZjgdMU2OJjt9tMxMO2TnlV61raRqSNL5F0hgkHUMCKZPYGJpCrbN2MMBkryOf51DcXt0821p3ZB/CUCj8qejRNmmdzGo8sbCG989as24PJJ6VkWk3laOtwwZztwFBAxx71W0+4vrqR0iuVAVtojmTafwYdeM9sURaJlF2bOhnZRsUnqc8e3P8APFILuFtw3dO1c5qt9NDdpBJIWeJeWA7nk/piqs1zIzoQeQPzrTmOdm5Pbh2LhgAeadaFw2FbJqjbTgwsZXyT/KrVhMjIHBwcnNWrGRrxE4wetPqvGecrzmp+lM0TFpKNwzigdOaBhRRzRQB5LPPNf3ADkuc/KPStFLTy3jUjouTUum2qW9xLvHKnAzV0rulaQjOBgE1zSlrZHRGOlynLGHXCDGKt2Y9R7VXO4ZYkYJxzWhZRYjUk8mpZQ9E/eAepq9cR4tSM9qhjTNwOnFaRjVo1DdDSirimyhpunIv71uSa2RhVAzVeNQpwM49qWRnxmt1oc5YJG01zut7PtgPrEBj2ya2GDKuWJAIrm9XuFlun2kFVO0djx1/XNE3pYdNXkZjZBz+HWrlqxJG3PHBqlnLg/r6Vc09gXDFSQOcVm9jpRpt/qS8mFUDvWFPJFJKWRt3tVy/u7icGPy9i9AMVTtrSQqrtbycHAcAkGhIq52mlwK+jxKwyCM4q3BDHBGR5aog5Ofbv+g/Ko7FGhsoV5yAMiq+vXv2e2ESn5pOvsv8An+tapJK5zzerOfeJru6ecqEV2LHPbJzUscMIbZvL5GenSqn2oGRoznaR1p8dyv2RioCsTtPtUq5k7F+OKOWPKnO04GO9WIIVDgocZ4K5rGtrlkbZ09Perw3x4kRsljzjtVbGZvK4iwGyMdDUguAyE/xdqwk1GSSUI/zL3OK0Uf8Au8VSd9guTi8J+9gZ6kdqljuxv8t8sR3AqAoGjO4DFRIrJHM4bkjavtT1Gmy02oJ9pWKPkdSf8KKxrQsskchYCQHGM4BoouO5T1NEhv2KDhuv1qMEEHjGateIUC3hK9sCqNsDIW578VzSWrOqD91ErWoZQ2ehq5bx7duDwKie1b7OADznNWYdsUOZGCKvJZjgCkhslt0PnsxFW7pvLh3elYx1/TbYvmYyMOiopOfoen61n3/i4SoY7a24zw0h6j6D/GqitBOLZ1tjskTcXz7VT1PXNOsA6ecJZlH+rXnn0J6DmuFl1W8lVkM7Ihz8qHAIPUH1H1qoGGME8+ta30CNDudZc+K5LyNo4LVYz03s279MVmksyd+grGhlaCQMCMenrWvbTRTxgI3zAcjvUSuUoKOxCzFG7jNWLK88nzBjBI+XFI8DSISAQVGfrUX2SU4wCCO/NLRjSfQtm2aZlnEhTPU7v85rp9Kg2RhBMkijBwVxg++OtZejxqsQa4Qgop7ZBHNdFA0IiDRhBxnI4AoirsJysrWHNOsSNJKRgEKNo+8TwP1NclqV7JeSO8hIJPyr6D0rQ1LUGe48uLJIP7senq39B/8AXodIZY1jmy0qruLjnA/rUuprYp4SXIpdTD2sD8uM+hoCOGAQHB5PvW1b6eFk3Ha46j8q2LW0gGH8sDHtWkXc5JQcXqcluCsCEPHUVcs7kszjoDwAa09Ts7QgvGVV/asuG2ZySpAxzRfWxm0W4fLVgvmKGPODV0ylflBGO+KzPKCyAg8jrg1YgYyznjgcYNWrk2LLl/XC59etSn540jztzzUFw4zgHb2qMMzTBkb5RxR1DoOeDYBuHOaKkkUkDeDjOAe1FWSU9fI+0Off+lVtMQshOO9T6ywkuJApzzVOS9/s7TmcH94QQg4znHX8K5pbndC9hNc1tbV/s9ttaVRhmPIU+n1rmLiee6YvNIzt7np/gKUZnchiWduQT1J/z/OkReM8Zxz7j1q0kjeMAjQyQK3GVYj+VN2Yz9ataeQHWE9HbAJH5GnyW2H2gcZODS5rOx0KlzRTRnZPIP0pevWrD222ZgePwqOSF4xkiqujF05IAOOaVchgRnjpircNr5tuHQAnP9amW1V4+vPYiockdEaLYlpfyIcsEcZ/i61pR6m4fiKJc+p61mi1kRiQFcYwexFPCSbx8uB157VDszSOHh1RsQ6i+EYiJSp5ATrS3GpyGMh5AcH7vGB6ZrKLuFwqZc8VMyiAebMQ8pzsQj5V46gVDuaqlTjsie3AeYAhgcb5i3XHYH6/yqwrsbYyN1lbP4dqplTBa7MkzXDDee/vV2YbPssXIAGfyqWV1H+eVkYKeV9K0rTUzyHwwrnzNtnkbOewxVlCQdgPzBdx9qabjsRUpRmrNF/Uo5XV5oBvXqQDyPwrLSRzH3BHUVoWlyQhYZxuwMHrV37PDeruIVZf7w7/AFrWM77nlV8K4axMFHfJBz9au27EMxPU0TxJEXjbIdeCtMVwwHOCvStrnDYsgvk4QN+tT20O3dv+X8azraeaJny+MngGpJrlsjO7OemKaXUll+Vs4A4UUVUjm81tr429z6UVTGivqa28MoW0bdHgHrmud1WYvcKitlUXGM988/59q1dQk8lEycH/AD+f/wBauekZpJGfOSxJ496wW9zvpqyGhSDx1HNTliR5ijJJzx/e7j8f5/SmRSKMLJyOzDqv+fSpmiKDcfusMnjP/Ah/WmzqhHTQbafLqMHJwXBB9sDFXp/+P4gD7pNZtof9OgxxiTHPatK5OL+TGBkgj2qZbm1F3i/UGUNOAe4/lUV5F/o7MB6jFWUUPPGQOinJx3xT2TzbIjg7ic/mam9jdxumiPSMS2zKT0HSliGJ3jyAp5GDTNAyXYE9OMj/AD9Kfd5gvl64yM47DI/pSfxNEwl7iZZddpwOPU/571DIpOBggHsKtyx7o1fgjGevc1Ei+YoVe/Q+g+nrUpmoRII0JH4n0qOBDNPvYYROgp0hOQsZOfapggSLGMj+dADAjXF4kYBbHHHeta5sLpiGW3cgDjipvC9rw906jc3T2rojW0aKauzzq2McJ2itjhodMunvh5trMqKSd2wjNElvefaZWS1l+aPAzGeucdfpXcUtV7FGP1+XY5COKWO4ZRFKsNuuxcqfmb1/nWla7lClgVyM4rdopew8yZYxyVmjFvbI3qiSI4cDBUdW9Knt9HhiUFhufb39a080VrGNjkk1J3Odm0aVdpRhjcOtT38cafJCoLbea2zTTGh6op/CnYixySK4YoePeiurEMQOfKQH/dFFFgseda8RFdJArZVMg898cfz/AFrF5U46Y4qxdtJK4nlyXkJY/j/SolcA4YBh3zWSPRiraEkRMnBQSY69jj/P1q2sYEJ2OWjzkBuNpqGGDEg2k8n5SOv5d60MZiLDA45FRJndShpqYtgT9tjz0VuB61o3Tg33U4PXHas+wOL0fXjNWJpCbpiBgnPB7VUlqY0Xan8y/CwZJmyBuGAfT/P9KsxY+xpwQSOTVOM7bdj24JAq0rZiiVfvY6Ef571kzsiQaOmzU5Ux/D/UVPrceYfNPYjP+fxpbRAurMy8Arg/XP8A9arepx+ZYygcnaccZx/nFJv3kzO1k0Ms2WfTlZgTgc880ziOMyE8dB+f/wCumaAfM0+RSeMkH6cUmouV0+M8jd2x3NFtbFRlpcS1jeWQsBks2FA559vzxVkwyTSoq7VQuEDMcD15/I/5IpdMc27POmcRABWK5VCT1b2wc+uRWxbQpc3MLbt4Ch3Cj5RJwc9Bgnc3HsCa0jBS1MK1d09EjW0+3FvaJGOMDn1NWO1C8DFL7V0nit3d2J2paKKBCUvSgHn2ooAKKKO1ABRRRQAUUUUAeU3is23YMpj5cc8VVjiIOGX861LuRfP2ochQFBPXAqa2jWQjcob8KwvZHcp3dypbptAA4B7HBB/wrQwPLb6d/StKDSIpEHlu0ZP/AAIe9Vrqzms8rIuM8hhkqc+hxWck9z0aNaEvdW5yln8lyzZ6Z6etSbyZtxz16VBFkNJ7HipF+/Wz3OKD91I0Fb9zIcduh7f54q/EPuc5wo/Q1nR/6gDrk/ktXkk4B55TAHTuaxkehAsQfLfBvXPb0q7cLut5c9Bn86pQuWmgA5bHHPXir143l2s57YJ/TNQ9xvczfDI3wTp2purkbIkBI5PH8v5VJ4W+5Lmo9bTbJgk8An9TVfbMo/DYtW8ptLL7VDKFmYhAoPbHXHcdOOh/Sui8PRyGzWWU7mOcEjnGSevfkmuWdpne0toZHUsQFAY4XkHpn1GfwrvLWIQwIi8AACt6fc4sbK3u9SWkzS0grU84KWkooAPpQKX+dHSgBKKX3ooAT+tFHeloAKKSimB5aDul3dc81q2KkkDv6CsdTmQZP4V0GnmKOPdIVRfXpXMzribNmvA96n1LabCUOAV2EnNVLfU7MYAY8dwDUesahbyadMkUmXZSFHOauOiM2nzXPPo/4v8AeqVCvmZbGKcLGZMrxnk55FSC0OeW5/Shm8Z2SFilwSAOvHvVlrgGdVU4Cn1+tRJZndyx49BUwiERJUAYHWpaRqsQ0tB8NyUuo327lXAq81416/kHCLJwdvJrMkBx/OpY5VgGVPzY4PpRyoiWJmzp7PTrWw2iLOO+WP8A+qn3WmWV6VLGRcZ+4f8AEGuYGozkgqx29efWrlpq9zGw8wA5qrLsY+0n0Zuafo8UWoxzJKZFQHCleQT3z+fauiHAFUNJVmtlmddrSDOPSr/tWkVZGE5ynK8mFJ1pelIxCjJpkC8UVFb3EVyC0TbgDg1KR+dAw6CikpaBBRSUtAB1pDS5oFAB3opO1FAHlABD7lzkU7eQcls45GalbheOtMERYjtisTpJBO5AUcH61Irkjbk0kdufX9Ktx2/QOOPSk2ikmVljLcZ5qaO2JPIIq8luqqc9AKlXAY4FTzDsUHi2rkD8qrSleg7VoTxF1IxVU2MjHODjuce1UmS0Z0r4+vbFJDG0vUfjV46c5JPT3zikNqzgRxyhAOvlgu5/LpVrXYjRbsq3LxRFFRmZ+jDsP/r1oadZyXdxCm5SjNhhnnHelttEOFC25b3mbH6Cum062itCkjmNCqkDtRbzKc4WskbMaBEAA6CnHgZqA3sO3IYMMdjVVdXje3eZ45I4l6sRn+VXzIw5X2Fh1F2v5Ld0GwdGBqxevtgPNc+9zb3N+JLSYOQPnCmr+t6nBZQx/aC4MqkrtXPT/wDWKlS3RTjomiv4fncy7B9w8muirm9CkAMZIwSo4xWjca5YQO8bzjerFSByQRxSpvQqqnzbGnR24rGfUpEdZdpSHuZOM/QdavWmoQXjERE5AzyKvmRnyStexb96KZ5i0hlUDPP4DNMkkFFNjcOu4BgP9oYP60v40AHail6UUwPN1h3HJp4i45UgUUVynYkWkRVXOM1JFkyHjp29aKKkosgbl4PTrSxruHGAPeiikA5wIm2kKeM5NNb94MBiue69R70UVtHRGLV2NFnb53TEyHr87ZH5dKto9vEMKFA9AMUUUnJlxpxHfbIgMZAqvPLbTlDK7BF/u0UVLZtGCGPY294pa2vXD4xjef5Vf0+J/JNlefOpTb04INFFNbmU9LoyYdHn0jUneNA0Dcbh1Azxmt66t49R0wxygb05UjsaKKL+9Yj7KZFpMJV1RgPlFS6rYRPFI0aKrn5iff1oopx+EUm+cw7DTzJIIypLetdJY2cNtkRrh+57miiimr6jrSexc2Lnpn604DHAxiiitzmE70vaiigBBRRRQB//2Q==",
                isEmployee: true,
                __v: 0
            }
        },
        {
            _id: "56bda741dfd8a81466e2f506",
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
                _id: "56a8930ceb2b76c70ec74d1d",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-27T09:51:08.453Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2016-01-27T09:51:08.453Z",
                    user: "55b9fbcdd79a3a3439000007"
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
                    country: "UK",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "seb@locappy.com",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Lyall",
                    first: "Sebastian"
                },
                isOwn: false,
                type: "Person",
                __v: 0
            },
            paymentRef: "I0130122015",
            forSale: true,
            differenceAmount: 0,
            workflow: "Paid",
            date: "2016-02-10T23:00:00.000Z",
            paidAmount: 145000,
            invoice: {
                _id: "56bda6eadfd8a81466e2f500",
                _type: "wTrackInvoice",
                __v: 0,
                project: "56a89384eb2b76c70ec74d1e",
                products: [
                    {
                        subTotal: 1450,
                        unitPrice: 1450,
                        taxes: 0,
                        jobs: "56a8a12deb2b76c70ec74d34",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        quantity: 137
                    }
                ],
                editedBy: {
                    date: "2016-02-12T09:34:23.172Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2016-02-12T09:33:18.421Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                creationDate: "2016-02-12T09:33:18.421Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: "55647d982e4aa3804a765ecb",
                payments: [
                    "56bda741dfd8a81466e2f506"
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 145000,
                    balance: 0,
                    total: 145000
                },
                paymentTerms: null,
                salesPerson: "55b92ad221e4b7c40f0000a2",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                },
                journal: "565ef6ba270f53d02ee71d65",
                invoiceDate: "2015-12-29T23:00:00.000Z",
                paymentReference: "PO808",
                sourceDocument: "56bda6dedfd8a81466e2f4ff",
                supplier: "56a8930ceb2b76c70ec74d1d",
                forSales: true,
                name: "I0130122015",
                dueDate: "2016-01-04T23:00:00.000Z",
                paymentDate: "2016-02-10T23:00:00.000Z"
            },
            assigned: {
                _id: "55b92ad221e4b7c40f0000a2",
                dateBirth: "1992-04-21T03:00:00.000Z",
                ID: 2126,
                isLead: 0,
                fire: [ ],
                hire: [
                    {
                        date: "2015-03-29T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00002e",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.625Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-25T12:25:42.577Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.625Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.625Z",
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
                nationality: "",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00002e",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "live:istang7",
                workPhones: {
                    phone: "",
                    mobile: "+380997915447"
                },
                personalEmail: "igor.stan@thinkmobiles.com",
                workEmail: "igor.stan@thinkmobiles.com",
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
                    last: "Stan",
                    first: "Igor"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            }
        },
        {
            _id: "56bc9ef3dfd8a81466e2f49b",
            period: null,
            paymentMethod: {
                _id: "555cc981532aebbc4a8baf38",
                name: "Primary"
            },
            supplier: {
                _id: "56bc9b72dfd8a81466e2f48c",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-02-11T14:32:18.211Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2016-02-11T14:32:18.211Z",
                    user: "5631dc18bf9592df04c55106"
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
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "56bc9b53dfd8a81466e2f48b",
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Person",
                    first: "Test"
                },
                isOwn: false,
                type: "Person",
                __v: 0
            },
            paymentRef: "PO806",
            forSale: true,
            differenceAmount: 0,
            workflow: "Paid",
            date: "2016-02-10T23:00:00.000Z",
            paidAmount: 240000,
            invoice: {
                _id: "56bc9e5cdfd8a81466e2f494",
                _type: "wTrackInvoice",
                __v: 0,
                project: "56bc9cd5dfd8a81466e2f48e",
                products: [
                    {
                        subTotal: 2400,
                        unitPrice: 2400,
                        taxes: 0,
                        jobs: "56bc9dafdfd8a81466e2f48f",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        quantity: 120
                    }
                ],
                editedBy: {
                    date: "2016-02-11T14:47:05.660Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2016-02-11T14:43:56.718Z",
                    user: "5631dc18bf9592df04c55106"
                },
                creationDate: "2016-02-11T14:43:56.718Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: "55647d982e4aa3804a765ecb",
                payments: [
                    "56bc9ef3dfd8a81466e2f49b"
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 240000,
                    balance: 0,
                    total: 240000
                },
                paymentTerms: null,
                salesPerson: "55b92ad221e4b7c40f00005f",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                },
                journal: "565ef6ba270f53d02ee71d65",
                invoiceDate: "2016-02-10T23:00:00.000Z",
                paymentReference: "PO806",
                sourceDocument: "56bc9e2cdfd8a81466e2f493",
                supplier: "56bc9b72dfd8a81466e2f48c",
                forSales: true,
                name: "PO806",
                dueDate: "2016-04-11T22:00:00.000Z",
                paymentDate: "2016-02-10T23:00:00.000Z"
            },
            assigned: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
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
                    date: "2015-07-29T19:34:42.461Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-19T14:40:13.066Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.461Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.461Z",
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
                age: 25,
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
                relatedUser: null,
                officeLocation: "",
                skype: "peter.thinkmobiles",
                workPhones: {
                    phone: "",
                    mobile: "+380966588225"
                },
                personalEmail: "qartmann@gmail.com",
                workEmail: "peter.voloshchuk@thinkmobiles.com",
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
                    last: "Voloshchuk",
                    first: "Peter"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDs6Qmk3UwtSJsONNzRmgDNAxwp1IBilpITHDrS0g6ZoJqiRc0haqF/qsFlEWb527KDXMXmuXV45XzRHGf4Iwc/nUuRSi2dRc6ta2+QXMjf3Yxn9elc/qfiacqVt0EPPJ3BmI/pWFdTIw2qkskh/wBo4/z+dVhaSsfmKoT2x0/Kp33KtYLnUXlkLld5POXbNVvtE8rbUwPpVhrJgpbzEZQATtzUQDIxKt09O1PQNSVI2Q/Ow3fXpUyhOvmYqpn1Y+5FP81VXAl/MYpNDTLYU5yMNznjmrNrqE9rJuhJRjx8p6/geD+NZRuV6ZBPZlOKntrkXA2SDOOjjqPTNKwXTO20vVzex5V0eRR86MNjA/yrTinWQ7RlXHVG4P8An6V57loZ1Mcmx15WRP8AP6V1mlXy6lB5dxhLqHqUP6ihNiaNrNC81DEznKS43r3HRh61KprRGTJkFTKKhSplFMpDqKKKCigTTCeaRmqLzKi5ViYGpFqupy1WE6UXBqw+k70hNAIGSe1UjJjycVgavrRj3JA2MH7/AGp2u6qtnGE3fvG/hHYe/vXJ3BecbpWZYs5JPVj7VDd9C4x6slaQ3LtI7tJzyznaPy5JppvktkxGqljwNq5z+J61VVrm7YR2seEHHsKv22mJC2ZGEsxHO4/070bFryKkUlzKS8SNk/xv0/CknF4MhnCn/fGP0q5c3MUfyvchz/ciAAH1NZM0xLFhGMZ4+fJoQMUyyF/3hAkHRwOT/jVaXGS6jGeoFOM+8YKg89DxUieVIMkheeVboPxqidyvHmQ4UEADk9qXMajBYu3oOlPuzsIjI2KBkAHIPv71BGC7BUHJ70xAQCwwAvsTWlbkwwDyi5IGWI45qBljtBk4Z/TGas2lzezsdjeVDHyzA7QPxqWNaDIZJZLlC5JOfpn2rRtbub7QGgzGw43AZ/zxUErWzXKvFKW9wQMH14H/ANeq7XZSUeUSqHkjPNS9StjtVnubVI5bhxLH1DqvIXHcfl+VasMqyBSCCCMhh0IrD0rVbdrcLJlzGoXbjLEmrGiSFI0iZWTLsUDEHj0oi7Gckb6VKKij9KmFaghaKKKCjBlmwKhWXmopSaamc81z3NUjQibJq0p4qjBniri9K0iZzJM1Q1jUFsLQvkbz90GrpbAJJwAK43U5pNVv8R/cyEjB7+5+v/16cmRFXZRDG4lkvbjJVW4yeWb0H86SSJ5XD3KnGBsiHHHbPoK1Gghl1CODI+zWsfmPz/COefdiRWVdXck8kju5Iboo4FRuag0hUFJLgRIv8EYwAP51Vmu4UTZC7Ed8DrUDxZ6AD2FOSxLLk5qkkLUrtIrHBOPwoVDyVNW/sDbenPpipksCFBA59afMhcrKBIPDDNJhSpGfx9a2F05QAWFP+wx4+73qedFezZz7bioRiTjpntV1Qlnb+YSDKfuj+7/9epb5Y4XCovznpVf7NJcNubhRwoNVe6JtZleNTcXADNhepJ7CrWoTARCCIFUBzj/P1FRRQsswUcHNRXGTMSOxNPdi2QkJZY5CDj5f6ipmkIGewPzAVArfKR2Jq1DEZXUdVPBz6UMSNqyu1hjRvNjhyfl35If8a6LSb1LidUnWOOZlzGyOCjgdR7EelcFdpiUR85VVAqexvZLdgM9CHAzjBB/qOKm3Ub10PVo3UjjqOtSq1YVrdqUtrqI5id/LkBPKnnH+fcVsn61adyNibNFRg0Ux3MJocmgRYq6Y/amlOKxaNkyKMYFTrk00KKkWmiZFXUZBFZkt90n5vp1/pXO21zHFFcajIF2x/JGPU45/Xj8K6LVozJp0uBkgZArm1tPktYCu6JGEj46MACR+pNKW4orQpymWC3cTHM85Eswz04yq/gDn8R6VTWNpGxySfatPyHvLqQ+u98+o3YH6YqzbWG0lsc1PMaRiZ0VmwIzjParcdrk89BV/7OuMYz9aesYAIxUuTNEkVEtwO1OMKjGBVjABpCo61NyiuYxTWXbnPSrG2obsH7O4HGRzQMxIohdXMkzDK5wo9quJCMMxAGf0qzb25hjVSOi5NSxoMF2wAKpyIUTKMAjmaQjAQZBx37YrIuEySRwOwrpJY98ecYGe/wDn3rHu4P3mPWrhIznEzlQ7AffFTo7KmMnBJB+lCqWCKBzkkCp1iJlZEViG5Uj/AD9a0bMrFeRpHuBI/OeB+AH9MVCpIkBrQltzsiTq6ZZh7Hv/AI1RdMbh/cY/zppg0dZ4buH8tVfLQyFWP+yUOc/oPzrtoz8gHpxXn/huTEEkf8TfKnsdwKn8812miTPPp6+aR5sbNG/1U4/lilHdomRfFFLiirEVCKaRT2ph6VmzRDcYpVFKBTlFIbIb9C2nzgddhrPtoxLHcAL0BQfTpWvPGXtZUXqUIH5VS06HZagnq2STSkrsSdkZ1tZlIULDD7dre+D/APWFW1jCJ2qbGGxTX46VlY1TK0nBqLAyccU+TPeom46UjRDW5Y9xS8dxUZDZ4pCx96BjziobnCxMTzxjH1Ip6sWJ5z9KV4TKm3oDSGRA7gxHFPChozkcDr708wEKBjgU8AldmOM80AVvJJjUEfN1IrK1BApbA5I610og+XnqetZWq2vBI9KqOjJeqMGxi+fzSPlRt34f5zVuOForaIkE85JBxipLdFg09lbG+Vg30Qf41pX0KLBajO394pb/AHenP51blqZJaGBcqYtUJjJUcMCff/69QTIHupCBhXYjHYZ5H61oTW8k987IOIzt5PpwP5Gkns90k6Rqdy7SPrj/APVVKRLRLols4kR+V46/jx/n2rsdCfzGvTtwDcMw98//AKqx7aEIqKoK5VT+OSf8K3dFg8qGV/77k/5/WlB3kTNKxo0U1ulFbmRXNNNOI5pKhmqEFPUc02pIxk0IGTInymqkahV24wFz/Or6Vn3JwrAdSab0JM+4kUTnaetO3AjmqdxHuHEmGqhIb2H7jB8VznQo6Guyg55qFo+tVLW9mZ9sybfSr7NuFIrUh2YXmmGPnOOKlL44pjSoo+YigaIlAU9qkEgHWq0l3EDwc/Sozdo3A5P1pWKLpnXPWnwkM2RWYGJbkfSr1sQCOxpAaAHykVXurZpYjjA46mrEeefSpMbgBVWM72ORETPfqJjnBJI7HHb86s3TtPFPz86bM+nBH+NX7+z2XgdRxyxOP89ahghUTTM3Q7M/gOabYrEUkaKxiAJZmxjHvkH8xT0aO3WWTCkorEL6gcClLnc8hHSEv/wI8AfmaqQAvcRb13GSJgVHuSf8KQjchO9Sx4AbjP4Vt2Q22kfGMjOPrWVp1u0scfmZ3ffb61tKoVQo6DitaS6mM30A0UGitjMhNNNONNNQzVAKli9aiFSpwKEJk+cDNZF7KUhlbnO0EflWoTlSKz7sJtO8A4GORwKJ7BHc5JvtBmQTnylkOWmYbto7YHYe9Z2pvcWty4gvcoqggM/LckduOorqLmWKVdsgVscDsaxbqzt5MlYBn1rKMl1N3FsraXqU8rBZBuwcZFdPH81uHIww45rnbSyEcocR5AO7rgA1uTSNHbgN95uamVr6FJPqKMSNVa5SNDh/m/Gn28nykntVG5uFM3zn5T+lJF7A8lorYYZPoBmnJe6epOdg+tU2ULPkoHi7bT/P9ai1kpcNE0Vu5QRkELxhs9fTpWiimZSk1sjege1uP9Uyn2FXooRxnn+tcTp0NxFtZFbf3DEbT+H5V0+lX0m8xzKR7HqP8frUtJDTbRsbNi8dKEJByfpQ0gJGKcinOTx6CkSJdhRbOz9hWHApe3foAFKk/X/JrT1aQiDZ/e4qisREccS8FyC3sP8AJpNjWxA7KMHHy8sfoAf/AK1VbF5GvYRbp5rbcdeBjitaSyLBlXoRj8MdKm0+3hs5miQAsD8zf0oRVupbtpprdx9paMlsD5FIx+tamcisfUnVI255xxWnbsTBGT3UGtoPoc9SNkpEwGaKBRWpkQGm0402oNQFSjpUY61IKaEx2aoXmDEeetXqzruQPwO1TPYIfEYs0G45OKi8jae9XZMAkGo1ZcgE5rA7Lj7eFT1HQ81V1OffPtXjtV1nRbcuv0FYzvunyaEgXc0rdF+z8dTWddW3zkHkGrcJfHHSkmSR+euKLjM1FaP3XsatxSptwwU49RTTEe4wPpUflHPQ1V7isX0mhUcADv0p/MrA4Ax3FUYiQecitG2HvUMZZhLA43Nke9aEIyuTyarQxA4zVuMcU4oxmylewGZwPapoLUh9zcACrioCckfpUdw+yI9qrl6k819ChqV+lggcLvbOFX+Zplo8Mrq8ZOWOSDWVrJY3hBORgY/LP9ak0Us1wijpmpbOhQtE0rn/AEq/Fso53cn0FbigKABwBwKzdLhDTT3ePvsQp9q0hW1NdTkrSu1FdB+aKZRWlzIjNNp5pvepNAUc1KBTUHNSAcU0SxpOAT6VlXIwSRzxWpIP3bfQ1keYftbRNyrbvw71FQumZd3Ljk8EUmmRG5uAXYhcHHuaSW3a4myxwoPQd6uwwmNAAOKxudDegupxAMkUXCquAP61kPBIJcBTmtub99GOfmXufSq4IibJ+Y+gpsIvQz5/OjQKgYfhTIhc4ySdo5Oa1Gum2n5V49arXU73EXl4VE77eppFkUc4fhh7c1IYw44qBVVRipYZQp2tQBItsCelWra3Ib2pYgGOavwKB2oSuTKVhUTbU8Y45pjcAVIh4q0YNjxxWbqlwkUbPLny1xwOrHsK0icKSTWRcSR3DeW65QnuKJvQdNamJ5d3q1xJIiquf4c9AOK0rC0aEeQjAzycMR/Avep1gKs1tZKVzje/f6Vq2VklpHgcu33mqYxcmbzqKMSWONYo1jQYVRgU8UHrTa6DhHZooopANNNFKaQdaCyVBUmOKYgqXFUSxhHBz3rFkjK3+TW4RVC/hwyyj6GoqK6HB2Zhy5ilkUjvkUW+t2pk+zTkxy44LdG/Gpr9f3obH3uaytS0xbq3LAfvE547isFa+p07o0ZrhFyC2O1V1kYtkkMvqDUsV5ZTWuy6CRyqgzv4x16H8qludHtmb5HdMkZAbinYFJLcpyHceuR7UnlFz3xVh9FgTZ++cgtg8jpg/wD1qh+zWsf2wmd1W15bBGQNoP8AWixXPEPs2QeTTPIwcA1lajfzhoY7OdnLLklTkc1eshPHEDO5eQ9aGrK4c12alkxEmxunUVdjlCzypnhP8M1Ws0/ibt3qK1cySXE3aQ8fToP5VKE1c0926MEVPGOlV4gRGoq4grSOpjLQS5IWEg9W4qiIFimijZi5lY7eOmO5qa5bzLtY16IOfr/nFSQqHvmb/nnGFHtnn/Cm9WCbiizFCkSnaOT1PrTqWkNaoybENAFFKoosTcUCinhaKYiuaFFJTlqTUmQcVKBTIxUoqkSNIpksYljZD3qQ02mBg3URKEEcoeajhAXGenetS9j+fd2Yc/Wsuc7G9q5ZqzNoyurGfrNnlhKq5wMcVmB54ypW4kXac4LHGa35Z1x1qm7oxwQDTTNk9LMybq8uptgM7HYcjbxz+FNhsbiUNuZ8S8uWON319a1diAZUAZ9BTwwUYzzRzDsirb2UVvgIuW7t3qyibpOnFAOenWrEEfzZzwKhu4bEsmFtyq8FhinW8e1QAMD0prcsOuKtRLjGaESyaMcirG9Y0aRvuqMmoVqG8k3lYEPH3mq07Iytdha5djI3Vjk1oW64DMQQWY1Vs1yRjp296v8AargiKj1ENNNO70m2tbGLYgp6imhalUCmCHKKKUUUFlGpIxzUdTR9KhFMmSpKYtOzVkgaYxpSajagTY2QB0IP4Vj3keTgjkHFbFU7+F2XzIwSR1X1rOauhwlZmBPCxOB0qE25K96uyOO/44oVxg81gddzKYSKxGeKkiVmOM54qxMAWyKdBwcDFBVySCHjtVoqFGKajBRxQzgnNSSPRec1YU8VV8zHWmSXWFwpx7+lFxWuXJLlY/lX5n/QVWiPmuecqTlj/eP+FUwTJwchT29frV+3IA56UXuO1kaVtwyj1q7trBm1KOzKyyn5V5IFS23iS2uACIpFBG7nHA/Oumm9Dlno9TawKQio7e4iuoVmhcOjdCKkrQkTFGaQmkJoEPBoqMtRQFyEVKlFFQjRkwOKXNFFWQxKaaKKBDTTDRRSEVL6zSdTIFw46kd6xpIWTI60UVjURvSbsV2XtyKVBgdTRRWZuShsdTSPOq9KKKkaIjKXNAznmiikUSKcGpvtCxpuY9P0oooQmcrq2oteTeXFkqD271dsVLoAg2ZX5jnOfYUUV1pWRxzk+Y6/R8QBoAMKQGX+taReiiqIuNzzRRRQIcq0UUUwP//Z",
                isEmployee: true,
                __v: 0
            }
        },
        {
            _id: "56bda471dfd8a81466e2f4ed",
            period: null,
            paymentMethod: {
                _id: "565f2e05ab70d49024242e07",
                name: "Erste Bank HU24 1160 0006 0000 0000 4916 1522",
                account: "HU24 1160 0006 0000 0000 4916 1522",
                currency: "USD",
                bank: "Erste Bank",
                owner: "Alexander Sokhanych"
            },
            supplier: {
                _id: "56a0d53b62d172544baf0e3c",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-21T12:55:23.586Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2016-01-21T12:55:23.586Z",
                    user: "55b9fbcdd79a3a3439000007"
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
                jobPosition: "Co-Owner",
                website: "",
                address: {
                    country: "Sweden",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "56a0d4b962d172544baf0e3b",
                email: "ivarliden@gmail.com",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Liden",
                    first: "Ivar"
                },
                isOwn: false,
                type: "Person",
                __v: 0
            },
            paymentRef: "I0102022016",
            forSale: true,
            differenceAmount: 800000,
            workflow: "Paid",
            date: "2016-02-09T23:00:00.000Z",
            paidAmount: 400000,
            invoice: {
                _id: "56bda3e0dfd8a81466e2f4e7",
                _type: "wTrackInvoice",
                __v: 0,
                project: "56a0d60062d172544baf0e3d",
                products: [
                    {
                        subTotal: 12000,
                        unitPrice: 12000,
                        taxes: 0,
                        jobs: "56a0e0cc62d172544baf1108",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        quantity: 1098
                    }
                ],
                editedBy: {
                    date: "2016-02-12T09:22:37.363Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2016-01-21T13:45:48.078Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                creationDate: "2016-01-21T13:45:48.078Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: "55647d952e4aa3804a765eca",
                payments: [
                    "56bda471dfd8a81466e2f4ed"
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 1200000,
                    balance: 800000,
                    total: 1200000
                },
                paymentTerms: null,
                salesPerson: "55b92ad221e4b7c40f0000a2",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                },
                journal: "565ef6ba270f53d02ee71d65",
                invoiceDate: "2016-02-01T23:00:00.000Z",
                paymentReference: "PO697",
                sourceDocument: "56a0e10c62d172544baf112d",
                supplier: "56a0d53b62d172544baf0e3c",
                forSales: true,
                name: "I0102022016",
                dueDate: "2016-02-06T23:00:00.000Z",
                paymentDate: "2016-02-09T23:00:00.000Z"
            },
            assigned: {
                _id: "55b92ad221e4b7c40f0000a2",
                dateBirth: "1992-04-21T03:00:00.000Z",
                ID: 2126,
                isLead: 0,
                fire: [ ],
                hire: [
                    {
                        date: "2015-03-29T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00002e",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.625Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-01-25T12:25:42.577Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.625Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.625Z",
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
                nationality: "",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00002e",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "live:istang7",
                workPhones: {
                    phone: "",
                    mobile: "+380997915447"
                },
                personalEmail: "igor.stan@thinkmobiles.com",
                workEmail: "igor.stan@thinkmobiles.com",
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
                    last: "Stan",
                    first: "Igor"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            }
        },
        {
            _id: "56b9ede0fae0cea53a581863",
            period: null,
            paymentMethod: {
                _id: "565f2e05ab70d49024242e09",
                name: "Ukrsibbank 26005536599700",
                account: "26005536599700",
                currency: "USD",
                bank: "Ukrsibbank",
                owner: "ThinkMobiles"
            },
            supplier: {
                _id: "55b92ad621e4b7c40f000639",
                ID: 58,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.013Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.013Z",
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
                    country: "Hungary",
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
                    first: "Digital Media"
                },
                isOwn: false,
                type: "Person",
                __v: 0
            },
            paymentRef: "R1150116",
            forSale: true,
            differenceAmount: 0,
            workflow: "Paid",
            date: "2016-02-08T23:00:00.000Z",
            paidAmount: 937000,
            invoice: {
                _id: "56af5b3574d57e0d56d6bf07",
                _type: "wTrackInvoice",
                __v: 0,
                project: "55b92ad621e4b7c40f0006be",
                products: [
                    {
                        subTotal: 9370,
                        unitPrice: 9370,
                        taxes: 0,
                        jobs: "56af554c74d57e0d56d6bef9",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        quantity: 447
                    }
                ],
                editedBy: {
                    date: "2016-02-09T13:47:04.173Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2016-02-01T13:18:33.672Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2016-02-01T13:18:33.672Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: "55647d982e4aa3804a765ecb",
                payments: [
                    "56b9ede0fae0cea53a581863"
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 937000,
                    balance: 0,
                    total: 937000
                },
                paymentTerms: null,
                salesPerson: "55b92ad221e4b7c40f00004b",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                },
                journal: "565ef6ba270f53d02ee71d65",
                invoiceDate: "2016-01-14T23:00:00.000Z",
                paymentReference: "R1150116",
                sourceDocument: "56af5b2974d57e0d56d6bf06",
                supplier: "55b92ad621e4b7c40f000639",
                forSales: true,
                name: "R1150116",
                dueDate: "2016-02-03T23:00:00.000Z",
                paymentDate: "2016-02-08T23:00:00.000Z"
            },
            assigned: {
                _id: "55b92ad221e4b7c40f00004b",
                dateBirth: "1992-07-11T00:00:00.000Z",
                ID: 39,
                isLead: 2,
                fire: [ ],
                hire: [
                    {
                        date: "2013-05-19T21:00:00.000Z",
                        info: "",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014"
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
                    date: "2015-07-29T19:34:42.434Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2015-11-03T13:24:56.462Z",
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
                nationality: "",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001f",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "roland.katona7000",
                workPhones: {
                    phone: "",
                    mobile: "+380956937000"
                },
                personalEmail: "roland.katona@thinkmobiles.com",
                workEmail: "roland.katona@thinkmobiles.com",
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
                    last: "Katona",
                    first: "Roland"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            }
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
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

            it('Try to change ViewType', function () {
                var $listBtn = topBarView.$el.find('#listBtn');

                $listBtn.click();

                expect(window.location.hash).to.be.equals('#easyErp/customerPayments/list');
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

                    $searchArrow.mouseover();
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
                    $searchArrow.mouseover();
                    expect($searchContainer.find('.search-options')).to.have.class('hidden');

                    //close Employee filter
                    $closeBtn = $thisEl.find('span[data-value="assigned"]').next();
                    server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomerPayments)]);
                    $closeBtn.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(5);
                });

                it('Try to sort list', function () {
                    var $firstTableRow;
                    var $sortTypeBtn = listView.$el.find('th[data-sort="paidAmount"]');
                    var customerPaymentsUrl = new RegExp('\/payment\/customers\/list', 'i');

                    server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSortedCustomerPayments)]);
                    $sortTypeBtn.click();
                    server.respond();
                    $firstTableRow = listView.$el.find('#listTable > tr:nth-child(1)');
                    expect($firstTableRow.attr('data-id')).to.be.equals('56ebe34142d9fc28253ef216');

                    server.respondWith('GET', customerPaymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeSortedCustomerPayments[1], fakeSortedCustomerPayments[0]])]);
                    $sortTypeBtn.click();
                    server.respond();
                    $firstTableRow = listView.$el.find('#listTable > tr:nth-child(1)');
                    expect($firstTableRow.attr('data-id')).to.be.equals('56eae89666a6a5573cd02d77');

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
