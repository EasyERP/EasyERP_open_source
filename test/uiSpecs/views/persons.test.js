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
], function (fixtures, router, PersonModel, PersonsCollection, MainView, TopBarView, CreateUserView, EditView, FormView, ListView, ThumbnailsView, $, chai, chaiJquery, sinonChai, Custom) {
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
        history: [ ],
        attachments: [ ],
        notes: [ ],
        groups: {
            group: [ ],
            users: [ ],
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
        contacts: [ ],
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

        before(function(){
            windowConfirmStub = sinon.stub(window, 'confirm').returns(true);
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();
            thumbnailsView.remove();
            /*createView.remove();
            formView.remove();
            editView.remove();*/

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
                            data: [ ]
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

            it('Try to quick edit with error validate', function(){
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

            it('Try to quick edit', function(){
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

            /*it('Try to open Create opportunity form', function(){
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

            it ('Try to save opportunity without need data', function(){
                var saveBtn = $('.btn')[6];
                var spyResponse;

                saveBtn.click();
                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');

            });

            it ('Try to save opportunity', function(){
                var saveBtn = $('.btn')[6];
                var $form = $('#createOpportunities');

                $form.find('#name').val('test');
                $form.find('#internalNotes').val('test');
                $form.find('#expectedRevenueValue').val('10000');

                server.respondWith('POST', '/Opportunities/', [200, {"Content-Type": "application/json"}, JSON.stringify({success: "A new Opportunities create success", id: '123'})]);

                saveBtn.click();

                server.respond();

                $('.ui-dialog').remove();

                expect(window.location.hash).to.be.equals('#easyErp/Companies/form/55b92ad521e4b7c40f00060d');

            });

            it('Try to add person', function(){
                var $createPersonBtn = formView.$el.find('.formRightColumn .btnHolder .add.persons');
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var employeeLangUrl = new RegExp('\/employees\/languages', 'i');
                var customersForDDUrl = new RegExp('\/customers\/getCompaniesForDd', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');

                server.respondWith('GET', userForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplRelUserUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', employeeLangUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmplLang)]);
                server.respondWith('GET', customersForDDUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomerForDD)]);
                server.respondWith('GET', customersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomers)]);

                $createPersonBtn.click();

                server.respond();

                expect('.ui-dialog').to.exist;
            });

            it('Try to save person', function(){
                var $createBtn = $('#create-person-dialog');
                var $form = $('#createPersonsForm');

                $form.find('#firstName').val('Test');
                $form.find('#lastName').val('Test');

                server.respondWith('POST', '/persons/', [201, {"Content-Type": "application/json"}, JSON.stringify({success: "A new Person create success", id: '123'})]);

                $createBtn.click();

                server.respond();

                $('.ui-dialog').remove();

                expect(window.location.hash).to.be.equals('#easyErp/Persons');
            });

            // create Edit form into
            it ('Try to click edit button', function(){
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

                editView = new EditView({
                    model : companyModel
                });

                server.respond();

                $contentHolderEl = editView.$el;

                expect($contentHolderEl).to.exist;
            });

            it ('Try to change tab', function(){
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

            it ('Try to PATCH company with error', function(){
                var spyResponse;
                var editBtn = $('.ui-button')[1];
                var $form = $('.dialog-tabs-item');

                $form.find('#name').val('');

                editBtn.click();
                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');
            });

            it ('Try to delete company with error', function(){
                var deleteBtn = $('.ui-button')[3];
                var companiesUrl = new RegExp('\/Companies\/', 'i');
                var spyResponse;

                server.respondWith('DELETE', companiesUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(new Error())]);

                deleteBtn.click();

                server.respond();
                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');
            });

            it ('Try to delete company', function(){
                var deleteBtn = $('.ui-button')[3];
                var companiesUrl = new RegExp('\/Companies\/', 'i');

                server.respondWith('DELETE', companiesUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'customer removed'})]);

                deleteBtn.click();

                server.respond();

                expect(window.location.hash).to.equals('#easyErp/Companies');

            });

            it('Try to PATCH company', function(){
                var $salesTeam;
                var editBtn;
                var $form;
                var $selectBtn;
                var companiesUrl = new RegExp('\/Companies\/', 'i');
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
                    model : companyModel
                });

                server.respond();

                editBtn = $('.ui-button')[1];
                $form = $('.dialog-tabs-item');
                $selectBtn = $('.current-selected')[1];

                $form.find('#name').val('testCompany');

                $selectBtn.click();

                $salesTeam = $('#departmentDd .newSelectList li')[0];

                $salesTeam.click();

                server.respondWith('PUT', companiesUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                    id: '123'
                })]);

                editBtn.click();

                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Companies/form/55b92ad521e4b7c40f00060d');
            });

            it('Try to close dialog', function(){
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
                    model : companyModel
                });

                server.respond();

                $contentHolder = editView.$el;
                cancelBtn = $('.ui-button')[2];

                expect($contentHolder).to.have.class('ui-dialog-content');

                cancelBtn.click();

                $contentHolder = editView.$el;

                expect($contentHolder).to.not.have.class('ui-dialog-content');

            });

            it('Try to delete company from the form', function(){
                var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                var companyUrl = new RegExp('\/Companies\/', 'i');

                server.respondWith('DELETE', companyUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'customer removed'})]);

                $deleteBtn.click();

                server.respond();

                //expect(window.location.hash).to.be.equals('#easyErp/Companies/thumbnails');

            });*/

        });

        /*describe('Company create view', function () {
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

                $form.find('#name').val('test');
                $form.find('#website').val('test');
                $form.find('#email').val('test@test.com');
                $form.find('#LI').val('test.com');
                $form.find('#Facebook').val('test.com');
                $form.find('#phone').val('+363636363');
                $form.find('#mobile').val('+363636363');
                $form.find('#street').val('test');
                $form.find('#city').val('test');
                $form.find('#state').val('test');
                $form.find('#zip').val('88000');
                $form.find('#country').val('test');

                $selectBtn.click();

                $salesTeam = $('#departmentDd .newSelectList li')[0];

                $salesTeam.click();

                server.respondWith('POST', '/companies/', [201, {"Content-Type": "application/json"}, JSON.stringify({
                    success: 'A new Person crate success',
                    id: '123'
                })]);

                createBtn.click();

                server.respond();
            });
        });*/


    });


});
