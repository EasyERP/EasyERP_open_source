define([
    'text!fixtures/index.html',
    'collections/bonusType/filterCollection',
    'views/main/MainView',
    'views/bonusType/list/ListView',
    'views/bonusType/TopBarView',
    'views/bonusType/CreateView',
    'views/bonusType/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, BonusTypeCollection, MainView, ListView, TopBarView, CreateView, EditView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var fakeBonusTypes = [
        {
            _id: "55b92ad521e4b7c40f000602",
            isPercent: true,
            value: 8,
            name: "Sales/Head 8%",
            ID: 2,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000603",
            isPercent: true,
            value: 6,
            name: "Sales/Usual 6%",
            ID: 3,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000604",
            isPercent: true,
            value: 2,
            name: "Sales/Ref 2%",
            ID: 4,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000605",
            isPercent: true,
            value: 16,
            name: "Sales/QA 16%",
            ID: 5,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000606",
            isPercent: true,
            value: 14,
            name: "Sales/QA 14%",
            ID: 6,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000607",
            isPercent: true,
            value: 8,
            name: "Sales/QA 8%",
            ID: 7,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000608",
            isPercent: true,
            value: 8,
            name: "Sales/Usual 8%",
            ID: 8,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000609",
            isPercent: true,
            value: 10,
            name: "Sales/Head 10%",
            ID: 9,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f00060a",
            isPercent: true,
            value: 1.5,
            name: "PM Junior/Usual 1.5%",
            ID: 10,
            __v: 0,
            bonusType: "PM"
        },
        {
            _id: "55b92ad521e4b7c40f00060b",
            isPercent: false,
            value: 30,
            name: "PM Base/Junior",
            ID: 12,
            __v: 0,
            bonusType: "PM"
        },
        {
            _id: "56053965cdc112333a000009",
            name: "hjkhg",
            value: 6,
            isPercent: true,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "5605396a82ca87623a00000b",
            name: "hjkhgytryt",
            value: 6,
            isPercent: true,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "560eaaa5c90e2fb026ce061e",
            name: "Sales/Usual 4%",
            value: 4,
            isPercent: true,
            __v: 0,
            bonusType: "Sales"
        }
    ];

    var fakeSortedDownBonusType = [
        {
            _id: "55b92ad521e4b7c40f000602",
            isPercent: true,
            value: 8,
            name: "Sales/Head 8%",
            ID: 2,
            __v: 0,
            bonusType: "HR"
        },
        {
            _id: "55b92ad521e4b7c40f00060a",
            isPercent: true,
            value: 1.5,
            name: "PM Junior/Usual 1.5%",
            ID: 10,
            __v: 0,
            bonusType: "PM"
        },
        {
            _id: "55b92ad521e4b7c40f00060b",
            isPercent: false,
            value: 30,
            name: "PM Base/Junior",
            ID: 12,
            __v: 0,
            bonusType: "PM"
        },
        {
            _id: "56e2ed3f3abb6ba70f73ae93",
            name: "dfg",
            value: 9,
            isPercent: true,
            __v: 0,
            bonusType: "PM"
        },
        {
            _id: "56e2fb7e3abb6ba70f73ae94",
            name: "df",
            value: 9,
            isPercent: false,
            __v: 0,
            bonusType: "PM"
        },
        {
            _id: "55b92ad521e4b7c40f000603",
            isPercent: true,
            value: 6,
            name: "Sales/Usual 6%",
            ID: 3,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000604",
            isPercent: true,
            value: 2,
            name: "Sales/Ref 2%",
            ID: 4,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000605",
            isPercent: true,
            value: 16,
            name: "Sales/QA 16%",
            ID: 5,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000606",
            isPercent: true,
            value: 14,
            name: "Sales/QA 14%",
            ID: 6,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000607",
            isPercent: true,
            value: 8,
            name: "Sales/QA 8%",
            ID: 7,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000608",
            isPercent: true,
            value: 8,
            name: "Sales/Usual 8%",
            ID: 8,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000609",
            isPercent: true,
            value: 10,
            name: "Sales/Head 10%",
            ID: 9,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "56053965cdc112333a000009",
            name: "hjkhg",
            value: 6,
            isPercent: true,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "5605396a82ca87623a00000b",
            name: "hjkhgytryt",
            value: 6,
            isPercent: true,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "560eaaa5c90e2fb026ce061e",
            name: "Sales/Usual 4%",
            value: 4,
            isPercent: true,
            __v: 0,
            bonusType: "Sales"
        }
    ];

    var fakeSortedUpBonusType = [
        {
            _id: "55b92ad521e4b7c40f000603",
            isPercent: true,
            value: 6,
            name: "Sales/Usual 6%",
            ID: 3,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000604",
            isPercent: true,
            value: 2,
            name: "Sales/Ref 2%",
            ID: 4,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000605",
            isPercent: true,
            value: 16,
            name: "Sales/QA 16%",
            ID: 5,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000606",
            isPercent: true,
            value: 14,
            name: "Sales/QA 14%",
            ID: 6,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000607",
            isPercent: true,
            value: 8,
            name: "Sales/QA 8%",
            ID: 7,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000608",
            isPercent: true,
            value: 8,
            name: "Sales/Usual 8%",
            ID: 8,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f000609",
            isPercent: true,
            value: 10,
            name: "Sales/Head 10%",
            ID: 9,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "56053965cdc112333a000009",
            name: "hjkhg",
            value: 6,
            isPercent: true,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "5605396a82ca87623a00000b",
            name: "hjkhgytryt",
            value: 6,
            isPercent: true,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "560eaaa5c90e2fb026ce061e",
            name: "Sales/Usual 4%",
            value: 4,
            isPercent: true,
            __v: 0,
            bonusType: "Sales"
        },
        {
            _id: "55b92ad521e4b7c40f00060a",
            isPercent: true,
            value: 1.5,
            name: "PM Junior/Usual 1.5%",
            ID: 10,
            __v: 0,
            bonusType: "PM"
        },
        {
            _id: "55b92ad521e4b7c40f00060b",
            isPercent: false,
            value: 30,
            name: "PM Base/Junior",
            ID: 12,
            __v: 0,
            bonusType: "PM"
        },
        {
            _id: "56e2ed3f3abb6ba70f73ae93",
            name: "dfg",
            value: 9,
            isPercent: true,
            __v: 0,
            bonusType: "PM"
        },
        {
            _id: "56e2fb7e3abb6ba70f73ae94",
            name: "df",
            value: 9,
            isPercent: false,
            __v: 0,
            bonusType: "PM"
        },
        {
            _id: "55b92ad521e4b7c40f000602",
            isPercent: true,
            value: 8,
            name: "Sales/Head 8%",
            ID: 2,
            __v: 0,
            bonusType: "HR"
        }
    ];

    var bonusTypesCollection;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;

    describe('BonusTypes View', function () {
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

                view = new MainView({el: $elFixture, contentType: 'Holiday'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="72"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="72"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/bonusType');

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
                var bonusTypeUrl = new RegExp('\/bonusType\/list', 'i');

                server.respondWith('GET', bonusTypeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeBonusTypes)]);

                bonusTypesCollection = new BonusTypeCollection({
                    viewType: 'list',
                    page: 1,
                    count: 13
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: bonusTypesCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

        });

        describe('BonusType list view', function () {
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

                it('Try to create bonusType list view', function (done) {
                    var bonusTypeTotalCollUrl = new RegExp('\/bonusType\/list\/totalCollectionLength', 'i');
                    var $listHolder;

                    setTimeout(function(){
                        server.respondWith('GET', bonusTypeTotalCollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                            count: 13
                        })]);

                        listView = new ListView({
                            collection: bonusTypesCollection,
                            startTime: new Date()
                        });

                        server.respond();

                        $listHolder = listView.$el;

                        expect($listHolder.find('table')).to.exist;

                        done();
                    }, 50);

                });

                it('Try to delete item', function () {
                    var bonusTypeUrl = new RegExp('\/bonusType\/', 'i');
                    var $firstEl = $(listView.$el.find('#listTable input')[0]);
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    windowConfirmStub.returns(true);

                    $firstEl.prop('checked', true);

                    server.respondWith('DELETE', bonusTypeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);

                    $deleteBtn.click();

                    listView.deleteItems();

                    server.respond();

                    $firstEl.click();

                });

                it('Try to create item', function(){
                    var $nameInput;
                    var $bonusTypeInput;
                    var $valueInput;
                    var $isPercentInput;
                    var $input;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');
                    var $newSelectEl;

                    $createBtn.click();
                    listView.createItem();

                    $nameInput = listView.$el.find('td[data-content="name"]')[0];
                    $bonusTypeInput = listView.$el.find('td[data-content="bonusType"]')[0];
                    $valueInput = listView.$el.find('td[data-content="value"]')[0];
                    $isPercentInput = listView.$el.find('td[data-content="isPercent"]')[0];

                    $nameInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('test');

                    $bonusTypeInput.click();
                    $newSelectEl = listView.$el.find('.newSelectList li')[0];
                    $newSelectEl.click();

                    $valueInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('15');

                    $isPercentInput.click();
                    $newSelectEl = listView.$el.find('.newSelectList li')[0];
                    $newSelectEl.click();

                    server.respondWith('POST', '/bonusType/', [200, {"Content-Type": "application/json"}, JSON.stringify({"success":{"__v":0,"date":"2016-03-11T22:00:00.000Z","year":null,"week":null,"_id":"56e2cd4a3abb6ba70f73ad73"}})]);

                    $saveBtn.click();
                    listView.saveItem();

                    server.respond();

                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);

                });

                it('Try to edit item', function(){
                    var $input;
                    var $valueInput = listView.$el.find('td[data-content="value"]')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $body = $('body');
                    var $tableContainer = listView.$el.find('table');

                    $valueInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('17');

                    $body.click();

                    server.respondWith('PATCH', '/bonusType/', [200, {"Content-Type": "application/json"}, JSON.stringify({"success":{"__v":0,"date":"2016-03-11T22:00:00.000Z","year":null,"week":null,"_id":"56e2cd4a3abb6ba70f73ad73"}})]);

                    $saveBtn.click();
                    listView.saveItem();

                    server.respond();

                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);
                    expect($(listView.$el.find('td[data-content="value"]')[0]).text()).to.be.equals('17');

                });

                it ('Try to sort down list', function(){
                    var $sortTypeBtn = listView.$el.find('th[data-sort="bonusType"]');
                    var bonusTypeUrl = new RegExp('\/bonusType\/list', 'i');
                    var totalCollUrl = new RegExp('\/bonusType\/list\/totalCollectionLength', 'i')
                    var $bonusTypeInput;

                    server.respondWith('GET', bonusTypeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSortedDownBonusType)]);
                    server.respondWith('GET', totalCollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 15
                    })]);

                    $sortTypeBtn.click();

                    server.respond();

                    $bonusTypeInput = $(listView.$el.find('td[data-content="bonusType"]')[0]);

                    expect($bonusTypeInput.text()).to.be.equals('HR');

                });

                it ('Try to sort up list', function(){
                    var $sortTypeBtn = listView.$el.find('th[data-sort="bonusType"]');
                    var bonusTypeUrl = new RegExp('\/bonusType\/list', 'i');
                    var totalCollUrl = new RegExp('\/bonusType\/list\/totalCollectionLength', 'i')
                    var $bonusTypeInput;

                    server.respondWith('GET', bonusTypeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSortedUpBonusType)]);
                    server.respondWith('GET', totalCollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 15
                    })]);

                    $sortTypeBtn.click();

                    server.respond();

                    $bonusTypeInput = $(listView.$el.find('td[data-content="bonusType"]')[0]);

                    expect($bonusTypeInput.text()).to.be.equals('Sales');

                });


            });

        });

    });

});
