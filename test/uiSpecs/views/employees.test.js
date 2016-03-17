define([
    'text!fixtures/index.html',
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
], function (fixtures, EmployeeCollection, MainView, ListView, FormView, ThumbnailsView, CreateView, EditView, TopBarView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var employeeCollection;
    var view;
    var topBarView;
    var listView;

    describe('Employees View', function () {
        var $fixture;
        var $elFixture;

        after(function(){
            view.remove();
            topBarView.remove();
            //listView.remove();
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

        /*describe('Employees list view', function () {
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

                    server.respondWith('GET', employeeListUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployeeForList)]);
                    server.respondWith('GET', employeeAlphabetUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeAphabet)]);

                    listView = new ListView({
                        collection: employeeCollection,
                        startTime: new Date()
                    });

                    server.respond();

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

        });*/

    });

});
