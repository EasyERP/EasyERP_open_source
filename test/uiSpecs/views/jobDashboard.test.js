define([
    'text!fixtures/index.html',
    'collections/Jobs/filterCollection',
    'views/main/MainView',
    'views/jobsDashboard/list/ListView',
    'views/jobsDashboard/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, JobsCollection, MainView, ListView, TopBarView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var fakeJobsDashboard = [
        {
            _id: "564cfd8ba6e6390160c9ef5e",
            budget: {
                budgetTotal: {
                    minDate: 201519,
                    maxDate: 201542,
                    hoursByQA: 55,
                    revenueByQA: 629.4223174914258,
                    hoursSum: 4082,
                    revenueSum: 56969.259999999995,
                    costSum: 20637.829999999994,
                    profitSum: 36331.42999999999
                },
                budget: [
                    {
                        revenue: 4912.599999999999,
                        hours: 352,
                        cost: 2009.21,
                        profit: 2903.3900000000003
                    },
                    {
                        revenue: 8708.660000000002,
                        hours: 624,
                        cost: 4501.1,
                        profit: 4207.56
                    },
                    {
                        revenue: 502.42,
                        hours: 36,
                        cost: 257.36,
                        profit: 245.06
                    },
                    {
                        revenue: 8150.429999999999,
                        hours: 584,
                        cost: 4157.01,
                        profit: 3993.42
                    },
                    {
                        revenue: 8485.4,
                        hours: 608,
                        cost: 3528.2199999999993,
                        profit: 4957.18
                    },
                    {
                        revenue: 5917.45,
                        hours: 424,
                        cost: 4102.71,
                        profit: 1814.7399999999998
                    },
                    {
                        revenue: 711.7600000000001,
                        hours: 51,
                        cost: 300.94000000000005,
                        profit: 410.81999999999994,
                        byQA: {
                            hours: 51,
                            revenue: 60123.089661930426
                        }
                    },
                    {
                        revenue: 1004.85,
                        hours: 72,
                        cost: 418.72,
                        profit: 586.13
                    },
                    {
                        revenue: 55.82,
                        hours: 4,
                        cost: 21.62,
                        profit: 34.2,
                        byQA: {
                            hours: 4,
                            revenue: 2819.1420872121507
                        }
                    },
                    {
                        revenue: 3126.2,
                        hours: 224,
                        cost: 1053.05,
                        profit: 2073.15
                    },
                    {
                        revenue: 1060.6599999999999,
                        hours: 76,
                        cost: 287.89,
                        profit: 772.7700000000001
                    },
                    {
                        revenue: 4982.360000000001,
                        hours: 357,
                        cost: 0,
                        profit: 4982.360000000001
                    },
                    {
                        revenue: 3907.75,
                        hours: 280,
                        cost: 0,
                        profit: 3907.75
                    },
                    {
                        revenue: 1367.69,
                        hours: 98,
                        cost: 0,
                        profit: 1367.69
                    },
                    {
                        revenue: 3461.15,
                        hours: 248,
                        cost: 0,
                        profit: 3461.15
                    },
                    {
                        revenue: 614.0600000000001,
                        hours: 44,
                        cost: 0,
                        profit: 614.0600000000001
                    }
                ],
                projectTeam: [
                    {
                        name: {
                            first: "Roman",
                            last: "Babunich"
                        },
                        department: {
                            departmentName: "Ruby on Rails",
                            _id: "566ee11b8453e8b464b70b73"
                        },
                        jobPosition: {
                            name: "Head of ROR",
                            _id: "56c1914adfd8a81466e2f6db"
                        },
                        _id: "55b92ad221e4b7c40f000038"
                    },
                    {
                        name: {
                            first: "Denis",
                            last: "Udod"
                        },
                        department: {
                            departmentName: "Unity",
                            _id: "56e175c4d62294582e10ca68"
                        },
                        jobPosition: {
                            name: "Middle Unity 3D",
                            _id: "55c32e2a29bd6ccd0b000006"
                        },
                        _id: "55b92ad221e4b7c40f000046"
                    },
                    {
                        name: {
                            first: "Michael",
                            last: "Kapustey"
                        },
                        department: {
                            departmentName: "Web",
                            _id: "55b92ace21e4b7c40f000016"
                        },
                        jobPosition: {
                            name: "Middle JS",
                            _id: "55b92acf21e4b7c40f00001c"
                        },
                        _id: "55b92ad221e4b7c40f000049"
                    },
                    {
                        name: {
                            first: "Egor",
                            last: "Gromadskiy"
                        },
                        department: {
                            departmentName: ".NET/WP",
                            _id: "55b92ace21e4b7c40f000012"
                        },
                        jobPosition: {
                            name: "Middle .NET/WP",
                            _id: "56433d7c70bbc2b740ce8a15"
                        },
                        _id: "55b92ad221e4b7c40f000066"
                    },
                    {
                        name: {
                            first: "Daniil",
                            last: "Pozhidaev"
                        },
                        department: {
                            departmentName: "Android",
                            _id: "55b92ace21e4b7c40f000010"
                        },
                        jobPosition: {
                            name: "Middle Android",
                            _id: "55b92acf21e4b7c40f000022"
                        },
                        _id: "55b92ad221e4b7c40f000070"
                    },
                    {
                        name: {
                            first: "Eugen",
                            last: "Bernikevich"
                        },
                        department: {
                            departmentName: "Unity",
                            _id: "56e175c4d62294582e10ca68"
                        },
                        jobPosition: {
                            name: "Middle Unity 3D",
                            _id: "55c32e2a29bd6ccd0b000006"
                        },
                        _id: "55b92ad221e4b7c40f000072"
                    },
                    {
                        name: {
                            first: "Oleg",
                            last: "Boyanivskiy"
                        },
                        department: {
                            departmentName: "QA",
                            _id: "55b92ace21e4b7c40f000011"
                        },
                        jobPosition: {
                            name: "Junior QA",
                            _id: "55b92acf21e4b7c40f000018"
                        },
                        _id: "55b92ad221e4b7c40f000078"
                    },
                    {
                        name: {
                            first: "Stas",
                            last: "Volskiy"
                        },
                        department: {
                            departmentName: "iOS",
                            _id: "55b92ace21e4b7c40f00000f"
                        },
                        jobPosition: {
                            name: "Middle iOS",
                            _id: "55b92acf21e4b7c40f00001d"
                        },
                        _id: "55b92ad221e4b7c40f00007d"
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
                            first: "Viktor",
                            last: "Kiver"
                        },
                        department: {
                            departmentName: "iOS",
                            _id: "55b92ace21e4b7c40f00000f"
                        },
                        jobPosition: {
                            name: "Junior iOS",
                            _id: "55b92acf21e4b7c40f00002c"
                        },
                        _id: "55b92ad221e4b7c40f000091"
                    },
                    {
                        name: {
                            first: "Vasiliy",
                            last: "Prokopyshyn"
                        },
                        department: {
                            departmentName: "Android",
                            _id: "55b92ace21e4b7c40f000010"
                        },
                        jobPosition: {
                            name: "Junior Android",
                            _id: "55b92acf21e4b7c40f000021"
                        },
                        _id: "55b92ad221e4b7c40f0000b4"
                    },
                    {
                        name: {
                            first: "Michael",
                            last: "Gajdan"
                        },
                        department: {
                            departmentName: "iOS",
                            _id: "55b92ace21e4b7c40f00000f"
                        },
                        jobPosition: {
                            name: "Junior iOS",
                            _id: "55b92acf21e4b7c40f00002c"
                        },
                        _id: "55b92ad221e4b7c40f0000c5"
                    },
                    {
                        name: {
                            first: "Anton",
                            last: "Nizhegorodov"
                        },
                        department: {
                            departmentName: "CSS/FrontEnd",
                            _id: "56802e9d1afe27f547b7ba51"
                        },
                        jobPosition: {
                            name: "CSS",
                            _id: "55ddd8a2f09cc2ec0b000030"
                        },
                        _id: "55c0656ad011746b0b000006"
                    },
                    {
                        name: {
                            first: "Eugen",
                            last: "Alexeev"
                        },
                        department: {
                            departmentName: "Unity",
                            _id: "56e175c4d62294582e10ca68"
                        },
                        jobPosition: {
                            name: "Middle Unity 3D",
                            _id: "55c32e2a29bd6ccd0b000006"
                        },
                        _id: "55c32e0d29bd6ccd0b000005"
                    },
                    {
                        name: {
                            first: "Sergiy",
                            last: "Ihnatko"
                        },
                        department: {
                            departmentName: "PHP/WordPress",
                            _id: "56802ec21afe27f547b7ba53"
                        },
                        jobPosition: {
                            name: "Middle PHP",
                            _id: "55dd6259f09cc2ec0b000005"
                        },
                        _id: "55dd63f8f09cc2ec0b000006"
                    }
                ]
            },
            project: {
                _id: "55b92ad621e4b7c40f000693",
                EndDate: "2015-10-15T21:00:00.000Z",
                StartDate: "2014-11-02T22:00:00.000Z",
                ID: 63,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5662e2a5f13e46fd14535445",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000602",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5662e2a5f13e46fd14535444",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2015-12-05T13:12:05.630Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [],
                notes: [],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.323Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: "528ce82df3f67bc40b000025",
                parent: null,
                sequence: 0,
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: "55b92ad221e4b7c40f00004a",
                customer: "55b92ad621e4b7c40f000624",
                task: [],
                projectName: "WP Player",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 124658.52
                        },
                        {
                            percentage: "Sales/Head 8%",
                            resource: "Oleg Ostroverkh",
                            bonus: 498634.08
                        }
                    ],
                    projectTeam: [
                        "564cfd8ba6e6390160c9ef5e",
                        "564cfd8ba6e6390160c9ee40"
                    ]
                },
                TargetEndDate: "",
                description: ""
            },
            wTracks: [
                "55edaa3a7221afe30b00002f",
                "55eda8d57221afe30b00002e",
                "55eda8ce7221afe30b00002d",
                "55dec001ae2b22730b00002c",
                "55debfdeae2b22730b00002b",
                "55ddb5fbf09cc2ec0b000027",
                "55ddb26af09cc2ec0b00001c",
                "55cf665d4a91e37b0b00013d",
                "55cf65b14a91e37b0b00013b",
                "55cf65a94a91e37b0b00013a",
                "55cf659e4a91e37b0b000139",
                "55cf63d14a91e37b0b000137",
                "55cf63c74a91e37b0b000136",
                "55cf63544a91e37b0b000135",
                "55ddb252f09cc2ec0b00001a",
                "55cf34aa4a91e37b0b0000bc",
                "55cf34694a91e37b0b0000b7",
                "55cf34634a91e37b0b0000b6",
                "55ddb287f09cc2ec0b00001d",
                "55b92adf21e4b7c40f001141",
                "55b92adf21e4b7c40f00112e",
                "55eda81a7221afe30b000024",
                "55b92adf21e4b7c40f00112b",
                "55b92adf21e4b7c40f00112a",
                "55b92adf21e4b7c40f001124",
                "55b92adf21e4b7c40f001123",
                "55b92adf21e4b7c40f001120",
                "55dec027ae2b22730b00002d",
                "55cf668c4a91e37b0b00013f",
                "55b92adf21e4b7c40f001119",
                "55b92adf21e4b7c40f001118",
                "55b92adf21e4b7c40f001113",
                "55b92adc21e4b7c40f000ccd",
                "55edaa657221afe30b000032",
                "55b92ade21e4b7c40f000f90",
                "55b92ade21e4b7c40f000f8f",
                "55b92ade21e4b7c40f000ee4",
                "55b92adc21e4b7c40f000cfe",
                "55b92adf21e4b7c40f001010",
                "55b92ade21e4b7c40f000eca",
                "55b92ade21e4b7c40f000e8c",
                "55b92ade21e4b7c40f000f11",
                "55b92ade21e4b7c40f000eac",
                "55b92adf21e4b7c40f001127",
                "55b92ade21e4b7c40f000f44",
                "55b92ade21e4b7c40f000fe3",
                "55debfc6ae2b22730b000028",
                "55b92ade21e4b7c40f000f2d",
                "55b92ade21e4b7c40f000fa6",
                "55b92ade21e4b7c40f000e9c",
                "55b92adc21e4b7c40f000d21",
                "55b92adc21e4b7c40f000d02",
                "55ddb36ef09cc2ec0b000023",
                "55b92adc21e4b7c40f000d08",
                "55b92ade21e4b7c40f000f91",
                "55b92ade21e4b7c40f000fa7",
                "55b92ade21e4b7c40f000fad",
                "55b92add21e4b7c40f000e38",
                "55b92ade21e4b7c40f000f64",
                "55b92adf21e4b7c40f001011",
                "55cf63da4a91e37b0b000138",
                "55b92add21e4b7c40f000db0",
                "55b92ade21e4b7c40f000f45",
                "55b92ade21e4b7c40f000fec",
                "55ed98c17221afe30b000007",
                "55b92add21e4b7c40f000e59",
                "55b92ade21e4b7c40f000ff0",
                "55b92adc21e4b7c40f000cb5",
                "55b92ade21e4b7c40f000fdf",
                "55b92add21e4b7c40f000e6c",
                "55e420984983acdd0b00001b",
                "55b92add21e4b7c40f000db8",
                "55b92ade21e4b7c40f000fb3",
                "55b92ade21e4b7c40f000f95",
                "55b92add21e4b7c40f000dce",
                "55b92ade21e4b7c40f000eb3",
                "55b92ade21e4b7c40f000fc8",
                "55b92add21e4b7c40f000e69",
                "55edaa597221afe30b000031",
                "55debfd8ae2b22730b00002a",
                "55b92ade21e4b7c40f000f92",
                "55b92ade21e4b7c40f000fab",
                "55b92ade21e4b7c40f000f9a",
                "55b92add21e4b7c40f000e52",
                "55b92adf21e4b7c40f001006",
                "55b92add21e4b7c40f000e56",
                "55cf65e14a91e37b0b00013c",
                "55b92adf21e4b7c40f00100a",
                "55b92add21e4b7c40f000e5f",
                "55cf34714a91e37b0b0000b8",
                "55b92add21e4b7c40f000db4",
                "55b92ade21e4b7c40f000fb0",
                "55b92ade21e4b7c40f000fb1",
                "55b92ade21e4b7c40f000fb2",
                "55b92ade21e4b7c40f000fbb",
                "55b92ade21e4b7c40f000fbe",
                "55ed99da7221afe30b000010",
                "55b92adf21e4b7c40f00101b",
                "55b92ade21e4b7c40f000fc2",
                "55b92ade21e4b7c40f000fcb",
                "55b92adf21e4b7c40f001000",
                "55b92adf21e4b7c40f00101f",
                "55b92ade21e4b7c40f000ecb",
                "55b92ade21e4b7c40f000fc4",
                "55b92adf21e4b7c40f00110e",
                "55b92ade21e4b7c40f000fcc",
                "55b92adf21e4b7c40f001001",
                "55b92ade21e4b7c40f000fdd",
                "55b92ade21e4b7c40f000fde",
                "55b92adf21e4b7c40f000ffe",
                "55b92ade21e4b7c40f000fe0",
                "55b92add21e4b7c40f000e63",
                "55b92ade21e4b7c40f000fe6",
                "55b92ade21e4b7c40f000ff3",
                "55b92ade21e4b7c40f000ff4",
                "55b92ade21e4b7c40f000ff6",
                "55cf349c4a91e37b0b0000bb",
                "55b92ade21e4b7c40f000ff7",
                "55b92add21e4b7c40f000e71",
                "55b92ade21e4b7c40f000ff8",
                "55b92ade21e4b7c40f000ef8",
                "55b92ade21e4b7c40f000ff9",
                "55df1300ae2b22730b000064",
                "55b92adf21e4b7c40f0010ea",
                "55b92add21e4b7c40f000e70",
                "55b92ade21e4b7c40f000ffb",
                "55b92adf21e4b7c40f001106",
                "55b92ade21e4b7c40f000ffc",
                "55b92adf21e4b7c40f001007",
                "55b92adc21e4b7c40f000d19",
                "55b92adf21e4b7c40f00100e",
                "55b92adf21e4b7c40f00100f",
                "55b92adc21e4b7c40f000d12",
                "55b92adf21e4b7c40f001013",
                "55b92adf21e4b7c40f001014",
                "55cf344b4a91e37b0b0000b5",
                "55b92adf21e4b7c40f001018",
                "55b92adf21e4b7c40f001035",
                "55cf666c4a91e37b0b00013e",
                "55b92ade21e4b7c40f000fe7",
                "55b92adf21e4b7c40f0010fe",
                "55b92ade21e4b7c40f000ee1",
                "55b92ade21e4b7c40f000ffa",
                "55b92adf21e4b7c40f0010e9"
            ],
            type: "Invoiced",
            workflow: {
                _id: "56337c675d49d8d6537832ea",
                wId: "Jobs",
                name: "Finished",
                status: "Done",
                source: "jobs",
                visible: true
            },
            name: "WP Player1024/1058/1127/1128/2015",
            quotation: {
                _id: "564cfd8ba6e6390160c9f037",
                editedBy: {
                    date: "2015-11-18T22:36:59.989Z",
                    user: null
                },
                createdBy: {
                    date: "2015-11-18T22:36:59.989Z",
                    user: null
                },
                creationDate: "2015-11-18T22:36:59.989Z",
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                workflow: "55647b962e4aa3804a765ec6",
                products: [
                    {
                        unitPrice: 56969,
                        subTotal: 56969,
                        taxes: 0,
                        scheduledDate: "2015-09-03T22:00:00.000Z",
                        jobs: "564cfd8ba6e6390160c9ef5e",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        quantity: 4082
                    }
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 56969,
                    total: 56969
                },
                paymentTerm: null,
                invoiceRecived: true,
                invoiceControl: null,
                incoterm: null,
                destination: null,
                name: "PO165",
                orderDate: "2015-09-03T22:00:00.000Z",
                deliverTo: null,
                project: "55b92ad621e4b7c40f000693",
                supplier: "55b92ad621e4b7c40f000624",
                isOrder: true,
                forSales: true,
                __v: 0,
                type: "Invoiced",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                }
            },
            invoice: {
                _id: "560317e4650aa84d4e000011",
                dueDate: "2015-09-04T22:00:00.000Z",
                editedBy: {
                    date: "2015-09-23T21:21:40.387Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-09-23T21:21:40.386Z",
                    user: "55cb7302fea413b50b000007"
                },
                creationDate: "2015-09-23T21:21:40.386Z",
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: "55647d982e4aa3804a765ecb",
                products: [
                    {
                        subTotal: 5696900,
                        unitPrice: 5696900,
                        taxes: 0,
                        jobs: "564cfd8ba6e6390160c9ef5e",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        quantity: 1
                    }
                ],
                payments: [
                    "560317f3a5ac49794e000014"
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 5696900,
                    balance: 0,
                    total: 5696900
                },
                paymentTerms: "55536e52475b7be475f335f6",
                salesPerson: "55b92ad221e4b7c40f00004a",
                invoiceDate: "2015-09-03T22:00:00.000Z",
                project: "55b92ad621e4b7c40f000693",
                paymentReference: "",
                sourceDocument: "564cfd8ba6e6390160c9f037",
                supplier: "55b92ad621e4b7c40f000624",
                forSales: true,
                invoiceType: "wTrack",
                name: "1024/1058/1127/1128/2015",
                __v: 1,
                paymentDate: "2015-09-23T21:21:55.573Z",
                _type: "wTrackInvoice",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                }
            },
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
            },
            order: 1,
            payment: {
                paid: 5696900,
                count: 1
            }
        }, {
            _id: "564cfd8ba6e6390160c9ef7d",
            budget: {
                budgetTotal: {
                    minDate: 201523,
                    maxDate: 201540,
                    hoursByQA: 12,
                    revenueByQA: 0.9263969171483624,
                    hoursSum: 1557,
                    revenueSum: 12020.040000000003,
                    costSum: 8194.15,
                    profitSum: 3825.87
                },
                budget: [
                    {
                        revenue: 617.6,
                        hours: 80,
                        cost: 600.5,
                        profit: 17.1
                    },
                    {
                        revenue: 2717.44,
                        hours: 352,
                        cost: 4653.12,
                        profit: -1935.68
                    },
                    {
                        revenue: 3088.0000000000005,
                        hours: 400,
                        cost: 1395.3499999999997,
                        profit: 1692.63
                    },
                    {
                        revenue: 92.64,
                        hours: 12,
                        cost: 64.88,
                        profit: 27.76,
                        byQA: {
                            hours: 12,
                            revenue: 92.63969171483623
                        }
                    },
                    {
                        revenue: 1173.44,
                        hours: 152,
                        cost: 825.11,
                        profit: 348.33
                    },
                    {
                        revenue: 2292.84,
                        hours: 297,
                        cost: 211.64,
                        profit: 2081.2
                    },
                    {
                        revenue: 617.6,
                        hours: 80,
                        cost: 348.5,
                        profit: 269.1
                    },
                    {
                        revenue: 617.6,
                        hours: 80,
                        cost: 0,
                        profit: 617.6
                    },
                    {
                        revenue: 802.8800000000001,
                        hours: 104,
                        cost: 95.05,
                        profit: 707.83
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
                    }
                ]
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
            wTracks: [
                "55d19fce8f61e2c90b000022",
                "55d19f488f61e2c90b00001b",
                "55d19f6b8f61e2c90b00001d",
                "55d19dd78f61e2c90b00000f",
                "55b92adf21e4b7c40f0010e3",
                "55d19e748f61e2c90b000014",
                "55d19f628f61e2c90b00001c",
                "55d19dc18f61e2c90b00000d",
                "55e073d5368becd00b00002d",
                "55d19dab8f61e2c90b00000c",
                "55d19e648f61e2c90b000013",
                "55b92adf21e4b7c40f0010c4",
                "566af913a74aaf316eaea7d8",
                "55b92adf21e4b7c40f0010c5",
                "55b92adf21e4b7c40f001140",
                "55d19d988f61e2c90b00000a",
                "55e07373368becd00b00002a",
                "55f56433b81672730c000031",
                "55d19d9f8f61e2c90b00000b",
                "55b92adf21e4b7c40f0010fb",
                "55d19f3c8f61e2c90b00001a",
                "55b92adf21e4b7c40f0010f7",
                "55d19e588f61e2c90b000012",
                "55b92adf21e4b7c40f001175",
                "566af913a74aaf316eaea7d5",
                "55f56413b81672730c00002f",
                "566af913a74aaf316eaea7d9",
                "566af9dca74aaf316eaea7e5",
                "55f5641bb81672730c000030",
                "55e073c2368becd00b00002c",
                "566af913a74aaf316eaea7d6",
                "55debc56ae2b22730b00001e",
                "55df13acae2b22730b000067",
                "566af913a74aaf316eaea7d7",
                "55b92adf21e4b7c40f0010ff",
                "566af99ba74aaf316eaea7dd",
                "566af99ba74aaf316eaea7de",
                "55d19dce8f61e2c90b00000e",
                "566af99ba74aaf316eaea7df",
                "55e073e1368becd00b00002e",
                "55ded0b2ae2b22730b000039",
                "566af99ba74aaf316eaea7e0",
                "566af99ba74aaf316eaea7e1",
                "566af9dca74aaf316eaea7e6",
                "55ded0c7ae2b22730b00003a",
                "55e0738e368becd00b00002b",
                "55debe87ae2b22730b000022"
            ],
            type: "Invoiced",
            workflow: {
                _id: "56337c675d49d8d6537832ea",
                wId: "Jobs",
                name: "Finished",
                status: "Done",
                source: "jobs",
                visible: true
            },
            name: "M-Government1-09/10/2015",
            quotation: {
                _id: "564cfd8ca6e6390160c9f095",
                editedBy: {
                    date: "2015-11-18T22:37:00.349Z",
                    user: null
                },
                createdBy: {
                    date: "2015-11-18T22:37:00.349Z",
                    user: null
                },
                creationDate: "2015-11-18T22:37:00.349Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                workflow: "55647b962e4aa3804a765ec6",
                products: [
                    {
                        unitPrice: 12020,
                        subTotal: 12020,
                        taxes: 0,
                        scheduledDate: "2015-10-08T22:00:00.000Z",
                        jobs: "564cfd8ba6e6390160c9ef7d",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        quantity: 1557
                    }
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 12020,
                    total: 12020
                },
                paymentTerm: null,
                invoiceRecived: true,
                invoiceControl: null,
                incoterm: null,
                destination: null,
                name: "PO259",
                orderDate: "2015-10-08T22:00:00.000Z",
                deliverTo: null,
                project: "55b92ad621e4b7c40f0006d4",
                supplier: "55b92ad621e4b7c40f00063c",
                isOrder: true,
                forSales: true,
                __v: 0,
                type: "Invoiced",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                }
            },
            invoice: {
                _id: "5617a4439ebb48212ea83890",
                dueDate: "2015-10-23T22:00:00.000Z",
                editedBy: {
                    date: "2015-10-09T11:25:55.814Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                createdBy: {
                    date: "2015-10-09T11:25:55.814Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                creationDate: "2015-10-09T11:25:55.814Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: "55647d982e4aa3804a765ecb",
                products: [
                    {
                        subTotal: 1202000,
                        unitPrice: 1202000,
                        taxes: 0,
                        jobs: "564cfd8ba6e6390160c9ef7d",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        quantity: 1
                    }
                ],
                payments: [
                    "5617a4589ebb48212ea83891"
                ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 1202000,
                    balance: 0,
                    total: 1202000
                },
                paymentTerms: "55536e52475b7be475f335f6",
                salesPerson: "55b92ad221e4b7c40f00005f",
                invoiceDate: "2015-10-08T22:00:00.000Z",
                project: "55b92ad621e4b7c40f0006d4",
                paymentReference: "",
                sourceDocument: "564cfd8ca6e6390160c9f095",
                supplier: "55b92ad621e4b7c40f00063c",
                forSales: true,
                invoiceType: "wTrack",
                name: "1-09/10/2015",
                __v: 1,
                paymentDate: "2015-10-09T11:26:16.320Z",
                _type: "wTrackInvoice",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                }
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
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDs6Qmk3UwtSJsONNzRmgDNAxwp1IBilpITHDrS0g6ZoJqiRc0haqF/qsFlEWb527KDXMXmuXV45XzRHGf4Iwc/nUuRSi2dRc6ta2+QXMjf3Yxn9elc/qfiacqVt0EPPJ3BmI/pWFdTIw2qkskh/wBo4/z+dVhaSsfmKoT2x0/Kp33KtYLnUXlkLld5POXbNVvtE8rbUwPpVhrJgpbzEZQATtzUQDIxKt09O1PQNSVI2Q/Ow3fXpUyhOvmYqpn1Y+5FP81VXAl/MYpNDTLYU5yMNznjmrNrqE9rJuhJRjx8p6/geD+NZRuV6ZBPZlOKntrkXA2SDOOjjqPTNKwXTO20vVzex5V0eRR86MNjA/yrTinWQ7RlXHVG4P8An6V57loZ1Mcmx15WRP8AP6V1mlXy6lB5dxhLqHqUP6ihNiaNrNC81DEznKS43r3HRh61KprRGTJkFTKKhSplFMpDqKKKCigTTCeaRmqLzKi5ViYGpFqupy1WE6UXBqw+k70hNAIGSe1UjJjycVgavrRj3JA2MH7/AGp2u6qtnGE3fvG/hHYe/vXJ3BecbpWZYs5JPVj7VDd9C4x6slaQ3LtI7tJzyznaPy5JppvktkxGqljwNq5z+J61VVrm7YR2seEHHsKv22mJC2ZGEsxHO4/070bFryKkUlzKS8SNk/xv0/CknF4MhnCn/fGP0q5c3MUfyvchz/ciAAH1NZM0xLFhGMZ4+fJoQMUyyF/3hAkHRwOT/jVaXGS6jGeoFOM+8YKg89DxUieVIMkheeVboPxqidyvHmQ4UEADk9qXMajBYu3oOlPuzsIjI2KBkAHIPv71BGC7BUHJ70xAQCwwAvsTWlbkwwDyi5IGWI45qBljtBk4Z/TGas2lzezsdjeVDHyzA7QPxqWNaDIZJZLlC5JOfpn2rRtbub7QGgzGw43AZ/zxUErWzXKvFKW9wQMH14H/ANeq7XZSUeUSqHkjPNS9StjtVnubVI5bhxLH1DqvIXHcfl+VasMqyBSCCCMhh0IrD0rVbdrcLJlzGoXbjLEmrGiSFI0iZWTLsUDEHj0oi7Gckb6VKKij9KmFaghaKKKCjBlmwKhWXmopSaamc81z3NUjQibJq0p4qjBniri9K0iZzJM1Q1jUFsLQvkbz90GrpbAJJwAK43U5pNVv8R/cyEjB7+5+v/16cmRFXZRDG4lkvbjJVW4yeWb0H86SSJ5XD3KnGBsiHHHbPoK1Gghl1CODI+zWsfmPz/COefdiRWVdXck8kju5Iboo4FRuag0hUFJLgRIv8EYwAP51Vmu4UTZC7Ed8DrUDxZ6AD2FOSxLLk5qkkLUrtIrHBOPwoVDyVNW/sDbenPpipksCFBA59afMhcrKBIPDDNJhSpGfx9a2F05QAWFP+wx4+73qedFezZz7bioRiTjpntV1Qlnb+YSDKfuj+7/9epb5Y4XCovznpVf7NJcNubhRwoNVe6JtZleNTcXADNhepJ7CrWoTARCCIFUBzj/P1FRRQsswUcHNRXGTMSOxNPdi2QkJZY5CDj5f6ipmkIGewPzAVArfKR2Jq1DEZXUdVPBz6UMSNqyu1hjRvNjhyfl35If8a6LSb1LidUnWOOZlzGyOCjgdR7EelcFdpiUR85VVAqexvZLdgM9CHAzjBB/qOKm3Ub10PVo3UjjqOtSq1YVrdqUtrqI5id/LkBPKnnH+fcVsn61adyNibNFRg0Ux3MJocmgRYq6Y/amlOKxaNkyKMYFTrk00KKkWmiZFXUZBFZkt90n5vp1/pXO21zHFFcajIF2x/JGPU45/Xj8K6LVozJp0uBkgZArm1tPktYCu6JGEj46MACR+pNKW4orQpymWC3cTHM85Eswz04yq/gDn8R6VTWNpGxySfatPyHvLqQ+u98+o3YH6YqzbWG0lsc1PMaRiZ0VmwIzjParcdrk89BV/7OuMYz9aesYAIxUuTNEkVEtwO1OMKjGBVjABpCo61NyiuYxTWXbnPSrG2obsH7O4HGRzQMxIohdXMkzDK5wo9quJCMMxAGf0qzb25hjVSOi5NSxoMF2wAKpyIUTKMAjmaQjAQZBx37YrIuEySRwOwrpJY98ecYGe/wDn3rHu4P3mPWrhIznEzlQ7AffFTo7KmMnBJB+lCqWCKBzkkCp1iJlZEViG5Uj/AD9a0bMrFeRpHuBI/OeB+AH9MVCpIkBrQltzsiTq6ZZh7Hv/AI1RdMbh/cY/zppg0dZ4buH8tVfLQyFWP+yUOc/oPzrtoz8gHpxXn/huTEEkf8TfKnsdwKn8812miTPPp6+aR5sbNG/1U4/lilHdomRfFFLiirEVCKaRT2ph6VmzRDcYpVFKBTlFIbIb9C2nzgddhrPtoxLHcAL0BQfTpWvPGXtZUXqUIH5VS06HZagnq2STSkrsSdkZ1tZlIULDD7dre+D/APWFW1jCJ2qbGGxTX46VlY1TK0nBqLAyccU+TPeom46UjRDW5Y9xS8dxUZDZ4pCx96BjziobnCxMTzxjH1Ip6sWJ5z9KV4TKm3oDSGRA7gxHFPChozkcDr708wEKBjgU8AldmOM80AVvJJjUEfN1IrK1BApbA5I610og+XnqetZWq2vBI9KqOjJeqMGxi+fzSPlRt34f5zVuOForaIkE85JBxipLdFg09lbG+Vg30Qf41pX0KLBajO394pb/AHenP51blqZJaGBcqYtUJjJUcMCff/69QTIHupCBhXYjHYZ5H61oTW8k987IOIzt5PpwP5Gkns90k6Rqdy7SPrj/APVVKRLRLols4kR+V46/jx/n2rsdCfzGvTtwDcMw98//AKqx7aEIqKoK5VT+OSf8K3dFg8qGV/77k/5/WlB3kTNKxo0U1ulFbmRXNNNOI5pKhmqEFPUc02pIxk0IGTInymqkahV24wFz/Or6Vn3JwrAdSab0JM+4kUTnaetO3AjmqdxHuHEmGqhIb2H7jB8VznQo6Guyg55qFo+tVLW9mZ9sybfSr7NuFIrUh2YXmmGPnOOKlL44pjSoo+YigaIlAU9qkEgHWq0l3EDwc/Sozdo3A5P1pWKLpnXPWnwkM2RWYGJbkfSr1sQCOxpAaAHykVXurZpYjjA46mrEeefSpMbgBVWM72ORETPfqJjnBJI7HHb86s3TtPFPz86bM+nBH+NX7+z2XgdRxyxOP89ahghUTTM3Q7M/gOabYrEUkaKxiAJZmxjHvkH8xT0aO3WWTCkorEL6gcClLnc8hHSEv/wI8AfmaqQAvcRb13GSJgVHuSf8KQjchO9Sx4AbjP4Vt2Q22kfGMjOPrWVp1u0scfmZ3ffb61tKoVQo6DitaS6mM30A0UGitjMhNNNONNNQzVAKli9aiFSpwKEJk+cDNZF7KUhlbnO0EflWoTlSKz7sJtO8A4GORwKJ7BHc5JvtBmQTnylkOWmYbto7YHYe9Z2pvcWty4gvcoqggM/LckduOorqLmWKVdsgVscDsaxbqzt5MlYBn1rKMl1N3FsraXqU8rBZBuwcZFdPH81uHIww45rnbSyEcocR5AO7rgA1uTSNHbgN95uamVr6FJPqKMSNVa5SNDh/m/Gn28nykntVG5uFM3zn5T+lJF7A8lorYYZPoBmnJe6epOdg+tU2ULPkoHi7bT/P9ai1kpcNE0Vu5QRkELxhs9fTpWiimZSk1sjege1uP9Uyn2FXooRxnn+tcTp0NxFtZFbf3DEbT+H5V0+lX0m8xzKR7HqP8frUtJDTbRsbNi8dKEJByfpQ0gJGKcinOTx6CkSJdhRbOz9hWHApe3foAFKk/X/JrT1aQiDZ/e4qisREccS8FyC3sP8AJpNjWxA7KMHHy8sfoAf/AK1VbF5GvYRbp5rbcdeBjitaSyLBlXoRj8MdKm0+3hs5miQAsD8zf0oRVupbtpprdx9paMlsD5FIx+tamcisfUnVI255xxWnbsTBGT3UGtoPoc9SNkpEwGaKBRWpkQGm0402oNQFSjpUY61IKaEx2aoXmDEeetXqzruQPwO1TPYIfEYs0G45OKi8jae9XZMAkGo1ZcgE5rA7Lj7eFT1HQ81V1OffPtXjtV1nRbcuv0FYzvunyaEgXc0rdF+z8dTWddW3zkHkGrcJfHHSkmSR+euKLjM1FaP3XsatxSptwwU49RTTEe4wPpUflHPQ1V7isX0mhUcADv0p/MrA4Ax3FUYiQecitG2HvUMZZhLA43Nke9aEIyuTyarQxA4zVuMcU4oxmylewGZwPapoLUh9zcACrioCckfpUdw+yI9qrl6k819ChqV+lggcLvbOFX+Zplo8Mrq8ZOWOSDWVrJY3hBORgY/LP9ak0Us1wijpmpbOhQtE0rn/AEq/Fso53cn0FbigKABwBwKzdLhDTT3ePvsQp9q0hW1NdTkrSu1FdB+aKZRWlzIjNNp5pvepNAUc1KBTUHNSAcU0SxpOAT6VlXIwSRzxWpIP3bfQ1keYftbRNyrbvw71FQumZd3Ljk8EUmmRG5uAXYhcHHuaSW3a4myxwoPQd6uwwmNAAOKxudDegupxAMkUXCquAP61kPBIJcBTmtub99GOfmXufSq4IibJ+Y+gpsIvQz5/OjQKgYfhTIhc4ySdo5Oa1Gum2n5V49arXU73EXl4VE77eppFkUc4fhh7c1IYw44qBVVRipYZQp2tQBItsCelWra3Ib2pYgGOavwKB2oSuTKVhUTbU8Y45pjcAVIh4q0YNjxxWbqlwkUbPLny1xwOrHsK0icKSTWRcSR3DeW65QnuKJvQdNamJ5d3q1xJIiquf4c9AOK0rC0aEeQjAzycMR/Avep1gKs1tZKVzje/f6Vq2VklpHgcu33mqYxcmbzqKMSWONYo1jQYVRgU8UHrTa6DhHZooopANNNFKaQdaCyVBUmOKYgqXFUSxhHBz3rFkjK3+TW4RVC/hwyyj6GoqK6HB2Zhy5ilkUjvkUW+t2pk+zTkxy44LdG/Gpr9f3obH3uaytS0xbq3LAfvE547isFa+p07o0ZrhFyC2O1V1kYtkkMvqDUsV5ZTWuy6CRyqgzv4x16H8qludHtmb5HdMkZAbinYFJLcpyHceuR7UnlFz3xVh9FgTZ++cgtg8jpg/wD1qh+zWsf2wmd1W15bBGQNoP8AWixXPEPs2QeTTPIwcA1lajfzhoY7OdnLLklTkc1eshPHEDO5eQ9aGrK4c12alkxEmxunUVdjlCzypnhP8M1Ws0/ibt3qK1cySXE3aQ8fToP5VKE1c0926MEVPGOlV4gRGoq4grSOpjLQS5IWEg9W4qiIFimijZi5lY7eOmO5qa5bzLtY16IOfr/nFSQqHvmb/nnGFHtnn/Cm9WCbiizFCkSnaOT1PrTqWkNaoybENAFFKoosTcUCinhaKYiuaFFJTlqTUmQcVKBTIxUoqkSNIpksYljZD3qQ02mBg3URKEEcoeajhAXGenetS9j+fd2Yc/Wsuc7G9q5ZqzNoyurGfrNnlhKq5wMcVmB54ypW4kXac4LHGa35Z1x1qm7oxwQDTTNk9LMybq8uptgM7HYcjbxz+FNhsbiUNuZ8S8uWON319a1diAZUAZ9BTwwUYzzRzDsirb2UVvgIuW7t3qyibpOnFAOenWrEEfzZzwKhu4bEsmFtyq8FhinW8e1QAMD0prcsOuKtRLjGaESyaMcirG9Y0aRvuqMmoVqG8k3lYEPH3mq07Iytdha5djI3Vjk1oW64DMQQWY1Vs1yRjp296v8AargiKj1ENNNO70m2tbGLYgp6imhalUCmCHKKKUUUFlGpIxzUdTR9KhFMmSpKYtOzVkgaYxpSajagTY2QB0IP4Vj3keTgjkHFbFU7+F2XzIwSR1X1rOauhwlZmBPCxOB0qE25K96uyOO/44oVxg81gddzKYSKxGeKkiVmOM54qxMAWyKdBwcDFBVySCHjtVoqFGKajBRxQzgnNSSPRec1YU8VV8zHWmSXWFwpx7+lFxWuXJLlY/lX5n/QVWiPmuecqTlj/eP+FUwTJwchT29frV+3IA56UXuO1kaVtwyj1q7trBm1KOzKyyn5V5IFS23iS2uACIpFBG7nHA/Oumm9Dlno9TawKQio7e4iuoVmhcOjdCKkrQkTFGaQmkJoEPBoqMtRQFyEVKlFFQjRkwOKXNFFWQxKaaKKBDTTDRRSEVL6zSdTIFw46kd6xpIWTI60UVjURvSbsV2XtyKVBgdTRRWZuShsdTSPOq9KKKkaIjKXNAznmiikUSKcGpvtCxpuY9P0oooQmcrq2oteTeXFkqD271dsVLoAg2ZX5jnOfYUUV1pWRxzk+Y6/R8QBoAMKQGX+taReiiqIuNzzRRRQIcq0UUUwP//Z",
                isEmployee: true,
                __v: 0
            },
            order: 1,
            payment: {
                paid: 1202000,
                count: 1
            }
        }
    ];

    var jobsCollection;
    var view;
    var topBarView;
    var listView;

    describe('JobsDashboard View', function () {
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

                view = new MainView({el: $elFixture, contentType: 'jobsDashboard'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="80"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="80"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/jobsDashboard');

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

                topBarView = new TopBarView({
                    actionType: 'Content'
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Jobs Dashboard');
            });

        });

        describe('ProjectsDashboardList view', function () {
            var server;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                listView.remove();

                server.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create ListView', function () {
                    var $listHolder;
                    var jobsDashboardUrl = new RegExp('\/jobs\/', 'i');

                    server.respondWith('GET', jobsDashboardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJobsDashboard)]);
                    jobsCollection = new JobsCollection({});
                    server.respond();

                    listView = new ListView({
                        startTime: new Date(),
                        collection: jobsCollection

                    });

                    $listHolder = listView.$el;

                    expect($listHolder.find('table')).to.exist;
                });

                /*it('Try to go sort', function () {
                 var $sortEl = contentView.$el.find('th[data-sort="projectName"]');
                 var projectsDashboardUrl = new RegExp('project\/getProjectPMForDashboard', 'i');

                 server.respondWith('GET', projectsDashboardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDashboardProjects)]);
                 $sortEl.click();
                 server.respond();
                 expect(contentView.$el.find('#ProjectPMContent > tr:nth-child(1) > td:nth-child(3) > a').attr('href')).to.be.equals('#easyErp/Projects/form/56e93c3b07ea2d845ef75dff');

                 server.respondWith('GET', projectsDashboardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                 data: [
                 fakeDashboardProjects.data[1],
                 fakeDashboardProjects.data[0]
                 ]
                 })]);
                 $sortEl.click();
                 server.respond();
                 expect(contentView.$el.find('#ProjectPMContent > tr:nth-child(1) > td:nth-child(3) > a').attr('href')).to.be.equals('#easyErp/Projects/form/56dff1b4a12a4f3c26919c91');

                 });

                 it('Try to click on sales manager', function(){
                 var needItem = contentView.$el.find('#ProjectPMContent > tr:nth-child(1) > td:nth-child(2) > a')[0];

                 needItem.click();

                 expect(window.location.hash).to.be.equals('#easyErp/Employees/form/55b92ad221e4b7c40f00004f');
                 });

                 it('Try to click on project name', function(){
                 var needItem = contentView.$el.find('#ProjectPMContent > tr:nth-child(1) > td:nth-child(3) > a')[0];

                 needItem.click();

                 expect(window.location.hash).to.be.equals('#easyErp/Projects/form/56dff1b4a12a4f3c26919c91');
                 });*/

            });

        });

    });

});
