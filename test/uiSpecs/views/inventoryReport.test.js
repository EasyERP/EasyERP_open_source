define([
    'Backbone',
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'collections/inventoryReport/filterCollection',
    'views/main/MainView',
    'views/inventoryReport/list/ListView',
    'views/inventoryReport/TopBarView',
    'views/Filter/filterView',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'constants/filters'
], function (Backbone,
             _,
             modules,
             fixtures,
             FilterCollection,
             MainView,
             ListView,
             TopBarView,
             FilterView,
             FilterGroup,
             SavedFilters,
             eventsBinder,
             $,
             chai,
             chaiJquery,
             sinonChai,
             FILTER_CONSTANTS) {
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
    var fakeResponse = {
        total: 300,
        data : [
            {
                _id: "568a26203cce9254776f2ae6",
                name: ".net bus project",
                salesmanager: "Peterr Voloshchuk",
                project: "5629e238129820ab5994e8c0",
                projectName: "Bus Project",
                openingBalance: 3267.694118105907,
                inwards: 32.01782985360849,
                outwards: 3299.7119479595153,
                closingBalance: 0
            },
            {
                _id: "575536d852e8f40a76bef288",
                name: "01-31.04.2016",
                salesmanager: "Yana Gusti",
                project: "55b92ad621e4b7c40f000694",
                projectName: "QA iOS Purple Ocean",
                openingBalance: 0,
                inwards: 48.026744780412734,
                outwards: 0,
                closingBalance: 48.026744780412734
            },
            {
                _id: "570505d60bbb61c30355b564",
                name: "01.01 - 01.04.16",
                salesmanager: "Peterr Voloshchuk",
                project: "56fd3453a33b73e503e3eb65",
                projectName: "Donation App",
                openingBalance: 2705.4260231618177,
                inwards: 345.0311463924777,
                outwards: 0,
                closingBalance: 3050.4571695542954
            }
        ]
    };
    var fakeFilters = {
        _id    : null,
        project: [
            {
                _id: "55b92ad621e4b7c40f0006ae",
                name: "Kikast"
            },
            {
                _id: "55b92ad621e4b7c40f00068e",
                name: "Phidget ANE"
            },
            {
                _id: "56e003948594da632689f1cd",
                name: "Phone app"
            }
        ],

        salesManager: [
            {
                _id: "56e2e83a74ac46664a83e94b",
                name: "Yevgenia Melnyk"
            },
            {
                _id: "55b92ad221e4b7c40f0000cb",
                name: "Alona Yelahina"
            },
            {
                _id: "5602a01550de7f4138000008",
                name: "Yana Dufynets"
            }
        ]
    };
    var fakeResponseSavedFilter = {};
    var selectSpy;
    var removeFilterSpy;
    var saveFilterSpy;
    var removedFromDBSpy;
    var debounceStub;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('inventoryReportView', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            ajaxSpy = sinon.spy($, 'ajax');
            setDateRangeSpy = sinon.spy(TopBarView.prototype, 'setDateRange');
            showDatePickerSpy = sinon.spy(TopBarView.prototype, 'showDatePickers');
            selectSpy = sinon.spy(FilterGroup.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(SavedFilters.prototype, 'saveFilter');
            removedFromDBSpy = sinon.spy(SavedFilters.prototype, 'removeFilterFromDB');
            debounceStub = sinon.stub(_, 'debounce', function (debFunction) {
                return debFunction;
            });
        });

        after(function () {
            view.remove();
            setDateRangeSpy.restore();
            showDatePickerSpy.restore();
            historyNavigateSpy.restore();
            ajaxSpy.restore();
            selectSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
            removedFromDBSpy.restore();
            debounceStub.restore();

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

                historyNavigateSpy.reset();

                server.respondWith('GET', invoiceUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                collection = new FilterCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'inventoryReport'
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var invoiceUrl = new RegExp('journalEntries\/getInventoryReport', 'i');

                server.respondWith('GET', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponse)]);
                collection = new FilterCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'inventoryReport'
                });
                server.respond();

                expect(collection).to.have.lengthOf(3);

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
                        var filterUrl = '/filter/inventoryReport';


                        server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilters)]);
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

                        clock.tick(700);
                        $thisEl = listView.$el;

                        expect($thisEl.find('.list')).to.exist;
                        expect($thisEl.find('#listTable > tr')).to.not.equals(0);

                        done();
                    });

                    it('Try to filter listView by Assigned and company', function () {
                        var url = 'journalEntries/getInventoryReport';
                        var contentType = 'inventoryReport';
                        var firstValue = 'project';
                        var secondValue = 'salesManager';
                        var $searchContainer = $thisEl.find('#searchContainer');
                        var $searchArrow = $searchContainer.find('.search-content');
                        var contentUrl = new RegExp(url, 'i');
                        var $firstContainer = '#' + firstValue + 'FullContainer .groupName';
                        var $firstSelector = '#' + firstValue + 'Ul > li:nth-child(1)';
                        var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                        var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                        var elementQuery = '#listTable > tr';
                        var $firstGroup;
                        var $secondGroup;
                        var elementsCount;
                        var $selectedItem;
                        var ajaxResponse;
                        var filterObject;
                        selectSpy.reset();

                        // open filter dropdown
                        $searchArrow.click();
                        expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                        // select firstGroup filter
                        ajaxSpy.reset();
                        $firstGroup = $searchContainer.find($firstContainer);
                        $firstGroup.click();

                        $selectedItem = $searchContainer.find($firstSelector);

                        server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponse)]);
                        $selectedItem.click();
                        server.respond();

                        expect(selectSpy.calledOnce).to.be.true;
                        expect($thisEl.find('#searchContainer')).to.exist;
                        //expect($thisEl.find('#startLetter')).to.exist;
                        expect($searchContainer.find('#searchFilterContainer>div')).to.have.lengthOf(1);
                        expect($searchContainer.find($firstSelector)).to.have.class('checkedValue');
                        elementsCount = $thisEl.find(elementQuery).length;
                        expect(elementsCount).to.be.not.equals(0);

                        expect(ajaxSpy.calledOnce).to.be.true;

                        ajaxResponse = ajaxSpy.args[0][0];
                        expect(ajaxResponse).to.have.property('url', url);
                        expect(ajaxResponse).to.have.property('type', 'GET');
                        expect(ajaxResponse.data).to.have.property('filter');
                        filterObject = ajaxResponse.data.filter;

                        expect(filterObject[firstValue]).to.exist;
                        expect(filterObject.date.value).to.exist;
                        expect(filterObject.date.value)
                            .is.an.instanceOf(Array)
                            .and
                            .to.have.lengthOf(2);
                        expect(filterObject[firstValue]).to.have.property('key', FILTER_CONSTANTS[contentType][firstValue].backend);
                        expect(filterObject[firstValue]).to.have.property('value');
                        expect(filterObject[firstValue].value)
                            .to.be.instanceof(Array)
                            .and
                            .to.have.lengthOf(1);

                        // select secondGroup filter
                        ajaxSpy.reset();

                        $searchArrow.click();

                        $secondGroup = $thisEl.find($secondContainer);
                        $secondGroup.click();
                        $selectedItem = $searchContainer.find($secondSelector);
                        $selectedItem.click();
                        server.respond();

                        expect(selectSpy.calledTwice).to.be.true;
                        expect($thisEl.find('#searchContainer')).to.exist;
                        //expect($thisEl.find('#startLetter')).to.exist;
                        expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(2);
                        expect($searchContainer.find($secondSelector)).to.have.class('checkedValue');
                        elementsCount = $thisEl.find(elementQuery).length;
                        expect(elementsCount).to.be.not.equals(0);

                        ajaxResponse = ajaxSpy.args[0][0];
                        expect(ajaxResponse).to.have.property('url', url);
                        expect(ajaxResponse).to.have.property('type', 'GET');
                        expect(ajaxResponse.data).to.have.property('filter');
                        filterObject = ajaxResponse.data.filter;

                        expect(filterObject[firstValue]).to.exist;
                        expect(filterObject[secondValue]).to.exist;
                        expect(filterObject[secondValue]).to.have.property('key', FILTER_CONSTANTS[contentType][secondValue].backend);
                        expect(filterObject[secondValue]).to.have.property('value');
                        expect(filterObject[secondValue].value)
                            .to.be.instanceof(Array)
                            .and
                            .to.have.lengthOf(1);

                        // unselect secondGroup filter
                        $selectedItem = $searchContainer.find($secondSelector);
                        $selectedItem.click();
                        server.respond();

                        expect(selectSpy.calledThrice).to.be.true;
                        expect($thisEl.find('#searchContainer')).to.exist;
                        //expect($thisEl.find('#startLetter')).to.exist;
                        expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
                        expect($searchContainer.find($secondSelector)).to.have.not.class('checkedValue');
                        elementsCount = $thisEl.find(elementQuery).length;
                        expect(elementsCount).to.be.not.equals(0);

                        ajaxResponse = ajaxSpy.args[0][0];
                        expect(ajaxResponse).to.have.property('url', url);
                        expect(ajaxResponse).to.have.property('type', 'GET');
                        expect(ajaxResponse.data).to.have.property('filter');
                        filterObject = ajaxResponse.data.filter;

                        expect(filterObject[firstValue]).to.exist;
                        expect(filterObject[secondValue]).to.not.exist;
                    });

                    /*it('Try to save filter', function () {
                        var $searchContainer = $('#searchContainer');
                        var userUrl = new RegExp('\/users\/', 'i');
                        var $searchArrow = $searchContainer.find('.search-content');
                        var $favoritesBtn;
                        var $filterNameInput;
                        var $saveFilterBtn;

                        saveFilterSpy.reset();

                        $searchArrow.click();
                        expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                        $favoritesBtn = $searchContainer.find('.filter-dialog-tabs > li:nth-child(2)');
                        $favoritesBtn.click();
                        expect($searchContainer.find('#filtersContent')).to.have.class('hidden');

                        $filterNameInput = $searchContainer.find('#forFilterName');
                        $filterNameInput.val('TestFilter');
                        $saveFilterBtn = $searchContainer.find('#saveFilterButton');
                        server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponseSavedFilter)]);
                        $saveFilterBtn.click();
                        server.respond();
                        expect(saveFilterSpy.called).to.be.true;
                        expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(1);
                        expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
                    });

                    it('Try to remove saved filters', function() {
                        var $searchContainer = $('#searchContainer');
                        var $deleteSavedFilterBtn = $searchContainer.find('#savedFiltersElements > li:nth-child(1) > button.removeSavedFilter');
                        var userUrl = new RegExp('\/users\/', 'i');

                        removedFromDBSpy.reset();

                        server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                        $deleteSavedFilterBtn.click();
                        server.respond();

                        expect(removedFromDBSpy.calledOnce).to.be.true;
                        expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(0);
                        expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(0);
                    });*/

                    it('Try to remove filter', function (done) {
                        var secondValue = 'supplier';
                        var $searchContainer = $('#searchContainer');
                        var $searchArrow = $searchContainer.find('.search-content');
                        var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                        var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                        var $thisEl = $('#content-holder');
                        var $secondGroup;
                        var $selectedItem;
                        var $removeBtn;

                        $searchArrow.click();

                        /*$secondGroup = $thisEl.find($secondContainer);
                        $secondGroup.click();
                        $selectedItem = $searchContainer.find($secondSelector);
                        $selectedItem.click();
                        server.respond();*/

                        // remove firstGroupFilter
                        ajaxSpy.reset();
                        removeFilterSpy.reset();

                        $removeBtn = $searchContainer.find('.removeValues');
                        $removeBtn.click();
                        clock.tick(3000);

                        server.respond();

                        clock.tick(3000);


                        expect(removeFilterSpy.calledOnce).to.be.true;
                        expect(ajaxSpy.calledOnce).to.be.true;
                        expect($searchContainer.find('.forFilterIcons')).to.have.lengthOf(0);

                        done();
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
