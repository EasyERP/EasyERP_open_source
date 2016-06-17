define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/bonusType/filterCollection',
    'views/main/MainView',
    'views/bonusType/list/ListView',
    'views/bonusType/TopBarView',
    'views/bonusType/CreateView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone, modules, fixtures, BonusTypeCollection, MainView, ListView, TopBarView, CreateView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var expect;
    var fakeBonusTypes = {
        total: 300,
        data : [
            {
                _id      : "55b92ad521e4b7c40f000602",
                isPercent: true,
                value    : 8,
                name     : "Sales/Head 8%",
                ID       : 2,
                __v      : 0,
                bonusType: "Sales"
            },
            {
                _id      : "55b92ad521e4b7c40f000603",
                isPercent: true,
                value    : 6,
                name     : "Sales/Usual 6%",
                ID       : 3,
                __v      : 0,
                bonusType: "Sales"
            },
            {
                _id      : "55b92ad521e4b7c40f000604",
                isPercent: true,
                value    : 2,
                name     : "Sales/Ref 2%",
                ID       : 4,
                __v      : 0,
                bonusType: "Sales"
            }
        ]
    }
    var bonusTypesCollection;
    var view;
    var topBarView;
    var listView;
    var ajaxSpy;
    var historyNavigateSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('BonusTypes View', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            ajaxSpy = sinon.spy($, 'ajax');
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();

            ajaxSpy.restore();
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

                view = new MainView({el: $elFixture, contentType: 'bonusType'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="72"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="72"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/bonusType');

            });

        });

        describe('TopBarView', function () {
            var server;
            var consoleSpy;

            before(function () {
                server = sinon.fakeServer.create();
                consoleSpy = sinon.spy(console, 'log');
            });

            after(function () {
                server.restore();
                consoleSpy.restore();
            });

            it('Try to fetch collection with error', function () {
                var bonusTypeUrl = new RegExp('\/bonusType\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', bonusTypeUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeBonusTypes)]);
                bonusTypesCollection = new BonusTypeCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'bonusType'
                });
                server.respond();

                expect(historyNavigateSpy.called).to.be.true;
            });

            it('Try to create TopBarView', function () {
                var bonusTypeUrl = new RegExp('\/bonusType\/', 'i');

                server.respondWith('GET', bonusTypeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeBonusTypes)]);
                bonusTypesCollection = new BonusTypeCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'bonusType'
                });
                server.respond();

                expect(bonusTypesCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: bonusTypesCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

        });

        describe('BonusType list view', function () {
            var server;
            var mainSpy;
            var clock;
            var windowConfirmStub;
            var $thisEl;
            var saveSpy;
            var sortSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                saveSpy = sinon.spy(ListView.prototype, 'saveItem');
                sortSpy = sinon.spy(ListView.prototype, 'goSort');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();
                windowConfirmStub.restore();
                saveSpy.restore();
                sortSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create bonusType list view', function (done) {
                    var $firstRow;
                    var colCount;
                    var name;
                    var type;
                    var value;
                    var isPercent;
                    var $pagination;
                    var $currentPageList;

                    listView = new ListView({
                        collection: bonusTypesCollection,
                        startTime : new Date()
                    });

                    clock.tick(100);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(bonusTypesCollection, listView);

                    bonusTypesCollection.trigger('fetchFinished', {
                        totalRecords: bonusTypesCollection.totalRecords,
                        currentPage : bonusTypesCollection.currentPage,
                        pageSize    : bonusTypesCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(6)

                    name = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(name).not.to.be.empty;
                    expect(name).to.not.match(/object Object|undefined/);

                    type = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(type).not.to.be.empty;
                    expect(type).to.not.match(/object Object|undefined/);

                    value = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(value).not.to.be.empty;
                    expect(value).to.not.match(/object Object|undefined/);

                    isPercent = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(isPercent).not.to.be.empty;
                    expect(isPercent).to.not.match(/object Object|undefined/);

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

                it('Try to check|uncheck all checckboxes', function () {
                    var $checkAllBtn = listView.$el.find('#checkAll');

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type=checkbox]').prop('checked')).to.be.true;

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type=checkbox]').prop('checked')).to.be.false;
                });

                it('Try to switchPageCounter with error', function (done) {
                    var spyResponse;
                    var $thisEl = listView.$el;
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var bonusTypeUrl = new RegExp('\/bonusType\/list', 'i');

                    server.respondWith('GET', bonusTypeUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeBonusTypes)]);
                    $needBtn.click();
                    server.respond();

                    clock.tick(200);

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');

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
                    expect(ajaxResponse).to.have.property('url', '/bonusType/');
                    expect(ajaxResponse.data).to.have.property('contentType').and.to.not.undefined;
                    expect(ajaxResponse.data).to.have.property('page', 2);
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
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
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
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
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
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
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
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
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                });

                it('Try to delete with changes', function () {
                    var $valueInput = $thisEl.find('tr[data-id="55b92ad521e4b7c40f000602"] > td[data-content="value"]');
                    var $type = $thisEl.find('tr[data-id="55b92ad521e4b7c40f000602"] > td[data-content="bonusType"]');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var $input;
                    var $selectedItem;

                    // set value
                    $valueInput.click();
                    $input = $valueInput.find('input.editing');
                    $input.val('10');
                    $input.trigger('change');

                    // change type
                    $type.click();
                    $selectedItem = $thisEl.find('li[data-id="PM"]');
                    $selectedItem.click();
                    $selectedItem.trigger('change');

                    $deleteBtn.click();

                    expect($thisEl.find('tr[data-id="55b92ad521e4b7c40f000602"] > td[data-content="value"]').text().trim()).to.be.equals('8');
                    expect($thisEl.find('tr[data-id="55b92ad521e4b7c40f000602"] > td[data-content="bonusType"]').text().trim()).to.be.equals('Sales');
                });

                it('Try to delete item with 403 error', function () {
                    var spyResponse;
                    var $firstEl = listView.$el.find('#listTable > tr[data-id="55b92ad521e4b7c40f000602"] > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var bonusTypeUrl = new RegExp('\/bonusType\/', 'i');

                    $firstEl.click();
                    server.respondWith('DELETE', bonusTypeUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to delete item', function () {
                    var $firstEl = listView.$el.find('#listTable > tr[data-id="55b92ad521e4b7c40f000602"] > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var bonusTypeUrl = new RegExp('\/bonusType\/', 'i');

                    $firstEl.click();
                    server.respondWith('DELETE', bonusTypeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();
                });

                it('Try to create item', function () {
                    var $nameInput;
                    var $bonusTypeInput;
                    var $valueInput;
                    var $isPercentInput;
                    var $input;
                    var $newSelectEl;
                    var spyResponse;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');

                    saveSpy.reset();

                    $createBtn.click();

                    $nameInput = listView.$el.find('td[data-content="name"]')[0];
                    $bonusTypeInput = listView.$el.find('td[data-content="bonusType"]')[0];
                    $valueInput = listView.$el.find('td[data-content="value"]')[0];
                    $isPercentInput = listView.$el.find('td[data-content="isPercent"]')[0];

                    server.respondWith('POST', '/bonusType/', [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        success: {
                            date: '2016-03-11T22:00:00.000Z',
                            year: null,
                            week: null,
                            _id : '56e2cd4a3abb6ba70f73ad73'
                        }
                    })]);
                    $saveBtn.click();
                    server.respond();

                    expect(saveSpy.calledOnce).to.be.true;
                    spyResponse = mainSpy.args[2][0];
                    expect(spyResponse).to.have.property('type', 'error');

                    $nameInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('test');

                    $bonusTypeInput.click();
                    $newSelectEl = listView.$el.find('li[data-id="PM"]');
                    $newSelectEl.click();

                    $valueInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('15');

                    $isPercentInput.click();
                    $newSelectEl = listView.$el.find('li[data-id="true"]');
                    $newSelectEl.click();

                    server.respondWith('POST', '/bonusType/', [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);

                    $saveBtn.click();
                    server.respond();

                    expect(saveSpy.calledTwice).to.be.true;
                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);
                });

                it('Try to edit item', function () {
                    var $valueInput = $thisEl.find('td[data-content="value"]').first();
                    var $typeTd = $thisEl.find('td[data-content="bonusType"]').first();
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = $thisEl.find('table');
                    var $input;
                    var $selectList;
                    var $selectedItem;

                    saveSpy.reset();

                    $valueInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('17');
                    $input.trigger('change');

                    $typeTd.click();
                    $selectList = $typeTd.find('.newSelectList')
                    expect($selectList).to.exist;

                    $selectedItem = $selectList.find('li').first();
                    $selectedItem.click();

                    server.respondWith('PATCH', '/bonusType/', [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        success: {
                            date: '2016-03-11T22:00:00.000Z',
                            year: null,
                            week: null,
                            _id : '56e2cd4a3abb6ba70f73ad73'
                        }
                    })]);
                    $saveBtn.click();
                    server.respond();

                    expect(saveSpy.calledOnce).to.be.true;
                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);
                    expect($(listView.$el.find('td[data-content="value"]')[0]).text()).to.be.equals('17');
                });
            });
        });
    });
});
