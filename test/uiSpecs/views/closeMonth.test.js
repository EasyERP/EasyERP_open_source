define([
    'modules',
    'text!fixtures/index.html',
    'collections/closeMonth/filterCollection',
    'views/main/MainView',
    'views/closeMonth/list/ListView',
    'views/closeMonth/TopBarView',
    'views/Filter/filterView',
    'views/PayrollExpenses/generate/GenerateView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules, fixtures, CloseMonthCollection, MainView, ListView, TopBarView, FilterView, GenerateView, $, chai, chaiJquery, sinonChai) {
    'use strict';
    
    var expect;
    var fakeCloseMonth = [
        {
            _id: "2016-03-31T17:59:59.999Z"
        },
        {
            _id: "2016-04-30T17:59:59.999Z"
        }
    ];
    var fakeAsyncData = {
        journalEntries: [
            {
                _id    : "56f538c39c85020807b40024",
                debit  : 8706769.870203072,
                credit : 8706769.870203072,
                date   : "2016-03-31T17:59:59.999Z",
                journal: {
                    _id          : "56f538c39c85020807b40024",
                    name         : "Retained Earnings Journal",
                    creditAccount: "565eb53a6aa50532e5df0bf3",
                    debitAccount : "56f538149c85020807b4001f",
                    editedBy     : {
                        user: null
                    },
                    createdBy    : {
                        date: "2016-03-25T13:10:27.320Z",
                        user: null
                    },
                    description  : "",
                    currency     : {
                        name: "USD"
                    },
                    transaction  : "Accrual",
                    type         : "",
                    date         : "2016-03-25T13:10:27.320Z",
                    __v          : 0
                }
            },
            {
                _id    : "56f538679c85020807b40022",
                debit  : 679030.1297969274,
                credit : 679030.1297969274,
                date   : "2016-03-31T17:59:59.999Z",
                journal: {
                    _id          : "56f538679c85020807b40022",
                    name         : "Close COGS",
                    creditAccount: "565eb53a6aa50532e5df0be2",
                    debitAccount : "56f538149c85020807b4001f",
                    editedBy     : {
                        user: null
                    },
                    createdBy    : {
                        date: "2016-03-25T13:08:55.090Z",
                        user: null
                    },
                    description  : "",
                    currency     : {
                        name: "USD"
                    },
                    transaction  : "Accrual",
                    type         : "",
                    date         : "2016-03-25T13:08:55.090Z",
                    __v          : 0
                }
            },
            {
                _id    : "56f5383a9c85020807b40020",
                debit  : 9385800,
                credit : 9385800,
                date   : "2016-03-31T17:59:59.999Z",
                journal: {
                    _id          : "56f5383a9c85020807b40020",
                    name         : "Income Summary Journal",
                    creditAccount: "56f538149c85020807b4001f",
                    debitAccount : "565eb53a6aa50532e5df0be0",
                    editedBy     : {
                        user: null
                    },
                    createdBy    : {
                        date: "2016-03-25T13:08:10.069Z",
                        user: null
                    },
                    description  : "",
                    currency     : {
                        name: "USD"
                    },
                    transaction  : "Accrual",
                    type         : "",
                    date         : "2016-03-25T13:08:10.067Z",
                    __v          : 0
                }
            }
        ]
    };
    var view;
    var topBarView;
    var listView;
    var closeMonthCollection;
    var recloseSpy;
    var closeSpy;
    
    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;
    
    describe('CloseMonthView', function () {
        var $fixture;
        var $elFixture;
        
        before(function () {
            recloseSpy = sinon.spy(TopBarView.prototype, 'recloseEvent');
            closeSpy = sinon.spy(TopBarView.prototype, 'closeMonth');
        });

        after(function () {
            topBarView.remove();
            listView.remove();
            view.remove();

            recloseSpy.restore();
            closeSpy.restore();
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
                view = new MainView({el: $elFixture, contentType: 'closeMonth'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="94"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="94"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/closeMonth');
            });

        });

        describe('TopBarView', function () {
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

            it('Try to fetch collection with error', function () {
                var closeMonthUrl = new RegExp('journalEntries/getCloseMonth', 'i');

                server.respondWith('GET', closeMonthUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                closeMonthCollection = new CloseMonthCollection({
                    page       : 1,
                    count      : 2,
                    viewType   : 'list',
                    contentType: 'closeMonth'
                });
                server.respond();
            });

            it('Try to create TopBarView', function (done) {
                var closeMonthUrl = new RegExp('journalEntries/getCloseMonth', 'i');

                server.respondWith('GET', closeMonthUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCloseMonth)]);
                closeMonthCollection = new CloseMonthCollection({
                    page       : 1,
                    viewType   : 'list',
                    contentType: 'closeMonth'
                });
                server.respond();

                clock.tick(200);

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: closeMonthCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Close Month');

                done();
            });
        });

        describe('CloseMonthView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var showHiddenSpy;
            var generateSpy;

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
                showHiddenSpy = sinon.spy(ListView.prototype, 'showHidden');
                generateSpy = sinon.spy(GenerateView.prototype, 'generateItems');
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                showHiddenSpy.restore();
                generateSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create CloseMonthListView', function (done) {
                    var asyncDataUrl = new RegExp('journalEntries\/getAsyncCloseMonth', 'i');

                    server.respondWith('GET', asyncDataUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAsyncData)]);
                    listView = new ListView({
                        startTime : new Date(),
                        collection: closeMonthCollection
                    });
                    server.respond();
                    clock.tick(300);

                    $thisEl = listView.$el;

                    expect($thisEl.find('.list')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.not.equals(0);

                    topBarView.bind('copyEvent', listView.copy, listView);
                    topBarView.bind('generateEvent', listView.generate, listView);
                    topBarView.bind('createEvent', listView.createItem, listView);
                    topBarView.bind('editEvent', listView.editItem, listView);
                    topBarView.bind('saveEvent', listView.saveItem, listView);
                    topBarView.bind('deleteEvent', listView.deleteItems, listView);
                    topBarView.bind('generateInvoice', listView.generateInvoice, listView);
                    topBarView.bind('copyRow', listView.copyRow, listView);
                    topBarView.bind('exportToCsv', listView.exportToCsv, listView);
                    topBarView.bind('exportToXlsx', listView.exportToXlsx, listView);
                    topBarView.bind('importEvent', listView.importFiles, listView);
                    topBarView.bind('pay', listView.newPayment, listView);
                    topBarView.bind('changeDateRange', listView.changeDateRange, listView);

                    closeMonthCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try check|uncheck all checkboxes', function () {
                    var $checkAllBtn = $thisEl.find('#checkAll');

                    // check all
                    $checkAllBtn.click();
                    expect($thisEl.find('input[type="checkbox"]').prop('checked')).to.be.true;

                    // uncheck all
                    $checkAllBtn.click();
                    expect($thisEl.find('input[type="checkbox"]').prop('checked')).to.be.false;
                });

                it('Try to expand item', function () {
                    var $firstTr = $thisEl.find('#listTable > tr').first();

                    // expand
                    $firstTr.click();
                    expect(showHiddenSpy.calledOnce).to.be.true;

                    // hide
                    $firstTr.click();
                    expect(showHiddenSpy.calledTwice).to.be.true;
                });

                it('Try to reclose item with error response', function () {
                    var recloseUrl = new RegExp('journalEntries\/recloseMonth', 'i');
                    var $needItem = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var $secondItem = $thisEl.find('#listTable > tr:nth-child(5) > td.notForm > input');
                    var $recloseBtn;
                    var spyResponse;

                    $needItem.click();
                    $secondItem.click();

                    $secondItem.click();
                    $recloseBtn = topBarView.$el.find('#top-bar-reclose');
                    server.respondWith('POST', recloseUrl, [400, {'Content-Type': 'application/json'}, 'OK']);
                    $recloseBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(recloseSpy.calledOnce).to.be.true;

                });

                it('Try to reclose month', function () {
                    var recloseUrl = new RegExp('journalEntries\/recloseMonth', 'i');
                    var $needItem = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var $recloseBtn;

                    $needItem.click();

                    $recloseBtn = topBarView.$el.find('#top-bar-reclose');
                    server.respondWith('POST', recloseUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $recloseBtn.click();
                    server.respond();

                    expect(recloseSpy.calledTwice).to.be.true;
                    expect(window.location.hash).to.be.equals('#easyErp/closeMonth');
                });

                it('Try to close existMonth', function () {
                    var $closeMonthBtn = topBarView.$el.find('#top-bar-generate');
                    var $dialog;
                    var $monthInput;
                    var $yearInput;
                    var $generateBtn;
                    var spyResponse;

                    $closeMonthBtn.click();
                    expect(closeSpy.calledOnce).to.be.true;

                    expect($('.ui-dialog')).to.exist;

                    $dialog = $('.ui-dialog');
                    $monthInput = $dialog.find('#month');
                    $yearInput = $dialog.find('#year');

                    $monthInput.val('4');
                    $yearInput.val('2016');

                    $generateBtn = $dialog.find('#generateBtn');
                    $generateBtn.click();

                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please, choose empty month!');
                });

                it('Try to close month with error response', function () {
                    var closeMonthUrl = new RegExp('journalEntries\/closeMonth', 'i');
                    var $dialog = $('.ui-dialog');
                    var $monthInput = $dialog.find('#month');
                    var $yearInput = $dialog.find('#year');
                    var $generateBtn;
                    var spyResponse;

                    $monthInput.val('1');
                    $yearInput.val('2016');

                    $generateBtn = $dialog.find('#generateBtn');
                    server.respondWith('POST', closeMonthUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $generateBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[2][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'error');
                });

                it('Try to close generateDialog', function () {
                    var $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();
                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to close month', function () {
                    var $closeMonthBtn = topBarView.$el.find('#top-bar-generate');
                    var keyDownEvent = $.Event('keydown', {which: 46});
                    var keyUpEvent = $.Event('keyup');
                    var closeMonthUrl = new RegExp('journalEntries\/closeMonth', 'i')
                    var $dialog;
                    var $monthInput;
                    var $yearInput;
                    var $generateBtn;

                    $closeMonthBtn.click();
                    expect(closeSpy.calledTwice).to.be.true;
                    expect($('.ui-dialog')).to.exist;

                    $dialog = $('.ui-dialog');
                    $monthInput = $dialog.find('#month');
                    $yearInput = $dialog.find('#year');

                    $monthInput.click();
                    $monthInput.trigger(keyDownEvent);
                    $monthInput.trigger(keyUpEvent);
                    $monthInput.val('13');
                    $monthInput.trigger('focusout');

                    $yearInput.click();
                    $yearInput.trigger(keyDownEvent);
                    $yearInput.trigger(keyUpEvent);
                    $yearInput.val('1979');
                    $yearInput.trigger('focusout');

                    $generateBtn = $dialog.find('#generateBtn');
                    server.respondWith('POST', closeMonthUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({"success": true})]);
                    $generateBtn.click();
                    server.respond();

                    expect(generateSpy.called).to.be.true;
                });
            });
        });
    });
});