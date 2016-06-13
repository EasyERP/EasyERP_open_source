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
                    {}
                ],
                date: 201408,
                invoiced: 868400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 473200
                    }
                ],
                paid: 473200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 528000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 1807235.2941176472
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 165600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 2371035.9550561807
                    }
                ],
                revenue: 4871871.249173826
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
                    {}
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
                paid: 1690200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 169400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1921852.751368482
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 303735.2941176471
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 653000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 1525800
                    }
                ],
                revenue: 4573788.045486128
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
                    {}
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
                paid: 5815500,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 760360.3603603602
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 850357.9643093193
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 216000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1511983.2415726967
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 1354827.7647058815
                    }
                ],
                revenue: 4693529.330948257
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
                    {}
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
                paid: 4003100,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1922299.5377682904
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 743806.7415730337
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1078726.1261261262
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 233365.55243205625
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 992316.2580645166
                    }
                ],
                revenue: 4970514.215964021
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
                    {}
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
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 475000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 550000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 823400
                    }
                ],
                paid: 6880600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 669846.1538461538
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 408531.8159889965
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 673800.0000000001
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 2555727.7794408905
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 376320.6831119545
                    }
                ],
                revenue: 4684226.4323879955
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
                    {}
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
                paid: 4794600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1461726.6189266185
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 85264.20058814426
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 325702.63157894736
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 2922673.367415706
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 961571.4285714283
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 826500
                    }
                ],
                revenue: 6583438.247080844
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
                    {}
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
                paid: 5111500,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 3316470.135964867
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1420368.0684507554
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 304700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 1037595.2380952381
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 1442624.5936698036
                    }
                ],
                revenue: 7521758.036180664
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
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 192000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 369500
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
                    {}
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
                paid: 5326200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 256200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 2941393.0946291545
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 252643.85964912278
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 3483226.155349786
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 1678225.0629917164
                    }
                ],
                revenue: 8611688.17261978
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
                    {}
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
                paid: 8071800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 284689.47368421056
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 211200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 5516104.677609253
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 1808189.271333037
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 2416128.5895813694
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 260800
                    }
                ],
                revenue: 10497112.01220788
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
                    {}
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
                paid: 10221000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 301500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 372600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 625103.4482758621
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 1686531.6901830907
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 4153101.755070338
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 2466448.686159844
                    }
                ],
                revenue: 9605285.579689143
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
                    {}
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
                paid: 8744113,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 40041.45077720207
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1470205.5720684617
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 716670.7013840019
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 4712200.381000003
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 467500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 1920394.493023626
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 184000
                    }
                ],
                revenue: 9511012.598253297
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
                    {}
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
                paid: 9313900,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 433226.6666666666
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 4895164.580231044
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 438200.0000000001
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 2268534.774144277
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 494259.375669079
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 934625.8503401362
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1690833.6914698489
                    }
                ],
                revenue: 11154844.938521076
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1305500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 508500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 484000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 4716900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 651200
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
                    {}
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
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 4859400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        paidBySales: 515200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 508500
                    }
                ],
                paid: 7957600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 211226.66666666666
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 623333.3333333334
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 351600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 2385016.8511176985
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 5324213.840556512
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 2523930.5170714734
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 42976.85950413223
                    }
                ],
                revenue: 11462298.068249809
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
                    {}
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
                paid: 10912800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 6031636.793404167
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 96800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 518799.99999999994
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 175176.30107526883
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3768715.68738808
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 2534287.904496418
                    }
                ],
                revenue: 13125416.686363932
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
                    {}
                ],
                date: 201510,
                invoiced: 12397300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 61100
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
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 3877200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 147600
                    }
                ],
                paid: 10565600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 81400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 6442791.443415572
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 776305.7080354701
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 145910.75268817204
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 2044480.1842487045
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 563000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 71628.09917355372
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3726359.8079074626
                    }
                ],
                revenue: 13851875.995468931
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 179700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1408500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 14656500
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
                    {}
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
                paid: 18839100,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 1807552.2629790225
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 1223200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 138600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3176823.0568639645
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 2501693.0766634615
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 155194.21487603307
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 5563260.791755321
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 158756.9892473118
                    }
                ],
                revenue: 14725080.392385142
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
                    {}
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
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 6871300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 139900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 985000
                    }
                ],
                paid: 10467200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3370416.816531311
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 2320025.348214081
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 191498.9247311828
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 141152.43902439025
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 5526232.0171128735
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 120766.66666666666
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 2029538.6042259522
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 1644487.9120879122
                    }
                ],
                revenue: 15344118.728594389
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
                    {}
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
                paid: 10867200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3635572.9313503094
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 348333.3333333333
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 2376815.4156714864
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 126619.35483870968
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 1607515.500468779
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 4497797.030986908
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 708633.3455207098
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 1298118.41872491
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    }
                ],
                revenue: 14599405.330895158
            },
            {
                sales: [
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        invoicedBySales: 136000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        invoicedBySales: 164000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1234400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 655500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 6475100
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
                    {}
                ],
                date: 201602,
                invoiced: 10955000,
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
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1599400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        paidBySales: 545000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 134300
                    }
                ],
                paid: 13354100,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3306419.7968693003
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        revenueBySales: 239351.35135135136
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 146898.38709677418
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "5602a01550de7f4138000008",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 391018.1818181818
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 1727696.6985485721
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 1942806.2758372342
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 1178050.5314009662
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 6153759.523091388
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 1595766.1827685863
                    }
                ],
                revenue: 16681766.92878236
            },
            {
                sales: [
                    {
                        salesPerson: "56029cc950de7f4138000005",
                        invoicedBySales: 90000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        invoicedBySales: 432000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        invoicedBySales: 156000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        invoicedBySales: 704000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 3966700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 59600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 601000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        invoicedBySales: 328000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 644400
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
                    {}
                ],
                date: 201603,
                invoiced: 7174900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 3923400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        paidBySales: 164000
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        paidBySales: 193200
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
                paid: 6715100,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 7432812.183693579
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        revenueBySales: 416648.6486486487
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 74181.81818181818
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 1101178.9371980673
                    },
                    {
                        salesPerson: "5602a01550de7f4138000008",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 5225104.228044838
                    },
                    {
                        salesPerson: "56029cc950de7f4138000005",
                        revenueBySales: 90000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 111477.95698924731
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 2002861.6559293717
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 1161808.1447110777
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 1624707.607945066
                    }
                ],
                revenue: 19240781.18134172
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        invoicedBySales: 2000000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 24300
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: {
                            last: "Yelahina",
                            first: "Alona"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: {
                            last: "Shepinka",
                            first: "Igor"
                        }
                    },
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
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    {
                        _id: "56029cc950de7f4138000005",
                        name: {
                            last: "Lendyel",
                            first: "Eugen"
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
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
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
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
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
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    }
                ],
                date: 201604,
                invoiced: 2024300,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 86348.1174755879
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1749999.999999999
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        revenueBySales: 0
                    }
                ],
                revenue: 1836348.117475587
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 500000
                    }
                ],
                date: 201605,
                revenue: 500000
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 6535.947712418301
                    }
                ],
                date: 201609,
                revenue: 6535.947712418301
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 6535.947712418301
                    }
                ],
                date: 201610,
                revenue: 6535.947712418301
            }
        ],
        sales: [
            {
                _id: "55b92ad221e4b7c40f0000cb",
                name: {
                    last: "Yelahina",
                    first: "Alona"
                }
            },
            {
                _id: "55b92ad221e4b7c40f0000bb",
                name: {
                    last: "Shepinka",
                    first: "Igor"
                }
            },
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
                _id: "55b92ad221e4b7c40f0000a2",
                name: {
                    last: "Stan",
                    first: "Igor"
                }
            },
            {
                _id: "56029cc950de7f4138000005",
                name: {
                    last: "Lendyel",
                    first: "Eugen"
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
                _id: "55b92ad221e4b7c40f00004b",
                name: {
                    last: "Katona",
                    first: "Roland"
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
                _id: "55b92ad221e4b7c40f0000a0",
                name: {
                    last: "Bilak",
                    first: "Ivan"
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
                _id: "55b92ad221e4b7c40f00009b",
                name: {
                    last: "Popp",
                    first: "Larysa"
                }
            }
        ]
    };
    var fakeRevenueSyntheticByWeek = {
        payments: [
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 3952.9411764705883
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 2400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 87173.79912663756
                    }
                ],
                date: 201431,
                revenue: 93526.74030310815
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 31200
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: {
                            last: "Yelahina",
                            first: "Alona"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: {
                            last: "Shepinka",
                            first: "Igor"
                        }
                    },
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
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    {
                        _id: "56029cc950de7f4138000005",
                        name: {
                            last: "Lendyel",
                            first: "Eugen"
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
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
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
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
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
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    }
                ],
                date: 201432,
                invoiced: 31200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 24000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 717626.6362965003
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 96000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 309264.70588235295
                    }
                ],
                revenue: 1146891.3421788532
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 442000
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
                    {}
                ],
                date: 201433,
                invoiced: 442000,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 31200
                    }
                ],
                paid: 31200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 47600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 665646.755588098
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 479523.5294117647
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 144000
                    }
                ],
                revenue: 1336770.2849998628
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 395200
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
                    {}
                ],
                date: 201434,
                invoiced: 395200,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 442000
                    }
                ],
                paid: 442000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 517505.617977528
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 22400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 144000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 487429.4117647059
                    }
                ],
                revenue: 1171335.029742234
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 315500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 36400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 192000
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
                    {}
                ],
                date: 201435,
                invoiced: 543900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 192000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 395200
                    }
                ],
                paid: 587200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 383083.1460674157
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 69200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 527064.705882353
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 144000
                    }
                ],
                revenue: 1123347.8519497686
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 71900
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
                    {}
                ],
                date: 201436,
                invoiced: 71900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 315500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 36400
                    }
                ],
                paid: 351900,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 445483.1460674158
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 546529.4314381271
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 33600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 128000
                    }
                ],
                revenue: 1153612.577505543
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 439200
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
                    {}
                ],
                date: 201437,
                invoiced: 439200,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 71900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 439200
                    }
                ],
                paid: 511100,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 450260.53511705686
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 256112.35955056178
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 160000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 54600
                    }
                ],
                revenue: 920972.8946676188
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 240000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 550000
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: {
                            last: "Yelahina",
                            first: "Alona"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: {
                            last: "Shepinka",
                            first: "Igor"
                        }
                    },
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
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    {
                        _id: "56029cc950de7f4138000005",
                        name: {
                            last: "Lendyel",
                            first: "Eugen"
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
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
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
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
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
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    }
                ],
                date: 201438,
                invoiced: 790000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 283237.1237458194
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 208000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 404134.8314606742
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 40600
                    }
                ],
                revenue: 935971.9552064935
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 773500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 492000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 73600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 38400
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
                    {}
                ],
                date: 201439,
                invoiced: 1377500,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 300000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 513500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 550000
                    }
                ],
                paid: 1363500,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 103000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 218704.68227424746
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 429287.1091181587
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 21000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 237982.35294117648
                    }
                ],
                revenue: 1009974.1443335828
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 686400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 51000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 1367400
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
                    {}
                ],
                date: 201440,
                invoiced: 2104800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 817400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 73600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 38400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 634400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 483000
                    }
                ],
                paid: 2046800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 208000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 475590.6436421192
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 164382.35294117645
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 33600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 82834.51955958063
                    }
                ],
                revenue: 964407.516142876
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 109200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 128000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 680000
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
                    {}
                ],
                date: 201441,
                invoiced: 917200,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 312000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 1230000
                    }
                ],
                paid: 1542000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 261149.4382022472
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 439645.3191617126
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 164382.35294117648
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 240000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 33600
                    }
                ],
                revenue: 1138777.1103051365
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 240000
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
                    {}
                ],
                date: 201442,
                invoiced: 240000,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 109200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 128000
                    }
                ],
                paid: 237200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 169500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 321618.8235294118
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 120000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 128500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 386139.3358333499
                    }
                ],
                revenue: 1125758.1593627615
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 125300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 192000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 364800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 69200
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
                    {}
                ],
                date: 201443,
                invoiced: 751300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 364800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 432000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 69200
                    }
                ],
                paid: 866000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 126000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 31500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 169500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 357973.62307083595
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 321618.8235294118
                    }
                ],
                revenue: 1006592.4466002476
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 152000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1117800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 684400
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
                    {}
                ],
                date: 201444,
                invoiced: 1954200,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 125300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 152000
                    }
                ],
                paid: 277300,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 120360.36036036034
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 194442.2339722406
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 239469.62503635001
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 277132.7450980392
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 8400
                    }
                ],
                revenue: 839804.9644669902
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 5600
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
                    {}
                ],
                date: 201445,
                invoiced: 5600,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 684400
                    }
                ],
                paid: 684400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 150279.77528089887
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 126378.37837837836
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 391641.06094008015
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 41300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 182564.46153846156
                    }
                ],
                revenue: 892163.6761378188
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 48000
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
                    {}
                ],
                date: 201446,
                invoiced: 48000,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 5600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1117800
                    }
                ],
                paid: 1123400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 176155.43071161048
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 141800.11571204232
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 573416.0283683813
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 37770.58823529412
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 393494.4631927212
                    }
                ],
                revenue: 1322636.6262200496
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 6000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 621800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 2209000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 14000
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
                    {}
                ],
                date: 201447,
                invoiced: 2850800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 62000
                    }
                ],
                paid: 62000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 353730.3909414002
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 406402.25806451606
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 204038.57677902622
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 54807.38636363637
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 371401.6629439476
                    }
                ],
                revenue: 1390380.2750925268
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 668000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 155400
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
                    {}
                ],
                date: 201448,
                invoiced: 823400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2209000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 674000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 621800
                    }
                ],
                paid: 3504800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 357465.889742954
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 203299.6254681648
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 385840.78551588155
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 181300.6831119545
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 113487.57783312578
                    }
                ],
                revenue: 1241394.5616720805
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 550000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 136000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 67700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 201600
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
                    {}
                ],
                date: 201449,
                invoiced: 955300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 136000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 201600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 155400
                    }
                ],
                paid: 493000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 642984.0628155478
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 219351.35135135133
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 167299.71988795517
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 53367.74193548388
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 113268.22577100579
                    }
                ],
                revenue: 1196271.1017613441
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 205400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 41700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 816600
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
                    {}
                ],
                date: 201450,
                invoiced: 1063700,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 550000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 80000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 67700
                    }
                ],
                paid: 697700,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 108000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 116493.15574299458
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 154145.3781512605
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 693471.8577265082
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 322952.9411764706
                    }
                ],
                revenue: 1395063.3327972335
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 536000
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
                    {}
                ],
                date: 201451,
                invoiced: 536000,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1352600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 41700
                    }
                ],
                paid: 1394300,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 156000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 84554.23488511221
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 643141.2641192023
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 183274.78991596636
                    }
                ],
                revenue: 1066970.2889202808
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1651800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 804000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 210200
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
                    {}
                ],
                date: 201452,
                invoiced: 2666000,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 210200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1507200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 929400
                    }
                ],
                paid: 2646800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 179113.44537815126
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 218564.10256410256
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 51729.00575301891
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 509284.2105263159
                    }
                ],
                revenue: 958690.7642215886
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 85264.20058814426
                    }
                ],
                date: 201453,
                revenue: 85264.20058814426
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 118100
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: {
                            last: "Yelahina",
                            first: "Alona"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: {
                            last: "Shepinka",
                            first: "Igor"
                        }
                    },
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
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    {
                        _id: "56029cc950de7f4138000005",
                        name: {
                            last: "Lendyel",
                            first: "Eugen"
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
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
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
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
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
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    }
                ],
                date: 201500,
                invoiced: 118100
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 550000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1307200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 113200
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
                    {}
                ],
                date: 201501,
                invoiced: 1970400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1451800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 118100
                    }
                ],
                paid: 1569900,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 28487.193836864888
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 41600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 398053.81747050537
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 134844.27767354596
                    }
                ],
                revenue: 602985.2889809163
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 38800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 140000
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
                    {}
                ],
                date: 201502,
                invoiced: 178800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 140000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 132800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 550000
                    }
                ],
                paid: 822800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 41600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 199008.87493034662
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 56202.63157894737
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 240392.85714285716
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 390088.0554022281
                    }
                ],
                revenue: 927292.4190543793
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 780000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 96000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 976000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 406800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 68500
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
                    {}
                ],
                date: 201503,
                invoiced: 2327300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 96000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 780000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 87700
                    }
                ],
                paid: 963700,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 240392.85714285716
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 83365.45454545454
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 465775.0362135811
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 798879.6783600447
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 166100
                    }
                ],
                revenue: 1754513.0262619378
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1182800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 79800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 989700
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
                    {}
                ],
                date: 201504,
                invoiced: 2252300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 663200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 709200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 65800
                    }
                ],
                paid: 1438200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 261392.8571428571
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 85981.81818181818
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 822527.7782680121
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 247000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 424381.6653567956
                    }
                ],
                revenue: 1841284.1189494834
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 83600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 84000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 884000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 851200
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
                    {}
                ],
                date: 201505,
                invoiced: 1902800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 238000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 32200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 668000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1380800
                    }
                ],
                paid: 2319000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 330200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 259392.85714285716
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 100152.72727272726
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 299049.3692637637
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 824591.4450762839
                    }
                ],
                revenue: 1813386.3987556316
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 60000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 95200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 485500
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
                    {}
                ],
                date: 201506,
                invoiced: 640700,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 349500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 84000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 124200
                    }
                ],
                paid: 557700,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 382564.28571428574
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 240684.5238095238
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 92800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 895524.0908323706
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 252434.73511742218
                    }
                ],
                revenue: 1864007.635473602
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 317200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 47100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 812800
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
                    {}
                ],
                date: 201507,
                invoiced: 1177100,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 276000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 50400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 317200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 948800
                    }
                ],
                paid: 1592400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 240684.5238095238
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 76150
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 308434.7351174222
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 436146.0222412318
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 878204.546442069
                    }
                ],
                revenue: 1939619.8276102466
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1033500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1108000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 28000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 706400
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
                    {}
                ],
                date: 201508,
                invoiced: 2875900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 100000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 495300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 47100
                    }
                ],
                paid: 642400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 388434.7351174222
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 373014.2857142857
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 855357.2269935345
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 94950
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 262113.0952380952
                    }
                ],
                revenue: 1973869.3430633373
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 87900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 240000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 104000
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
                    {}
                ],
                date: 201509,
                invoiced: 431900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 888000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 456000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 84400
                    }
                ],
                paid: 1428400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 40800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 254113.0952380952
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 403368.0684507555
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 698723.4021316775
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 250900
                    }
                ],
                revenue: 1647904.5658205284
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 92400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 150400
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
                    {}
                ],
                date: 201510,
                invoiced: 242800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 78400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 240000
                    }
                ],
                paid: 318400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 748177.8367148336
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 61114.28571428571
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 525578.022232515
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 369361.8598382749
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 118201.75438596492
                    }
                ],
                revenue: 1822433.7588858746
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 192000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 160000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 131800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 705000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 590000
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
                    {}
                ],
                date: 201511,
                invoiced: 1778800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 264000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 133200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 192000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 231400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 150400
                    }
                ],
                paid: 971000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 639914.5950135861
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 623997.3085365609
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 281086.4197530864
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 43368.42105263158
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 75285.71428571429
                    }
                ],
                revenue: 1663652.458641579
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 3191300
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
                    {}
                ],
                date: 201512,
                invoiced: 3191300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 30100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 872500
                    }
                ],
                paid: 902600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 880441.4201421755
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 45536.84210526315
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 486596.7694241148
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 882973.5148973523
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 61514.28571428571
                    }
                ],
                revenue: 2357062.8322831923
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 135600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 576000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1519500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1297400
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
                    {}
                ],
                date: 201513,
                invoiced: 3528500,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 526000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1033500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 88900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1092000
                    }
                ],
                paid: 2740400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 870579.9242805648
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 45536.84210526315
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 54085.71428571428
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 867596.6202662435
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 413636.8040996972
                    }
                ],
                revenue: 2251435.905037483
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1261000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 31500
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
                    {}
                ],
                date: 201514,
                invoiced: 1292500,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 40600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 108000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 961200
                    }
                ],
                paid: 1109800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 28189.473684210527
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 46300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 348968.27627327497
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1044606.423070951
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 437809.9838043008
                    }
                ],
                revenue: 1905874.1568327374
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 45500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 405700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1147800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 806000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 76800
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
                    {}
                ],
                date: 201515,
                invoiced: 2481800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 74000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 806000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 405700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 654000
                    }
                ],
                paid: 1939700,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 45500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1232386.945568507
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 411827.0950538194
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 561114.5958957513
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 33882.35294117647
                    }
                ],
                revenue: 2284710.9894592543
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 11200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 449900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 232200
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
                    {}
                ],
                date: 201516,
                invoiced: 693300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 20300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 232200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1285200
                    }
                ],
                paid: 1537700,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 44400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1162021.0289987538
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 586646.1748431197
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 372309.36141027196
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 33882.35294117647
                    }
                ],
                revenue: 2199258.9181933217
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 124800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 71400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1528200
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
                    {}
                ],
                date: 201517,
                invoiced: 1724400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1020500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 55300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1374200
                    }
                ],
                paid: 2450000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 487589.07866332744
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1339927.6851911168
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 104852.9411764706
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 52400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 70400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 491587.00613896304
                    }
                ],
                revenue: 2546756.7111698776
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 60200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 2113600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 398500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1937900
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
                    {}
                ],
                date: 201518,
                invoiced: 4510200,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 47600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 2238400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 398500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 3237900
                    }
                ],
                paid: 5922400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 320230.16028507636
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1070387.052802914
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 83882.35294117648
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 484639.24833657575
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 140800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 76400
                    }
                ],
                revenue: 2176338.8143657427
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 474000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 1494800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 2152200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 54300
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
                    {}
                ],
                date: 201519,
                invoiced: 4175300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 6000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 67600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 1494800
                    }
                ],
                paid: 1568400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 446279.2293617479
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 809101.4566679578
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 94500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 140800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 82700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 379915.41489723354
                    }
                ],
                revenue: 1953296.1009269392
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 96800
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
                    {}
                ],
                date: 201520,
                invoiced: 96800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 449900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 63700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 468000
                    }
                ],
                paid: 981600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 135944.8275862069
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 471622.0967440702
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1031805.9539080757
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 94500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 89600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 480550.5456469327
                    }
                ],
                revenue: 2304023.423885285
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 87100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 204000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 644000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1090213
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
                    {}
                ],
                date: 201521,
                invoiced: 2025313,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 135600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1261000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 352000
                    }
                ],
                paid: 1748600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 169931.03448275864
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 700861.9514958037
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1205229.0618657924
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 405429.67795503984
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 88500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 104900
                    }
                ],
                revenue: 2674851.7257993952
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 85700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 900000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 251000
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
                    {}
                ],
                date: 201522,
                invoiced: 1236700,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 204000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 47300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2628800
                    }
                ],
                paid: 2880100,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 992701.8803088563
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 178427.58620689658
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 797687.0927687482
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 95400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 415444.56120769406
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 24000
                    }
                ],
                revenue: 2503661.1204921957
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1217100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 258000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 132700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 110600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1701100
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
                    {}
                ],
                date: 201523,
                invoiced: 3419500,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1217100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 110600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 162000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 1158000
                    }
                ],
                paid: 2647700,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 144441.37931034484
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 73100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 43809.52380952381
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1039038.7194846985
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 387210.2518023786
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 320530.97611577046
                    }
                ],
                revenue: 2008130.8505227158
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 401600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 71800
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
                    {}
                ],
                date: 201524,
                invoiced: 473400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 49200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 445600
                    }
                ],
                paid: 494800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1319725.121329628
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 398366.18102920306
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 105900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 169931.03448275864
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 43809.52380952381
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 349615.01579098473
                    }
                ],
                revenue: 2387346.876442098
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 71000
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
                    {}
                ],
                date: 201525,
                invoiced: 71000,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 102700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1090213
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 644000
                    }
                ],
                paid: 1836913,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 186924.1379310345
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 43809.52380952381
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 336612.115991961
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1141718.8833033878
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 475160.6111350268
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 67700
                    }
                ],
                revenue: 2251925.272170934
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1507800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1112800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 35000
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
                    {}
                ],
                date: 201526,
                invoiced: 2655600,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 401600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 22600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1465100
                    }
                ],
                paid: 1889300,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 35047.619047619046
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 898753.3070400776
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 325656.9217288266
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 146454.42176870749
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 508787.5466750929
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 54100
                    }
                ],
                revenue: 1968799.8162603243
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1116900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 205200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1182000
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
                    {}
                ],
                date: 201527,
                invoiced: 2504100,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1116900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 163700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1031200
                    }
                ],
                paid: 2311800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 339219.43403413426
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 17523.809523809523
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 185900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 837053.4133463637
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 170145.57823129251
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 104107.77202072539
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 545379.8283867403
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 34594.73684210526
                    }
                ],
                revenue: 2233924.572385172
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1896600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 72500
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
                    {}
                ],
                date: 201528,
                invoiced: 1969100,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 543600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 120800
                    }
                ],
                paid: 664400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 883338.9051249318
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 213982.30088495577
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 477658.4122500146
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 144213.33333333334
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 57657.89473684211
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 611556.0542817373
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 112116.06217616581
                    }
                ],
                revenue: 2500522.9627879807
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 28000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 278800
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
                    {}
                ],
                date: 201529,
                invoiced: 306800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 33600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 278800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1959100
                    }
                ],
                paid: 2271500,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 435488.0948537098
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 269617.69911504426
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1069633.7161521711
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 105493.33333333333
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 390948.07919128455
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 115315.78947368421
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 106777.20207253886
                    }
                ],
                revenue: 2493273.9141917657
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 1048000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1688507
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1602000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 100500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        invoicedBySales: 515200
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
                    {}
                ],
                date: 201530,
                invoiced: 4954207,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1210800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 90700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1012000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 748000
                    }
                ],
                paid: 3061500,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 369831.0980119068
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 198000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1008594.8304556478
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 481175.4221091957
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 77586.66666666667
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 115315.78947368421
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 106777.20207253886
                    }
                ],
                revenue: 2357281.008789638
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 950400
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
                    {}
                ],
                date: 201531,
                invoiced: 950400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1765600
                    }
                ],
                paid: 1765600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 86733.33333333333
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 151800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 115315.7894736842
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1409030.382042477
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 457024.568243852
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 369681.55663650716
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 104522.5881043121
                    }
                ],
                revenue: 2694108.2178341667
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1866000
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
                    {}
                ],
                date: 201532,
                invoiced: 1866000,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 570000
                    }
                ],
                paid: 570000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 272400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 528062.216035683
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 102000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1052878.7427835332
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 98660.00000000001
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 488336.1338313562
                    }
                ],
                revenue: 2542337.0926505723
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 184000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 693200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 376500
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
                    {}
                ],
                date: 201533,
                invoiced: 1253700,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 376500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 484000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 540200
                    }
                ],
                paid: 1400700,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 47866.666666666664
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 538700.2845854028
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 113333.33333333333
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1372643.913868249
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 755970.5823189226
                    }
                ],
                revenue: 2828514.780772574
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 798900
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
                    {}
                ],
                date: 201534,
                invoiced: 798900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2355600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        paidBySales: 515200
                    }
                ],
                paid: 2870800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 113333.33333333333
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 750960.4046630239
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 18800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 554271.8768051296
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1347106.8874369
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 19100.826446280993
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 44000
                    }
                ],
                revenue: 2847573.328684668
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 8048500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1157400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 132000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 651200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 300000
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
                    {}
                ],
                date: 201535,
                invoiced: 10289100,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 798900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1264600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 132000
                    }
                ],
                paid: 2195500,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 601510.5094194806
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 528663.3962581701
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 23876.03305785124
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 113333.33333333333
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 35900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1402912.7334063624
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 35200
                    }
                ],
                revenue: 2741396.005475196
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 48500
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
                    {}
                ],
                date: 201536,
                invoiced: 48500,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 5696900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 48500
                    }
                ],
                paid: 5745400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 35170.967741935485
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 640827.1272421532
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1538454.246171839
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 633624.6043241592
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 70400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 83155.55555555555
                    }
                ],
                revenue: 3001632.501035643
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1116700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 546200
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
                    {}
                ],
                date: 201537,
                invoiced: 1662900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 986000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1407600
                    }
                ],
                paid: 2393600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 686026.1922724431
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 673885.0887407192
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1246051.298060927
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 146444.44444444444
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 40222.580645161295
                    }
                ],
                revenue: 2792629.604163695
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 56400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 305600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 240000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1403800
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
                    {}
                ],
                date: 201538,
                invoiced: 2005800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 546200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 56400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 240000
                    }
                ],
                paid: 842600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 146444.44444444444
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 46640.81720430107
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1260819.3603172859
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 831790.2591621452
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 615088.4861968942
                    }
                ],
                revenue: 2900783.3673250694
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 843900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 794300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1286600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 44200
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
                    {}
                ],
                date: 201539,
                invoiced: 2969000,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 44200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1042000
                    }
                ],
                paid: 1086200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 36195.69892473119
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 236222.2222222222
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 991754.1640141024
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1365017.2320475883
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 432750.28354914417
                    }
                ],
                revenue: 3061939.600757787
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 396000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1862000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 737800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 7200
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
                    {}
                ],
                date: 201540,
                invoiced: 3003000,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 797200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1502000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 158400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 7200
                    }
                ],
                paid: 2464800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 708796.291152666
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 145174.52736318408
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1244486.0341326853
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 348584.52384547517
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 29046.236559139783
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 26400
                    }
                ],
                revenue: 2502487.613053151
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 147600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1200000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 53900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 470000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1518700
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
                    {}
                ],
                date: 201541,
                invoiced: 3390200,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 901000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 147600
                    },
                    {
                        paidBySales: 180000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1998400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 53900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 643200
                    }
                ],
                paid: 3924100,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 345967.0215438995
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 46930.81761006289
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 52612.903225806454
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 717474.4505108304
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1467997.2960947123
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 171040.89552238805
                    }
                ],
                revenue: 2802023.3845076985
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 2462500
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
                    {}
                ],
                date: 201542,
                invoiced: 2462500,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 160000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 585800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 700000
                    }
                ],
                paid: 1445800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 134088.05031446542
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 950434.7541551215
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 383598.4952301902
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1417276.9649963093
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 31000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 173205.97014925373
                    }
                ],
                revenue: 3089604.2348453403
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 270000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 44800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 2329000
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
                    {}
                ],
                date: 201543,
                invoiced: 2643800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1251900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1479000
                    }
                ],
                paid: 2730900,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 991758.7452118094
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 150849.0566037736
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1617465.4635769066
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 32400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 482771.0758022867
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 173205.97014925373
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 47752.06611570248
                    }
                ],
                revenue: 3496202.3774597333
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 2657700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 607700
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
                    {}
                ],
                date: 201544,
                invoiced: 3265400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 651200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1635300
                    },
                    {
                        paidBySales: 30300
                    }
                ],
                paid: 2316800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 655295.9865943594
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1591117.947616458
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 251625.87405174994
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 874525.1214360755
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 231132.07547169813
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 27797.849462365593
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 23876.03305785124
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 81400
                    }
                ],
                revenue: 3736770.8876905576
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        invoicedBySales: 136000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1828200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 864500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 561600
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
                    {}
                ],
                date: 201545,
                invoiced: 3390300,
                paidBySales: [
                    {
                        paidBySales: 42800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 1145500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2139000
                    }
                ],
                paid: 3327300,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1494474.284946674
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 843068.8001752745
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 646712.0312643765
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 304965.4564631431
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 242790.37800687284
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 47752.06611570248
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 38274.1935483871
                    }
                ],
                revenue: 3618037.2105204314
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 3568000
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
                    {}
                ],
                date: 201546,
                invoiced: 3568000,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1220200
                    },
                    {
                        paidBySales: 53300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        paidBySales: 136000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2083500
                    }
                ],
                paid: 3493000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 56094.62365591398
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 319986.25429553265
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1497504.8777318634
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 808529.7573543236
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 452825.94398218684
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 569118.8529787646
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 47752.06611570248
                    }
                ],
                revenue: 3751812.376114288
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 239200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 4614100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 2561600
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
                    {}
                ],
                date: 201547,
                invoiced: 7414900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 561600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2470400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 44800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 2359600
                    }
                ],
                paid: 5436400,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 471133.0953042392
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1210493.6009821487
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 35814.04958677686
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 300192.43986254296
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 138600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 455610.4347826087
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 638581.5100609155
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 27673.11827956989
                    }
                ],
                revenue: 3278098.248858802
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 270400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 1314600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 2952200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 312400
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
                    {}
                ],
                date: 201548,
                invoiced: 4849600,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 306100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 5299200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 227700
                    }
                ],
                paid: 5833000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 31519.354838709678
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 300192.43986254296
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1109999.1761738923
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 815203.2075203812
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 460452.17391304346
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 704919.9765134352
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        revenueBySales: 23876.03305785124
                    }
                ],
                revenue: 3446162.361879858
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 4200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 276700
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
                    {}
                ],
                date: 201549,
                invoiced: 280900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 300000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 6300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 878100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1199600
                    }
                ],
                paid: 2384000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 84577.43902439025
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 699537.1836494933
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 28995.698924731183
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 441103.6869565217
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 638585.2031740817
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1097880.5931241387
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 332886.83962086024
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 67020
                    }
                ],
                revenue: 3390586.6444742163
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 726700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        invoicedBySales: 685000
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
                    {}
                ],
                date: 201550,
                invoiced: 1411700,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1118200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        paidBySales: 685000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2097400
                    }
                ],
                paid: 3900600,
                revenueBySales: [
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 7446.666666666667
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 341060.43956043955
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 542174.3558795889
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 26514.0243902439
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 735404.7355111885
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 465637.90674426564
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 64800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1242962.2077390694
                    }
                ],
                revenue: 3426000.336491462
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 637500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 741000
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        invoicedBySales: 269700
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
                    {}
                ],
                date: 201551,
                invoiced: 1648200,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1810200
                    }
                ],
                paid: 1810200,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 389810.43956043955
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 621053.9373273992
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 19451.219512195123
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 47650
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1262095.351082975
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 839188.9951184596
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 467316.667032584
                    }
                ],
                revenue: 3646566.6096340525
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 5400800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 3897800
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
                    {}
                ],
                date: 201552,
                invoiced: 9443600,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 558000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 247000
                    }
                ],
                paid: 805000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 377632.4175824176
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 722415.3107464589
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 40650
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 590691.6184868196
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 361093.4022355721
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1204489.4114883442
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 15433.333333333332
                    }
                ],
                revenue: 3312405.4938729447
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 263136.26373626373
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 914127.3248288473
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 505511.1702327116
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 285155.59000342345
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 130178.09650677048
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 30866.666666666664
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 14598.924731182797
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 10609.756097560976
                    }
                ],
                date: 201553,
                revenue: 2154183.7928034267
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 13300
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: {
                            last: "Yelahina",
                            first: "Alona"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: {
                            last: "Shepinka",
                            first: "Igor"
                        }
                    },
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
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    {
                        _id: "56029cc950de7f4138000005",
                        name: {
                            last: "Lendyel",
                            first: "Eugen"
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
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
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
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
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
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    }
                ],
                date: 201600,
                invoiced: 13300
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1540200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 82000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 169000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 613600
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
                    {}
                ],
                date: 201601,
                invoiced: 2404800,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 641000
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        paidBySales: 46300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 866000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 86200
                    }
                ],
                paid: 1639500,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 272034.74178403756
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 763846.1263980372
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 69502.22222222222
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 282617.9001590212
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 810303.702903037
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 19600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 99287.73023834417
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 448385.2378928948
                    }
                ],
                revenue: 2765577.6615975946
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 585000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 1099700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 992600
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
                    {}
                ],
                date: 201602,
                invoiced: 2677300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1496000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 726700
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        paidBySales: 223400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 668800
                    }
                ],
                paid: 3114900,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 326938.9671361502
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 505800.7204565879
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 18127.272727272728
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 525210.8747242442
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 35200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 797576.5460368806
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1111428.475787012
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 162312.52827442004
                    }
                ],
                revenue: 3482595.3851425694
            },
            {
                sales: [
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        invoicedBySales: 136000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 19600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 386000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        invoicedBySales: 502800
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
                    {}
                ],
                date: 201603,
                invoiced: 1044400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 19600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 3965200
                    }
                ],
                paid: 3984800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1272583.9577049965
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 467274.25318782177
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 170067.47474747474
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1150399.7232205784
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 407607.5117370892
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 33696.77419354839
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 198956.19947254856
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 647517.8651176067
                    }
                ],
                revenue: 4348103.759381667
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 530000
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        invoicedBySales: 199400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 65000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 100000
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
                    {}
                ],
                date: 201604,
                invoiced: 894400,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 65000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 100000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1085000
                    }
                ],
                paid: 1250000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 351822.62666534784
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 242140.95393617745
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 90636.36363636363
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 791707.4572817191
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 211737.2933954079
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 671149.7059136266
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 38122.58064516129
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1260076.7888070827
                    }
                ],
                revenue: 3657393.7702808874
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 258500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        invoicedBySales: 1200000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 572000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 3843100
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
                    {}
                ],
                date: 201605,
                invoiced: 5873600,
                paidBySales: [
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        paidBySales: 136000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 239200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 733500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2050000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        paidBySales: 502800
                    }
                ],
                paid: 3661500,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1176912.7340379234
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 43493.54838709677
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 123224.24242424242
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 618976.8430702017
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 650791.4062973825
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 344983.815006238
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 386389.9658099639
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 265475.1866490997
                    }
                ],
                revenue: 3610247.7416821467
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 662400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1142500
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
                    {}
                ],
                date: 201606,
                invoiced: 1804900,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 937000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2252700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        paidBySales: 545000
                    }
                ],
                paid: 3734700,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1504796.172524298
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 244549.84628897673
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 380612.1880321861
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 312609.7900407282
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 594712.9317768526
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 47467.74193548387
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 405838.2464277706
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 74593.93939393939
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    }
                ],
                revenue: 3565180.8564202352
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 668400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        invoicedBySales: 955700
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
                    {}
                ],
                date: 201607,
                invoiced: 1624100,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 2011500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1084700
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        paidBySales: 199400
                    }
                ],
                paid: 3295600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1603017.925932729
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 485991.5088616228
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 288367.14975845406
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 87400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1028520.5998673812
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 29895.698924731183
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 430706.749968458
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 395271.8082265601
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        revenueBySales: 0
                    }
                ],
                revenue: 4349171.441539935
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 134300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 300000
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        invoicedBySales: 136000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        invoicedBySales: 164000
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
                    {}
                ],
                date: 201608,
                invoiced: 734300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 134300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 1320400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 668400
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        paidBySales: 136000
                    }
                ],
                paid: 2259100,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1285702.0506335592
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 551870.3377549901
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 21043.548387096773
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 436486.4629963213
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 248960.07132317734
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 87400
                    },
                    {
                        salesPerson: "5602a01550de7f4138000008",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 813279.3086397125
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        revenueBySales: 64270.27027027027
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 322788.9591567852
                    }
                ],
                revenue: 3831801.009161911
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 97000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 4152300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        invoicedBySales: 704000
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
                    {}
                ],
                date: 201609,
                invoiced: 4953300,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1729000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        paidBySales: 662400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 2347500
                    }
                ],
                paid: 4738900,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1363285.0768683609
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 364820.78507560375
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 18400
                    },
                    {
                        salesPerson: "5602a01550de7f4138000008",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        revenueBySales: 175081.08108108107
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1196829.6918540327
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 382200.1533638595
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 21193.010752688173
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 481733.5067197427
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 292828.9924568185
                    }
                ],
                revenue: 4296372.298172187
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        invoicedBySales: 644400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1200000
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        invoicedBySales: 193200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        invoicedBySales: 156000
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
                    {}
                ],
                date: 201610,
                invoiced: 2193600,
                paidBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        paidBySales: 164000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1276800
                    }
                ],
                paid: 1440800,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 256497.74380209163
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 397950.3183030106
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1356832.6868620922
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        revenueBySales: 138322.4603914259
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 304602.9578433392
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1138039.25667148
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 27195.698924731183
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 285609.92353365704
                    },
                    {
                        salesPerson: "5602a01550de7f4138000008",
                        revenueBySales: 0
                    }
                ],
                revenue: 3905051.046331826
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        invoicedBySales: 59600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        invoicedBySales: 328000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        invoicedBySales: 1487200
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
                    {}
                ],
                date: 201611,
                invoiced: 1874800,
                paidBySales: [
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        paidBySales: 193200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        paidBySales: 36000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        paidBySales: 51000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        paidBySales: 1536400
                    }
                ],
                paid: 1816600,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1288344.48647254
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 318507.57686459436
                    },
                    {
                        salesPerson: "56029cc950de7f4138000005",
                        revenueBySales: 54000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        revenueBySales: 211839.70177073622
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 743602.4844720497
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 1310358.694363347
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 25293.548387096773
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 404303.46245971654
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "5602a01550de7f4138000008",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 263063.6874236874
                    }
                ],
                revenue: 4619313.642213765
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 601000
                    },
                    {
                        salesPerson: "56029cc950de7f4138000005",
                        invoicedBySales: 90000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        invoicedBySales: 432000
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: {
                            last: "Yelahina",
                            first: "Alona"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: {
                            last: "Shepinka",
                            first: "Igor"
                        }
                    },
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
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    {
                        _id: "56029cc950de7f4138000005",
                        name: {
                            last: "Lendyel",
                            first: "Eugen"
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
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
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
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
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
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    }
                ],
                date: 201612,
                invoiced: 1123000,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 25293.548387096773
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 237178.14696721942
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 41212.121212121216
                    },
                    {
                        salesPerson: "56029cc950de7f4138000005",
                        revenueBySales: 36000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 199203.39756861495
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 325266.77518538607
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00009b",
                        revenueBySales: 66486.4864864865
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 443602.4844720497
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3529038.5061966963
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 1057437.2016345712
                    }
                ],
                revenue: 5960718.668110243
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 732094.7382040626
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 146454.50549450552
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 266666.6666666666
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        revenueBySales: 17500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        revenueBySales: 32969.69696969697
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 545113.2966650208
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 121739.1304347826
                    }
                ],
                date: 201613,
                revenue: 1862538.034434735
            },
            {
                sales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        invoicedBySales: 24300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        invoicedBySales: 2000000
                    }
                ],
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: {
                            last: "Yelahina",
                            first: "Alona"
                        }
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: {
                            last: "Shepinka",
                            first: "Igor"
                        }
                    },
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
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: {
                            last: "Stan",
                            first: "Igor"
                        }
                    },
                    {
                        _id: "56029cc950de7f4138000005",
                        name: {
                            last: "Lendyel",
                            first: "Eugen"
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
                        _id: "55b92ad221e4b7c40f00004b",
                        name: {
                            last: "Katona",
                            first: "Roland"
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
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: {
                            last: "Bilak",
                            first: "Ivan"
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
                        _id: "55b92ad221e4b7c40f00009b",
                        name: {
                            last: "Popp",
                            first: "Larysa"
                        }
                    }
                ],
                date: 201614,
                invoiced: 2024300,
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 86348.1174755879
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 439560.4395604395
                    }
                ],
                revenue: 525908.5570360274
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        revenueBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 359432.23443223437
                    }
                ],
                date: 201615,
                revenue: 359432.23443223437
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 439560.4395604395
                    }
                ],
                date: 201616,
                revenue: 439560.4395604395
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 543727.1062271062
                    }
                ],
                date: 201617,
                revenue: 543727.1062271062
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 62500
                    }
                ],
                date: 201618,
                revenue: 62500
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 83333.33333333333
                    }
                ],
                date: 201619,
                revenue: 83333.33333333333
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 104166.66666666667
                    }
                ],
                date: 201620,
                revenue: 104166.66666666667
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 104166.66666666667
                    }
                ],
                date: 201621,
                revenue: 104166.66666666667
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 41666.666666666664
                    }
                ],
                date: 201622,
                revenue: 41666.666666666664
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3267.9738562091507
                    }
                ],
                date: 201638,
                revenue: 3267.9738562091507
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3267.9738562091507
                    }
                ],
                date: 201639,
                revenue: 3267.9738562091507
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3267.9738562091507
                    }
                ],
                date: 201640,
                revenue: 3267.9738562091507
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 3267.9738562091507
                    }
                ],
                date: 201641,
                revenue: 3267.9738562091507
            },
            {
                revenueBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        revenueBySales: 90020.237025517
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        revenueBySales: 15504.000000000002
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        revenueBySales: 100302.36025588014
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        revenueBySales: 84551.73202311425
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        revenueBySales: 49396.2441314554
                    }
                ],
                date: 201653,
                revenue: 339774.57343596674
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
            {}
        ]
    };

    var invoiceChartsCollection;
    var view;
    var topBarView;
    var indexView;

    describe('InvoiceChartsView', function () {
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

        describe('TopBarView', function () {
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to create TopBarView', function () {
                var invoiceChartsUrl = new RegExp('\/revenue\/synthetic', 'i');

                server.respondWith('GET', 'revenue/synthetic', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenueSynthetic)]);

                invoiceChartsCollection = new InvoiceChartsCollection();

                server.respond();

                topBarView = new TopBarView({
                    collection: invoiceChartsCollection
                });

                expect(topBarView.$el.find('.vocationFilter')).to.exist;
                expect(topBarView.$el.find('#searchContainer')).to.exist;
            });

        });

        describe('InvoiceChartsView', function () {
            var server;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create InvoiceCharts view', function (done) {
                    var $listHolder;
                    var invoiceChartsUrl = 'revenue/synthetic';

                    server.respondWith('GET', invoiceChartsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenueSynthetic)]);
                    indexView = new IndexView({
                        collection: invoiceChartsCollection,
                        startTime: new Date()
                    });
                    server.respond();

                    clock.tick(100);

                    $listHolder = indexView.$el;

                    expect($listHolder.find('.grid-conatiner')).to.exist;

                    done();
                });

                it('Try to change byMonth', function (done) {
                    var $thisEl = indexView.$el;
                    var $byWeekBtn = $thisEl.find('#byWeek');
                    var $byMonthBtn = $thisEl.find('#byMonth');
                    var invoiceChartsUrl = 'revenue/synthetic';

                    //server.respondWith('GET', invoiceChartsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenueSynthetic)]);
                    $byMonthBtn.click();
                    server.respond();

                    clock.tick(200);

                    expect($thisEl.find('.grid-conatiner')).to.exist;

                    done();
                });

                it('Try to change byWeek', function (done) {
                    var $thisEl = indexView.$el;
                    var $byWeekBtn = $thisEl.find('#byWeek');
                    var invoiceChartsUrl = 'revenue/synthetic?byWeek=true'

                    server.respondWith('GET', invoiceChartsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenueSyntheticByWeek)]);
                    $byWeekBtn.click();
                    server.respond();

                    clock.tick(200);

                    expect($thisEl.find('.grid-conatiner')).to.exist;

                    done();
                });

                it('Try to change date range', function () {
                    var $startDate;
                    var $endDate;
                    var $updateBtn;
                    var $topBarEl = topBarView.$el;
                    var $changeDateRangeBtn = $topBarEl.find('.dateRange');
                    var $thisEl = indexView.$el;

                    $changeDateRangeBtn.click();
                    $startDate = $topBarEl.find('#startDate');
                    $endDate = $topBarEl.find('#endDate');
                    $updateBtn = $topBarEl.find('#updateDate');

                    $startDate.val('1 Sep, 2014');
                    $endDate.val('1 Apr, 2016');

                    $updateBtn.click();
                    indexView.changeDateRange();
                    expect($thisEl.find('.grid-conatiner')).to.exist;

                });
            });

        });

    });

});
