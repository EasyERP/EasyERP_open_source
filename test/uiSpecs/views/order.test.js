define([
    'text!fixtures/index.html',
    'collections/salesOrder/filterCollection',
    'views/main/MainView',
    'views/salesOrder/list/ListView',
    'views/salesOrder/EditView',
    'views/salesOrder/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, OrderCollection, MainView, ListView, EditView, TopBarView, $, chai, chaiJquery, sinonChai, Custom) {
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
    var fakeOrders = [
        {
            _id: "56e6a7067c22c0704120b1dd",
            workflow: {
                _id: "55647b932e4aa3804a765ec5",
                color: "#2C3E50",
                name: "Not Invoiced",
                sequence: 3,
                status: "New",
                wId: "Sales Order",
                wName: "order",
                source: "purchase",
                targetSource: [
                    "quotation"
                ],
                visible: true
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 8000,
                total: 8000
            },
            name: "PO888",
            orderDate: "2016-03-14T00:00:00.000Z",
            project: {
                _id: "56ab5ceb74d57e0d56d6bda5",
                StartDate: "2016-02-02T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56e6a6b1ef05acd9418dff38",
                        "56abd4ffc6be8658550dc6e7"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T13:49:00.370Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2016-01-29T12:36:59.647Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: "528ce7d0f3f67bc40b000021",
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: "55b92ad221e4b7c40f0000a2",
                customer: "56ab5ca674d57e0d56d6bda4",
                task: [ ],
                projectName: "CAPT",
                projectShortDesc: "capt the video",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2016-03-31T21:00:00.000Z",
                description: ""
            },
            supplier: {
                _id: "56ab5ca674d57e0d56d6bda4",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-29T12:35:50.671Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2016-01-29T12:35:50.671Z",
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
                    country: "USA",
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
                    last: "Maurstad",
                    first: "Stian"
                },
                isOwn: false,
                type: "Person",
                __v: 0
            },
            isOrder: true,
            forSales: true,
            projectmanager: {
                _id: "55b92ad221e4b7c40f0000a2",
                dateBirth: "1992-04-21T03:00:00.000Z",
                ID: 2126,
                isLead: 0,
                fire: [
                    {
                        date: "2015-03-29T21:00:00.000Z",
                        info: "Update",
                        salary: 200,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00002e",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                hire: [
                    {
                        date: "2015-03-29T21:00:00.000Z",
                        info: "",
                        salary: 200,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00002e",
                        department: "55b92ace21e4b7c40f000014"
                    },
                    {
                        date: "2015-11-30T22:00:00.000Z",
                        info: "",
                        salary: 250,
                        jobType: "Select",
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
                jobType: "Select",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.625Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-03-11T13:51:26.808Z",
                    user: "55ba2f3ed79a3a343900001d"
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
                relatedUser: "55b9fbcdd79a3a3439000007",
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
            _id: "56efafb674faf4cc33d20ae1",
            workflow: {
                _id: "55647b962e4aa3804a765ec6",
                color: "#2C3E50",
                name: "Invoiced",
                sequence: 1,
                status: "Done",
                wId: "Sales Order",
                wName: "order",
                source: "purchase",
                targetSource: [
                    "order"
                ],
                visible: true
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 4320,
                total: 4320
            },
            name: "PO905",
            orderDate: "2016-03-21T00:00:00.000Z",
            project: {
                _id: "562bc32484deb7cb59d61b70",
                StartDate: "2015-12-27T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "5664bf5908ed794128637c8c",
                        "56ab622174d57e0d56d6bdb4",
                        "569eb2d62208b3af4a527250",
                        "56d58e7b5132d292750a5e7d",
                        "5664bf5008ed794128637c8b",
                        "5664bf3608ed794128637c8a"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-15T17:19:44.514Z",
                    user: "569f5d8c62d172544baf0d52"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "android",
                createdBy: {
                    date: "2015-10-24T17:43:00.138Z",
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
                projectmanager: "55b92ad221e4b7c40f0000cb",
                customer: "562bc2db62461bfd59ef58c7",
                task: [ ],
                projectName: "MyDrive",
                projectShortDesc: "App For Santander Bank Employees",
                __v: 0,
                EndDate: "2016-03-30T21:00:00.000Z",
                TargetEndDate: "",
                description: ""
            },
            supplier: {
                _id: "562bc2db62461bfd59ef58c7",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-10-24T17:41:47.172Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-10-24T17:41:47.172Z",
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
                website: "www.appmedia.no",
                address: {
                    country: "Norway",
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
                    first: "AppMedia"
                },
                isOwn: false,
                type: "Company",
                __v: 0
            },
            isOrder: true,
            forSales: true,
            projectmanager: {
                _id: "55b92ad221e4b7c40f0000cb",
                dateBirth: "1994-09-29T07:00:00.000Z",
                ID: 3164,
                isLead: 0,
                fire: [ ],
                hire: [
                    {
                        date: "2015-07-12T21:00:00.000Z",
                        info: "2000 грн плюс %",
                        salary: 76,
                        jobType: "fullTime",
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
                jobType: "fullTime",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.676Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-03-11T13:56:34.507Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.676Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.676Z",
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
                source: "www.rabota.ua",
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
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00002e",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: "569f5d8c62d172544baf0d52",
                officeLocation: "",
                skype: "aljona_sonce",
                workPhones: {
                    phone: "",
                    mobile: "+380990849677"
                },
                personalEmail: "aljonaelagina@gmail.com",
                workEmail: "alona.yelahina@thinkmobiles.com",
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
                    last: "Yelahina",
                    first: "Alona"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            }
        },
        {
            _id: "56efd627c15eef4a33a48744",
            workflow: {
                _id: "55647b962e4aa3804a765ec6",
                color: "#2C3E50",
                name: "Invoiced",
                sequence: 1,
                status: "Done",
                wId: "Sales Order",
                wName: "order",
                source: "purchase",
                targetSource: [
                    "order"
                ],
                visible: true
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 900,
                total: 900
            },
            name: "PO907",
            orderDate: "2016-03-21T00:00:00.000Z",
            project: {
                _id: "56e292585def9136621b7800",
                TargetEndDate: "2016-04-20T00:00:00.000Z",
                StartDate: "2016-03-15T22:00:00.000Z",
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Usual 6%",
                            resource: "Eugen Lendyel",
                            bonus: 5400
                        }
                    ],
                    projectTeam: [
                        "56efcd99371928ed33490039"
                    ]
                },
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000603",
                        employeeId: "56029cc950de7f4138000005",
                        _id: "56efd692d9ee676b34e8c459",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-21T11:10:10.159Z",
                    user: "56d704f1805eb08d2b93d95f"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-03-11T09:39:36.607Z",
                    user: "56d704f1805eb08d2b93d95f"
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
                projectmanager: "56029cc950de7f4138000005",
                customer: "56e291651f2850d361927dd0",
                task: [ ],
                projectName: "Casino",
                projectShortDesc: "Flash to HTML5",
                __v: 0,
                EndDate: "2016-03-21T22:00:00.000Z",
                description: ""
            },
            supplier: {
                _id: "56e291651f2850d361927dd0",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-03-11T09:35:33.166Z",
                    user: "56d704f1805eb08d2b93d95f"
                },
                createdBy: {
                    date: "2016-03-11T09:35:33.166Z",
                    user: "56d704f1805eb08d2b93d95f"
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
                jobPosition: "CTO",
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
                company: null,
                email: "gil@gamescale.com",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Strauss",
                    first: "Gil"
                },
                isOwn: false,
                type: "Person",
                __v: 0
            },
            isOrder: true,
            forSales: true,
            projectmanager: {
                _id: "56029cc950de7f4138000005",
                dateBirth: "1994-03-06T00:00:00.000Z",
                transferred: [ ],
                lastFire: null,
                fire: [ ],
                hire: [
                    {
                        date: "2015-09-22T21:00:00.000Z",
                        info: "2000 грн плюс %",
                        salary: 76,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00002e",
                        department: "55b92ace21e4b7c40f000014"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 157,
                jobType: "fullTime",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-09-23T12:36:25.361Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-03-10T13:43:54.311Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-09-23T12:36:25.361Z",
                    user: "55ba28c8d79a3a3439000016"
                },
                creationDate: "2015-09-23T12:36:25.360Z",
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
                source: "www.rabota.ua",
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
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00002e",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: "56d704f1805eb08d2b93d95f",
                officeLocation: "",
                skype: "zhenyalendel",
                workPhones: {
                    phone: "",
                    mobile: "+380950870448"
                },
                personalEmail: "zhenyalendel13@gmail.com",
                workEmail: "eugen.lendyel@thinkmobiles.com",
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
                    last: "Lendyel",
                    first: "Eugen"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            }
        }
    ];
    var fakeOrderById = {
        _id: "56e6a7067c22c0704120b1dd",
        expectedDate: "2016-03-13T21:00:00.000Z",
        __v: 0,
        editedBy: {
            date: "2016-03-14T11:57:31.722Z",
            user: "55b9fbcdd79a3a3439000007"
        },
        createdBy: {
            date: "2016-03-14T11:56:54.829Z",
            user: "55b9fbcdd79a3a3439000007"
        },
        creationDate: "2016-03-14T11:56:54.829Z",
        groups: {
            group: [ ],
            users: [ ],
            owner: {
                _id: "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        whoCanRW: "everyOne",
        workflow: {
            _id: "55647b932e4aa3804a765ec5",
            name: "Not Invoiced",
            status: "New"
        },
        products: [
            {
                unitPrice: 8000,
                scheduledDate: "2016-03-14T00:00:00.000Z",
                taxes: 0,
                subTotal: 8000,
                jobs: {
                    _id: "56e6a6b1ef05acd9418dff38",
                    name: "MS2 14.03.16-01.04.16"
                },
                description: "",
                product: {
                    _id: "5540d528dacb551c24000003",
                    name: "IT services"
                },
                quantity: 616
            }
        ],
        paymentInfo: {
            taxes: 0,
            unTaxed: 8000,
            total: 8000
        },
        paymentTerm: null,
        invoiceRecived: false,
        invoiceControl: null,
        incoterm: null,
        destination: null,
        name: "PO888",
        orderDate: "2016-03-14T00:00:00.000Z",
        deliverTo: {
            _id: "55543831d51bdef79ea0d58c",
            name: "YourCompany"
        },
        project: {
            _id: "56ab5ceb74d57e0d56d6bda5",
            projectName: "CAPT"
        },
        supplier: {
            _id: "56ab5ca674d57e0d56d6bda4",
            name: {
                last: "Maurstad",
                first: "Stian"
            },
            fullName: "Stian Maurstad",
            id: "56ab5ca674d57e0d56d6bda4"
        },
        isOrder: true,
        type: "Not Invoiced",
        forSales: true,
        currency: {
            rate: 1,
            _id: {
                _id: "565eab29aeb95fa9c0f9df2d",
                sequence: 0,
                name: "USD"
            }
        }
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
                _id: "56224c43c558b13c1bbf8756",
                login: "Kodenko"
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
                _id: "55b9dd7a7a3632120b000006",
                login: "larysa.popp"
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
    var fakeIncoterm = {
        data: [
            {
                _id: "55537115475b7be475f33602",
                code: "CIP",
                name: "CARRIAGE AND INSURANCE PAID TO"
            },
            {
                _id: "55537115475b7be475f33601",
                code: "CPT",
                name: "CARRIAGE PAID TO"
            },
            {
                _id: "55537115475b7be475f335ff",
                code: "CFR",
                name: "COST AND FREIGHT"
            },
            {
                _id: "55537115475b7be475f33600",
                code: "CIF",
                name: "COST, INSURANCE AND FREIGHT"
            },
            {
                _id: "55537115475b7be475f33603",
                code: "DAF",
                name: "DELIVERED AT FRONTIER"
            },
            {
                _id: "55537115475b7be475f33608",
                code: "DAP",
                name: "DELIVERED AT PLACE"
            },
            {
                _id: "55537115475b7be475f33607",
                code: "DAT",
                name: "DELIVERED AT TERMINAL"
            },
            {
                _id: "55537115475b7be475f33609",
                code: "DDP",
                name: "DELIVERED DUTY PAID"
            },
            {
                _id: "55537115475b7be475f33606",
                code: "DDU",
                name: "DELIVERED DUTY UNPAID"
            },
            {
                _id: "55537115475b7be475f33605",
                code: "DEQ",
                name: "DELIVERED EX QUAY"
            },
            {
                _id: "55537115475b7be475f33604",
                code: "DES",
                name: "DELIVERED EX SHIP"
            },
            {
                _id: "55537115475b7be475f335fb",
                code: "EXW",
                name: "EX WORKS"
            },
            {
                _id: "55537115475b7be475f335fd",
                code: "FAS",
                name: "FREE ALONGSIDE SHIP"
            },
            {
                _id: "55537115475b7be475f335fc",
                code: "FCA",
                name: "FREE CARRIER"
            },
            {
                _id: "55537115475b7be475f335fe",
                code: "FOB",
                name: "FREE ON BOARD"
            }
        ]
    }

    var view;
    var topBarView;
    var listView;

    var orderCollection;

    describe('SalesOrder View', function () {

        var $fixture;
        var $elFixture;

        after(function () {
            listView.remove();
            topBarView.remove();
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
                view = new MainView({el: $elFixture, contentType: 'salesOrder'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="63"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="63"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/salesOrder');
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
                var orderUrl = new RegExp('\/quotation\/list', 'i');

                server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeOrders)]);
                orderCollection = new OrderCollection({
                    viewType: 'list',
                    contentType: 'salesOrder',
                    page: 1
                });
                server.respond();

                topBarView = new TopBarView({
                    collection: orderCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Order');
            });
        });

        describe('SalesOrder ListView', function () {
            var server;
            var $thisEl;
            var windowConfirmStub;
            var mainSpy;
            var createInvoiceStub;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to application ListView', function () {
                    listView = new ListView({
                        collection: orderCollection
                    });

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

                    orderCollection.bind('showmore', listView.showMoreContent, listView);
                });

                it('Try to filter listView by Status and SM', function () {
                    var $next;
                    var $prev;
                    var $selectedItem;
                    var $salesManager;
                    var $status;
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var orderUrl = new RegExp('\/quotation\/list', 'i');

                    $searchArrow.click();
                    expect($thisEl.find('.search-options')).to.not.have.class('hidden');

                    //select SM
                    $salesManager = $searchContainer.find('#salesmanagerFullContainer > .groupName');
                    $salesManager.click();
                    $next = $searchContainer.find('.next');
                    $next.click();
                    $prev = $searchContainer.find('.prev');
                    $prev.click();
                    $selectedItem = $searchContainer.find('#salesmanagerUl > li').first();

                    server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeOrders[0], fakeOrders[1]])]);
                    $selectedItem.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);

                    // select status
                    $status = $searchContainer.find('#workflowFullContainer > .groupName');
                    $status.click();
                    $selectedItem = $searchContainer.find('li[data-value="55647b962e4aa3804a765ec6"]');

                    server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeOrders[0]])]);
                    $selectedItem.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(1);

                    // uncheck status filter
                    server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeOrders[0], fakeOrders[1]])]);
                    $selectedItem.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);

                    $searchArrow.click();
                    expect($thisEl.find('.search-options')).to.have.class('hidden');
                });

                it('Try to close SM filter', function(){
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $closeFilterBtn = $searchContainer.find('span[data-value="salesmanager"]').next();
                    var orderUrl = new RegExp('\/quotation\/list', 'i');

                    server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeOrders)]);
                    $closeFilterBtn.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                });

                it('Try to open CreateView', function () {
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.exist;

                    $('.ui-dialog').remove();
                });

                it('Try to delete item', function(){
                    var $deleteBtn;
                    var $checkBox = listView.$el.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var orderUrl = new RegExp('\/quotation\/', 'i');

                    $checkBox.click();
                    $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    server.respondWith('DELETE', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"success":{"_id":"56fcd6fc0bbb61c30355b4fd","expectedDate":"2016-03-31T00:00:00.000Z","__v":0,"editedBy":{"date":"2016-03-31T07:52:04.451Z","user":"55b9fc0fd79a3a3439000008"},"createdBy":{"date":"2016-03-31T07:51:24.623Z","user":"55b9fc0fd79a3a3439000008"},"creationDate":"2016-03-31T07:51:24.623Z","groups":{"group":[],"users":[],"owner":"560c099da5d4a2e20ba5068b"},"whoCanRW":"everyOne","workflow":"55647b962e4aa3804a765ec6","products":[{"scheduledDate":"2016-03-31T00:00:00.000Z","subTotal":3000,"taxes":0,"unitPrice":3000,"jobs":"564cfdd06584412e618421de","description":"","product":"5540d528dacb551c24000003","quantity":530}],"paymentInfo":{"taxes":0,"unTaxed":3000,"total":3000},"paymentTerm":null,"invoiceRecived":false,"invoiceControl":null,"incoterm":null,"destination":null,"name":"PO918","orderDate":"2016-03-31T00:00:00.000Z","deliverTo":"55543831d51bdef79ea0d58c","project":"55b92ad621e4b7c40f000686","supplier":"55b92ad621e4b7c40f00064b","isOrder":true,"type":"Not Invoiced","forSales":true,"currency":{"rate":1,"_id":"565eab29aeb95fa9c0f9df2d"}}})]);
                    $deleteBtn.click();
                    server.respond();
                });

                it('Try to go to edit form', function(){
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var orderUrl = new RegExp('\/Order\/form', 'i');
                    var usersUrl = new RegExp('\/users\/forDd', 'i');
                    var incotermUrl = '/incoterm';

                    server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeOrderById)]);
                    server.respondWith('GET', usersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);
                    server.respondWith('GET', usersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);
                    $needTd.click();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to change tab in EditView', function(){
                    var $dialogEl = $('.ui-dialog');
                    var $firstTab = $dialogEl.find('.dialog-tabs > li:nth-child(1) > a');
                    var $secondTab = $dialogEl.find('.dialog-tabs > li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($secondTab).to.have.class('active');

                    $firstTab.click();
                    expect($firstTab).to.have.class('active');
                });

                it('Try to delete NotInvoiced Order with error response', function(){
                    var spyResponse;
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    var orderUrl = new RegExp('\/order\/', 'i');

                    server.respondWith('DELETE', orderUrl, [403, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                });

                it('Try to delete NotInvoiced Order ', function(){
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    var orderUrl = new RegExp('\/order\/', 'i');

                    server.respondWith('DELETE', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"success":{"_id":"56c6ebd80769bba2647ae701","__v":0,"proformaCounter":0,"editedBy":{"date":"2016-04-11T07:01:01.309Z","user":"52203e707d4dba8813000003"},"createdBy":{"date":"2016-02-19T10:18:00.060Z","user":"52203e707d4dba8813000003"},"creationDate":"2016-02-19T10:18:00.060Z","groups":{"group":[],"users":[],"owner":"55ba28c8d79a3a3439000016"},"attachments":[],"whoCanRW":"everyOne","workflow":"55647b932e4aa3804a765ec5","products":[{"scheduledDate":"","jobs":"56afda4cf5c2bcd4555cb2f1","description":"","product":"5540d528dacb551c24000003","unitPrice":360000,"subTotal":360000,"taxes":0,"quantity":42}],"paymentInfo":{"taxes":0,"unTaxed":360000,"total":360000},"paymentTerm":null,"invoiceRecived":false,"invoiceControl":null,"incoterm":null,"destination":null,"name":"PO825","expectedDate":"2016-02-19T00:00:00.000Z","orderDate":"2016-02-19T00:00:00.000Z","deliverTo":"55543831d51bdef79ea0d58c","project":"56030dbffa3f91444e00000d","supplier":"56030d81fa3f91444e00000c","isOrder":true,"type":"Not Invoiced","forSales":true,"currency":{"rate":1,"_id":"565eab29aeb95fa9c0f9df2d"}}})]);
                    $deleteBtn.click();
                    server.respond();


                });

                it('Try to receive invoice', function(){

                    var $needTd = listView.$el.find('#listTable > tr:nth-child(3) > td:nth-child(2)');
                    var orderUrl = new RegExp('\/Order\/form', 'i');
                    var usersUrl = new RegExp('\/users\/forDd', 'i');
                    var incotermUrl = '/incoterm';
                    var orderUrl = new RegExp('\/order\/', 'i');
                    var invoiceUrl = '/invoice/receive';
                    var $dialog;
                    var $receiveInvoiceBtn;

                    server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeOrderById)]);
                    server.respondWith('GET', usersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);
                    server.respondWith('GET', usersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                    $dialog = $('.ui-dialog');
                    $receiveInvoiceBtn = $dialog.find('.receiveInvoice');
                    server.respondWith('PATCH', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                    server.respondWith('POST', invoiceUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Created success'})]);
                    $receiveInvoiceBtn.click();
                    server.respond();
                    server.respond();

                });

                /*it('Try to edit item with error response', function(){
                    var $dialog;
                    var orderFormUrl = new RegExp('\/Order\/form', 'i');
                    var usersUrl = new RegExp('\/users\/forDd', 'i');
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');

                    server.respondWith('GET', orderFormUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeOrderById)]);
                    server.respondWith('GET', usersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    $dialog = $('.ui-dialog');
                });*/

                it('Try to edit item', function(){
                    var $next;
                    var $prev;
                    var $selectedItem;
                    var $selectUsersEl = $('.assignees-info a');
                    var $dialog = $('.ui-dialog');
                    var $secondTab = $dialog.find('.dialog-tabs > li:nth-child(2) > a');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var orderUrl = new RegExp('\/order\/', 'i');
                    var orderFormUrl = new RegExp('\/Order\/form', 'i');
                    var usersUrl = new RegExp('\/users\/forDd', 'i');
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');

                    server.respondWith('GET', orderFormUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeOrderById)]);
                    server.respondWith('GET', usersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsers)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    $secondTab.click();
                    $selectUsersEl.click();
                    $next = $dialog.find('.next');
                    $next.click();
                    $prev = $dialog.find('.prev');
                    $prev.click();
                    $selectedItem = $dialog.find('#55ba28c8d79a3a3439000016');
                    $selectedItem.click();

                    server.respondWith('PATCH', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    //expect($('.ui-dialog')).to.not.exist;
                    expect(window.location.hash).to.be.equals('#easyErp/salesOrder/list/p=1/c=100/filter=%7B%22forSales%22%3A%7B%22key%22%3A%22forSales%22%2C%22value%22%3A%5B%22true%22%5D%7D%7D');
                });


            });
        });

    });


});
