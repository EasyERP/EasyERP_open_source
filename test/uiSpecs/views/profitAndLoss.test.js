define([
    'modules',
    'text!fixtures/index.html',
    'collections/profitAndLoss/filterCollection',
    'views/main/MainView',
    'views/profitAndLoss/list/ListView',
    'views/profitAndLoss/TopBarView',
    'views/Filter/filterView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules, fixtures, ProfitAndLossCollection, MainView, ListView, TopBarView, FilterView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;
    var fakeProfitAndLoss = {
        grossFit : [
            {
                _id  : "565eb53a6aa50532e5df0be0",
                name : "200000 Product Sales",
                debit: 17994500
            }
        ],
        expenses : [
            {
                _id  : "565eb53a6aa50532e5df0be2",
                name : "210000 Cost of Goods Sold",
                debit: 3681315.6554685445
            }
        ],
        dividends: 0
    };
    var fakeAsyncData = {
        journalEntries: [
            {
                _id    : "2016-04-30T17:59:59.999Z",
                debit  : 0,
                credit : 3681315.6554685445,
                account: "565eb53a6aa50532e5df0be2"
            },
            {
                _id    : "2016-04-24T03:59:59.999Z",
                debit  : 1529889.5200247744,
                credit : 0,
                account: "565eb53a6aa50532e5df0be2"
            },
            {
                _id    : "2016-04-14T03:59:59.000Z",
                debit  : 340010.6000763253,
                credit : 0,
                account: "565eb53a6aa50532e5df0be2"
            },
            {
                _id    : "2016-04-03T03:59:59.999Z",
                debit  : 1684113.1952089928,
                credit : 0,
                account: "565eb53a6aa50532e5df0be2"
            },
            {
                _id    : "2016-03-31T21:59:59.000Z",
                debit  : 127302.34015845145,
                credit : 0,
                account: "565eb53a6aa50532e5df0be2"
            }
        ]
    };
    var view;
    var topBarView;
    var listView;
    var profitAndLossCollection;
    var setDateRangeSpy;
    var showDatePickerSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('ProfitAndLoss', function () {

        var $fixture;
        var $elFixture;
        before(function () {
            setDateRangeSpy = sinon.spy(TopBarView.prototype, 'setDateRange');
            showDatePickerSpy = sinon.spy(TopBarView.prototype, 'showDatePickers');
        });

        after(function () {
            view.remove();

            setDateRangeSpy.restore();
            showDatePickerSpy.restore();

            if($('.ui-dialog').length) {
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

                server.respondWith('GET', '/modules/', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);
                view = new MainView({el: $elFixture, contentType: 'profitAndLoss'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="91"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="91"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/profitAndLoss');
            });

        });

        describe('TopBarView', function () {
            var server;
            var clock;
            var consoleLogSpy;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                consoleLogSpy = sinon.spy(console, 'log');
            });

            after(function () {
                server.restore();
                clock.restore();
                consoleLogSpy.restore();
            });

            it('Try to fetch collection with error', function () {
                var profitAndLossUrl = new RegExp('journalEntries\/getProfitAndLoss', 'i');

                consoleLogSpy.reset();

                server.respondWith('GET', profitAndLossUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                profitAndLossCollection = new ProfitAndLossCollection({
                    page       : 1,
                    count      : 2,
                    viewType   : 'list',
                    contentType: 'profitAndLoss'
                });
                server.respond();

                expect(consoleLogSpy.calledOnce).to.be.true;
            });

            it('Try to create TopBarView', function (done) {
                var profitAndLossUrl = new RegExp('journalEntries\/getProfitAndLoss', 'i');

                server.respondWith('GET', profitAndLossUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProfitAndLoss)]);
                profitAndLossCollection = new ProfitAndLossCollection({
                    page       : 1,
                    viewType   : 'list',
                    contentType: 'profitAndLoss'
                });
                server.respond();

                expect(profitAndLossCollection).to.have.lengthOf(1);

                clock.tick(200);

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: profitAndLossCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Profit And Loss');

                done();
            });
        });

        describe('ProfitAndLossListView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var showHiddenSpy;
            var changeDateRangeSpy;

            before(function () {
                App.startPreload = function () {
                    App.preloaderShowFlag = true;
                    $('#loading').show();
                };

                App.stopPreload = function () {
                    App.preloaderShowFlag = false;
                    $('#loading').hide();
                };

                App.currentDb = 'michelDb';

                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                showHiddenSpy = sinon.spy(ListView.prototype, 'showHidden');
                changeDateRangeSpy = sinon.spy(ListView.prototype, 'changeDateRange');
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                showHiddenSpy.restore();
                changeDateRangeSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create ProfitAndLossListView', function (done) {
                    var asyncDataUrl = new RegExp('\/journalEntries\/getAsyncDataForGL', 'i');

                    server.respondWith('GET', asyncDataUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAsyncData)]);
                    listView = new ListView({
                        startTime : new Date(),
                        collection: profitAndLossCollection
                    });
                    server.respond();

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(profitAndLossCollection, listView);

                    profitAndLossCollection.trigger('fetchFinished', {
                        totalRecords: profitAndLossCollection.totalRecords,
                        currentPage : profitAndLossCollection.currentPage,
                        pageSize    : profitAndLossCollection.pageSize
                    });

                    clock.tick(300);
                    $thisEl = listView.$el;

                    expect($thisEl.find('.list')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.not.equals(0);

                    done();
                });

                it('Try to expand item', function () {
                    var $firstTr = $thisEl.find('#listTableGrossFit > tr').first();

                    // expand
                    $firstTr.click();
                    expect(showHiddenSpy.calledOnce).to.be.true;

                    // hide
                    $firstTr.click();
                    expect(showHiddenSpy.calledTwice).to.be.true;
                });

                it('Try to change dateRange', function () {
                    var $topBarEl = topBarView.$el;
                    var $updateDateBtn = $topBarEl.find('#updateDate');
                    var $dateRange = $topBarEl.find('.dateRange');
                    var asyncDataUrl = new RegExp('\/journalEntries\/getAsyncDataForGL', 'i');
                    var profitAndLossUrl = new RegExp('journalEntries\/getProfitAndLoss', 'i');
                    var $cancelBtn;
                    var $thisMonth;
                    var $finYear;
                    var $lastMonth;
                    var $lastQuarter;
                    var $lastFinYear;
                    var $customDate;
                    var $startDate;
                    var $endDate;

                    server.respondWith('GET', profitAndLossUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProfitAndLoss)]);
                    server.respondWith('GET', asyncDataUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAsyncData)]);
                    $dateRange.click();

                    $thisMonth = $topBarEl.find('#thisMonth');
                    $thisMonth.click();
                    server.respond();
                    expect(setDateRangeSpy.calledOnce).to.be.true;
                    expect(changeDateRangeSpy.calledOnce).to.be.true;

                    $finYear = $topBarEl.find('#thisYear');
                    $finYear.click();
                    server.respond();
                    expect(setDateRangeSpy.calledTwice).to.be.true;
                    expect(changeDateRangeSpy.calledTwice).to.be.true;


                    $lastMonth = $topBarEl.find('#lastMonth');
                    $lastMonth.click();
                    server.respond();
                    expect(setDateRangeSpy.calledThrice).to.be.true;
                    expect(changeDateRangeSpy.calledThrice).to.be.true;

                    $lastQuarter = $topBarEl.find('#lastQuarter');
                    $lastQuarter.click();
                    server.respond();
                    expect(setDateRangeSpy.callCount).to.be.equals(4);
                    expect(changeDateRangeSpy.callCount).to.be.equals(4);


                    $lastFinYear = $topBarEl.find('#lastYear');
                    $lastFinYear.click();
                    server.respond();
                    expect(setDateRangeSpy.callCount).to.be.equals(5);
                    expect(changeDateRangeSpy.callCount).to.be.equals(5);

                    // open dateRange dropdown
                    $dateRange.click();

                    // cancel dateRange dropdown
                    $cancelBtn = $topBarEl.find('#cancelBtn');
                    $cancelBtn.click();

                    $dateRange.click();
                    $customDate = $topBarEl.find('#custom');
                    $customDate.click();
                    expect(showDatePickerSpy.calledOnce).to.be.true;

                    $startDate = $topBarEl.find('#startDate');
                    $startDate.datepicker('setDate', new Date('1 May, 2016'));
                    $startDate.change();

                    $endDate = $topBarEl.find('#endDate');
                    $endDate.datepicker('setDate', new Date('1 June, 2016'));
                    $endDate.change();

                    $updateDateBtn.click();
                    server.respond();

                    expect(changeDateRangeSpy.callCount).to.be.equals(6);

                });
            });
        });
    });
});