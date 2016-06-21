define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/journal/filterCollection',
    'views/main/MainView',
    'views/journal/list/ListView',
    'views/journal/TopBarView',
    'views/journal/CreateView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone, modules, fixtures, JournalCollection, MainView, ListView, TopBarView, CreateView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var expect;
    var fakeJournal = {
        total: 300,
        data : [
            {
                _id          : "565ef6ba270f53d02ee71d65",
                name         : "Invoice Journal",
                __v          : 0,
                creditAccount: {
                    _id : "565eb53a6aa50532e5df0be0",
                    name: "200000 Product Sales"
                },
                debitAccount : {
                    _id : "565eb53a6aa50532e5df0bc9",
                    name: "101200 Account Receivable "
                },
                editedBy     : {
                    user: null
                },
                createdBy    : {
                    date: "2015-12-02T13:48:42.607Z",
                    user: null
                },
                description  : "",
                currency     : {
                    name: "USD"
                },
                transaction  : "invoice",
                type         : "",
                date         : "2015-12-02T13:48:42.607Z"
            },
            {
                _id          : "56cc727e541812c07197356c",
                name         : "Salary Payable",
                __v          : 0,
                creditAccount: {
                    _id : "56c4444eb81fd51e19207f3e",
                    name: "111101 Salary Payable"
                },
                debitAccount : {
                    _id : "565eb53a6aa50532e5df0bda",
                    name: "104001 Work In Process"
                },
                editedBy     : {
                    date: "2016-03-21T07:45:27.331Z",
                    user: null
                },
                createdBy    : {
                    date: "2016-02-23T14:53:50.956Z",
                    user: null
                },
                description  : "",
                currency     : {
                    name: "USD"
                },
                transaction  : "Accrual ",
                type         : "",
                date         : "2016-02-23T14:53:50.956Z"
            },
            {
                _id          : "56cc72a8541812c07197356e",
                name         : "Vacations and Holidays",
                __v          : 0,
                creditAccount: {
                    _id : "56c4444eb81fd51e19207f3e",
                    name: "111101 Salary Payable"
                },
                debitAccount : {
                    _id : "56c9d4c7c3b88f6d64490fb4",
                    name: "212102 Vacation & Holiday Expense"
                },
                editedBy     : {
                    date: "2016-03-21T09:32:47.966Z",
                    user: null
                },
                createdBy    : {
                    date: "2016-02-23T14:54:32.803Z",
                    user: null
                },
                description  : "",
                currency     : {
                    name: "USD"
                },
                transaction  : "Accrual ",
                type         : "",
                date         : "2016-02-23T14:54:32.803Z"
            }
        ]
    };
    var fakeChartofAccoutnForDD = {
        data: [
            {
                _id      : "565eb53a6aa50532e5df0bc8",
                code     : 1232332,
                createdBy: {
                    date: "2016-06-13T11:36:56.582Z",
                    user: null
                },
                editedBy : {
                    date: "2016-06-13T11:04:15.754Z",
                    user: null
                },
                payMethod: null,
                type     : "Fixed Assets ",
                name     : "1232332 Fixed Asset Account ",
                account  : "Fixed Asset Account "
            },
            {
                _id      : "565eb53a6aa50532e5df0bc9",
                code     : 101200,
                createdBy: {
                    date: "2016-06-13T11:36:56.583Z",
                    user: null
                },
                editedBy : {
                    date: "2016-06-13T11:04:15.753Z",
                    user: null
                },
                payMethod: null,
                type     : "Current Assets",
                name     : "101200 Account Receivable ",
                account  : "Account Receivable "
            },
            {
                _id      : "565eb53a6aa50532e5df0bca",
                code     : 101400,
                createdBy: {
                    date: "2016-06-13T11:36:56.583Z",
                    user: null
                },
                editedBy : {
                    date: "2015-12-02T14:19:59.502Z",
                    user: "52203e707d4dba8813000003"
                },
                payMethod: "565c5433385ea8b670ff499e",
                type     : "Bank and Cash",
                name     : "101400 Erste USD",
                account  : "Erste USD"
            }
        ]
    };
    var journalCollection;
    var view;
    var topBarView;
    var listView;
    var ajaxSpy;
    var historyNavigateSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('Journal View', function () {
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

                view = new MainView({el: $elFixture, contentType: 'journal'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="85"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="85"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/journal');

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
                var journalUrl = new RegExp('\/journals\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', journalUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournal)]);
                journalCollection = new JournalCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'journal'
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
            });

            it('Try to create TopBarView', function () {
                var journalUrl = new RegExp('\/journals\/', 'i');

                server.respondWith('GET', journalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournal)]);
                journalCollection = new JournalCollection({
                    viewType: 'list',
                    page    : 1,
                    count   : 100
                });
                server.respond();

                expect(journalCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: journalCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

        });

        describe('Journal list view', function () {
            var server;
            var windowConfirmStub;
            var clock;
            var mainSpy;
            var $thisEl;
            var editRowSpy;
            var saveItemSpy;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                editRowSpy = sinon.spy(ListView.prototype, 'editRow');
                saveItemSpy = sinon.spy(ListView.prototype, 'saveItem');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                clock.restore();
                mainSpy.restore();
                editRowSpy.restore();
                saveItemSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create Journal list view', function (done) {
                    var $firstRow;
                    var colCount;
                    var journalName;
                    var transaction;
                    var debitAccount;
                    var creaditAccount;
                    var chartsOfAccountUrl = '/chartOfAccount/getForDd';

                    server.respondWith('GET', chartsOfAccountUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeChartofAccoutnForDD)]);
                    listView = new ListView({
                        collection: journalCollection,
                        startTime : new Date()
                    });
                    server.respond();

                    clock.tick(200);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(journalCollection, listView);

                    journalCollection.trigger('fetchFinished', {
                        totalRecords: journalCollection.totalRecords,
                        currentPage : journalCollection.currentPage,
                        pageSize    : journalCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(6);

                    journalName = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(journalName).to.not.empty;
                    expect(journalName).to.not.match(/object Object|undefined/);

                    transaction = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(transaction).to.not.empty;
                    expect(transaction).to.not.match(/object Object|undefined/);

                    debitAccount = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(debitAccount).to.not.empty;
                    expect(debitAccount).to.not.match(/object Object|undefined/);

                    creaditAccount = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(creaditAccount).to.not.empty;
                    expect(creaditAccount).to.not.match(/object Object|undefined/);
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
                    expect(ajaxResponse).to.have.property('url', '/journals/');
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

                it('Try to delete item', function () {
                    var journalUrl = new RegExp('\/journal\/', 'i');
                    var $firstEl = listView.$el.find('tr:nth-child(1) > td:nth-child(1) > .checkbox');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    windowConfirmStub.returns(true);

                    $firstEl.prop('checked', true);

                    server.respondWith('DELETE', journalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(windowConfirmStub.called).to.be.true;
                });

                it('Try to create item', function () {
                    var $dialogEl;
                    var $journalName;
                    var $transactionEl;
                    var $debitEl;
                    var $creditEl;
                    var $createDialogBtn;
                    var $debitNextBtn;
                    var $debitPrevBtn;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');

                    server.respondWith('GET', '/chartOfAccount/getForDd', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeChartofAccoutnForDD)]);
                    $createBtn.click();
                    server.respond();

                    $dialogEl = $('.ui-dialog');
                    $createDialogBtn = $dialogEl.find('#createBtn');

                    expect($dialogEl).to.be.exist;

                    $journalName = $dialogEl.find('#nameInput');
                    $journalName.val('Test');

                    $dialogEl.find('a#typeDd.current-selected').click();
                    $transactionEl = $dialogEl.find('.newSelectList li:nth-child(1)');
                    $transactionEl.click();

                    $dialogEl.find('a#debitDd.current-selected').click();
                    $debitNextBtn = $dialogEl.find('a.next');
                    $debitNextBtn.click();
                    $debitPrevBtn = $dialogEl.find('a.prev');
                    $debitPrevBtn.click();
                    $debitEl = $dialogEl.find('.newSelectList li:nth-child(1)');
                    $debitEl.click();

                    $dialogEl.find('a#creditDd.current-selected').click();
                    $creditEl = $dialogEl.find('.newSelectList li:nth-child(1)');
                    $creditEl.click();

                    historyNavigateSpy.reset();

                    server.respondWith('POST', '/journals/', [201, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Created success'})]);
                    $createDialogBtn.click();
                    server.respond();

                    expect(historyNavigateSpy.calledOnce).to.be.true;
                    expect(window.location.hash).to.be.equals('#easyErp/journal');
                    $('.ui-dialog').remove();
                });

                it('Try to edit journal item and save with empty journal name', function () {
                    var $firstRow = $thisEl.find('#listTable > tr').first();
                    var $journalNameTd = $firstRow.find('td[data-content="name"]');
                    var $input;
                    var $saveItem;

                    mainSpy.reset();

                    $journalNameTd.click();
                    $input = $journalNameTd.find('input.editing');
                    expect($input).to.exist;

                    $input.val('');
                    $saveItem = topBarView.$el.find('#top-bar-saveBtn');

                    $saveItem.click();

                    expect(mainSpy.args[0][0]).to.have.property('type', 'error');
                });

                it('Try to change journal transaction', function () {
                    var journalUrl = '/journals/';
                    var $firstRow = $thisEl.find('#listTable > tr').first();
                    var $transactionTd = $firstRow.find('td[data-content="transaction"]');
                    var $journalNameTd = $firstRow.find('td[data-content="name"]');
                    var $input;
                    var $selectList;
                    var $selectedItem;
                    var $saveBtn;

                    editRowSpy.reset();
                    saveItemSpy.reset();

                    $journalNameTd.click();
                    $input = $journalNameTd.find('input.editing');
                    $input.val('Test');

                    $transactionTd.click();
                    $selectList = $transactionTd.find('.newSelectList');
                    expect(editRowSpy.calledTwice).to.be.true;
                    expect($selectList).to.exist;

                    $selectedItem = $selectList.find('li').first();
                    $selectedItem.click();

                    $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    server.respondWith('PATCH', journalUrl, [201, {'Content-Type': 'application/json'}, JSON.stringify({success: 'updated'})]);
                    $saveBtn.click();
                    server.respond();

                    expect(saveItemSpy.calledOnce).to.be.true;

                });
            });
        });
    });
});
