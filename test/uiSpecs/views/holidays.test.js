define([
    'modules',
    'text!fixtures/index.html',
    'collections/Holiday/filterCollection',
    'views/main/MainView',
    'views/Holiday/list/ListView',
    'views/Holiday/TopBarView',
    'views/Holiday/CreateView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules, fixtures, HolidaysCollection, MainView, ListView, TopBarView, CreateView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';
    
    var expect;
    var fakeHoliday = {
        total : 300,
        data: [
            {
                _id    : "569fa6fc62d172544baf0db9",
                date   : "2016-10-13T22:00:00.000Z",
                year   : 2016,
                week   : 41,
                comment: "Defender of Ukraine Day",
                __v    : 0
            },
            {
                _id    : "55b92ad421e4b7c40f00056d",
                comment: "Independence Day Ukraine",
                date   : "2016-08-23T22:00:00.000Z",
                ID     : 19,
                year   : 2015,
                week   : 35,
                __v    : 0
            },
            {
                _id    : "55b92ad421e4b7c40f00056b",
                comment: "Constitution Day Ukraine",
                date   : "2016-06-27T22:00:00.000Z",
                ID     : 17,
                year   : 2015,
                week   : 26,
                __v    : 0
            },
            {
                _id    : "569fa5cc62d172544baf0db1",
                date   : "2016-06-19T22:00:00.000Z",
                comment: "Orthodox Trinity",
                year   : 2016,
                week   : 25,
                __v    : 0
            },
            {
                _id    : "55b92ad421e4b7c40f00056a",
                comment: "Orthodox Trinity",
                date   : "2016-06-18T22:00:00.000Z",
                ID     : 16,
                year   : 2016,
                week   : 24,
                __v    : 0
            },
            {
                _id    : "55b92ad421e4b7c40f000566",
                comment: "Victory and Commemoration Day",
                date   : "2016-05-08T22:00:00.000Z",
                ID     : 12,
                year   : 2016,
                week   : 19,
                __v    : 0
            },
            {
                _id    : "55b92ad421e4b7c40f000564",
                comment: "Labour Day",
                date   : "2016-05-02T22:00:00.000Z",
                ID     : 10,
                year   : 2015,
                week   : 18,
                __v    : 0
            },
            {
                _id    : "55b92ad421e4b7c40f000563",
                comment: "Labour Day",
                date   : "2016-05-01T22:00:00.000Z",
                ID     : 9,
                year   : 2015,
                week   : 18,
                __v    : 0
            },
            {
                _id    : "55b92ad421e4b7c40f000561",
                comment: "Orthodox Easter",
                date   : "2016-04-30T22:00:00.000Z",
                ID     : 7,
                year   : 2016,
                week   : 17,
                __v    : 0
            },
            {
                _id    : "55b92ad421e4b7c40f00055e",
                comment: "International Womens Day",
                date   : "2016-03-07T23:00:00.000Z",
                ID     : 4,
                year   : 2015,
                week   : 10,
                __v    : 0
            },
            {
                _id    : "55b92ad421e4b7c40f00055c",
                comment: "Christmas",
                date   : "2016-01-06T23:00:00.000Z",
                ID     : 2,
                year   : 2016,
                week   : 1,
                __v    : 0
            },
            {
                _id    : "55b92ad421e4b7c40f00055b",
                comment: "New Year",
                date   : "2015-12-31T23:00:00.000Z",
                ID     : 1,
                year   : 2016,
                week   : 53,
                __v    : 0
            },
            {
                _id    : "569fae9262d172544baf0de7",
                date   : "2015-10-13T22:00:00.000Z",
                comment: "Defender of Ukraine Day",
                year   : 2015,
                week   : 42,
                __v    : 0
            },
            {
                _id    : "569fadb562d172544baf0de5",
                date   : "2015-08-23T22:00:00.000Z",
                comment: "Independence Day Ukraine",
                year   : 2015,
                week   : 35,
                __v    : 0
            },
            {
                _id    : "569fae0462d172544baf0de6",
                date   : "2015-06-28T22:00:00.000Z",
                comment: "Constitution Day Ukraine",
                year   : 2015,
                week   : 27,
                __v    : 0
            },
            {
                _id    : "569fad7f62d172544baf0de4",
                date   : "2015-06-27T22:00:00.000Z",
                comment: "Constitution Day Ukraine",
                year   : 2015,
                week   : 26,
                __v    : 0
            },
            {
                _id    : "569fad5b62d172544baf0de3",
                date   : "2015-05-31T22:00:00.000Z",
                comment: "Orthodox Trinity",
                year   : 2015,
                week   : 23,
                __v    : 0
            },
            {
                _id    : "569fad3e62d172544baf0de2",
                date   : "2015-05-30T22:00:00.000Z",
                comment: "Orthodox Trinity",
                year   : 2015,
                week   : 22,
                __v    : 0
            },
            {
                _id    : "569facef62d172544baf0ddb",
                date   : "2015-05-10T22:00:00.000Z",
                comment: "Victory and Commemoration Day",
                year   : 2015,
                week   : 20,
                __v    : 0
            },
            {
                _id    : "569fad1562d172544baf0ddc",
                date   : "2015-05-08T22:00:00.000Z",
                comment: "Victory and Commemoration Day",
                year   : 2015,
                week   : 19,
                __v    : 0
            },
            {
                _id    : "569fac8a62d172544baf0dda",
                date   : "2015-05-03T22:00:00.000Z",
                comment: "Labour Day",
                year   : 2015,
                week   : 19,
                __v    : 0
            },
            {
                _id    : "569fac6c62d172544baf0dd9",
                date   : "2015-05-01T22:00:00.000Z",
                comment: "Labour Day",
                year   : 2015,
                week   : 18,
                __v    : 0
            },
            {
                _id    : "569fac3962d172544baf0dd6",
                date   : "2015-04-30T22:00:00.000Z",
                comment: "Labour Day",
                year   : 2015,
                week   : 18,
                __v    : 0
            },
            {
                _id    : "569fabcc62d172544baf0dd4",
                date   : "2015-04-12T22:00:00.000Z",
                comment: "Orthodox Easter",
                year   : 2015,
                week   : 16,
                __v    : 0
            },
            {
                _id    : "569fab9d62d172544baf0dd3",
                date   : "2015-04-11T22:00:00.000Z",
                comment: "Orthodox Easter",
                year   : 2015,
                week   : 15,
                __v    : 0
            },
            {
                _id    : "569fabe862d172544baf0dd5",
                date   : "2015-03-08T23:00:00.000Z",
                comment: "International Womens Day",
                year   : 2015,
                week   : 11,
                __v    : 0
            },
            {
                _id    : "569fab7062d172544baf0dd2",
                date   : "2015-03-07T23:00:00.000Z",
                comment: "International Womens Day",
                year   : 2015,
                week   : 10,
                __v    : 0
            },
            {
                _id    : "569faaed62d172544baf0dd1",
                date   : "2015-01-06T23:00:00.000Z",
                comment: "Christmas",
                year   : 2015,
                week   : 2,
                __v    : 0
            },
            {
                _id    : "569faad862d172544baf0dd0",
                date   : "2014-12-31T23:00:00.000Z",
                comment: "New Year",
                year   : 2015,
                week   : 1,
                __v    : 0
            }
        ]
    };
    var holidaysCollection;
    var view;
    var topBarView;
    var listView;
    var ajaxSpy;
    
    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('Holidays View', function () {
        var $fixture;
        var $elFixture;
        before(function () {
            ajaxSpy = sinon.spy($, 'ajax');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();
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
                view = new MainView({el: $elFixture, contentType: 'Holiday'});
                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');
                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="69"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="69"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Holiday');
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

            it('Try to fetch collection with 401 error', function () {
                var holidaysUrl = new RegExp('\/Holiday\/list', 'i');

                server.respondWith('GET', holidaysUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeHoliday)]);

                holidaysCollection = new HolidaysCollection({
                    viewType: 'list',
                    page    : 1
                });

                server.respond();
            });

            it('Try to create TopBarView', function () {
                var holidaysUrl = new RegExp('\/Holiday\/list', 'i');

                server.respondWith('GET', holidaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeHoliday)]);
                holidaysCollection = new HolidaysCollection({
                    viewType: 'list',
                    page    : 1
                });
                server.respond();

                topBarView = new TopBarView({
                    collection: holidaysCollection
                });

                expect(topBarView.$el.find('.createBtnHolder')).to.exist;
            });
        });

        describe('Holidays list view', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var clock;
            var $thisEl;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create holidays list view', function (done) {
                    var holidaysUrl = new RegExp('\/Holiday', 'i');
                    var $firstRow;
                    var countColumn;
                    var subject;
                    var $pagination;
                    var $currentPageList;

                    server.respondWith('GET', holidaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeHoliday)]);

                    holidaysCollection = new HolidaysCollection({
                        viewType: 'list',
                        page    : 1
                    });

                    server.respond();

                    listView = new ListView({
                        collection: holidaysCollection,
                        startTime : new Date()
                    });

                    clock.tick(200);

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.exist;
                    eventsBinder.subscribeCollectionEvents(holidaysCollection, listView);
                    eventsBinder.subscribeTopBarEvents(topBarView, listView);

                    holidaysCollection.trigger('fetchFinished', {
                        totalRecords: holidaysCollection.totalRecords,
                        currentPage : holidaysCollection.currentPage,
                        pageSize    : holidaysCollection.pageSize
                    });

                    expect($thisEl).to.exist;
                    expect($thisEl.find('.pagination')).to.exist;

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    countColumn = $firstRow.find('td').length;
                    expect(countColumn).to.be.equals(4);

                    subject = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(subject).not.to.be.empty;
                    expect(subject).to.not.match(/object Object|undefined/);

                    subject = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(subject).to.not.match(/object Object|undefined/);

                    $pagination = $thisEl.find('.pagination');

                    expect($pagination).to.exist;
                    expect($pagination.find('.countOnPage')).to.exist;
                    expect($pagination.find('.pageList')).to.exist;

                    $currentPageList = $pagination.find('.currentPageList');
                    expect($currentPageList).to.exist;

                    $currentPageList = $pagination.find('#pageList');
                    expect($currentPageList).to.exist;
                    expect($currentPageList).to.have.css('display', 'none');

                    done();
                });

                it('Try to change page1 to page2', function () {
                    var $currentPageList = $thisEl.find('.currentPageList');
                    var ajaxResponse;
                    var $page2Btn;

                    ajaxSpy.reset();

                    $currentPageList.mouseover();
                    $page2Btn = $thisEl.find('#pageList > li').eq(1);
                    $page2Btn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];
                    expect(ajaxSpy.called).to.be.true;
                    expect(ajaxResponse).to.have.property('url', '/Holiday/');
                    expect(ajaxResponse.data).to.have.property('contentType').and.to.not.undefined;
                    expect(ajaxResponse.data).to.have.property('page', 2);
                });

                it('Try to select 25 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needBtn = $pagination.find('.pageList > a').first();
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '25');
                });

                it('Try to select 50 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needBtn = $pagination.find('.pageList > a').eq(1);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '50');
                });

                it('Try to select 100 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needBtn = $pagination.find('.pageList > a').eq(2);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '100');
                });

                it('Try to select 200 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $needBtn = $pagination.find('.pageList > a').eq(3);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '200');
                });

                it('Try to delete with changes', function () {
                    var $input;
                    var $expenseInput = listView.$el.find('td[data-type="input"]')[0];
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var keyDownEven = $.Event('keydown', {which: 13});

                    $expenseInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('test');
                    $input.trigger('change');
                    $input.click();
                    $input.trigger(keyDownEven);

                    $deleteBtn.click();
                    expect($(listView.$el.find('td[data-type="input"]')[0]).text()).to.be.equals('Defender of Ukraine Day');
                });

                it('Try to delete item', function () {
                    var holidaysUrl = new RegExp('\/Holiday\/', 'i');
                    var holidayTotalCollectionUrl = new RegExp('\/holiday\/totalCollectionLength', 'i');
                    var $firstEl = listView.$el.find('#listTable > tr[data-id="569fad3e62d172544baf0de2"] > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    $firstEl.click();

                    server.respondWith('GET', holidayTotalCollectionUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 28
                    })]);
                    server.respondWith('DELETE', holidaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();
                });

                it('Try to delete item with 403 error', function () {
                    var spyResponse;
                    var $firstEl = listView.$el.find('#listTable > tr[data-id="569fa6fc62d172544baf0db9"] > td.notForm > input');
                    var $secondEl = listView.$el.find('#listTable > tr[data-id="569fad3e62d172544baf0de2"] > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var holidaysUrl = new RegExp('\/Holiday\/', 'i');

                    $firstEl.click();
                    $secondEl.click();

                    server.respondWith('DELETE', holidaysUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', "Can't remove items");
                });

                it('Try to create item', function () {
                    var $dateInput;
                    var $commentInput;
                    var $input;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');

                    $createBtn.click();

                    $dateInput = listView.$el.find('td[data-content="date"]')[0];
                    $commentInput = listView.$el.find('td[data-content="comment"]')[0];

                    $dateInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('10 Mar, 2016');

                    $commentInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('test');

                    server.respondWith('POST', '/Holiday/', [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "success": {
                            "__v" : 0,
                            "date": "2016-03-11T22:00:00.000Z",
                            "year": null,
                            "week": null,
                            "_id" : "56e2cd4a3abb6ba70f73ad73"
                        }
                    })]);
                    $saveBtn.click();
                    server.respond();
                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);
                });

                it('Try to edit item', function () {
                    var $input;
                    var $commentInput = listView.$el.find('td[data-content="comment"]')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');

                    $commentInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('TEST Comment');
                    $input.trigger('change');

                    server.respondWith('PATCH', '/Holiday/', [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "success": {
                            "__v" : 0,
                            "date": "2016-03-11T22:00:00.000Z",
                            "year": null,
                            "week": null,
                            "_id" : "56e2cd4a3abb6ba70f73ad73"
                        }
                    })]);
                    $saveBtn.click();
                    server.respond();

                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);
                    expect($(listView.$el.find('td[data-content="comment"]')[0]).text()).to.be.equals('TEST Comment');
                });
            });
        });
    });
});
