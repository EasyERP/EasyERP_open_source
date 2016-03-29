/*
define([
    'text!fixtures/index.html',
    'collections/wTrack/filterCollection',
    'views/main/MainView',
    'views/wTrack/list/ListView',
    'views/wTrack/TopBarView',
    'views/wTrack/CreateView',
    'views/wTrack/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, TCardCollection, MainView, ListView, TopBarView, CreateView, EditView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var fakeTCard = [
        {
            1: 8,
            2: 8,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            _id: "56efcd99371928ed3349003b",
            worked: 16,
            year: 2016,
            week: 12,
            month: 3,
            jobs: {
                _id: "56efcd99371928ed33490039",
                createdBy: {
                    date: "2016-03-21T10:31:53.561Z",
                    user: "56d704f1805eb08d2b93d95f"
                },
                editedBy: {
                    date: "2016-03-21T11:10:10.671Z",
                    user: "56d704f1805eb08d2b93d95f"
                },
                invoice: "56efd64e371928ed3349003c",
                quotation: "56efd627c15eef4a33a48744",
                budget: {
                    budgetTotal: {
                        minDate: 201611,
                        maxDate: 201612,
                        hoursByQA: 0,
                        revenueByQA: 0,
                        hoursSum: 40,
                        revenueSum: 900,
                        costSum: 0,
                        profitSum: 900
                    },
                    budget: [
                        {
                            revenue: 900,
                            hours: 40,
                            cost: 0,
                            profit: 900
                        }
                    ],
                    projectTeam: [
                        {
                            name: {
                                first: "Vyacheslav",
                                last: "Kopinets"
                            },
                            department: {
                                departmentName: "Web",
                                _id: "55b92ace21e4b7c40f000016"
                            },
                            jobPosition: {
                                name: "Senior JS",
                                _id: "55b92acf21e4b7c40f00002b"
                            },
                            _id: "55b92ad221e4b7c40f00004d"
                        }
                    ]
                },
                project: "56e292585def9136621b7800",
                wTracks: [
                    "56efcd99371928ed3349003b",
                    "56efcd99371928ed3349003a"
                ],
                type: "Invoiced",
                workflow: "56337c675d49d8d6537832ea",
                name: "prepayment",
                __v: 0
            },
            createdBy: {
                date: "2016-03-21T10:31:53.611Z",
                user: "56d704f1805eb08d2b93d95f"
            },
            isPaid: false,
            amount: 0,
            cost: 0,
            revenue: 36000,
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
                users: [ ],
                departmentManager: null,
                parentDepartment: "56cebdf6541812c07197358f",
                departmentName: "Web",
                __v: 0
            },
            employee: {
                _id: "55b92ad221e4b7c40f00004d",
                dateBirth: "1990-06-08T01:00:00.000Z",
                ID: 49,
                isLead: 1,
                fire: [
                    {
                        date: "2013-11-12T22:00:00.000Z",
                        info: "Update",
                        salary: 800,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f000017",
                        department: "55b92ace21e4b7c40f000016"
                    },
                    {
                        date: "2015-08-31T21:00:00.000Z",
                        info: "Update",
                        salary: 900,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department: "55b92ace21e4b7c40f000016"
                    },
                    {
                        date: "2015-10-31T22:00:00.000Z",
                        info: "Update",
                        salary: 1000,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department: "55b92ace21e4b7c40f000016"
                    },
                    {
                        date: "2015-11-30T22:00:00.000Z",
                        info: "Update",
                        salary: 1100,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department: "55b92ace21e4b7c40f000016"
                    }
                ],
                hire: [
                    {
                        date: "2013-11-12T22:00:00.000Z",
                        info: "",
                        salary: 800,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f000017",
                        department: "55b92ace21e4b7c40f000016"
                    },
                    {
                        date: "2015-08-31T21:00:00.000Z",
                        info: "",
                        salary: 900,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department: "55b92ace21e4b7c40f000016"
                    },
                    {
                        date: "2015-10-31T22:00:00.000Z",
                        info: "",
                        salary: 1000,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department: "55b92ace21e4b7c40f000016"
                    },
                    {
                        date: "2015-11-30T22:00:00.000Z",
                        info: "",
                        salary: 1100,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department: "55b92ace21e4b7c40f000016"
                    },
                    {
                        date: "2016-02-29T22:00:00.000Z",
                        info: "",
                        salary: 1200,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00002b",
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
                    date: "2015-07-29T19:34:42.436Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-03-11T13:40:29.150Z",
                    user: "55ba2f3ed79a3a343900001d"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.436Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.436Z",
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
                manager: "55b92ad221e4b7c40f000060",
                jobPosition: "55b92acf21e4b7c40f00002b",
                department: "55b92ace21e4b7c40f000016",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "slavik9901",
                workPhones: {
                    phone: "",
                    mobile: "+380988461758"
                },
                personalEmail: "slavik990@gmail.com",
                workEmail: "vyacheslav.kopynets@thinkmobiles.com",
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
                    last: "Kopinets",
                    first: "Vyacheslav"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBlFLiigQhGetMcED5akoxmkBledN520sRz0rQgZmBDc4olt45HQsMMDwRxUqqAMAUAKKWiloGFKKKBSAMUtLRQAlLilopAGKMUuKWgBMUuKKWgAxRS0UCAClxRilxTATFGKdijFAhAKKdRTEUaWlooLExRS0YoAjcfPH/vf0NSYpCMsvtz/n86digBBS0UuKACiiikAopaSloAWikpaQC0tJSigApQKBSgUAGKUClFLQAmKWlpcUCExRilpcUwG4op2KKBFGjFFLTKEpaKWgBn/LQfQ/0p9NOPNA77T/Sn0AJijFLS0gG4oxTqa7LGpZyFUDJJoAKjmuIYB+9kVM/3jjNYmo647Fo7Thf7+OfwrFkkeRtzsWJ7k5p2A6w6tZBseePwBoTWLJyAJsZ9VIrkeaUZo0A7mKaOVd0bqw9Qc1IDXDRSyRNlGZT6g1s6drTBvLujkf3u4pWA6IU4VEjh1DKQQehFSA0gHCnYpoNOFAC4pcUlOFAgxRilpaAExRS4opiM+iigUFC0tJTgtAESxkz+Zn+HGKlxT1WlkXgGgZHS0YpcUANPA54rmtX1I3MjRRn9yp7fxH1rR1298iEQxtiR+pHUCsO3tWmXd2obsCVyqRmjH41rx6eg+9zVhbOIfwCo5y+Q58AnoKlSIt2IxW8sCL0UD8KQ26E5Kg0c4+QyEgU4GcnPUdMU6S0fcWRSR9K11iVegFXbcIOGAxS5g5DF0vUmtJBFN/qie/8ADXTph0DKQVIyCKyta0lXt/tMC4K/eHrUHh29EbNaytjJymf5VSd0RKNjfApwpRTgKZIgp2KAKcBQAmKUClxSgUCExRTsUUCMoGlz7U8ClApXLGopLAVMRjtRCP3gqcxhunBpoCDOO1PJDRkd6RlIOCKbTAbiinYprZ2nHXFAHJatN9p1GQj7qnaPwq9bKFhUDpisjGZSBzk4rahXair6Cs5lwRKBS4pMgUFwKg1HDNIaA4PekLigY5RzU20gZFVhKoPUVKt1HjBYfnTSJZsW3720ZTzxXIXcRtr3cmBtbI/Oux0lldeMEGsbxFYGCffj5ZCSKcdGTLVGxCwkiRwchlBFSAVX04YsIB/sD+VWhWpiIBTgKUU4UhCAUoU04U4UAM2UVKKKBGPS4opaRY+EfPVlarxfeP0qdKBisAwwRULpt57VPSEUxFamtyCKkdO4qI0wOTtIv9LYMOUzn61auLgxLhBlz0FStFs1K64IyQR+NQTxNkuoyaze5otisRdMOZdv44qJhODjzs/8Cp7WzsCXJz2ogtQobzPmY9MdqYWZJavITgnOKmuPMCcUltCY3ySTxWg1t59u2OtTuy7aGA6FjmSTAqWGO3JA87mrBtjGxyuc8HNLZ2YjmDcN7OoI/LoapMho39EgNtiaFy6fxr1yKv8AiiMNp8ci87WwPoR/9aqNqkdmD9ldmyoBDHNaT7rvSpkfrtJGfbn+lICCzBW0hBPIQfyqwDUe0x4VgQcA80oatDEkzTgah3Uu6gCfNKDUG6l30WEWA1FV/MopWAp0oopQKRZLAPvGpFHNJbDIf8KlC4NACYpGFSYpjCmMiao2UGpGphpiMGRi11NuHIkK/lS4B602Ybbqf3kY/rSA1kzdAyA9BQIwoyacDTZSWQhetSWRCRVfnvWnYvFtBkfAY4Fc+0ZabLlg2OBnintF5gD5O5OFwapIm5qXClZ3R1wRUYUA8VGsksuGlOWAC/hT1PNLqM0tPQvIB610dhb7Scj5e/vWDpWGcA11NuQIzWlrIzbOdjVo4UWU5kXcHOc5IYg0uaHBCopPzBcN9c8/rTeaE9DOfxMdupd1MxRinckduo3U3FGKLiF3UU3FFACCnCkpwpFFq0HyE+9T4BqG1/1Z+tT0DGEUxhUhqN+ASeAKYiF6jqVhTMUAYupR7Lot/ewR/KqoNbOoWyTQtIR86LkH2rEJwamSNIsfnims+BxRuyKidTIMZIHt3rM0uRvOitjG496RboBuIzj6UrRsB8tMCSlucVQy5vQqCuVJ/hYYpygnkU63CyR+VOu4dvY06CMwzhGOVPQ09yWzS0vIcH3rp42227MegGTWHaQCPkVsSN5enSHr8uPz4qjNmXdMr3DlPu549/eosUtFBDExRS4paBCYpKdRigBtFOxRTERilFFLQMuW4/cipabAv7laeRSGMNU9TYpp1ww4Ow4/KrpFUdU/48Jfw/mKaBnLW2s3NtgMd6Dt/wDW/wD1Vu2OpJdqvyMpP5Vzd9Eqjcowc9q1dGGFi/D+QpvQFqbpHFc5dR+TO8Z/hPH07V0h6VyNzfm6vJWOAoPycY4qWNPUkJGOtCVWMwpFuBjmosaqRdyMU1WAaqbXGR1pguBnFCiHMbdtsdsEc+1Wp7Uq0Z7ZrGsLn9+BXQTXKuFUHoPSrJvc0rQjYFPcU/ULlB5dvuAcjft746f4/lVKCYRpvdgAByT2rkbnU5LnVZLgMQGb5ccHA4FC1FLY6+iq2n3X2q3DnbuHBwc1apmYYoxRS0gExRinUYoATFFOAopiIsUoFLijFUM0IV/cp/uinbafGmI1HoAKcVosBVlOzHGc1S1cqumSu3A+Xk/7wrUZAeozWL4sPl6JIP7zKP1z/ShLUTehy1+wMYIIIJ4IrW0QZS3+n9K5wv8AuvK7A5B/Cum0FNq249j/ACNJjWxrzqzQSKv3ipArg5T5c24Ensa6rWdZFoxgtwGl/iY9F/8Ar1y0hDA5bCjtigBrN3FISDSL0pduaksbjnrS4FJ5bdqAjUCLlkAHBrZS4iiXc7CueTclOLO/BJoGi9qOqPcqY4/lj7+9ZEHzSD+dWGG1fepbS32MJZEBT+I/3R61USZM6PRIzHbEEqc4OV6Vp1mxzJYQxg8RliBnp1/StFGEiBlOQackShaUUAGlCmpGJSgU4JThGaYhgFFTCKiiwivRS1Sn1axtpCks43Dqqgt+HHGaoZ0wWjbXPnxfbld0VrKVHUysqfyzVSTxfcSOTb20KRj/AJ6FmP5jFAHVbKxfFMCy6YiucL5oz+TVz8vifU5WKxzKg9kH+FZk1zJPIcuZJG6u5zRcVhptok3YfIz19qf9tlVPkby4xwMHk1A3P7oNnJyxpmQ7Z/5ZpQ9R7Cudx5JLH+HtUbZDYPUEZpyuSCFOFHJPrTTtyMZx1JpAKG3sWyAKcMEZBoEAMCkNgkVCSU+UkdexpNJjTaLAz9aXk9BUUUrKc7cg9qsrcR9wR9alqxaaGbGanFAg5pWuIwOCM1XeVnOcHAoSbBtIkwxbcVyg647Cta1iW3LlHzC6KR9cnIH+e9ULXAhdnGMqcr6Ajr/n1p092ARGrfeQDjsf8elapWRk3dlm9vPNuNsb7SgKlW+6eev5VIdQa0WNFYo27kA5Az/kfrWaH2grMqsduVYdajH+kQuxJMgOaBHTW+shXSKdASf4lPX8K1De2ywtKzkKv3vkJI/ACuIZzJao4PzR9/X/ADxUs8zMsdwjZ243D1pWGdhDq2myDK3kQ/3jt/nipf7SsFxm6hwehDgj865GWa1kt0ZoFOTyyYU/5+tNhtwsIminiIyCySr8p+vUUWFc7hbq0LKguYCzcKvmDJPtzRXKWIeW+spDHCF+0xMDHCi455BKge1FVyk8wuram80flQ7o4z95s4J9v89f544ULwoH+9jkfnU2/cCDz2NVWPltyR+VIsl3FsJuAH50x2LN5aHC9zUYbPGSf1pSRGhPQsOlABIxX93F1P50jfuwEjILN1xTUOwF2zkihTtQyN1PSkA454iQjP8AEaa5BIiTOz1pMmNT/fakP7tMfxH3oGDYZyFGFFK7FydowvSkYlIgnc9aQgAhRnmgBZSDtGc4UCkiUNIBnilbDvgcYpuTGwYdR60rBce0e08Nj0pCsnPzUokbGSoNKZSf4f1oAYxkUEk5pY2wVL8r6etI7FgRjFNAzgZwR0poTJ2m8xnUHaG4yfSm56xuMkdDURbJAPBFK48t1Yc96dxWJY2YTAP9KkiIiu2H8LDgVDP95H5p027csgOfpSGPjIV3iPQ9OadbvsZoXPBqOTJVZlPNEnzKJFPNAEkT+VI0Lco3rT4nMMpicZR6ifEkQdc7hzxTh/pEA7utAFq2mayuCm4+W3Qg0VGg+02xVs706ZFFMkaOAO341BPgHg896KKCiNWO4fNTs73z2A5oopANY+Y+P4RQDukyQML0+tFFAAmGYyscegpEIYmR+g6UUUAIp8yQMRwKUAtLuHTFFFADEPzGnHkk9KKKAFQZTn8KCMGiigBMZPFJ90E0UUADJlNwPanj97D7iiigBYiJIyjHp3pYXHMT89hRRQARkxOY2+6fWlQ7WaM5welFFIBImMchQ9D0zT48w3IH8LGiimIlVhFdPt4zzRRRQwP/2Q==",
                isEmployee: true,
                __v: 0
            },
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
            },
            customer: {
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
            workflow: {
                _id: "528ce7f2f3f67bc40b000023",
                __v: 0,
                attachments: [ ],
                color: "#2C3E50",
                name: "In Progress",
                sequence: 2,
                status: "In Progress",
                wId: "Projects",
                wName: "project",
                source: "project",
                targetSource: [
                    "project"
                ],
                visible: true
            }
        }, {
            1: 8,
            2: 8,
            3: 8,
            4: 8,
            5: 8,
            6: 0,
            7: 0,
            _id: "56efb9a06f572c5034f6f172",
            worked: 40,
            month: 3,
            year: 2016,
            week: 12,
            jobs: {
                _id: "564cfdd06584412e618421bb",
                budget: {
                    budgetTotal: {
                        minDate: 201534,
                        maxDate: 201612,
                        hoursByQA: 341,
                        revenueByQA: 699.289183222958,
                        hoursSum: 6342,
                        revenueSum: 14960.329999999998,
                        costSum: 6556.549999999999,
                        profitSum: 8403.79
                    },
                    budget: [
                        {
                            revenue: 1660.6999999999994,
                            hours: 704,
                            cost: 1079.58,
                            profit: 581.13
                        },
                        {
                            revenue: 25.95,
                            hours: 11,
                            cost: 47.06,
                            profit: -21.11,
                            byQA: {
                                hours: 11,
                                revenue: 25.947650583412173
                            }
                        },
                        {
                            revenue: 1316.28,
                            hours: 558,
                            cost: 1715.7199999999998,
                            profit: -399.44
                        },
                        {
                            revenue: 1415.34,
                            hours: 600,
                            cost: 1798.9199999999998,
                            profit: -383.58000000000004
                        },
                        {
                            revenue: 691.12,
                            hours: 293,
                            cost: 102.69,
                            profit: 588.4299999999998,
                            byQA: {
                                hours: 293,
                                revenue: 66079.23052664773
                            }
                        },
                        {
                            revenue: 87.28,
                            hours: 37,
                            cost: 181.85,
                            profit: -94.57,
                            byQA: {
                                hours: 37,
                                revenue: 3823.7401450646485
                            }
                        },
                        {
                            revenue: 405.74,
                            hours: 172,
                            cost: 330.95000000000005,
                            profit: 74.78999999999999
                        },
                        {
                            revenue: 1375.2200000000003,
                            hours: 583,
                            cost: 110.32,
                            profit: 1264.9000000000003
                        },
                        {
                            revenue: 1924.9099999999992,
                            hours: 816,
                            cost: 716.2299999999999,
                            profit: 1208.68
                        },
                        {
                            revenue: 2113.619999999999,
                            hours: 896,
                            cost: 346.5,
                            profit: 1767.1199999999992
                        },
                        {
                            revenue: 1566.3499999999995,
                            hours: 664,
                            cost: 126.73,
                            profit: 1439.6199999999994
                        },
                        {
                            revenue: 2377.8199999999993,
                            hours: 1008,
                            cost: 0,
                            profit: 2377.8199999999993
                        }
                    ],
                    projectTeam: [
                        {
                            name: {
                                first: "Vitaliy",
                                last: "Shuba"
                            },
                            department: {
                                departmentName: "Android",
                                _id: "55b92ace21e4b7c40f000010"
                            },
                            jobPosition: {
                                name: "Head of Android",
                                _id: "564438aa70bbc2b740ce8a19"
                            },
                            _id: "55b92ad221e4b7c40f00004e"
                        },
                        {
                            name: {
                                first: "Vladimir",
                                last: "Gerasimenko"
                            },
                            department: {
                                departmentName: "QA",
                                _id: "55b92ace21e4b7c40f000011"
                            },
                            jobPosition: {
                                name: "Junior QA",
                                _id: "55b92acf21e4b7c40f000018"
                            },
                            _id: "55b92ad221e4b7c40f000052"
                        },
                        {
                            name: {
                                first: "Anatoliy",
                                last: "Dalekorey"
                            },
                            department: {
                                departmentName: "iOS",
                                _id: "55b92ace21e4b7c40f00000f"
                            },
                            jobPosition: {
                                name: "Head of iOS",
                                _id: "564436a370bbc2b740ce8a17"
                            },
                            _id: "55b92ad221e4b7c40f000059"
                        },
                        {
                            name: {
                                first: "Vasiliy",
                                last: "Cheypesh"
                            },
                            department: {
                                departmentName: "Web",
                                _id: "55b92ace21e4b7c40f000016"
                            },
                            jobPosition: {
                                name: "Middle JS",
                                _id: "55b92acf21e4b7c40f00001c"
                            },
                            _id: "55b92ad221e4b7c40f000062"
                        },
                        {
                            name: {
                                first: "Sergiy",
                                last: "Tilishevsky"
                            },
                            department: {
                                departmentName: "QA",
                                _id: "55b92ace21e4b7c40f000011"
                            },
                            jobPosition: {
                                name: "Junior QA",
                                _id: "55b92acf21e4b7c40f000018"
                            },
                            _id: "55b92ad221e4b7c40f000064"
                        },
                        {
                            name: {
                                first: "Vasilisa",
                                last: "Klimchenko"
                            },
                            department: {
                                departmentName: "QA",
                                _id: "55b92ace21e4b7c40f000011"
                            },
                            jobPosition: {
                                name: "Junior QA",
                                _id: "55b92acf21e4b7c40f000018"
                            },
                            _id: "55b92ad221e4b7c40f00007f"
                        },
                        {
                            name: {
                                first: "Kirill",
                                last: "Gorbushko"
                            },
                            department: {
                                departmentName: "iOS",
                                _id: "55b92ace21e4b7c40f00000f"
                            },
                            jobPosition: {
                                name: "Middle iOS",
                                _id: "55b92acf21e4b7c40f00001d"
                            },
                            _id: "55b92ad221e4b7c40f000085"
                        },
                        {
                            name: {
                                first: "Roman",
                                last: "Kubichka"
                            },
                            department: {
                                departmentName: "PM",
                                _id: "55bb1f40cb76ca630b000007"
                            },
                            jobPosition: {
                                name: "Junior PM",
                                _id: "561b73fb9ebb48212ea838bf"
                            },
                            _id: "55b92ad221e4b7c40f000086"
                        },
                        {
                            name: {
                                first: "Maxim",
                                last: "Sychov"
                            },
                            department: {
                                departmentName: "Android",
                                _id: "55b92ace21e4b7c40f000010"
                            },
                            jobPosition: {
                                name: "Middle Android",
                                _id: "55b92acf21e4b7c40f000022"
                            },
                            _id: "55b92ad221e4b7c40f000089"
                        },
                        {
                            name: {
                                last: "Korneychuk",
                                first: "Andriy"
                            },
                            department: {
                                departmentName: "Android",
                                _id: "55b92ace21e4b7c40f000010"
                            },
                            jobPosition: {
                                name: "Junior Android",
                                _id: "55b92acf21e4b7c40f000021"
                            },
                            _id: "55b92ad221e4b7c40f0000a8"
                        },
                        {
                            name: {
                                last: "Vovk",
                                first: "Andriy"
                            },
                            department: {
                                departmentName: "Web",
                                _id: "55b92ace21e4b7c40f000016"
                            },
                            jobPosition: {
                                name: "Junior JS",
                                _id: "55b92acf21e4b7c40f000017"
                            },
                            _id: "55b92ad221e4b7c40f0000cd"
                        },
                        {
                            name: {
                                first: "Roman",
                                last: "Vizenko"
                            },
                            department: {
                                departmentName: "iOS",
                                _id: "55b92ace21e4b7c40f00000f"
                            },
                            jobPosition: {
                                name: "Junior iOS",
                                _id: "55b92acf21e4b7c40f00002c"
                            },
                            _id: "55dd73d1f09cc2ec0b000008"
                        }
                    ]
                },
                project: "55b92ad621e4b7c40f0006d4",
                wTracks: [
                    "56e7e158977124d34db582b5",
                    "56e7e138701f50ac4d0a4994",
                    "56e6dc12d4cfab3c4eae5975",
                    "56e6dbb10d773c634e918b67",
                    "563d1ce29fcf4921408f8c45",
                    "55d19e968f61e2c90b000015",
                    "563cb57270bbc2b740ce89a3",
                    "566afa58a74aaf316eaea7eb",
                    "563cb55b70bbc2b740ce89a0",
                    "56167f076167262c3b528928",
                    "563db3ad9fcf4921408f8cae",
                    "563cb52870bbc2b740ce899d",
                    "563cb50770bbc2b740ce899a",
                    "563caf7b70bbc2b740ce8986",
                    "562bc02062461bfd59ef58c5",
                    "563ca38a70bbc2b740ce8985",
                    "56e67d715ec71b00429745a6",
                    "563ca37670bbc2b740ce8983",
                    "562bdfb846bca6e4591f492c",
                    "55ffad32a36a8ca10c00000e",
                    "56e6da1887b309154e4e4483",
                    "563d1d159fcf4921408f8c47",
                    "55ffaf43a36a8ca10c000014",
                    "563ca34570bbc2b740ce8982",
                    "563ca1d170bbc2b740ce897e",
                    "563ca13470bbc2b740ce897d",
                    "562fcf614011c9181e3b46f4",
                    "566afaeca74aaf316eaea7f5",
                    "562c174346bca6e4591f493f",
                    "562fe4d7aa0771941db66274",
                    "562bf269b4677e225aa31e10",
                    "563ca1e270bbc2b740ce8980",
                    "562fe4c6d40a09d61dbe6250",
                    "55debeb3ae2b22730b000025",
                    "562bdfd0129820ab5994e8db",
                    "562bdfb2f9ccedb2591836e2",
                    "563d2a859fcf4921408f8c9c",
                    "561387e5c90e2fb026ce0672",
                    "55f672a23645b3020c000014",
                    "562bdfc5f9ccedb2591836e3",
                    "562bf2704a431b5a5a31120e",
                    "563d1cf89fcf4921408f8c46",
                    "56029d468a97723838000005",
                    "562bdfddf9ccedb2591836e4",
                    "5624ebcf19a2ecca01ca84ab",
                    "56dfff6db2ba0d1b26c50c09",
                    "560bf3a4a5d4a2e20ba50676",
                    "565d6da9f6427f253cf6be64",
                    "561688ff6167262c3b528932",
                    "55ded107ae2b22730b00003d",
                    "562bdfd6d2d9ab425a6dd070",
                    "56167f076167262c3b52892a",
                    "56e14cd5177f76f72edf7747",
                    "563d2a7f9fcf4921408f8c9b",
                    "563d1f209fcf4921408f8c4a",
                    "566afaeca74aaf316eaea7f7",
                    "5617c2b19ebb48212ea8389d",
                    "56e6da47701f50ac4d0a4987",
                    "563ca1d870bbc2b740ce897f",
                    "55f56056b81672730c000026",
                    "562bdfbf62461bfd59ef58cc",
                    "562fe4b9547f50b51d6de2b4",
                    "56167f076167262c3b528929",
                    "55f56469b81672730c000034",
                    "563ca38370bbc2b740ce8984",
                    "561688ff6167262c3b528933",
                    "562c0d60d2d9ab425a6dd07d",
                    "566afa58a74aaf316eaea7ee",
                    "56c47c77d2b48ede4ba421fe",
                    "55f5604db81672730c000025",
                    "55f56037b81672730c000023",
                    "562bc00ad2d9ab425a6dd067",
                    "561387e5c90e2fb026ce0674",
                    "5608e968b9ddf79747000008",
                    "56cad2465b5327a650b82df1",
                    "56dfdc1563258985052a10b5",
                    "56dffef0b2ba0d1b26c50c08",
                    "56405d0170bbc2b740ce89df",
                    "56167f076167262c3b52892b",
                    "56e6db910d773c634e918b66",
                    "5624af2ae9576d1728a9ed3b",
                    "56d95424b6dcdce60d165abe",
                    "55d19e038f61e2c90b000010",
                    "56405d0170bbc2b740ce89e0",
                    "563729f6c928c61d052d5008",
                    "566afa58a74aaf316eaea7ec",
                    "55f56044b81672730c000024",
                    "562fe4a94011c9181e3b46f5",
                    "56cad2265b5327a650b82df0",
                    "5602d8db70418b2d4800000b",
                    "55debc4dae2b22730b00001d",
                    "563d1f199fcf4921408f8c49",
                    "55d19e0e8f61e2c90b000011",
                    "55d19fb78f61e2c90b00001f",
                    "56e7e12d701f50ac4d0a4993",
                    "563d2a789fcf4921408f8c9a",
                    "563ca32b70bbc2b740ce8981",
                    "55ded0d7ae2b22730b00003b",
                    "55d19fb88f61e2c90b000020",
                    "56e6db68977124d34db582a1",
                    "563cb4de70bbc2b740ce8997",
                    "562bbfea62461bfd59ef58c4",
                    "566afa58a74aaf316eaea7ea",
                    "56e6da680d773c634e918b64",
                    "56122a70c90e2fb026ce0645",
                    "56ab4f2174d57e0d56d6bd7f",
                    "55debe9aae2b22730b000023",
                    "560bf396a5d4a2e20ba50674",
                    "566afaeca74aaf316eaea7f9",
                    "56029db950de7f4138000007",
                    "5602d84c788a7c364800000d",
                    "566afa58a74aaf316eaea7ed",
                    "55f569c5b81672730c00004c",
                    "5602d873788a7c364800000e",
                    "55f5644bb81672730c000033",
                    "561387e5c90e2fb026ce0671",
                    "5602d8b770418b2d4800000a",
                    "569cae6ccf1f31f925c026eb",
                    "56029dc0e118b34a38000005",
                    "560bf39ea5d4a2e20ba50675",
                    "560bf3aba5d4a2e20ba50677",
                    "560bf4a2a5d4a2e20ba5067b",
                    "560bf3b1a5d4a2e20ba50678",
                    "561387e5c90e2fb026ce0673",
                    "563d2a719fcf4921408f8c99",
                    "56dfdc4c5a1ca692053924e0",
                    "56e67d7f81046d9741fb66f8",
                    "562c16c4129820ab5994e8e9",
                    "561387e5c90e2fb026ce0675",
                    "56167f076167262c3b52892c",
                    "563d2a939fcf4921408f8c9d",
                    "563d2aa99fcf4921408f8c9e",
                    "5640518f70bbc2b740ce89c3",
                    "563db3bc9fcf4921408f8caf",
                    "563db3d99fcf4921408f8cb0",
                    "566afaeca74aaf316eaea7f6",
                    "563cb4c270bbc2b740ce8995",
                    "55ded120ae2b22730b00003f",
                    "566afaeca74aaf316eaea7f8",
                    "566afaeca74aaf316eaea7fa",
                    "566afb83a74aaf316eaea801",
                    "563db3a79fcf4921408f8cad",
                    "566afb83a74aaf316eaea802",
                    "562fe4ebaa0771941db66275",
                    "566afb83a74aaf316eaea803",
                    "56dfdb2c5a1ca692053924df",
                    "56e7e14e701f50ac4d0a4995",
                    "566afb83a74aaf316eaea804",
                    "566afbe1a74aaf316eaea80c",
                    "562fe4ce2f5ac5581d8891b2",
                    "566e83488453e8b464b709d0",
                    "566afb83a74aaf316eaea805",
                    "56c47c13d2b48ede4ba421f9",
                    "565d603cf6427f253cf6be32",
                    "563db3a09fcf4921408f8cac",
                    "55ded0e1ae2b22730b00003c",
                    "562fe491547f50b51d6de2b3",
                    "56e6da970d773c634e918b65",
                    "562fe4de4011c9181e3b46f6",
                    "560bf49ca5d4a2e20ba5067a",
                    "562fcf59aa0771941db66273",
                    "55debebeae2b22730b000026",
                    "55debca1ae2b22730b000021",
                    "562c0d5af9ccedb2591836f8",
                    "56dffe70a12a4f3c26919c99",
                    "562bc002129820ab5994e8d2",
                    "55debea7ae2b22730b000024",
                    "56efb9a06f572c5034f6f172",
                    "55e073f5368becd00b00002f",
                    "563db3999fcf4921408f8cab",
                    "56e14d2cd62294582e10ca60",
                    "55debc97ae2b22730b000020",
                    "55e07452368becd00b000032",
                    "56811112c699b1b24862bd60",
                    "562fcf51b03714731dd84338",
                    "560bf3fda5d4a2e20ba50679",
                    "55ded111ae2b22730b00003e",
                    "563d1f129fcf4921408f8c48",
                    "56c47c21d2b48ede4ba421fa",
                    "55debc8eae2b22730b00001f",
                    "562fcf4aa0eb6af71d684ba7",
                    "560bf4a9a5d4a2e20ba5067c",
                    "561387e5c90e2fb026ce0676",
                    "560bf4afa5d4a2e20ba5067d",
                    "55e0740a368becd00b000030",
                    "569cae5fcf1f31f925c026ea",
                    "562dfeb5f9ccedb259183709",
                    "569cae94cf1f31f925c026ee",
                    "56c47c30d2b48ede4ba421fb",
                    "56c47c3ed2b48ede4ba421fc",
                    "56d9540c8230197c0e08903d",
                    "56c47c4cd2b48ede4ba421fd",
                    "55d19fb18f61e2c90b00001e",
                    "56c47c84d2b48ede4ba421ff",
                    "56dfdcb25a1ca692053924e1",
                    "56dffe4ff20b93842671670c",
                    "5602d8d5f301563f4800000b",
                    "562fe4e42f5ac5581d8891b3",
                    "56e14ce9aeb5e8b52e89d180",
                    "56e19344aeb5e8b52e89d18a",
                    "562fe4c0547f50b51d6de2b5",
                    "56e6771681046d9741fb66f0",
                    "56029d538a97723838000006",
                    "56e1af85177f76f72edf775b",
                    "55e0742a368becd00b000031",
                    "56e68bc268e298b24198565b",
                    "56e6db4ad4cfab3c4eae5974"
                ],
                type: "Invoiced",
                workflow: "56337c675d49d8d6537832ea",
                name: "34",
                __v: 0,
                quotation: "56d97300e9beed110652619f",
                invoice: "56d9730936cb5d0c06d68267",
                payments: [ ],
                editedBy: {
                    date: "2016-03-21T09:06:41.674Z",
                    user: "56c44e38b81fd51e19207f40"
                },
                createdBy: {
                    user: null,
                    date: "2015-12-28T10:38:10.211Z"
                }
            },
            createdBy: {
                date: "2016-03-21T09:06:40.868Z",
                user: null
            },
            isPaid: false,
            amount: 0,
            cost: 0,
            revenue: 9435.50930305897,
            department: {
                _id: "55b92ace21e4b7c40f00000f",
                ID: 1,
                sequence: 3,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-02-25T08:41:05.787Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:38.907Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: "56cebdf6541812c07197358f",
                departmentName: "iOS",
                __v: 0
            },
            employee: {
                _id: "55dd73d1f09cc2ec0b000008",
                dateBirth: "1983-11-14T00:00:00.000Z",
                lastFire: null,
                fire: [
                    {
                        date: "2015-08-23T21:00:00.000Z",
                        info: "Update",
                        salary: 350,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f000059",
                        jobPosition: "55b92acf21e4b7c40f00002c",
                        department: "55b92ace21e4b7c40f00000f"
                    }
                ],
                hire: [
                    {
                        date: "2015-08-23T21:00:00.000Z",
                        info: "",
                        salary: 350,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f000059",
                        jobPosition: "55b92acf21e4b7c40f00002c",
                        department: "55b92ace21e4b7c40f00000f"
                    },
                    {
                        date: "2015-12-31T22:00:00.000Z",
                        info: "",
                        salary: 400,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f000059",
                        jobPosition: "55b92acf21e4b7c40f00002c",
                        department: "55b92ace21e4b7c40f00000f"
                    }
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 141,
                jobType: "fullTime",
                gender: "male",
                marital: "married",
                contractEnd: {
                    date: "2015-08-26T08:07:45.485Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-03-14T12:16:52.314Z",
                    user: "56c47f1ed2b48ede4ba42201"
                },
                createdBy: {
                    date: "2015-08-26T08:07:45.485Z",
                    user: "55ba28c8d79a3a3439000016"
                },
                creationDate: "2015-08-26T08:07:45.485Z",
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
                age: 32,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "British",
                coach: null,
                manager: "55b92ad221e4b7c40f000059",
                jobPosition: "55b92acf21e4b7c40f00002c",
                department: "55b92ace21e4b7c40f00000f",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "cossackx",
                workPhones: {
                    phone: "",
                    mobile: "+380509399494"
                },
                personalEmail: "",
                workEmail: "roman.vizenko@thinkmobiles.com",
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
                    last: "Vizenko",
                    first: "Roman"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            project: {
                _id: "55b92ad621e4b7c40f0006d4",
                EndDate: "2016-03-24T22:00:00.000Z",
                StartDate: "2015-05-31T21:00:00.000Z",
                ID: 2107,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "566afbe5a74aaf316eaea812",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000603",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "566afbe5a74aaf316eaea811",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "566afbe5a74aaf316eaea810",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T08:12:36.090Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.416Z",
                    user: "52203e707d4dba8813000003"
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
                projectmanager: "55b92ad221e4b7c40f00005f",
                customer: "55b92ad621e4b7c40f00063c",
                task: [ ],
                projectName: "M-Government",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 103960.74
                        },
                        {
                            percentage: "Sales/Usual 6%",
                            resource: "Peter Voloshchuk",
                            bonus: 311882.22000000003
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Yana Gusti",
                            bonus: 103960.74
                        }
                    ],
                    projectTeam: [
                        "56e67274ef05acd9418dff20",
                        "564cfdd06584412e618421bb",
                        "564cfd8ba6e6390160c9ef7d"
                    ]
                },
                TargetEndDate: "",
                description: ""
            },
            projectmanager: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        info: "плюс %",
                        salary: 450,
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
                    date: "2016-03-11T13:43:16.079Z",
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
                relatedUser: "55b9fc0fd79a3a3439000008",
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
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0
            },
            customer: {
                _id: "55b92ad621e4b7c40f00063c",
                ID: 1068,
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
                    first: "DigiPresents"
                },
                isOwn: false,
                type: "Person",
                __v: 0
            },
            workflow: {
                _id: "528ce7f2f3f67bc40b000023",
                __v: 0,
                attachments: [ ],
                color: "#2C3E50",
                name: "In Progress",
                sequence: 2,
                status: "In Progress",
                wId: "Projects",
                wName: "project",
                source: "project",
                targetSource: [
                    "project"
                ],
                visible: true
            }
        }
    ];

    var fakeProjectForWTrack = {
        data: [
            {
                _id: "56e689c75ec71b00429745a9",
                TargetEndDate: "2016-03-31T00:00:00.000Z",
                StartDate: "2016-03-13T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56e6f1ae0d773c634e918b68"
                    ],
                    bonus: []
                },
                bonus: [],
                health: 1,
                editedBy: {
                    date: "2016-03-14T16:19:02.059Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [],
                notes: [],
                projecttype: "iOs",
                createdBy: {
                    date: "2016-03-14T09:52:07.280Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [],
                    group: []
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00005f",
                    name: {
                        last: "Voloshchuk",
                        first: "Peter"
                    }
                },
                customer: {
                    _id: "56a9eeabd59a04d6225b0df5",
                    name: {
                        last: "Voloshchuk",
                        first: "Peter"
                    }
                },
                task: [],
                projectName: "360CamSDK",
                projectShortDesc: "SDK",
                __v: 0,
                EndDate: "2016-03-24T22:00:00.000Z"
            },
            {
                _id: "569f60d162d172544baf0d58",
                StartDate: "2015-11-30T22:00:00.000Z",
                budget: {
                    bonus: [],
                    projectTeam: [
                        "56cf1b6e541812c071973595",
                        "56c599c7d2b48ede4ba4224b",
                        "56e291d1896e98a661aa831c",
                        "56b4be1799ce8d706a81b2e0",
                        "569f624a62d172544baf0d5c"
                    ]
                },
                bonus: [],
                health: 1,
                editedBy: {
                    date: "2016-03-16T10:35:13.214Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                attachments: [],
                notes: [],
                projecttype: "",
                createdBy: {
                    date: "2016-01-20T10:26:25.668Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "561ba8639ebb48212ea838c4",
                    name: {
                        last: "Yartysh",
                        first: "Nataliya"
                    }
                },
                customer: {
                    _id: "569f603762d172544baf0d57",
                    name: {
                        last: "Nahum",
                        first: "Nimrod"
                    }
                },
                task: [],
                projectName: "Android advertisement",
                projectShortDesc: "Supportment of app",
                __v: 0,
                EndDate: "2016-03-30T21:00:00.000Z",
                TargetEndDate: "",
                description: ""
            }
        ]
    };

    var fakeEmployee = {
        data: [
            {
                _id: "55b92ad221e4b7c40f000030",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    first: "Alex",
                    last: "Svatuk"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000031",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gleba",
                    first: "Alex"
                }
            }
        ]
    };

    var fakeDepsForDD = {
        data: [
            {
                _id: "55b92ace21e4b7c40f000012",
                nestingLevel: 1,
                parentDepartment: "56cebdf6541812c07197358f",
                departmentName: ".NET/WP"
            },
            {
                _id: "56e6775c5ec71b00429745a4",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "Admin"
            }
        ]
    };

    var fakeJobsWithId = [
        {
            _id: "56e6f1ae0d773c634e918b68",
            budget: {
                budgetTotal: {
                    profitSum: 0,
                    costSum: 0,
                    revenueSum: 0,
                    hoursSum: 76,
                    revenueByQA: 0,
                    hoursByQA: 0,
                    maxDate: 201612,
                    minDate: 201611
                },
                budget: [
                    {
                        profit: 0,
                        cost: 0,
                        hours: 64,
                        revenue: 0
                    },
                    {
                        profit: 0,
                        cost: 0,
                        hours: 12,
                        revenue: 0
                    }
                ],
                projectValues: [ ],
                projectTeam: [
                    {
                        _id: "55b92ad221e4b7c40f00007d",
                        jobPosition: {
                            _id: "55b92acf21e4b7c40f00001d",
                            name: "Middle iOS"
                        },
                        department: {
                            _id: "55b92ace21e4b7c40f00000f",
                            departmentName: "iOS"
                        },
                        name: {
                            last: "Volskiy",
                            first: "Stas"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000085",
                        jobPosition: {
                            _id: "55b92acf21e4b7c40f00001d",
                            name: "Middle iOS"
                        },
                        department: {
                            _id: "55b92ace21e4b7c40f00000f",
                            departmentName: "iOS"
                        },
                        name: {
                            last: "Gorbushko",
                            first: "Kirill"
                        }
                    }
                ]
            },
            name: "March"
        }
    ];

    var tCardCollection;
    var view;
    var topBarView;
    var listView;

    describe('tCardView', function () {
        var $fixture;
        var $elFixture;


        after(function () {
            view.remove();
            topBarView.remove();
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

                view = new MainView({el: $elFixture, contentType: 'wTrack'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="75"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="75"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/wTrack');

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
                var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                server.respondWith('GET', tCardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTCard)]);
                tCardCollection = new TCardCollection({
                    contentType: 'wTrack',
                    viewType: 'list'
                });
                server.respond();

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: tCardCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('wTrack');
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

        });

        describe('tCardView', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
            });

            after(function () {
                listView.remove();

                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create ListView', function () {
                    var $listHolder;
                    var projectsUrl = new RegExp('\/project\/getForWtrack', 'i');
                    var employeeUrl = new RegExp('\/employees\/getForDD', 'i');
                    var depsUrl = new RegExp('\/departments\/getForDD', 'i');

                    server.respondWith('GET', projectsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProjectForWTrack)]);
                    server.respondWith('GET', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployee)]);
                    server.respondWith('GET', depsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployee)]);

                    listView = new ListView({
                        startTime: new Date(),
                        collection: tCardCollection,
                        page: 1

                    });

                    server.respond();

                    $listHolder = listView.$el;

                    expect($listHolder.find('table')).to.exist;

                });

                it('Try to go sort', function () {
                    var $sortEl = listView.$el.find('th[data-sort="project.projectName"]');
                    var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                    server.respondWith('GET', tCardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTCard)]);
                    $sortEl.click();
                    server.respond();
                    expect(listView.$el.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('56efcd99371928ed3349003b');

                    server.respondWith('GET', tCardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeTCard[1], fakeTCard[0]])]);
                    $sortEl.click();
                    server.respond();
                    expect(listView.$el.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('56efb9a06f572c5034f6f172');

                });

                it('Try to create item', function(){
                    var $projectBtn;
                    var $employeeBtn;
                    var $select;
                    var $sprintBtn;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var jobUrl = new RegExp('\/jobs\/getForDD', 'i');
                    var wTrackUrl = '/wTrack/';

                    $createBtn.click();
                    listView.createItem();

                    $projectBtn = listView.$el.find('#listTable > tr.false > td:nth-child(5)');
                    $projectBtn.click();
                    $select = listView.$el.find('#56e689c75ec71b00429745a9');
                    $select.click();

                    $employeeBtn = listView.$el.find('#listTable > tr.false > td:nth-child(8)');
                    $employeeBtn.click();
                    $select = listView.$el.find('#55b92ad221e4b7c40f000030');
                    $select.click();

                    /!*$sprintBtn = listView.$el.find('#listTable > tr.false > td:nth-child(3)');
                    server.respondWith('GET', jobUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJobsWithId)]);
                    $sprintBtn.click();
                    server.respond();

                    $select = listView.$el.find('#56e6f1ae0d773c634e918b68');
                    $select.click();*!/

                    $sprintBtn = listView.$el.find('#listTable > tr.false > td:nth-child(3)');
                    $sprintBtn.removeClass(' errorContent');
                    $sprintBtn.text('March');

                    server.respondWith('POST', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({id: '56f9172a160c8d6315f0862f'})]);
                    listView.saveItem();
                    server.respond();

                    expect(listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(4)').text()).to.be.equals('Peter Voloshchuk')

                });

                it('Try to delete item', function(){
                    var $needCheckBtn = listView.$el.find('#listTable > tr:nth-child(2) > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    windowConfirmStub.returns(true);
                    $needCheckBtn.click();

                    server.respondWith('DELETE', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $deleteBtn.click();
                    listView.deleteItems();
                    server.respond();

                    expect(listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(4)').text()).to.be.equals('Peter Voloshchuk')

                });



            });

        });

    });

});
*/
