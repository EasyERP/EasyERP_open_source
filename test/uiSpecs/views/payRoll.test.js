/*
define([
    'text!fixtures/index.html',
    'collections/PayrollExpenses/filterCollection',
    'models/PayRollModel',
    'views/main/MainView',
    'views/PayrollExpenses/list/ListView',
    'views/PayrollExpenses/form/FormView',
    'views/PayrollExpenses/TopBarView',
    'views/PayrollExpenses/CreateView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, PayRollCollection, PayRollModel, MainView, ListView, FormView, TopBarView, CreateView, $, chai, chaiJquery, sinonChai, Custom, async) {
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
            "mname": "Quotations",
            "sequence": 55,
            "parrent": 54,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "Quotations"
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
            "mname": "Quotations",
            "sequence": 62,
            "parrent": 19,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "salesQuotations"
        }, {
            "_id": 63,
            "mname": "Order",
            "sequence": 63,
            "parrent": 19,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "salesOrders"
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
    var fakePayRoll = {
        total: [
            {
                201409: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 38370
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -38370
                    }
                }
            },
            {
                201410: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 38570
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -38570
                    }
                }
            },
            {
                201411: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 40325
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -40325
                    }
                }
            },
            {
                201412: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 41150
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -41150
                    }
                }
            },
            {
                201501: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 42898
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -42898
                    }
                }
            },
            {
                201502: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 46106
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -46297
                    }
                }
            },
            {
                201503: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 47570
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -47570
                    }
                }
            },
            {
                201504: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 54026
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -54026
                    }
                }
            },
            {
                201505: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 60558
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -60558
                    }
                }
            },
            {
                201506: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 63164
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -63164
                    }
                }
            },
            {
                201507: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 71531
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -71531
                    }
                }
            },
            {
                201508: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 81176
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -81176
                    }
                }
            },
            {
                201509: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 87267
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -87267
                    }
                }
            },
            {
                201510: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 93030
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -93030
                    }
                }
            },
            {
                201601: {
                    date: null,
                    status: false,
                    calc: {
                        onCash: 93030
                    },
                    paid: {
                        onCash: 0
                    },
                    diff: {
                        onCash: -93030
                    }
                }
            }
        ]
    };
    var fakePayRollForFrom = [
        {
            _id: "56600af06226e3c43108cc2b",
            year: 2014,
            month: 9,
            dataKey: 201409,
            calc: 1100,
            paid: 0,
            diff: -1100,
            __v: 0,
            status: false,
            date: "2016-03-31T21:00:00.000Z",
            type: {
                _id: "564592fbabb1c35728ad7d0f",
                __v: 0,
                sequence: 0,
                nestingLevel: 1,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:36:27.099Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                parent: "56459202624e48551dfe3b24",
                fullName: "All / Expenses / Salary Cash",
                name: "Salary Cash"
            },
            employee: {
                _id: "55b92ad221e4b7c40f00006e",
                dateBirth: "1989-12-03T23:00:00.000Z",
                ID: 8,
                isLead: 2,
                __v: 0,
                transfer: [
                    {
                        status: "hired",
                        department: "55b92ace21e4b7c40f00000f",
                        jobPosition: "55b92acf21e4b7c40f000027",
                        manager: "55b92ad221e4b7c40f000059",
                        jobType: "Full-time",
                        salary: 1200,
                        info: "",
                        isDeveloper: true,
                        date: "2011-10-14T21:00:00.000Z"
                    },
                    {
                        status: "updated",
                        department: "55b92ace21e4b7c40f00000f",
                        jobPosition: "55b92acf21e4b7c40f000027",
                        manager: "55b92ad221e4b7c40f000059",
                        jobType: "Full-time",
                        salary: 1400,
                        info: "",
                        isDeveloper: true,
                        date: "2016-01-31T22:00:00.000Z"
                    }
                ],
                lastFire: null,
                fire: [ ],
                hire: [
                    {
                        info: "",
                        salary: 0,
                        jobType: "",
                        manager: null,
                        jobPosition: null,
                        department: null
                    }
                ],
                social: {
                    GP: "",
                    LI: "null",
                    FB: "null"
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.471Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-03-30T06:55:23.597Z",
                    user: "55ba2ef1d79a3a343900001c"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.471Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.471Z",
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
                age: 26,
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
                manager: "55b92ad221e4b7c40f000059",
                jobPosition: "55b92acf21e4b7c40f000027",
                department: "55b92ace21e4b7c40f00000f",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "andrewhanchak",
                workPhones: {
                    phone: "",
                    mobile: "+380668062831"
                },
                personalEmail: "andriyhanchak@gmail.com",
                workEmail: "andriy.hanchak@thinkmobiles.com",
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
                    last: "Hanchak",
                    first: "Andriy"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                fullName: "Andriy Hanchak",
                id: "55b92ad221e4b7c40f00006e"
            },
            id: "56600af06226e3c43108cc2b"
        },
        {
            _id: "56600af06226e3c43108cc3b",
            year: 2014,
            month: 9,
            dataKey: 201409,
            calc: 700,
            paid: 0,
            diff: -700,
            __v: 0,
            status: false,
            date: "2016-03-31T21:00:00.000Z",
            type: {
                _id: "564592fbabb1c35728ad7d0f",
                __v: 0,
                sequence: 0,
                nestingLevel: 1,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:36:27.099Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                parent: "56459202624e48551dfe3b24",
                fullName: "All / Expenses / Salary Cash",
                name: "Salary Cash"
            },
            employee: {
                _id: "55b92ad221e4b7c40f00003b",
                dateBirth: "1987-06-23T00:00:00.000Z",
                ID: 56,
                isLead: 1,
                __v: 0,
                transfer: [
                    {
                        status: "hired",
                        department: "55b92ace21e4b7c40f000011",
                        jobPosition: "55b92acf21e4b7c40f000019",
                        manager: "55b92ad221e4b7c40f000063",
                        jobType: "Full-time",
                        salary: 900,
                        info: "",
                        isDeveloper: true,
                        date: "2013-12-29T22:00:00.000Z"
                    },
                    {
                        status: "updated",
                        department: "55b92ace21e4b7c40f000011",
                        jobPosition: "55b92acf21e4b7c40f000019",
                        manager: "55b92ad221e4b7c40f000063",
                        jobType: "Full-time",
                        salary: 1000,
                        info: "",
                        isDeveloper: true,
                        date: "2015-11-30T22:00:00.000Z"
                    },
                    {
                        status: "transfer",
                        department: "55b92ace21e4b7c40f000011",
                        jobPosition: "55b92acf21e4b7c40f000019",
                        manager: "55b92ad221e4b7c40f000063",
                        jobType: "Full-time",
                        salary: 1000,
                        info: "",
                        isDeveloper: true,
                        date: "2016-03-06T22:00:00.000Z"
                    },
                    {
                        status: "updated",
                        department: "566ee11b8453e8b464b70b73",
                        jobPosition: "566ee0c68453e8b464b70b72",
                        manager: "55b92ad221e4b7c40f000038",
                        jobType: "Full-time",
                        salary: 1000,
                        info: "",
                        isDeveloper: false,
                        date: "2016-03-06T22:00:00.000Z"
                    },
                    {
                        status: "transfer",
                        department: "566ee11b8453e8b464b70b73",
                        jobPosition: "566ee0c68453e8b464b70b72",
                        manager: "55b92ad221e4b7c40f000038",
                        jobType: "Full-time",
                        salary: 1000,
                        info: "",
                        isDeveloper: false,
                        date: "2016-03-13T22:00:00.000Z"
                    },
                    {
                        status: "updated",
                        department: "55b92ace21e4b7c40f000011",
                        jobPosition: "55b92acf21e4b7c40f000019",
                        manager: "55b92ad221e4b7c40f000063",
                        jobType: "Full-time",
                        salary: 1000,
                        info: "",
                        isDeveloper: true,
                        date: "2016-03-13T22:00:00.000Z"
                    }
                ],
                lastFire: null,
                fire: [ ],
                hire: [
                    {
                        info: "",
                        salary: 0,
                        jobType: "",
                        manager: null,
                        jobPosition: null,
                        department: null
                    }
                ],
                social: {
                    GP: "",
                    LI: "ua.linkedin.com/pub/vitalii-bizilia/7a/443/699",
                    FB: "https://www.facebook.com/vitaliy.bizilia"
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.418Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-03-30T13:50:27.201Z",
                    user: "55ba2ef1d79a3a343900001c"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.418Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.418Z",
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
                manager: "55b92ad221e4b7c40f000063",
                jobPosition: "55b92acf21e4b7c40f000019",
                department: "55b92ace21e4b7c40f000011",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "biziliavv",
                workPhones: {
                    phone: "",
                    mobile: "+380951205877"
                },
                personalEmail: "biziliavv@gmail.com",
                workEmail: "vitaliy.bisilia@thinkmobiles.com",
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
                    last: "Bizilya",
                    first: "Vitaliy"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                fullName: "Vitaliy Bizilya",
                id: "55b92ad221e4b7c40f00003b"
            },
            id: "56600af06226e3c43108cc3b"
        }
    ];
    var fakeEmplForDD = {
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
            },
            {
                _id: "55b92ad221e4b7c40f00003e",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Lapchuk",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000044",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Devezenko",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004f",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Sokhanych",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000057",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Roman",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000058",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Makhanets",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006c",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Sich",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Tutunnik",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000084",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Dahno",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009e",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Michenko",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a7",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Ryabcev",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ac",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Volkov",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ce",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Storojenko",
                    first: "Alex"
                }
            },
            {
                _id: "5638aa635d23a8eb04e80af0",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Siladii",
                    first: "Alex"
                }
            },
            {
                _id: "564dac3e9b85f8b16b574fea",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Filchak",
                    first: "Alex"
                }
            },
            {
                _id: "565f0fa6f6427f253cf6bf19",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Lysachenko",
                    first: "Alex"
                }
            },
            {
                _id: "566ede9e8453e8b464b70b71",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Tonkovid",
                    first: "Alex"
                }
            },
            {
                _id: "56b8b99e6c411b590588feb9",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Ovcharenko",
                    first: "Alex"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ba",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Klochkova",
                    first: "Alexandra"
                }
            },
            {
                _id: "55c330d529bd6ccd0b000007",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Yurenko",
                    first: "Alina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cb",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Yelahina",
                    first: "Alona"
                }
            },
            {
                _id: "565c66633410ae512364dc00",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Timochchenko",
                    first: "Alona"
                }
            },
            {
                _id: "560264bb8dc408c632000005",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Lyakh",
                    first: "Anastas"
                }
            },
            {
                _id: "55ded6b3ae2b22730b00004e",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Dimova",
                    first: "Anastasia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000059",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Dalekorey",
                    first: "Anatoliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b5",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Lemko",
                    first: "Andriana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000045",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Tivodar",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006e",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Hanchak",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000096",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Herasymyuk",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000098",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Krupka",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a3",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Karpenko",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a8",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    first: "Andriy",
                    last: "Korneychuk"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a9",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Loboda",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b3",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Sarkanych",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bf",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Fizer",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c2",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mistetskiy",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cd",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    first: "Andriy",
                    last: "Vovk"
                }
            },
            {
                _id: "561bb90a9ebb48212ea838c7",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Svyd",
                    first: "Andriy"
                }
            },
            {
                _id: "561bc5ca9ebb48212ea838c8",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Sokalskiy",
                    first: "Andriy"
                }
            },
            {
                _id: "564da59f9b85f8b16b574fe9",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Chuprov",
                    first: "Andriy"
                }
            },
            {
                _id: "566fe2348453e8b464b70ba6",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Lukashchuk",
                    first: "Andriy"
                }
            },
            {
                _id: "5693b24bd87c9004552b63a1",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Horak",
                    first: "Andriy"
                }
            },
            {
                _id: "56965733d87c9004552b63be",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Samokhin",
                    first: "Andriy"
                }
            },
            {
                _id: "569cce1dcf1f31f925c026fa",
                department: {
                    _id: "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name: {
                    last: "Stupchuk",
                    first: "Andriy"
                }
            },
            {
                _id: "56c19971dfd8a81466e2f6dc",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Khainus",
                    first: "Andriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b8",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Lobas",
                    first: "Anna"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006f",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Karabeinikov",
                    first: "Anton"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008c",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Gychka",
                    first: "Anton"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000094",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Yarosh",
                    first: "Anton"
                }
            },
            {
                _id: "55c0656ad011746b0b000006",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Nizhegorodov",
                    first: "Anton"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000083",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Zhuk",
                    first: "Antonina"
                }
            },
            {
                _id: "5629e27046bca6e4591f4919",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Petrov",
                    first: "Artem"
                }
            },
            {
                _id: "56b9ccd88f23c5696159cd09",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Antonenko",
                    first: "Artem"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000042",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Myhalko",
                    first: "Artur"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000032",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Sakalo",
                    first: "Bogdan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005a",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Cheypesh",
                    first: "Bogdan"
                }
            },
            {
                _id: "569e63df044ae38173244cfd",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Danyliuk",
                    first: "Bogdan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000070",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Pozhidaev",
                    first: "Daniil"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b1",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Korniyenko",
                    first: "Daniil"
                }
            },
            {
                _id: "55fbcb65f9210c860c000005",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Shamolina",
                    first: "Daria"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000046",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Udod",
                    first: "Denis"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b6",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Vengrin",
                    first: "Denis"
                }
            },
            {
                _id: "55ca0145cbb0f4910b000009",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Zinkovskyi",
                    first: "Denis"
                }
            },
            {
                _id: "55effafa8f1e10e50b000006",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    first: "Denis",
                    last: "Pavlenko"
                }
            },
            {
                _id: "5640741570bbc2b740ce89ec",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Lukashov",
                    first: "Denis"
                }
            },
            {
                _id: "565c2793f4dcd63b5dbd7372",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Yaremenko",
                    first: "Denis"
                }
            },
            {
                _id: "566add9aa74aaf316eaea6fc",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Saranyuk",
                    first: "Denis"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000033",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Bruso",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006b",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kanivets",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000071",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Masalovich",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009f",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Dzuba",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bc",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Demchenko",
                    first: "Dmitriy"
                }
            },
            {
                _id: "55cdffa59b42266a4f000015",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Magar",
                    first: "Dmitriy"
                }
            },
            {
                _id: "5600031ba36a8ca10c000028",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Mostiv",
                    first: "Dmitriy"
                }
            },
            {
                _id: "5614d4c7ab24a83b1dc1a7a8",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Babilia",
                    first: "Dmytro"
                }
            },
            {
                _id: "567ac0a48365c9a205406f33",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kolochynsky",
                    first: "Dmytro"
                }
            },
            {
                _id: "564a03d1ad4bc9e53f1f6195",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Tanchenec",
                    first: "Edgard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005b",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Chori",
                    first: "Eduard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000067",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Rudenko",
                    first: "Eduard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000092",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Dedenok",
                    first: "Eduard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000066",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Gromadskiy",
                    first: "Egor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000041",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Oleynikov",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000072",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Bernikevich",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008b",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Ugolkov",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a4",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Sokolenko",
                    first: "Eugen"
                }
            },
            {
                _id: "55c32e0d29bd6ccd0b000005",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Alexeev",
                    first: "Eugen"
                }
            },
            {
                _id: "55c98aa7cbb0f4910b000005",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Rechun",
                    first: "Eugen"
                }
            },
            {
                _id: "56029cc950de7f4138000005",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Lendyel",
                    first: "Eugen"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000090",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Shterr",
                    first: "Gabriella"
                }
            },
            {
                _id: "56b9d3eb8f23c5696159cd0b",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Mykhailova",
                    first: "Galina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    first: "German",
                    last: "Kravets"
                }
            },
            {
                _id: "568158fc9cceae182b907756",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Belous",
                    first: "Herman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a2",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Stan",
                    first: "Igor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bb",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Shepinka",
                    first: "Igor"
                }
            },
            {
                _id: "56966c82d87c9004552b63c7",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Kuzma",
                    first: "Ihor"
                }
            },
            {
                _id: "56a0d4b162d172544baf0e3a",
                department: {
                    _id: "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name: {
                    last: "Ilnytskyi",
                    first: "Ihor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c6",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Kramarenko",
                    first: "Illia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000035",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mondok",
                    first: "Ilya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000047",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Khymych",
                    first: "Ilya"
                }
            },
            {
                _id: "56090fae86e2435a33000008",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Nukhova",
                    first: "Inna"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000073",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Grab",
                    first: "Irina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000034",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Nazarovich",
                    first: "Ishtvan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005c",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Irchak",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000074",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Kornyk",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000087",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kostromin",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008e",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Grab",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009c",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Feltsan",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a0",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Bilak",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000aa",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Lyashenko",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c8",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Bizilya",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cc",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    first: "Ivan",
                    last: "Lyakh"
                }
            },
            {
                _id: "55c98b86cbb0f4910b000006",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Kovalenko",
                    first: "Ivan"
                }
            },
            {
                _id: "55dd71eaf09cc2ec0b000007",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Khartov",
                    first: "Ivan"
                }
            },
            {
                _id: "56a5ef86aa157ca50f21fb1d",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Pasichnyuk",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000048",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Chupova",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000068",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Bartish",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009a",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Pasichnyuk",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ab",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Olkhovik",
                    first: "Katerina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000085",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gorbushko",
                    first: "Kirill"
                }
            },
            {
                _id: "55e419094983acdd0b000012",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    first: "Kirill",
                    last: "Paliiuk"
                }
            },
            {
                _id: "56b9d49d8f23c5696159cd0c",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Bed",
                    first: "Kirill"
                }
            },
            {
                _id: "56b2287b99ce8d706a81b2bc",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Mudrenok",
                    first: "Kostiantyn"
                }
            },
            {
                _id: "55d1e234dda01e250c000015",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Rimar",
                    first: "Kristian"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009b",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Popp",
                    first: "Larysa"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000075",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Gvozdyo",
                    first: "Lilia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c7",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Mykhailova",
                    first: "Liliya"
                }
            },
            {
                _id: "55bf45cf65cda0810b00000a",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    first: "Liliya",
                    last: "Shustur"
                }
            },
            {
                _id: "564a0186ad4bc9e53f1f6193",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Orlenko",
                    first: "Liliya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005d",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Gerevich",
                    first: "Lubomir"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c1",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Zasukhina",
                    first: "Maria"
                }
            },
            {
                _id: "5684ec1a1fec73d05393a2a4",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Zaitseva",
                    first: "Maria"
                }
            },
            {
                _id: "560115cf536bd29228000006",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Myhalko",
                    first: "Marianna"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003f",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Kubichka",
                    first: "Marina"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000043",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Geraschenko",
                    first: "Maxim"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000089",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Sychov",
                    first: "Maxim"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a5",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Holubka",
                    first: "Maxim"
                }
            },
            {
                _id: "55c06411d011746b0b000005",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Rachytskyy",
                    first: "Maxim"
                }
            },
            {
                _id: "566ada96a74aaf316eaea69d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Gladovskyy",
                    first: "Maxim"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000036",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Yemets",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000049",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Kapustey",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000055",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Rogach",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005e",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Didenko",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000069",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Afendikov",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000076",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Glagola",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000077",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Soyma",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b2",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Yeremenko",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bd",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Vashkeba",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c4",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Myronyshyn",
                    first: "Michael"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c5",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gajdan",
                    first: "Michael"
                }
            },
            {
                _id: "55dd7776f09cc2ec0b000009",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Kavka",
                    first: "Michael"
                }
            },
            {
                _id: "5600042ca36a8ca10c000029",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Filchak",
                    first: "Michael"
                }
            },
            {
                _id: "5667f310a3fc012a68f0d5f5",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Sopko",
                    first: "Michael"
                }
            },
            {
                _id: "56b3412299ce8d706a81b2cd",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Kholtobin",
                    first: "Mykola"
                }
            },
            {
                _id: "565c306af4dcd63b5dbd7373",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Matrafayilo",
                    first: "Myroslav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b7",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Polovka",
                    first: "Myroslava"
                }
            },
            {
                _id: "56bdf283dfd8a81466e2f6d0",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Shishko",
                    first: "Nadiya"
                }
            },
            {
                _id: "56938d2cd87c9004552b639e",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Makarova",
                    first: "Nastya"
                }
            },
            {
                _id: "561ba8639ebb48212ea838c4",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Yartysh",
                    first: "Nataliya"
                }
            },
            {
                _id: "566aa49f4f817b7f51746ec0",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Burtnyk",
                    first: "Nataliya"
                }
            },
            {
                _id: "56af32e174d57e0d56d6bee5",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Sichko",
                    first: "Nataliya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a6",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Citrak",
                    first: "Norbert"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000be",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Borys",
                    first: "Oksana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c0",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Kordas",
                    first: "Oksana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003c",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Stasiv",
                    first: "Oleg"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004a",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000078",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Boyanivskiy",
                    first: "Oleg"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008a",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mahobey",
                    first: "Oleg"
                }
            },
            {
                _id: "561ba7039ebb48212ea838c3",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Maliavska",
                    first: "Oleksandra"
                }
            },
            {
                _id: "56b9cbb48f23c5696159cd08",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Kovalenko",
                    first: "Oleksii"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000037",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Shanghin",
                    first: "Oleksiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000079",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Gerasimov",
                    first: "Oleksiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000095",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Kuropyatnik",
                    first: "Oleksiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c9",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    first: "Oleksiy",
                    last: "Fedosov"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b9",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Melnyk",
                    first: "Olena"
                }
            },
            {
                _id: "55e96ab13f3ae4fd0b000009",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Pavliuk",
                    first: "Oles"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000c3",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    first: "Olesia",
                    last: "Prokoshkina"
                }
            },
            {
                _id: "56123232c90e2fb026ce064b",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Sikora",
                    first: "Olga"
                }
            },
            {
                _id: "55c84a4aaa36a0e60a000005",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Muratov",
                    first: "Pavlo"
                }
            },
            {
                _id: "56964a03d87c9004552b63ba",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Skyba",
                    first: "Pavlo"
                }
            },
            {
                _id: "56a7956faa157ca50f21fb25",
                department: {
                    _id: "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name: {
                    last: "Demko",
                    first: "Pavlo"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005f",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                }
            },
            {
                _id: "55e549309624477a0b000005",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Rospopa",
                    first: "Petro"
                }
            },
            {
                _id: "56a78c75aa157ca50f21fb24",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Iyber",
                    first: "Renata"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000051",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mozes",
                    first: "Richard"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007a",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Fogash",
                    first: "Robert"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004b",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Katona",
                    first: "Roland"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000038",
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name: {
                    last: "Babunich",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000060",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Buchuk",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007b",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Guti",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000086",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Kubichka",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b0",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Donchenko",
                    first: "Roman"
                }
            },
            {
                _id: "55dd73d1f09cc2ec0b000008",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Vizenko",
                    first: "Roman"
                }
            },
            {
                _id: "55eef3fd6dceaee10b000020",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Saldan",
                    first: "Roman"
                }
            },
            {
                _id: "5667f43da3fc012a68f0d5f6",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Katsala",
                    first: "Roman"
                }
            },
            {
                _id: "568bbdfd5827e3b24d8123a7",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Chaban",
                    first: "Roman"
                }
            },
            {
                _id: "568cd341b2bcba971ba6f5c4",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Rosul",
                    first: "Roman"
                }
            },
            {
                _id: "568cd4c0b2bcba971ba6f5c5",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Osadchuk",
                    first: "Roman"
                }
            },
            {
                _id: "569e3a73044ae38173244cfb",
                department: {
                    _id: "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name: {
                    last: "Martyniuk",
                    first: "Roman"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000056",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Labjak",
                    first: "Ruslan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000097",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Abylgazinov",
                    first: "Samgash"
                }
            },
            {
                _id: "568cdd375527d6691cb68b22",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Melnik",
                    first: "Sergey"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000064",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Tilishevsky",
                    first: "Sergiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007c",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Sheba",
                    first: "Sergiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a1",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Stepaniuk",
                    first: "Sergiy"
                }
            },
            {
                _id: "55d1a2b18f61e2c90b000023",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Degtyar",
                    first: "Sergiy"
                }
            },
            {
                _id: "55dd63f8f09cc2ec0b000006",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Ihnatko",
                    first: "Sergiy"
                }
            },
            {
                _id: "5649b8ccad4bc9e53f1f6192",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Gevelev",
                    first: "Sergiy"
                }
            },
            {
                _id: "5652dd95c4d12cf51e7f7e0b",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Petakh",
                    first: "Sergiy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004c",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    first: "Sofia",
                    last: "Nayda"
                }
            },
            {
                _id: "561b756f9ebb48212ea838c0",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Romanyuk",
                    first: "Stanislav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000039",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Rikun",
                    first: "Stas"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007d",
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
                _id: "55b92ad221e4b7c40f0000ad",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Krovspey",
                    first: "Stepan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008d",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Kira",
                    first: "Svitlana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ae",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Dolottseva",
                    first: "Tamara"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000061",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Mondok",
                    first: "Tamas"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000050",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Holovatska",
                    first: "Tamila"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007e",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Zmiy",
                    first: "Taras"
                }
            },
            {
                _id: "564a02e0ad4bc9e53f1f6194",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Dvorian",
                    first: "Taras"
                }
            },
            {
                _id: "56813fe29cceae182b907755",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Ukrainskiy",
                    first: "Taras"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000099",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Smertina",
                    first: "Tetyana"
                }
            },
            {
                _id: "55c98df0cbb0f4910b000007",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Berezhnoi",
                    first: "Timur"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00006a",
                department: {
                    _id: "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name: {
                    last: "Tsipf",
                    first: "Vadim"
                }
            },
            {
                _id: "56011186536bd29228000005",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Khruslov",
                    first: "Valentyn"
                }
            },
            {
                _id: "561bb5329ebb48212ea838c6",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Ladomiryak",
                    first: "Valerii"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000af",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Tokareva",
                    first: "Valeriya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00007f",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Klimchenko",
                    first: "Vasilisa"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003a",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Agosta",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000040",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Almashiy",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000053",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Seredniy",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000062",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Cheypesh",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000080",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Barchiy",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000093",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Lupchey",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000b4",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Prokopyshyn",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55d1d860dda01e250c000010",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Hoshovsky",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000088",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Buchok",
                    first: "Viktor"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000091",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Kiver",
                    first: "Viktor"
                }
            },
            {
                _id: "55f9298456f79c9c0c000006",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Manhur",
                    first: "Viktor"
                }
            },
            {
                _id: "5626278d750d38934bfa1313",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Rogachenko",
                    first: "Viktoria"
                }
            },
            {
                _id: "5637710e5d23a8eb04e80aed",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Kovalenko",
                    first: "Viktoria"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00003b",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Bizilya",
                    first: "Vitaliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004e",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Shuba",
                    first: "Vitaliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000081",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Sokhanych",
                    first: "Vitaliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000052",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Gerasimenko",
                    first: "Vladimir"
                }
            },
            {
                _id: "561bb1269ebb48212ea838c5",
                department: {
                    _id: "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name: {
                    last: "Pogorilyak",
                    first: "Vladimir"
                }
            },
            {
                _id: "55eeed546dceaee10b00001e",
                department: {
                    _id: "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name: {
                    last: "Turytskyi",
                    first: "Vladyslav"
                }
            },
            {
                _id: "568bbf935827e3b24d8123a8",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Hamalii",
                    first: "Vladyslav"
                }
            },
            {
                _id: "55eee9c26dceaee10b00001d",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Stepanchuk",
                    first: "Volodymyr"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004d",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Kopinets",
                    first: "Vyacheslav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000063",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    last: "Gusti",
                    first: "Yana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000ca",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Vengerova",
                    first: "Yana"
                }
            },
            {
                _id: "55f7c20a6d43203d0c000005",
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name: {
                    last: "Samaryk",
                    first: "Yana"
                }
            },
            {
                _id: "5602a01550de7f4138000008",
                department: {
                    _id: "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name: {
                    last: "Dufynets",
                    first: "Yana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000082",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Fuchko",
                    first: "Yaroslav"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000cf",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Denysiuk",
                    first: "Yaroslav"
                }
            },
            {
                _id: "568bc0b55827e3b24d8123a9",
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name: {
                    last: "Syrota",
                    first: "Yaroslav"
                }
            },
            {
                _id: "56014cc8536bd29228000007",
                department: {
                    _id: "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name: {
                    last: "Bezyk",
                    first: "Yevgenia"
                }
            },
            {
                _id: "55ed5a437221afe30b000006",
                department: {
                    _id: "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name: {
                    last: "Porokhnitska",
                    first: "Yulia"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000054",
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name: {
                    last: "Derevenko",
                    first: "Yuriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000065",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Sirko",
                    first: "Yuriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00008f",
                department: {
                    _id: "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name: {
                    last: "Holovatskyi",
                    first: "Yuriy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009d",
                department: {
                    _id: "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name: {
                    last: "Fedynec",
                    first: "Yuriy"
                }
            },
            {
                _id: "55f7c3736d43203d0c000006",
                department: {
                    _id: "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name: {
                    last: "Bodak",
                    first: "Yuriy"
                }
            },
            {
                _id: "56090d77066d979a33000009",
                department: {
                    _id: "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name: {
                    first: "Yuriy",
                    last: "Bysaha"
                }
            }
        ]
    };
    var fakecategoryGetExpenses = [
        {
            _id: "5645925f624e48551dfe3b26",
            __v: 0,
            sequence: 0,
            nestingLevel: null,
            editedBy: {
                user: "52203e707d4dba8813000003"
            },
            createdBy: {
                date: "2015-11-13T07:33:51.900Z",
                user: "52203e707d4dba8813000003"
            },
            users: [],
            parent: {
                _id: "56459202624e48551dfe3b24",
                __v: 0,
                sequence: 0,
                nestingLevel: null,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:32:18.495Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [],
                parent: "564591f9624e48551dfe3b23",
                fullName: "All / Expenses",
                name: "Expenses"
            },
            fullName: "All / Expenses / Bonus Card",
            name: "Bonus Card"
        },
        {
            _id: "5645920f624e48551dfe3b25",
            __v: 0,
            sequence: 6,
            nestingLevel: null,
            editedBy: {
                user: "52203e707d4dba8813000003"
            },
            createdBy: {
                date: "2015-11-13T07:32:31.085Z",
                user: "52203e707d4dba8813000003"
            },
            users: [],
            parent: {
                _id: "56459202624e48551dfe3b24",
                __v: 0,
                sequence: 0,
                nestingLevel: null,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:32:18.495Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [],
                parent: "564591f9624e48551dfe3b23",
                fullName: "All / Expenses",
                name: "Expenses"
            },
            fullName: "All / Expenses / Bonus Cash",
            name: "Bonus Cash"
        },
        {
            _id: "56459308abb1c35728ad7d10",
            __v: 0,
            sequence: 6,
            nestingLevel: 2,
            editedBy: {
                user: "52203e707d4dba8813000003"
            },
            createdBy: {
                date: "2015-11-13T07:36:40.347Z",
                user: "52203e707d4dba8813000003"
            },
            users: [],
            parent: {
                _id: "56459202624e48551dfe3b24",
                __v: 0,
                sequence: 0,
                nestingLevel: null,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:32:18.495Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [],
                parent: "564591f9624e48551dfe3b23",
                fullName: "All / Expenses",
                name: "Expenses"
            },
            fullName: "All / Expenses / Salary Card",
            name: "Salary Card"
        },
        {
            _id: "564592fbabb1c35728ad7d0f",
            __v: 0,
            sequence: 6,
            nestingLevel: null,
            editedBy: {
                user: "52203e707d4dba8813000003"
            },
            createdBy: {
                date: "2015-11-13T07:36:27.099Z",
                user: "52203e707d4dba8813000003"
            },
            users: [],
            parent: {
                _id: "56459202624e48551dfe3b24",
                __v: 0,
                sequence: 0,
                nestingLevel: null,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:32:18.495Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [],
                parent: "564591f9624e48551dfe3b23",
                fullName: "All / Expenses",
                name: "Expenses"
            },
            fullName: "All / Expenses / Salary Cash",
            name: "Salary Cash"
        }
    ];

    var payRollCollection;
    var view;
    var topBarView;
    var listView;

    describe('PayRoll View', function () {
        var $fixture;
        var $elFixture;

        after(function () {
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

                server.respondWith('GET', '/modules/', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'PayrollExpenses'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="66"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="66"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/PayrollExpenses');

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

            it('Try to fetch collection with 401 error', function(){
                var payRollUrl = new RegExp('\/payroll\/list', 'i');

                server.respondWith('GET', payRollUrl, [401, {"Content-Type": "application/json"}, JSON.stringify(fakePayRoll)]);

                payRollCollection = new PayRollCollection({
                    viewType: 'list',
                    page: 1
                });

                server.respond();

                //expect(window.location.hash).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var payRollUrl = new RegExp('\/payroll\/list', 'i');

                server.respondWith('GET', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePayRoll)]);

                payRollCollection = new PayRollCollection({
                    viewType: 'list',
                    page: 1
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: payRollCollection
                });

                expect(topBarView.$el.find('.createBtnHolder')).to.exist;
            });

        });

        describe('PayRoll list view', function () {
            var server;
            var windowConfirmStub;
            var clock;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                clock.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create bonusType list view', function (done) {
                    var $listHolder;
                    var payRollUrl = new RegExp('\/payroll\/list', 'i');
                    server.respondWith('GET', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePayRoll)]);
                    listView = new ListView({
                        collection: payRollCollection,
                        startTime: new Date()
                    });
                    server.respond();

                    clock.tick();

                    $listHolder = listView.$el;

                    expect($listHolder.find('table')).to.exist;

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

                    payRollCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to showMore collection with error', function(){
                    var spyResponse;
                    var payRollUrl = new RegExp('\/payroll\/list', 'i');

                    server.respondWith('GET', payRollUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakePayRoll)]);
                    payRollCollection.showMore();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some error during fetching data');
                });

                it('Try to showMore collection', function(){
                    var $listHolder;
                    var payRollUrl = new RegExp('\/payroll\/list', 'i');

                    server.respondWith('GET', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePayRoll)]);
                    payRollCollection.showMore();
                    server.respond();

                    $listHolder = listView.$el;
                    expect($listHolder.find('table')).to.exist;
                });

                it('Try to check|uncheck checkboxes', function(){
                    // all
                    var $checkAllBtn = listView.$el.find('#checkAll');

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type="checkbox"]').prop('checked')).to.be.true;

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type="checkbox"]').prop('checked')).to.be.false;
                });

                it('Try to edit item', function () {
                    var $selEl;
                    var $statusInput = listView.$el.find('td a.currentSelected')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var $datePicker = listView.$el.find('#payRoll-TableBody > tr#201409 > td.datePicker');
                    var payRollUrl = new RegExp('\/payroll\/byDataKey', 'i');

                    $datePicker.click();
                    $datePicker.find('input').val('01/04/2016');
                    $datePicker.trigger('change');

                    //$deleteBtn.click();

                    $statusInput.click();
                    $selEl = listView.$el.find('.newSelectList li')[1];
                    $selEl.click();
                    server.respondWith('PATCH', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        "success": {
                            "__v": 0,
                            "date": "2016-03-11T22:00:00.000Z",
                            "year": null,
                            "week": null,
                            "_id": "56e2cd4a3abb6ba70f73ad73"
                        }
                    })]);
                    $saveBtn.click();
                    server.respond();

                    expect($(listView.$el.find('td a')).attr('data-value')).to.be.equals('true');

                });

                it('Try to delete item', function () {
                    var $firstEl = listView.$el.find('#payRoll-TableBody > tr#201409 > td.notForm > input.totalRowCB');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var payRollUrl = new RegExp('\/payroll\/byDataKey', 'i');

                    windowConfirmStub.returns(true);

                    $firstEl.click();
                    server.respondWith('DELETE', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();
                });

                it('Try to open|close generate dialog', function(done){
                    var $cancelBtn;
                    var $generateBtn = topBarView.$el.find('#top-bar-generate');

                    $generateBtn.click();
                    expect($('.ui-dialog')).to.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();
                    //expect($('.ui-dialog')).to.not.exist;

                    clock.tick(200);
                    done();
                });

                it('Try open generate form with existing month', function () {
                    var $generateFormBtn;
                    var $monthInput;
                    var $yearInput;
                    var spyResponse;
                    var $generateBtn = topBarView.$el.find('#top-bar-generate');
                    var keyDowmE = $.Event("keydown", { keyCode: 64 });
                    var keyUpE = $.Event("keyup", { keyCode: 64 });

                    $generateBtn.click();

                    $generateFormBtn = $('#generateBtn');
                    $monthInput = $('#month');
                    $yearInput = $('#year');

                    $monthInput.click();
                    $monthInput.val('26');
                    $monthInput.trigger('focusout');
                    $monthInput.click();
                    $monthInput.val('0');
                    $monthInput.trigger('focusout');

                    $yearInput.trigger(keyDowmE);
                    $yearInput.click();
                    $yearInput.val('201633');
                    $yearInput.trigger(keyUpE);
                    $yearInput.trigger('focusout');

                    server.respondWith('POST', '/payroll/generate/', [200, {"Content-Type": "application/json"}, 'Ok']);
                    $generateFormBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[1][0];

                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please, choose empty month!');
                });

                it('Try to generate payroll expense with error', function(){
                    var $monthInput = $('#month');
                    var $generateFormBtn = $('#generateBtn');
                    var spyResponse;

                    $monthInput.click();
                    $monthInput.val('5');
                    $monthInput.trigger('focusout');

                    server.respondWith('POST', '/payroll/generate/', [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $generateFormBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[2][0];

                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'error');
                });

                it('Try to set non existing month', function(){
                    var $monthInput = $('#month');
                    var $generateFormBtn = $('#generateBtn');
                    var keyDowmE = $.Event("keydown", { keyCode: 36 });

                    $monthInput.trigger(keyDowmE);
                    $monthInput.click();
                    $monthInput.val('5');
                    $monthInput.trigger('focusout');

                    server.respondWith('POST', '/payroll/generate/', [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $generateFormBtn.click();
                    server.respond();

                    //expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to go to form', function(){
                    var $trBtn = listView.$el.find('tr#201411');

                    $trBtn.click();

                    expect(window.location.hash).to.be.equals('#easyErp/PayrollExpenses/form/201411');
                });

            });
        });

        /!*describe('Form View', function () {
            var server;
            var payRollModel;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                clock.restore();
            });

            it('Try to create payroll form', function (done) {

                server.respondWith('GET', '/payroll/201409', [200, {"Content-Type": "application/json"}, JSON.stringify(fakePayRollForFrom)]);
                payRollModel = new PayRollModel();

                payRollModel.urlRoot = payRollModel.url() + '201409';
                payRollModel.fetch({
                    success: function (model) {
                        server.respondWith('GET', '/employees/getForDD', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplForDD)]);
                        server.respondWith('GET', '/category/getExpenses', [200, {"Content-Type": "application/json"}, JSON.stringify(fakecategoryGetExpenses)]);

                        formView = new FormView({
                            model: model
                        });

                        server.respond();
                        server.respond();

                        formView.render();

                        done();
                    },
                    error: function (model, response) {
                        done(response);
                    }

                });
                server.respond();

                clock.tick(200);

                expect($('#payRoll-listTable')).to.exist;
            });

        });*!/
    });

});
*/
