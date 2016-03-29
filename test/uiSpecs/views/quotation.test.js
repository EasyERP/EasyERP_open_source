/*
define([
    'text!fixtures/index.html',
    'collections/Quotation/filterCollection',
    'views/main/MainView',
    'views/Quotation/list/ListView',
    'views/Quotation/thumbnails/ThumbnailsView',
    'views/Quotation/form/FormView',
    'views/Quotation/TopBarView',
    'views/Quotation/CreateView',
    'views/Quotation/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, QuotationCollection, MainView, ListView, ThumbnailsView, FormView, TopBarView, CreateView, EditView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var fakeQuotation = [
        {
            _id: "56e7c1d6c64e96844ef3d6a6",
            workflow: {
                _id: "5555bf276a3f01acae0b5560",
                color: "#2C3E50",
                name: "Not Ordered",
                sequence: 3,
                status: "New",
                wId: "Purchase Order",
                wName: "order",
                source: "purchase",
                targetSource: [
                    "quotation"
                ],
                visible: true
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 1500,
                total: 1500
            },
            name: "PO899",
            orderDate: "2016-03-15T00:00:00.000Z",
            project: {
                _id: "563295f6c928c61d052d5003",
                StartDate: "2015-11-08T22:00:00.000Z",
                budget: {
                    bonus: [],
                    projectTeam: [
                        "56e7c174977124d34db582b3",
                        "56e7bf95d4cfab3c4eae5990",
                        "564cfdd06584412e618421c3"
                    ]
                },
                bonus: [],
                health: 1,
                editedBy: {
                    date: "2016-03-15T08:40:22.631Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                attachments: [],
                notes: [],
                projecttype: "web",
                createdBy: {
                    date: "2015-10-29T21:56:06.723Z",
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
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: "55b92ad221e4b7c40f00004a",
                customer: "55cf4f834a91e37b0b000102",
                task: [],
                projectName: "WordPress Sites",
                projectShortDesc: "Site Templates Business",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2016-03-09T22:00:00.000Z",
                description: ""
            },
            supplier: {
                _id: "55cf4f834a91e37b0b000102",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    user: "55b9dd7a7a3632120b000006",
                    date: "2015-08-18T19:13:00.284Z"
                },
                createdBy: {
                    date: "2015-08-15T14:41:07.792Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    owner: "55ba28c8d79a3a3439000016",
                    users: [],
                    group: []
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                salesPurchases: {
                    isCustomer: false,
                    isSupplier: false,
                    active: false,
                    salesPerson: null,
                    reference: "",
                    language: ""
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    phone: "902-489-0901",
                    mobile: ""
                },
                skype: "",
                jobPosition: "",
                website: "http://www.sharperbuilds.com/",
                address: {
                    street: "61 Raddall Avenue",
                    city: "Dartmouth",
                    state: "NS",
                    zip: "B3B 1T4",
                    country: "Canada"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    first: "SharperBuilds",
                    last: ""
                },
                isOwn: false,
                type: "Company",
                __v: 0,
                relatedUser: null
            },
            isOrder: false,
            forSales: true,
            projectmanager: {
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
                attachments: [],
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
                    group: [],
                    users: [],
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
        }, {
            _id: "56e7c36bdae0bc904da269a9",
            workflow: {
                _id: "5555bf276a3f01acae0b5560",
                color: "#2C3E50",
                name: "Not Ordered",
                sequence: 3,
                status: "New",
                wId: "Purchase Order",
                wName: "order",
                source: "purchase",
                targetSource: [
                    "quotation"
                ],
                visible: true
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 600,
                total: 600
            },
            name: "PO900",
            orderDate: "2016-03-15T00:00:00.000Z",
            project: {
                _id: "563295f6c928c61d052d5003",
                StartDate: "2015-11-08T22:00:00.000Z",
                budget: {
                    bonus: [],
                    projectTeam: [
                        "56e7c174977124d34db582b3",
                        "56e7bf95d4cfab3c4eae5990",
                        "564cfdd06584412e618421c3"
                    ]
                },
                bonus: [],
                health: 1,
                editedBy: {
                    date: "2016-03-15T08:40:22.631Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                attachments: [],
                notes: [],
                projecttype: "web",
                createdBy: {
                    date: "2015-10-29T21:56:06.723Z",
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
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: "55b92ad221e4b7c40f00004a",
                customer: "55cf4f834a91e37b0b000102",
                task: [],
                projectName: "WordPress Sites",
                projectShortDesc: "Site Templates Business",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2016-03-09T22:00:00.000Z",
                description: ""
            },
            supplier: {
                _id: "55cf4f834a91e37b0b000102",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    user: "55b9dd7a7a3632120b000006",
                    date: "2015-08-18T19:13:00.284Z"
                },
                createdBy: {
                    date: "2015-08-15T14:41:07.792Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    owner: "55ba28c8d79a3a3439000016",
                    users: [],
                    group: []
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                salesPurchases: {
                    isCustomer: false,
                    isSupplier: false,
                    active: false,
                    salesPerson: null,
                    reference: "",
                    language: ""
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    phone: "902-489-0901",
                    mobile: ""
                },
                skype: "",
                jobPosition: "",
                website: "http://www.sharperbuilds.com/",
                address: {
                    street: "61 Raddall Avenue",
                    city: "Dartmouth",
                    state: "NS",
                    zip: "B3B 1T4",
                    country: "Canada"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACMAIwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8qqKKKACiiggjqKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBQpPpS+W3qPzr0/wp8FNW1u3+1XZMSnpkitm7/Z9u44HeCfLgZAyK9+lw1mVamqsaTsz52txTldGq6MqqujzXwj4TufFN99jt2wfriuj8X/CXUfC9gb6aTco/wBrNbnwo0u70DxfJp96hR13D69K9U+KelX+u6QNOslJZyM/nXvZbw9QxOVVK04v2qureZ89mnEuIwub0qFOS9lKzb8vU+TjGQM5H503FezXHwCvE0n7SkxM4BJHFed6T4M1bV9bbRLaM+YjYY56DOK+ZxWSY3CThCrTactvM+qwmfYDGwnOlUTUN/I5/wAtvUUhUiva7f8AZ8umiUzXGGxyMr1rlvGHwk1jw0FnjUyQkgE5HGT7VtiOHMxw1P2tSk7GGG4nyzFVfY06quefBCecj86QISccV65oPwPuNY0uO/E2PMXPaotF+Buq3upXVrdEpFCAUbjnmnHhvMZKDVN+9sKXE+WR506q93c8oKkHHFL5Z9RXofij4S6joWrQWaEtDMVG7I6muhf4BXpsRcRTEuy5AyKmnw7mFSc6cabvHcqpxNltOEKkqqtLY8bCE9xTSMHFezab8Ab6e1aS6mKyYyBwa861bwbqul68NCaJjK7bVrLF5HjsFCNStTaUtEbYPPsBjqkqdCom46swAhPpSFCBnivYtJ+AV/dWaT3U+13AOCRVPxP8D9T0ewa+tXMgQZIyK6J8M5lCl7Z0nbc5ocU5XUrexVVXvY8pVS3TFBQjuK9G8D/Ci58V2slwXMZjIBHHp71p3XwL1OGdo42LKOh4rOlw/mFakq0KbcWa1eI8uoVpUKlRKS3Pf7mKSHR5UsQFcAlQB3rl/B/iO/8AOlg1/MbB2Clu4zxWb4D8W67FZiDxPaPGoz87LtFdfqekaZ4ksiIHVS4+V0OMH8K/YKVd46MMThm00vhelz8Uq0FgJTwuKimm/jWtvQ4O7e0l+ICS2bKxxyV+orr/ABz4p/4RWyS88veWIGPqcV5n4X0W68N+PpLW7nMysWKsSTxketdf8ZiP7Hi4z8y/+hV5OGxVaGAxNdLlnzPTsezisJRqZhhcO3zwcVr3R1uhao2s6GuokYMqnivOPh9Pp9t431RrhkjfZxkf7Zru/A5/4pG3P+ya8n0XwrN4l+IV5Ml00MUIDMAxG75iO1a5jVq3wdWEeabe3qtzHLKNG2OpTlyQS39Hodx4h8T6xJ4jtrLRVZ7dnUSMvQc812HiC3in0SWO4QOAhPI7gGsS/wBZ0Hwe0GnFVa5lIUFiCefrW7qMhm0J5WGC8ZOPwNeph1f2yqT5pPddI+R5OIdvYSp0+WK2fWWu5keAiw8Npk8KpNUvD/jdtW8UXmg+Vt+zqp3euSR/Sr3gP/kXF/3DXlmmeLbDwl8RNUn1HAWREAOQP4jXnV8c8DRwjcuWLdn6WPTw2XrH1sZGMeaaV4+t0ek/EXCw2YwM+eOa17nUn0zw0L77xii3fkCa888QfEnRfFE1pY2LZfzgfvA13PiAeX4NlDf88D/6Ca6aOMp16uIrYeV0orVehy18FUw1LDUMTCzcno+1yt8P/FzeLrN7pk2mMgYrM1nTLS58bxXckQMisCPyqj8DmDaTPjHUdPpWzqBA8Wxn/aH8qxo1ZYzLaFStq20b1qUcFmdelQ0Siybx/qGraXpkMmkoxfgEL9Kv6HNdaj4ZWTUY/wB48fzA/SpfE+v6d4fsVu9RjV0xwDj096x4vHCXmmNdWVk3ksvy4Ax0rtqVKVHFyc6m8fh7eZwU6Vavg4KFLaXxd/ITwTax2V/dRW4Coz5I/CtLVfEn9n3slr5YOzvWX4Cumvrue4ZdpLdD9KTxHC7avMygYJrCjVlSwUZUdNX9xvVpRq4+Ua+ui+/Q3tV0+21TQ5YbeJCzqQpUd6x/h/o+s6TDNDqkhZd7FMnOBnivGPC/xv1rRoRaXiCWMfxFjn+VaOr/AB/1OW3aHT4F3OMZLEY/SvFjxRlNSUcXKTUoq1j3ZcJ5zSjPBRinCTve/wDVjr7qeO6+IaxwsGKA5x25FanxmVv7FhOP4k/9Crwjw98QdQ0nXH1qcedLISTuPrXQeM/jFdeKrRLZrVIwpB+Unsc15MOI8FUwNeM3ac27I9mfDOOpY/Dygrwgkmz3fwQjf8IhbjH8JrjPh0p/4TXVOeidP+BmuI0P46XukaSmmi1RwgwCSa57RfidqGi+JJdagiDLPgOpJAxkmuqtxLl7eFkpX5N9NtLHLR4WzFLFqUUuf4dd9bnu/irwI2v69a6qZCq27KcZ9DXVasm3RpY06LGR+hrwHXPj5q140a2MSxrwWwxH9KfcfHu/m08Wf2Zc7Cpbcea7ocT5NRnVdNu8t33Z50+FM7rU6KqJWhsr7I9j8Bqw8Orkfwmvm34o8eMrzPoP5muo0H453uj6eLH7IjAAjJY1554l1yTxBq02pyLtMvavmuIc5wmPy+jQoSvKO/3H1PDWR43L8yrYjERtGW33l3wOwPiS0x/z0WvrK+08anoIsS2PNixn6g18meBBnxJaD/potfV+sXE1p4ZeeA4kjhLDn0Br1uB3H6nXc1oePx8pfXcOoPXp95Q8C+EB4TtHtw+8OQc5rG1rUrS18aQ200oDu4A59q8707486rpsM1tfQLJKvCksT/SvPdZ8b6trGtjW5ZCsqtuUBs4qsbxRl+HwtOlg09GtOyW5OB4TzLEYurWxrWqevdvY+kviT4duvEmkQ29pzjBOPpV7w9o1vo3hdbW9hTMcY3Ej0FeNaF8fNVtYVt9QgUhFADBiSf0qt4m+Oes6vbPY2cSxxuMFwxB/lXS+JcnjOWOTbm1a1jljwtnUqccBJJU4yve57D4JlgudQuZLIDylfHH0qXXlc6nLivCfBXxYvfCdvJCE84yEEliav33xrvbu5acwKN3bcaxpcUZe8HGM5Wle7RtW4SzGONlOnG8bWTvucafAfiYcnT3NRv4J8SRjcdOfivqG9eCysZLz7MjeWM42jmud8I+MbDxVNNCtgkbQsVIYA5wcV+Vn66fNVxY3VrN9nnhZHzjBFatt4L8Q3cIngsWZCMg16n8Y/DtjC1vqdrEscgkQNgdea7jwQsUvhe2doYyTFn7ooA+Zn0TUUvRp7QHzycbav3HgrxFawNcTWDLGo3E+1d7egf8ACzYsImPMHG3jpXqXi2OJfC10ywpnyOu0egoA+ZtM8N6vq4c2Nq0mwkHFLqHhvV9LCG8tGj3kAZ969e+CyIwvNyKR5rdRVj4xoiLYhI0XMsfRR/fFAHkaeB/EjxiVdPcqRnNY11azWczQXCFXXqDX1rp0ER0eNjDHny/7o9K+ZvHQA8SXYAAwew9zQBT8O2+sSXyzaPEzTRncMV6Jc+IfivNZtZSrOY2UqR7Yqp8Edv8Aa8m5FYbe4zXrnjDxFa+FbIX0tksqFguAB3rrw+OxOFi4UZuKe9mceIy/DYuSnXgpNbXR833vhrX4N891YuMnJOKxSpU7SCCO1fV2h3el+LdGF2trEEmXJXaMivEvEnhCGy8cxacq4hlkAx+Ga5G77nWklscxpHhHW9Zw1pZuyH+LFa9z8L/EkEJlW1dsdq+grSysfD+hrJb2yYiiDn5Rk8Csrwl46tPFV7cWQshEYGK/Ng5xQM+ab3T7vT5jBdwtG47Gq9e3/G/RdPjs0v4oVSXHJAx3rxREjK5ZsGgD661SOSfSZ4Ihl3XAFcJ8NPCup6Lf3d1qCbBI7EcY4ya76/nNpp0t2BkxjIFct4H8bt4nuLi2ljCmFmHfscUAcv8AGPxBZytBpkLZl8xCR+Ndz4GXZ4YtVPaKuA+MfhiC3uYNYgb5vMUMPxr0DwO2/wAMWz+sVAHl1/8A8lPj/wCug/lXq3i7/kU7r/rgf5CvKr8Z+J8X/XQfyr1Xxcf+KUuv+uB/kKAOE+CnS8/66tU/xl6WH/XWP/0MVB8FOl5/11ap/jL0sP8ArrH/AOhigD0LTuNEj/65/wBK+Y/HP/IyXf1/qa+nNN/5Asf/AFz/AKV8x+Ogf+EluwPX+poA674I/wDIXk/3a734y8+Gzn++tcF8Ef8AkLyf7td98ZP+RbP++v8AWgCb4O/8itDz/CK474oXi6d4ytL44AWQE/lXY/B0f8UtD/uiuF+MFpLqHiOKxgGZHbA/KgD2HTbu11jRYnjYSRyRqrY57DNcfJoMvgm+m1vTIvMjlJZxjJ5rA8HWHjPwqE+2N5ljgMQXJwD7V6dYajYa3bMkZWRCNrr1waAPFviR8QrbxNYi0iiKOowwI5615rHOEULtB/CvSfi74LttFuf7TsUCxy5YqOB1xXm8YgKAv1oA+tdYy2j3CKMsy8CvPfhXoF/p+o3l3dxFFd2x/wB9GnP8a9GxgoD/AMCqM/G3R0U+VCo9gRQBa+M8qJpsO5xnzEOPxrofh5Ok/hS2KNnEQHFeD+OPHN34ru9xJWFfuitj4e/EyTwyv2K8y9v064xQB093oeov8RI7xYD5PmZLfhXoXjWYQ+E7otgfuCOfoK5pfjB4XMRmKJvH+1z/ACrhPiB8VG8QW39n6f8ALCcg85yCKAOo+CZ3R3b/AN6RjU3xkYYsfaWP/wBDFcZ8N/H1l4Xt5IrocsSeuKl8e/EWx8Ri2ECf6p1Y8+jZoA9x0w/8SaL3j4/KvBPFngjXdQ1+5ngtmKHkH8TXaWfxo0mG0ihKDKrg/NUn/C69D3Z+zpn6j/CgDnfhHp9xpevyW10hVwvSu9+K9jdajoQtrSMu7OvArzyy+JWmweJJNV8oBGXGM11Mnxs0Vid0SsPQsKAOk+GWl3WkeHIYbtSr7RkGuF8aXsM/xFtEjcEiUZ59qk1j43QmzePTYwJGGBgjivJ7nXL651P+1ZJSZg24GgD6o1KNpNAeMDLNAAMfSuD+Ftrq9nql9FeowhaRiuazvDPxntEso7bVl+ZAFySBnFbVx8YfDMEZkt0QOR2agCr8cHQaOiEjOBj868Oght3jDO+Cfaug8deN7vxXeFtxECkhRXKZ9KAHbx6Ubx6U2igANAOOtFFADtw9/wA6aTnoKKKAFUgdRQxB6CkooAcGA7Ubx6U2igBcjOcUu8elNooAUsD0FJRRQAuRRu9zSUUABNFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/2Q==",
                name: {
                    first: "SharperBuilds",
                    last: ""
                },
                isOwn: false,
                type: "Company",
                __v: 0,
                relatedUser: null
            },
            isOrder: false,
            forSales: true,
            projectmanager: {
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
                attachments: [],
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
                    group: [],
                    users: [],
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

    var fakeWorkflow = [
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
        }
    ];

    var fakeQuotationForm = {
        _id: "56e7c1d6c64e96844ef3d6a6",
        expectedDate: "2016-03-14T22:00:00.000Z",
        __v: 0,
        editedBy: {
            date: "2016-03-15T08:03:34.117Z",
            user: "56239e0ce9576d1728a9ed1d"
        },
        createdBy: {
            date: "2016-03-15T08:03:34.117Z",
            user: "56239e0ce9576d1728a9ed1d"
        },
        creationDate: "2016-03-15T08:03:34.117Z",
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
            _id: "5555bf276a3f01acae0b5560",
            name: "Not Ordered",
            status: "New"
        },
        products: [
            {
                unitPrice: 1500,
                scheduledDate: "2016-03-15T00:00:00.000Z",
                taxes: 0,
                subTotal: 1500,
                jobs: {
                    _id: "564cfdd06584412e618421c3",
                    name: "02.11-21.01"
                },
                description: "",
                product: {
                    _id: "5540d528dacb551c24000003",
                    name: "IT services"
                },
                quantity: 409
            }
        ],
        paymentInfo: {
            taxes: 0,
            unTaxed: 1500,
            total: 1500
        },
        paymentTerm: null,
        invoiceRecived: false,
        invoiceControl: null,
        incoterm: null,
        destination: null,
        name: "PO899",
        orderDate: "2016-03-15T00:00:00.000Z",
        deliverTo: {
            _id: "55543831d51bdef79ea0d58c",
            name: "YourCompany"
        },
        project: {
            _id: "563295f6c928c61d052d5003",
            projectName: "WordPress Sites"
        },
        supplier: {
            _id: "55cf4f834a91e37b0b000102",
            name: {
                last: "",
                first: "SharperBuilds"
            },
            fullName: "SharperBuilds ",
            id: "55cf4f834a91e37b0b000102"
        },
        isOrder: false,
        type: "Not Ordered",
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

    var fakeCurrencies = {
        data: [
            {
                _id: "565eab29aeb95fa9c0f9df2d",
                sequence: 0,
                name: "USD"
            },
            {
                _id: "565eab34aeb95fa9c0f9df2e",
                sequence: 1,
                name: "EUR"
            },
            {
                _id: "565eab3faeb95fa9c0f9df2f",
                sequence: 2,
                name: "UAH"
            }
        ]
    };

    var quotationCollection;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;

    describe('QuotationView', function () {
        var $fixture;
        var $elFixture;

        before(function(){
            windowConfirmStub = sinon.stub(window, 'confirm');
        });

        after(function(){
            view.remove();
            topBarView.remove();
            listView.remove();

            windowConfirmStub.restore();
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

                view = new MainView({el: $elFixture, contentType: 'salesQuotation'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="62"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="62"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/salesQuotation');

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
                var quotationUrl = new RegExp('\/quotation\/list', 'i');

                server.respondWith('GET', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotation)]);

                quotationCollection = new QuotationCollection({
                    count: 100,
                    viewType: 'list',
                    contentType: 'salesQuotation'
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: quotationCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

            it('Try to switch view type', function(){
                var $listTemplateBtn = topBarView.$el.find('#listBtn');

                $listTemplateBtn.click();

                expect(window.location.hash).to.be.equals('#easyErp/Quotation/list');
            });

        });

        describe('List View', function () {
            var server;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create listView', function (done) {
                    var $listHolder;
                    var quotationUrl = new RegExp('\/quotation\/list', 'i');
                    var workflowUrl = new RegExp('\/workflows\/fetch', 'i');

                    setTimeout(function(){
                        server.respondWith('GET', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotation)]);
                        server.respondWith('GET', workflowUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWorkflow)]);

                        listView = new ListView({
                            collection: quotationCollection,
                            startTime: new Date()
                        });

                        server.respond();
                        server.respond();

                        $listHolder = listView.$el;
                        expect($listHolder).to.exist;

                        done();

                    }, 100);
                });

                it('Try to sort list', function () {
                    var quotationUrl = new RegExp('\/quotation\/list', 'i');
                    var $thSortEl = listView.$el.find('table > thead > tr > th.oe_sortable');

                    server.respondWith('GET', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeQuotation[1], fakeQuotation[0]])]);
                    $thSortEl.click();
                    server.respond();
                    expect(listView.$el.find('tr:nth-child(1) > td.total').text()).to.be.equals('600.00');

                    server.respondWith('GET', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotation)]);
                    $thSortEl.click();
                    server.respond();
                    expect(listView.$el.find('tr:nth-child(1) > td.total').text()).to.be.equals('1 500.00');

                });

                it('Try to go to edit form', function(){
                    var quotationFormUrl = new RegExp('\/quotation\/form\/', 'i');
                    var currencyUrl = new RegExp('\/currency\/getForDd', 'i');
                    var $needTd = listView.$el.find('tr:nth-child(1) > td:nth-child(3)');

                    server.respondWith('GET', quotationFormUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotationForm)]);
                    server.respondWith('GET', currencyUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCurrencies)]);

                    $needTd.click();

                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to change tabs', function(){
                    var $dialogEl = $('.ui-dialog');
                    var $firstTab = $dialogEl.find('ul.dialog-tabs > li:nth-child(1) > a');
                    var $secondTab = $dialogEl.find('ul.dialog-tabs > li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($dialogEl.find('ul.dialog-tabs > li:nth-child(2) > a')).to.have.class('active');

                    $firstTab.click();
                    expect($dialogEl.find('ul.dialog-tabs > li:nth-child(1) > a')).to.have.class('active');

                });

                /!*it('Try to confirm order', function(){
                    var workflowUrl = new RegExp('\/workflows\/getFirstForConvert', 'i');
                    var quotationUrl = new RegExp('\/quotation\/', 'i');
                    var $dialogContainer = $('.ui-dialog');
                    var $confirmOrderBtn = $dialogContainer.find('.confirmOrder');

                    server.respondWith('GET', workflowUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
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
                    })]);
                    //server.respondWith('PATCH', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);

                    $confirmOrderBtn.click();

                    server.respond();
                    //server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Order/list');
                });*!/


                /!*it('Try to create vacation item', function(){
                    var createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $listTableEl = listView.$el.find('#listTable');

                    createBtn.click();
                    listView.createItem();

                    expect($listTableEl.find('tr:nth-child(1) > td:nth-child(1)').text()).to.be.equals('Select');

                });

                it ('Try to save item', function(){
                    var $prevBtn;
                    var $nextBtn;
                    var $needEmployee;
                    var $typeEl;
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $needGrid = listView.$el.find('#false > td:nth-child(3)');
                    var $employeeSelect = listView.$el.find('#false > td.editable.employee');
                    var vacationUrl = new RegExp('\/vacation\/', 'i');

                    $employeeSelect.click();

                    $nextBtn = listView.$el.find('a.next');
                    $nextBtn.click();

                    $prevBtn = listView.$el.find('a.prev');
                    $prevBtn.click();

                    $needEmployee = listView.$el.find('#55b92ad221e4b7c40f000084');
                    $needEmployee.click();

                    $needGrid.click();
                    $typeEl = listView.$el.find('#E');
                    $typeEl.click();

                    server.respondWith('POST', vacationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    listView.saveItem();
                    server.respond();

                    expect(listView.$el.find('#listTable > tr:nth-child(1) > td.editable.E.selectedType').text()).to.equals('E');
                });

                it('Try to edit item', function(){
                    var $needType;
                    var $saveBtn;
                    var $needGrid = listView.$el.find('#listTable > tr:nth-child(3) > td.editable:nth-child(3)');
                    var vacationUrl = new RegExp('\/vacation\/', 'i');

                    $needGrid.click();
                    $needType = listView.$el.find('#P');
                    $needType.click();

                    $saveBtn = topBarView.$el.find('#top-bar-saveBtn');

                    server.respondWith('PATCH', vacationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    listView.saveItem();
                    server.respond();

                    expect(listView.$el.find('#listTable > tr:nth-child(3) > td.editable:nth-child(3)').text()).to.equals('P');

                });

                it('Try to delete item', function(){
                    var $emptyEl;
                    var $needGrid = listView.$el.find('#listTable > tr:nth-child(5) > td.editable.V.selectedType');
                    var vacationUrl = new RegExp('\/vacation\/', 'i');

                    windowConfirmStub.returns(true);

                    server.respondWith('DELETE', vacationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $needGrid.click();
                    $emptyEl = listView.$el.find('#content > ul > li:nth-child(1)');
                    $emptyEl.click();
                    server.respond();

                    //expect(listView.$el.find('#listTable > tr:nth-child(3) > td.editable:nth-child(3)').text()).to.equals('');

                });*!/

            });

        });

    });

});
*/
