define([
    'text!fixtures/index.html',
    'collections/monthHours/filterCollection',
    'views/main/MainView',
    'views/monthHours/list/ListView',
    'views/monthHours/TopBarView',
    'views/monthHours/CreateView',
    'views/monthHours/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, MonthHoursCollection, MainView, ListView, TopBarView,  CreateView, EditView, $, chai, chaiJquery, sinonChai, Custom, async) {
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
    var fakeMonthHours = [
        {
            _id: "55b92ace21e4b7c40f000005",
            fixedExpense: 40,
            expenseCoefficient: 1.2,
            year: 2014,
            hours: 168,
            month: 8,
            ID: 1,
            __v: 0
        },
        {
            _id: "55b92ace21e4b7c40f000006",
            fixedExpense: 40,
            expenseCoefficient: 1.2,
            year: 2014,
            hours: 176,
            month: 9,
            ID: 2,
            __v: 0
        },
        {
            _id: "55b92ace21e4b7c40f000007",
            fixedExpense: 40,
            expenseCoefficient: 1.2,
            year: 2014,
            hours: 184,
            month: 10,
            ID: 3,
            __v: 0
        },
        {
            _id: "55b92ace21e4b7c40f000008",
            fixedExpense: 40,
            expenseCoefficient: 1.2,
            year: 2014,
            hours: 160,
            month: 11,
            ID: 4,
            __v: 0
        },
        {
            _id: "55b92ace21e4b7c40f000009",
            fixedExpense: 265,
            expenseCoefficient: 1.12,
            year: 2014,
            hours: 184,
            month: 12,
            ID: 6,
            __v: 0
        },
        {
            _id: "55b92ace21e4b7c40f00000a",
            fixedExpense: 265,
            expenseCoefficient: 1.12,
            year: 2015,
            hours: 176,
            month: 1,
            ID: 7,
            __v: 0
        },
        {
            _id: "55b92ace21e4b7c40f00000c",
            fixedExpense: 280,
            expenseCoefficient: 1.12,
            year: 2015,
            hours: 168,
            month: 3,
            ID: 9,
            __v: 0
        },
        {
            _id: "55b92ace21e4b7c40f00000d",
            fixedExpense: 300,
            expenseCoefficient: 1.12,
            year: 2015,
            hours: 176,
            month: 4,
            ID: 10,
            __v: 0
        },
        {
            _id: "55b92ace21e4b7c40f00000e",
            fixedExpense: 305,
            expenseCoefficient: 1.12,
            year: 2015,
            hours: 168,
            month: 5,
            ID: 11,
            __v: 0
        },
        {
            _id: "55f19aefbb6bf5d80b000008",
            month: 6,
            hours: 160,
            year: 2015,
            expenseCoefficient: 1.12,
            __v: 0,
            fixedExpense: 305
        },
        {
            _id: "55f19b8bbb6bf5d80b000009",
            month: 7,
            hours: 184,
            year: 2015,
            __v: 0,
            expenseCoefficient: 1.12,
            fixedExpense: 305
        },
        {
            _id: "55f19bb8bb6bf5d80b00000a",
            month: 8,
            hours: 160,
            year: 2015,
            __v: 0,
            expenseCoefficient: 1.12,
            fixedExpense: 305
        },
        {
            _id: "55f19bccbb6bf5d80b00000b",
            month: 9,
            hours: 176,
            year: 2015,
            __v: 0,
            expenseCoefficient: 1.12,
            fixedExpense: 305
        }
    ];

    var monthHoursCollection;
    var view;
    var topBarView;
    var listView;

    describe('MonthHours View', function () {
        var $fixture;
        var $elFixture;


        after(function(){
            view.remove();
            topBarView.remove();
            listView.remove();
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

                view = new MainView({el: $elFixture, contentType: 'monthHours'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="68"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="68"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/monthHours');

            });

        });

        describe('TopBarView', function(){
            var server;
            var consoleSpy;

            before(function(){
                server = sinon.fakeServer.create();
                consoleSpy = sinon.spy(console, 'log');
            });

            after(function(){
               server.restore();
                consoleSpy.restore();
            });

            it('Try to fetch collection with error', function(){
                var monthHoursUrl = new RegExp('\/monthHours\/list', 'i');
                
                server.respondWith('GET', monthHoursUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakeMonthHours)]);
                monthHoursCollection = new MonthHoursCollection({
                    viewType: 'list',
                    page: 1,
                    count: 13
                });
                server.respond();
                
                expect(consoleSpy.called).to.be.true;
            });

            it('Try to create TopBarView', function(){
                var monthHoursUrl = new RegExp('\/monthHours\/list', 'i');
                var monthTotalCollectionUrl = new RegExp('\/monthHours\/list\/totalCollectionLength', 'i');
                server.respondWith('GET', monthHoursUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeMonthHours)]);
                server.respondWith('GET', monthTotalCollectionUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                    count: 13
                })]);
                monthHoursCollection = new MonthHoursCollection({
                    viewType: 'list',
                    page: 1,
                    count: 14
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: monthHoursCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

            it('Try to change ContentViewType', function(){
                var $listTypeBtn = topBarView.$el.find('a[data-view-type="list"].changeContentView');

                $listTypeBtn.click();

                expect(window.location.hash).to.be.equals('#easyErp/monthHours/list');
            });

        });

        describe('MonthHours list view', function () {
            var server;
            var clock;
            var windowConfirmStub;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                clock.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function(){

                it('Try to create monthHours list view', function (done) {
                    var monthTotalCollectionUrl = new RegExp('\/monthHours\/list\/totalCollectionLength', 'i');
                    var monthHoursUrl = new RegExp('\/monthHours\/list', 'i');

                    server.respondWith('GET', monthHoursUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeMonthHours)]);
                    server.respondWith('GET', monthTotalCollectionUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 13
                    })]);
                    listView = new ListView({
                        collection: monthHoursCollection,
                        startTime: new Date(),
                        newCollection: false
                    });
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    topBarView.bind('copyEvent', listView.copy, listView);
                    topBarView.bind('generateEvent', listView.generate, listView);
                    topBarView.bind('createEvent', listView.createItem, listView);
                    topBarView.bind('editEvent', listView.editItem, listView);
                    topBarView.bind('saveEvent', listView.saveItem, listView);
                    topBarView.bind('deleteEvent', listView.deleteItems, listView);
                    topBarView.bind('generateInvoice', listView.generateInvoice, listView);
                    topBarView.bind('copyRow', listView.copyRow, listView);
                    topBarView.bind('exportToCsv', listView.exportToCsv, listView);
                    topBarView.bind('exportToXlsx', listView.exportToXlsx, listView);
                    topBarView.bind('importEvent', listView.importFiles, listView);
                    topBarView.bind('pay', listView.newPayment, listView);
                    topBarView.bind('changeDateRange', listView.changeDateRange, listView);

                    monthHoursCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to switchPageCounter with error', function(done){
                    var spyResponse;
                    var $thisEl = listView.$el;
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var monthHoursUrl = new RegExp('\/monthHours\/list', 'i');

                    server.respondWith('GET', monthHoursUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakeMonthHours)]);

                    $needBtn.click();
                    server.respond();

                    clock.tick(200);

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some Error.');

                    done();
                });

                it('Try to switchPageCounter', function(done){
                    var $thisEl = listView.$el;
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var monthTotalCollectionUrl = new RegExp('\/monthHours\/list\/totalCollectionLength', 'i');
                    var monthHoursUrl = new RegExp('\/monthHours\/list', 'i');

                    server.respondWith('GET', monthHoursUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeMonthHours)]);
                    server.respondWith('GET', monthTotalCollectionUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 13
                    })]);
                    $needBtn.click();
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(13);

                    done();
                });

                it('Try to delete with changes', function(){
                    var $input;
                    var $expenseInput = listView.$el.find('tr[data-id="55b92ace21e4b7c40f000005"] > td[data-content="expenseCoefficient"]');
                    var $fixedInput = listView.$el.find('tr[data-id="55b92ace21e4b7c40f000005"] > td[data-content="fixedExpense"]');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var keyDownEvent = $.Event('keydown', {which: 13});

                    $expenseInput.click();
                    $input = $expenseInput.find('input.editing');
                    $input.val('1.7878787');
                    $input.trigger('change');

                    $fixedInput.click();
                    $input = $fixedInput.find('input.editing');
                    $input.trigger(keyDownEvent);

                    $deleteBtn.click();

                    expect($(listView.$el.find('td[data-content="expenseCoefficient"]')[0]).text()).to.be.equals('1.2');
                });

                it('Try to delete item with 403 error', function(){
                    var spyResponse;
                    var monthHoursUrl = new RegExp('\/monthHours\/', 'i');
                    var $firstEl = $(listView.$el.find('.notForm input')[0]);
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    $firstEl.click();

                    server.respondWith('DELETE', monthHoursUrl, [403, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                });

                it('Try to delete item', function(){
                    var monthHoursUrl = new RegExp('\/monthHours\/', 'i');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    server.respondWith('DELETE', monthHoursUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();
                });

                it('Try to create item', function(){
                    var $monthInput;
                    var $hoursInput;
                    var $yearInput;
                    var $expenseInput;
                    var $fixedInput;
                    var $input;
                    var spyResponse;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');

                    $createBtn.click();

                    $monthInput = listView.$el.find('td[data-content="month"]')[0];

                    $hoursInput = listView.$el.find('td[data-content="hours"]')[0];
                    $yearInput = listView.$el.find('td[data-content="year"]')[0];
                    $expenseInput = listView.$el.find('td[data-content="expenseCoefficient"]')[0];
                    $fixedInput = listView.$el.find('td[data-content="fixedExpense"]')[0];

                    server.respondWith('POST', '/monthHours/', [200, {"Content-Type": "application/json"}, JSON.stringify({"month":8,"hours":150,"year":2016,"expenseCoefficient":1.45,"fixedExpense":78,"_id":"56e19608c5df6692126cc41f"})]);
                    $saveBtn.click();
                    server.respond();
                    spyResponse = mainSpy.args[2][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Fill all fields please');

                    $monthInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('8');

                    $hoursInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('150');

                    $yearInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('2016');

                    $expenseInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('1.4');

                    $fixedInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('45');

                    //server.respondWith('POST', '/monthHours/', [200, {"Content-Type": "application/json"}, JSON.stringify({"month":8,"hours":150,"year":2016,"expenseCoefficient":1.45,"fixedExpense":78,"_id":"56e19608c5df6692126cc41f"})]);
                    $saveBtn.click();
                    server.respond();

                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);

                });

                it('Try to edit item', function(){
                    var $input;
                    var $fixedInput = listView.$el.find('td[data-content="fixedExpense"]')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $body = $('body');
                    var $tableContainer = listView.$el.find('table');

                    $fixedInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('165');

                    $body.click();

                    server.respondWith('PATCH', '/monthHours/', [200, {"Content-Type": "application/json"}, JSON.stringify({"month":8,"hours":150,"year":2016,"expenseCoefficient":1.45,"fixedExpense":78,"_id":"56e19608c5df6692126cc41f"})]);

                    $saveBtn.click();

                    server.respond();

                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);
                    expect($(listView.$el.find('td[data-content="fixedExpense"]')[0]).text()).to.be.equals('165');
                });

            });

        });

    });


});
