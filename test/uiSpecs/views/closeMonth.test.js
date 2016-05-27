define([
    'text!fixtures/index.html',
    'collections/closeMonth/filterCollection',
    'views/main/MainView',
    'views/closeMonth/list/ListView',
    'views/closeMonth/TopBarView',
    'views/Filter/FilterView',
    'views/PayrollExpenses/generate/GenerateView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (fixtures, CloseMonthCollection, MainView, ListView, TopBarView, FilterView, GenerateView, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [
        {
            _id        : 19,
            attachments: [],
            link       : false,
            mname      : "Sales",
            parrent    : null,
            sequence   : 1,
            visible    : true,
            ancestors  : [],
            href       : "Sales"
        },
        {
            _id        : 36,
            attachments: [],
            link       : false,
            mname      : "Project",
            parrent    : null,
            sequence   : 2,
            visible    : true,
            ancestors  : [],
            href       : "Project"
        },
        {
            _id        : 9,
            attachments: [],
            link       : false,
            mname      : "HR",
            parrent    : null,
            sequence   : 3,
            visible    : true,
            ancestors  : [],
            href       : "HR"
        },
        {
            _id        : 24,
            attachments: [],
            link       : true,
            mname      : "Leads",
            parrent    : 19,
            sequence   : 5,
            visible    : true,
            ancestors  : [],
            href       : "Leads"
        },
        {
            _id        : 25,
            attachments: [],
            link       : true,
            mname      : "Opportunities",
            parrent    : 19,
            sequence   : 6,
            visible    : true,
            ancestors  : [],
            href       : "Opportunities"
        },
        {
            _id        : 49,
            attachments: [],
            htref      : "persons",
            link       : true,
            mname      : "Persons",
            parrent    : 19,
            sequence   : 7,
            visible    : true,
            ancestors  : [],
            href       : "Persons"
        },
        {
            _id        : 50,
            attachments: [],
            htref      : "persons",
            link       : true,
            mname      : "Companies",
            parrent    : 19,
            sequence   : 8,
            visible    : true,
            ancestors  : [],
            href       : "Companies"
        },
        {
            _id        : 39,
            attachments: [],
            link       : true,
            mname      : "Projects",
            parrent    : 36,
            sequence   : 21,
            visible    : true,
            ancestors  : [],
            href       : "Projects"
        },
        {
            _id      : 73,
            mname    : "Dashboard Vacation",
            sequence : 22,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "DashBoardVacation"
        },
        {
            _id        : 40,
            attachments: [],
            link       : true,
            mname      : "Tasks",
            parrent    : 36,
            sequence   : 24,
            visible    : true,
            ancestors  : [],
            href       : "Tasks"
        },
        {
            _id        : 29,
            attachments: [],
            link       : true,
            mname      : "Dashboard",
            parrent    : 19,
            sequence   : 29,
            visible    : true,
            ancestors  : [],
            href       : "Dashboard"
        },
        {
            _id        : 42,
            attachments: [],
            link       : true,
            mname      : "Employees",
            parrent    : 9,
            sequence   : 29,
            visible    : true,
            ancestors  : [],
            href       : "Employees"
        },
        {
            _id        : 43,
            attachments: [],
            link       : true,
            mname      : "Applications",
            parrent    : 9,
            sequence   : 30,
            visible    : true,
            ancestors  : [],
            href       : "Applications"
        },
        {
            _id        : 14,
            attachments: [],
            link       : true,
            mname      : "Job Positions",
            parrent    : 9,
            sequence   : 32,
            visible    : true,
            ancestors  : [],
            href       : "JobPositions"
        },
        {
            _id        : 15,
            attachments: [],
            link       : true,
            mname      : "Groups",
            parrent    : 1,
            sequence   : 33,
            visible    : true,
            ancestors  : [],
            href       : "Departments"
        },
        {
            _id        : 7,
            __v        : 0,
            attachments: [],
            link       : true,
            mname      : "Users",
            parrent    : 1,
            sequence   : 42,
            visible    : true,
            ancestors  : [],
            href       : "Users"
        },
        {
            _id        : 44,
            attachments: [],
            link       : true,
            mname      : "Workflows",
            parrent    : 1,
            sequence   : 44,
            visible    : true,
            ancestors  : [],
            href       : "Workflows"
        },
        {
            _id        : 51,
            attachments: [],
            link       : true,
            mname      : "Profiles",
            parrent    : 1,
            sequence   : 51,
            visible    : true,
            ancestors  : [],
            href       : "Profiles"
        },
        {
            _id        : 52,
            attachments: [],
            link       : true,
            mname      : "Birthdays",
            parrent    : 9,
            sequence   : 52,
            visible    : true,
            ancestors  : [],
            href       : "Birthdays"
        },
        {
            _id        : 53,
            attachments: [],
            link       : true,
            mname      : "Dashboard",
            parrent    : 36,
            sequence   : 53,
            visible    : true,
            ancestors  : [],
            href       : "projectDashboard"
        },
        {
            _id      : 54,
            mname    : "Purchases",
            sequence : 54,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : "Purchases"
        },
        {
            _id      : 80,
            mname    : "Jobs Dashboard",
            sequence : 54,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "jobsDashboard"
        },
        {
            _id      : 55,
            mname    : "Quotation",
            sequence : 55,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Quotation"
        },
        {
            _id      : 57,
            mname    : "Order",
            sequence : 56,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Order"
        },
        {
            _id      : 56,
            mname    : "Invoice",
            sequence : 57,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Invoice"
        },
        {
            _id      : 58,
            mname    : "Product",
            sequence : 58,
            parrent  : 54,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Product"
        },
        {
            _id      : 59,
            mname    : "Accounting",
            sequence : 59,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : "Accounting"
        },
        {
            _id      : 60,
            mname    : "Supplier Payments",
            sequence : 60,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "supplierPayments"
        },
        {
            _id      : 61,
            mname    : "Sales Payments",
            sequence : 61,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "customerPayments"
        },
        {
            _id      : 62,
            mname    : "Quotation",
            sequence : 62,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "salesQuotation"
        },
        {
            _id      : 63,
            mname    : "Order",
            sequence : 63,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "salesOrder"
        },
        {
            _id      : 64,
            mname    : "Invoice",
            sequence : 64,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "salesInvoice"
        },
        {
            _id      : 99,
            mname    : "Proforma",
            sequence : 65,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "salesProforma"
        },
        {
            _id      : 67,
            mname    : "Revenue",
            sequence : 67,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Revenue"
        },
        {
            _id      : 68,
            mname    : "MonthHours",
            sequence : 68,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "monthHours"
        },
        {
            _id      : 69,
            mname    : "Holidays",
            sequence : 69,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Holiday"
        },
        {
            _id      : 77,
            mname    : "Capacity",
            sequence : 69,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Capacity"
        },
        {
            _id      : 88,
            mname    : "Salary Report",
            sequence : 69,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "salaryReport"
        },
        {
            _id      : 70,
            mname    : "Vacation",
            sequence : 70,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Vacation"
        },
        {
            _id      : 71,
            mname    : "Attendance",
            sequence : 71,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Attendance"
        },
        {
            _id      : 76,
            mname    : "Efficiency",
            sequence : 72,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "Efficiency"
        },
        {
            _id      : 72,
            mname    : "Bonus Type",
            sequence : 73,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "bonusType"
        },
        {
            _id      : 74,
            mname    : "HrDashboard",
            sequence : 74,
            parrent  : 9,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "HrDashboard"
        },
        {
            _id      : 66,
            mname    : "Payroll Expenses",
            sequence : 77,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "PayrollExpenses"
        },
        {
            _id      : 78,
            mname    : "Payroll",
            sequence : 78,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : "Payroll"
        },
        {
            _id      : 79,
            mname    : "Payroll Payments",
            sequence : 79,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "PayrollPayments"
        },
        {
            _id      : 82,
            mname    : "Invoice Aging",
            sequence : 82,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "invoiceAging"
        },
        {
            _id      : 83,
            mname    : "Chart Of Account",
            sequence : 83,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "ChartOfAccount"
        },
        {
            _id      : 100,
            mname    : "Inventory Report",
            sequence : 83,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "inventoryReport"
        },
        {
            _id      : 85,
            mname    : "Journal",
            sequence : 85,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "journal"
        },
        {
            _id      : 86,
            mname    : "Journal Entry",
            sequence : 86,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "journalEntry"
        },
        {
            _id      : 87,
            mname    : "Invoice Charts",
            sequence : 87,
            parrent  : 19,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "invoiceCharts"
        },
        {
            _id      : 89,
            mname    : "Trial Balance",
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "trialBalance"
        },
        {
            _id      : 91,
            mname    : "Profit And Loss",
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "profitAndLoss"
        },
        {
            _id      : 92,
            mname    : "Balance Sheet",
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "balanceSheet"
        },
        {
            _id      : 93,
            mname    : "Cash Flow",
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "cashFlow"
        },
        {
            _id      : 94,
            mname    : "Close Month",
            sequence : 89,
            parrent  : 59,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "closeMonth"
        },
        {
            _id      : 96,
            mname    : "Expenses",
            sequence : 96,
            parrent  : null,
            link     : false,
            visible  : true,
            ancestors: [],
            href     : "Expenses"
        },
        {
            _id      : 97,
            mname    : "Invoice",
            sequence : 97,
            parrent  : 96,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "ExpensesInvoice"
        },
        {
            _id      : 98,
            mname    : "Expenses Payments",
            sequence : 98,
            parrent  : 96,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "ExpensesPayments"
        },
        {
            _id      : 101,
            mname    : "Dividend declaration",
            sequence : 101,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "DividendInvoice"
        },
        {
            _id      : 102,
            mname    : "Dividend payment",
            sequence : 101,
            parrent  : 78,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "DividendPayments"
        },
        {
            _id      : 103,
            link     : true,
            mname    : "Employee",
            parrent  : 1,
            sequence : 103,
            visible  : true,
            ancestors: [],
            href     : "settingsEmployee"
        },
        {
            _id        : 1,
            __v        : 0,
            attachments: [],
            link       : false,
            mname      : "Settings",
            parrent    : null,
            sequence   : 1000,
            visible    : true,
            ancestors  : [],
            href       : "Settings"
        },
        {
            _id      : 75,
            mname    : "tCard",
            sequence : 1000,
            parrent  : 36,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "wTrack"
        },
        {
            _id      : 84,
            mname    : "Product Categories",
            sequence : 1000,
            parrent  : 1,
            link     : true,
            visible  : true,
            ancestors: [],
            href     : "productSettings"
        }
    ];
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

                server.respondWith('GET', '/getModules', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);
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
                var closeMonthUrl = new RegExp('journal/journalEntry/getCloseMonth', 'i');

                server.respondWith('GET', closeMonthUrl, [401, {"Content-Type": "application/json"}, JSON.stringify({})]);
                closeMonthCollection = new CloseMonthCollection({
                    page       : 1,
                    count      : 2,
                    viewType   : 'list',
                    contentType: 'closeMonth'
                });
                server.respond();
            });

            it('Try to create TopBarView', function (done) {
                var closeMonthUrl = new RegExp('journal/journalEntry/getCloseMonth', 'i');

                server.respondWith('GET', closeMonthUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCloseMonth)]);
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
                    var asyncDataUrl = new RegExp('\/journal\/journalEntry\/getAsyncCloseMonth', 'i');

                    server.respondWith('GET', asyncDataUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeAsyncData)]);
                    listView = new ListView({
                        startTime : new Date(),
                        collection: closeMonthCollection
                    });
                    server.respond();
                    clock.tick(300);

                    expect(listView.$el.find('.list')).to.exist;

                    $thisEl = listView.$el;

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
                    var $checkAllBtn = $thisEl.find('#check_all');

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
                    var recloseUrl = new RegExp('\/journal\/journalEntry\/recloseMonth', 'i');
                    var $needItem = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var $secondItem = $thisEl.find('#listTable > tr:nth-child(5) > td.notForm > input');
                    var $recloseBtn;
                    var spyResponse;

                    $needItem.click();
                    $secondItem.click();

                    $secondItem.click();
                    $recloseBtn = topBarView.$el.find('#top-bar-reclose');
                    server.respondWith('POST', recloseUrl, [400, {"Content-Type": "application/json"}, 'OK']);
                    $recloseBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(recloseSpy.calledOnce).to.be.true;

                });

                it('Try to reclose month', function () {
                    var recloseUrl = new RegExp('\/journal\/journalEntry\/recloseMonth', 'i');
                    var $needItem = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var $recloseBtn;

                    $needItem.click();

                    $recloseBtn = topBarView.$el.find('#top-bar-reclose');
                    server.respondWith('POST', recloseUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
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
                    var closeMonthUrl = new RegExp('\/journal\/journalEntry\/closeMonth', 'i');
                    var $dialog = $('.ui-dialog');
                    var $monthInput = $dialog.find('#month');
                    var $yearInput = $dialog.find('#year');
                    var $generateBtn;
                    var spyResponse;

                    $monthInput.val('1');
                    $yearInput.val('2016');

                    $generateBtn = $dialog.find('#generateBtn');
                    server.respondWith('POST', closeMonthUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
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
                    var closeMonthUrl = new RegExp('\/journal\/journalEntry\/closeMonth', 'i')
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
                    server.respondWith('POST', closeMonthUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"success": true})]);
                    $generateBtn.click();
                    server.respond();

                    expect(generateSpy.called).to.be.true;
                });
            });
        });
    });
});