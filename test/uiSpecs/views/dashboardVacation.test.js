/*
define([
    'text!fixtures/index.html',
    'collections/Dashboard/vacationDashboard',
    'views/main/MainView',
    'views/vacationDashboard/index',
    'views/vacationDashboard/TopBarView',
    'views/vacationDashboard/statisticsView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, DashBoardVacationCollection, MainView, IndexView, TopBarView, StatisticsView, $, chai, chaiJquery, sinonChai, Custom) {
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
    var fakeDashBoardVacations = [
        {
            employees: [
                {
                    isLead: 0,
                    fired: [
                        {
                            date: "2014-08-07T21:00:00.000Z",
                            info: "",
                            salary: 350,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2014-12-28T22:00:00.000Z",
                            info: "Update",
                            salary: 500,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-08-31T21:00:00.000Z",
                            info: "Update",
                            salary: 600,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-10-31T22:00:00.000Z",
                            info: "Update",
                            salary: 800,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f00001c",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2016-01-31T22:00:00.000Z",
                            info: "Update",
                            salary: 900,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f00001c",
                            department: "55b92ace21e4b7c40f000016"
                        }
                    ],
                    hired: [
                        {
                            date: "2014-06-01T21:00:00.000Z",
                            info: "",
                            salary: 350,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2014-12-28T22:00:00.000Z",
                            info: "",
                            salary: 500,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-08-31T21:00:00.000Z",
                            info: "",
                            salary: 600,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f000017",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2015-10-31T22:00:00.000Z",
                            info: "",
                            salary: 800,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f00001c",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2016-01-31T22:00:00.000Z",
                            info: "",
                            salary: 900,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f00001c",
                            department: "55b92ace21e4b7c40f000016"
                        },
                        {
                            date: "2016-02-29T22:00:00.000Z",
                            info: "",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000060",
                            jobPosition: "55b92acf21e4b7c40f00001c",
                            department: "55b92ace21e4b7c40f000016"
                        }
                    ],
                    lastHire: 201609,
                    name: "Ishtvan Nazarovich",
                    _id: "55b92ad221e4b7c40f000034",
                    weekData: [
                        {
                            dateByWeek: 201611,
                            week: 11,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201612,
                            week: 12,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201613,
                            week: 13,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201614,
                            week: 14,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201615,
                            week: 15,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201616,
                            week: 16,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201617,
                            week: 17,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201618,
                            week: 18,
                            year: 2016,
                            holidays: 2,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201619,
                            week: 19,
                            year: 2016,
                            holidays: 1,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201620,
                            week: 20,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201621,
                            week: 21,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        }
                    ],
                    maxProjects: 0
                },
                {
                    isLead: 1,
                    fired: [
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
                    hired: [
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
                    lastHire: 201609,
                    name: "Vyacheslav Kopinets",
                    _id: "55b92ad221e4b7c40f00004d",
                    weekData: [
                        {
                            projectRoot: [
                                {
                                    hours: 24,
                                    project: "Casino",
                                    department: "55b92ace21e4b7c40f000016",
                                    employee: "55b92ad221e4b7c40f00004d",
                                    dateByWeek: 201611
                                }
                            ],
                            hours: 24,
                            department: "55b92ace21e4b7c40f000016",
                            employee: "55b92ad221e4b7c40f00004d",
                            dateByWeek: 201611,
                            projects: 1,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            projectRoot: [
                                {
                                    hours: 16,
                                    project: "Casino",
                                    department: "55b92ace21e4b7c40f000016",
                                    employee: "55b92ad221e4b7c40f00004d",
                                    dateByWeek: 201612
                                }
                            ],
                            hours: 16,
                            department: "55b92ace21e4b7c40f000016",
                            employee: "55b92ad221e4b7c40f00004d",
                            dateByWeek: 201612,
                            projects: 1,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201613,
                            week: 13,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201614,
                            week: 14,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201615,
                            week: 15,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201616,
                            week: 16,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201617,
                            week: 17,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201618,
                            week: 18,
                            year: 2016,
                            holidays: 2,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201619,
                            week: 19,
                            year: 2016,
                            holidays: 1,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201620,
                            week: 20,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        },
                        {
                            dateByWeek: 201621,
                            week: 21,
                            year: 2016,
                            holidays: 0,
                            vacations: 0
                        }
                    ],
                    maxProjects: 1
                }
            ],
            department: {
                _id: "55b92ace21e4b7c40f000016",
                departmentName: "Web"
            }
        }];
    var fakeWTrackDash = {
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
        wTracks: [
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
                dateByWeek: 201612,
                dateByMonth: 201603,
                year: 2016,
                week: 12,
                month: 3,
                info: {
                    salePrice: 100,
                    productType: "wTrack"
                },
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
                    imageSrc: "data:image/jpeg;base64,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",
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
        ]
    };

    var view;
    var topBarView;
    var indexView;

    describe('DashboardVacation', function () {

        var $fixture;
        var $elFixture;

        after(function () {
            view.remove();
            topBarView.remove();
            indexView.remove();
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

            it('Should create main view', function (done) {
                //this.timeout(300);

                var $expectedSubMenuEl;
                var $expectedMenuEl;

                setTimeout(function () {
                    server.respondWith('GET', '/getModules', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);
                    view = new MainView({el: $elFixture, contentType: 'DashBoardVacation'});
                    server.respond();

                    $expectedMenuEl = view.$el.find('#mainmenu-holder');
                    $expectedSubMenuEl = view.$el.find('#submenu-holder');

                    expect($expectedMenuEl).to.exist;
                    expect($expectedSubMenuEl).to.exist;

                    done();
                }, 300);


            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="73"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="73"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/DashBoardVacation');

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
                });

                expect(topBarView.$el.find('.vocationFilter')).to.exist;
                expect(topBarView.$el.find('#searchContainer')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Dashboard Vacation');
            });

        });


        describe('DashBoard IndexView', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var createView;

            before(function () {

                server = sinon.fakeServer.create();
                /!*mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm').returns(true);*!/
            });

            after(function () {
                server.restore();
                /!*mainSpy.restore();
                windowConfirmStub.restore();*!/
            });

            describe('INITIALIZE', function () {

                it('Try to create categories list view', function () {
                    var dashBoardUrl = new RegExp('dashboard\/vacation', 'i');

                    server.respondWith('GET', dashBoardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDashBoardVacations)]);
                    indexView = new IndexView({
                        startTime: new Date()
                    });
                    server.respond();


                    expect(indexView.$el.find('.dashBoardMargin')).to.exist;

                });

                it('Try to expand all', function(){
                    var $expandAllBtn = indexView.$el.find('.openAll');

                    $expandAllBtn.click();
                    expect(indexView.$el.find('#dashboardBody > tr:nth-child(3)').attr('data-content')).to.be.equals('employee');

                    $expandAllBtn.click();

                });

                it('Try to open web department', function(){
                    var $webDepartmentRow = indexView.$el.find('#dashboardBody > tr:nth-child(1)');

                    $webDepartmentRow.click();
                    expect(indexView.$el.find('#dashboardBody > tr:nth-child(2)').attr('data-id')).to.be.equals('55b92ad221e4b7c40f000034');
                    expect(indexView.$el.find('#dashboardBody > tr:nth-child(3)').attr('data-id')).to.be.equals('55b92ad221e4b7c40f00004d');

                });

                it('Try to open and close change range dialog', function(){
                    var $cancelBtn;
                    var $dateRangeEl = topBarView.$el.find('li.dateRange');

                    $dateRangeEl.click();

                    $cancelBtn = topBarView.$el.find('#cancelBtn');
                    $cancelBtn.click();
                });

                it('Try to change date range in TopBarView', function(){
                    var $startDateInput;
                    var $endDateInput;
                    var $updateBtn;
                    var $dateRangeEl = topBarView.$el.find('li.dateRange');
                    var dashBoardUrl = new RegExp('dashboard\/vacation', 'i');

                    $dateRangeEl.click();

                    $startDateInput = topBarView.$el.find('#startDate');
                    $endDateInput = topBarView.$el.find('#endDate');

                    $startDateInput.click();
                    $startDateInput.val('28 Mar, 2016');
                    $endDateInput.val('29 May, 2016');

                    $updateBtn = topBarView.$el.find('#updateDate');

                    server.respondWith('GET', dashBoardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDashBoardVacations)]);
                    $updateBtn.click();
                    indexView.changeDateRange();
                    server.respond();

                    expect(indexView.$el.find('.dashBoardMargin')).to.exist;

                });

                it('Try to get Wtrack Info', function(){
                    var $wTrackInfoEl;
                    var wTrackUrl = new RegExp('\/wTrack\/dash', 'i');
                    var $neeeEmployeeRow = indexView.$el.find('#dashboardBody > tr:nth-child(3) .employeesRow');

                    $neeeEmployeeRow.click();

                    $wTrackInfoEl = indexView.$el.find('#dashboardBody > tr[data-employee="55b92ad221e4b7c40f00004d"] > td.wTrackInfo')[0];

                    server.respondWith('GET', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWTrackDash)]);
                    $wTrackInfoEl.click();
                    server.respond();

                    expect($('.ui-dialog')).to.be.exist;

                });

                it('Try to edit wTrackInfo', function(){
                    var $dialogEl = $('.ui-dialog');
                    var $wednesdayInput;
                    var $saveBtn;
                    var $needTr = $dialogEl.find('tr[data-id="56efcd99371928ed3349003b"]');
                    var $wednesdayEl = $needTr.find('td[data-content="3"]');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');
                    var $wTrackInfoEl = $(indexView.$el.find('#dashboardBody > tr[data-employee="55b92ad221e4b7c40f00004d"] > td.wTrackInfo')[0]);

                    $wednesdayEl.click();
                    $wednesdayInput = $wednesdayEl.find('input');
                    $wednesdayInput.val(8);
                    $wednesdayInput.click();

                    $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                    server.respondWith('PATCH', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success:'Edited success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect($wTrackInfoEl.find('.projectHours').text()).to.be.equals('24');
                });

            });
        });


    });


});
*/
