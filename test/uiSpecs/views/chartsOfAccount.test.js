define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/ChartOfAccount/filterCollection',
    'views/main/MainView',
    'views/ChartOfAccount/list/ListView',
    'views/ChartOfAccount/TopBarView',
    'views/ChartOfAccount/CreateView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (Backbone, modules, fixtures, ChartOfAccountCollection, MainView, ListView, TopBarView, CreateView, eventsBinder, $, chai, chaiJquery, sinonChai, Custom, async) {
    'use strict';
    var expect;
    var fakeChartOfAccount = {
        total: 300,
        data : [
            {
            _id: "565eb53a6aa50532e5df0bc8",
            code: 100000,
            createdBy: {
                date: "2016-06-13T08:40:19.810Z",
                user: null
            },
            editedBy: {
                date: "2015-12-02T14:19:59.504Z",
                user: "52203e707d4dba8813000003"
            },
            payMethod: null,
            type: "Fixed Assets",
            name: "100000 Fixed Asset Account",
            account: "Fixed Asset Account"
        },
            {
                _id: "565eb53a6aa50532e5df0bc9",
                code: 101200,
                createdBy: {
                    date: "2016-06-13T08:40:19.811Z",
                    user: null
                },
                editedBy: {
                    date: "2016-05-06T10:04:35.796Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                payMethod: null,
                type: "Current Assets",
                name: "101200 Account Receivable",
                account: "Account Receivable"
            },
            {
                _id: "565eb53a6aa50532e5df0bca",
                code: 101400,
                createdBy: {
                    date: "2016-06-13T08:40:19.811Z",
                    user: null
                },
                editedBy: {
                    date: "2015-12-02T14:19:59.502Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: "565c5433385ea8b670ff499e",
                type: "Bank and Cash",
                name: "101400 Erste USD",
                account: "Erste USD"
            }
        ]
    };
    var chartOfAccountCollection;
    var view;
    var topBarView;
    var listView;
    var ajaxSpy;
    var historyNavigateSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('ChartsOfAccount View', function () {
        var $fixture;
        var $elFixture;
        var deleteTopBarSpy;
        var selectSpy;
        var removeFilterSpy;
        var saveFilterSpy;
        var removedFromDBSpy;

        before(function () {
            deleteTopBarSpy = sinon.spy(TopBarView.prototype, 'onDeleteEvent');
            ajaxSpy = sinon.spy($, 'ajax');
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');

        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();

            deleteTopBarSpy.restore();
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

                view = new MainView({el: $elFixture, contentType: 'ChartOfAccount'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="83"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="83"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/ChartOfAccount');
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
                var chartOfAccountUrl = new RegExp('\/ChartOfAccount\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', chartOfAccountUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeChartOfAccount)]);
                chartOfAccountCollection = new ChartOfAccountCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'ChartOfAccount'
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('#login');

            });

            it('Try to create topBarView', function () {
                var chartOfAccountUrl = new RegExp('\/ChartOfAccount\/', 'i');

                server.respondWith('GET', chartOfAccountUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeChartOfAccount)]);
                chartOfAccountCollection = new ChartOfAccountCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'ChartOfAccount'
                });

                server.respond();
                expect(chartOfAccountCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: chartOfAccountCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
            });
        });

        describe('ChartsOfAccount list view', function () {
            var mainSpy;
            var fakeClock;
            var windowConfirmStub;
            var $thisEl;
            var cancelChangesSpy;
            var deleteSpy;
            var saveItemSpy;
            var server;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                fakeClock = sinon.useFakeTimers();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                cancelChangesSpy = sinon.spy(ListView.prototype, 'cancelChanges');
                deleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
                saveItemSpy = sinon.spy(ListView.prototype, 'saveItem');
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                fakeClock.restore();
                windowConfirmStub.restore();
                cancelChangesSpy.restore();
                deleteSpy.restore();
                saveItemSpy.restore();
                server.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create ChartsOfAccount list view', function (done) {
                    var $firstRow;
                    var colCount;
                    var code;
                    var account;
                    var type;
                    var $pagination;
                    var $currentPageList;

                    listView = new ListView({
                        collection: chartOfAccountCollection,
                        startTime : new Date()
                    });

                    fakeClock.tick(200);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(chartOfAccountCollection, listView);

                    chartOfAccountCollection.trigger('fetchFinished', {
                        totalRecords: chartOfAccountCollection.totalRecords,
                        currentPage : chartOfAccountCollection.currentPage,
                        pageSize    : chartOfAccountCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.equals(3);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(5);

                    code = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(code).not.to.be.empty;
                    expect(code).to.not.match(/object Object|undefined/);

                    account = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(account).not.to.be.empty;
                    expect(account).to.not.match(/object Object|undefined/);

                    type = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(type).not.to.be.empty;
                    expect(type).to.not.match(/object Object|undefined/);

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

                it('Try to sort down list', function () {
                    var $sortAccountBtn = listView.$el.find('th[data-sort="account"]');
                    var chartOfAccountUrl = new RegExp('\/ChartOfAccount\/', 'i');

                    server.respondWith('GET', chartOfAccountUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeChartOfAccount)]);

                    ajaxSpy.reset();

                    $sortAccountBtn.click();
                    server.respond();

                    expect(ajaxSpy.args[0][0].data.sort).to.be.exist;
                    expect(ajaxSpy.args[0][0].data.sort).to.be.have.property('account', -1);
                    expect($thisEl.find('#listTable > tr')).to.have.length.of(3);
                });

                it('Try to sort up list', function () {
                    var $sortAccountBtn = listView.$el.find('th[data-sort="account"]');

                    ajaxSpy.reset();

                    $sortAccountBtn.click();
                    server.respond();

                    expect(ajaxSpy.args[0][0].data.sort).to.be.exist;
                    expect(ajaxSpy.args[0][0].data.sort).to.be.have.property('account', 1);
                    expect($thisEl.find('#listTable > tr')).to.have.length.of(3);
                });

                it('Try to check|uncheck all checkboxes', function () {
                    var $checkAllBtn = listView.$el.find('#checkAll');
                    var $topBarEl = topBarView.$el;

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type="checkbox"]').prop('checked')).to.be.true;
                    expect($topBarEl.find('#top-bar-createBtn')).to.have.css('display', 'none');
                    expect($topBarEl.find('#top-bar-saveBtn')).to.have.css('display', 'none');
                    expect($topBarEl.find('#top-bar-deleteBtn')).to.have.css('display', 'block');

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type="checkbox"]').prop('checked')).to.be.false;
                    expect($topBarEl.find('#top-bar-createBtn')).to.have.css('display', 'block');
                    expect($topBarEl.find('#top-bar-saveBtn')).to.have.css('display', 'none');
                    expect($topBarEl.find('#top-bar-deleteBtn')).to.have.css('display', 'none');
                });


                it('Try to test behavior topBar Btns when check|uncheck', function () {
                    var $topBarEl = topBarView.$el;
                    var $checkAllBtn = $thisEl.find('#checkAll');
                    var $createBtn = $topBarEl.find('#top-bar-createBtn');
                    var $deleteBtn = $topBarEl.find('#top-bar-deleteBtn');

                    // create new row (with class false)
                    $createBtn.click();
                    expect($thisEl.find('#listTable > tr:nth-child(1)')).to.have.id('false');
                    expect($topBarEl.find('#top-bar-saveBtn')).to.have.css('display', 'block');
                    expect($topBarEl.find('#top-bar-deleteBtn')).to.have.css('display', 'block');
                    expect($topBarEl.find('#top-bar-createBtn')).to.have.css('display', 'none');

                    // check all checkboxes

                    $checkAllBtn.click();
                    expect($thisEl.find(':checkbox').prop('checked')).to.be.true;
                    expect($topBarEl.find('#top-bar-saveBtn')).to.have.css('display', 'block');
                    expect($topBarEl.find('#top-bar-deleteBtn')).to.have.css('display', 'block');
                    expect($topBarEl.find('#top-bar-createBtn')).to.have.css('display', 'none');

                    $deleteBtn.click();
                    expect($thisEl.find(':checkbox').prop('checked')).to.be.true;
                    expect($topBarEl.find('#top-bar-saveBtn')).to.have.css('display', 'none');
                    expect($topBarEl.find('#top-bar-deleteBtn')).to.have.css('display', 'none');
                    expect($topBarEl.find('#top-bar-createBtn')).to.have.css('display', 'block');

                    $createBtn.click();
                    expect($thisEl.find('#listTable > tr:nth-child(1)')).to.have.id('false');
                    expect($thisEl.find(':checkbox').prop('checked')).to.be.true;
                    expect($thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input').prop('checked')).to.be.false;
                    expect($topBarEl.find('#top-bar-saveBtn')).to.have.css('display', 'block');
                    expect($topBarEl.find('#top-bar-deleteBtn')).to.have.css('display', 'block');
                    expect($topBarEl.find('#top-bar-createBtn')).to.have.css('display', 'none');

                    $checkAllBtn.click();
                    expect($thisEl.find('#listTable > tr:nth-child(1)')).to.have.id('false');
                    expect($thisEl.find(':checkbox').prop('checked')).to.be.false;
                    expect($thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input').prop('checked')).to.be.false;
                    expect($topBarEl.find('#top-bar-saveBtn')).to.have.css('display', 'block');
                    expect($topBarEl.find('#top-bar-deleteBtn')).to.have.css('display', 'block');
                    expect($topBarEl.find('#top-bar-createBtn')).to.have.css('display', 'none');

                    $deleteBtn.click();
                    expect($thisEl.find('#listTable > tr:nth-child(1)')).to.have.not.id('false');
                });


                /*it('Try to delete item with changes(cancelChanges)', function () {
                    var deleteUrl = new RegExp('\/ChartOfAccount\/', 'i');
                    var $code = $thisEl.find('#listTable > tr:nth-child(1) > td[data-content="code"]');
                    var $account = $thisEl.find('#listTable > tr:nth-child(1) > td[data-content="account"]');
                    var $deleteBtn;
                    var $codeInput;

                    $code.click();
                    $codeInput = $code.find('input');
                    $codeInput.val('15215115');
                    $codeInput.trigger('change');
                    $account.click();

                    server.respondWith('DELETE', deleteUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({"ok":1,"n":0})]);
                    $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect(cancelChangesSpy.calledOnce).to.be.true;
                });*/

                it('Try to delete item with Forbidden error result', function () {
                    var chartOfAccountUrl = new RegExp('\/ChartOfAccount\/', 'i');
                    var $firstEl = listView.$el.find('tr:nth-child(1) > td:nth-child(1) > .checkbox');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var spyResponse;

                    deleteTopBarSpy.reset();
                    deleteSpy.reset();

                    $firstEl.click();
                    server.respondWith('DELETE', chartOfAccountUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(deleteTopBarSpy.calledOnce).to.be.true;
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(deleteSpy.calledOnce).to.be.true;
                });

                it('Try to delete item with good error response', function () {
                    var chartOfAccountUrl = new RegExp('\/ChartOfAccount\/', 'i');
                    var $firstEl = listView.$el.find('tr:nth-child(1) > td:nth-child(1) > .checkbox');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    $firstEl.click();
                    server.respondWith('DELETE', chartOfAccountUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteTopBarSpy.calledTwice).to.be.true;
                    expect(deleteSpy.calledTwice).to.be.true;
                });

                it('Try to edit item', function () {
                    var $input;
                    var $codeInput = $(listView.$el.find('td[data-content="code"]')[0]);
                    var $accountInput = $(listView.$el.find('td[data-content="account"]')[0]);
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');
                    var chartOfAccountUrl = new RegExp('\/ChartOfAccount\/', 'i');

                    saveItemSpy.reset();

                    $codeInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('1111111');

                    $accountInput.click();

                    server.respondWith('PATCH', chartOfAccountUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect(saveItemSpy.calledOnce).to.be.true;
                    expect($tableContainer.find('input[type="text"]').length).to.equals(0);
                });

                it('Try to create item', function () {
                    var $codeInput;
                    var $accountInput;
                    var $typeInput;
                    var $input;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var chartOfAccountUrl = new RegExp('\/ChartOfAccount\/', 'i');

                    saveItemSpy.reset();

                    $createBtn.click();

                    $codeInput = listView.$el.find('td[data-content="code"]')[0];
                    $accountInput = listView.$el.find('td[data-content="account"]')[0];
                    $typeInput = listView.$el.find('td[data-content="type"]')[0];

                    $codeInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('111111');
                    $input.focusout();

                    $accountInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('Test account');
                    $input.focusout();

                    $typeInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('Test type');
                    $input.focusout();

                    server.respondWith('POST', chartOfAccountUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect(listView.$el.find('input[type="text"].editing').length).to.equals(0);
                    expect(saveItemSpy.calledOnce).to.be.true;
                });

            });
        });
    });
});
