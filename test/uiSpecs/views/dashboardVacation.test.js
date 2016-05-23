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
    'sinon-chai'
], function (fixtures, DashBoardVacationCollection, MainView, IndexView, TopBarView, StatisticsView, $, chai, chaiJquery, sinonChai) {
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
    var fakeProjectWTrack = {
        data: [
            {
                _id: "56e689c75ec71b00429745a9",
                TargetEndDate: "2016-03-31T00:00:00.000Z",
                StartDate: "2016-03-13T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56e6f1ae0d773c634e918b68"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T16:19:02.059Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [ ],
                notes: [ ],
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
                    users: [ ],
                    group: [ ]
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
                task: [
                    "57344855bc5899bc18136f40"
                ],
                projectName: "360CamSDK",
                projectShortDesc: "SDK",
                __v: 0,
                EndDate: "2016-05-12T09:09:41.026Z",
                salesManagers: [
                    {
                        date: "2016-03-14T12:27:34.597Z",
                        _id: "5707533ecbb17f48214c771f",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000669",
                EndDate: "2015-06-29T21:00:00.000Z",
                StartDate: "2014-12-10T22:00:00.000Z",
                ID: 52,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56617537bb8be7814fb52344",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000605",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "56617537bb8be7814fb52343",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 2,
                editedBy: {
                    date: "2016-03-16T12:28:51.409Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.298Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7e3f3f67bc40b000022",
                    name: "Pending"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000637",
                    name: {
                        last: "",
                        first: "Airsoft Holdings "
                    }
                },
                task: [ ],
                projectName: "Airsoft site",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 1134
                        },
                        {
                            percentage: "Sales/QA 16%",
                            resource: "Yana Gusti",
                            bonus: 9072
                        }
                    ],
                    projectTeam: [
                        "564cfd8ba6e6390160c9ef3f",
                        "564cfd8ba6e6390160c9ef06",
                        "564cfd8ba6e6390160c9ee8c",
                        "564cfd8ba6e6390160c9ef0c",
                        "564cfd8ba6e6390160c9ee51",
                        "564cfd8ba6e6390160c9edf9",
                        "564cfd8ba6e6390160c9ede3"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-12-11T12:27:35.076Z",
                        _id: "5707533ecbb17f48214c76a6",
                        manager: "55b92ad221e4b7c40f000063"
                    }
                ]
            },
            {
                _id: "5702160eed3f15af0782f13a",
                TargetEndDate: "2016-06-30T00:00:00.000Z",
                StartDate: "2016-04-03T21:00:00.000Z",
                description: "Description",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "570216bfb50d351f04817c37",
                        "57021688e7050b54043a696e"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-04T07:24:47.089Z",
                    user: "55b9dd237a3632120b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2016-04-04T07:21:50.931Z",
                    user: "55b9dd237a3632120b000005"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00062d",
                    name: {
                        last: "",
                        first: "Andreas Rabenseifner"
                    }
                },
                task: [ ],
                projectName: "Andreas Project 2",
                projectShortDesc: "Description",
                __v: 0,
                EndDate: "2016-06-06T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-04-04T12:27:34.831Z",
                        _id: "5707533ecbb17f48214c7723",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "569f60d162d172544baf0d58",
                StartDate: "2015-11-30T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56fe8682ec814f7c039b804c",
                        "56f2530e5b26f346501c2e95",
                        "56cf1b6e541812c071973595",
                        "56c599c7d2b48ede4ba4224b",
                        "56e291d1896e98a661aa831c",
                        "56b4be1799ce8d706a81b2e0",
                        "569f624a62d172544baf0d5c"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-01T14:32:34.987Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                attachments: [ ],
                notes: [ ],
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
                    group: [ ],
                    users: [ ],
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
                task: [ ],
                projectName: "Android advertisement",
                projectShortDesc: "Supportment of app",
                __v: 0,
                EndDate: "2016-04-11T21:00:00.000Z",
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-12-01T12:27:34.210Z",
                        _id: "5707533ecbb17f48214c773a",
                        manager: "561ba8639ebb48212ea838c4"
                    }
                ]
            },
            {
                _id: "56aa2cb4b4dc0d09232bd7aa",
                StartDate: "2015-01-11T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56ab630c74d57e0d56d6bdcf",
                        "56ab5a4d74d57e0d56d6bd9e"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-01-29T12:33:11.126Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-01-28T14:59:00.735Z",
                    user: "55b9fbcdd79a3a3439000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: {
                        last: "Stan",
                        first: "Igor"
                    }
                },
                customer: {
                    _id: "5604170eb904af832d000005",
                    name: {
                        last: "",
                        first: "Stentle"
                    }
                },
                task: [ ],
                projectName: "AngularJS - Stentle",
                projectShortDesc: "AngularJS",
                __v: 0,
                EndDate: "2016-02-25T22:00:00.000Z",
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2016-01-18T12:27:34.106Z",
                        _id: "5707533ecbb17f48214c7741",
                        manager: "55b92ad221e4b7c40f0000a2"
                    }
                ]
            },
            {
                _id: "562ff292b03714731dd8433b",
                StartDate: "2015-10-25T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56f39685f504b2b550af010b",
                        "56ab635b74d57e0d56d6bddc",
                        "569f899562d172544baf0d90",
                        "566c232de241a6526e38acfe",
                        "5664ca8708ed794128637ce2",
                        "5664ca7d08ed794128637ce1",
                        "5660494bccc590f32c5785a4"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-15T17:20:12.650Z",
                    user: "569f5d8c62d172544baf0d52"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2015-10-27T21:54:26.294Z",
                    user: "55cb7302fea413b50b000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f0000cb",
                    name: {
                        last: "Yelahina",
                        first: "Alona"
                    }
                },
                customer: {
                    _id: "562ff202547f50b51d6de2b8",
                    name: {
                        last: "",
                        first: "Appsmakerstore"
                    }
                },
                task: [ ],
                projectName: "Appsmakerstore",
                projectShortDesc: "Appsmakerstore",
                __v: 0,
                EndDate: "2016-04-07T21:00:00.000Z",
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-10-26T12:27:34.095Z",
                        _id: "5707533ecbb17f48214c772a",
                        manager: "55b92ad221e4b7c40f0000cb"
                    }
                ]
            },
            {
                _id: "56abd16ac6be8658550dc6c3",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56e668e104f9482d4273ed01",
                        "56e663bc81046d9741fb66cb",
                        "56e6690904f9482d4273ed02",
                        "56abd2c2c6be8658550dc6c4"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T07:32:25.393Z",
                    user: "56239e58e9576d1728a9ed1f"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-01-29T20:54:02.632Z",
                    user: "563f673270bbc2b740ce89ae"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00065e",
                    name: {
                        last: "",
                        first: "Collections Tech"
                    }
                },
                task: [ ],
                projectName: "Baccarat",
                projectShortDesc: "Unity 3d video streaming project",
                __v: 0,
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2015-01-18T22:00:00.000Z",
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2016-01-25T12:27:34.249Z",
                        _id: "5707533ecbb17f48214c7745",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "56e2cc9b74ac46664a83e949",
                TargetEndDate: "2016-05-20T00:00:00.000Z",
                StartDate: "2016-03-13T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56e2ce5d6d9d22ae49e427b9",
                        "56e6f5fac64e96844ef3d6a0",
                        "56e6f5d3977124d34db582ac"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-31T12:13:55.074Z",
                    user: "56239e58e9576d1728a9ed1f"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-03-11T13:48:11.492Z",
                    user: "56239e58e9576d1728a9ed1f"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "56123232c90e2fb026ce064b",
                    name: {
                        last: "Sikora",
                        first: "Olga"
                    }
                },
                customer: {
                    _id: "5604170eb904af832d000005",
                    name: {
                        last: "",
                        first: "Stentle"
                    }
                },
                task: [ ],
                projectName: "Backoffice 2.0 Stentle",
                projectShortDesc: "AngularJS web page",
                __v: 0,
                EndDate: "2016-04-14T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2016-03-14T12:27:34.549Z",
                        _id: "5707533ecbb17f48214c771e",
                        manager: "56123232c90e2fb026ce064b"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006c7",
                EndDate: "2015-12-03T22:00:00.000Z",
                StartDate: "2015-06-30T21:00:00.000Z",
                ID: 2106,
                bonus: [ ],
                health: 1,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.406Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f0000a0",
                    name: {
                        last: "Bilak",
                        first: "Ivan"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f00061f",
                    name: {
                        last: "",
                        first: "PostIndustria"
                    }
                },
                task: [ ],
                projectName: "BizRate",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    projectTeam: [
                        "564cfdd06584412e618421dc",
                        "564cfd8ba6e6390160c9ef66"
                    ],
                    bonus: [ ]
                },
                salesManagers: [
                    {
                        date: "2015-07-01T12:27:34.196Z",
                        _id: "5707533ecbb17f48214c76f6",
                        manager: "55b92ad221e4b7c40f0000a0"
                    }
                ]
            },
            {
                _id: "5638e863593807ff047d99e5",
                budget: { },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2015-11-26T17:44:43.621Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2015-11-03T17:01:23.890Z",
                    user: "56239e0ce9576d1728a9ed1d"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f00061f",
                    name: {
                        last: "",
                        first: "PostIndustria"
                    }
                },
                task: [ ],
                projectName: "Bizrate",
                projectShortDesc: "iOS",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2015-12-03T23:00:00.000Z",
                StartDate: "2015-10-18T22:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-10-18T22:00:00.000Z",
                        _id: "5707533ecbb17f48214c772d",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "56a0d60062d172544baf0e3d",
                StartDate: "2015-12-13T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56a0e0cc62d172544baf1108",
                        "5703d98153db5c9d03fc9ed9",
                        "56fe401853db5c9d03fc9e8a"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-01T09:32:08.103Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2016-01-21T12:58:40.967Z",
                    user: "55b9fbcdd79a3a3439000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: {
                        last: "Stan",
                        first: "Igor"
                    }
                },
                customer: {
                    _id: "56a0d53b62d172544baf0e3c",
                    name: {
                        last: "Liden",
                        first: "Ivar"
                    }
                },
                task: [ ],
                projectName: "BuddyBet",
                projectShortDesc: "Betting app",
                __v: 0,
                TargetEndDate: "2016-04-12T22:00:00.000Z",
                EndDate: "2016-04-06T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-12-14T12:27:34.202Z",
                        _id: "5707533ecbb17f48214c773b",
                        manager: "55b92ad221e4b7c40f0000a2"
                    }
                ]
            },
            {
                _id: "5629e238129820ab5994e8c0",
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 5853.9
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 23415.6
                        }
                    ],
                    projectTeam: [
                        "56e02cbaf7a4b1301e312af4",
                        "568a26203cce9254776f2ae6",
                        "564cfdd06584412e618421b3"
                    ]
                },
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5702a7f369c37d5903700b38",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "5702a7f369c37d5903700b37",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-04-04T17:44:19.002Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-10-23T07:31:04.925Z",
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad521e4b7c40f000619",
                    name: {
                        last: "",
                        first: "Israel"
                    }
                },
                task: [ ],
                projectName: "Bus Project",
                projectShortDesc: "Bus lines",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2016-03-10T22:00:00.000Z",
                StartDate: "2015-08-23T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-08-24T12:27:34.321Z",
                        _id: "5707533ecbb17f48214c7727",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "56bdcc69dfd8a81466e2f58a",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56bdcd3edfd8a81466e2f58b"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-02-12T12:17:02.062Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2016-02-12T12:13:29.428Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: {
                        first: "Buzinga",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "Buzinga extra costs",
                projectShortDesc: "extra costs",
                __v: 0,
                EndDate: "2016-02-25T22:00:00.000Z",
                StartDate: "2015-01-11T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-01-12T12:27:34.230Z",
                        _id: "5707533ecbb17f48214c7749",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "56ab5ceb74d57e0d56d6bda5",
                StartDate: "2016-02-02T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56e6a6b1ef05acd9418dff38",
                        "5702588fb50d351f04817c47",
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
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: {
                        last: "Stan",
                        first: "Igor"
                    }
                },
                customer: {
                    _id: "56ab5ca674d57e0d56d6bda4",
                    name: {
                        last: "Maurstad",
                        first: "Stian"
                    }
                },
                task: [ ],
                projectName: "CAPT",
                projectShortDesc: "capt the video",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2016-04-06T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2016-02-03T12:27:34.154Z",
                        _id: "5707533ecbb17f48214c7742",
                        manager: "55b92ad221e4b7c40f0000a2"
                    }
                ]
            },
            {
                _id: "56e292585def9136621b7800",
                TargetEndDate: "2016-04-20T00:00:00.000Z",
                StartDate: "2016-03-15T22:00:00.000Z",
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Usual 6%",
                            resource: "Eugen Lendyel",
                            bonus: 5280.06
                        }
                    ],
                    projectTeam: [
                        "56f3f47969c37d5903700afb"
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
                    date: "2016-03-24T14:06:49.216Z",
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
                workflow: {
                    _id: "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "56029cc950de7f4138000005",
                    name: {
                        last: "Lendyel",
                        first: "Eugen"
                    }
                },
                customer: {
                    _id: "56e291651f2850d361927dd0",
                    name: {
                        last: "Strauss",
                        first: "Gil"
                    }
                },
                task: [ ],
                projectName: "Casino",
                projectShortDesc: "Flash to HTML5",
                __v: 0,
                EndDate: "2016-03-31T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2016-03-16T12:27:34.148Z",
                        _id: "5707533ecbb17f48214c7756",
                        manager: "56029cc950de7f4138000005"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006d8",
                EndDate: "2016-03-03T22:00:00.000Z",
                StartDate: "2015-07-19T21:00:00.000Z",
                ID: 3117,
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2015-12-04T16:37:52.168Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.418Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00063e",
                    name: {
                        last: "",
                        first: "VTI"
                    }
                },
                task: [ ],
                projectName: "Casino Game",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56a9d20cb4dc0d09232bd732",
                        "568d1d85f48a06a15490c618",
                        "5661bdf4f13e46fd14533a39",
                        "5661bb0bf13e46fd1453393e",
                        "565c69913410ae512364e725",
                        "564cfdd06584412e618421e4",
                        "564cfd8ba6e6390160c9ef4f",
                        "56a9d5eab4dc0d09232bd747",
                        "564cfd8ba6e6390160c9ef1a"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-07-20T12:27:34.816Z",
                        _id: "5707533ecbb17f48214c7704",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "563767135d23a8eb04e80aec",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "564cfdd06584412e618421e3"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2015-11-22T12:59:56.080Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-11-02T13:37:23.358Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "5637627bc928c61d052d500e",
                    name: {
                        last: "Bekefi",
                        first: "Tibor"
                    }
                },
                task: [ ],
                projectName: "Coach App",
                projectShortDesc: "iOS, Android, Backend",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2015-11-08T22:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-11-02T12:27:34.797Z",
                        _id: "5707533ecbb17f48214c772c",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "56fe645769c37d5903700b20",
                TargetEndDate: "2016-04-07T00:00:00.000Z",
                StartDate: "2016-03-29T21:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56fe64ade7050b54043a6965"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-01T12:08:13.664Z",
                    user: "56a72cafaa157ca50f21fb22"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2016-04-01T12:06:47.419Z",
                    user: "56a72cafaa157ca50f21fb22"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "561b756f9ebb48212ea838c0",
                    name: {
                        last: "Romanyuk",
                        first: "Stanislav"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: {
                        last: "",
                        first: "Foxtrapp"
                    }
                },
                task: [ ],
                projectName: "Colgate",
                projectShortDesc: "Quizz",
                __v: 0,
                EndDate: "2016-04-07T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-03-30T12:27:34.500Z",
                        _id: "5707533ecbb17f48214c7722",
                        manager: "561b756f9ebb48212ea838c0"
                    }
                ]
            },
            {
                _id: "5703a427c3a5da3e0347a481",
                StartDate: "2015-11-15T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "5703a4cf0bbb61c30355b546"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-05T11:43:11.322Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2016-04-05T11:40:23.649Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce80ef3f67bc40b000024",
                    name: "Cancelled"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55d38523226ed3280b000007",
                    name: {
                        last: "Hickey",
                        first: "Peter"
                    }
                },
                task: [ ],
                projectName: "Command Center",
                projectShortDesc: "social marketing analysis tool",
                __v: 0,
                EndDate: "2015-12-08T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-11-09T12:27:34.352Z",
                        _id: "5707533ecbb17f48214c775d",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000672",
                EndDate: "2016-03-27T21:00:00.000Z",
                StartDate: "2015-04-28T21:00:00.000Z",
                ID: 1099,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000607",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "56dfcf5f16ff2db10581fa08",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56dfcf5f16ff2db10581fa07",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-30T11:52:59.577Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.303Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f000621",
                    name: {
                        last: "",
                        first: "Mike Allstar"
                    }
                },
                task: [ ],
                projectName: "DRH QA Automation",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/QA 8%",
                            resource: "Yana Gusti",
                            bonus: 29597.76
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 7399.44
                        }
                    ],
                    projectTeam: [
                        "56dfcfe31a58be4d05ef23a4",
                        "56ab49a0b4dc0d09232bd7fa",
                        "56e66f0e04f9482d4273ed0a",
                        "56ab4977b4dc0d09232bd7f8",
                        "569ca682cf1f31f925c026bb",
                        "56936ae9d87c9004552b6398",
                        "564cfd8ba6e6390160c9eed5",
                        "564cfd8ba6e6390160c9ef42",
                        "56ab4984b4dc0d09232bd7f9",
                        "568a3cb63cce9254776f2b34",
                        "564cfd8ba6e6390160c9ef29",
                        "564cfd8ba6e6390160c9eefb",
                        "569ca6c0cf1f31f925c026bd",
                        "564cfd8ba6e6390160c9ef68",
                        "56e66f2e68e298b241985646",
                        "568a3ce63cce9254776f2b36",
                        "564cfd8ba6e6390160c9eeef",
                        "564cfd8ba6e6390160c9eed7",
                        "564cfd8ba6e6390160c9ef3a",
                        "564cfd8ba6e6390160c9eecd",
                        "56e66ef104f9482d4273ed09",
                        "564cfd8ba6e6390160c9eefd",
                        "564cfd8ba6e6390160c9eeb2",
                        "564cfd8ba6e6390160c9ef50",
                        "564cfd8ba6e6390160c9eee1",
                        "56e66f9bef05acd9418dff15",
                        "564cfd8ba6e6390160c9eea8",
                        "564cfd8ba6e6390160c9ef2a",
                        "565b0d39b4c12a54076f7b06",
                        "56ab49a9b4dc0d09232bd7fb",
                        "564cfd8ba6e6390160c9ef46",
                        "56604bce570d336e56902f53",
                        "564cfd8ba6e6390160c9ef69",
                        "564cfd8ba6e6390160c9ef82",
                        "564cfdd06584412e618421a2",
                        "565c5f683410ae512364dbd5"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-04-29T12:27:35.070Z",
                        _id: "5707533ecbb17f48214c76af",
                        manager: "55b92ad221e4b7c40f000063"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f00068c",
                EndDate: "2016-03-31T21:00:00.000Z",
                StartDate: "2014-09-30T21:00:00.000Z",
                ID: 28,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000605",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "5660252f4afaaced62c68d75",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5660252f4afaaced62c68d74",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T07:47:12.863Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.317Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f000621",
                    name: {
                        last: "",
                        first: "Mike Allstar"
                    }
                },
                task: [ ],
                projectName: "DRH manual",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/QA 16%",
                            resource: "Yana Gusti",
                            bonus: 192304
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 24038
                        }
                    ],
                    projectTeam: [
                        "56e66c807c22c0704120b1c9",
                        "56e66c703d5bc25541857e0e",
                        "56e66c6068e298b24198563e",
                        "56e66c493d5bc25541857e0d",
                        "566e835c8453e8b464b709d1",
                        "56ab4b1ab4dc0d09232bd815",
                        "56ab4acbb4dc0d09232bd813",
                        "56ab4ac4b4dc0d09232bd812",
                        "56ab4abab4dc0d09232bd811",
                        "564cfd8ba6e6390160c9ee98",
                        "564cfd8ba6e6390160c9ee03",
                        "564cfd8ba6e6390160c9eedc",
                        "564cfd8ba6e6390160c9eeae",
                        "564cfd8ba6e6390160c9ee97",
                        "564cfd8ba6e6390160c9eedb",
                        "564cfd8ba6e6390160c9ee90",
                        "564cfd8ba6e6390160c9ee7d",
                        "564cfd8ba6e6390160c9eeb3",
                        "564cfd8ba6e6390160c9eecc",
                        "569ca776cf1f31f925c026c8",
                        "564cfd8ba6e6390160c9ee41",
                        "564cfd8ba6e6390160c9ee17",
                        "569365e8d87c9004552b6385",
                        "564cfd8ba6e6390160c9eee0",
                        "564cfd8ba6e6390160c9ee74",
                        "564cfd8ba6e6390160c9ee62",
                        "564cfd8ba6e6390160c9ef2f",
                        "564cfd8ba6e6390160c9ee69",
                        "564cfd8ba6e6390160c9ef75",
                        "565c61253410ae512364dbfa",
                        "564cfd8ba6e6390160c9eeb0",
                        "564cfd8ba6e6390160c9ee76",
                        "564cfd8ba6e6390160c9ef6b",
                        "564cfd8ba6e6390160c9ef3b",
                        "564cfd8ba6e6390160c9ef00",
                        "564cfd8ba6e6390160c9ef07",
                        "56604c27570d336e56903009",
                        "564cfd8ba6e6390160c9ee42",
                        "564cfd8ba6e6390160c9ef47",
                        "564cfd8ba6e6390160c9ef51",
                        "564cfd8ba6e6390160c9ee9e",
                        "564cfd8ba6e6390160c9eed8",
                        "564cfd8ba6e6390160c9ee37",
                        "564cfd8ba6e6390160c9ef83",
                        "568bb6047c0383e04c60e88b",
                        "564cfdd06584412e6184219b",
                        "564cfd8ba6e6390160c9eef5",
                        "564cfd8ba6e6390160c9ef41",
                        "56e66c3004f9482d4273ed05",
                        "564cfd8ba6e6390160c9ee94",
                        "565b117db4c12a54076f7b21",
                        "564cfd8ba6e6390160c9edf0",
                        "565c5d233410ae512364db8e",
                        "568bbad27c0383e04c60e8b5",
                        "564cfd8ba6e6390160c9ee7c",
                        "569ca7efcf1f31f925c026c9"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-10-01T12:27:34.542Z",
                        _id: "5707533ecbb17f48214c76c7",
                        manager: "55b92ad221e4b7c40f000063"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006c6",
                EndDate: "2015-01-05T22:00:00.000Z",
                StartDate: "2015-01-18T22:00:00.000Z",
                ID: 2101,
                bonus: [ ],
                health: 1,
                editedBy: {
                    user: "55cb7302fea413b50b000007",
                    date: "2015-08-15T15:25:23.359Z"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.406Z",
                    user: "52203e707d4dba8813000003"
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
                    owner: "55ba28c8d79a3a3439000016",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55cf4f834a91e37b0b000102",
                    name: {
                        first: "SharperBuilds",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "Demo Rocket",
                projectShortDesc: "emptyProject",
                __v: 0,
                teams: { },
                info: { },
                description: "",
                budget: {
                    projectTeam: [
                        "564cfd8ba6e6390160c9ef56",
                        "564cfdd06584412e618421a6",
                        "564cfd8ba6e6390160c9ef57"
                    ],
                    bonus: [ ]
                },
                salesManagers: [
                    {
                        date: "2015-01-19T12:27:34.234Z",
                        _id: "5707533ecbb17f48214c76f5",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "57039f0353db5c9d03fc9ebe",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "57066bdec3a5da3e0347a4c7",
                        "5703bd0b0bbb61c30355b552",
                        "5703a092c3a5da3e0347a480"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-05T11:18:27.490Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: ".net",
                createdBy: {
                    date: "2016-04-05T11:18:27.490Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
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
                    _id: "55b92ad621e4b7c40f00063c",
                    name: {
                        last: "",
                        first: "DigiPresents"
                    }
                },
                task: [ ],
                projectName: "DiGep",
                projectShortDesc: "Training app",
                __v: 0,
                EndDate: "2016-03-17T22:00:00.000Z",
                StartDate: "2015-11-08T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-11-02T12:27:34.690Z",
                        _id: "5707533ecbb17f48214c76b9",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006aa",
                EndDate: "2015-04-29T21:00:00.000Z",
                StartDate: "2014-11-02T22:00:00.000Z",
                ID: 41,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56823449634e31822ac28c0b",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000602",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56823449634e31822ac28c0a",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2015-12-29T07:20:41.949Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.338Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: {
                        first: "Buzinga",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "DiveplanIT",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 37682.12
                        },
                        {
                            percentage: "Sales/Head 8%",
                            resource: "Oleg Ostroverkh",
                            bonus: 150728.48
                        }
                    ],
                    projectTeam: [
                        "564cfd8ba6e6390160c9eea5",
                        "564cfd8ba6e6390160c9eea0",
                        "564cfd8ba6e6390160c9ee54",
                        "564cfd8ba6e6390160c9ee2d"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-11-03T12:27:34.408Z",
                        _id: "5707533ecbb17f48214c7733",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "56fd3453a33b73e503e3eb65",
                StartDate: "2015-12-06T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "57021bddc3a5da3e0347a44a",
                        "570505d60bbb61c30355b564",
                        "5703bc05ec814f7c039b8096",
                        "570629f20bbb61c30355b570",
                        "57021bf769c37d5903700b2d"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-31T14:29:39.876Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2016-03-31T14:29:39.876Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
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
                    _id: "55b92ad621e4b7c40f00063c",
                    name: {
                        last: "",
                        first: "DigiPresents"
                    }
                },
                task: [ ],
                projectName: "Donation App",
                projectShortDesc: "Xamarin project",
                __v: 0,
                EndDate: "2016-04-14T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-11-30T12:27:34.662Z",
                        _id: "5707533ecbb17f48214c7721",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "56dffa45f20b938426716709",
                TargetEndDate: "2016-03-28T00:00:00.000Z",
                StartDate: "2016-02-08T22:00:00.000Z",
                description: "Management system for hospitals",
                budget: {
                    projectTeam: [
                        "570229960bbb61c30355b513",
                        "56e12ca58af0cbf501828bed"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-04T08:45:10.308Z",
                    user: "560c099da5d4a2e20ba5068b"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-03-09T10:26:13.479Z",
                    user: "56dfef269100b25c05819305"
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
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f0000bb",
                    name: {
                        last: "Shepinka",
                        first: "Igor"
                    }
                },
                customer: {
                    _id: "56dff9147e20c5df25a36bbf",
                    name: {
                        last: "",
                        first: "Lassic"
                    }
                },
                task: [ ],
                projectName: "ESTablet web",
                projectShortDesc: "Management system for hospitals",
                __v: 0,
                EndDate: "2016-04-05T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-02-09T12:27:34.169Z",
                        _id: "5707533ecbb17f48214c7751",
                        manager: "55b92ad221e4b7c40f0000bb"
                    }
                ]
            },
            {
                _id: "56dff1b4a12a4f3c26919c91",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "57029c330bbb61c30355b521",
                        "56dff2787e20c5df25a36bb7"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-04T13:42:12.604Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2016-03-09T09:49:40.572Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: {
                        last: "Sokhanych",
                        first: "Alex"
                    }
                },
                customer: {
                    _id: "56a9ee95d59a04d6225b0df4",
                    name: {
                        last: "",
                        first: "ThinkMobiles"
                    }
                },
                task: [ ],
                projectName: "EasyERP",
                projectShortDesc: "EasyERP all jobs",
                __v: 0,
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2015-09-27T21:00:00.000Z",
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-09-28T12:27:34.088Z",
                        _id: "5707533ecbb17f48214c774e",
                        manager: "55b92ad221e4b7c40f00004f"
                    }
                ]
            },
            {
                _id: "55f55d31b81672730c000020",
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "566e79968453e8b464b70913",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "566e79968453e8b464b70912",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-04-08T14:17:09.933Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "android",
                createdBy: {
                    date: "2015-09-13T11:25:37.478Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce80ef3f67bc40b000024",
                    name: "Cancelled"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
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
                    _id: "55ba0df2d79a3a3439000015",
                    name: {
                        last: "Leket",
                        first: "Erez"
                    }
                },
                task: [ ],
                projectName: "Farmers App",
                projectShortDesc: "App for Farmers",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 19733.960000000006
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 78935.84000000003
                        }
                    ],
                    projectTeam: [
                        "564cfdd06584412e618421ad"
                    ]
                },
                TargetEndDate: "",
                EndDate: "2016-02-18T22:00:00.000Z",
                StartDate: "2015-09-06T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-09-07T12:27:34.605Z",
                        _id: "5707533ecbb17f48214c7713",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006b8",
                EndDate: "2015-01-06T22:00:00.000Z",
                StartDate: "2015-01-13T22:00:00.000Z",
                ID: 77,
                bonus: [
                    {
                        employeeId: "55b92ad221e4b7c40f00004a",
                        bonusId: "55b92ad521e4b7c40f000604",
                        startDate: null,
                        endDate: null,
                        _id: "55b92ae521e4b7c40f00156e"
                    },
                    {
                        employeeId: "55b92ad221e4b7c40f00004b",
                        bonusId: "55b92ad521e4b7c40f000608",
                        startDate: null,
                        endDate: null,
                        _id: "55b92ae521e4b7c40f001588"
                    }
                ],
                health: 1,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.343Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f000615",
                    name: {
                        last: "",
                        first: "TechJoiner"
                    }
                },
                task: [ ],
                projectName: "FindLost",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    projectTeam: [
                        "564cfdd06584412e618421b7",
                        "564cfd8ba6e6390160c9eedf",
                        "564cfd8ba6e6390160c9eebb",
                        "564cfd8ba6e6390160c9ee47",
                        "564cfd8ba6e6390160c9ee61"
                    ],
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 21400.04
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Roland Katona",
                            bonus: 85600.16
                        }
                    ]
                },
                salesManagers: [
                    {
                        date: "2015-01-14T12:27:34.471Z",
                        _id: "5707533ecbb17f48214c76ea",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "56030dbffa3f91444e00000d",
                StartDate: "2015-09-20T21:00:00.000Z",
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56e04118c5fe1529741bff28",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "56e04118c5fe1529741bff27",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-04-04T17:12:31.358Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2015-09-23T20:38:23.545Z",
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
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
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
                    _id: "56030d81fa3f91444e00000c",
                    name: {
                        last: "",
                        first: "Peter F"
                    }
                },
                task: [ ],
                projectName: "Firderberg",
                projectShortDesc: "web",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 64700.060000000005
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 258800.24000000002
                        }
                    ],
                    projectTeam: [
                        "56afda4cf5c2bcd4555cb2f1",
                        "568a27d43cce9254776f2aef",
                        "568a27943cce9254776f2ae9",
                        "56605dae7f54fd33261683a9",
                        "56605c547f54fd33261682a7",
                        "564cfd8ba6e6390160c9ef8e"
                    ]
                },
                TargetEndDate: "",
                EndDate: "2016-02-28T22:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-09-21T12:27:34.577Z",
                        _id: "5707533ecbb17f48214c7734",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006ce",
                EndDate: "2015-11-19T22:00:00.000Z",
                StartDate: "2015-07-12T21:00:00.000Z",
                ID: 3112,
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-04T18:35:06.049Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.409Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00065e",
                    name: {
                        last: "",
                        first: "Collections Tech"
                    }
                },
                task: [ ],
                projectName: "FlipStar Game",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "564cfdd06584412e618421c8"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-07-13T12:27:34.221Z",
                        _id: "5707533ecbb17f48214c76fb",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "568b85b33cce9254776f2b4c",
                TargetEndDate: "2016-06-30T00:00:00.000Z",
                StartDate: "2015-01-11T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56a9d8a8b4dc0d09232bd757",
                        "56f4e015b50d351f04817bfd",
                        "56ead9599c44f71b3c1b4161",
                        "56e12d5dd6b3628b02612e40",
                        "56cc02ec541812c07197354c",
                        "56af5a2374d57e0d56d6befd"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T16:20:41.621Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2016-01-05T08:58:27.383Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad521e4b7c40f000619",
                    name: {
                        last: "",
                        first: "Israel"
                    }
                },
                task: [ ],
                projectName: "FluxIOT",
                projectShortDesc: "Hydroponic app",
                __v: 0,
                EndDate: "2016-04-07T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2016-01-18T12:27:34.570Z",
                        _id: "5707533ecbb17f48214c7736",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "56e93c3b07ea2d845ef75dff",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "5703af50c3a5da3e0347a484",
                        "56e93e01c7c1d1bd5e205715"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-16T10:58:03.834Z",
                    user: "56dda0599fb95fbe18e3f8ed"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-03-16T10:58:03.834Z",
                    user: "56dda0599fb95fbe18e3f8ed"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: {
                        last: "Sokhanych",
                        first: "Alex"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000643",
                    name: {
                        last: "",
                        first: "Angelica"
                    }
                },
                task: [ ],
                projectName: "Guru",
                projectShortDesc: "Guru website",
                __v: 0,
                EndDate: "2016-04-04T21:00:00.000Z",
                StartDate: "2015-09-27T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-09-28T12:27:34.087Z",
                        _id: "5707533ecbb17f48214c7720",
                        manager: "55b92ad221e4b7c40f00004f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006be",
                EndDate: "2016-12-06T22:00:00.000Z",
                StartDate: "2015-03-31T21:00:00.000Z",
                ID: 1093,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000603",
                        employeeId: "55b92ad221e4b7c40f00004b",
                        _id: "56e6c3140d773c634e918b63",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56e6c3140d773c634e918b62",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "56e6c3140d773c634e918b61",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T13:56:36.531Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.345Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000639",
                    name: {
                        last: "",
                        first: "Digital Media"
                    }
                },
                task: [ ],
                projectName: "HBO",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Usual 6%",
                            resource: "Roland Katona",
                            bonus: 348827.7
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 116275.9
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Yana Gusti",
                            bonus: 116275.9
                        }
                    ],
                    projectTeam: [
                        "5702135853db5c9d03fc9e96",
                        "56e68bf268e298b24198565c",
                        "564cfd8ba6e6390160c9ef3d",
                        "564cfd8ba6e6390160c9ef4d",
                        "564cfd8ba6e6390160c9ef32",
                        "56af527174d57e0d56d6bef6",
                        "5661c266f13e46fd14533ba6",
                        "56af53f074d57e0d56d6bef7",
                        "56af554c74d57e0d56d6bef9",
                        "5661c387f13e46fd14533cc8",
                        "56af62db74d57e0d56d6bf1d",
                        "56af5db374d57e0d56d6bf13"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-04-01T12:27:34.459Z",
                        _id: "5707533ecbb17f48214c76ee",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "56d9a14f7891423e3d5b8f18",
                TargetEndDate: "2016-03-25T00:00:00.000Z",
                StartDate: "2016-02-21T22:00:00.000Z",
                description: "iOS ( Swift )",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56e03be26c2eebb973af2c57",
                        "56e03d09fb273d77732f40fd",
                        "56e03d53c5fe1529741bff23"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-15T08:06:43.015Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2016-03-04T14:53:03.447Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00009b",
                    name: {
                        last: "Popp",
                        first: "Larysa"
                    }
                },
                customer: {
                    _id: "56d9a09a045bc8e93c16efe4",
                    name: {
                        last: "FitzGerald",
                        first: "Michael"
                    }
                },
                task: [ ],
                projectName: "Habi",
                projectShortDesc: "iOS Swift",
                __v: 0,
                EndDate: "2016-04-07T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-02-22T12:27:34.211Z",
                        _id: "5707533ecbb17f48214c774c",
                        manager: "55b92ad221e4b7c40f00009b"
                    }
                ]
            },
            {
                _id: "569f58df62d172544baf0c3d",
                StartDate: "2015-12-08T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56e668b13d5bc25541857e0c",
                        "56ab4742b4dc0d09232bd7cb",
                        "569f5bd062d172544baf0c5f"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T07:30:57.838Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "android",
                createdBy: {
                    date: "2016-01-20T09:52:31.335Z",
                    user: "55ba00e9d79a3a343900000c"
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
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000040",
                    name: {
                        last: "Almashiy",
                        first: "Vasiliy"
                    }
                },
                customer: {
                    _id: "569f57be62d172544baf0c3a",
                    name: {
                        last: "",
                        first: "ETECTURE GmbH"
                    }
                },
                task: [ ],
                projectName: "Haie",
                projectShortDesc: "Bugfix/Inplementation",
                __v: 0,
                EndDate: "2016-03-09T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-12-09T12:27:34.931Z",
                        _id: "5707533ecbb17f48214c7719",
                        manager: "55b92ad221e4b7c40f000040"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006d3",
                EndDate: "2016-03-31T21:00:00.000Z",
                StartDate: "2015-06-30T21:00:00.000Z",
                ID: 2105,
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T07:20:35.432Z",
                    user: "52203e707d4dba8813000003"
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
                workflow: {
                    _id: "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000040",
                    name: {
                        last: "Almashiy",
                        first: "Vasiliy"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00062b",
                    name: {
                        last: "",
                        first: "HashPlay"
                    }
                },
                task: [ ],
                projectName: "HashPlay",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56ab56b374d57e0d56d6bd87",
                        "569e98452208b3af4a5271c2",
                        "569ea8b62208b3af4a5271cd",
                        "5662125d25e5eb511510be16",
                        "564cfdd06584412e618421b4",
                        "5662165b25e5eb511510bf92",
                        "5662134b25e5eb511510be6f",
                        "564cfd8ba6e6390160c9ef59",
                        "564cfd8ba6e6390160c9ef58"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-07-01T12:27:34.943Z",
                        _id: "5707533ecbb17f48214c76ff",
                        manager: "55b92ad221e4b7c40f000040"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f00065f",
                EndDate: "2016-04-26T21:00:00.000Z",
                StartDate: "2014-08-10T21:00:00.000Z",
                ID: 1,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f00060a",
                        employeeId: "55b92ad221e4b7c40f000031",
                        _id: "570e4aa461cae96537ef44ad",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000607",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "570e4aa461cae96537ef44ac",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "570e4aa461cae96537ef44ab",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 3,
                editedBy: {
                    date: "2016-04-13T13:33:24.594Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.291Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f00060c",
                    name: {
                        first: "Alexey",
                        last: "Blinov"
                    }
                },
                task: [ ],
                projectName: "IOS/Android QA",
                projectShortDesc: "emptyProject",
                __v: 0,
                teams: { },
                info: { },
                description: "",
                TargetEndDate: "2016-04-23T21:00:00.000Z",
                budget: {
                    bonus: [
                        {
                            percentage: "PM Junior/Usual 1.5%",
                            resource: "Alex Gleba",
                            bonus: 294
                        },
                        {
                            percentage: "Sales/QA 8%",
                            resource: "Yana Gusti",
                            bonus: 1568
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 392
                        }
                    ],
                    projectTeam: [
                        "570dfc206625f34212d01f3f",
                        "570dfbd96625f34212d01f39",
                        "570dfb7d6625f34212d01f37",
                        "570de3596625f34212d01f32",
                        "570ddef86625f34212d01f2d",
                        "564cfd8ba6e6390160c9ee1c"
                    ]
                },
                salesManagers: [
                    {
                        date: "2014-08-11T12:27:35.056Z",
                        _id: "5707533ecbb17f48214c769c",
                        manager: "55b92ad221e4b7c40f000063"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000665",
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2015-02-08T22:00:00.000Z",
                ID: 32,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000602",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "56f8f5d9a33b73e503e3eb48",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56f8f5d9a33b73e503e3eb47",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-28T09:14:01.399Z",
                    user: "56c44e38b81fd51e19207f40"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.296Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad621e4b7c40f000658",
                    name: {
                        last: "",
                        first: "JellyGames"
                    }
                },
                task: [ ],
                projectName: "JellyGames",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Head 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 257687.68
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 64421.92
                        }
                    ],
                    projectTeam: [
                        "56dea2329d71d14005fa0945",
                        "56f8f6aa0bbb61c30355b4e4",
                        "564cfd8ba6e6390160c9ef7b",
                        "564cfd8ba6e6390160c9eebe",
                        "56d980f4f2518c61059eff29",
                        "564cfd8ba6e6390160c9ee89"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-02-02T12:27:34.710Z",
                        _id: "5707533ecbb17f48214c76a2",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000671",
                EndDate: "2016-02-02T22:00:00.000Z",
                StartDate: "2015-04-13T21:00:00.000Z",
                ID: 1094,
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-11T14:27:27.809Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.303Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000031",
                    name: {
                        last: "Gleba",
                        first: "Alex"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000630",
                    name: {
                        last: "",
                        first: "PPT Group"
                    }
                },
                task: [ ],
                projectName: "Kari",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "5661bfb4f13e46fd14533b05",
                        "564cfdd06584412e618421dd",
                        "564cfd8ba6e6390160c9ef80"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-04-14T12:27:34.850Z",
                        _id: "5707533ecbb17f48214c76ae",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006cf",
                EndDate: "2016-04-05T21:00:00.000Z",
                StartDate: "2015-04-22T21:00:00.000Z",
                ID: 1104,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f00060b",
                        employeeId: "55b92ad221e4b7c40f0000a0",
                        _id: "56e660dd5ec71b0042974580",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000602",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56e660dd5ec71b004297457f",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f00060a",
                        employeeId: "55b92ad221e4b7c40f0000a0",
                        _id: "56e660dd5ec71b004297457e",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f0000a2",
                        _id: "56e660dd5ec71b004297457d",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T06:57:33.509Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.415Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f0000a2",
                    name: {
                        last: "Stan",
                        first: "Igor"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00065b",
                    name: {
                        last: "",
                        first: "Kogan.com"
                    }
                },
                task: [ ],
                projectName: "Kogan Apps",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "PM Base/Junior",
                            resource: "Ivan Bilak",
                            bonus: null
                        },
                        {
                            percentage: "Sales/Head 8%",
                            resource: "Oleg Ostroverkh",
                            bonus: 296578.32
                        },
                        {
                            percentage: "PM Junior/Usual 1.5%",
                            resource: "Ivan Bilak",
                            bonus: 55608.435
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Igor Stan",
                            bonus: 74144.58
                        }
                    ],
                    projectTeam: [
                        "56f3944fff088d9a50148a9e",
                        "569e97c22208b3af4a5271bc",
                        "566882c618ee5c115c2ef9cf",
                        "569e94782208b3af4a5271ab",
                        "564cfd8ba6e6390160c9eef7",
                        "564cfd8ba6e6390160c9ef26",
                        "566882d018ee5c115c2ef9d0",
                        "566882e318ee5c115c2ef9d2",
                        "564cfd8ba6e6390160c9ef5f",
                        "56fb5cb6b50d351f04817c19",
                        "564cfd8ba6e6390160c9eeb1",
                        "564cfd8ba6e6390160c9ef28",
                        "56688ae218ee5c115c2efa03",
                        "569fa62162d172544baf0db3"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-04-23T12:27:34.181Z",
                        _id: "5707533ecbb17f48214c76fc",
                        manager: "55b92ad221e4b7c40f0000a2"
                    }
                ]
            },
            {
                _id: "55cf4fc74a91e37b0b000103",
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T13:44:13.562Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2015-08-15T14:42:15.958Z",
                    user: "55cb7302fea413b50b000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55cf4f834a91e37b0b000102",
                    name: {
                        first: "SharperBuilds",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "Legal Application",
                projectShortDesc: "Web App for Lawyers",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "5662e8cef13e46fd14535519",
                        "5661dc6225e5eb511510b911",
                        "5660ac45451208de258010cd",
                        "5660ac26451208de258010cc",
                        "5660ac10451208de258010cb"
                    ]
                },
                TargetEndDate: "",
                EndDate: "2016-02-25T22:00:00.000Z",
                StartDate: "2015-08-02T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-08-03T12:27:34.315Z",
                        _id: "5707533ecbb17f48214c7709",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "568cea4977b14bf41bf2c32c",
                TargetEndDate: "2016-05-31T22:00:00.000Z",
                StartDate: "2016-01-31T22:00:00.000Z",
                description: "It is a Local Connector",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "568ceac277b14bf41bf2c32d"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-01-06T10:23:16.787Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2016-01-06T10:19:53.181Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00062d",
                    name: {
                        last: "",
                        first: "Andreas Rabenseifner"
                    }
                },
                task: [ ],
                projectName: "LocalCollector",
                projectShortDesc: "it is a local collector",
                __v: 0,
                EndDate: "2016-03-24T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-02-01T12:27:34.802Z",
                        _id: "5707533ecbb17f48214c7718",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "563b95acab9698be7c9df727",
                StartDate: "2015-11-08T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "5703b19453db5c9d03fc9ec5",
                        "5664cdd808ed794128637d1d",
                        "5664cde008ed794128637d1e",
                        "5664cde808ed794128637d1f"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-11T13:48:04.773Z",
                    user: "56c44e38b81fd51e19207f40"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2015-11-05T17:45:16.300Z",
                    user: "55cb7302fea413b50b000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "5637a8e2bf9592df04c55115",
                    name: {
                        last: "",
                        first: "Colestreet"
                    }
                },
                task: [ ],
                projectName: "LoginChineseTrue",
                projectShortDesc: "Chinese language learning tool",
                __v: 0,
                EndDate: "2015-12-27T22:00:00.000Z",
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-11-02T12:27:34.150Z",
                        _id: "5707533ecbb17f48214c772e",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006b3",
                EndDate: "2015-11-19T22:00:00.000Z",
                StartDate: "2014-12-01T22:00:00.000Z",
                ID: 64,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5702e8d269c37d5903700b42",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000602",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5702e8d269c37d5903700b41",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f00060b",
                        employeeId: "55b92ad221e4b7c40f0000a0",
                        _id: "5702e8d269c37d5903700b40",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f00060a",
                        employeeId: "55b92ad221e4b7c40f0000a0",
                        _id: "5702e8d269c37d5903700b3f",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-04-04T22:21:06.418Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.341Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: {
                        first: "Buzinga",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "Loyalty",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 72930.08000000002
                        },
                        {
                            percentage: "Sales/Head 8%",
                            resource: "Oleg Ostroverkh",
                            bonus: 291720.32000000007
                        },
                        {
                            percentage: "PM Base/Junior",
                            resource: "Ivan Bilak",
                            bonus: null
                        },
                        {
                            percentage: "PM Junior/Usual 1.5%",
                            resource: "Ivan Bilak",
                            bonus: 54697.56000000002
                        }
                    ],
                    projectTeam: [
                        "564cfd8ba6e6390160c9eec7",
                        "564cfd8ba6e6390160c9ef27",
                        "564cfd8ba6e6390160c9ee93",
                        "564cfd8ba6e6390160c9ee72",
                        "564cfd8ba6e6390160c9ee50",
                        "564cfd8ba6e6390160c9ee4d"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-12-02T12:27:34.423Z",
                        _id: "5707533ecbb17f48214c76e7",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006d4",
                EndDate: "2016-04-07T21:00:00.000Z",
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
                workflow: {
                    _id: "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad621e4b7c40f00063c",
                    name: {
                        last: "",
                        first: "DigiPresents"
                    }
                },
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
                        "56f394b8f5b5bf6750f5916d",
                        "564cfd8ba6e6390160c9ef7d",
                        "56e67274ef05acd9418dff20",
                        "564cfdd06584412e618421bb",
                        "56fb938ab50d351f04817c1b"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-06-01T12:27:34.633Z",
                        _id: "5707533ecbb17f48214c7700",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000690",
                EndDate: "2015-11-29T22:00:00.000Z",
                StartDate: "2014-11-25T22:00:00.000Z",
                ID: 48,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56586082bfd103f108eb4b79",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "56586082bfd103f108eb4b78",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2015-11-27T13:54:10.536Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.322Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7e3f3f67bc40b000022",
                    name: "Pending"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad621e4b7c40f000634",
                    name: {
                        last: "",
                        first: "Max"
                    }
                },
                task: [ ],
                projectName: "Max",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 61138.040000000015
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 244552.16000000006
                        }
                    ],
                    projectTeam: [
                        "564cfd8ba6e6390160c9eded",
                        "564cfd8ba6e6390160c9ef8a",
                        "564cfd8ba6e6390160c9eef8",
                        "564cfd8ba6e6390160c9ef5a",
                        "564cfd8ba6e6390160c9eeaa",
                        "564cfdd06584412e618421e0",
                        "564cfd8ba6e6390160c9ee81",
                        "564cfd8ba6e6390160c9ee56",
                        "564cfd8ba6e6390160c9ede8"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-11-26T12:27:34.760Z",
                        _id: "5707533ecbb17f48214c76ca",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006d7",
                EndDate: "2015-09-23T21:00:00.000Z",
                StartDate: "2015-07-20T21:00:00.000Z",
                ID: 3115,
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2015-12-14T08:10:16.722Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.418Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f00061c",
                    name: {
                        last: "",
                        first: "Genexies"
                    }
                },
                task: [ ],
                projectName: "Mesa Ave",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "5661c731f13e46fd14533f13",
                        "564cfd8ba6e6390160c9ef4c"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-07-21T12:27:34.879Z",
                        _id: "5707533ecbb17f48214c7703",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "55cf36d54a91e37b0b0000c2",
                TargetEndDate: "2015-09-13T00:00:00.000Z",
                StartDate: "2015-08-09T21:00:00.000Z",
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T09:43:50.783Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "android",
                createdBy: {
                    date: "2015-08-15T12:55:49.409Z",
                    user: "55cb7302fea413b50b000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55cf362b4a91e37b0b0000c1",
                    name: {
                        first: "MobStar",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "Mobstar",
                projectShortDesc: "Project for Android and iOS, Bac",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "57020f0d69c37d5903700b28",
                        "56dff02c425d4276052c23d3",
                        "569eae052208b3af4a527211",
                        "569eacaf2208b3af4a5271f7",
                        "5668a0bc65bcfefe46fb45e2",
                        "5662dd0df13e46fd14535270",
                        "5662bcedf13e46fd14534e21",
                        "564cfdd06584412e618421d4",
                        "5662cbb1f13e46fd14534fa3",
                        "564cfd8ba6e6390160c9ef5d"
                    ]
                },
                EndDate: "2016-04-28T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-08-10T12:27:34.459Z",
                        _id: "5707533ecbb17f48214c7708",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006bb",
                EndDate: "2015-12-17T22:00:00.000Z",
                StartDate: "2015-03-18T22:00:00.000Z",
                ID: 86,
                bonus: [
                    {
                        employeeId: "55b92ad221e4b7c40f00004b",
                        bonusId: "55b92ad521e4b7c40f000608",
                        startDate: "2015-02-22T00:00:00.000Z",
                        endDate: "2015-03-22T00:00:00.000Z",
                        _id: "55b92ae521e4b7c40f00158a"
                    },
                    {
                        employeeId: "55b92ad221e4b7c40f00004a",
                        bonusId: "55b92ad521e4b7c40f000604",
                        startDate: "2015-02-22T00:00:00.000Z",
                        endDate: "2015-03-22T00:00:00.000Z",
                        _id: "55b92ae521e4b7c40f00158b"
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-02-09T10:06:27.516Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.344Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f000615",
                    name: {
                        last: "",
                        first: "TechJoiner"
                    }
                },
                task: [ ],
                projectName: "MorfitRun",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    projectTeam: [
                        "56b9ba23fae0cea53a5817dd",
                        "564cfd8ba6e6390160c9ef4a",
                        "564cfdd06584412e618421b0",
                        "564cfd8ba6e6390160c9eea1"
                    ],
                    bonus: [
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Roland Katona",
                            bonus: 59727.76000000001
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 14931.940000000002
                        }
                    ]
                },
                salesManagers: [
                    {
                        date: "2015-03-12T12:27:34.799Z",
                        _id: "5707533ecbb17f48214c7747",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006a6",
                EndDate: "2014-11-27T22:00:00.000Z",
                StartDate: "2014-10-12T21:00:00.000Z",
                ID: 31,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "568ce4fa77b14bf41bf2c327",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00004b",
                        _id: "568ce4fa77b14bf41bf2c326",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-01-06T09:57:14.947Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.335Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce80ef3f67bc40b000024",
                    name: "Cancelled"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000653",
                    name: {
                        last: "",
                        first: "Peter B."
                    }
                },
                task: [ ],
                projectName: "Moriser",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 15564.000000000002
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Roland Katona",
                            bonus: 62256.00000000001
                        }
                    ],
                    projectTeam: [
                        "564cfd8ba6e6390160c9ee3a",
                        "564cfd8ba6e6390160c9ee1a"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-10-13T12:27:34.918Z",
                        _id: "5707533ecbb17f48214c7737",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "56304d56547f50b51d6de2bb",
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 7999.98
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 31999.92
                        }
                    ],
                    projectTeam: [
                        "57037fd5ec814f7c039b8079",
                        "564cfdd06584412e618421d8",
                        "56a9fe9bb4dc0d09232bd76d",
                        "56a8d560aa157ca50f21fb35",
                        "5703c5a1e7050b54043a69c8"
                    ]
                },
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "566a99114f817b7f51746eb5",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "566a99114f817b7f51746eb4",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-10T09:06:29.920Z",
                    user: "56239f14e9576d1728a9ed23"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "android",
                createdBy: {
                    date: "2015-10-28T04:21:42.372Z",
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad621e4b7c40f000636",
                    name: {
                        last: "",
                        first: "Constantine"
                    }
                },
                task: [ ],
                projectName: "Move for Less",
                projectShortDesc: "logistic company app",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2016-10-13T21:00:00.000Z",
                StartDate: "2015-10-11T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-10-12T12:27:34.774Z",
                        _id: "5707533ecbb17f48214c773f",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
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
                workflow: {
                    _id: "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f0000cb",
                    name: {
                        last: "Yelahina",
                        first: "Alona"
                    }
                },
                customer: {
                    _id: "562bc2db62461bfd59ef58c7",
                    name: {
                        last: "",
                        first: "AppMedia"
                    }
                },
                task: [ ],
                projectName: "MyDrive",
                projectShortDesc: "App For Santander Bank Employees",
                __v: 0,
                EndDate: "2016-03-30T21:00:00.000Z",
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-12-28T12:27:34.125Z",
                        _id: "5707533ecbb17f48214c774b",
                        manager: "55b92ad221e4b7c40f0000cb"
                    }
                ]
            },
            {
                _id: "569ced3fea21e2ac7d729e18",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56ab858e74d57e0d56d6be13",
                        "569f861062d172544baf0d64"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-08T14:17:05.176Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "android",
                createdBy: {
                    date: "2016-01-18T13:48:47.256Z",
                    user: "563f673270bbc2b740ce89ae"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: {
                        last: "",
                        first: "Foxtrapp"
                    }
                },
                task: [ ],
                projectName: "MySmallCommunity",
                projectShortDesc: "haha",
                __v: 0,
                EndDate: "2015-12-31T22:00:00.000Z",
                StartDate: "2015-01-11T22:00:00.000Z",
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-01-05T12:27:34.238Z",
                        _id: "5707533ecbb17f48214c7739",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "56e001b7622d25002676ffd3",
                TargetEndDate: "2016-03-22T00:00:00.000Z",
                StartDate: "2016-02-14T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56e02e3672f1b8351fa184ec"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 2,
                editedBy: {
                    date: "2016-03-09T10:57:59.112Z",
                    user: "56dfef269100b25c05819305"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-03-09T10:57:59.112Z",
                    user: "56dfef269100b25c05819305"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f0000bb",
                    name: {
                        last: "Shepinka",
                        first: "Igor"
                    }
                },
                customer: {
                    _id: "56dffe038594da632689f1ca",
                    name: {
                        last: "",
                        first: "Takumi Networks"
                    }
                },
                task: [ ],
                projectName: "Nexture site",
                projectShortDesc: "Corporate site for Nexture",
                __v: 0,
                EndDate: "2016-04-04T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-02-15T12:27:34.156Z",
                        _id: "5707533ecbb17f48214c7752",
                        manager: "55b92ad221e4b7c40f0000bb"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f00066b",
                EndDate: "2016-03-17T22:00:00.000Z",
                StartDate: "2014-11-23T22:00:00.000Z",
                ID: 62,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000602",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "570220cac3a5da3e0347a44e",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "570220cac3a5da3e0347a44d",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-04-04T08:09:21.164Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.299Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad621e4b7c40f000657",
                    name: {
                        last: "",
                        first: "Nikky"
                    }
                },
                task: [ ],
                projectName: "Nikky",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Head 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 50636.64000000001
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 12659.160000000002
                        }
                    ],
                    projectTeam: [
                        "56dfe7495db22bf954ad1fcf",
                        "56afc208f5c2bcd4555cb2cf",
                        "564cfd8ba6e6390160c9ee75",
                        "57022131c3a5da3e0347a44f",
                        "564cfd8ba6e6390160c9ef01",
                        "564cfd8ba6e6390160c9eeb5",
                        "564cfd8ba6e6390160c9edfd"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-11-24T12:27:34.385Z",
                        _id: "5707533ecbb17f48214c76a8",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000684",
                EndDate: "2016-03-31T21:00:00.000Z",
                StartDate: "2015-03-22T22:00:00.000Z",
                ID: 1092,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56c711610769bba2647ae70f",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "56c711610769bba2647ae70e",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T08:05:59.421Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.313Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad621e4b7c40f000638",
                    name: {
                        last: "",
                        first: "Unibet"
                    }
                },
                task: [ ],
                projectName: "OnSite Unibet",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 78646.08
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 314584.32
                        }
                    ],
                    projectTeam: [
                        "56e670e7dd81ed4e426c60ab",
                        "56654aad9294f4d728bcb368",
                        "564cfd8ba6e6390160c9ee60",
                        "564cfd8ba6e6390160c9ee99",
                        "56654ebc9294f4d728bcbbab",
                        "564cfd8ba6e6390160c9ef1b",
                        "566573d99294f4d728bcc774",
                        "568a47fe3cce9254776f2b3d",
                        "56654e0d9294f4d728bcb531",
                        "56654d389294f4d728bcb438",
                        "56e6708668e298b241985648",
                        "56654e6d9294f4d728bcb5a7"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-03-16T12:27:34.399Z",
                        _id: "5707533ecbb17f48214c76c0",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "56618227bb8be7814fb526e5",
                TargetEndDate: "2016-03-31T22:00:00.000Z",
                StartDate: "2015-01-04T22:00:00.000Z",
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 16326.140000000003
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 65304.56000000001
                        }
                    ],
                    projectTeam: [
                        "566571af9294f4d728bcc608",
                        "5661836b90eeef5c677013b8",
                        "568a30223cce9254776f2b17",
                        "5666e1c0a3fc012a68f0d5cd"
                    ]
                },
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "566983b813f7238847185385",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "566983b813f7238847185384",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2015-12-10T13:52:56.052Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2015-12-04T12:08:07.718Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "55b9fc0fd79a3a3439000008"
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
                    _id: "5661805cbb8be7814fb52529",
                    name: {
                        last: "",
                        first: "Otrema"
                    }
                },
                task: [ ],
                projectName: "Otrema WP4",
                projectShortDesc: "PROBABLY THE BEST SMART RADIATOR",
                __v: 0,
                EndDate: "2016-04-07T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-01-05T12:27:34.577Z",
                        _id: "5707533ecbb17f48214c7730",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "56422bfc70bbc2b740ce89f3",
                StartDate: "2015-11-22T22:00:00.000Z",
                description: "Video app",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "566c2c298453e8b464b70899",
                        "569ce572ea21e2ac7d729e0d",
                        "564cfdd06584412e618421e5"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2015-12-12T14:22:30.368Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2015-11-10T17:40:12.028Z",
                    user: "55cb7302fea413b50b000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55f56406b81672730c00002e",
                    name: {
                        last: "",
                        first: "App Institute"
                    }
                },
                task: [ ],
                projectName: "PREEME",
                projectShortDesc: "Video app",
                __v: 0,
                EndDate: "2015-01-13T22:00:00.000Z",
                TargetEndDate: "",
                salesManagers: [
                    {
                        date: "2015-11-16T12:27:34.484Z",
                        _id: "5707533ecbb17f48214c7738",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000667",
                EndDate: "2015-11-19T22:00:00.000Z",
                StartDate: "2014-11-02T22:00:00.000Z",
                ID: 42,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000602",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "566ae1f4a74aaf316eaea737",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "566ae1f4a74aaf316eaea736",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f00060b",
                        employeeId: "55b92ad221e4b7c40f0000a0",
                        _id: "566ae1f4a74aaf316eaea735",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f00060a",
                        employeeId: "55b92ad221e4b7c40f0000a0",
                        _id: "566ae1f4a74aaf316eaea734",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T13:36:53.915Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.297Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: {
                        first: "Buzinga",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "PT2",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Head 8%",
                            resource: "Oleg Ostroverkh",
                            bonus: 207048.24
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 51762.06
                        },
                        {
                            percentage: "PM Base/Junior",
                            resource: "Ivan Bilak",
                            bonus: 50348.29192546584
                        },
                        {
                            percentage: "PM Junior/Usual 1.5%",
                            resource: "Ivan Bilak",
                            bonus: 38821.545
                        }
                    ],
                    projectTeam: [
                        "56e6be7549e358ee4d713987",
                        "564cfd8ba6e6390160c9ee45",
                        "564cfdd06584412e618421d7",
                        "564cfd8ba6e6390160c9ef5c",
                        "564cfd8ba6e6390160c9eee4",
                        "564cfd8ba6e6390160c9eeda"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-11-03T12:27:34.536Z",
                        _id: "5707533ecbb17f48214c76a4",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "561d1c3db51032d674856acc",
                StartDate: "2015-09-30T21:00:00.000Z",
                description: "Pay less MVP",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "565d6148f6427f253cf6be33",
                        "564cfdd06584412e618421a3"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2015-12-14T15:03:31.566Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "android",
                createdBy: {
                    date: "2015-10-13T14:59:09.205Z",
                    user: "55b9dd237a3632120b000005"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55b9dd237a3632120b000005"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "561d1bc0b51032d674856acb",
                    name: {
                        last: "",
                        first: "Attrecto"
                    }
                },
                task: [ ],
                projectName: "PayFever",
                projectShortDesc: "Pay less",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2015-12-03T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-10-01T12:27:34.907Z",
                        _id: "5707533ecbb17f48214c7725",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "56dea0a5c235df7c05aa635c",
                TargetEndDate: "2016-05-30T22:00:00.000Z",
                StartDate: "2016-03-06T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56dea2bec235df7c05aa635d",
                        "56dea1019d71d14005fa0934"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-08T10:00:30.217Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "android",
                createdBy: {
                    date: "2016-03-08T09:51:33.389Z",
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
                    users: [ ],
                    group: [ ]
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
                    _id: "55b92ad621e4b7c40f000658",
                    name: {
                        last: "",
                        first: "JellyGames"
                    }
                },
                task: [ ],
                projectName: "PhotoShop app",
                projectShortDesc: "Photo marketplace",
                __v: 0,
                EndDate: "2016-04-28T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-03-07T12:27:34.704Z",
                        _id: "5707533ecbb17f48214c774d",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006d9",
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2015-08-05T21:00:00.000Z",
                ID: 3116,
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2015-12-14T08:08:55.392Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.418Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00062d",
                    name: {
                        last: "",
                        first: "Andreas Rabenseifner"
                    }
                },
                task: [ ],
                projectName: "Pilot",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56f8e492c3a5da3e0347a419",
                        "56f8e46aec814f7c039b8029",
                        "5661a5ce7d284423697e345a",
                        "564cfd8ba6e6390160c9ef8f",
                        "5661a5f97d284423697e3466",
                        "564cfdd06584412e618421a5",
                        "56af4a2774d57e0d56d6bee6",
                        "568d205ff48a06a15490c633",
                        "564cfd8ba6e6390160c9ef4e"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-08-06T12:27:34.902Z",
                        _id: "5707533ecbb17f48214c7705",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "56ab958e74d57e0d56d6be3b",
                budget: {
                    projectTeam: [
                        "56ab96ab74d57e0d56d6be3c"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-01-29T16:38:38.217Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-01-29T16:38:38.217Z",
                    user: "563f673270bbc2b740ce89ae"
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
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: {
                        last: "",
                        first: "Foxtrapp"
                    }
                },
                task: [ ],
                projectName: "Planogram",
                projectShortDesc: "Project for PandG",
                __v: 0,
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2015-01-01T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-01-08T12:27:34.165Z",
                        _id: "5707533ecbb17f48214c7744",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f00067f",
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2014-11-30T22:00:00.000Z",
                ID: 65,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000602",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5662e05bf13e46fd145353e1",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5662e05bf13e46fd145353e0",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2015-12-05T13:02:19.389Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.310Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000624",
                    name: {
                        last: "",
                        first: "Giroptic"
                    }
                },
                task: [ ],
                projectName: "Player iOS/And",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Head 8%",
                            resource: "Oleg Ostroverkh",
                            bonus: 371183.5200000001
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 92795.88000000002
                        }
                    ],
                    projectTeam: [
                        "56e031ba155b964b1e9c47eb",
                        "569e97072208b3af4a5271b0",
                        "57038b03e7050b54043a69aa",
                        "5661fba825e5eb511510bbcc",
                        "5661f30d25e5eb511510bae3",
                        "5661f62225e5eb511510bb41",
                        "5661ed5425e5eb511510ba66",
                        "5661f7fa25e5eb511510bb6e",
                        "564cfd8ba6e6390160c9ee29"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-12-01T12:27:34.436Z",
                        _id: "5707533ecbb17f48214c76bb",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "56e2924a1f2850d361927dd1",
                TargetEndDate: "2016-05-01T00:00:00.000Z",
                StartDate: "2016-02-29T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56e29ad7f9e1c56461b971d4",
                        "56e6ea38c64e96844ef3d693",
                        "56e6ea06d4cfab3c4eae597b"
                    ],
                    bonus: [
                        {
                            percentage: "Sales/Head 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 119999.92000000001
                        }
                    ]
                },
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000602",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "56e292d4f9e1c56461b971d3",
                        endDate: null,
                        startDate: "2016-03-07T00:00:00.000Z"
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T16:43:36.398Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "android",
                createdBy: {
                    date: "2016-03-11T09:39:22.317Z",
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad621e4b7c40f00063c",
                    name: {
                        last: "",
                        first: "DigiPresents"
                    }
                },
                task: [ ],
                projectName: "Poems app",
                projectShortDesc: "Reading app",
                __v: 0,
                EndDate: "2016-06-06T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2016-03-01T12:27:34.591Z",
                        _id: "5707533ecbb17f48214c7755",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000694",
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2014-12-01T22:00:00.000Z",
                ID: 68,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "565b0d00b4c12a54076f7b02",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000606",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "565b0d00b4c12a54076f7b01",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "565b0d00b4c12a54076f7b00",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2015-11-29T14:34:40.602Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.324Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00064f",
                    name: {
                        first: "Kenlo Group Ltd",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "QA iOS Purple Ocean",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 11327.98
                        },
                        {
                            percentage: "Sales/QA 14%",
                            resource: "Yana Gusti",
                            bonus: 79295.85999999999
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Peter Voloshchuk",
                            bonus: 11327.98
                        }
                    ],
                    projectTeam: [
                        "5702183369c37d5903700b2b",
                        "564cfdd06584412e618421af",
                        "56fbc5e0a33b73e503e3eb61",
                        "565b09ad28a458de13b2a107",
                        "564cfd8ba6e6390160c9eed0",
                        "564cfd8ba6e6390160c9ee86",
                        "564cfd8ba6e6390160c9ee0b",
                        "564cfd8ba6e6390160c9ee7b",
                        "564cfd8ba6e6390160c9ef37",
                        "564cfd8ba6e6390160c9ee52"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-12-02T12:27:35.112Z",
                        _id: "5707533ecbb17f48214c76ce",
                        manager: "55b92ad221e4b7c40f000063"
                    }
                ]
            },
            {
                _id: "55cb770bfea413b50b000008",
                TargetEndDate: "2016-01-16T00:00:00.000Z",
                StartDate: "2015-08-16T21:00:00.000Z",
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2015-08-12T16:40:43.436Z",
                    user: "55cb7302fea413b50b000007"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2015-08-12T16:40:43.436Z",
                    user: "55cb7302fea413b50b000007"
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
                    owner: "55ba28c8d79a3a3439000016",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: {
                        last: "",
                        first: "Foxtrapp"
                    }
                },
                task: [ ],
                projectName: "QualPro",
                projectShortDesc: "ERP system",
                __v: 0,
                budget: {
                    projectTeam: [
                        "56f39527e7c600fe4fbae596",
                        "56e1b610177f76f72edf775c",
                        "569eaa9b2208b3af4a5271d8",
                        "569eab1b2208b3af4a5271e8",
                        "564cfd8ba6e6390160c9ef64"
                    ],
                    bonus: [ ]
                },
                EndDate: "2016-04-07T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-08-17T12:27:34.310Z",
                        _id: "5707533ecbb17f48214c7706",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "56c431dda2cb3024468a04ee",
                TargetEndDate: "2016-02-28T23:00:00.000Z",
                StartDate: "2016-02-08T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56c431fda2cb3024468a04ef"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-02-17T08:39:57.588Z",
                    user: "56a72cafaa157ca50f21fb22"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: ".net",
                createdBy: {
                    date: "2016-02-17T08:39:57.588Z",
                    user: "56a72cafaa157ca50f21fb22"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: {
                        last: "",
                        first: "Foxtrapp"
                    }
                },
                task: [ ],
                projectName: "Raffle Draw",
                projectShortDesc: "Random lottery",
                __v: 0,
                EndDate: "2016-03-13T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-02-09T12:27:34.264Z",
                        _id: "5707533ecbb17f48214c774a",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006d1",
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2015-06-23T21:00:00.000Z",
                ID: 2098,
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-04T13:59:18.932Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.415Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00064a",
                    name: {
                        last: "",
                        first: "Carussel"
                    }
                },
                task: [ ],
                projectName: "Sales Tool",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "5704d53969c37d5903700b91",
                        "564cfd8ba6e6390160c9ef87"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-06-24T12:27:34.872Z",
                        _id: "5707533ecbb17f48214c76fd",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "566d4bc3abccac87642cb523",
                TargetEndDate: "2015-12-31T00:00:00.000Z",
                StartDate: "2015-11-08T22:00:00.000Z",
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 19502.74
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 78010.96
                        }
                    ],
                    projectTeam: [
                        "56dff7d17e20c5df25a36bbe",
                        "566d4cf1abccac87642cb531",
                        "56aa427eb4dc0d09232bd7b1",
                        "56f8e3bc69c37d5903700b07",
                        "568a2b593cce9254776f2b0e",
                        "5703be15e7050b54043a69c4",
                        "566d4c33abccac87642cb52a",
                        "570369d9e7050b54043a699c"
                    ]
                },
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "56e6e63549e358ee4d71398c",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "56e6e63549e358ee4d71398b",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T16:26:29.883Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2015-12-13T10:43:15.177Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "566d4b35abccac87642cb521",
                    name: {
                        last: "",
                        first: "Scatch"
                    }
                },
                task: [ ],
                projectName: "Scatch",
                projectShortDesc: "Coupon app",
                __v: 0,
                EndDate: "2016-04-06T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-11-02T12:27:34.562Z",
                        _id: "5707533ecbb17f48214c7735",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000668",
                EndDate: "2015-10-22T21:00:00.000Z",
                StartDate: "2014-11-23T22:00:00.000Z",
                ID: 47,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000605",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "5660283fccc590f32c575442",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5660283fccc590f32c575441",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 2,
                editedBy: {
                    date: "2016-03-16T12:28:57.173Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.297Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7e3f3f67bc40b000022",
                    name: "Pending"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000623",
                    name: {
                        last: "",
                        first: "Vladi"
                    }
                },
                task: [ ],
                projectName: "Selenium IDE",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/QA 16%",
                            resource: "Yana Gusti",
                            bonus: 35792
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 4474
                        }
                    ],
                    projectTeam: [
                        "564cfd8ba6e6390160c9edf8",
                        "564cfd8ba6e6390160c9eeb6",
                        "564cfdd06584412e618421c7",
                        "564cfd8ba6e6390160c9ee5a",
                        "564cfd8ba6e6390160c9eec9",
                        "564cfd8ba6e6390160c9ee80",
                        "564cfd8ba6e6390160c9eecf",
                        "564cfd8ba6e6390160c9ef49",
                        "564cfd8ba6e6390160c9ee0d",
                        "564cfd8ba6e6390160c9ef13",
                        "564cfd8ba6e6390160c9ef86"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-11-24T12:27:35.020Z",
                        _id: "5707533ecbb17f48214c76a5",
                        manager: "55b92ad221e4b7c40f000063"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000686",
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2015-06-07T21:00:00.000Z",
                ID: 1102,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "56fcdd4853db5c9d03fc9e82",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-31T08:18:16.522Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.314Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad621e4b7c40f00064b",
                    name: {
                        last: "",
                        first: "Thomas"
                    }
                },
                task: [ ],
                projectName: "Sensei",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 0
                        }
                    ],
                    projectTeam: [
                        "56b8b958d54899a905ae0273",
                        "57021752ed3f15af0782f13b",
                        "564cfdd06584412e618421de"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-06-08T12:27:34.746Z",
                        _id: "5707533ecbb17f48214c775c",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "56ab891074d57e0d56d6be1f",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56e01609a12a4f3c26919c9d",
                        "56ab8a2074d57e0d56d6be20"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-09T12:25:01.259Z",
                    user: "56ddac991e6cb7131892b2be"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-01-29T15:45:20.856Z",
                    user: "563f673270bbc2b740ce89ae"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00063b",
                    name: {
                        last: "",
                        first: "Foxtrapp"
                    }
                },
                task: [ ],
                projectName: "Serial Box",
                projectShortDesc: "ror project",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2016-04-07T21:00:00.000Z",
                StartDate: "2015-12-28T22:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-12-29T12:27:34.280Z",
                        _id: "5707533ecbb17f48214c7743",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f00067d",
                EndDate: "2016-03-06T22:00:00.000Z",
                StartDate: "2014-11-18T22:00:00.000Z",
                ID: 55,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5660143e6226e3c43108deee",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000605",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "5660143e6226e3c43108deed",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T08:16:17.180Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.309Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000646",
                    name: {
                        last: "",
                        first: "EtienneL"
                    }
                },
                task: [ ],
                projectName: "Sharalike",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 13229.98
                        },
                        {
                            percentage: "Sales/QA 16%",
                            resource: "Yana Gusti",
                            bonus: 105839.84
                        }
                    ],
                    projectTeam: [
                        "56e6730668e298b24198564c",
                        "564cfd8ba6e6390160c9eeed",
                        "565b1560b4c12a54076f7b56",
                        "569367a6d87c9004552b6389",
                        "564cfd8ba6e6390160c9eeba",
                        "564cfd8ba6e6390160c9eea9",
                        "564cfd8ba6e6390160c9ef20",
                        "564cfd8ba6e6390160c9eef0",
                        "56e673143d5bc25541857e1a",
                        "564cfd8ba6e6390160c9eea6",
                        "564cfd8ba6e6390160c9ef0a",
                        "564cfd8ba6e6390160c9eea2",
                        "564cfd8ba6e6390160c9ef39",
                        "564cfd8ba6e6390160c9eee7",
                        "5660526932c0bfa96aea752d",
                        "564cfd8ba6e6390160c9ee95",
                        "564cfd8ba6e6390160c9ee44",
                        "564cfd8ba6e6390160c9ee91",
                        "564cfdd06584412e6184219a",
                        "564cfd8ba6e6390160c9ee79",
                        "564cfd8ba6e6390160c9ede0",
                        "564cfd8ba6e6390160c9ee73",
                        "564cfd8ba6e6390160c9ee06",
                        "564cfd8ba6e6390160c9ee4a",
                        "564cfd8ba6e6390160c9ee31",
                        "564cfd8ba6e6390160c9ee5d",
                        "564cfd8ba6e6390160c9ef7a",
                        "564cfd8ba6e6390160c9ee04",
                        "564cfd8ba6e6390160c9ee46",
                        "564cfd8ba6e6390160c9ef52",
                        "564cfd8ba6e6390160c9ee92",
                        "564cfd8ba6e6390160c9ef04",
                        "564cfd8ba6e6390160c9ef48",
                        "564cfd8ba6e6390160c9ef0e",
                        "564cfd8ba6e6390160c9ef21",
                        "564cfd8ba6e6390160c9ee8a",
                        "564cfd8ba6e6390160c9ef16",
                        "564cfd8ba6e6390160c9ef43",
                        "564cfd8ba6e6390160c9ef6c",
                        "564cfd8ba6e6390160c9eed9",
                        "564cfd8ba6e6390160c9ef84",
                        "56ab4db46d7173f43f96ad45",
                        "564cfd8ba6e6390160c9ef85",
                        "5693670dd87c9004552b6387",
                        "566e84998453e8b464b709d5",
                        "569ca8f6cf1f31f925c026d5",
                        "569ca8fecf1f31f925c026d6",
                        "56604f4632c0bfa96aea6ed3",
                        "569cabc7cf1f31f925c026e1",
                        "56ab4d896d7173f43f96ad43"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-11-19T12:27:34.958Z",
                        _id: "5707533ecbb17f48214c76b8",
                        manager: "55b92ad221e4b7c40f000063"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006ca",
                EndDate: "2015-01-13T22:00:00.000Z",
                StartDate: "2015-07-12T21:00:00.000Z",
                ID: 3111,
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-11T10:00:29.434Z",
                    user: "56c44e38b81fd51e19207f40"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.407Z",
                    user: "52203e707d4dba8813000003"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00064e",
                    name: {
                        last: "",
                        first: "SetFile"
                    }
                },
                task: [ ],
                projectName: "SketchTechPoints",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "564cfdd06584412e618421bc",
                        "564cfd8ba6e6390160c9ef63",
                        "564cfd8ba6e6390160c9ef62"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-07-13T12:27:34.465Z",
                        _id: "5707533ecbb17f48214c76f8",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "56dff43eb07e2ad226b6893b",
                TargetEndDate: "2016-03-15T00:00:00.000Z",
                StartDate: "2016-02-21T22:00:00.000Z",
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Usual 6%",
                            resource: "Yana Dufynets",
                            bonus: 20400
                        }
                    ],
                    projectTeam: [
                        "56e00c0a8594da632689f1ce"
                    ]
                },
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000603",
                        employeeId: "5602a01550de7f4138000008",
                        _id: "56f91f9dc3a5da3e0347a423",
                        endDate: "2016-03-25T00:00:00.000Z",
                        startDate: "2016-02-22T00:00:00.000Z"
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-28T12:12:13.409Z",
                    user: "56d70560805eb08d2b93d960"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-03-09T10:00:30.959Z",
                    user: "56a72b95aa157ca50f21fb21"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "5602a01550de7f4138000008",
                    name: {
                        last: "Dufynets",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "56dff2c6622d25002676ffcd",
                    name: {
                        last: "Tauman",
                        first: "Menachem"
                    }
                },
                task: [ ],
                projectName: "Smart360",
                projectShortDesc: "emptyProject",
                __v: 0,
                EndDate: "2016-04-05T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2016-02-22T12:27:34.943Z",
                        _id: "5707533ecbb17f48214c7750",
                        manager: "5602a01550de7f4138000008"
                    }
                ]
            },
            {
                _id: "562bba6e4a431b5a5a3111fe",
                StartDate: "2015-11-01T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56e1b802aeb5e8b52e89d190",
                        "56f39d42e7c600fe4fbae59a",
                        "569eb11e2208b3af4a52723b",
                        "56ab4d776d7173f43f96ad34",
                        "56641a4308ed794128637bd3",
                        "56641a6108ed794128637bd4",
                        "56641a3908ed794128637bd2"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T07:25:30.686Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-10-24T17:05:50.305Z",
                    user: "55cb7302fea413b50b000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000040",
                    name: {
                        last: "Almashiy",
                        first: "Vasiliy"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00062f",
                    name: {
                        last: "",
                        first: "Mark"
                    }
                },
                task: [ ],
                projectName: "Spark",
                projectShortDesc: "App inspired by Snapchat",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2016-04-14T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-10-26T12:27:34.937Z",
                        _id: "5707533ecbb17f48214c7728",
                        manager: "55b92ad221e4b7c40f000040"
                    }
                ]
            },
            {
                _id: "56e005f0f20b93842671670d",
                StartDate: "2016-02-07T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56e296543c074d636203bbd1"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 3,
                editedBy: {
                    date: "2016-03-11T09:56:36.729Z",
                    user: "56dfef269100b25c05819305"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-03-09T11:16:00.812Z",
                    user: "56dfef269100b25c05819305"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7e3f3f67bc40b000022",
                    name: "Pending"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f0000bb",
                    name: {
                        last: "Shepinka",
                        first: "Igor"
                    }
                },
                customer: {
                    _id: "56dffe038594da632689f1ca",
                    name: {
                        last: "",
                        first: "Takumi Networks"
                    }
                },
                task: [ ],
                projectName: "Spoon Comics",
                projectShortDesc: "Comics site",
                __v: 0,
                EndDate: "2016-03-03T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-02-08T12:27:34.121Z",
                        _id: "5707533ecbb17f48214c7754",
                        manager: "55b92ad221e4b7c40f0000bb"
                    }
                ]
            },
            {
                _id: "5605736c002c16436b000007",
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-04T18:09:48.277Z",
                    user: "56dda0599fb95fbe18e3f8ed"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-09-25T16:16:44.043Z",
                    user: "55cb7302fea413b50b000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "5604170eb904af832d000005",
                    name: {
                        last: "",
                        first: "Stentle"
                    }
                },
                task: [ ],
                projectName: "Stentle CSS",
                projectShortDesc: "short css project",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "5663fede08ed794128637b84",
                        "5663fed208ed794128637b83"
                    ]
                },
                EndDate: "2015-12-23T22:00:00.000Z",
                StartDate: "2015-09-27T21:00:00.000Z",
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-09-28T12:27:34.295Z",
                        _id: "5707533ecbb17f48214c7716",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "570b8fce9655379f334001c9",
                TargetEndDate: "2016-04-22T21:00:00.000Z",
                StartDate: "2016-04-06T21:00:00.000Z",
                budget: { },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-11T11:51:42.843Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2016-04-11T11:51:42.843Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "565f0fa6f6427f253cf6bf19",
                    name: {
                        last: "Lysachenko",
                        first: "Alex"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000637",
                    name: {
                        last: "",
                        first: "Airsoft Holdings "
                    }
                },
                task: [ ],
                projectName: "TEST1",
                projectShortDesc: "TEST1",
                __v: 0
            },
            {
                _id: "570b6a5df684d1240d484b6e",
                TargetEndDate: "2016-04-22T21:00:00.000Z",
                StartDate: "2016-04-06T21:00:00.000Z",
                budget: { },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-11T09:11:57.812Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2016-04-11T09:11:57.812Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000030",
                    name: {
                        first: "Alex",
                        last: "Svatuk"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000635",
                    name: {
                        last: "",
                        first: "Academiacs"
                    }
                },
                task: [ ],
                projectName: "Test",
                projectShortDesc: "Test",
                __v: 0
            },
            {
                _id: "56dff3458594da632689f1c7",
                budget: {
                    projectTeam: [
                        "56e86d29701f50ac4d0a4997"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-09T09:56:21.918Z",
                    user: "56dda0599fb95fbe18e3f8ed"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2016-03-09T09:56:21.918Z",
                    user: "56dda0599fb95fbe18e3f8ed"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004f",
                    name: {
                        last: "Sokhanych",
                        first: "Alex"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000643",
                    name: {
                        last: "",
                        first: "Angelica"
                    }
                },
                task: [ ],
                projectName: "ThinkMobiles Web",
                projectShortDesc: "ThinkMobiles Web",
                __v: 0,
                EndDate: "2016-04-03T21:00:00.000Z",
                StartDate: "2015-12-27T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-12-28T12:27:34.089Z",
                        _id: "5707533ecbb17f48214c774f",
                        manager: "55b92ad221e4b7c40f00004f"
                    }
                ]
            },
            {
                _id: "562beda846bca6e4591f4930",
                StartDate: "2015-10-18T21:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56e12c2b8af0cbf501828bec",
                        "56dfe82f5db22bf954ad1fd0",
                        "56e12f5c55a3e27b03061240",
                        "56dffb84b07e2ad226b6893c",
                        "56dff725a12a4f3c26919c96",
                        "56e12eb4d6b3628b02612e43",
                        "564cfdd06584412e6184219e",
                        "56aa209fb4dc0d09232bd7a3",
                        "56e12f39d40dde6a022319ad",
                        "56dffb3ca12a4f3c26919c97",
                        "566424e308ed794128637c24",
                        "566424cd08ed794128637c23",
                        "56dfe5de2a7718fe47355966"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T17:40:17.881Z",
                    user: "56239f14e9576d1728a9ed23"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "iOs",
                createdBy: {
                    date: "2015-10-24T20:44:24.279Z",
                    user: "55cb7302fea413b50b000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "562bed4062461bfd59ef58d1",
                    name: {
                        last: "",
                        first: "TreatMe"
                    }
                },
                task: [ ],
                projectName: "TreatMe",
                projectShortDesc: "Uber-like app",
                __v: 0,
                EndDate: "2016-03-10T22:00:00.000Z",
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-10-19T12:27:34.253Z",
                        _id: "5707533ecbb17f48214c7729",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006c0",
                EndDate: "2015-11-18T22:00:00.000Z",
                StartDate: "2015-04-26T21:00:00.000Z",
                ID: 1098,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004b",
                        _id: "566026c8ccc590f32c574a77",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000606",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "566026c8ccc590f32c574a76",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "566026c8ccc590f32c574a75",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 2,
                editedBy: {
                    date: "2016-03-16T12:30:24.977Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.346Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7e3f3f67bc40b000022",
                    name: "Pending"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f00063a",
                    name: {
                        last: "",
                        first: "TrumpMedia"
                    }
                },
                task: [ ],
                projectName: "TrumpT QA",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Roland Katona",
                            bonus: 3720.0000000000005
                        },
                        {
                            percentage: "Sales/QA 14%",
                            resource: "Yana Gusti",
                            bonus: 26040.000000000004
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 3720.0000000000005
                        }
                    ],
                    projectTeam: [
                        "564cfd8ba6e6390160c9eec2",
                        "564cfd8ba6e6390160c9eee5",
                        "564cfdd06584412e61842199",
                        "564cfd8ba6e6390160c9ef6d",
                        "564cfd8ba6e6390160c9ef10",
                        "564cfd8ba6e6390160c9eebf",
                        "564cfd8ba6e6390160c9ef3e",
                        "564cfd8ba6e6390160c9eee6",
                        "564cfd8ba6e6390160c9eec8"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-04-27T12:27:35.209Z",
                        _id: "5707533ecbb17f48214c76f0",
                        manager: "55b92ad221e4b7c40f000063"
                    }
                ]
            },
            {
                _id: "56a9ef06d59a04d6225b0df6",
                TargetEndDate: "2016-03-30T22:00:00.000Z",
                StartDate: "2015-10-25T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56a9f148d59a04d6225b0df7",
                        "5702701cc3a5da3e0347a450",
                        "56f8fa340bbb61c30355b4e6",
                        "57020ca1ec814f7c039b8053",
                        "56efa3f9d9ee676b34e8c453",
                        "56efa44a74faf4cc33d20adf",
                        "56e6781168e298b241985650"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-02-01T19:51:09.639Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: ".net",
                createdBy: {
                    date: "2016-01-28T10:35:50.314Z",
                    user: "52203e707d4dba8813000003"
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
                    users: [ ],
                    group: [ ]
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
                    _id: "56a9ee95d59a04d6225b0df4",
                    name: {
                        last: "",
                        first: "ThinkMobiles"
                    }
                },
                task: [ ],
                projectName: "UpCity",
                projectShortDesc: "City management",
                __v: 0,
                EndDate: "2016-04-14T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-10-26T12:27:34.690Z",
                        _id: "5707533ecbb17f48214c7740",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "56b09dd8d6ef38a708dfc284",
                TargetEndDate: "2016-05-01T22:00:00.000Z",
                StartDate: "2015-01-11T22:00:00.000Z",
                description: "Vike Analytics Integrations",
                budget: {
                    projectTeam: [
                        "56f8f9c50bbb61c30355b4e5",
                        "56e2f0fd74ac46664a83e94c",
                        "56e675703d5bc25541857e24",
                        "56fcfdec53db5c9d03fc9e89",
                        "56dfe3adc7b580a03fff2f4d",
                        "56b0b174d6ef38a708dfc28c",
                        "57021ef2c3a5da3e0347a44c"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-09T08:49:49.998Z",
                    user: "56ddac991e6cb7131892b2be"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-02-02T12:15:20.029Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "55b9dd237a3632120b000005",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004b",
                    name: {
                        last: "Katona",
                        first: "Roland"
                    }
                },
                customer: {
                    _id: "56a9ee95d59a04d6225b0df4",
                    name: {
                        last: "",
                        first: "ThinkMobiles"
                    }
                },
                task: [ ],
                projectName: "Vike Analytics Integration",
                projectShortDesc: "Internal Project",
                __v: 0,
                EndDate: "2016-04-14T21:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-01-18T12:27:34.802Z",
                        _id: "5707533ecbb17f48214c771d",
                        manager: "55b92ad221e4b7c40f00004b"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f0006c2",
                EndDate: "2015-09-24T21:00:00.000Z",
                StartDate: "2015-05-17T21:00:00.000Z",
                ID: 1103,
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-02-19T10:20:10.012Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.347Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce80ef3f67bc40b000024",
                    name: "Cancelled"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55b92ad621e4b7c40f000638",
                    name: {
                        last: "",
                        first: "Unibet"
                    }
                },
                task: [ ],
                projectName: "WP Wrapper Unibet",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "564cfdd06584412e618421ce"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2015-05-18T12:27:34.661Z",
                        _id: "5707533ecbb17f48214c76f2",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "56bc8fd2dfd8a81466e2f46b",
                budget: {
                    projectTeam: [
                        "56e75dc9d4cfab3c4eae598f",
                        "56e13ad90333fead5263dd48",
                        "56e75b8cc64e96844ef3d6a2",
                        "56e139f867b99fd4523df6a9",
                        "56e139b09616f14452a45292",
                        "56e137f68af0cbf501828bf3",
                        "56e13785e7cfa7d801cae799",
                        "56e13b989bdbd329520d5c0f",
                        "56bc9050dfd8a81466e2f46c"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-10T09:17:12.811Z",
                    user: "56239dcce9576d1728a9ed1c"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2016-02-11T13:42:42.315Z",
                    user: "563f673270bbc2b740ce89ae"
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
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55cf4f834a91e37b0b000102",
                    name: {
                        first: "SharperBuilds",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "WSpider",
                projectShortDesc: "design and research",
                __v: 0,
                EndDate: "2016-03-31T21:00:00.000Z",
                StartDate: "2016-02-08T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2016-02-09T12:27:34.225Z",
                        _id: "5707533ecbb17f48214c7748",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "56a24d5faa157ca50f21fb13",
                StartDate: "2015-12-01T22:00:00.000Z",
                budget: {
                    projectTeam: [
                        "56a24dc8aa157ca50f21fb14",
                        "5703c12ce7050b54043a69c5"
                    ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-10T08:01:53.959Z",
                    user: "56239dcce9576d1728a9ed1c"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2016-01-22T15:40:15.716Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55cf4f834a91e37b0b000102",
                    name: {
                        first: "SharperBuilds",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "Water Safety App",
                projectShortDesc: "Water source testing",
                __v: 0,
                EndDate: "2016-03-08T22:00:00.000Z",
                salesManagers: [
                    {
                        date: "2015-12-02T12:27:34.266Z",
                        _id: "5707533ecbb17f48214c773d",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f000692",
                EndDate: "2015-07-30T21:00:00.000Z",
                StartDate: "2014-11-24T22:00:00.000Z",
                ID: 58,
                bonus: [
                    {
                        employeeId: "55b92ad221e4b7c40f000063",
                        bonusId: "55b92ad521e4b7c40f000605",
                        startDate: "2014-11-23T00:00:00.000Z",
                        endDate: null,
                        _id: "55b92ae421e4b7c40f00152b"
                    },
                    {
                        employeeId: "55b92ad221e4b7c40f00004a",
                        bonusId: "55b92ad521e4b7c40f000604",
                        startDate: "2014-11-23T00:00:00.000Z",
                        endDate: null,
                        _id: "55b92ae421e4b7c40f00152c"
                    }
                ],
                health: 2,
                editedBy: {
                    date: "2016-03-16T12:29:38.828Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.323Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7e3f3f67bc40b000022",
                    name: "Pending"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000625",
                    name: {
                        last: "",
                        first: "WishExpress"
                    }
                },
                task: [ ],
                projectName: "WishExpress",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    projectTeam: [
                        "564cfd8ba6e6390160c9ef1f",
                        "564cfd8ba6e6390160c9ef12",
                        "564cfd8ba6e6390160c9ef3c",
                        "564cfd8ba6e6390160c9eef6",
                        "564cfd8ba6e6390160c9eee2",
                        "564cfd8ba6e6390160c9ef22",
                        "564cfd8ba6e6390160c9ee5f",
                        "564cfd8ba6e6390160c9ef1c",
                        "564cfd8ba6e6390160c9eeb8",
                        "564cfd8ba6e6390160c9ee85",
                        "564cfd8ba6e6390160c9ee82",
                        "564cfd8ba6e6390160c9eec6",
                        "564cfd8ba6e6390160c9ee3f",
                        "564cfd8ba6e6390160c9ee8f",
                        "564cfd8ba6e6390160c9ee88",
                        "564cfd8ba6e6390160c9edf3",
                        "564cfd8ba6e6390160c9ee7e",
                        "564cfd8ba6e6390160c9ee87",
                        "564cfd8ba6e6390160c9ee01",
                        "564cfd8ba6e6390160c9ee96",
                        "564cfd8ba6e6390160c9ee68",
                        "564cfd8ba6e6390160c9eeac",
                        "564cfd8ba6e6390160c9ee4c",
                        "564cfd8ba6e6390160c9eec1",
                        "564cfd8ba6e6390160c9eece",
                        "564cfd8ba6e6390160c9eed2",
                        "564cfd8ba6e6390160c9ee55",
                        "564cfd8ba6e6390160c9eef3"
                    ],
                    bonus: [
                        {
                            percentage: "Sales/QA 16%",
                            resource: "Yana Gusti",
                            bonus: 53648
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 6706
                        }
                    ]
                },
                salesManagers: [
                    {
                        date: "2014-11-25T12:27:35.098Z",
                        _id: "5707533ecbb17f48214c76cc",
                        manager: "55b92ad221e4b7c40f000063"
                    }
                ]
            },
            {
                _id: "563295f6c928c61d052d5003",
                StartDate: "2015-11-08T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "56fe778fe7050b54043a6967",
                        "56e7c174977124d34db582b3",
                        "56e7bf95d4cfab3c4eae5990",
                        "564cfdd06584412e618421c3"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-04-01T13:28:47.507Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "web",
                createdBy: {
                    date: "2015-10-29T21:56:06.723Z",
                    user: "55cb7302fea413b50b000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55cf4f834a91e37b0b000102",
                    name: {
                        first: "SharperBuilds",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "WordPress Sites",
                projectShortDesc: "Site Templates Business",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2016-04-05T21:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-11-02T12:27:34.259Z",
                        _id: "5707533ecbb17f48214c772b",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
            },
            {
                _id: "55deb95bae2b22730b000017",
                StartDate: "2015-07-29T21:00:00.000Z",
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f000040",
                        _id: "566af72aa74aaf316eaea7d4",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000608",
                        employeeId: "55b92ad221e4b7c40f00005f",
                        _id: "566af72aa74aaf316eaea7d3",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2016-03-04T11:17:21.642Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-08-27T07:16:43.691Z",
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
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
                    _id: "55deb987ae2b22730b000018",
                    name: {
                        last: "",
                        first: "Yello"
                    }
                },
                task: [ ],
                projectName: "YelloDrive",
                projectShortDesc: "Delivery app",
                __v: 0,
                teams: { },
                info: { },
                description: "",
                EndDate: "2016-04-07T21:00:00.000Z",
                TargetEndDate: "",
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Vasiliy Almashiy",
                            bonus: 153993.24000000002
                        },
                        {
                            percentage: "Sales/Usual 8%",
                            resource: "Peter Voloshchuk",
                            bonus: 615972.9600000001
                        }
                    ],
                    projectTeam: [
                        "56f8e937a33b73e503e3eb44",
                        "56f397d7c1785edc507e81e8",
                        "56d96ec1612326bf0dfe002e",
                        "56afd9dcf5c2bcd4555cb2d6",
                        "568a28f33cce9254776f2af3",
                        "566554469294f4d728bcbd4a",
                        "566559909294f4d728bcc1fa",
                        "566abc5b4f817b7f51746ed9",
                        "564cfd8ba6e6390160c9ef8c"
                    ]
                },
                salesManagers: [
                    {
                        date: "2015-07-30T12:27:34.427Z",
                        _id: "5707533ecbb17f48214c770f",
                        manager: "55b92ad221e4b7c40f00005f"
                    }
                ]
            },
            {
                _id: "55b92ad621e4b7c40f00068a",
                EndDate: "2014-09-18T21:00:00.000Z",
                StartDate: "2014-09-04T21:00:00.000Z",
                ID: 17,
                bonus: [
                    {
                        bonusId: "55b92ad521e4b7c40f000604",
                        employeeId: "55b92ad221e4b7c40f00004a",
                        _id: "5660157a6226e3c43108e160",
                        endDate: null,
                        startDate: null
                    },
                    {
                        bonusId: "55b92ad521e4b7c40f000605",
                        employeeId: "55b92ad221e4b7c40f000063",
                        _id: "5660157a6226e3c43108e15f",
                        endDate: null,
                        startDate: null
                    }
                ],
                health: 3,
                editedBy: {
                    date: "2016-03-16T12:29:22.764Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.316Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce80ef3f67bc40b000024",
                    name: "Cancelled"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    }
                },
                customer: {
                    _id: "55b92ad621e4b7c40f000651",
                    name: {
                        last: "",
                        first: "Dan D."
                    }
                },
                task: [ ],
                projectName: "application regression testing",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    bonus: [
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 910
                        },
                        {
                            percentage: "Sales/QA 16%",
                            resource: "Yana Gusti",
                            bonus: 7280
                        }
                    ],
                    projectTeam: [
                        "564cfd8ba6e6390160c9ede1"
                    ]
                },
                TargetEndDate: "",
                description: "",
                salesManagers: [
                    {
                        date: "2014-09-05T12:27:34.986Z",
                        _id: "5707533ecbb17f48214c76c5",
                        manager: "55b92ad221e4b7c40f000063"
                    }
                ]
            },
            {
                _id: "5613b6f0c90e2fb026ce068c",
                StartDate: "2015-12-27T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "5664c7f908ed794128637cd1",
                        "56eae2f366a6a5573cd02d73",
                        "5703e1aab50d351f04817ca3",
                        "5664c80608ed794128637cd2",
                        "569eaed62208b3af4a52722b"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-03-14T13:32:03.858Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "android",
                createdBy: {
                    date: "2015-10-06T11:56:32.813Z",
                    user: "55cb7302fea413b50b000007"
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
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    }
                },
                customer: {
                    _id: "55cf4f834a91e37b0b000102",
                    name: {
                        first: "SharperBuilds",
                        last: ""
                    }
                },
                task: [ ],
                projectName: "iTacit",
                projectShortDesc: "iOS and Android",
                __v: 0,
                TargetEndDate: "",
                EndDate: "2015-12-24T22:00:00.000Z",
                description: "",
                salesManagers: [
                    {
                        date: "2015-12-28T12:27:34.286Z",
                        _id: "5707533ecbb17f48214c7724",
                        manager: "55b92ad221e4b7c40f00004a"
                    }
                ]
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

            it('Should create main view', function () {
                var $expectedSubMenuEl;
                var $expectedMenuEl;

                server.respondWith('GET', '/getModules', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);
                view = new MainView({el: $elFixture, contentType: 'DashBoardVacation'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
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
                topBarView = new TopBarView({});

                expect(topBarView.$el.find('.vocationFilter')).to.exist;
                expect(topBarView.$el.find('#searchContainer')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Dashboard Vacation');
            });
        });

        describe('DashBoard IndexView', function () {
            var server;
            var depOpenSpy;
            var devOpenSpy;
            var createWTrackSpy;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                depOpenSpy = sinon.spy(IndexView.prototype, 'openDepartment');
                devOpenSpy = sinon.spy(IndexView.prototype, 'openEmployee');
                createWTrackSpy = sinon.spy(IndexView.prototype, 'createWTrack');
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                depOpenSpy.restore();
                devOpenSpy.restore();
                createWTrackSpy.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create categories list view', function (done) {
                    var dashBoardUrl = new RegExp('dashboard\/vacation', 'i');

                    server.respondWith('GET', dashBoardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDashBoardVacations)]);
                    indexView = new IndexView({
                        startTime: new Date()
                    });
                    server.respond();
                    clock.tick(200);

                    expect(indexView.$el.find('.dashBoardMargin')).to.exist;

                    done();
                });

                it('Try to expand all', function(){
                    var $expandAllBtn = indexView.$el.find('.openAll');

                    $expandAllBtn.click();
                    expect(indexView.$el.find('#dashboardBody > tr:nth-child(3)').attr('data-content')).to.be.equals('project');

                    $expandAllBtn.click();

                });

                it('Try to open web department', function(){
                    var $webDepartmentRow = indexView.$el.find('#dashboardBody > tr:nth-child(1) > td:nth-child(2)');

                    $webDepartmentRow.click();
                    expect(depOpenSpy.called).to.be.true;

                    $webDepartmentRow.click();
                    expect(depOpenSpy.calledTwice).to.be.true;
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

                it('Try to create wTrack', function(){
                    var $projectsRow;
                    var $createWTrack;
                    var $neeeEmployeeRow = indexView.$el.find('#dashboardBody > tr:nth-child(4) .employeesRow');
                    var projectsUrl = new RegExp('\/project\/getForWtrack', 'i');

                    $neeeEmployeeRow.click();
                    expect(devOpenSpy.called).to.be.true;

                    $projectsRow = $neeeEmployeeRow.closest('tr').next();
                    $createWTrack = $($projectsRow.find('td.createTd')[0]);

                    server.respondWith('GET', projectsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProjectWTrack)]);
                    $createWTrack.click();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                    expect(createWTrackSpy.called).to.be.true;
                    $('.ui-dialog').remove();
                });

                it('Try to get Wtrack Info', function(){
                    var $wTrackInfoEl;
                    var wTrackUrl = new RegExp('\/wTrack\/dash', 'i');
                    var $neeeEmployeeRow = indexView.$el.find('#dashboardBody > tr:nth-child(4) .employeesRow');

                    // close employee
                    $neeeEmployeeRow.click();
                    expect(devOpenSpy.calledTwice).to.be.true;

                    // open employee
                    $neeeEmployeeRow.click();
                    expect(devOpenSpy.calledThrice).to.be.true;

                    $wTrackInfoEl = $(indexView.$el.find('#dashboardBody > tr[data-employee="55b92ad221e4b7c40f00004d"] > td.wTrackInfo > span')[0]);

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
