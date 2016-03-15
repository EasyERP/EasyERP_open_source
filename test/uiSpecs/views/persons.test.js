define([
    'text!fixtures/index.html',
    'router',
    'models/PersonsModel',
    'collections/Persons/filterCollection',
    'views/main/MainView',
    'views/Persons/TopBarView',
    'views/Persons/CreateView',
    'views/Persons/EditView',
    'views/Persons/form/FormView',
    'views/Persons/list/ListView',
    'views/Persons/thumbnails/ThumbnailsView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, router, PersonModel, PersonsCollection, MainView, TopBarView, CreateView, EditView, FormView, ListView, ThumbnailsView, $, chai, chaiJquery, sinonChai, Custom) {
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

    var fakePersons = {
        data: [
            {
                _id: "55b92ad521e4b7c40f00060c",
                company: null,
                email: "",
                name: {
                    last: "Blinov",
                    first: "Alexey"
                },
                fullName: "Alexey Blinov",
                id: "55b92ad521e4b7c40f00060c"
            },
            {
                _id: "55b92ad521e4b7c40f00060e",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Pekaboo/D.Kaufman"
                },
                fullName: "Pekaboo/D.Kaufman ",
                id: "55b92ad521e4b7c40f00060e"
            },
            {
                _id: "55b92ad521e4b7c40f00060f",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Sharmila"
                },
                fullName: "Sharmila ",
                id: "55b92ad521e4b7c40f00060f"
            },
            {
                _id: "55b92ad521e4b7c40f000610",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Norbert"
                },
                fullName: "Norbert ",
                id: "55b92ad521e4b7c40f000610"
            },
            {
                _id: "55b92ad521e4b7c40f000611",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Remon"
                },
                fullName: "Remon ",
                id: "55b92ad521e4b7c40f000611"
            },
            {
                _id: "55b92ad521e4b7c40f000612",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Isaac S."
                },
                fullName: "Isaac S. ",
                id: "55b92ad521e4b7c40f000612"
            },
            {
                _id: "55b92ad521e4b7c40f000613",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Kikast"
                },
                fullName: "Kikast ",
                id: "55b92ad521e4b7c40f000613"
            },
            {
                _id: "55b92ad521e4b7c40f000614",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "The Watch Enthusiast"
                },
                fullName: "The Watch Enthusiast ",
                id: "55b92ad521e4b7c40f000614"
            },
            {
                _id: "55b92ad521e4b7c40f000615",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "TechJoiner"
                },
                fullName: "TechJoiner ",
                id: "55b92ad521e4b7c40f000615"
            },
            {
                _id: "55b92ad521e4b7c40f000616",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "ThinkApps"
                },
                fullName: "ThinkApps ",
                id: "55b92ad521e4b7c40f000616"
            },
            {
                _id: "55b92ad521e4b7c40f000617",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Peter Hickey"
                },
                fullName: "Peter Hickey ",
                id: "55b92ad521e4b7c40f000617"
            },
            {
                _id: "55b92ad521e4b7c40f000618",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Tarun M."
                },
                fullName: "Tarun M. ",
                id: "55b92ad521e4b7c40f000618"
            },
            {
                _id: "55b92ad521e4b7c40f000619",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Israel"
                },
                fullName: "Israel ",
                id: "55b92ad521e4b7c40f000619"
            },
            {
                _id: "55b92ad521e4b7c40f00061a",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Ivcarto"
                },
                fullName: "Ivcarto ",
                id: "55b92ad521e4b7c40f00061a"
            },
            {
                _id: "55b92ad521e4b7c40f00061b",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Unlimited Conferencing"
                },
                fullName: "Unlimited Conferencing ",
                id: "55b92ad521e4b7c40f00061b"
            },
            {
                _id: "55b92ad521e4b7c40f00061c",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Genexies"
                },
                fullName: "Genexies ",
                id: "55b92ad521e4b7c40f00061c"
            },
            {
                _id: "55b92ad521e4b7c40f00061f",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "PostIndustria"
                },
                fullName: "PostIndustria ",
                id: "55b92ad521e4b7c40f00061f"
            },
            {
                _id: "55b92ad521e4b7c40f000620",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Thomas Sinquin"
                },
                fullName: "Thomas Sinquin ",
                id: "55b92ad521e4b7c40f000620"
            },
            {
                _id: "55b92ad521e4b7c40f000621",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Mike Allstar"
                },
                fullName: "Mike Allstar ",
                id: "55b92ad521e4b7c40f000621"
            },
            {
                _id: "55b92ad521e4b7c40f000622",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Chamin"
                },
                fullName: "Chamin ",
                id: "55b92ad521e4b7c40f000622"
            },
            {
                _id: "55b92ad621e4b7c40f000623",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Vladi"
                },
                fullName: "Vladi ",
                id: "55b92ad621e4b7c40f000623"
            },
            {
                _id: "55b92ad621e4b7c40f000624",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Giroptic"
                },
                fullName: "Giroptic ",
                id: "55b92ad621e4b7c40f000624"
            },
            {
                _id: "55b92ad621e4b7c40f000625",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "WishExpress"
                },
                fullName: "WishExpress ",
                id: "55b92ad621e4b7c40f000625"
            },
            {
                _id: "55b92ad621e4b7c40f000626",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "ShargoO"
                },
                fullName: "ShargoO ",
                id: "55b92ad621e4b7c40f000626"
            },
            {
                _id: "55b92ad621e4b7c40f000627",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "UfukTogay"
                },
                fullName: "UfukTogay ",
                id: "55b92ad621e4b7c40f000627"
            },
            {
                _id: "55b92ad621e4b7c40f000628",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Quimron"
                },
                fullName: "Quimron ",
                id: "55b92ad621e4b7c40f000628"
            },
            {
                _id: "55b92ad621e4b7c40f00062b",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "HashPlay"
                },
                fullName: "HashPlay ",
                id: "55b92ad621e4b7c40f00062b"
            },
            {
                _id: "55b92ad621e4b7c40f00062c",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "spscontrol"
                },
                fullName: "spscontrol ",
                id: "55b92ad621e4b7c40f00062c"
            },
            {
                _id: "55b92ad621e4b7c40f00062d",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Andreas Rabenseifner"
                },
                fullName: "Andreas Rabenseifner ",
                id: "55b92ad621e4b7c40f00062d"
            },
            {
                _id: "55b92ad621e4b7c40f00062f",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Mark"
                },
                fullName: "Mark ",
                id: "55b92ad621e4b7c40f00062f"
            },
            {
                _id: "55b92ad621e4b7c40f000630",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "PPT Group"
                },
                fullName: "PPT Group ",
                id: "55b92ad621e4b7c40f000630"
            },
            {
                _id: "55b92ad621e4b7c40f000631",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Tinybeans"
                },
                fullName: "Tinybeans ",
                id: "55b92ad621e4b7c40f000631"
            },
            {
                _id: "55b92ad621e4b7c40f000632",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "evista"
                },
                fullName: "evista ",
                id: "55b92ad621e4b7c40f000632"
            },
            {
                _id: "55b92ad621e4b7c40f000634",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Max"
                },
                fullName: "Max ",
                id: "55b92ad621e4b7c40f000634"
            },
            {
                _id: "55b92ad621e4b7c40f000635",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Academiacs"
                },
                fullName: "Academiacs ",
                id: "55b92ad621e4b7c40f000635"
            },
            {
                _id: "55b92ad621e4b7c40f000636",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Constantine"
                },
                fullName: "Constantine ",
                id: "55b92ad621e4b7c40f000636"
            },
            {
                _id: "55b92ad621e4b7c40f000637",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Airsoft Holdings "
                },
                fullName: "Airsoft Holdings ",
                id: "55b92ad621e4b7c40f000637"
            },
            {
                _id: "55b92ad621e4b7c40f000638",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Unibet"
                },
                fullName: "Unibet ",
                id: "55b92ad621e4b7c40f000638"
            },
            {
                _id: "55b92ad621e4b7c40f000639",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Digital Media"
                },
                fullName: "Digital Media ",
                id: "55b92ad621e4b7c40f000639"
            },
            {
                _id: "55b92ad621e4b7c40f00063a",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "TrumpMedia"
                },
                fullName: "TrumpMedia ",
                id: "55b92ad621e4b7c40f00063a"
            },
            {
                _id: "55b92ad621e4b7c40f00063b",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Foxtrapp"
                },
                fullName: "Foxtrapp ",
                id: "55b92ad621e4b7c40f00063b"
            },
            {
                _id: "55b92ad621e4b7c40f00063c",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "DigiPresents"
                },
                fullName: "DigiPresents ",
                id: "55b92ad621e4b7c40f00063c"
            },
            {
                _id: "55b92ad621e4b7c40f00063e",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "VTI"
                },
                fullName: "VTI ",
                id: "55b92ad621e4b7c40f00063e"
            },
            {
                _id: "55b92ad621e4b7c40f000640",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Oris4/TimWilson"
                },
                fullName: "Oris4/TimWilson ",
                id: "55b92ad621e4b7c40f000640"
            },
            {
                _id: "55b92ad621e4b7c40f000641",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Global Forwarding LLC"
                },
                fullName: "Global Forwarding LLC ",
                id: "55b92ad621e4b7c40f000641"
            },
            {
                _id: "55b92ad621e4b7c40f000642",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Volodymyr Lychman"
                },
                fullName: "Volodymyr Lychman ",
                id: "55b92ad621e4b7c40f000642"
            },
            {
                _id: "55b92ad621e4b7c40f000643",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Angelica"
                },
                fullName: "Angelica ",
                id: "55b92ad621e4b7c40f000643"
            },
            {
                _id: "55b92ad621e4b7c40f000644",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "iask consulting"
                },
                fullName: "iask consulting ",
                id: "55b92ad621e4b7c40f000644"
            },
            {
                _id: "55b92ad621e4b7c40f000645",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Vlad"
                },
                fullName: "Vlad ",
                id: "55b92ad621e4b7c40f000645"
            },
            {
                _id: "55b92ad621e4b7c40f000647",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Joren Rapiny"
                },
                fullName: "Joren Rapiny ",
                id: "55b92ad621e4b7c40f000647"
            },
            {
                _id: "55b92ad621e4b7c40f000648",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Anand Gupta"
                },
                fullName: "Anand Gupta ",
                id: "55b92ad621e4b7c40f000648"
            },
            {
                _id: "55b92ad621e4b7c40f000649",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Contegra Systems"
                },
                fullName: "Contegra Systems ",
                id: "55b92ad621e4b7c40f000649"
            },
            {
                _id: "55b92ad621e4b7c40f00064a",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Carussel"
                },
                fullName: "Carussel ",
                id: "55b92ad621e4b7c40f00064a"
            },
            {
                _id: "55b92ad621e4b7c40f00064b",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Thomas"
                },
                fullName: "Thomas ",
                id: "55b92ad621e4b7c40f00064b"
            },
            {
                _id: "55b92ad621e4b7c40f00064c",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Razvan Chisu"
                },
                fullName: "Razvan Chisu ",
                id: "55b92ad621e4b7c40f00064c"
            },
            {
                _id: "55b92ad621e4b7c40f00064d",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "ProTriever"
                },
                fullName: "ProTriever ",
                id: "55b92ad621e4b7c40f00064d"
            },
            {
                _id: "55b92ad621e4b7c40f00064e",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "SetFile"
                },
                fullName: "SetFile ",
                id: "55b92ad621e4b7c40f00064e"
            },
            {
                _id: "55b92ad621e4b7c40f000650",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "PatrickMolander"
                },
                fullName: "PatrickMolander ",
                id: "55b92ad621e4b7c40f000650"
            },
            {
                _id: "55b92ad621e4b7c40f000651",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Dan D."
                },
                fullName: "Dan D. ",
                id: "55b92ad621e4b7c40f000651"
            },
            {
                _id: "55b92ad621e4b7c40f000652",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Zugara"
                },
                fullName: "Zugara ",
                id: "55b92ad621e4b7c40f000652"
            },
            {
                _id: "55b92ad621e4b7c40f000653",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Peter B."
                },
                fullName: "Peter B. ",
                id: "55b92ad621e4b7c40f000653"
            },
            {
                _id: "55b92ad621e4b7c40f000654",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "iqDesk"
                },
                fullName: "iqDesk ",
                id: "55b92ad621e4b7c40f000654"
            },
            {
                _id: "55b92ad621e4b7c40f000655",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "We do apps"
                },
                fullName: "We do apps ",
                id: "55b92ad621e4b7c40f000655"
            },
            {
                _id: "55b92ad621e4b7c40f000656",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "ShiwaForce"
                },
                fullName: "ShiwaForce ",
                id: "55b92ad621e4b7c40f000656"
            },
            {
                _id: "55b92ad621e4b7c40f000657",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Nikky"
                },
                fullName: "Nikky ",
                id: "55b92ad621e4b7c40f000657"
            },
            {
                _id: "55b92ad621e4b7c40f000658",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "JellyGames"
                },
                fullName: "JellyGames ",
                id: "55b92ad621e4b7c40f000658"
            },
            {
                _id: "55b92ad621e4b7c40f000659",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "PBI-Solutions"
                },
                fullName: "PBI-Solutions ",
                id: "55b92ad621e4b7c40f000659"
            },
            {
                _id: "55b92ad621e4b7c40f00065a",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Technatives"
                },
                fullName: "Technatives ",
                id: "55b92ad621e4b7c40f00065a"
            },
            {
                _id: "55b92ad621e4b7c40f00065b",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Kogan.com"
                },
                fullName: "Kogan.com ",
                id: "55b92ad621e4b7c40f00065b"
            },
            {
                _id: "55b92ad621e4b7c40f00065d",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "CloudFuze"
                },
                fullName: "CloudFuze ",
                id: "55b92ad621e4b7c40f00065d"
            },
            {
                _id: "55b92ad621e4b7c40f00065e",
                company: null,
                email: "",
                name: {
                    last: "",
                    first: "Collections Tech"
                },
                fullName: "Collections Tech ",
                id: "55b92ad621e4b7c40f00065e"
            },
            {
                _id: "55b9fa60d79a3a3439000005",
                company: {
                    _id: "55b92ad521e4b7c40f00061d",
                    name: {
                        last: "",
                        first: "Buzinga"
                    },
                    fullName: "Buzinga ",
                    id: "55b92ad521e4b7c40f00061d"
                },
                email: "jason@buzinga.com.au",
                name: {
                    last: "Coutsodimitropoulos",
                    first: "Jason"
                },
                fullName: "Jason Coutsodimitropoulos",
                id: "55b9fa60d79a3a3439000005"
            },
            {
                _id: "55b9ff67d79a3a343900000a",
                company: {
                    _id: "55b9fe20d79a3a3439000009",
                    name: {
                        last: "",
                        first: "Kogan"
                    },
                    fullName: "Kogan ",
                    id: "55b9fe20d79a3a3439000009"
                },
                email: "ruslan@kogan.com.au",
                name: {
                    last: "Kogan",
                    first: "Ruslan"
                },
                fullName: "Ruslan Kogan",
                id: "55b9ff67d79a3a343900000a"
            },
            {
                _id: "55ba006ed79a3a343900000b",
                company: {
                    _id: "55b92ad521e4b7c40f00060d",
                    name: {
                        last: "",
                        first: "Sportsman Tracker"
                    },
                    fullName: "Sportsman Tracker ",
                    id: "55b92ad521e4b7c40f00060d"
                },
                email: "jeffrey.courter@gmail.com",
                name: {
                    last: "Courter",
                    first: "Jeff"
                },
                fullName: "Jeff Courter",
                id: "55ba006ed79a3a343900000b"
            },
            {
                _id: "55ba0362d79a3a343900000e",
                company: {
                    _id: "55ba0301d79a3a343900000d",
                    name: {
                        last: "",
                        first: "#Play"
                    },
                    fullName: "#Play ",
                    id: "55ba0301d79a3a343900000d"
                },
                email: "in@hashplay.tv",
                name: {
                    last: "Nadler",
                    first: "Ingo"
                },
                fullName: "Ingo Nadler",
                id: "55ba0362d79a3a343900000e"
            },
            {
                _id: "55ba0479d79a3a3439000010",
                company: {
                    _id: "55b92ad621e4b7c40f00062e",
                    name: {
                        last: "",
                        first: "Web1 Syndication, Inc"
                    },
                    fullName: "Web1 Syndication, Inc ",
                    id: "55b92ad621e4b7c40f00062e"
                },
                email: "",
                name: {
                    last: "Lupsor",
                    first: "Drew"
                },
                fullName: "Drew Lupsor",
                id: "55ba0479d79a3a3439000010"
            },
            {
                _id: "55ba04d5d79a3a3439000011",
                company: {
                    _id: "55ba03f8d79a3a343900000f",
                    name: {
                        last: "",
                        first: "GlobalWorkshop"
                    },
                    fullName: "GlobalWorkshop ",
                    id: "55ba03f8d79a3a343900000f"
                },
                email: "rowan@globalworkshop.ws",
                name: {
                    last: "Hick",
                    first: "Rowan"
                },
                fullName: "Rowan Hick",
                id: "55ba04d5d79a3a3439000011"
            },
            {
                _id: "55ba0701d79a3a3439000012",
                company: {
                    _id: "55b92ad621e4b7c40f000629",
                    name: {
                        last: "",
                        first: "Cristaliza"
                    },
                    fullName: "Cristaliza ",
                    id: "55b92ad621e4b7c40f000629"
                },
                email: "francisco.calvo.vicente@gmail.com",
                name: {
                    last: "Vicente",
                    first: "Francisco Calvo"
                },
                fullName: "Francisco Calvo Vicente",
                id: "55ba0701d79a3a3439000012"
            },
            {
                _id: "55ba0df2d79a3a3439000015",
                company: {
                    _id: "55ba0b46d79a3a3439000013",
                    name: {
                        last: "",
                        first: "Unibet"
                    },
                    fullName: "Unibet ",
                    id: "55ba0b46d79a3a3439000013"
                },
                email: "dr.loop@gmail.com",
                name: {
                    last: "Leket",
                    first: "Erez"
                },
                fullName: "Erez Leket",
                id: "55ba0df2d79a3a3439000015"
            },
            {
                _id: "55d37aee226ed3280b000005",
                company: {
                    _id: "55cf362b4a91e37b0b0000c1",
                    name: {
                        last: "",
                        first: "MobStar"
                    },
                    fullName: "MobStar ",
                    id: "55cf362b4a91e37b0b0000c1"
                },
                email: "brendan@mobstar.com",
                name: {
                    last: "Morrisey",
                    first: "Brendan"
                },
                fullName: "Brendan Morrisey",
                id: "55d37aee226ed3280b000005"
            },
            {
                _id: "55d37d50226ed3280b000006",
                company: {
                    _id: "55cf362b4a91e37b0b0000c1",
                    name: {
                        last: "",
                        first: "MobStar"
                    },
                    fullName: "MobStar ",
                    id: "55cf362b4a91e37b0b0000c1"
                },
                email: "matt@mobstar.com",
                name: {
                    last: "Fulford",
                    first: "Matt"
                },
                fullName: "Matt Fulford",
                id: "55d37d50226ed3280b000006"
            },
            {
                _id: "55d38523226ed3280b000007",
                company: {
                    _id: "55cf4f834a91e37b0b000102",
                    name: {
                        last: "",
                        first: "SharperBuilds"
                    },
                    fullName: "SharperBuilds ",
                    id: "55cf4f834a91e37b0b000102"
                },
                email: "peter@sharperbuilds.com",
                name: {
                    last: "Hickey",
                    first: "Peter"
                },
                fullName: "Peter Hickey",
                id: "55d38523226ed3280b000007"
            },
            {
                _id: "562bba2062461bfd59ef58c0",
                company: null,
                email: "",
                name: {
                    last: "Unknown",
                    first: "Mark"
                },
                fullName: "Mark Unknown",
                id: "562bba2062461bfd59ef58c0"
            },
            {
                _id: "5637627bc928c61d052d500e",
                company: {
                    _id: "561d1bc0b51032d674856acb",
                    name: {
                        last: "",
                        first: "Attrecto"
                    },
                    fullName: "Attrecto ",
                    id: "561d1bc0b51032d674856acb"
                },
                email: "tibor.bekefi@attrecto.com",
                name: {
                    last: "Bekefi",
                    first: "Tibor"
                },
                fullName: "Tibor Bekefi",
                id: "5637627bc928c61d052d500e"
            },
            {
                _id: "56574092bfd103f108eb4ad3",
                company: {
                    _id: "56574032bfd103f108eb4ad2",
                    name: {
                        last: "",
                        first: "Marand"
                    },
                    fullName: "Marand ",
                    id: "56574032bfd103f108eb4ad2"
                },
                email: "Ales.Smokvina@marand.si",
                name: {
                    last: "Smokvina",
                    first: "Ales"
                },
                fullName: "Ales Smokvina",
                id: "56574092bfd103f108eb4ad3"
            },
            {
                _id: "5661809cbb8be7814fb52584",
                company: {
                    _id: "5661805cbb8be7814fb52529",
                    name: {
                        last: "",
                        first: "Otrema"
                    },
                    fullName: "Otrema ",
                    id: "5661805cbb8be7814fb52529"
                },
                email: "",
                name: {
                    last: "Yilmaz",
                    first: "Selim"
                },
                fullName: "Selim Yilmaz",
                id: "5661809cbb8be7814fb52584"
            },
            {
                _id: "56685d4fa3fc012a68f0d853",
                company: null,
                email: "",
                name: {
                    last: "Burer",
                    first: "Nicolas"
                },
                fullName: "Nicolas Burer",
                id: "56685d4fa3fc012a68f0d853"
            },
            {
                _id: "566d4b55abccac87642cb522",
                company: null,
                email: "",
                name: {
                    last: "Sans",
                    first: "Olivier"
                },
                fullName: "Olivier Sans",
                id: "566d4b55abccac87642cb522"
            },
            {
                _id: "569f581762d172544baf0c3b",
                company: {
                    _id: "569f57be62d172544baf0c3a",
                    name: {
                        last: "",
                        first: "ETECTURE GmbH"
                    },
                    fullName: "ETECTURE GmbH ",
                    id: "569f57be62d172544baf0c3a"
                },
                email: "Dirk.Ziegener@etecture.de",
                name: {
                    last: "Ziegener",
                    first: "Dirk"
                },
                fullName: "Dirk Ziegener",
                id: "569f581762d172544baf0c3b"
            },
            {
                _id: "569f599062d172544baf0c3f",
                company: {
                    _id: "569f590262d172544baf0c3e",
                    name: {
                        last: "",
                        first: "Time2view"
                    },
                    fullName: "Time2view ",
                    id: "569f590262d172544baf0c3e"
                },
                email: "gn.nevo@gmail.com",
                name: {
                    last: "Nevo",
                    first: "Gilad"
                },
                fullName: "Gilad Nevo",
                id: "569f599062d172544baf0c3f"
            },
            {
                _id: "569f603762d172544baf0d57",
                company: {
                    _id: "569f5fbf62d172544baf0d56",
                    name: {
                        last: "",
                        first: "BIScience"
                    },
                    fullName: "BIScience ",
                    id: "569f5fbf62d172544baf0d56"
                },
                email: "nimrod.nahum@biscience.com",
                name: {
                    last: "Nahum",
                    first: "Nimrod"
                },
                fullName: "Nimrod Nahum",
                id: "569f603762d172544baf0d57"
            },
            {
                _id: "56a0d53b62d172544baf0e3c",
                company: {
                    _id: "56a0d4b962d172544baf0e3b",
                    name: {
                        last: "",
                        first: "Chimney"
                    },
                    fullName: "Chimney ",
                    id: "56a0d4b962d172544baf0e3b"
                },
                email: "ivarliden@gmail.com",
                name: {
                    last: "Liden",
                    first: "Ivar"
                },
                fullName: "Ivar Liden",
                id: "56a0d53b62d172544baf0e3c"
            },
            {
                _id: "56a23c26aa157ca50f21fae0",
                company: null,
                email: "richard.hazenberg@lunagames.com",
                name: {
                    last: "Hazenberg",
                    first: "Richard"
                },
                fullName: "Richard Hazenberg",
                id: "56a23c26aa157ca50f21fae0"
            },
            {
                _id: "56a8930ceb2b76c70ec74d1d",
                company: null,
                email: "seb@locappy.com",
                name: {
                    last: "Lyall",
                    first: "Sebastian"
                },
                fullName: "Sebastian Lyall",
                id: "56a8930ceb2b76c70ec74d1d"
            },
            {
                _id: "56a9eeabd59a04d6225b0df5",
                company: null,
                email: "",
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                fullName: "Peter Voloshchuk",
                id: "56a9eeabd59a04d6225b0df5"
            },
            {
                _id: "56ab5ca674d57e0d56d6bda4",
                company: null,
                email: "",
                name: {
                    last: "Maurstad",
                    first: "Stian"
                },
                fullName: "Stian Maurstad",
                id: "56ab5ca674d57e0d56d6bda4"
            },
            {
                _id: "56bc9b72dfd8a81466e2f48c",
                company: {
                    _id: "56bc9b53dfd8a81466e2f48b",
                    name: {
                        last: "",
                        first: "TestAlina"
                    },
                    fullName: "TestAlina ",
                    id: "56bc9b53dfd8a81466e2f48b"
                },
                email: "",
                name: {
                    last: "Person",
                    first: "Test"
                },
                fullName: "Test Person",
                id: "56bc9b72dfd8a81466e2f48c"
            },
            {
                _id: "56d024b4b5057fdb22ff9095",
                company: null,
                email: "",
                name: {
                    last: "dsf",
                    first: "df"
                },
                fullName: "df dsf",
                id: "56d024b4b5057fdb22ff9095"
            }
        ]
    };

    var fakeCollectionTotal = {
        showMore: false,
        count: 98
    };

    var fakeAlfabetic = {
        data: [
            {
                _id: "d"
            },
            {
                _id: "Z"
            },
            {
                _id: "Y"
            },
            {
                _id: "L"
            },
            {
                _id: ""
            },
            {
                _id: "F"
            },
            {
                _id: "M"
            },
            {
                _id: "P"
            },
            {
                _id: "B"
            },
            {
                _id: "C"
            },
            {
                _id: "K"
            },
            {
                _id: "S"
            },
            {
                _id: "N"
            },
            {
                _id: "U"
            },
            {
                _id: "H"
            },
            {
                _id: "V"
            }
        ]
    };

    var fakePersonsForList = {
        data: [
            {
                _id: "56d024b4b5057fdb22ff9095",
                editedBy: {
                    date: "2016-02-26T10:11:00.631Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2016-02-26T10:11:00.630Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: ""
                },
                email: "",
                name: {
                    last: "dsf",
                    first: "df"
                },
                fullName: "df dsf",
                id: "56d024b4b5057fdb22ff9095"
            },
            {
                _id: "56bc9b72dfd8a81466e2f48c",
                editedBy: {
                    date: "2016-02-11T14:32:18.211Z",
                    user: null
                },
                createdBy: {
                    date: "2016-02-11T14:32:18.211Z",
                    user: null
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: ""
                },
                email: "",
                name: {
                    last: "Person",
                    first: "Test"
                },
                fullName: "Test Person",
                id: "56bc9b72dfd8a81466e2f48c"
            },
            {
                _id: "56ab5ca674d57e0d56d6bda4",
                editedBy: {
                    date: "2016-01-29T12:35:50.671Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                createdBy: {
                    date: "2016-01-29T12:35:50.671Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "Maurstad",
                    first: "Stian"
                },
                fullName: "Stian Maurstad",
                id: "56ab5ca674d57e0d56d6bda4"
            },
            {
                _id: "56a9eeabd59a04d6225b0df5",
                editedBy: {
                    date: "2016-01-28T10:34:19.353Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2016-01-28T10:34:19.353Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: ""
                },
                email: "",
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                },
                fullName: "Peter Voloshchuk",
                id: "56a9eeabd59a04d6225b0df5"
            },
            {
                _id: "56a8930ceb2b76c70ec74d1d",
                editedBy: {
                    date: "2016-01-27T09:51:08.453Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                createdBy: {
                    date: "2016-01-27T09:51:08.453Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "UK"
                },
                email: "seb@locappy.com",
                name: {
                    last: "Lyall",
                    first: "Sebastian"
                },
                fullName: "Sebastian Lyall",
                id: "56a8930ceb2b76c70ec74d1d"
            },
            {
                _id: "56a23c26aa157ca50f21fae0",
                editedBy: {
                    date: "2016-01-22T14:26:46.982Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                createdBy: {
                    date: "2016-01-22T14:26:46.982Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Netherlands"
                },
                email: "richard.hazenberg@lunagames.com",
                name: {
                    last: "Hazenberg",
                    first: "Richard"
                },
                fullName: "Richard Hazenberg",
                id: "56a23c26aa157ca50f21fae0"
            },
            {
                _id: "56a0d53b62d172544baf0e3c",
                editedBy: {
                    date: "2016-01-21T12:55:23.586Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                createdBy: {
                    date: "2016-01-21T12:55:23.586Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Sweden"
                },
                email: "ivarliden@gmail.com",
                name: {
                    last: "Liden",
                    first: "Ivar"
                },
                fullName: "Ivar Liden",
                id: "56a0d53b62d172544baf0e3c"
            },
            {
                _id: "569f603762d172544baf0d57",
                editedBy: {
                    date: "2016-01-20T10:23:51.063Z",
                    user: {
                        _id: "561e37f7d6c741e8235f42cb",
                        login: "natalia.yartysh"
                    }
                },
                createdBy: {
                    date: "2016-01-20T10:23:51.063Z",
                    user: {
                        _id: "561e37f7d6c741e8235f42cb",
                        login: "natalia.yartysh"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Israel"
                },
                email: "nimrod.nahum@biscience.com",
                name: {
                    last: "Nahum",
                    first: "Nimrod"
                },
                fullName: "Nimrod Nahum",
                id: "569f603762d172544baf0d57"
            },
            {
                _id: "569f599062d172544baf0c3f",
                editedBy: {
                    date: "2016-01-20T09:55:28.186Z",
                    user: {
                        _id: "561e37f7d6c741e8235f42cb",
                        login: "natalia.yartysh"
                    }
                },
                createdBy: {
                    date: "2016-01-20T09:55:28.186Z",
                    user: {
                        _id: "561e37f7d6c741e8235f42cb",
                        login: "natalia.yartysh"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Sweden"
                },
                email: "gn.nevo@gmail.com",
                name: {
                    last: "Nevo",
                    first: "Gilad"
                },
                fullName: "Gilad Nevo",
                id: "569f599062d172544baf0c3f"
            },
            {
                _id: "569f581762d172544baf0c3b",
                editedBy: {
                    date: "2016-01-20T09:49:11.738Z",
                    user: {
                        _id: "55ba00e9d79a3a343900000c",
                        login: "vasiliy.almashi"
                    }
                },
                createdBy: {
                    date: "2016-01-20T09:49:11.738Z",
                    user: {
                        _id: "55ba00e9d79a3a343900000c",
                        login: "vasiliy.almashi"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Germany"
                },
                email: "Dirk.Ziegener@etecture.de",
                name: {
                    last: "Ziegener",
                    first: "Dirk"
                },
                fullName: "Dirk Ziegener",
                id: "569f581762d172544baf0c3b"
            },
            {
                _id: "566d4b55abccac87642cb522",
                editedBy: {
                    date: "2015-12-13T10:41:25.812Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-12-13T10:41:25.812Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: ""
                },
                email: "",
                name: {
                    last: "Sans",
                    first: "Olivier"
                },
                fullName: "Olivier Sans",
                id: "566d4b55abccac87642cb522"
            },
            {
                _id: "56685d4fa3fc012a68f0d853",
                editedBy: {
                    date: "2015-12-09T16:56:47.834Z",
                    user: {
                        _id: "563f673270bbc2b740ce89ae",
                        login: "alex.sokhanych"
                    }
                },
                createdBy: {
                    date: "2015-12-09T16:56:47.834Z",
                    user: {
                        _id: "563f673270bbc2b740ce89ae",
                        login: "alex.sokhanych"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Germany"
                },
                email: "",
                name: {
                    last: "Burer",
                    first: "Nicolas"
                },
                fullName: "Nicolas Burer",
                id: "56685d4fa3fc012a68f0d853"
            },
            {
                _id: "5661809cbb8be7814fb52584",
                editedBy: {
                    date: "2015-12-04T12:01:32.170Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-12-04T12:01:32.170Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: ""
                },
                email: "",
                name: {
                    last: "Yilmaz",
                    first: "Selim"
                },
                fullName: "Selim Yilmaz",
                id: "5661809cbb8be7814fb52584"
            },
            {
                _id: "56574092bfd103f108eb4ad3",
                editedBy: {
                    date: "2015-11-26T17:25:38.091Z",
                    user: {
                        _id: "563f673270bbc2b740ce89ae",
                        login: "alex.sokhanych"
                    }
                },
                createdBy: {
                    date: "2015-11-26T17:25:38.091Z",
                    user: {
                        _id: "563f673270bbc2b740ce89ae",
                        login: "alex.sokhanych"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: ""
                },
                email: "Ales.Smokvina@marand.si",
                name: {
                    last: "Smokvina",
                    first: "Ales"
                },
                fullName: "Ales Smokvina",
                id: "56574092bfd103f108eb4ad3"
            },
            {
                _id: "5637627bc928c61d052d500e",
                editedBy: {
                    date: "2015-11-02T13:17:47.184Z",
                    user: {
                        _id: "56239e0ce9576d1728a9ed1d",
                        login: "liliya.shustur"
                    }
                },
                createdBy: {
                    date: "2015-11-02T13:17:47.184Z",
                    user: {
                        _id: "56239e0ce9576d1728a9ed1d",
                        login: "liliya.shustur"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: ""
                },
                email: "tibor.bekefi@attrecto.com",
                name: {
                    last: "Bekefi",
                    first: "Tibor"
                },
                fullName: "Tibor Bekefi",
                id: "5637627bc928c61d052d500e"
            },
            {
                _id: "562bba2062461bfd59ef58c0",
                editedBy: {
                    date: "2015-10-24T17:04:32.542Z",
                    user: {
                        _id: "55cb7302fea413b50b000007",
                        login: "OlegOstroverkh"
                    }
                },
                createdBy: {
                    date: "2015-10-24T17:04:32.542Z",
                    user: {
                        _id: "55cb7302fea413b50b000007",
                        login: "OlegOstroverkh"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: ""
                },
                email: "",
                name: {
                    last: "Unknown",
                    first: "Mark"
                },
                fullName: "Mark Unknown",
                id: "562bba2062461bfd59ef58c0"
            },
            {
                _id: "55b92ad521e4b7c40f00060c",
                editedBy: {
                    date: "2015-10-05T06:46:29.793Z",
                    user: {
                        _id: "55bf144765cda0810b000005",
                        login: "yana.gusti"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.989Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: ""
                },
                email: "",
                name: {
                    last: "Blinov",
                    first: "Alexey"
                },
                fullName: "Alexey Blinov",
                id: "55b92ad521e4b7c40f00060c"
            },
            {
                _id: "55d38523226ed3280b000007",
                editedBy: {
                    date: "2015-08-18T19:18:59.098Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                createdBy: {
                    date: "2015-08-18T19:18:59.098Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                phones: {
                    phone: "+19028008510"
                },
                address: {
                    country: "Canada"
                },
                email: "peter@sharperbuilds.com",
                name: {
                    last: "Hickey",
                    first: "Peter"
                },
                fullName: "Peter Hickey",
                id: "55d38523226ed3280b000007"
            },
            {
                _id: "55d37d50226ed3280b000006",
                editedBy: {
                    date: "2015-08-18T18:45:36.728Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                createdBy: {
                    date: "2015-08-18T18:45:36.728Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                phones: {
                    phone: "+447772777663"
                },
                address: {
                    country: "United Kingdom"
                },
                email: "matt@mobstar.com",
                name: {
                    last: "Fulford",
                    first: "Matt"
                },
                fullName: "Matt Fulford",
                id: "55d37d50226ed3280b000006"
            },
            {
                _id: "55d37aee226ed3280b000005",
                editedBy: {
                    date: "2015-08-18T18:35:26.681Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                createdBy: {
                    date: "2015-08-18T18:35:26.681Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                phones: {
                    phone: "0567771774"
                },
                address: {
                    country: "Ireland"
                },
                email: "brendan@mobstar.com",
                name: {
                    last: "Morrisey",
                    first: "Brendan"
                },
                fullName: "Brendan Morrisey",
                id: "55d37aee226ed3280b000005"
            },
            {
                _id: "55ba0df2d79a3a3439000015",
                editedBy: {
                    date: "2015-07-30T11:43:46.247Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                createdBy: {
                    date: "2015-07-30T11:43:46.246Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                phones: {
                    phone: "+447720498374"
                },
                address: {
                    country: "UK"
                },
                email: "dr.loop@gmail.com",
                name: {
                    last: "Leket",
                    first: "Erez"
                },
                fullName: "Erez Leket",
                id: "55ba0df2d79a3a3439000015"
            },
            {
                _id: "55ba0701d79a3a3439000012",
                editedBy: {
                    date: "2015-07-30T11:14:37.227Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                createdBy: {
                    date: "2015-07-30T11:14:09.010Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Spain"
                },
                email: "francisco.calvo.vicente@gmail.com",
                name: {
                    last: "Vicente",
                    first: "Francisco Calvo"
                },
                fullName: "Francisco Calvo Vicente",
                id: "55ba0701d79a3a3439000012"
            },
            {
                _id: "55ba04d5d79a3a3439000011",
                editedBy: {
                    date: "2015-07-30T11:04:53.095Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                createdBy: {
                    date: "2015-07-30T11:04:53.095Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "New Zealand"
                },
                email: "rowan@globalworkshop.ws",
                name: {
                    last: "Hick",
                    first: "Rowan"
                },
                fullName: "Rowan Hick",
                id: "55ba04d5d79a3a3439000011"
            },
            {
                _id: "55ba0479d79a3a3439000010",
                editedBy: {
                    date: "2015-07-30T11:04:04.401Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                createdBy: {
                    date: "2015-07-30T11:03:21.124Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Ohio"
                },
                email: "",
                name: {
                    last: "Lupsor",
                    first: "Drew"
                },
                fullName: "Drew Lupsor",
                id: "55ba0479d79a3a3439000010"
            },
            {
                _id: "55ba0362d79a3a343900000e",
                editedBy: {
                    date: "2015-07-30T10:58:42.513Z",
                    user: {
                        _id: "55ba00e9d79a3a343900000c",
                        login: "vasiliy.almashi"
                    }
                },
                createdBy: {
                    date: "2015-07-30T10:58:42.513Z",
                    user: {
                        _id: "55ba00e9d79a3a343900000c",
                        login: "vasiliy.almashi"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: ""
                },
                email: "in@hashplay.tv",
                name: {
                    last: "Nadler",
                    first: "Ingo"
                },
                fullName: "Ingo Nadler",
                id: "55ba0362d79a3a343900000e"
            },
            {
                _id: "55b9fa60d79a3a3439000005",
                editedBy: {
                    date: "2015-07-30T10:55:35.621Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                createdBy: {
                    date: "2015-07-30T10:20:16.095Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Australia"
                },
                email: "jason@buzinga.com.au",
                name: {
                    last: "Coutsodimitropoulos",
                    first: "Jason"
                },
                fullName: "Jason Coutsodimitropoulos",
                id: "55b9fa60d79a3a3439000005"
            },
            {
                _id: "55ba006ed79a3a343900000b",
                editedBy: {
                    date: "2015-07-30T10:46:06.893Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                createdBy: {
                    date: "2015-07-30T10:46:06.893Z",
                    user: {
                        _id: "55b9dd7a7a3632120b000006",
                        login: "larysa.popp"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "jeffrey.courter@gmail.com",
                name: {
                    last: "Courter",
                    first: "Jeff"
                },
                fullName: "Jeff Courter",
                id: "55ba006ed79a3a343900000b"
            },
            {
                _id: "55b9ff67d79a3a343900000a",
                editedBy: {
                    date: "2015-07-30T10:43:37.578Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                createdBy: {
                    date: "2015-07-30T10:41:43.797Z",
                    user: {
                        _id: "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Australia"
                },
                email: "ruslan@kogan.com.au",
                name: {
                    last: "Kogan",
                    first: "Ruslan"
                },
                fullName: "Ruslan Kogan",
                id: "55b9ff67d79a3a343900000a"
            },
            {
                _id: "55b92ad621e4b7c40f00065d",
                editedBy: {
                    date: "2015-07-29T19:34:46.028Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.028Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "CloudFuze"
                },
                fullName: "CloudFuze ",
                id: "55b92ad621e4b7c40f00065d"
            },
            {
                _id: "55b92ad621e4b7c40f00065e",
                editedBy: {
                    date: "2015-07-29T19:34:46.028Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.028Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Israel"
                },
                email: "",
                name: {
                    last: "",
                    first: "Collections Tech"
                },
                fullName: "Collections Tech ",
                id: "55b92ad621e4b7c40f00065e"
            },
            {
                _id: "55b92ad621e4b7c40f00065b",
                editedBy: {
                    date: "2015-07-29T19:34:46.027Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.027Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Australia"
                },
                email: "",
                name: {
                    last: "",
                    first: "Kogan.com"
                },
                fullName: "Kogan.com ",
                id: "55b92ad621e4b7c40f00065b"
            },
            {
                _id: "55b92ad621e4b7c40f000659",
                editedBy: {
                    date: "2015-07-29T19:34:46.026Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.026Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Thailand"
                },
                email: "",
                name: {
                    last: "",
                    first: "PBI-Solutions"
                },
                fullName: "PBI-Solutions ",
                id: "55b92ad621e4b7c40f000659"
            },
            {
                _id: "55b92ad621e4b7c40f00065a",
                editedBy: {
                    date: "2015-07-29T19:34:46.026Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.026Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Australia"
                },
                email: "",
                name: {
                    last: "",
                    first: "Technatives"
                },
                fullName: "Technatives ",
                id: "55b92ad621e4b7c40f00065a"
            },
            {
                _id: "55b92ad621e4b7c40f000656",
                editedBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Hungary"
                },
                email: "",
                name: {
                    last: "",
                    first: "ShiwaForce"
                },
                fullName: "ShiwaForce ",
                id: "55b92ad621e4b7c40f000656"
            },
            {
                _id: "55b92ad621e4b7c40f000657",
                editedBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Nikky"
                },
                fullName: "Nikky ",
                id: "55b92ad621e4b7c40f000657"
            },
            {
                _id: "55b92ad621e4b7c40f000658",
                editedBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "UK"
                },
                email: "",
                name: {
                    last: "",
                    first: "JellyGames"
                },
                fullName: "JellyGames ",
                id: "55b92ad621e4b7c40f000658"
            },
            {
                _id: "55b92ad621e4b7c40f000654",
                editedBy: {
                    date: "2015-07-29T19:34:46.024Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.024Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Israel"
                },
                email: "",
                name: {
                    last: "",
                    first: "iqDesk"
                },
                fullName: "iqDesk ",
                id: "55b92ad621e4b7c40f000654"
            },
            {
                _id: "55b92ad621e4b7c40f000655",
                editedBy: {
                    date: "2015-07-29T19:34:46.024Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.024Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "UK"
                },
                email: "",
                name: {
                    last: "",
                    first: "We do apps"
                },
                fullName: "We do apps ",
                id: "55b92ad621e4b7c40f000655"
            },
            {
                _id: "55b92ad621e4b7c40f000651",
                editedBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Dan D."
                },
                fullName: "Dan D. ",
                id: "55b92ad621e4b7c40f000651"
            },
            {
                _id: "55b92ad621e4b7c40f000652",
                editedBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Zugara"
                },
                fullName: "Zugara ",
                id: "55b92ad621e4b7c40f000652"
            },
            {
                _id: "55b92ad621e4b7c40f000653",
                editedBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: null
                },
                email: "",
                name: {
                    last: "",
                    first: "Peter B."
                },
                fullName: "Peter B. ",
                id: "55b92ad621e4b7c40f000653"
            },
            {
                _id: "55b92ad621e4b7c40f00064e",
                editedBy: {
                    date: "2015-07-29T19:34:46.022Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.022Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Spain"
                },
                email: "",
                name: {
                    last: "",
                    first: "SetFile"
                },
                fullName: "SetFile ",
                id: "55b92ad621e4b7c40f00064e"
            },
            {
                _id: "55b92ad621e4b7c40f000650",
                editedBy: {
                    date: "2015-07-29T19:34:46.022Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.022Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "PatrickMolander"
                },
                fullName: "PatrickMolander ",
                id: "55b92ad621e4b7c40f000650"
            },
            {
                _id: "55b92ad621e4b7c40f00064c",
                editedBy: {
                    date: "2015-07-29T19:34:46.021Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.021Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Germany"
                },
                email: "",
                name: {
                    last: "",
                    first: "Razvan Chisu"
                },
                fullName: "Razvan Chisu ",
                id: "55b92ad621e4b7c40f00064c"
            },
            {
                _id: "55b92ad621e4b7c40f00064d",
                editedBy: {
                    date: "2015-07-29T19:34:46.021Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.021Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "ProTriever"
                },
                fullName: "ProTriever ",
                id: "55b92ad621e4b7c40f00064d"
            },
            {
                _id: "55b92ad621e4b7c40f000649",
                editedBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "US"
                },
                email: "",
                name: {
                    last: "",
                    first: "Contegra Systems"
                },
                fullName: "Contegra Systems ",
                id: "55b92ad621e4b7c40f000649"
            },
            {
                _id: "55b92ad621e4b7c40f00064a",
                editedBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Hungary"
                },
                email: "",
                name: {
                    last: "",
                    first: "Carussel"
                },
                fullName: "Carussel ",
                id: "55b92ad621e4b7c40f00064a"
            },
            {
                _id: "55b92ad621e4b7c40f00064b",
                editedBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Thomas"
                },
                fullName: "Thomas ",
                id: "55b92ad621e4b7c40f00064b"
            },
            {
                _id: "55b92ad621e4b7c40f000647",
                editedBy: {
                    date: "2015-07-29T19:34:46.019Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.019Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Joren Rapiny"
                },
                fullName: "Joren Rapiny ",
                id: "55b92ad621e4b7c40f000647"
            },
            {
                _id: "55b92ad621e4b7c40f000648",
                editedBy: {
                    date: "2015-07-29T19:34:46.019Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.019Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Anand Gupta"
                },
                fullName: "Anand Gupta ",
                id: "55b92ad621e4b7c40f000648"
            },
            {
                _id: "55b92ad621e4b7c40f000644",
                editedBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "iask consulting"
                },
                fullName: "iask consulting ",
                id: "55b92ad621e4b7c40f000644"
            },
            {
                _id: "55b92ad621e4b7c40f000645",
                editedBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Romania"
                },
                email: "",
                name: {
                    last: "",
                    first: "Vlad"
                },
                fullName: "Vlad ",
                id: "55b92ad621e4b7c40f000645"
            },
            {
                _id: "55b92ad621e4b7c40f000642",
                editedBy: {
                    date: "2015-07-29T19:34:46.017Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.017Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Canada"
                },
                email: "",
                name: {
                    last: "",
                    first: "Volodymyr Lychman"
                },
                fullName: "Volodymyr Lychman ",
                id: "55b92ad621e4b7c40f000642"
            },
            {
                _id: "55b92ad621e4b7c40f000643",
                editedBy: {
                    date: "2015-07-29T19:34:46.017Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.017Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: null
                },
                email: "",
                name: {
                    last: "",
                    first: "Angelica"
                },
                fullName: "Angelica ",
                id: "55b92ad621e4b7c40f000643"
            },
            {
                _id: "55b92ad621e4b7c40f000640",
                editedBy: {
                    date: "2015-07-29T19:34:46.016Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.016Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Canada"
                },
                email: "",
                name: {
                    last: "",
                    first: "Oris4/TimWilson"
                },
                fullName: "Oris4/TimWilson ",
                id: "55b92ad621e4b7c40f000640"
            },
            {
                _id: "55b92ad621e4b7c40f000641",
                editedBy: {
                    date: "2015-07-29T19:34:46.016Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.016Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Global Forwarding LLC"
                },
                fullName: "Global Forwarding LLC ",
                id: "55b92ad621e4b7c40f000641"
            },
            {
                _id: "55b92ad621e4b7c40f00063e",
                editedBy: {
                    date: "2015-07-29T19:34:46.015Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.015Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Israel"
                },
                email: "",
                name: {
                    last: "",
                    first: "VTI"
                },
                fullName: "VTI ",
                id: "55b92ad621e4b7c40f00063e"
            },
            {
                _id: "55b92ad621e4b7c40f00063a",
                editedBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Australia"
                },
                email: "",
                name: {
                    last: "",
                    first: "TrumpMedia"
                },
                fullName: "TrumpMedia ",
                id: "55b92ad621e4b7c40f00063a"
            },
            {
                _id: "55b92ad621e4b7c40f00063b",
                editedBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "UAE"
                },
                email: "",
                name: {
                    last: "",
                    first: "Foxtrapp"
                },
                fullName: "Foxtrapp ",
                id: "55b92ad621e4b7c40f00063b"
            },
            {
                _id: "55b92ad621e4b7c40f00063c",
                editedBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "UAE"
                },
                email: "",
                name: {
                    last: "",
                    first: "DigiPresents"
                },
                fullName: "DigiPresents ",
                id: "55b92ad621e4b7c40f00063c"
            },
            {
                _id: "55b92ad621e4b7c40f000638",
                editedBy: {
                    date: "2015-07-29T19:34:46.013Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.013Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "UK"
                },
                email: "",
                name: {
                    last: "",
                    first: "Unibet"
                },
                fullName: "Unibet ",
                id: "55b92ad621e4b7c40f000638"
            },
            {
                _id: "55b92ad621e4b7c40f000639",
                editedBy: {
                    date: "2015-07-29T19:34:46.013Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.013Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Hungary"
                },
                email: "",
                name: {
                    last: "",
                    first: "Digital Media"
                },
                fullName: "Digital Media ",
                id: "55b92ad621e4b7c40f000639"
            },
            {
                _id: "55b92ad621e4b7c40f000637",
                editedBy: {
                    date: "2015-07-29T19:34:46.011Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.011Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Airsoft Holdings "
                },
                fullName: "Airsoft Holdings ",
                id: "55b92ad621e4b7c40f000637"
            },
            {
                _id: "55b92ad621e4b7c40f000635",
                editedBy: {
                    date: "2015-07-29T19:34:46.010Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.010Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Academiacs"
                },
                fullName: "Academiacs ",
                id: "55b92ad621e4b7c40f000635"
            },
            {
                _id: "55b92ad621e4b7c40f000636",
                editedBy: {
                    date: "2015-07-29T19:34:46.010Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.010Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Constantine"
                },
                fullName: "Constantine ",
                id: "55b92ad621e4b7c40f000636"
            },
            {
                _id: "55b92ad621e4b7c40f000634",
                editedBy: {
                    date: "2015-07-29T19:34:46.009Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.009Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Max"
                },
                fullName: "Max ",
                id: "55b92ad621e4b7c40f000634"
            },
            {
                _id: "55b92ad621e4b7c40f000630",
                editedBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Hungary"
                },
                email: "",
                name: {
                    last: "",
                    first: "PPT Group"
                },
                fullName: "PPT Group ",
                id: "55b92ad621e4b7c40f000630"
            },
            {
                _id: "55b92ad621e4b7c40f000631",
                editedBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Australia"
                },
                email: "",
                name: {
                    last: "",
                    first: "Tinybeans"
                },
                fullName: "Tinybeans ",
                id: "55b92ad621e4b7c40f000631"
            },
            {
                _id: "55b92ad621e4b7c40f000632",
                editedBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: null
                },
                email: "",
                name: {
                    last: "",
                    first: "evista"
                },
                fullName: "evista ",
                id: "55b92ad621e4b7c40f000632"
            },
            {
                _id: "55b92ad621e4b7c40f00062f",
                editedBy: {
                    date: "2015-07-29T19:34:46.007Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.007Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Belgium"
                },
                email: "",
                name: {
                    last: "",
                    first: "Mark"
                },
                fullName: "Mark ",
                id: "55b92ad621e4b7c40f00062f"
            },
            {
                _id: "55b92ad621e4b7c40f00062d",
                editedBy: {
                    date: "2015-07-29T19:34:46.006Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.006Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Hungary"
                },
                email: "",
                name: {
                    last: "",
                    first: "Andreas Rabenseifner"
                },
                fullName: "Andreas Rabenseifner ",
                id: "55b92ad621e4b7c40f00062d"
            },
            {
                _id: "55b92ad621e4b7c40f00062b",
                editedBy: {
                    date: "2015-07-29T19:34:46.003Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.003Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA/Germany"
                },
                email: "",
                name: {
                    last: "",
                    first: "HashPlay"
                },
                fullName: "HashPlay ",
                id: "55b92ad621e4b7c40f00062b"
            },
            {
                _id: "55b92ad621e4b7c40f00062c",
                editedBy: {
                    date: "2015-07-29T19:34:46.003Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.003Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Germany"
                },
                email: "",
                name: {
                    last: "",
                    first: "spscontrol"
                },
                fullName: "spscontrol ",
                id: "55b92ad621e4b7c40f00062c"
            },
            {
                _id: "55b92ad621e4b7c40f000628",
                editedBy: {
                    date: "2015-07-29T19:34:46.002Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.002Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Germany"
                },
                email: "",
                name: {
                    last: "",
                    first: "Quimron"
                },
                fullName: "Quimron ",
                id: "55b92ad621e4b7c40f000628"
            },
            {
                _id: "55b92ad621e4b7c40f000625",
                editedBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "WishExpress"
                },
                fullName: "WishExpress ",
                id: "55b92ad621e4b7c40f000625"
            },
            {
                _id: "55b92ad621e4b7c40f000626",
                editedBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Ukraine"
                },
                email: "",
                name: {
                    last: "",
                    first: "ShargoO"
                },
                fullName: "ShargoO ",
                id: "55b92ad621e4b7c40f000626"
            },
            {
                _id: "55b92ad621e4b7c40f000627",
                editedBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "TU"
                },
                email: "",
                name: {
                    last: "",
                    first: "UfukTogay"
                },
                fullName: "UfukTogay ",
                id: "55b92ad621e4b7c40f000627"
            },
            {
                _id: "55b92ad621e4b7c40f000623",
                editedBy: {
                    date: "2015-07-29T19:34:46.000Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.000Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Belgium"
                },
                email: "",
                name: {
                    last: "",
                    first: "Vladi"
                },
                fullName: "Vladi ",
                id: "55b92ad621e4b7c40f000623"
            },
            {
                _id: "55b92ad621e4b7c40f000624",
                editedBy: {
                    date: "2015-07-29T19:34:46.000Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.000Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "France"
                },
                email: "",
                name: {
                    last: "",
                    first: "Giroptic"
                },
                fullName: "Giroptic ",
                id: "55b92ad621e4b7c40f000624"
            },
            {
                _id: "55b92ad521e4b7c40f000621",
                editedBy: {
                    date: "2015-07-29T19:34:45.999Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.999Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: null
                },
                email: "",
                name: {
                    last: "",
                    first: "Mike Allstar"
                },
                fullName: "Mike Allstar ",
                id: "55b92ad521e4b7c40f000621"
            },
            {
                _id: "55b92ad521e4b7c40f000622",
                editedBy: {
                    date: "2015-07-29T19:34:45.999Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.999Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: null
                },
                email: "",
                name: {
                    last: "",
                    first: "Chamin"
                },
                fullName: "Chamin ",
                id: "55b92ad521e4b7c40f000622"
            },
            {
                _id: "55b92ad521e4b7c40f00061f",
                editedBy: {
                    date: "2015-07-29T19:34:45.998Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.998Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "PostIndustria"
                },
                fullName: "PostIndustria ",
                id: "55b92ad521e4b7c40f00061f"
            },
            {
                _id: "55b92ad521e4b7c40f000620",
                editedBy: {
                    date: "2015-07-29T19:34:45.998Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.998Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "UK"
                },
                email: "",
                name: {
                    last: "",
                    first: "Thomas Sinquin"
                },
                fullName: "Thomas Sinquin ",
                id: "55b92ad521e4b7c40f000620"
            },
            {
                _id: "55b92ad521e4b7c40f00061c",
                editedBy: {
                    date: "2015-07-29T19:34:45.997Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.997Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Spain"
                },
                email: "",
                name: {
                    last: "",
                    first: "Genexies"
                },
                fullName: "Genexies ",
                id: "55b92ad521e4b7c40f00061c"
            },
            {
                _id: "55b92ad521e4b7c40f00061a",
                editedBy: {
                    date: "2015-07-29T19:34:45.996Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.996Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "UK"
                },
                email: "",
                name: {
                    last: "",
                    first: "Ivcarto"
                },
                fullName: "Ivcarto ",
                id: "55b92ad521e4b7c40f00061a"
            },
            {
                _id: "55b92ad521e4b7c40f00061b",
                editedBy: {
                    date: "2015-07-29T19:34:45.996Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.996Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Unlimited Conferencing"
                },
                fullName: "Unlimited Conferencing ",
                id: "55b92ad521e4b7c40f00061b"
            },
            {
                _id: "55b92ad521e4b7c40f000617",
                editedBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Canada"
                },
                email: "",
                name: {
                    last: "",
                    first: "Peter Hickey"
                },
                fullName: "Peter Hickey ",
                id: "55b92ad521e4b7c40f000617"
            },
            {
                _id: "55b92ad521e4b7c40f000618",
                editedBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "United States"
                },
                email: "",
                name: {
                    last: "",
                    first: "Tarun M."
                },
                fullName: "Tarun M. ",
                id: "55b92ad521e4b7c40f000618"
            },
            {
                _id: "55b92ad521e4b7c40f000619",
                editedBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Israel"
                },
                email: "",
                name: {
                    last: "",
                    first: "Israel"
                },
                fullName: "Israel ",
                id: "55b92ad521e4b7c40f000619"
            },
            {
                _id: "55b92ad521e4b7c40f000616",
                editedBy: {
                    date: "2015-07-29T19:34:45.994Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.994Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "ThinkApps"
                },
                fullName: "ThinkApps ",
                id: "55b92ad521e4b7c40f000616"
            },
            {
                _id: "55b92ad521e4b7c40f000613",
                editedBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "France"
                },
                email: "",
                name: {
                    last: "",
                    first: "Kikast"
                },
                fullName: "Kikast ",
                id: "55b92ad521e4b7c40f000613"
            },
            {
                _id: "55b92ad521e4b7c40f000614",
                editedBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Spain"
                },
                email: "",
                name: {
                    last: "",
                    first: "The Watch Enthusiast"
                },
                fullName: "The Watch Enthusiast ",
                id: "55b92ad521e4b7c40f000614"
            },
            {
                _id: "55b92ad521e4b7c40f000615",
                editedBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Hungary"
                },
                email: "",
                name: {
                    last: "",
                    first: "TechJoiner"
                },
                fullName: "TechJoiner ",
                id: "55b92ad521e4b7c40f000615"
            },
            {
                _id: "55b92ad521e4b7c40f000611",
                editedBy: {
                    date: "2015-07-29T19:34:45.992Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.992Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: null
                },
                email: "",
                name: {
                    last: "",
                    first: "Remon"
                },
                fullName: "Remon ",
                id: "55b92ad521e4b7c40f000611"
            },
            {
                _id: "55b92ad521e4b7c40f000612",
                editedBy: {
                    date: "2015-07-29T19:34:45.992Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.992Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Isaac S."
                },
                fullName: "Isaac S. ",
                id: "55b92ad521e4b7c40f000612"
            },
            {
                _id: "55b92ad521e4b7c40f00060e",
                editedBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "USA"
                },
                email: "",
                name: {
                    last: "",
                    first: "Pekaboo/D.Kaufman"
                },
                fullName: "Pekaboo/D.Kaufman ",
                id: "55b92ad521e4b7c40f00060e"
            },
            {
                _id: "55b92ad521e4b7c40f00060f",
                editedBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: "Singapore"
                },
                email: "",
                name: {
                    last: "",
                    first: "Sharmila"
                },
                fullName: "Sharmila ",
                id: "55b92ad521e4b7c40f00060f"
            },
            {
                _id: "55b92ad521e4b7c40f000610",
                editedBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: {
                        _id: "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                phones: {
                    phone: ""
                },
                address: {
                    country: null
                },
                email: "",
                name: {
                    last: "",
                    first: "Norbert"
                },
                fullName: "Norbert ",
                id: "55b92ad521e4b7c40f000610"
            }
        ]
    };

    var fakePersonWithId = {
        _id: "55b92ad521e4b7c40f00060c",
        ID: 1,
        __v: 0,
        dateBirth: null,
        companyInfo: {
            size: null,
            industry: null
        },
        editedBy: {
            date: "2015-10-05T06:46:29.793Z",
            user: {
                _id: "55bf144765cda0810b000005",
                login: "yana.gusti"
            }
        },
        createdBy: {
            date: "2015-07-29T19:34:45.989Z",
            user: {
                _id: "52203e707d4dba8813000003",
                login: "admin"
            }
        },
        history: [],
        attachments: [],
        notes: [],
        groups: {
            group: [],
            users: [],
            owner: {
                _id: "55ba28c8d79a3a3439000016",
                login: "AndrianaLemko"
            }
        },
        whoCanRW: "everyOne",
        social: {
            LI: "",
            FB: ""
        },
        color: "#4d5a75",
        relatedUser: null,
        salesPurchases: {
            receiveMessages: 0,
            language: "",
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
        contacts: [],
        phones: {
            fax: "",
            mobile: "",
            phone: ""
        },
        skype: "",
        jobPosition: null,
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
            last: "Blinov",
            first: "Alexey"
        },
        isOwn: false,
        type: "Person",
        fullName: "Alexey Blinov",
        id: "55b92ad521e4b7c40f00060c"
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
                _id: "569f5d8c62d172544baf0d52",
                login: "alona.yelahina"
            },
            {
                _id: "56bda2e0dfd8a81466e2f4e2",
                login: "andriy.hanchak"
            },
            {
                _id: "563b58c2ab9698be7c9df6b6",
                login: "gabriella.shterr"
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
                _id: "561e37f7d6c741e8235f42cb",
                login: "natalia.yartysh"
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
                _id: "55b9dd237a3632120b000005",
                login: "roland.katona"
            },
            {
                _id: "56a72af2aa157ca50f21fb20",
                login: "roman.kubichka"
            },
            {
                _id: "56a72cafaa157ca50f21fb22",
                login: "stanislav.romanyuk"
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
                _id: "55bf144765cda0810b000005",
                login: "yana.gusti"
            },
            {
                _id: "560255d1638625cf32000005",
                login: "yevgenia.bezyk"
            }
        ]
    };

    var fakeEmplRelUser = {
        data: [
            {
                _id: "55b92ad221e4b7c40f00004f",
                name: {
                    last: "Sokhanych",
                    first: "Alex"
                },
                fullName: "Alex Sokhanych",
                id: "55b92ad221e4b7c40f00004f"
            }
        ]
    };

    var fakeCustomers = {
        data: [
            {
                _id: "55b92ad521e4b7c40f00060e",
                ID: 11,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Pekaboo/D.Kaufman"
                },
                isOwn: false,
                type: "Person",
                fullName: "Pekaboo/D.Kaufman ",
                id: "55b92ad521e4b7c40f00060e"
            },
            {
                _id: "55b92ad521e4b7c40f00060f",
                ID: 16,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Singapore",
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
                    last: "",
                    first: "Sharmila"
                },
                isOwn: false,
                type: "Person",
                fullName: "Sharmila ",
                id: "55b92ad521e4b7c40f00060f"
            },
            {
                _id: "55b92ad521e4b7c40f000610",
                ID: 21,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: null,
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
                    last: "",
                    first: "Norbert"
                },
                isOwn: false,
                type: "Person",
                fullName: "Norbert ",
                id: "55b92ad521e4b7c40f000610"
            },
            {
                _id: "55b92ad521e4b7c40f000611",
                ID: 26,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.992Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.992Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: null,
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
                    last: "",
                    first: "Remon"
                },
                isOwn: false,
                type: "Person",
                fullName: "Remon ",
                id: "55b92ad521e4b7c40f000611"
            },
            {
                _id: "55b92ad521e4b7c40f000612",
                ID: 31,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.992Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.992Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Isaac S."
                },
                isOwn: false,
                type: "Person",
                fullName: "Isaac S. ",
                id: "55b92ad521e4b7c40f000612"
            },
            {
                _id: "55b92ad521e4b7c40f000613",
                ID: 36,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "France",
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
                    last: "",
                    first: "Kikast"
                },
                isOwn: false,
                type: "Person",
                fullName: "Kikast ",
                id: "55b92ad521e4b7c40f000613"
            },
            {
                _id: "55b92ad521e4b7c40f000614",
                ID: 41,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Spain",
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
                    last: "",
                    first: "The Watch Enthusiast"
                },
                isOwn: false,
                type: "Person",
                fullName: "The Watch Enthusiast ",
                id: "55b92ad521e4b7c40f000614"
            },
            {
                _id: "55b92ad521e4b7c40f000615",
                ID: 46,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.993Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Hungary",
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
                    last: "",
                    first: "TechJoiner"
                },
                isOwn: false,
                type: "Person",
                fullName: "TechJoiner ",
                id: "55b92ad521e4b7c40f000615"
            },
            {
                _id: "55b92ad521e4b7c40f000616",
                ID: 51,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.994Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.994Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "ThinkApps"
                },
                isOwn: false,
                type: "Person",
                fullName: "ThinkApps ",
                id: "55b92ad521e4b7c40f000616"
            },
            {
                _id: "55b92ad521e4b7c40f000617",
                ID: 56,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Canada",
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
                    last: "",
                    first: "Peter Hickey"
                },
                isOwn: false,
                type: "Person",
                fullName: "Peter Hickey ",
                id: "55b92ad521e4b7c40f000617"
            },
            {
                _id: "55b92ad521e4b7c40f000618",
                ID: 61,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "United States",
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
                    last: "",
                    first: "Tarun M."
                },
                isOwn: false,
                type: "Person",
                fullName: "Tarun M. ",
                id: "55b92ad521e4b7c40f000618"
            },
            {
                _id: "55b92ad521e4b7c40f000619",
                ID: 66,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.995Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Israel",
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
                    last: "",
                    first: "Israel"
                },
                isOwn: false,
                type: "Person",
                fullName: "Israel ",
                id: "55b92ad521e4b7c40f000619"
            },
            {
                _id: "55b92ad521e4b7c40f00061a",
                ID: 1066,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.996Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.996Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "UK",
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
                    last: "",
                    first: "Ivcarto"
                },
                isOwn: false,
                type: "Person",
                fullName: "Ivcarto ",
                id: "55b92ad521e4b7c40f00061a"
            },
            {
                _id: "55b92ad521e4b7c40f00061b",
                ID: 1071,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.996Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.996Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Unlimited Conferencing"
                },
                isOwn: false,
                type: "Person",
                fullName: "Unlimited Conferencing ",
                id: "55b92ad521e4b7c40f00061b"
            },
            {
                _id: "55b92ad521e4b7c40f00061c",
                ID: 1076,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.997Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.997Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Spain",
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
                    last: "",
                    first: "Genexies"
                },
                isOwn: false,
                type: "Person",
                fullName: "Genexies ",
                id: "55b92ad521e4b7c40f00061c"
            },
            {
                _id: "55b92ad521e4b7c40f00061e",
                ID: 7,
                __v: 0,
                companyInfo: {
                    size: "1-50",
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.997Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.997Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "UK",
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
                    last: "",
                    first: "Luke Raskino"
                },
                isOwn: false,
                type: "Company",
                fullName: "Luke Raskino ",
                id: "55b92ad521e4b7c40f00061e"
            },
            {
                _id: "55b92ad521e4b7c40f00061f",
                ID: 12,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.998Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.998Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "PostIndustria"
                },
                isOwn: false,
                type: "Person",
                fullName: "PostIndustria ",
                id: "55b92ad521e4b7c40f00061f"
            },
            {
                _id: "55b92ad521e4b7c40f000620",
                ID: 17,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.998Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.998Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "UK",
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
                    last: "",
                    first: "Thomas Sinquin"
                },
                isOwn: false,
                type: "Person",
                fullName: "Thomas Sinquin ",
                id: "55b92ad521e4b7c40f000620"
            },
            {
                _id: "55b92ad521e4b7c40f000621",
                ID: 22,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.999Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.999Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: null,
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
                    last: "",
                    first: "Mike Allstar"
                },
                isOwn: false,
                type: "Person",
                fullName: "Mike Allstar ",
                id: "55b92ad521e4b7c40f000621"
            },
            {
                _id: "55b92ad521e4b7c40f000622",
                ID: 27,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:45.999Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.999Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: null,
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
                    last: "",
                    first: "Chamin"
                },
                isOwn: false,
                type: "Person",
                fullName: "Chamin ",
                id: "55b92ad521e4b7c40f000622"
            },
            {
                _id: "55b92ad621e4b7c40f000623",
                ID: 32,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.000Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.000Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Belgium",
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
                    last: "",
                    first: "Vladi"
                },
                isOwn: false,
                type: "Person",
                fullName: "Vladi ",
                id: "55b92ad621e4b7c40f000623"
            },
            {
                _id: "55b92ad621e4b7c40f000624",
                ID: 37,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.000Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.000Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "France",
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
                    last: "",
                    first: "Giroptic"
                },
                isOwn: false,
                type: "Person",
                fullName: "Giroptic ",
                id: "55b92ad621e4b7c40f000624"
            },
            {
                _id: "55b92ad621e4b7c40f000625",
                ID: 42,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "WishExpress"
                },
                isOwn: false,
                type: "Person",
                fullName: "WishExpress ",
                id: "55b92ad621e4b7c40f000625"
            },
            {
                _id: "55b92ad621e4b7c40f000626",
                ID: 47,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Ukraine",
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
                    last: "",
                    first: "ShargoO"
                },
                isOwn: false,
                type: "Person",
                fullName: "ShargoO ",
                id: "55b92ad621e4b7c40f000626"
            },
            {
                _id: "55b92ad621e4b7c40f000627",
                ID: 52,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.001Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "TU",
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
                    last: "",
                    first: "UfukTogay"
                },
                isOwn: false,
                type: "Person",
                fullName: "UfukTogay ",
                id: "55b92ad621e4b7c40f000627"
            },
            {
                _id: "55b92ad621e4b7c40f000628",
                ID: 57,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.002Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.002Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Germany",
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
                    last: "",
                    first: "Quimron"
                },
                isOwn: false,
                type: "Person",
                fullName: "Quimron ",
                id: "55b92ad621e4b7c40f000628"
            },
            {
                _id: "55b92ad621e4b7c40f00062b",
                ID: 1067,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.003Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.003Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA/Germany",
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
                    last: "",
                    first: "HashPlay"
                },
                isOwn: false,
                type: "Person",
                fullName: "HashPlay ",
                id: "55b92ad621e4b7c40f00062b"
            },
            {
                _id: "55b92ad621e4b7c40f00062c",
                ID: 1072,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.003Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.003Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Germany",
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
                    last: "",
                    first: "spscontrol"
                },
                isOwn: false,
                type: "Person",
                fullName: "spscontrol ",
                id: "55b92ad621e4b7c40f00062c"
            },
            {
                _id: "55b92ad621e4b7c40f00062d",
                ID: 1077,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.006Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.006Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Hungary",
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
                    last: "",
                    first: "Andreas Rabenseifner"
                },
                isOwn: false,
                type: "Person",
                fullName: "Andreas Rabenseifner ",
                id: "55b92ad621e4b7c40f00062d"
            },
            {
                _id: "55b92ad621e4b7c40f00062f",
                ID: 8,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.007Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.007Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Belgium",
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
                    last: "",
                    first: "Mark"
                },
                isOwn: false,
                type: "Person",
                fullName: "Mark ",
                id: "55b92ad621e4b7c40f00062f"
            },
            {
                _id: "55b92ad621e4b7c40f000630",
                ID: 13,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Hungary",
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
                    last: "",
                    first: "PPT Group"
                },
                isOwn: false,
                type: "Person",
                fullName: "PPT Group ",
                id: "55b92ad621e4b7c40f000630"
            },
            {
                _id: "55b92ad621e4b7c40f000631",
                ID: 18,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Australia",
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
                    last: "",
                    first: "Tinybeans"
                },
                isOwn: false,
                type: "Person",
                fullName: "Tinybeans ",
                id: "55b92ad621e4b7c40f000631"
            },
            {
                _id: "55b92ad621e4b7c40f000632",
                ID: 23,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.008Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: null,
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
                    last: "",
                    first: "evista"
                },
                isOwn: false,
                type: "Person",
                fullName: "evista ",
                id: "55b92ad621e4b7c40f000632"
            },
            {
                _id: "55b92ad621e4b7c40f000633",
                ID: 28,
                __v: 0,
                companyInfo: {
                    size: ">500",
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.009Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.009Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: null,
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
                    last: "",
                    first: "Chris Mack"
                },
                isOwn: false,
                type: "Company",
                fullName: "Chris Mack ",
                id: "55b92ad621e4b7c40f000633"
            },
            {
                _id: "55b92ad621e4b7c40f000634",
                ID: 33,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.009Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.009Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Max"
                },
                isOwn: false,
                type: "Person",
                fullName: "Max ",
                id: "55b92ad621e4b7c40f000634"
            },
            {
                _id: "55b92ad621e4b7c40f000635",
                ID: 38,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.010Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.010Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Academiacs"
                },
                isOwn: false,
                type: "Person",
                fullName: "Academiacs ",
                id: "55b92ad621e4b7c40f000635"
            },
            {
                _id: "55b92ad621e4b7c40f000636",
                ID: 43,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.010Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.010Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Constantine"
                },
                isOwn: false,
                type: "Person",
                fullName: "Constantine ",
                id: "55b92ad621e4b7c40f000636"
            },
            {
                _id: "55b92ad621e4b7c40f000637",
                ID: 48,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.011Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.011Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Airsoft Holdings "
                },
                isOwn: false,
                type: "Person",
                fullName: "Airsoft Holdings ",
                id: "55b92ad621e4b7c40f000637"
            },
            {
                _id: "55b92ad621e4b7c40f000638",
                ID: 53,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.013Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.013Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "UK",
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
                    last: "",
                    first: "Unibet"
                },
                isOwn: false,
                type: "Person",
                fullName: "Unibet ",
                id: "55b92ad621e4b7c40f000638"
            },
            {
                _id: "55b92ad621e4b7c40f000639",
                ID: 58,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.013Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.013Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Hungary",
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
                    last: "",
                    first: "Digital Media"
                },
                isOwn: false,
                type: "Person",
                fullName: "Digital Media ",
                id: "55b92ad621e4b7c40f000639"
            },
            {
                _id: "55b92ad621e4b7c40f00063a",
                ID: 63,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Australia",
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
                    last: "",
                    first: "TrumpMedia"
                },
                isOwn: false,
                type: "Person",
                fullName: "TrumpMedia ",
                id: "55b92ad621e4b7c40f00063a"
            },
            {
                _id: "55b92ad621e4b7c40f00063b",
                ID: 1063,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "UAE",
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
                    last: "",
                    first: "Foxtrapp"
                },
                isOwn: false,
                type: "Person",
                fullName: "Foxtrapp ",
                id: "55b92ad621e4b7c40f00063b"
            },
            {
                _id: "55b92ad621e4b7c40f00063c",
                ID: 1068,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.014Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "UAE",
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
                    last: "",
                    first: "DigiPresents"
                },
                isOwn: false,
                type: "Person",
                fullName: "DigiPresents ",
                id: "55b92ad621e4b7c40f00063c"
            },
            {
                _id: "55b92ad621e4b7c40f00063d",
                ID: 1073,
                __v: 0,
                companyInfo: {
                    size: "1-50",
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.015Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.015Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Brazil",
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
                    last: "",
                    first: "Gomez"
                },
                isOwn: false,
                type: "Company",
                fullName: "Gomez ",
                id: "55b92ad621e4b7c40f00063d"
            },
            {
                _id: "55b92ad621e4b7c40f00063e",
                ID: 1078,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.015Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.015Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Israel",
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
                    last: "",
                    first: "VTI"
                },
                isOwn: false,
                type: "Person",
                fullName: "VTI ",
                id: "55b92ad621e4b7c40f00063e"
            },
            {
                _id: "55b92ad621e4b7c40f00063f",
                ID: 4,
                __v: 0,
                companyInfo: {
                    size: "50-200",
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.016Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.016Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "OAE",
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
                    last: "",
                    first: "Hussam"
                },
                isOwn: false,
                type: "Company",
                fullName: "Hussam ",
                id: "55b92ad621e4b7c40f00063f"
            },
            {
                _id: "55b92ad621e4b7c40f000640",
                ID: 9,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.016Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.016Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Canada",
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
                    last: "",
                    first: "Oris4/TimWilson"
                },
                isOwn: false,
                type: "Person",
                fullName: "Oris4/TimWilson ",
                id: "55b92ad621e4b7c40f000640"
            },
            {
                _id: "55b92ad621e4b7c40f000641",
                ID: 14,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.016Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.016Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Global Forwarding LLC"
                },
                isOwn: false,
                type: "Person",
                fullName: "Global Forwarding LLC ",
                id: "55b92ad621e4b7c40f000641"
            },
            {
                _id: "55b92ad621e4b7c40f000642",
                ID: 19,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.017Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.017Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Canada",
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
                    last: "",
                    first: "Volodymyr Lychman"
                },
                isOwn: false,
                type: "Person",
                fullName: "Volodymyr Lychman ",
                id: "55b92ad621e4b7c40f000642"
            },
            {
                _id: "55b92ad621e4b7c40f000643",
                ID: 24,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.017Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.017Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: null,
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
                    last: "",
                    first: "Angelica"
                },
                isOwn: false,
                type: "Person",
                fullName: "Angelica ",
                id: "55b92ad621e4b7c40f000643"
            },
            {
                _id: "55b92ad621e4b7c40f000644",
                ID: 29,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "iask consulting"
                },
                isOwn: false,
                type: "Person",
                fullName: "iask consulting ",
                id: "55b92ad621e4b7c40f000644"
            },
            {
                _id: "55b92ad621e4b7c40f000645",
                ID: 34,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Romania",
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
                    last: "",
                    first: "Vlad"
                },
                isOwn: false,
                type: "Person",
                fullName: "Vlad ",
                id: "55b92ad621e4b7c40f000645"
            },
            {
                _id: "55b92ad621e4b7c40f000646",
                ID: 39,
                __v: 0,
                companyInfo: {
                    size: "200-500",
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USAd",
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
                    last: "",
                    first: "EtienneL"
                },
                isOwn: false,
                type: "Company",
                fullName: "EtienneL ",
                id: "55b92ad621e4b7c40f000646"
            },
            {
                _id: "55b92ad621e4b7c40f000647",
                ID: 44,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.019Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.019Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Joren Rapiny"
                },
                isOwn: false,
                type: "Person",
                fullName: "Joren Rapiny ",
                id: "55b92ad621e4b7c40f000647"
            },
            {
                _id: "55b92ad621e4b7c40f000648",
                ID: 49,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.019Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.019Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Anand Gupta"
                },
                isOwn: false,
                type: "Person",
                fullName: "Anand Gupta ",
                id: "55b92ad621e4b7c40f000648"
            },
            {
                _id: "55b92ad621e4b7c40f000649",
                ID: 54,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "US",
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
                    last: "",
                    first: "Contegra Systems"
                },
                isOwn: false,
                type: "Person",
                fullName: "Contegra Systems ",
                id: "55b92ad621e4b7c40f000649"
            },
            {
                _id: "55b92ad621e4b7c40f00064a",
                ID: 59,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Hungary",
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
                    last: "",
                    first: "Carussel"
                },
                isOwn: false,
                type: "Person",
                fullName: "Carussel ",
                id: "55b92ad621e4b7c40f00064a"
            },
            {
                _id: "55b92ad621e4b7c40f00064b",
                ID: 64,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.020Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Thomas"
                },
                isOwn: false,
                type: "Person",
                fullName: "Thomas ",
                id: "55b92ad621e4b7c40f00064b"
            },
            {
                _id: "55b92ad621e4b7c40f00064c",
                ID: 1064,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.021Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.021Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Germany",
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
                    last: "",
                    first: "Razvan Chisu"
                },
                isOwn: false,
                type: "Person",
                fullName: "Razvan Chisu ",
                id: "55b92ad621e4b7c40f00064c"
            },
            {
                _id: "55b92ad621e4b7c40f00064d",
                ID: 1069,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.021Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.021Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "ProTriever"
                },
                isOwn: false,
                type: "Person",
                fullName: "ProTriever ",
                id: "55b92ad621e4b7c40f00064d"
            },
            {
                _id: "55b92ad621e4b7c40f00064e",
                ID: 1074,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.022Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.022Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Spain",
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
                    last: "",
                    first: "SetFile"
                },
                isOwn: false,
                type: "Person",
                fullName: "SetFile ",
                id: "55b92ad621e4b7c40f00064e"
            },
            {
                _id: "55b92ad621e4b7c40f000650",
                ID: 10,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.022Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.022Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "PatrickMolander"
                },
                isOwn: false,
                type: "Person",
                fullName: "PatrickMolander ",
                id: "55b92ad621e4b7c40f000650"
            },
            {
                _id: "55b92ad621e4b7c40f000651",
                ID: 15,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Dan D."
                },
                isOwn: false,
                type: "Person",
                fullName: "Dan D. ",
                id: "55b92ad621e4b7c40f000651"
            },
            {
                _id: "55b92ad621e4b7c40f000652",
                ID: 20,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Zugara"
                },
                isOwn: false,
                type: "Person",
                fullName: "Zugara ",
                id: "55b92ad621e4b7c40f000652"
            },
            {
                _id: "55b92ad621e4b7c40f000653",
                ID: 25,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.023Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: null,
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
                    last: "",
                    first: "Peter B."
                },
                isOwn: false,
                type: "Person",
                fullName: "Peter B. ",
                id: "55b92ad621e4b7c40f000653"
            },
            {
                _id: "55b92ad621e4b7c40f000654",
                ID: 30,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.024Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.024Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Israel",
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
                    last: "",
                    first: "iqDesk"
                },
                isOwn: false,
                type: "Person",
                fullName: "iqDesk ",
                id: "55b92ad621e4b7c40f000654"
            },
            {
                _id: "55b92ad621e4b7c40f000655",
                ID: 35,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.024Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.024Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "UK",
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
                    last: "",
                    first: "We do apps"
                },
                isOwn: false,
                type: "Person",
                fullName: "We do apps ",
                id: "55b92ad621e4b7c40f000655"
            },
            {
                _id: "55b92ad621e4b7c40f000656",
                ID: 40,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Hungary",
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
                    last: "",
                    first: "ShiwaForce"
                },
                isOwn: false,
                type: "Person",
                fullName: "ShiwaForce ",
                id: "55b92ad621e4b7c40f000656"
            },
            {
                _id: "55b92ad621e4b7c40f000657",
                ID: 45,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "Nikky"
                },
                isOwn: false,
                type: "Person",
                fullName: "Nikky ",
                id: "55b92ad621e4b7c40f000657"
            },
            {
                _id: "55b92ad621e4b7c40f000658",
                ID: 50,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.025Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "UK",
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
                    last: "",
                    first: "JellyGames"
                },
                isOwn: false,
                type: "Person",
                fullName: "JellyGames ",
                id: "55b92ad621e4b7c40f000658"
            },
            {
                _id: "55b92ad621e4b7c40f000659",
                ID: 55,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.026Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.026Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Thailand",
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
                    last: "",
                    first: "PBI-Solutions"
                },
                isOwn: false,
                type: "Person",
                fullName: "PBI-Solutions ",
                id: "55b92ad621e4b7c40f000659"
            },
            {
                _id: "55b92ad621e4b7c40f00065a",
                ID: 60,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.026Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.026Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Australia",
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
                    last: "",
                    first: "Technatives"
                },
                isOwn: false,
                type: "Person",
                fullName: "Technatives ",
                id: "55b92ad621e4b7c40f00065a"
            },
            {
                _id: "55b92ad621e4b7c40f00065b",
                ID: 65,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.027Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.027Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Australia",
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
                    last: "",
                    first: "Kogan.com"
                },
                isOwn: false,
                type: "Person",
                fullName: "Kogan.com ",
                id: "55b92ad621e4b7c40f00065b"
            },
            {
                _id: "55b92ad621e4b7c40f00065d",
                ID: 1070,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.028Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.028Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "",
                    first: "CloudFuze"
                },
                isOwn: false,
                type: "Person",
                fullName: "CloudFuze ",
                id: "55b92ad621e4b7c40f00065d"
            },
            {
                _id: "55b92ad621e4b7c40f00065e",
                ID: 1075,
                __v: 0,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.028Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.028Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Israel",
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
                    last: "",
                    first: "Collections Tech"
                },
                isOwn: false,
                type: "Person",
                fullName: "Collections Tech ",
                id: "55b92ad621e4b7c40f00065e"
            },
            {
                _id: "55b92ad621e4b7c40f00064f",
                ID: 5,
                __v: 0,
                companyInfo: {
                    size: "200-500",
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T09:39:00.881Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.022Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "52203e707d4dba8813000003"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "+972-54-5492645",
                    phone: "+972-3-942-4772"
                },
                skype: "",
                jobPosition: "",
                website: "http://www.kenlo-group.com/",
                address: {
                    country: "Israel",
                    zip: "43661",
                    state: "Tel Aviv",
                    city: "Herzliya Pituah",
                    street: "Medinat HaYehudim 60 St."
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "igor@kenlo-group.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "Kenlo Group Ltd"
                },
                isOwn: false,
                type: "Company",
                fullName: "Kenlo Group Ltd ",
                id: "55b92ad621e4b7c40f00064f"
            },
            {
                _id: "55b92ad521e4b7c40f00061d",
                ID: 2,
                __v: 0,
                companyInfo: {
                    size: "50-200",
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T09:41:24.950Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.997Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "52203e707d4dba8813000003"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "+61 3 9039 9999"
                },
                skype: "",
                jobPosition: "",
                website: "http://www.buzinga.com.au/",
                address: {
                    country: "Australia",
                    zip: "3121",
                    state: "Melbourne",
                    city: "Richmond",
                    street: "Level 1, 225 - 227 Swan St"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "jason@buzinga.com.au",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACMAIwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9Avil8UJ9BuT4d8Pyqt4FBuZ9oPk5GQqg8biOSewI79PHLzXNT1Fi9/qd1cs3UyzM38zVbxBqUmo67qF9K7M091LJknPVjgVQ80+tfx5xZxFjuI8fUqVaj9mm1GN3yqKemm131fV+Vkft+T5NQy3DRjGPvWV31b/y7IvecPWjzh61R80+tHmn1r5L2B7Hsy95w9aPOHrVHzT60eafWj2AezL3nD1o84etUfNPrR5p9aPYB7MvecPWjzh61R80+tHmn1o9gHsy95w9aPOHrVHzT60eafWj2AezL3nD1o84etUfNPrR5p9aPYB7MvecPWlS5aNg8cjKw6FTgiqHmn1o80+tNULO6F7O52egfErxV4fmVrfVZbiEHLQXLGRGHpzyv4EV9AeFPE9l4s0ODWbRSgkyskZOTG46qf6eoINfJnmn1rf0Dxxq/hyzeysJSsckplOGx8xAH8lFfpfA/HeK4erOljpyqUGtm78r6ON9lvdbddz5fPuGaeZQU8PFRqJ77XXn/mc1OczyHP8AGf50zJ9aZRXwjd3c+xSsrD8n1oyfWmUUgsPyfWjJ9aZRQFh+T60ZPrTKKAsPyfWjJ9aZRQFh+T60ZPrTKKAsPyfWjJ9aZRQFh+T60ZPrTKKAsPyfWjJ9aZRQFhu72o3e1MyfWjJ9a1saD93tRu9qZk+tGT60WAfu9qN3tTMn1oyfWiwD93tRu9qZk+tGT60WAfu9qN3tTMn1oyfWiwD93tRu9qZk+tGT60WAfu9qN3tTMn1oyfWiwD93tRu9qZk+tGT60WAfu9qN3tTMn1oyfWiwDK6bwR8Pta8fPfR6LcWcTaesbSC5dl3b92Au1T/cPXHauX3e1e1/sz83fiP/AK52f85q+m4SyrD5xnNDA4pPknzXs7PSEmtfVI8jP8ZVy7LauKofFG1r+ckvyZ47f2N3pl7cadfQmK5tZGhlQkHa6nBGRweR2qCvoXUvhL4Gm8RXt94v8SLHe6tdyzW9qt0kPys52gBhuZvpxnjHeuF+J/wh/wCEKWDVdIuZ7rS5pFhl83BkgY9MkAAqemcDBwO4r0c14EzPLqVTFKKdODd7STklfRyS20s326pHHgOJ8DjKkKDbU5LTRqLfVJvzPNKK9W+KXwn8P+B/DUGs6Xe6hNNLdJAVnkQrtKOT0UHPyjvWX8I/htpfxAfU5NVvrqCOxEQVbcqGYvu5JYHgbemO9cFThHMqeaRydxXtpK6V1a1m9/RM64Z9gp4GWYpv2adttd0tvVnntFetaH8OfhbdnUbbW/GMthd2Go3NmYpbyGIlEkIRsOvOVAyRxnPTpXR6b8DPhrrKu+keK72+WIgOba8gkCk9AdqHFd+F4BzXGpOi6bb6c6v56b6dTkr8U4DDNqopq3XldvvPOvhf8Obf4hTajFPqz2QsFiYbYg5feW9SMY2frXL+ItKTQ9e1HRknMy2N1LbiQrjfsYrnHbpXsPh74SaN/wAJf4g0Kw8Sa7ZxadDaESWl4I5HMiuSHKrzjAwMdz61zvhj4NXXibxPrVrd6tKmn6VfSW0t0RumuXDHOM5GcYJY55I4PbtxPCGJlgcNhsPhf9olOpFzU7qXK5JqzdopW3628zno59h44mtXq1/3SjBqLja3Mk9923fbz8jzCivfU+DPwp1CZ9F03xTM+pRbg6R38MkqleDuTb2PUYFeaa38L9d0nxvbeCoXS5lvtr204GFaIk5dhzt27WyOenGcivIzLgvNcspxqzipxlJRvCSl7z2i7dW9PU78FxFgMbKUItxaXNaStouvocbRXvp+CXw18P2sK+KfE0sc8wwHmu47dWYddike/qe1c38QvgePDukTeIfDOozXlpbp5k0MwDSKnd1ZQAwA5PA4yc11YzgDOsFh5YiUYy5FeUYyTlFb6r07XMcPxVluJqxpRk1zOybTSb8n/nY8mor1r4e/BrStZ8Or4s8YarLZ2cqmWNI5FjCxAnLyOwIAOM8dsHPPG+Pgt8NPElvOPCPiqSS4hUZMN3HcIhOcF1Azg4PcdKWE4BzjGYeFeCinNc0YuSUpLe6Xp3YYjinLsPVlSk5Pldm1FuKfmzwairWsabdaJqt3o96F8+ymeCTacglTjI9qp7vavj6lKVKbpzVmnZrs0fRQlGpFTjqnqJkete1/szf8ffiP/rnZ4/OavC/NFdr8KviIngDX3u7uCSawvI/KuUiA3jByrjPUg54yOCa+o4PxtHK88w+LxLtCLd325ouN/RX1PJ4iwVbHZXWoUFeTSsu9mn+g34pXV3dfEHXHvJGZ47tok3HpGvCAe2MV7frDyaj8C4p9XYtK2lWspZ25ZhsKsSe5IU/jWdqrfATxvqK+JdR1yw+0YXzBJdNbmULwN6NgnsOnTiuY+MvxY8O6roSeDPCMiT2zlPtM0cZWJUQgpGmcZ5VTkDAAAGc8foFPD0OHo5nj8RiqdSNeMlCMZczk5N2uvK9na9tT5CU62cSwWEo0JwdJxcnKNlHltez+Xl0Ot/aGP/FBWf8A2EYv/RclYn7M3+q8Rf71r/KSrml/Ev4cfEXwlF4e8c3aWNyqIJhOxjUyKP8AWRyDgfQ46kYI62LXxp8IvhRol1b+F9Rj1G5mO/ZBJ50k7gYUPIPlVR+mTgEnn1pSwWI4gpcTRxVNUIw1Tl7yfLJW5d767b9LHAoYqjlNTI3Qm6zlpaPu25k737aenmeZP4M1bxx8T9c0nTE2qNUunuJ2HyQR+c2WPqewHc/iR6l4y8V6F8G/DMPhXwrFGdTkjzGGwxTPBnl9WODge3TAxTPhh4+8A6X4YS61XXtOtNX1Kaa71Dc2HaVpGOT+GMDtVTUrD9n3WL+fU9T8QwXF1cuXlkfUJiWP5/gB2HFcGX5fSwGXzxWV4iksViNXKc0nTjLXlitXza67a+iOrF4qpisZGhjqNR0KOijGLanJaXe2nby9WVP2cbu5vr7xPeXk7zTzG2kkkdsszEy5JNegeCgEtPEzrwx1y+JI9cj/AAri/BHiD4WeDPE+tw6Nr9nb6ZcWtmYmadnDygzbwC2TwCn51oeE/iN4HsrXxAl34msYmudXvJ4Qz/fjYjaw9jXs8N4jDZbgsJhsRiIOcHWTammruUtbu2/R9Tzs6oV8bia9ejRmoyVOy5X/ACrS3l17HjfwumlX4i6HIsjB2vAC2eSCCD+YJr6K1S3tm+J2hzuq+aul3uw9zh4R/Jm/M18v+BdasdD8ZaRq2ouyW1tdo8rhc7VzgnHfGc16v8TfirpFn4t8MeJPCup2+pCwW4W5jibqj7AUPHBIzj0Iz2r4/g3NcJlmSVZYmavGtTla+tuaF2lu7Wb07H0fEmW4nG5pTjRi9ac1e2l7Ssm9lfz7nMfHq6uZviHcQzs3l29vCkIJ4Cldxx/wJmr1H4cXNzf/AATf7c7ShbO9hQsc5jXeqj6AcfQVn61qfwM+I6W+va5rFvBcxRBSslwbefb12MufmwSemepwa63TtS0HUvhxe3Hhi3MOkxWd1Ba5UqGSNWXcAecEg8nk9TzX0+TZUqWeY3M4YmFSFaE3GMZXk02ndroo7fNHhZljXPLMNgpUJQlTlFNuNkmk1o+re55l4U+Enh238IxeLfiDrtxb2k0KTrDHJ5cccbfdDHBLFsrgDHJxzXcfCy9+Gr3Oo2Hw/spkMSI1zPIr/vBkhQC53evYCuc8NeO/h3458AW3g/xhqkenTQQRW8qyy+TuMeNkiOfl52g4PfIwR1t6f4s+Dvwo0e6HhrVI9RupwGZYJfOlnYfdVnA2qBk+mMngmpyeOWZXPDYvByoRw8YXnOTvW5rO6V9Vra6XmktkVmKx+OjWw2JVV1nK0YpWp8t1Zvv6+j7s8e+JZ/4r/X+f+X6T+dc1ketP1jWLjW9VvNYvNvn3s7zybRwGZiSB7c1T80V+IZhUWKxdWvDaUpNejbZ+oYShKhh6dKW8Ypfckir5gq7o62E+pQJqk6w2ikvMxJGVUZKjAJycbRgHk1j+Z70eZ71tTioTUmr26PZnozpOcXFaXOsjTwnaSaoJ5Wu4BIgsmUt5hjZXbOMqNw/dg7hgHPFU76TQl0WyS1Q/2iRundS2MbpAQ2TjOBHjAHG7Pauf8z3o8z3rolWUouKpxWjW3d3/AA2XkYRwbTUnNvbr2Vvx3fmdJbR6O+gPLciJbkGQiQT/AL3cNuxPLzypy2Tjj14wZrtPD6zaSgREgliUXUscgZgzRrucgSMflYscFUzjGD25XzPejzPemq0VG3s106dn+vXr5h9UlzX531/H/Lp+R1dvHoS3d/D5UFwtvGscTNNhJHVcPIpMkfBYZA5IDD5T2g+x6MU0KeW8WO3uFVdSdJQ0sTfaJAxEfLDEQQ9Mfia5vzPejzPej2sGtaa6/mn+lt9n0D6pPpN/0rf8H1OvWPw7Fq0f22G1jiFrK8kMVy00XmBW8v51bJJ+XKhuvpkqF09fBE0kjXUl7EjXswt1Z1z5G1dgkx0OWJ3D+4w7gjj/ADPejzPerWJjF/wovW+q9O1u3pq9CHgJNfHLa2//AA/c6d00UaLpbpHD9olk/wBLk80blHmuMbfMyBsCH/Vj/e7VY2eEoNe07ymW5025fFws0jqYFMhGGZccqvII4IwSOSByHme9Hme9SsRGNrU46cvTtb8+t73G8FJ3vN6369/8uh7L8LtD+EOp6Ld6r471GzgununENpJfNF5UQAI2gMGbJJGST90e+ej+I3xt8J23haXwf4A/fCe3Np50cRjht4SNrKoYAsSvAwMDOc5GK+d/M96PM969/D8U4jA4B4LBUYU3KPLKaj78l6/P5dLHj1uF6OKxixeKqTmk7xg37q+X9X63LfmCjzBVTzPejzPevk/Zn0fIW/MFHmCqnme9Hme9Hsw5CvketGR602iumx02HZHrRketNoosFh2R60ZHrTaKLBYdketGR602iiwWHZHrRketNoosFh2R60ZHrTaKLBYdketGR602iiwWHZHrRketNoosFh2R60ZHrTaKLBYTcKNwp97byWV5PZyAhoJWiYHqCpI/pUGTWjg4uzBNSV0SbhRuFR5NGTS5Rkm4UbhUeTRk0coEm4UbhUeTRk0coEm4UbhUeTRk0coEm4UbhUeTRk0coEm4UbhUeTRk0coEm4UbhUeTRk0coEm4UbhUeTRk0coHo/x48D3XhHx1eXqW7DTtYla8tpeSu9jmRM9AQxJx/dK15xX334m8MaF4v0mXRfEOnpd2kpB2sSCrDoysOVI9QfX1r5J+L/w50LwJqLQaNcXroWyBcSK20HsMKPWv0DjThd5ViJYyjJezm27dU+q2tbtr5dLv4bg3iZZph44StF+0gkr9Guj3vfv9/Wx51RTKK+CPvLD6KZRQFh9FMooCw+imUUBYfRTKKAsPoplFAWH0UylUbmVT3IFArDq9/wDhD8DLLxH4Ni13xHE0Ut7M8lspXkwYUKTn1IYj1BB71L8GPgx4K1y3TX9aiur14SCttLIPIJzkEqFBPToTg9wa+ikRIkWONFRFAVVUYAA6ACv1TgnhGniU8fjbSg1ZR137v9D8u404sqYZrA4K8Zp3cvLsvXqf/9k=",
                name: {
                    last: "",
                    first: "Buzinga"
                },
                isOwn: false,
                type: "Company",
                fullName: "Buzinga ",
                id: "55b92ad521e4b7c40f00061d"
            },
            {
                _id: "55b92ad621e4b7c40f000629",
                ID: 62,
                __v: 0,
                companyInfo: {
                    size: "1-50",
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T10:07:57.240Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.002Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "52203e707d4dba8813000003"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "+34 911 330 049"
                },
                skype: "",
                jobPosition: "",
                website: "www.cristaliza.com",
                address: {
                    country: "Spain",
                    zip: "28037",
                    state: "Madrid",
                    city: "Madrid",
                    street: "Calle de Valentin Beato, 22"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "info@cristaliza.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "Cristaliza"
                },
                isOwn: false,
                type: "Company",
                fullName: "Cristaliza ",
                id: "55b92ad621e4b7c40f000629"
            },
            {
                _id: "55b92ad621e4b7c40f00062a",
                ID: 1062,
                __v: 0,
                companyInfo: {
                    size: "1-50",
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T10:35:11.139Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.003Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "52203e707d4dba8813000003"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "+44 (0) 207 183 5901"
                },
                skype: "",
                jobPosition: "",
                website: "http://www.peachinc.com/",
                address: {
                    country: "England",
                    zip: "6945",
                    state: "",
                    city: "London",
                    street: "W1A 6US "
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "info@peachinc.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "PeachInc"
                },
                isOwn: false,
                type: "Company",
                fullName: "PeachInc ",
                id: "55b92ad621e4b7c40f00062a"
            },
            {
                _id: "55b9ff67d79a3a343900000a",
                dateBirth: "1982-11-01T00:00:00.000Z",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T10:43:37.578Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2015-07-30T10:41:43.797Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "CEO",
                website: "",
                address: {
                    country: "Australia",
                    zip: "",
                    state: "",
                    city: "Melbourne",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "55b9fe20d79a3a3439000009",
                email: "ruslan@kogan.com.au",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "Kogan",
                    first: "Ruslan"
                },
                isOwn: false,
                type: "Person",
                fullName: "Ruslan Kogan",
                id: "55b9ff67d79a3a343900000a"
            },
            {
                _id: "55ba006ed79a3a343900000b",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T10:46:06.893Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-07-30T10:46:06.893Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "+16162403185",
                    phone: ""
                },
                skype: "jeff.courter",
                jobPosition: "Founder",
                website: "",
                address: {
                    country: "USA",
                    zip: "",
                    state: "Michigan",
                    city: "Grand Rapids",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "55b92ad521e4b7c40f00060d",
                email: "jeffrey.courter@gmail.com",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACMAIwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDuEto5ZI5v7WUmPJXATuKtyiaG3eWLVYyQOMqtPSzbzonGmxfLkEAr3GK0EgjRctpiYHJ+6a8/lJG20Fzwf7RjkzzxGP8AGrdnZTwJ5f2pWwxbO31OfX3qWGFOMWC59QFqW3tlxtaxI5J6D1qoolsdEl557RJJEQqg8oT1z7+1Wms7yd4ZBNCvlPvxsPPBHr702CK3WQqunvuABJCD/GrIs4WMbCzfrk+361qkQ+xOIr6NGkHkHAJxtI/rVuBL8gcQc+zVEsEAQ77SQqByNuf61oWNtbsQBayAHp8pFWIqXuoW/hXRbzXvEF7bW1haBp5pmDYRS3AwMkkkgADkk8V87fFX9qnxVJGtp8MtP/s/TmA8zVp7YyyEkgfKpysYycfOpJyMYPFZ3x2+It54/wDGP/CC+GDJNpHh+ZxcbJCVurr5lYsv8Sryi9s7ycgqR5XqPwo8ZyWV1rlxazlLZ1BUZyWb5sDHpnpniueeKhTnyN2Z3YfAVasedRbR0vhf9p/4taZewW954vF7EjhHW8s1ckZycvtDd+5Fd/8AtMeKb34ofCzQfEVhpsb3un3LXF2tjJ56C32MGmGMlUDbQ2fukgEkYJ8T8L+FJry+dte0Y3NucuI42ZJS+exIJBzyQCM442/eXb0zxF4h8MalNLpbnT42i2okabScH7wDDDEhccg8Dn7oxDxLUrQY5YRpXlGx5PDq0ynAmX8ae+t3IBAlX8K2vHkNlp+uf2rDo9tFZ6sv2qJLddkKMT86RoAAqhuQo4UMB2rGsprfVLyDTNO8Pvc3d1KsMEMOWeSRiAqqo6kkgV6UJ+0ipI5mlF2Z6H8GPF3wQ0e7v5fjZ4Gv/EkbKn9n/Y5mXyG+bzNyebGGzlMEk428DnNcX8TdU8G6p4ovbnwBoU2i6BI6mzsZZ2meIBFDZZix5YMcZOM4ycVZ8beC/E/w4vodN8ceDLrR7i5iE0CT4PmJ6qQSD6HnjvXP/wBoaSV+ewYn609HqQlre5l/Jtxk19RfBRVh+HmnhQPmaRjkdy1eT/DDwbZ+ItXt9V1Cxxp0cyqsbDiVs9PpX2BH8P8AT7O0tUsLSO2heESLGgwBkmk3rYwryuuVDpBCjwCK/nwXwwyemD7euK1IktWjIF6547t/9apCL6No1EcDb3CnkjHHX9K0PstzLGVKxcg85P8AhXnpHS7sht4WxkTkg+uKtwQzsSRODgnA2jpViG2AUbkHTsf/AK1aVtpkkyCRYsLk9SKtabkpN7GdFCqSbmuVDMBkELVpY2BXbeLgnHQdKuDSpVdnMKEEADvUnkMrBDbBucDkf1rSLvsJprciSDcu37UuCMcYql421q48J+BfEHiW2uIxPpmmXFzAWUEeasbFAf8AgWK2fsoKn/Qlz/wGsT4j+Frnxj8Pdf8ADVlbMlzfWEscG0qN0oG5FPsWAB9iap7CW+p8wfsneFrXU7zWb+9g8z7NFEgz93e+8k47kLgfnX0xfaBbNZfZo7VEUkZBXrzmvC/2YZ5PD/wu8QeKDDaQTnVpI5Zr6QxxRRRQpguQCeCzcAZycdK3vCfxu8SeLfG7+Bb6XTI5xIIU2WVxAdxXcufNOTxg/dHHNeDOKlVlKSPs8M5RowhF7nXP8NdJtGk1JtOgmdP9X8mCCSc59fbPSvOv2gPDGjN4GHiCDSgt/p8qGNlIQqmQCCfpirXjb4xeLtG8Sa7oVsdOtU8O26z3ctxCZdyYQbowZEBO51XGSxJ4HetPRPFGnfGfQ9Q8NajBCkr2zQStErxlZGXg+XIMoe4+Zhx161ryKFpJGdZupene58o+JprbW/AcU+AbzSrtXfao+WGRdpJx0GRCPw+lYXgrwH8QPFzXmreA9GvruTQVW8uLm0cK9qBkq4OQd2VJG35vlyOlbHhbwx4q1Wx8Rada6PcXktqEgubcISS6ShdpPbGN3X/lniruk+FPibosdzBo3hnW7CK9j8q7itbqWIXEf9yQKw3L14Ne1h0opq+lz5ive60OK8Q+KPFPi65jvfFfiTVNauYo/Kjm1G8kuHRM52guSQM849c16N8F/hRofjfTNR1bX5ptlqyxxJE2DnqSawX+G3i3Bz8O74e4L19I/srfDu/n8Oavb6npM2nsLlP3cmckfjXQ7s5pu0bRMQ+GD4a1nSNJt7Jre3LIYFP8S+vvX1JJpuLSwXb920jH865v4p+E4ZfG3hSOGLCxgq2B0AFeiTWoVYU2/ciVanZ3MUtWebi2siyB7WcEnj5W6/nWnFbRCMmOKdWxxkPTxauWX/T0+U5HyitGIPGu55UcDsF/wNcSWp0ti29uSoAuFA9Gbn9atQh402Lc/Lk9Gzz3rSs7GxukYx206MoySw4P0pn2M26jgfMWIJz0zWiQFEMfNIa6lHA7mpSkJ2hppAwOQd2DVgJLzjZ+OaeIp3ZAuwsD05qkrCdyDaoQlLpyQPX/AOtVuFB0Fy2T9P8ACrBsruNC7GAgf7Rrz3xR461t9WtdH8FLZyeXOsl5Mzby0C8yBB0Bx0J6nGAOtRWqRoR5puw4QlUkox3Mv4Q6FYtL490C4ELLb+LL24VRyFWQJInBHv8AoKv6doPguPxdPqcNvCNRsFyszNxEuOcD7qk4x64FaVpaadb6jf3NrcG21DxRbJMHjYCOV4QV3AdN+0888rGDjg1wXh/Qde0zWrvw9faIqabds6y63NeHZLdABiJFWNjECudrkhBt28EqG8CU+d80FufbYFr2ajUe2ljMt7/wFd+MY7/Xbi2updUnezF3bTHKFmxsZ4yGCklcZ4yBXbalF4e8LxfZNDgKJGpJ/eGQj8WJNeO+Lfh5qXga4hTwfZ+HrifVrgKfI1B3JKru8xyY1VQGIGBk5OegJrs/Hn2fw7fiKK4lu7/ykjKhiS7uw2IFXqeo465rSSdrJFVZwgm32+Ryf7LmnRahoHi3WdU1KC0iu9aUNOzAMZ3GSpHUKN8Z3EAZcjPBr3yw8IaDbaf9n+zy3Fxgg3Cru3E9CGHGK+e/GOs+BPCa6v4O8H2pa6lvVtbuAQFYt9v5MZdzgBiWtlfCZBLNu9K9Y+CPg9fAWj/ajpyR3GqkTXDs2xy3JAz1IGTxnv8AifofYNQjzPTc/PqWcqnXnyxve61V7I3pvCV3ZqQJ2b6qK6f4a6W1vDfPKPmaQdq0H1jRrnMcswWTbvYbclR6kDoOD+VbGg2iW9q08ZVo5yHRlOQwx1BrobuiqbjN3izF8U2CXXinSpSufKVj+laM0QZ/oAKs6lYySalDfbflRSM46UPE5YnFZM1tqzgVsmmliVbFCd44BH0/rXV+GoorCa5iutOLPGM/IFPA69awTaXFvNDLDcXCsjhsjn+Y9a2YvtGBdefOxkQ+Yf7x9+K549y7NHcRG3urZZYYcq44BUZrA1lLSG28p7TZNuJyEB4z6itjSWt1sokinyAoyA4OD3rN1SO0mcPLfEPuYNnaBgE+orZ6jexzLIuMtbuRnrinKkX3zA+SOMDp+tFxKgcxxXQKhv8AZ64p0b7iMXAB/Dk1mQcr431sp4f1W3067EEotLtPNEgXy5Y4yeSTxz+PU9jXkh8WaRdLoWpeB9Ok+w69GYLi5EsjTRuw+XAbOCpJ9z8voc7Pxxlm0HWr+1mXfpXiS3jngwCWGowsuYQewliQKM/xAg/fAKfAbwoPC3gy90C4kSbU7G7uI0YfMqSRE4VPXKDr6cVzzxFH6unOKcmc0sPWjim+ZpGZ+z7Z63rWoJq3jG5vriTw99vijuJ5slBK8cUStzwwxdcnkKR759F8A+OrD4heF/ttmwsb2SKOS4icZaORl+8pONy5DDPfBHBBFec+LvixY/Cbwy/gr4c6Fba74hvA95qT3shihtnfnttaZwMDCMNu3JOSVrzObUdT8Bw6Z4w8K3MeuQ2Pm6ZqukJHIrzWPmPNHMjYxlBLIAQWwH6nLAck6PtEpU1p5HuYLGxoTftJHr/iu58N+C7ebW9e1iOeaIEwKsSxqXzkZ6k4PPJ7CvMfA+u6t8QPFdx4+lXZo2gSO0E80ZMdxeBdsIz3VCVbOCd2PrXmur+NrX4w+JHstC0CTT9OtLV76/u9QuHmNrbxn5n2g7QTlUTJwXdASATje+HHxj1/SfDviXw6bQXugDTWudLtQi/6FceaixKHPJViTuBJJK56sdzpYf2fvSWvY0zLHSxCcKb07n0D8KvAGi634I8NeK/FkJu9Q/sm2uBduT5m+VA+4njcSXyc55JrktZ1/wCJUnxCPhI6y8FrBL/pssJCW1vakZ3Zbts+bYTnCtyOg9xt4IJNctPB+iwLb2Oi20e4RjCo23Ea/RFUn8BXF+IpbRfHml39naPO5aUzx28Y3zRxTNBbRjdwcvHJITnaMDOFJNenSrWmodz5aphoqm6iWpf+1NolpDPc3Vxp9o52oXZmuHyCRngsZWwTtUZAHYA47n4ceJzqP2/S/tJkii23ECtyUDZDjPpuB46Dt1rzTxFqOlWN7I+salHPrM8ZIRFLrZ2xI/dpjoWKrknDOQCQFCqrPhB4y0u88bHTYfMUy6e+0OoAyJXPqa7KsWoc1tjgwFbkxHImfSFyf9C6fwiqcgBIOOwq7dnFgD/sgfqKp3BAZR0+UVgfRy3OYaa6BUAxHcccg1fiu7gWy27LFgZ5571gm5t42XNryTgYA61Z+0K0TBLdwWGB061xKRvKJ1WnyvCoxcRvwMjGM/jUs0zXsG9o4grZB+YnHP0rm47mSFAUVT+AJpYruXAZR8r5GOg/LPFaqehDiSNaGJnRY0IZuCD7fSo2hMfJVeATjPp+FKMh5AVmIUjDAsR055okkjEcmfMyqMwzn0pSbUWxKOqPnf40eNNLOvafbX1xc20T+VKXOQsMiSkpJGw7qR83Q45XLAKdDwF4kd/FtzdW0oMOtsNRtg3zrGx3+YFIPOCrJx2+tcp+0Xp0d21vKmnxSK8DZAyG3FmGeOP0rhND+I3/AAhVz4f0qbRvtMum3EtpAttcpKSJCX2vgnnfMcdPu4x3rghh5V8JGUFd3ObGV1DGOPl+R1XxI0G28K/GvTtW35tdUeO+jEw3xuUBDxEdlbzBwO9d/qnw3sLxDd+GNTfSZpYVvNNu4CYwuUyOBlRkBRnaa4n48W+qeK9C0XW7OwaObSZXKEyRpnc5Gw7iAfl2Y256e4rQ1/xrrFv8NNIg0qUrewafFDqMiHDWq+VE5GQfvbZYwPqT2r18tpSVBRmrHjZliaalzQadjxnxh8PpvDy+K9C8OatZOr6ja2upTwqBvZ2wkQUE7cYld1GAXU8DYoXqZfD2nab4E1DTtHgaM3uufZbRzgP5Fq4gz77pIt3pk/Wu7+JcFnofw6gEADzRaimpzyOR+8mYO5dyepPOSx4UYzgVNbeBb+20rQry4gB07Tri1MsjTRFY4o3Ek0zlW+YuwP3cjL56CuCpOMqsFJ7s9SMqs6T5E9Ed1pWu6tFp/iTW59WV0F1cSbo18tpIoPlJJHqsD9OCCOM15P4Cg17Wbiwj0S0a1t9Gt7kTTMowZpJ5tsidQzFZFyzYACndnGxrGk+Optc8L+IfDPh+zku5DbzRpIse2JJJlmL5dvlwBMoA65PQ9D3fgiwTS9Ln0O3mhmks4reJbm4UMSVOC6o2QpPXCgAEnFfQyp0lUioJW30PmaFSu6E5Vr81ra/eYl34YsUSSS6vp7uQZJdSNiEAdOoz0+clmPcmsf4bw2ek/GbSreRdsOoWEiq24niTzCPx6gV0d+8Wq3Mluty7afZSA397OxzIwP8Aqowe3r09h6cpqdymjfFHwjrd2gR5rq3ARjxDEspUAjsfm/CumvBSpM8/Lqsni0z7LjvVfRrdJGUy+VHv+vGf5VHPcxSuGHI2gVh2t15t7Ou4kKpPParWny+bbK4Pc14j0Z98p3QxYNMucGWziyDn5Rt/lTn0rTmUqhliHba+f55rNjuNjcGrLXfA5ryY1dNT1XTiQ6jDaaQbaR7/AOW5kMMayFVLSbS20ep2qxxjopPaoYZIFABk3Lg9x/hT9ReW+06e1gP7/wCWSEGQoGkQhlDNg4UkAHg8E1R010ntYpoSuySISRkoVJBGQNpGV/HpW8Z82xzzjys1bRribzYUmCpGQeR60y9YR2VxJ54bZDIen+yT/SqwMkrM7QhnBwxLA/rRLEHgm3wrgxOpxjPIrWb/AHb9GZxXvo+WvjLr3hW68R2tpqUy3UqxxqtvAN8oy2c8qQvUdq42yHh3WfE9/oi+RotzcT29zYTXbB7l3ikwyAkIu4q5ZRxkxgZJNavjzS3HxDjj0vVbybVrhoEFpZJ5jrgKQCF5HBHJrhPij4PXwkkWqvePc3xk864lIDRW8gbdsaTpJIcfcUk9c4oyyvH6nGK3aPKzfCJY+7ff8T23XvF1rofgvTIBEX1MQMRx+8jDIMKpHzAlUC56jOTzmvNfGPi7V7ayutFvLmO8l1O6VWlgKuiN9jgJC7cqMuWG0cAgjGRWl4L8X+Fta8PTalJbQxSy3sTPbqi7FhdSCAp4G0gD8RXE/FHWtLs/Ks9OtoGuBfQz/aUZjuWPeBgZxhi2T34HStIYyo3yW1OZZZCFXmlrc9U8W+Iwuk2ll4n1CO1tbe/tDdhVU7CzFlDbRuVmUEDIwAc5wDXvfivxX/ZPhqOTSJ4buURGNFZC2eMb2ABOB398jrXz18dTpV78LpNd062gDTGyv5ZUTa0uCsak/wB7HmHBJOORxmsz4qaze2NhpPxC8L+Irmz1O5t7aUuHDx3Dqu0u8TAqcEYBIPP0JrwKrWKcL6XbX5M+voUVhoSUeyZtaJ4cm0jxJ4I0uEw3lz4i1K58QXtmbhoZFIiYQyFSu9Y1aNZACoDNxkYNb3hnWtXeLW7a0tbO3hKBZZZpBbCMh/ul3YEn/GuK+Biand3GsfGHxncanea1BLHcWklugae5tzHNBNsXKrgFkVSudmwjbgcbXhLU/B3irVtVvfE/hjxHcS25gVVvJm8uElyNojLDGTj5QCM5r28HiZQquF7qKS+Z4GaYWH1ZyatzP8DUk8eaVEy2WjMNTubTlUsbUmztmHfcQN7Z/i556V5j478R6xrer2ItoZ5ry3lZ5ZIwVAJcbQffg8e9e0f2Jr3iw/YNKtIvD/huInzHQbWlHpu7CuJ8a3nhew8V6B4b8PT2s1rpiLeahKj5URQs0shJBOcKjN79Oc16lbHScNj5vLcFT9upJH1hpqSR3d5I+fmjPU960dELLp0QPXn+dcPqvxR8PeG7nSbHxFI0d94jKQ2f2eBmimZgCGUjO1TkdfWu5sDstUUdveuKT5mfS2toYMMzyypCn3nYKBnuannklgkaGVSrrwQayJHZGDo5VlOVI6g1Z1DVl1F4pzEY59u2Ug8Njof5/pXgRqLl13PopQd1bYmkuivfNVtIdvtd7ZqHKpILmMjdgLJksCSxyQ4c9AAGQY71XaQkday726XTNRtNXd1jjhYwzyMFwsEhAYkkjaoYI5Oekda0a1pWZjWpNq6OtLKzM671ycNjPUVHf3w0/Tru/kd/JtraSV85x8ozUzQ4ZvKcYbk5HfFUtf0aTXtD1HQZMOl9aSREZK5yMYJ9D0PtXdPmcGl2OODSmrnyxHB4u1LXZfF08MqadqUksmn2qFoYblcHGI48S3Py4O9jHCf+emME9DJ8Gte8d6Fsv2trS3uY/Lie5xJPIuQflVMx20eBwEErMFBL8hqXwvfW9xq+naBe30TStI730czFGhs4QGSBlbILvJOpYggHJHYAeieMvHX9iWOq6jskmj0zbGEDACed8COLdzyzso6cDk8ClSccPTjGPY8fEKWKxMpzWt7L1PBfEXwU8IfDfRmuNf13UPD0sjf6LcW93FeWznHObdgk2eMkqxHOMHrXgWtz3k+szQX+oQ3ZgfbHJb58uVR0ZdwBwRggkA88gdK+yrXwzpUoa+8SXf8AaWp3RD3Mrj/WyE5woJJWJeipnA98nO9p3hnwnYzRC20rTop5QGRhCoKYySQSK8mGdRhN8sb/AD/4B9rT4ZqypJ1JpP02/E+UvF/ibUj4NTwa1z5sK2MXCDOAhV87hwRkAdz1zjglnhjQvid430G1sdE8J61rNqsJjidYmMMTAgN85wo+6uea+z9G0Sx1G5/tSa1S6lhfy0mlUMVIJBxkYFbV5qFzbX0KI7wxS5Qu5O1jjO30B/XitaOK5435La3KnlSg7SqXsj51+EV9rdhod/8AD/xL4itPDOoaSsyLY3WDcrGxMjO0b7o3Qk/dQo5C8naVzl6F4n8ew2jWFnrFrbXUdw3kWD6fEEmRFwPs74+c9eF5HPTNfQ2p29hcx/ZPEVvbQyBmSJ5gHguFKsB1+62zdkcH7wBZc54GS3sdDnvE8JJZHT9RhWI2+qwG8sYzkMyI+4bGyoISQqrFk2soBrfC4inhq8p1V7svw/U8rOMsq1sIlResTzi58c6h4z099O8Ra9qcUsCu5jWcJGVB5BUDpVb4JaFax2+peONbs0utOkkOm3UJYmRIZlCu2ADxiRcE9lNaej+LfAUYv7bxt4TvpNR2zBpbWcyFgEJeONmUTfcXIWV2GBlSVAarvgyTR5fD11F4Ktdb06z1W6V43lwZgkasCXXJAB836kKOMV62MdLkvHY+SyxVYcyktdj3K8vtD1vS47qbwdfWbeGLlSi3UOVOCVDRMe309aZc/tJfBzS5msNQ8Vrb3MXEkRgkJQ9ccD3rkfAXiLxXZ+MZx4i8W6O/h3VU+yG1v5PIaGSPC7oyTkH+LB4+YDjtyvj79nzwz4i8WahrP7yBrmTc6xYKFhwWH1xmsKcrQVj1V79/I901AvZ3slnMMOh4+h6GoQTjcK1dW0ex1spLNeT29xECEuIZSHUH1DAq3fAYEDPGDzWDPo/ijTWeSGS01e3G9lVGEFwMY2qA37tyfmy26MdOK+enFp3Wx9VG1lfctB8nmmXNsl5C8LqGV1KkHuPSshfEVj9r+w3ReyuixCwXKGJ3wOdu4DeB/eXI962redCQdwIPXmiMtdSZw0OAuPiC2n6tL4V1rxWba/ttvySusLTKcCNg+FDlhjgEnOeuDW3a6/r2lOZ4Lq4bB+YTS+YpH0bI/wA9a4P9p7wda3Oh6f47jjZl06aO2vNrBSIncbZATwpViRuII+fmvDovG3jXQbVJtE8VyLGke8RTTeYhPlszbkcEs2cANt2HooBr2aalUgpRZ4dSPJU5T0HX9Zkm+Kl14qXSiq3CiKeK1XJlLbQ7YZtq9A/A5KgcZzXLeP8AWja/YpLG+eTTrLVG1K7tnMkTzzBEVdiyKC5A3YIGOTz6dB8NbH4w+OruB73wPZx2brtGp3UpsA3cSMpDlwefuIBz14r3vQfgj4Y0+4W/19hrFyvMaSR7YE9/LJO4+5JHt3rllGdOW91ax3UKU6tm1azvc+ftN+Kd14txH4T0DV766jTLLDZSysvudgOOleg2OkfFGKwj1W68LZMaF1WV4ldRtzjbu3A+oK5Br3KXUbKyIs5JUgUHnHCqMcewrldW8YaTEbm2N+rPtwrK+Qw9R6fhXm1MNRhqlY+no4nES3d/kchZ/EjU/Davf6p4aU6ZAi7xa3JlliUcGQxlFzzn7pJ9jnNbWl/EnRb/AEW78UWF6t/4ehikkmScjzYkUDccnh0C5zuO7A53knHGDV7MWrPNOUMfLNweSAeRjB6D/vntXG6z4T8C61ezTzx3Fil4hju/sMzwwzvjh2RTtJBx1H1opYiMFaRrXpyk7pHomva5eX+h/N9luvD2ouqyx3EmZIY2YbBuB+ZWJCo33gcHJyK8V8UWGuat4mbRNGtmjg0+KPypYptizR4Yxyscbd2CUIIzlDgkVLb+CtHttPn0eXxldjTFkWa3ticxqepymdoOfQdcnFaurfELw0fEZna9treCW0bzlDjCbXTYWA5GMuBgd/UV3YarGdaMVqjwc5lUhgpyjpJW07lfXfA4l8HjVbrXHg1K3mgW4mjdwFhLqgbnGZEcpIDx9wqPvHPWfDbWLfQPGlxDfKFsNfAe1DNgb1GB+ZyvHfbXi3i7xauo6g0dleLdQcIZPNLJGAwYomfvZZclunOF4+Zu7vtVtdd+FVpr1ij29/o1x5SouMsvyjj8Spz1+UmvYqwc6Tp9z4WhKrCpGc2eifGzwfo7RL4jurEIuiz20xnhKbJN7LuhdWIGCNqhuSGOMc16MssOvW1rrWl3DJbXtvHPGqKCAGGce30r5j/aE+JWv+L7Lwd4OuL23+1WNjHqupeXKiRm5cAIH7h1ClivYS8dOPa/gzq1zP8ADrTLrzRIs73DqQhwB58gwOOQMcGiGHdOipv0R6CnafLvfU9wOllvuxXA/wA/SmjSLzP7tnAPYx5rySD4leOZEZn17lT/AM+dv6/9c6sWvxG8aSxM761yvpbQ+n+5Xl+yge99ZZ6ffeHDqlrJYanp0F5bToY5IZ0DK6nqCCpFYN78ObyzE9xoN9dacdrybJpPtFqrEHko5DBRxhUdBgVyX/CyPGbShf7XAHtbRf8AxNWdO+Ifi29jKXOpK6kYZfs8YDDoQflo9hBgsRrqP1C/0XV/Dmt+GfGV/or2F3C0KyQ3Szg5ztYowADAgNgkjgcnmuU+HPgz4Qx6vJdaHptuY7EsZdTvpBJObhsbVQkYUleflAO0AdDTdN+Enw3eabUH8KxM7OSUN3ceVzjP7vzNoHPQCrOsaTouhwaFYaJotlp9rJqliDBbReWhM00cbvgdWK8ZPPA9KlwnRVlLQ9TCvC13eMNV1Z7Atjb2sQaBtqYG3PcdqiDSyfL5nlM3IDHp+FeTaN8Q/E158YLjwncXSPp1jny49pBOAuNxB5+8f0r2G1ujcvMzxRqUyQVz6D3961g1NF16bovc5Hxm2meHfCGp61qSNJHbpuKqpLEEhRtAByxYjA9+tfM8k3xS8YXDL4Y8E3VlbsSvm3jLDhf7xTl+cf3a9j8ZfEzX9C8eWGkw21hc2dxIY5IbmJnVhuQDI3DpuJ+oFdZH8YfEUMGItL0hURflQQyBR07eZUeypzldrY5auKrUfdg7Hz7pnwO+Ll4HGteLLDTEbLf6PbPcEknJ6sv8q6fS/wBnFri2jTVfHnii8lBJIs7FIkI+m1yOp7179oPxD1jU4YJp7KwVpFJOyN8Z/FjXR2fiW/n2F4oBuXPCt7e9aezj00+SOJ4iq/ibfzPENE/Zt8GJKhm8P6jebT8zarNK6Nz3jY7f/Ha1Pih8FrGf4PeJvD+iWFpb+Vp8l3bWtjatlpYSJVREUDJYoFwBn5sV7jFdPMFZkTLdcCrS7ScGNDnjlf8APrWtOlZ3uc1Wo5aM/KzwbrT6crW0mg2t2VO8NPGpZeOduc4Ocdute5+H9Ht7Pwlc+I/Eu77O9pLc29spxgBC5kYe23oewryzTtMstL+Jt5pFrAn2a3v7iBFdQ3yKzADkf7IrtfjPql1pXw5WOy2xrql3DZ3GAR+6w0hAx0yyLn2yK9ZKMkkj5bGK2JUF1seEXV/dalPd386zNJeymRwGwDljjOBnaM4AyOtfanwenmsfhrodm0TN5MUqDB6Dzn4618pyRweHvD2k6hYW6G71JQ8k8hJZQCQFUZ244HUGvqfwDEsXgbQNpY79PhkOWP3mG4/qTWmNgqdGKO6hP2lV20SP/9k=",
                name: {
                    last: "Courter",
                    first: "Jeff"
                },
                isOwn: false,
                type: "Person",
                fullName: "Jeff Courter",
                id: "55ba006ed79a3a343900000b"
            },
            {
                _id: "55b9fa60d79a3a3439000005",
                __v: 0,
                dateBirth: null,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T10:55:35.621Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-07-30T10:20:16.095Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "52203e707d4dba8813000003"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "jasoncoutsbuzinga",
                jobPosition: "Projects Team Lead",
                website: "",
                address: {
                    country: "Australia",
                    zip: "",
                    state: "",
                    city: "Melbourne",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "55b92ad521e4b7c40f00061d",
                email: "jason@buzinga.com.au",
                imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACMAIwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD4e8WWunL4r0rVZtNWSKRYo5QzMDcTM5yTtIYkb+CDwQB6VT8RfDOfxNrt3LZXNvYw2dj9scsrP1UHHJzydxzn1r1fxJ8NYtbS2jv9XXFqxkjSG3BYEnJBII7nNW5/C0t3qeoahfasBPqe43IjskgQqedgji2oq8n5QAB244rzPrUedVH/AEj0HhZW5V5f8E+bIvCN1/ZtnqcrxJBeX509JSTtVxtO5hjgYb9DXU6J8KLZviC/gfxHfSQsbbz4pbUghzgNgbh6bu3avX7bwFpE1pDYTTyfZBJ5ogWFCiv/AHgpBG73681tzfD7w3I8V5fajczSrhRK7RhgPchc96cswhDdMqGAnN2ujz7VPgvoXgvTLnxFo9/qNxdwRtGschTBEgMbcBQfuu3euMXw3q+oaHdeKtItJ5rDRXtorqQMP3UkoYKSucnO05bGAcDvXuE3g/4d27ML6+tuh4nnjAP14Gao/wBjfBGziKTXegBuCf8ATI//AIquZ5nCT5owl9xtHLZpWc1958yQ+Hb2RM/2Zeuc8Yjb+grQXwpqLwxbdGuiSw3fIQcenNe3TeMfh1bsyDXNLYL/AM85Gkx7HBP8qzm+Jfw/TcIdTtHC5G5bSQ/zTmt44ipJq0WZPCU07SmY134A8JaXrmly6VZNqGnSc3iXC7jHz9ASMHtnla9u+F+p/A3w7p2san4v8Xz6SmkwqtlY29nNl9zk7kcKFAUbTt3Enn0xXjh+L/guFfMgvXkCnpHZEH/x7A/WsnxKdb+K3iHRvCHh+W4KXUazGF49uwsSVd/YIVbHofWqdWd71VZLqVTpQWlF80j065/a7sfBGgvoXgG3bUbqK7na2ubmJViEckxc7gDlsgk4GME96yfDf7bHi+z86315dQvlu7l5N4nh326uF/1e+J8hSGIU+uM4GK9f0H/gn54f1TwfHaRale/2zIm4XU6hE3Y4+UZwM/U14z4q/Zs1f4cas/h7W9DFxfEoYi/Ebgk5ZWBHykAc84OeOuOahmmExDcaUrtHq18HmWHSdTRWPTvD37WVx5UGm6v4Rj1iYLGktxbymEHI2+cwVGUKzem3B7Ywad44+M2teMbX+ztP8PWmnwtCURVuvNIOCA2cAZGTj357V8+wWUui2s0tpDbyyBmgnjKDZOBEZGQ8ZDgKQHGOevar3ii+1nSvDya/4YlkiZIre5l85EkcRy52qxx95TxnHII9K3dWo2kmc860pU3fW3Q63W/D/iPxLp0WlXUEEVvvUjY5UnHABJNVm+GfiFobCAND5NkJI4ssr/I6kMG9epHQ14pc/FT4gXMyI3iGeMHnEcaIfzAzVSDxx4zuriRJ/FWqEjpi6cYH4GtfZYiW8keW6tBK3Ie/aN8Idd8NtNqNtrMMHmKASuOBk8cHnqatf2Bq8pLN4yYEHHE2B/6FXzmt/wCJdQuZIpr/AFO7OejSPIf61aXQPEc6+Yui6i4PfyHP9KPq9V7zBYikl8B6foWj/EjVNUbTZ/iVe2T7SGIZ1+YEZUBSOea4b4jz/EnwXrD6RqvjTW7lJBvil+2yhZF9vmPT0r3vxV4WfUFHiPw1KDOnzsFP3sf1rjtY0/8A4TnTJ01tZJdQspAYSF4VP7u0Y5475PvjiualiNVK2nU0+ryhehJ3bbcZd129TwxtZ1i4g23OqXkoIwd87N/M1mRrcXEMqAO5Q7u5r7BS48CxWZfS4NIjcxkIVt0yjY43ADPB6g14T4c8fXvhXxbqlx4r0nzo9ZiaC7hgVYzgnhlXp0zxx1616qjFLQ89t3scXpWlarqFvHLaaZdzg8ZjhZuR9BW3J4R8VfZJJ/8AhGdUCRoXZmtHAAAyScj0r1D4H+M9G0TT9V0XWdUitYYrgT2zTsFLKwww6/7IP411Xjv4neEX8LalZabrcFxdXFu0KJESc7uD2x0JoVmrhJtOzPnTSPAfi3UtJuNbs9Emaxj3lpyyqo29epycVu+G/hB451jS11Cz06EW8pbEj3CLnBIPGc9jUFlqWoaZH9h0/wASTS2d9DuubaPeEQnkqysMZzjkZr0LQfjVb+H9Bt9Em0MloI9oKy5Dg5OSMDB59aE9Qa7GT8Hv2ZfFHxQ1zxJZyavaaZpvhW2N3qV//rlXIYoiYwCSEcnkYCseTgH66/Zs/Z8utP0SLxHreuR+H553VmuTaxyTTv12DzAQEXgHjluhGOeg/ZT8NeHdF/Z/06DRpcXfxL1G5luflVnSKKTa0e7+6EUKR1BlJ74r6h1f4TaJq+gWlhqGm2t1DaDfEki8RuBjcvcEeowa+SzLMJ1qkqKXup/kfeZVllGhShVfxNfi/wAi78P9G1zM2keILmz1GSLD2moW0XlCeM9mTcQGHHTAOeldB4h8J+HtTtRFrGkWl0QDtMsYJQn09D/9auM+H+or4Xu5Q97dTWNqhQyzyFyG46MTlu5JOOW6Vu+IfiRfagjx+GNHhvbqP/lhcEw+b3wC3AJ98da8N0aNa8qTtL8D1K0a9OaVRXifGX7Rn7NWjeHbS/17wkbmePY7vYM3zKWBDlGwT9wsMdcE4618n6z4nkh0m70e2sbeGzuli2RvIrvGsZIBcjpxu69gDxmv0F+LHxT0a98PyanJaSWdzZrJ9usZCPOhkQ4MZ7E5xgjgjBr8ufiV4mbUvEeoR2jslrc3LzRrjaQjnIU+nuOmRmvdyGWIrRdOvryvRnhZ8qGHcalLeS1RP4Sjjn8QWLTwWxiupUSY3UaN1P3V3AhenUjvxWzd+KdL8M/E+bUZNBSCxtg1q8cCKVkXHEijAHPymuHvZ57PUS8N3KTExKHecITnoBjHGKr3N7dXpU3dzJLtB272LY/OvqoppWPj6jTloep3vjDw7efEDTtd0S7zDcRIlwpQoYyCVOQePukc+1enDxF4fX5ZNXs1YdQZ1yP1r5cs2SC6SRs4HB+lEksm9tsmRng04tqTJaVkfUlrd39gzSafceXIRyCMq31Her1xptn4lhfUtJvV07XlQLPbxkL5uOjKCMMP1rPjifIx64rW1PwHrj6Z/aL24hlQCSAnO9GHQ4HT6Zrw5WWp8pwlmWZRq+wowdSnpddF5p9DxH4oaBfFB4jhO187LuNFKg5LYlUf3TtIJ9frXmD+U8gcy/MpBGexFfSY8Or4m8O3lpdSZv418m5h6EKOFPuCB1HGc8ZFfO3iPw/d+HdVl0+6Rhg5Rj/EvY16WFrxn7nU+4xeHqX9vKNk/wCtSBrrMhdrjLHrzTjPHjLP19TVJY2JyKcVLcda7LW2OBtt3LtrqK2zmQfNkYwaiE6M3Xvk1XEVbWjeFNT1SEXkWyKHfsVpM/Oe+0AHOKWxrTpTrS5YK7P0X/YP+FEWkeBdO8QXHN9qyPqhL8hI2IESj0BRN3/Aq+lbLWb/AMWQS2mnXynzHZESWT5ZgCVYKynbgEEEDoQQRXl/7KMt9pXgjTvDupwGLUdM0S1gaMjBKgKFcZ9sg+4I7V6LpGi6p4SEl7Bp9m9tNKDe2c0vlDIAAmibICuVUAODu5xtYAY+JcI4mtUc3rc/SMvpypUI+zWysaGoxWU/9n6DYWstp5ciLdwzLsY7jjI/vYPORnpVHxp8N7qaaLVU1JrW9sighucFj5QkEhjYdwSOfqSCO0Gka9r/AIm1GYx6dPb2Vi2Xmu5RvQAHPz4G/GCOVXGc5IrL8c/ELUvEeqaf8O9Dmt47zVA6JcTShBtjQtI6AkFyqqTtHtnAzXFUoOjUlGH3HbOrzKManQ+UP2kb3xjrZ8Y674S0G7u7Wzxda1dQqNkMUcQAQkkbvkTeQuSARnrXwVcrf3zNqkwLebNtZv8AaOeP0r7r/a5/aM0TQ9BuP2bvhPErXUym08Q6gr5EQZt0sCn+KRzgSHoqgpyWbZ8ea9pqaVp9nZQPn5tzH1YDn+dfaZRQnDDOclb8z8+z+tTliVCnK7W/ZPsjn7qOZ7lmXfyQcZ4yR0qIrIrEMeRxWhFbTTxiaIxorDhckZ96qMjGRgUAKnacdyK9Jxsrs8SM05WRGM569adgjvThEw4PX3qTy29z9BUFn0X4K+IyJd2/9sQW8NxcgtCw4BxjIAJyCM17do/iWDULcQTMro45BOa+JPEVwbzw9owE5S5t2kYMvUcLg/pXQeAfip4v0mb7FdxNqEESF8g4faOTz0PHrXk1MHKUXOJ7GBr4fBRVCEVGPkj6J8c+GbnRb2PxNoCgumcj+GRD95G+v+BHSvPfHvg7S/HujrqumZjmGflYfPDJjlGH9ehGCK6jw38YrjVZoNHuvBc8sV7E77o76F9qIpZnIJAUgAnBIJ4AySBWP42bxZ4e17/iSeHoYLO7LwpPdTHy5ym3LbQBjaWwOTnmsYwqwmktz2PbYevB9U9GrHzfdadcWFzLZ3KbZYWKMPcUtppt5ezC3s7eSaUn7saEn9K9ng8BaXd3s+r67YvfXMxDyFCyQq3oOen1Jz+ldXZ2Oi6fB5enadDbHGUWJNoyO5wBn+devGo2vM5qPDdScrzlaP42PKdD+DWsXSR3etXUVpESCYF+eVh1I44HHua+lPgL8OPCvinV/K1KGJbuyVGtYX+75aud+3tkZT3xnHfHKmOcWcJDZKbM/wC17fTmt/wlrE+h6nZ6zpMgiubZxNAzD5Qw6hgOoIJDDPIJFZ4ilLEUnCLsz6HD5VQwacaa3W7Pu6PRY/D1rYeI7DTDO1sv2a4SJR5rWrkFtmSMsGVGx1IDAAkgVpa98UvhY+ko/wDb2n7UUmSGc/v0OOhiPzhv9nGayvAnxE0Tx74Ng1jTJFQA+Vd25ILW0ygbkP0zweMgg96z9Vs11COSzt8fZpCS7beFXuB79a+KqRlTk4vRmtFzhbyOF8WfH3wpovh651GO1vDpVsDIlvBCQJ3z8u9uF5OMKTjOM84r8zvjp8avH3xC+J8/ibVbybSp9Ocx6bBaTlfsUXUbHXHzEEEsMZ47AAfaX7TWrJrZfw1Z7YrDS4RPLtbCtIBiNDj3xx6la+RvFPwttPE0EurWd+bfUYlCMkg/dyBVGAe6H35+le7klKmk6slrseTnGGxGIhy0Xtra+55n4Y0y7vLoancF/KR9xkJzuYnvW34jliCsZomckfumBwEPHPv9K6fRNAu7HT1s7pIUIXBVSSM9+1GpeGLe/h8ozbBtxnaCf519T7ahGnyqWrPhnh66q3lE43S7SWbTvPUArCgL84IyT2rOCDzJdwOTI3Wu8tfCtlZ2/kG9uyuACqtjI98Cr9p4J0yX/VaPdSFsnfhsDPc1y1MZDlSLpYGpCTb6m18CvBsem+MNF8S+N/D9sfDstzFtutQVHsywYHEgY7SvK7g3GDzxWz4z+Bnir4g+MNb1z4TeADqXh1L6S3guLAolszKcnygWxswwxjjHSt+41ye8+FVj4AbRYRPa3hn+0sfl2FVB2x4+VjgAnPOBXXfDf4veJfh94Vt/DEGh6bqEVuxKTXVtK0mCBwSrAdvTvWH1ul3NlhqvVHy9qFu0ng2y8sBnS6UEAesZ/wDia9Q/Y6sY4/jZpiarp4e0ureeGQTwZRsgEA7hj+Gtm0+H3iqVf3OiTRqvGGIA/LIrc0z4beLraeK8jf8As+WE7hNBdmGRD7MpyPwNedPH01BwfXzPS+oTm1JbpH2h8a4vA3gn4ZanqaWOn2ssts1nbiG0RHkkkUhUXAyfU+gBJ4Br4glkudVvptRvMTSzHJU9Meg9gO3/ANervi7xD4l1e/j0fXfE95q0WlkLGZ7x50EjKCSNxPIBA/OmadGEKuRnryBzXZhaUVHn7n0uS4H2UXKpuwERsYY763Ba2LASg5+Uf3h6YzyPT6VeWWN3a3CAEjJ7ZFPRVjS4tnG+OVDIF45x1/ME1TjheG7faS6xRhQSeozx+mK6fgPpEraElui3FrEoBBAXIoaLYs9ssLZnw0MgYqIZM/NnHJBG7uOST6VbsYyoZOOJCB9A2P6U+eLbE8ijPlvkgD8afMhTpKUfeOw+AvjyTwh4zg0rUP3Wl6wVtJmJ2okhYeWznOBtORk4ADtya+1fHFta+G/DFzq97qEFtBbxB5ZH+6i+vHJ7AAcknAyTX5/aXPpMlzLLdm48uSE5S3UFhIB8hIPG3pkjnB/L1r46fEW88aad4f8AD8V6W0+w0u1vbyON8rNdSorYPqUXGPd2yOBjxsfgo4nERceu/wAjnWHl8KPHPip4sfxJq09ppi77R5TLnA3TdcM5BP4KOAMZzncPN457hbw29z5kAYsJEK8AYHGPTjrXePZ73nu0i5bgE+nf+grG8TWR+3282A3mRlAfoc4/Wu+MI0IKFNaIbwrvzMwDZtJccx7lfHzkcMD7dM5rSj/sPSQWu9IN0ApYlEBfIGeAetaenacAdrjeUXkdQCe34f1qe909XaKUqARuUj0NKcFUjaRFXL6dem1Ja9+qOGu/jL4XgXytM8N3OUOSzbFB9jhif0rCu/jbfkMLHQ7KDJ4Z5mfA+gA/nWD4p8E39rrVx/Z0G61lbzI/mACg9uTWHf8AhfU9Pga5ntZXjAy3lDft+uOamOHop2/M/P8AEKvRqOnPdHST/FvxXdKUivLK1XHPl2pOP++mOfyrIk8ZeK5mMjeKbpSeypGB/wCg1meH7FdVvvsNtE65Qv5jrwcdq6aTwXOGxGYJFHGXypHtgZrflpU3ZI5lJz1bOj/4aJ+K97FLd6fpOlW4kOQW80v16KGkwB34ArMn+LPxr1F1Z/ElrZZ4xHbRsx59drH9a5rTrq7v7hLIWbxGRwgeS3kCoScAHjPJ9K7rw74bij1K3vZy19HE4CrbJlWyPvZYjv2NYOhh6T+FHXSnXxDUXN2Oq0We5kWKPV5JJbi4jDXE0o2s0p6v07nvXRQ3U0AWN0y0Y+btu/2lP8wf5EVoSaSysq3lkyFxu2yIVJHTIz1HuKsjRIXiAikbKgY3HPHpnr+Nd0eWUbxeh95h6MqcLIgju48x45V84XoVzwQf1qeOINE74xviQ9fQEf0rBuLe6srtPmUxxncV6kD8+RwP++R7Vt6LcpeWGA67k3Lx3UnIocXZHTTqNyafYswHByc8bSPoRn+eacCC7kfdZQfxBOf6VAzeUyMMkZ8pvbuP5n9KmO5HQheoKms9mdMXdala3jigvnikH7uU7o2BI2+q59Op/GtCdI4NNeM5feQMg/MTmqjhWRXIKkfoavXNtNaxQrcxbDPGJYzuDZUjg8ZPT1prlTuStNEZ0sjJGUjiDu2Pl/uiq1whMGHbLDkn0Na2mfZlnmWeMHKd+1XJotKJyltDgDuoXB/KnyJlbqyOf01Io433HG456ewH9KL4xQAFmBAy2fU1oTRQ7yAvBToo6GsPXnjiRZ5re6kjiyP3FvJKwJ55CAkcDqcAeucVlJxiryZNSXs4X7HJa6qxObrOX64UYwPfP3awft0dy6wpd20kknyqgmEjZPbAJ5rs9XttFurFYCGjuJYxdRxXS+WXXGc4PB4z6kda4Ke3jsPF+hS2SxJHPMyzAqcN93BX0PP61yTgpO6Z8XnUlGvGcNU+tzWHg65iMmpGIQyJGx3RRjJ4JI5IrEAvgiusrLvG7bKAXXnoSrYz+demXQLW5QMOQwwR9R/KuUGiiUmW0sLmaF8MrLCz8EDuAaypTaep5FWmuW9jgvBLypqEcp6xzxSE5znadx569cGvdPCXg661j4hQwIW+yM32jYPunknBHY7iT75rwzw1eD7fJ5ypG32STaAgUHah2njqfevsr4IWUVzrUl68YLfKu7HTjP8AWubOqroU5S7o78iorE1YxfR3PpLwz8NtC1XQYtK1nSba6t9o+SRAcHHUHqD7jmuW8a/skD7DLqfgHVgkgDMNPvWyp46JL1HoA2fdhXtHg+0LwKSoAwDXRaneRWNsxd1QAetfLZfjcRhHzU5adj7avLlklDRn5b/FLS9d8IXcml69o9xY36vtRZV43Z5KsDhhgHkEg81k6NftYXFsob5JUWNsngkV6p+2R4vh1zx5pmhW8vmDT4muJQpz8zkBR9cK35ivKtH0LWfEEEEOk6ReXMrn5PLhLZwSDz098mvv8NivaYaNataNzzlVlOtJrodenl3MTRH5fM7jsexptrM8oKTYEkRKsB6jvXVaT8F/iZNYJcvoixsMHY0yg/zx+tZ/iDwL4v8AD7rfX/h28hXG2crHvUjs25cjj61n/aGFqT5YVE36nqQlJrVGJL8ispOAx7mpJpvLt4+rfeJxzyT9aimBeNT2B4qaSWFLb94SWLDgfSuyOsQursTTLxZXZRHtbbjnj86uYJfaU4zye1ZUJUztcISu4YGR1/OrAvFQfeOB39fpWnQlVHHc9G+Efwp1X4ra1JaWjRxWlmA9xIzYJGfuj3/wr6T0T4GLozrpkP2aOPcVUbDyQM84IH4Vw37GF5aJpPiC7juEMv2hUmHQoVTIU/UMD+Ne7+G/Etr4p0q08Q210uye+2oA4bGJfLZcjjIOfyr4TNnLE4iSk3ZOyVweIqRvy2tY+cf2gP2ctXvtGPjbw/NYnWfDV0t55bKT56IfnTOAeQOnQ4Havk/46fDxvBfxD0e6s0f+zbm53R/9M2LLlfpxkf8A1q/TXx9fWRt77RC/mz6jIyPFyR5CopkJxyo5xn+8yjvXxj8ZvCxuPD0GnXrvItvOJtPuSu4qY2yI2P8Au8A+nB98sPiJ4OtBXvHVP5/5M87E4SGYYecbWno16r/M8cspxHqti5Y/6+MMGxgguOtffeq674Y0G5Wy1DWNMsXKB1jluEiJXJG4AkcZB/KvzwmvSl1BNJEPkdTjrjB61z3x0+Jd58W/iTqfi4SPHZEi106JwMx2seQnHYtkuR/ec19Xl9SFW/L0Pic0wtXD8vP1PN4rYKylsnHcjFfbvwPuL23hjOmW8VxPK3DuSIx23HHJ6dOPrXxt9lUkKsgAB44z/hX2j8OI5tF0G2srUYuI1Advzx+hFebxFadKMT1uGPcqzkuiPbbzxR4v0yJVtvFMyTsAVSGONUU+mNuT+OaxL7xb8T9bf+yo9dF1O4w2y0UeWM9WcADPPQA++K1fD9jAwM8w3yHGCwyeldfotra2fmuIEDsQdwr5CFNxZ9hOumnoeQ+H/wBmfRRqlx4t8TXE+raldymWSS5AIDegXGBgDA4yAOte5eA/CXh7wRpV1q95ZQfabpNyFlBaNMEgc85xjPv9BV3TpRJZxIyrsiZ8kD72ST/WvPv2hvjx4V+F/hQ2dvDDqviG+Hk6dpvmgNJJjl24JWNRyzY4HHUgH1KdOriZKLbk9kefOsqcdNPQ7vRLlNbb/QYmlaX5lVCFKoeh/wD11uQfDgXJ3atcvGXJ2CMr8p9CcV8kfsx/tTvo3iLT/A/xW082l5qs0drYa1aKBYyFmOIpMnMTZKqM5BxnIr7kEsjwX1m0u75RLbMvUAjke5BB/MU62XujPlrrU0WKla9J2790eZ+LfgR4T8YeF9U0N9KtINYClra/WFRKGHKMSBkjsR3Ga+I/EehL4f1I6Nc293Fe2Z8q9judvE4+9s29U6bSeSDX6G+JNcFitl4jt5hbGLy47mKU48xXCnA59xz9eK+fv2n/AADouvw2XxF0aR4Hd/s12VtzuyeAWBwOCCM5zz3xx6eV4r6pU9jJ+6/w7GlOpKT55dT5VvLiCLIlA2r7Vky3nnYisrc5J4dh0HqK6bXfDcuhGGe5lEttdoZIZCu0soOCSD7+mR79a47UfE9pakxadA93IvGY1G0H/ePFfWRalrEKlWPLzSlZH1N+xldJDZ+M9NeJWMdvBOuB/EwkUk/98rXUWHjzw5oXweSw8KaxDpOpaxrd2dHijkQzfPeu/nLG2RnZulwykDPI7V8sfBf45678Kr3xFrEEqw3uqaTdWFpaX+lyy2c1wATEfNRwcq6kNkYwTyK8s8A+GIfA/jTSfGE2qzvJHLsuWlCsu6QY3ZGCPnIzk9CeeM189Xy51q1StF2S8t9DinmCkkqMbrq77fI/SjwjaXEdlPfarfz6jql6PMvNRuUjE84A4U+WiqFUdFVQOp5JJPB+P9HjvvCcUUyAui7Qe/B4b61q+D/F4v8AS4pXuWbaAChbFYfjLXYpbAoJxmKYphf4iGwR7/8A1q8CtTbsjpoy63PjrxtbC31aa2ij2n5sqB0b+IY+ua8r8iGT5zIefRSK9m+J95BB4yvWnh8pJQJEO0jJPDD19K8sMc6fLuGO3zV9JlKlBNtaaHzGfTjUcUnqr/oXV8I6rdjz7K1UIhDFnB5r6p+Hfizw7rWg2mp6VdI0yRBby3zl4plGGz6j09eteG+SrRxElvnYKcHseteX3XiPW/h/4j1G78N37xGYMHSQB0OAMcEdRnr1rbH4NYyCTdmjhyzH/UZu6umfojoni2KQoiOixkfeyOa6O38ZaPE4+1aip6g4YY/Gvzr1X4g+NJdGNw3iK7Di380eWwjw23P8OK8vl+Ivjq6EguPFmqMCCpH2lxkehwa8bDZT9Yu1LY97GZksNbmV+bU/Rr4p/tbeHfCcEuheDymta6ylILW2O5EY8B5W+6iZ7nk9s183/abzxHqFz4p8RX0mraxeHbc3Mi4aMA58pF6IgPRR16nJ5r1PW/hh4K079iD4I/ELS9Et7LX9Tur+HUL23iRJb7fPKQ07AbpSnlKqbiQqkjHTHi8UjxiK7iYpI0nlNt6MOcE+/FfS4PAU8LC8dX3FgMV9aXtZryt2NWbT4NQt5LPHmxSLsZBkMB7Y5BHWu0+HfjT9ojTPE+m22lfG7xDMk0kVgBqNul2I7ctzgSZHmDP38ZPGc4GOR0eb+0pSt1GjFejgYb8xXqXwo0aI+L9JmN5dttuQdjSbl4BPcZ61rWpwqq04pnq1KcHB1NdEei6/8UfEGjaZqVnqrR6k2pStbacsrIEt4kIB3jhiAWyM9SMZwOPT/DOrRfEH4VXWi6dI93qsmmOy2RjWR4pUBCfeB3rlQQV+npXmOjabD48+J2meDNcdxZyX8ivNEF+0MJCgYF2DZHGQCOCT6mvtnw78E/hv4btrC90vQWS805PIguTcy7wpJznDAZOT2ryK2BppN01Z7nh1MwqUZxu7rY/Pj4v+FLy60Kyvr1biXD+VKRuZuVOVPfg4GO3SvGZPCXiB7Z57Tw7qcsCKXdoLGVgqAcksFwABkk1+uVj4Y0ew8TSaraW3lX0UzEXKYDnKZOcDB/Edvc57+wKeJfDk9vqsSPHdQy20yqMb0OVIP1Fenhaqa5UcdbNpUKfLyXv1ufhXqXwm+IUyWNvLoF+sduqPKFtp0aaAOzKzjBAIdACD2bI9a3p/Avju7spkh0QHMRUJO6wocjo5kIJH0Fftt4XsLe2FyqJuMcvlKzAZCKMgZ9i7H8TSeKPA3gzxfEkXivwppGsJGDsF/ZRz7P8Ad3qcfhWlSNVw/dNL1OHDZnHDJwcd+tz8bfhzpPxU8L2yWPifxRotyu3bE8c8s0sYHTcoQLIf+BD6muuk1a605VtXF/esORK0IhAPcjJINfYH7S3wP+H3w78HR+K/BWmy6TNLfRwPawyZt237iW2sCQfQBgMdq+ZZdOjeVITNIBOcMQFyPpxXwWZYqvh67pztfyPtcqp0a+HVWF/meX6noGh6xqj6prOltcTuMAT3LuB3wBEQPz6k1ah8K6UsaiLw3pBTHHmWqs2PctzVtYUs/iT/AMI2hLWF1avNJGTj51HUbcYznkdK7W30rS0gjC6ba8rknyhyTWNepiKaSVR/ia0Y4apebpr7kf/Z",
                name: {
                    last: "Coutsodimitropoulos",
                    first: "Jason"
                },
                isOwn: false,
                type: "Person",
                fullName: "Jason Coutsodimitropoulos",
                id: "55b9fa60d79a3a3439000005"
            },
            {
                _id: "55ba0301d79a3a343900000d",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T10:57:05.119Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                createdBy: {
                    date: "2015-07-30T10:57:05.119Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "hashplay.net",
                address: {
                    country: "United States",
                    zip: "94107",
                    state: "California",
                    city: "San Francisco",
                    street: "350 Townsend St. 755"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "contact@hashplay.tv",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "#Play"
                },
                isOwn: false,
                type: "Company",
                fullName: "#Play ",
                id: "55ba0301d79a3a343900000d"
            },
            {
                _id: "55ba0362d79a3a343900000e",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T10:58:42.513Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                createdBy: {
                    date: "2015-07-30T10:58:42.513Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "inadler",
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
                company: "55ba0301d79a3a343900000d",
                email: "in@hashplay.tv",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Nadler",
                    first: "Ingo"
                },
                isOwn: false,
                type: "Person",
                fullName: "Ingo Nadler",
                id: "55ba0362d79a3a343900000e"
            },
            {
                _id: "55ba03f8d79a3a343900000f",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T11:01:52.982Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2015-07-30T11:01:12.559Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "+64 21 468 300"
                },
                skype: "",
                jobPosition: "",
                website: "www.globalworkshop.com",
                address: {
                    country: "New Zealand",
                    zip: "PO Box 106910",
                    state: "",
                    city: "Auckland",
                    street: "Suite 6767"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "info@globalworkshop.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "GlobalWorkshop"
                },
                isOwn: false,
                type: "Company",
                fullName: "GlobalWorkshop ",
                id: "55ba03f8d79a3a343900000f"
            },
            {
                _id: "55ba0479d79a3a3439000010",
                __v: 0,
                dateBirth: null,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T11:04:04.401Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-07-30T11:03:21.124Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "President",
                website: "",
                address: {
                    country: "Ohio",
                    zip: "",
                    state: "USA",
                    city: "Canton",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "55b92ad621e4b7c40f00062e",
                email: "",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "Lupsor",
                    first: "Drew"
                },
                isOwn: false,
                type: "Person",
                fullName: "Drew Lupsor",
                id: "55ba0479d79a3a3439000010"
            },
            {
                _id: "55ba04d5d79a3a3439000011",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T11:04:53.095Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2015-07-30T11:04:53.095Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "rowanthenerd",
                jobPosition: "Online Technology and Leadership",
                website: "",
                address: {
                    country: "New Zealand",
                    zip: "",
                    state: "",
                    city: "Auckland",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "55ba03f8d79a3a343900000f",
                email: "rowan@globalworkshop.ws",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "Hick",
                    first: "Rowan"
                },
                isOwn: false,
                type: "Person",
                fullName: "Rowan Hick",
                id: "55ba04d5d79a3a3439000011"
            },
            {
                _id: "55b9fe20d79a3a3439000009",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T11:05:23.066Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2015-07-30T10:36:16.539Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "+1300 304 292"
                },
                skype: "",
                jobPosition: "",
                website: "www.kogan.com",
                address: {
                    country: "Australia",
                    zip: "",
                    state: "",
                    city: "Melbourne",
                    street: "136 Buckhurst St"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "info@kogan.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "Kogan"
                },
                isOwn: false,
                type: "Company",
                fullName: "Kogan ",
                id: "55b9fe20d79a3a3439000009"
            },
            {
                _id: "55b92ad621e4b7c40f00062e",
                ID: 3,
                __v: 0,
                companyInfo: {
                    size: "200-500",
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T11:12:36.811Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.007Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "(561)841-1832"
                },
                skype: "",
                jobPosition: "",
                website: "http://www.web1syndication.com",
                address: {
                    country: "USA",
                    zip: "33403",
                    state: "Florida",
                    city: "Lake Park",
                    street: "1351 S Killian Drive Suite 2"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "customerservice@web1syndication.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "Web1 Syndication, Inc"
                },
                isOwn: false,
                type: "Company",
                fullName: "Web1 Syndication, Inc ",
                id: "55b92ad621e4b7c40f00062e"
            },
            {
                _id: "55ba0701d79a3a3439000012",
                __v: 0,
                dateBirth: null,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T11:14:37.227Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2015-07-30T11:14:09.010Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "Director General",
                website: "",
                address: {
                    country: "Spain",
                    zip: "",
                    state: "",
                    city: "Madrid",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "55b92ad621e4b7c40f000629",
                email: "francisco.calvo.vicente@gmail.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "Vicente",
                    first: "Francisco Calvo"
                },
                isOwn: false,
                type: "Person",
                fullName: "Francisco Calvo Vicente",
                id: "55ba0701d79a3a3439000012"
            },
            {
                _id: "55ba0b46d79a3a3439000013",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T11:32:22.523Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-07-30T11:32:22.523Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "0808 1686635"
                },
                skype: "",
                jobPosition: "",
                website: "www.unibet.co.uk",
                address: {
                    country: "United Kingdom",
                    zip: "",
                    state: "Wimbledon",
                    city: "London",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "info-uk@unibetsupport.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "Unibet"
                },
                isOwn: false,
                type: "Company",
                fullName: "Unibet ",
                id: "55ba0b46d79a3a3439000013"
            },
            {
                _id: "55ba0df2d79a3a3439000015",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-07-30T11:43:46.247Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-07-30T11:43:46.246Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55b9fbcdd79a3a3439000007"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "+44 7452 388 781",
                    phone: "+447720498374"
                },
                skype: "erez.leket",
                jobPosition: "Mobile product owner",
                website: "",
                address: {
                    country: "UK",
                    zip: "",
                    state: "",
                    city: "London",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "55ba0b46d79a3a3439000013",
                email: "dr.loop@gmail.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "Leket",
                    first: "Erez"
                },
                isOwn: false,
                type: "Person",
                fullName: "Erez Leket",
                id: "55ba0df2d79a3a3439000015"
            },
            {
                _id: "55cdc93c9b42266a4f000005",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-08-14T10:55:56.414Z",
                    user: "55b9dd237a3632120b000005"
                },
                createdBy: {
                    date: "2015-08-14T10:55:56.414Z",
                    user: "55b9dd237a3632120b000005"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "www.agilefind.com/",
                address: {
                    country: "United Kingdom",
                    zip: "",
                    state: "",
                    city: "London",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "AgileFind"
                },
                isOwn: false,
                type: "Company",
                fullName: "AgileFind ",
                id: "55cdc93c9b42266a4f000005"
            },
            {
                _id: "55cf5c194a91e37b0b00012b",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-08-15T15:34:49.214Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-08-15T15:34:49.214Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "Global Workshop Solutions"
                },
                isOwn: false,
                type: "Company",
                fullName: "Global Workshop Solutions ",
                id: "55cf5c194a91e37b0b00012b"
            },
            {
                _id: "55d37aee226ed3280b000005",
                dateBirth: "1969-04-09T00:00:00.000Z",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-08-18T18:35:26.681Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-08-18T18:35:26.681Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "https://www.linkedin.com/profile/view?id=16975741&",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "+353863179000",
                    phone: "0567771774"
                },
                skype: "imorrisseys",
                jobPosition: "Founder",
                website: "",
                address: {
                    country: "Ireland",
                    zip: "",
                    state: "",
                    city: "Kilkenny",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "55cf362b4a91e37b0b0000c1",
                email: "brendan@mobstar.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "Morrisey",
                    first: "Brendan"
                },
                isOwn: false,
                type: "Person",
                fullName: "Brendan Morrisey",
                id: "55d37aee226ed3280b000005"
            },
            {
                _id: "55cf362b4a91e37b0b0000c1",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-08-18T18:39:28.800Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-08-15T12:52:59.265Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "https://www.linkedin.com/company/9225271?trk=tyah&",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "0863179000"
                },
                skype: "",
                jobPosition: "",
                website: "http://www.mobstar.com/contact",
                address: {
                    country: "Ireland",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "MobStar"
                },
                isOwn: false,
                type: "Company",
                fullName: "MobStar ",
                id: "55cf362b4a91e37b0b0000c1"
            },
            {
                _id: "55d37d50226ed3280b000006",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-08-18T18:45:36.728Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-08-18T18:45:36.728Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "https://uk.linkedin.com/in/mattfulford8",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "+447772777663"
                },
                skype: "matt.fulford",
                jobPosition: "Platform & Product at MobStar",
                website: "",
                address: {
                    country: "United Kingdom",
                    zip: "",
                    state: "",
                    city: "Ely",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "55cf362b4a91e37b0b0000c1",
                email: "matt@mobstar.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "Fulford",
                    first: "Matt"
                },
                isOwn: false,
                type: "Person",
                fullName: "Matt Fulford",
                id: "55d37d50226ed3280b000006"
            },
            {
                _id: "55cf4f834a91e37b0b000102",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-08-18T19:13:00.284Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-08-15T14:41:07.792Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "902-489-0901"
                },
                skype: "",
                jobPosition: "",
                website: "http://www.sharperbuilds.com/",
                address: {
                    country: "Canada",
                    zip: "B3B 1T4",
                    state: "NS",
                    city: "Dartmouth",
                    street: "61 Raddall Avenue"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "SharperBuilds"
                },
                isOwn: false,
                type: "Company",
                fullName: "SharperBuilds ",
                id: "55cf4f834a91e37b0b000102"
            },
            {
                _id: "55d38523226ed3280b000007",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-08-18T19:18:59.098Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                createdBy: {
                    date: "2015-08-18T19:18:59.098Z",
                    user: "55b9dd7a7a3632120b000006"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "https://ca.linkedin.com/in/peterghickey",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "+19024890901",
                    phone: "+19028008510"
                },
                skype: "peterghickey",
                jobPosition: "Co-founder",
                website: "",
                address: {
                    country: "Canada",
                    zip: "",
                    state: "Nova Scotia",
                    city: "Halifax",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "55cf4f834a91e37b0b000102",
                email: "peter@sharperbuilds.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "Hickey",
                    first: "Peter"
                },
                isOwn: false,
                type: "Person",
                fullName: "Peter Hickey",
                id: "55d38523226ed3280b000007"
            },
            {
                _id: "55deb987ae2b22730b000018",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-08-27T07:17:27.633Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                createdBy: {
                    date: "2015-08-27T07:17:27.633Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Australia",
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
                    last: "",
                    first: "Yello"
                },
                isOwn: false,
                type: "Company",
                fullName: "Yello ",
                id: "55deb987ae2b22730b000018"
            },
            {
                _id: "55edaf167221afe30b000040",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-09-07T15:36:54.660Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-09-07T15:36:54.660Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "BetterIt"
                },
                isOwn: false,
                type: "Company",
                fullName: "BetterIt ",
                id: "55edaf167221afe30b000040"
            },
            {
                _id: "55f55854b81672730c000010",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-09-13T11:04:52.025Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                createdBy: {
                    date: "2015-09-13T11:04:52.024Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "MediaHeads"
                },
                isOwn: false,
                type: "Company",
                fullName: "MediaHeads ",
                id: "55f55854b81672730c000010"
            },
            {
                _id: "55f56406b81672730c00002e",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-09-13T11:54:46.756Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-09-13T11:54:46.756Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "App Institute"
                },
                isOwn: false,
                type: "Company",
                fullName: "App Institute ",
                id: "55f56406b81672730c00002e"
            },
            {
                _id: "55fe60f5e2a48c310c000005",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-09-20T07:32:05.655Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-09-20T07:32:05.655Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: true,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "test supplier"
                },
                isOwn: false,
                type: "Company",
                fullName: "test supplier ",
                id: "55fe60f5e2a48c310c000005"
            },
            {
                _id: "56030d81fa3f91444e00000c",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-09-23T20:37:21.524Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                createdBy: {
                    date: "2015-09-23T20:37:21.524Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "Peter F"
                },
                isOwn: false,
                type: "Company",
                fullName: "Peter F ",
                id: "56030d81fa3f91444e00000c"
            },
            {
                _id: "5604170eb904af832d000005",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-09-24T15:30:22.135Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-09-24T15:30:22.135Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Italy",
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
                    last: "",
                    first: "Stentle"
                },
                isOwn: false,
                type: "Company",
                fullName: "Stentle ",
                id: "5604170eb904af832d000005"
            },
            {
                _id: "561d1bc0b51032d674856acb",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-10-13T14:57:04.810Z",
                    user: "55b9dd237a3632120b000005"
                },
                createdBy: {
                    date: "2015-10-13T14:57:04.810Z",
                    user: "55b9dd237a3632120b000005"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "Attrecto"
                },
                isOwn: false,
                type: "Company",
                fullName: "Attrecto ",
                id: "561d1bc0b51032d674856acb"
            },
            {
                _id: "562bba2062461bfd59ef58c0",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-10-24T17:04:32.542Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-10-24T17:04:32.542Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
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
                    city: "Koln",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Unknown",
                    first: "Mark"
                },
                isOwn: false,
                type: "Person",
                fullName: "Mark Unknown",
                id: "562bba2062461bfd59ef58c0"
            },
            {
                _id: "562bc2db62461bfd59ef58c7",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-10-24T17:41:47.172Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-10-24T17:41:47.172Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "www.appmedia.no",
                address: {
                    country: "Norway",
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
                    last: "",
                    first: "AppMedia"
                },
                isOwn: false,
                type: "Company",
                fullName: "AppMedia ",
                id: "562bc2db62461bfd59ef58c7"
            },
            {
                _id: "562bed4062461bfd59ef58d1",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-10-24T20:42:40.705Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-10-24T20:42:40.705Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
                    zip: "",
                    state: "California",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "TreatMe"
                },
                isOwn: false,
                type: "Company",
                fullName: "TreatMe ",
                id: "562bed4062461bfd59ef58d1"
            },
            {
                _id: "562ff202547f50b51d6de2b8",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-10-27T21:52:02.201Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-10-27T21:52:02.201Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Norway",
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
                    last: "",
                    first: "Appsmakerstore"
                },
                isOwn: false,
                type: "Company",
                fullName: "Appsmakerstore ",
                id: "562ff202547f50b51d6de2b8"
            },
            {
                _id: "5637627bc928c61d052d500e",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-11-02T13:17:47.184Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                createdBy: {
                    date: "2015-11-02T13:17:47.184Z",
                    user: "56239e0ce9576d1728a9ed1d"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "+36 70 639 3565",
                    phone: ""
                },
                skype: "",
                jobPosition: "Bid manager",
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
                company: "561d1bc0b51032d674856acb",
                email: "tibor.bekefi@attrecto.com",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Bekefi",
                    first: "Tibor"
                },
                isOwn: false,
                type: "Person",
                fullName: "Tibor Bekefi",
                id: "5637627bc928c61d052d500e"
            },
            {
                _id: "5637a8e2bf9592df04c55115",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-11-02T18:18:10.860Z",
                    user: "55cb7302fea413b50b000007"
                },
                createdBy: {
                    date: "2015-11-02T18:18:10.860Z",
                    user: "55cb7302fea413b50b000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    city: "Amsterdam",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "Colestreet"
                },
                isOwn: false,
                type: "Company",
                fullName: "Colestreet ",
                id: "5637a8e2bf9592df04c55115"
            },
            {
                _id: "56574032bfd103f108eb4ad2",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-11-26T17:24:02.424Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-11-26T17:24:02.424Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "Marand"
                },
                isOwn: false,
                type: "Company",
                fullName: "Marand ",
                id: "56574032bfd103f108eb4ad2"
            },
            {
                _id: "56574092bfd103f108eb4ad3",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-11-26T17:25:38.091Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-11-26T17:25:38.091Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
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
                company: "56574032bfd103f108eb4ad2",
                email: "Ales.Smokvina@marand.si",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Smokvina",
                    first: "Ales"
                },
                isOwn: false,
                type: "Person",
                fullName: "Ales Smokvina",
                id: "56574092bfd103f108eb4ad3"
            },
            {
                _id: "5661805cbb8be7814fb52529",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-12-04T12:00:28.657Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-12-04T12:00:28.657Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "Otrema"
                },
                isOwn: false,
                type: "Company",
                fullName: "Otrema ",
                id: "5661805cbb8be7814fb52529"
            },
            {
                _id: "5661809cbb8be7814fb52584",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-12-04T12:01:32.170Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-12-04T12:01:32.170Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
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
                company: "5661805cbb8be7814fb52529",
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Yilmaz",
                    first: "Selim"
                },
                isOwn: false,
                type: "Person",
                fullName: "Selim Yilmaz",
                id: "5661809cbb8be7814fb52584"
            },
            {
                _id: "56685d4fa3fc012a68f0d853",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-12-09T16:56:47.834Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-12-09T16:56:47.834Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Germany",
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
                    last: "Burer",
                    first: "Nicolas"
                },
                isOwn: false,
                type: "Person",
                fullName: "Nicolas Burer",
                id: "56685d4fa3fc012a68f0d853"
            },
            {
                _id: "566d4b35abccac87642cb521",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-12-13T10:40:53.920Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-12-13T10:40:53.920Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "Scatch"
                },
                isOwn: false,
                type: "Company",
                fullName: "Scatch ",
                id: "566d4b35abccac87642cb521"
            },
            {
                _id: "566d4b55abccac87642cb522",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2015-12-13T10:41:25.812Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-12-13T10:41:25.812Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "Owner",
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
                    last: "Sans",
                    first: "Olivier"
                },
                isOwn: false,
                type: "Person",
                fullName: "Olivier Sans",
                id: "566d4b55abccac87642cb522"
            },
            {
                _id: "569f57be62d172544baf0c3a",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-20T09:47:42.154Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                createdBy: {
                    date: "2016-01-20T09:47:42.154Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "www.etecture.de",
                address: {
                    country: "Germany",
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
                    last: "",
                    first: "ETECTURE GmbH"
                },
                isOwn: false,
                type: "Company",
                fullName: "ETECTURE GmbH ",
                id: "569f57be62d172544baf0c3a"
            },
            {
                _id: "569f581762d172544baf0c3b",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-20T09:49:11.738Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                createdBy: {
                    date: "2016-01-20T09:49:11.738Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Germany",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "569f57be62d172544baf0c3a",
                email: "Dirk.Ziegener@etecture.de",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Ziegener",
                    first: "Dirk"
                },
                isOwn: false,
                type: "Person",
                fullName: "Dirk Ziegener",
                id: "569f581762d172544baf0c3b"
            },
            {
                _id: "569f590262d172544baf0c3e",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-20T09:53:06.796Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                createdBy: {
                    date: "2016-01-20T09:53:06.796Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "www.time2view.se/",
                address: {
                    country: "Sweden",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "info@time2view.se",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "Time2view"
                },
                isOwn: false,
                type: "Company",
                fullName: "Time2view ",
                id: "569f590262d172544baf0c3e"
            },
            {
                _id: "569f599062d172544baf0c3f",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-20T09:55:28.186Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                createdBy: {
                    date: "2016-01-20T09:55:28.186Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "https://www.linkedin.com/profile/view?id=AB4AAAMCXMABDvO-uG_5886_lPCRPEbcqicbRNg&authType=name&authToken=Si9d&trk=wonton-desktop",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "time2view.se",
                jobPosition: "CEO",
                website: "",
                address: {
                    country: "Sweden",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "569f590262d172544baf0c3e",
                email: "gn.nevo@gmail.com",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Nevo",
                    first: "Gilad"
                },
                isOwn: false,
                type: "Person",
                fullName: "Gilad Nevo",
                id: "569f599062d172544baf0c3f"
            },
            {
                _id: "569f5fbf62d172544baf0d56",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-20T10:21:51.374Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                createdBy: {
                    date: "2016-01-20T10:21:51.374Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "https://www.biscience.com/",
                address: {
                    country: "Israel",
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
                    last: "",
                    first: "BIScience"
                },
                isOwn: false,
                type: "Company",
                fullName: "BIScience ",
                id: "569f5fbf62d172544baf0d56"
            },
            {
                _id: "569f603762d172544baf0d57",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-20T10:23:51.063Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                createdBy: {
                    date: "2016-01-20T10:23:51.063Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "https://www.linkedin.com/in/nahumnimrod?authType=NAME_SEARCH&authToken=yUvx&locale=en_US&trk=tyah&trkInfo=clickedVertical%3Amynetwork%2CclickedEntityId%3A150866939%2CauthType%3ANAME_SEARCH%2Cidx%3A1-1-1%2CtarId%3A1453285185948%2Ctas%3ANimrod%20Nahum",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "nahum_nimrod",
                jobPosition: "",
                website: "",
                address: {
                    country: "Israel",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "569f5fbf62d172544baf0d56",
                email: "nimrod.nahum@biscience.com",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Nahum",
                    first: "Nimrod"
                },
                isOwn: false,
                type: "Person",
                fullName: "Nimrod Nahum",
                id: "569f603762d172544baf0d57"
            },
            {
                _id: "56a0d4b962d172544baf0e3b",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-21T12:53:13.143Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2016-01-21T12:53:13.143Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "www.chimneygroup.com",
                address: {
                    country: "Sweden",
                    zip: "",
                    state: "",
                    city: "STOCKHOLM",
                    street: "SKEPPSBRON 38 111 30"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "Chimney"
                },
                isOwn: false,
                type: "Company",
                fullName: "Chimney ",
                id: "56a0d4b962d172544baf0e3b"
            },
            {
                _id: "56a0d53b62d172544baf0e3c",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-21T12:55:23.586Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2016-01-21T12:55:23.586Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "Co-Owner",
                website: "",
                address: {
                    country: "Sweden",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: "56a0d4b962d172544baf0e3b",
                email: "ivarliden@gmail.com",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Liden",
                    first: "Ivar"
                },
                isOwn: false,
                type: "Person",
                fullName: "Ivar Liden",
                id: "56a0d53b62d172544baf0e3c"
            },
            {
                _id: "56a23c26aa157ca50f21fae0",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-22T14:26:46.982Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2016-01-22T14:26:46.982Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Netherlands",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "richard.hazenberg@lunagames.com",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Hazenberg",
                    first: "Richard"
                },
                isOwn: false,
                type: "Person",
                fullName: "Richard Hazenberg",
                id: "56a23c26aa157ca50f21fae0"
            },
            {
                _id: "56a8930ceb2b76c70ec74d1d",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-27T09:51:08.453Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2016-01-27T09:51:08.453Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "UK",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "seb@locappy.com",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Lyall",
                    first: "Sebastian"
                },
                isOwn: false,
                type: "Person",
                fullName: "Sebastian Lyall",
                id: "56a8930ceb2b76c70ec74d1d"
            },
            {
                _id: "56a9ee95d59a04d6225b0df4",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-28T10:33:57.441Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2016-01-28T10:33:57.440Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "ThinkMobiles"
                },
                isOwn: false,
                type: "Company",
                fullName: "ThinkMobiles ",
                id: "56a9ee95d59a04d6225b0df4"
            },
            {
                _id: "56a9eeabd59a04d6225b0df5",
                __v: 0,
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
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
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
                fullName: "Peter Voloshchuk",
                id: "56a9eeabd59a04d6225b0df5"
            },
            {
                _id: "56ab5ca674d57e0d56d6bda4",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-01-29T12:35:50.671Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                createdBy: {
                    date: "2016-01-29T12:35:50.671Z",
                    user: "55b9fbcdd79a3a3439000007"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "USA",
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
                    last: "Maurstad",
                    first: "Stian"
                },
                isOwn: false,
                type: "Person",
                fullName: "Stian Maurstad",
                id: "56ab5ca674d57e0d56d6bda4"
            },
            {
                _id: "56bc9b53dfd8a81466e2f48b",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-02-11T14:31:47.740Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2016-02-11T14:31:47.740Z",
                    user: "5631dc18bf9592df04c55106"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: false,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: false
                },
                title: "",
                internalNotes: "",
                contacts: [],
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
                    last: "",
                    first: "TestAlina"
                },
                isOwn: false,
                type: "Company",
                fullName: "TestAlina ",
                id: "56bc9b53dfd8a81466e2f48b"
            },
            {
                _id: "56bc9b72dfd8a81466e2f48c",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-02-11T14:32:18.211Z",
                    user: "5631dc18bf9592df04c55106"
                },
                createdBy: {
                    date: "2016-02-11T14:32:18.211Z",
                    user: "5631dc18bf9592df04c55106"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
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
                company: "56bc9b53dfd8a81466e2f48b",
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "Person",
                    first: "Test"
                },
                isOwn: false,
                type: "Person",
                fullName: "Test Person",
                id: "56bc9b72dfd8a81466e2f48c"
            },
            {
                _id: "56d024b4b5057fdb22ff9095",
                dateBirth: "",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-02-26T10:11:00.631Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2016-02-26T10:11:00.630Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
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
                    last: "dsf",
                    first: "df"
                },
                isOwn: false,
                type: "Person",
                fullName: "df dsf",
                id: "56d024b4b5057fdb22ff9095"
            },
            {
                _id: "55b92ad521e4b7c40f00060d",
                ID: 6,
                __v: 0,
                companyInfo: {
                    size: "1-50",
                    industry: null
                },
                editedBy: {
                    date: "2016-03-09T10:19:42.621Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "1970-01-01T00:00:00.000Z",
                    user: null
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "52203e707d4dba8813000003"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: "+16162403185"
                },
                skype: "",
                jobPosition: "",
                website: "www.sportsmantracker.com1",
                address: {
                    country: "USA",
                    zip: "49525 ",
                    state: "Michigan",
                    city: "Grand Rapids",
                    street: "4647 Shearwood Ct."
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "jeff@sportsmantracker.com",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    last: "",
                    first: "Sportsman Tracker1"
                },
                isOwn: false,
                type: "Company",
                fullName: "Sportsman Tracker1 ",
                id: "55b92ad521e4b7c40f00060d"
            },
            {
                _id: "56e031f4c4c321f426f65172",
                dateBirth: "",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-03-09T14:23:48.818Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2016-03-09T14:23:48.817Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
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
                company: "55b92ad521e4b7c40f00060d",
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "sd",
                    first: "res"
                },
                isOwn: false,
                type: "Person",
                fullName: "res sd",
                id: "56e031f4c4c321f426f65172"
            },
            {
                _id: "56e0332ac4c321f426f65173",
                dateBirth: "",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-03-09T14:28:58.806Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2016-03-09T14:28:58.806Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
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
                company: "55b92ad521e4b7c40f00060d",
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "re",
                    first: "tr"
                },
                isOwn: false,
                type: "Person",
                fullName: "tr re",
                id: "56e0332ac4c321f426f65173"
            },
            {
                _id: "56e03335c4c321f426f65174",
                dateBirth: "",
                __v: 0,
                companyInfo: {
                    industry: null
                },
                editedBy: {
                    date: "2016-03-09T14:29:09.865Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2016-03-09T14:29:09.865Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
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
                contacts: [],
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
                company: "55b92ad521e4b7c40f00060d",
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "re",
                    first: "rte"
                },
                isOwn: false,
                type: "Person",
                fullName: "rte re",
                id: "56e03335c4c321f426f65174"
            },
            {
                _id: "55b92ad521e4b7c40f00060c",
                ID: 1,
                __v: 0,
                dateBirth: null,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2016-03-10T09:39:54.957Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.989Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [],
                attachments: [],
                notes: [],
                groups: {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "",
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
                contacts: [],
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
                    last: "Blinov",
                    first: "Alexey"
                },
                isOwn: false,
                type: "Person",
                fullName: "Alexey Blinov",
                id: "55b92ad521e4b7c40f00060c"
            }
        ]
    };

    var fakeWorkflowForDD = {
        data: [
            {
                _id: "528cdcb4f3f67bc40b000006",
                name: "New",
                wName: "opportunity"
            },
            {
                _id: "528cdd2af3f67bc40b000007",
                name: "Qualification",
                wName: "opportunity"
            },
            {
                _id: "528cde9ef3f67bc40b000008",
                name: "Proposition",
                wName: "opportunity"
            },
            {
                _id: "528cdef4f3f67bc40b00000a",
                name: "Won",
                wName: "opportunity"
            },
            {
                _id: "528cdf1cf3f67bc40b00000b",
                name: "Lost",
                wName: "opportunity"
            }
        ]
    };

    var fakeDepsForDD = {
        data: [
            {
                _id: "55b92ace21e4b7c40f000012",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: ".NET/WP"
            },
            {
                _id: "55b92ace21e4b7c40f000010",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "Android"
            },
            {
                _id: "55b92ace21e4b7c40f000014",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "BusinessDev"
            },
            {
                _id: "56802e9d1afe27f547b7ba51",
                nestingLevel: 1,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName: "CSS/FrontEnd"
            },
            {
                _id: "55bb1f14cb76ca630b000006",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "Design"
            },
            {
                _id: "560c0b83a5d4a2e20ba5068c",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "Finance"
            },
            {
                _id: "55b92ace21e4b7c40f000015",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "HR"
            },
            {
                _id: "56802eb31afe27f547b7ba52",
                nestingLevel: 1,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName: "JS"
            },
            {
                _id: "55b92ace21e4b7c40f000013",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "Marketing"
            },
            {
                _id: "56802ec21afe27f547b7ba53",
                nestingLevel: 1,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName: "PHP/WordPress"
            },
            {
                _id: "55bb1f40cb76ca630b000007",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "PM"
            },
            {
                _id: "55b92ace21e4b7c40f000011",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "QA"
            },
            {
                _id: "566ee11b8453e8b464b70b73",
                nestingLevel: 1,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName: "Ruby on Rails"
            },
            {
                _id: "55b92ace21e4b7c40f000016",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "Web"
            },
            {
                _id: "55b92ace21e4b7c40f00000f",
                nestingLevel: 0,
                parentDepartment: null,
                departmentName: "iOS"
            }
        ]
    };

    var fakeTaskPriority = {
        data: [
            {
                attachments: [],
                priority: "P1"
            },
            {
                attachments: [],
                priority: "P2"
            },
            {
                attachments: [],
                priority: "P3"
            },
            {
                attachments: [],
                priority: "P4"
            },
            {
                attachments: [],
                priority: "P5"
            }
        ]
    };

    var fakeEmplLang = {
        data: [
            {
                _id: "5301e61b3d8b9898d5896e67",
                attachments: [],
                name: "English"
            }
        ]
    };

    var fakeCompaniesForDD = {
        data: [
            {
                _id: "55ba0301d79a3a343900000d",
                name: {
                    first: "#Play"
                },
                fullName: "#Play undefined",
                id: "55ba0301d79a3a343900000d"
            },
            {
                _id: "55cdc93c9b42266a4f000005",
                name: {
                    first: "AgileFind"
                },
                fullName: "AgileFind undefined",
                id: "55cdc93c9b42266a4f000005"
            },
            {
                _id: "55f56406b81672730c00002e",
                name: {
                    first: "App Institute"
                },
                fullName: "App Institute undefined",
                id: "55f56406b81672730c00002e"
            },
            {
                _id: "562bc2db62461bfd59ef58c7",
                name: {
                    first: "AppMedia"
                },
                fullName: "AppMedia undefined",
                id: "562bc2db62461bfd59ef58c7"
            },
            {
                _id: "562ff202547f50b51d6de2b8",
                name: {
                    first: "Appsmakerstore"
                },
                fullName: "Appsmakerstore undefined",
                id: "562ff202547f50b51d6de2b8"
            },
            {
                _id: "561d1bc0b51032d674856acb",
                name: {
                    first: "Attrecto"
                },
                fullName: "Attrecto undefined",
                id: "561d1bc0b51032d674856acb"
            },
            {
                _id: "569f5fbf62d172544baf0d56",
                name: {
                    first: "BIScience"
                },
                fullName: "BIScience undefined",
                id: "569f5fbf62d172544baf0d56"
            },
            {
                _id: "55edaf167221afe30b000040",
                name: {
                    first: "BetterIt"
                },
                fullName: "BetterIt undefined",
                id: "55edaf167221afe30b000040"
            },
            {
                _id: "55b92ad521e4b7c40f00061d",
                name: {
                    first: "Buzinga"
                },
                fullName: "Buzinga undefined",
                id: "55b92ad521e4b7c40f00061d"
            },
            {
                _id: "56a0d4b962d172544baf0e3b",
                name: {
                    first: "Chimney"
                },
                fullName: "Chimney undefined",
                id: "56a0d4b962d172544baf0e3b"
            },
            {
                _id: "55b92ad621e4b7c40f000633",
                name: {
                    first: "Chris Mack"
                },
                fullName: "Chris Mack undefined",
                id: "55b92ad621e4b7c40f000633"
            },
            {
                _id: "5637a8e2bf9592df04c55115",
                name: {
                    first: "Colestreet"
                },
                fullName: "Colestreet undefined",
                id: "5637a8e2bf9592df04c55115"
            },
            {
                _id: "55b92ad621e4b7c40f000629",
                name: {
                    first: "Cristaliza"
                },
                fullName: "Cristaliza undefined",
                id: "55b92ad621e4b7c40f000629"
            },
            {
                _id: "569f57be62d172544baf0c3a",
                name: {
                    first: "ETECTURE GmbH"
                },
                fullName: "ETECTURE GmbH undefined",
                id: "569f57be62d172544baf0c3a"
            },
            {
                _id: "55b92ad621e4b7c40f000646",
                name: {
                    first: "EtienneL"
                },
                fullName: "EtienneL undefined",
                id: "55b92ad621e4b7c40f000646"
            },
            {
                _id: "55cf5c194a91e37b0b00012b",
                name: {
                    first: "Global Workshop Solutions"
                },
                fullName: "Global Workshop Solutions undefined",
                id: "55cf5c194a91e37b0b00012b"
            },
            {
                _id: "55ba03f8d79a3a343900000f",
                name: {
                    first: "GlobalWorkshop"
                },
                fullName: "GlobalWorkshop undefined",
                id: "55ba03f8d79a3a343900000f"
            },
            {
                _id: "55b92ad621e4b7c40f00063d",
                name: {
                    first: "Gomez"
                },
                fullName: "Gomez undefined",
                id: "55b92ad621e4b7c40f00063d"
            },
            {
                _id: "55b92ad621e4b7c40f00063f",
                name: {
                    first: "Hussam"
                },
                fullName: "Hussam undefined",
                id: "55b92ad621e4b7c40f00063f"
            },
            {
                _id: "55b92ad621e4b7c40f00064f",
                name: {
                    first: "Kenlo Group Ltd"
                },
                fullName: "Kenlo Group Ltd undefined",
                id: "55b92ad621e4b7c40f00064f"
            },
            {
                _id: "55b9fe20d79a3a3439000009",
                name: {
                    first: "Kogan"
                },
                fullName: "Kogan undefined",
                id: "55b9fe20d79a3a3439000009"
            },
            {
                _id: "55b92ad521e4b7c40f00061e",
                name: {
                    first: "Luke Raskino"
                },
                fullName: "Luke Raskino undefined",
                id: "55b92ad521e4b7c40f00061e"
            },
            {
                _id: "56574032bfd103f108eb4ad2",
                name: {
                    first: "Marand"
                },
                fullName: "Marand undefined",
                id: "56574032bfd103f108eb4ad2"
            },
            {
                _id: "55f55854b81672730c000010",
                name: {
                    first: "MediaHeads"
                },
                fullName: "MediaHeads undefined",
                id: "55f55854b81672730c000010"
            },
            {
                _id: "55cf362b4a91e37b0b0000c1",
                name: {
                    first: "MobStar"
                },
                fullName: "MobStar undefined",
                id: "55cf362b4a91e37b0b0000c1"
            },
            {
                _id: "5661805cbb8be7814fb52529",
                name: {
                    first: "Otrema"
                },
                fullName: "Otrema undefined",
                id: "5661805cbb8be7814fb52529"
            },
            {
                _id: "55b92ad621e4b7c40f00062a",
                name: {
                    first: "PeachInc"
                },
                fullName: "PeachInc undefined",
                id: "55b92ad621e4b7c40f00062a"
            },
            {
                _id: "56030d81fa3f91444e00000c",
                name: {
                    first: "Peter F"
                },
                fullName: "Peter F undefined",
                id: "56030d81fa3f91444e00000c"
            },
            {
                _id: "566d4b35abccac87642cb521",
                name: {
                    first: "Scatch"
                },
                fullName: "Scatch undefined",
                id: "566d4b35abccac87642cb521"
            },
            {
                _id: "55cf4f834a91e37b0b000102",
                name: {
                    first: "SharperBuilds"
                },
                fullName: "SharperBuilds undefined",
                id: "55cf4f834a91e37b0b000102"
            },
            {
                _id: "55b92ad521e4b7c40f00060d",
                name: {
                    first: "Sportsman Tracker1"
                },
                fullName: "Sportsman Tracker1 undefined",
                id: "55b92ad521e4b7c40f00060d"
            },
            {
                _id: "5604170eb904af832d000005",
                name: {
                    first: "Stentle"
                },
                fullName: "Stentle undefined",
                id: "5604170eb904af832d000005"
            },
            {
                _id: "56bc9b53dfd8a81466e2f48b",
                name: {
                    first: "TestAlina"
                },
                fullName: "TestAlina undefined",
                id: "56bc9b53dfd8a81466e2f48b"
            },
            {
                _id: "56a9ee95d59a04d6225b0df4",
                name: {
                    first: "ThinkMobiles"
                },
                fullName: "ThinkMobiles undefined",
                id: "56a9ee95d59a04d6225b0df4"
            },
            {
                _id: "569f590262d172544baf0c3e",
                name: {
                    first: "Time2view"
                },
                fullName: "Time2view undefined",
                id: "569f590262d172544baf0c3e"
            },
            {
                _id: "562bed4062461bfd59ef58d1",
                name: {
                    first: "TreatMe"
                },
                fullName: "TreatMe undefined",
                id: "562bed4062461bfd59ef58d1"
            },
            {
                _id: "55ba0b46d79a3a3439000013",
                name: {
                    first: "Unibet"
                },
                fullName: "Unibet undefined",
                id: "55ba0b46d79a3a3439000013"
            },
            {
                _id: "55b92ad621e4b7c40f00062e",
                name: {
                    first: "Web1 Syndication, Inc"
                },
                fullName: "Web1 Syndication, Inc undefined",
                id: "55b92ad621e4b7c40f00062e"
            },
            {
                _id: "55deb987ae2b22730b000018",
                name: {
                    first: "Yello"
                },
                fullName: "Yello undefined",
                id: "55deb987ae2b22730b000018"
            },
            {
                _id: "55fe60f5e2a48c310c000005",
                name: {
                    first: "test supplier"
                },
                fullName: "test supplier undefined",
                id: "55fe60f5e2a48c310c000005"
            }
        ]
    };

    var view;
    var listView;
    var topBarView;
    var thumbnailsView;
    var formView;
    var createView;
    var editView;
    var windowConfirmStub;

    describe('PersonsView', function () {
        var $fixture;
        var $elFixture;
        var server;

        before(function () {
            windowConfirmStub = sinon.stub(window, 'confirm').returns(true);
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();
            formView.remove();
            thumbnailsView.remove();
            editView.remove();
            createView.remove();

            windowConfirmStub.restore();
        });

        describe('#initialize()', function () {

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

                view = new MainView({el: $elFixture, contentType: 'Persons'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="49"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="49"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Persons');

            });

        });

        describe('TopBar View', function () {
            var personCollection;
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to create TopBarView', function () {
                var $topBarEl;
                var $createBtnEl;
                var personUrl = new RegExp('\/persons\/list', 'i');

                server.respondWith('GET', personUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePersonsForList)]);

                personCollection = new PersonsCollection({
                    contentType: 'Persons',
                    count: 100,
                    filter: null,
                    newCollection: false,
                    viewType: 'list'
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: personCollection
                });

                $topBarEl = topBarView.$el;
                $createBtnEl = $topBarEl.find('#createBtnHolder');

                expect($topBarEl).to.exist;
                expect($createBtnEl).to.exist;
            });


            it('Try to change view type (Thumbnails, List)', function () {
                var $topBarEl = topBarView.$el;
                var $listBtn = $topBarEl.find('a[data-view-type="list"]');
                var $thumbnailsBtn = $topBarEl.find('a[data-view-type="thumbnails"]');

                $listBtn.click();

                expect(window.location.hash).to.equals('#easyErp/Persons/list');

                $thumbnailsBtn.click();

                expect(window.location.hash).to.equals('#easyErp/Persons/thumbnails')
            });
        });


        describe('Persons list View', function () {
            var personsCollections;
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to create companies list view', function () {
                var $contentHolderEl;
                var $searchContainerEl;
                var $alphabetEl;
                var personsListUrl = new RegExp('\/persons\/list', 'i');
                var personsTotalCollUrl = new RegExp('\/persons\/totalCollectionLength', 'i');
                var personsAlphabetUrl = new RegExp('\/persons\/getPersonAlphabet', 'i');

                server.respondWith('GET', personsListUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePersonsForList)]);
                server.respondWith('GET', personsTotalCollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCollectionTotal)]);

                personsCollections = new PersonsCollection({
                    contentType: 'Persons',
                    count: 100,
                    filter: null,
                    newCollection: false,
                    viewType: 'list',
                    page: 1
                });

                server.respond();

                server.respondWith('GET', personsAlphabetUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeAlfabetic)]);

                listView = new ListView({
                    collection: personsCollections,
                    startTime: new Date()
                });

                server.respond();

                $contentHolderEl = listView.$el;
                $searchContainerEl = $contentHolderEl.find('.search-view');
                $alphabetEl = $contentHolderEl.find('#startLetter');

                expect($contentHolderEl).to.exist;
                expect($searchContainerEl).to.exist;
                expect($alphabetEl).to.exist;
                expect($contentHolderEl.find('table')).to.exist;
                expect($contentHolderEl.find('table')).to.have.class('list');
            });

        });


        describe('Persons thumbnail view', function () {
            var personsCollection;
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to create persons thumbnails view', function () {
                var $contentHolderEl;
                var $searchContainerEl;
                var $alphabetEl;
                var personsThumbUrl = new RegExp('\/persons\/thumbnails', 'i');
                var personsAlphabetUrl = new RegExp('\/persons\/getPersonAlphabet', 'i');
                var personsTotalCollUrl = new RegExp('\/persons\/totalCollectionLength', 'i');

                server.respondWith('GET', personsThumbUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePersons)]);
                server.respondWith('GET', personsTotalCollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCollectionTotal)]);

                personsCollection = new PersonsCollection({
                    contentType: 'Persons',
                    count: 100,
                    filter: null,
                    newCollection: false,
                    viewType: 'thumbnails'
                });

                server.respond();

                server.respondWith('GET', personsAlphabetUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeAlfabetic)]);

                thumbnailsView = new ThumbnailsView({
                    collection: personsCollection,
                    startTime: new Date()
                });

                server.respond();

                $contentHolderEl = thumbnailsView.$el;
                $searchContainerEl = $contentHolderEl.find('.search-view');
                $alphabetEl = $contentHolderEl.find('#startLetter');

                expect($contentHolderEl).to.exist;
                expect($searchContainerEl).to.exist;
                expect($alphabetEl).to.exist;
            });

            it('Try click on person', function () {
                var $gotoFormBtn = thumbnailsView.$el.find('.gotoForm');

                $gotoFormBtn[0].click();

                expect(window.location.hash).to.equals('#easyErp/Persons/form/55b92ad521e4b7c40f00060c');

            });

            it('Try to click alphabetic letter', function () {
                var $searchContainerEl;
                var $alphabetEl;
                var $contentHolderEl;
                var $letterEl = thumbnailsView.$el.find('#startLetter a');
                var personsThumbUrl = new RegExp('\/persons\/thumbnails', 'i');
                var personsTotalCollUrl = new RegExp('\/persons\/totalCollectionLength', 'i');

                server.respondWith('GET', personsThumbUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePersons)]);
                server.respondWith('GET', personsTotalCollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCollectionTotal)]);

                $letterEl.click();

                server.respond();

                $contentHolderEl = thumbnailsView.$el;
                $searchContainerEl = $contentHolderEl.find('.search-view');
                $alphabetEl = $contentHolderEl.find('#startLetter');

                expect($contentHolderEl).to.exist;
                expect($searchContainerEl).to.exist;
                expect($alphabetEl).to.exist;

            });

        });

        describe('Form View', function () {
            var personModel;
            var server;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                mainSpy.restore();

                //editView.remove();
            });

            it('Try to open form', function (done) {
                var personIdUrl = new RegExp('\/persons\/', 'i');
                var $contentHolder;

                personModel = new PersonModel();

                personModel.urlRoot = personModel.url() + '55b92ad521e4b7c40f00060c';

                server.respondWith('GET', personIdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePersonWithId)]);

                personModel.fetch({
                    success: function (model) {
                        server.respondWith('GET', '/opportunities/OpportunitiesForMiniView?person=55b92ad521e4b7c40f00060c&company=&page=1&count=4&onlyCount=true', [200, {"Content-Type": "application/json"}, JSON.stringify({listLength: 0})]);
                        server.respondWith('GET', '/opportunities/OpportunitiesForMiniView?person=55b92ad521e4b7c40f00060c&company=&page=1&count=4&onlyCount=false', [200, {"Content-Type": "application/json"}, JSON.stringify({
                            listLength: 0,
                            data: []
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

                $contentHolder = formView.$el;

                expect($contentHolder).to.exist;

            });

            it('Try to quick edit with error validate', function () {
                var $editSpan;
                var $editInput;
                var $saveSpan;
                var spyResponse;
                var $formHolder = formView.$el;
                var $editableEl = $($formHolder.find('.editable')[2]);
                var companyIdUrl = new RegExp('/Persons/', 'i');


                $editableEl.mouseenter();
                $editSpan = $formHolder.find('#editSpan a');

                $editSpan.click();

                $editInput = $formHolder.find('#editInput');
                $saveSpan = $formHolder.find('#saveSpan');

                $editInput.val('vvsdas'); // not valid email

                server.respondWith('PATCH', companyIdUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(new Error())]);

                $saveSpan.click();

                server.respond();

                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to quick edit', function () {
                var $editSpan;
                var $editInput;
                var $saveSpan;
                var $formHolder = formView.$el;
                var $editableEl = $($formHolder.find('.editable')[2]);
                var companyIdUrl = new RegExp('/Persons/', 'i');

                $editableEl.mouseenter();
                $editSpan = $formHolder.find('#editSpan a');

                $editSpan.click();

                $editInput = $formHolder.find('#editInput');
                $saveSpan = $formHolder.find('#saveSpan');

                $editInput.val('test@test.com');

                server.respondWith('PATCH', companyIdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                    success: 'Customer updated'
                })]);

                $saveSpan.click();

                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Persons/form/55b92ad521e4b7c40f00060c');
            });

            it('Try to open Create opportunity form', function () {
                var $createOppBtn = formView.$el.find('.formRightColumn .btnHolder .add.opportunities');
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');
                var workflowUrl = new RegExp('\/workflows\/getWorkflowsForDd', 'i');
                var taskUrl = new RegExp('\/tasks\/priority', 'i');

                server.respondWith('GET', userForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplRelUserUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', customersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomers)]);
                server.respondWith('GET', workflowUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWorkflowForDD)]);
                server.respondWith('GET', taskUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeTaskPriority)]);

                $createOppBtn.click();

                server.respond();

                expect($('#createOpportunities')).to.exist;

            });

            it('Try to save opportunity without need data', function () {
                var saveBtn = $('.btn')[6];
                var spyResponse;

                saveBtn.click();
                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');

            });

            it('Try to save opportunity', function () {
                var saveBtn = $('.btn')[6];
                var $form = $('#createOpportunities');

                $form.find('#name').val('test');
                $form.find('#internalNotes').val('test');
                $form.find('#expectedRevenueValue').val('50000');

                server.respondWith('POST', '/Opportunities/', [200, {"Content-Type": "application/json"}, JSON.stringify({
                    success: "A new Opportunities create success",
                    id: '123'
                })]);

                saveBtn.click();

                server.respond();

                $('.ui-dialog').remove();

                expect(window.location.hash).to.be.equals('#easyErp/Persons/form/55b92ad521e4b7c40f00060c');

            });

            // create Edit form into
            it('Try to click edit button', function () {
                var $contentHolderEl;
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplLangUrl = new RegExp('\/employees\/languages', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');
                var companiesForDdUrl = new RegExp('\/customers\/', 'i');

                server.respondWith('GET', userForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplLangUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplLang)]);
                server.respondWith('GET', emplRelUserUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', customersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomers)]);
                server.respondWith('GET', companiesForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCompaniesForDD)]);

                editView = new EditView({
                    model: personModel
                });

                server.respond();

                $contentHolderEl = editView.$el;

                expect($contentHolderEl).to.exist;
            });

            it('Try to change tab', function () {
                var $tabEl = $('.dialog-tabs a');
                var $firstTab = $($tabEl[0]);
                var $secondTab = $($tabEl[1]);
                var $thirdTab = $($tabEl[2]);

                expect($firstTab).to.have.class('active');

                $secondTab.click();

                expect($secondTab).to.have.class('active');

                $thirdTab.click();

                expect($thirdTab).to.have.class('active');
            });

            it('Try to PATCH person with error', function () {
                var spyResponse;
                var editBtn = $('.ui-button')[1];
                var $form = $('.dialog-tabs-item');
                var personsUrl = new RegExp('\/Persons\/', 'i');

                $form.find('#firstName').val('');

                server.respondWith('PUT', personsUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(new Error())]);

                editBtn.click();

                server.respond();

                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to delete person with error', function () {
                var deleteBtn = $('.ui-button')[3];
                var personsUrl = new RegExp('\/Persons\/', 'i');
                var spyResponse;

                server.respondWith('DELETE', personsUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(new Error())]);

                deleteBtn.click();

                server.respond();
                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to delete person', function () {
                var deleteBtn = $('.ui-button')[3];
                var personsUrl = new RegExp('\/Persons\/', 'i');

                server.respondWith('DELETE', personsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'customer removed'})]);

                deleteBtn.click();

                server.respond();

                expect(window.location.hash).to.equals('#easyErp/Persons');

            });

            it('Try to PATCH company', function () {
                var $salesTeam;
                var editBtn;
                var $form;
                var $selectBtn;
                var personsUrl = new RegExp('\/Persons\/', 'i');
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplLangUrl = new RegExp('\/employees\/languages', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');

                server.respondWith('GET', userForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplLangUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplLang)]);
                server.respondWith('GET', emplRelUserUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', customersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomers)]);

                editView = new EditView({
                    model: personModel
                });

                server.respond();

                editBtn = $('.ui-button')[1];
                $form = $('.dialog-tabs-item');
                $selectBtn = $('.current-selected')[1];

                $form.find('#name').val('testCompany');

                $selectBtn.click();

                $salesTeam = $('#departmentDd .newSelectList li')[0];

                $salesTeam.click();

                server.respondWith('PUT', personsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                    id: '123'
                })]);

                editBtn.click();

                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Persons/form/55b92ad521e4b7c40f00060c');
            });

            it('Try to close dialog', function () {
                var cancelBtn;
                var $contentHolder;
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplLangUrl = new RegExp('\/employees\/languages', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');

                server.respondWith('GET', userForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplLangUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplLang)]);
                server.respondWith('GET', emplRelUserUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', customersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomers)]);

                editView = new EditView({
                    model: personModel
                });

                server.respond();

                $contentHolder = editView.$el;
                cancelBtn = $('.ui-button')[2];

                expect($contentHolder).to.have.class('ui-dialog-content');

                cancelBtn.click();

                $contentHolder = editView.$el;

                expect($contentHolder).to.not.have.class('ui-dialog-content');

            });

            it('Try to delete person from the form', function () {
                var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                var personUrl = new RegExp('\/Persons\/', 'i');

                server.respondWith('DELETE', personUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'customer removed'})]);

                $deleteBtn.click();

                server.respond();

            });

        });

        describe('Person create view', function () {
            var server;
            var mainSpy;

            before(function () {
                mainSpy = sinon.spy(App, 'render');
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
                mainSpy.restore();
            });

            it('Try to create CreateForm', function () {
                var $contentHolderEl;
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplLangUrl = new RegExp('\/employees\/languages', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');

                server.respondWith('GET', userForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplLangUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplLang)]);
                server.respondWith('GET', emplRelUserUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', customersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomers)]);

                expect($('#dialogContainer')).to.empty;

                createView = new CreateView();

                server.respond();

                $contentHolderEl = createView.$el;

                expect($contentHolderEl).to.exist;
                expect($('.ui-dialog')).to.exist;
                expect($('.form-holder')).to.exist;
            });

            it('Try to save lead without need data', function () {
                var createBtn = $('.ui-button')[1];
                var spyResponse;

                createBtn.click();

                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');

            });

            it('Try to change tab', function () {
                var $tabEl = $('.dialog-tabs a');
                var $firstTab = $($tabEl[0]);
                var $secondTab = $($tabEl[1]);
                var $thirdTab = $($tabEl[2]);

                expect($firstTab).to.have.class('active');

                $secondTab.click();

                expect($secondTab).to.have.class('active');

                $thirdTab.click();

                expect($thirdTab).to.have.class('active');

            });

            it('Try to save company with correct data', function () {
                var $salesTeam;
                var $afterForm;
                var createBtn = $('.ui-button')[1];
                var $form = $('.dialog-tabs-item');
                var $selectBtn = $('.current-selected')[0];

                $form.find('#firstName').val('test');
                $form.find('#lastName').val('test');
                $form.find('#jobPositionInput').val('test');
                $form.find('#dateBirth').val('05.04.1991');
                $form.find('#emailInput').val('test@test.com');
                $form.find('#skype').val('testtest');
                $form.find('#LI').val('test.com');
                $form.find('#FB').val('test.com');
                $form.find('#addressInput').val('test');
                $form.find('#cityInput').val('test');
                $form.find('#stateInput').val('test');
                $form.find('#zipInput').val('88000');
                $form.find('#countryInput').val('test');
                $form.find('#phoneInput').val('+363636363');
                $form.find('#mobileInput').val('+363636363');

                $selectBtn.click();

                $salesTeam = $('#companiesDd .newSelectList li')[1];

                $salesTeam.click();

                server.respondWith('POST', '/persons/', [201, {"Content-Type": "application/json"}, JSON.stringify({
                    success: 'A new Person crate success',
                    id: '123'
                })]);

                createBtn.click();

                server.respond();
            });
        });


    });


});
