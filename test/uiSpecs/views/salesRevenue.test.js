/*
define([
    'text!fixtures/index.html',
    'views/main/MainView',
    'views/Revenue/index',
    'views/Revenue/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (fixtures, MainView, IndexView, TopBarView, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [
        {
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
        {
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
        {
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
        {
            _id: 24,
            attachments: [ ],
            link: true,
            mname: "Leads",
            parrent: 19,
            sequence: 5,
            visible: true,
            ancestors: [ ],
            href: "Leads"
        },
        {
            _id: 25,
            attachments: [ ],
            link: true,
            mname: "Opportunities",
            parrent: 19,
            sequence: 6,
            visible: true,
            ancestors: [ ],
            href: "Opportunities"
        },
        {
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
        {
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
        {
            _id: 39,
            attachments: [ ],
            link: true,
            mname: "Projects",
            parrent: 36,
            sequence: 21,
            visible: true,
            ancestors: [ ],
            href: "Projects"
        },
        {
            _id: 73,
            mname: "Dashboard Vacation",
            sequence: 22,
            parrent: 36,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "DashBoardVacation"
        },
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
        {
            _id: 54,
            mname: "Purchases",
            sequence: 54,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Purchases"
        },
        {
            _id: 80,
            mname: "Jobs Dashboard",
            sequence: 54,
            parrent: 36,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "jobsDashboard"
        },
        {
            _id: 55,
            mname: "Quotations",
            sequence: 55,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Quotations"
        },
        {
            _id: 57,
            mname: "Order",
            sequence: 56,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Order"
        },
        {
            _id: 56,
            mname: "Invoice",
            sequence: 57,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Invoice"
        },
        {
            _id: 58,
            mname: "Product",
            sequence: 58,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Product"
        },
        {
            _id: 59,
            mname: "Accounting",
            sequence: 59,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Accounting"
        },
        {
            _id: 60,
            mname: "Supplier Payments",
            sequence: 60,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "supplierPayments"
        },
        {
            _id: 61,
            mname: "Sales Payments",
            sequence: 61,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "customerPayments"
        },
        {
            _id: 62,
            mname: "Quotations",
            sequence: 62,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesQuotations"
        },
        {
            _id: 63,
            mname: "Order",
            sequence: 63,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesOrders"
        },
        {
            _id: 64,
            mname: "Invoice",
            sequence: 64,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesInvoice"
        },
        {
            _id: 99,
            mname: "Proforma",
            sequence: 65,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesProforma"
        },
        {
            _id: 67,
            mname: "Revenue",
            sequence: 67,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Revenue"
        },
        {
            _id: 68,
            mname: "MonthHours",
            sequence: 68,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "monthHours"
        },
        {
            _id: 69,
            mname: "Holidays",
            sequence: 69,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Holiday"
        },
        {
            _id: 77,
            mname: "Capacity",
            sequence: 69,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Capacity"
        },
        {
            _id: 88,
            mname: "Salary Report",
            sequence: 69,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salaryReport"
        },
        {
            _id: 70,
            mname: "Vacation",
            sequence: 70,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Vacation"
        },
        {
            _id: 71,
            mname: "Attendance",
            sequence: 71,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Attendance"
        },
        {
            _id: 76,
            mname: "Efficiency",
            sequence: 72,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Efficiency"
        },
        {
            _id: 72,
            mname: "Bonus Type",
            sequence: 73,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "bonusType"
        },
        {
            _id: 74,
            mname: "HrDashboard",
            sequence: 74,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "HrDashboard"
        },
        {
            _id: 66,
            mname: "Payroll Expenses",
            sequence: 77,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "PayrollExpenses"
        },
        {
            _id: 78,
            mname: "Payroll",
            sequence: 78,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Payroll"
        },
        {
            _id: 79,
            mname: "Payroll Payments",
            sequence: 79,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "PayrollPayments"
        },
        {
            _id: 82,
            mname: "Invoice Aging",
            sequence: 82,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "invoiceAging"
        },
        {
            _id: 83,
            mname: "Chart Of Account",
            sequence: 83,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "ChartOfAccount"
        },
        {
            _id: 100,
            mname: "Inventory Report",
            sequence: 83,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "inventoryReport"
        },
        {
            _id: 85,
            mname: "Journal",
            sequence: 85,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "journal"
        },
        {
            _id: 86,
            mname: "Journal Entry",
            sequence: 86,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "journalEntry"
        },
        {
            _id: 87,
            mname: "Invoice Charts",
            sequence: 87,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "invoiceCharts"
        },
        {
            _id: 89,
            mname: "Trial Balance",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "trialBalance"
        },
        {
            _id: 91,
            mname: "Profit And Loss",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "profitAndLoss"
        },
        {
            _id: 92,
            mname: "Balance Sheet",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "balanceSheet"
        },
        {
            _id: 93,
            mname: "Cash Flow",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "cashFlow"
        },
        {
            _id: 94,
            mname: "Close Month",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "closeMonth"
        },
        {
            _id: 96,
            mname: "Expenses",
            sequence: 96,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Expenses"
        },
        {
            _id: 97,
            mname: "Invoice",
            sequence: 97,
            parrent: 96,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "ExpensesInvoice"
        },
        {
            _id: 98,
            mname: "Expenses Payments",
            sequence: 98,
            parrent: 96,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "ExpensesPayments"
        },
        {
            _id: 101,
            mname: "Dividend declaration",
            sequence: 101,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "DividendInvoice"
        },
        {
            _id: 102,
            mname: "Dividend payment",
            sequence: 101,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "DividendPayments"
        },
        {
            _id: 103,
            link: true,
            mname: "Employee",
            parrent: 1,
            sequence: 103,
            visible: true,
            ancestors: [ ],
            href: "settingsEmployee"
        },
        {
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
        {
            _id: 75,
            mname: "tCard",
            sequence: 1000,
            parrent: 36,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "wTrack"
        },
        {
            _id: 84,
            mname: "Product Categories",
            sequence: 1000,
            parrent: 1,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "productSettings"
        }
    ];
    var fakeBonusSalesManager = {
        sales: [
            {
                _id: "55b92ad221e4b7c40f00005f",
                name: "Peter Voloshchuk"
            },
            {
                _id: "55b92ad221e4b7c40f0000cb",
                name: "Alona Yelahina"
            },
            {
                _id: "561b756f9ebb48212ea838c0",
                name: "Stanislav Romanyuk"
            },
            {
                _id: "55b92ad221e4b7c40f0000a2",
                name: "Igor Stan"
            },
            {
                _id: "56123232c90e2fb026ce064b",
                name: "Olga Sikora"
            },
            {
                _id: "55b92ad221e4b7c40f00004a",
                name: "Oleg Ostroverkh"
            },
            {
                _id: "55b92ad221e4b7c40f000040",
                name: "Vasiliy Almashiy"
            },
            {
                _id: "55b92ad221e4b7c40f000063",
                name: "Yana Gusti"
            },
            {
                _id: "55b92ad221e4b7c40f00004f",
                name: "Alex Sokhanych"
            },
            {
                _id: "55b92ad221e4b7c40f00004b",
                name: "Roland Katona"
            },
            {
                _id: "561ba8639ebb48212ea838c4",
                name: "Nataliya Yartysh"
            },
            {
                _id: "55b92ad221e4b7c40f0000a0",
                name: "Ivan Bilak"
            },
            {
                _id: "55b92ad221e4b7c40f0000bb",
                name: "Igor Shepinka"
            }
        ],
        data: [
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 18990.439754229934
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 4569.625356699657
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: -1455.3099113169253
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 41680.26382952898
                    }
                ],
                profitByMonth: 63785.019029141644,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 225296.14857551086,
                totalProfit: 813882.071090609,
                date: 201505
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 28496.629877438394
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 21773.65384802693
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: -6775.306432341364
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 5770.894280558231
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 21110.42984571765
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        profitBySales: 0
                    }
                ],
                profitByMonth: 70376.30141939982,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 0,
                totalProfit: 813882.071090609,
                date: 201506
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 19269.403339637218
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 57561.297680500764
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 8093.743151997952
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 24924.52741501044
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: 4928.327840192785
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        profitBySales: 0
                    }
                ],
                profitByMonth: 114777.29942733915,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 0,
                totalProfit: 813882.071090609,
                date: 201507
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: -3826.344133602396
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 5303.539212166008
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: -24581.398543139898
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 13865.669425769991
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 716.6044418629201
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        profitBySales: 0
                    }
                ],
                profitByMonth: -8521.929596943375,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 0,
                totalProfit: 813882.071090609,
                date: 201508
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 27589.031740605267
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 14545.501785130748
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: -4668.146142110936
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 5791.835126733
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 0
                    }
                ],
                profitByMonth: 43258.22251035808,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 0,
                totalProfit: 813882.071090609,
                date: 201509
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 14350.058018233573
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: -4879.15689963612
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 104448.73807753221
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 1693.4672325293704
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 18906.660232478538
                    }
                ],
                profitByMonth: 134519.76666113758,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 154666.21890705999,
                totalProfit: 813882.071090609,
                date: 201510
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: 3142.0922903299343
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 4017.407827131905
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 5185.661371565417
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 181748.14359642402
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 1531.1243204465325
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        profitBySales: 0
                    }
                ],
                profitByMonth: 195624.4294058978,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 0,
                totalProfit: 813882.071090609,
                date: 201511
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 4272.77284170888
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 113427.47609632858
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: 494.94200531951844
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 20422.540806463687
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 369.54491685301605
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        profitBySales: 0
                    }
                ],
                profitByMonth: 138987.2766666737,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 0,
                totalProfit: 813882.071090609,
                date: 201512
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: 173.92276131996005
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: -18513.919178137872
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 49023.294924395086
                    },
                    {
                        salesPerson: "561b756f9ebb48212ea838c0",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 0
                    }
                ],
                profitByMonth: 30683.29850757718,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 154666.21890705999,
                totalProfit: 813882.071090609,
                date: 201601
            },
            {
                profitBySales: [
                    {
                        salesPerson: "561b756f9ebb48212ea838c0",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 8533.127232023871
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 0
                    }
                ],
                profitByMonth: 8533.127232023871,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 18175.378344248023,
                totalProfit: 813882.071090609,
                date: 201602
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 3375.812787323884
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 3008.034312909753
                    }
                ],
                profitByMonth: 6383.847100233637,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 154666.21890705999,
                totalProfit: 813882.071090609,
                date: 201603
            },
            {
                profitBySales: [
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 0
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 15475.412727769855
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 0
                    }
                ],
                profitByMonth: 15475.412727769855,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 225296.14857551086,
                totalProfit: 813882.071090609,
                date: 201604
            }
        ]
    };
    var fakeBonusProjectManager ={
        sales: [ ],
        data: [ ]
    };
    var fakeProfitProjectManager = {
        sales: [ ],
        data: [ ]
    };
    var fakeProfitSalesManager = {
        sales: [
            {
                _id: "55b92ad221e4b7c40f00005f",
                name: "Peter Voloshchuk"
            },
            {
                _id: "55b92ad221e4b7c40f0000cb",
                name: "Alona Yelahina"
            },
            {
                _id: "561b756f9ebb48212ea838c0",
                name: "Stanislav Romanyuk"
            },
            {
                _id: "55b92ad221e4b7c40f0000a2",
                name: "Igor Stan"
            },
            {
                _id: "56123232c90e2fb026ce064b",
                name: "Olga Sikora"
            },
            {
                _id: "55b92ad221e4b7c40f00004a",
                name: "Oleg Ostroverkh"
            },
            {
                _id: "55b92ad221e4b7c40f000040",
                name: "Vasiliy Almashiy"
            },
            {
                _id: "55b92ad221e4b7c40f000063",
                name: "Yana Gusti"
            },
            {
                _id: "55b92ad221e4b7c40f00004f",
                name: "Alex Sokhanych"
            },
            {
                _id: "55b92ad221e4b7c40f00004b",
                name: "Roland Katona"
            },
            {
                _id: "561ba8639ebb48212ea838c4",
                name: "Nataliya Yartysh"
            },
            {
                _id: "55b92ad221e4b7c40f0000a0",
                name: "Ivan Bilak"
            },
            {
                _id: "55b92ad221e4b7c40f0000bb",
                name: "Igor Shepinka"
            }
        ],
        data: [
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 237380.49692787416,
                        revenueBySales: 1090213
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 57120.31695874571,
                        revenueBySales: 204000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: -6655.850525136937,
                        revenueBySales: 183900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 416802.63829528977,
                        revenueBySales: 1018700
                    }
                ],
                profitByMonth: 704647.6016567727,
                revenueByMonth: 2496813,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 8462457.934606481,
                totalRevenueBySales: 40000200,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201505
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 356207.87346797995,
                        revenueBySales: 1217100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 156261.45287586047,
                        revenueBySales: 2364200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: -43968.221397596026,
                        revenueBySales: 371000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 302353.5111111136,
                        revenueBySales: 1625000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 288544.71402791154,
                        revenueBySales: 985600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        profitBySales: 75609.46058471063,
                        revenueBySales: 1158000
                    }
                ],
                profitByMonth: 1135008.7906699802,
                revenueByMonth: 7720900,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 232845.93344714638,
                totalRevenueBySales: 1642000,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201506
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 718608.2917876679,
                        revenueBySales: 2828300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 240867.54174546522,
                        revenueBySales: 1026800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: 32951.42046060708,
                        revenueBySales: 431400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 404687.1575998976,
                        revenueBySales: 1150000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        profitBySales: 175675.5695448715,
                        revenueBySales: 515200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 378215.644782383,
                        revenueBySales: 1688507
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        profitBySales: 167187.28068931153,
                        revenueBySales: 300000
                    }
                ],
                profitByMonth: 2118192.906610203,
                revenueByMonth: 7940207,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 232845.93344714638,
                totalRevenueBySales: 1642000,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201507
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 66294.2401520751,
                        revenueBySales: 300000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 66479.42694326557,
                        revenueBySales: 759000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: -172568.00057610578,
                        revenueBySales: 508500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 220005.76728027593,
                        revenueBySales: 1305500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 35830.222093146,
                        revenueBySales: 215600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004f",
                        profitBySales: -9950.807826875767,
                        revenueBySales: 184000
                    }
                ],
                profitByMonth: 206090.84806578112,
                revenueByMonth: 3272600,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 232845.93344714638,
                totalRevenueBySales: 1642000,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201508
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 268011.835219747,
                        revenueBySales: 484800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 72397.9390841625,
                        revenueBySales: 939900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 740755.92059729,
                        revenueBySales: 3076700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 242645.86078267836,
                        revenueBySales: 1147700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: -29721.737168518546,
                        revenueBySales: 149100
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 379546.0196568334,
                        revenueBySales: 850400
                    }
                ],
                profitByMonth: 1673635.838172193,
                revenueByMonth: 6648600,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 1831196.7127905923,
                totalRevenueBySales: 4167800,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201509
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 146629.81175811053,
                        revenueBySales: 680000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 179375.72522791967,
                        revenueBySales: 1324000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: -34048.93476733291,
                        revenueBySales: 105900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 1640491.7234759973,
                        revenueBySales: 7422900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 84673.36162646851,
                        revenueBySales: 178200
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 330374.0230282962,
                        revenueBySales: 705000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 564760.4903445566,
                        revenueBySales: 1887900
                    }
                ],
                profitByMonth: 2912256.2006940157,
                revenueByMonth: 12303900,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 3801831.160762262,
                totalRevenueBySales: 15146220,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201510
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 2271851.7949553,
                        revenueBySales: 7130500
                    },
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 535988.974981517,
                        revenueBySales: 1200000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a0",
                        profitBySales: 156734.45965104902,
                        revenueBySales: 288900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 834149.3775753139,
                        revenueBySales: 7783600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 309070.4672774795,
                        revenueBySales: 1408500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 850658.3954540767,
                        revenueBySales: 1889400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 164129.7760603454,
                        revenueBySales: 274600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: 26166.176544182897,
                        revenueBySales: 197200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        profitBySales: 623537.8774521826,
                        revenueBySales: 1253200
                    }
                ],
                profitByMonth: 5772287.299951446,
                revenueByMonth: 21425900,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 1431093.2514903452,
                totalRevenueBySales: 3479400,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201511
            },
            {
                profitBySales: [
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 224116.8342738158,
                        revenueBySales: 498800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 290221.59845190466,
                        revenueBySales: 668800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 1417843.4512041071,
                        revenueBySales: 3542400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: 3546.281827360006,
                        revenueBySales: 87900
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 764621.4598083092,
                        revenueBySales: 2210800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 2732090.517544141,
                        revenueBySales: 7695400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 18477.245842650802,
                        revenueBySales: 66000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        profitBySales: 209089.8481932779,
                        revenueBySales: 533000
                    }
                ],
                profitByMonth: 5660007.2371455645,
                revenueByMonth: 15303100,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 1431093.2514903452,
                totalRevenueBySales: 3479400,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201512
            },
            {
                profitBySales: [
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 190588.4398862723,
                        revenueBySales: 432000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 277783.03467674745,
                        revenueBySales: 502800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000063",
                        profitBySales: 3588.785160527461,
                        revenueBySales: 95300
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 612791.1865549386,
                        revenueBySales: 1730100
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 1499954.8737594497,
                        revenueBySales: 6047100
                    },
                    {
                        salesPerson: "561b756f9ebb48212ea838c0",
                        profitBySales: -134811.75294304476,
                        revenueBySales: 1866000
                    },
                    {
                        salesPerson: "561ba8639ebb48212ea838c4",
                        profitBySales: 213837.50639171954,
                        revenueBySales: 269700
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000cb",
                        profitBySales: 598465.5258448848,
                        revenueBySales: 1693200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 234533.49741781788,
                        revenueBySales: 776300
                    }
                ],
                profitByMonth: 3496731.096749313,
                revenueByMonth: 13412500,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 3801831.160762262,
                totalRevenueBySales: 15146220,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201601
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 106664.09040029839,
                        revenueBySales: 409400
                    },
                    {
                        salesPerson: "561b756f9ebb48212ea838c0",
                        profitBySales: 145233.74420222855,
                        revenueBySales: 668400
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 260057.19192504487,
                        revenueBySales: 1407000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 116603.05107664462,
                        revenueBySales: 499800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000a2",
                        profitBySales: 34691.59206625538,
                        revenueBySales: 145000
                    }
                ],
                profitByMonth: 663249.6696704719,
                revenueByMonth: 3129600,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 1031034.0693166752,
                totalRevenueBySales: 3015000,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201602
            },
            {
                profitBySales: [
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 42197.65984154855,
                        revenueBySales: 169500
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f0000bb",
                        profitBySales: 31423.650891927122,
                        revenueBySales: 80000
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: 82314.6542544344,
                        revenueBySales: 558800
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004b",
                        profitBySales: 50133.90521516255,
                        revenueBySales: 76800
                    }
                ],
                profitByMonth: 206069.8702030726,
                revenueByMonth: 885100,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 3801831.160762262,
                totalRevenueBySales: 15146220,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201603
            },
            {
                profitBySales: [
                    {
                        salesPerson: "56123232c90e2fb026ce064b",
                        profitBySales: 170582.42096385796,
                        revenueBySales: 481600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f000040",
                        profitBySales: 306005.53839318873,
                        revenueBySales: 1134200
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00005f",
                        profitBySales: 193442.6590971232,
                        revenueBySales: 689600
                    },
                    {
                        salesPerson: "55b92ad221e4b7c40f00004a",
                        profitBySales: -43943.93376426253,
                        revenueBySales: 1874700
                    }
                ],
                profitByMonth: 626086.6846899074,
                revenueByMonth: 4180100,
                salesArray: [
                    {
                        _id: "55b92ad221e4b7c40f00005f",
                        name: "Peter Voloshchuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000cb",
                        name: "Alona Yelahina"
                    },
                    {
                        _id: "561b756f9ebb48212ea838c0",
                        name: "Stanislav Romanyuk"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a2",
                        name: "Igor Stan"
                    },
                    {
                        _id: "56123232c90e2fb026ce064b",
                        name: "Olga Sikora"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004a",
                        name: "Oleg Ostroverkh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000040",
                        name: "Vasiliy Almashiy"
                    },
                    {
                        _id: "55b92ad221e4b7c40f000063",
                        name: "Yana Gusti"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004f",
                        name: "Alex Sokhanych"
                    },
                    {
                        _id: "55b92ad221e4b7c40f00004b",
                        name: "Roland Katona"
                    },
                    {
                        _id: "561ba8639ebb48212ea838c4",
                        name: "Nataliya Yartysh"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000a0",
                        name: "Ivan Bilak"
                    },
                    {
                        _id: "55b92ad221e4b7c40f0000bb",
                        name: "Igor Shepinka"
                    }
                ],
                totalProfitBySales: 8462457.934606481,
                totalRevenueBySales: 40000200,
                totalProfit: 25174264.04427871,
                totalRevenue: 98719320,
                date: 201604
            }
        ]
    };
    var view;
    var topBarView;
    var indexView;

    describe('SettingsEmployee', function () {

        var $fixture;
        var $elFixture;
        before(function(){

        });

        after(function () {
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
                view = new MainView({el: $elFixture, contentType: 'Revenue'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="67"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="67"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Revenue');
            });

        });

        describe('TopBarView', function () {
            var clock;

            before(function(){
                clock = sinon.useFakeTimers();
            });

            after(function(){
                clock.restore();
            });

            it('Try to create TopBarView', function(done){
                topBarView = new TopBarView({});

                clock.tick(200);

                //expect(topBarView.$el.find('h3')).to.exist;
                //expect(topBarView.$el.find('h3').text()).to.be.equals('Profit');
                //expect(topBarView.$el.find('.vocationFilter')).to.exist;

                done();
            });
        });

        describe('RevenueView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var windowConfirmStub;
            var alertStub;

            before(function () {
                App.startPreload = function() {
                    App.preloaderShowFlag = true;
                    $('#loading').show();
                };

                App.stopPreload = function() {
                    App.preloaderShowFlag = false;
                    $('#loading').hide();
                };

                App.currentDb = 'michelDb';

                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);

            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                alertStub.restore();
                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create CloseMonthListView', function (done) {
                    var bonusSalesManUrl = new RegExp('\/revenue\/allBonusBySales\/salesManager', 'i');
                    var bonusProjManUrl = new RegExp('\/revenue\/allBonusBySales\/projectsManager', 'i');
                    var profitSalesManUrl = new RegExp('\/revenue\/profit\/salesManager', 'i');
                    var profitProjManUrl = new RegExp('\/revenue\/profit\/projectsManager', 'i');

                    server.respondWith('GET', bonusSalesManUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeBonusSalesManager)]);
                    server.respondWith('GET', bonusProjManUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeBonusProjectManager)]);
                    server.respondWith('GET', profitSalesManUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProfitSalesManager)]);
                    server.respondWith('GET', profitProjManUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProfitProjectManager)]);
                    indexView = new IndexView({
                        startTime: new Date()
                    });
                    server.respond();
                    server.respond();
                    server.respond();
                    server.respond();
                    clock.tick(300);

                    $thisEl = indexView.$el;
                    done();
                });

                /!*it('Try to go to EditDialog', function(){
                    var $needTd = $thisEl.find('#weeklyScheduler tr:nth-child(1) > td:nth-child(2)');

                    $needTd.click();
                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to edit item', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#weeklySchedulerName > input');
                    var $mondayInput = $dialog.find('td[data-content="1"] > input');
                    var $saveBtn = $dialog.find('#create-weeklyScheduler-dialog');
                    var keyUpEvent = $.Event('keyup');
                    var scheduleUrl = new RegExp('weeklyScheduler\/', 'i');
                    var weekScheduleUrl = new RegExp('\/weeklyScheduler\/list', 'i');
                    var spyResponse;

                    $nameInput.val('');
                    $mondayInput.val('3');
                    $mondayInput.trigger(keyUpEvent);

                    //save with empty name
                    $saveBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');

                    //save with hours > 24
                    $nameInput.val('Test');
                    $mondayInput.val('25');
                    $saveBtn.click();
                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'hours should be in 0-24 range');

                    //save with error response
                    $mondayInput.val('3');
                    server.respondWith('PATCH', scheduleUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    server.respondWith('GET', weekScheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSchedule)]);
                    server.respondWith('PATCH', scheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"1":8,"2":8,"3":8,"4":8,"5":8,"6":0,"7":0,"_id":"57332c3b94ee1140b6bb49e2","totalHours":40,"name":"UA-40"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try cancel EditDialog', function(){
                    var $needTd = $thisEl.find('#weeklyScheduler tr:nth-child(1) > td:nth-child(2)');
                    var $cancelBtn;

                    $needTd.click();
                    expect($('.ui-dialog')).to.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to delete schedule item', function(){
                    var $deleteBtn = $thisEl.find('.fa-trash-o').eq(1);
                    var scheduleUrl = new RegExp('\/weeklyScheduler\/', 'i');

                    server.respondWith('DELETE', scheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"1":4,"2":4,"3":4,"4":4,"5":4,"6":0,"7":0,"_id":"573add0245310a4662c8005b","__v":0,"totalHours":20,"name":"UA-20"})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteScheduleSpy.calledOnce).to.be.true;
                });

                it('Try to create schedule item', function(){
                    mainSpy.reset();

                    var $createBtn = $thisEl.find('#weeklyScheduler .fa-plus');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.exist;

                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#weeklySchedulerName > input');
                    var $mondayInput = $dialog.find('td[data-content="1"] > input');
                    var $saveBtn = $dialog.find('#create-weeklyScheduler-dialog');
                    var keyUpEvent = $.Event('keyup');
                    var scheduleUrl = 'weeklyScheduler';
                    var weekScheduleUrl = new RegExp('\/weeklyScheduler\/list', 'i');
                    var spyResponse;

                    $nameInput.val('');
                    $mondayInput.val('3');
                    $mondayInput.trigger(keyUpEvent);

                    //save with empty name
                    $saveBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');

                    //save with hours > 24
                    $nameInput.val('Test');
                    $mondayInput.val('25');
                    $saveBtn.click();
                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'hours should be in 0-24 range');

                    $mondayInput.val('3');
                    server.respondWith('GET', weekScheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSchedule)]);
                    server.respondWith('POST', scheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"__v":0,"_id":"573f35b5a7312792307f9e50","totalHours":0,"name":"sf"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try cancel CreateDialog', function(){
                    var $createBtn = $thisEl.find('#weeklyScheduler .fa-plus');
                    var $cancelBtn;

                    $createBtn.click();
                    expect($('.ui-dialog')).to.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                // payRollEarning views testing
                it('Try to go to EditDialog', function(){
                    var $needTd = $thisEl.find('#listTableearnings > tr:nth-child(1) > td:nth-child(2)');

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save payroll earning with empty name', function(){
                    mainSpy.reset();

                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $nameInput.val('');
                    $saveBtn.click();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try to save model with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('\/payrollComponentTypes\/', 'i');

                    $nameInput.val('Test');

                    server.respondWith('PATCH', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save model with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEarning)]);
                    server.respondWith('PATCH', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"_id":"573edafcf9281fb40d5db50a","__v":0,"description":"fff","type":"earnings","name":"ffff"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel EditDialog', function(){
                    var $needTd = $thisEl.find('#listTableearnings > tr:nth-child(1) > td:nth-child(2)');
                    var $cancelBtn;

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to remove Payroll earning type item', function(){
                    var $deleteBtn = $thisEl.find('#earningType .fa-trash-o');
                    var deleteUrl = new RegExp('\/payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEarning)]);
                    server.respondWith('DELETE', deleteUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        _id: "573edafcf9281fb40d5db50a",
                        __v: 0,
                        description: "fff",
                        type: "earnings",
                        name: "fff"
                    })]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect(deletePayrollSpy.calledOnce).to.be.true;
                });

                it('Try to open CreateDialog', function(){
                    var $createBtn = $thisEl.find('#earningType #top-bar-createBtn');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to create PayRollEarning Type item with empty name', function(){
                    mainSpy.reset();

                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $createBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try create item with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('\/payrollComponentTypes', 'i');

                    $nameInput.val('Test');

                    server.respondWith('POST', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $createBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to create item with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('payrollComponentTypes', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEarning)]);
                    server.respondWith('POST', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"__v":0,"_id":"5742ecdf7afe352f10c11c3a","description":"Test test","type":"earnings","name":"TestName"})]);
                    $createBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel CreateDialog', function(){
                    var $createBtn = $thisEl.find('#earningType #top-bar-createBtn');
                    var $cancelBtn;

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();
                    expect($('.ui-dialog')).to.not.exist;
                });

                // payRollDeduction views testing
                it('Try to go to EditDialog', function(){
                    var $needTd = $thisEl.find('#listTabledeductions > tr:nth-child(1) > td:nth-child(2)');

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save payroll deduction with empty name', function(){
                    mainSpy.reset();

                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $nameInput.val('');
                    $saveBtn.click();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try to save model with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('\/payrollComponentTypes\/', 'i');

                    $nameInput.val('Test');

                    server.respondWith('PATCH', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    //expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save model with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=deductions';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDeductions)]);
                    server.respondWith('PATCH', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"_id":"5742ee217afe352f10c11c3b","__v":0,"description":"asdsd","type":"deductions","name":"sdsa"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel EditDialog', function(){
                    var $needTd = $thisEl.find('#listTabledeductions > tr:nth-child(1) > td:nth-child(2)');
                    var $cancelBtn;

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to remove Payroll deduction type item', function(){
                    var $deleteBtn = $thisEl.find('#deductionType .fa-trash-o');
                    var deleteUrl = new RegExp('\/payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDeductions)]);
                    server.respondWith('DELETE', deleteUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"_id":"5742ee217afe352f10c11c3b","__v":0,"description":"asdsd","type":"deductions","name":"sdsa"})]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect(deletePayrollSpy.calledTwice).to.be.true;
                });

                it('Try to open CreateDialog', function(){
                    var $createBtn = $thisEl.find('#deductionType #top-bar-createBtn');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to create PayRollDeduction Type item with empty name', function(){
                    mainSpy.reset();

                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $createBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try create item with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('\/payrollComponentTypes\/', 'i');

                    $nameInput.val('Test');

                    server.respondWith('POST', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $createBtn.click();
                    server.respond();

                    //expect($('.ui-dialog')).to.be.exist;
                });


                it('Try to create item with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('payrollComponentTypes', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=deductions';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDeductions)]);
                    server.respondWith('POST', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"__v":0,"_id":"5742ef4d7afe352f10c11c3c","description":"Test","type":"deductions","name":"TestName"})]);
                    $createBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel CreateDialog', function(){
                    var $createBtn = $thisEl.find('#deductionType #top-bar-createBtn');
                    var $cancelBtn;

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();
                    expect($('.ui-dialog')).to.not.exist;
                });*!/
            });
        });
    });
});
*/
