define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/monthHours/filterCollection',
    'views/main/MainView',
    'views/monthHours/list/ListView',
    'views/monthHours/TopBarView',
    'views/monthHours/CreateView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone,
             modules,
             fixtures,
             MonthHoursCollection,
             MainView,
             ListView,
             TopBarView,
             CreateView,
             eventsBinder,
             $,
             chai,
             chaiJquery,
             sinonChai) {
    'use strict';

    var expect;
    var fakeMonthHours = {
        total: 300,
        data: [
            {
                _id: "55b92ace21e4b7c40f000005",
                fixedExpense: 40,
                expenseCoefficient: 1.2,
                year: 2014,
                hours: 160,
                month: 8,
                ID: 1,
                __v: 0,
                dateByMonth: 201408,
                overheadRate: 6.574346506442022,
                actualHours: 4036,
                estimatedHours: 8568,
                adminSalaryBudget: 2300,
                adminBudget: 6000,
                vacationBudget: 3397.5,
                idleBudget: 14836.56
            },
            {
                _id: "55b92ace21e4b7c40f000006",
                fixedExpense: 40,
                expenseCoefficient: 1.2,
                year: 2014,
                hours: 176,
                month: 9,
                ID: 2,
                __v: 0,
                dateByMonth: 201409,
                overheadRate: 8.1614875578236,
                actualHours: 3937,
                estimatedHours: 0,
                adminSalaryBudget: 2213.33,
                adminBudget: 10321,
                vacationBudget: 429.55,
                idleBudget: 19167.9
            },
            {
                _id: "55b92ace21e4b7c40f000007",
                fixedExpense: 40,
                expenseCoefficient: 1.2,
                year: 2014,
                hours: 184,
                month: 10,
                ID: 3,
                __v: 0,
                dateByMonth: 201410,
                overheadRate: 5.992615652878442,
                actualHours: 4937,
                estimatedHours: 0,
                adminSalaryBudget: 2200,
                adminBudget: 8435,
                vacationBudget: 1510.87,
                idleBudget: 17439.67
            }
        ]
    };
    var monthHoursCollection;
    var view;
    var topBarView;
    var listView;
    var historyNavigateSpy;
    var ajaxSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('MonthHours View', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            ajaxSpy = sinon.spy($, 'ajax');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();

            if ($('.ui-dialog').length) {
                $('.ui-dialog').remove();
            }

            historyNavigateSpy.restore();
            ajaxSpy.restore();
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

                server.respondWith('GET', '/modules/', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);

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
                var monthHoursUrl = new RegExp('\/monthHours\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', monthHoursUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeMonthHours)]);
                monthHoursCollection = new MonthHoursCollection({
                    viewType: 'list',
                    page    : 1,
                    count   : 13
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var monthHoursUrl = new RegExp('\/monthHours\/', 'i');

                server.respondWith('GET', monthHoursUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeMonthHours)]);
                monthHoursCollection = new MonthHoursCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'monthHours'

                });
                server.respond();

                expect(monthHoursCollection).to.have.lengthOf(3);

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
            var cancelChangesSpy;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                mainSpy = sinon.spy(App, 'render');
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
                cancelChangesSpy = sinon.spy(ListView.prototype, 'cancelChanges');
            });

            after(function () {
                server.restore();
                clock.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
                alertStub.restore();
                cancelChangesSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create monthHours list view', function (done) {
                    var $firstRow;
                    var colCount;
                    var month;
                    var year;
                    var hours;
                    var expCoeff;
                    var fixedExp;
                    var estimatedHours;
                    var actualHours;
                    var adminBudget;
                    var adminSalaryBudget;
                    var vacationBudget;
                    var idleTimeBudget;
                    var overHeadRate;
                    var $pagination;
                    var $currentPageList;

                    listView = new ListView({
                        collection   : monthHoursCollection,
                        startTime    : new Date(),
                        newCollection: false
                    });

                    clock.tick(200);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(monthHoursCollection, listView);

                    monthHoursCollection.trigger('fetchFinished', {
                        totalRecords: monthHoursCollection.totalRecords,
                        currentPage : monthHoursCollection.currentPage,
                        pageSize    : monthHoursCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.length.of(3);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;

                    expect(colCount).to.be.equals(14);

                    month = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(month).to.not.empty;
                    expect(month).to.not.match(/object Object|undefined/);

                    year = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(year).to.not.empty;
                    expect(year).to.not.match(/object Object|undefined/);

                    hours = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(hours).to.not.empty;
                    expect(hours).to.not.match(/object Object|undefined/);

                    expCoeff = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(expCoeff).to.not.empty;
                    expect(expCoeff).to.not.match(/object Object|undefined/);

                    fixedExp = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(fixedExp).to.not.empty;
                    expect(fixedExp).to.not.match(/object Object|undefined/);

                    estimatedHours = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(estimatedHours).to.not.empty;
                    expect(estimatedHours).to.not.match(/object Object|undefined/);

                    actualHours = $firstRow.find('td:nth-child(9)').text().trim();
                    expect(actualHours).to.not.empty;
                    expect(actualHours).to.not.match(/object Object|undefined/);

                    adminBudget = $firstRow.find('td:nth-child(10)').text().trim();
                    expect(adminBudget).to.not.empty;
                    expect(adminBudget).to.not.match(/object Object|undefined/);

                    adminSalaryBudget = $firstRow.find('td:nth-child(11)').text().trim();
                    expect(adminSalaryBudget).to.not.empty;
                    expect(adminSalaryBudget).to.not.match(/object Object|undefined/);

                    vacationBudget = $firstRow.find('td:nth-child(12)').text().trim();
                    expect(vacationBudget).to.not.empty;
                    expect(vacationBudget).to.not.match(/object Object|undefined/);

                    idleTimeBudget = $firstRow.find('td:nth-child(13)').text().trim();
                    expect(idleTimeBudget).to.not.empty;
                    expect(idleTimeBudget).to.not.match(/object Object|undefined/);

                    overHeadRate = $firstRow.find('td:nth-child(14)').text().trim();
                    expect(overHeadRate).to.not.empty;
                    expect(overHeadRate).to.not.match(/object Object|undefined/);

                    // test pagination

                    $pagination = $thisEl.find('.pagination');

                    expect($pagination).to.exist;
                    expect($pagination.find('.countOnPage')).to.be.exist;
                    expect($pagination.find('.pageList')).to.be.exist;

                    $currentPageList = $thisEl.find('.currentPageList');
                    $currentPageList.mouseover();
                    expect($thisEl.find('#pageList')).to.have.css('display', 'block');
                    expect($thisEl.find('#pageList > li')).to.have.lengthOf(3);

                    $currentPageList.mouseover();
                    expect($thisEl.find('#pageList')).to.have.css('display', 'none');

                    done();
                });

                it('Try to change page1 to page2', function () {
                    var $currentPageList = $thisEl.find('.currentPageList');
                    var ajaxResponse;
                    var $page2Btn;

                    ajaxSpy.reset();

                    $currentPageList.mouseover();
                    $page2Btn = $thisEl.find('#pageList > li').eq(1);
                    $page2Btn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];
                    expect(ajaxSpy.called).to.be.true;
                    expect(ajaxResponse).to.have.property('url', '/monthHours/');
                    expect(ajaxResponse.data).to.have.property('contentType').and.to.not.undefined;
                    expect(ajaxResponse.data).to.have.property('page', 2);
                });

                it('Try to select 25 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needBtn = $pagination.find('.pageList > a').first();
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '25');
                });

                it('Try to select 50 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needBtn = $pagination.find('.pageList > a').eq(1);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '50');
                });

                it('Try to select 100 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needBtn = $pagination.find('.pageList > a').eq(2);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '100');
                });

                it('Try to select 200 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needBtn = $pagination.find('.pageList > a').eq(3);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '200');
                });

                it('Try to delete item with 403 error', function () {
                    var spyResponse;
                    var monthHoursUrl = new RegExp('\/monthHours\/', 'i');
                    var $firstEl = $(listView.$el.find('.notForm input')[0]);
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    mainSpy.reset();
                    $firstEl.click();

                    server.respondWith('DELETE', monthHoursUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
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

                    mainSpy.reset();
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
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');

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
