define([
    'modules',
    'text!fixtures/index.html',
    'collections/invoiceCharts/invoiceCharts',
    'views/main/MainView',
    'views/invoiceCharts/index',
    'views/invoiceCharts/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'testConstants/invoiceCharts'
], function (modules, fixtures, InvoiceChartsCollection, MainView, IndexView, TopBarView, $, chai, chaiJquery, sinonChai, fakeRevenueSynthetic) {
    'use strict';
    var invoiceChartsCollection;
    var view;
    var topBarView;
    var indexView;
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('InvoiceChartsView', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            view.remove();
            topBarView.remove();
            indexView.remove();
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

                server.respondWith('GET', '/modules/', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'invoiceCharts'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="87"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="87"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/invoiceCharts');

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

            it('Try to create TopBarView', function () {

                server.respondWith('GET', 'revenue/synthetic', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenueSynthetic)]);

                invoiceChartsCollection = new InvoiceChartsCollection();

                server.respond();

                topBarView = new TopBarView({
                    collection: invoiceChartsCollection
                });

                expect(topBarView.$el.find('.vocationFilter')).to.exist;
                expect(topBarView.$el.find('#searchContainer')).to.exist;
            });

        });

        describe('InvoiceChartsView', function () {
            var server;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create InvoiceCharts view', function (done) {
                    var $listHolder;
                    var invoiceChartsUrl = 'revenue/synthetic';

                    server.respondWith('GET', invoiceChartsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenueSynthetic)]);
                    indexView = new IndexView({
                        collection: invoiceChartsCollection,
                        startTime : new Date()
                    });
                    server.respond();

                    clock.tick(100);

                    $listHolder = indexView.$el;

                    expect($listHolder.find('.grid-conatiner')).to.exist;

                    done();
                });

                it('Try to change byMonth', function (done) {
                    var $thisEl = indexView.$el;
                    var $byWeekBtn = $thisEl.find('#byWeek');
                    var $byMonthBtn = $thisEl.find('#byMonth');
                    var invoiceChartsUrl = 'revenue/synthetic';

                    //server.respondWith('GET', invoiceChartsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenueSynthetic)]);
                    $byMonthBtn.click();
                    server.respond();

                    clock.tick(200);

                    expect($thisEl.find('.grid-conatiner')).to.exist;

                    done();
                });

                it('Try to change byWeek', function (done) {
                    var $thisEl = indexView.$el;
                    var $byWeekBtn = $thisEl.find('#byWeek');
                    var invoiceChartsUrl = 'revenue/synthetic?byWeek=true'

                    server.respondWith('GET', invoiceChartsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenueSynthetic)]);
                    $byWeekBtn.click();
                    server.respond();

                    clock.tick(200);

                    expect($thisEl.find('.grid-conatiner')).to.exist;

                    done();
                });

                it('Try to change date range', function () {
                    var $startDate;
                    var $endDate;
                    var $updateBtn;
                    var $topBarEl = topBarView.$el;
                    var $changeDateRangeBtn = $topBarEl.find('.dateRange');
                    var $thisEl = indexView.$el;

                    $changeDateRangeBtn.click();
                    $startDate = $topBarEl.find('#startDate');
                    $endDate = $topBarEl.find('#endDate');
                    $updateBtn = $topBarEl.find('#updateDate');

                    $startDate.val('1 Sep, 2014');
                    $endDate.val('1 Apr, 2016');

                    $updateBtn.click();
                    indexView.changeDateRange();
                    expect($thisEl.find('.grid-conatiner')).to.exist;

                });
            });

        });

    });

});
