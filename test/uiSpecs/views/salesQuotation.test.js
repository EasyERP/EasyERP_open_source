define([
    'Backbone',
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'collections/Quotations/filterCollection',
    'views/main/MainView',
    'views/salesQuotations/list/ListView',
    'views/salesQuotations/TopBarView',
    'views/salesQuotations/CreateView',
    'views/salesQuotations/EditView',
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
             QuotationCollection,
             MainView,
             ListView,
             TopBarView,
             CreateView,
             EditView,
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
    var fakeQuotation = {
        total: 300,
        data : [
            {
                _id            : "574ecda5675726b0356600a9",
                total          : 60,
                salesManager   : {
                    name: {
                        last : "Lendyel",
                        first: "Eugen"
                    }
                },
                name           : "PO1093",
                paymentInfo    : {
                    total: 620000
                },
                orderDate      : "2016-05-31T22:00:00.000Z",
                workflow       : {
                    _id   : "5555bf276a3f01acae0b5560",
                    name  : "Not Ordered",
                    status: "New"
                },
                supplier       : {
                    _id : "56e290f1896e98a661aa831a",
                    name: {
                        last : "",
                        first: "Game scale"
                    }
                },
                currency       : {
                    rate: 1,
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                project        : {
                    _id : "57455e519da6ef635b97196e",
                    name: "Black Jack"
                },
                proformaCounter: 1
            },
            {
                _id            : "574ec8cecafdf9d135cfd666",
                total          : 60,
                salesManager   : {
                    name: {
                        last : "Stan",
                        first: "Igor"
                    }
                },
                name           : "PO1092",
                paymentInfo    : {
                    total: 108000
                },
                orderDate      : "2016-05-29T22:00:00.000Z",
                workflow       : {
                    _id   : "5555bf276a3f01acae0b5560",
                    name  : "Not Ordered",
                    status: "New"
                },
                supplier       : {
                    _id : "56a0d53b62d172544baf0e3c",
                    name: {
                        last : "Liden",
                        first: "Ivar"
                    }
                },
                currency       : {
                    rate: 1,
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                project        : {
                    _id : "56a0d60062d172544baf0e3d",
                    name: "BuddyBet"
                },
                proformaCounter: 0
            },
            {
                _id            : "57485df96466b2d41fc8170a",
                total          : 60,
                salesManager   : {
                    name: {
                        last : "Katona",
                        first: "Roland"
                    }
                },
                name           : "PO1083",
                paymentInfo    : {
                    total: 232400
                },
                orderDate      : "2016-05-26T22:00:00.000Z",
                workflow       : {
                    _id   : "5555bf276a3f01acae0b5560",
                    name  : "Not Ordered",
                    status: "New"
                },
                supplier       : {
                    _id : "5735e9f4044544e64738e595",
                    name: {
                        last : "",
                        first: "Carussel Group"
                    }
                },
                currency       : {
                    rate: 0.896881,
                    _id : "565eab34aeb95fa9c0f9df2e"
                },
                project        : {
                    _id : "55b92ad621e4b7c40f0006d1",
                    name: "Sales Tool"
                },
                proformaCounter: 0
            }
        ]
    };
    var fakeQuotationForm = {
        _id           : "56e7c1d6c64e96844ef3d6a6",
        expectedDate  : "2016-03-14T22:00:00.000Z",
        __v           : 0,
        editedBy      : {
            date: "2016-03-15T08:03:34.117Z",
            user: "56239e0ce9576d1728a9ed1d"
        },
        createdBy     : {
            date: "2016-03-15T08:03:34.117Z",
            user: "56239e0ce9576d1728a9ed1d"
        },
        creationDate  : "2016-03-15T08:03:34.117Z",
        groups        : {
            group: [],
            users: [],
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        whoCanRW      : "everyOne",
        workflow      : {
            _id   : "5555bf276a3f01acae0b5560",
            name  : "Not Ordered",
            status: "New"
        },
        products      : [
            {
                unitPrice    : 1500,
                scheduledDate: "2016-03-15T00:00:00.000Z",
                taxes        : 0,
                subTotal     : 1500,
                jobs         : {
                    _id : "564cfdd06584412e618421c3",
                    name: "02.11-21.01"
                },
                description  : "",
                product      : {
                    _id : "5540d528dacb551c24000003",
                    name: "IT services"
                },
                quantity     : 409
            }
        ],
        paymentInfo   : {
            taxes  : 0,
            unTaxed: 1500,
            total  : 1500
        },
        paymentTerm   : null,
        invoiceRecived: false,
        invoiceControl: null,
        incoterm      : null,
        destination   : null,
        name          : "PO899",
        orderDate     : "2016-03-15T00:00:00.000Z",
        deliverTo     : {
            _id : "55543831d51bdef79ea0d58c",
            name: "YourCompany"
        },
        project       : {
            _id        : "563295f6c928c61d052d5003",
            projectName: "WordPress Sites"
        },
        supplier      : {
            _id     : "55cf4f834a91e37b0b000102",
            name    : {
                last : "",
                first: "SharperBuilds"
            },
            fullName: "SharperBuilds ",
            id      : "55cf4f834a91e37b0b000102"
        },
        isOrder       : false,
        type          : "Not Ordered",
        forSales      : true,
        currency      : {
            rate: 1,
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                sequence: 0,
                name    : "USD"
            }
        }
    };
    var fakeCurrencies = {
        data: [
            {
                _id     : "565eab29aeb95fa9c0f9df2d",
                sequence: 0,
                name    : "USD"
            },
            {
                _id     : "565eab34aeb95fa9c0f9df2e",
                sequence: 1,
                name    : "EUR"
            },
            {
                _id     : "565eab3faeb95fa9c0f9df2f",
                sequence: 2,
                name    : "UAH"
            }
        ]
    };
    var fakeFilter = {
        _id: null,
        project: [
            {
                _id: "5757e30152e8f40a76befd56",
                name: "Hipteam Projects"
            },
            {
                _id: "57557089a6d2f5e9754631d7",
                name: "Bike Registration Website"
            },
            {
                _id: "5721d21871d367e52185bd3c",
                name: "FlightText"
            }
        ],

        supplier: [
            {
                _id: "5721d1bb2d11557621505d02",
                name: "Pere Sanz"
            },
            {
                _id: "573dd7271a18dbb345b58f6e",
                name: "Digital Media Experience LLC "
            },
            {
                _id: "56e290f1896e98a661aa831a",
                name: "Game scale "
            }
        ]
    };
    var fakeResponseSavedFilter = {
        "success": {
            "_id"            : "52203e707d4dba8813000003",
            "__v": 0,
            "attachments": [],
            "lastAccess" : "2016-06-29T08:36:54.760Z",
            "profile"    : 1387275598000,
            "relatedEmployee": "55b92ad221e4b7c40f00004f",
            "savedFilters"   : [{"_id": "5773914af2ec5e1517865734", "contentType": "salesQuotation", "byDefault": false}],
            "kanbanSettings" : {
                "tasks"        : {"foldWorkflows": ["Empty"], "countPerPage": 10},
                "applications": {"foldWorkflows": ["Empty"], "countPerPage": 87},
                "opportunities": {"foldWorkflows": ["Empty"], "countPerPage": 10}
            },
            "credentials"    : {"access_token": "", "refresh_token": ""},
            "pass"           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
            "email"          : "info@thinkmobiles.com",
            "login"          : "admin"
        }
    };
    var quotationCollection;
    var view;
    var topBarView;
    var listView;
    var historyNavigateSpy;
    var ajaxSpy;
    var selectSpy;
    var removeFilterSpy;
    var saveFilterSpy;
    var removedFromDBSpy;
    var debounceStub;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('SalesQuotationView', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            ajaxSpy = sinon.spy($, 'ajax');
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
            topBarView.remove();
            listView.remove();

            if ($('.ui-dialog').length) {
                $('.ui-dialog').remove();
            }

            historyNavigateSpy.restore();
            ajaxSpy.restore();
            selectSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
            removedFromDBSpy.restore();
            debounceStub.restore();
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

                view = new MainView({el: $elFixture, contentType: 'salesQuotations'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="62"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="62"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/salesQuotations');

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

            it('Try to fetch collection with error response', function () {
                var quotationUrl = new RegExp('\/quotations\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', quotationUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotation)]);
                quotationCollection = new QuotationCollection({
                    count      : 100,
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    reset      : true,
                    showMore   : false,
                    contentType: 'salesQuotations'
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var quotationUrl = new RegExp('\/quotations\/', 'i');

                server.respondWith('GET', quotationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotation)]);
                quotationCollection = new QuotationCollection({
                    count      : 100,
                    viewType   : 'list',
                    contentType: 'salesQuotations'
                });
                server.respond();

                expect(quotationCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: quotationCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
            });
        });

        describe('List View', function () {
            var server;
            var mainSpy;
            var clock;
            var $thisEl;
            var windowConfirmStub;
            var sortSpy;
            var deleteSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                sortSpy = sinon.spy(ListView.prototype, 'goSort');
                deleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();
                windowConfirmStub.restore();
                sortSpy.restore();
                deleteSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create listView', function (done) {
                    var filterUrl = '/filter/salesQuotations';
                    var $firstRow;
                    var colCount;
                    var reference;
                    var customer;
                    var salesPerson;
                    var total;
                    var status;
                    var date;
                    var $pagination;
                    var $currentPageList;

                    server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilter)]);
                    listView = new ListView({
                        collection: quotationCollection,
                        startTime : new Date()
                    });
                    server.respond();

                    clock.tick(200);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(quotationCollection, listView);

                    quotationCollection.trigger('fetchFinished', {
                        totalRecords: quotationCollection.totalRecords,
                        currentPage : quotationCollection.currentPage,
                        pageSize    : quotationCollection.pageSize
                    });

                    $thisEl = listView.$el;
                    expect($thisEl).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(8);

                    reference = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(reference).not.to.be.empty;
                    expect(reference).to.not.match(/object Object|undefined/);

                    customer = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(customer).not.to.be.empty;
                    expect(customer).to.not.match(/object Object|undefined/);

                    salesPerson = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(salesPerson).not.to.be.empty;
                    expect(salesPerson).to.not.match(/object Object|undefined/);

                    total = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(total).not.to.be.empty;
                    expect(total).to.not.match(/object Object|undefined/);

                    status = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(status).not.to.be.empty;
                    expect(status).to.not.match(/object Object|undefined/);

                    date = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(date).not.to.be.empty;
                    expect(date).to.not.match(/object Object|undefined/);

                    // test pagination container

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

                it('Try to sort list', function () {
                    var quotationUrl = new RegExp('\/quotations\/', 'i');
                    var $thSortEl = listView.$el.find('table > thead > tr > th[data-sort="paymentInfo.total"]');

                    sortSpy.reset();

                    server.respondWith('GET', quotationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        total: 300,
                        data : [
                            fakeQuotation.data[2],
                            fakeQuotation.data[1],
                            fakeQuotation.data[0]
                        ]
                    })]);
                    $thSortEl.click();
                    server.respond();

                    expect(sortSpy.calledOnce).to.be.true;
                    expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('57485df96466b2d41fc8170a');

                    server.respondWith('GET', quotationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotation)]);
                    $thSortEl.click();
                    server.respond();

                    expect(sortSpy.calledTwice).to.be.true;
                    expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('574ecda5675726b0356600a9');

                });

                it('Try to check disabled checkbox', function () {
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var $topBarEl = topBarView.$el;

                    $needCheckBox.click();
                    expect($needCheckBox.prop('disabled')).to.be.true;
                    expect($needCheckBox.prop('checked')).to.be.false;
                    expect($topBarEl.find('#top-bar-deleteBtn')).to.have.css('display', 'none');
                });

                it('Try to delete item with error', function () {
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(2) > td.notForm > input');
                    var quotationUrl = new RegExp('\/quotations\/', 'i');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    mainSpy.reset();

                    $needCheckBox.click();

                    server.respondWith('DELETE', quotationUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteSpy.calledOnce).to.be.true;
                    expect(mainSpy.calledOnce).to.be.true;
                    expect(mainSpy.args[0][0]).to.have.property('type', 'error');
                });

                it('Try to delete item', function () {
                    var quotationUrl = new RegExp('\/quotations\/', 'i');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    server.respondWith('DELETE', quotationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "success": {
                            "_id"           : "56e68fa4dd81ed4e426c60d1",
                            "expectedDate"  : "2016-03-13T22:00:00.000Z",
                            "__v"           : 0,
                            "editedBy"      : {
                                "date": "2016-03-14T10:17:08.480Z",
                                "user": "55ba0c01d79a3a3439000014"
                            },
                            "createdBy"     : {
                                "date": "2016-03-14T10:17:08.480Z",
                                "user": "55ba0c01d79a3a3439000014"
                            },
                            "creationDate"  : "2016-03-14T10:17:08.480Z",
                            "groups"        : {
                                "group": [],
                                "users": [],
                                "owner": "55ba28c8d79a3a3439000016"
                            },
                            "whoCanRW"      : "everyOne",
                            "workflow"      : "5555bf276a3f01acae0b5560",
                            "products"      : [{
                                "subTotal"     : 13500,
                                "taxes"        : 0,
                                "scheduledDate": "2016-03-14T00:00:00.000Z",
                                "unitPrice"    : 13500,
                                "jobs"         : "56dff02c425d4276052c23d3",
                                "description"  : "",
                                "product"      : "5540d528dacb551c24000003",
                                "quantity"     : 691
                            }],
                            "paymentInfo"   : {
                                "taxes"  : 0,
                                "unTaxed": 13500,
                                "total"  : 13500
                            },
                            "paymentTerm"   : null,
                            "invoiceRecived": false,
                            "invoiceControl": null,
                            "incoterm"      : null,
                            "destination"   : null,
                            "name"          : "PO887",
                            "orderDate"     : "2016-03-14T00:00:00.000Z",
                            "deliverTo"     : "55543831d51bdef79ea0d58c",
                            "project"       : "55cf36d54a91e37b0b0000c2",
                            "supplier"      : "55cf362b4a91e37b0b0000c1",
                            "isOrder"       : false,
                            "type"          : "Not Ordered",
                            "forSales"      : true,
                            "currency"      : {
                                "rate": 1,
                                "_id" : "565eab29aeb95fa9c0f9df2d"
                            }
                        }
                    })]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteSpy.calledTwice).to.be.true;
                });

                it('Try to open CreateView', function () {
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.exist;
                    $('.ui-dialog').remove();
                });

                it('Try to go to edit form with error response', function () {
                    var spyResponse;
                    var quotationFormUrl = new RegExp('\/quotations\/', 'i');
                    var $needTd = listView.$el.find('tr:nth-child(1) > td:nth-child(3)');

                    server.respondWith('GET', quotationFormUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotationForm)]);
                    $needTd.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to go to edit form', function () {
                    var quotationFormUrl = new RegExp('\/quotations\/', 'i');
                    var currencyUrl = new RegExp('\/currency\/getForDd', 'i');
                    var $needTd = listView.$el.find('tr:nth-child(1) > td:nth-child(3)');

                    server.respondWith('GET', quotationFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotationForm)]);
                    server.respondWith('GET', currencyUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCurrencies)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to change tabs', function () {
                    var $dialogEl = $('.ui-dialog');
                    var $firstTab = $dialogEl.find('ul.dialog-tabs > li:nth-child(1) > a');
                    var $secondTab = $dialogEl.find('ul.dialog-tabs > li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($dialogEl.find('ul.dialog-tabs > li:nth-child(2) > a')).to.have.class('active');

                    $firstTab.click();
                    expect($dialogEl.find('ul.dialog-tabs > li:nth-child(1) > a')).to.have.class('active');
                });

                it('Try to filter listView by Project and supplier', function () {
                    var url = '/quotations/';
                    var contentType = 'salesQuotations';
                    var firstValue = 'project';
                    var secondValue = 'supplier';
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

                    server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotation)]);
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
                    expect(filterObject[firstValue]).to.have.property('key', FILTER_CONSTANTS[contentType][firstValue].backend);
                    expect(filterObject[firstValue]).to.have.property('value');
                    expect(filterObject[firstValue].value)
                        .to.be.instanceof(Array)
                        .and
                        .to.have.lengthOf(1);

                    // select secondGroup filter
                    ajaxSpy.reset();

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

                    ajaxSpy.reset();
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

                it('Try to save filter', function () {
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

                it('Try to remove saved filters', function () {
                    var $searchContainer = $('#searchContainer');
                    var $deleteSavedFilterBtn = $searchContainer.find('#savedFiltersElements > li:nth-child(1) > button.removeSavedFilter');
                    var userUrl = new RegExp('\/users\/', 'i');

                    removedFromDBSpy.reset();

                    server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteSavedFilterBtn.click();
                    server.respond();

                    expect(removedFromDBSpy.calledOnce).to.be.true;
                    expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(0);
                });

                it('Try to remove filter', function () {
                    var secondValue = 'salesManager';
                    var $searchContainer = $('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                    var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                    var $secondGroup;
                    var $selectedItem;
                    var $removeBtn;

                    $searchArrow.click();

                    $secondGroup = $thisEl.find($secondContainer);
                    $secondGroup.click();
                    $selectedItem = $searchContainer.find($secondSelector);
                    $selectedItem.click();
                    server.respond();

                    // remove firstGroupFilter
                    ajaxSpy.reset();
                    removeFilterSpy.reset();

                    $removeBtn = $searchContainer.find('.removeValues');
                    $removeBtn.click();
                    server.respond();

                    expect(removeFilterSpy.calledOnce).to.be.true;
                    expect(ajaxSpy.calledOnce).to.be.true;
                });
            });
        });
    });
});
