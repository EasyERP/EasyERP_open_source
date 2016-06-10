define([
    'modules',
    'text!fixtures/index.html',
    'collections/monthHours/filterCollection',
    'views/main/MainView',
    'views/monthHours/list/ListView',
    'views/monthHours/TopBarView',
    'views/monthHours/CreateView',
    /* 'views/monthHours/EditView',*/
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules,
             fixtures,
             MonthHoursCollection,
             MainView,
             ListView,
             TopBarView,
             CreateView,
           /*  EditView,*/
             $,
             chai,
             chaiJquery,
             sinonChai) {
    'use strict';

    var expect;
    var fakeMonthHours = [
        {
            _id               : "55b92ace21e4b7c40f000005",
            fixedExpense      : 156,
            expenseCoefficient: 1.2,
            year              : 2014,
            hours             : 160,
            month             : 8,
            ID                : 1,
            __v               : 0,
            dateByMonth       : 201408,
            overheadRate      : 4.608470949855352,
            actualHours       : 4148,
            estimatedHours    : 8568,
            adminSalaryBudget : 1850,
            adminBudget       : 0,
            vacationBudget    : 2855,
            idleBudget        : 14410.94
        },
        {
            _id               : "55b92ace21e4b7c40f000006",
            fixedExpense      : 40,
            expenseCoefficient: 1.2,
            year              : 2014,
            hours             : 176,
            month             : 9,
            ID                : 2,
            __v               : 0,
            dateByMonth       : 201409,
            overheadRate      : 7.912933667083855,
            actualHours       : 3995,
            estimatedHours    : 0,
            adminSalaryBudget : 1763.33,
            adminBudget       : 10321,
            vacationBudget    : 384.09,
            idleBudget        : 19143.75
        },
        {
            _id               : "55b92ace21e4b7c40f000007",
            fixedExpense      : 40,
            expenseCoefficient: 1.2,
            year              : 2014,
            hours             : 184,
            month             : 10,
            ID                : 3,
            __v               : 0,
            dateByMonth       : 201410,
            overheadRate      : 5.8747648839556,
            actualHours       : 4955,
            estimatedHours    : 0,
            adminSalaryBudget : 1750,
            adminBudget       : 8435,
            vacationBudget    : 1510.87,
            idleBudget        : 17413.59
        },
        {
            _id               : "55b92ace21e4b7c40f000008",
            fixedExpense      : 40,
            expenseCoefficient: 1.12,
            year              : 2014,
            hours             : 160,
            month             : 11,
            ID                : 4,
            __v               : 0,
            dateByMonth       : 201411,
            overheadRate      : 5.561116465863454,
            actualHours       : 4980,
            estimatedHours    : 0,
            adminSalaryBudget : 2076.67,
            adminBudget       : 6763,
            vacationBudget    : 492.5,
            idleBudget        : 18362.19
        }
    ];
    var monthHoursCollection;
    var view;
    var topBarView;
    var listView;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('MonthHours View', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();

            if ($('.ui-dialog').length) {
                $('.ui-dialog').remove();
            }
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

                server.respondWith('GET', '/getModules', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);

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

        describe('TopBarView', function () {
            var server;
            var consoleSpy;

            before(function () {
                server = sinon.fakeServer.create();
                consoleSpy = sinon.spy(console, 'log');
            });

            after(function () {
                server.restore();
                consoleSpy.restore();
            });

            it('Try to fetch collection with error', function () {
                var monthHoursUrl = new RegExp('\/monthHours\/list', 'i');

                server.respondWith('GET', monthHoursUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeMonthHours)]);
                monthHoursCollection = new MonthHoursCollection({
                    viewType: 'list',
                    page    : 1,
                    count   : 13
                });
                server.respond();

                expect(consoleSpy.called).to.be.true;
            });

            it('Try to create TopBarView', function () {
                var monthHoursUrl = new RegExp('\/monthHours\/list', 'i');
                var monthTotalCollectionUrl = new RegExp('\/monthHours\/list\/totalCollectionLength', 'i');
                server.respondWith('GET', monthHoursUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeMonthHours)]);
                server.respondWith('GET', monthTotalCollectionUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    count: 13
                })]);
                monthHoursCollection = new MonthHoursCollection({
                    viewType: 'list',
                    page    : 1,
                    count   : 14
                });

                server.respond();

                topBarView = new TopBarView({
                    collection: monthHoursCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
            });

        });

        describe('MonthHours list view', function () {
            var server;
            var clock;
            var windowConfirmStub;
            var mainSpy;
            var $thisEl;
            var alertStub;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                mainSpy = sinon.spy(App, 'render');
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
            });

            after(function () {
                server.restore();
                clock.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
                alertStub.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create monthHours list view', function (done) {
                    var monthTotalCollectionUrl = new RegExp('\/monthHours\/list\/totalCollectionLength', 'i');
                    var monthHoursUrl = new RegExp('\/monthHours\/list', 'i');

                    server.respondWith('GET', monthHoursUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeMonthHours)]);
                    server.respondWith('GET', monthTotalCollectionUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 13
                    })]);
                    listView = new ListView({
                        collection   : monthHoursCollection,
                        startTime    : new Date(),
                        newCollection: false
                    });
                    server.respond();
                    server.respond();

                    clock.tick(200);
                    $thisEl = listView.$el;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(4);

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

                it('Try to switchPageCounter with error', function (done) {
                    var spyResponse;
                    var $thisEl = listView.$el;
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var monthHoursUrl = new RegExp('\/monthHours\/list', 'i');

                    server.respondWith('GET', monthHoursUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeMonthHours)]);

                    $needBtn.click();
                    server.respond();

                    clock.tick(200);

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some Error.');

                    done();
                });

                it('Try to switchPageCounter', function (done) {
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var monthTotalCollectionUrl = new RegExp('\/monthHours\/list\/totalCollectionLength', 'i');
                    var monthHoursUrl = new RegExp('\/monthHours\/list', 'i');

                    server.respondWith('GET', monthHoursUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeMonthHours)]);
                    server.respondWith('GET', monthTotalCollectionUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 13
                    })]);
                    $needBtn.click();
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(4);

                    done();
                });

                it('Try to delete with changes', function () {
                    var $input;
                    var $expenseInput = listView.$el.find('tr[data-id="55b92ace21e4b7c40f000005"] > td[data-content="expenseCoefficient"]');
                    var $fixedInput = listView.$el.find('tr[data-id="55b92ace21e4b7c40f000005"] > td[data-content="fixedExpense"]');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var keyDownEvent = $.Event('keydown', {which: 13});
                    var journalEntryUrl = new RegExp('journalEntries\/getExpenses', 'i');

                    server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        actualHours     : 4148,
                        adminExpenses   : 0,
                        adminSalary     : 185000,
                        vacationExpenses: 285500,
                        idleExpenses    : 1441093.75
                    })]);

                    $expenseInput.click();
                    server.respond();
                    $input = $expenseInput.find('input.editing');
                    $input.val('1.7878787');
                    $input.trigger('change');

                    $fixedInput.trigger(keyDownEvent);

                    $deleteBtn.click();
                    expect($(listView.$el.find('td[data-content="expenseCoefficient"]')[0]).text()).to.be.equals('1.2');
                });

                it('Try to delete item with 403 error', function () {
                    var spyResponse;
                    var monthHoursUrl = new RegExp('\/monthHours\/', 'i');
                    var $firstEl = $(listView.$el.find('.notForm input')[0]);
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    $firstEl.click();

                    server.respondWith('DELETE', monthHoursUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                });

                it('Try to delete item', function () {
                    var monthHoursUrl = new RegExp('\/monthHours\/', 'i');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    server.respondWith('DELETE', monthHoursUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();
                });

                it('Try to create item', function () {
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

                    server.respondWith('POST', '/monthHours/', [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "month"             : 8,
                        "hours"             : 150,
                        "year"              : 2016,
                        "expenseCoefficient": 1.45,
                        "fixedExpense"      : 78,
                        "_id"               : "56e19608c5df6692126cc41f"
                    })]);
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

                    //server.respondWith('POST', '/monthHours/', [200, {'Content-Type': 'application/json'}, JSON.stringify({"month":8,"hours":150,"year":2016,"expenseCoefficient":1.45,"fixedExpense":78,"_id":"56e19608c5df6692126cc41f"})]);
                    $saveBtn.click();
                    server.respond();

                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);

                });

                it('Try to edit item', function (done) {
                    var $input;
                    var $fixedInput = listView.$el.find('td[data-content="fixedExpense"]')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');
                    var journalEntryUrl = new RegExp('journalEntries\/getExpenses', 'i');

                    server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        actualHours     : 4148,
                        adminExpenses   : 0,
                        adminSalary     : 185000,
                        vacationExpenses: 285500,
                        idleExpenses    : 1441093.75
                    })]);
                    $fixedInput.click();
                    server.respond();

                    clock.tick(200);

                    $input = listView.$el.find('input.editing');
                    $input.val('165');
                    $input.trigger('change');

                    server.respondWith('PATCH', '/monthHours/', [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "month"             : 8,
                        "hours"             : 150,
                        "year"              : 2016,
                        "expenseCoefficient": 1.45,
                        "fixedExpense"      : 78,
                        "_id"               : "56e19608c5df6692126cc41f"
                    })]);
                    $saveBtn.click();
                    server.respond();

                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);
                    expect($(listView.$el.find('td[data-content="fixedExpense"]')[0]).text()).to.be.equals('165');

                    done();
                });
            });
        });
    });
});
