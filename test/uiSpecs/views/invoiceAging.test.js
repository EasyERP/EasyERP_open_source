/*
define([
    'text!fixtures/index.html',
    'collections/invoiceAging/filterCollection',
    'views/main/MainView',
    'views/invoiceAging/list/ListView',
    'views/customerPayments/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, InvoiceAgingCollection, MainView, ListView, TopBarView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var fakeInvoiceAging = [
        {
            _id: "56e68f6e04f9482d4273ed27",
            project: {
                projectName: "Mobstar"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 1200000,
                balance: 1200000,
                total: 1200000
            },
            salesPerson: {
                name: "Oleg Ostroverkh"
            },
            supplier: {
                name: "MobStar "
            },
            name: "PO886",
            dueDate: "2016-03-24T00:00:00.000Z",
            diffStatus: -1
        },
        {
            _id: "56e6685a3d5bc25541857e0b",
            project: {
                projectName: "Haie"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 955700,
                balance: 955700,
                total: 955700
            },
            salesPerson: {
                name: "Vasiliy Almashiy"
            },
            supplier: {
                name: "ETECTURE GmbH "
            },
            name: "PO741",
            dueDate: "2016-03-18T00:00:00.000Z",
            diffStatus: -1
        },
        {
            _id: "56bda3e0dfd8a81466e2f4e7",
            project: {
                projectName: "BuddyBet"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 1200000,
                balance: 800000,
                total: 1200000
            },
            salesPerson: {
                name: "Igor Stan"
            },
            supplier: {
                name: "Ivar Liden"
            },
            name: "I0102022016",
            dueDate: "2016-02-06T23:00:00.000Z",
            diffStatus: 2
        },
        {
            _id: "56e666d23d5bc25541857e08",
            project: {
                projectName: "HashPlay"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 704000,
                balance: 704000,
                total: 704000
            },
            salesPerson: {
                name: "Vasiliy Almashiy"
            },
            supplier: {
                name: "HashPlay "
            },
            name: "V0103032016",
            dueDate: "2016-03-08T00:00:00.000Z",
            diffStatus: 0
        },
        {
            _id: "56d805888df756130e1e9ca2",
            project: {
                projectName: "MyDrive"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 668000,
                balance: 668000,
                total: 668000
            },
            salesPerson: {
                name: "Oleg Ostroverkh"
            },
            supplier: {
                name: "AppMedia "
            },
            name: "AY0101032016",
            dueDate: "2016-03-14T23:00:00.000Z",
            diffStatus: 0
        },
        {
            _id: "56c5988bd2b48ede4ba42242",
            project: {
                projectName: "Mobstar"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 1142500,
                balance: 642500,
                total: 1142500
            },
            salesPerson: {
                name: "Oleg Ostroverkh"
            },
            supplier: {
                name: "MobStar "
            },
            name: "A01080216",
            dueDate: "2016-02-10T23:00:00.000Z",
            diffStatus: 2
        },
        {
            _id: "56b9edbbfae0cea53a58185c",
            project: {
                projectName: "HBO"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 638700,
                balance: 638700,
                total: 638700
            },
            salesPerson: {
                name: "Roland Katona"
            },
            supplier: {
                name: "Digital Media "
            },
            name: "PO767",
            dueDate: "2016-03-08T23:00:00.000Z",
            diffStatus: 0
        },
        {
            _id: "56a9cd6bb4dc0d09232bd72d",
            project: {
                projectName: "Casino Game"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 613600,
                balance: 613600,
                total: 613600
            },
            salesPerson: {
                name: "Roland Katona"
            },
            supplier: {
                name: "VTI "
            },
            name: "PO671",
            dueDate: "2016-01-30T23:00:00.000Z",
            diffStatus: 2
        },
        {
            _id: "56d8072d981edd2e0e73744b",
            project: {
                projectName: "Appsmakerstore"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 611500,
                balance: 611500,
                total: 611500
            },
            salesPerson: {
                name: "Oleg Ostroverkh"
            },
            supplier: {
                name: "Appsmakerstore "
            },
            name: "AY0102032016",
            dueDate: "2016-03-14T23:00:00.000Z",
            diffStatus: 0
        },
        {
            _id: "56b066b974d57e0d56d6bfa3",
            project: {
                projectName: "Casino Game"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 572000,
                balance: 572000,
                total: 572000
            },
            salesPerson: {
                name: "Roland Katona"
            },
            supplier: {
                name: "VTI "
            },
            name: "R01020216",
            dueDate: "2016-02-21T23:00:00.000Z",
            diffStatus: 1
        },
        {
            _id: "566196557d284423697e2e3e",
            project: {
                projectName: "Pseudo"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 534400,
                balance: 534400,
                total: 534400
            },
            salesPerson: {
                name: "Oleg Ostroverkh"
            },
            supplier: {
                name: "Technatives "
            },
            name: "1127/2015",
            dueDate: "2015-09-08T22:00:00.000Z",
            diffStatus: 4
        },
        {
            _id: "56a0ba0c62d172544baf0df8",
            project: {
                projectName: "Bodega application"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 386000,
                balance: 386000,
                total: 386000
            },
            salesPerson: {
                name: "Oleg Ostroverkh"
            },
            supplier: {
                name: "Cristaliza "
            },
            name: "A0118122016",
            dueDate: "2016-01-31T23:00:00.000Z",
            diffStatus: 2
        },
        {
            _id: "5661a9a97d284423697e3634",
            project: {
                projectName: "Legal Application"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 344000,
                balance: 344000,
                total: 344000
            },
            salesPerson: {
                name: "Oleg Ostroverkh"
            },
            supplier: {
                name: "SharperBuilds "
            },
            name: "A0102112015",
            dueDate: "2015-11-29T23:00:00.000Z",
            diffStatus: 4
        },
        {
            _id: "56e66b8e81046d9741fb66d2",
            project: {
                projectName: "Habi"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 328000,
                balance: 328000,
                total: 328000
            },
            salesPerson: {
                name: "Larysa Popp"
            },
            supplier: {
                name: "Michael FitzGerald"
            },
            name: "PO865",
            dueDate: "2016-03-21T00:00:00.000Z",
            diffStatus: -1
        },
        {
            _id: "56e670c3ef05acd9418dff1f",
            project: {
                projectName: "OnSite Unibet"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 300000,
                balance: 300000,
                total: 300000
            },
            salesPerson: {
                name: "Peter Voloshchuk"
            },
            supplier: {
                name: "Unibet "
            },
            name: "PO876",
            dueDate: "2016-03-05T00:00:00.000Z",
            diffStatus: 0
        },
        {
            _id: "56af4d8974d57e0d56d6bee8",
            project: {
                projectName: "Pilot"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 276700,
                balance: 276700,
                total: 276700
            },
            salesPerson: {
                name: "Roland Katona"
            },
            supplier: {
                name: "Andreas Rabenseifner "
            },
            name: "R01071215",
            dueDate: "2016-01-06T23:00:00.000Z",
            diffStatus: 3
        },
        {
            _id: "56e66fb15ec71b0042974590",
            project: {
                projectName: "OnSite Unibet"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 222500,
                balance: 222500,
                total: 222500
            },
            salesPerson: {
                name: "Peter Voloshchuk"
            },
            supplier: {
                name: "Unibet "
            },
            name: "PO685",
            dueDate: "2016-02-20T00:00:00.000Z",
            diffStatus: 1
        },
        {
            _id: "56573429bfd103f108eb4a92",
            project: {
                projectName: "WhachApp"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 202000,
                balance: 202000,
                total: 202000
            },
            salesPerson: {
                name: "Peter Voloshchuk"
            },
            supplier: {
                name: "MediaHeads "
            },
            name: "PO457",
            dueDate: "2015-12-11T16:32:41.589Z",
            diffStatus: 4
        },
        {
            _id: "56e292493c074d636203bbd0",
            project: {
                projectName: "Android advertisement"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 193200,
                balance: 193200,
                total: 193200
            },
            salesPerson: {
                name: "Nataliya Yartysh"
            },
            supplier: {
                name: "Nimrod Nahum"
            },
            name: "PO857",
            diffStatus: -1
        },
        {
            _id: "56e6704a81046d9741fb66d7",
            project: {
                projectName: "OnSite Unibet"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 169000,
                balance: 169000,
                total: 169000
            },
            salesPerson: {
                name: "Peter Voloshchuk"
            },
            supplier: {
                name: "Unibet "
            },
            name: "PO874",
            dueDate: "2016-01-20T00:00:00.000Z",
            diffStatus: 2
        },
        {
            _id: "56af4f9274d57e0d56d6bef0",
            project: {
                projectName: "Pilot"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 162700,
                balance: 162700,
                total: 162700
            },
            salesPerson: {
                name: "Roland Katona"
            },
            supplier: {
                name: "Andreas Rabenseifner "
            },
            name: "R01110116",
            dueDate: "2016-02-09T23:00:00.000Z",
            diffStatus: 2
        },
        {
            _id: "56e2984506caf2ee61b6f7ce",
            project: {
                projectName: "Spoon Comics"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 156000,
                balance: 156000,
                total: 156000
            },
            salesPerson: {
                name: "Igor Shepinka"
            },
            supplier: {
                name: "Takumi Networks "
            },
            name: "I01100316",
            dueDate: "2016-03-18T00:00:00.000Z",
            diffStatus: -1
        },
        {
            _id: "5661c797f13e46fd14533f37",
            project: {
                projectName: "Mesa Ave"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 115200,
                balance: 115200,
                total: 115200
            },
            salesPerson: {
                name: "Roland Katona"
            },
            supplier: {
                name: "Genexies "
            },
            name: "PO554",
            dueDate: "2015-12-17T23:00:00.000Z",
            diffStatus: 3
        },
        {
            _id: "566024564afaaced62c683bb",
            project: {
                projectName: "FarmStatistic"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 80000,
                balance: 80000,
                total: 80000
            },
            salesPerson: {
                name: "Peter Voloshchuk"
            },
            supplier: {
                name: "Erez Leket"
            },
            name: "PO455",
            dueDate: "2015-12-14T23:00:00.000Z",
            diffStatus: 4
        },
        {
            _id: "56574434bfd103f108eb4aef",
            paymentInfo: {
                taxes: 0,
                unTaxed: 76000,
                balance: 76000,
                total: 76000
            },
            salesPerson: {
                name: "Oleg Ostroverkh"
            },
            supplier: {
                name: "Ivcarto "
            },
            name: "PO465",
            dueDate: "2015-12-11T17:41:08.563Z",
            diffStatus: 4
        },
        {
            _id: "56e66e263d5bc25541857e11",
            project: {
                projectName: "DRH manual"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 14700,
                balance: 14700,
                total: 14700
            },
            salesPerson: {
                name: "Yana Gusti"
            },
            supplier: {
                name: "Mike Allstar "
            },
            name: "27050192",
            dueDate: "2016-03-19T00:00:00.000Z",
            diffStatus: -1
        },
        {
            _id: "56e672cc68e298b24198564b",
            project: {
                projectName: "DRH QA Automation"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 7200,
                balance: 7200,
                total: 7200
            },
            salesPerson: {
                name: "Yana Gusti"
            },
            supplier: {
                name: "Mike Allstar "
            },
            name: "27050225",
            dueDate: "2016-03-19T00:00:00.000Z",
            diffStatus: -1
        }
    ];


    var invoiveAgingCollection;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;

    describe('InvoiceAging View', function () {
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

                view = new MainView({el: $elFixture, contentType: 'invoiceAging'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="82"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="82"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/invoiceAging');

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
                var invoiceAging = new RegExp('\/invoice\/stats/', 'i');

                server.respondWith('GET', invoiceAging, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeInvoiceAging)]);

                invoiveAgingCollection = new InvoiceAgingCollection({
                    viewType: 'list',
                    page: 1,
                    count: 100,
                    contentType: 'invoiceAging'
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: invoiveAgingCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

        });

        describe('SupplierPayments list view', function () {
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

                it('Try to create invoiceAging list view', function () {
                    var $listHolder;
                    var invoiceAging = new RegExp('\/invoice\/stats/', 'i');
                    server.respondWith('GET', invoiceAging, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeInvoiceAging)]);

                    listView = new ListView({
                        collection: invoiveAgingCollection,
                        startTime: new Date(),
                        count: 100
                    });

                    server.respond();

                    $listHolder = listView.$el;

                    expect($listHolder.find('table')).to.exist;


                });
            });

        });

    });

});
*/
