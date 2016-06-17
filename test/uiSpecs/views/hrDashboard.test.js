define([
    'text!fixtures/index.html',
    'collections/Dashboard/hrDashboard',
    'views/main/MainView',
    'views/hrDashboard/index',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (fixtures, HrDashboardCollection, MainView, IndexView, $, chai, chaiJquery, sinonChai) {
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
    var fakeDashboardData = [
        {
            _id: "hired",
            data: [
                {
                    _id: 201506,
                    hiredCount: 11,
                    hiredEmployees: [
                        {
                            _id: "55b92ad221e4b7c40f0000c3",
                            isLead: 0,
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                first: "Olesia",
                                last: "Prokoshkina"
                            },
                            isEmployee: true,
                            hireDate: 201506
                        },
                        {
                            _id: "55b92ad221e4b7c40f00009e",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Michenko",
                                first: "Alex"
                            },
                            isEmployee: true,
                            hireDate: 201506
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000a7",
                            isLead: 1,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Ryabcev",
                                first: "Alex"
                            },
                            isEmployee: true,
                            hireDate: 201506
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000a5",
                            isLead: 0,
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Holubka",
                                first: "Maxim"
                            },
                            isEmployee: true,
                            hireDate: 201506
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000a6",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Citrak",
                                first: "Norbert"
                            },
                            isEmployee: false,
                            hireDate: 201506
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000b6",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Vengrin",
                                first: "Denis"
                            },
                            isEmployee: true,
                            hireDate: 201506
                        },
                        {
                            _id: "55b92ad221e4b7c40f00009f",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Dzuba",
                                first: "Dmitriy"
                            },
                            isEmployee: true,
                            hireDate: 201506
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000b7",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Polovka",
                                first: "Myroslava"
                            },
                            isEmployee: true,
                            hireDate: 201506
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c1",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Zasukhina",
                                first: "Maria"
                            },
                            isEmployee: true,
                            hireDate: 201506
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c0",
                            isLead: 0,
                            department: {
                                _id: "560c0b83a5d4a2e20ba5068c",
                                departmentName: "Finance"
                            },
                            name: {
                                last: "Kordas",
                                first: "Oksana"
                            },
                            isEmployee: false,
                            hireDate: 201506
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c2",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Mistetskiy",
                                first: "Andriy"
                            },
                            isEmployee: true,
                            hireDate: 201506
                        }
                    ]
                },
                {
                    _id: 201507,
                    hiredCount: 21,
                    hiredEmployees: [
                        {
                            _id: "55b92ad221e4b7c40f0000cd",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                first: "Andriy",
                                last: "Vovk"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000ca",
                            isLead: 0,
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Vengerova",
                                first: "Yana"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55bf45cf65cda0810b00000a",
                            department: {
                                _id: "55bb1f40cb76ca630b000007",
                                departmentName: "PM"
                            },
                            name: {
                                first: "Liliya",
                                last: "Shustur"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c9",
                            isLead: 0,
                            department: {
                                _id: "56e175c4d62294582e10ca68",
                                departmentName: "Unity"
                            },
                            name: {
                                first: "Oleksiy",
                                last: "Fedosov"
                            },
                            isEmployee: false,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c7",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Mykhailova",
                                first: "Liliya"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000a8",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                first: "Andriy",
                                last: "Korneychuk"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000a9",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Loboda",
                                first: "Andriy"
                            },
                            isEmployee: false,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000cf",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Denysiuk",
                                first: "Yaroslav"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000ce",
                            isLead: 0,
                            department: {
                                _id: "56802ec21afe27f547b7ba53",
                                departmentName: "PHP/WordPress"
                            },
                            name: {
                                last: "Storojenko",
                                first: "Alex"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000aa",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Lyashenko",
                                first: "Ivan"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000ab",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Olkhovik",
                                first: "Katerina"
                            },
                            isEmployee: false,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000b8",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Lobas",
                                first: "Anna"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000b9",
                            isLead: 1,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Melnyk",
                                first: "Olena"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000cc",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                first: "Ivan",
                                last: "Lyakh"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000ba",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Klochkova",
                                first: "Alexandra"
                            },
                            isEmployee: false,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000bb",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Shepinka",
                                first: "Igor"
                            },
                            isEmployee: false,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c4",
                            isLead: 0,
                            department: {
                                _id: "55bb1f40cb76ca630b000007",
                                departmentName: "PM"
                            },
                            name: {
                                last: "Myronyshyn",
                                first: "Michael"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000cb",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Yelahina",
                                first: "Alona"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c8",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000011",
                                departmentName: "QA"
                            },
                            name: {
                                last: "Bizilya",
                                first: "Ivan"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c6",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Kramarenko",
                                first: "Illia"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c5",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Gajdan",
                                first: "Michael"
                            },
                            isEmployee: true,
                            hireDate: 201507
                        }
                    ]
                },
                {
                    _id: 201508,
                    hiredCount: 21,
                    hiredEmployees: [
                        {
                            _id: "55e96ab13f3ae4fd0b000009",
                            department: {
                                _id: "55bb1f40cb76ca630b000007",
                                departmentName: "PM"
                            },
                            name: {
                                last: "Pavliuk",
                                first: "Oles"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55ded6b3ae2b22730b00004e",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Dimova",
                                first: "Anastasia"
                            },
                            isEmployee: false,
                            hireDate: 201508
                        },
                        {
                            _id: "55d1e234dda01e250c000015",
                            department: {
                                _id: "55bb1f40cb76ca630b000007",
                                departmentName: "PM"
                            },
                            name: {
                                last: "Rimar",
                                first: "Kristian"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55d1d860dda01e250c000010",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Hoshovsky",
                                first: "Vasiliy"
                            },
                            isEmployee: false,
                            hireDate: 201508
                        },
                        {
                            _id: "55e419094983acdd0b000012",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                first: "Kirill",
                                last: "Paliiuk"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55d1a2b18f61e2c90b000023",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Degtyar",
                                first: "Sergiy"
                            },
                            isEmployee: false,
                            hireDate: 201508
                        },
                        {
                            _id: "55c06411d011746b0b000005",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Rachytskyy",
                                first: "Maxim"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55c0656ad011746b0b000006",
                            department: {
                                _id: "56802e9d1afe27f547b7ba51",
                                departmentName: "CSS/FrontEnd"
                            },
                            name: {
                                last: "Nizhegorodov",
                                first: "Anton"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55c84a4aaa36a0e60a000005",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Muratov",
                                first: "Pavlo"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55e549309624477a0b000005",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Rospopa",
                                first: "Petro"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55dd7776f09cc2ec0b000009",
                            department: {
                                _id: "56802e9d1afe27f547b7ba51",
                                departmentName: "CSS/FrontEnd"
                            },
                            name: {
                                last: "Kavka",
                                first: "Michael"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55c98b86cbb0f4910b000006",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Kovalenko",
                                first: "Ivan"
                            },
                            isEmployee: false,
                            hireDate: 201508
                        },
                        {
                            _id: "55dd71eaf09cc2ec0b000007",
                            department: {
                                _id: "56802e9d1afe27f547b7ba51",
                                departmentName: "CSS/FrontEnd"
                            },
                            name: {
                                last: "Khartov",
                                first: "Ivan"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55dd63f8f09cc2ec0b000006",
                            department: {
                                _id: "56802ec21afe27f547b7ba53",
                                departmentName: "PHP/WordPress"
                            },
                            name: {
                                last: "Ihnatko",
                                first: "Sergiy"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55c32e0d29bd6ccd0b000005",
                            department: {
                                _id: "56e175c4d62294582e10ca68",
                                departmentName: "Unity"
                            },
                            name: {
                                last: "Alexeev",
                                first: "Eugen"
                            },
                            isEmployee: false,
                            hireDate: 201508
                        },
                        {
                            _id: "55c330d529bd6ccd0b000007",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Yurenko",
                                first: "Alina"
                            },
                            isEmployee: false,
                            hireDate: 201508
                        },
                        {
                            _id: "55dd73d1f09cc2ec0b000008",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Vizenko",
                                first: "Roman"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55c98aa7cbb0f4910b000005",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Rechun",
                                first: "Eugen"
                            },
                            isEmployee: false,
                            hireDate: 201508
                        },
                        {
                            _id: "55c98df0cbb0f4910b000007",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Berezhnoi",
                                first: "Timur"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55ca0145cbb0f4910b000009",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Zinkovskyi",
                                first: "Denis"
                            },
                            isEmployee: true,
                            hireDate: 201508
                        },
                        {
                            _id: "55cdffa59b42266a4f000015",
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Magar",
                                first: "Dmitriy"
                            },
                            isEmployee: false,
                            hireDate: 201508
                        }
                    ]
                },
                {
                    _id: 201509,
                    hiredCount: 20,
                    hiredEmployees: [
                        {
                            _id: "56090fae86e2435a33000008",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Nukhova",
                                first: "Inna"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "56090d77066d979a33000009",
                            department: {
                                _id: "55b92ace21e4b7c40f000011",
                                departmentName: "QA"
                            },
                            name: {
                                first: "Yuriy",
                                last: "Bysaha"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "560264bb8dc408c632000005",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Lyakh",
                                first: "Anastas"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "560115cf536bd29228000006",
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Myhalko",
                                first: "Marianna"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "56029cc950de7f4138000005",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Lendyel",
                                first: "Eugen"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "56011186536bd29228000005",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Khruslov",
                                first: "Valentyn"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "5602a01550de7f4138000008",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Dufynets",
                                first: "Yana"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "55b92ad221e4b7c40f000056",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Labjak",
                                first: "Ruslan"
                            },
                            isEmployee: false,
                            hireDate: 201509
                        },
                        {
                            _id: "55ed5a437221afe30b000006",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Porokhnitska",
                                first: "Yulia"
                            },
                            isEmployee: false,
                            hireDate: 201509
                        },
                        {
                            _id: "55f7c20a6d43203d0c000005",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Samaryk",
                                first: "Yana"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "5600042ca36a8ca10c000029",
                            department: {
                                _id: "56e175c4d62294582e10ca68",
                                departmentName: "Unity"
                            },
                            name: {
                                last: "Filchak",
                                first: "Michael"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "55eef3fd6dceaee10b000020",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Saldan",
                                first: "Roman"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "55eee9c26dceaee10b00001d",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Stepanchuk",
                                first: "Volodymyr"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "55effafa8f1e10e50b000006",
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Pavlenko",
                                first: "Denis"
                            },
                            isEmployee: false,
                            hireDate: 201509
                        },
                        {
                            _id: "55f7c3736d43203d0c000006",
                            department: {
                                _id: "56802ec21afe27f547b7ba53",
                                departmentName: "PHP/WordPress"
                            },
                            name: {
                                last: "Bodak",
                                first: "Yuriy"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "55f9298456f79c9c0c000006",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Manhur",
                                first: "Viktor"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "56014cc8536bd29228000007",
                            department: {
                                _id: "560c0b83a5d4a2e20ba5068c",
                                departmentName: "Finance"
                            },
                            name: {
                                last: "Bezyk",
                                first: "Yevgenia"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "5600031ba36a8ca10c000028",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Mostiv",
                                first: "Dmitriy"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "55eeed546dceaee10b00001e",
                            department: {
                                _id: "55b92ace21e4b7c40f000011",
                                departmentName: "QA"
                            },
                            name: {
                                last: "Turytskyi",
                                first: "Vladyslav"
                            },
                            isEmployee: true,
                            hireDate: 201509
                        },
                        {
                            _id: "55fbcb65f9210c860c000005",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Shamolina",
                                first: "Daria"
                            },
                            isEmployee: false,
                            hireDate: 201509
                        }
                    ]
                },
                {
                    _id: 201510,
                    hiredCount: 11,
                    hiredEmployees: [
                        {
                            _id: "56123232c90e2fb026ce064b",
                            department: {
                                _id: "55bb1f40cb76ca630b000007",
                                departmentName: "PM"
                            },
                            name: {
                                last: "Sikora",
                                first: "Olga"
                            },
                            isEmployee: true,
                            hireDate: 201510
                        },
                        {
                            _id: "561bb1269ebb48212ea838c5",
                            department: {
                                _id: "56802e9d1afe27f547b7ba51",
                                departmentName: "CSS/FrontEnd"
                            },
                            name: {
                                last: "Pogorilyak",
                                first: "Vladimir"
                            },
                            isEmployee: true,
                            hireDate: 201510
                        },
                        {
                            _id: "5614d4c7ab24a83b1dc1a7a8",
                            department: {
                                _id: "55bb1f40cb76ca630b000007",
                                departmentName: "PM"
                            },
                            name: {
                                last: "Babilia",
                                first: "Dmytro"
                            },
                            isEmployee: true,
                            hireDate: 201510
                        },
                        {
                            _id: "561b756f9ebb48212ea838c0",
                            department: {
                                _id: "55bb1f40cb76ca630b000007",
                                departmentName: "PM"
                            },
                            name: {
                                last: "Romanyuk",
                                first: "Stanislav"
                            },
                            isEmployee: true,
                            hireDate: 201510
                        },
                        {
                            _id: "561ba7039ebb48212ea838c3",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Maliavska",
                                first: "Oleksandra"
                            },
                            isEmployee: true,
                            hireDate: 201510
                        },
                        {
                            _id: "561ba8639ebb48212ea838c4",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Yartysh",
                                first: "Nataliya"
                            },
                            isEmployee: true,
                            hireDate: 201510
                        },
                        {
                            _id: "561bc5ca9ebb48212ea838c8",
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Sokalskiy",
                                first: "Andriy"
                            },
                            isEmployee: false,
                            hireDate: 201510
                        },
                        {
                            _id: "561bb5329ebb48212ea838c6",
                            department: {
                                _id: "56802e9d1afe27f547b7ba51",
                                departmentName: "CSS/FrontEnd"
                            },
                            name: {
                                last: "Ladomiryak",
                                first: "Valerii"
                            },
                            isEmployee: true,
                            hireDate: 201510
                        },
                        {
                            _id: "5629e27046bca6e4591f4919",
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Petrov",
                                first: "Artem"
                            },
                            isEmployee: true,
                            hireDate: 201510
                        },
                        {
                            _id: "561bb90a9ebb48212ea838c7",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Svyd",
                                first: "Andriy"
                            },
                            isEmployee: true,
                            hireDate: 201510
                        },
                        {
                            _id: "5626278d750d38934bfa1313",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Rogachenko",
                                first: "Viktoria"
                            },
                            isEmployee: true,
                            hireDate: 201510
                        }
                    ]
                },
                {
                    _id: 201511,
                    hiredCount: 14,
                    hiredEmployees: [
                        {
                            _id: "565f0fa6f6427f253cf6bf19",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Lysachenko",
                                first: "Alex"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "565c66633410ae512364dc00",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Timochchenko",
                                first: "Alona"
                            },
                            isEmployee: false,
                            hireDate: 201511
                        },
                        {
                            _id: "565c306af4dcd63b5dbd7373",
                            department: {
                                _id: "56802ec21afe27f547b7ba53",
                                departmentName: "PHP/WordPress"
                            },
                            name: {
                                last: "Matrafayilo",
                                first: "Myroslav"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "565c2793f4dcd63b5dbd7372",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Yaremenko",
                                first: "Denis"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "5637710e5d23a8eb04e80aed",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Kovalenko",
                                first: "Viktoria"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "5638aa635d23a8eb04e80af0",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Siladii",
                                first: "Alex"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "5649b8ccad4bc9e53f1f6192",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Gevelev",
                                first: "Sergiy"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "5640741570bbc2b740ce89ec",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Lukashov",
                                first: "Denis"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "564a03d1ad4bc9e53f1f6195",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Tanchenec",
                                first: "Edgard"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "564a0186ad4bc9e53f1f6193",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Orlenko",
                                first: "Liliya"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "564dac3e9b85f8b16b574fea",
                            department: {
                                _id: "56e175c4d62294582e10ca68",
                                departmentName: "Unity"
                            },
                            name: {
                                last: "Filchak",
                                first: "Alex"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "564a02e0ad4bc9e53f1f6194",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Dvorian",
                                first: "Taras"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "564da59f9b85f8b16b574fe9",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Chuprov",
                                first: "Andriy"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        },
                        {
                            _id: "5652dd95c4d12cf51e7f7e0b",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Petakh",
                                first: "Sergiy"
                            },
                            isEmployee: true,
                            hireDate: 201511
                        }
                    ]
                },
                {
                    _id: 201512,
                    hiredCount: 12,
                    hiredEmployees: [
                        {
                            _id: "5684ec1a1fec73d05393a2a4",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Zaitseva",
                                first: "Maria"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        },
                        {
                            _id: "5667f43da3fc012a68f0d5f6",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Katsala",
                                first: "Roman"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        },
                        {
                            _id: "567ac0a48365c9a205406f33",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Kolochynsky",
                                first: "Dmytro"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        },
                        {
                            _id: "566aa49f4f817b7f51746ec0",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Burtnyk",
                                first: "Nataliya"
                            },
                            isEmployee: false,
                            hireDate: 201512
                        },
                        {
                            _id: "566ada96a74aaf316eaea69d",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Gladovskyy",
                                first: "Maxim"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        },
                        {
                            _id: "56964a03d87c9004552b63ba",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Skyba",
                                first: "Pavlo"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        },
                        {
                            _id: "566add9aa74aaf316eaea6fc",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Saranyuk",
                                first: "Denis"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        },
                        {
                            _id: "566ede9e8453e8b464b70b71",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Tonkovid",
                                first: "Alex"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        },
                        {
                            _id: "566fe2348453e8b464b70ba6",
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Lukashchuk",
                                first: "Andriy"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        },
                        {
                            _id: "5667f310a3fc012a68f0d5f5",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Sopko",
                                first: "Michael"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        },
                        {
                            _id: "56813fe29cceae182b907755",
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Ukrainskiy",
                                first: "Taras"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        },
                        {
                            _id: "568158fc9cceae182b907756",
                            department: {
                                _id: "56802ec21afe27f547b7ba53",
                                departmentName: "PHP/WordPress"
                            },
                            name: {
                                last: "Belous",
                                first: "Herman"
                            },
                            isEmployee: true,
                            hireDate: 201512
                        }
                    ]
                },
                {
                    _id: 201601,
                    hiredCount: 18,
                    hiredEmployees: [
                        {
                            _id: "56a78c75aa157ca50f21fb24",
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Iyber",
                                first: "Renata"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "569e63df044ae38173244cfd",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Danyliuk",
                                first: "Bogdan"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "569e3a73044ae38173244cfb",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Martyniuk",
                                first: "Roman"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "569cce1dcf1f31f925c026fa",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Stupchuk",
                                first: "Andriy"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "56a7956faa157ca50f21fb25",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Demko",
                                first: "Pavlo"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "56a0d4b162d172544baf0e3a",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Ilnytskyi",
                                first: "Ihor"
                            },
                            isEmployee: false,
                            hireDate: 201601
                        },
                        {
                            _id: "568bbf935827e3b24d8123a8",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Hamalii",
                                first: "Vladyslav"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "568cd341b2bcba971ba6f5c4",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Rosul",
                                first: "Roman"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "56af32e174d57e0d56d6bee5",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Sichko",
                                first: "Nataliya"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "568cd4c0b2bcba971ba6f5c5",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Osadchuk",
                                first: "Roman"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "568cdd375527d6691cb68b22",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Melnik",
                                first: "Sergey"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "56a5ef86aa157ca50f21fb1d",
                            department: {
                                _id: "55bb1f40cb76ca630b000007",
                                departmentName: "PM"
                            },
                            name: {
                                last: "Pasichnyuk",
                                first: "Ivan"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "568bc0b55827e3b24d8123a9",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Syrota",
                                first: "Yaroslav"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "56966c82d87c9004552b63c7",
                            department: {
                                _id: "56802e9d1afe27f547b7ba51",
                                departmentName: "CSS/FrontEnd"
                            },
                            name: {
                                last: "Kuzma",
                                first: "Ihor"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "56938d2cd87c9004552b639e",
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Makarova",
                                first: "Nastya"
                            },
                            isEmployee: false,
                            hireDate: 201601
                        },
                        {
                            _id: "568bbdfd5827e3b24d8123a7",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Chaban",
                                first: "Roman"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        },
                        {
                            _id: "56965733d87c9004552b63be",
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Samokhin",
                                first: "Andriy"
                            },
                            isEmployee: false,
                            hireDate: 201601
                        },
                        {
                            _id: "5693b24bd87c9004552b63a1",
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Horak",
                                first: "Andriy"
                            },
                            isEmployee: true,
                            hireDate: 201601
                        }
                    ]
                },
                {
                    _id: 201602,
                    hiredCount: 20,
                    hiredEmployees: [
                        {
                            _id: "56d5a0c45132d292750a5e7e",
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Ukrainskiy",
                                first: "Rostyslav"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56d06aef541812c0719735c8",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Garagonich",
                                first: "Liza"
                            },
                            isEmployee: false,
                            hireDate: 201602
                        },
                        {
                            _id: "56cf0928541812c071973593",
                            department: {
                                _id: "560c0b83a5d4a2e20ba5068c",
                                departmentName: "Finance"
                            },
                            name: {
                                last: "Shepitko",
                                first: "Tetiana"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56cdd88b541812c071973585",
                            department: {
                                _id: "560c0b83a5d4a2e20ba5068c",
                                departmentName: "Finance"
                            },
                            name: {
                                last: "Plovayko",
                                first: "Nelya"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56cdd631541812c071973584",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Sheverya",
                                first: "Maryna"
                            },
                            isEmployee: false,
                            hireDate: 201602
                        },
                        {
                            _id: "56cc7cb7541812c07197357b",
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Opanasiuk",
                                first: "Bohdana"
                            },
                            isEmployee: false,
                            hireDate: 201602
                        },
                        {
                            _id: "56c59ba4d2b48ede4ba42266",
                            department: {
                                _id: "56802ec21afe27f547b7ba53",
                                departmentName: "PHP/WordPress"
                            },
                            name: {
                                last: "Lytvynenko",
                                first: "Andriy"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56b2287b99ce8d706a81b2bc",
                            department: {
                                _id: "56802e9d1afe27f547b7ba51",
                                departmentName: "CSS/FrontEnd"
                            },
                            name: {
                                last: "Mudrenok",
                                first: "Kostiantyn"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56b3412299ce8d706a81b2cd",
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Kholtobin",
                                first: "Mykola"
                            },
                            isEmployee: false,
                            hireDate: 201602
                        },
                        {
                            _id: "56b9cbb48f23c5696159cd08",
                            department: {
                                _id: "56802ec21afe27f547b7ba53",
                                departmentName: "PHP/WordPress"
                            },
                            name: {
                                last: "Kovalenko",
                                first: "Oleksii"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56cc7ad8541812c071973579",
                            department: {
                                _id: "56802ec21afe27f547b7ba53",
                                departmentName: "PHP/WordPress"
                            },
                            name: {
                                last: "Tesliuk",
                                first: "Petro"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56b8b99e6c411b590588feb9",
                            department: {
                                _id: "56802ec21afe27f547b7ba53",
                                departmentName: "PHP/WordPress"
                            },
                            name: {
                                last: "Ovcharenko",
                                first: "Alex"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56b9ccd88f23c5696159cd09",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Antonenko",
                                first: "Artem"
                            },
                            isEmployee: false,
                            hireDate: 201602
                        },
                        {
                            _id: "56b9d3eb8f23c5696159cd0b",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Mykhailova",
                                first: "Galina"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56dd4b727bd21335130c4f95",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Merentsov",
                                first: "Andriy"
                            },
                            isEmployee: false,
                            hireDate: 201602
                        },
                        {
                            _id: "56cb3695541812c071973546",
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Vasylyna",
                                first: "Mykola"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56b9d49d8f23c5696159cd0c",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Bed",
                                first: "Kirill"
                            },
                            isEmployee: false,
                            hireDate: 201602
                        },
                        {
                            _id: "56bdf283dfd8a81466e2f6d0",
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Shishko",
                                first: "Nadiya"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56c19971dfd8a81466e2f6dc",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Khainus",
                                first: "Andriy"
                            },
                            isEmployee: true,
                            hireDate: 201602
                        },
                        {
                            _id: "56c2f2a7dfd8a81466e2f71f",
                            department: {
                                _id: "55b92ace21e4b7c40f000011",
                                departmentName: "QA"
                            },
                            name: {
                                last: "Mateleshka",
                                first: "Viktor"
                            },
                            isEmployee: false,
                            hireDate: 201602
                        }
                    ]
                },
                {
                    _id: 201603,
                    hiredCount: 16,
                    hiredEmployees: [
                        {
                            _id: "56f3a202ff088d9a50148aa2",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Zhylka",
                                first: "Oksana"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56f1629ce7c600fe4fbae592",
                            department: {
                                _id: "56802e9d1afe27f547b7ba51",
                                departmentName: "CSS/FrontEnd"
                            },
                            name: {
                                last: "Bosenko",
                                first: "Julia"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56e2e83a74ac46664a83e94b",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Melnyk",
                                first: "Yevgenia"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56e696da81046d9741fb66fc",
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Kovbel",
                                first: "Fedir"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56d9497dae35cc4f0e721074",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "TESTING",
                                first: "Test"
                            },
                            isEmployee: false,
                            hireDate: 201603
                        },
                        {
                            _id: "56e2b6a21f2850d361927dd8",
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Protsenko",
                                first: "Oleksiy"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56dd4d8eea0939141336783f",
                            department: {
                                _id: "55b92ace21e4b7c40f000011",
                                departmentName: "QA"
                            },
                            name: {
                                last: "Vasyliev",
                                first: "Andriy"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56f1636d99952f1f505902a1",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Fizer",
                                first: "Olha"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56e6b7d7977124d34db5829c",
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Bachynska",
                                first: "Roksana"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56e045e943fcd85c74307060",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Milchevych",
                                first: "Galina"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56e0408e4f9ff8e0737d7c52",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Pylyp",
                                first: "Oksana"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56e17848f625de2a2f9cacd1",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Biloborodov",
                                first: "Sergiy"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56d823e78230197c0e089038",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Marenych",
                                first: "Sofiya"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56e17661177f76f72edf774c",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Stets",
                                first: "Bogdana"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56e298ab5def9136621b7803",
                            department: {
                                _id: "55b92ace21e4b7c40f000011",
                                departmentName: "QA"
                            },
                            name: {
                                last: "Shinkovych",
                                first: "Rikhard"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        },
                        {
                            _id: "56e2b53e896e98a661aa8326",
                            department: {
                                _id: "56e175c4d62294582e10ca68",
                                departmentName: "Unity"
                            },
                            name: {
                                last: "Ptitsyn",
                                first: "Michael"
                            },
                            isEmployee: true,
                            hireDate: 201603
                        }
                    ]
                },
                {
                    _id: 201604,
                    hiredCount: 10,
                    hiredEmployees: [
                        {
                            _id: "572074f171d367e52185bd3a",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Siladii",
                                first: "Roman"
                            },
                            isEmployee: true,
                            hireDate: 201604
                        },
                        {
                            _id: "571a0643156a3d7a75a39f95",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Ageev",
                                first: "Oleksiy"
                            },
                            isEmployee: true,
                            hireDate: 201604
                        },
                        {
                            _id: "5715ee359f1136bd3af3b662",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Driuchenko",
                                first: "Vitaliy"
                            },
                            isEmployee: true,
                            hireDate: 201604
                        },
                        {
                            _id: "57206f8e2387d7b821a694c1",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Danch",
                                first: "Patritsiia"
                            },
                            isEmployee: true,
                            hireDate: 201604
                        },
                        {
                            _id: "5714e5ff4b1f720a63ae7e93",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Korpanets",
                                first: "Taras"
                            },
                            isEmployee: true,
                            hireDate: 201604
                        },
                        {
                            _id: "570b72468f1cf7c354040534",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Lylyk",
                                first: "Dmytro"
                            },
                            isEmployee: true,
                            hireDate: 201604
                        },
                        {
                            _id: "5720741bd4761c212289b7ea",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Slavska",
                                first: "Alina"
                            },
                            isEmployee: true,
                            hireDate: 201604
                        },
                        {
                            _id: "5714e7584b1f720a63ae7e94",
                            department: {
                                _id: "55bb1f40cb76ca630b000007",
                                departmentName: "PM"
                            },
                            name: {
                                last: "Trytko",
                                first: "Volodymyr"
                            },
                            isEmployee: true,
                            hireDate: 201604
                        },
                        {
                            _id: "57036c92ec814f7c039b8070",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Hal",
                                first: "Ferents"
                            },
                            isEmployee: true,
                            hireDate: 201604
                        },
                        {
                            _id: "57036bc2ed3f15af0782f168",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Orelskiy",
                                first: "Denis"
                            },
                            isEmployee: true,
                            hireDate: 201604
                        }
                    ]
                },
                {
                    _id: 201605,
                    hiredCount: 1,
                    hiredEmployees: [
                        {
                            _id: "573af7aaefaa86d81d7a587f",
                            department: {
                                _id: "56e6775c5ec71b00429745a4",
                                departmentName: "Admin"
                            },
                            name: {
                                last: "tess",
                                first: "test"
                            },
                            isEmployee: true,
                            hireDate: 201605
                        }
                    ]
                }
            ]
        },
        {
            _id: "fired",
            data: [
                {
                    _id: 201506,
                    firedCount: 1,
                    firedEmployees: [
                        {
                            _id: "55b92ad221e4b7c40f0000bc",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Demchenko",
                                first: "Dmitriy"
                            },
                            isEmployee: false,
                            fireDate: 201506
                        }
                    ]
                },
                {
                    _id: 201507,
                    firedCount: 3,
                    firedEmployees: [
                        {
                            _id: "55b92ad221e4b7c40f0000a6",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Citrak",
                                first: "Norbert"
                            },
                            isEmployee: false,
                            fireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f000071",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Masalovich",
                                first: "Dmitriy"
                            },
                            isEmployee: false,
                            fireDate: 201507
                        },
                        {
                            _id: "55b92ad221e4b7c40f00004c",
                            isLead: 1,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Nayda",
                                first: "Sofia"
                            },
                            isEmployee: false,
                            fireDate: 201507
                        }
                    ]
                },
                {
                    _id: 201508,
                    firedCount: 6,
                    firedEmployees: [
                        {
                            _id: "55cdffa59b42266a4f000015",
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Magar",
                                first: "Dmitriy"
                            },
                            isEmployee: false,
                            fireDate: 201508
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000ab",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Olkhovik",
                                first: "Katerina"
                            },
                            isEmployee: false,
                            fireDate: 201508
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000a9",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Loboda",
                                first: "Andriy"
                            },
                            isEmployee: false,
                            fireDate: 201508
                        },
                        {
                            _id: "55b92ad221e4b7c40f00009d",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Fedynec",
                                first: "Yuriy"
                            },
                            isEmployee: false,
                            fireDate: 201508
                        },
                        {
                            _id: "55b92ad221e4b7c40f00003e",
                            isLead: 1,
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Lapchuk",
                                first: "Alex"
                            },
                            isEmployee: false,
                            fireDate: 201508
                        },
                        {
                            _id: "55b92ad221e4b7c40f00003d",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Kravets",
                                first: "German"
                            },
                            isEmployee: false,
                            fireDate: 201508
                        }
                    ]
                },
                {
                    _id: 201509,
                    firedCount: 7,
                    firedEmployees: [
                        {
                            _id: "55ed5a437221afe30b000006",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Porokhnitska",
                                first: "Yulia"
                            },
                            isEmployee: false,
                            fireDate: 201509
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000ba",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Klochkova",
                                first: "Alexandra"
                            },
                            isEmployee: false,
                            fireDate: 201509
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000b2",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Yeremenko",
                                first: "Michael"
                            },
                            isEmployee: false,
                            fireDate: 201509
                        },
                        {
                            _id: "55b92ad221e4b7c40f000056",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Labjak",
                                first: "Ruslan"
                            },
                            isEmployee: false,
                            fireDate: 201509
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000be",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Borys",
                                first: "Oksana"
                            },
                            isEmployee: false,
                            fireDate: 201509
                        },
                        {
                            _id: "55b92ad221e4b7c40f000074",
                            isLead: 1,
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Kornyk",
                                first: "Ivan"
                            },
                            isEmployee: false,
                            fireDate: 201509
                        },
                        {
                            _id: "55b92ad221e4b7c40f000050",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Holovatska",
                                first: "Tamila"
                            },
                            isEmployee: false,
                            fireDate: 201509
                        }
                    ]
                },
                {
                    _id: 201510,
                    firedCount: 5,
                    firedEmployees: [
                        {
                            _id: "55ded6b3ae2b22730b00004e",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Dimova",
                                first: "Anastasia"
                            },
                            isEmployee: false,
                            fireDate: 201510
                        },
                        {
                            _id: "55b92ad221e4b7c40f00006b",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Kanivets",
                                first: "Dmitriy"
                            },
                            isEmployee: false,
                            fireDate: 201510
                        },
                        {
                            _id: "55b92ad221e4b7c40f00005b",
                            isLead: 2,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Chori",
                                first: "Eduard"
                            },
                            isEmployee: false,
                            fireDate: 201510
                        },
                        {
                            _id: "55b92ad221e4b7c40f000042",
                            isLead: 1,
                            department: {
                                _id: "560c0b83a5d4a2e20ba5068c",
                                departmentName: "Finance"
                            },
                            name: {
                                last: "Myhalko",
                                first: "Artur"
                            },
                            isEmployee: false,
                            fireDate: 201510
                        },
                        {
                            _id: "55b92ad221e4b7c40f000041",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Oleynikov",
                                first: "Eugen"
                            },
                            isEmployee: false,
                            fireDate: 201510
                        }
                    ]
                },
                {
                    _id: 201511,
                    firedCount: 6,
                    firedEmployees: [
                        {
                            _id: "561bc5ca9ebb48212ea838c8",
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Sokalskiy",
                                first: "Andriy"
                            },
                            isEmployee: false,
                            fireDate: 201511
                        },
                        {
                            _id: "55effafa8f1e10e50b000006",
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Pavlenko",
                                first: "Denis"
                            },
                            isEmployee: false,
                            fireDate: 201511
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000a4",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Sokolenko",
                                first: "Eugen"
                            },
                            isEmployee: false,
                            fireDate: 201511
                        },
                        {
                            _id: "55b92ad221e4b7c40f000095",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Kuropyatnik",
                                first: "Oleksiy"
                            },
                            isEmployee: false,
                            fireDate: 201511
                        },
                        {
                            _id: "55b92ad221e4b7c40f00006d",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Tutunnik",
                                first: "Alex"
                            },
                            isEmployee: false,
                            fireDate: 201511
                        },
                        {
                            _id: "55b92ad221e4b7c40f000054",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Derevenko",
                                first: "Yuriy"
                            },
                            isEmployee: false,
                            fireDate: 201511
                        }
                    ]
                },
                {
                    _id: 201512,
                    firedCount: 6,
                    firedEmployees: [
                        {
                            _id: "565c66633410ae512364dc00",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Timochchenko",
                                first: "Alona"
                            },
                            isEmployee: false,
                            fireDate: 201512
                        },
                        {
                            _id: "55fbcb65f9210c860c000005",
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Shamolina",
                                first: "Daria"
                            },
                            isEmployee: false,
                            fireDate: 201512
                        },
                        {
                            _id: "55d1d860dda01e250c000010",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Hoshovsky",
                                first: "Vasiliy"
                            },
                            isEmployee: false,
                            fireDate: 201512
                        },
                        {
                            _id: "55c98b86cbb0f4910b000006",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Kovalenko",
                                first: "Ivan"
                            },
                            isEmployee: false,
                            fireDate: 201512
                        },
                        {
                            _id: "55c98aa7cbb0f4910b000005",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Rechun",
                                first: "Eugen"
                            },
                            isEmployee: false,
                            fireDate: 201512
                        },
                        {
                            _id: "55b92ad221e4b7c40f000039",
                            isLead: 1,
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Rikun",
                                first: "Stas"
                            },
                            isEmployee: false,
                            fireDate: 201512
                        }
                    ]
                },
                {
                    _id: 201601,
                    firedCount: 4,
                    firedEmployees: [
                        {
                            _id: "56938d2cd87c9004552b639e",
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Makarova",
                                first: "Nastya"
                            },
                            isEmployee: false,
                            fireDate: 201601
                        },
                        {
                            _id: "55d1a2b18f61e2c90b000023",
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Degtyar",
                                first: "Sergiy"
                            },
                            isEmployee: false,
                            fireDate: 201601
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000b0",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Donchenko",
                                first: "Roman"
                            },
                            isEmployee: false,
                            fireDate: 201601
                        },
                        {
                            _id: "55b92ad221e4b7c40f000066",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Gromadskiy",
                                first: "Egor"
                            },
                            isEmployee: false,
                            fireDate: 201601
                        }
                    ]
                },
                {
                    _id: 201602,
                    firedCount: 6,
                    firedEmployees: [
                        {
                            _id: "56965733d87c9004552b63be",
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Samokhin",
                                first: "Andriy"
                            },
                            isEmployee: false,
                            fireDate: 201602
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c0",
                            isLead: 0,
                            department: {
                                _id: "560c0b83a5d4a2e20ba5068c",
                                departmentName: "Finance"
                            },
                            name: {
                                last: "Kordas",
                                first: "Oksana"
                            },
                            isEmployee: false,
                            fireDate: 201602
                        },
                        {
                            _id: "55b92ad221e4b7c40f000078",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000011",
                                departmentName: "QA"
                            },
                            name: {
                                last: "Boyanivskiy",
                                first: "Oleg"
                            },
                            isEmployee: false,
                            fireDate: 201602
                        },
                        {
                            _id: "56b9ccd88f23c5696159cd09",
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Antonenko",
                                first: "Artem"
                            },
                            isEmployee: false,
                            fireDate: 201602
                        },
                        {
                            _id: "55b92ad221e4b7c40f000049",
                            isLead: 2,
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Kapustey",
                                first: "Michael"
                            },
                            isEmployee: false,
                            fireDate: 201602
                        },
                        {
                            _id: "55b92ad221e4b7c40f000032",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Sakalo",
                                first: "Bogdan"
                            },
                            isEmployee: false,
                            fireDate: 201602
                        }
                    ]
                },
                {
                    _id: 201603,
                    firedCount: 15,
                    firedEmployees: [
                        {
                            _id: "56d9497dae35cc4f0e721074",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "TESTING",
                                first: "Test"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "56b9d49d8f23c5696159cd0c",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Bed",
                                first: "Kirill"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "56b3412299ce8d706a81b2cd",
                            department: {
                                _id: "566ee11b8453e8b464b70b73",
                                departmentName: "Ruby on Rails"
                            },
                            name: {
                                last: "Kholtobin",
                                first: "Mykola"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "56a0d4b162d172544baf0e3a",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Ilnytskyi",
                                first: "Ihor"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "55b92ad221e4b7c40f000047",
                            isLead: 2,
                            department: {
                                _id: "55b92ace21e4b7c40f00000f",
                                departmentName: "iOS"
                            },
                            name: {
                                last: "Khymych",
                                first: "Ilya"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "55b92ad221e4b7c40f000061",
                            isLead: 2,
                            department: {
                                _id: "55b92ace21e4b7c40f000010",
                                departmentName: "Android"
                            },
                            name: {
                                last: "Mondok",
                                first: "Tamas"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "55c32e0d29bd6ccd0b000005",
                            department: {
                                _id: "56e175c4d62294582e10ca68",
                                departmentName: "Unity"
                            },
                            name: {
                                last: "Alexeev",
                                first: "Eugen"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "56cc7cb7541812c07197357b",
                            department: {
                                _id: "55b92ace21e4b7c40f000015",
                                departmentName: "HR"
                            },
                            name: {
                                last: "Opanasiuk",
                                first: "Bohdana"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "55b92ad221e4b7c40f000094",
                            isLead: 0,
                            department: {
                                _id: "55bb1f40cb76ca630b000007",
                                departmentName: "PM"
                            },
                            name: {
                                last: "Yarosh",
                                first: "Anton"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "55c330d529bd6ccd0b000007",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Yurenko",
                                first: "Alina"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000bb",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Shepinka",
                                first: "Igor"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "55b92ad221e4b7c40f00004a",
                            isLead: 2,
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Ostroverkh",
                                first: "Oleg"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000c9",
                            isLead: 0,
                            department: {
                                _id: "56e175c4d62294582e10ca68",
                                departmentName: "Unity"
                            },
                            name: {
                                first: "Oleksiy",
                                last: "Fedosov"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000a2",
                            isLead: 0,
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Stan",
                                first: "Igor"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        },
                        {
                            _id: "566aa49f4f817b7f51746ec0",
                            department: {
                                _id: "55b92ace21e4b7c40f000016",
                                departmentName: "Web"
                            },
                            name: {
                                last: "Burtnyk",
                                first: "Nataliya"
                            },
                            isEmployee: false,
                            fireDate: 201603
                        }
                    ]
                },
                {
                    _id: 201604,
                    firedCount: 8,
                    firedEmployees: [
                        {
                            _id: "56dd4b727bd21335130c4f95",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Merentsov",
                                first: "Andriy"
                            },
                            isEmployee: false,
                            fireDate: 201604
                        },
                        {
                            _id: "56d06aef541812c0719735c8",
                            department: {
                                _id: "55b92ace21e4b7c40f000013",
                                departmentName: "Marketing"
                            },
                            name: {
                                last: "Garagonich",
                                first: "Liza"
                            },
                            isEmployee: false,
                            fireDate: 201604
                        },
                        {
                            _id: "56c2f2a7dfd8a81466e2f71f",
                            department: {
                                _id: "55b92ace21e4b7c40f000011",
                                departmentName: "QA"
                            },
                            name: {
                                last: "Mateleshka",
                                first: "Viktor"
                            },
                            isEmployee: false,
                            fireDate: 201604
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000ae",
                            isLead: 1,
                            department: {
                                _id: "56e175c4d62294582e10ca68",
                                departmentName: "Unity"
                            },
                            name: {
                                last: "Dolottseva",
                                first: "Tamara"
                            },
                            isEmployee: false,
                            fireDate: 201604
                        },
                        {
                            _id: "55b92ad221e4b7c40f00009a",
                            isLead: 0,
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Pasichnyuk",
                                first: "Katerina"
                            },
                            isEmployee: false,
                            fireDate: 201604
                        },
                        {
                            _id: "56cdd631541812c071973584",
                            department: {
                                _id: "55b92ace21e4b7c40f000014",
                                departmentName: "BusinessDev"
                            },
                            name: {
                                last: "Sheverya",
                                first: "Maryna"
                            },
                            isEmployee: false,
                            fireDate: 201604
                        },
                        {
                            _id: "55b92ad221e4b7c40f0000b1",
                            isLead: 0,
                            department: {
                                _id: "55bb1f14cb76ca630b000006",
                                departmentName: "Design"
                            },
                            name: {
                                last: "Korniyenko",
                                first: "Daniil"
                            },
                            isEmployee: false,
                            fireDate: 201604
                        },
                        {
                            _id: "55b92ad221e4b7c40f000098",
                            isLead: 1,
                            department: {
                                _id: "55b92ace21e4b7c40f000012",
                                departmentName: ".NET/WP"
                            },
                            name: {
                                last: "Krupka",
                                first: "Andriy"
                            },
                            isEmployee: false,
                            fireDate: 201604
                        }
                    ]
                }
            ]
        }
    ];
    var view;
    var indexView;
    var hrCollection;

    describe('HRDashboard', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            view.remove();
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

                server.respondWith('GET', '/modules/', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'HrDashboard'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="74"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="74"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/HrDashboard');

            });

        });

        describe('HrDashboard IndexView', function () {
            var server;
            var clock;
            var indexViewSpy;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                indexViewSpy = sinon.spy(IndexView.prototype, 'initialize');
            });

            after(function () {
                server.restore();
                clock.restore();
                indexViewSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create HrDashboard IndexView', function (done) {
                    var dashboardHrUrl = 'dashboard/hr';

                    server.respondWith('GET', dashboardHrUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDashboardData)]);
                    indexView = new IndexView({});
                    server.respond();
                    clock.tick(200);

                    expect(indexViewSpy.calledOnce).to.be.true;
                    done();
                });
            });
        });
    });
});
