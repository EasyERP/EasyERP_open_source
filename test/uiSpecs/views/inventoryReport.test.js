define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/inventoryReport/filterCollection',
    'views/main/MainView',
    'views/inventoryReport/list/ListView',
    'views/inventoryReport/TopBarView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone, modules, fixtures, FilterCollection, MainView, ListView, TopBarView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var expect;
    var view;
    var topBarView;
    var listView;
    var collection;
    var setDateRangeSpy;
    var showDatePickerSpy;
    var historyNavigateSpy;
    var ajaxSpy;
    var fakeResponse = [
        {
            _id           : '570505d60bbb61c30355b564',
            closingBalance: 111,
            inwards       : 111,
            name          : '01.01 - 01.04.16',
            openingBalance: 111,
            outwards      : 0,
            project       : '56fd3453a33b73e503e3eb65',
            projectName   : 'Donation App',
            salesmanager  : 'Peter Voloshchuk'
        },
        {
            _id           : '56dfe3adc7b580a03fff2f4d',
            closingBalance: 222,
            inwards       : 222,
            name          : '01.01.2016-31.01.2016',
            openingBalance: 222,
            outwards      : 222,
            project       : '56b09dd8d6ef38a708dfc284',
            projectName   : 'Vike Analytics Integration',
            salesmanager  : 'Roland Katona'
        },
        {
            _id           : '56d58e7b5132d292750a5e7d',
            closingBalance: 333,
            inwards       : 333,
            name          : '01.02 - 29.02',
            openingBalance: 333,
            outwards      : 333,
            project       : '562bc32484deb7cb59d61b70',
            projectName   : 'MyDrive',
            salesmanager  : 'Alona Yelahina'
        }];

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('inventoryReportView', function () {
        var $fixture;
        var $elFixture;
        var selectSpy;
        var saveFilterSpy;
        var removeFilterSpy;

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
            selectSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
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
                view = new MainView({el: $elFixture, contentType: 'inventoryReport'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="100"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="100"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/inventoryReport');
            });

        });

        describe('TopBarView', function () {
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to fetch collection with error', function () {
                var invoiceUrl = new RegExp('journalEntries\/getInventoryReport', 'i');

                server.respondWith('GET', invoiceUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                collection = new FilterCollection({
                    page       : 1,
                    count      : 2,
                    viewType   : 'list',
                    contentType: 'inventoryReport'
                });
                server.respond();
            });

            it('Try to create TopBarView', function () {
                var invoiceUrl = new RegExp('journalEntries\/getInventoryReport', 'i');

                server.respondWith('GET', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponse)]);
                collection = new FilterCollection({
                    page       : 1,
                    viewType   : 'list',
                    contentType: 'inventoryReport'
                });
                server.respond();

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: collection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Inventory Report');
            });

            describe('inventoryReportView', function () {
                var server;
                var clock;
                var $thisEl;
                var mainSpy;
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
                });

                after(function () {
                    server.restore();
                    clock.restore();
                    mainSpy.restore();
                    changeDateRangeSpy.restore();
                });

                describe('INITIALIZE', function () {

                    it('Try to create inventoryReportView', function (done) {
                        var asyncDataUrl = new RegExp('journalEntries\/getInventoryReport', 'i');

                        server.respondWith('GET', asyncDataUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponse)]);
                        listView = new ListView({
                            startTime : new Date(),
                            collection: collection
                        });
                        server.respond();

                        eventsBinder.subscribeTopBarEvents(topBarView, listView);
                        eventsBinder.subscribeCollectionEvents(collection, listView);

                        collection.trigger('fetchFinished', {
                            totalRecords: collection.totalRecords,
                            currentPage : collection.currentPage,
                            pageSize    : collection.pageSize
                        });

                        clock.tick(300);
                        $thisEl = listView.$el;

                        expect($thisEl.find('.list')).to.exist;
                        expect($thisEl.find('#listTable > tr')).to.not.equals(0);

                        done();
                    });

                    it('Try to filter ListView by Project', function () {
                        var $searchContainer = $thisEl.find('#searchContainer');
                        var $searchArrow = $searchContainer.find('.search-content');
                        var inventoryReportUrl = new RegExp('journalEntries\/getInventoryReport', 'i');
                        var $projectName;
                        var elementsCount;
                        var $country;
                        var $selectedItem;
                        var $next;
                        var $prev;

                        selectSpy.reset();

                        // open filter dropdown
                        $searchArrow.click();
                        expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                        // select fullName
                        $projectName = $searchContainer.find('#projectFullContainer .groupName');
                        $projectName.click();
                        $selectedItem = $searchContainer.find('li[data-value="56e689c75ec71b00429745a9"]');

                        server.respondWith('GET', inventoryReportUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponse)]);
                        $selectedItem.click();
                        server.respond();
                        expect(selectSpy.calledOnce).to.be.true;
                        expect($thisEl.find('#searchContainer')).to.exist;
                        elementsCount = $thisEl.find('#listTable > tr').length;
                        expect(elementsCount).to.be.equals(3);

                    });

                    it('Try to save favorites filters', function () {
                        var userUrl = new RegExp('\/users\/', 'i');
                        var $searchContainer = $thisEl.find('#searchContainer');
                        var $searchArrow = $searchContainer.find('.search-content');
                        var $favoritesBtn = $searchContainer.find('li[data-value="#favoritesContent"]');
                        var $filterNameInput;
                        var $saveFilterBtn;

                        saveFilterSpy.reset();

                        $favoritesBtn.click();
                        expect($searchContainer.find('#filtersContent')).to.have.class('hidden');

                        $filterNameInput = $searchContainer.find('#forFilterName');
                        $filterNameInput.val('Test');
                        $saveFilterBtn = $searchContainer.find('#saveFilterButton');

                        server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                        $saveFilterBtn.click();
                        server.respond();
                        expect(saveFilterSpy.called).to.be.true;

                        //close filter dropdown
                        $searchArrow.click();
                        expect($searchContainer.find('.search-options')).to.have.class('hidden');
                    });

                    it('Try to delete Project filter', function () {
                        var $searchContainer = $thisEl.find('#searchContainer');
                        var $closeBtn = $searchContainer.find('span[data-value="project"]').next();
                        var inventoryReportUrl = new RegExp('journalEntries\/getInventoryReport', 'i');
                        var elementsCount;

                        removeFilterSpy.reset();

                        server.respondWith('GET', inventoryReportUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponse)]);
                        $closeBtn.click();
                        server.respond();

                        expect(removeFilterSpy.called).to.be.true;
                        expect($thisEl).to.exist;
                        elementsCount = $thisEl.find('#listTable > tr').length;
                        expect(elementsCount).to.be.equals(3);
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

                        server.respondWith('GET', profitAndLossUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponse)]);
                        server.respondWith('GET', asyncDataUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponse)]);
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
});
