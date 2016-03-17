/*
define([
    'text!fixtures/index.html',
    'collections/invoiceCharts/invoiceCharts',
    'views/main/MainView',
    'views/invoiceCharts/index',
    'views/invoiceCharts/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, InvoiceChartsCollection, MainView, IndexView, TopBarView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var fakeRevenueSynthetic = {
        payments: [
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 868400
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201408,
                invoiced: 868400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 473200
                    }
                ],
                paid: 473200
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 480000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 73600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 108300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 989200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 315500
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201409,
                invoiced: 1966600,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 439200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 432000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 108300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 710700
                    }
                ],
                paid: 1690200
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 927000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 69200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 2047400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 272900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1952700
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201410,
                invoiced: 5269200,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1952700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 147600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 2597400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 975000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 142800
                    }
                ],
                paid: 5815500
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 2361000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 67600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 674000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 684400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1739600
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201411,
                invoiced: 5526600,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 668000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 684400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1340000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 192900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1117800
                    }
                ],
                paid: 4003100
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 550000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 201600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 475000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 3004400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1145400
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201412,
                invoiced: 5376400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 3880800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1151400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 550000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 823400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 475000
                    }
                ],
                paid: 6880600
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 3466000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1396500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 236000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 1330000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 418400
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201501,
                invoiced: 6846900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 236000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2161000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 1330000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 404400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 663200
                    }
                ],
                paid: 4794600
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1650400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 84000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 3257500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 253900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1350700
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201502,
                invoiced: 6596500,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2679100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 253900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1044000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1050500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 84000
                    }
                ],
                paid: 5111500
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 945000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 3931700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 369500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 192000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1561400
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201503,
                invoiced: 6999600,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1551400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 374400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1297500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 192000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1910900
                    }
                ],
                paid: 5326200
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1570000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 237800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1106500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 806000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 4645400
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201504,
                invoiced: 8365700,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1606400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 806000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 230800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 981700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 4446900
                    }
                ],
                paid: 8071800
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 4734100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 2791600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 1494800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 298400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1488713
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201505,
                invoiced: 10807613,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 2712400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1659500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 314500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 1494800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 4039800
                    }
                ],
                paid: 10221000
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1625000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1217100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 2222700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 1158000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 371000
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201506,
                invoiced: 6593800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 4197900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1602413
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1421100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 1158000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 364700
                    }
                ],
                paid: 8744113
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1688507
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        invoicedBySales: 515200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 5917800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1395700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 1048000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 431400
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201507,
                invoiced: 10996607,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1210800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1395700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 748000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 5531500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 427900
                    }
                ],
                paid: 9313900
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 651200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1305500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 508500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 4716900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 484000
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201508,
                invoiced: 7666100,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1590500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 484000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        paidBySales: 515200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 508500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 4859400
                    }
                ],
                paid: 7957600
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 149100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 987900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 2761700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 9381700
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201509,
                invoiced: 13280400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 149100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 2693700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 240000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 7830000
                    }
                ],
                paid: 10912800
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 3158000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 2526500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 6459300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 147600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 105900
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201510,
                invoiced: 12397300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 61100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 3877200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 2639300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 3660400
                    },
                    {
                        paidBySales: 180000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 147600
                    }
                ],
                paid: 10565600
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 14656500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 179700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1408500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 5704400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        invoicedBySales: 136000
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201511,
                invoiced: 22085100,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        paidBySales: 136000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1707100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 217300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 4231000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 12421300
                    },
                    {
                        paidBySales: 126400
                    }
                ],
                paid: 18839100
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 6038300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 136900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 4638800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1273800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 685000
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        invoicedBySales: 269700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        invoicedBySales: 145000
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201512,
                invoiced: 13187500,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1592900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 878100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 139900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 985000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 6871300
                    }
                ],
                paid: 10467200
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        invoicedBySales: 502800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 5092900
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        invoicedBySales: 335400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1261600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1713300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 179900
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201601,
                invoiced: 9085900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        paidBySales: 502800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 965900
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        paidBySales: 405700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 6585000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 2237000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 170800
                    }
                ],
                paid: 10867200
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 4839900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        invoicedBySales: 164000
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        invoicedBySales: 136000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1210700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 655500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        invoicedBySales: 1200000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        invoicedBySales: 955700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 134300
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201602,
                invoiced: 9296100,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 7601400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 3138600
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        paidBySales: 335400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        paidBySales: 545000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 937000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 134300
                    }
                ],
                paid: 12691700,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 3000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 618800
                    }
                ],
                revenue: 621800
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        invoicedBySales: 156000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        invoicedBySales: 704000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 59600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 2479500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        invoicedBySales: 328000
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        invoicedBySales: 193200
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: {
                            last: "Sokhanych",
                            first: "Alex"
                        }
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: {
                            last: "Yartysh",
                            first: "Nataliya"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: {
                            last: "Voloshchuk",
                            first: "Peter"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: {
                            last: "Ostroverkh",
                            first: "Oleg"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: {
                            last: "Almashiy",
                            first: "Vasiliy"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: {
                            last: "Gusti",
                            first: "Yana"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    { }
                ],
                date: 201603,
                invoiced: 3920300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        paidBySales: 164000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1110200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 2383500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 51000
                    }
                ],
                paid: 3708700,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 5400
                    }
                ],
                revenue: 5400
            }
        ],
        sales: [
            {
                _id: "55b92ad221e4b7c40f00004f",
                name: {
                    last: "Sokhanych",
                    first: "Alex"
                }
            },
            {
                _id: "561ba8639ebb48212ea838c4",
                name: {
                    last: "Yartysh",
                    first: "Nataliya"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00005f",
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004b",
                name: {
                    last: "Katona",
                    first: "Roland"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a0",
                name: {
                    last: "Bilak",
                    first: "Ivan"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00004a",
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000040",
                name: {
                    last: "Almashiy",
                    first: "Vasiliy"
                }
            },
            {
                _id: "55b92ad221e4b7c40f00009b",
                name: {
                    last: "Popp",
                    first: "Larysa"
                }
            },
            {
                _id: "55b92ad221e4b7c40f000063",
                name: {
                    last: "Gusti",
                    first: "Yana"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000a2",
                name: {
                    last: "Stan",
                    first: "Igor"
                }
            },
            { }
        ]
    };

    var invoiceChartsCollection;
    var view;
    var topBarView;
    var indexView;

    describe('JournalEntry View', function () {
        var $fixture;
        var $elFixture;

        after(function(){
            view.remove();
            topBarView.remove();
            //indexView.remove();
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

                view = new MainView({el: $elFixture, contentType: 'invoiceCharts'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="87"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="87"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/invoiceCharts');

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
                var invoiceChartsUrl = new RegExp('\/revenue\/synthetic', 'i');

                server.respondWith('GET', '/revenue/synthetic', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenueSynthetic)]);

                invoiceChartsCollection = new InvoiceChartsCollection();

                server.respond();

                topBarView = new TopBarView({
                    collection: invoiceChartsCollection
                });

                expect(topBarView.$el.find('.vocationFilter')).to.exist;
                expect(topBarView.$el.find('#searchContainer')).to.exist;
            });

        });

        /!*describe('ChartsOfAccount list view', function () {
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

            describe('INITIALIZE', function(){

                it('Try to create InvoiceCharts view', function (done) {
                    var $listHolder;
                    var invoiceChartsUrl = new RegExp('\/revenue\/synthetic', 'i');

                    setTimeout(function(){
                        server.respondWith('GET', invoiceChartsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenueSynthetic)]);

                        indexView = new IndexView({
                            collection: invoiceChartsCollection,
                            startTime: new Date()
                        });

                        server.respond();

                        $listHolder = indexView.$el;

                        done();
                    }, 50);

                });
            });

        });*!/

    });

});
*/
