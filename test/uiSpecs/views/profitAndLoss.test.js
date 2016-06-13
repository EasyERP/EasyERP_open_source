define([
    'text!fixtures/index.html',
    'collections/profitAndLoss/filterCollection',
    'views/main/MainView',
    'views/profitAndLoss/list/ListView',
    'views/profitAndLoss/TopBarView',
    'views/Filter/filterView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (fixtures, ProfitAndLossCollection, MainView, ListView, TopBarView, FilterView, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [
        {
            _id: 19,
            attachments: [ ],
            link: false,
            mname: "Sales",
            parrent: null,
            sequence: 1,
            visible: true,
            ancestors: [ ],
            href: "Sales"
        },
        {
            _id: 36,
            attachments: [ ],
            link: false,
            mname: "Project",
            parrent: null,
            sequence: 2,
            visible: true,
            ancestors: [ ],
            href: "Project"
        },
        {
            _id: 9,
            attachments: [ ],
            link: false,
            mname: "HR",
            parrent: null,
            sequence: 3,
            visible: true,
            ancestors: [ ],
            href: "HR"
        },
        {
            _id: 24,
            attachments: [ ],
            link: true,
            mname: "Leads",
            parrent: 19,
            sequence: 5,
            visible: true,
            ancestors: [ ],
            href: "Leads"
        },
        {
            _id: 25,
            attachments: [ ],
            link: true,
            mname: "Opportunities",
            parrent: 19,
            sequence: 6,
            visible: true,
            ancestors: [ ],
            href: "Opportunities"
        },
        {
            _id: 49,
            attachments: [ ],
            htref: "persons",
            link: true,
            mname: "Persons",
            parrent: 19,
            sequence: 7,
            visible: true,
            ancestors: [ ],
            href: "Persons"
        },
        {
            _id: 50,
            attachments: [ ],
            htref: "persons",
            link: true,
            mname: "Companies",
            parrent: 19,
            sequence: 8,
            visible: true,
            ancestors: [ ],
            href: "Companies"
        },
        {
            _id: 39,
            attachments: [ ],
            link: true,
            mname: "Projects",
            parrent: 36,
            sequence: 21,
            visible: true,
            ancestors: [ ],
            href: "Projects"
        },
        {
            _id: 73,
            mname: "Dashboard Vacation",
            sequence: 22,
            parrent: 36,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "DashBoardVacation"
        },
        {
            _id: 40,
            attachments: [ ],
            link: true,
            mname: "Tasks",
            parrent: 36,
            sequence: 24,
            visible: true,
            ancestors: [ ],
            href: "Tasks"
        },
        {
            _id: 29,
            attachments: [ ],
            link: true,
            mname: "Dashboard",
            parrent: 19,
            sequence: 29,
            visible: true,
            ancestors: [ ],
            href: "Dashboard"
        },
        {
            _id: 42,
            attachments: [ ],
            link: true,
            mname: "Employees",
            parrent: 9,
            sequence: 29,
            visible: true,
            ancestors: [ ],
            href: "Employees"
        },
        {
            _id: 43,
            attachments: [ ],
            link: true,
            mname: "Applications",
            parrent: 9,
            sequence: 30,
            visible: true,
            ancestors: [ ],
            href: "Applications"
        },
        {
            _id: 14,
            attachments: [ ],
            link: true,
            mname: "Job Positions",
            parrent: 9,
            sequence: 32,
            visible: true,
            ancestors: [ ],
            href: "JobPositions"
        },
        {
            _id: 15,
            attachments: [ ],
            link: true,
            mname: "Groups",
            parrent: 1,
            sequence: 33,
            visible: true,
            ancestors: [ ],
            href: "Departments"
        },
        {
            _id: 7,
            __v: 0,
            attachments: [ ],
            link: true,
            mname: "Users",
            parrent: 1,
            sequence: 42,
            visible: true,
            ancestors: [ ],
            href: "Users"
        },
        {
            _id: 44,
            attachments: [ ],
            link: true,
            mname: "Workflows",
            parrent: 1,
            sequence: 44,
            visible: true,
            ancestors: [ ],
            href: "Workflows"
        },
        {
            _id: 51,
            attachments: [ ],
            link: true,
            mname: "Profiles",
            parrent: 1,
            sequence: 51,
            visible: true,
            ancestors: [ ],
            href: "Profiles"
        },
        {
            _id: 52,
            attachments: [ ],
            link: true,
            mname: "Birthdays",
            parrent: 9,
            sequence: 52,
            visible: true,
            ancestors: [ ],
            href: "Birthdays"
        },
        {
            _id: 53,
            attachments: [ ],
            link: true,
            mname: "Dashboard",
            parrent: 36,
            sequence: 53,
            visible: true,
            ancestors: [ ],
            href: "projectDashboard"
        },
        {
            _id: 54,
            mname: "Purchases",
            sequence: 54,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Purchases"
        },
        {
            _id: 80,
            mname: "Jobs Dashboard",
            sequence: 54,
            parrent: 36,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "jobsDashboard"
        },
        {
            _id: 55,
            mname: "Quotation",
            sequence: 55,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Quotation"
        },
        {
            _id: 57,
            mname: "Order",
            sequence: 56,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Order"
        },
        {
            _id: 56,
            mname: "Invoice",
            sequence: 57,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Invoice"
        },
        {
            _id: 58,
            mname: "Product",
            sequence: 58,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Product"
        },
        {
            _id: 59,
            mname: "Accounting",
            sequence: 59,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Accounting"
        },
        {
            _id: 60,
            mname: "Supplier Payments",
            sequence: 60,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "supplierPayments"
        },
        {
            _id: 61,
            mname: "Sales Payments",
            sequence: 61,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "customerPayments"
        },
        {
            _id: 62,
            mname: "Quotation",
            sequence: 62,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesQuotation"
        },
        {
            _id: 63,
            mname: "Order",
            sequence: 63,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesOrder"
        },
        {
            _id: 64,
            mname: "Invoice",
            sequence: 64,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesInvoice"
        },
        {
            _id: 99,
            mname: "Proforma",
            sequence: 65,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesProforma"
        },
        {
            _id: 67,
            mname: "Revenue",
            sequence: 67,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Revenue"
        },
        {
            _id: 68,
            mname: "MonthHours",
            sequence: 68,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "monthHours"
        },
        {
            _id: 69,
            mname: "Holidays",
            sequence: 69,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Holiday"
        },
        {
            _id: 77,
            mname: "Capacity",
            sequence: 69,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Capacity"
        },
        {
            _id: 88,
            mname: "Salary Report",
            sequence: 69,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salaryReport"
        },
        {
            _id: 70,
            mname: "Vacation",
            sequence: 70,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Vacation"
        },
        {
            _id: 71,
            mname: "Attendance",
            sequence: 71,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Attendance"
        },
        {
            _id: 76,
            mname: "Efficiency",
            sequence: 72,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Efficiency"
        },
        {
            _id: 72,
            mname: "Bonus Type",
            sequence: 73,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "bonusType"
        },
        {
            _id: 74,
            mname: "HrDashboard",
            sequence: 74,
            parrent: 9,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "HrDashboard"
        },
        {
            _id: 66,
            mname: "Payroll Expenses",
            sequence: 77,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "PayrollExpenses"
        },
        {
            _id: 78,
            mname: "Payroll",
            sequence: 78,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Payroll"
        },
        {
            _id: 79,
            mname: "Payroll Payments",
            sequence: 79,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "PayrollPayments"
        },
        {
            _id: 82,
            mname: "Invoice Aging",
            sequence: 82,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "invoiceAging"
        },
        {
            _id: 83,
            mname: "Chart Of Account",
            sequence: 83,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "ChartOfAccount"
        },
        {
            _id: 100,
            mname: "Inventory Report",
            sequence: 83,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "inventoryReport"
        },
        {
            _id: 85,
            mname: "Journal",
            sequence: 85,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "journal"
        },
        {
            _id: 86,
            mname: "Journal Entry",
            sequence: 86,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "journalEntry"
        },
        {
            _id: 87,
            mname: "Invoice Charts",
            sequence: 87,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "invoiceCharts"
        },
        {
            _id: 89,
            mname: "Trial Balance",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "trialBalance"
        },
        {
            _id: 91,
            mname: "Profit And Loss",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "profitAndLoss"
        },
        {
            _id: 92,
            mname: "Balance Sheet",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "balanceSheet"
        },
        {
            _id: 93,
            mname: "Cash Flow",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "cashFlow"
        },
        {
            _id: 94,
            mname: "Close Month",
            sequence: 89,
            parrent: 59,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "closeMonth"
        },
        {
            _id: 96,
            mname: "Expenses",
            sequence: 96,
            parrent: null,
            link: false,
            visible: true,
            ancestors: [ ],
            href: "Expenses"
        },
        {
            _id: 97,
            mname: "Invoice",
            sequence: 97,
            parrent: 96,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "ExpensesInvoice"
        },
        {
            _id: 98,
            mname: "Expenses Payments",
            sequence: 98,
            parrent: 96,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "ExpensesPayments"
        },
        {
            _id: 101,
            mname: "Dividend declaration",
            sequence: 101,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "DividendInvoice"
        },
        {
            _id: 102,
            mname: "Dividend payment",
            sequence: 101,
            parrent: 78,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "DividendPayments"
        },
        {
            _id: 103,
            link: true,
            mname: "Employee",
            parrent: 1,
            sequence: 103,
            visible: true,
            ancestors: [ ],
            href: "settingsEmployee"
        },
        {
            _id: 1,
            __v: 0,
            attachments: [ ],
            link: false,
            mname: "Settings",
            parrent: null,
            sequence: 1000,
            visible: true,
            ancestors: [ ],
            href: "Settings"
        },
        {
            _id: 75,
            mname: "tCard",
            sequence: 1000,
            parrent: 36,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "wTrack"
        },
        {
            _id: 84,
            mname: "Product Categories",
            sequence: 1000,
            parrent: 1,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "productSettings"
        }
    ];
    var fakeProfitAndLoss = {
        grossFit: [
            {
                _id: "565eb53a6aa50532e5df0be0",
                name: "200000 Product Sales",
                debit: 17994500
            }
        ],
        expenses: [
            {
                _id: "565eb53a6aa50532e5df0be2",
                name: "210000 Cost of Goods Sold",
                debit: 3681315.6554685445
            }
        ],
        dividends: 0
    };
    var fakeAsyncData = {
        journalEntries: [
            {
                _id: "2016-04-30T17:59:59.999Z",
                debit: 0,
                credit: 3681315.6554685445,
                account: "565eb53a6aa50532e5df0be2"
            },
            {
                _id: "2016-04-24T03:59:59.999Z",
                debit: 1529889.5200247744,
                credit: 0,
                account: "565eb53a6aa50532e5df0be2"
            },
            {
                _id: "2016-04-14T03:59:59.000Z",
                debit: 340010.6000763253,
                credit: 0,
                account: "565eb53a6aa50532e5df0be2"
            },
            {
                _id: "2016-04-03T03:59:59.999Z",
                debit: 1684113.1952089928,
                credit: 0,
                account: "565eb53a6aa50532e5df0be2"
            },
            {
                _id: "2016-03-31T21:59:59.000Z",
                debit: 127302.34015845145,
                credit: 0,
                account: "565eb53a6aa50532e5df0be2"
            }
        ]
    };

    var view;
    var topBarView;
    var listView;
    var profitAndLossCollection;
    var setDateRangeSpy;
    var showDatePickerSpy;

    describe('ProfitAndLoss', function () {

        var $fixture;
        var $elFixture;
        before(function(){
            setDateRangeSpy = sinon.spy(TopBarView.prototype, 'setDateRange');
            showDatePickerSpy = sinon.spy(TopBarView.prototype, 'showDatePickers');
        });

        after(function () {
            view.remove();

            setDateRangeSpy.restore();
            showDatePickerSpy.restore();
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
                view = new MainView({el: $elFixture, contentType: 'profitAndLoss'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="91"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="91"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/profitAndLoss');
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
                var profitAndLossUrl = new RegExp('journalEntries\/getProfitAndLoss', 'i');

                server.respondWith('GET', profitAndLossUrl, [401, {"Content-Type": "application/json"}, JSON.stringify({})]);
                profitAndLossCollection = new ProfitAndLossCollection({
                    page: 1,
                    count: 2,
                    viewType: 'list',
                    contentType: 'profitAndLoss'
                });
                server.respond();
            });

            it('Try to create TopBarView', function (done) {
                var profitAndLossUrl = new RegExp('journalEntries\/getProfitAndLoss', 'i');

                server.respondWith('GET', profitAndLossUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProfitAndLoss)]);
                profitAndLossCollection = new ProfitAndLossCollection({
                    page: 1,
                    viewType: 'list',
                    contentType: 'profitAndLoss'
                });
                server.respond();

                clock.tick(200);

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: profitAndLossCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Profit And Loss');

                done();
            });
        });

        describe('ProfitAndLossListView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var showHiddenSpy;

            before(function () {
                App.startPreload = function() {
                    App.preloaderShowFlag = true;
                    $('#loading').show();
                };

                App.stopPreload = function() {
                    App.preloaderShowFlag = false;
                    $('#loading').hide();
                };

                App.currentDb = 'michelDb';

                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                showHiddenSpy = sinon.spy(ListView.prototype, 'showHidden');
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                showHiddenSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create ProfitAndLossListView', function (done) {
                    var asyncDataUrl = new RegExp('\/journalEntries\/getAsyncDataForGL', 'i');

                    server.respondWith('GET', asyncDataUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeAsyncData)]);
                    listView = new ListView({
                        startTime: new Date(),
                        collection: profitAndLossCollection
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

                    profitAndLossCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to expand item', function(){
                    var $firstTr = $thisEl.find('#listTableGrossFit > tr').first();

                    // expand
                    $firstTr.click();
                    expect(showHiddenSpy.calledOnce).to.be.true;

                    // hide
                    $firstTr.click();
                    expect(showHiddenSpy.calledTwice).to.be.true;
                });

                it('Try to change dateRange', function () {
                    var $topBarEl = topBarView.$el;
                    var $updateDateBtn = $topBarEl.find('#updateDate');
                    var $dateRange = $topBarEl.find('.dateRange');
                    var asyncDataUrl = new RegExp('\/journalEntries\/getAsyncDataForGL', 'i');
                    var profitAndLossUrl = new RegExp('journalEntries\/getProfitAndLoss', 'i');
                    var $cancelBtn;
                    var $thisMonth;
                    var $finYear;
                    var $lastMonth;
                    var $lastQuarter;
                    var $lastFinYear;
                    var $customDate;
                    var $startDate;
                    var $endDate;

                    server.respondWith('GET', profitAndLossUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProfitAndLoss)]);
                    server.respondWith('GET', asyncDataUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeAsyncData)]);
                    $dateRange.click();

                    $thisMonth = $topBarEl.find('#thisMonth');
                    $thisMonth.click();
                    server.respond();
                    expect(setDateRangeSpy.calledOnce).to.be.true;

                    $finYear = $topBarEl.find('#thisYear');
                    $finYear.click();
                    server.respond();
                    expect(setDateRangeSpy.calledTwice).to.be.true;

                    $lastMonth = $topBarEl.find('#lastMonth');
                    $lastMonth.click();
                    server.respond();
                    expect(setDateRangeSpy.calledThrice).to.be.true;

                    $lastQuarter = $topBarEl.find('#lastQuarter');
                    $lastQuarter.click();
                    server.respond();
                    expect(setDateRangeSpy.callCount).to.be.equals(4);

                    $lastFinYear = $topBarEl.find('#lastYear');
                    $lastFinYear.click();
                    server.respond();
                    expect(setDateRangeSpy.callCount).to.be.equals(5);

                    // open dateRange dropdown
                    $dateRange.click();

                    // cancel dateRange dropdown
                    $cancelBtn = $topBarEl.find('#cancelBtn');
                    $cancelBtn.click();

                    $dateRange.click();
                    $customDate = $topBarEl.find('#custom');
                    $customDate.click();
                    expect(showDatePickerSpy.calledOnce).to.be.true;

                    $startDate = $topBarEl.find('#startDate');
                    $startDate.datepicker('setDate', new Date('1 May, 2016'));
                    $startDate.change();

                    $endDate = $topBarEl.find('#endDate');
                    $endDate.datepicker('setDate', new Date('1 June, 2016'));
                    $endDate.change();

                    $updateDateBtn.click();
                    server.respond();
                });
            });
        });
    });
});