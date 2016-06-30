define([
    'modules',
    'text!fixtures/index.html',
    'collections/cashFlow/filterCollection',
    'views/main/MainView',
    'views/cashFlow/list/ListView',
    'views/cashFlow/TopBarView',
    'views/Filter/filterView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules, fixtures, CashFlowCollection, MainView, ListView, TopBarView, FilterView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var fakeCashFlow = {
        operating: [
            {
                name : "Operating Income (EBIT)",
                debit: 14313184.344531456
            },
            {
                name : "101200 Account Receivable",
                debit: -13262000
            },
            {
                name : [
                    "104000 Finished Goods"
                ],
                debit: 4.656612873077393e-10
            },
            {
                name : [
                    "104001 Work In Process"
                ],
                debit: 3681315.655468544
            },
            {
                name : "Salary Payable",
                debit: 0
            },
            {
                name : "Salary Overtime Payable",
                debit: 0
            },
            {
                name : [
                    "111000 Current Liabilities"
                ],
                debit: 208093.7645571305
            },
            {
                name : "Account Payable",
                debit: 0
            }
        ],
        investing: [],
        financing: [
            {
                name : "777777 Dividends Payable",
                debit: 0
            }
        ]
    };
    var fakeAsyncData = {
        journalEntries: []
    };
    var view;
    var topBarView;
    var listView;
    var cashFlowCollection;
    var setDateRangeSpy;
    var showDatePickerSpy;
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('CashFlowView', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            setDateRangeSpy = sinon.spy(TopBarView.prototype, 'setDateRange');
            showDatePickerSpy = sinon.spy(TopBarView.prototype, 'showDatePickers');
        });

        after(function () {
            topBarView.remove();
            listView.remove();
            view.remove();

            setDateRangeSpy.restore();
            showDatePickerSpy.restore();
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
                view = new MainView({el: $elFixture, contentType: 'cashFlow'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="93"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="93"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/cashFlow');
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
                var cashFlowUrl = new RegExp('journalEntries\/getCashFlow', 'i');

                server.respondWith('GET', cashFlowUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                cashFlowCollection = new CashFlowCollection({
                    page       : 1,
                    count      : 2,
                    viewType   : 'list',
                    contentType: 'cashFlow'
                });
                server.respond();

                expect(consoleLogSpy.calledOnce).to.be.true;
            });

            it('Try to create TopBarView', function (done) {
                var cashFlowUrl = new RegExp('journalEntries\/getCashFlow', 'i');
                var collectionToJSON;

                server.respondWith('GET', cashFlowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCashFlow)]);
                cashFlowCollection = new CashFlowCollection({
                    page       : 1,
                    viewType   : 'list',
                    contentType: 'cashFlow'
                });
                server.respond();
                collectionToJSON = cashFlowCollection.toJSON();
                expect(collectionToJSON[0]).to.have.property('financing').and.to.be.instanceof(Array);
                expect(collectionToJSON[0]).to.have.property('investing').and.to.be.instanceof(Array);
                expect(collectionToJSON[0]).to.have.property('operating').and.to.be.instanceof(Array);

                clock.tick(200);

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: cashFlowCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Cash Flow');

                done();
            });
        });

        describe('CashFlowView', function () {
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

                it('Try to create CashFlowView', function (done) {
                    var asyncDataUrl = new RegExp('\/journalEntries\/getAsyncDataForGL', 'i');

                    server.respondWith('GET', asyncDataUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAsyncData)]);
                    listView = new ListView({
                        startTime : new Date(),
                        collection: cashFlowCollection
                    });
                    server.respond();
                    clock.tick(300);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(cashFlowCollection, listView);

                    cashFlowCollection.trigger('fetchFinished', {
                        totalRecords: cashFlowCollection.totalRecords,
                        currentPage : cashFlowCollection.currentPage,
                        pageSize    : cashFlowCollection.pageSize
                    });

                    $thisEl = listView.$el;
                    expect($thisEl.find('.list')).to.exist;
                    expect($thisEl.find('#listTableOperating')).to.exist;
                    expect($thisEl.find('#listTableInvesting')).to.exist;
                    expect($thisEl.find('#listTableFinancing')).to.exist;

                    done();
                });

                it('Try to expand item', function () {
                    var $firstTr = $thisEl.find('#listTableOperating > tr').first();

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
                    var cashFlowUrl = new RegExp('journalEntries\/getCashFlow', 'i');
                    var $cancelBtn;
                    var $thisMonth;
                    var $finYear;
                    var $lastMonth;
                    var $lastQuarter;
                    var $lastFinYear;
                    var $customDate;
                    var $startDate;
                    var $endDate;

                    server.respondWith('GET', cashFlowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCashFlow)]);
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