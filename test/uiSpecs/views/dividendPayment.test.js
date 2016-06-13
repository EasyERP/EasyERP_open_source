define([
    'text!fixtures/index.html',
    'collections/DividendPayments/filterCollection',
    'views/main/MainView',
    'views/DividendPayments/list/ListView',
    'views/DividendPayments/TopBarView',
    'views/DividendPayments/CreateView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (fixtures, DividendCollection, MainView, ListView, TopBarView, CreateView, $, chai, chaiJquery, sinonChai) {
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
            mname: "Quotations",
            sequence: 55,
            parrent: 54,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "Quotations"
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
            mname: "Quotations",
            sequence: 62,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesQuotations"
        },
        {
            _id: 63,
            mname: "Order",
            sequence: 63,
            parrent: 19,
            link: true,
            visible: true,
            ancestors: [ ],
            href: "salesOrders"
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
    var fakeDividend = [
        {
            _id: "574400dd355ba73610d82ec0",
            _type: "dividendInvoicePayment",
            period: null,
            paymentMethod: {
                _id: "565f2e05ab70d49024242e07",
                name: "Erste Bank HU24 1160 0006 0000 0000 4916 1522",
                account: "HU24 1160 0006 0000 0000 4916 1522",
                currency: "USD",
                bank: "Erste Bank",
                owner: "Alexander Sokhanych"
            },
            paymentRef: "",
            forSale: false,
            currency: {
                rate: 1,
                name: "USD",
                _id: "565eab29aeb95fa9c0f9df2d"
            },
            differenceAmount: 0,
            workflow: "Paid",
            date: "2016-05-23T21:00:00.000Z",
            paidAmount: 55500,
            invoice: {
                _id: "574400cf355ba73610d82ebe",
                workflow: {
                    _id: "55647d982e4aa3804a765ecb",
                    sequence: 2,
                    status: "Done",
                    name: "Paid",
                    wId: "Sales Invoice",
                    color: "#2C3E50",
                    __v: 0,
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    wName: "invoice",
                    visible: true
                },
                name: "DD3"
            },
            removable: true
        },
        {
            _id: "574400f9355ba73610d82ec4",
            _type: "dividendInvoicePayment",
            period: null,
            paymentMethod: {
                _id: "565f2e05ab70d49024242e07",
                name: "Erste Bank HU24 1160 0006 0000 0000 4916 1522",
                account: "HU24 1160 0006 0000 0000 4916 1522",
                currency: "USD",
                bank: "Erste Bank",
                owner: "Alexander Sokhanych"
            },
            paymentRef: "",
            forSale: false,
            currency: {
                rate: 1,
                name: "USD",
                _id: "565eab29aeb95fa9c0f9df2d"
            },
            differenceAmount: 0,
            workflow: "Paid",
            date: "2016-05-23T21:00:00.000Z",
            paidAmount: 77700,
            invoice: {
                _id: "574400d3355ba73610d82ebf",
                workflow: {
                    _id: "55647d982e4aa3804a765ecb",
                    sequence: 2,
                    status: "Done",
                    name: "Paid",
                    wId: "Sales Invoice",
                    color: "#2C3E50",
                    __v: 0,
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    wName: "invoice",
                    visible: true
                },
                name: "DD4"
            },
            removable: true
        },
        {
            _id: "5742f2d07afe352f10c11c3e",
            _type: "dividendInvoicePayment",
            period: null,
            paymentMethod: {
                _id: "565f2e05ab70d49024242e07",
                name: "Erste Bank HU24 1160 0006 0000 0000 4916 1522",
                account: "HU24 1160 0006 0000 0000 4916 1522",
                currency: "USD",
                bank: "Erste Bank",
                owner: "Alexander Sokhanych"
            },
            paymentRef: "",
            forSale: false,
            currency: {
                rate: 1,
                name: "USD",
                _id: "565eab29aeb95fa9c0f9df2d"
            },
            differenceAmount: -250000,
            workflow: "Paid",
            date: "2016-05-22T21:00:00.000Z",
            paidAmount: 250000,
            invoice: {
                _id: "5742f26e7afe352f10c11c3d",
                workflow: {
                    _id: "55647d982e4aa3804a765ecb",
                    sequence: 2,
                    status: "Done",
                    name: "Paid",
                    wId: "Sales Invoice",
                    color: "#2C3E50",
                    __v: 0,
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    wName: "invoice",
                    visible: true
                },
                name: "DD1"
            },
            removable: true
        }
    ];
    var fakeDividendAfterDelete = [
        {
            _id: "574400dd355ba73610d82ec0",
            _type: "dividendInvoicePayment",
            period: null,
            paymentMethod: {
                _id: "565f2e05ab70d49024242e07",
                name: "Erste Bank HU24 1160 0006 0000 0000 4916 1522",
                account: "HU24 1160 0006 0000 0000 4916 1522",
                currency: "USD",
                bank: "Erste Bank",
                owner: "Alexander Sokhanych"
            },
            paymentRef: "",
            forSale: false,
            currency: {
                rate: 1,
                name: "USD",
                _id: "565eab29aeb95fa9c0f9df2d"
            },
            differenceAmount: 0,
            workflow: "Paid",
            date: "2016-05-23T21:00:00.000Z",
            paidAmount: 55500,
            invoice: {
                _id: "574400cf355ba73610d82ebe",
                workflow: {
                    _id: "55647d982e4aa3804a765ecb",
                    sequence: 2,
                    status: "Done",
                    name: "Paid",
                    wId: "Sales Invoice",
                    color: "#2C3E50",
                    __v: 0,
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    wName: "invoice",
                    visible: true
                },
                name: "DD3"
            },
            removable: true
        },
        {
            _id: "574400f9355ba73610d82ec4",
            _type: "dividendInvoicePayment",
            period: null,
            paymentMethod: {
                _id: "565f2e05ab70d49024242e07",
                name: "Erste Bank HU24 1160 0006 0000 0000 4916 1522",
                account: "HU24 1160 0006 0000 0000 4916 1522",
                currency: "USD",
                bank: "Erste Bank",
                owner: "Alexander Sokhanych"
            },
            paymentRef: "",
            forSale: false,
            currency: {
                rate: 1,
                name: "USD",
                _id: "565eab29aeb95fa9c0f9df2d"
            },
            differenceAmount: 0,
            workflow: "Paid",
            date: "2016-05-23T21:00:00.000Z",
            paidAmount: 77700,
            invoice: {
                _id: "574400d3355ba73610d82ebf",
                workflow: {
                    _id: "55647d982e4aa3804a765ecb",
                    sequence: 2,
                    status: "Done",
                    name: "Paid",
                    wId: "Sales Invoice",
                    color: "#2C3E50",
                    __v: 0,
                    source: "purchase",
                    targetSource: [
                        "invoice"
                    ],
                    wName: "invoice",
                    visible: true
                },
                name: "DD4"
            },
            removable: true
        }
    ];

    var view;
    var topBarView;
    var listView;
    var dividendCollection;

    describe('Dividend payment', function () {

        var $fixture;
        var $elFixture;
        before(function(){

        });

        after(function () {
            view.remove();
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

            before(function(){
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function(){
                server.restore();
                mainSpy.restore();
            });

            it('Try to fetch collection with error', function(){
                var dividendUrl = new RegExp('\/payment\/dividend\/list', 'i');

                server.respondWith('GET', dividendUrl, [401, {"Content-Type": "application/json"}, JSON.stringify({})]);
                dividendCollection = new DividendCollection({
                    viewType: 'list',
                    contentType: 'DividendPayments',
                    page: 1,
                    count: 2
                });
                server.respond();
            });

            it('Try to create TopBarView', function(){
                var dividendUrl = new RegExp('\/payment\/dividend\/list', 'i');
                var dividendTotalUrl = new RegExp('\/payment\/dividend\/totalCollectionLength');

                server.respondWith('GET', dividendUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDividend)]);
                server.respondWith('GET', dividendTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                    count: 1
                })]);
                dividendCollection = new DividendCollection({
                    viewType: 'list',
                    contentType: 'DividendPayments',
                    page: 1,
                    count: 2
                });
                server.respond();

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
                    var dividendUrl = new RegExp('\/payment\/dividend\/list', 'i');
                    var dividendTotalUrl = new RegExp('\/payment\/dividend\/totalCollectionLength');

                    server.respondWith('GET', dividendUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDividend)]);
                    server.respondWith('GET', dividendTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 3
                    })]);
                    listView = new ListView({
                        startTime: new Date(),
                        collection: dividendCollection
                    });
                    server.respond();
                    server.respond();
                    clock.tick(300);

                    $thisEl = listView.$el;

                    expect($thisEl.find('#listTable')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);

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

                    dividendCollection.bind('showmore', listView.showMoreContent, listView);
                    
                    done();
                });

                it('Try to delete item with error response', function(){
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(3) > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var dividendUrl = new RegExp('\/payment\/', 'i');
                    var spyResponse;

                    $needCheckBox.click();

                    server.respondWith('DELETE', dividendUrl, [403, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];

                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                    expect(deleteSpy.calledOnce).to.be.true;
                });

                it('Try to delete item', function(){
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var dividendUrl = new RegExp('\/payment\/', 'i');
                    var dividendListUrl = new RegExp('\/payment\/dividend\/list', 'i');
                    var dividendTotalUrl = new RegExp('\/payment\/dividend\/totalCollectionLength');

                    server.respondWith('GET', dividendListUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDividendAfterDelete)]);
                    server.respondWith('GET', dividendTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    server.respondWith('DELETE', dividendUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"success":{"_id":"5742f2d07afe352f10c11c3e","_type":"dividendInvoicePayment","__v":0,"period":null,"paymentMethod":"565f2e05ab70d49024242e07","supplier":null,"paymentRef":"","forSale":false,"editedBy":{"date":"2016-05-23T12:08:48.125Z","user":"52203e707d4dba8813000003"},"createdBy":{"date":"2016-05-23T12:08:48.125Z","user":"52203e707d4dba8813000003"},"groups":{"group":[],"users":[],"owner":"560c099da5d4a2e20ba5068b"},"currency":{"rate":1,"_id":"565eab29aeb95fa9c0f9df2d"},"whoCanRW":"everyOne","differenceAmount":-250000,"workflow":"Paid","name":"PP_1","date":"2016-05-22T21:00:00.000Z","paidAmount":250000,"invoice":"5742f26e7afe352f10c11c3d"}})]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect(deleteSpy.calledTwice).to.be.true;
                });

                it('Try to sort ListView', function(){
                    var $sortBtn = $thisEl.find('th[data-sort="paidAmount"]');
                    var dividendListUrl = new RegExp('\/payment\/dividend\/list', 'i');
                    var dividendTotalUrl = new RegExp('\/payment\/dividend\/totalCollectionLength');

                    server.respondWith('GET', dividendListUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeDividendAfterDelete[1], fakeDividendAfterDelete[0]])]);
                    server.respondWith('GET', dividendTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    $sortBtn.click();
                    server.respond();
                    server.respond();
                    expect(sortSpy.calledOnce).to.be.true;


                    server.respondWith('GET', dividendListUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDividendAfterDelete)]);
                    server.respondWith('GET', dividendTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    $sortBtn.click();
                    server.respond();
                    server.respond();
                    expect(sortSpy.calledTwice).to.be.true;
                });

                it('Try to show more items with error response', function(){
                    mainSpy.reset();

                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a').eq(1);
                    var dividendListUrl = new RegExp('\/payment\/dividend\/list', 'i');
                    var spyResponse;

                    server.respondWith('GET', dividendListUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $needBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some Error.');
                });

                it('Try to show more items', function(){
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a').eq(1);
                    var dividendListUrl = new RegExp('\/payment\/dividend\/list', 'i');
                    var dividendTotalUrl = new RegExp('\/payment\/dividend\/totalCollectionLength');

                    server.respondWith('GET', dividendListUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDividendAfterDelete)]);
                    server.respondWith('GET', dividendTotalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    $needBtn.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);
                });

            });
        });
    });
});