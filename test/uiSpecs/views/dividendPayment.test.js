define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/DividendPayments/filterCollection',
    'views/main/MainView',
    'views/DividendPayments/list/ListView',
    'views/DividendPayments/TopBarView',
    'views/DividendPayments/CreateView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone, modules, fixtures, DividendCollection, MainView, ListView, TopBarView, CreateView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;
    var fakeDividend = {
        total: 300,
        data : [
            {
                _id             : "572ca054487014c939a3d214",
                total           : 15,
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id     : "572c9fa7f1311e2739814c4d",
                    workflow: {
                        name: "Paid"
                    },
                    name    : "DD15"
                },
                forSale         : false,
                differenceAmount: 0,
                paidAmount      : 153800,
                workflow        : "Paid",
                date            : "2016-04-29T22:00:00.000Z",
                paymentMethod   : {
                    _id : "565f2e05ab70d49024242e07",
                    name: "Erste USD"
                },
                paymentRef      : "",
                period          : null,
                _type           : "dividendInvoicePayment",
                removable       : true
            },
            {
                _id             : "572ca04a55c631a239a57cfc",
                total           : 15,
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id     : "572c9f93265f2548392c912e",
                    workflow: {
                        name: "Paid"
                    },
                    name    : "DD14"
                },
                forSale         : false,
                differenceAmount: 0,
                paidAmount      : 125700,
                workflow        : "Paid",
                date            : "2016-03-30T22:00:00.000Z",
                paymentMethod   : {
                    _id : "565f2e05ab70d49024242e07",
                    name: "Erste USD"
                },
                paymentRef      : "",
                period          : null,
                _type           : "dividendInvoicePayment",
                removable       : true
            },
            {
                _id             : "572ca03c526c630639837960",
                total           : 15,
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id     : "572c9f7d487014c939a3d205",
                    workflow: {
                        name: "Paid"
                    },
                    name    : "DD13"
                },
                forSale         : false,
                differenceAmount: 0,
                paidAmount      : 354200,
                workflow        : "Paid",
                date            : "2016-02-28T23:00:00.000Z",
                paymentMethod   : {
                    _id : "565f2e05ab70d49024242e07",
                    name: "Erste USD"
                },
                paymentRef      : "",
                period          : null,
                _type           : "dividendInvoicePayment",
                removable       : true
            }
        ]
    };
    var fakeDividendAfterDelete = {
        total: 300,
        data : [
            {
                _id             : "572ca04a55c631a239a57cfc",
                total           : 14,
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id     : "572c9f93265f2548392c912e",
                    workflow: {
                        name: "Paid"
                    },
                    name    : "DD14"
                },
                forSale         : false,
                differenceAmount: 0,
                paidAmount      : 125700,
                workflow        : "Paid",
                date            : "2016-03-30T22:00:00.000Z",
                paymentMethod   : {
                    _id : "565f2e05ab70d49024242e07",
                    name: "Erste USD"
                },
                paymentRef      : "",
                period          : null,
                _type           : "dividendInvoicePayment",
                removable       : true
            },
            {
                _id             : "572ca03c526c630639837960",
                total           : 14,
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id     : "572c9f7d487014c939a3d205",
                    workflow: {
                        name: "Paid"
                    },
                    name    : "DD13"
                },
                forSale         : false,
                differenceAmount: 0,
                paidAmount      : 354200,
                workflow        : "Paid",
                date            : "2016-02-28T23:00:00.000Z",
                paymentMethod   : {
                    _id : "565f2e05ab70d49024242e07",
                    name: "Erste USD"
                },
                paymentRef      : "",
                period          : null,
                _type           : "dividendInvoicePayment",
                removable       : true
            }
        ]
    };
    var view;
    var topBarView;
    var listView;
    var dividendCollection;
    var historyNavigateSpy;
    var ajaxSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('Dividend payment', function () {

        var $fixture;
        var $elFixture;
        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            ajaxSpy = sinon.spy($, 'ajax');
        });

        after(function () {
            view.remove();

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
                view = new MainView({el: $elFixture, contentType: 'DividendPayments'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="102"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="102"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/DividendPayments');
            });

        });

        describe('TopBarView', function () {
            var server;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
            });

            it('Try to fetch collection with error', function () {
                var dividendUrl = new RegExp('\/payment\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', dividendUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                dividendCollection = new DividendCollection({
                    viewType   : 'list',
                    contentType: 'DividendPayments',
                    page       : 1,
                    count      : 2
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var dividendUrl = new RegExp('\/payment\/', 'i');

                server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividend)]);
                dividendCollection = new DividendCollection({
                    contentType: 'DividendPayments',
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false
                });
                server.respond();

                expect(dividendCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: dividendCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Dividend Payments');
            });
        });

        describe('DividendPayments', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var windowConfirmStub;
            var alertStub;
            var deleteSpy;
            var sortSpy;

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
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
                deleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
                sortSpy = sinon.spy(ListView.prototype, 'goSort');
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                alertStub.restore();
                deleteSpy.restore();
                sortSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create dividendDeclarationListView', function (done) {
                    var $firstRow;
                    var colCount;
                    var name;
                    var declaration;
                    var paid;
                    var date;
                    var $pagination;
                    var $currentPageList;

                    listView = new ListView({
                        startTime : new Date(),
                        collection: dividendCollection
                    });

                    clock.tick(300);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(dividendCollection, listView);

                    dividendCollection.trigger('fetchFinished', {
                        totalRecords: dividendCollection.totalRecords,
                        currentPage : dividendCollection.currentPage,
                        pageSize    : dividendCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('#listTable')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(6);

                    name = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(name).not.to.be.empty;
                    expect(name).to.not.match(/object Object|undefined/);

                    declaration = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(declaration).not.to.be.empty;
                    expect(declaration).to.not.match(/object Object|undefined/);

                    paid = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(paid).not.to.be.empty;
                    expect(paid).to.not.match(/object Object|undefined/);

                    date = $firstRow.find('td:nth-child(6)').text().trim();
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

                it('Try to delete item with error response', function () {
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(3) > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var dividendUrl = new RegExp('\/payment\/', 'i');
                    var spyResponse;

                    $needCheckBox.click();

                    server.respondWith('DELETE', dividendUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];

                    expect(deleteSpy.calledOnce).to.be.true;
                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to delete item', function () {
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var dividendUrl = new RegExp('\/payment\/', 'i');
                    var ajaxSecondResponse;

                    ajaxSpy.reset();

                    server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendAfterDelete)]);
                    server.respondWith('DELETE', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "success": {
                            "_id"             : "5742f2d07afe352f10c11c3e",
                            "_type"           : "dividendInvoicePayment",
                            "__v"             : 0,
                            "period"          : null,
                            "paymentMethod"   : "565f2e05ab70d49024242e07",
                            "supplier"        : null,
                            "paymentRef"      : "",
                            "forSale"         : false,
                            "editedBy"        : {
                                "date": "2016-05-23T12:08:48.125Z",
                                "user": "52203e707d4dba8813000003"
                            },
                            "createdBy"       : {
                                "date": "2016-05-23T12:08:48.125Z",
                                "user": "52203e707d4dba8813000003"
                            },
                            "groups"          : {
                                "group": [],
                                "users": [],
                                "owner": "560c099da5d4a2e20ba5068b"
                            },
                            "currency"        : {
                                "rate": 1,
                                "_id" : "565eab29aeb95fa9c0f9df2d"
                            },
                            "whoCanRW"        : "everyOne",
                            "differenceAmount": -250000,
                            "workflow"        : "Paid",
                            "name"            : "PP_1",
                            "date"            : "2016-05-22T21:00:00.000Z",
                            "paidAmount"      : 250000,
                            "invoice"         : "5742f26e7afe352f10c11c3d"
                        }
                    })]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    ajaxSecondResponse = ajaxSpy.args[1][0];

                    expect(deleteSpy.calledTwice).to.be.true;
                    expect(ajaxSecondResponse).to.have.property('type', 'GET');
                    expect(ajaxSecondResponse).to.have.property('url', '/payments/');
                });

                it('Try to sort ListView', function () {
                    var $sortBtn = $thisEl.find('th[data-sort="paidAmount"]');
                    var dividendUrl = new RegExp('\/payment\/', 'i');

                    server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        total: 300,
                        data : [
                            fakeDividendAfterDelete.data[1],
                            fakeDividendAfterDelete.data[0]
                        ]
                    })]);
                    $sortBtn.click();
                    server.respond();
                    expect(sortSpy.calledOnce).to.be.true;
                    expect($thisEl.find('#listTable > tr').first().attr('data-id')).to.be.equals('572ca03c526c630639837960');


                    server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendAfterDelete)]);
                    $sortBtn.click();
                    server.respond();
                    expect(sortSpy.calledTwice).to.be.true;
                    expect($thisEl.find('#listTable > tr').first().attr('data-id')).to.be.equals('572ca04a55c631a239a57cfc');
                });
            });
        });
    });
});
