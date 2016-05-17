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
    var fakeTCard = [
        {
            1: 8,
            2: 8,
            3: 8,
            4: 8,
            5: 8,
            6: 0,
            7: 0,
            _id: "5721f569d717977f4043200b",
            year: 2016,
            month: 4,
            week: 17,
            worked: 40,
            cost: 0,
            rate: 0,
            jobs: {
                _id: "56e6f1ae0d773c634e918b68",
                createdBy: {
                    date: "2016-03-14T17:15:26.439Z",
                    user: "56c44e38b81fd51e19207f40"
                },
                editedBy: {
                    date: "2016-04-28T13:10:53.422Z",
                    user: "52203e707d4dba8813000003"
                },
                invoice: null,
                quotation: null,
                budget: {
                    budgetTotal: {
                        minDate: 201611,
                        maxDate: 201617,
                        hoursByQA: 0,
                        revenueByQA: 0,
                        hoursSum: 116,
                        revenueSum: 0,
                        costSum: 0,
                        profitSum: 0
                    },
                    budget: [
                        {
                            revenue: 0,
                            hours: 40,
                            cost: 0,
                            profit: 0
                        },
                        {
                            revenue: 0,
                            hours: 64,
                            cost: 0,
                            profit: 0
                        },
                        {
                            revenue: 0,
                            hours: 12,
                            cost: 0,
                            profit: 0
                        }
                    ],
                    projectTeam: [
                        {
                            name: {
                                first: "Alex",
                                last: "Devezenko"
                            },
                            department: {
                                departmentName: "Marketing",
                                _id: "55b92ace21e4b7c40f000013"
                            },
                            jobPosition: {
                                name: "Middle Designer",
                                _id: "55b92acf21e4b7c40f000023"
                            },
                            _id: "55b92ad221e4b7c40f000044"
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
                        }
                    ]
                },
                project: "56e689c75ec71b00429745a9",
                wTracks: [
                    "56efb964ec934beb32bd5b29",
                    "5721f569d717977f4043200b",
                    "56e6f23849e358ee4d71398d",
                    "56e6f1ecd4cfab3c4eae5988"
                ],
                type: "Not Quoted",
                workflow: "56337c705d49d8d6537832eb",
                name: "March",
                __v: 0
            },
            createdBy: {
                date: "2016-04-28T11:35:05.658Z",
                user: null
            },
            isPaid: false,
            amount: 0,
            revenue: 0,
            department: {
                _id: "55b92ace21e4b7c40f000013",
                ID: 5,
                sequence: 0,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-03-14T08:33:47.375Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:38.909Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: "56e6775c5ec71b00429745a4",
                departmentName: "Marketing",
                __v: 0
            },
            employee: {
                _id: "55b92ad221e4b7c40f000044",
                dateBirth: "1991-11-16T00:00:00.000Z",
                ID: 4,
                isLead: 2,
                lastFire: 201512,
                fire: [
                    "2015-03-19T22:00:00.000Z"
                ],
                hire: [
                    "2013-07-18T21:00:00.000Z"
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: -4,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.429Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-03-30T17:44:41.810Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.429Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.429Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: "52d2c1369b57890814000005",
                active: true,
                referredBy: "",
                source: "",
                age: 24,
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
                manager: null,
                jobPosition: "55b92acf21e4b7c40f000023",
                department: "55b92ace21e4b7c40f000013",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "hikari-tjan",
                workPhones: {
                    mobile: "+380505167684",
                    phone: ""
                },
                personalEmail: "",
                workEmail: "alex.devezenko@thinkmobiles.com",
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
                    last: "Devezenko",
                    first: "Alex"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCgRiZPpUqjP500r++T6VPGBz9am4WGOMRGo0PSrEy4hY1WTrWkGRNHTeHv9VL/AMB/rWxWN4c/1U31X+tbNEtwjsJRUNzdwWykyuAcZC9zWNd+ItpKwIo68tzTUW9glOMdy5rV0sUSxlgO5rkrqWaQEAN5ZPU/49qlutSuLlyxcksMEjis+VySA7HA6VvG0Ucs7zZG8Tk5Yrn1LA1C0ZHVl6Z60jtuztyRUW12OOn1NNzEqbHmFmOAU/76FRNDIP4SfpzStE47imYce31qXItRY8NNbsD8yH3H4VZgvdoxIvIXAIqos0sbZVyCOhBpwuX6sFbjHzKDSuNxNy0u2Vo3P3lIIYdjXbyyCbTmkAwHi3AHtkV5jBdIjcxnb3Cnr+dddo+vWbaZ9jlcxyKpClhw2T/9epnqhw93QsBmCFAeKpw2CRSFh3NXlAZQykMD0IOQaekZY4ArA13GIlSbaeYzH1pMUAQutU5YtxrRZajMdAitBCF7UVbVMUUxGC3+ujqwg6/WoXH7yKpBkhvrWR0D7nH2c4qknWrkv/HoSfSqKH5hWlNkTR0/hv8A1Mw9x/Wp9Z1EWaCNGxI4z7gVD4c/1Ev1FZ3iORlvXAY4wOPwFax1ZnJtR0My5u2kJbcxyeSaqZLck/L/ADpwjMvOfkB5NJJjO0AAD1rRy6GMYdWNd2Y8f/WpYbN7h8EdaExJKkSA8n5jXQWFuI1HFZSnY6IQuUU0hFTpk1FNou4Er1Pt0rpNgwKNnpWXMzblRxs+mzQ8vGSPUVReIK33eR+degNGrDBA5rOvtGhuVO0bW7EU1NicE9jjtvboPekMS4znj6Zq7e6bNasRIDj+8DxVWM7ThhVqVzJxtuVSoB/wp6MVPBOfY0sm0E4wM85pMeoGfUGquTY0LO7ntmDwO6jOWB5DfhXaaFexajAW2hZY8CRR09iPavP1GcAcHtmt3wvM8WsQocpvVlOOQwxnH5gUnZiWjOsvRgqB61BU14cutQ1BTAijFLRQITFFFFMDnzyYzTlJwfrSKPkB9KEPyZrA6B1wf9ENUEark7f6Mwqgv9KuGxMjp/DE4xPGTzwR+tSa/ZLO8cxPyY2tj9P8+1VvDUQEkjNnJA61qakqiEk42/r6/wBBWl7GbVzmJkAyF4CjgA8CsuUMGVehY9TzWu+HkfuAKzZx++DAcBT+lJMdtBmk/PfnGdo6V10K8CuT0Vf9OeusicKADxUT1ZrBWiT44pwqPzQelODg0ih1JtpC1Q3F9BaJunlVAfWgB08CTIVdQQa47WLE2VzwMo3510R1+yLbYvMkY9Nq9aqa5IlxZB2hljZHBG+M+tNaMl6o5GT2pEYgcGrlxaYI5x13Z7VUeMxvg/nWlzFolWXnJ69jW74XUy6vGwyAiljx7Y/rXNhua7XwfbiKwa4ON0jHn1A/yaGCVzbujlxUYpZ23OMU2khPcWkNGaSmIKKQmigRhp/q6RBlKfGP3ZJpF4Tjpmuc6iK4H+jtk/hVWJQBlu3+f8mrkigoxboBk1TRT9/J4xjb1xz0rSOxEje8NozzSydiAMemK0NUDMhVeeMmm+HGVoJdoOSQzHHBJ9KsXiC43hD9372QecHoO1VYk5VWZklLD2BPGc/5FUWYNKdpxhj19K0bxljhGBjgdPp3rITljjqASf1qUUySxxFcktnay84OP1pLuaC7nENrFNJJ6h8/zq5ZQrJcLnJ3L3+lXF0xrSXzYVxnrtFHMr6l2dtDBtnvQ4+zs+ePlV+emeldHpF+9yoSUEOPbGaalsyOGigIboCcjGfTPT8KtW9uIipwAR2HuaJNMIxa3L8oxHkVzGoWlzf3pCpyF/i6AV1cnKAVUmtWdhIhAfpnGSKS0Hucnai/RiLd1ic9fkwMDJLZ546dfWnS6neXNmYbgYIbrjrXQpp7FmLkEsck88/WoNQ09VjLdycU3JCUbdTnbn5mUnqACSPzqnO/yqc54rQuA3mTHnaGC49P88VQkUu3AOAcAU4szaGwwiaVR0+YZGQP516HZQJbW6wxcIgwK86VWDdMYrsvD10WgELn5gMj1xVXEkabf6ynZoYZb1pDTREtwNJmkJpM0yRc0U0migDIU4ix602MHbwM/SlUjy+e1JHKdpOcGuY6wmVhAwBOW9O9VYAjMFIGQD06d/X/ADxU8rExuSegrPTcX2ggHpg8D0qokSOr8O3C/ZbjafnX5vm6d/6Yq75qR2sjoyu2dpwMAE//AK6wfDbH7TL825WQckfp/Orlw7KjoDghs89T/kY/HNaXIMPUnGNin5R8vH0rLDEbsHPXk9qvX/3Wbnljgj1rNAJkAA4IzUrYo3dLGZFckAD5QK6KPpzXK6bKqCNT1L8cYwOtdRG2QKjqbLYkIHYCoGPzYHXNTMeKoNdRQ3WJXC5IxmkxpGizcDvTkYHoarS3tusbYOcDovNRWkvnZdNwXtkYpthY0QKztXbbEORnOauq+BzWNq8ys6qT8o6/yob0EkYV0SUuXGSryg8emT/9as8sdxJwfm4q3M5+wNuGfnz19MVQMmTg96uJlLctPneYzgjnketaGnymKRSDyOh9Ky45QeDzVm2nUFenHbt/9alIEdjDceYgPQing5rE0+72hcnI9610kVx161cHcxmrMeaSg0hqyAopuaKYjGVv3RqCI8GlV/3ZFNi5Fcp2D5W/cMc9qzg3y89BzWhc8WzfSs08Re9OISNjw/OTeEnbyO2c5/OtrUYDIizJ8pHBOO3b+v51ieGIke6ZiykheBg11jxB7V0YZBHTNaWMrnF36lVZffOD2NZijofXI+nFbuqRHecNkjrg8elY4X7wwdoPb/PtUJmgwzmIRPzhGzj27111vITGjA5UjrXIyKGjYZxg+taPh7Uh5f2OY4dPuZ7j0pNXVyk7Ox0vmZGM1HLDHIv7wLj1NQTRLPt+Zlx/dYj+VZ88LpIfOmm29mBB/nULU1jG7NaOC0hy0boMdfmzinm8tYx80yr9eKxPKth8zXM0nqoAGas21uHO5IyiY6sck/iarRGkqaS1Zbnv42bZESxPQgHH51jX0jeaQDk9DWhcyCME44UVhPIZJwx5B5/z+VStWYvREN22IxH325P4nNVY7ZpFHBDHgVZuP3k7LkYyFqSS5AZgmQB05rVN2MmigIGLHaOOx9adGrD5uoJweKtRSbvmPAHp9M1BypGee4A6DNO4rF23kZcY6Gt3TZ/Mi8tj86DOa522+ddvBPXpVq3naFxID8w9O9SnZhJXR1KncM0jGo7WYTQhhx605jW62OZiE80U0mimSc8jfKeaWE9c1Ep4NERO481zM7ET3B/0du9ZzNhPfFXpDm2es6RsbfpREcjZ8LPi+fPdf612sZBWvPdFuPs92W9Riuy0q68+LJPetkzJrUy76HYZyeiFjwec5B/xrBnQLMR1HXn611mqL5NyJSoaN8Zwv6fXrXMXUflyMgOQp4PqPWsZKzNIsqOCMj1AxVGTKXaMpweDmrkjZXPVhkGqtwu542XoDTiOSOlsL1iAs33vX1rUVVdegINZVnCJIlz6VcXzYFIHzL6VlfU0LqRwwjd5aj3C1K4UJurMOpNCCPKY/jWfe6zPtIWML6ZqlqDG67dLEuwEZb0rPs2JdJMgbULGs65kknlLyEsx/StOJQ0T4AX90Mexx0qmrIi92Vyp3M5OST+h60xowGwR7H/GppXzCVA5Y/XtUHmliScZ9M9aaJJVTadueGHbp+FICrREjkDI/wA/nSLICVXacg/nUbcKVBJzzmmA62kYS4XoT0x71fVtzFcYz6fhWXkLI3PYVatZwJ42ftjPHahoSeh1FpheVPB7elWDzWXFqMJnSNH3kjGa0g2B14rWJzzWoh4opM0VZmc6V20kIG4mnnkGn2FrNdylIVzj7xPRfrXNuduw0kCJhVG4UYBrqYNBQIftEpYnqI+Mfif8Kv21ja23+phUEfxEZb8zVRg1uTKa6HI6ZZXUkqstvKUYcNsOD+NdHpttc27EFdoJ5JI4rTK5zSRhirc9Dir5UQ5PYS4WOWErMd+ew7Vz17p9yzfIobII3bsHr3FdEYyQAaPKHehxTBSaOElhkjd43Uhxzg/zquELMseCPm4z6V3c62vmCOeSPceiuwBP4VQvdPieeOeEK2wbWC+lZtWNFK4abHhAD6Vo+WD2qOFAoBXoanzgVkjRsrTwpg8D8q5/VAi5VeW9O1bt/cJDCWY9eg7n2rmbqU7ixGPQE9KFuPoZ5UmQKOBnk1fgKO8gLADywQCcVTEpMqkYHT6Cn20ha6Z+u8HOT+NaPVEbMluhthjOMYwTz9aobsEg9TzV6ZmdVjGMKPz5J/rVDjeQV+lERSJf4M9ADxmllJOHU4PfmooW2kgc05dw+U8Z7f5+lMCBmJOTUkfTODzxxSNGN2RjGanCKAM8qR1p3ETWtpcSttUeWD1fniurj4jUMxyBjJrD02YQbgTuU44HT3rVR0ZRtbBI6Zq4symifjNFNG4L81FXcxsYVlFJeXQhT+LqcZ2jua6y2tYrWERQLhR1Pcn1NZ+g2Yt7Tz2H7ybn6L2/Pr+Vay9KzSsdDdx3v601zt5pT909qZLkw8YJFUIlHIpsJ2R4OSwLdB15NNhfK88U8Z7dKBDROzLxDIrDsxAz+RNREzSFlc4Xp8vGfap2ztwhAPqRmk6sT+VJjsUls4FZdsSKB6KBUv2eNG3qm1u5HGamK5Ge47UrfdpDIsLHIAvRhn8aJOKSbmIEdVO7/H9KimdgjEckDIrKaszWGqM25UzTF2zwCqD27n8f8KxNQGBzkeua302yFjwUHyhe2BxWBqUglmBBBAHOPXNRHc0exUtyA/zLk8j/AAot0ImfDDcAee33T/hTc7HGe3anWrfv2Vj+J+v+Fa9DLqWZFaPcWGPlBGfoBWcSC5Yf3smrt5LvTPOTVPA8xiw460ohImjQJE8p/iPyimQncck8AdqJGJtwuBwagBKYbPP8qoVyxKQEUqRkdqBKGQKB25qsXyT6CpogGXJ6UWC5PHKm5QpyTjrW1GdoVicKOp7f561kqh8vy32nDAggc4xW1alGtFjcYZeRn+RoEy7FKGAyc+/pRUUaqUIABx1ANFaK5i7XNsABQAAAOABQOuKXtSHqKRY5Tzg1Gejgfw09xkZHUVFCfMWVh34oAS3+6D36VP0qCLhB9amPqKAFJJpe9NFKTQMaeG+tHVfpQ/SlX+dAER+7zzjtVN9zQyIPvqCuf5GrzrzxWJqlxJZ3SSf8s3XBHqR/9aomroqD1EaQmA7SD8vJ6c4rBnO0FhwT29Kuy3EkkbeWhC55FZVxIBgDr396yijaT0GFgoJYZJJ5FNhkxuPHIwfpUMsmRtFERPbqa2sY31LLMWUDqAKhlO0KTzmrFuokU4H4YqOaI7SD1HH1pIbGhsr+NI4Ud81EFdeR0p7MOCc/SmK4xUJ/lUiRsDgE57ClTAx2NTxth8gZ9c9aTY0i3Zt5g5TIHBHarzbYdrb8xHjk8g//AFqTTgU8xygZHywxnkDv7VLHayXkwJyqjpjnHfn/AD3qeo+gsdxghN4LfdB3cmisd5SZ3UYwisckc5Cnj8xRW6WhzN66Heg8Y9aU/wAP1qMH5cjqOalHzKMVJoh2Mj3qGEKPNI7tkj0OBUue9QRMNjv/AHmzQDGoe3vVkdKrIPnz61ZHSgBCCOlJn1p1IRQAjcimhume1OxTWXuKAJGGRVG/tkmgO9Qdp3DP+fTNW1fsaRzwRSAwLm1WOMyRr8qjj+tcpcOXkPOOTnFdjfziGxkjHBj+UE9fY/rXGOwDnv7VKVmW5NobtAVcjG6mscHC9qcxLPk5pfJI56g9DVEk0EvlzBwPlI5A9asucxhsBieMVQVSWwAc1MZBjap4HQmpaLTHvs2kkYI9R1PtVZmZm7D6DFKzBmyWJ9Kcq5YZ4NPYW49EIHPOa0LSzMkioi5Z+megpsSRghcZJwBWpaRtaSwSMcrv2474P0/Go3K2NJ4ktINijOAAMjrnirNhbCGPkHJpsMJlfzpeB/CvpV0Ebse2atIzbOI1OExazdKT13N+ak/1oq7r6htbjA43xDp+IordbGDdmdOPl/CnxkKxXseRTGOAG7Z5p+3I4+orM2HOvHBqnDuS3COPmBOcfU1adsxkjg1nxTNLkMMFZCvP0B/rSBluPlxwR9asCoY+OalBzTEOooopDENNPtT6aw60AQGZRKqEDDnGT64pJGVQctgYpJ7dZl2sMg9RVS500bcxs27OfnlbH8/85pO6BWMbX3UybUbdxyPQ9j/P8q58RknJrqbmwb7EzOE5AdPKXCketY81uY13EccVFzQzmQ4xjpUiho0ypI9RWpZ6c92ykKQnrWrFpESo6sgY7sAk9v8AOae4nocm29+GPXtTMfMB39DWnqdjJbzYVfkboVBqolpKXQhTzzmncBkVq8rlducdcVYFnNksEJx3Hat7TtNMUZzhZH7DnH1rTgtUhXaq4z1OcmlZsLpHLQaZNcuApA55zmuqsrOOG3i8yGPzVGN2MnPc1PFDHEWKLgt196JSSyqPrVJWJbuPLj7o5peVDOTzikVe9JcHKKg6uwH9T+lMRyurSF/EaL/c2KPyB/rRVa6kMniKRm6/aNv4A4FFbLY55bnaj5kKmnQkmMZ6jg0UVkdCCXjkdD1rJ83/AImKQDv836H/AAoooQjTB+WpFoooAeDS0UUhiGkNFFADDxk+nrSTQrMgWQZwciiigRG1vGsEyRIqbgegxziqMmmRyurnO5RgUUUWGXIoEhQKgCgdhTolAiBHORu/Pn+tFFADzECudqsMZOPrTFghR96xIrHnIUUUUWESKUCnK8nvTWADkCiimAoFIOSTRRQwQ7vxUTkPdxr2jUuT6HoP60UUijhIJGlv0kY5ZpQSfcmiiit0cktz/9k=",
                isEmployee: false,
                __v: 0,
                proposedSalary: 0,
                expectedSalary: 0,
                nextAction: "",
                passportNo: "",
                identNo: "",
                transfer: [
                    {
                        date: "2013-07-18T21:00:00.000Z",
                        isDeveloper: true,
                        info: "",
                        salary: 350,
                        jobType: "Full-time",
                        manager: null,
                        jobPosition: "55b92acf21e4b7c40f000023",
                        department: "55bb1f14cb76ca630b000006",
                        status: "hired"
                    },
                    {
                        date: "2014-12-31T22:00:00.000Z",
                        isDeveloper: true,
                        info: "Update",
                        salary: 450,
                        jobType: "Full-time",
                        manager: null,
                        jobPosition: "55b92acf21e4b7c40f000023",
                        department: "55bb1f14cb76ca630b000006",
                        status: "updated"
                    },
                    {
                        date: "2015-03-19T22:00:00.000Z",
                        isDeveloper: true,
                        info: "",
                        salary: 450,
                        jobType: "Full-time",
                        manager: null,
                        jobPosition: "55b92acf21e4b7c40f000023",
                        department: "55bb1f14cb76ca630b000006",
                        status: "fired"
                    }
                ]
            },
            project: {
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
                workflow: "528ce7f2f3f67bc40b000023",
                parent: null,
                sequence: 0,
                groups: {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                projectmanager: "55b92ad221e4b7c40f00005f",
                customer: "56a9eeabd59a04d6225b0df5",
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
            projectmanager: {
                _id: "55b92ad221e4b7c40f00005f",
                dateBirth: "1990-04-03T03:00:00.000Z",
                ID: 37,
                isLead: 1,
                fire: [ ],
                hire: [
                    "2014-04-02T21:00:00.000Z"
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
                    date: "2016-04-01T09:36:59.657Z",
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
                __v: 0,
                transfer: [
                    {
                        date: "2014-04-02T21:00:00.000Z",
                        isDeveloper: true,
                        info: "плюс %",
                        salary: 450,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014",
                        status: "hired"
                    }
                ]
            },
            customer: {
                _id: "56a9eeabd59a04d6225b0df5",
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-28T10:34:19.353Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2016-01-28T10:34:19.353Z",
                    user: "52203e707d4dba8813000003"
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
                    country: "",
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
                    last: "Voloshchuk",
                    first: "Peter"
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
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            _id: "570e62e158fa72265bcc12fb",
            createdBy: {
                date: "2016-04-13T15:16:49.791Z",
                user: null
            },
            isPaid: false,
            amount: 0,
            revenue: 0,
            month: null,
            worked: 0,
            year: 2016
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
            listView.remove();
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

            it('Try to fetch collection with error', function(){
                var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                server.respondWith('GET', tCardUrl, [401, {"Content-Type": "application/json"}, JSON.stringify(fakeTCard)]);

                tCardCollection = new TCardCollection({
                    contentType: 'wTrack',
                    viewType: 'list'
                });
                server.respond();

                //expect(window.location.hash).to.be.equals('#easyErp/wTrack');
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
                expect(topBarView.$el.find('h3').text()).to.be.equals('Time Card');
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

        });

        describe('tCardView', function () {
            var server;
            var windowConfirmStub;
            var mainSpy;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create ListView', function (done) {
                    var $listHolder;
                    var projectsUrl = new RegExp('\/project\/getForWtrack', 'i');
                    var employeeUrl = new RegExp('\/employees\/getForDD', 'i');
                    var depsUrl = new RegExp('\/departments\/getForDD', 'i');
                    var tCardTotal = new RegExp('\/wTrack\/totalCollectionLength', 'i');var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                    server.respondWith('GET', projectsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProjectForWTrack)]);
                    server.respondWith('GET', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployee)]);
                    server.respondWith('GET', depsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployee)]);
                    server.respondWith('GET', tCardTotal, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    server.respondWith('GET', tCardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTCard)]);
                    listView = new ListView({
                        startTime: new Date(),
                        collection: tCardCollection,
                        page: 1

                    });
                    server.respond();
                    server.respond();
                    server.respond();
                    server.respond();
                    server.respond();

                    clock.tick(200);

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

                    tCardCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to delete item with 403 error', function(){
                    var spyResponse;
                    var $needCheckBtn = listView.$el.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    $needCheckBtn.click();

                    server.respondWith('DELETE', wTrackUrl, [403, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                });

                it('Try to delete item', function(){
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    server.respondWith('DELETE', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(4)').text().trim()).to.be.equals('Peter Voloshchuk')
                });

                it('Try to go sort', function () {
                    var $sortEl = listView.$el.find('th[data-sort="project.projectName"]');
                    var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                    server.respondWith('GET', tCardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTCard)]);
                    $sortEl.click();
                    server.respond();
                    expect(listView.$el.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('5721f569d717977f4043200b');

                    server.respondWith('GET', tCardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeTCard[1], fakeTCard[0]])]);
                    $sortEl.click();
                    server.respond();
                    expect(listView.$el.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('570e62e158fa72265bcc12fb');

                });

                it('Try to showMore tCard with error response', function(){
                    var spyResponse;
                    var $pageList = listView.$el.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                    server.respondWith('GET', tCardUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakeTCard)]);
                    $needBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some Error.');
                });

                it('Try to showMore tCard', function(){
                    var $pageList = listView.$el.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                    server.respondWith('GET', tCardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTCard)]);
                    $needBtn.click();
                    server.respond();
                    expect(listView.$el.find('#listTable > tr').length).to.be.equals(2);
                });

                it('Try to check|uncheck all checkboxes', function(){
                    var $checkAllBtn = listView.$el.find('#check_all');

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type="checkbox"]').prop('checked')).to.be.true;

                    $checkAllBtn.click();

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

                    /*$sprintBtn = listView.$el.find('#listTable > tr.false > td:nth-child(3)');
                     server.respondWith('GET', jobUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJobsWithId)]);
                     $sprintBtn.click();
                     server.respond();

                     $select = listView.$el.find('#56e6f1ae0d773c634e918b68');
                     $select.click();*/

                    $sprintBtn = listView.$el.find('#listTable > tr.false > td:nth-child(3)');
                    $sprintBtn.removeClass(' errorContent');
                    $sprintBtn.text('March');

                    server.respondWith('POST', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({id: '56f9172a160c8d6315f0862f'})]);
                    listView.saveItem();
                    server.respond();

                    expect(listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(4)').text()).to.be.equals('Peter Voloshchuk')

                });

                it('Try to copy tCard row', function () {
                    var $copyBtn;
                    var $needCheckBox = listView.$el.find('#listTable > tr:nth-child(2) > td.notForm > input');

                    $needCheckBox.click();
                    $copyBtn = topBarView.$el.find('#top-bar-copyBtn');
                    $copyBtn.click();

                    expect(listView.$el.find('#listTable > tr').length).to.be.equals(4);
                });

                it('Try to delete item with changes ', function(){
                    var $needCheckBtn = listView.$el.find('#listTable > tr:nth-child(2) > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    $needCheckBtn.click();

                    server.respondWith('DELETE', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    //expect(listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(4)').text().trim()).to.be.equals('Eugen Lendyel')
                });

                it('Try to edit wTrack', function(){
                    var $selectedItem;
                    var $input;
                    var $yearBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="year"]');
                    var $jobsBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="jobs"]');
                    var $monthBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="month"]');
                    var $weekBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="week"]');
                    var $mondayBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="1"]');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var jobsUrl = new RegExp('/jobs/getForDD', 'i');
                    var wTrackUrl = '/wTrack/';
                    var keyDownEvent = $.Event('keydown');
                    var keyUpEvent = $.Event('keyup');

                    // change year
                    $yearBtn.click();
                    $selectedItem = $yearBtn.find('.newSelectList > li:nth-child(1)');
                    $selectedItem.click();

                    // change month
                    $monthBtn.click();
                    $input = $mondayBtn.find('input');
                    $input.trigger(keyDownEvent);
                    $input.trigger(keyUpEvent);
                    $input.val('12');
                    $input.trigger('change');

                    // change job
                    server.respondWith('GET', jobsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJobsWithId)]);
                    $jobsBtn.click();
                    server.respond();

                    // chang week
                    $weekBtn.click();
                    $selectedItem = $weekBtn.find('.newSelectList > li:nth-child(1)');
                    $selectedItem.click();

                    // change monday hours
                    $mondayBtn.click();
                    $input = $mondayBtn.find('input');
                    $input.val('10');
                    $input.trigger('change');

                    server.respondWith('PATCH', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();


                });
            });

        });

    });

});
