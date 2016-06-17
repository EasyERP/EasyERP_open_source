define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/invoiceAging/filterCollection',
    'views/main/MainView',
    'views/invoiceAging/list/ListView',
    'views/customerPayments/TopBarView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone, modules, fixtures, InvoiceAgingCollection, MainView, ListView, TopBarView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var expect;
    var fakeInvoiceAging = [
        {
            _id: "5742d08b45f73e53319d8d52",
            project: {
                name: "M-Government"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 6000000,
                balance: 2750000,
                total: 6000000
            },
            invoiceDate: "2016-05-22T22:00:00.000Z",
            supplier: {
                name: "Digipresence "
            },
            name: "PO1036",
            dueDate: "2016-05-30T22:00:00.000Z",
            diffStatus: 0,
            salesPerson: {
                name: "Peter Voloshchuk"
            }
        },
        {
            _id: "5740797e51010f2757eed39f",
            project: {
                name: "Farmers App"
            },
            paymentInfo: {
                taxes: 0,
                unTaxed: 1200000,
                balance: 1200000,
                total: 1200000
            },
            invoiceDate: "2016-04-04T22:00:00.000Z",
            supplier: {
                name: "Unibet "
            },
            name: "PO826",
            dueDate: "2016-05-24T22:00:00.000Z",
            diffStatus: 1,
            salesPerson: {
                name: "Peter Voloshchuk"
            }
        },
        {
            _id: "5745bb9efd67bd6b07a6f15d",
            project: {
                name: "Richline Jewelry"
            },
            paymentInfo: {
                taxes: 0,
                balance: 1100000,
                unTaxed: 1100000,
                total: 1100000
            },
            invoiceDate: "2016-05-24T22:00:00.000Z",
            supplier: {
                name: "CEEK VR "
            },
            name: "PO1078_2",
            dueDate: "2016-06-02T22:00:00.000Z",
            diffStatus: 0,
            salesPerson: {
                name: "Eugen Lendyel"
            }
        }
    ];
    var invoiveAgingCollection;
    var view;
    var topBarView;
    var listView;
    var historyNavigateSpy;
    
    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('InvoiceAging View', function () {
        var $fixture;
        var $elFixture;
        
        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();

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

                view = new MainView({el: $elFixture, contentType: 'invoiceAging'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="82"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="82"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/invoiceAging');

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

            it('Try to fetch collection with error result', function () {
                var invoiceAging = new RegExp('\/invoices\/stats/', 'i');

                historyNavigateSpy.reset();
                server.respondWith('GET', invoiceAging, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoiceAging)]);
                invoiveAgingCollection = new InvoiceAgingCollection({
                    viewType   : 'list',
                    count      : 100,
                    contentType: 'invoiceAging'
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
            });

            it('Try to create TopBarView', function () {
                var invoiceAging = new RegExp('\/invoices\/stats/', 'i');

                server.respondWith('GET', invoiceAging, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoiceAging)]);
                invoiveAgingCollection = new InvoiceAgingCollection({
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    contentType: 'invoiceAging'
                });
                server.respond();

                expect(invoiveAgingCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: invoiveAgingCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
            });
        });

        describe('SupplierPayments list view', function () {
            var server;
            var mainSpy;
            var $thisEl;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create invoiceAging list view', function () {
                    var $firstRow;
                    var colCount;
                    var invoiceName;
                    var invoiceDate;
                    var salesManager;
                    var customer;
                    var project;
                    var inTerm;
                    var firstPeriod;
                    var secondPeriod;
                    var thirdPeriond;
                    var fourthPeriod;
                    var fifthPeriod;

                    listView = new ListView({
                        collection: invoiveAgingCollection,
                        startTime : new Date(),
                        count     : 100
                    });

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(invoiveAgingCollection, listView);

                    invoiveAgingCollection.trigger('fetchFinished', {
                        totalRecords: invoiveAgingCollection.totalRecords,
                        currentPage : invoiveAgingCollection.currentPage,
                        pageSize    : invoiveAgingCollection.pageSize
                    });

                    $thisEl = listView.$el;
                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(4);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;

                    expect(colCount).to.be.equals(12);

                    invoiceName = $firstRow.find('td:nth-child(2)').text().trim();
                    expect(invoiceName).to.not.empty;
                    expect(invoiceName).to.not.match(/object Object|undefined/);

                    invoiceDate = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(invoiceDate).to.not.empty;
                    expect(invoiceDate).to.not.match(/object Object|undefined/);

                    salesManager = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(salesManager).to.not.empty;
                    expect(salesManager).to.not.match(/object Object|undefined/);

                    customer = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(customer).to.not.empty;
                    expect(customer).to.not.match(/object Object|undefined/);

                    project = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(project).to.not.empty;
                    expect(project).to.not.match(/object Object|undefined/);

                    inTerm = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(inTerm).to.not.match(/object Object|undefined/);

                    firstPeriod = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(firstPeriod).to.not.match(/object Object|undefined/);

                    secondPeriod = $firstRow.find('td:nth-child(9)').text().trim();
                    expect(secondPeriod).to.not.match(/object Object|undefined/);

                    thirdPeriond = $firstRow.find('td:nth-child(10)').text().trim();
                    expect(thirdPeriond).to.not.match(/object Object|undefined/);

                    fourthPeriod = $firstRow.find('td:nth-child(11)').text().trim();
                    expect(fourthPeriod).to.not.match(/object Object|undefined/);

                    fifthPeriod = $firstRow.find('td:nth-child(11)').text().trim();
                    expect(fifthPeriod).to.not.match(/object Object|undefined/);
                });
            });
        });
    });
});
