/*
define([
    'text!fixtures/index.html',
    'collections/Birthdays/filterCollection',
    'views/main/MainView',
    'views/Birthdays/list/ListView',
    'views/Birthdays/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, BirthdaysCollection, MainView, ListView, TopBarView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var fakeBirthdays = {
        data: {
            weekly: [
                {
                    daysForBirth: -1,
                    name: {
                        first: "Roman",
                        last: "Katsala"
                    },
                    workPhones: {
                        mobile: "+380956641698"
                    },
                    department: {
                        departmentName: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Junior JS",
                        _id: "55b92acf21e4b7c40f000017"
                    },
                    age: 31,
                    dateBirth: "2016-03-21T00:00:00.000Z",
                    _id: "5667f43da3fc012a68f0d5f6"
                }
            ],
            nextweek: [
                {
                    daysForBirth: 7,
                    name: {
                        first: "Yana",
                        last: "Vengerova"
                    },
                    workPhones: {
                        mobile: "+380990978669"
                    },
                    department: {
                        departmentName: "Design",
                        _id: "55bb1f14cb76ca630b000006"
                    },
                    jobPosition: {
                        name: "Head of 2D",
                        _id: "56b1b2b0d6ef38a708dfc2a2"
                    },
                    age: 24,
                    dateBirth: "2016-03-29T02:00:00.000Z",
                    _id: "55b92ad221e4b7c40f0000ca"
                },
                {
                    daysForBirth: 7,
                    name: {
                        last: "Vovk",
                        first: "Andriy"
                    },
                    workPhones: {
                        mobile: "+380504195752"
                    },
                    department: {
                        departmentName: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Junior JS",
                        _id: "55b92acf21e4b7c40f000017"
                    },
                    age: 32,
                    dateBirth: "2016-03-29T05:00:00.000Z",
                    _id: "55b92ad221e4b7c40f0000cd"
                },
                {
                    daysForBirth: 7,
                    name: {
                        first: "Taras",
                        last: "Dvorian"
                    },
                    workPhones: {
                        mobile: "+380688434933"
                    },
                    department: {
                        departmentName: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Junior JS",
                        _id: "55b92acf21e4b7c40f000017"
                    },
                    age: 25,
                    dateBirth: "2016-03-29T00:00:00.000Z",
                    _id: "564a02e0ad4bc9e53f1f6194"
                },
                {
                    daysForBirth: 7,
                    name: {
                        first: "Alex",
                        last: "Lysachenko"
                    },
                    workPhones: {
                        mobile: "+380990173689"
                    },
                    department: {
                        departmentName: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Junior JS",
                        _id: "55b92acf21e4b7c40f000017"
                    },
                    age: 23,
                    dateBirth: "2016-03-29T00:00:00.000Z",
                    _id: "565f0fa6f6427f253cf6bf19"
                },
                {
                    daysForBirth: 9,
                    name: {
                        first: "Kristian",
                        last: "Rimar"
                    },
                    workPhones: {
                        mobile: "+380956637515"
                    },
                    department: {
                        departmentName: "PM",
                        _id: "55bb1f40cb76ca630b000007"
                    },
                    jobPosition: {
                        name: "Junior PM",
                        _id: "561b73fb9ebb48212ea838bf"
                    },
                    age: 21,
                    dateBirth: "2016-03-31T00:00:00.000Z",
                    _id: "55d1e234dda01e250c000015"
                },
                {
                    daysForBirth: 9,
                    name: {
                        first: "Nataliya",
                        last: "Sichko"
                    },
                    workPhones: {
                        mobile: "+380664711550"
                    },
                    department: {
                        departmentName: "Design",
                        _id: "55bb1f14cb76ca630b000006"
                    },
                    jobPosition: {
                        name: "Junior Designer",
                        _id: "55b92acf21e4b7c40f000028"
                    },
                    age: 33,
                    dateBirth: "2016-03-30T23:00:00.000Z",
                    _id: "56af32e174d57e0d56d6bee5"
                }
            ],
            monthly: [
                {
                    daysForBirth: -21,
                    name: {
                        first: "Andriy",
                        last: "Mistetskiy"
                    },
                    workPhones: {
                        mobile: "+380678505692"
                    },
                    department: {
                        departmentName: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    jobPosition: {
                        name: "Junior iOS",
                        _id: "55b92acf21e4b7c40f00002c"
                    },
                    age: 24,
                    dateBirth: "2016-03-01T02:00:00.000Z",
                    _id: "55b92ad221e4b7c40f0000c2"
                },
                {
                    daysForBirth: -18,
                    name: {
                        first: "Valentyn",
                        last: "Khruslov"
                    },
                    workPhones: {
                        mobile: "+380638272505"
                    },
                    department: {
                        departmentName: "Design",
                        _id: "55bb1f14cb76ca630b000006"
                    },
                    jobPosition: {
                        name: "2D Artist",
                        _id: "55eeeddd6dceaee10b00001f"
                    },
                    age: 22,
                    dateBirth: "2016-03-04T00:00:00.000Z",
                    _id: "56011186536bd29228000005"
                },
                {
                    daysForBirth: -18,
                    name: {
                        first: "Taras",
                        last: "Ukrainskiy"
                    },
                    workPhones: {
                        mobile: "+380507620261"
                    },
                    department: {
                        departmentName: ".NET/WP",
                        _id: "55b92ace21e4b7c40f000012"
                    },
                    jobPosition: {
                        name: "Junior .Net",
                        _id: "5681592f9cceae182b907757"
                    },
                    age: 33,
                    dateBirth: "2016-03-04T00:00:00.000Z",
                    _id: "56813fe29cceae182b907755"
                },
                {
                    daysForBirth: -18,
                    name: {
                        first: "Michael",
                        last: "Glagola"
                    },
                    workPhones: {
                        mobile: "+380933654933"
                    },
                    department: {
                        departmentName: "iOS",
                        _id: "55b92ace21e4b7c40f00000f"
                    },
                    jobPosition: {
                        name: "Middle iOS",
                        _id: "55b92acf21e4b7c40f00001d"
                    },
                    age: 28,
                    dateBirth: "2016-03-04T02:00:00.000Z",
                    _id: "55b92ad221e4b7c40f000076"
                },
                {
                    daysForBirth: -18,
                    name: {
                        first: "Yevgenia",
                        last: "Melnyk"
                    },
                    workPhones: {
                        mobile: "+380504430237"
                    },
                    department: {
                        departmentName: "BusinessDev",
                        _id: "55b92ace21e4b7c40f000014"
                    },
                    jobPosition: {
                        name: "Sales",
                        _id: "55b92acf21e4b7c40f00001f"
                    },
                    age: 33,
                    dateBirth: "2016-03-04T00:00:00.000Z",
                    _id: "56e2e83a74ac46664a83e94b"
                },
                {
                    daysForBirth: -17,
                    name: {
                        first: "Taras",
                        last: "Zmiy"
                    },
                    workPhones: {
                        mobile: "+380683070469"
                    },
                    department: {
                        departmentName: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    jobPosition: {
                        name: "Middle Android",
                        _id: "55b92acf21e4b7c40f000022"
                    },
                    age: 25,
                    dateBirth: "2016-03-05T01:00:00.000Z",
                    _id: "55b92ad221e4b7c40f00007e"
                },
                {
                    daysForBirth: -16,
                    name: {
                        first: "Eugen",
                        last: "Lendyel"
                    },
                    workPhones: {
                        mobile: "+380950870448"
                    },
                    department: {
                        departmentName: "BusinessDev",
                        _id: "55b92ace21e4b7c40f000014"
                    },
                    jobPosition: {
                        name: "Account Manager",
                        _id: "55b92acf21e4b7c40f00002e"
                    },
                    age: 22,
                    dateBirth: "2016-03-06T00:00:00.000Z",
                    _id: "56029cc950de7f4138000005"
                },
                {
                    daysForBirth: -15,
                    name: {
                        first: "Roman",
                        last: "Buchuk"
                    },
                    workPhones: {
                        mobile: "+380667778480"
                    },
                    department: {
                        departmentName: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Head of JS",
                        _id: "56121847c90e2fb026ce0621"
                    },
                    age: 33,
                    dateBirth: "2016-03-06T22:00:00.000Z",
                    _id: "55b92ad221e4b7c40f000060"
                },
                {
                    daysForBirth: -11,
                    name: {
                        first: "Denis",
                        last: "Zinkovskyi"
                    },
                    workPhones: {
                        mobile: "+380938542587"
                    },
                    department: {
                        departmentName: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    jobPosition: {
                        name: "Junior Android",
                        _id: "55b92acf21e4b7c40f000021"
                    },
                    age: 22,
                    dateBirth: "2016-03-11T00:00:00.000Z",
                    _id: "55ca0145cbb0f4910b000009"
                },
                {
                    daysForBirth: -7,
                    name: {
                        first: "Alex",
                        last: "Michenko"
                    },
                    workPhones: {
                        mobile: "+380502634074"
                    },
                    department: {
                        departmentName: "Android",
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    jobPosition: {
                        name: "Junior Android",
                        _id: "55b92acf21e4b7c40f000021"
                    },
                    age: 21,
                    dateBirth: "2016-03-15T02:00:00.000Z",
                    _id: "55b92ad221e4b7c40f00009e"
                },
                {
                    daysForBirth: -4,
                    name: {
                        first: "Yevgenia",
                        last: "Bezyk"
                    },
                    workPhones: {
                        mobile: "+380952609700"
                    },
                    department: {
                        departmentName: "Finance",
                        _id: "560c0b83a5d4a2e20ba5068c"
                    },
                    jobPosition: {
                        name: "Chief Financial Officer",
                        _id: "56011b2d93b361cd28000005"
                    },
                    age: 30,
                    dateBirth: "2016-03-18T00:00:00.000Z",
                    _id: "56014cc8536bd29228000007"
                },
                {
                    daysForBirth: -3,
                    name: {
                        first: "Nataliya",
                        last: "Burtnyk"
                    },
                    workPhones: {
                        mobile: "+380967667817"
                    },
                    department: {
                        departmentName: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Junior JS",
                        _id: "55b92acf21e4b7c40f000017"
                    },
                    age: 26,
                    dateBirth: "2016-03-19T00:00:00.000Z",
                    _id: "566aa49f4f817b7f51746ec0"
                },
                {
                    daysForBirth: -1,
                    name: {
                        first: "Roman",
                        last: "Katsala"
                    },
                    workPhones: {
                        mobile: "+380956641698"
                    },
                    department: {
                        departmentName: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Junior JS",
                        _id: "55b92acf21e4b7c40f000017"
                    },
                    age: 31,
                    dateBirth: "2016-03-21T00:00:00.000Z",
                    _id: "5667f43da3fc012a68f0d5f6"
                },
                {
                    daysForBirth: 7,
                    name: {
                        first: "Alex",
                        last: "Lysachenko"
                    },
                    workPhones: {
                        mobile: "+380990173689"
                    },
                    department: {
                        departmentName: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Junior JS",
                        _id: "55b92acf21e4b7c40f000017"
                    },
                    age: 23,
                    dateBirth: "2016-03-29T00:00:00.000Z",
                    _id: "565f0fa6f6427f253cf6bf19"
                },
                {
                    daysForBirth: 7,
                    name: {
                        first: "Yana",
                        last: "Vengerova"
                    },
                    workPhones: {
                        mobile: "+380990978669"
                    },
                    department: {
                        departmentName: "Design",
                        _id: "55bb1f14cb76ca630b000006"
                    },
                    jobPosition: {
                        name: "Head of 2D",
                        _id: "56b1b2b0d6ef38a708dfc2a2"
                    },
                    age: 24,
                    dateBirth: "2016-03-29T02:00:00.000Z",
                    _id: "55b92ad221e4b7c40f0000ca"
                },
                {
                    daysForBirth: 7,
                    name: {
                        last: "Vovk",
                        first: "Andriy"
                    },
                    workPhones: {
                        mobile: "+380504195752"
                    },
                    department: {
                        departmentName: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Junior JS",
                        _id: "55b92acf21e4b7c40f000017"
                    },
                    age: 32,
                    dateBirth: "2016-03-29T05:00:00.000Z",
                    _id: "55b92ad221e4b7c40f0000cd"
                },
                {
                    daysForBirth: 7,
                    name: {
                        first: "Taras",
                        last: "Dvorian"
                    },
                    workPhones: {
                        mobile: "+380688434933"
                    },
                    department: {
                        departmentName: "Web",
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Junior JS",
                        _id: "55b92acf21e4b7c40f000017"
                    },
                    age: 25,
                    dateBirth: "2016-03-29T00:00:00.000Z",
                    _id: "564a02e0ad4bc9e53f1f6194"
                },
                {
                    daysForBirth: 9,
                    name: {
                        first: "Kristian",
                        last: "Rimar"
                    },
                    workPhones: {
                        mobile: "+380956637515"
                    },
                    department: {
                        departmentName: "PM",
                        _id: "55bb1f40cb76ca630b000007"
                    },
                    jobPosition: {
                        name: "Junior PM",
                        _id: "561b73fb9ebb48212ea838bf"
                    },
                    age: 21,
                    dateBirth: "2016-03-31T00:00:00.000Z",
                    _id: "55d1e234dda01e250c000015"
                },
                {
                    daysForBirth: 9,
                    name: {
                        first: "Nataliya",
                        last: "Sichko"
                    },
                    workPhones: {
                        mobile: "+380664711550"
                    },
                    department: {
                        departmentName: "Design",
                        _id: "55bb1f14cb76ca630b000006"
                    },
                    jobPosition: {
                        name: "Junior Designer",
                        _id: "55b92acf21e4b7c40f000028"
                    },
                    age: 33,
                    dateBirth: "2016-03-30T23:00:00.000Z",
                    _id: "56af32e174d57e0d56d6bee5"
                }
            ]
        }
    };

    var birthdaysCollection;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;

    describe('BirthDaysView', function () {
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

                view = new MainView({el: $elFixture, contentType: 'Birthdays'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="52"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="52"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Birthdays');

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
                var birthdaysUrl = new RegExp('\/birthdays\/', 'i');

                server.respondWith('GET', birthdaysUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeBirthdays)]);

                birthdaysCollection = new BirthdaysCollection({
                    count: 100,
                    viewType: 'list',
                    contentType: 'Birthdays'
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: birthdaysCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.equals('Birthdays');
            });

        });

        describe('BirthdayList view', function () {
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

                it('Try to create Birthday listView', function () {
                    var $listHolder;
                    var birthdaysUrl = new RegExp('\/birthdays\/', 'i');

                    server.respondWith('GET', birthdaysUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeBirthdays)]);

                    listView = new ListView({
                        collection: birthdaysCollection,
                        startTime: new Date()
                    });

                    server.respond();

                    $listHolder = listView.$el;

                    expect($listHolder).to.exist;
                });

                it('Try to go to the form', function(){
                    var $readMoreBtn = listView.$el.find('#weekList > div > div.birthday-item > div.info > div.top-wrapper > a')[0];

                    $readMoreBtn.click();

                    expect(window.location.hash).to.be.equals('#easyErp/Employees/form/5667f43da3fc012a68f0d5f6');
                });

            });

        });

    });

});
*/
