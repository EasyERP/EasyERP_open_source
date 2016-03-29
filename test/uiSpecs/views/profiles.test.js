define([
    'text!fixtures/index.html',
    'collections/Profiles/ProfilesCollection',
    'views/main/MainView',
    'views/Profiles/ContentView',
    'views/Profiles/TopBarView',
    'views/Profiles/CreateView',
    'views/Profiles/ModulesAccessView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, ProfilesCollection, MainView, ContentView, TopBarView,  CreateView, ModulesAccessView, $, chai, chaiJquery, sinonChai, Custom) {
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

    var fakeProfiles = {
        data: [
            {
                _id: 1438768659000,
                __v: 0,
                profileAccess: [
                    {
                        module: {
                            _id: 1,
                            __v: 0,
                            attachments: [ ],
                            link: false,
                            mname: "Settings",
                            parrent: null,
                            sequence: 1000,
                            visible: true,
                            ancestors: [ ],
                            href: "Settings"
                        },
                        _id: "52b0254ead08de381e000002",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 6,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 3,
                            sequence: 41,
                            visible: false,
                            ancestors: [
                                1,
                                3
                            ],
                            href: "Groups"
                        },
                        _id: "52b0254ead08de381e000004",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 7,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Users",
                            parrent: 1,
                            sequence: 42,
                            visible: true,
                            ancestors: [ ],
                            href: "Users"
                        },
                        _id: "52b0254ead08de381e000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 14,
                            attachments: [ ],
                            link: true,
                            mname: "Job Positions",
                            parrent: 9,
                            sequence: 32,
                            visible: true,
                            ancestors: [ ],
                            href: "JobPositions"
                        },
                        _id: "52b0254ead08de381e000007",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 15,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 1,
                            sequence: 33,
                            visible: true,
                            ancestors: [ ],
                            href: "Departments"
                        },
                        _id: "52b0254ead08de381e000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 19,
                            attachments: [ ],
                            link: false,
                            mname: "Sales",
                            parrent: null,
                            sequence: 1,
                            visible: true,
                            ancestors: [ ],
                            href: "Sales"
                        },
                        _id: "52b0254ead08de381e000009",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 24,
                            attachments: [ ],
                            link: true,
                            mname: "Leads",
                            parrent: 19,
                            sequence: 9,
                            visible: true,
                            ancestors: [ ],
                            href: "Leads"
                        },
                        _id: "52b0254ead08de381e00000c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 25,
                            attachments: [ ],
                            link: true,
                            mname: "Opportunities",
                            parrent: 19,
                            sequence: 10,
                            visible: true,
                            ancestors: [ ],
                            href: "Opportunities"
                        },
                        _id: "52b0254ead08de381e00000d",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 36,
                            attachments: [ ],
                            link: false,
                            mname: "Project",
                            parrent: null,
                            sequence: 2,
                            visible: true,
                            ancestors: [ ],
                            href: "Project"
                        },
                        _id: "52b0254ead08de381e000010",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 39,
                            attachments: [ ],
                            link: true,
                            mname: "Projects",
                            parrent: 36,
                            sequence: 23,
                            visible: true,
                            ancestors: [ ],
                            href: "Projects"
                        },
                        _id: "52b0254ead08de381e000011",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 40,
                            attachments: [ ],
                            link: true,
                            mname: "Tasks",
                            parrent: 36,
                            sequence: 24,
                            visible: true,
                            ancestors: [ ],
                            href: "Tasks"
                        },
                        _id: "52b0254ead08de381e000012",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 42,
                            attachments: [ ],
                            link: true,
                            mname: "Employees",
                            parrent: 9,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Employees"
                        },
                        _id: "52b0254ead08de381e000013",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 43,
                            attachments: [ ],
                            link: true,
                            mname: "Applications",
                            parrent: 9,
                            sequence: 30,
                            visible: true,
                            ancestors: [ ],
                            href: "Applications"
                        },
                        _id: "52b0254ead08de381e000014",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 44,
                            attachments: [ ],
                            link: true,
                            mname: "Workflows",
                            parrent: 1,
                            sequence: 44,
                            visible: true,
                            ancestors: [ ],
                            href: "Workflows"
                        },
                        _id: "52b0254ead08de381e000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 49,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Persons",
                            parrent: 19,
                            sequence: 7,
                            visible: true,
                            ancestors: [ ],
                            href: "Persons"
                        },
                        _id: "52b0254ead08de381e000016",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 50,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Companies",
                            parrent: 19,
                            sequence: 8,
                            visible: true,
                            ancestors: [ ],
                            href: "Companies"
                        },
                        _id: "52b0254ead08de381e000017",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 51,
                            attachments: [ ],
                            link: true,
                            mname: "Profiles",
                            parrent: 1,
                            sequence: 51,
                            visible: true,
                            ancestors: [ ],
                            href: "Profiles"
                        },
                        _id: "52b0254ead08de381e000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 52,
                            attachments: [ ],
                            link: true,
                            mname: "Birthdays",
                            parrent: 9,
                            sequence: 52,
                            visible: true,
                            ancestors: [ ],
                            href: "Birthdays"
                        },
                        _id: "52b0254ead08de381e000019",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 29,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 19,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Dashboard"
                        },
                        _id: "55c1de136708490b0b00002c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 53,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 36,
                            sequence: 53,
                            visible: true,
                            ancestors: [ ],
                            href: "projectDashboard"
                        },
                        _id: "52ef6d5f9d8a19c819e19f7f",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 54,
                            mname: "Purchases",
                            sequence: 54,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Purchases"
                        },
                        _id: "55c1de136708490b0b00002b",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 57,
                            mname: "Order",
                            sequence: 56,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Order"
                        },
                        _id: "55c1de136708490b0b00002a",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 56,
                            mname: "Invoice",
                            sequence: 57,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Invoice"
                        },
                        _id: "55c1de136708490b0b000029",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 55,
                            mname: "Quotation",
                            sequence: 55,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Quotation"
                        },
                        _id: "55c1de136708490b0b000028",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 58,
                            mname: "Product",
                            sequence: 58,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Product"
                        },
                        _id: "55c1de136708490b0b000027",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 59,
                            mname: "Accounting",
                            sequence: 59,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Accounting"
                        },
                        _id: "55c1de136708490b0b000026",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 61,
                            mname: "Customer Payments",
                            sequence: 61,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "customerPayments"
                        },
                        _id: "55c1de136708490b0b000025",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 60,
                            mname: "Supplier Payments",
                            sequence: 60,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "supplierPayments"
                        },
                        _id: "55c1de136708490b0b000024",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 62,
                            mname: "Quotation",
                            sequence: 62,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesQuotation"
                        },
                        _id: "55c1de136708490b0b000023",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 63,
                            mname: "Order",
                            sequence: 63,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesOrder"
                        },
                        _id: "55c1de136708490b0b000022",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 64,
                            mname: "Invoice",
                            sequence: 64,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesInvoice"
                        },
                        _id: "55c1de136708490b0b000021",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55c1de136708490b0b000020",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 73,
                            mname: "DashBoardVacation",
                            sequence: 1001,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "DashBoardVacation"
                        },
                        _id: "55c1de136708490b0b00001f",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 71,
                            mname: "Attendance",
                            sequence: 71,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Attendance"
                        },
                        _id: "55c1de136708490b0b00001e",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 72,
                            mname: "BonusType",
                            sequence: 73,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "bonusType"
                        },
                        _id: "55c1de136708490b0b00001d",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 68,
                            mname: "MonthHours",
                            sequence: 68,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "monthHours"
                        },
                        _id: "55c1de136708490b0b00001c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 67,
                            mname: "Revenue",
                            sequence: 67,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "Revenue"
                        },
                        _id: "55c1de136708490b0b00001b",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55c1de136708490b0b00001a",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 75,
                            mname: "tCard",
                            sequence: 1000,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "wTrack"
                        },
                        _id: "55c1de136708490b0b000019",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 69,
                            mname: "Holidays",
                            sequence: 69,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Holiday"
                        },
                        _id: "55c1de136708490b0b000018",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 66,
                            mname: "Payroll Expenses",
                            sequence: 77,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollExpenses"
                        },
                        _id: "55c1de136708490b0b000017",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 70,
                            mname: "Vacation",
                            sequence: 70,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Vacation"
                        },
                        _id: "55c1de136708490b0b000016",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 74,
                            mname: "HrDashboard",
                            sequence: 74,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "HrDashboard"
                        },
                        _id: "55c1de136708490b0b000015",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 9,
                            attachments: [ ],
                            link: false,
                            mname: "HR",
                            parrent: null,
                            sequence: 3,
                            visible: true,
                            ancestors: [ ],
                            href: "HR"
                        },
                        _id: "55c1de136708490b0b000014",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 76,
                            mname: "Efficiency",
                            sequence: 72,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Efficiency"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 77,
                            mname: "Capacity",
                            sequence: 69,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Capacity"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 78,
                            mname: "Payroll",
                            sequence: 78,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Payroll"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 79,
                            mname: "Payroll Payments",
                            sequence: 79,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollPayments"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 82,
                            mname: "Invoice Aging",
                            sequence: 82,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceAging"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 83,
                            mname: "ChartOfAccount",
                            sequence: 83,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "ChartOfAccount"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 84,
                            mname: "Categories",
                            sequence: 1000,
                            parrent: 1,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "productSettings"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 85,
                            mname: "Journal",
                            sequence: 85,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journal"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 86,
                            mname: "Journal Entry",
                            sequence: 86,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journalEntry"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 87,
                            mname: "Invoice Charts",
                            sequence: 87,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceCharts"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 88,
                            mname: "Salary Report",
                            sequence: 69,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salaryReport"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    }
                ],
                profileDescription: "No description",
                profileName: "Finance"
            },
            {
                _id: 1438158808000,
                __v: 0,
                profileAccess: [
                    {
                        _id: "52b024f07fa64ad41e000002",
                        module: {
                            _id: 1,
                            __v: 0,
                            attachments: [ ],
                            link: false,
                            mname: "Settings",
                            parrent: null,
                            sequence: 1000,
                            visible: true,
                            ancestors: [ ],
                            href: "Settings"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000004",
                        module: {
                            _id: 6,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 3,
                            sequence: 41,
                            visible: false,
                            ancestors: [
                                1,
                                3
                            ],
                            href: "Groups"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000005",
                        module: {
                            _id: 7,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Users",
                            parrent: 1,
                            sequence: 42,
                            visible: true,
                            ancestors: [ ],
                            href: "Users"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000007",
                        module: {
                            _id: 14,
                            attachments: [ ],
                            link: true,
                            mname: "Job Positions",
                            parrent: 9,
                            sequence: 32,
                            visible: true,
                            ancestors: [ ],
                            href: "JobPositions"
                        },
                        access: {
                            del: false,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000008",
                        module: {
                            _id: 15,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 1,
                            sequence: 33,
                            visible: true,
                            ancestors: [ ],
                            href: "Departments"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000009",
                        module: {
                            _id: 19,
                            attachments: [ ],
                            link: false,
                            mname: "Sales",
                            parrent: null,
                            sequence: 1,
                            visible: true,
                            ancestors: [ ],
                            href: "Sales"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e00000c",
                        module: {
                            _id: 24,
                            attachments: [ ],
                            link: true,
                            mname: "Leads",
                            parrent: 19,
                            sequence: 9,
                            visible: true,
                            ancestors: [ ],
                            href: "Leads"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e00000d",
                        module: {
                            _id: 25,
                            attachments: [ ],
                            link: true,
                            mname: "Opportunities",
                            parrent: 19,
                            sequence: 10,
                            visible: true,
                            ancestors: [ ],
                            href: "Opportunities"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000010",
                        module: {
                            _id: 36,
                            attachments: [ ],
                            link: false,
                            mname: "Project",
                            parrent: null,
                            sequence: 2,
                            visible: true,
                            ancestors: [ ],
                            href: "Project"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000011",
                        module: {
                            _id: 39,
                            attachments: [ ],
                            link: true,
                            mname: "Projects",
                            parrent: 36,
                            sequence: 23,
                            visible: true,
                            ancestors: [ ],
                            href: "Projects"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000012",
                        module: {
                            _id: 40,
                            attachments: [ ],
                            link: true,
                            mname: "Tasks",
                            parrent: 36,
                            sequence: 24,
                            visible: true,
                            ancestors: [ ],
                            href: "Tasks"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000013",
                        module: {
                            _id: 42,
                            attachments: [ ],
                            link: true,
                            mname: "Employees",
                            parrent: 9,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Employees"
                        },
                        access: {
                            del: false,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000014",
                        module: {
                            _id: 43,
                            attachments: [ ],
                            link: true,
                            mname: "Applications",
                            parrent: 9,
                            sequence: 30,
                            visible: true,
                            ancestors: [ ],
                            href: "Applications"
                        },
                        access: {
                            del: false,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000015",
                        module: {
                            _id: 44,
                            attachments: [ ],
                            link: true,
                            mname: "Workflows",
                            parrent: 1,
                            sequence: 44,
                            visible: true,
                            ancestors: [ ],
                            href: "Workflows"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000016",
                        module: {
                            _id: 49,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Persons",
                            parrent: 19,
                            sequence: 7,
                            visible: true,
                            ancestors: [ ],
                            href: "Persons"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000017",
                        module: {
                            _id: 50,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Companies",
                            parrent: 19,
                            sequence: 8,
                            visible: true,
                            ancestors: [ ],
                            href: "Companies"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000018",
                        module: {
                            _id: 51,
                            attachments: [ ],
                            link: true,
                            mname: "Profiles",
                            parrent: 1,
                            sequence: 51,
                            visible: true,
                            ancestors: [ ],
                            href: "Profiles"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52b024f07fa64ad41e000019",
                        module: {
                            _id: 52,
                            attachments: [ ],
                            link: true,
                            mname: "Birthdays",
                            parrent: 9,
                            sequence: 52,
                            visible: true,
                            ancestors: [ ],
                            href: "Birthdays"
                        },
                        access: {
                            del: false,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400001f",
                        module: {
                            _id: 29,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 19,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Dashboard"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "52ef6d5f9d8a19c819e19f7e",
                        module: {
                            _id: 53,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 36,
                            sequence: 53,
                            visible: true,
                            ancestors: [ ],
                            href: "projectDashboard"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400001e",
                        module: {
                            _id: 54,
                            mname: "Purchases",
                            sequence: 54,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Purchases"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400001d",
                        module: {
                            _id: 57,
                            mname: "Order",
                            sequence: 56,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Order"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400001c",
                        module: {
                            _id: 56,
                            mname: "Invoice",
                            sequence: 57,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Invoice"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400001b",
                        module: {
                            _id: 55,
                            mname: "Quotation",
                            sequence: 55,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Quotation"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400001a",
                        module: {
                            _id: 58,
                            mname: "Product",
                            sequence: 58,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Product"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000019",
                        module: {
                            _id: 59,
                            mname: "Accounting",
                            sequence: 59,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Accounting"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000018",
                        module: {
                            _id: 61,
                            mname: "Customer Payments",
                            sequence: 61,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "customerPayments"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000017",
                        module: {
                            _id: 60,
                            mname: "Supplier Payments",
                            sequence: 60,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "supplierPayments"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000016",
                        module: {
                            _id: 62,
                            mname: "Quotation",
                            sequence: 62,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesQuotation"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000015",
                        module: {
                            _id: 63,
                            mname: "Order",
                            sequence: 63,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesOrder"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000014",
                        module: {
                            _id: 64,
                            mname: "Invoice",
                            sequence: 64,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesInvoice"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000013",
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000012",
                        module: {
                            _id: 73,
                            mname: "DashBoardVacation",
                            sequence: 1001,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "DashBoardVacation"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000011",
                        module: {
                            _id: 71,
                            mname: "Attendance",
                            sequence: 71,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Attendance"
                        },
                        access: {
                            del: false,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000010",
                        module: {
                            _id: 72,
                            mname: "BonusType",
                            sequence: 73,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "bonusType"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400000f",
                        module: {
                            _id: 68,
                            mname: "MonthHours",
                            sequence: 68,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "monthHours"
                        },
                        access: {
                            del: false,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400000e",
                        module: {
                            _id: 67,
                            mname: "Revenue",
                            sequence: 67,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "Revenue"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400000d",
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400000c",
                        module: {
                            _id: 75,
                            mname: "tCard",
                            sequence: 1000,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "wTrack"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c2400000a",
                        module: {
                            _id: 69,
                            mname: "Holidays",
                            sequence: 69,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Holiday"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000008",
                        module: {
                            _id: 66,
                            mname: "Payroll Expenses",
                            sequence: 77,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollExpenses"
                        },
                        access: {
                            del: false,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000006",
                        module: {
                            _id: 70,
                            mname: "Vacation",
                            sequence: 70,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Vacation"
                        },
                        access: {
                            del: false,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "55b790eaa5ebea2c24000005",
                        module: {
                            _id: 74,
                            mname: "HrDashboard",
                            sequence: 74,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "HrDashboard"
                        },
                        access: {
                            del: false,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "55b89f6ddf6af7240d000007",
                        module: {
                            _id: 9,
                            attachments: [ ],
                            link: false,
                            mname: "HR",
                            parrent: null,
                            sequence: 3,
                            visible: true,
                            ancestors: [ ],
                            href: "HR"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "560543257b2cc8f567000006",
                        module: {
                            _id: 76,
                            mname: "Efficiency",
                            sequence: 72,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Efficiency"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 77,
                            mname: "Capacity",
                            sequence: 69,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Capacity"
                        },
                        _id: "569fa13362d172544baf0dac",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        _id: "569fa13362d172544baf0dab",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 78,
                            mname: "Payroll",
                            sequence: 78,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Payroll"
                        },
                        _id: "569fa13362d172544baf0daa",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 79,
                            mname: "Payroll Payments",
                            sequence: 79,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollPayments"
                        },
                        _id: "569fa13362d172544baf0da9",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        _id: "569fa13362d172544baf0da8",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 82,
                            mname: "Invoice Aging",
                            sequence: 82,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceAging"
                        },
                        _id: "569fa13362d172544baf0da7",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 83,
                            mname: "ChartOfAccount",
                            sequence: 83,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "ChartOfAccount"
                        },
                        _id: "569fa13362d172544baf0da6",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 84,
                            mname: "Categories",
                            sequence: 1000,
                            parrent: 1,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "productSettings"
                        },
                        _id: "569fa13362d172544baf0da5",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 85,
                            mname: "Journal",
                            sequence: 85,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journal"
                        },
                        _id: "569fa13362d172544baf0da4",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 86,
                            mname: "Journal Entry",
                            sequence: 86,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journalEntry"
                        },
                        _id: "569fa13362d172544baf0da3",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 87,
                            mname: "Invoice Charts",
                            sequence: 87,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceCharts"
                        },
                        _id: "569fa13362d172544baf0da2",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 88,
                            mname: "Salary Report",
                            sequence: 69,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salaryReport"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    }
                ],
                profileDescription: "No description",
                profileName: "HR"
            },
            {
                _id: 1445088919000,
                __v: 0,
                profileAccess: [
                    {
                        module: {
                            _id: 1,
                            __v: 0,
                            attachments: [ ],
                            link: false,
                            mname: "Settings",
                            parrent: null,
                            sequence: 1000,
                            visible: true,
                            ancestors: [ ],
                            href: "Settings"
                        },
                        _id: "52b024f07fa64ad41e000002",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 6,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 3,
                            sequence: 41,
                            visible: false,
                            ancestors: [
                                1,
                                3
                            ],
                            href: "Groups"
                        },
                        _id: "52b024f07fa64ad41e000004",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 7,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Users",
                            parrent: 1,
                            sequence: 42,
                            visible: true,
                            ancestors: [ ],
                            href: "Users"
                        },
                        _id: "52b024f07fa64ad41e000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 14,
                            attachments: [ ],
                            link: true,
                            mname: "Job Positions",
                            parrent: 9,
                            sequence: 32,
                            visible: true,
                            ancestors: [ ],
                            href: "JobPositions"
                        },
                        _id: "52b024f07fa64ad41e000007",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 15,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 1,
                            sequence: 33,
                            visible: true,
                            ancestors: [ ],
                            href: "Departments"
                        },
                        _id: "52b024f07fa64ad41e000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 19,
                            attachments: [ ],
                            link: false,
                            mname: "Sales",
                            parrent: null,
                            sequence: 1,
                            visible: true,
                            ancestors: [ ],
                            href: "Sales"
                        },
                        _id: "52b024f07fa64ad41e000009",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 24,
                            attachments: [ ],
                            link: true,
                            mname: "Leads",
                            parrent: 19,
                            sequence: 9,
                            visible: true,
                            ancestors: [ ],
                            href: "Leads"
                        },
                        _id: "52b024f07fa64ad41e00000c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 25,
                            attachments: [ ],
                            link: true,
                            mname: "Opportunities",
                            parrent: 19,
                            sequence: 10,
                            visible: true,
                            ancestors: [ ],
                            href: "Opportunities"
                        },
                        _id: "52b024f07fa64ad41e00000d",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 36,
                            attachments: [ ],
                            link: false,
                            mname: "Project",
                            parrent: null,
                            sequence: 2,
                            visible: true,
                            ancestors: [ ],
                            href: "Project"
                        },
                        _id: "52b024f07fa64ad41e000010",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 39,
                            attachments: [ ],
                            link: true,
                            mname: "Projects",
                            parrent: 36,
                            sequence: 23,
                            visible: true,
                            ancestors: [ ],
                            href: "Projects"
                        },
                        _id: "52b024f07fa64ad41e000011",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 40,
                            attachments: [ ],
                            link: true,
                            mname: "Tasks",
                            parrent: 36,
                            sequence: 24,
                            visible: true,
                            ancestors: [ ],
                            href: "Tasks"
                        },
                        _id: "52b024f07fa64ad41e000012",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 42,
                            attachments: [ ],
                            link: true,
                            mname: "Employees",
                            parrent: 9,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Employees"
                        },
                        _id: "52b024f07fa64ad41e000013",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 43,
                            attachments: [ ],
                            link: true,
                            mname: "Applications",
                            parrent: 9,
                            sequence: 30,
                            visible: true,
                            ancestors: [ ],
                            href: "Applications"
                        },
                        _id: "52b024f07fa64ad41e000014",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 44,
                            attachments: [ ],
                            link: true,
                            mname: "Workflows",
                            parrent: 1,
                            sequence: 44,
                            visible: true,
                            ancestors: [ ],
                            href: "Workflows"
                        },
                        _id: "52b024f07fa64ad41e000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 49,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Persons",
                            parrent: 19,
                            sequence: 7,
                            visible: true,
                            ancestors: [ ],
                            href: "Persons"
                        },
                        _id: "52b024f07fa64ad41e000016",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 50,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Companies",
                            parrent: 19,
                            sequence: 8,
                            visible: true,
                            ancestors: [ ],
                            href: "Companies"
                        },
                        _id: "52b024f07fa64ad41e000017",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 51,
                            attachments: [ ],
                            link: true,
                            mname: "Profiles",
                            parrent: 1,
                            sequence: 51,
                            visible: true,
                            ancestors: [ ],
                            href: "Profiles"
                        },
                        _id: "52b024f07fa64ad41e000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 52,
                            attachments: [ ],
                            link: true,
                            mname: "Birthdays",
                            parrent: 9,
                            sequence: 52,
                            visible: true,
                            ancestors: [ ],
                            href: "Birthdays"
                        },
                        _id: "52b024f07fa64ad41e000019",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 29,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 19,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Dashboard"
                        },
                        _id: "55b790eaa5ebea2c2400001f",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 53,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 36,
                            sequence: 53,
                            visible: true,
                            ancestors: [ ],
                            href: "projectDashboard"
                        },
                        _id: "52ef6d5f9d8a19c819e19f7e",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 54,
                            mname: "Purchases",
                            sequence: 54,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Purchases"
                        },
                        _id: "55b790eaa5ebea2c2400001e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 57,
                            mname: "Order",
                            sequence: 56,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Order"
                        },
                        _id: "55b790eaa5ebea2c2400001d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 56,
                            mname: "Invoice",
                            sequence: 57,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Invoice"
                        },
                        _id: "55b790eaa5ebea2c2400001c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 55,
                            mname: "Quotation",
                            sequence: 55,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Quotation"
                        },
                        _id: "55b790eaa5ebea2c2400001b",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 58,
                            mname: "Product",
                            sequence: 58,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Product"
                        },
                        _id: "55b790eaa5ebea2c2400001a",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 59,
                            mname: "Accounting",
                            sequence: 59,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Accounting"
                        },
                        _id: "55b790eaa5ebea2c24000019",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 61,
                            mname: "Customer Payments",
                            sequence: 61,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "customerPayments"
                        },
                        _id: "55b790eaa5ebea2c24000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 60,
                            mname: "Supplier Payments",
                            sequence: 60,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "supplierPayments"
                        },
                        _id: "55b790eaa5ebea2c24000017",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 62,
                            mname: "Quotation",
                            sequence: 62,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesQuotation"
                        },
                        _id: "55b790eaa5ebea2c24000016",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 63,
                            mname: "Order",
                            sequence: 63,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesOrder"
                        },
                        _id: "55b790eaa5ebea2c24000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 64,
                            mname: "Invoice",
                            sequence: 64,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesInvoice"
                        },
                        _id: "55b790eaa5ebea2c24000014",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b790eaa5ebea2c24000013",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 73,
                            mname: "DashBoardVacation",
                            sequence: 1001,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "DashBoardVacation"
                        },
                        _id: "55b790eaa5ebea2c24000012",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 71,
                            mname: "Attendance",
                            sequence: 71,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Attendance"
                        },
                        _id: "55b790eaa5ebea2c24000011",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 72,
                            mname: "BonusType",
                            sequence: 73,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "bonusType"
                        },
                        _id: "55b790eaa5ebea2c24000010",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 68,
                            mname: "MonthHours",
                            sequence: 68,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "monthHours"
                        },
                        _id: "55b790eaa5ebea2c2400000f",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 67,
                            mname: "Revenue",
                            sequence: 67,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "Revenue"
                        },
                        _id: "55b790eaa5ebea2c2400000e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b790eaa5ebea2c2400000d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 75,
                            mname: "tCard",
                            sequence: 1000,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "wTrack"
                        },
                        _id: "55b790eaa5ebea2c2400000c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 69,
                            mname: "Holidays",
                            sequence: 69,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Holiday"
                        },
                        _id: "55b790eaa5ebea2c2400000a",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 66,
                            mname: "Payroll Expenses",
                            sequence: 77,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollExpenses"
                        },
                        _id: "55b790eaa5ebea2c24000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 70,
                            mname: "Vacation",
                            sequence: 70,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Vacation"
                        },
                        _id: "55b790eaa5ebea2c24000006",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 74,
                            mname: "HrDashboard",
                            sequence: 74,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "HrDashboard"
                        },
                        _id: "55b790eaa5ebea2c24000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 9,
                            attachments: [ ],
                            link: false,
                            mname: "HR",
                            parrent: null,
                            sequence: 3,
                            visible: true,
                            ancestors: [ ],
                            href: "HR"
                        },
                        _id: "55b89f3fdf6af7240d000005",
                        access: {
                            del: true,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56224effc558b13c1bbf875b",
                        module: {
                            _id: 76,
                            mname: "Efficiency",
                            sequence: 72,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Efficiency"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56224effc558b13c1bbf875a",
                        module: {
                            _id: 77,
                            mname: "Capacity",
                            sequence: 69,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Capacity"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        _id: "56b8a435d54899a905ae0223",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 78,
                            mname: "Payroll",
                            sequence: 78,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Payroll"
                        },
                        _id: "56b8a435d54899a905ae0222",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 79,
                            mname: "Payroll Payments",
                            sequence: 79,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollPayments"
                        },
                        _id: "56b8a435d54899a905ae0221",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        _id: "56b8a435d54899a905ae0220",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 82,
                            mname: "Invoice Aging",
                            sequence: 82,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceAging"
                        },
                        _id: "56b8a435d54899a905ae021f",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 83,
                            mname: "ChartOfAccount",
                            sequence: 83,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "ChartOfAccount"
                        },
                        _id: "56b8a435d54899a905ae021e",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 84,
                            mname: "Categories",
                            sequence: 1000,
                            parrent: 1,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "productSettings"
                        },
                        _id: "56b8a435d54899a905ae021d",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 85,
                            mname: "Journal",
                            sequence: 85,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journal"
                        },
                        _id: "56b8a435d54899a905ae021c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 86,
                            mname: "Journal Entry",
                            sequence: 86,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journalEntry"
                        },
                        _id: "56b8a435d54899a905ae021b",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 87,
                            mname: "Invoice Charts",
                            sequence: 87,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceCharts"
                        },
                        _id: "56b8a435d54899a905ae021a",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 88,
                            mname: "Salary Report",
                            sequence: 69,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salaryReport"
                        },
                        _id: "56b8a435d54899a905ae0219",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    }
                ],
                profileDescription: "No description",
                profileName: "Marketing"
            },
            {
                _id: 1444991193000,
                __v: 0,
                profileAccess: [
                    {
                        module: {
                            _id: 1,
                            __v: 0,
                            attachments: [ ],
                            link: false,
                            mname: "Settings",
                            parrent: null,
                            sequence: 1000,
                            visible: true,
                            ancestors: [ ],
                            href: "Settings"
                        },
                        _id: "52b024f07fa64ad41e000002",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 6,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 3,
                            sequence: 41,
                            visible: false,
                            ancestors: [
                                1,
                                3
                            ],
                            href: "Groups"
                        },
                        _id: "52b024f07fa64ad41e000004",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 7,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Users",
                            parrent: 1,
                            sequence: 42,
                            visible: true,
                            ancestors: [ ],
                            href: "Users"
                        },
                        _id: "52b024f07fa64ad41e000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 14,
                            attachments: [ ],
                            link: true,
                            mname: "Job Positions",
                            parrent: 9,
                            sequence: 32,
                            visible: true,
                            ancestors: [ ],
                            href: "JobPositions"
                        },
                        _id: "52b024f07fa64ad41e000007",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 15,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 1,
                            sequence: 33,
                            visible: true,
                            ancestors: [ ],
                            href: "Departments"
                        },
                        _id: "52b024f07fa64ad41e000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 19,
                            attachments: [ ],
                            link: false,
                            mname: "Sales",
                            parrent: null,
                            sequence: 1,
                            visible: true,
                            ancestors: [ ],
                            href: "Sales"
                        },
                        _id: "52b024f07fa64ad41e000009",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 24,
                            attachments: [ ],
                            link: true,
                            mname: "Leads",
                            parrent: 19,
                            sequence: 9,
                            visible: true,
                            ancestors: [ ],
                            href: "Leads"
                        },
                        _id: "52b024f07fa64ad41e00000c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 25,
                            attachments: [ ],
                            link: true,
                            mname: "Opportunities",
                            parrent: 19,
                            sequence: 10,
                            visible: true,
                            ancestors: [ ],
                            href: "Opportunities"
                        },
                        _id: "52b024f07fa64ad41e00000d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 36,
                            attachments: [ ],
                            link: false,
                            mname: "Project",
                            parrent: null,
                            sequence: 2,
                            visible: true,
                            ancestors: [ ],
                            href: "Project"
                        },
                        _id: "52b024f07fa64ad41e000010",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 39,
                            attachments: [ ],
                            link: true,
                            mname: "Projects",
                            parrent: 36,
                            sequence: 23,
                            visible: true,
                            ancestors: [ ],
                            href: "Projects"
                        },
                        _id: "52b024f07fa64ad41e000011",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 40,
                            attachments: [ ],
                            link: true,
                            mname: "Tasks",
                            parrent: 36,
                            sequence: 24,
                            visible: true,
                            ancestors: [ ],
                            href: "Tasks"
                        },
                        _id: "52b024f07fa64ad41e000012",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 42,
                            attachments: [ ],
                            link: true,
                            mname: "Employees",
                            parrent: 9,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Employees"
                        },
                        _id: "52b024f07fa64ad41e000013",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 43,
                            attachments: [ ],
                            link: true,
                            mname: "Applications",
                            parrent: 9,
                            sequence: 30,
                            visible: true,
                            ancestors: [ ],
                            href: "Applications"
                        },
                        _id: "52b024f07fa64ad41e000014",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 44,
                            attachments: [ ],
                            link: true,
                            mname: "Workflows",
                            parrent: 1,
                            sequence: 44,
                            visible: true,
                            ancestors: [ ],
                            href: "Workflows"
                        },
                        _id: "52b024f07fa64ad41e000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 49,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Persons",
                            parrent: 19,
                            sequence: 7,
                            visible: true,
                            ancestors: [ ],
                            href: "Persons"
                        },
                        _id: "52b024f07fa64ad41e000016",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 50,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Companies",
                            parrent: 19,
                            sequence: 8,
                            visible: true,
                            ancestors: [ ],
                            href: "Companies"
                        },
                        _id: "52b024f07fa64ad41e000017",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 51,
                            attachments: [ ],
                            link: true,
                            mname: "Profiles",
                            parrent: 1,
                            sequence: 51,
                            visible: true,
                            ancestors: [ ],
                            href: "Profiles"
                        },
                        _id: "52b024f07fa64ad41e000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 52,
                            attachments: [ ],
                            link: true,
                            mname: "Birthdays",
                            parrent: 9,
                            sequence: 52,
                            visible: true,
                            ancestors: [ ],
                            href: "Birthdays"
                        },
                        _id: "52b024f07fa64ad41e000019",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 29,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 19,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Dashboard"
                        },
                        _id: "55b790eaa5ebea2c2400001f",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 53,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 36,
                            sequence: 53,
                            visible: true,
                            ancestors: [ ],
                            href: "projectDashboard"
                        },
                        _id: "52ef6d5f9d8a19c819e19f7e",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 54,
                            mname: "Purchases",
                            sequence: 54,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Purchases"
                        },
                        _id: "55b790eaa5ebea2c2400001e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 57,
                            mname: "Order",
                            sequence: 56,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Order"
                        },
                        _id: "55b790eaa5ebea2c2400001d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 56,
                            mname: "Invoice",
                            sequence: 57,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Invoice"
                        },
                        _id: "55b790eaa5ebea2c2400001c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 55,
                            mname: "Quotation",
                            sequence: 55,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Quotation"
                        },
                        _id: "55b790eaa5ebea2c2400001b",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 58,
                            mname: "Product",
                            sequence: 58,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Product"
                        },
                        _id: "55b790eaa5ebea2c2400001a",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 59,
                            mname: "Accounting",
                            sequence: 59,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Accounting"
                        },
                        _id: "55b790eaa5ebea2c24000019",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 61,
                            mname: "Customer Payments",
                            sequence: 61,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "customerPayments"
                        },
                        _id: "55b790eaa5ebea2c24000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 60,
                            mname: "Supplier Payments",
                            sequence: 60,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "supplierPayments"
                        },
                        _id: "55b790eaa5ebea2c24000017",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 62,
                            mname: "Quotation",
                            sequence: 62,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesQuotation"
                        },
                        _id: "55b790eaa5ebea2c24000016",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 63,
                            mname: "Order",
                            sequence: 63,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesOrder"
                        },
                        _id: "55b790eaa5ebea2c24000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 64,
                            mname: "Invoice",
                            sequence: 64,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesInvoice"
                        },
                        _id: "55b790eaa5ebea2c24000014",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b790eaa5ebea2c24000013",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 73,
                            mname: "DashBoardVacation",
                            sequence: 1001,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "DashBoardVacation"
                        },
                        _id: "55b790eaa5ebea2c24000012",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 71,
                            mname: "Attendance",
                            sequence: 71,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Attendance"
                        },
                        _id: "55b790eaa5ebea2c24000011",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 72,
                            mname: "BonusType",
                            sequence: 73,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "bonusType"
                        },
                        _id: "55b790eaa5ebea2c24000010",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 68,
                            mname: "MonthHours",
                            sequence: 68,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "monthHours"
                        },
                        _id: "55b790eaa5ebea2c2400000f",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 67,
                            mname: "Revenue",
                            sequence: 67,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "Revenue"
                        },
                        _id: "55b790eaa5ebea2c2400000e",
                        access: {
                            del: false,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b790eaa5ebea2c2400000d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 75,
                            mname: "tCard",
                            sequence: 1000,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "wTrack"
                        },
                        _id: "55b790eaa5ebea2c2400000c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 69,
                            mname: "Holidays",
                            sequence: 69,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Holiday"
                        },
                        _id: "55b790eaa5ebea2c2400000a",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 66,
                            mname: "Payroll Expenses",
                            sequence: 77,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollExpenses"
                        },
                        _id: "55b790eaa5ebea2c24000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 70,
                            mname: "Vacation",
                            sequence: 70,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Vacation"
                        },
                        _id: "55b790eaa5ebea2c24000006",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 74,
                            mname: "HrDashboard",
                            sequence: 74,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "HrDashboard"
                        },
                        _id: "55b790eaa5ebea2c24000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 9,
                            attachments: [ ],
                            link: false,
                            mname: "HR",
                            parrent: null,
                            sequence: 3,
                            visible: true,
                            ancestors: [ ],
                            href: "HR"
                        },
                        _id: "55b89f3fdf6af7240d000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 76,
                            mname: "Efficiency",
                            sequence: 72,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Efficiency"
                        },
                        _id: "5620d146d6c741e8235f4302",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 77,
                            mname: "Capacity",
                            sequence: 69,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Capacity"
                        },
                        _id: "5620d146d6c741e8235f4301",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        _id: "56b8a464d54899a905ae022e",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 78,
                            mname: "Payroll",
                            sequence: 78,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Payroll"
                        },
                        _id: "56b8a464d54899a905ae022d",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 79,
                            mname: "Payroll Payments",
                            sequence: 79,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollPayments"
                        },
                        _id: "56b8a464d54899a905ae022c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        _id: "56b8a464d54899a905ae022b",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 82,
                            mname: "Invoice Aging",
                            sequence: 82,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceAging"
                        },
                        _id: "56b8a464d54899a905ae022a",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 83,
                            mname: "ChartOfAccount",
                            sequence: 83,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "ChartOfAccount"
                        },
                        _id: "56b8a464d54899a905ae0229",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 84,
                            mname: "Categories",
                            sequence: 1000,
                            parrent: 1,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "productSettings"
                        },
                        _id: "56b8a464d54899a905ae0228",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 85,
                            mname: "Journal",
                            sequence: 85,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journal"
                        },
                        _id: "56b8a464d54899a905ae0227",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 86,
                            mname: "Journal Entry",
                            sequence: 86,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journalEntry"
                        },
                        _id: "56b8a464d54899a905ae0226",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 87,
                            mname: "Invoice Charts",
                            sequence: 87,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceCharts"
                        },
                        _id: "56b8a464d54899a905ae0225",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 88,
                            mname: "Salary Report",
                            sequence: 69,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salaryReport"
                        },
                        _id: "56b8a464d54899a905ae0224",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    }
                ],
                profileDescription: "Project Management",
                profileName: "PM"
            },
            {
                _id: 1438158771000,
                __v: 0,
                profileAccess: [
                    {
                        module: {
                            _id: 1,
                            __v: 0,
                            attachments: [ ],
                            link: false,
                            mname: "Settings",
                            parrent: null,
                            sequence: 1000,
                            visible: true,
                            ancestors: [ ],
                            href: "Settings"
                        },
                        _id: "52b0254ead08de381e000002",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 6,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 3,
                            sequence: 41,
                            visible: false,
                            ancestors: [
                                1,
                                3
                            ],
                            href: "Groups"
                        },
                        _id: "52b0254ead08de381e000004",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 7,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Users",
                            parrent: 1,
                            sequence: 42,
                            visible: true,
                            ancestors: [ ],
                            href: "Users"
                        },
                        _id: "52b0254ead08de381e000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 14,
                            attachments: [ ],
                            link: true,
                            mname: "Job Positions",
                            parrent: 9,
                            sequence: 32,
                            visible: true,
                            ancestors: [ ],
                            href: "JobPositions"
                        },
                        _id: "52b0254ead08de381e000007",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 15,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 1,
                            sequence: 33,
                            visible: true,
                            ancestors: [ ],
                            href: "Departments"
                        },
                        _id: "52b0254ead08de381e000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 19,
                            attachments: [ ],
                            link: false,
                            mname: "Sales",
                            parrent: null,
                            sequence: 1,
                            visible: true,
                            ancestors: [ ],
                            href: "Sales"
                        },
                        _id: "52b0254ead08de381e000009",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 24,
                            attachments: [ ],
                            link: true,
                            mname: "Leads",
                            parrent: 19,
                            sequence: 9,
                            visible: true,
                            ancestors: [ ],
                            href: "Leads"
                        },
                        _id: "52b0254ead08de381e00000c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 25,
                            attachments: [ ],
                            link: true,
                            mname: "Opportunities",
                            parrent: 19,
                            sequence: 10,
                            visible: true,
                            ancestors: [ ],
                            href: "Opportunities"
                        },
                        _id: "52b0254ead08de381e00000d",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 36,
                            attachments: [ ],
                            link: false,
                            mname: "Project",
                            parrent: null,
                            sequence: 2,
                            visible: true,
                            ancestors: [ ],
                            href: "Project"
                        },
                        _id: "52b0254ead08de381e000010",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 39,
                            attachments: [ ],
                            link: true,
                            mname: "Projects",
                            parrent: 36,
                            sequence: 23,
                            visible: true,
                            ancestors: [ ],
                            href: "Projects"
                        },
                        _id: "52b0254ead08de381e000011",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 40,
                            attachments: [ ],
                            link: true,
                            mname: "Tasks",
                            parrent: 36,
                            sequence: 24,
                            visible: true,
                            ancestors: [ ],
                            href: "Tasks"
                        },
                        _id: "52b0254ead08de381e000012",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 42,
                            attachments: [ ],
                            link: true,
                            mname: "Employees",
                            parrent: 9,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Employees"
                        },
                        _id: "52b0254ead08de381e000013",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 43,
                            attachments: [ ],
                            link: true,
                            mname: "Applications",
                            parrent: 9,
                            sequence: 30,
                            visible: true,
                            ancestors: [ ],
                            href: "Applications"
                        },
                        _id: "52b0254ead08de381e000014",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 44,
                            attachments: [ ],
                            link: true,
                            mname: "Workflows",
                            parrent: 1,
                            sequence: 44,
                            visible: true,
                            ancestors: [ ],
                            href: "Workflows"
                        },
                        _id: "52b0254ead08de381e000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 49,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Persons",
                            parrent: 19,
                            sequence: 7,
                            visible: true,
                            ancestors: [ ],
                            href: "Persons"
                        },
                        _id: "52b0254ead08de381e000016",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 50,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Companies",
                            parrent: 19,
                            sequence: 8,
                            visible: true,
                            ancestors: [ ],
                            href: "Companies"
                        },
                        _id: "52b0254ead08de381e000017",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 51,
                            attachments: [ ],
                            link: true,
                            mname: "Profiles",
                            parrent: 1,
                            sequence: 51,
                            visible: true,
                            ancestors: [ ],
                            href: "Profiles"
                        },
                        _id: "52b0254ead08de381e000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 52,
                            attachments: [ ],
                            link: true,
                            mname: "Birthdays",
                            parrent: 9,
                            sequence: 52,
                            visible: true,
                            ancestors: [ ],
                            href: "Birthdays"
                        },
                        _id: "52b0254ead08de381e000019",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 29,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 19,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Dashboard"
                        },
                        _id: "55b88fc39ea5a7142b00003a",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 53,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 36,
                            sequence: 53,
                            visible: true,
                            ancestors: [ ],
                            href: "projectDashboard"
                        },
                        _id: "52ef6d5f9d8a19c819e19f7f",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 54,
                            mname: "Purchases",
                            sequence: 54,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Purchases"
                        },
                        _id: "55b88fc39ea5a7142b000039",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 57,
                            mname: "Order",
                            sequence: 56,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Order"
                        },
                        _id: "55b88fc39ea5a7142b000038",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 56,
                            mname: "Invoice",
                            sequence: 57,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Invoice"
                        },
                        _id: "55b88fc39ea5a7142b000037",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 55,
                            mname: "Quotation",
                            sequence: 55,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Quotation"
                        },
                        _id: "55b88fc39ea5a7142b000036",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 58,
                            mname: "Product",
                            sequence: 58,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Product"
                        },
                        _id: "55b88fc39ea5a7142b000035",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 59,
                            mname: "Accounting",
                            sequence: 59,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Accounting"
                        },
                        _id: "55b88fc39ea5a7142b000034",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 61,
                            mname: "Customer Payments",
                            sequence: 61,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "customerPayments"
                        },
                        _id: "55b88fc39ea5a7142b000033",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 60,
                            mname: "Supplier Payments",
                            sequence: 60,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "supplierPayments"
                        },
                        _id: "55b88fc39ea5a7142b000032",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 62,
                            mname: "Quotation",
                            sequence: 62,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesQuotation"
                        },
                        _id: "55b88fc39ea5a7142b000031",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 63,
                            mname: "Order",
                            sequence: 63,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesOrder"
                        },
                        _id: "55b88fc39ea5a7142b000030",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 64,
                            mname: "Invoice",
                            sequence: 64,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesInvoice"
                        },
                        _id: "55b88fc39ea5a7142b00002f",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b88fc39ea5a7142b00002e",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 73,
                            mname: "DashBoardVacation",
                            sequence: 1001,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "DashBoardVacation"
                        },
                        _id: "55b88fc39ea5a7142b00002d",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 71,
                            mname: "Attendance",
                            sequence: 71,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Attendance"
                        },
                        _id: "55b88fc39ea5a7142b00002c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 72,
                            mname: "BonusType",
                            sequence: 73,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "bonusType"
                        },
                        _id: "55b88fc39ea5a7142b00002b",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 68,
                            mname: "MonthHours",
                            sequence: 68,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "monthHours"
                        },
                        _id: "55b88fc39ea5a7142b00002a",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 67,
                            mname: "Revenue",
                            sequence: 67,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "Revenue"
                        },
                        _id: "55b88fc39ea5a7142b000029",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b88fc39ea5a7142b000028",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 75,
                            mname: "tCard",
                            sequence: 1000,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "wTrack"
                        },
                        _id: "55b88fc39ea5a7142b000027",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 69,
                            mname: "Holidays",
                            sequence: 69,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Holiday"
                        },
                        _id: "55b88fc39ea5a7142b000025",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 66,
                            mname: "Payroll Expenses",
                            sequence: 77,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollExpenses"
                        },
                        _id: "55b88fc39ea5a7142b000023",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 70,
                            mname: "Vacation",
                            sequence: 70,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Vacation"
                        },
                        _id: "55b88fc39ea5a7142b000021",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 74,
                            mname: "HrDashboard",
                            sequence: 74,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "HrDashboard"
                        },
                        _id: "55b88fc39ea5a7142b000020",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 9,
                            attachments: [ ],
                            link: false,
                            mname: "HR",
                            parrent: null,
                            sequence: 3,
                            visible: true,
                            ancestors: [ ],
                            href: "HR"
                        },
                        _id: "55b89f57df6af7240d000006",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "56225080c558b13c1bbf8763",
                        module: {
                            _id: 76,
                            mname: "Efficiency",
                            sequence: 72,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Efficiency"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "56225080c558b13c1bbf8762",
                        module: {
                            _id: 77,
                            mname: "Capacity",
                            sequence: 69,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Capacity"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        _id: "569fa895897940204bdd4a07",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 78,
                            mname: "Payroll",
                            sequence: 78,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Payroll"
                        },
                        _id: "569fa895897940204bdd4a06",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 79,
                            mname: "Payroll Payments",
                            sequence: 79,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollPayments"
                        },
                        _id: "569fa895897940204bdd4a05",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        _id: "569fa895897940204bdd4a04",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 82,
                            mname: "Invoice Aging",
                            sequence: 82,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceAging"
                        },
                        _id: "569fa895897940204bdd4a03",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 83,
                            mname: "ChartOfAccount",
                            sequence: 83,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "ChartOfAccount"
                        },
                        _id: "569fa895897940204bdd4a02",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 84,
                            mname: "Categories",
                            sequence: 1000,
                            parrent: 1,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "productSettings"
                        },
                        _id: "569fa895897940204bdd4a01",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 85,
                            mname: "Journal",
                            sequence: 85,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journal"
                        },
                        _id: "569fa895897940204bdd4a00",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 86,
                            mname: "Journal Entry",
                            sequence: 86,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journalEntry"
                        },
                        _id: "569fa895897940204bdd49ff",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 87,
                            mname: "Invoice Charts",
                            sequence: 87,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceCharts"
                        },
                        _id: "569fa895897940204bdd49fe",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 88,
                            mname: "Salary Report",
                            sequence: 69,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salaryReport"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    }
                ],
                profileDescription: "No description",
                profileName: "SalesAccount"
            },
            {
                _id: 1438325949000,
                __v: 0,
                profileAccess: [
                    {
                        module: {
                            _id: 1,
                            __v: 0,
                            attachments: [ ],
                            link: false,
                            mname: "Settings",
                            parrent: null,
                            sequence: 1000,
                            visible: true,
                            ancestors: [ ],
                            href: "Settings"
                        },
                        _id: "52b024f07fa64ad41e000002",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 6,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 3,
                            sequence: 41,
                            visible: false,
                            ancestors: [
                                1,
                                3
                            ],
                            href: "Groups"
                        },
                        _id: "52b024f07fa64ad41e000004",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 7,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Users",
                            parrent: 1,
                            sequence: 42,
                            visible: true,
                            ancestors: [ ],
                            href: "Users"
                        },
                        _id: "52b024f07fa64ad41e000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 14,
                            attachments: [ ],
                            link: true,
                            mname: "Job Positions",
                            parrent: 9,
                            sequence: 32,
                            visible: true,
                            ancestors: [ ],
                            href: "JobPositions"
                        },
                        _id: "52b024f07fa64ad41e000007",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 15,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 1,
                            sequence: 33,
                            visible: true,
                            ancestors: [ ],
                            href: "Departments"
                        },
                        _id: "52b024f07fa64ad41e000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 19,
                            attachments: [ ],
                            link: false,
                            mname: "Sales",
                            parrent: null,
                            sequence: 1,
                            visible: true,
                            ancestors: [ ],
                            href: "Sales"
                        },
                        _id: "52b024f07fa64ad41e000009",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 24,
                            attachments: [ ],
                            link: true,
                            mname: "Leads",
                            parrent: 19,
                            sequence: 9,
                            visible: true,
                            ancestors: [ ],
                            href: "Leads"
                        },
                        _id: "52b024f07fa64ad41e00000c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 25,
                            attachments: [ ],
                            link: true,
                            mname: "Opportunities",
                            parrent: 19,
                            sequence: 10,
                            visible: true,
                            ancestors: [ ],
                            href: "Opportunities"
                        },
                        _id: "52b024f07fa64ad41e00000d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 36,
                            attachments: [ ],
                            link: false,
                            mname: "Project",
                            parrent: null,
                            sequence: 2,
                            visible: true,
                            ancestors: [ ],
                            href: "Project"
                        },
                        _id: "52b024f07fa64ad41e000010",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 39,
                            attachments: [ ],
                            link: true,
                            mname: "Projects",
                            parrent: 36,
                            sequence: 23,
                            visible: true,
                            ancestors: [ ],
                            href: "Projects"
                        },
                        _id: "52b024f07fa64ad41e000011",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 40,
                            attachments: [ ],
                            link: true,
                            mname: "Tasks",
                            parrent: 36,
                            sequence: 24,
                            visible: true,
                            ancestors: [ ],
                            href: "Tasks"
                        },
                        _id: "52b024f07fa64ad41e000012",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 42,
                            attachments: [ ],
                            link: true,
                            mname: "Employees",
                            parrent: 9,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Employees"
                        },
                        _id: "52b024f07fa64ad41e000013",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 43,
                            attachments: [ ],
                            link: true,
                            mname: "Applications",
                            parrent: 9,
                            sequence: 30,
                            visible: true,
                            ancestors: [ ],
                            href: "Applications"
                        },
                        _id: "52b024f07fa64ad41e000014",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 44,
                            attachments: [ ],
                            link: true,
                            mname: "Workflows",
                            parrent: 1,
                            sequence: 44,
                            visible: true,
                            ancestors: [ ],
                            href: "Workflows"
                        },
                        _id: "52b024f07fa64ad41e000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 49,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Persons",
                            parrent: 19,
                            sequence: 7,
                            visible: true,
                            ancestors: [ ],
                            href: "Persons"
                        },
                        _id: "52b024f07fa64ad41e000016",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 50,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Companies",
                            parrent: 19,
                            sequence: 8,
                            visible: true,
                            ancestors: [ ],
                            href: "Companies"
                        },
                        _id: "52b024f07fa64ad41e000017",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 51,
                            attachments: [ ],
                            link: true,
                            mname: "Profiles",
                            parrent: 1,
                            sequence: 51,
                            visible: true,
                            ancestors: [ ],
                            href: "Profiles"
                        },
                        _id: "52b024f07fa64ad41e000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 52,
                            attachments: [ ],
                            link: true,
                            mname: "Birthdays",
                            parrent: 9,
                            sequence: 52,
                            visible: true,
                            ancestors: [ ],
                            href: "Birthdays"
                        },
                        _id: "52b024f07fa64ad41e000019",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 29,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 19,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Dashboard"
                        },
                        _id: "55b790eaa5ebea2c2400001f",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 53,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 36,
                            sequence: 53,
                            visible: true,
                            ancestors: [ ],
                            href: "projectDashboard"
                        },
                        _id: "52ef6d5f9d8a19c819e19f7e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 54,
                            mname: "Purchases",
                            sequence: 54,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Purchases"
                        },
                        _id: "55b790eaa5ebea2c2400001e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 57,
                            mname: "Order",
                            sequence: 56,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Order"
                        },
                        _id: "55b790eaa5ebea2c2400001d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 56,
                            mname: "Invoice",
                            sequence: 57,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Invoice"
                        },
                        _id: "55b790eaa5ebea2c2400001c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 55,
                            mname: "Quotation",
                            sequence: 55,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Quotation"
                        },
                        _id: "55b790eaa5ebea2c2400001b",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 58,
                            mname: "Product",
                            sequence: 58,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Product"
                        },
                        _id: "55b790eaa5ebea2c2400001a",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 59,
                            mname: "Accounting",
                            sequence: 59,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Accounting"
                        },
                        _id: "55b790eaa5ebea2c24000019",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 61,
                            mname: "Customer Payments",
                            sequence: 61,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "customerPayments"
                        },
                        _id: "55b790eaa5ebea2c24000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 60,
                            mname: "Supplier Payments",
                            sequence: 60,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "supplierPayments"
                        },
                        _id: "55b790eaa5ebea2c24000017",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 62,
                            mname: "Quotation",
                            sequence: 62,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesQuotation"
                        },
                        _id: "55b790eaa5ebea2c24000016",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 63,
                            mname: "Order",
                            sequence: 63,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesOrder"
                        },
                        _id: "55b790eaa5ebea2c24000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 64,
                            mname: "Invoice",
                            sequence: 64,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesInvoice"
                        },
                        _id: "55b790eaa5ebea2c24000014",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b790eaa5ebea2c24000013",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 73,
                            mname: "DashBoardVacation",
                            sequence: 1001,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "DashBoardVacation"
                        },
                        _id: "55b790eaa5ebea2c24000012",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 71,
                            mname: "Attendance",
                            sequence: 71,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Attendance"
                        },
                        _id: "55b790eaa5ebea2c24000011",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 72,
                            mname: "BonusType",
                            sequence: 73,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "bonusType"
                        },
                        _id: "55b790eaa5ebea2c24000010",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 68,
                            mname: "MonthHours",
                            sequence: 68,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "monthHours"
                        },
                        _id: "55b790eaa5ebea2c2400000f",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 67,
                            mname: "Revenue",
                            sequence: 67,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "Revenue"
                        },
                        _id: "55b790eaa5ebea2c2400000e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b790eaa5ebea2c2400000d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 75,
                            mname: "tCard",
                            sequence: 1000,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "wTrack"
                        },
                        _id: "55b790eaa5ebea2c2400000c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 69,
                            mname: "Holidays",
                            sequence: 69,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Holiday"
                        },
                        _id: "55b790eaa5ebea2c2400000a",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 66,
                            mname: "Payroll Expenses",
                            sequence: 77,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollExpenses"
                        },
                        _id: "55b790eaa5ebea2c24000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 70,
                            mname: "Vacation",
                            sequence: 70,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Vacation"
                        },
                        _id: "55b790eaa5ebea2c24000006",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 74,
                            mname: "HrDashboard",
                            sequence: 74,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "HrDashboard"
                        },
                        _id: "55b790eaa5ebea2c24000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 9,
                            attachments: [ ],
                            link: false,
                            mname: "HR",
                            parrent: null,
                            sequence: 3,
                            visible: true,
                            ancestors: [ ],
                            href: "HR"
                        },
                        _id: "55b89f3fdf6af7240d000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 76,
                            mname: "Efficiency",
                            sequence: 72,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Efficiency"
                        },
                        _id: "560d0c26963ba3087363de93",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 77,
                            mname: "Capacity",
                            sequence: 69,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Capacity"
                        },
                        _id: "560d0c26963ba3087363de92",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "569e1e61ea21e2ac7d729e2a",
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "569e1e61ea21e2ac7d729e29",
                        module: {
                            _id: 78,
                            mname: "Payroll",
                            sequence: 78,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Payroll"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "569e1e61ea21e2ac7d729e28",
                        module: {
                            _id: 79,
                            mname: "Payroll Payments",
                            sequence: 79,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollPayments"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "569e1e61ea21e2ac7d729e27",
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "569e1e61ea21e2ac7d729e26",
                        module: {
                            _id: 82,
                            mname: "Invoice Aging",
                            sequence: 82,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceAging"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "569e1e61ea21e2ac7d729e25",
                        module: {
                            _id: 83,
                            mname: "ChartOfAccount",
                            sequence: 83,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "ChartOfAccount"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "569e1e61ea21e2ac7d729e24",
                        module: {
                            _id: 84,
                            mname: "Categories",
                            sequence: 1000,
                            parrent: 1,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "productSettings"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "569e1e61ea21e2ac7d729e23",
                        module: {
                            _id: 85,
                            mname: "Journal",
                            sequence: 85,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journal"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "569e1e61ea21e2ac7d729e22",
                        module: {
                            _id: 86,
                            mname: "Journal Entry",
                            sequence: 86,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journalEntry"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        _id: "569e1e61ea21e2ac7d729e21",
                        module: {
                            _id: 87,
                            mname: "Invoice Charts",
                            sequence: 87,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceCharts"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 88,
                            mname: "Salary Report",
                            sequence: 69,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salaryReport"
                        },
                        _id: "56b8a47bd54899a905ae022f",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    }
                ],
                profileDescription: "No description",
                profileName: "Usual"
            },
            {
                _id: 1387275598000,
                __v: 0,
                attachments: [ ],
                profileAccess: [
                    {
                        module: {
                            _id: 1,
                            __v: 0,
                            attachments: [ ],
                            link: false,
                            mname: "Settings",
                            parrent: null,
                            sequence: 1000,
                            visible: true,
                            ancestors: [ ],
                            href: "Settings"
                        },
                        _id: "52b0254ead08de381e000002",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 6,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 3,
                            sequence: 41,
                            visible: false,
                            ancestors: [
                                1,
                                3
                            ],
                            href: "Groups"
                        },
                        _id: "52b0254ead08de381e000004",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 7,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Users",
                            parrent: 1,
                            sequence: 42,
                            visible: true,
                            ancestors: [ ],
                            href: "Users"
                        },
                        _id: "52b0254ead08de381e000005",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 14,
                            attachments: [ ],
                            link: true,
                            mname: "Job Positions",
                            parrent: 9,
                            sequence: 32,
                            visible: true,
                            ancestors: [ ],
                            href: "JobPositions"
                        },
                        _id: "52b0254ead08de381e000007",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 15,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 1,
                            sequence: 33,
                            visible: true,
                            ancestors: [ ],
                            href: "Departments"
                        },
                        _id: "52b0254ead08de381e000008",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 19,
                            attachments: [ ],
                            link: false,
                            mname: "Sales",
                            parrent: null,
                            sequence: 1,
                            visible: true,
                            ancestors: [ ],
                            href: "Sales"
                        },
                        _id: "52b0254ead08de381e000009",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 24,
                            attachments: [ ],
                            link: true,
                            mname: "Leads",
                            parrent: 19,
                            sequence: 9,
                            visible: true,
                            ancestors: [ ],
                            href: "Leads"
                        },
                        _id: "52b0254ead08de381e00000c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 25,
                            attachments: [ ],
                            link: true,
                            mname: "Opportunities",
                            parrent: 19,
                            sequence: 10,
                            visible: true,
                            ancestors: [ ],
                            href: "Opportunities"
                        },
                        _id: "52b0254ead08de381e00000d",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 36,
                            attachments: [ ],
                            link: false,
                            mname: "Project",
                            parrent: null,
                            sequence: 2,
                            visible: true,
                            ancestors: [ ],
                            href: "Project"
                        },
                        _id: "52b0254ead08de381e000010",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 39,
                            attachments: [ ],
                            link: true,
                            mname: "Projects",
                            parrent: 36,
                            sequence: 23,
                            visible: true,
                            ancestors: [ ],
                            href: "Projects"
                        },
                        _id: "52b0254ead08de381e000011",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 40,
                            attachments: [ ],
                            link: true,
                            mname: "Tasks",
                            parrent: 36,
                            sequence: 24,
                            visible: true,
                            ancestors: [ ],
                            href: "Tasks"
                        },
                        _id: "52b0254ead08de381e000012",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 42,
                            attachments: [ ],
                            link: true,
                            mname: "Employees",
                            parrent: 9,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Employees"
                        },
                        _id: "52b0254ead08de381e000013",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 43,
                            attachments: [ ],
                            link: true,
                            mname: "Applications",
                            parrent: 9,
                            sequence: 30,
                            visible: true,
                            ancestors: [ ],
                            href: "Applications"
                        },
                        _id: "52b0254ead08de381e000014",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 44,
                            attachments: [ ],
                            link: true,
                            mname: "Workflows",
                            parrent: 1,
                            sequence: 44,
                            visible: true,
                            ancestors: [ ],
                            href: "Workflows"
                        },
                        _id: "52b0254ead08de381e000015",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 49,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Persons",
                            parrent: 19,
                            sequence: 7,
                            visible: true,
                            ancestors: [ ],
                            href: "Persons"
                        },
                        _id: "52b0254ead08de381e000016",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 50,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Companies",
                            parrent: 19,
                            sequence: 8,
                            visible: true,
                            ancestors: [ ],
                            href: "Companies"
                        },
                        _id: "52b0254ead08de381e000017",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 51,
                            attachments: [ ],
                            link: true,
                            mname: "Profiles",
                            parrent: 1,
                            sequence: 51,
                            visible: true,
                            ancestors: [ ],
                            href: "Profiles"
                        },
                        _id: "52b0254ead08de381e000018",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 52,
                            attachments: [ ],
                            link: true,
                            mname: "Birthdays",
                            parrent: 9,
                            sequence: 52,
                            visible: true,
                            ancestors: [ ],
                            href: "Birthdays"
                        },
                        _id: "52b0254ead08de381e000019",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 29,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 19,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Dashboard"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 53,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 36,
                            sequence: 53,
                            visible: true,
                            ancestors: [ ],
                            href: "projectDashboard"
                        },
                        _id: "52ef6d5f9d8a19c819e19f7f",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 54,
                            mname: "Purchases",
                            sequence: 54,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Purchases"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 57,
                            mname: "Order",
                            sequence: 56,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Order"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 56,
                            mname: "Invoice",
                            sequence: 57,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Invoice"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 55,
                            mname: "Quotation",
                            sequence: 55,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Quotation"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 58,
                            mname: "Product",
                            sequence: 58,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Product"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 59,
                            mname: "Accounting",
                            sequence: 59,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Accounting"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 61,
                            mname: "Customer Payments",
                            sequence: 61,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "customerPayments"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 60,
                            mname: "Supplier Payments",
                            sequence: 60,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "supplierPayments"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 62,
                            mname: "Quotation",
                            sequence: 62,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesQuotation"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 63,
                            mname: "Order",
                            sequence: 63,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesOrder"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 64,
                            mname: "Invoice",
                            sequence: 64,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesInvoice"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 73,
                            mname: "DashBoardVacation",
                            sequence: 1001,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "DashBoardVacation"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 71,
                            mname: "Attendance",
                            sequence: 71,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Attendance"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 72,
                            mname: "BonusType",
                            sequence: 73,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "bonusType"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 68,
                            mname: "MonthHours",
                            sequence: 68,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "monthHours"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 67,
                            mname: "Revenue",
                            sequence: 67,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "Revenue"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 75,
                            mname: "tCard",
                            sequence: 1000,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "wTrack"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 69,
                            mname: "Holidays",
                            sequence: 69,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Holiday"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 66,
                            mname: "Payroll Expenses",
                            sequence: 77,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollExpenses"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 70,
                            mname: "Vacation",
                            sequence: 70,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Vacation"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 74,
                            mname: "HrDashboard",
                            sequence: 74,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "HrDashboard"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 9,
                            attachments: [ ],
                            link: false,
                            mname: "HR",
                            parrent: null,
                            sequence: 3,
                            visible: true,
                            ancestors: [ ],
                            href: "HR"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 76,
                            mname: "Efficiency",
                            sequence: 72,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Efficiency"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 77,
                            mname: "Capacity",
                            sequence: 69,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Capacity"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 78,
                            mname: "Payroll",
                            sequence: 78,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Payroll"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 79,
                            mname: "Payroll Payments",
                            sequence: 79,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollPayments"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 82,
                            mname: "Invoice Aging",
                            sequence: 82,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceAging"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 83,
                            mname: "ChartOfAccount",
                            sequence: 83,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "ChartOfAccount"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 84,
                            mname: "Categories",
                            sequence: 1000,
                            parrent: 1,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "productSettings"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 85,
                            mname: "Journal",
                            sequence: 85,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journal"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 86,
                            mname: "Journal Entry",
                            sequence: 86,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journalEntry"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 87,
                            mname: "Invoice Charts",
                            sequence: 87,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceCharts"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 88,
                            mname: "Salary Report",
                            sequence: 69,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salaryReport"
                        },
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    }
                ],
                profileDescription: "No description",
                profileName: "admin"
            },
            {
                _id: 1387275504000,
                __v: 0,
                attachments: [ ],
                profileAccess: [
                    {
                        module: {
                            _id: 1,
                            __v: 0,
                            attachments: [ ],
                            link: false,
                            mname: "Settings",
                            parrent: null,
                            sequence: 1000,
                            visible: true,
                            ancestors: [ ],
                            href: "Settings"
                        },
                        _id: "52b024f07fa64ad41e000002",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 6,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 3,
                            sequence: 41,
                            visible: false,
                            ancestors: [
                                1,
                                3
                            ],
                            href: "Groups"
                        },
                        _id: "52b024f07fa64ad41e000004",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 7,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Users",
                            parrent: 1,
                            sequence: 42,
                            visible: true,
                            ancestors: [ ],
                            href: "Users"
                        },
                        _id: "52b024f07fa64ad41e000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 14,
                            attachments: [ ],
                            link: true,
                            mname: "Job Positions",
                            parrent: 9,
                            sequence: 32,
                            visible: true,
                            ancestors: [ ],
                            href: "JobPositions"
                        },
                        _id: "52b024f07fa64ad41e000007",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 15,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 1,
                            sequence: 33,
                            visible: true,
                            ancestors: [ ],
                            href: "Departments"
                        },
                        _id: "52b024f07fa64ad41e000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 19,
                            attachments: [ ],
                            link: false,
                            mname: "Sales",
                            parrent: null,
                            sequence: 1,
                            visible: true,
                            ancestors: [ ],
                            href: "Sales"
                        },
                        _id: "52b024f07fa64ad41e000009",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 24,
                            attachments: [ ],
                            link: true,
                            mname: "Leads",
                            parrent: 19,
                            sequence: 9,
                            visible: true,
                            ancestors: [ ],
                            href: "Leads"
                        },
                        _id: "52b024f07fa64ad41e00000c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 25,
                            attachments: [ ],
                            link: true,
                            mname: "Opportunities",
                            parrent: 19,
                            sequence: 10,
                            visible: true,
                            ancestors: [ ],
                            href: "Opportunities"
                        },
                        _id: "52b024f07fa64ad41e00000d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 36,
                            attachments: [ ],
                            link: false,
                            mname: "Project",
                            parrent: null,
                            sequence: 2,
                            visible: true,
                            ancestors: [ ],
                            href: "Project"
                        },
                        _id: "52b024f07fa64ad41e000010",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 39,
                            attachments: [ ],
                            link: true,
                            mname: "Projects",
                            parrent: 36,
                            sequence: 23,
                            visible: true,
                            ancestors: [ ],
                            href: "Projects"
                        },
                        _id: "52b024f07fa64ad41e000011",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 40,
                            attachments: [ ],
                            link: true,
                            mname: "Tasks",
                            parrent: 36,
                            sequence: 24,
                            visible: true,
                            ancestors: [ ],
                            href: "Tasks"
                        },
                        _id: "52b024f07fa64ad41e000012",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 42,
                            attachments: [ ],
                            link: true,
                            mname: "Employees",
                            parrent: 9,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Employees"
                        },
                        _id: "52b024f07fa64ad41e000013",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 43,
                            attachments: [ ],
                            link: true,
                            mname: "Applications",
                            parrent: 9,
                            sequence: 30,
                            visible: true,
                            ancestors: [ ],
                            href: "Applications"
                        },
                        _id: "52b024f07fa64ad41e000014",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 44,
                            attachments: [ ],
                            link: true,
                            mname: "Workflows",
                            parrent: 1,
                            sequence: 44,
                            visible: true,
                            ancestors: [ ],
                            href: "Workflows"
                        },
                        _id: "52b024f07fa64ad41e000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 49,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Persons",
                            parrent: 19,
                            sequence: 7,
                            visible: true,
                            ancestors: [ ],
                            href: "Persons"
                        },
                        _id: "52b024f07fa64ad41e000016",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 50,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Companies",
                            parrent: 19,
                            sequence: 8,
                            visible: true,
                            ancestors: [ ],
                            href: "Companies"
                        },
                        _id: "52b024f07fa64ad41e000017",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 51,
                            attachments: [ ],
                            link: true,
                            mname: "Profiles",
                            parrent: 1,
                            sequence: 51,
                            visible: true,
                            ancestors: [ ],
                            href: "Profiles"
                        },
                        _id: "52b024f07fa64ad41e000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 52,
                            attachments: [ ],
                            link: true,
                            mname: "Birthdays",
                            parrent: 9,
                            sequence: 52,
                            visible: true,
                            ancestors: [ ],
                            href: "Birthdays"
                        },
                        _id: "52b024f07fa64ad41e000019",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 29,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 19,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Dashboard"
                        },
                        _id: "55b790eaa5ebea2c2400001f",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 53,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 36,
                            sequence: 53,
                            visible: true,
                            ancestors: [ ],
                            href: "projectDashboard"
                        },
                        _id: "52ef6d5f9d8a19c819e19f7e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 54,
                            mname: "Purchases",
                            sequence: 54,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Purchases"
                        },
                        _id: "55b790eaa5ebea2c2400001e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 57,
                            mname: "Order",
                            sequence: 56,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Order"
                        },
                        _id: "55b790eaa5ebea2c2400001d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 56,
                            mname: "Invoice",
                            sequence: 57,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Invoice"
                        },
                        _id: "55b790eaa5ebea2c2400001c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 55,
                            mname: "Quotation",
                            sequence: 55,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Quotation"
                        },
                        _id: "55b790eaa5ebea2c2400001b",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 58,
                            mname: "Product",
                            sequence: 58,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Product"
                        },
                        _id: "55b790eaa5ebea2c2400001a",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 59,
                            mname: "Accounting",
                            sequence: 59,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Accounting"
                        },
                        _id: "55b790eaa5ebea2c24000019",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 61,
                            mname: "Customer Payments",
                            sequence: 61,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "customerPayments"
                        },
                        _id: "55b790eaa5ebea2c24000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 60,
                            mname: "Supplier Payments",
                            sequence: 60,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "supplierPayments"
                        },
                        _id: "55b790eaa5ebea2c24000017",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 62,
                            mname: "Quotation",
                            sequence: 62,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesQuotation"
                        },
                        _id: "55b790eaa5ebea2c24000016",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 63,
                            mname: "Order",
                            sequence: 63,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesOrder"
                        },
                        _id: "55b790eaa5ebea2c24000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 64,
                            mname: "Invoice",
                            sequence: 64,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesInvoice"
                        },
                        _id: "55b790eaa5ebea2c24000014",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b790eaa5ebea2c24000013",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 73,
                            mname: "DashBoardVacation",
                            sequence: 1001,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "DashBoardVacation"
                        },
                        _id: "55b790eaa5ebea2c24000012",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 71,
                            mname: "Attendance",
                            sequence: 71,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Attendance"
                        },
                        _id: "55b790eaa5ebea2c24000011",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 72,
                            mname: "BonusType",
                            sequence: 73,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "bonusType"
                        },
                        _id: "55b790eaa5ebea2c24000010",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 68,
                            mname: "MonthHours",
                            sequence: 68,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "monthHours"
                        },
                        _id: "55b790eaa5ebea2c2400000f",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 67,
                            mname: "Revenue",
                            sequence: 67,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "Revenue"
                        },
                        _id: "55b790eaa5ebea2c2400000e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b790eaa5ebea2c2400000d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 75,
                            mname: "tCard",
                            sequence: 1000,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "wTrack"
                        },
                        _id: "55b790eaa5ebea2c2400000c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 69,
                            mname: "Holidays",
                            sequence: 69,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Holiday"
                        },
                        _id: "55b790eaa5ebea2c2400000a",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 66,
                            mname: "Payroll Expenses",
                            sequence: 77,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollExpenses"
                        },
                        _id: "55b790eaa5ebea2c24000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 70,
                            mname: "Vacation",
                            sequence: 70,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Vacation"
                        },
                        _id: "55b790eaa5ebea2c24000006",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 74,
                            mname: "HrDashboard",
                            sequence: 74,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "HrDashboard"
                        },
                        _id: "55b790eaa5ebea2c24000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 9,
                            attachments: [ ],
                            link: false,
                            mname: "HR",
                            parrent: null,
                            sequence: 3,
                            visible: true,
                            ancestors: [ ],
                            href: "HR"
                        },
                        _id: "55b89f3fdf6af7240d000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba16a2",
                        module: {
                            _id: 76,
                            mname: "Efficiency",
                            sequence: 72,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Efficiency"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba16a1",
                        module: {
                            _id: 77,
                            mname: "Capacity",
                            sequence: 69,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Capacity"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba16a0",
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba169f",
                        module: {
                            _id: 78,
                            mname: "Payroll",
                            sequence: 78,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Payroll"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba169e",
                        module: {
                            _id: 79,
                            mname: "Payroll Payments",
                            sequence: 79,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollPayments"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba169d",
                        module: {
                            _id: 82,
                            mname: "Invoice Aging",
                            sequence: 82,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceAging"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba169c",
                        module: {
                            _id: 83,
                            mname: "ChartOfAccount",
                            sequence: 83,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "ChartOfAccount"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba169b",
                        module: {
                            _id: 85,
                            mname: "Journal",
                            sequence: 85,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journal"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba169a",
                        module: {
                            _id: 86,
                            mname: "Journal Entry",
                            sequence: 86,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journalEntry"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba1699",
                        module: {
                            _id: 87,
                            mname: "Invoice Charts",
                            sequence: 87,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceCharts"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56b8aeb3d184bb7423ba1698",
                        module: {
                            _id: 88,
                            mname: "Salary Report",
                            sequence: 69,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salaryReport"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    }
                ],
                profileDescription: "No description",
                profileName: "baned"
            },
            {
                _id: 1445089150000,
                __v: 0,
                profileAccess: [
                    {
                        module: {
                            _id: 1,
                            __v: 0,
                            attachments: [ ],
                            link: false,
                            mname: "Settings",
                            parrent: null,
                            sequence: 1000,
                            visible: true,
                            ancestors: [ ],
                            href: "Settings"
                        },
                        _id: "52b024f07fa64ad41e000002",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 6,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 3,
                            sequence: 41,
                            visible: false,
                            ancestors: [
                                1,
                                3
                            ],
                            href: "Groups"
                        },
                        _id: "52b024f07fa64ad41e000004",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 7,
                            __v: 0,
                            attachments: [ ],
                            link: true,
                            mname: "Users",
                            parrent: 1,
                            sequence: 42,
                            visible: true,
                            ancestors: [ ],
                            href: "Users"
                        },
                        _id: "52b024f07fa64ad41e000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 14,
                            attachments: [ ],
                            link: true,
                            mname: "Job Positions",
                            parrent: 9,
                            sequence: 32,
                            visible: true,
                            ancestors: [ ],
                            href: "JobPositions"
                        },
                        _id: "52b024f07fa64ad41e000007",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 15,
                            attachments: [ ],
                            link: true,
                            mname: "Groups",
                            parrent: 1,
                            sequence: 33,
                            visible: true,
                            ancestors: [ ],
                            href: "Departments"
                        },
                        _id: "52b024f07fa64ad41e000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 19,
                            attachments: [ ],
                            link: false,
                            mname: "Sales",
                            parrent: null,
                            sequence: 1,
                            visible: true,
                            ancestors: [ ],
                            href: "Sales"
                        },
                        _id: "52b024f07fa64ad41e000009",
                        access: {
                            del: true,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 24,
                            attachments: [ ],
                            link: true,
                            mname: "Leads",
                            parrent: 19,
                            sequence: 9,
                            visible: true,
                            ancestors: [ ],
                            href: "Leads"
                        },
                        _id: "52b024f07fa64ad41e00000c",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 25,
                            attachments: [ ],
                            link: true,
                            mname: "Opportunities",
                            parrent: 19,
                            sequence: 10,
                            visible: true,
                            ancestors: [ ],
                            href: "Opportunities"
                        },
                        _id: "52b024f07fa64ad41e00000d",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 36,
                            attachments: [ ],
                            link: false,
                            mname: "Project",
                            parrent: null,
                            sequence: 2,
                            visible: true,
                            ancestors: [ ],
                            href: "Project"
                        },
                        _id: "52b024f07fa64ad41e000010",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 39,
                            attachments: [ ],
                            link: true,
                            mname: "Projects",
                            parrent: 36,
                            sequence: 23,
                            visible: true,
                            ancestors: [ ],
                            href: "Projects"
                        },
                        _id: "52b024f07fa64ad41e000011",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 40,
                            attachments: [ ],
                            link: true,
                            mname: "Tasks",
                            parrent: 36,
                            sequence: 24,
                            visible: true,
                            ancestors: [ ],
                            href: "Tasks"
                        },
                        _id: "52b024f07fa64ad41e000012",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 42,
                            attachments: [ ],
                            link: true,
                            mname: "Employees",
                            parrent: 9,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Employees"
                        },
                        _id: "52b024f07fa64ad41e000013",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 43,
                            attachments: [ ],
                            link: true,
                            mname: "Applications",
                            parrent: 9,
                            sequence: 30,
                            visible: true,
                            ancestors: [ ],
                            href: "Applications"
                        },
                        _id: "52b024f07fa64ad41e000014",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 44,
                            attachments: [ ],
                            link: true,
                            mname: "Workflows",
                            parrent: 1,
                            sequence: 44,
                            visible: true,
                            ancestors: [ ],
                            href: "Workflows"
                        },
                        _id: "52b024f07fa64ad41e000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 49,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Persons",
                            parrent: 19,
                            sequence: 7,
                            visible: true,
                            ancestors: [ ],
                            href: "Persons"
                        },
                        _id: "52b024f07fa64ad41e000016",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 50,
                            attachments: [ ],
                            htref: "persons",
                            link: true,
                            mname: "Companies",
                            parrent: 19,
                            sequence: 8,
                            visible: true,
                            ancestors: [ ],
                            href: "Companies"
                        },
                        _id: "52b024f07fa64ad41e000017",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 51,
                            attachments: [ ],
                            link: true,
                            mname: "Profiles",
                            parrent: 1,
                            sequence: 51,
                            visible: true,
                            ancestors: [ ],
                            href: "Profiles"
                        },
                        _id: "52b024f07fa64ad41e000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 52,
                            attachments: [ ],
                            link: true,
                            mname: "Birthdays",
                            parrent: 9,
                            sequence: 52,
                            visible: true,
                            ancestors: [ ],
                            href: "Birthdays"
                        },
                        _id: "52b024f07fa64ad41e000019",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 29,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 19,
                            sequence: 29,
                            visible: true,
                            ancestors: [ ],
                            href: "Dashboard"
                        },
                        _id: "55b790eaa5ebea2c2400001f",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 53,
                            attachments: [ ],
                            link: true,
                            mname: "Dashboard",
                            parrent: 36,
                            sequence: 53,
                            visible: true,
                            ancestors: [ ],
                            href: "projectDashboard"
                        },
                        _id: "52ef6d5f9d8a19c819e19f7e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 54,
                            mname: "Purchases",
                            sequence: 54,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Purchases"
                        },
                        _id: "55b790eaa5ebea2c2400001e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 57,
                            mname: "Order",
                            sequence: 56,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Order"
                        },
                        _id: "55b790eaa5ebea2c2400001d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 56,
                            mname: "Invoice",
                            sequence: 57,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Invoice"
                        },
                        _id: "55b790eaa5ebea2c2400001c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 55,
                            mname: "Quotation",
                            sequence: 55,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Quotation"
                        },
                        _id: "55b790eaa5ebea2c2400001b",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 58,
                            mname: "Product",
                            sequence: 58,
                            parrent: 54,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Product"
                        },
                        _id: "55b790eaa5ebea2c2400001a",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 59,
                            mname: "Accounting",
                            sequence: 59,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Accounting"
                        },
                        _id: "55b790eaa5ebea2c24000019",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 61,
                            mname: "Customer Payments",
                            sequence: 61,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "customerPayments"
                        },
                        _id: "55b790eaa5ebea2c24000018",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 60,
                            mname: "Supplier Payments",
                            sequence: 60,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "supplierPayments"
                        },
                        _id: "55b790eaa5ebea2c24000017",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 62,
                            mname: "Quotation",
                            sequence: 62,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesQuotation"
                        },
                        _id: "55b790eaa5ebea2c24000016",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 63,
                            mname: "Order",
                            sequence: 63,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesOrder"
                        },
                        _id: "55b790eaa5ebea2c24000015",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 64,
                            mname: "Invoice",
                            sequence: 64,
                            parrent: 19,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salesInvoice"
                        },
                        _id: "55b790eaa5ebea2c24000014",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b790eaa5ebea2c24000013",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 73,
                            mname: "DashBoardVacation",
                            sequence: 1001,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "DashBoardVacation"
                        },
                        _id: "55b790eaa5ebea2c24000012",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 71,
                            mname: "Attendance",
                            sequence: 71,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Attendance"
                        },
                        _id: "55b790eaa5ebea2c24000011",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 72,
                            mname: "BonusType",
                            sequence: 73,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "bonusType"
                        },
                        _id: "55b790eaa5ebea2c24000010",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 68,
                            mname: "MonthHours",
                            sequence: 68,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "monthHours"
                        },
                        _id: "55b790eaa5ebea2c2400000f",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 67,
                            mname: "Revenue",
                            sequence: 67,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "Revenue"
                        },
                        _id: "55b790eaa5ebea2c2400000e",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 65,
                            mname: "Product",
                            sequence: 65,
                            parrent: 19,
                            link: true,
                            visible: false,
                            ancestors: [ ],
                            href: "salesProduct"
                        },
                        _id: "55b790eaa5ebea2c2400000d",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 75,
                            mname: "tCard",
                            sequence: 1000,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "wTrack"
                        },
                        _id: "55b790eaa5ebea2c2400000c",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 69,
                            mname: "Holidays",
                            sequence: 69,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Holiday"
                        },
                        _id: "55b790eaa5ebea2c2400000a",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 66,
                            mname: "Payroll Expenses",
                            sequence: 77,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollExpenses"
                        },
                        _id: "55b790eaa5ebea2c24000008",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 70,
                            mname: "Vacation",
                            sequence: 70,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Vacation"
                        },
                        _id: "55b790eaa5ebea2c24000006",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 74,
                            mname: "HrDashboard",
                            sequence: 74,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "HrDashboard"
                        },
                        _id: "55b790eaa5ebea2c24000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 9,
                            attachments: [ ],
                            link: false,
                            mname: "HR",
                            parrent: null,
                            sequence: 3,
                            visible: true,
                            ancestors: [ ],
                            href: "HR"
                        },
                        _id: "55b89f3fdf6af7240d000005",
                        access: {
                            del: false,
                            editWrite: false,
                            read: true
                        }
                    },
                    {
                        _id: "56224fbfc558b13c1bbf875f",
                        module: {
                            _id: 76,
                            mname: "Efficiency",
                            sequence: 72,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Efficiency"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        _id: "56224fbfc558b13c1bbf875e",
                        module: {
                            _id: 77,
                            mname: "Capacity",
                            sequence: 69,
                            parrent: 9,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "Capacity"
                        },
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        _id: "56b8a490d54899a905ae023a",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 78,
                            mname: "Payroll",
                            sequence: 78,
                            parrent: null,
                            link: false,
                            visible: true,
                            ancestors: [ ],
                            href: "Payroll"
                        },
                        _id: "56b8a490d54899a905ae0239",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 79,
                            mname: "Payroll Payments",
                            sequence: 79,
                            parrent: 78,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "PayrollPayments"
                        },
                        _id: "56b8a490d54899a905ae0238",
                        access: {
                            del: false,
                            editWrite: false,
                            read: false
                        }
                    },
                    {
                        module: {
                            _id: 80,
                            mname: "Jobs Dashboard",
                            sequence: 54,
                            parrent: 36,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "jobsDashboard"
                        },
                        _id: "56b8a490d54899a905ae0237",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 82,
                            mname: "Invoice Aging",
                            sequence: 82,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceAging"
                        },
                        _id: "56b8a490d54899a905ae0236",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 83,
                            mname: "ChartOfAccount",
                            sequence: 83,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "ChartOfAccount"
                        },
                        _id: "56b8a490d54899a905ae0235",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 84,
                            mname: "Categories",
                            sequence: 1000,
                            parrent: 1,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "productSettings"
                        },
                        _id: "56b8a490d54899a905ae0234",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 85,
                            mname: "Journal",
                            sequence: 85,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journal"
                        },
                        _id: "56b8a490d54899a905ae0233",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 86,
                            mname: "Journal Entry",
                            sequence: 86,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "journalEntry"
                        },
                        _id: "56b8a490d54899a905ae0232",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 87,
                            mname: "Invoice Charts",
                            sequence: 87,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "invoiceCharts"
                        },
                        _id: "56b8a490d54899a905ae0231",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    },
                    {
                        module: {
                            _id: 88,
                            mname: "Salary Report",
                            sequence: 69,
                            parrent: 59,
                            link: true,
                            visible: true,
                            ancestors: [ ],
                            href: "salaryReport"
                        },
                        _id: "56b8a490d54899a905ae0230",
                        access: {
                            del: true,
                            editWrite: true,
                            read: true
                        }
                    }
                ],
                profileDescription: "test",
                profileName: "test"
            }
        ]
    };


    var fakeProfile = {
        count: 1,
        data: [
            "ArturMyhalko"
        ],
        isOwnProfile: false
    };

    var emptyFakeProfile = {
        count: 0,
        data: [
        ],
        isOwnProfile: false
    };

    var ownfakeProfile = {
        count: 1,
        data: [
            "ArturMyhalko"
        ],
        isOwnProfile: true
    };

    var view;
    var topBarView;
    var listView;
    var profilesCollection;

    describe('Profiles View', function () {
        var $fixture;
        var $elFixture;

        after(function(){
           view.remove();
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

                view = new MainView({el: $elFixture, contentType: 'Profiles'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="51"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="51"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Profiles');

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
                var profilesUrl = new RegExp('\/profiles\/', 'i');

                server.respondWith('GET', profilesUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProfiles)]);
                profilesCollection = new ProfilesCollection({
                    count: 0,
                    page: 1,
                    contentType: 'Profiles'

                });
                server.respond();

                topBarView = new TopBarView({
                    collection: profilesCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Profiles');
            });

        });


        describe('Profiles list view', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm').returns(true);
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function(){

                it('Try to create workflow list view', function () {
                    var $contentHolderEl;
                    var $profileListEl;
                    var $profileTableEl;

                    listView = new ContentView({
                        collection: profilesCollection,
                        startTime: new Date()
                    });

                    $contentHolderEl = view.$el.find('#content-holder');
                    $profileListEl = $contentHolderEl.find('.workflow-list-wrapper');
                    $profileTableEl = $contentHolderEl.find('#profileTableWrapper');

                    expect($contentHolderEl).to.exist;
                    expect($profileListEl).to.exist;
                    expect($profileListEl).to.have.class('left');
                    expect($profileTableEl.find('table')).to.exist;

                });

                it ('Try to click on profile list item', function(){
                    var $profilesMenu= listView.$el.find('.workflow-list-wrapper');
                    var $needA = $profilesMenu.find('a[data-id="1438158808000"]')[0];
                    var $tableEl = listView.$el.find('#profileTableWrapper table');

                    $needA.click();

                    expect($tableEl).to.have.class('list');
                    expect($tableEl.find('thead')).to.exist;
                    expect($tableEl.find('tbody')).to.exist;

                });

                it ('Try to edit profile', function(){
                    var $editInput;
                    var $needCheckBtn;
                    var $profilesMenu = listView.$el.find('.workflow-list-wrapper');
                    var profileUrl = new RegExp('\/profiles\/', 'i');

                    listView.editProfileDetails();
                    expect($profilesMenu.find('.editProfileContainer')).to.exist;
                    $editInput = listView.$el.find('.editProfileName');
                    $editInput.val('TEST');
                    $needCheckBtn = listView.$el.find('#modulesAccessTable > tbody > tr:nth-child(1) > td:nth-child(2) > input');
                    $needCheckBtn.click();

                    server.respondWith('PUT', profileUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                    listView.saveProfile();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Profiles');
                    expect(listView.$el.find('a[data-id="1438158808000"]').text()).to.be.equals('TEST Profile');
                    expect(listView.$el.find('#modulesAccessTable > tbody > tr:nth-child(1) > td:nth-child(2) > input').prop('checked')).to.be.true;
                });

                it ('Try to delete profile with not empty user', function(){
                    var $needA = listView.$el.find('a[data-id="1438768659000"]')[0];
                    var profileUrl = new RegExp('\/profiles\/', 'i');

                    $needA.click();

                    server.respondWith('DELETE', profileUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Deleted success'})]);
                    listView.deleteItems();
                    server.respond();

                    //expect(windowConfirmStub.called).to.be.true;
                    expect(window.location.hash).to.be.equals('#easyErp/Profiles');
                    expect(listView.$el.find('#profilesList > li:nth-child(1)').text()).to.be.not.equals('Finance Profile');

                });

                it ('try to open sub profiles checked values', function(){
                    var $secondItem = listView.$el.find('#profilesList > li:nth-child(2) > a');
                    $secondItem.click();
                    var $tableEl = listView.$el.find('#profileTableWrapper table');
                    var $needEl = $tableEl.find('tr[data-i="0"]');
                    var $childEl = $tableEl.find('tr[data-i="2"]');

                    expect($childEl).to.have.not.class('visible');

                    $needEl.click();
                    expect($childEl).to.have.class('visible');

                    $needEl.click();
                    expect($childEl).to.have.not.class('visible');

                });

                it ('try to open sub profiles unchecked values', function(){
                    var $secondItem = listView.$el.find('#profilesList > li:nth-child(3) > a');
                    $secondItem.click();
                    var $tableEl = listView.$el.find('#profileTableWrapper table');
                    var $needEl = $tableEl.find('tr[data-i="47"]');
                    var $childEl = $tableEl.find('tr[data-i="34"]');

                    expect($childEl).to.have.not.class('visible');

                    $needEl.click();
                    expect($childEl).to.have.class('visible');

                    $needEl.click();
                    expect($childEl).to.have.not.class('visible');

                });


            });

        });


    });


});
