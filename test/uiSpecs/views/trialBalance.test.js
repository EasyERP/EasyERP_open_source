define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/trialBalance/filterCollection',
    'views/main/MainView',
    'views/trialBalance/list/ListView',
    'views/trialBalance/TopBarView',
    'views/Filter/filterView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone, modules, fixtures, TrialBalanceCollection, MainView, ListView, TopBarView, FilterView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var expect;
    var fakeJournalEntry = {
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
            }
        ]
    };
    var fakeTrialBalance = [
        {
            _id   : "565eb53a6aa50532e5df0bc9",
            name  : "101200 Account Receivable",
            debit : 51966945.34140188,
            credit: 30121296.642124847
        },
        {
            _id   : "565eb53a6aa50532e5df0bd2",
            name  : "101500 Cash USD",
            debit : 34372221.32686379,
            credit: 0
        },
        {
            _id   : "565eb53a6aa50532e5df0bd9",
            name  : "104000 Finished Goods",
            debit : 16615162.678687235,
            credit: 16615162.67868723
        },
        {
            _id   : "565eb53a6aa50532e5df0bda",
            name  : "104001 Work In Process",
            debit : 0,
            credit: 16615162.678687235
        },
        {
            _id   : "565eb53a6aa50532e5df0bdb",
            name  : "111000 Current Liabilities",
            debit : 786.5926850026665,
            credit: 4250924.684738945
        },
        {
            _id   : "565eb53a6aa50532e5df0be0",
            name  : "200000 Product Sales",
            debit : 17994500,
            credit: 51967731.93408688
        },
        {
            _id   : "565eb53a6aa50532e5df0be2",
            name  : "210000 Cost of Goods Sold",
            debit : 16615162.678687233,
            credit: 3681315.6554685445
        },
        {
            _id   : "565eb53a6aa50532e5df0bf3",
            name  : "300200 Retained Earnings",
            debit : 0,
            credit: 14313184.344531456
        },
        {
            _id   : "56f538149c85020807b4001f",
            name  : "400000 Income Summary",
            debit : 17994500,
            credit: 17994500
        }
    ];
    var view;
    var topBarView;
    var listView;
    var trialBalanceCollection;
    var setDateRangeSpy;
    var showDatePickerSpy;
    var historyNavigateSpy;
    var ajaxSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('TrialBalanceView', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            ajaxSpy = sinon.spy($, 'ajax');
            setDateRangeSpy = sinon.spy(TopBarView.prototype, 'setDateRange');
            showDatePickerSpy = sinon.spy(TopBarView.prototype, 'showDatePickers');
        });

        after(function () {
            view.remove();
            setDateRangeSpy.restore();
            showDatePickerSpy.restore();
            historyNavigateSpy.restore();
            ajaxSpy.restore();

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

                server.respondWith('GET', '/modules/', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);
                view = new MainView({el: $elFixture, contentType: 'trialBalance'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="89"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="89"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/trialBalance');
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
                var trialBalUrl = new RegExp('journalEntries\/getTrialBalance', 'i');

                server.respondWith('GET', trialBalUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                trialBalanceCollection = new TrialBalanceCollection({
                    page       : 1,
                    count      : 2,
                    viewType   : 'list',
                    contentType: 'trialBalance'
                });
                server.respond();

                expect(consoleLogSpy.calledOnce).to.be.true;
            });

            it('Try to create TopBarView', function (done) {
                var trialBalUrl = new RegExp('journalEntries\/getTrialBalance', 'i');

                server.respondWith('GET', trialBalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTrialBalance)]);
                trialBalanceCollection = new TrialBalanceCollection({
                    page       : 1,
                    viewType   : 'list',
                    contentType: 'trialBalance'
                });
                server.respond();

                expect(trialBalanceCollection).to.have.lengthOf(9);

                clock.tick(200);

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: trialBalanceCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Trial Balance');

                done();
            });
        });

        describe('TrialBalanceListView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var showHiddenSpy;

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
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                showHiddenSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to TrialBalance ListView', function (done) {
                    var journalUrl = new RegExp('\/journalEntries\/getAsyncDataForGL', 'i');

                    server.respondWith('GET', journalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournalEntry)]);
                    listView = new ListView({
                        startTime : new Date(),
                        collection: trialBalanceCollection
                    });
                    server.respond();

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(trialBalanceCollection, listView);

                    trialBalanceCollection.trigger('fetchFinished', {
                        totalRecords: trialBalanceCollection.totalRecords,
                        currentPage : trialBalanceCollection.currentPage,
                        pageSize    : trialBalanceCollection.pageSize
                    });

                    clock.tick(300);

                    $thisEl = listView.$el;
                    expect($thisEl.find('.list')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.not.equals(1);

                    done();
                });

                it('Try to expand item', function () {
                    var $firstTr = $thisEl.find('#listTable > tr:nth-child(1)');

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
                    var journalUrl = new RegExp('\/journalEntries\/getAsyncDataForGL', 'i');
                    var trialBalUrl = new RegExp('journalEntries\/getTrialBalance', 'i');
                    var $cancelBtn;
                    var $thisMonth;
                    var $finYear;
                    var $lastMonth;
                    var $lastQuarter;
                    var $lastFinYear;
                    var $customDate;
                    var $startDate;
                    var $endDate;

                    server.respondWith('GET', trialBalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTrialBalance)]);
                    server.respondWith('GET', journalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournalEntry)]);
                    $dateRange.click();

                    $thisMonth = $topBarEl.find('#thisMonth');
                    $thisMonth.click();
                    server.respond();
                    expect(setDateRangeSpy.calledOnce).to.be.true;

                    $finYear = $topBarEl.find('#thisYear');
                    $finYear.click();
                    server.respond();
                    expect(setDateRangeSpy.calledTwice).to.be.true;

                    $lastMonth = $topBarEl.find('#lastMonth');
                    $lastMonth.click();
                    server.respond();
                    expect(setDateRangeSpy.calledThrice).to.be.true;

                    $lastQuarter = $topBarEl.find('#lastQuarter');
                    $lastQuarter.click();
                    server.respond();
                    expect(setDateRangeSpy.callCount).to.be.equals(4);

                    $lastFinYear = $topBarEl.find('#lastYear');
                    $lastFinYear.click();
                    server.respond();
                    expect(setDateRangeSpy.callCount).to.be.equals(5);

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
                });
            });
        });
    });
});