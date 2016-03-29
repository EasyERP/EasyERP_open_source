/*
define([
    'text!fixtures/index.html',
    'models/EmployeesModel',
    'collections/Employees/filterCollection',
    'views/main/MainView',
    'views/Employees/list/ListView',
    'views/Employees/form/FormView',
    'views/Employees/thumbnails/ThumbnailsView',
    'views/Employees/CreateView',
    'views/Employees/EditView',
    'views/Employees/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, EmployeeModel, EmployeeCollection, MainView, ListView, FormView, ThumbnailsView, CreateView, EditView, TopBarView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var fakeEmployeeForList = {
        data: [
            {
                _id: "56e696da81046d9741fb66fc",
                dateBirth: "1991-10-03T00:00:00.000Z",
                jobType: "partTime",
                editedBy: {
                    date: "2016-03-14T10:47:54.272Z",
                    user: {
                        _id: "55ba28c8d79a3a3439000016",
                        profile: 1438158808000,
                        kanbanSettings: {
                            tasks: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            applications: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            opportunities: {
                                foldWorkflows: [],
                                countPerPage: 10
                            }
                        },
                        credentials: {
                            access_token: "",
                            refresh_token: ""
                        },
                        pass: "e28ac09936a6b64abafe5870482de8ddd0b63cff921323ec91924d443afc907f",
                        email: "andriana.lemko@thinkmobiles.com",
                        login: "AndrianaLemko",
                        imageSrc: "data:image/jpeg;base64,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",
                        __v: 0,
                        lastAccess: "2016-03-14T09:17:43.298Z",
                        savedFilters: [],
                        relatedEmployee: null
                    }
                },
                createdBy: {
                    date: "2016-03-14T10:47:54.272Z",
                    user: {
                        _id: "55ba28c8d79a3a3439000016",
                        profile: 1438158808000,
                        kanbanSettings: {
                            tasks: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            applications: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            opportunities: {
                                foldWorkflows: [],
                                countPerPage: 10
                            }
                        },
                        credentials: {
                            access_token: "",
                            refresh_token: ""
                        },
                        pass: "e28ac09936a6b64abafe5870482de8ddd0b63cff921323ec91924d443afc907f",
                        email: "andriana.lemko@thinkmobiles.com",
                        login: "AndrianaLemko",
                        imageSrc: "data:image/jpeg;base64,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",
                        __v: 0,
                        lastAccess: "2016-03-14T09:17:43.298Z",
                        savedFilters: [],
                        relatedEmployee: null
                    }
                },
                manager: {
                    _id: "55b92ad221e4b7c40f000038",
                    dateBirth: "1993-01-24T22:00:00.000Z",
                    ID: 41,
                    isLead: 1,
                    fire: [
                        {
                            date: "2013-08-14T21:00:00.000Z",
                            info: "Update",
                            salary: 600,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5643483270bbc2b740ce8a16",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2015-03-31T21:00:00.000Z",
                            info: "Update",
                            salary: 800,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5643483270bbc2b740ce8a16",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2015-10-31T22:00:00.000Z",
                            info: "Update",
                            salary: 800,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "56c1914adfd8a81466e2f6db",
                            department: "566ee11b8453e8b464b70b73"
                        },
                        {
                            date: "2016-01-31T22:00:00.000Z",
                            info: "Update",
                            salary: 1000,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "56c1914adfd8a81466e2f6db",
                            department: "566ee11b8453e8b464b70b73"
                        }
                    ],
                    hire: [
                        {
                            date: "2013-08-14T21:00:00.000Z",
                            info: "",
                            salary: 600,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5643483270bbc2b740ce8a16",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2015-03-31T21:00:00.000Z",
                            info: "",
                            salary: 800,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5643483270bbc2b740ce8a16",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2015-10-31T22:00:00.000Z",
                            info: "",
                            salary: 800,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "56c1914adfd8a81466e2f6db",
                            department: "566ee11b8453e8b464b70b73"
                        },
                        {
                            date: "2016-01-31T22:00:00.000Z",
                            info: "",
                            salary: 1000,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "56c1914adfd8a81466e2f6db",
                            department: "566ee11b8453e8b464b70b73"
                        },
                        {
                            date: "2016-02-29T22:00:00.000Z",
                            info: "",
                            salary: 1200,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "56c1914adfd8a81466e2f6db",
                            department: "566ee11b8453e8b464b70b73"
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
                        date: "2015-07-29T19:34:42.415Z",
                        reason: ""
                    },
                    attachments: [
                        {
                            uploaderName: "AndrianaLemko",
                            uploadDate: "2016-02-10T10:39:37.639Z",
                            size: "0.153&nbsp;Mb",
                            shortPas: "%2Fuploads%2F55b92ad221e4b7c40f000038%2FRomanBabunichCV.pdf",
                            name: "RomanBabunichCV.pdf",
                            _id: "56bb13691fa7d95813438052"
                        }
                    ],
                    editedBy: {
                        date: "2016-03-11T13:37:50.867Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:42.415Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.415Z",
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
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "56c1914adfd8a81466e2f6db",
                    department: "566ee11b8453e8b464b70b73",
                    visibility: "Public",
                    relatedUser: null,
                    officeLocation: "",
                    skype: "roveruz",
                    workPhones: {
                        phone: "",
                        mobile: "+380663897967"
                    },
                    personalEmail: "romkauz93@gmail.com",
                    workEmail: "roman.babunych@thinkmobiles.com",
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
                        last: "Babunich",
                        first: "Roman"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,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",
                    isEmployee: true,
                    __v: 0
                },
                jobPosition: {
                    _id: "56a9cb6eb4dc0d09232bd72c",
                    department: "566ee11b8453e8b464b70b73",
                    editedBy: {
                        date: "2016-01-28T08:03:58.393Z",
                        user: "55ba28c8d79a3a3439000016"
                    },
                    createdBy: {
                        date: "2016-01-28T08:03:58.393Z",
                        user: "55ba28c8d79a3a3439000016"
                    },
                    totalForecastedEmployees: 0,
                    numberOfEmployees: 0,
                    groups: {
                        owner: "560c099da5d4a2e20ba5068b",
                        users: [],
                        group: []
                    },
                    whoCanRW: "everyOne",
                    workflow: "528ce700f3f67bc40b00001c",
                    expectedRecruitment: 0,
                    name: "Middle Ruby on Rails",
                    __v: 0
                },
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    sequence: 2,
                    nestingLevel: 2,
                    editedBy: {
                        date: "2015-12-27T18:32:01.531Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        date: "2015-12-14T15:32:43.470Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [],
                    departmentManager: null,
                    parentDepartment: "55b92ace21e4b7c40f000016",
                    departmentName: "Ruby on Rails",
                    __v: 0
                },
                skype: "mr.time1",
                workPhones: {
                    phone: "",
                    mobile: "+380661612306"
                },
                workEmail: "fedir.kovbel@thinkmobiles.com",
                name: {
                    last: "Kovbel",
                    first: "Fedir"
                },
                isEmployee: true
            }, {
                _id: "55c32e0d29bd6ccd0b000005",
                dateBirth: "1992-02-11T00:00:00.000Z",
                jobType: "fullTime",
                editedBy: {
                    date: "2016-03-14T08:02:33.037Z",
                    user: {
                        _id: "55ba2f3ed79a3a343900001d",
                        profile: 1438158808000,
                        kanbanSettings: {
                            tasks: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            applications: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            opportunities: {
                                foldWorkflows: [],
                                countPerPage: 10
                            }
                        },
                        credentials: {
                            access_token: "",
                            refresh_token: ""
                        },
                        pass: "ebe5ffd65e0e1de96e45a13e645646812c9ba15ba57d28a1cc3886365d948c26",
                        email: "maria.zasukhina@thinkmobiles.com",
                        login: "MariaZasukhina",
                        imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        __v: 0,
                        lastAccess: "2016-02-23T11:36:27.002Z",
                        savedFilters: [],
                        relatedEmployee: null
                    }
                },
                createdBy: {
                    date: "2015-08-06T09:51:09.567Z",
                    user: {
                        _id: "55ba28c8d79a3a3439000016",
                        profile: 1438158808000,
                        kanbanSettings: {
                            tasks: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            applications: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            opportunities: {
                                foldWorkflows: [],
                                countPerPage: 10
                            }
                        },
                        credentials: {
                            access_token: "",
                            refresh_token: ""
                        },
                        pass: "e28ac09936a6b64abafe5870482de8ddd0b63cff921323ec91924d443afc907f",
                        email: "andriana.lemko@thinkmobiles.com",
                        login: "AndrianaLemko",
                        imageSrc: "data:image/jpeg;base64,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",
                        __v: 0,
                        lastAccess: "2016-03-14T09:17:43.298Z",
                        savedFilters: [],
                        relatedEmployee: null
                    }
                },
                manager: {
                    _id: "55b92ad221e4b7c40f000072",
                    dateBirth: "1985-05-25T00:00:00.000Z",
                    ID: 18,
                    isLead: 2,
                    fire: [
                        {
                            date: "2013-09-05T21:00:00.000Z",
                            info: "Update",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55c32e2a29bd6ccd0b000006",
                            department: "56e175c4d62294582e10ca68"
                        }
                    ],
                    hire: [
                        {
                            date: "2013-09-05T21:00:00.000Z",
                            info: "",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55c32e2a29bd6ccd0b000006",
                            department: "56e175c4d62294582e10ca68"
                        },
                        {
                            date: "2015-02-28T22:00:00.000Z",
                            info: "",
                            salary: 1200,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55c32e2a29bd6ccd0b000006",
                            department: "56e175c4d62294582e10ca68"
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
                        date: "2015-07-29T19:34:42.474Z",
                        reason: ""
                    },
                    attachments: [],
                    editedBy: {
                        date: "2016-03-11T13:44:38.409Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:42.474Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.474Z",
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
                    age: 30,
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
                    jobPosition: "55c32e2a29bd6ccd0b000006",
                    department: "56e175c4d62294582e10ca68",
                    visibility: "Public",
                    relatedUser: null,
                    officeLocation: "",
                    skype: "evgendavis",
                    workPhones: {
                        phone: "",
                        mobile: "+380951114615"
                    },
                    personalEmail: "berneugen@gmail.com",
                    workEmail: "eugen.bernikevych@thinkmobiles.com",
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
                        last: "Bernikevich",
                        first: "Eugen"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,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",
                    isEmployee: true,
                    __v: 0
                },
                jobPosition: {
                    _id: "55c32e2a29bd6ccd0b000006",
                    department: "55b92ace21e4b7c40f000012",
                    editedBy: {
                        user: "55ba28c8d79a3a3439000016",
                        date: "2015-08-06T09:53:38.743Z"
                    },
                    createdBy: {
                        date: "2015-08-06T09:51:38.152Z",
                        user: "55ba28c8d79a3a3439000016"
                    },
                    totalForecastedEmployees: 1,
                    numberOfEmployees: 0,
                    groups: {
                        owner: "55ba28c8d79a3a3439000016",
                        users: [],
                        group: []
                    },
                    whoCanRW: "everyOne",
                    workflow: "528ce700f3f67bc40b00001c",
                    expectedRecruitment: 1,
                    name: "Middle Unity 3D",
                    __v: 0,
                    requirements: "",
                    description: ""
                },
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    sequence: 7,
                    nestingLevel: 1,
                    editedBy: {
                        user: null
                    },
                    createdBy: {
                        date: "2016-03-10T13:25:24.979Z",
                        user: "56dda0599fb95fbe18e3f8ed"
                    },
                    users: [],
                    departmentManager: null,
                    parentDepartment: "56cebdf6541812c07197358f",
                    departmentName: "Unity",
                    __v: 0
                },
                skype: "figazzz1",
                workPhones: {
                    phone: "",
                    mobile: "+380990872131"
                },
                workEmail: "eugen.alexeev@thinkmobiles.com",
                name: {
                    last: "Alexeev",
                    first: "Eugen"
                },
                isEmployee: true
            }
        ]
    };

    var fakeEmployeeForA = {
        data: [
            {
                _id: "55c32e0d29bd6ccd0b000005",
                dateBirth: "1992-02-11T00:00:00.000Z",
                jobType: "fullTime",
                editedBy: {
                    date: "2016-03-14T08:02:33.037Z",
                    user: {
                        _id: "55ba2f3ed79a3a343900001d",
                        profile: 1438158808000,
                        kanbanSettings: {
                            tasks: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            applications: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            opportunities: {
                                foldWorkflows: [],
                                countPerPage: 10
                            }
                        },
                        credentials: {
                            access_token: "",
                            refresh_token: ""
                        },
                        pass: "ebe5ffd65e0e1de96e45a13e645646812c9ba15ba57d28a1cc3886365d948c26",
                        email: "maria.zasukhina@thinkmobiles.com",
                        login: "MariaZasukhina",
                        imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        __v: 0,
                        lastAccess: "2016-02-23T11:36:27.002Z",
                        savedFilters: [],
                        relatedEmployee: null
                    }
                },
                createdBy: {
                    date: "2015-08-06T09:51:09.567Z",
                    user: {
                        _id: "55ba28c8d79a3a3439000016",
                        profile: 1438158808000,
                        kanbanSettings: {
                            tasks: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            applications: {
                                foldWorkflows: [],
                                countPerPage: 10
                            },
                            opportunities: {
                                foldWorkflows: [],
                                countPerPage: 10
                            }
                        },
                        credentials: {
                            access_token: "",
                            refresh_token: ""
                        },
                        pass: "e28ac09936a6b64abafe5870482de8ddd0b63cff921323ec91924d443afc907f",
                        email: "andriana.lemko@thinkmobiles.com",
                        login: "AndrianaLemko",
                        imageSrc: "data:image/jpeg;base64,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",
                        __v: 0,
                        lastAccess: "2016-03-14T09:17:43.298Z",
                        savedFilters: [],
                        relatedEmployee: null
                    }
                },
                manager: {
                    _id: "55b92ad221e4b7c40f000072",
                    dateBirth: "1985-05-25T00:00:00.000Z",
                    ID: 18,
                    isLead: 2,
                    fire: [
                        {
                            date: "2013-09-05T21:00:00.000Z",
                            info: "Update",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55c32e2a29bd6ccd0b000006",
                            department: "56e175c4d62294582e10ca68"
                        }
                    ],
                    hire: [
                        {
                            date: "2013-09-05T21:00:00.000Z",
                            info: "",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55c32e2a29bd6ccd0b000006",
                            department: "56e175c4d62294582e10ca68"
                        },
                        {
                            date: "2015-02-28T22:00:00.000Z",
                            info: "",
                            salary: 1200,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55c32e2a29bd6ccd0b000006",
                            department: "56e175c4d62294582e10ca68"
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
                        date: "2015-07-29T19:34:42.474Z",
                        reason: ""
                    },
                    attachments: [],
                    editedBy: {
                        date: "2016-03-11T13:44:38.409Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:42.474Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.474Z",
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
                    age: 30,
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
                    jobPosition: "55c32e2a29bd6ccd0b000006",
                    department: "56e175c4d62294582e10ca68",
                    visibility: "Public",
                    relatedUser: null,
                    officeLocation: "",
                    skype: "evgendavis",
                    workPhones: {
                        phone: "",
                        mobile: "+380951114615"
                    },
                    personalEmail: "berneugen@gmail.com",
                    workEmail: "eugen.bernikevych@thinkmobiles.com",
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
                        last: "Bernikevich",
                        first: "Eugen"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,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",
                    isEmployee: true,
                    __v: 0
                },
                jobPosition: {
                    _id: "55c32e2a29bd6ccd0b000006",
                    department: "55b92ace21e4b7c40f000012",
                    editedBy: {
                        user: "55ba28c8d79a3a3439000016",
                        date: "2015-08-06T09:53:38.743Z"
                    },
                    createdBy: {
                        date: "2015-08-06T09:51:38.152Z",
                        user: "55ba28c8d79a3a3439000016"
                    },
                    totalForecastedEmployees: 1,
                    numberOfEmployees: 0,
                    groups: {
                        owner: "55ba28c8d79a3a3439000016",
                        users: [],
                        group: []
                    },
                    whoCanRW: "everyOne",
                    workflow: "528ce700f3f67bc40b00001c",
                    expectedRecruitment: 1,
                    name: "Middle Unity 3D",
                    __v: 0,
                    requirements: "",
                    description: ""
                },
                department: {
                    _id: "56e175c4d62294582e10ca68",
                    sequence: 7,
                    nestingLevel: 1,
                    editedBy: {
                        user: null
                    },
                    createdBy: {
                        date: "2016-03-10T13:25:24.979Z",
                        user: "56dda0599fb95fbe18e3f8ed"
                    },
                    users: [],
                    departmentManager: null,
                    parentDepartment: "56cebdf6541812c07197358f",
                    departmentName: "Unity",
                    __v: 0
                },
                skype: "figazzz1",
                workPhones: {
                    phone: "",
                    mobile: "+380990872131"
                },
                workEmail: "eugen.alexeev@thinkmobiles.com",
                name: {
                    last: "Alexeev",
                    first: "Eugen"
                },
                isEmployee: true
            }
        ]
    };

    var fakeAphabet = {
        data: [
            {
                _id: "L"
            },
            {
                _id: "Z"
            },
            {
                _id: "F"
            },
            {
                _id: "T"
            },
            {
                _id: "V"
            },
            {
                _id: "D"
            },
            {
                _id: "I"
            },
            {
                _id: "R"
            },
            {
                _id: "M"
            },
            {
                _id: "G"
            },
            {
                _id: "A"
            },
            {
                _id: "S"
            },
            {
                _id: "N"
            },
            {
                _id: "Y"
            },
            {
                _id: "H"
            },
            {
                _id: "U"
            },
            {
                _id: "P"
            },
            {
                _id: "O"
            },
            {
                _id: "B"
            },
            {
                _id: "K"
            },
            {
                _id: "C"
            }
        ]
    };

    var fakeEmployeeWithId = {
        enableView: true,
        _id: "56e696da81046d9741fb66fc",
        dateBirth: "1991-10-03T00:00:00.000Z",
        __v: 0,
        lastFire: null,
        fire: [ ],
        hire: [
            {
                date: "2016-03-14T00:00:00.000Z",
                info: "Hired",
                salary: 0,
                jobType: "partTime",
                manager: {
                    _id: "55b92ad221e4b7c40f000038",
                    name: {
                        last: "Babunich",
                        first: "Roman"
                    },
                    fullName: "Roman Babunich",
                    id: "55b92ad221e4b7c40f000038"
                },
                jobPosition: {
                    _id: "56a9cb6eb4dc0d09232bd72c",
                    name: "Middle Ruby on Rails"
                },
                department: {
                    _id: "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                }
            }
        ],
        social: {
            GP: "",
            LI: "",
            FB: ""
        },
        sequence: 221,
        jobType: "partTime",
        gender: "male",
        marital: "married",
        contractEnd: {
            date: "2016-03-14T10:47:54.273Z",
            reason: ""
        },
        attachments: [ ],
        editedBy: {
            date: "2016-03-14T10:47:54.272Z",
            user: {
                _id: "55ba28c8d79a3a3439000016",
                profile: 1438158808000,
                __v: 0,
                lastAccess: "2016-03-14T09:17:43.298Z",
                relatedEmployee: null,
                savedFilters: [ ],
                kanbanSettings: {
                    tasks: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    },
                    applications: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    },
                    opportunities: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    }
                },
                credentials: {
                    access_token: "",
                    refresh_token: ""
                },
                pass: "e28ac09936a6b64abafe5870482de8ddd0b63cff921323ec91924d443afc907f",
                email: "andriana.lemko@thinkmobiles.com",
                login: "AndrianaLemko",
                imageSrc: "data:image/jpeg;base64,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"
            }
        },
        createdBy: {
            date: "2016-03-14T10:47:54.272Z",
            user: {
                _id: "55ba28c8d79a3a3439000016",
                profile: 1438158808000,
                __v: 0,
                lastAccess: "2016-03-14T09:17:43.298Z",
                relatedEmployee: null,
                savedFilters: [ ],
                kanbanSettings: {
                    tasks: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    },
                    applications: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    },
                    opportunities: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    }
                },
                credentials: {
                    access_token: "",
                    refresh_token: ""
                },
                pass: "e28ac09936a6b64abafe5870482de8ddd0b63cff921323ec91924d443afc907f",
                email: "andriana.lemko@thinkmobiles.com",
                login: "AndrianaLemko",
                imageSrc: "data:image/jpeg;base64,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"
            }
        },
        creationDate: "2016-03-14T10:47:54.272Z",
        color: "#4d5a75",
        otherInfo: "",
        groups: {
            group: [ ],
            users: [ ],
            owner: {
                _id: "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        whoCanRW: "everyOne",
        workflow: null,
        active: true,
        referredBy: "",
        source: "www.rabota.ua",
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
        nationality: "Ukrainian",
        coach: null,
        manager: {
            _id: "55b92ad221e4b7c40f000038",
            name: {
                last: "Babunich",
                first: "Roman"
            },
            fullName: "Roman Babunich",
            id: "55b92ad221e4b7c40f000038"
        },
        jobPosition: {
            _id: "56a9cb6eb4dc0d09232bd72c",
            name: "Middle Ruby on Rails"
        },
        department: {
            _id: "566ee11b8453e8b464b70b73",
            departmentName: "Ruby on Rails"
        },
        visibility: "Public",
        relatedUser: null,
        officeLocation: "",
        skype: "mr.time1",
        workPhones: {
            phone: "",
            mobile: "+380661612306"
        },
        personalEmail: "fedia@mrtime.no-ip.info",
        workEmail: "fedir.kovbel@thinkmobiles.com",
        workAddress: {
            country: "",
            zip: "",
            state: "",
            city: "",
            street: ""
        },
        tags: [ ],
        name: {
            last: "Kovbel",
            first: "Fedir"
        },
        subject: "",
        imageSrc: "data:image/jpeg;base64,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",
        isEmployee: true,
        fullName: "Fedir Kovbel",
        id: "56e696da81046d9741fb66fc"
    };

    var fakeEmployeeForThumb = {
        data: [
            {
                _id: "55b92ad221e4b7c40f0000a7",
                dateBirth: "1987-02-06T02:00:00.000Z",
                age: 29,
                manager: {
                    _id: "55b92ad221e4b7c40f00004e",
                    dateBirth: "1994-06-16T21:00:00.000Z",
                    ID: 54,
                    isLead: 1,
                    fire: [
                        {
                            date: "2013-05-24T21:00:00.000Z",
                            info: "Update",
                            salary: 350,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2013-08-31T21:00:00.000Z",
                            info: "Update",
                            salary: 450,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2013-10-31T22:00:00.000Z",
                            info: "Update",
                            salary: 500,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000021",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2014-08-31T21:00:00.000Z",
                            info: "Update",
                            salary: 600,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000022",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2014-12-31T22:00:00.000Z",
                            info: "Update",
                            salary: 800,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2015-08-31T21:00:00.000Z",
                            info: "Update",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2015-12-31T22:00:00.000Z",
                            info: "Update",
                            salary: 1200,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        }
                    ],
                    hire: [
                        {
                            date: "2013-05-24T21:00:00.000Z",
                            info: "",
                            salary: 350,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2013-08-31T21:00:00.000Z",
                            info: "",
                            salary: 450,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department: "55b92ace21e4b7c40f000012"
                        },
                        {
                            date: "2013-10-31T22:00:00.000Z",
                            info: "",
                            salary: 500,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000021",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2014-08-31T21:00:00.000Z",
                            info: "",
                            salary: 600,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000022",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2014-12-31T22:00:00.000Z",
                            info: "",
                            salary: 800,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2015-08-31T21:00:00.000Z",
                            info: "",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2015-12-31T22:00:00.000Z",
                            info: "",
                            salary: 1200,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
                        },
                        {
                            date: "2016-02-29T22:00:00.000Z",
                            info: "",
                            salary: 1400,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department: "55b92ace21e4b7c40f000010"
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
                        date: "2015-07-29T19:34:42.437Z",
                        reason: ""
                    },
                    attachments: [],
                    editedBy: {
                        date: "2016-03-11T13:41:16.494Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:42.437Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.437Z",
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
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "564438aa70bbc2b740ce8a19",
                    department: "55b92ace21e4b7c40f000010",
                    visibility: "Public",
                    relatedUser: "560d0c46963ba3087363de94",
                    officeLocation: "",
                    skype: "mikazme",
                    workPhones: {
                        phone: "",
                        mobile: "+380950366064"
                    },
                    personalEmail: "mikazmes@gmail.com",
                    workEmail: "vitaliy.shuba@thinkmobiles.com",
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
                        last: "Shuba",
                        first: "Vitaliy"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDWbiQfjTozl/wNNf8A1q/j/Klj4lAqBlO7HyRt6GnBTii6/wCPXPowqVcFQapEMlsk/esD0KmtJRwMelUbL/j4x/smr8fb6VQitdD7o9SKx7EmSxiPpkfkcf0rbvP4fqKxNKH+jupJyrt/OkMsFKv6cP3RHo1Vjk84qxaHEUnbBBpiLu2qF8mYiB6/1rQ3rsLE4A5Oa57Vb6eQlLddqZ++3U/QUmUlcmMfzcirFqgDcisNXv8A76zbj6EcVdgvZUIF3EYyejj7p/wpXBwaN2Ybo0+hqJ0w6/jT/Mj8lB5inA7sKbJPCGUmVMAf3hVak3VyK9H7mT6GkhTESg9gKZd3EJhfEqHPTn3py3dsMZlQA9ycCp3L6CCRo3I6jPSolsBDqInXKjHOO4x0ND3FvuJ+0Qf9/F/xqw9/ZbwftcPQD/WCspUXe8dGLmj1LB6D+dZmorm3UjPfj096tHUbED/j7h/77FULy9geJUiuIyc8nk1soytqTzR7mOVIlJI9637V9yR7RyQAaxmERJ/0hOe+1/8ACrVrdQwqgeUnGPuo3b8KrlfYnnj3Nq4I+1vz2orLur63muTIolI/65minysXPHuRn7VkHzhx/sCgfa85FwQfZBUkk8cZAYnn0FIJ0dGKdvUV0csL7HFz1N7kZjuCMNOSP9xf8KcFuB/y8N/3wv8AhSQXBMJabGQf4RUkVxFI2FJH1pe4F6m4gNypyLlwfZV/wpd913upP0/wpGu4hkYbK+w5pzyxqm/nBprkE/ajSJm+9cSn/gVMFqe00w+jkVMrBkDjpimwzrIDxjB9afuCTqWI/szD/lvP/wB/W/xpwgOMGWU/WRv8akiuFkdl27SPfrTLi5MDAbQR3zSvFK40qjfKPtkjjmLuSdo4DMTzT/N85iBGMVli63TyvJwqAZAqtJq06sCoRU7Adq45u7PWox5YJM6FFZRwoFSbg8ZSZAVIxg1h3V3cxWySq2N46gVHZ6rKWAeUSA9QazNiWBI4r2S1ZVIyTGxHb0qyYE82MBAPmHQe9UJWMerRA/3hg+xrVOPMQ+4rspO8NTyq6camhp6lBF5cQCKMyKOnvVfWoUBtyFAAz2+la8saybdwB2nI+tZ2tDiH6n+lRD4jWs2oNmWIUI+6PypRCn90flTlFPFdeh5l2ReSn90flSiAf3RUpPHFZgupC5TzTnPIzzUSkomtODn1L4hHoKUxgZJGKp3Vw6MpDNwM4B60W8rtbsSxORnntU+0V7F+xdua5ajCSKGUcH2oqrvYWZ+Ygk9aKfONUfMivJCyowVuRnpRaSbg6gMD6EVfKgnGKQKFBOO9HIr3J9q+XlsUo9zQOQjDnoRTbTJkAWJlUckkYrQIAXikXC+lLkV7j9tKzRnSq/ns/lvxkcd6nu/MNuiqjEkdu1XCVJ7U5sFcHFHItUN1ZaPsVImlFowaM5xwPWo7MTK5DqcHJz/StLAC4yOlRoAAeRT5VuR7SX3mZLBObncq9Ohzx+VWLqGSUKMAjHOat/LknIo3pt5YfnScUkylUm2jJtbbzzcoXAB25I7YzUMllBaku7g/rVibNs0uxhhxkEf596zZ5XLbSuQe56VxS3PZhblRppqUFwkcBjIHQHH86sW9paMxIIJ9DWREFTDQvuk9FjOPzqxamUszuvlnPTNSzQmvUX+00YAnYgIGevNaMb+YscmMZwcVnjy5buQyE4ULjFWjdxLjrhfQV0UXZO5wYpJ2tudae1ZusjiL6n+lIdct/wC5J+Q/xqnf6pFchAqsu3J55og0pXFVi3CyIxS1WFynofypftS9MNXTzx7nn+xn2LGcjFUBY/vdxkY5NWPtSY5BpBdIOzUnOL3KjTqLZCTWokZTuIxxx3pYbRUjZNxO717UG9jA5DUC+QjhGpc8CvZ1bWA2i+QYsnHrmig3meifrRS54B7KqUvtHuaXz/c1lwXJnmSIqQzHGQacbpAG65U4Nc3NLuehyR7GkZwe5phlPrWX/aCBsNnHrTv7Qh9T+VHMx8kexpeco65pROpHGayzqEHqfyprX0B6M35UXYcsexr+ePejzx71jf2gg4BJ+oo/tGP3/KjUfLHsbPnD3pjTelZP9ox+/wCVJ/aEfv8AlS1C0exdupTtDAnKnn6Uy3kD5DED3qmb2NyBg8n0pt2rW0zKpO3tSaNIs17eWGN8vIT6CmXN6m9tp4rC85s5yas2cL3MoBB2k8mk42KUrmnbs6QiZgP3pJGfQUsly4RjxwKs6hHttoVjAyp2gevFYLXobKbSCeKa2IluTHUrgngqPwp0F5M8672HP5U4WsZ65/OmTqLaPzAvKn1qrEXL/wBoPqPyo+0N6isf+0W/ufrR/aLf3P1pWHc2PtDf3v0prXJ/vj8qyDfuf4f1pv21ieVz+NFguay3Dt3z+FSCXA5zWL9ufsgFBvpfRaLBc3PP9zRWH9tl9FoosFy3Yo4vYjtPDDmkYESzAD+I1ejijWVCEAIPpVKYYu5wP75oTuKxTnXaQcYGaQvGcgKc0+5H7s1WTk0wEOd1APOKVshsU0E0xDj1opuaD1xQMd+FJ+FITWxpGg3GpDzmJith1cjk/QU0riGeHbE3uppuX93F87H6dB+f9auahaskzJIOR0OOo9a6iGK00fTCBiONeST1Y/41zFxqb3t0WZQsY+6AOfxNNxuOMrMpxWiE8itW1iWFQAMVCoyNyg08ylFIxkgd6z5W3Y1ulqbFlai5kSWQZSM5UHuf/rVha54dube5kurePfbk7jt5K/WtHS/EUcbC3vF2qOFkUcfiK6iKaGVFeKRWUjgg1qo2VjFu7ODA+Y461HOkbRsJmKpkZI7V2l9pFneAkfupD/HHxn6iucv/AA3foGCD7TGem08/lSaFc5u4S2UHyHLEetV8irV1D9mYxyxsrjs3GKqVLGhSR2pOM0pGKY3SgEOJ9KTv1ptIOtAElFICN/zZx7UUhnRsCOcn8KpSxlWZ2YnceTV4jnJNQXIHkn6ioW4zNuPucVBH1FT3A+Q1XQc1oIH/ANZSIQrZPNLJ98UzqTQhC962NK8OXeqIJlKRQZxvc9fXA7/55p3hvRhqdyzS/wCoi5bnG4+ldpCYrS2SCNdscYwFB/GrSuK5S0/wpp1quZz9pk9WHH4CtURxhQq7Qi/dUdBVOW4LDMj7E7AGohM78RJgepq0hXF1SzF0AHIKjtms5NLiQ9K1BGersSaQjmmIzjZlchMZ/pUYsQ33gT9a1FUbmPqBSiPHKkfzp2C5mjSo34K8fStTT7WO0TaAcegpyuU+8gI9VqzHJHIMK2G9DxSYx4mC9IzUi3B/u4qB5PL+9/KoZJ8qCvIpWAlvrOy1KPZdQK/o2OR+NcD4g0d9Ju8LloH5jc/yPvXcJcKrAMcZOBUWtWwvdJniI3Og3p9RUyQXPNjnFI3SpyyjioZTk5HrWY0MI4pB1pSeKQdaBjsHdxRS7iKKQHTlar3S/uGOe4p264I+4c1XnScRsXzt71KKKUvKn6VWXORViU/IfpTY9pAyAOOtUIhYZYEYpyKzOFUAsTgCh4yXyvIrd0LSnkAuGX5mPy+w9aaV2Jm9Y/Z9J06O2bLy4y4T+8euTSPdEgHAUntnOKDHFaA5Akk79wtVJXy4L85PSuhKyILUW2R85LtVxWAG1e3eqAuEiVUUAF+AavRxlQN2AB79aSdxtNajs4GSeaaf1oJy1B5FMQzIEjEenSpF4G9R9RTMlZMgA5BBBGaZbSqshTpk9KBFnO3lT8p7UMFcehpGHlnvtamk4NAx32iSIfOnmJ0I7r9PWobmWMqWhHytyPeh5OOazLmYRStGOjDcB6HvSGWXfKg961YZPMhVvUYNYkTbo1+laWnSfKUJoYHDalaNFqFwiodoc4+naqUilSFbjnmum8Ug218jjpIP5VzUzGRi3c1i9ykRyKoHynNNX7wpdp9KVUORwaQEnkseexop3zds0UgsdWVHtUUiI6FWAKnqM1P9ik9CaT7Ex7GpKKD2tuR/qh+dRG1gHSJfzrTNg+OFFLDpc0j7fkUd2JwAKNwKNnp0d1OF2KqDlmPQCujkuFijEFjF8qjG6nLDp8MKxpKhI67eSTS/Z3dcRoIUPV3PJ/CuiEbIzbuZzuwzkYPpUP2aWc79jeWOvHWtBYrZGLu3mEHjPQ0175t+FO1ewxxWc6vRGsIdWZMjFZRwRtPAqzFeyB1AwR3zViW4tpObiH5h/EO9V5EtXKtbsVOehOc0qc1sOpE0DMo79aVZR0zWeTTkJZgDmugwL5cbsc5qm77ZCOcdRntViMbpFH944yfpUd1CWBKfeU8j1oAl+1ssSlgGjPB9VNN+0KTgHjtmqttJy0MnAb17GkdTE5B7GgZYkmwCV5xWRfyb5YmA45GfwrVdQVWVO4wRWZqIVQrAY5AIpAXYB8g+lWbZyjg1UiPFWEODmmA3xXB59hHKOiN/OuR8n613s8YutOaMkcc81i/2bH/z0j/76FYT0ZcTnPJPvSiE+9dEdMixnzYh/wACFH9nQd5o/wDvoVFytDnxGfeiug+wWoPM8f8A30KKVw0J1gbOTIcegBFPMAxwx9s5q75Y9KXyxjpRYi5SEKgZOT9AauW0FuCS53HG7aRwMf1oKAITgcDNZLXZQvyc4HHrWlNCZtSOioHW3iUjkNsGTVCa/YknJqI6izoVdGK4+Urzis55SWwePStmyUiZ58OQSx/GmNLn1/OkhtJL1iIyBt6selO+xXsZw0JYeqkEVySWp0xloS/aJRHsMaMp/vYNNjbMgPlqh/2Rj+VIthcSOP3Lr7lsCmxKUZlbgjiqpx1CclYtE5qWEZOO9Q59akQ4IxXSc5eBVSgyODSuvJZD9RVYj5QSOcg5p/msrZHNMRFcR5O9etSR4uY8N99R+YqUPHIPRu9Q7DDJuU8eooGLb5QtE/Q9Ky9Y24CJy2Qa2JB5qeYg+YdQP51mzwebcJxwxpN2QLcSBgVBqyjZ55qqYmiuHjUcA8Z9O1WEcpxnJ9qfQGaNqd6PGejAis4WIGR1qxbzlZVJHGfSrkigOSOh5rGoupUTM+xDGKBZqOnFaO2kxzWJRnf2ehOSW/OitAiigLEp4FOAFKAO+aXjrgCqJGMgKkeornL+GSCfBHHY9jXTfhn2pjIjDDgY+lNOwHJs7A4BIHqKfFbvMQqozEnqBxXQvp1s75MK/hVhI0jQBAAo6DHWnzAVdOtDaW+xsEscmrRx3oPPXimjGM54qGUgwWOP8is3UVUXA2gAkc+9anTjgE8msq/YNdnHRQBV09xSK5PFPj5qI8ipIiMc10EFpGypHcVPc27EB4xjHbNZ7yAcrn861I5gYYyfQUCKJPGeQaaZXxgk1faGGY7lba3pUL2RHRgaBpkcMrIwIqYtGZhJtxjmoTCU5Y4qNnyDs+8OlJrQCS+g3YnQjgYP0qtE7Z+Qk/U8VZlilk04gghidxA9PSqcEa4Gxk/E5IqYdimaERkBG9lOe2M1bJY4VkKnHBPeqCR46SsW7KMVpR75YSXDDbzlgBRNXQluR+1HXk04jPfke1N6Dk5FcxoLRSE47UUASFsYGAM9s0vGcjHufSjGRzkD+dIcjAAz6D0qiBe3HT+dJznrz/KndemSe/tTeO+MfzoAUe54pGJ6/kKQuP4gcdhQT7cn9KRSQntnJ70o55xgDpSdtv50vVunyigYE4B65NYs7b55G/2sflxWnJcqpYHBNZSqWPXrW1OPUiTGjntSjKOM9DVpIARx1p/2PeuCf0rWxFyFoUYZzinhnjhAC5AqRbPy1yTn3ParFuImgVWbO0kYOKAuURKDz0+lIbqUDCZq+1jC5yrY9gaUWKD3H1oC5mbZJT+8cge5oNvLGcgE+hFaZtU6ZX86Y+22GWkXb6UBcdal2j2uOe9ZqJtuJEAYEHpx/OtG2YujSEYBPGetVL5DHeh+CjjnOeorKLSkW9h6LuI8zIHr1q/CAYSFOR6VTgBJ4DD8Tj8avRh24bG3HVRitJbErcaAencdKMd8Y9aME5BzkUDJGcHI6gVyGodB6iignHIHB6iigBct6/N35pdxORke5puAOOAPpR94cD5fp1qiCQAsOoC/zphIzk52j0pAB3XIHr3oGzGSFA7AcUhpAT3Jx6UnI75Jp2f4sce9CnPzHA9vSgYmSq4BBJpDzhF79fpUmVznPNBwMnnmgCld2QnPDFG9uRWDLq8VpM8DoxeNipIHXFbms3n9n2LyKf3jHan1Pf8ACuDkJdizHLE5JPUmtItkux0MfiSFf+WbH8KsDxNA64X5G/2hXJbcUlVzMVkdPJqMtwSVk3D9KZHdyquAx5PrxWDFO8BymOaV7qRxjOPpRzBY6H7bMBkzkD/Zpjaht+Yy7v8AebFc8ZX6bj+dN3GnzAbV5rTMAkQHHBIHFVLfUJ3u4PMkJQSKSO2M1QPPNPQY5pXbA9JAAyCP0qhqYby42X+F8HIqbT7sXlpFODywww9D3qLVRKIQYW2ncM5xis4/EU9h9oFYAkYHfA4q4JDlUhCqc9/6VRtClzEqOx3gfQGp1R4GAYZTPB9K6WZE75VjwSR+tNyMblP1oYnzM5xuHNJgq2SSQffpXK9GbIXIHzA8d6KQgocg8fnRUjFyGPBOB+tG7cMZ+X69aKKZKAYboOB6ZoO1jjgAUUUhiEBm9QKUkNxkACiimA0n5uWGB7GlLKzYzwPQUUUgOa8Xy5lt4wTgAtg/59q5yiitFsSxDxQcUUVQhMD0zQR6DH40UUAG2nBQOTRRQADHQCndBRRTA6HwteYaS0Y9fmX6966G6USWzg8cZz+tFFZ/aK6Feyg2xDLZJ7mpnhlBysrH2NFFdL2M+pKMkYbr05NKuCCMcj1oorke5sHH3SM0UUUAf//Z",
                    isEmployee: true,
                    __v: 0
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000022",
                    department: "55b92ace21e4b7c40f000010",
                    ID: 8,
                    editedBy: {
                        date: "2015-07-29T19:34:39.108Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:39.108Z",
                        user: "52203e707d4dba8813000003"
                    },
                    totalForecastedEmployees: 19,
                    numberOfEmployees: 4,
                    groups: {
                        group: [],
                        users: [],
                        owner: null
                    },
                    whoCanRW: "everyOne",
                    workflow: "528ce71ef3f67bc40b00001d",
                    expectedRecruitment: 15,
                    name: "Middle Android",
                    __v: 0
                },
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    ID: 2,
                    sequence: 4,
                    nestingLevel: 1,
                    editedBy: {
                        date: "2016-02-25T08:41:11.006Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:38.908Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [],
                    departmentManager: null,
                    parentDepartment: "56cebdf6541812c07197358f",
                    departmentName: "Android",
                    __v: 0
                },
                workPhones: {
                    mobile: "+380675626258"
                },
                name: {
                    last: "Ryabcev",
                    first: "Alex"
                },
                isEmployee: true
            }, {
                _id: "55b92ad221e4b7c40f0000c3",
                dateBirth: "1990-02-07T02:00:00.000Z",
                age: 26,
                manager: {
                    _id: "55b92ad221e4b7c40f0000ca",
                    dateBirth: "1991-03-29T02:00:00.000Z",
                    ID: 3162,
                    isLead: 0,
                    fire: [
                        {
                            date: "2015-07-13T21:00:00.000Z",
                            info: "Update",
                            salary: 400,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000039",
                            jobPosition: "55eeeddd6dceaee10b00001f",
                            department: "55bb1f14cb76ca630b000006"
                        },
                        {
                            date: "2015-09-30T21:00:00.000Z",
                            info: "Update",
                            salary: 500,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000039",
                            jobPosition: "56b1b2b0d6ef38a708dfc2a2",
                            department: "55bb1f14cb76ca630b000006"
                        }
                    ],
                    hire: [
                        {
                            date: "2015-07-13T21:00:00.000Z",
                            info: "",
                            salary: 400,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000039",
                            jobPosition: "55eeeddd6dceaee10b00001f",
                            department: "55bb1f14cb76ca630b000006"
                        },
                        {
                            date: "2015-09-30T21:00:00.000Z",
                            info: "перехід на керівника напрамку",
                            salary: 500,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f000039",
                            jobPosition: "56b1b2b0d6ef38a708dfc2a2",
                            department: "55bb1f14cb76ca630b000006"
                        },
                        {
                            date: "2015-11-30T22:00:00.000Z",
                            info: "",
                            salary: 550,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00009a",
                            jobPosition: "56b1b2b0d6ef38a708dfc2a2",
                            department: "55bb1f14cb76ca630b000006"
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
                        date: "2015-07-29T19:34:42.676Z",
                        reason: ""
                    },
                    attachments: [ ],
                    editedBy: {
                        date: "2016-03-11T13:56:29.526Z",
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
                    manager: "55b92ad221e4b7c40f00009a",
                    jobPosition: "56b1b2b0d6ef38a708dfc2a2",
                    department: "55bb1f14cb76ca630b000006",
                    visibility: "Public",
                    relatedUser: null,
                    officeLocation: "",
                    skype: "vengerovad",
                    workPhones: {
                        phone: "",
                        mobile: "+380990978669"
                    },
                    personalEmail: "",
                    workEmail: "yana.vengerova@thinkmobiles.com",
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
                        last: "Vengerova",
                        first: "Yana"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,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",
                    isEmployee: true,
                    __v: 0,
                    transferred: [
                        {
                            date: "2015-09-21T21:00:00.000Z",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                name: "Marketing"
                            }
                        }
                    ]
                },
                jobPosition: {
                    _id: "55eeeddd6dceaee10b00001f",
                    department: "55bb1f14cb76ca630b000006",
                    editedBy: {
                        date: "2015-09-08T14:17:01.721Z",
                        user: "55ba28c8d79a3a3439000016"
                    },
                    createdBy: {
                        date: "2015-09-08T14:17:01.721Z",
                        user: "55ba28c8d79a3a3439000016"
                    },
                    totalForecastedEmployees: 0,
                    numberOfEmployees: 0,
                    groups: {
                        owner: "55ba28c8d79a3a3439000016",
                        users: [ ],
                        group: [ ]
                    },
                    whoCanRW: "everyOne",
                    workflow: "528ce700f3f67bc40b00001c",
                    expectedRecruitment: 2,
                    name: "2D Artist",
                    __v: 0
                },
                department: {
                    _id: "55bb1f14cb76ca630b000006",
                    sequence: 6,
                    nestingLevel: 1,
                    editedBy: {
                        date: "2016-02-25T08:42:20.626Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        date: "2015-07-31T07:09:08.957Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    departmentManager: "55b92ad221e4b7c40f000039",
                    parentDepartment: "56cebdf6541812c07197358f",
                    departmentName: "Design",
                    __v: 0
                },
                workPhones: {
                    mobile: "+380992943559"
                },
                name: {
                    first: "Olesia",
                    last: "Prokoshkina"
                },
                isEmployee: true
            }
        ]
    };

    var fakeEmpWithId = {
        enableView: true,
        _id: "55b92ad221e4b7c40f0000a7",
        dateBirth: "1987-02-06T02:00:00.000Z",
        ID: 3155,
        isLead: 1,
        __v: 0,
        lastFire: null,
        fire: [
            {
                date: "2015-06-30T21:00:00.000Z",
                info: "Update",
                salary: 1000,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f00004e",
                    name: {
                        last: "Shuba",
                        first: "Vitaliy"
                    },
                    fullName: "Vitaliy Shuba",
                    id: "55b92ad221e4b7c40f00004e"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000022",
                    name: "Middle Android"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                }
            },
            {
                date: "2015-08-31T21:00:00.000Z",
                info: "Update",
                salary: 1200,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f00004e",
                    name: {
                        last: "Shuba",
                        first: "Vitaliy"
                    },
                    fullName: "Vitaliy Shuba",
                    id: "55b92ad221e4b7c40f00004e"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000022",
                    name: "Middle Android"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                }
            }
        ],
        hire: [
            {
                date: "2015-06-30T21:00:00.000Z",
                info: "",
                salary: 1000,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f00004e",
                    name: {
                        last: "Shuba",
                        first: "Vitaliy"
                    },
                    fullName: "Vitaliy Shuba",
                    id: "55b92ad221e4b7c40f00004e"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000022",
                    name: "Middle Android"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                }
            },
            {
                date: "2015-08-31T21:00:00.000Z",
                info: "",
                salary: 1200,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f00004e",
                    name: {
                        last: "Shuba",
                        first: "Vitaliy"
                    },
                    fullName: "Vitaliy Shuba",
                    id: "55b92ad221e4b7c40f00004e"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000022",
                    name: "Middle Android"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                }
            },
            {
                date: "2015-11-30T22:00:00.000Z",
                info: "",
                salary: 1300,
                jobType: "Full-time",
                manager: {
                    _id: "55b92ad221e4b7c40f00004e",
                    name: {
                        last: "Shuba",
                        first: "Vitaliy"
                    },
                    fullName: "Vitaliy Shuba",
                    id: "55b92ad221e4b7c40f00004e"
                },
                jobPosition: {
                    _id: "55b92acf21e4b7c40f000022",
                    name: "Middle Android"
                },
                department: {
                    _id: "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                }
            }
        ],
        social: {
            GP: "",
            LI: "",
            FB: ""
        },
        sequence: 0,
        jobType: "Full-time",
        gender: "male",
        marital: "unmarried",
        contractEnd: {
            date: "2015-07-29T19:34:42.628Z",
            reason: ""
        },
        attachments: [ ],
        editedBy: {
            date: "2016-03-11T13:51:57.666Z",
            user: {
                _id: "55ba2f3ed79a3a343900001d",
                profile: 1438158808000,
                __v: 0,
                lastAccess: "2016-02-23T11:36:27.002Z",
                relatedEmployee: null,
                savedFilters: [ ],
                kanbanSettings: {
                    tasks: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    },
                    applications: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    },
                    opportunities: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    }
                },
                credentials: {
                    access_token: "",
                    refresh_token: ""
                },
                pass: "ebe5ffd65e0e1de96e45a13e645646812c9ba15ba57d28a1cc3886365d948c26",
                email: "maria.zasukhina@thinkmobiles.com",
                login: "MariaZasukhina",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        createdBy: {
            date: "2015-07-29T19:34:42.628Z",
            user: {
                _id: "52203e707d4dba8813000003",
                __v: 0,
                attachments: [ ],
                lastAccess: "2016-03-18T08:20:58.689Z",
                profile: 1387275598000,
                relatedEmployee: "55b92ad221e4b7c40f00004f",
                savedFilters: [
                    {
                        _id: "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id: "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id: "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    }
                ],
                kanbanSettings: {
                    tasks: {
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ],
                        countPerPage: 10
                    },
                    applications: {
                        foldWorkflows: [
                            "Empty"
                        ],
                        countPerPage: 10
                    },
                    opportunities: {
                        foldWorkflows: [ ],
                        countPerPage: 10
                    }
                },
                credentials: {
                    access_token: "",
                    refresh_token: ""
                },
                pass: "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                email: "info@thinkmobiles.com",
                login: "admin",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        creationDate: "2015-07-29T19:34:42.628Z",
        color: "#4d5a75",
        otherInfo: "",
        groups: {
            group: [ ],
            users: [ ],
            owner: {
                _id: "55ba28c8d79a3a3439000016",
                login: "AndrianaLemko"
            }
        },
        whoCanRW: "everyOne",
        workflow: null,
        active: false,
        referredBy: "",
        source: "",
        age: 29,
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
        manager: {
            _id: "55b92ad221e4b7c40f00004e",
            name: {
                last: "Shuba",
                first: "Vitaliy"
            },
            fullName: "Vitaliy Shuba",
            id: "55b92ad221e4b7c40f00004e"
        },
        jobPosition: {
            _id: "55b92acf21e4b7c40f000022",
            name: "Middle Android"
        },
        department: {
            _id: "55b92ace21e4b7c40f000010",
            departmentName: "Android"
        },
        visibility: "Public",
        relatedUser: null,
        officeLocation: "",
        skype: "vvkesedi",
        workPhones: {
            phone: "",
            mobile: "+380675626258"
        },
        personalEmail: "",
        workEmail: "alex.ryabcev@thinkmobiles.com",
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
            last: "Ryabcev",
            first: "Alex"
        },
        subject: "",
        imageSrc: "data:image/jpeg;base64,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",
        isEmployee: true,
        fullName: "Alex Ryabcev",
        id: "55b92ad221e4b7c40f0000a7"
    };

    var fakeUsersForDD = {
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
            }
        ]
    };

    var fakeJobPositionType = {
        data: [
            {
                _id: "contract",
                name: "Contract"
            },
            {
                _id: "fullTime",
                name: "Full-time"
            },
            {
                _id: "internship",
                name: "Internship"
            },
            {
                _id: "partTime",
                name: "Part-time"
            },
            {
                _id: "remote",
                name: "Remote"
            },
            {
                _id: "temporary",
                name: "Temporary"
            }
        ]
    };

    var fakeWorkflows = {
        data: [
            {
                _id: "52d2c1369b57890814000005",
                __v: 0,
                attachments: [ ],
                name: "Contract End",
                sequence: 1,
                status: "Cancelled",
                wId: "Applications",
                wName: "",
                source: "",
                targetSource: [
                    ""
                ],
                visible: true,
                color: "#2C3E50"
            }
        ]
    };

    var fakeEmpNat = {
        data: [
            {
                _id: "British",
                __v: 0
            },
            {
                _id: "Canadian",
                __v: 0
            },
            {
                _id: "Czech",
                __v: 0
            },
            {
                _id: "Danish",
                __v: 0
            },
            {
                _id: "English",
                __v: 0
            },
            {
                _id: "Finnish",
                __v: 0
            },
            {
                _id: "Georgian",
                __v: 0
            },
            {
                _id: "German",
                __v: 0
            },
            {
                _id: "Romanian",
                __v: 0
            },
            {
                _id: "Serbian",
                __v: 0
            },
            {
                _id: "Turkish",
                __v: 0
            },
            {
                _id: "Ukrainian",
                __v: 0
            }
        ]
    };

    var fakeEmpPersonsForDD = {
        data: [
            {
                _id: "55b92ad221e4b7c40f000030",
                name: {
                    last: "Svatuk",
                    first: "Alex"
                },
                fullName: "Alex Svatuk",
                id: "55b92ad221e4b7c40f000030"
            },
            {
                _id: "55b92ad221e4b7c40f000031",
                name: {
                    last: "Gleba",
                    first: "Alex"
                },
                fullName: "Alex Gleba",
                id: "55b92ad221e4b7c40f000031"
            },
            {
                _id: "55b92ad221e4b7c40f00003e",
                name: {
                    last: "Lapchuk",
                    first: "Alex"
                },
                fullName: "Alex Lapchuk",
                id: "55b92ad221e4b7c40f00003e"
            },
            {
                _id: "55b92ad221e4b7c40f000044",
                name: {
                    last: "Devezenko",
                    first: "Alex"
                },
                fullName: "Alex Devezenko",
                id: "55b92ad221e4b7c40f000044"
            },
            {
                _id: "55b92ad221e4b7c40f00004f",
                name: {
                    last: "Sokhanych",
                    first: "Alex"
                },
                fullName: "Alex Sokhanych",
                id: "55b92ad221e4b7c40f00004f"
            },
            {
                _id: "55b92ad221e4b7c40f000057",
                name: {
                    last: "Roman",
                    first: "Alex"
                },
                fullName: "Alex Roman",
                id: "55b92ad221e4b7c40f000057"
            },
            {
                _id: "55b92ad221e4b7c40f000058",
                name: {
                    last: "Makhanets",
                    first: "Alex"
                },
                fullName: "Alex Makhanets",
                id: "55b92ad221e4b7c40f000058"
            },
            {
                _id: "55b92ad221e4b7c40f00006c",
                name: {
                    last: "Sich",
                    first: "Alex"
                },
                fullName: "Alex Sich",
                id: "55b92ad221e4b7c40f00006c"
            },
            {
                _id: "55b92ad221e4b7c40f00006d",
                name: {
                    last: "Tutunnik",
                    first: "Alex"
                },
                fullName: "Alex Tutunnik",
                id: "55b92ad221e4b7c40f00006d"
            },
            {
                _id: "55b92ad221e4b7c40f000084",
                name: {
                    last: "Dahno",
                    first: "Alex"
                },
                fullName: "Alex Dahno",
                id: "55b92ad221e4b7c40f000084"
            },
            {
                _id: "55b92ad221e4b7c40f00009e",
                name: {
                    last: "Michenko",
                    first: "Alex"
                },
                fullName: "Alex Michenko",
                id: "55b92ad221e4b7c40f00009e"
            },
            {
                _id: "55b92ad221e4b7c40f0000a7",
                name: {
                    last: "Ryabcev",
                    first: "Alex"
                },
                fullName: "Alex Ryabcev",
                id: "55b92ad221e4b7c40f0000a7"
            },
            {
                _id: "55b92ad221e4b7c40f0000ac",
                name: {
                    last: "Volkov",
                    first: "Alex"
                },
                fullName: "Alex Volkov",
                id: "55b92ad221e4b7c40f0000ac"
            },
            {
                _id: "55b92ad221e4b7c40f0000ce",
                name: {
                    last: "Storojenko",
                    first: "Alex"
                },
                fullName: "Alex Storojenko",
                id: "55b92ad221e4b7c40f0000ce"
            },
            {
                _id: "5638aa635d23a8eb04e80af0",
                name: {
                    last: "Siladii",
                    first: "Alex"
                },
                fullName: "Alex Siladii",
                id: "5638aa635d23a8eb04e80af0"
            },
            {
                _id: "564dac3e9b85f8b16b574fea",
                name: {
                    last: "Filchak",
                    first: "Alex"
                },
                fullName: "Alex Filchak",
                id: "564dac3e9b85f8b16b574fea"
            },
            {
                _id: "565f0fa6f6427f253cf6bf19",
                name: {
                    last: "Lysachenko",
                    first: "Alex"
                },
                fullName: "Alex Lysachenko",
                id: "565f0fa6f6427f253cf6bf19"
            },
            {
                _id: "566ede9e8453e8b464b70b71",
                name: {
                    last: "Tonkovid",
                    first: "Alex"
                },
                fullName: "Alex Tonkovid",
                id: "566ede9e8453e8b464b70b71"
            },
            {
                _id: "56b8b99e6c411b590588feb9",
                name: {
                    last: "Ovcharenko",
                    first: "Alex"
                },
                fullName: "Alex Ovcharenko",
                id: "56b8b99e6c411b590588feb9"
            },
            {
                _id: "55b92ad221e4b7c40f0000ba",
                name: {
                    last: "Klochkova",
                    first: "Alexandra"
                },
                fullName: "Alexandra Klochkova",
                id: "55b92ad221e4b7c40f0000ba"
            },
            {
                _id: "55c330d529bd6ccd0b000007",
                name: {
                    last: "Yurenko",
                    first: "Alina"
                },
                fullName: "Alina Yurenko",
                id: "55c330d529bd6ccd0b000007"
            },
            {
                _id: "55b92ad221e4b7c40f0000cb",
                name: {
                    last: "Yelahina",
                    first: "Alona"
                },
                fullName: "Alona Yelahina",
                id: "55b92ad221e4b7c40f0000cb"
            },
            {
                _id: "565c66633410ae512364dc00",
                name: {
                    last: "Timochchenko",
                    first: "Alona"
                },
                fullName: "Alona Timochchenko",
                id: "565c66633410ae512364dc00"
            },
            {
                _id: "560264bb8dc408c632000005",
                name: {
                    last: "Lyakh",
                    first: "Anastas"
                },
                fullName: "Anastas Lyakh",
                id: "560264bb8dc408c632000005"
            },
            {
                _id: "55ded6b3ae2b22730b00004e",
                name: {
                    last: "Dimova",
                    first: "Anastasia"
                },
                fullName: "Anastasia Dimova",
                id: "55ded6b3ae2b22730b00004e"
            },
            {
                _id: "55b92ad221e4b7c40f000059",
                name: {
                    last: "Dalekorey",
                    first: "Anatoliy"
                },
                fullName: "Anatoliy Dalekorey",
                id: "55b92ad221e4b7c40f000059"
            },
            {
                _id: "55b92ad221e4b7c40f0000b5",
                name: {
                    last: "Lemko",
                    first: "Andriana"
                },
                fullName: "Andriana Lemko",
                id: "55b92ad221e4b7c40f0000b5"
            },
            {
                _id: "55b92ad221e4b7c40f000045",
                name: {
                    last: "Tivodar",
                    first: "Andriy"
                },
                fullName: "Andriy Tivodar",
                id: "55b92ad221e4b7c40f000045"
            },
            {
                _id: "55b92ad221e4b7c40f00006e",
                name: {
                    last: "Hanchak",
                    first: "Andriy"
                },
                fullName: "Andriy Hanchak",
                id: "55b92ad221e4b7c40f00006e"
            },
            {
                _id: "55b92ad221e4b7c40f000096",
                name: {
                    last: "Herasymyuk",
                    first: "Andriy"
                },
                fullName: "Andriy Herasymyuk",
                id: "55b92ad221e4b7c40f000096"
            },
            {
                _id: "55b92ad221e4b7c40f000098",
                name: {
                    last: "Krupka",
                    first: "Andriy"
                },
                fullName: "Andriy Krupka",
                id: "55b92ad221e4b7c40f000098"
            },
            {
                _id: "55b92ad221e4b7c40f0000a3",
                name: {
                    last: "Karpenko",
                    first: "Andriy"
                },
                fullName: "Andriy Karpenko",
                id: "55b92ad221e4b7c40f0000a3"
            },
            {
                _id: "55b92ad221e4b7c40f0000a8",
                name: {
                    last: "Korneychuk",
                    first: "Andriy"
                },
                fullName: "Andriy Korneychuk",
                id: "55b92ad221e4b7c40f0000a8"
            },
            {
                _id: "55b92ad221e4b7c40f0000a9",
                name: {
                    last: "Loboda",
                    first: "Andriy"
                },
                fullName: "Andriy Loboda",
                id: "55b92ad221e4b7c40f0000a9"
            },
            {
                _id: "55b92ad221e4b7c40f0000b3",
                name: {
                    last: "Sarkanych",
                    first: "Andriy"
                },
                fullName: "Andriy Sarkanych",
                id: "55b92ad221e4b7c40f0000b3"
            },
            {
                _id: "55b92ad221e4b7c40f0000bf",
                name: {
                    last: "Fizer",
                    first: "Andriy"
                },
                fullName: "Andriy Fizer",
                id: "55b92ad221e4b7c40f0000bf"
            },
            {
                _id: "55b92ad221e4b7c40f0000c2",
                name: {
                    last: "Mistetskiy",
                    first: "Andriy"
                },
                fullName: "Andriy Mistetskiy",
                id: "55b92ad221e4b7c40f0000c2"
            },
            {
                _id: "55b92ad221e4b7c40f0000cd",
                name: {
                    last: "Vovk",
                    first: "Andriy"
                },
                fullName: "Andriy Vovk",
                id: "55b92ad221e4b7c40f0000cd"
            },
            {
                _id: "561bb90a9ebb48212ea838c7",
                name: {
                    last: "Svyd",
                    first: "Andriy"
                },
                fullName: "Andriy Svyd",
                id: "561bb90a9ebb48212ea838c7"
            },
            {
                _id: "561bc5ca9ebb48212ea838c8",
                name: {
                    last: "Sokalskiy",
                    first: "Andriy"
                },
                fullName: "Andriy Sokalskiy",
                id: "561bc5ca9ebb48212ea838c8"
            },
            {
                _id: "564da59f9b85f8b16b574fe9",
                name: {
                    last: "Chuprov",
                    first: "Andriy"
                },
                fullName: "Andriy Chuprov",
                id: "564da59f9b85f8b16b574fe9"
            },
            {
                _id: "566fe2348453e8b464b70ba6",
                name: {
                    last: "Lukashchuk",
                    first: "Andriy"
                },
                fullName: "Andriy Lukashchuk",
                id: "566fe2348453e8b464b70ba6"
            },
            {
                _id: "5693b24bd87c9004552b63a1",
                name: {
                    last: "Horak",
                    first: "Andriy"
                },
                fullName: "Andriy Horak",
                id: "5693b24bd87c9004552b63a1"
            },
            {
                _id: "56965733d87c9004552b63be",
                name: {
                    last: "Samokhin",
                    first: "Andriy"
                },
                fullName: "Andriy Samokhin",
                id: "56965733d87c9004552b63be"
            },
            {
                _id: "569cce1dcf1f31f925c026fa",
                name: {
                    last: "Stupchuk",
                    first: "Andriy"
                },
                fullName: "Andriy Stupchuk",
                id: "569cce1dcf1f31f925c026fa"
            },
            {
                _id: "56c19971dfd8a81466e2f6dc",
                name: {
                    last: "Khainus",
                    first: "Andriy"
                },
                fullName: "Andriy Khainus",
                id: "56c19971dfd8a81466e2f6dc"
            },
            {
                _id: "56c59ba4d2b48ede4ba42266",
                name: {
                    last: "Lytvynenko",
                    first: "Andriy"
                },
                fullName: "Andriy Lytvynenko",
                id: "56c59ba4d2b48ede4ba42266"
            },
            {
                _id: "56dd4b727bd21335130c4f95",
                name: {
                    last: "Merentsov",
                    first: "Andriy"
                },
                fullName: "Andriy Merentsov",
                id: "56dd4b727bd21335130c4f95"
            },
            {
                _id: "56dd4d8eea0939141336783f",
                name: {
                    last: "Vasyliev",
                    first: "Andriy"
                },
                fullName: "Andriy Vasyliev",
                id: "56dd4d8eea0939141336783f"
            },
            {
                _id: "55b92ad221e4b7c40f0000b8",
                name: {
                    last: "Lobas",
                    first: "Anna"
                },
                fullName: "Anna Lobas",
                id: "55b92ad221e4b7c40f0000b8"
            },
            {
                _id: "55b92ad221e4b7c40f00006f",
                name: {
                    last: "Karabeinikov",
                    first: "Anton"
                },
                fullName: "Anton Karabeinikov",
                id: "55b92ad221e4b7c40f00006f"
            },
            {
                _id: "55b92ad221e4b7c40f00008c",
                name: {
                    last: "Gychka",
                    first: "Anton"
                },
                fullName: "Anton Gychka",
                id: "55b92ad221e4b7c40f00008c"
            },
            {
                _id: "55b92ad221e4b7c40f000094",
                name: {
                    last: "Yarosh",
                    first: "Anton"
                },
                fullName: "Anton Yarosh",
                id: "55b92ad221e4b7c40f000094"
            },
            {
                _id: "55c0656ad011746b0b000006",
                name: {
                    last: "Nizhegorodov",
                    first: "Anton"
                },
                fullName: "Anton Nizhegorodov",
                id: "55c0656ad011746b0b000006"
            },
            {
                _id: "55b92ad221e4b7c40f000083",
                name: {
                    last: "Zhuk",
                    first: "Antonina"
                },
                fullName: "Antonina Zhuk",
                id: "55b92ad221e4b7c40f000083"
            },
            {
                _id: "5629e27046bca6e4591f4919",
                name: {
                    last: "Petrov",
                    first: "Artem"
                },
                fullName: "Artem Petrov",
                id: "5629e27046bca6e4591f4919"
            },
            {
                _id: "56b9ccd88f23c5696159cd09",
                name: {
                    last: "Antonenko",
                    first: "Artem"
                },
                fullName: "Artem Antonenko",
                id: "56b9ccd88f23c5696159cd09"
            },
            {
                _id: "55b92ad221e4b7c40f000042",
                name: {
                    last: "Myhalko",
                    first: "Artur"
                },
                fullName: "Artur Myhalko",
                id: "55b92ad221e4b7c40f000042"
            },
            {
                _id: "55b92ad221e4b7c40f000032",
                name: {
                    last: "Sakalo",
                    first: "Bogdan"
                },
                fullName: "Bogdan Sakalo",
                id: "55b92ad221e4b7c40f000032"
            },
            {
                _id: "55b92ad221e4b7c40f00005a",
                name: {
                    last: "Cheypesh",
                    first: "Bogdan"
                },
                fullName: "Bogdan Cheypesh",
                id: "55b92ad221e4b7c40f00005a"
            },
            {
                _id: "569e63df044ae38173244cfd",
                name: {
                    last: "Danyliuk",
                    first: "Bogdan"
                },
                fullName: "Bogdan Danyliuk",
                id: "569e63df044ae38173244cfd"
            },
            {
                _id: "56e17661177f76f72edf774c",
                name: {
                    last: "Stets",
                    first: "Bogdana"
                },
                fullName: "Bogdana Stets",
                id: "56e17661177f76f72edf774c"
            },
            {
                _id: "56cc7cb7541812c07197357b",
                name: {
                    last: "Opanasiuk",
                    first: "Bohdana"
                },
                fullName: "Bohdana Opanasiuk",
                id: "56cc7cb7541812c07197357b"
            },
            {
                _id: "55b92ad221e4b7c40f000070",
                name: {
                    last: "Pozhidaev",
                    first: "Daniil"
                },
                fullName: "Daniil Pozhidaev",
                id: "55b92ad221e4b7c40f000070"
            },
            {
                _id: "55b92ad221e4b7c40f0000b1",
                name: {
                    last: "Korniyenko",
                    first: "Daniil"
                },
                fullName: "Daniil Korniyenko",
                id: "55b92ad221e4b7c40f0000b1"
            },
            {
                _id: "55fbcb65f9210c860c000005",
                name: {
                    last: "Shamolina",
                    first: "Daria"
                },
                fullName: "Daria Shamolina",
                id: "55fbcb65f9210c860c000005"
            },
            {
                _id: "55b92ad221e4b7c40f000046",
                name: {
                    last: "Udod",
                    first: "Denis"
                },
                fullName: "Denis Udod",
                id: "55b92ad221e4b7c40f000046"
            },
            {
                _id: "55b92ad221e4b7c40f0000b6",
                name: {
                    last: "Vengrin",
                    first: "Denis"
                },
                fullName: "Denis Vengrin",
                id: "55b92ad221e4b7c40f0000b6"
            },
            {
                _id: "55ca0145cbb0f4910b000009",
                name: {
                    last: "Zinkovskyi",
                    first: "Denis"
                },
                fullName: "Denis Zinkovskyi",
                id: "55ca0145cbb0f4910b000009"
            },
            {
                _id: "55effafa8f1e10e50b000006",
                name: {
                    last: "Pavlenko",
                    first: "Denis"
                },
                fullName: "Denis Pavlenko",
                id: "55effafa8f1e10e50b000006"
            },
            {
                _id: "5640741570bbc2b740ce89ec",
                name: {
                    last: "Lukashov",
                    first: "Denis"
                },
                fullName: "Denis Lukashov",
                id: "5640741570bbc2b740ce89ec"
            },
            {
                _id: "565c2793f4dcd63b5dbd7372",
                name: {
                    last: "Yaremenko",
                    first: "Denis"
                },
                fullName: "Denis Yaremenko",
                id: "565c2793f4dcd63b5dbd7372"
            },
            {
                _id: "566add9aa74aaf316eaea6fc",
                name: {
                    last: "Saranyuk",
                    first: "Denis"
                },
                fullName: "Denis Saranyuk",
                id: "566add9aa74aaf316eaea6fc"
            },
            {
                _id: "55b92ad221e4b7c40f000033",
                name: {
                    last: "Bruso",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Bruso",
                id: "55b92ad221e4b7c40f000033"
            },
            {
                _id: "55b92ad221e4b7c40f00006b",
                name: {
                    last: "Kanivets",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Kanivets",
                id: "55b92ad221e4b7c40f00006b"
            },
            {
                _id: "55b92ad221e4b7c40f000071",
                name: {
                    last: "Masalovich",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Masalovich",
                id: "55b92ad221e4b7c40f000071"
            },
            {
                _id: "55b92ad221e4b7c40f00009f",
                name: {
                    last: "Dzuba",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Dzuba",
                id: "55b92ad221e4b7c40f00009f"
            },
            {
                _id: "55b92ad221e4b7c40f0000bc",
                name: {
                    last: "Demchenko",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Demchenko",
                id: "55b92ad221e4b7c40f0000bc"
            },
            {
                _id: "55cdffa59b42266a4f000015",
                name: {
                    last: "Magar",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Magar",
                id: "55cdffa59b42266a4f000015"
            },
            {
                _id: "5600031ba36a8ca10c000028",
                name: {
                    last: "Mostiv",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Mostiv",
                id: "5600031ba36a8ca10c000028"
            },
            {
                _id: "5614d4c7ab24a83b1dc1a7a8",
                name: {
                    last: "Babilia",
                    first: "Dmytro"
                },
                fullName: "Dmytro Babilia",
                id: "5614d4c7ab24a83b1dc1a7a8"
            },
            {
                _id: "567ac0a48365c9a205406f33",
                name: {
                    last: "Kolochynsky",
                    first: "Dmytro"
                },
                fullName: "Dmytro Kolochynsky",
                id: "567ac0a48365c9a205406f33"
            },
            {
                _id: "564a03d1ad4bc9e53f1f6195",
                name: {
                    last: "Tanchenec",
                    first: "Edgard"
                },
                fullName: "Edgard Tanchenec",
                id: "564a03d1ad4bc9e53f1f6195"
            },
            {
                _id: "55b92ad221e4b7c40f00005b",
                name: {
                    last: "Chori",
                    first: "Eduard"
                },
                fullName: "Eduard Chori",
                id: "55b92ad221e4b7c40f00005b"
            },
            {
                _id: "55b92ad221e4b7c40f000067",
                name: {
                    last: "Rudenko",
                    first: "Eduard"
                },
                fullName: "Eduard Rudenko",
                id: "55b92ad221e4b7c40f000067"
            },
            {
                _id: "55b92ad221e4b7c40f000092",
                name: {
                    last: "Dedenok",
                    first: "Eduard"
                },
                fullName: "Eduard Dedenok",
                id: "55b92ad221e4b7c40f000092"
            },
            {
                _id: "55b92ad221e4b7c40f000066",
                name: {
                    last: "Gromadskiy",
                    first: "Egor"
                },
                fullName: "Egor Gromadskiy",
                id: "55b92ad221e4b7c40f000066"
            },
            {
                _id: "55b92ad221e4b7c40f000041",
                name: {
                    last: "Oleynikov",
                    first: "Eugen"
                },
                fullName: "Eugen Oleynikov",
                id: "55b92ad221e4b7c40f000041"
            },
            {
                _id: "55b92ad221e4b7c40f000072",
                name: {
                    last: "Bernikevich",
                    first: "Eugen"
                },
                fullName: "Eugen Bernikevich",
                id: "55b92ad221e4b7c40f000072"
            },
            {
                _id: "55b92ad221e4b7c40f00008b",
                name: {
                    last: "Ugolkov",
                    first: "Eugen"
                },
                fullName: "Eugen Ugolkov",
                id: "55b92ad221e4b7c40f00008b"
            },
            {
                _id: "55b92ad221e4b7c40f0000a4",
                name: {
                    last: "Sokolenko",
                    first: "Eugen"
                },
                fullName: "Eugen Sokolenko",
                id: "55b92ad221e4b7c40f0000a4"
            },
            {
                _id: "55c32e0d29bd6ccd0b000005",
                name: {
                    last: "Alexeev",
                    first: "Eugen"
                },
                fullName: "Eugen Alexeev",
                id: "55c32e0d29bd6ccd0b000005"
            },
            {
                _id: "55c98aa7cbb0f4910b000005",
                name: {
                    last: "Rechun",
                    first: "Eugen"
                },
                fullName: "Eugen Rechun",
                id: "55c98aa7cbb0f4910b000005"
            },
            {
                _id: "56029cc950de7f4138000005",
                name: {
                    last: "Lendyel",
                    first: "Eugen"
                },
                fullName: "Eugen Lendyel",
                id: "56029cc950de7f4138000005"
            },
            {
                _id: "56e696da81046d9741fb66fc",
                name: {
                    last: "Kovbel",
                    first: "Fedir"
                },
                fullName: "Fedir Kovbel",
                id: "56e696da81046d9741fb66fc"
            },
            {
                _id: "55b92ad221e4b7c40f000090",
                name: {
                    last: "Shterr",
                    first: "Gabriella"
                },
                fullName: "Gabriella Shterr",
                id: "55b92ad221e4b7c40f000090"
            },
            {
                _id: "56b9d3eb8f23c5696159cd0b",
                name: {
                    last: "Mykhailova",
                    first: "Galina"
                },
                fullName: "Galina Mykhailova",
                id: "56b9d3eb8f23c5696159cd0b"
            },
            {
                _id: "56e045e943fcd85c74307060",
                name: {
                    last: "Milchevych",
                    first: "Galina"
                },
                fullName: "Galina Milchevych",
                id: "56e045e943fcd85c74307060"
            },
            {
                _id: "55b92ad221e4b7c40f00003d",
                name: {
                    last: "Kravets",
                    first: "German"
                },
                fullName: "German Kravets",
                id: "55b92ad221e4b7c40f00003d"
            },
            {
                _id: "568158fc9cceae182b907756",
                name: {
                    last: "Belous",
                    first: "Herman"
                },
                fullName: "Herman Belous",
                id: "568158fc9cceae182b907756"
            },
            {
                _id: "55b92ad221e4b7c40f0000a2",
                name: {
                    last: "Stan",
                    first: "Igor"
                },
                fullName: "Igor Stan",
                id: "55b92ad221e4b7c40f0000a2"
            },
            {
                _id: "55b92ad221e4b7c40f0000bb",
                name: {
                    last: "Shepinka",
                    first: "Igor"
                },
                fullName: "Igor Shepinka",
                id: "55b92ad221e4b7c40f0000bb"
            },
            {
                _id: "56966c82d87c9004552b63c7",
                name: {
                    last: "Kuzma",
                    first: "Ihor"
                },
                fullName: "Ihor Kuzma",
                id: "56966c82d87c9004552b63c7"
            },
            {
                _id: "56a0d4b162d172544baf0e3a",
                name: {
                    last: "Ilnytskyi",
                    first: "Ihor"
                },
                fullName: "Ihor Ilnytskyi",
                id: "56a0d4b162d172544baf0e3a"
            },
            {
                _id: "55b92ad221e4b7c40f0000c6",
                name: {
                    last: "Kramarenko",
                    first: "Illia"
                },
                fullName: "Illia Kramarenko",
                id: "55b92ad221e4b7c40f0000c6"
            },
            {
                _id: "55b92ad221e4b7c40f000035",
                name: {
                    last: "Mondok",
                    first: "Ilya"
                },
                fullName: "Ilya Mondok",
                id: "55b92ad221e4b7c40f000035"
            },
            {
                _id: "55b92ad221e4b7c40f000047",
                name: {
                    last: "Khymych",
                    first: "Ilya"
                },
                fullName: "Ilya Khymych",
                id: "55b92ad221e4b7c40f000047"
            },
            {
                _id: "56090fae86e2435a33000008",
                name: {
                    last: "Nukhova",
                    first: "Inna"
                },
                fullName: "Inna Nukhova",
                id: "56090fae86e2435a33000008"
            },
            {
                _id: "55b92ad221e4b7c40f000073",
                name: {
                    last: "Grab",
                    first: "Irina"
                },
                fullName: "Irina Grab",
                id: "55b92ad221e4b7c40f000073"
            },
            {
                _id: "55b92ad221e4b7c40f000034",
                name: {
                    last: "Nazarovich",
                    first: "Ishtvan"
                },
                fullName: "Ishtvan Nazarovich",
                id: "55b92ad221e4b7c40f000034"
            },
            {
                _id: "55b92ad221e4b7c40f00005c",
                name: {
                    last: "Irchak",
                    first: "Ivan"
                },
                fullName: "Ivan Irchak",
                id: "55b92ad221e4b7c40f00005c"
            },
            {
                _id: "55b92ad221e4b7c40f000074",
                name: {
                    last: "Kornyk",
                    first: "Ivan"
                },
                fullName: "Ivan Kornyk",
                id: "55b92ad221e4b7c40f000074"
            },
            {
                _id: "55b92ad221e4b7c40f000087",
                name: {
                    last: "Kostromin",
                    first: "Ivan"
                },
                fullName: "Ivan Kostromin",
                id: "55b92ad221e4b7c40f000087"
            },
            {
                _id: "55b92ad221e4b7c40f00008e",
                name: {
                    last: "Grab",
                    first: "Ivan"
                },
                fullName: "Ivan Grab",
                id: "55b92ad221e4b7c40f00008e"
            },
            {
                _id: "55b92ad221e4b7c40f00009c",
                name: {
                    last: "Feltsan",
                    first: "Ivan"
                },
                fullName: "Ivan Feltsan",
                id: "55b92ad221e4b7c40f00009c"
            },
            {
                _id: "55b92ad221e4b7c40f0000a0",
                name: {
                    last: "Bilak",
                    first: "Ivan"
                },
                fullName: "Ivan Bilak",
                id: "55b92ad221e4b7c40f0000a0"
            },
            {
                _id: "55b92ad221e4b7c40f0000aa",
                name: {
                    last: "Lyashenko",
                    first: "Ivan"
                },
                fullName: "Ivan Lyashenko",
                id: "55b92ad221e4b7c40f0000aa"
            },
            {
                _id: "55b92ad221e4b7c40f0000c8",
                name: {
                    last: "Bizilya",
                    first: "Ivan"
                },
                fullName: "Ivan Bizilya",
                id: "55b92ad221e4b7c40f0000c8"
            },
            {
                _id: "55b92ad221e4b7c40f0000cc",
                name: {
                    last: "Lyakh",
                    first: "Ivan"
                },
                fullName: "Ivan Lyakh",
                id: "55b92ad221e4b7c40f0000cc"
            },
            {
                _id: "55c98b86cbb0f4910b000006",
                name: {
                    last: "Kovalenko",
                    first: "Ivan"
                },
                fullName: "Ivan Kovalenko",
                id: "55c98b86cbb0f4910b000006"
            },
            {
                _id: "55dd71eaf09cc2ec0b000007",
                name: {
                    last: "Khartov",
                    first: "Ivan"
                },
                fullName: "Ivan Khartov",
                id: "55dd71eaf09cc2ec0b000007"
            },
            {
                _id: "56a5ef86aa157ca50f21fb1d",
                name: {
                    last: "Pasichnyuk",
                    first: "Ivan"
                },
                fullName: "Ivan Pasichnyuk",
                id: "56a5ef86aa157ca50f21fb1d"
            },
            {
                _id: "55b92ad221e4b7c40f000048",
                name: {
                    last: "Chupova",
                    first: "Katerina"
                },
                fullName: "Katerina Chupova",
                id: "55b92ad221e4b7c40f000048"
            },
            {
                _id: "55b92ad221e4b7c40f000068",
                name: {
                    last: "Bartish",
                    first: "Katerina"
                },
                fullName: "Katerina Bartish",
                id: "55b92ad221e4b7c40f000068"
            },
            {
                _id: "55b92ad221e4b7c40f00009a",
                name: {
                    last: "Pasichnyuk",
                    first: "Katerina"
                },
                fullName: "Katerina Pasichnyuk",
                id: "55b92ad221e4b7c40f00009a"
            },
            {
                _id: "55b92ad221e4b7c40f0000ab",
                name: {
                    last: "Olkhovik",
                    first: "Katerina"
                },
                fullName: "Katerina Olkhovik",
                id: "55b92ad221e4b7c40f0000ab"
            },
            {
                _id: "55b92ad221e4b7c40f000085",
                name: {
                    last: "Gorbushko",
                    first: "Kirill"
                },
                fullName: "Kirill Gorbushko",
                id: "55b92ad221e4b7c40f000085"
            },
            {
                _id: "55e419094983acdd0b000012",
                name: {
                    last: "Paliiuk",
                    first: "Kirill"
                },
                fullName: "Kirill Paliiuk",
                id: "55e419094983acdd0b000012"
            },
            {
                _id: "56b9d49d8f23c5696159cd0c",
                name: {
                    last: "Bed",
                    first: "Kirill"
                },
                fullName: "Kirill Bed",
                id: "56b9d49d8f23c5696159cd0c"
            },
            {
                _id: "56b2287b99ce8d706a81b2bc",
                name: {
                    last: "Mudrenok",
                    first: "Kostiantyn"
                },
                fullName: "Kostiantyn Mudrenok",
                id: "56b2287b99ce8d706a81b2bc"
            },
            {
                _id: "55d1e234dda01e250c000015",
                name: {
                    last: "Rimar",
                    first: "Kristian"
                },
                fullName: "Kristian Rimar",
                id: "55d1e234dda01e250c000015"
            },
            {
                _id: "55b92ad221e4b7c40f00009b",
                name: {
                    last: "Popp",
                    first: "Larysa"
                },
                fullName: "Larysa Popp",
                id: "55b92ad221e4b7c40f00009b"
            },
            {
                _id: "55b92ad221e4b7c40f000075",
                name: {
                    last: "Gvozdyo",
                    first: "Lilia"
                },
                fullName: "Lilia Gvozdyo",
                id: "55b92ad221e4b7c40f000075"
            },
            {
                _id: "55b92ad221e4b7c40f0000c7",
                name: {
                    last: "Mykhailova",
                    first: "Liliya"
                },
                fullName: "Liliya Mykhailova",
                id: "55b92ad221e4b7c40f0000c7"
            },
            {
                _id: "55bf45cf65cda0810b00000a",
                name: {
                    last: "Shustur",
                    first: "Liliya"
                },
                fullName: "Liliya Shustur",
                id: "55bf45cf65cda0810b00000a"
            },
            {
                _id: "564a0186ad4bc9e53f1f6193",
                name: {
                    last: "Orlenko",
                    first: "Liliya"
                },
                fullName: "Liliya Orlenko",
                id: "564a0186ad4bc9e53f1f6193"
            },
            {
                _id: "56d06aef541812c0719735c8",
                name: {
                    last: "Garagonich",
                    first: "Liza"
                },
                fullName: "Liza Garagonich",
                id: "56d06aef541812c0719735c8"
            },
            {
                _id: "55b92ad221e4b7c40f00005d",
                name: {
                    last: "Gerevich",
                    first: "Lubomir"
                },
                fullName: "Lubomir Gerevich",
                id: "55b92ad221e4b7c40f00005d"
            },
            {
                _id: "55b92ad221e4b7c40f0000c1",
                name: {
                    last: "Zasukhina",
                    first: "Maria"
                },
                fullName: "Maria Zasukhina",
                id: "55b92ad221e4b7c40f0000c1"
            },
            {
                _id: "5684ec1a1fec73d05393a2a4",
                name: {
                    last: "Zaitseva",
                    first: "Maria"
                },
                fullName: "Maria Zaitseva",
                id: "5684ec1a1fec73d05393a2a4"
            },
            {
                _id: "560115cf536bd29228000006",
                name: {
                    last: "Myhalko",
                    first: "Marianna"
                },
                fullName: "Marianna Myhalko",
                id: "560115cf536bd29228000006"
            },
            {
                _id: "55b92ad221e4b7c40f00003f",
                name: {
                    last: "Kubichka",
                    first: "Marina"
                },
                fullName: "Marina Kubichka",
                id: "55b92ad221e4b7c40f00003f"
            },
            {
                _id: "56cdd631541812c071973584",
                name: {
                    last: "Sheverya",
                    first: "Maryna"
                },
                fullName: "Maryna Sheverya",
                id: "56cdd631541812c071973584"
            },
            {
                _id: "55b92ad221e4b7c40f000043",
                name: {
                    last: "Geraschenko",
                    first: "Maxim"
                },
                fullName: "Maxim Geraschenko",
                id: "55b92ad221e4b7c40f000043"
            },
            {
                _id: "55b92ad221e4b7c40f000089",
                name: {
                    last: "Sychov",
                    first: "Maxim"
                },
                fullName: "Maxim Sychov",
                id: "55b92ad221e4b7c40f000089"
            },
            {
                _id: "55b92ad221e4b7c40f0000a5",
                name: {
                    last: "Holubka",
                    first: "Maxim"
                },
                fullName: "Maxim Holubka",
                id: "55b92ad221e4b7c40f0000a5"
            },
            {
                _id: "55c06411d011746b0b000005",
                name: {
                    last: "Rachytskyy",
                    first: "Maxim"
                },
                fullName: "Maxim Rachytskyy",
                id: "55c06411d011746b0b000005"
            },
            {
                _id: "566ada96a74aaf316eaea69d",
                name: {
                    last: "Gladovskyy",
                    first: "Maxim"
                },
                fullName: "Maxim Gladovskyy",
                id: "566ada96a74aaf316eaea69d"
            },
            {
                _id: "55b92ad221e4b7c40f000036",
                name: {
                    last: "Yemets",
                    first: "Michael"
                },
                fullName: "Michael Yemets",
                id: "55b92ad221e4b7c40f000036"
            },
            {
                _id: "55b92ad221e4b7c40f000049",
                name: {
                    last: "Kapustey",
                    first: "Michael"
                },
                fullName: "Michael Kapustey",
                id: "55b92ad221e4b7c40f000049"
            },
            {
                _id: "55b92ad221e4b7c40f000055",
                name: {
                    last: "Rogach",
                    first: "Michael"
                },
                fullName: "Michael Rogach",
                id: "55b92ad221e4b7c40f000055"
            },
            {
                _id: "55b92ad221e4b7c40f00005e",
                name: {
                    last: "Didenko",
                    first: "Michael"
                },
                fullName: "Michael Didenko",
                id: "55b92ad221e4b7c40f00005e"
            },
            {
                _id: "55b92ad221e4b7c40f000069",
                name: {
                    last: "Afendikov",
                    first: "Michael"
                },
                fullName: "Michael Afendikov",
                id: "55b92ad221e4b7c40f000069"
            },
            {
                _id: "55b92ad221e4b7c40f000076",
                name: {
                    last: "Glagola",
                    first: "Michael"
                },
                fullName: "Michael Glagola",
                id: "55b92ad221e4b7c40f000076"
            },
            {
                _id: "55b92ad221e4b7c40f000077",
                name: {
                    last: "Soyma",
                    first: "Michael"
                },
                fullName: "Michael Soyma",
                id: "55b92ad221e4b7c40f000077"
            },
            {
                _id: "55b92ad221e4b7c40f0000b2",
                name: {
                    last: "Yeremenko",
                    first: "Michael"
                },
                fullName: "Michael Yeremenko",
                id: "55b92ad221e4b7c40f0000b2"
            },
            {
                _id: "55b92ad221e4b7c40f0000bd",
                name: {
                    last: "Vashkeba",
                    first: "Michael"
                },
                fullName: "Michael Vashkeba",
                id: "55b92ad221e4b7c40f0000bd"
            },
            {
                _id: "55b92ad221e4b7c40f0000c4",
                name: {
                    last: "Myronyshyn",
                    first: "Michael"
                },
                fullName: "Michael Myronyshyn",
                id: "55b92ad221e4b7c40f0000c4"
            },
            {
                _id: "55b92ad221e4b7c40f0000c5",
                name: {
                    last: "Gajdan",
                    first: "Michael"
                },
                fullName: "Michael Gajdan",
                id: "55b92ad221e4b7c40f0000c5"
            },
            {
                _id: "55dd7776f09cc2ec0b000009",
                name: {
                    last: "Kavka",
                    first: "Michael"
                },
                fullName: "Michael Kavka",
                id: "55dd7776f09cc2ec0b000009"
            },
            {
                _id: "5600042ca36a8ca10c000029",
                name: {
                    last: "Filchak",
                    first: "Michael"
                },
                fullName: "Michael Filchak",
                id: "5600042ca36a8ca10c000029"
            },
            {
                _id: "5667f310a3fc012a68f0d5f5",
                name: {
                    last: "Sopko",
                    first: "Michael"
                },
                fullName: "Michael Sopko",
                id: "5667f310a3fc012a68f0d5f5"
            },
            {
                _id: "56e2b53e896e98a661aa8326",
                name: {
                    last: "Ptitsyn",
                    first: "Michael"
                },
                fullName: "Michael Ptitsyn",
                id: "56e2b53e896e98a661aa8326"
            },
            {
                _id: "56b3412299ce8d706a81b2cd",
                name: {
                    last: "Kholtobin",
                    first: "Mykola"
                },
                fullName: "Mykola Kholtobin",
                id: "56b3412299ce8d706a81b2cd"
            },
            {
                _id: "56cb3695541812c071973546",
                name: {
                    last: "Vasylyna",
                    first: "Mykola"
                },
                fullName: "Mykola Vasylyna",
                id: "56cb3695541812c071973546"
            },
            {
                _id: "565c306af4dcd63b5dbd7373",
                name: {
                    last: "Matrafayilo",
                    first: "Myroslav"
                },
                fullName: "Myroslav Matrafayilo",
                id: "565c306af4dcd63b5dbd7373"
            },
            {
                _id: "55b92ad221e4b7c40f0000b7",
                name: {
                    last: "Polovka",
                    first: "Myroslava"
                },
                fullName: "Myroslava Polovka",
                id: "55b92ad221e4b7c40f0000b7"
            },
            {
                _id: "56bdf283dfd8a81466e2f6d0",
                name: {
                    last: "Shishko",
                    first: "Nadiya"
                },
                fullName: "Nadiya Shishko",
                id: "56bdf283dfd8a81466e2f6d0"
            },
            {
                _id: "56938d2cd87c9004552b639e",
                name: {
                    last: "Makarova",
                    first: "Nastya"
                },
                fullName: "Nastya Makarova",
                id: "56938d2cd87c9004552b639e"
            },
            {
                _id: "561ba8639ebb48212ea838c4",
                name: {
                    last: "Yartysh",
                    first: "Nataliya"
                },
                fullName: "Nataliya Yartysh",
                id: "561ba8639ebb48212ea838c4"
            },
            {
                _id: "566aa49f4f817b7f51746ec0",
                name: {
                    last: "Burtnyk",
                    first: "Nataliya"
                },
                fullName: "Nataliya Burtnyk",
                id: "566aa49f4f817b7f51746ec0"
            },
            {
                _id: "56af32e174d57e0d56d6bee5",
                name: {
                    last: "Sichko",
                    first: "Nataliya"
                },
                fullName: "Nataliya Sichko",
                id: "56af32e174d57e0d56d6bee5"
            },
            {
                _id: "56cdd88b541812c071973585",
                name: {
                    last: "Plovayko",
                    first: "Nelya"
                },
                fullName: "Nelya Plovayko",
                id: "56cdd88b541812c071973585"
            },
            {
                _id: "55b92ad221e4b7c40f0000a6",
                name: {
                    last: "Citrak",
                    first: "Norbert"
                },
                fullName: "Norbert Citrak",
                id: "55b92ad221e4b7c40f0000a6"
            },
            {
                _id: "55b92ad221e4b7c40f0000be",
                name: {
                    last: "Borys",
                    first: "Oksana"
                },
                fullName: "Oksana Borys",
                id: "55b92ad221e4b7c40f0000be"
            },
            {
                _id: "55b92ad221e4b7c40f0000c0",
                name: {
                    last: "Kordas",
                    first: "Oksana"
                },
                fullName: "Oksana Kordas",
                id: "55b92ad221e4b7c40f0000c0"
            },
            {
                _id: "56e0408e4f9ff8e0737d7c52",
                name: {
                    last: "Pylyp",
                    first: "Oksana"
                },
                fullName: "Oksana Pylyp",
                id: "56e0408e4f9ff8e0737d7c52"
            },
            {
                _id: "55b92ad221e4b7c40f00003c",
                name: {
                    last: "Stasiv",
                    first: "Oleg"
                },
                fullName: "Oleg Stasiv",
                id: "55b92ad221e4b7c40f00003c"
            },
            {
                _id: "55b92ad221e4b7c40f00004a",
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                fullName: "Oleg Ostroverkh",
                id: "55b92ad221e4b7c40f00004a"
            },
            {
                _id: "55b92ad221e4b7c40f000078",
                name: {
                    last: "Boyanivskiy",
                    first: "Oleg"
                },
                fullName: "Oleg Boyanivskiy",
                id: "55b92ad221e4b7c40f000078"
            },
            {
                _id: "55b92ad221e4b7c40f00008a",
                name: {
                    last: "Mahobey",
                    first: "Oleg"
                },
                fullName: "Oleg Mahobey",
                id: "55b92ad221e4b7c40f00008a"
            },
            {
                _id: "561ba7039ebb48212ea838c3",
                name: {
                    last: "Maliavska",
                    first: "Oleksandra"
                },
                fullName: "Oleksandra Maliavska",
                id: "561ba7039ebb48212ea838c3"
            },
            {
                _id: "56b9cbb48f23c5696159cd08",
                name: {
                    last: "Kovalenko",
                    first: "Oleksii"
                },
                fullName: "Oleksii Kovalenko",
                id: "56b9cbb48f23c5696159cd08"
            },
            {
                _id: "55b92ad221e4b7c40f000037",
                name: {
                    last: "Shanghin",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Shanghin",
                id: "55b92ad221e4b7c40f000037"
            },
            {
                _id: "55b92ad221e4b7c40f000079",
                name: {
                    last: "Gerasimov",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Gerasimov",
                id: "55b92ad221e4b7c40f000079"
            },
            {
                _id: "55b92ad221e4b7c40f000095",
                name: {
                    last: "Kuropyatnik",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Kuropyatnik",
                id: "55b92ad221e4b7c40f000095"
            },
            {
                _id: "55b92ad221e4b7c40f0000c9",
                name: {
                    last: "Fedosov",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Fedosov",
                id: "55b92ad221e4b7c40f0000c9"
            },
            {
                _id: "56e2b6a21f2850d361927dd8",
                name: {
                    last: "Protsenko",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Protsenko",
                id: "56e2b6a21f2850d361927dd8"
            },
            {
                _id: "55b92ad221e4b7c40f0000b9",
                name: {
                    last: "Melnyk",
                    first: "Olena"
                },
                fullName: "Olena Melnyk",
                id: "55b92ad221e4b7c40f0000b9"
            },
            {
                _id: "55e96ab13f3ae4fd0b000009",
                name: {
                    last: "Pavliuk",
                    first: "Oles"
                },
                fullName: "Oles Pavliuk",
                id: "55e96ab13f3ae4fd0b000009"
            },
            {
                _id: "55b92ad221e4b7c40f0000c3",
                name: {
                    last: "Prokoshkina",
                    first: "Olesia"
                },
                fullName: "Olesia Prokoshkina",
                id: "55b92ad221e4b7c40f0000c3"
            },
            {
                _id: "56123232c90e2fb026ce064b",
                name: {
                    last: "Sikora",
                    first: "Olga"
                },
                fullName: "Olga Sikora",
                id: "56123232c90e2fb026ce064b"
            },
            {
                _id: "55c84a4aaa36a0e60a000005",
                name: {
                    last: "Muratov",
                    first: "Pavlo"
                },
                fullName: "Pavlo Muratov",
                id: "55c84a4aaa36a0e60a000005"
            },
            {
                _id: "56964a03d87c9004552b63ba",
                name: {
                    last: "Skyba",
                    first: "Pavlo"
                },
                fullName: "Pavlo Skyba",
                id: "56964a03d87c9004552b63ba"
            },
            {
                _id: "56a7956faa157ca50f21fb25",
                name: {
                    last: "Demko",
                    first: "Pavlo"
                },
                fullName: "Pavlo Demko",
                id: "56a7956faa157ca50f21fb25"
            },
            {
                _id: "55b92ad221e4b7c40f00005f",
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                fullName: "Peter Voloshchuk",
                id: "55b92ad221e4b7c40f00005f"
            },
            {
                _id: "55e549309624477a0b000005",
                name: {
                    last: "Rospopa",
                    first: "Petro"
                },
                fullName: "Petro Rospopa",
                id: "55e549309624477a0b000005"
            },
            {
                _id: "56cc7ad8541812c071973579",
                name: {
                    last: "Tesliuk",
                    first: "Petro"
                },
                fullName: "Petro Tesliuk",
                id: "56cc7ad8541812c071973579"
            },
            {
                _id: "56a78c75aa157ca50f21fb24",
                name: {
                    last: "Iyber",
                    first: "Renata"
                },
                fullName: "Renata Iyber",
                id: "56a78c75aa157ca50f21fb24"
            },
            {
                _id: "55b92ad221e4b7c40f000051",
                name: {
                    last: "Mozes",
                    first: "Richard"
                },
                fullName: "Richard Mozes",
                id: "55b92ad221e4b7c40f000051"
            },
            {
                _id: "56e298ab5def9136621b7803",
                name: {
                    last: "Shinkovych",
                    first: "Rikhard"
                },
                fullName: "Rikhard Shinkovych",
                id: "56e298ab5def9136621b7803"
            },
            {
                _id: "55b92ad221e4b7c40f00007a",
                name: {
                    last: "Fogash",
                    first: "Robert"
                },
                fullName: "Robert Fogash",
                id: "55b92ad221e4b7c40f00007a"
            },
            {
                _id: "55b92ad221e4b7c40f00004b",
                name: {
                    last: "Katona",
                    first: "Roland"
                },
                fullName: "Roland Katona",
                id: "55b92ad221e4b7c40f00004b"
            },
            {
                _id: "55b92ad221e4b7c40f000038",
                name: {
                    last: "Babunich",
                    first: "Roman"
                },
                fullName: "Roman Babunich",
                id: "55b92ad221e4b7c40f000038"
            },
            {
                _id: "55b92ad221e4b7c40f000060",
                name: {
                    last: "Buchuk",
                    first: "Roman"
                },
                fullName: "Roman Buchuk",
                id: "55b92ad221e4b7c40f000060"
            },
            {
                _id: "55b92ad221e4b7c40f00007b",
                name: {
                    last: "Guti",
                    first: "Roman"
                },
                fullName: "Roman Guti",
                id: "55b92ad221e4b7c40f00007b"
            },
            {
                _id: "55b92ad221e4b7c40f000086",
                name: {
                    last: "Kubichka",
                    first: "Roman"
                },
                fullName: "Roman Kubichka",
                id: "55b92ad221e4b7c40f000086"
            },
            {
                _id: "55b92ad221e4b7c40f0000b0",
                name: {
                    last: "Donchenko",
                    first: "Roman"
                },
                fullName: "Roman Donchenko",
                id: "55b92ad221e4b7c40f0000b0"
            },
            {
                _id: "55dd73d1f09cc2ec0b000008",
                name: {
                    last: "Vizenko",
                    first: "Roman"
                },
                fullName: "Roman Vizenko",
                id: "55dd73d1f09cc2ec0b000008"
            },
            {
                _id: "55eef3fd6dceaee10b000020",
                name: {
                    last: "Saldan",
                    first: "Roman"
                },
                fullName: "Roman Saldan",
                id: "55eef3fd6dceaee10b000020"
            },
            {
                _id: "5667f43da3fc012a68f0d5f6",
                name: {
                    last: "Katsala",
                    first: "Roman"
                },
                fullName: "Roman Katsala",
                id: "5667f43da3fc012a68f0d5f6"
            },
            {
                _id: "568bbdfd5827e3b24d8123a7",
                name: {
                    last: "Chaban",
                    first: "Roman"
                },
                fullName: "Roman Chaban",
                id: "568bbdfd5827e3b24d8123a7"
            },
            {
                _id: "568cd341b2bcba971ba6f5c4",
                name: {
                    last: "Rosul",
                    first: "Roman"
                },
                fullName: "Roman Rosul",
                id: "568cd341b2bcba971ba6f5c4"
            },
            {
                _id: "568cd4c0b2bcba971ba6f5c5",
                name: {
                    last: "Osadchuk",
                    first: "Roman"
                },
                fullName: "Roman Osadchuk",
                id: "568cd4c0b2bcba971ba6f5c5"
            },
            {
                _id: "569e3a73044ae38173244cfb",
                name: {
                    last: "Martyniuk",
                    first: "Roman"
                },
                fullName: "Roman Martyniuk",
                id: "569e3a73044ae38173244cfb"
            },
            {
                _id: "56d5a0c45132d292750a5e7e",
                name: {
                    last: "Ukrainskiy",
                    first: "Rostyslav"
                },
                fullName: "Rostyslav Ukrainskiy",
                id: "56d5a0c45132d292750a5e7e"
            },
            {
                _id: "55b92ad221e4b7c40f000056",
                name: {
                    last: "Labjak",
                    first: "Ruslan"
                },
                fullName: "Ruslan Labjak",
                id: "55b92ad221e4b7c40f000056"
            },
            {
                _id: "55b92ad221e4b7c40f000097",
                name: {
                    last: "Abylgazinov",
                    first: "Samgash"
                },
                fullName: "Samgash Abylgazinov",
                id: "55b92ad221e4b7c40f000097"
            },
            {
                _id: "568cdd375527d6691cb68b22",
                name: {
                    last: "Melnik",
                    first: "Sergey"
                },
                fullName: "Sergey Melnik",
                id: "568cdd375527d6691cb68b22"
            },
            {
                _id: "55b92ad221e4b7c40f000064",
                name: {
                    last: "Tilishevsky",
                    first: "Sergiy"
                },
                fullName: "Sergiy Tilishevsky",
                id: "55b92ad221e4b7c40f000064"
            },
            {
                _id: "55b92ad221e4b7c40f00007c",
                name: {
                    last: "Sheba",
                    first: "Sergiy"
                },
                fullName: "Sergiy Sheba",
                id: "55b92ad221e4b7c40f00007c"
            },
            {
                _id: "55b92ad221e4b7c40f0000a1",
                name: {
                    last: "Stepaniuk",
                    first: "Sergiy"
                },
                fullName: "Sergiy Stepaniuk",
                id: "55b92ad221e4b7c40f0000a1"
            },
            {
                _id: "55d1a2b18f61e2c90b000023",
                name: {
                    last: "Degtyar",
                    first: "Sergiy"
                },
                fullName: "Sergiy Degtyar",
                id: "55d1a2b18f61e2c90b000023"
            },
            {
                _id: "55dd63f8f09cc2ec0b000006",
                name: {
                    last: "Ihnatko",
                    first: "Sergiy"
                },
                fullName: "Sergiy Ihnatko",
                id: "55dd63f8f09cc2ec0b000006"
            },
            {
                _id: "5649b8ccad4bc9e53f1f6192",
                name: {
                    last: "Gevelev",
                    first: "Sergiy"
                },
                fullName: "Sergiy Gevelev",
                id: "5649b8ccad4bc9e53f1f6192"
            },
            {
                _id: "5652dd95c4d12cf51e7f7e0b",
                name: {
                    last: "Petakh",
                    first: "Sergiy"
                },
                fullName: "Sergiy Petakh",
                id: "5652dd95c4d12cf51e7f7e0b"
            },
            {
                _id: "56e17848f625de2a2f9cacd1",
                name: {
                    last: "Biloborodov",
                    first: "Sergiy"
                },
                fullName: "Sergiy Biloborodov",
                id: "56e17848f625de2a2f9cacd1"
            },
            {
                _id: "55b92ad221e4b7c40f00004c",
                name: {
                    last: "Nayda",
                    first: "Sofia"
                },
                fullName: "Sofia Nayda",
                id: "55b92ad221e4b7c40f00004c"
            },
            {
                _id: "56d823e78230197c0e089038",
                name: {
                    last: "Marenych",
                    first: "Sofiya"
                },
                fullName: "Sofiya Marenych",
                id: "56d823e78230197c0e089038"
            },
            {
                _id: "561b756f9ebb48212ea838c0",
                name: {
                    last: "Romanyuk",
                    first: "Stanislav"
                },
                fullName: "Stanislav Romanyuk",
                id: "561b756f9ebb48212ea838c0"
            },
            {
                _id: "55b92ad221e4b7c40f000039",
                name: {
                    last: "Rikun",
                    first: "Stas"
                },
                fullName: "Stas Rikun",
                id: "55b92ad221e4b7c40f000039"
            },
            {
                _id: "55b92ad221e4b7c40f00007d",
                name: {
                    last: "Volskiy",
                    first: "Stas"
                },
                fullName: "Stas Volskiy",
                id: "55b92ad221e4b7c40f00007d"
            },
            {
                _id: "55b92ad221e4b7c40f0000ad",
                name: {
                    last: "Krovspey",
                    first: "Stepan"
                },
                fullName: "Stepan Krovspey",
                id: "55b92ad221e4b7c40f0000ad"
            },
            {
                _id: "55b92ad221e4b7c40f00008d",
                name: {
                    last: "Kira",
                    first: "Svitlana"
                },
                fullName: "Svitlana Kira",
                id: "55b92ad221e4b7c40f00008d"
            },
            {
                _id: "55b92ad221e4b7c40f0000ae",
                name: {
                    last: "Dolottseva",
                    first: "Tamara"
                },
                fullName: "Tamara Dolottseva",
                id: "55b92ad221e4b7c40f0000ae"
            },
            {
                _id: "55b92ad221e4b7c40f000061",
                name: {
                    last: "Mondok",
                    first: "Tamas"
                },
                fullName: "Tamas Mondok",
                id: "55b92ad221e4b7c40f000061"
            },
            {
                _id: "55b92ad221e4b7c40f000050",
                name: {
                    last: "Holovatska",
                    first: "Tamila"
                },
                fullName: "Tamila Holovatska",
                id: "55b92ad221e4b7c40f000050"
            },
            {
                _id: "55b92ad221e4b7c40f00007e",
                name: {
                    last: "Zmiy",
                    first: "Taras"
                },
                fullName: "Taras Zmiy",
                id: "55b92ad221e4b7c40f00007e"
            },
            {
                _id: "564a02e0ad4bc9e53f1f6194",
                name: {
                    last: "Dvorian",
                    first: "Taras"
                },
                fullName: "Taras Dvorian",
                id: "564a02e0ad4bc9e53f1f6194"
            },
            {
                _id: "56813fe29cceae182b907755",
                name: {
                    last: "Ukrainskiy",
                    first: "Taras"
                },
                fullName: "Taras Ukrainskiy",
                id: "56813fe29cceae182b907755"
            },
            {
                _id: "56d9497dae35cc4f0e721074",
                name: {
                    last: "TESTING",
                    first: "Test"
                },
                fullName: "Test TESTING",
                id: "56d9497dae35cc4f0e721074"
            },
            {
                _id: "56cf0928541812c071973593",
                name: {
                    last: "Shepitko",
                    first: "Tetiana"
                },
                fullName: "Tetiana Shepitko",
                id: "56cf0928541812c071973593"
            },
            {
                _id: "55b92ad221e4b7c40f000099",
                name: {
                    last: "Smertina",
                    first: "Tetyana"
                },
                fullName: "Tetyana Smertina",
                id: "55b92ad221e4b7c40f000099"
            },
            {
                _id: "55c98df0cbb0f4910b000007",
                name: {
                    last: "Berezhnoi",
                    first: "Timur"
                },
                fullName: "Timur Berezhnoi",
                id: "55c98df0cbb0f4910b000007"
            },
            {
                _id: "55b92ad221e4b7c40f00006a",
                name: {
                    last: "Tsipf",
                    first: "Vadim"
                },
                fullName: "Vadim Tsipf",
                id: "55b92ad221e4b7c40f00006a"
            },
            {
                _id: "56011186536bd29228000005",
                name: {
                    last: "Khruslov",
                    first: "Valentyn"
                },
                fullName: "Valentyn Khruslov",
                id: "56011186536bd29228000005"
            },
            {
                _id: "561bb5329ebb48212ea838c6",
                name: {
                    last: "Ladomiryak",
                    first: "Valerii"
                },
                fullName: "Valerii Ladomiryak",
                id: "561bb5329ebb48212ea838c6"
            },
            {
                _id: "55b92ad221e4b7c40f0000af",
                name: {
                    last: "Tokareva",
                    first: "Valeriya"
                },
                fullName: "Valeriya Tokareva",
                id: "55b92ad221e4b7c40f0000af"
            },
            {
                _id: "55b92ad221e4b7c40f00007f",
                name: {
                    last: "Klimchenko",
                    first: "Vasilisa"
                },
                fullName: "Vasilisa Klimchenko",
                id: "55b92ad221e4b7c40f00007f"
            },
            {
                _id: "55b92ad221e4b7c40f00003a",
                name: {
                    last: "Agosta",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Agosta",
                id: "55b92ad221e4b7c40f00003a"
            },
            {
                _id: "55b92ad221e4b7c40f000040",
                name: {
                    last: "Almashiy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Almashiy",
                id: "55b92ad221e4b7c40f000040"
            },
            {
                _id: "55b92ad221e4b7c40f000053",
                name: {
                    last: "Seredniy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Seredniy",
                id: "55b92ad221e4b7c40f000053"
            },
            {
                _id: "55b92ad221e4b7c40f000062",
                name: {
                    last: "Cheypesh",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Cheypesh",
                id: "55b92ad221e4b7c40f000062"
            },
            {
                _id: "55b92ad221e4b7c40f000080",
                name: {
                    last: "Barchiy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Barchiy",
                id: "55b92ad221e4b7c40f000080"
            },
            {
                _id: "55b92ad221e4b7c40f000093",
                name: {
                    last: "Lupchey",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Lupchey",
                id: "55b92ad221e4b7c40f000093"
            },
            {
                _id: "55b92ad221e4b7c40f0000b4",
                name: {
                    last: "Prokopyshyn",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Prokopyshyn",
                id: "55b92ad221e4b7c40f0000b4"
            },
            {
                _id: "55d1d860dda01e250c000010",
                name: {
                    last: "Hoshovsky",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Hoshovsky",
                id: "55d1d860dda01e250c000010"
            },
            {
                _id: "55b92ad221e4b7c40f000088",
                name: {
                    last: "Buchok",
                    first: "Viktor"
                },
                fullName: "Viktor Buchok",
                id: "55b92ad221e4b7c40f000088"
            },
            {
                _id: "55b92ad221e4b7c40f000091",
                name: {
                    last: "Kiver",
                    first: "Viktor"
                },
                fullName: "Viktor Kiver",
                id: "55b92ad221e4b7c40f000091"
            },
            {
                _id: "55f9298456f79c9c0c000006",
                name: {
                    last: "Manhur",
                    first: "Viktor"
                },
                fullName: "Viktor Manhur",
                id: "55f9298456f79c9c0c000006"
            },
            {
                _id: "56c2f2a7dfd8a81466e2f71f",
                name: {
                    last: "Mateleshka",
                    first: "Viktor"
                },
                fullName: "Viktor Mateleshka",
                id: "56c2f2a7dfd8a81466e2f71f"
            },
            {
                _id: "5626278d750d38934bfa1313",
                name: {
                    last: "Rogachenko",
                    first: "Viktoria"
                },
                fullName: "Viktoria Rogachenko",
                id: "5626278d750d38934bfa1313"
            },
            {
                _id: "5637710e5d23a8eb04e80aed",
                name: {
                    last: "Kovalenko",
                    first: "Viktoria"
                },
                fullName: "Viktoria Kovalenko",
                id: "5637710e5d23a8eb04e80aed"
            },
            {
                _id: "55b92ad221e4b7c40f00003b",
                name: {
                    last: "Bizilya",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Bizilya",
                id: "55b92ad221e4b7c40f00003b"
            },
            {
                _id: "55b92ad221e4b7c40f00004e",
                name: {
                    last: "Shuba",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Shuba",
                id: "55b92ad221e4b7c40f00004e"
            },
            {
                _id: "55b92ad221e4b7c40f000081",
                name: {
                    last: "Sokhanych",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Sokhanych",
                id: "55b92ad221e4b7c40f000081"
            },
            {
                _id: "55b92ad221e4b7c40f000052",
                name: {
                    last: "Gerasimenko",
                    first: "Vladimir"
                },
                fullName: "Vladimir Gerasimenko",
                id: "55b92ad221e4b7c40f000052"
            },
            {
                _id: "561bb1269ebb48212ea838c5",
                name: {
                    last: "Pogorilyak",
                    first: "Vladimir"
                },
                fullName: "Vladimir Pogorilyak",
                id: "561bb1269ebb48212ea838c5"
            },
            {
                _id: "55eeed546dceaee10b00001e",
                name: {
                    last: "Turytskyi",
                    first: "Vladyslav"
                },
                fullName: "Vladyslav Turytskyi",
                id: "55eeed546dceaee10b00001e"
            },
            {
                _id: "568bbf935827e3b24d8123a8",
                name: {
                    last: "Hamalii",
                    first: "Vladyslav"
                },
                fullName: "Vladyslav Hamalii",
                id: "568bbf935827e3b24d8123a8"
            },
            {
                _id: "55eee9c26dceaee10b00001d",
                name: {
                    last: "Stepanchuk",
                    first: "Volodymyr"
                },
                fullName: "Volodymyr Stepanchuk",
                id: "55eee9c26dceaee10b00001d"
            },
            {
                _id: "55b92ad221e4b7c40f00004d",
                name: {
                    last: "Kopinets",
                    first: "Vyacheslav"
                },
                fullName: "Vyacheslav Kopinets",
                id: "55b92ad221e4b7c40f00004d"
            },
            {
                _id: "55b92ad221e4b7c40f000063",
                name: {
                    last: "Gusti",
                    first: "Yana"
                },
                fullName: "Yana Gusti",
                id: "55b92ad221e4b7c40f000063"
            },
            {
                _id: "55b92ad221e4b7c40f0000ca",
                name: {
                    last: "Vengerova",
                    first: "Yana"
                },
                fullName: "Yana Vengerova",
                id: "55b92ad221e4b7c40f0000ca"
            },
            {
                _id: "55f7c20a6d43203d0c000005",
                name: {
                    last: "Samaryk",
                    first: "Yana"
                },
                fullName: "Yana Samaryk",
                id: "55f7c20a6d43203d0c000005"
            },
            {
                _id: "5602a01550de7f4138000008",
                name: {
                    last: "Dufynets",
                    first: "Yana"
                },
                fullName: "Yana Dufynets",
                id: "5602a01550de7f4138000008"
            },
            {
                _id: "55b92ad221e4b7c40f000082",
                name: {
                    last: "Fuchko",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Fuchko",
                id: "55b92ad221e4b7c40f000082"
            },
            {
                _id: "55b92ad221e4b7c40f0000cf",
                name: {
                    last: "Denysiuk",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Denysiuk",
                id: "55b92ad221e4b7c40f0000cf"
            },
            {
                _id: "568bc0b55827e3b24d8123a9",
                name: {
                    last: "Syrota",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Syrota",
                id: "568bc0b55827e3b24d8123a9"
            },
            {
                _id: "56014cc8536bd29228000007",
                name: {
                    last: "Bezyk",
                    first: "Yevgenia"
                },
                fullName: "Yevgenia Bezyk",
                id: "56014cc8536bd29228000007"
            },
            {
                _id: "56e2e83a74ac46664a83e94b",
                name: {
                    last: "Melnyk",
                    first: "Yevgenia"
                },
                fullName: "Yevgenia Melnyk",
                id: "56e2e83a74ac46664a83e94b"
            },
            {
                _id: "55ed5a437221afe30b000006",
                name: {
                    last: "Porokhnitska",
                    first: "Yulia"
                },
                fullName: "Yulia Porokhnitska",
                id: "55ed5a437221afe30b000006"
            },
            {
                _id: "55b92ad221e4b7c40f000054",
                name: {
                    last: "Derevenko",
                    first: "Yuriy"
                },
                fullName: "Yuriy Derevenko",
                id: "55b92ad221e4b7c40f000054"
            },
            {
                _id: "55b92ad221e4b7c40f000065",
                name: {
                    last: "Sirko",
                    first: "Yuriy"
                },
                fullName: "Yuriy Sirko",
                id: "55b92ad221e4b7c40f000065"
            },
            {
                _id: "55b92ad221e4b7c40f00008f",
                name: {
                    last: "Holovatskyi",
                    first: "Yuriy"
                },
                fullName: "Yuriy Holovatskyi",
                id: "55b92ad221e4b7c40f00008f"
            },
            {
                _id: "55b92ad221e4b7c40f00009d",
                name: {
                    last: "Fedynec",
                    first: "Yuriy"
                },
                fullName: "Yuriy Fedynec",
                id: "55b92ad221e4b7c40f00009d"
            },
            {
                _id: "55f7c3736d43203d0c000006",
                name: {
                    last: "Bodak",
                    first: "Yuriy"
                },
                fullName: "Yuriy Bodak",
                id: "55f7c3736d43203d0c000006"
            },
            {
                _id: "56090d77066d979a33000009",
                name: {
                    last: "Bysaha",
                    first: "Yuriy"
                },
                fullName: "Yuriy Bysaha",
                id: "56090d77066d979a33000009"
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
            },
            {
                _id: "55b92ace21e4b7c40f000010",
                nestingLevel: 1,
                parentDepartment: "56cebdf6541812c07197358f",
                departmentName: "Android"
            },
            {
                _id: "55b92ace21e4b7c40f000014",
                nestingLevel: 1,
                parentDepartment: "56e6775c5ec71b00429745a4",
                departmentName: "BusinessDev"
            },
            {
                _id: "56802e9d1afe27f547b7ba51",
                nestingLevel: 2,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName: "CSS/FrontEnd"
            },
            {
                _id: "55bb1f14cb76ca630b000006",
                nestingLevel: 1,
                parentDepartment: "56cebdf6541812c07197358f",
                departmentName: "Design"
            },
            {
                _id: "56cebdf6541812c07197358f",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "Development"
            },
            {
                _id: "560c0b83a5d4a2e20ba5068c",
                nestingLevel: 1,
                parentDepartment: "56e6775c5ec71b00429745a4",
                departmentName: "Finance"
            },
            {
                _id: "55b92ace21e4b7c40f000015",
                nestingLevel: 1,
                parentDepartment: "56e6775c5ec71b00429745a4",
                departmentName: "HR"
            },
            {
                _id: "56802eb31afe27f547b7ba52",
                nestingLevel: 2,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName: "JS"
            },
            {
                _id: "55b92ace21e4b7c40f000013",
                nestingLevel: 1,
                parentDepartment: "56e6775c5ec71b00429745a4",
                departmentName: "Marketing"
            },
            {
                _id: "56802ec21afe27f547b7ba53",
                nestingLevel: 2,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName: "PHP/WordPress"
            },
            {
                _id: "55bb1f40cb76ca630b000007",
                nestingLevel: 1,
                parentDepartment: "56cebdf6541812c07197358f",
                departmentName: "PM"
            },
            {
                _id: "55b92ace21e4b7c40f000011",
                nestingLevel: 1,
                parentDepartment: "56cebdf6541812c07197358f",
                departmentName: "QA"
            },
            {
                _id: "566ee11b8453e8b464b70b73",
                nestingLevel: 2,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName: "Ruby on Rails"
            },
            {
                _id: "56e175c4d62294582e10ca68",
                nestingLevel: 1,
                parentDepartment: "56cebdf6541812c07197358f",
                departmentName: "Unity"
            },
            {
                _id: "55b92ace21e4b7c40f000016",
                nestingLevel: 1,
                parentDepartment: "56cebdf6541812c07197358f",
                departmentName: "Web"
            },
            {
                _id: "55b92ace21e4b7c40f00000f",
                nestingLevel: 1,
                parentDepartment: "56cebdf6541812c07197358f",
                departmentName: "iOS"
            }
        ]
    };

    var fakeJobPosForDD = {
        data: [
            {
                _id: "55eeeddd6dceaee10b00001f",
                name: "2D Artist"
            },
            {
                _id: "55b92acf21e4b7c40f00002e",
                name: "Account Manager"
            },
            {
                _id: "5603a84fa5ac49794e00001a",
                name: "Accountant"
            },
            {
                _id: "55ddd8a2f09cc2ec0b000030",
                name: "CSS"
            },
            {
                _id: "56011b2d93b361cd28000005",
                name: "Chief Financial Officer"
            },
            {
                _id: "55b92acf21e4b7c40f000025",
                name: "Digital Marketing"
            },
            {
                _id: "56c47d6cd2b48ede4ba42200",
                name: "English teacher"
            },
            {
                _id: "56262666750d38934bfa1312",
                name: "Event/PR manager"
            },
            {
                _id: "55b92acf21e4b7c40f00002a",
                name: "HR Assistant"
            },
            {
                _id: "55b92acf21e4b7c40f000029",
                name: "HR manager"
            },
            {
                _id: "5643483270bbc2b740ce8a16",
                name: "Head of .NET/WP"
            },
            {
                _id: "56b1b2b0d6ef38a708dfc2a2",
                name: "Head of 2D"
            },
            {
                _id: "564438aa70bbc2b740ce8a19",
                name: "Head of Android"
            },
            {
                _id: "55b92acf21e4b7c40f000024",
                name: "Head of Business Development"
            },
            {
                _id: "56249299e9576d1728a9ed24",
                name: "Head of Design"
            },
            {
                _id: "56121847c90e2fb026ce0621",
                name: "Head of JS"
            },
            {
                _id: "55b92acf21e4b7c40f00001e",
                name: "Head of Marketing"
            },
            {
                _id: "564438d470bbc2b740ce8a1a",
                name: "Head of PM"
            },
            {
                _id: "5644388770bbc2b740ce8a18",
                name: "Head of QA"
            },
            {
                _id: "56c1914adfd8a81466e2f6db",
                name: "Head of ROR"
            },
            {
                _id: "564436a370bbc2b740ce8a17",
                name: "Head of iOS"
            },
            {
                _id: "56cc7ba1541812c07197357a",
                name: "IT Researcher"
            },
            {
                _id: "5681592f9cceae182b907757",
                name: "Junior .Net"
            },
            {
                _id: "55b92acf21e4b7c40f000021",
                name: "Junior Android"
            },
            {
                _id: "55b92acf21e4b7c40f000028",
                name: "Junior Designer"
            },
            {
                _id: "55b92acf21e4b7c40f000017",
                name: "Junior JS"
            },
            {
                _id: "55c98fb0cbb0f4910b000008",
                name: "Junior Java"
            },
            {
                _id: "55f7c4a36d43203d0c000007",
                name: "Junior PHP"
            },
            {
                _id: "561b73fb9ebb48212ea838bf",
                name: "Junior PM"
            },
            {
                _id: "55b92acf21e4b7c40f000018",
                name: "Junior QA"
            },
            {
                _id: "566ee0c68453e8b464b70b72",
                name: "Junior Ruby on Rails"
            },
            {
                _id: "55effa248f1e10e50b000005",
                name: "Junior Unity 3D"
            },
            {
                _id: "55b92acf21e4b7c40f00002d",
                name: "Junior WP"
            },
            {
                _id: "56b8b2116c411b590588feb8",
                name: "Junior WordPress"
            },
            {
                _id: "55b92acf21e4b7c40f00002c",
                name: "Junior iOS"
            },
            {
                _id: "56433d7c70bbc2b740ce8a15",
                name: "Middle .NET/WP"
            },
            {
                _id: "55b92acf21e4b7c40f000022",
                name: "Middle Android"
            },
            {
                _id: "55b92acf21e4b7c40f000023",
                name: "Middle Designer"
            },
            {
                _id: "55b92acf21e4b7c40f00001c",
                name: "Middle JS"
            },
            {
                _id: "55dd6259f09cc2ec0b000005",
                name: "Middle PHP"
            },
            {
                _id: "55b92acf21e4b7c40f000019",
                name: "Middle QA"
            },
            {
                _id: "56a9cb6eb4dc0d09232bd72c",
                name: "Middle Ruby on Rails"
            },
            {
                _id: "55c32e2a29bd6ccd0b000006",
                name: "Middle Unity 3D"
            },
            {
                _id: "55b92acf21e4b7c40f00001a",
                name: "Middle WP"
            },
            {
                _id: "56bde14cdfd8a81466e2f5ed",
                name: "Middle WordPress"
            },
            {
                _id: "55b92acf21e4b7c40f00001d",
                name: "Middle iOS"
            },
            {
                _id: "560114ab386dd9ad28000005",
                name: "Office Manager"
            },
            {
                _id: "55bf419165cda0810b000006",
                name: "P.M. Assistant"
            },
            {
                _id: "561b75f89ebb48212ea838c1",
                name: "PM"
            },
            {
                _id: "56b9cd808f23c5696159cd0a",
                name: "PR Manager Assistant"
            },
            {
                _id: "55b92acf21e4b7c40f00001f",
                name: "Sales"
            },
            {
                _id: "55b92acf21e4b7c40f00002f",
                name: "Senior .NET/WP"
            },
            {
                _id: "55b92acf21e4b7c40f000026",
                name: "Senior Android"
            },
            {
                _id: "56b1bea7d6ef38a708dfc2a3",
                name: "Senior Designer"
            },
            {
                _id: "55b92acf21e4b7c40f00002b",
                name: "Senior JS"
            },
            {
                _id: "560ba3a26f2e91ef2ee305f4",
                name: "Senior PM"
            },
            {
                _id: "5600025da36a8ca10c000027",
                name: "Senior SQL"
            },
            {
                _id: "55b92acf21e4b7c40f000027",
                name: "Senior iOS"
            },
            {
                _id: "5629e3c284deb7cb59d61b61",
                name: "Sysadmin"
            },
            {
                _id: "55b92acf21e4b7c40f00001b",
                name: "Tech.writer"
            },
            {
                _id: "55ded360ae2b22730b000043",
                name: "UI Designer"
            },
            {
                _id: "55b92acf21e4b7c40f000020",
                name: "Unity3D"
            }
        ]
    };

    var employeeCollection;
    var view;
    var topBarView;
    var listView;
    var formView;
    var thumbnailView;
    var windowConfirmStub;
    var createView;

    describe('Employees View', function () {
        var $fixture;
        var $elFixture;

        before(function(){
            windowConfirmStub = sinon.stub(window, 'confirm');
        });

        after(function(){
            view.remove();
            topBarView.remove();
            listView.remove();
            formView.remove();
            thumbnailView.remove();
            createView.remove();

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

                view = new MainView({el: $elFixture, contentType: 'Employees'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="42"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="42"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Employees');

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
                var employeeListUrl = new RegExp('\/employees\/list', 'i');

                server.respondWith('GET', employeeListUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployeeForList)]);

                employeeCollection = new EmployeeCollection({
                    count: 100,
                    viewType: 'list',
                    contentType: 'Employees'
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: employeeCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#forImport')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

            it('Try to switch between the viewTypes', function(){
                var $topBarEl = topBarView.$el;
                var $listBtn = $topBarEl.find('#listBtn');
                var $thumbBtn = $topBarEl.find('#thumbBtn');

                $listBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Employees/list');

                $thumbBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Employees/thumbnails');

            });

        });

        describe('Employees list view', function () {
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create Employees listView', function () {
                    var $listHolder;
                    var employeeListUrl = new RegExp('\/employees\/list', 'i');
                    var employeeAlphabetUrl = new RegExp('\/employees\/getEmployeesAlphabet', 'i');

                    server.respondWith('GET', employeeAlphabetUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeAphabet)]);
                    server.respondWith('GET', employeeListUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployeeForList)]);

                    listView = new ListView({
                        collection: employeeCollection,
                        startTime: new Date()
                    });

                    server.respond();
                    //server.respond();

                    $listHolder = listView.$el;

                    expect($listHolder).to.exist;
                    expect($listHolder.find('#searchContainer')).to.exist;
                    expect($listHolder.find('#startLetter')).to.exist;
                    expect($listHolder.find('.pagination')).to.exist;
                });

                it('Try to click on alphabet letter', function(){
                    var $needLetterEl = listView.$el.find('#startLetter > a:nth-child(3)');

                    $needLetterEl.click();

                    expect(window.location.hash).to.be.equals('#easyErp/Employees/list/p=1/c=100/filter=%7B%22letter%22%3A%22A%22%7D');
                });
            });

        });

        describe('Form View', function () {
            var employeeModel;
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

            it('Try to open form', function (done) {
                var $formHolder;
                var employeeUrl = new RegExp('\/employees\/', 'i');
                var workFlowUrl = new RegExp('\/Workflows', 'i');

                employeeModel = new EmployeeModel();

                employeeModel.urlRoot = employeeModel.url() + '56e696da81046d9741fb66fc';

                server.respondWith('GET', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployeeWithId)]);

                employeeModel.fetch({
                    success: function (model) {
                        server.respondWith('GET', workFlowUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                            data: [
                                {
                                    _id: "52d2c1369b57890814000005",
                                    __v: 0,
                                    attachments: [ ],
                                    name: "Contract End",
                                    sequence: 1,
                                    status: "Cancelled",
                                    wId: "Applications",
                                    wName: "",
                                    source: "",
                                    targetSource: [
                                        ""
                                    ],
                                    visible: true,
                                    color: "#2C3E50"
                                }
                            ]
                        })]);

                        formView = new FormView({
                            model: model,
                            startTime: new Date()
                        });

                        server.respond();

                        formView.render();

                        done();
                    },

                    error: function (model, response) {
                        done(response);
                    }
                });

                server.respond();

                $formHolder = formView.$el;

                expect($formHolder).to.exist;
                expect($formHolder.find('form')).to.exist;
                expect($formHolder.find('form').attr('data-id')).to.be.equals('56e696da81046d9741fb66fc');
            });

            it('Try to change tab', function(){
                var $firstTab = formView.$el.find('.chart-tabs li:nth-child(1) > a');
                var $secondTab = formView.$el.find('.chart-tabs li:nth-child(2) > a');

                $firstTab.click();
                expect(formView.$el.find('.chart-tabs li:nth-child(1) > a')).to.have.class('active');

                $secondTab.click();
                expect(formView.$el.find('.chart-tabs li:nth-child(2) > a')).to.have.class('active');
            });

            it('Try to click end contract with Error status', function () {
                var $newSelectEl;
                var employeeUrl = new RegExp('/employees/', 'i');
                var $endContractArrowEl = formView.$el.find('ul > li.right.withEndContract > span.arrow');

                $endContractArrowEl.click();

                $newSelectEl = formView.$el.find('ul > li.right.withEndContract > ul > li:nth-child(1)');
                server.respondWith('PATCH', employeeUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(new Error())]);

                $newSelectEl.click();

                server.respond();

                expect(window.location.hash).to.be.equals('#home');

            });

            it('Try to click end contract', function () {
                var $newSelectEl;
                var employeeUrl = new RegExp('/employees/', 'i');
                var $endContractArrowEl = formView.$el.find('ul > li.right.withEndContract > span.arrow');

                $endContractArrowEl.click();

                $newSelectEl = formView.$el.find('ul > li.right.withEndContract > ul > li:nth-child(1)');
                server.respondWith('PATCH', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);

                $newSelectEl.click();

                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Applications/kanban');

            });

        });

        describe('Thumbnails View', function(){
            var server;
            var mainSpy;
            var $dialogEl;

            before(function () {
                window.location.hash = '#easyErp/Employees/thumbnails';
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
            });

            it('Try to create thumbnails view', function(){
                var $thumbHolder;
                var employeeThumbUrl = new RegExp('\/employees\/thumbnails', 'i');
                var totalCollectionUrl = new RegExp('\/employees\/totalCollectionLength', 'i');
                var employeeAlphabetUrl = new RegExp('\/employees\/getEmployeesAlphabet', 'i');

                server.respondWith('GET', employeeThumbUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({data:[
                    fakeEmployeeForThumb.data[0]
                ]})]);
                server.respondWith('GET', totalCollectionUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                    showMore: true,
                    count: 2
                })]);

                employeeCollection = new EmployeeCollection({
                    count: 1,
                    viewType: 'thumbnails',
                    contentType: 'Employees'
                });

                server.respond();

                server.respondWith('GET', employeeAlphabetUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeAphabet)]);

                thumbnailView = new ThumbnailsView({
                    collection: employeeCollection,
                    startTime: new Date()
                });

                server.respond();

                $thumbHolder = thumbnailView.$el;

                expect($thumbHolder).to.exist;
                expect($thumbHolder.find('#searchContainer')).to.exist;
                expect($thumbHolder.find('#startLetter')).to.exist;
            });

            it('Try to show more employees', function(){
                var $showMoreBtn = thumbnailView.$el.find('#showMore');
                var employeeThumbUrl = new RegExp('\/employees\/thumbnails', 'i');
                var totalCollectionUrl = new RegExp('\/employees\/totalCollectionLength', 'i');
                var $thumbHolder;

                server.respondWith('GET', employeeThumbUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployeeForThumb)]);
                server.respondWith('GET', totalCollectionUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                    showMore: false,
                    count: 2
                })]);

                $showMoreBtn.click();

                server.respond();

                $thumbHolder = thumbnailView.$el;

                expect($thumbHolder).to.exist;

            });

            it('Try to go to EditForm', function(done){
                var employeeModel;
                var editForm;
                var $needEl = thumbnailView.$el.find('#55b92ad221e4b7c40f0000a7');
                var employeeUrl = new RegExp('\/employees\/', 'i');
                var employeePersonsForDDUrl = new RegExp('\/employees\/getPersonsForDd', 'i');
                var depsForDDurl = new RegExp('\/departments\/getForDD', 'i');

                //$needEl.click();

                //todo need to find out why don`t get related urls when emulate click

                employeeModel = new EmployeeModel();

                employeeModel.urlRoot = employeeModel.url() + '55b92ad221e4b7c40f0000a7';
                server.respondWith('GET', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmpWithId)]);

                employeeModel.fetch({
                    success: function(model){
                        server.respondWith('GET', depsForDDurl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDepsForDD)]);

                        editForm = new EditView({
                            model: model
                        });

                        server.respond();

                        done();
                    },
                    error: function(model, response){
                        done(response)
                    }
                });

                server.respond();

                $dialogEl = $('.ui-dialog');

                expect($dialogEl).to.exist;

            });

            it('Try to change tab in Edit Form', function(){
                var $secondTab = $dialogEl.find('ul > li:nth-child(2) > a');

                $secondTab.click();

                expect($dialogEl.find('ul > li:nth-child(2) > a')).to.have.class('active');
            });

            it('Try to Update Job', function(){
                var $updateBtn;
                var $hireDateEl;
                var $salaryEl;
                var $managerEl;
                var $newSelect;
                var $nextBtn;
                var $thirdTab = $dialogEl.find('ul > li:nth-child(3) > a');

                $thirdTab.click();

                $updateBtn = $dialogEl.find('#update');

                $updateBtn.click();

                $hireDateEl = $dialogEl.find('#hire3 > td.editable.hireDate');
                $('.editing').val('24 Sep, 2016');

                $managerEl = $dialogEl.find('#hire3 #departmentsDd');
                $managerEl.click();
                $newSelect = $dialogEl.find('div.newSelectList');
                $nextBtn = $newSelect.find('a.next');
                $nextBtn.click();
                $newSelect.find('#56802ec21afe27f547b7ba53').click();

                $salaryEl = $dialogEl.find('#hire3 > td:nth-child(8)');
                $salaryEl.click();
                $('.editing').val('15000');

                expect($dialogEl.find('#hire3 #departmentsDd').attr('data-id')).to.be.equals('56802ec21afe27f547b7ba53');
                expect($dialogEl.find('#hire3 > td:nth-child(8) > input').val()).to.be.equals('15000');

            });

            it('Try to delete job row', function(){
                var $deleteBtn = $dialogEl.find('.fa-trash');

                $deleteBtn.click();

                expect($dialogEl.find('#hire3')).to.not.exist;
            });

            it('Try to end contract', function(){
                var $newSelectEl;
                var $endContractArrowEl = $dialogEl.find('ul > li.right.withEndContract > span.arrow');

                $endContractArrowEl.click();

                $newSelectEl = $dialogEl.find('ul > li.right.withEndContract > ul > li:nth-child(1)');

                $newSelectEl.click();

                expect($dialogEl.find('#fire1')).to.exist;
            });

            it('Try to save item with fired (must be redirected to kanban)', function(){
                var $saveBtn = $dialogEl.find('button:nth-child(1)');
                var employeeUrl = new RegExp('\/employees\/', 'i');

                server.respondWith('PATCH', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);

                $saveBtn.click();

                server.respond();

                //$dialogEl.remove();

                expect(window.location.hash).to.equals('#easyErp/Applications/kanban');

            });

            it('Try to save item', function(){
                window.location.hash = '#easyErp/Employees/thumbnails';

                var $deleteBtn = $dialogEl.find('.fa-trash');
                var $saveBtn = $dialogEl.find('button:nth-child(1)');
                var employeeUrl = new RegExp('\/employees\/', 'i');

                $deleteBtn.click();

                server.respondWith('PATCH', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);

                $saveBtn.click();

                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Employees/thumbnails');

            });

            it('Try to delete employee', function(){
                var $deleteBtn;
                var $needEl = thumbnailView.$el.find('#55b92ad221e4b7c40f0000a7');
                var employeeUrl = new RegExp('\/employees\/', 'i');

                windowConfirmStub.returns(true);

                server.respondWith('GET', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmpWithId)]);
                $needEl.click();
                server.respond();

                $deleteBtn = $('.ui-dialog button:nth-child(3)');

                server.respondWith('DELETE', employeeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                $deleteBtn.click();
                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Employees');

            });

            it('Try to click alphabetic letter', function(){
                var $needLetterEl = thumbnailView.$el.find('#startLetter > a:nth-child(3)');
                var employeeThumbUrl = new RegExp('\/employees\/thumbnails', 'i');
                var employeeAlphabetUrl = new RegExp('\/employees\/getEmployeesAlphabet', 'i');

                server.respondWith('GET', employeeThumbUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployeeForA)]);
                server.respondWith('GET', employeeAlphabetUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeAphabet)]);

                $needLetterEl.click();

                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Employees/thumbnails/c=100/filter=%7B%22letter%22%3A%22A%22%7D');
            });

            it ('Try to create CreateView', function(){
                var jobPositionUrl = new RegExp('\/jobPositions\/getForDd', 'i');

                server.respondWith('GET', jobPositionUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJobPosForDD)]);

                createView = new CreateView();

                server.respond();

                expect($('.ui-dialog')).to.exist;
            });

            it('Try to change tab in CreateView', function(){
                var $dialogEl = $('.ui-dialog');
                var $firstTab = $dialogEl.find('ul > li:nth-child(1) > a');
                var $secondTab = $dialogEl.find('ul > li:nth-child(2) > a');

                expect($firstTab).to.have.class('active');

                $secondTab.click();

                expect($dialogEl.find('ul > li:nth-child(2) > a')).to.have.class('active');

                $firstTab.click();

                expect($dialogEl.find('ul > li:nth-child(1) > a')).to.have.class('active');

            });

            it('Try to create employee without need data', function(){
                var spyResponse;
                var $createBtnEl = $('#createBtnDialog');

                $createBtnEl.click();
                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');

            });

            it('Try to create employee', function(){
                var $needLiEl;
                var employeeUrl = '/employees/';
                var $createBtnEl = $('#createBtnDialog');
                var $dialogEl = $('.ui-dialog');
                var $firstName = $dialogEl.find('#first');
                var $lastName = $dialogEl.find('#last');
                var $dateOfBirth = $dialogEl.find('#dateBirth');
                var $jobPositionSelect = $dialogEl.find('#jobPositionDd');

                $firstName.val('test');
                $lastName.val('test');
                $dateOfBirth.val('5 Apr, 1991');

                $jobPositionSelect.click();

                $needLiEl = $dialogEl.find('#55eeeddd6dceaee10b00001f');
                $needLiEl.click();

                server.respondWith('POST', employeeUrl, [201, {"Content-Type": "application/json"}, JSON.stringify({})]);
                $createBtnEl.click();
                server.respond();

                $dialogEl.remove();
                expect($('.ui-dialog')).to.not.exist;

            });

        });

    });

});
*/
