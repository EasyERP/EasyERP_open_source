/*
define([
    'text!fixtures/index.html',
    'collections/Holiday/filterCollection',
    'views/main/MainView',
    'views/Holiday/list/ListView',
    'views/Holiday/TopBarView',
    'views/Holiday/CreateView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, HolidaysCollection, MainView, ListView, TopBarView,  CreateView, $, chai, chaiJquery, sinonChai, Custom, async) {
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

    var fakeHoliday = {
        success: [
            {
                _id: "569fa6fc62d172544baf0db9",
                date: "2016-10-13T22:00:00.000Z",
                year: 2016,
                week: 41,
                comment: "Defender of Ukraine Day",
                __v: 0
            },
            {
                _id: "55b92ad421e4b7c40f00056d",
                comment: "Independence Day Ukraine",
                date: "2016-08-23T22:00:00.000Z",
                ID: 19,
                year: 2015,
                week: 35,
                __v: 0
            },
            {
                _id: "55b92ad421e4b7c40f00056b",
                comment: "Constitution Day Ukraine",
                date: "2016-06-27T22:00:00.000Z",
                ID: 17,
                year: 2015,
                week: 26,
                __v: 0
            },
            {
                _id: "569fa5cc62d172544baf0db1",
                date: "2016-06-19T22:00:00.000Z",
                comment: "Orthodox Trinity",
                year: 2016,
                week: 25,
                __v: 0
            },
            {
                _id: "55b92ad421e4b7c40f00056a",
                comment: "Orthodox Trinity",
                date: "2016-06-18T22:00:00.000Z",
                ID: 16,
                year: 2016,
                week: 24,
                __v: 0
            },
            {
                _id: "55b92ad421e4b7c40f000566",
                comment: "Victory and Commemoration Day",
                date: "2016-05-08T22:00:00.000Z",
                ID: 12,
                year: 2016,
                week: 19,
                __v: 0
            },
            {
                _id: "55b92ad421e4b7c40f000564",
                comment: "Labour Day",
                date: "2016-05-02T22:00:00.000Z",
                ID: 10,
                year: 2015,
                week: 18,
                __v: 0
            },
            {
                _id: "55b92ad421e4b7c40f000563",
                comment: "Labour Day",
                date: "2016-05-01T22:00:00.000Z",
                ID: 9,
                year: 2015,
                week: 18,
                __v: 0
            },
            {
                _id: "55b92ad421e4b7c40f000561",
                comment: "Orthodox Easter",
                date: "2016-04-30T22:00:00.000Z",
                ID: 7,
                year: 2016,
                week: 17,
                __v: 0
            },
            {
                _id: "55b92ad421e4b7c40f00055e",
                comment: "International Womens Day",
                date: "2016-03-07T23:00:00.000Z",
                ID: 4,
                year: 2015,
                week: 10,
                __v: 0
            },
            {
                _id: "55b92ad421e4b7c40f00055c",
                comment: "Christmas",
                date: "2016-01-06T23:00:00.000Z",
                ID: 2,
                year: 2016,
                week: 1,
                __v: 0
            },
            {
                _id: "55b92ad421e4b7c40f00055b",
                comment: "New Year",
                date: "2015-12-31T23:00:00.000Z",
                ID: 1,
                year: 2016,
                week: 53,
                __v: 0
            },
            {
                _id: "569fae9262d172544baf0de7",
                date: "2015-10-13T22:00:00.000Z",
                comment: "Defender of Ukraine Day",
                year: 2015,
                week: 42,
                __v: 0
            },
            {
                _id: "569fadb562d172544baf0de5",
                date: "2015-08-23T22:00:00.000Z",
                comment: "Independence Day Ukraine",
                year: 2015,
                week: 35,
                __v: 0
            },
            {
                _id: "569fae0462d172544baf0de6",
                date: "2015-06-28T22:00:00.000Z",
                comment: "Constitution Day Ukraine",
                year: 2015,
                week: 27,
                __v: 0
            },
            {
                _id: "569fad7f62d172544baf0de4",
                date: "2015-06-27T22:00:00.000Z",
                comment: "Constitution Day Ukraine",
                year: 2015,
                week: 26,
                __v: 0
            },
            {
                _id: "569fad5b62d172544baf0de3",
                date: "2015-05-31T22:00:00.000Z",
                comment: "Orthodox Trinity",
                year: 2015,
                week: 23,
                __v: 0
            },
            {
                _id: "569fad3e62d172544baf0de2",
                date: "2015-05-30T22:00:00.000Z",
                comment: "Orthodox Trinity",
                year: 2015,
                week: 22,
                __v: 0
            },
            {
                _id: "569facef62d172544baf0ddb",
                date: "2015-05-10T22:00:00.000Z",
                comment: "Victory and Commemoration Day",
                year: 2015,
                week: 20,
                __v: 0
            },
            {
                _id: "569fad1562d172544baf0ddc",
                date: "2015-05-08T22:00:00.000Z",
                comment: "Victory and Commemoration Day",
                year: 2015,
                week: 19,
                __v: 0
            },
            {
                _id: "569fac8a62d172544baf0dda",
                date: "2015-05-03T22:00:00.000Z",
                comment: "Labour Day",
                year: 2015,
                week: 19,
                __v: 0
            },
            {
                _id: "569fac6c62d172544baf0dd9",
                date: "2015-05-01T22:00:00.000Z",
                comment: "Labour Day",
                year: 2015,
                week: 18,
                __v: 0
            },
            {
                _id: "569fac3962d172544baf0dd6",
                date: "2015-04-30T22:00:00.000Z",
                comment: "Labour Day",
                year: 2015,
                week: 18,
                __v: 0
            },
            {
                _id: "569fabcc62d172544baf0dd4",
                date: "2015-04-12T22:00:00.000Z",
                comment: "Orthodox Easter",
                year: 2015,
                week: 16,
                __v: 0
            },
            {
                _id: "569fab9d62d172544baf0dd3",
                date: "2015-04-11T22:00:00.000Z",
                comment: "Orthodox Easter",
                year: 2015,
                week: 15,
                __v: 0
            },
            {
                _id: "569fabe862d172544baf0dd5",
                date: "2015-03-08T23:00:00.000Z",
                comment: "International Womens Day",
                year: 2015,
                week: 11,
                __v: 0
            },
            {
                _id: "569fab7062d172544baf0dd2",
                date: "2015-03-07T23:00:00.000Z",
                comment: "International Womens Day",
                year: 2015,
                week: 10,
                __v: 0
            },
            {
                _id: "569faaed62d172544baf0dd1",
                date: "2015-01-06T23:00:00.000Z",
                comment: "Christmas",
                year: 2015,
                week: 2,
                __v: 0
            },
            {
                _id: "569faad862d172544baf0dd0",
                date: "2014-12-31T23:00:00.000Z",
                comment: "New Year",
                year: 2015,
                week: 1,
                __v: 0
            }
        ]
    };

    var holidaysCollection;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;

    describe('Holidays View', function () {
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

                $needAEl = view.$el.find('a[data-module-id="69"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="69"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Holiday');

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
                var holidaysUrl = new RegExp('\/Holiday\/list', 'i');

                server.respondWith('GET', holidaysUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeHoliday)]);

                holidaysCollection = new HolidaysCollection({
                    viewType: 'list',
                    page: 1
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: holidaysCollection
                });

                expect(topBarView.$el.find('.createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

            it('Try to change ContentViewType', function(){
                var $listTypeBtn = topBarView.$el.find('a[data-view-type="list"].changeContentView');

                $listTypeBtn.click();

                expect(window.location.hash).to.be.equals('#easyErp/Holiday/list');
            });

        });

        describe('Holidays list view', function () {
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

                it('Try to create holidays list view', function () {
                    var holidayTotalCollectionUrl = new RegExp('\/holiday\/totalCollectionLength', 'i');
                    var $listHolder;

                    server.respondWith('GET', holidayTotalCollectionUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 29
                    })]);

                    listView = new ListView({
                        collection: holidaysCollection,
                        startTime: new Date()
                    });

                    server.respond();

                    $listHolder = listView.$el;

                    expect($listHolder.find('table')).to.exist;

                });

                /!*it('Try to delete item', function(){
                    var holidaysUrl = new RegExp('\/Holiday\/', 'i');
                    var $firstEl = $(listView.$el.find('#listTable input')[0]);
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    windowConfirmStub.returns(true);

                    $firstEl.prop('checked', true);

                    server.respondWith('DELETE', holidaysUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);

                    $deleteBtn.click();

                    listView.deleteItems();

                    server.respond();

                    $firstEl.click();

                });*!/

                /!*it('Try to delete with changes', function () {
                    var $input;
                    var $expenseInput = listView.$el.find('td[data-type="input"]')[0];
                    var $body = $('body');

                    $expenseInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('test');
                    $body.click();

                    listView.deleteItems();

                    expect($(listView.$el.find('td[data-type="input"]')[0]).text()).to.be.equals('Independence Day Ukraine');

                });*!/

                it('Try to create item', function(){
                    var $dateInput;
                    var $commentInput;
                    var $input;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');

                    $createBtn.click();
                    listView.createItem();

                    $dateInput = listView.$el.find('td[data-content="date"]')[0];
                    $commentInput = listView.$el.find('td[data-content="comment"]')[0];

                    $dateInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('10 Mar, 2016');

                    $commentInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('test');

                    server.respondWith('POST', '/Holiday/', [200, {"Content-Type": "application/json"}, JSON.stringify({"success":{"__v":0,"date":"2016-03-11T22:00:00.000Z","year":null,"week":null,"_id":"56e2cd4a3abb6ba70f73ad73"}})]);

                    $saveBtn.click();
                    listView.saveItem();

                    server.respond();

                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);

                });

                it('Try to edit item', function(){
                    var $input;
                    var $commentInput = listView.$el.find('td[data-content="comment"]')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $body = $('body');
                    var $tableContainer = listView.$el.find('table');

                    $commentInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('TEST Comment');

                    $body.click();

                    server.respondWith('PATCH', '/Holiday/', [200, {"Content-Type": "application/json"}, JSON.stringify({"success":{"__v":0,"date":"2016-03-11T22:00:00.000Z","year":null,"week":null,"_id":"56e2cd4a3abb6ba70f73ad73"}})]);

                    $saveBtn.click();
                    listView.saveItem();

                    server.respond();

                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);
                    expect($(listView.$el.find('td[data-content="comment"]')[0]).text()).to.be.equals('TEST Comment');

                });


            });

        });

    });

});
*/
