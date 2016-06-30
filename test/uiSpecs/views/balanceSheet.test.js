define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/balanceSheet/filterCollection',
    'views/main/MainView',
    'views/balanceSheet/list/ListView',
    'views/balanceSheet/TopBarView',
    'views/Filter/filterView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone, modules, fixtures, BalanceSheetCollection, MainView, ListView, TopBarView, FilterView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var expect;
    var fakeBalance = {
        assets     : [
            {
                _id   : "565eb53a6aa50532e5df0bc9",
                name  : "101200 Account Receivable",
                credit: 870900,
                debit : 557145.3414018822
            },
            {
                _id   : "565eb53a6aa50532e5df0bd2",
                name  : "101500 Cash USD",
                credit: 0,
                debit : 891686.5926850027
            }
        ],
        liabilities: [
            {
                _id   : "565eb53a6aa50532e5df0bdb",
                name  : "111000 Current Liabilities",
                credit: 20786.592685002666,
                debit : 786.5926850026665,
                group : "liabilities"
            }
        ],
        equity     : [
            {
                _id   : "56f538c39c85020807b40024",
                name  : "300200 Retained Earnings",
                credit: 0,
                debit : 0,
                group : "assets"
            }
        ]
    };
    var fakeAsyncData = {
        journalEntries: [
            {
                _id    : "2016-05-17T00:00:00.000Z",
                debit  : 283145.34140188224,
                credit : 270000,
                account: "565eb53a6aa50532e5df0bc9"
            },
            {
                _id    : "2016-05-10T00:00:00.000Z",
                debit  : 20000,
                credit : 0,
                account: "565eb53a6aa50532e5df0bc9"
            },
            {
                _id    : "2016-05-04T22:00:00.000Z",
                debit  : 48000,
                credit : 0,
                account: "565eb53a6aa50532e5df0bc9"
            },
            {
                _id    : "2016-05-03T22:00:00.000Z",
                debit  : 206000,
                credit : 0,
                account: "565eb53a6aa50532e5df0bc9"
            },
            {
                _id    : "2016-05-01T04:00:00.999Z",
                debit  : 0,
                credit : 600900,
                account: "565eb53a6aa50532e5df0bc9"
            }
        ]
    };
    var view;
    var topBarView;
    var listView;
    var balanceSheetCollection;
    var setDateRangeSpy;
    var showDatePickerSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('BalanceSheetView', function () {
        var $fixture;
        var $elFixture;
        var historyNavigateSpy;

        before(function () {
            setDateRangeSpy = sinon.spy(TopBarView.prototype, 'setDateRange');
            showDatePickerSpy = sinon.spy(TopBarView.prototype, 'showDatePickers');
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
        });

        after(function () {
            topBarView.remove();
            listView.remove();
            view.remove();

            setDateRangeSpy.restore();
            showDatePickerSpy.restore();
            historyNavigateSpy.restore();
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
                view = new MainView({el: $elFixture, contentType: 'balanceSheet'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="92"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="92"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/balanceSheet');
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
                var balanceUrl = new RegExp('journalEntries\/getBalanceSheet', 'i');

                server.respondWith('GET', balanceUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                balanceSheetCollection = new BalanceSheetCollection({
                    page       : 1,
                    count      : 2,
                    viewType   : 'list',
                    contentType: 'balanceSheet'
                });
                server.respond();

                expect(consoleLogSpy.calledOnce).to.be.true;
            });

            it('Try to create TopBarView', function (done) {
                var balanceUrl = new RegExp('journalEntries\/getBalanceSheet', 'i');
                var collectionJSON;

                server.respondWith('GET', balanceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeBalance)]);
                balanceSheetCollection = new BalanceSheetCollection({
                    page       : 1,
                    viewType   : 'list',
                    contentType: 'balanceSheet'
                });
                server.respond();

                collectionJSON = balanceSheetCollection.toJSON();

                expect(balanceSheetCollection).to.have.lengthOf(1);
                expect(collectionJSON[0]).to.have.property('assets');
                expect(collectionJSON[0]).to.have.property('equity');
                expect(collectionJSON[0]).to.have.property('liabilities');

                clock.tick(200);

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: balanceSheetCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Balance Sheet');

                done();
            });
        });

        describe('BalanceSheetView', function () {
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
                changeDateRangeSpy = sinon.spy(ListView.prototype, 'changeDateRange');
                showHiddenSpy = sinon.spy(ListView.prototype, 'showHidden');
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                showHiddenSpy.restore();
                changeDateRangeSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create BalanceSheetView', function (done) {
                    var asyncDataUrl = new RegExp('\/journalEntries\/getAsyncDataForGL', 'i');

                    server.respondWith('GET', asyncDataUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAsyncData)]);
                    listView = new ListView({
                        startTime : new Date(),
                        collection: balanceSheetCollection
                    });
                    server.respond();
                    clock.tick(300);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(balanceSheetCollection, listView);

                    balanceSheetCollection.trigger('fetchFinished', {
                        totalRecords: balanceSheetCollection.totalRecords,
                        currentPage : balanceSheetCollection.currentPage,
                        pageSize    : balanceSheetCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('.list')).to.have.lengthOf(4);

                    done();
                });

                it('Try to expand item', function () {
                    var $firstTr = $thisEl.find('#listTableAssets > tr').first();

                    // expand
                    $firstTr.click();
                    expect(showHiddenSpy.calledOnce).to.be.true;

                    // hide
                    $firstTr.click();
                    expect(showHiddenSpy.calledTwice).to.be.true;
                });

                it('Try to change dateRange', function (done) {
                    var $topBarEl = topBarView.$el;
                    var $updateDateBtn = $topBarEl.find('#updateDate');
                    var $dateRange = $topBarEl.find('.dateRange');
                    var asyncDataUrl = new RegExp('\/journalEntries\/getAsyncDataForGL', 'i');
                    var balanceUrl = new RegExp('journalEntries\/getBalanceSheet', 'i');
                    var $cancelBtn;
                    var $thisMonth;
                    var $finYear;
                    var $lastMonth;
                    var $lastQuarter;
                    var $lastFinYear;
                    var $customDate;
                    var $startDate;
                    var $endDate;

                    this.timeout(5000);

                    server.respondWith('GET', balanceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeBalance)]);
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

                    done();
                });
            });
        });
    });
});